-- Migration 003: Teams, Players, and Directors
-- Players, teams, team directors, documents, and referees

-- Dirigentes (Team Directors)
CREATE TABLE dirigentes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  cedula VARCHAR(20) UNIQUE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Equipos (Teams)
CREATE TABLE equipos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  torneo_id UUID NOT NULL,
  categoria_id UUID NOT NULL,
  dirigente_id UUID,
  color_principal VARCHAR(7), -- Hex color code
  color_secundario VARCHAR(7),
  escudo_url TEXT,
  nivel nivel_enum DEFAULT '3',
  grupo VARCHAR(1), -- 'A', 'B', 'C', 'D'
  numero_equipo INT, -- Number within group
  activo BOOLEAN DEFAULT TRUE,
  retirado BOOLEAN DEFAULT FALSE,
  suspendido BOOLEAN DEFAULT FALSE,
  inasistencias INT DEFAULT 0,
  excluido_por_inasistencias BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (torneo_id) REFERENCES torneos(id) ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
  FOREIGN KEY (dirigente_id) REFERENCES dirigentes(id) ON DELETE SET NULL,
  CONSTRAINT nombre_unique_per_torneo UNIQUE(torneo_id, nombre),
  CONSTRAINT grupo_valid CHECK (grupo IN ('A', 'B', 'C', 'D') OR grupo IS NULL)
);

-- Jugadores (Players)
CREATE TABLE jugadores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipo_id UUID NOT NULL,
  primer_nombre VARCHAR(50) NOT NULL,
  segundo_nombre VARCHAR(50),
  primer_apellido VARCHAR(50) NOT NULL,
  segundo_apellido VARCHAR(50),
  cedula VARCHAR(20),
  numero_dorsal INT,
  posicion VARCHAR(30),
  nivel nivel_enum DEFAULT '3',
  activo BOOLEAN DEFAULT TRUE,
  suspendido BOOLEAN DEFAULT FALSE,
  partidos_suspension_restantes INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
  CONSTRAINT cedula_unique_per_equipo UNIQUE(equipo_id, cedula),
  CONSTRAINT numero_dorsal_unique_per_equipo UNIQUE(equipo_id, numero_dorsal),
  CONSTRAINT numero_dorsal_valid CHECK (numero_dorsal IS NULL OR (numero_dorsal >= 1 AND numero_dorsal <= 99))
);

-- Jugador Documentos (Player Identity Documents)
CREATE TABLE jugador_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jugador_id UUID NOT NULL,
  tipo tipo_documento NOT NULL,
  url TEXT NOT NULL,
  estado estado_documento DEFAULT 'pendiente',
  comentario_rechazo TEXT,
  verificado_por_admin UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (jugador_id) REFERENCES jugadores(id) ON DELETE CASCADE,
  UNIQUE(jugador_id, tipo, estado) -- Only one document per type per state
);

-- Árbitros (Referees)
CREATE TABLE arbitros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(20),
  nivel INT DEFAULT 1,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_equipo_torneo ON equipos(torneo_id);
CREATE INDEX idx_equipo_categoria ON equipos(categoria_id);
CREATE INDEX idx_equipo_dirigente ON equipos(dirigente_id);
CREATE INDEX idx_equipo_grupo ON equipos(grupo, torneo_id);
CREATE INDEX idx_equipo_activo ON equipos(activo);

CREATE INDEX idx_jugador_equipo ON jugadores(equipo_id);
CREATE INDEX idx_jugador_cedula ON jugadores(cedula);
CREATE INDEX idx_jugador_suspendido ON jugadores(suspendido);
CREATE INDEX idx_jugador_activo ON jugadores(activo);

CREATE INDEX idx_documento_jugador ON jugador_documentos(jugador_id);
CREATE INDEX idx_documento_estado ON jugador_documentos(estado);

CREATE INDEX idx_dirigente_email ON dirigentes(email);
CREATE INDEX idx_arbitro_cedula ON arbitros(cedula);

-- Add comments
COMMENT ON TABLE dirigentes IS 'Team directors and managers';
COMMENT ON TABLE equipos IS 'Tournament teams with group assignment and exclusion tracking';
COMMENT ON TABLE jugadores IS 'Players with suspension and eligibility tracking';
COMMENT ON TABLE jugador_documentos IS 'Player identity documents with verification workflow';
COMMENT ON TABLE arbitros IS 'Referees for matches';
