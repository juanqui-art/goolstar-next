-- Migration 010: Performance Indexes
-- Comprehensive indexing strategy for query optimization

-- ============================================
-- CATEGORIAS - Already indexed
-- ============================================
-- No additional indexes needed beyond migration 002

-- ============================================
-- TORNEOS - Already indexed
-- ============================================
-- No additional indexes needed beyond migration 002

-- ============================================
-- FASES_ELIMINATORIAS - Already indexed
-- ============================================
-- No additional indexes needed beyond migration 002

-- ============================================
-- JORNADAS - Already indexed
-- ============================================
-- No additional indexes needed beyond migration 002

-- ============================================
-- DIRIGENTES - Basic indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_dirigente_activo ON dirigentes(activo);
CREATE INDEX IF NOT EXISTS idx_dirigente_telefono ON dirigentes(telefono);

-- ============================================
-- EQUIPOS - Already indexed in migration 003
-- ============================================
-- Additional performance indexes:
CREATE INDEX IF NOT EXISTS idx_equipo_suspendido ON equipos(suspendido);
CREATE INDEX IF NOT EXISTS idx_equipo_retirado ON equipos(retirado);

-- ============================================
-- JUGADORES - Already indexed in migration 003
-- ============================================
-- Additional performance indexes:
CREATE INDEX IF NOT EXISTS idx_jugador_posicion ON jugadores(posicion);
CREATE INDEX IF NOT EXISTS idx_jugador_nivel ON jugadores(nivel);
CREATE INDEX IF NOT EXISTS idx_jugador_dorsal ON jugadores(numero_dorsal);

-- ============================================
-- JUGADOR_DOCUMENTOS - Already indexed in migration 003
-- ============================================
-- Additional indexes for verification workflow:
CREATE INDEX IF NOT EXISTS idx_documento_tipo_estado ON jugador_documentos(tipo, estado);
CREATE INDEX IF NOT EXISTS idx_documento_rechazado ON jugador_documentos(estado) WHERE estado = 'rechazado';

-- ============================================
-- ARBITROS - Already indexed
-- ============================================
-- No additional indexes needed

-- ============================================
-- PARTIDOS - CRITICAL PERFORMANCE INDEXES
-- ============================================
-- These are the most frequently queried tables

-- By date (for match listings and filtering)
CREATE INDEX IF NOT EXISTS idx_partido_fecha_desc ON partidos(fecha DESC NULLS LAST);

-- Tournament queries (most common filter)
CREATE INDEX IF NOT EXISTS idx_partido_torneo_completado ON partidos(torneo_id, completado);

-- Match filtering
CREATE INDEX IF NOT EXISTS idx_partido_arbitro ON partidos(arbitro_id);
CREATE INDEX IF NOT EXISTS idx_partido_jornada_completado ON partidos(jornada_id, completado);
CREATE INDEX IF NOT EXISTS idx_partido_fase_completado ON partidos(fase_eliminatoria_id, completado);

-- Team-specific queries
CREATE INDEX IF NOT EXISTS idx_partido_equipo_1_torneo ON partidos(equipo_1_id, torneo_id);
CREATE INDEX IF NOT EXISTS idx_partido_equipo_2_torneo ON partidos(equipo_2_id, torneo_id);

-- ============================================
-- GOLES - Already indexed in migration 004
-- ============================================
-- Additional indexes:
CREATE INDEX IF NOT EXISTS idx_gol_no_propio ON goles(es_propio) WHERE es_propio = FALSE;
CREATE INDEX IF NOT EXISTS idx_gol_minuto ON goles(minuto);

-- ============================================
-- TARJETAS - CRITICAL INDEXES
-- ============================================
-- These are frequently used for suspensions and fines

-- Player-centric queries (checking suspensions, fines)
CREATE INDEX IF NOT EXISTS idx_tarjeta_jugador_pagada ON tarjetas(jugador_id, pagada);
CREATE INDEX IF NOT EXISTS idx_tarjeta_jugador_tipo ON tarjetas(jugador_id, tipo);

-- Equipo-centric queries (team card summary)
CREATE INDEX IF NOT EXISTS idx_tarjeta_equipo_pagada ON tarjetas(equipo_id, pagada);
CREATE INDEX IF NOT EXISTS idx_tarjeta_equipo_tipo ON tarjetas(equipo_id, tipo);

-- Fines tracking
CREATE INDEX IF NOT EXISTS idx_tarjeta_monto_multa ON tarjetas(monto_multa) WHERE monto_multa > 0;

