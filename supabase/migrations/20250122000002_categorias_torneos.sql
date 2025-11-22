-- Migration 002: Categorías, Torneos, Fases y Jornadas
-- Base tournament setup with categories, tournaments, and match scheduling

-- Categorías de torneos
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,
  costo_inscripcion DECIMAL(10,2) DEFAULT 500.00,
  multa_amarilla DECIMAL(10,2) DEFAULT 2.00,
  multa_roja DECIMAL(10,2) DEFAULT 3.00,
  limite_amarillas INT DEFAULT 3,
  suspension_roja_partidos INT DEFAULT 2,
  limite_inasistencias INT DEFAULT 3,
  pago_arbitro DECIMAL(10,2) DEFAULT 10.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT costo_inscripcion_positive CHECK (costo_inscripcion >= 0),
  CONSTRAINT multa_amarilla_positive CHECK (multa_amarilla >= 0),
  CONSTRAINT multa_roja_positive CHECK (multa_roja >= 0),
  CONSTRAINT limite_amarillas_positive CHECK (limite_amarillas > 0),
  CONSTRAINT suspension_roja_positive CHECK (suspension_roja_partidos > 0),
  CONSTRAINT limite_inasistencias_positive CHECK (limite_inasistencias > 0)
);

-- Torneos
CREATE TABLE torneos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  categoria_id UUID NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  fase_actual fase_torneo DEFAULT 'inscripcion',
  tiene_fase_grupos BOOLEAN DEFAULT TRUE,
  tiene_eliminacion_directa BOOLEAN DEFAULT TRUE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
  CONSTRAINT fecha_fin_after_inicio CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

-- Fases Eliminatorias (Knockout bracket structure)
CREATE TABLE fases_eliminatorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneo_id UUID NOT NULL,
  nombre VARCHAR(50) NOT NULL, -- 'Octavos', 'Cuartos', 'Semifinales', 'Final'
  numero_equipos INT NOT NULL,
  numero_ganadores INT NOT NULL,
  orden INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (torneo_id) REFERENCES torneos(id) ON DELETE CASCADE,
  CONSTRAINT numero_equipos_positive CHECK (numero_equipos > 0),
  CONSTRAINT numero_ganadores_positive CHECK (numero_ganadores > 0),
  CONSTRAINT numero_ganadores_less_than_equipos CHECK (numero_ganadores < numero_equipos),
  UNIQUE(torneo_id, nombre)
);

-- Jornadas (Match days in group phase)
CREATE TABLE jornadas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneo_id UUID NOT NULL,
  numero INT NOT NULL,
  fecha_prevista DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (torneo_id) REFERENCES torneos(id) ON DELETE CASCADE,
  UNIQUE(torneo_id, numero)
);

-- Create indexes for performance
CREATE INDEX idx_categoria_activa ON categorias(nombre);
CREATE INDEX idx_torneo_categoria ON torneos(categoria_id);
CREATE INDEX idx_torneo_activo ON torneos(activo);
CREATE INDEX idx_torneo_fecha ON torneos(fecha_inicio, fecha_fin);
CREATE INDEX idx_fase_torneo ON fases_eliminatorias(torneo_id);
CREATE INDEX idx_jornada_torneo ON jornadas(torneo_id);

-- Add comments
COMMENT ON TABLE categorias IS 'Tournament categories with pricing and rules configuration';
COMMENT ON TABLE torneos IS 'Tournaments with phase management and scheduling';
COMMENT ON TABLE fases_eliminatorias IS 'Knockout phases (Octavos, Cuartos, Semifinales, Final)';
COMMENT ON TABLE jornadas IS 'Match days in group phase tournaments';
