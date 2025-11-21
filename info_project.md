# GoolStar - Proyecto Next.js + Supabase

## 📋 Información del Proyecto

**Proyecto Original**: GoolStar Backend (Django + DRF)
**Nueva Stack**: Next.js 14+ App Router + Supabase
**Tipo**: Sistema de Gestión de Torneos Deportivos (Fútbol Indoor)
**Propósito**: MVP moderno con realtime, menor costo y desarrollo más rápido

---

## 🎯 Resumen Ejecutivo

GoolStar es un sistema completo para gestionar torneos de fútbol indoor que incluye:
- Gestión de equipos, jugadores y árbitros
- Partidos con resultados en tiempo real
- Tabla de posiciones automática
- Sistema de tarjetas y suspensiones
- Gestión financiera (pagos, multas)
- Upload de documentos de jugadores
- Fases de grupos y eliminación directa

---

## 🏗️ Arquitectura Propuesta

```
┌─────────────────────────────────────────┐
│     Next.js 14 (App Router)             │
│  ┌──────────────┐  ┌──────────────┐    │
│  │   Frontend   │  │   Backend    │    │
│  │  (RSC/RCC)   │  │ (API Routes) │    │
│  └──────────────┘  └──────────────┘    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Supabase Platform               │
│  ┌─────────────────────────────────┐   │
│  │  PostgreSQL Database            │   │
│  │  - Tables (schema)              │   │
│  │  - Triggers (auto-updates)      │   │
│  │  - Functions (business logic)   │   │
│  │  - RLS (row level security)     │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Supabase Auth                  │   │
│  │  - JWT tokens                   │   │
│  │  - OAuth providers              │   │
│  │  - Magic links                  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Supabase Storage               │   │
│  │  - Player documents             │   │
│  │  - Team logos                   │   │
│  │  - S3-compatible                │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Supabase Realtime              │   │
│  │  - Live updates (WebSockets)    │   │
│  │  - Presence                     │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Edge Functions (Deno)          │   │
│  │  - Complex business logic       │   │
│  │  - Scheduled tasks              │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Deploy**:
- Frontend + API Routes: **Vercel**
- Database + Auth + Storage: **Supabase**

---

## 📁 Estructura del Proyecto

```
goolstar-nextjs/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Grupo de rutas de autenticación
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/                  # Grupo de rutas protegidas
│   │   ├── layout.tsx                # Layout con navbar/sidebar
│   │   ├── torneos/
│   │   │   ├── page.tsx              # Lista de torneos
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx          # Detalle torneo
│   │   │   │   ├── tabla/
│   │   │   │   │   └── page.tsx      # Tabla posiciones
│   │   │   │   └── estadisticas/
│   │   │   │       └── page.tsx      # Estadísticas
│   │   │   └── nuevo/
│   │   │       └── page.tsx          # Crear torneo
│   │   ├── equipos/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── nuevo/
│   │   │       └── page.tsx
│   │   ├── jugadores/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── nuevo/
│   │   │       └── page.tsx
│   │   ├── partidos/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── acta/
│   │   │   │       └── page.tsx
│   │   │   └── nuevo/
│   │   │       └── page.tsx
│   │   ├── financiero/
│   │   │   ├── page.tsx
│   │   │   └── transacciones/
│   │   │       └── page.tsx
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── documentos/
│   │       │   └── page.tsx          # Verificar documentos
│   │       └── usuarios/
│   │           └── page.tsx
│   ├── api/                          # API Routes
│   │   ├── torneos/
│   │   │   ├── route.ts              # GET, POST /api/torneos
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET, PUT, DELETE
│   │   │       ├── tabla/
│   │   │       │   └── route.ts      # GET tabla posiciones
│   │   │       └── estadisticas/
│   │   │           └── route.ts
│   │   ├── equipos/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── jugadores/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── partidos/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── upload/
│   │       └── route.ts              # Upload de archivos
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   └── globals.css                   # Estilos globales
├── components/                       # Componentes React
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── torneos/
│   │   ├── torneo-card.tsx
│   │   ├── torneo-form.tsx
│   │   ├── tabla-posiciones.tsx
│   │   └── tabla-posiciones-live.tsx # Con realtime
│   ├── equipos/
│   │   ├── equipo-card.tsx
│   │   ├── equipo-form.tsx
│   │   └── equipo-stats.tsx
│   ├── jugadores/
│   │   ├── jugador-card.tsx
│   │   ├── jugador-form.tsx
│   │   └── documento-upload.tsx
│   ├── partidos/
│   │   ├── partido-card.tsx
│   │   ├── partido-form.tsx
│   │   ├── resultado-input.tsx
│   │   └── acta-partido.tsx
│   ├── financiero/
│   │   ├── transaccion-form.tsx
│   │   ├── balance-card.tsx
│   │   └── historial-pagos.tsx
│   └── layout/
│       ├── navbar.tsx
│       ├── sidebar.tsx
│       └── footer.tsx
├── lib/                              # Utilidades
│   ├── supabase/
│   │   ├── client.ts                 # Cliente para componentes
│   │   ├── server.ts                 # Cliente para server components
│   │   ├── middleware.ts             # Middleware de auth
│   │   └── types.ts                  # Tipos generados
│   ├── validations/                  # Zod schemas
│   │   ├── torneo.ts
│   │   ├── equipo.ts
│   │   ├── jugador.ts
│   │   ├── partido.ts
│   │   └── financiero.ts
│   ├── utils/
│   │   ├── date.ts
│   │   ├── format.ts
│   │   ├── cache.ts
│   │   └── permissions.ts
│   └── hooks/                        # Custom hooks
│       ├── use-torneos.ts
│       ├── use-equipos.ts
│       ├── use-jugadores.ts
│       └── use-partidos.ts
├── actions/                          # Server Actions
│   ├── torneos.ts
│   ├── equipos.ts
│   ├── jugadores.ts
│   ├── partidos.ts
│   └── financiero.ts
├── supabase/                         # Supabase configuration
│   ├── migrations/                   # SQL migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_categorias_torneos.sql
│   │   ├── 003_equipos_jugadores.sql
│   │   ├── 004_partidos_competicion.sql
│   │   ├── 005_estadisticas.sql
│   │   ├── 006_financiero.sql
│   │   ├── 007_triggers.sql
│   │   ├── 008_functions.sql
│   │   ├── 009_rls_policies.sql
│   │   └── 010_indexes.sql
│   ├── functions/                    # Edge Functions
│   │   ├── actualizar-estadisticas/
│   │   │   └── index.ts
│   │   ├── generar-llaves/
│   │   │   └── index.ts
│   │   └── enviar-notificaciones/
│   │       └── index.ts
│   ├── seed.sql                      # Datos de prueba
│   └── config.toml                   # Configuración Supabase
├── types/                            # TypeScript types
│   ├── database.ts                   # Tipos generados de Supabase
│   ├── models.ts                     # Tipos de modelos
│   └── api.ts                        # Tipos de API
├── public/                           # Archivos estáticos
│   ├── images/
│   └── icons/
├── tests/                            # Tests
│   ├── e2e/                          # Playwright
│   └── unit/                         # Vitest
├── .env.local                        # Variables de entorno
├── .env.example                      # Ejemplo de variables
├── next.config.js                    # Configuración Next.js
├── tailwind.config.ts                # Configuración Tailwind
├── tsconfig.json                     # Configuración TypeScript
├── package.json
└── README.md
```

---

## 🗄️ Schema de Base de Datos (Supabase SQL)

### 1. Tablas Base

```sql
-- ===========================================
-- CATEGORIAS Y NIVELES
-- ===========================================

