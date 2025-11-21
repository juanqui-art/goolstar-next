# Database Schema

Complete PostgreSQL schema for GoolStar tournament management system.

## Overview

The database uses PostgreSQL with ~15 tables organized into logical groups:
- **Categories & Tournaments**: `categorias`, `torneos`, `fases_eliminatorias`, `jornadas`
- **Participants**: `dirigentes`, `equipos`, `jugadores`, `jugador_documentos`, `arbitros`
- **Matches**: `partidos`, `goles`, `tarjetas`, `cambios_jugador`, `participacion_jugador`, `eventos_partido`
- **Statistics**: `estadistica_equipo`, `llaves_eliminatorias`, `mejores_perdedores`
- **Financial**: `transacciones_pago`, `pagos_arbitro`

All tables include proper constraints, indexes, and relationships for data integrity.

---

## Table Definitions

### 1. CATEGORIAS

Tournament categories with pricing and rule configuration.

```sql
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,

  -- Prize distribution
  premio_primero DECIMAL(8,2) CHECK (premio_primero >= 0),
  premio_segundo DECIMAL(8,2) CHECK (premio_segundo >= 0),
  premio_tercero DECIMAL(8,2) CHECK (premio_tercero >= 0),
  premio_cuarto DECIMAL(8,2) CHECK (premio_cuarto >= 0),

  -- Registration and costs
  costo_inscripcion DECIMAL(8,2) CHECK (costo_inscripcion >= 0),
  costo_arbitraje DECIMAL(6,2) DEFAULT 10.00 CHECK (costo_arbitraje >= 0),

  -- Fines
  multa_amarilla DECIMAL(6,2) DEFAULT 2.00 CHECK (multa_amarilla >= 0),
  multa_roja DECIMAL(6,2) DEFAULT 3.00 CHECK (multa_roja >= 0),

  -- Rules (category-specific)
  limite_inasistencias SMALLINT DEFAULT 3,
  limite_amarillas_suspension SMALLINT DEFAULT 3,
  partidos_suspension_roja SMALLINT DEFAULT 2,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Examples:**
- VARONES (Men's tournament)
- DAMAS (Women's tournament)
- MÁSTER (35+ age group)

---

### 2. TORNEOS

Tournaments with phase management (group stage → knockout).

```sql
CREATE TABLE torneos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,

  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,

  activo BOOLEAN DEFAULT true,
  finalizado BOOLEAN DEFAULT false,

  -- Format configuration
  tiene_fase_grupos BOOLEAN DEFAULT true,
  tiene_eliminacion_directa BOOLEAN DEFAULT true,
  numero_grupos SMALLINT DEFAULT 2,
  equipos_clasifican_por_grupo SMALLINT DEFAULT 2,

  -- Current phase
  fase_actual VARCHAR(20) DEFAULT 'inscripcion' CHECK (
    fase_actual IN (
      'inscripcion', 'grupos', 'octavos', 'cuartos',
      'semifinales', 'final', 'finalizado'
    )
  ),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_torneo_categoria ON torneos(categoria_id);
CREATE INDEX idx_torneo_activo ON torneos(activo);
CREATE INDEX idx_torneo_fecha ON torneos(fecha_inicio, fecha_fin);
```

**Phases:** inscripcion → grupos → octavos → cuartos → semifinales → final → finalizado

---

### 3. FASES_ELIMINATORIAS

Knockout tournament phases.

```sql
CREATE TABLE fases_eliminatorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,

  nombre VARCHAR(50) NOT NULL,  -- "Octavos", "Cuartos", etc.
  orden SMALLINT NOT NULL,       -- 1, 2, 3... for sequencing

  fecha_inicio DATE,
  fecha_fin DATE,

  completada BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(torneo_id, orden)
);
```

---

### 4. JORNADAS

Match days/rounds in group phase.

```sql
CREATE TABLE jornadas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(50) UNIQUE NOT NULL,    -- "Jornada 1", "Jornada 2"
  numero INTEGER NOT NULL,
  fecha DATE,
  activa BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 5. DIRIGENTES

Team directors/managers.