-- ============================================
-- CAMBIOS_JUGADOR - Already indexed in migration 004
-- ============================================
-- Additional indexes:
CREATE INDEX IF NOT EXISTS idx_cambio_jugador_entra ON cambios_jugador(jugador_entra_id);
CREATE INDEX IF NOT EXISTS idx_cambio_minuto ON cambios_jugador(minuto);

-- ============================================
-- PARTICIPACION_JUGADOR - Already indexed in migration 004
-- ============================================
-- Additional indexes:
CREATE INDEX IF NOT EXISTS idx_participacion_titular ON participacion_jugador(es_titular) WHERE es_titular = TRUE;
CREATE INDEX IF NOT EXISTS idx_participacion_minutos ON participacion_jugador(minutos_jugados) WHERE minutos_jugados > 0;

-- ============================================
-- EVENTOS_PARTIDO - Already indexed in migration 004
-- ============================================
-- No additional indexes needed

-- ============================================
-- ESTADISTICA_EQUIPO - CRITICAL INDEXES
-- ============================================
-- Used for standings/rankings queries frequently

-- Sorting queries (standings)
CREATE INDEX IF NOT EXISTS idx_estadistica_puntos_orden ON estadistica_equipo(
  puntos DESC,
  diferencia_goles DESC,
  goles_favor DESC
);

-- Quick lookup
CREATE INDEX IF NOT EXISTS idx_estadistica_equipo_torneo ON estadistica_equipo(equipo_id, torneo_id);

-- Card tracking
CREATE INDEX IF NOT EXISTS idx_estadistica_tarjetas ON estadistica_equipo(
  rojas_totales DESC,
  amarillas_totales DESC
);

-- ============================================
-- LLAVES_ELIMINATORIAS - Already indexed in migration 005
-- ============================================
-- Additional indexes:
CREATE INDEX IF NOT EXISTS idx_llave_resultado ON llaves_eliminatorias(resultado_equipo_ganador)
  WHERE resultado_equipo_ganador IS NOT NULL;

-- ============================================
-- MEJORES_PERDEDORES - Already indexed in migration 005
-- ============================================
-- Additional indexes:
CREATE INDEX IF NOT EXISTS idx_mejores_avanza ON mejores_perdedores(avanza) WHERE avanza = TRUE;
CREATE INDEX IF NOT EXISTS idx_mejores_ranking_orden ON mejores_perdedores(
  torneo_id,
  ranking_general
);

-- ============================================
-- EVENTOS_TORNEO - Already indexed in migration 005
-- ============================================
-- No additional indexes needed

-- ============================================
-- TRANSACCIONES_PAGO - CRITICAL INDEXES
-- ============================================
-- Financial queries can be heavy

-- Balance/debt calculations
CREATE INDEX IF NOT EXISTS idx_transaccion_equipo_tipo ON transacciones_pago(equipo_id, tipo);
CREATE INDEX IF NOT EXISTS idx_transaccion_equipo_es_ingreso ON transacciones_pago(
  equipo_id,
  es_ingreso
);

-- Fine tracking (multas)
CREATE INDEX IF NOT EXISTS idx_transaccion_multa ON transacciones_pago(tipo)
  WHERE tipo IN ('multa_amarilla', 'multa_roja');

-- Pending payments
CREATE INDEX IF NOT EXISTS idx_transaccion_pendiente ON transacciones_pago(
  equipo_id,
  pagado
) WHERE pagado = FALSE;

-- Date range queries
CREATE INDEX IF NOT EXISTS idx_transaccion_fecha_range ON transacciones_pago(
  torneo_id,
  created_at DESC
);

-- ============================================
-- PAGOS_ARBITRO - Already indexed in migration 006
-- ============================================
-- Additional indexes:
CREATE INDEX IF NOT EXISTS idx_pago_arbitro_pendiente ON pagos_arbitro(pagado) WHERE pagado = FALSE;

-- ============================================
-- ANALYZER: Show current index usage
-- ============================================
-- To check index usage, run:
-- SELECT schemaname, tablename, indexname
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- ORDER BY tablename, indexname;

-- Add helpful comments
COMMENT ON INDEX idx_partido_torneo_fecha ON partidos IS 'Critical: Tournament match filtering and date sorting';
COMMENT ON INDEX idx_tarjeta_jugador_pagada ON tarjetas IS 'Critical: Player suspension and fine queries';
COMMENT ON INDEX idx_estadistica_puntos_orden ON estadistica_equipo IS 'Critical: Standings/rankings queries';
COMMENT ON INDEX idx_transaccion_equipo_tipo ON transacciones_pago IS 'Critical: Financial reporting queries';