-- Enum para niveles
CREATE TYPE nivel_enum AS ENUM ('1', '2', '3', '4', '5');

-- Categorías
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,
  -- Premios
  premio_primero DECIMAL(8,2) CHECK (premio_primero >= 0),
  premio_segundo DECIMAL(8,2) CHECK (premio_segundo >= 0),
  premio_tercero DECIMAL(8,2) CHECK (premio_tercero >= 0),
  premio_cuarto DECIMAL(8,2) CHECK (premio_cuarto >= 0),
  costo_inscripcion DECIMAL(8,2) CHECK (costo_inscripcion >= 0),
  -- Configuración
  costo_arbitraje DECIMAL(6,2) DEFAULT 10.00 CHECK (costo_arbitraje >= 0),
  multa_amarilla DECIMAL(6,2) DEFAULT 2.00 CHECK (multa_amarilla >= 0),
  multa_roja DECIMAL(6,2) DEFAULT 3.00 CHECK (multa_roja >= 0),
  limite_inasistencias SMALLINT DEFAULT 3,
  limite_amarillas_suspension SMALLINT DEFAULT 3,
  partidos_suspension_roja SMALLINT DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Torneos
CREATE TABLE torneos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  activo BOOLEAN DEFAULT true,
  finalizado BOOLEAN DEFAULT false,
  -- Configuración formato
  tiene_fase_grupos BOOLEAN DEFAULT true,
  tiene_eliminacion_directa BOOLEAN DEFAULT true,
  numero_grupos SMALLINT DEFAULT 2,
  equipos_clasifican_por_grupo SMALLINT DEFAULT 2,
  -- Estado actual
  fase_actual VARCHAR(20) DEFAULT 'inscripcion' CHECK (
    fase_actual IN ('inscripcion', 'grupos', 'octavos', 'cuartos', 'semifinales', 'final', 'finalizado')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fases eliminatorias
CREATE TABLE fases_eliminatorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  nombre VARCHAR(50) NOT NULL,
  orden SMALLINT NOT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  completada BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(torneo_id, orden)
);

-- ===========================================
-- PARTICIPANTES
-- ===========================================

-- Dirigentes
CREATE TABLE dirigentes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipos
CREATE TABLE equipos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  dirigente_id UUID REFERENCES dirigentes(id) ON DELETE SET NULL,
  logo_url TEXT,
  color_principal VARCHAR(20),
  color_secundario VARCHAR(20),
  nivel nivel_enum DEFAULT '3',
  activo BOOLEAN DEFAULT true,
  estado VARCHAR(15) DEFAULT 'activo' CHECK (estado IN ('activo', 'retirado', 'suspendido')),
  fecha_retiro TIMESTAMPTZ,
  -- Fase de grupos
  grupo VARCHAR(1) CHECK (grupo IN ('A', 'B', 'C', 'D')),
  -- Control de inasistencias
  inasistencias SMALLINT DEFAULT 0,
  excluido_por_inasistencias BOOLEAN DEFAULT false,
  -- Eliminación directa
  clasificado_fase_grupos BOOLEAN DEFAULT false,
  fase_actual VARCHAR(20),
  eliminado_en_fase VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(nombre, categoria_id, torneo_id)
);

-- Jugadores
CREATE TABLE jugadores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipo_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
  primer_nombre VARCHAR(100) NOT NULL,
  segundo_nombre VARCHAR(100),
  primer_apellido VARCHAR(100) NOT NULL,
  segundo_apellido VARCHAR(100),
  cedula VARCHAR(20),
  fecha_nacimiento DATE,
  numero_dorsal SMALLINT CHECK (numero_dorsal BETWEEN 1 AND 99),
  posicion VARCHAR(50),
  nivel nivel_enum DEFAULT '3',
  foto_url TEXT,
  -- Control segunda fase
  activo_segunda_fase BOOLEAN DEFAULT true,
  -- Suspensiones
  suspendido BOOLEAN DEFAULT false,
  partidos_suspension_restantes SMALLINT DEFAULT 0,
  fecha_fin_suspension DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Constraints únicos para jugadores
