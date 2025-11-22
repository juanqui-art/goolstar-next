-- Migration 008: SQL Functions for Complex Queries
-- Database functions for common aggregations and calculations

-- Function: Get tournament standings table
CREATE OR REPLACE FUNCTION get_tabla_posiciones(p_torneo_id UUID)
RETURNS TABLE (
  equipo_id UUID,
  equipo_nombre VARCHAR,
  logo_url TEXT,
  grupo VARCHAR,
  partidos_jugados INT,
  partidos_ganados INT,
  partidos_empatados INT,
  partidos_perdidos INT,
  goles_favor INT,
  goles_contra INT,
  diferencia_goles INT,
  puntos INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.nombre,
    e.escudo_url,
    e.grupo,
    ee.partidos_jugados,
    ee.partidos_ganados,
    ee.partidos_empatados,
    ee.partidos_perdidos,
    ee.goles_favor,
    ee.goles_contra,
    ee.diferencia_goles,
    ee.puntos
  FROM estadistica_equipo ee
  JOIN equipos e ON ee.equipo_id = e.id
  WHERE ee.torneo_id = p_torneo_id
  ORDER BY
    COALESCE(e.grupo, 'Z') ASC,
    ee.puntos DESC,
    ee.diferencia_goles DESC,
    ee.goles_favor DESC,
    e.nombre ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Calculate team debt (inscription + unpaid fines - paid amounts)
CREATE OR REPLACE FUNCTION calcular_deuda_equipo(p_equipo_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_deuda DECIMAL := 0;
  v_inscripcion DECIMAL := 0;
  v_multas DECIMAL := 0;
  v_pagado DECIMAL := 0;
BEGIN
  -- Get inscription cost for this team's category
  SELECT c.costo_inscripcion
  INTO v_inscripcion
  FROM equipos e
  JOIN categorias c ON e.categoria_id = c.id
  WHERE e.id = p_equipo_id;

  -- Get total unpaid fines
  SELECT COALESCE(SUM(monto_multa), 0)
  INTO v_multas
  FROM tarjetas
  WHERE equipo_id = p_equipo_id
    AND pagada = FALSE;

  -- Get total paid amount
  SELECT COALESCE(SUM(monto), 0)
  INTO v_pagado
  FROM transacciones_pago
  WHERE equipo_id = p_equipo_id
    AND tipo = 'abono_inscripcion'
    AND es_ingreso = TRUE;

  -- Calculate debt: inscription + unpaid fines - paid amounts
  v_deuda := COALESCE(v_inscripcion, 0) + COALESCE(v_multas, 0) - COALESCE(v_pagado, 0);

  RETURN GREATEST(v_deuda, 0); -- Never negative
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Get top goal scorers in a tournament
CREATE OR REPLACE FUNCTION get_jugadores_destacados(p_torneo_id UUID, p_limit INT DEFAULT 10)
RETURNS TABLE (
  jugador_id UUID,
  jugador_nombre VARCHAR,
  equipo_nombre VARCHAR,
  total_goles BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id,
    (j.primer_nombre || ' ' || COALESCE(j.primer_apellido, ''))::VARCHAR,
    e.nombre,
    COUNT(g.id)::BIGINT
  FROM goles g
  JOIN jugadores j ON g.jugador_id = j.id
  JOIN equipos e ON j.equipo_id = e.id
  JOIN partidos p ON g.partido_id = p.id
  WHERE p.torneo_id = p_torneo_id
    AND g.es_propio = FALSE -- Exclude own goals
    AND p.completado = TRUE -- Only completed matches
  GROUP BY j.id, j.primer_nombre, j.primer_apellido, e.nombre
  ORDER BY COUNT(g.id) DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Get team with card summary
CREATE OR REPLACE FUNCTION get_resumen_tarjetas_equipo(p_equipo_id UUID, p_torneo_id UUID DEFAULT NULL)
RETURNS TABLE (
  equipo_id UUID,
  equipo_nombre VARCHAR,
  amarillas_totales INT,
  amarillas_pagadas INT,
  amarillas_pendientes INT,
  rojas_totales INT,
  rojas_pagadas INT,
  rojas_pendientes INT,
  multa_total DECIMAL,
  multa_pagada DECIMAL,
  multa_pendiente DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH card_summary AS (
    SELECT
      t.equipo_id,
      e.nombre,
      COUNT(CASE WHEN t.tipo = 'AMARILLA' THEN 1 END)::INT as amarillas_totales,
      COUNT(CASE WHEN t.tipo = 'AMARILLA' AND t.pagada = TRUE THEN 1 END)::INT as amarillas_pagadas,
      COUNT(CASE WHEN t.tipo = 'ROJA' THEN 1 END)::INT as rojas_totales,
      COUNT(CASE WHEN t.tipo = 'ROJA' AND t.pagada = TRUE THEN 1 END)::INT as rojas_pagadas,
      COALESCE(SUM(CASE WHEN t.pagada = FALSE THEN t.monto_multa ELSE 0 END), 0)::DECIMAL as multa_pendiente,
      COALESCE(SUM(CASE WHEN t.pagada = TRUE THEN t.monto_multa ELSE 0 END), 0)::DECIMAL as multa_pagada
    FROM tarjetas t
    JOIN equipos e ON t.equipo_id = e.id
    WHERE t.equipo_id = p_equipo_id
      AND (p_torneo_id IS NULL OR e.torneo_id = p_torneo_id)
    GROUP BY t.equipo_id, e.nombre
  )
  SELECT
    equipo_id,
    nombre,
    amarillas_totales,
    amarillas_pagadas,
    amarillas_totales - amarillas_pagadas,
    rojas_totales,
    rojas_pagadas,
    rojas_totales - rojas_pagadas,
    multa_pagada + multa_pendiente,
    multa_pagada,
    multa_pendiente
  FROM card_summary;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Get players with suspension status
CREATE OR REPLACE FUNCTION get_jugadores_suspendidos(p_equipo_id UUID)
RETURNS TABLE (
  jugador_id UUID,
  nombre_completo VARCHAR,
  suspendido BOOLEAN,
  partidos_restantes INT,
  razon VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id,
    (j.primer_nombre || ' ' || COALESCE(j.primer_apellido, ''))::VARCHAR,
    j.suspendido,
    j.partidos_suspension_restantes,
    (
      CASE
        WHEN EXISTS (
          SELECT 1 FROM tarjetas t
          WHERE t.jugador_id = j.id
            AND t.tipo = 'ROJA'
            AND t.suspension_cumplida = FALSE
          LIMIT 1
        ) THEN 'Red Card'
        WHEN j.partidos_suspension_restantes > 0 THEN 'Yellow Card Suspension'
        ELSE NULL
      END
    )::VARCHAR
  FROM jugadores j
  WHERE j.equipo_id = p_equipo_id
    AND j.suspendido = TRUE
  ORDER BY j.partidos_suspension_restantes DESC, j.primer_nombre ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Add helpful comments
COMMENT ON FUNCTION get_tabla_posiciones(UUID) IS 'Returns tournament standings sorted by group, points, goal difference';
COMMENT ON FUNCTION calcular_deuda_equipo(UUID) IS 'Calculates team debt: (inscription cost + unpaid fines) - paid amounts';
COMMENT ON FUNCTION get_jugadores_destacados(UUID, INT) IS 'Returns top goal scorers in a tournament';
COMMENT ON FUNCTION get_resumen_tarjetas_equipo(UUID, UUID) IS 'Returns card summary for a team (yellows, reds, fines)';
COMMENT ON FUNCTION get_jugadores_suspendidos(UUID) IS 'Returns list of suspended players on a team';
