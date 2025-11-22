-- Migration 005: Statistics, Standings and Brackets
-- Team standings, knockout bracket structure, best losers, and tournament events

-- Estadística Equipo (Team Standings - AUTO-UPDATED by triggers)
CREATE TABLE estadistica_equipo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneo_id UUID NOT NULL,
  equipo_id UUID NOT NULL,
  partidos_jugados INT DEFAULT 0,
  partidos_ganados INT DEFAULT 0,
  partidos_empatados INT DEFAULT 0,
  partidos_perdidos INT DEFAULT 0,
  goles_favor INT DEFAULT 0,
  goles_contra INT DEFAULT 0,
  diferencia_goles INT DEFAULT 0,
  puntos INT DEFAULT 0,
  amarillas_totales INT DEFAULT 0,
  rojas_totales INT DEFAULT 0,
  amarillas_pagadas INT DEFAULT 0,
  rojas_pagadas INT DEFAULT 0,
  ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (torneo_id) REFERENCES torneos(id) ON DELETE CASCADE,
  FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
  UNIQUE(torneo_id, equipo_id)
);

-- Llaves Eliminatorias (Knockout Bracket Matchups)
CREATE TABLE llaves_eliminatorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fase_id UUID NOT NULL,
  numero_llave INT NOT NULL, -- 1, 2, 3, 4... (bracket seed)
  equipo_1_id UUID,
  equipo_2_id UUID,
  resultado_equipo_ganador UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fase_id) REFERENCES fases_eliminatorias(id) ON DELETE CASCADE,
  FOREIGN KEY (equipo_1_id) REFERENCES equipos(id) ON DELETE SET NULL,
  FOREIGN KEY (equipo_2_id) REFERENCES equipos(id) ON DELETE SET NULL,
  FOREIGN KEY (resultado_equipo_ganador) REFERENCES equipos(id) ON DELETE SET NULL,
  UNIQUE(fase_id, numero_llave)
);

-- Mejores Perdedores (Best Losing Teams for Playoff Advancement)
CREATE TABLE mejores_perdedores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneo_id UUID NOT NULL,
  equipo_id UUID NOT NULL,
  grupo VARCHAR(1) NOT NULL,
  posicion INT NOT NULL, -- Runner-up position in group
  puntos INT NOT NULL,
  diferencia_goles INT NOT NULL,
  goles_a_favor INT NOT NULL,
  ranking_general INT, -- Overall ranking among best losers
  avanza BOOLEAN DEFAULT FALSE, -- Whether they advance to knockout
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (torneo_id) REFERENCES torneos(id) ON DELETE CASCADE,
  FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
  UNIQUE(torneo_id, equipo_id)
);

-- Eventos Torneo (Tournament Timeline Events)
CREATE TABLE eventos_torneo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneo_id UUID NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'inicio_inscripcion', 'cierre_inscripcion', 'inicio_grupos', etc.
  descripcion TEXT,
  fecha TIMESTAMP WITH TIME ZONE,
  creado_por_admin UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (torneo_id) REFERENCES torneos(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_estadistica_torneo ON estadistica_equipo(torneo_id);
CREATE INDEX idx_estadistica_equipo ON estadistica_equipo(equipo_id);
CREATE INDEX idx_estadistica_puntos ON estadistica_equipo(puntos DESC, diferencia_goles DESC);
CREATE INDEX idx_estadistica_goles ON estadistica_equipo(goles_favor DESC);

CREATE INDEX idx_llave_fase ON llaves_eliminatorias(fase_id);
CREATE INDEX idx_llave_equipo_1 ON llaves_eliminatorias(equipo_1_id);
CREATE INDEX idx_llave_equipo_2 ON llaves_eliminatorias(equipo_2_id);
CREATE INDEX idx_llave_ganador ON llaves_eliminatorias(resultado_equipo_ganador);

CREATE INDEX idx_mejores_perdedores_torneo ON mejores_perdedores(torneo_id);
CREATE INDEX idx_mejores_perdedores_equipo ON mejores_perdedores(equipo_id);
CREATE INDEX idx_mejores_perdedores_ranking ON mejores_perdedores(ranking_general);

CREATE INDEX idx_evento_torneo ON eventos_torneo(torneo_id);
CREATE INDEX idx_evento_tipo ON eventos_torneo(tipo);
CREATE INDEX idx_evento_fecha ON eventos_torneo(fecha);

-- Add comments
COMMENT ON TABLE estadistica_equipo IS 'Team standings - AUTO-UPDATED by triggers on match completion';
COMMENT ON TABLE llaves_eliminatorias IS 'Knockout phase bracket structure with matchups';
COMMENT ON TABLE mejores_perdedores IS 'Best losing teams for playoff advancement';
COMMENT ON TABLE eventos_torneo IS 'Tournament timeline and significant events';