CREATE UNIQUE INDEX unique_cedula_equipo
ON jugadores(cedula, equipo_id)
WHERE cedula IS NOT NULL;

CREATE UNIQUE INDEX unique_equipo_dorsal
ON jugadores(equipo_id, numero_dorsal)
WHERE numero_dorsal IS NOT NULL;

-- Documentos de jugadores
CREATE TABLE jugador_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
  tipo_documento VARCHAR(20) NOT NULL CHECK (
    tipo_documento IN ('dni_frontal', 'dni_posterior', 'cedula_frontal', 'cedula_posterior', 'pasaporte', 'otro')
  ),
  archivo_url TEXT NOT NULL,
  estado_verificacion VARCHAR(15) DEFAULT 'pendiente' CHECK (
    estado_verificacion IN ('pendiente', 'verificado', 'rechazado', 'resubir')
  ),
  verificado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  fecha_verificacion TIMESTAMPTZ,
  comentarios_verificacion TEXT,
  tamaño_archivo INTEGER,
  formato_archivo VARCHAR(10),
  fecha_subida TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ DEFAULT NOW()
);

-- Solo un documento del mismo tipo por jugador (si está pendiente o verificado)
CREATE UNIQUE INDEX unique_jugador_tipo_documento
ON jugador_documentos(jugador_id, tipo_documento)
WHERE estado_verificacion IN ('pendiente', 'verificado');

-- Árbitros
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

-- ===========================================
-- COMPETICIÓN
-- ===========================================

-- Jornadas
CREATE TABLE jornadas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(50) UNIQUE NOT NULL,
  numero INTEGER NOT NULL,
  fecha DATE,
  activa BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partidos
CREATE TABLE partidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  jornada_id UUID REFERENCES jornadas(id) ON DELETE CASCADE,
  fase_eliminatoria_id UUID REFERENCES fases_eliminatorias(id) ON DELETE CASCADE,
  equipo_1_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
  equipo_2_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
  arbitro_id UUID REFERENCES arbitros(id) ON DELETE SET NULL,
  -- Info partido
  fecha TIMESTAMPTZ NOT NULL,
  cancha VARCHAR(100),
  completado BOOLEAN DEFAULT false,
  -- Resultados
  goles_equipo_1 SMALLINT DEFAULT 0,
  goles_equipo_2 SMALLINT DEFAULT 0,
  -- Victoria por default
  victoria_por_default VARCHAR(20) CHECK (
    victoria_por_default IN ('', 'retiro', 'inasistencia', 'sancion')
  ),
  equipo_ganador_default_id UUID REFERENCES equipos(id) ON DELETE SET NULL,
  -- Eliminatorias
  es_eliminatorio BOOLEAN DEFAULT false,
  penales_equipo_1 SMALLINT,
  penales_equipo_2 SMALLINT,
  -- Control asistencia
  inasistencia_equipo_1 BOOLEAN DEFAULT false,
  inasistencia_equipo_2 BOOLEAN DEFAULT false,
  -- Control pagos
  equipo_1_pago_arbitro BOOLEAN DEFAULT false,
  equipo_2_pago_arbitro BOOLEAN DEFAULT false,
  -- Acta
  observaciones TEXT,
  acta_firmada BOOLEAN DEFAULT false,
  acta_firmada_equipo_1 BOOLEAN DEFAULT false,
  acta_firmada_equipo_2 BOOLEAN DEFAULT false,
  -- Control balón
  equipo_pone_balon_id UUID REFERENCES equipos(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (equipo_1_id != equipo_2_id),
  CHECK (NOT (jornada_id IS NOT NULL AND fase_eliminatoria_id IS NOT NULL))
);

-- Goles
CREATE TABLE goles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,
  jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
  minuto SMALLINT,
  autogol BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tarjetas
CREATE TABLE tarjetas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,
  jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('AMARILLA', 'ROJA')),
  minuto SMALLINT,
  motivo VARCHAR(200),
  -- Control pagos
  pagada BOOLEAN DEFAULT false,
  fecha_pago TIMESTAMPTZ,
  -- Control suspensiones
  suspension_cumplida BOOLEAN DEFAULT false,
  fecha TIMESTAMPTZ DEFAULT NOW()
);

