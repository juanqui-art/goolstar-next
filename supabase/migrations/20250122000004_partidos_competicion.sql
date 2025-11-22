-- Migration 004: Matches, Goals, Cards, Substitutions and Events
-- Complete match data with goals, cards, substitutions, and event tracking

-- Partidos (Matches)
CREATE TABLE partidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneo_id UUID NOT NULL,
  equipo_1_id UUID NOT NULL,
  equipo_2_id UUID NOT NULL,
  jornada_id UUID, -- For group phase matches
  fase_eliminatoria_id UUID, -- For knockout matches
  arbitro_id UUID,
  fecha TIMESTAMP WITH TIME ZONE,
  cancha VARCHAR(100),
  goles_equipo_1 INT DEFAULT 0,
  goles_equipo_2 INT DEFAULT 0,
  completado BOOLEAN DEFAULT FALSE,
  resultado_retiro VARCHAR(50), -- 'equipo_1', 'equipo_2', null if completed
  resultado_inasistencia VARCHAR(50), -- Team that didn't show
  sancion VARCHAR(50), -- 'equipo_1', 'equipo_2', null if normal result
  penales_equipo_1 INT, -- For knockout matches
  penales_equipo_2 INT, -- For knockout matches
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (torneo_id) REFERENCES torneos(id) ON DELETE CASCADE,
  FOREIGN KEY (equipo_1_id) REFERENCES equipos(id) ON DELETE CASCADE,
  FOREIGN KEY (equipo_2_id) REFERENCES equipos(id) ON DELETE CASCADE,
  FOREIGN KEY (jornada_id) REFERENCES jornadas(id) ON DELETE CASCADE,
  FOREIGN KEY (fase_eliminatoria_id) REFERENCES fases_eliminatorias(id) ON DELETE CASCADE,
  FOREIGN KEY (arbitro_id) REFERENCES arbitros(id) ON DELETE SET NULL,
  CONSTRAINT equipos_diferentes CHECK (equipo_1_id != equipo_2_id),
  CONSTRAINT goles_positive CHECK (goles_equipo_1 >= 0 AND goles_equipo_2 >= 0),
  CONSTRAINT jornada_xor_fase CHECK (
    (jornada_id IS NOT NULL AND fase_eliminatoria_id IS NULL) OR
    (jornada_id IS NULL AND fase_eliminatoria_id IS NOT NULL) OR
    (jornada_id IS NULL AND fase_eliminatoria_id IS NULL)
  )
);

-- Goles (Goals)
CREATE TABLE goles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID NOT NULL,
  jugador_id UUID,
  equipo_id UUID NOT NULL,
  minuto INT NOT NULL,
  es_propio BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partido_id) REFERENCES partidos(id) ON DELETE CASCADE,
  FOREIGN KEY (jugador_id) REFERENCES jugadores(id) ON DELETE SET NULL,
  FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
  CONSTRAINT minuto_valid CHECK (minuto >= 0 AND minuto <= 120)
);

-- Tarjetas (Yellow and Red Cards)
CREATE TABLE tarjetas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID NOT NULL,
  jugador_id UUID NOT NULL,
  equipo_id UUID NOT NULL,
  tipo tipo_tarjeta NOT NULL,
  minuto INT NOT NULL,
  razon VARCHAR(255),
  pagada BOOLEAN DEFAULT FALSE,
  monto_multa DECIMAL(10,2),
  suspension_cumplida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partido_id) REFERENCES partidos(id) ON DELETE CASCADE,
  FOREIGN KEY (jugador_id) REFERENCES jugadores(id) ON DELETE CASCADE,
  FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
  CONSTRAINT minuto_valid CHECK (minuto >= 0 AND minuto <= 120)
);

