-- Migration 007: Database Triggers
-- Automated database operations for statistics, suspensions, timestamps

-- Function: Update timestamp on any table update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update updated_at on categorias
CREATE TRIGGER categorias_update_timestamp
BEFORE UPDATE ON categorias
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update updated_at on torneos
CREATE TRIGGER torneos_update_timestamp
BEFORE UPDATE ON torneos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update updated_at on equipos
CREATE TRIGGER equipos_update_timestamp
BEFORE UPDATE ON equipos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update updated_at on jugadores
CREATE TRIGGER jugadores_update_timestamp
BEFORE UPDATE ON jugadores
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function: Create statistics record when team is created
CREATE OR REPLACE FUNCTION crear_estadistica_equipo()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO estadistica_equipo (torneo_id, equipo_id)
  VALUES (NEW.torneo_id, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Create stats record on team creation
CREATE TRIGGER equipos_crear_estadistica
AFTER INSERT ON equipos
FOR EACH ROW
EXECUTE FUNCTION crear_estadistica_equipo();

-- Function: Auto-update standings when match is completed
CREATE OR REPLACE FUNCTION actualizar_estadisticas_partido()
RETURNS TRIGGER AS $$
DECLARE
  v_goles_eq1 INT;
  v_goles_eq2 INT;
  v_puntos_eq1 INT := 0;
  v_puntos_eq2 INT := 0;
BEGIN
  -- Only update if match just became completed
  IF NEW.completado = TRUE AND (OLD.completado = FALSE OR OLD IS NULL) THEN
    v_goles_eq1 := COALESCE(NEW.goles_equipo_1, 0);
    v_goles_eq2 := COALESCE(NEW.goles_equipo_2, 0);

    -- Determine points
    IF v_goles_eq1 > v_goles_eq2 THEN
      v_puntos_eq1 := 3;
      v_puntos_eq2 := 0;
    ELSIF v_goles_eq2 > v_goles_eq1 THEN
      v_puntos_eq1 := 0;
      v_puntos_eq2 := 3;
    ELSE
      v_puntos_eq1 := 1;
      v_puntos_eq2 := 1;
    END IF;

    -- Update team 1 statistics
    UPDATE estadistica_equipo
    SET
      partidos_jugados = partidos_jugados + 1,
      partidos_ganados = CASE WHEN v_puntos_eq1 = 3 THEN partidos_ganados + 1 ELSE partidos_ganados END,
      partidos_empatados = CASE WHEN v_puntos_eq1 = 1 THEN partidos_empatados + 1 ELSE partidos_empatados END,
      partidos_perdidos = CASE WHEN v_puntos_eq1 = 0 AND v_goles_eq1 < v_goles_eq2 THEN partidos_perdidos + 1 ELSE partidos_perdidos END,
      goles_favor = goles_favor + v_goles_eq1,
      goles_contra = goles_contra + v_goles_eq2,
      diferencia_goles = goles_favor - goles_contra + v_goles_eq1 - v_goles_eq2,
      puntos = puntos + v_puntos_eq1,
      ultima_actualizacion = CURRENT_TIMESTAMP
    WHERE equipo_id = NEW.equipo_1_id AND torneo_id = NEW.torneo_id;

    -- Update team 2 statistics
    UPDATE estadistica_equipo
    SET
      partidos_jugados = partidos_jugados + 1,
      partidos_ganados = CASE WHEN v_puntos_eq2 = 3 THEN partidos_ganados + 1 ELSE partidos_ganados END,
      partidos_empatados = CASE WHEN v_puntos_eq2 = 1 THEN partidos_empatados + 1 ELSE partidos_empatados END,
      partidos_perdidos = CASE WHEN v_puntos_eq2 = 0 AND v_goles_eq2 < v_goles_eq1 THEN partidos_perdidos + 1 ELSE partidos_perdidos END,
      goles_favor = goles_favor + v_goles_eq2,
      goles_contra = goles_contra + v_goles_eq1,
      diferencia_goles = goles_favor - goles_contra + v_goles_eq2 - v_goles_eq1,
      puntos = puntos + v_puntos_eq2,
      ultima_actualizacion = CURRENT_TIMESTAMP
    WHERE equipo_id = NEW.equipo_2_id AND torneo_id = NEW.torneo_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update standings on match completion
CREATE TRIGGER partidos_actualizar_estadisticas
AFTER UPDATE ON partidos
FOR EACH ROW
EXECUTE FUNCTION actualizar_estadisticas_partido();

-- Function: Suspend player on red card
CREATE OR REPLACE FUNCTION suspender_por_tarjeta_roja()
RETURNS TRIGGER AS $$
DECLARE
  v_categoria_id UUID;
  v_suspension_partidos INT;
BEGIN
  -- Only for red cards
  IF NEW.tipo = 'ROJA' THEN
    -- Get category to find suspension length
    SELECT c.suspension_roja_partidos
    INTO v_suspension_partidos
    FROM jugadores j
    JOIN equipos e ON j.equipo_id = e.id
    JOIN categorias c ON e.categoria_id = c.id
    WHERE j.id = NEW.jugador_id;

    -- Suspend player
    UPDATE jugadores
    SET
      suspendido = TRUE,
      partidos_suspension_restantes = COALESCE(v_suspension_partidos, 2)
    WHERE id = NEW.jugador_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Suspend on red card
CREATE TRIGGER tarjetas_suspender_por_roja
AFTER INSERT ON tarjetas
FOR EACH ROW
EXECUTE FUNCTION suspender_por_tarjeta_roja();

-- Function: Verify yellow card accumulation
CREATE OR REPLACE FUNCTION verificar_amarillas_acumuladas()
RETURNS TRIGGER AS $$
DECLARE
  v_categoria_id UUID;
  v_limite_amarillas INT;
  v_amarillas_count INT;
BEGIN
  -- Only for yellow cards
  IF NEW.tipo = 'AMARILLA' THEN
    -- Get category limit
    SELECT c.limite_amarillas
    INTO v_limite_amarillas
    FROM jugadores j
    JOIN equipos e ON j.equipo_id = e.id
    JOIN categorias c ON e.categoria_id = c.id
    WHERE j.id = NEW.jugador_id;

    -- Count unserved yellows
    SELECT COUNT(*)
    INTO v_amarillas_count
    FROM tarjetas
    WHERE jugador_id = NEW.jugador_id
      AND tipo = 'AMARILLA'
      AND suspension_cumplida = FALSE;

    -- If limit reached, suspend for 1 match
    IF v_amarillas_count >= COALESCE(v_limite_amarillas, 3) THEN
      UPDATE jugadores
      SET
        suspendido = TRUE,
        partidos_suspension_restantes = 1
      WHERE id = NEW.jugador_id;

      -- Mark all yellows as suspension served
      UPDATE tarjetas
      SET suspension_cumplida = TRUE
      WHERE jugador_id = NEW.jugador_id
        AND tipo = 'AMARILLA';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Check yellow card accumulation
CREATE TRIGGER tarjetas_verificar_amarillas
AFTER INSERT ON tarjetas
FOR EACH ROW
EXECUTE FUNCTION verificar_amarillas_acumuladas();

-- Function: Increment team absences on match completion
CREATE OR REPLACE FUNCTION registrar_inasistencia()
RETURNS TRIGGER AS $$
BEGIN
  -- If match completed with absence/walkover
  IF NEW.completado = TRUE AND (OLD.completado = FALSE OR OLD IS NULL) THEN
    -- Check for resultado_inasistencia or resultado_retiro
    IF NEW.resultado_inasistencia IS NOT NULL THEN
      UPDATE equipos
      SET inasistencias = inasistencias + 1
      WHERE id = (
        CASE
          WHEN NEW.resultado_inasistencia = 'equipo_1' THEN NEW.equipo_1_id
          WHEN NEW.resultado_inasistencia = 'equipo_2' THEN NEW.equipo_2_id
        END
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Track absences
CREATE TRIGGER partidos_registrar_inasistencia
AFTER UPDATE ON partidos
FOR EACH ROW
EXECUTE FUNCTION registrar_inasistencia();

-- Add helpful comments
COMMENT ON FUNCTION actualizar_estadisticas_partido() IS 'Auto-updates team standings when match is completed';
COMMENT ON FUNCTION suspender_por_tarjeta_roja() IS 'Automatically suspends player when they receive a red card';
COMMENT ON FUNCTION verificar_amarillas_acumuladas() IS 'Checks if yellow card count exceeds category limit and suspends if needed';
COMMENT ON FUNCTION crear_estadistica_equipo() IS 'Creates initial statistics record when team is created';