```sql
CREATE TABLE dirigentes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 6. EQUIPOS

Teams with group assignment and suspension tracking.

```sql
CREATE TABLE equipos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  dirigente_id UUID REFERENCES dirigentes(id) ON DELETE SET NULL,

  -- Visual
  logo_url TEXT,
  color_principal VARCHAR(20),
  color_secundario VARCHAR(20),

  nivel nivel_enum DEFAULT '3',  -- 1-5, skill level

  -- Status
  activo BOOLEAN DEFAULT true,
  estado VARCHAR(15) DEFAULT 'activo' CHECK (
    estado IN ('activo', 'retirado', 'suspendido')
  ),
  fecha_retiro TIMESTAMPTZ,

  -- Group phase
  grupo VARCHAR(1) CHECK (grupo IN ('A', 'B', 'C', 'D')),

  -- Absences (3 absences = exclusion)
  inasistencias SMALLINT DEFAULT 0,
  excluido_por_inasistencias BOOLEAN DEFAULT false,

  -- Knockout phase
  clasificado_fase_grupos BOOLEAN DEFAULT false,
  fase_actual VARCHAR(20),
  eliminado_en_fase VARCHAR(20),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(nombre, categoria_id, torneo_id)
);

CREATE INDEX idx_equipo_torneo ON equipos(torneo_id);
CREATE INDEX idx_equipo_categoria ON equipos(categoria_id);
CREATE INDEX idx_equipo_grupo ON equipos(grupo, torneo_id);
```

---

### 7. JUGADORES

Players with suspension and document tracking.

```sql
CREATE TABLE jugadores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipo_id UUID REFERENCES equipos(id) ON DELETE CASCADE,

  -- Names (first + last)
  primer_nombre VARCHAR(100) NOT NULL,
  segundo_nombre VARCHAR(100),
  primer_apellido VARCHAR(100) NOT NULL,
  segundo_apellido VARCHAR(100),

  -- ID
  cedula VARCHAR(20),
  fecha_nacimiento DATE,

  -- Game info
  numero_dorsal SMALLINT CHECK (numero_dorsal BETWEEN 1 AND 99),
  posicion VARCHAR(50),
  nivel nivel_enum DEFAULT '3',
  foto_url TEXT,

  -- Phase control
  activo_segunda_fase BOOLEAN DEFAULT true,

  -- Suspension tracking
  suspendido BOOLEAN DEFAULT false,
  partidos_suspension_restantes SMALLINT DEFAULT 0,
  fecha_fin_suspension DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraints
CREATE UNIQUE INDEX unique_cedula_equipo
  ON jugadores(cedula, equipo_id)
  WHERE cedula IS NOT NULL;

CREATE UNIQUE INDEX unique_equipo_dorsal
  ON jugadores(equipo_id, numero_dorsal)
  WHERE numero_dorsal IS NOT NULL;

CREATE INDEX idx_jugador_equipo ON jugadores(equipo_id);
CREATE INDEX idx_jugador_cedula ON jugadores(cedula);
CREATE INDEX idx_jugador_suspendido ON jugadores(suspendido);
```

---

### 8. JUGADOR_DOCUMENTOS

Player identity documents with verification workflow.

```sql
CREATE TABLE jugador_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,

  tipo_documento VARCHAR(20) NOT NULL CHECK (
    tipo_documento IN (
      'dni_frontal', 'dni_posterior',
      'cedula_frontal', 'cedula_posterior',
      'pasaporte', 'otro'
    )
  ),

  archivo_url TEXT NOT NULL,  -- Supabase Storage URL

  -- Verification
  estado_verificacion VARCHAR(15) DEFAULT 'pendiente' CHECK (
    estado_verificacion IN ('pendiente', 'verificado', 'rechazado', 'resubir')
  ),
  verificado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  fecha_verificacion TIMESTAMPTZ,
  comentarios_verificacion TEXT,

  -- File info
  tamaño_archivo INTEGER,
  formato_archivo VARCHAR(10),

  fecha_subida TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ DEFAULT NOW()
);

-- Only one document per type in pending/verified state
CREATE UNIQUE INDEX unique_jugador_tipo_documento
  ON jugador_documentos(jugador_id, tipo_documento)
  WHERE estado_verificacion IN ('pendiente', 'verificado');

CREATE INDEX idx_jugador_documentos_jugador
  ON jugador_documentos(jugador_id, estado_verificacion);
CREATE INDEX idx_jugador_documentos_fecha ON jugador_documentos(fecha_subida);
```

---

### 9. ARBITROS

Match referees.

```sql
CREATE TABLE arbitros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(255),

  activo BOOLEAN DEFAULT true,
  experiencia_anos SMALLINT,
  categoria_maxima VARCHAR(50),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 10. PARTIDOS

