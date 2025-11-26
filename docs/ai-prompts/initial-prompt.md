# Prompt para IA: Construcción de GoolStar con Next.js + Supabase

**Instrucciones**: Copia y pega este prompt completo en ChatGPT, Claude, o cualquier IA de desarrollo. El prompt contiene todo el contexto necesario para que la IA te ayude a construir el proyecto.

---

## 📋 PROMPT PRINCIPAL

```
Eres un experto desarrollador full-stack especializado en Next.js 14, TypeScript, Supabase y PostgreSQL.
Tu tarea es ayudarme a construir "GoolStar", un sistema de gestión de torneos deportivos (fútbol indoor).

# CONTEXTO DEL PROYECTO

## Qué es GoolStar

GoolStar es un sistema completo para gestionar torneos de fútbol indoor que incluye:

1. **Gestión de Torneos**: Crear torneos con categorías (VARONES, DAMAS, MÁSTER), fase de grupos y eliminación directa
2. **Gestión de Equipos**: Equipos con dirigentes, logos, colores, y asignación a grupos
3. **Gestión de Jugadores**: Registro de jugadores con documentos de identidad (upload a storage)
4. **Gestión de Partidos**: Programación de partidos, registro de resultados, goles, tarjetas
5. **Tabla de Posiciones**: Cálculo automático de estadísticas (puntos, goles favor/contra, diferencia)
6. **Sistema Financiero**: Pagos de inscripción, multas por tarjetas, pagos a árbitros
7. **Sistema de Suspensiones**: Tarjetas amarillas (3 = 1 partido suspendido), rojas (2 partidos)
8. **Realtime**: Tabla de posiciones y resultados actualizándose en tiempo real

## Stack Tecnológico

**Frontend + Backend**:
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query (React Query)
- Zod + React Hook Form

**Base de Datos y Backend**:
- Supabase PostgreSQL
- Supabase Auth (JWT)
- Supabase Storage (documentos y logos)
- Supabase Realtime (WebSockets)
- Database Triggers (actualización automática de estadísticas)
- SQL Functions (consultas complejas)

**Deploy**:
- Vercel (frontend + API routes)
- Supabase Cloud (database)

# SCHEMA DE BASE DE DATOS

## Tablas Principales

### 1. CATEGORIAS
```sql
CREATE TABLE categorias (
  id UUID PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,
  premio_primero DECIMAL(8,2),
  premio_segundo DECIMAL(8,2),
  premio_tercero DECIMAL(8,2),
  premio_cuarto DECIMAL(8,2),
  costo_inscripcion DECIMAL(8,2),
  costo_arbitraje DECIMAL(6,2) DEFAULT 10.00,
  multa_amarilla DECIMAL(6,2) DEFAULT 2.00,
  multa_roja DECIMAL(6,2) DEFAULT 3.00,
  limite_inasistencias SMALLINT DEFAULT 3,
  limite_amarillas_suspension SMALLINT DEFAULT 3,
  partidos_suspension_roja SMALLINT DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Ejemplos de categorías:
- VARONES (masculino)
- DAMAS (femenino)
- MÁSTER (mayores de 35 años)

### 2. TORNEOS
```sql
CREATE TABLE torneos (
  id UUID PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria_id UUID REFERENCES categorias(id),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  activo BOOLEAN DEFAULT true,
  finalizado BOOLEAN DEFAULT false,
  tiene_fase_grupos BOOLEAN DEFAULT true,
  tiene_eliminacion_directa BOOLEAN DEFAULT true,
  numero_grupos SMALLINT DEFAULT 2,
  equipos_clasifican_por_grupo SMALLINT DEFAULT 2,
  fase_actual VARCHAR(20) DEFAULT 'inscripcion',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Estados de fase_actual:
- 'inscripcion' → 'grupos' → 'octavos' → 'cuartos' → 'semifinales' → 'final' → 'finalizado'

### 3. EQUIPOS
```sql
CREATE TABLE equipos (
  id UUID PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria_id UUID REFERENCES categorias(id),
  torneo_id UUID REFERENCES torneos(id),
  dirigente_id UUID REFERENCES dirigentes(id),
  logo_url TEXT,
  color_principal VARCHAR(20),
  color_secundario VARCHAR(20),
  nivel ENUM('1','2','3','4','5') DEFAULT '3',
  activo BOOLEAN DEFAULT true,
  estado VARCHAR(15) DEFAULT 'activo', -- 'activo', 'retirado', 'suspendido'
  grupo VARCHAR(1), -- 'A', 'B', 'C', 'D'
  inasistencias SMALLINT DEFAULT 0,
  excluido_por_inasistencias BOOLEAN DEFAULT false,
  clasificado_fase_grupos BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(nombre, categoria_id, torneo_id)
);
```

### 4. JUGADORES
```sql
CREATE TABLE jugadores (
  id UUID PRIMARY KEY,
  equipo_id UUID REFERENCES equipos(id),
  primer_nombre VARCHAR(100) NOT NULL,
  segundo_nombre VARCHAR(100),
  primer_apellido VARCHAR(100) NOT NULL,
  segundo_apellido VARCHAR(100),
  cedula VARCHAR(20),
  fecha_nacimiento DATE,
  numero_dorsal SMALLINT CHECK (numero_dorsal BETWEEN 1 AND 99),
  posicion VARCHAR(50),
  nivel ENUM('1','2','3','4','5') DEFAULT '3',
  foto_url TEXT,
  activo_segunda_fase BOOLEAN DEFAULT true,
  suspendido BOOLEAN DEFAULT false,
  partidos_suspension_restantes SMALLINT DEFAULT 0,
  fecha_fin_suspension DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX unique_cedula_equipo ON jugadores(cedula, equipo_id) WHERE cedula IS NOT NULL;
CREATE UNIQUE INDEX unique_equipo_dorsal ON jugadores(equipo_id, numero_dorsal) WHERE numero_dorsal IS NOT NULL;
```

### 5. JUGADOR_DOCUMENTOS
```sql
CREATE TABLE jugador_documentos (
  id UUID PRIMARY KEY,
  jugador_id UUID REFERENCES jugadores(id),
  tipo_documento VARCHAR(20) NOT NULL, -- 'dni_frontal', 'dni_posterior', 'cedula_frontal', etc.
  archivo_url TEXT NOT NULL, -- URL en Supabase Storage
  estado_verificacion VARCHAR(15) DEFAULT 'pendiente', -- 'pendiente', 'verificado', 'rechazado'
  verificado_por UUID REFERENCES auth.users(id),
  fecha_verificacion TIMESTAMPTZ,
  comentarios_verificacion TEXT,
  tamaño_archivo INTEGER,
  formato_archivo VARCHAR(10),
  fecha_subida TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. PARTIDOS
```sql
CREATE TABLE partidos (
  id UUID PRIMARY KEY,
  torneo_id UUID REFERENCES torneos(id),
  jornada_id UUID REFERENCES jornadas(id),
  fase_eliminatoria_id UUID REFERENCES fases_eliminatorias(id),
  equipo_1_id UUID REFERENCES equipos(id),
  equipo_2_id UUID REFERENCES equipos(id),
  arbitro_id UUID REFERENCES arbitros(id),
  fecha TIMESTAMPTZ NOT NULL,
  cancha VARCHAR(100),
  completado BOOLEAN DEFAULT false,
  goles_equipo_1 SMALLINT DEFAULT 0,
  goles_equipo_2 SMALLINT DEFAULT 0,
  victoria_por_default VARCHAR(20), -- '', 'retiro', 'inasistencia', 'sancion'
  es_eliminatorio BOOLEAN DEFAULT false,
  penales_equipo_1 SMALLINT,
  penales_equipo_2 SMALLINT,
  inasistencia_equipo_1 BOOLEAN DEFAULT false,
  inasistencia_equipo_2 BOOLEAN DEFAULT false,
  equipo_1_pago_arbitro BOOLEAN DEFAULT false,
  equipo_2_pago_arbitro BOOLEAN DEFAULT false,
  observaciones TEXT,
  acta_firmada BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (equipo_1_id != equipo_2_id)
);
```

### 7. GOLES
```sql
CREATE TABLE goles (
  id UUID PRIMARY KEY,
  partido_id UUID REFERENCES partidos(id),
  jugador_id UUID REFERENCES jugadores(id),
  minuto SMALLINT,
  autogol BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8. TARJETAS
```sql
CREATE TABLE tarjetas (
  id UUID PRIMARY KEY,
  partido_id UUID REFERENCES partidos(id),
  jugador_id UUID REFERENCES jugadores(id),
  tipo VARCHAR(10) NOT NULL, -- 'AMARILLA', 'ROJA'
  minuto SMALLINT,
  motivo VARCHAR(200),
  pagada BOOLEAN DEFAULT false,
  fecha_pago TIMESTAMPTZ,
  suspension_cumplida BOOLEAN DEFAULT false,
  fecha TIMESTAMPTZ DEFAULT NOW()
);
```

### 9. ESTADISTICA_EQUIPO
```sql
CREATE TABLE estadistica_equipo (
  id UUID PRIMARY KEY,
  equipo_id UUID UNIQUE REFERENCES equipos(id),
  torneo_id UUID REFERENCES torneos(id),
  partidos_jugados SMALLINT DEFAULT 0,
  partidos_ganados SMALLINT DEFAULT 0,
  partidos_empatados SMALLINT DEFAULT 0,
  partidos_perdidos SMALLINT DEFAULT 0,
  goles_favor SMALLINT DEFAULT 0,
  goles_contra SMALLINT DEFAULT 0,
  diferencia_goles INTEGER DEFAULT 0,
  puntos SMALLINT DEFAULT 0,
  tarjetas_amarillas SMALLINT DEFAULT 0,
  tarjetas_rojas SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(equipo_id, torneo_id)
);
```

### 10. TRANSACCIONES_PAGO
```sql
CREATE TABLE transacciones_pago (
  id UUID PRIMARY KEY,
  equipo_id UUID REFERENCES equipos(id),
  partido_id UUID REFERENCES partidos(id),
  tipo VARCHAR(20) NOT NULL, -- 'abono_inscripcion', 'pago_arbitro', 'multa_amarilla', 'multa_roja', etc.
  monto DECIMAL(8,2) NOT NULL CHECK (monto >= 0),
  es_ingreso BOOLEAN DEFAULT false,
  concepto VARCHAR(100) NOT NULL,
  metodo_pago VARCHAR(20) DEFAULT 'efectivo',
  referencia_pago VARCHAR(100),
  tarjeta_id UUID REFERENCES tarjetas(id),
  observaciones TEXT,
  fecha TIMESTAMPTZ DEFAULT NOW()
);
```

## TRIGGERS CRÍTICOS (Lógica Automática)

### Trigger 1: Actualizar estadísticas cuando se completa un partido

```sql
CREATE OR REPLACE FUNCTION actualizar_estadisticas_partido()
RETURNS TRIGGER AS $$
BEGIN
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
      partidos_ganados = partidos_ganados + CASE WHEN NEW.goles_equipo_1 > NEW.goles_equipo_2 THEN 1 ELSE 0 END,
      partidos_empatados = partidos_empatados + CASE WHEN NEW.goles_equipo_1 = NEW.goles_equipo_2 THEN 1 ELSE 0 END,
      partidos_perdidos = partidos_perdidos + CASE WHEN NEW.goles_equipo_1 < NEW.goles_equipo_2 THEN 1 ELSE 0 END
    WHERE equipo_id = NEW.equipo_1_id;

    -- Actualizar estadísticas equipo 2 (lógica inversa)
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
      partidos_ganados = partidos_ganados + CASE WHEN NEW.goles_equipo_2 > NEW.goles_equipo_1 THEN 1 ELSE 0 END,
      partidos_empatados = partidos_empatados + CASE WHEN NEW.goles_equipo_2 = NEW.goles_equipo_1 THEN 1 ELSE 0 END,
      partidos_perdidos = partidos_perdidos + CASE WHEN NEW.goles_equipo_2 < NEW.goles_equipo_1 THEN 1 ELSE 0 END
    WHERE equipo_id = NEW.equipo_2_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_estadisticas
AFTER UPDATE ON partidos
FOR EACH ROW
EXECUTE FUNCTION actualizar_estadisticas_partido();
```

### Trigger 2: Suspender jugador por tarjeta roja

```sql
CREATE OR REPLACE FUNCTION suspender_por_tarjeta_roja()
RETURNS TRIGGER AS $$
DECLARE
  partidos_suspension SMALLINT;
BEGIN
  IF NEW.tipo = 'ROJA' THEN
    SELECT c.partidos_suspension_roja INTO partidos_suspension
    FROM jugadores j
    JOIN equipos e ON j.equipo_id = e.id
    JOIN categorias c ON e.categoria_id = c.id
    WHERE j.id = NEW.jugador_id;

    UPDATE jugadores
    SET suspendido = true, partidos_suspension_restantes = partidos_suspension
    WHERE id = NEW.jugador_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_suspender_por_roja
AFTER INSERT ON tarjetas
FOR EACH ROW
EXECUTE FUNCTION suspender_por_tarjeta_roja();
```

### Trigger 3: Verificar acumulación de amarillas (3 amarillas = 1 partido suspendido)

```sql
CREATE OR REPLACE FUNCTION verificar_amarillas_acumuladas()
RETURNS TRIGGER AS $$
DECLARE
  limite_amarillas SMALLINT;
  total_amarillas INTEGER;
BEGIN
  IF NEW.tipo = 'AMARILLA' THEN
    SELECT c.limite_amarillas_suspension INTO limite_amarillas
    FROM jugadores j
    JOIN equipos e ON j.equipo_id = e.id
    JOIN categorias c ON e.categoria_id = c.id
    WHERE j.id = NEW.jugador_id;

    SELECT COUNT(*) INTO total_amarillas
    FROM tarjetas
    WHERE jugador_id = NEW.jugador_id
      AND tipo = 'AMARILLA'
      AND suspension_cumplida = false;

    IF total_amarillas >= limite_amarillas THEN
      UPDATE jugadores
      SET suspendido = true, partidos_suspension_restantes = 1
      WHERE id = NEW.jugador_id;

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
```

### Trigger 4: Crear estadística al crear equipo

```sql
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

## FUNCTIONS SQL (Consultas Complejas)

### Function 1: Obtener tabla de posiciones

```sql
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
    e.id, e.nombre, e.logo_url, e.grupo,
    ee.partidos_jugados, ee.partidos_ganados, ee.partidos_empatados, ee.partidos_perdidos,
    ee.goles_favor, ee.goles_contra, ee.diferencia_goles, ee.puntos
  FROM equipos e
  JOIN estadistica_equipo ee ON e.id = ee.equipo_id
  WHERE e.torneo_id = torneo_uuid AND e.activo = true
  ORDER BY e.grupo, ee.puntos DESC, ee.diferencia_goles DESC, ee.goles_favor DESC;
END;
$$ LANGUAGE plpgsql;
```

### Function 2: Calcular deuda de equipo

```sql
CREATE OR REPLACE FUNCTION calcular_deuda_equipo(equipo_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_inscripcion DECIMAL;
  total_abonos DECIMAL;
  deuda_multas DECIMAL;
BEGIN
  -- Costo de inscripción
  SELECT c.costo_inscripcion INTO total_inscripcion
  FROM equipos e JOIN categorias c ON e.categoria_id = c.id
  WHERE e.id = equipo_uuid;

  -- Abonos realizados
  SELECT COALESCE(SUM(monto), 0) INTO total_abonos
  FROM transacciones_pago
  WHERE equipo_id = equipo_uuid AND tipo = 'abono_inscripcion' AND es_ingreso = true;

  -- Multas pendientes
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
  WHERE e.id = equipo_uuid AND t.pagada = false;

  RETURN (total_inscripcion + deuda_multas) - total_abonos;
END;
$$ LANGUAGE plpgsql;
```

### Function 3: Top goleadores del torneo

```sql
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
    j.id,
    CONCAT(j.primer_apellido, ' ', j.primer_nombre) AS jugador_nombre,
    e.nombre AS equipo_nombre,
    COUNT(g.id) AS total_goles
  FROM jugadores j
  JOIN equipos e ON j.equipo_id = e.id
  LEFT JOIN goles g ON j.id = g.jugador_id
  JOIN partidos p ON g.partido_id = p.id
  WHERE e.torneo_id = torneo_uuid AND p.completado = true AND g.autogol = false
  GROUP BY j.id, e.nombre
  HAVING COUNT(g.id) > 0
  ORDER BY total_goles DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
```

## REGLAS DE NEGOCIO IMPORTANTES

### 1. Sistema de Puntos
- Victoria: 3 puntos
- Empate: 1 punto
- Derrota: 0 puntos

### 2. Criterios de Desempate (en orden)
1. Puntos totales
2. Diferencia de goles
3. Goles a favor
4. (Si aún empatan: resultado directo entre equipos)

### 3. Suspensiones
- **Tarjeta Roja**: Suspensión automática de 2 partidos (configurable por categoría)
- **Tarjetas Amarillas**: Acumulación de 3 amarillas = 1 partido suspendido (se resetean después)
- Un jugador suspendido NO puede participar en el siguiente partido

### 4. Inasistencias
- Si un equipo NO se presenta a un partido:
    - Se marca inasistencia
    - Se da victoria por default 3-0 al equipo contrario
    - Se incrementa contador de inasistencias del equipo
    - Si llega a 3 inasistencias → equipo EXCLUIDO del torneo

### 5. Validaciones de Partido
- Mínimo 4 jugadores por equipo para iniciar
- Máximo 3 cambios por equipo
- Un jugador suspendido no puede ser titular ni suplente

### 6. Fases del Torneo
**Fase de Grupos**:
- Equipos divididos en grupos (A, B, C, D)
- Todos contra todos dentro del grupo
- Clasifican los N mejores de cada grupo (configurable)

**Fase Eliminatoria**:
- Formato de eliminación directa
- Si hay empate en tiempo normal → penales
- No hay partido de vuelta (partido único)

### 7. Sistema Financiero
- **Inscripción**: Cada equipo debe pagar costo de inscripción (configurable por categoría)
- **Multas**: Tarjetas generan multas automáticas (amarilla: $2, roja: $3 - configurable)
- **Arbitraje**: Cada equipo paga la mitad del costo de arbitraje por partido
- **Deuda**: Un equipo puede tener deuda pendiente pero debe pagar antes de final del torneo

## ESTRUCTURA DEL PROYECTO NEXT.JS

```
goolstar-nextjs/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── torneos/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   ├── [id]/tabla/page.tsx
│   │   │   └── nuevo/page.tsx
│   │   ├── equipos/
│   │   ├── jugadores/
│   │   ├── partidos/
│   │   └── financiero/
│   ├── api/
│   │   ├── torneos/route.ts
│   │   ├── equipos/route.ts
│   │   └── partidos/route.ts
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn)
│   ├── torneos/
│   ├── equipos/
│   └── partidos/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── validations/
│       ├── torneo.ts
│       └── equipo.ts
├── actions/
│   ├── torneos.ts
│   └── equipos.ts
└── supabase/
    ├── migrations/
    └── functions/
```

## EJEMPLOS DE CÓDIGO

### Cliente Supabase (lib/supabase/client.ts)

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export const createClient = () => createClientComponentClient<Database>()
```

### Server Client (lib/supabase/server.ts)

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

export const createClient = () => createServerComponentClient<Database>({ cookies })
```

### Validación Zod (lib/validations/torneo.ts)

```typescript
import { z } from 'zod'

export const torneoSchema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres').max(100),
  categoria_id: z.string().uuid('Categoría inválida'),
  fecha_inicio: z.coerce.date(),
  fecha_fin: z.coerce.date().optional(),
  numero_grupos: z.number().int().min(2).max(4),
  equipos_clasifican_por_grupo: z.number().int().min(1).max(4),
})

export type TorneoFormData = z.infer<typeof torneoSchema>
```

### Server Action (actions/torneos.ts)

```typescript
'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { torneoSchema } from '@/lib/validations/torneo'

export async function crearTorneo(formData: FormData) {
  const supabase = createServerActionClient({ cookies })

  // Validar datos
  const validated = torneoSchema.parse({
    nombre: formData.get('nombre'),
    categoria_id: formData.get('categoria_id'),
    fecha_inicio: formData.get('fecha_inicio'),
    fecha_fin: formData.get('fecha_fin'),
    numero_grupos: Number(formData.get('numero_grupos')),
    equipos_clasifican_por_grupo: Number(formData.get('equipos_clasifican_por_grupo')),
  })

  // Insertar en DB
  const { data, error } = await supabase
    .from('torneos')
    .insert(validated)
    .select()
    .single()

  if (error) throw error

  // Revalidar cache
  revalidatePath('/dashboard/torneos')

  return data
}
```

### API Route (app/api/torneos/[id]/tabla/route.ts)

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const revalidate = 300 // Cache 5 minutos

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  // Usar function SQL
  const { data, error } = await supabase
    .rpc('get_tabla_posiciones', { torneo_uuid: params.id })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

### Componente con Realtime (components/torneos/tabla-posiciones-live.tsx)

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function TablaPosicionesLive({ torneoId }: { torneoId: string }) {
  const [equipos, setEquipos] = useState([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Cargar datos iniciales
    fetchTabla()

    // Suscribirse a cambios
    const channel = supabase
      .channel('tabla-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'estadistica_equipo',
        },
        () => fetchTabla()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [torneoId])

  async function fetchTabla() {
    const { data } = await supabase.rpc('get_tabla_posiciones', {
      torneo_uuid: torneoId
    })
    setEquipos(data || [])
  }

  return (
    <div>
      {/* Renderizar tabla */}
    </div>
  )
}
```

# TU TAREA

Ayúdame a construir este proyecto paso a paso. Cuando te pida algo específico, considera:

1. **Contexto completo**: Tienes toda la información del schema, triggers, functions, y reglas de negocio arriba
2. **Best practices**: Usa Next.js 14 App Router, TypeScript, Server Actions cuando sea apropiado
3. **Performance**: Implementa caching con revalidate, usa React Query para client-side
4. **Seguridad**: Implementa Row Level Security en Supabase, valida datos con Zod
5. **UX**: Usa shadcn/ui para componentes, Tailwind para estilos
6. **Realtime**: Implementa Supabase Realtime donde tenga sentido (tabla de posiciones, partidos en vivo)

Estoy listo para empezar. ¿Por dónde quieres que comencemos?

Opciones sugeridas:
1. Setup inicial del proyecto
2. Crear el schema completo en Supabase
3. Implementar autenticación
4. CRUD de una entidad específica (ej: Torneos)
5. Implementar tabla de posiciones con realtime
6. Sistema de partidos y resultados
7. Otro (especifica)

Responde con el número de opción o describe qué quieres hacer primero.
```

---

## 📋 PROMPTS ESPECÍFICOS POR TAREA

### Prompt 1: Setup Inicial del Proyecto

```
Ayúdame a hacer el setup inicial completo del proyecto GoolStar con Next.js + Supabase.

Necesito:
1. Crear proyecto Next.js 14 con TypeScript y Tailwind
2. Instalar todas las dependencias necesarias (Supabase, TanStack Query, Zod, React Hook Form, shadcn/ui)
3. Configurar Supabase CLI local
4. Configurar variables de entorno
5. Inicializar shadcn/ui
6. Crear estructura de carpetas base
7. Configurar cliente de Supabase (client.ts y server.ts)

Dame los comandos exactos y los archivos de configuración necesarios.

Contexto: Usa el schema y estructura definidos en el PROMPT PRINCIPAL arriba.
```

### Prompt 2: Schema Completo de Supabase

```
Ayúdame a crear el schema completo de la base de datos en Supabase.

Necesito crear migraciones SQL para:
1. Extensiones necesarias (uuid-ossp)
2. Enums (nivel_enum)
3. Todas las tablas (categorias, torneos, equipos, jugadores, jugador_documentos, partidos, goles, tarjetas, estadistica_equipo, transacciones_pago, etc.)
4. Constraints e índices
5. Triggers para actualización automática de estadísticas
6. Triggers para suspensiones
7. Functions SQL (get_tabla_posiciones, calcular_deuda_equipo, get_jugadores_destacados)
8. Row Level Security policies básicas

Organiza las migraciones en archivos separados numerados (001_, 002_, etc.).

Contexto: Usa el schema definido en el PROMPT PRINCIPAL.
```

### Prompt 3: Autenticación Completa

```
Ayúdame a implementar autenticación completa con Supabase Auth.

Necesito:
1. Configurar Supabase Auth en el proyecto
2. Crear middleware para proteger rutas
3. Página de login con email/password
4. Página de registro
5. Logout functionality
6. Proteger rutas del dashboard
7. Redirect automático según estado de auth
8. Tipos TypeScript para el usuario

Incluye validación con Zod y manejo de errores.

Contexto: Usuario admin puede gestionar todo, usuario dirigente solo su equipo.
```

### Prompt 4: CRUD Completo de Torneos

```
Ayúdame a implementar el CRUD completo de Torneos con Next.js + Supabase.

Necesito:
1. Schema de validación con Zod
2. Server Actions (crear, editar, eliminar torneo)
3. API Route para listar torneos (con cache)
4. Componentes:
    - TorneoForm (crear/editar)
    - TorneoCard (mostrar torneo)
    - TorneoList (lista con filtros)
5. Páginas:
    - /dashboard/torneos (lista)
    - /dashboard/torneos/[id] (detalle)
    - /dashboard/torneos/nuevo (crear)
6. Filtros por categoría y estado (activo/finalizado)
7. Búsqueda por nombre

Usa shadcn/ui components, React Hook Form, y TanStack Query.

Contexto: Un torneo tiene categoría, fase de grupos, eliminación directa, etc. (ver schema en PROMPT PRINCIPAL).
```

### Prompt 5: Tabla de Posiciones con Realtime

```
Ayúdame a implementar la tabla de posiciones con actualización en tiempo real.

Necesito:
1. API Route que usa la function SQL get_tabla_posiciones()
2. Componente TablaPosiciones (versión estática con cache)
3. Componente TablaPosicionesLive (con Supabase Realtime)
4. Suscripción a cambios en estadistica_equipo
5. Filtros por grupo
6. Resaltar equipo del usuario (si es dirigente)
7. Responsive design con Tailwind

La tabla debe mostrar:
- Posición (#)
- Escudo y nombre del equipo
- PJ, PG, PE, PP, GF, GC, DIF, PTS
- Ordenar por: grupo, puntos DESC, diferencia_goles DESC, goles_favor DESC

Contexto: Las estadísticas se actualizan automáticamente por triggers cuando se completa un partido.
```

### Prompt 6: Sistema de Partidos Completo

```
Ayúdame a implementar el sistema completo de gestión de partidos.

Necesito:
1. CRUD de partidos (crear, editar, eliminar)
2. Registro de resultado (goles equipo 1, goles equipo 2)
3. Registro de goles por jugador (con minuto opcional)
4. Registro de tarjetas (amarillas/rojas) con auto-suspensión
5. Marcar partido como completado → trigger actualiza estadísticas automáticamente
6. Validaciones:
    - Equipos diferentes
    - Fecha futura para crear
    - Solo jugadores del equipo correcto pueden anotar goles
    - Solo jugadores NO suspendidos pueden jugar
7. Componentes:
    - PartidoForm
    - ResultadoInput
    - GolInput (select jugador + minuto)
    - TarjetaInput
8. Acta de partido (PDF o print view)

Contexto: Cuando un partido se completa, el trigger actualiza automáticamente las estadísticas de ambos equipos.
```

### Prompt 7: Sistema Financiero

```
Ayúdame a implementar el sistema financiero completo.

Necesito:
1. Cálculo automático de deuda de equipo usando function SQL calcular_deuda_equipo()
2. Registro de abonos
3. Registro automático de multas cuando se crea tarjeta
4. Historial de transacciones por equipo
5. Dashboard financiero:
    - Total ingresos
    - Total pendiente
    - Equipos con deuda
    - Transacciones recientes
6. Componentes:
    - TransaccionForm
    - BalanceCard
    - HistorialPagos
7. Filtros por tipo de transacción y rango de fechas

Contexto: Sistema de doble entrada donde es_ingreso indica si es ingreso (true) o egreso (false) para el torneo.
```

### Prompt 8: Upload de Documentos

```
Ayúdame a implementar el sistema de upload de documentos de jugadores con Supabase Storage.

Necesito:
1. Configurar bucket en Supabase Storage (public o private?)
2. Upload de documentos (DNI frontal/posterior, cédula, pasaporte)
3. Validación:
    - Formatos permitidos: JPG, PNG, PDF
    - Tamaño máximo: 5MB
    - MIME type verification
4. Componente DocumentoUpload con drag & drop
5. Vista previa de documentos
6. Admin puede verificar/rechazar documentos
7. Notificación al dirigente cuando se rechaza

Usa react-dropzone y validación con Zod.

Contexto: Cada jugador puede tener múltiples documentos, solo uno de cada tipo en estado pendiente/verificado.
```

### Prompt 9: Admin Panel

```
Ayúdame a crear el admin panel completo.

Necesito:
1. Dashboard con métricas:
    - Total torneos activos
    - Total equipos
    - Total jugadores
    - Ingresos del mes
2. Verificación de documentos pendientes
3. Gestión de usuarios (admins, dirigentes)
4. Configuración de categorías
5. Logs de actividad
6. Componentes:
    - MetricCard
    - DocumentoVerificacion
    - UserManagement

Solo usuarios con role='admin' pueden acceder (RLS).

Contexto: Admin tiene acceso total, dirigente solo a su equipo.
```

### Prompt 10: Deploy Completo

```
Ayúdame a hacer el deploy completo a producción.

Necesito:
1. Configurar Supabase proyecto en producción
2. Ejecutar migraciones en producción
3. Configurar variables de entorno en Vercel
4. Deploy a Vercel
5. Configurar dominio custom
6. SSL configuration
7. Monitoring con Sentry (opcional)
8. Analytics con Vercel Analytics

Dame la checklist completa y paso a paso.
```

---

## 💡 TIPS PARA USAR ESTOS PROMPTS

### 1. Copia el PROMPT PRINCIPAL primero
Cuando abras una nueva conversación con ChatGPT/Claude, pega primero el PROMPT PRINCIPAL completo. Esto da todo el contexto necesario.

### 2. Luego usa los prompts específicos
Después de dar el contexto, usa los prompts específicos según lo que necesites implementar.

### 3. Pide aclaraciones
Si la IA no entiende algo, pídele que se refiera al schema o reglas del PROMPT PRINCIPAL.

### 4. Itera
Puedes pedirle mejoras o cambios incrementales. Ejemplo:
```
"Ahora agrega manejo de errores a ese componente"
"Mejora la UI de ese formulario con animaciones"
"Optimiza esa query para mejor performance"
```

### 5. Pide explicaciones
Si no entiendes algo del código generado:
```
"Explícame cómo funciona ese trigger"
"¿Por qué usaste Server Action aquí en lugar de API Route?"
```

---

## 🔄 FLUJO RECOMENDADO

1. **Día 1-2**: Setup + Schema
   - Usar Prompt 1 (Setup Inicial)
   - Usar Prompt 2 (Schema Completo)
   - Usar Prompt 3 (Autenticación)

2. **Día 3-5**: CRUD Básico
   - Usar Prompt 4 (CRUD Torneos)
   - Adaptar para Equipos
   - Adaptar para Jugadores

3. **Día 6-8**: Partidos y Estadísticas
   - Usar Prompt 6 (Sistema de Partidos)
   - Usar Prompt 5 (Tabla de Posiciones)

4. **Día 9-10**: Financiero y Documentos
   - Usar Prompt 7 (Sistema Financiero)
   - Usar Prompt 8 (Upload Documentos)

5. **Día 11-12**: Admin y Refinamiento
   - Usar Prompt 9 (Admin Panel)
   - Pulir UI/UX

6. **Día 13**: Deploy
   - Usar Prompt 10 (Deploy Completo)

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de considerar el proyecto completo, verifica:

### Funcionalidades Core
- [ ] Login/Register funciona
- [ ] CRUD Torneos completo
- [ ] CRUD Equipos completo
- [ ] CRUD Jugadores completo
- [ ] CRUD Partidos completo
- [ ] Goles se registran correctamente
- [ ] Tarjetas activan suspensiones automáticas
- [ ] Tabla de posiciones se actualiza automáticamente
- [ ] Tabla de posiciones tiene realtime
- [ ] Sistema financiero calcula deudas correctamente
- [ ] Upload de documentos funciona
- [ ] Admin puede verificar documentos

### Performance
- [ ] Queries optimizadas (usa explain analyze)
- [ ] Cache implementado (revalidate en API routes)
- [ ] Lazy loading de imágenes
- [ ] Paginación en listados grandes

### Seguridad
- [ ] RLS configurado correctamente
- [ ] Validación Zod en todos los forms
- [ ] Sanitización de inputs
- [ ] Rate limiting (Supabase lo incluye)

### UX
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Responsive design
- [ ] Accesibilidad básica

### Deploy
- [ ] App funciona en producción
- [ ] Migraciones ejecutadas
- [ ] Variables de entorno configuradas
- [ ] SSL habilitado
- [ ] Monitoring activo

---

**Fecha de creación**: 2025-01-20
**Versión**: 1.0
**Proyecto**: GoolStar Next.js + Supabase
**Autor**: Basado en GoolStar Django Backend

---

¡Listo! Con estos prompts tienes todo lo necesario para que cualquier IA te ayude a construir el proyecto completo. Solo copia el PROMPT PRINCIPAL primero, luego usa los prompts específicos según lo que necesites. 🚀