-- Cambios Jugador (Substitutions)
CREATE TABLE cambios_jugador (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID NOT NULL,
  jugador_sale_id UUID NOT NULL,
  jugador_entra_id UUID NOT NULL,
  equipo_id UUID NOT NULL,
  minuto INT NOT NULL,
  razon VARCHAR(50), -- 'substitution', 'injury', 'red_card'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partido_id) REFERENCES partidos(id) ON DELETE CASCADE,
  FOREIGN KEY (jugador_sale_id) REFERENCES jugadores(id) ON DELETE CASCADE,
  FOREIGN KEY (jugador_entra_id) REFERENCES jugadores(id) ON DELETE CASCADE,
  FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
  CONSTRAINT minuto_valid CHECK (minuto >= 0 AND minuto <= 120),
  CONSTRAINT jugadores_diferentes CHECK (jugador_sale_id != jugador_entra_id)
);

-- Participación Jugador (Player Participation in Match)
CREATE TABLE participacion_jugador (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID NOT NULL,
  jugador_id UUID NOT NULL,
  equipo_id UUID NOT NULL,
  es_titular BOOLEAN DEFAULT FALSE,
  minutos_jugados INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partido_id) REFERENCES partidos(id) ON DELETE CASCADE,
  FOREIGN KEY (jugador_id) REFERENCES jugadores(id) ON DELETE CASCADE,
  FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
  UNIQUE(partido_id, jugador_id)
);

-- Eventos Partido (Significant Match Events)
CREATE TABLE eventos_partido (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'SUSPENSION', 'GRESCA', 'INVASION', 'ABANDONO', 'DIFERENCIA_8'
  descripcion TEXT,
  minuto INT,
  equipo_afectada_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partido_id) REFERENCES partidos(id) ON DELETE CASCADE,
  FOREIGN KEY (equipo_afectada_id) REFERENCES equipos(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX idx_partido_fecha ON partidos(fecha);
CREATE INDEX idx_partido_torneo ON partidos(torneo_id);
CREATE INDEX idx_partido_torneo_fecha ON partidos(torneo_id, fecha);
CREATE INDEX idx_partido_completado ON partidos(completado);
CREATE INDEX idx_partido_jornada ON partidos(jornada_id);
CREATE INDEX idx_partido_fase ON partidos(fase_eliminatoria_id);
CREATE INDEX idx_partido_equipo_1 ON partidos(equipo_1_id);
CREATE INDEX idx_partido_equipo_2 ON partidos(equipo_2_id);

CREATE INDEX idx_gol_partido ON goles(partido_id);
CREATE INDEX idx_gol_jugador ON goles(jugador_id);
CREATE INDEX idx_gol_equipo ON goles(equipo_id);

CREATE INDEX idx_tarjeta_jugador ON tarjetas(jugador_id);
CREATE INDEX idx_tarjeta_partido ON tarjetas(partido_id);
CREATE INDEX idx_tarjeta_pagada ON tarjetas(jugador_id, pagada);
CREATE INDEX idx_tarjeta_tipo ON tarjetas(tipo);

CREATE INDEX idx_cambio_partido ON cambios_jugador(partido_id);
CREATE INDEX idx_cambio_equipo ON cambios_jugador(equipo_id);

CREATE INDEX idx_participacion_partido ON participacion_jugador(partido_id);
CREATE INDEX idx_participacion_jugador ON participacion_jugador(jugador_id);

CREATE INDEX idx_evento_partido ON eventos_partido(partido_id);
CREATE INDEX idx_evento_tipo ON eventos_partido(tipo);

-- Add comments
COMMENT ON TABLE partidos IS 'Match records with results, default victories, and penalty tracking';
COMMENT ON TABLE goles IS 'Goals scored in matches';
COMMENT ON TABLE tarjetas IS 'Yellow and red cards with payment tracking';
COMMENT ON TABLE cambios_jugador IS 'Player substitutions during matches';
COMMENT ON TABLE participacion_jugador IS 'Player participation record in matches';
COMMENT ON TABLE eventos_partido IS 'Significant match events (suspensions, fights, abandonment, etc.)';