Match records with goals, cards, and default victories.

```sql
CREATE TABLE partidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,

  -- Phase (either group OR knockout, not both)
  jornada_id UUID REFERENCES jornadas(id) ON DELETE CASCADE,
  fase_eliminatoria_id UUID REFERENCES fases_eliminatorias(id) ON DELETE CASCADE,

  -- Teams
  equipo_1_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
  equipo_2_id UUID REFERENCES equipos(id) ON DELETE CASCADE,

  arbitro_id UUID REFERENCES arbitros(id) ON DELETE SET NULL,

  -- Match info
  fecha TIMESTAMPTZ NOT NULL,
  cancha VARCHAR(100),
  completado BOOLEAN DEFAULT false,

  -- Results
  goles_equipo_1 SMALLINT DEFAULT 0,
  goles_equipo_2 SMALLINT DEFAULT 0,

  -- Default victory (for no-shows/disqualifications)
  victoria_por_default VARCHAR(20) CHECK (
    victoria_por_default IN ('', 'retiro', 'inasistencia', 'sancion')
  ),
  equipo_ganador_default_id UUID REFERENCES equipos(id) ON DELETE SET NULL,

  -- Knockout specifics
  es_eliminatorio BOOLEAN DEFAULT false,
  penales_equipo_1 SMALLINT,
  penales_equipo_2 SMALLINT,

  -- Absence tracking
  inasistencia_equipo_1 BOOLEAN DEFAULT false,
  inasistencia_equipo_2 BOOLEAN DEFAULT false,

  -- Referee payment status
  equipo_1_pago_arbitro BOOLEAN DEFAULT false,
  equipo_2_pago_arbitro BOOLEAN DEFAULT false,

  -- Match report
  observaciones TEXT,
  acta_firmada BOOLEAN DEFAULT false,
  acta_firmada_equipo_1 BOOLEAN DEFAULT false,
  acta_firmada_equipo_2 BOOLEAN DEFAULT false,

  -- Ball provision
  equipo_pone_balon_id UUID REFERENCES equipos(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CHECK (equipo_1_id != equipo_2_id),
  CHECK (NOT (jornada_id IS NOT NULL AND fase_eliminatoria_id IS NOT NULL))
);

CREATE INDEX idx_partido_fecha ON partidos(fecha);
CREATE INDEX idx_partido_torneo ON partidos(torneo_id);
CREATE INDEX idx_partido_torneo_fecha ON partidos(torneo_id, fecha);
CREATE INDEX idx_partido_completado ON partidos(completado);
CREATE INDEX idx_partido_jornada ON partidos(jornada_id);
CREATE INDEX idx_partido_fase ON partidos(fase_eliminatoria_id);
```

---

### 11. GOLES

Goals scored in matches.

```sql
CREATE TABLE goles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,
  jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,

  minuto SMALLINT,
  autogol BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gol_partido ON goles(partido_id);
CREATE INDEX idx_gol_jugador ON goles(jugador_id);
```

---

### 12. TARJETAS

Yellow/red cards with payment and suspension tracking.

```sql
CREATE TABLE tarjetas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,
  jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,

  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('AMARILLA', 'ROJA')),
  minuto SMALLINT,
  motivo VARCHAR(200),

  -- Payment tracking
  pagada BOOLEAN DEFAULT false,
  fecha_pago TIMESTAMPTZ,

  -- Suspension cumplimiento
  suspension_cumplida BOOLEAN DEFAULT false,

  fecha TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tarjeta_jugador ON tarjetas(jugador_id);
CREATE INDEX idx_tarjeta_partido ON tarjetas(partido_id);
CREATE INDEX idx_tarjeta_pagada ON tarjetas(jugador_id, pagada);
```

---

### 13. CAMBIOS_JUGADOR

Player substitutions during matches.

```sql
CREATE TABLE cambios_jugador (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,

  jugador_sale_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
  jugador_entra_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,

  minuto SMALLINT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cambio_partido ON cambios_jugador(partido_id);
```

---

### 14. EVENTOS_PARTIDO

Significant match events (suspensions, fights, etc.).