-- Cambios de jugador
CREATE TABLE cambios_jugador (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,
  jugador_sale_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
  jugador_entra_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
  minuto SMALLINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eventos de partido
CREATE TABLE eventos_partido (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (
    tipo IN ('SUSPENSION', 'GRESCA', 'INVASION', 'ABANDONO', 'DIFERENCIA_8')
  ),
  descripcion TEXT NOT NULL,
  minuto SMALLINT,
  equipo_responsable_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participación de jugadores
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

-- ===========================================
-- ESTADÍSTICAS
-- ===========================================

-- Estadísticas de equipos
CREATE TABLE estadistica_equipo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipo_id UUID UNIQUE REFERENCES equipos(id) ON DELETE CASCADE,
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  -- Estadísticas fase grupos
  partidos_jugados SMALLINT DEFAULT 0,
  partidos_ganados SMALLINT DEFAULT 0,
  partidos_empatados SMALLINT DEFAULT 0,
  partidos_perdidos SMALLINT DEFAULT 0,
  goles_favor SMALLINT DEFAULT 0,
  goles_contra SMALLINT DEFAULT 0,
  diferencia_goles INTEGER DEFAULT 0,
  puntos SMALLINT DEFAULT 0,
  -- Tarjetas
  tarjetas_amarillas SMALLINT DEFAULT 0,
  tarjetas_rojas SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(equipo_id, torneo_id)
);

-- Llaves eliminatorias
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

-- Mejores perdedores
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

-- Eventos del torneo
CREATE TABLE eventos_torneo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  tipo VARCHAR(30) NOT NULL CHECK (
    tipo IN ('inicio_inscripcion', 'fin_inscripcion', 'inicio_grupos', 'fin_grupos',
             'inicio_eliminatorias', 'final_torneo', 'clasificacion', 'exclusion')
  ),
  descripcion TEXT NOT NULL,
  equipo_involucrado_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
  datos_adicionales JSONB,
  fecha TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- FINANCIERO
-- ===========================================

-- Transacciones de pago
CREATE TABLE transacciones_pago (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipo_id UUID REFERENCES equipos(id) ON DELETE PROTECT,
  partido_id UUID REFERENCES partidos(id) ON DELETE SET NULL,
  tipo VARCHAR(20) NOT NULL CHECK (
    tipo IN ('abono_inscripcion', 'pago_arbitro', 'pago_balon', 'multa_amarilla', 'multa_roja', 'ajuste_manual', 'devolucion')
  ),
  monto DECIMAL(8,2) NOT NULL CHECK (monto >= 0),
  es_ingreso BOOLEAN DEFAULT false,
  concepto VARCHAR(100) NOT NULL,
  metodo_pago VARCHAR(20) DEFAULT 'efectivo' CHECK (
    metodo_pago IN ('efectivo', 'transferencia', 'deposito', 'tarjeta', 'otro')
  ),
  referencia_pago VARCHAR(100),
  fecha_real_transaccion TIMESTAMPTZ,
  -- Referencias
  tarjeta_id UUID REFERENCES tarjetas(id) ON DELETE SET NULL,
  jugador_id UUID REFERENCES jugadores(id) ON DELETE SET NULL,
  -- Metadata
  observaciones TEXT,
  creado_automaticamente BOOLEAN DEFAULT false,
  fecha TIMESTAMPTZ DEFAULT NOW()
);

-- Pagos a árbitros
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

-- ===========================================
-- ÍNDICES PARA PERFORMANCE
-- ===========================================

-- Jugadores
CREATE INDEX idx_jugador_cedula ON jugadores(cedula);
CREATE INDEX idx_jugador_equipo_id ON jugadores(equipo_id);
CREATE INDEX idx_jugador_documentos_jugador ON jugador_documentos(jugador_id, estado_verificacion);
CREATE INDEX idx_jugador_documentos_fecha ON jugador_documentos(fecha_subida);

-- Partidos
CREATE INDEX idx_partido_fecha ON partidos(fecha);
CREATE INDEX idx_partido_torneo_id ON partidos(torneo_id);
CREATE INDEX idx_partido_torneo_fecha ON partidos(torneo_id, fecha);
CREATE INDEX idx_partido_completado ON partidos(completado);

-- Goles y tarjetas
CREATE INDEX idx_gol_partido_id ON goles(partido_id);
CREATE INDEX idx_gol_jugador_id ON goles(jugador_id);
CREATE INDEX idx_tarjeta_jugador_id ON tarjetas(jugador_id);
CREATE INDEX idx_tarjeta_partido_id ON tarjetas(partido_id);
CREATE INDEX idx_tarjeta_pagada ON tarjetas(jugador_id, pagada);

-- Estadísticas
CREATE INDEX idx_estadistica_torneo ON estadistica_equipo(torneo_id);
CREATE INDEX idx_estadistica_puntos ON estadistica_equipo(puntos DESC, diferencia_goles DESC);

-- Transacciones
CREATE INDEX idx_transaccion_equipo ON transacciones_pago(equipo_id, fecha);
CREATE INDEX idx_transaccion_tipo ON transacciones_pago(tipo, fecha);
```

### 2. Triggers (Lógica Automática)

```sql
-- ===========================================
-- TRIGGERS - Actualización Automática
-- ===========================================

-- Trigger: Actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas con updated_at
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_torneos_updated_at BEFORE UPDATE ON torneos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipos_updated_at BEFORE UPDATE ON equipos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jugadores_updated_at BEFORE UPDATE ON jugadores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Actualizar estadísticas cuando se completa un partido
CREATE OR REPLACE FUNCTION actualizar_estadisticas_partido()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo si el partido acaba de ser marcado como completado
  IF NEW.completado = true AND OLD.completado = false THEN

    -- Actualizar estadísticas equipo 1
    UPDATE estadistica_equipo
    SET
      partidos_jugados = partidos_jugados + 1,
      goles_favor = goles_favor + NEW.goles_equipo_1,
      goles_contra = goles_contra + NEW.goles_equipo_2,
      diferencia_goles = (goles_favor + NEW.goles_equipo_1) - (goles_contra + NEW.goles_equipo_2),
      puntos = puntos + CASE
        WHEN NEW.goles_equipo_1 > NEW.goles_equipo_2 THEN 3
        WHEN NEW.goles_equipo_1 = NEW.goles_equipo_2 THEN 1
        ELSE 0
      END,
      partidos_ganados = partidos_ganados + CASE
        WHEN NEW.goles_equipo_1 > NEW.goles_equipo_2 THEN 1 ELSE 0
      END,
      partidos_empatados = partidos_empatados + CASE
        WHEN NEW.goles_equipo_1 = NEW.goles_equipo_2 THEN 1 ELSE 0
      END,
      partidos_perdidos = partidos_perdidos + CASE
        WHEN NEW.goles_equipo_1 < NEW.goles_equipo_2 THEN 1 ELSE 0
      END
    WHERE equipo_id = NEW.equipo_1_id;

    -- Actualizar estadísticas equipo 2
    UPDATE estadistica_equipo
    SET
      partidos_jugados = partidos_jugados + 1,
      goles_favor = goles_favor + NEW.goles_equipo_2,
      goles_contra = goles_contra + NEW.goles_equipo_1,
      diferencia_goles = (goles_favor + NEW.goles_equipo_2) - (goles_contra + NEW.goles_equipo_1),
      puntos = puntos + CASE
        WHEN NEW.goles_equipo_2 > NEW.goles_equipo_1 THEN 3
        WHEN NEW.goles_equipo_2 = NEW.goles_equipo_1 THEN 1
        ELSE 0
      END,
      partidos_ganados = partidos_ganados + CASE
        WHEN NEW.goles_equipo_2 > NEW.goles_equipo_1 THEN 1 ELSE 0
      END,
      partidos_empatados = partidos_empatados + CASE
        WHEN NEW.goles_equipo_2 = NEW.goles_equipo_1 THEN 1 ELSE 0
      END,
      partidos_perdidos = partidos_perdidos + CASE
        WHEN NEW.goles_equipo_2 < NEW.goles_equipo_1 THEN 1 ELSE 0
      END
    WHERE equipo_id = NEW.equipo_2_id;

    -- Incrementar inasistencias si aplica
    IF NEW.inasistencia_equipo_1 THEN
      UPDATE equipos SET inasistencias = inasistencias + 1 WHERE id = NEW.equipo_1_id;
    END IF;

    IF NEW.inasistencia_equipo_2 THEN
      UPDATE equipos SET inasistencias = inasistencias + 1 WHERE id = NEW.equipo_2_id;
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_estadisticas
AFTER UPDATE ON partidos
FOR EACH ROW
EXECUTE FUNCTION actualizar_estadisticas_partido();

-- Trigger: Suspender jugador por tarjeta roja
CREATE OR REPLACE FUNCTION suspender_por_tarjeta_roja()
RETURNS TRIGGER AS $$
DECLARE
  categoria_id UUID;
  partidos_suspension SMALLINT;
BEGIN
  IF NEW.tipo = 'ROJA' THEN
    -- Obtener la categoría del jugador para saber los partidos de suspensión
    SELECT e.categoria_id INTO categoria_id
    FROM jugadores j
    JOIN equipos e ON j.equipo_id = e.id
    WHERE j.id = NEW.jugador_id;

    SELECT partidos_suspension_roja INTO partidos_suspension
    FROM categorias
    WHERE id = categoria_id;

    -- Suspender al jugador
    UPDATE jugadores
    SET
      suspendido = true,
      partidos_suspension_restantes = partidos_suspension
    WHERE id = NEW.jugador_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_suspender_por_roja
AFTER INSERT ON tarjetas
FOR EACH ROW
EXECUTE FUNCTION suspender_por_tarjeta_roja();

-- Trigger: Verificar acumulación de amarillas
CREATE OR REPLACE FUNCTION verificar_amarillas_acumuladas()
RETURNS TRIGGER AS $$
DECLARE
  categoria_id UUID;
  limite_amarillas SMALLINT;
  total_amarillas INTEGER;
BEGIN
  IF NEW.tipo = 'AMARILLA' THEN
    -- Obtener la categoría y límite
    SELECT e.categoria_id INTO categoria_id
    FROM jugadores j
    JOIN equipos e ON j.equipo_id = e.id
    WHERE j.id = NEW.jugador_id;

    SELECT limite_amarillas_suspension INTO limite_amarillas
    FROM categorias
    WHERE id = categoria_id;

    -- Contar amarillas no cumplidas
    SELECT COUNT(*) INTO total_amarillas
    FROM tarjetas
    WHERE jugador_id = NEW.jugador_id
      AND tipo = 'AMARILLA'
      AND suspension_cumplida = false;

    -- Si alcanza el límite, suspender
    IF total_amarillas >= limite_amarillas THEN
      UPDATE jugadores
      SET
        suspendido = true,
        partidos_suspension_restantes = 1
      WHERE id = NEW.jugador_id;

      -- Marcar amarillas como procesadas
      UPDATE tarjetas
      SET suspension_cumplida = true
      WHERE jugador_id = NEW.jugador_id
        AND tipo = 'AMARILLA'
        AND suspension_cumplida = false;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_verificar_amarillas
AFTER INSERT ON tarjetas
FOR EACH ROW
EXECUTE FUNCTION verificar_amarillas_acumuladas();

-- Trigger: Crear estadística al crear equipo
CREATE OR REPLACE FUNCTION crear_estadistica_equipo()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO estadistica_equipo (equipo_id, torneo_id)
  VALUES (NEW.id, NEW.torneo_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_crear_estadistica
AFTER INSERT ON equipos
FOR EACH ROW
EXECUTE FUNCTION crear_estadistica_equipo();
```

### 3. Functions (Consultas Complejas)

```sql
-- ===========================================
-- FUNCTIONS - Lógica de Negocio
-- ===========================================

-- Función: Obtener tabla de posiciones
CREATE OR REPLACE FUNCTION get_tabla_posiciones(torneo_uuid UUID)
RETURNS TABLE (
  equipo_id UUID,
  equipo_nombre VARCHAR,
  logo_url TEXT,
  grupo VARCHAR,
  partidos_jugados SMALLINT,
  partidos_ganados SMALLINT,
  partidos_empatados SMALLINT,
  partidos_perdidos SMALLINT,
  goles_favor SMALLINT,
  goles_contra SMALLINT,
  diferencia_goles INTEGER,
  puntos SMALLINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id AS equipo_id,
    e.nombre AS equipo_nombre,
    e.logo_url,
    e.grupo,
    ee.partidos_jugados,
    ee.partidos_ganados,
    ee.partidos_empatados,
    ee.partidos_perdidos,
    ee.goles_favor,
    ee.goles_contra,
    ee.diferencia_goles,
    ee.puntos
  FROM equipos e
  JOIN estadistica_equipo ee ON e.id = ee.equipo_id
  WHERE e.torneo_id = torneo_uuid
    AND e.activo = true
  ORDER BY
    e.grupo ASC,
    ee.puntos DESC,
    ee.diferencia_goles DESC,
    ee.goles_favor DESC;
END;
$$ LANGUAGE plpgsql;

-- Función: Calcular deuda de equipo
CREATE OR REPLACE FUNCTION calcular_deuda_equipo(equipo_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_inscripcion DECIMAL;
  total_abonos DECIMAL;
  deuda_multas DECIMAL;
BEGIN
  -- Obtener costo de inscripción
  SELECT c.costo_inscripcion INTO total_inscripcion
  FROM equipos e
  JOIN categorias c ON e.categoria_id = c.id
  WHERE e.id = equipo_uuid;

  -- Calcular abonos
  SELECT COALESCE(SUM(monto), 0) INTO total_abonos
  FROM transacciones_pago
  WHERE equipo_id = equipo_uuid
    AND tipo = 'abono_inscripcion'
    AND es_ingreso = true;

  -- Calcular multas pendientes
  SELECT COALESCE(SUM(
    CASE
      WHEN t.tipo = 'AMARILLA' THEN c.multa_amarilla
      WHEN t.tipo = 'ROJA' THEN c.multa_roja
      ELSE 0
    END
  ), 0) INTO deuda_multas
  FROM tarjetas t
  JOIN jugadores j ON t.jugador_id = j.id
  JOIN equipos e ON j.equipo_id = e.id
  JOIN categorias c ON e.categoria_id = c.id
  WHERE e.id = equipo_uuid
    AND t.pagada = false;

  RETURN (total_inscripcion + deuda_multas) - total_abonos;
END;
$$ LANGUAGE plpgsql;

-- Función: Jugadores destacados del torneo
CREATE OR REPLACE FUNCTION get_jugadores_destacados(torneo_uuid UUID)
RETURNS TABLE (
  jugador_id UUID,
  jugador_nombre VARCHAR,
  equipo_nombre VARCHAR,
  total_goles BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id AS jugador_id,
    CONCAT(j.primer_apellido, ' ', j.primer_nombre) AS jugador_nombre,
    e.nombre AS equipo_nombre,
    COUNT(g.id) AS total_goles
  FROM jugadores j
  JOIN equipos e ON j.equipo_id = e.id
  LEFT JOIN goles g ON j.id = g.jugador_id
  JOIN partidos p ON g.partido_id = p.id
  WHERE e.torneo_id = torneo_uuid
    AND p.completado = true
    AND g.autogol = false
  GROUP BY j.id, e.nombre
  HAVING COUNT(g.id) > 0
  ORDER BY total_goles DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
```

### 4. Row Level Security (RLS)

```sql
-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE torneos ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones_pago ENABLE ROW LEVEL SECURITY;

-- Políticas para torneos
CREATE POLICY "Torneos activos visibles para todos"
ON torneos FOR SELECT
USING (activo = true OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Solo admins crean torneos"
ON torneos FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Solo admins editan torneos"
ON torneos FOR UPDATE
USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas para equipos
CREATE POLICY "Equipos visibles para todos autenticados"
ON equipos FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins y dirigentes pueden crear equipos"
ON equipos FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.uid()::text = (SELECT user_id FROM dirigentes WHERE id = dirigente_id)
);

-- Políticas para jugadores
CREATE POLICY "Jugadores visibles para todos autenticados"
ON jugadores FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Solo admins y dirigente del equipo editan jugadores"
ON jugadores FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.uid()::text = (
    SELECT d.user_id
    FROM equipos e
    JOIN dirigentes d ON e.dirigente_id = d.id
    WHERE e.id = equipo_id
  )
);

-- Políticas para transacciones (solo admin)
CREATE POLICY "Solo admins ven transacciones"
ON transacciones_pago FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Solo admins crean transacciones"
ON transacciones_pago FOR INSERT
TO authenticated
WITH CHECK (auth.jwt() ->> 'role' = 'admin');
```

---

## 🔧 Stack Tecnológico Detallado

```json
{
  "frontend": {
    "framework": "Next.js 14.2+",
    "language": "TypeScript 5.4+",
    "ui": {
      "components": "shadcn/ui",
      "styling": "Tailwind CSS 3.4+",
      "icons": "lucide-react",
      "animations": "framer-motion"
    },
    "forms": {
      "library": "react-hook-form",
      "validation": "zod"
    },
    "state": {
      "server": "TanStack Query (React Query)",
      "client": "Zustand (opcional)",
      "url": "nuqs (next-usequerystate)"
    },
    "tables": "TanStack Table",
    "charts": "recharts"
  },
  "backend": {
    "runtime": "Next.js API Routes / Server Actions",
    "database": "Supabase PostgreSQL 15",
    "orm": "Supabase JS Client",
    "auth": "Supabase Auth",
    "storage": "Supabase Storage",
    "realtime": "Supabase Realtime",
    "edge_functions": "Supabase Edge Functions (Deno)"
  },
  "deployment": {
    "frontend": "Vercel",
    "database": "Supabase Cloud",
    "cdn": "Vercel Edge Network",
    "analytics": "Vercel Analytics"
  },
  "development": {
    "testing": {
      "unit": "Vitest",
      "e2e": "Playwright",
      "component": "@testing-library/react"
    },
    "linting": "ESLint",
    "formatting": "Prettier",
    "types": "TypeScript + Supabase CLI (types generation)"
  },
  "monitoring": {
    "errors": "Sentry (opcional)",
    "analytics": "Vercel Analytics / PostHog",
    "logging": "Console / Axiom"
  }
}
```

---

## 📦 Dependencies (package.json)

```json
{
  "name": "goolstar-nextjs",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "supabase:gen-types": "supabase gen types typescript --local > types/database.ts",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/supabase-js": "^2.43.0",
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "@tanstack/react-query": "^5.40.0",
    "@tanstack/react-table": "^8.17.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.6.0",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.379.0",
    "recharts": "^2.12.0",
    "nuqs": "^1.17.0",
    "sonner": "^1.4.0",
    "framer-motion": "^11.2.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.14",
    "supabase": "^1.167.0",
    "vitest": "^1.6.0",
    "@testing-library/react": "^15.0.0",
    "@playwright/test": "^1.44.0"
  }
}
```

---

## 🔐 Variables de Entorno (.env.example)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Supabase Local (opcional para desarrollo)
NEXT_PUBLIC_SUPABASE_URL_LOCAL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY_LOCAL=your-local-anon-key

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Analytics (opcional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Sentry (opcional)
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_SENTRY_DSN=
```

---

## 🚀 Guía de Implementación por Fases

### **Fase 1: Setup Inicial (1-2 días)**

**Objetivos**:
- Proyecto Next.js configurado
- Supabase proyecto creado
- Autenticación funcionando

**Tareas**:
1. Crear proyecto Next.js con TypeScript
   ```bash
   npx create-next-app@latest goolstar-nextjs --typescript --tailwind --app
   ```

2. Instalar dependencias base
   ```bash
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
   npm install @tanstack/react-query zod react-hook-form @hookform/resolvers
   npm install -D supabase
   ```

3. Inicializar Supabase
   ```bash
   supabase init
   supabase start
   ```

4. Configurar autenticación
   - Crear `lib/supabase/client.ts`
   - Crear `lib/supabase/server.ts`
   - Crear middleware de auth

5. Configurar shadcn/ui
   ```bash
   npx shadcn-ui@latest init
   ```

**Entregables**:
- Proyecto funcionando en localhost:3000
- Login/Register funcional
- Dashboard básico protegido

---

### **Fase 2: Schema y Migraciones (2-3 días)**

**Objetivos**:
- Base de datos completa
- Triggers funcionando
- RLS configurado

**Tareas**:
1. Crear migraciones SQL
   ```bash
   supabase migration new initial_schema
   ```

2. Ejecutar migraciones en orden:
   - `001_initial_schema.sql` - Extensiones y enums
   - `002_categorias_torneos.sql` - Tablas base
   - `003_equipos_jugadores.sql` - Participantes
   - `004_partidos_competicion.sql` - Competición
   - `005_estadisticas.sql` - Estadísticas
   - `006_financiero.sql` - Transacciones
   - `007_triggers.sql` - Triggers automáticos
   - `008_functions.sql` - Functions SQL
   - `009_rls_policies.sql` - Políticas de seguridad
   - `010_indexes.sql` - Índices de performance

3. Generar tipos TypeScript
   ```bash
   npm run supabase:gen-types
   ```

4. Seed de datos de prueba
   ```bash
   supabase db seed
   ```

**Entregables**:
- Base de datos completa en Supabase
- Tipos TypeScript generados
- Datos de prueba cargados

---

### **Fase 3: CRUD Básico (3-4 días)**

**Objetivos**:
- CRUD completo de Torneos
- CRUD completo de Equipos
- CRUD completo de Jugadores

**Tareas**:
1. **Torneos**:
   - Crear validaciones Zod (`lib/validations/torneo.ts`)
   - API Routes (`app/api/torneos/route.ts`)
   - Server Actions (`actions/torneos.ts`)
   - Componentes (TorneoForm, TorneoCard, TorneoList)
   - Páginas (lista, detalle, crear, editar)

2. **Equipos**:
   - Similar a Torneos
   - Agregar upload de logo

3. **Jugadores**:
   - Similar a anteriores
   - Upload de foto
   - Upload de documentos

**Entregables**:
- CRUD completo de Torneos, Equipos, Jugadores
- Formularios con validación
- Listados con paginación

---

### **Fase 4: Gestión de Partidos (3-4 días)**

**Objetivos**:
- CRUD de partidos
- Registro de goles y tarjetas
- Actualización de estadísticas automática

**Tareas**:
1. Crear partidos con validación de equipos
2. Registro de resultado
3. Goles por jugador
4. Tarjetas (amarillas/rojas)
5. Cambios de jugador
6. Acta de partido

**Entregables**:
- Partidos funcionando end-to-end
- Estadísticas actualizándose automáticamente
- Acta de partido imprimible

---

### **Fase 5: Tabla de Posiciones y Estadísticas (2-3 días)**

**Objetivos**:
- Tabla de posiciones en tiempo real
- Estadísticas del torneo
- Jugadores destacados

**Tareas**:
1. Usar function SQL `get_tabla_posiciones()`
2. Implementar realtime con Supabase
3. Gráficos con recharts
4. Filtros por grupo

**Entregables**:
- Tabla de posiciones live
- Estadísticas detalladas
- Top goleadores

---

### **Fase 6: Sistema Financiero (2-3 días)**

**Objetivos**:
- Gestión de pagos
- Cálculo de deudas
- Historial de transacciones

**Tareas**:
1. Registro de abonos
2. Pago de multas
3. Pago de árbitros
4. Dashboard financiero

**Entregables**:
- Sistema de pagos completo
- Reportes financieros
- Balance por equipo

---

### **Fase 7: Admin Panel (2-3 días)**

**Objetivos**:
- Verificación de documentos
- Gestión de usuarios
- Configuración del sistema

**Tareas**:
1. Lista de documentos pendientes
2. Aprobar/rechazar documentos
3. Gestión de roles
4. Configuración de categorías

**Entregables**:
- Admin dashboard funcional
- Sistema de verificación de documentos
- Gestión de usuarios

---

### **Fase 8: Testing y Deploy (2-3 días)**

**Objetivos**:
- Tests E2E con Playwright
- Deploy a producción
- Monitoring configurado

**Tareas**:
1. Tests E2E críticos
2. Deploy a Vercel
3. Configurar Supabase producción
4. Monitoring con Sentry

**Entregables**:
- App en producción
- Tests pasando
- Monitoring activo

---

## 📊 Estimación de Tiempo Total

| Fase | Duración | Acumulado |
|------|----------|-----------|
| Setup Inicial | 1-2 días | 2 días |
| Schema y Migraciones | 2-3 días | 5 días |
| CRUD Básico | 3-4 días | 9 días |
| Gestión de Partidos | 3-4 días | 13 días |
| Tabla y Estadísticas | 2-3 días | 16 días |
| Sistema Financiero | 2-3 días | 19 días |
| Admin Panel | 2-3 días | 22 días |
| Testing y Deploy | 2-3 días | 25 días |

**Total estimado**: **4-5 semanas** (20-25 días hábiles)

---

## 💰 Costos Estimados

### **Desarrollo (Freelancer)**
- **1 desarrollador full-stack**: $25-50/hora
- **25 días × 8 horas**: 200 horas
- **Total**: $5,000 - $10,000 USD

### **Infraestructura (Mensual)**

**Tier Gratuito** (suficiente para MVP):
```
Vercel Hobby: $0/mes
Supabase Free: $0/mes
  - 500MB database
  - 1GB storage
  - 2GB bandwidth
  - 50,000 usuarios activos/mes
Total: $0/mes
```

**Tier Producción** (100-500 usuarios activos):
```
Vercel Pro: $20/mes
Supabase Pro: $25/mes
  - 8GB database
  - 100GB storage
  - 250GB bandwidth
Total: $45/mes
```

**Tier Escalado** (500-5000 usuarios):
```
Vercel Team: $20/mes + $20/miembro
Supabase Team: $599/mes
  - 32GB database
  - Soporte prioritario
Total: $619-639/mes
```

---

## 🎯 Ventajas vs Django Actual

| Aspecto | Django | Next.js + Supabase | Ganancia |
|---------|--------|-------------------|----------|
| **Desarrollo** | 6-8 semanas | 4-5 semanas | ⚡ **25% más rápido** |
| **Costo mensual** | $15-160 | $0-45 | 💰 **70% más barato** |
| **Lenguaje** | Python + JS | TypeScript | 🎯 **1 lenguaje** |
| **Realtime** | Requiere Channels | Nativo | ✅ **Out-of-the-box** |
| **Admin** | Django Admin | Custom build | ⚠️ **Requiere desarrollo** |
| **Deploy** | Docker + Fly.io | Git push | 🚀 **Más simple** |
| **Migraciones** | Automáticas | SQL manual | ⚠️ **Más manual** |
| **Auth** | Custom JWT | Supabase Auth | ✅ **Más simple** |
| **Storage** | Cloudinary | Supabase Storage | ✅ **Integrado** |
| **ORM** | Django ORM | PostgREST | ⚠️ **Menos potente** |

---

## ✅ Checklist de Implementación

### Pre-requisitos
- [ ] Node.js 18+ instalado
- [ ] Cuenta de Vercel
- [ ] Cuenta de Supabase
- [ ] Git configurado
- [ ] Editor con TypeScript support

### Setup
- [ ] Proyecto Next.js creado
- [ ] Dependencias instaladas
- [ ] Supabase CLI instalado
- [ ] Variables de entorno configuradas
- [ ] shadcn/ui inicializado

### Database
- [ ] Proyecto Supabase creado
- [ ] Migraciones ejecutadas
- [ ] Triggers funcionando
- [ ] RLS configurado
- [ ] Seed data cargado
- [ ] Tipos TypeScript generados

### Features
- [ ] Autenticación (login/register)
- [ ] CRUD Torneos
- [ ] CRUD Equipos
- [ ] CRUD Jugadores
- [ ] CRUD Partidos
- [ ] Goles y Tarjetas
- [ ] Tabla de posiciones
- [ ] Sistema financiero
- [ ] Upload de documentos
- [ ] Admin panel
- [ ] Realtime updates

### Testing
- [ ] Tests E2E principales flujos
- [ ] Tests de autenticación
- [ ] Tests de CRUD
- [ ] Performance testing

### Deploy
- [ ] Deploy Vercel
- [ ] Supabase producción
- [ ] Variables de entorno configuradas
- [ ] DNS configurado
- [ ] SSL funcionando
- [ ] Monitoring configurado

---

## 📚 Recursos Útiles

### Documentación
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zod](https://zod.dev/)

### Tutoriales
- [Next.js + Supabase Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

### Ejemplos
- [Next.js Commerce](https://vercel.com/templates/next.js/nextjs-commerce)
- [Supabase Examples](https://github.com/supabase/supabase/tree/master/examples)

---

## 🔄 Migración desde Django (Opcional)

Si deseas migrar datos del sistema Django actual:

### 1. Export desde Django
```python
# management/command/export_to_json.py
python manage.py dumpdata api --indent 2 > data.json
```

### 2. Transform Script
```typescript
// scripts/migrate-from-django.ts
// Convertir data.json a formato Supabase
```

### 3. Import a Supabase
```sql
-- Usar COPY o supabase seed
```

---

## 🎉 Resultado Final

Un sistema moderno, rápido y económico con:
- ✅ **Realtime** para tabla de posiciones live
- ✅ **TypeScript** end-to-end
- ✅ **Deploy automático** con git push
- ✅ **Costos bajos** ($0-45/mes vs $15-160/mes)
- ✅ **DX moderno** con Next.js 14
- ✅ **Auth robusto** con Supabase
- ✅ **Escalabilidad** automática serverless

---

**Fecha de creación**: 2025-01-20
**Versión**: 1.0
**Autor**: Basado en GoolStar Django Backend
**Stack**: Next.js 14 + Supabase + TypeScript