```sql
CREATE TABLE eventos_partido (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,

  tipo VARCHAR(20) NOT NULL CHECK (
    tipo IN (
      'SUSPENSION', 'GRESCA', 'INVASION',
      'ABANDONO', 'DIFERENCIA_8'
    )
  ),

  descripcion TEXT NOT NULL,
  minuto SMALLINT,
  equipo_responsable_id UUID REFERENCES equipos(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evento_partido ON eventos_partido(partido_id);
```

---

### 15. PARTICIPACION_JUGADOR

Player participation record in matches (starter vs bench).

```sql
CREATE TABLE participacion_jugador (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,
  jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,

  es_titular BOOLEAN DEFAULT true,
  minuto_entra SMALLINT,
  minuto_sale SMALLINT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(partido_id, jugador_id)
);

CREATE INDEX idx_participacion_partido ON participacion_jugador(partido_id);
```

---

### 16. ESTADISTICA_EQUIPO

Team standings (auto-updated by triggers).

```sql
CREATE TABLE estadistica_equipo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipo_id UUID UNIQUE REFERENCES equipos(id) ON DELETE CASCADE,
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,

  -- Match stats
  partidos_jugados SMALLINT DEFAULT 0,
  partidos_ganados SMALLINT DEFAULT 0,
  partidos_empatados SMALLINT DEFAULT 0,
  partidos_perdidos SMALLINT DEFAULT 0,

  -- Goals
  goles_favor SMALLINT DEFAULT 0,
  goles_contra SMALLINT DEFAULT 0,
  diferencia_goles INTEGER DEFAULT 0,

  -- Points and ranking
  puntos SMALLINT DEFAULT 0,

  -- Cards
  tarjetas_amarillas SMALLINT DEFAULT 0,
  tarjetas_rojas SMALLINT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(equipo_id, torneo_id)
);

CREATE INDEX idx_estadistica_torneo ON estadistica_equipo(torneo_id);
CREATE INDEX idx_estadistica_puntos
  ON estadistica_equipo(puntos DESC, diferencia_goles DESC);
```

---

### 17. LLAVES_ELIMINATORIAS

Knockout bracket matchups.

```sql
CREATE TABLE llaves_eliminatorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fase_id UUID REFERENCES fases_eliminatorias(id) ON DELETE CASCADE,

  numero_llave SMALLINT NOT NULL,

  equipo_1_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
  equipo_2_id UUID REFERENCES equipos(id) ON DELETE CASCADE,

  partido_id UUID UNIQUE REFERENCES partidos(id) ON DELETE CASCADE,

  completada BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(fase_id, numero_llave)
);

CREATE INDEX idx_llave_fase ON llaves_eliminatorias(fase_id);
```

---

### 18. MEJORES_PERDEDORES

Best losing teams for playoff advancement.

```sql
CREATE TABLE mejores_perdedores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,

  grupo VARCHAR(1) NOT NULL,
  equipo_id UUID REFERENCES equipos(id) ON DELETE CASCADE,

  puntos SMALLINT NOT NULL,
  diferencia_goles INTEGER NOT NULL,
  goles_favor SMALLINT NOT NULL,
  goles_contra SMALLINT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(torneo_id, grupo, equipo_id)
);

CREATE INDEX idx_mejores_perdedores_torneo ON mejores_perdedores(torneo_id);
```

---

### 19. EVENTOS_TORNEO

Tournament timeline events (registration opened, groups started, etc.).

```sql
CREATE TABLE eventos_torneo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,

  tipo VARCHAR(30) NOT NULL CHECK (
    tipo IN (
      'inicio_inscripcion', 'fin_inscripcion',
      'inicio_grupos', 'fin_grupos',
      'inicio_eliminatorias', 'final_torneo',
      'clasificacion', 'exclusion'
    )
  ),

  descripcion TEXT NOT NULL,
  equipo_involucrado_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
  datos_adicionales JSONB,

  fecha TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evento_torneo ON eventos_torneo(torneo_id);
CREATE INDEX idx_evento_fecha ON eventos_torneo(fecha);
```

---

### 20. TRANSACCIONES_PAGO

Financial transactions (registration, fines, referee payments).

```sql
CREATE TABLE transacciones_pago (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipo_id UUID REFERENCES equipos(id) ON DELETE PROTECT,
  partido_id UUID REFERENCES partidos(id) ON DELETE SET NULL,

  tipo VARCHAR(20) NOT NULL CHECK (
    tipo IN (
      'abono_inscripcion', 'pago_arbitro', 'pago_balon',
      'multa_amarilla', 'multa_roja', 'ajuste_manual', 'devolucion'
    )
  ),

  monto DECIMAL(8,2) NOT NULL CHECK (monto >= 0),
  es_ingreso BOOLEAN DEFAULT false,  -- true=income, false=expense
  concepto VARCHAR(100) NOT NULL,

  metodo_pago VARCHAR(20) DEFAULT 'efectivo' CHECK (
    metodo_pago IN ('efectivo', 'transferencia', 'deposito', 'tarjeta', 'otro')
  ),
  referencia_pago VARCHAR(100),
  fecha_real_transaccion TIMESTAMPTZ,

  -- Links to entities
  tarjeta_id UUID REFERENCES tarjetas(id) ON DELETE SET NULL,
  jugador_id UUID REFERENCES jugadores(id) ON DELETE SET NULL,

  -- Metadata
  observaciones TEXT,
  creado_automaticamente BOOLEAN DEFAULT false,

  fecha TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transaccion_equipo ON transacciones_pago(equipo_id, fecha);
CREATE INDEX idx_transaccion_tipo ON transacciones_pago(tipo, fecha);
CREATE INDEX idx_transaccion_partido ON transacciones_pago(partido_id);
```

---

### 21. PAGOS_ARBITRO

Referee payment tracking.

```sql
CREATE TABLE pagos_arbitro (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  arbitro_id UUID REFERENCES arbitros(id) ON DELETE CASCADE,
  partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,
  equipo_id UUID REFERENCES equipos(id) ON DELETE CASCADE,

  monto DECIMAL(6,2) NOT NULL CHECK (monto >= 0),
  pagado BOOLEAN DEFAULT false,
  fecha_pago TIMESTAMPTZ,
  metodo_pago VARCHAR(50),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(arbitro_id, partido_id, equipo_id)
);

CREATE INDEX idx_pago_arbitro_arbitro ON pagos_arbitro(arbitro_id);
CREATE INDEX idx_pago_arbitro_partido ON pagos_arbitro(partido_id);
```

---

## Data Types

### Custom Enum: nivel_enum

```sql
CREATE TYPE nivel_enum AS ENUM ('1', '2', '3', '4', '5');
```

Represents player/team skill level (1=beginner, 5=professional).

---

## Key Relationships

```
categorias
  ├── torneos
  │   ├── equipos
  │   │   ├── dirigentes
  │   │   ├── jugadores
  │   │   │   ├── goles
  │   │   │   ├── tarjetas
  │   │   │   ├── cambios_jugador
  │   │   │   ├── participacion_jugador
  │   │   │   └── jugador_documentos
  │   │   ├── partidos
  │   │   │   ├── goles
  │   │   │   ├── tarjetas
  │   │   │   ├── cambios_jugador
  │   │   │   ├── eventos_partido
  │   │   │   └── participacion_jugador
  │   │   └── estadistica_equipo
  │   ├── jornadas
  │   │   └── partidos
  │   ├── fases_eliminatorias
  │   │   ├── partidos
  │   │   └── llaves_eliminatorias
  │   ├── arbitros
  │   │   ├── partidos
  │   │   └── pagos_arbitro
  │   ├── transacciones_pago
  │   ├── eventos_torneo
  │   ├── mejores_perdedores
  │   └── pagos_arbitro
```

---

## Constraints & Data Integrity

- **Unique constraints**: Equipo name per tournament, Player jersey/ID per team, Document type per player
- **Check constraints**: No team plays itself, valid phase states, amount checks
- **Foreign keys**: CASCADE/PROTECT/SET NULL as appropriate
- **Not Null**: All required fields enforced at DB level

---

## Performance Indexes

All tables include indexes on:
- Foreign key columns (for joins)
- Frequently filtered columns (estado, activo, completado)
- Sorting columns (fecha, puntos, diferencia_goles)
- Unique constraints

See individual table definitions for specific indexes.

---

## Notes

1. **CRITICAL**: Partidos can reference EITHER jornada_id (group phase) OR fase_eliminatoria_id (knockout), not both
2. Statistics are auto-updated by triggers (see triggers.md)
3. Player suspensions are auto-enforced by triggers on card insertion
4. RLS policies should be configured per table (see database docs)

---

See also:
- [triggers.md](triggers.md) - Automatic database operations
- [functions.md](functions.md) - Complex queries
- [../CLAUDE.md](../CLAUDE.md) - Development patterns
