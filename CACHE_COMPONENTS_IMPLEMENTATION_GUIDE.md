# Cache Components - Implementation Guide for GoolStar

**Guía práctica de implementación de Cache Components en GoolStar**

---

## 📋 Tabla de Contenidos

1. [Datos a Cachear vs No Cachear](#datos-a-cachear-vs-no-cachear)
2. [Estructura de Data Layer](#estructura-de-data-layer)
3. [Ejemplos Prácticos](#ejemplos-prácticos)
4. [Patrones Comunes](#patrones-comunes)
5. [Testing y Validación](#testing-y-validación)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Datos a Cachear vs No Cachear

### ✅ CACHEAR (Con `use cache`)

#### 1. Categorías
```typescript
// Motivo: Cambian muy raramente (solo admin)
// Frecuencia: Una vez por temporada
// Revalidación: Diaria

export async function getCategorias() {
  'use cache'
  cacheLife('days')

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre')

  if (error) throw error
  return data
}
```

#### 2. Torneos Activos
```typescript
// Motivo: Lista de torneos en juego (cambios infrecuentes)
// Frecuencia: Nueva cada semana aproximadamente
// Revalidación: Cada 6 horas

export async function getTorneos() {
  'use cache'
  cacheTag('torneos')
  cacheLife({
    stale: 300,        // 5 min en cliente
    revalidate: 21600, // 6 horas en servidor
    expire: 86400      // 1 día máximo
  })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('torneos')
    .select('*, categorias(nombre)')
    .eq('activo', true)
    .order('fecha_inicio', { ascending: false })

  if (error) throw error
  return data
}
```

#### 3. Equipos (en un torneo)
```typescript
// Motivo: Lista relativamente estática
// Frecuencia: Cambios al inicio/durante registro
// Revalidación: Cada 30 min

export async function getEquiposForTorneo(torneoId: string) {
  'use cache'
  cacheTag(`torneo_${torneoId}_equipos`)
  cacheLife('hours')

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('equipos')
    .select('*, jugadores(count)')
    .eq('torneo_id', torneoId)
    .order('nombre')

  if (error) throw error
  return data
}
```

#### 4. Tabla de Posiciones
```typescript
// Motivo: Generada a partir de partidos (se actualiza batch)
// Frecuencia: Actualiza cuando se registra un partido
// Revalidación: Cada 15 min + invalidación manual

export async function getTablaPosjciones(torneoId: string) {
  'use cache'
  cacheTag(`torneo_${torneoId}_tabla`)
  cacheLife({
    stale: 300,       // 5 min cliente
    revalidate: 900,  // 15 min servidor
    expire: 3600      // 1 hora máximo
  })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .rpc('get_team_standings', {
      torneo_id: torneoId
    })

  if (error) throw error
  return data
}
```

#### 5. Reglas del Sistema
```typescript
// Motivo: Configuración estática
// Frecuencia: Muy raramente
// Revalidación: Diaria

export async function getReglas() {
  'use cache'
  cacheLife('max')  // Cache máximo, solo invalida manualmente

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('configuracion')
    .select('*')

  if (error) throw error
  return data
}
```

---

### ❌ NO CACHEAR (Sin `use cache`)

#### 1. Documentos Pendientes
```typescript
// Motivo: CRÍTICO - Deben mostrarse inmediatamente
// Frecuencia: Pueden aparecer en cualquier momento
// Riesgo: Usuario espera a que se actualice = mala UX

export async function getDocumentosPendientes() {
  // SIN 'use cache' → Siempre dinámico
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('documentos')
    .select('*, jugadores(nombre), equipos(nombre)')
    .eq('estado', 'pendiente')
    .order('fecha_subida')

  if (error) throw error
  return data
}
```

#### 2. Transacciones Financieras
```typescript
// Motivo: CRÍTICO - Datos financieros
// Frecuencia: Pueden ocurrir en cualquier momento
// Riesgo: Perder transacción = problema crítico

export async function getTransacciones(equipoId?: string) {
  // SIN 'use cache' → Siempre fresco
  const supabase = createServerClient()
  let query = supabase
    .from('transacciones_pago')
    .select('*')
    .order('fecha', { ascending: false })

  if (equipoId) {
    query = query.eq('equipo_id', equipoId)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}
```

#### 3. Detalles de Partidos en Vivo
```typescript
// Motivo: CRÍTICO - Datos que cambian segundos
// Frecuencia: Constantemente durante el partido
// Riesgo: Usuario ve información desactualizada

export async function getPartidoDetalle(partidoId: string) {
  // SIN 'use cache' → Siempre dinámico
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('partidos')
    .select(`
      *,
      goles(*),
      tarjetas(*),
      cambios(*),
      equipo_1:equipos!equipo_1_id(*),
      equipo_2:equipos!equipo_2_id(*)
    `)
    .eq('id', partidoId)
    .single()

  if (error) throw error
  return data
}
```

#### 4. Jugadores Específicos del Usuario
```typescript
// Motivo: Datos sensibles/personales
// Frecuencia: Pueden cambiar en cualquier momento
// Riesgo: User info desactualizada

export async function getMisJugadores(userId: string) {
  // SIN 'use cache' → Siempre fresco
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('jugadores')
    .select('*')
    .eq('usuario_id', userId)

  if (error) throw error
  return data
}
```

#### 5. Tarjetas Activas (Suspensiones)
```typescript
// Motivo: CRÍTICO - Determina elegibilidad de jugadores
// Frecuencia: Se modifican durante partidos
// Riesgo: Jugador suspendido juega igualmente

export async function getTarjetasActivas(jugadorId: string) {
  // SIN 'use cache' → Siempre dinámico
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tarjetas')
    .select('*')
    .eq('jugador_id', jugadorId)
    .eq('activa', true)

  if (error) throw error
  return data
}
```

---

## 🏗️ Estructura de Data Layer

### Crear `lib/data.ts` (Archivo Principal)

```typescript
// lib/data.ts
import { cacheLife, cacheTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'

/**
 * ===========================================================================
 * CATEGORÍAS - Estáticas, cachear por días
 * ===========================================================================
 */

export async function getCategorias() {
  'use cache'
  cacheLife('days')

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre')

  if (error) throw new Error(`Failed to fetch categorías: ${error.message}`)
  return data || []
}

/**
 * ===========================================================================
 * TORNEOS - Semi-estáticos, cachear por horas
 * ===========================================================================
 */

export async function getTorneos() {
  'use cache'
  cacheTag('torneos')
  cacheLife('hours')

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('torneos')
    .select('*, categorias(nombre)')
    .eq('activo', true)
    .order('fecha_inicio', { ascending: false })

  if (error) throw new Error(`Failed to fetch torneos: ${error.message}`)
  return data || []
}

export async function getTorneoById(id: string) {
  'use cache'
  cacheTag('torneos', `torneo_${id}`)
  cacheLife('hours')

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('torneos')
    .select('*, categorias(*)')
    .eq('id', id)
    .single()

  if (error) throw new Error(`Failed to fetch torneo: ${error.message}`)
  return data
}

/**
 * ===========================================================================
 * EQUIPOS - Semi-estáticos, cachear por horas
 * ===========================================================================
 */

export async function getEquiposForTorneo(torneoId: string) {
  'use cache'
  cacheTag('torneos', `torneo_${torneoId}_equipos`)
  cacheLife('hours')

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('equipos')
    .select('*, jugadores(count)')
    .eq('torneo_id', torneoId)
    .order('nombre')

  if (error) throw new Error(`Failed to fetch equipos: ${error.message}`)
  return data || []
}

export async function getEquipoById(id: string) {
  'use cache'
  cacheTag('equipos', `equipo_${id}`)
  cacheLife('hours')

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('equipos')
    .select('*, torneos(nombre), jugadores(*)')
    .eq('id', id)
    .single()

  if (error) throw new Error(`Failed to fetch equipo: ${error.message}`)
  return data
}

/**
 * ===========================================================================
 * DOCUMENTOS - Dinámicos, NO CACHEAR
 * ===========================================================================
 */

export async function getDocumentosPendientes() {
  // SIN 'use cache' → Siempre dinámico
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('documentos')
    .select('*, jugadores(nombre), equipos(nombre)')
    .eq('estado', 'pendiente')
    .order('fecha_subida')

  if (error) throw new Error(`Failed to fetch documentos: ${error.message}`)
  return data || []
}

/**
 * ===========================================================================
 * TRANSACCIONES FINANCIERAS - Críticas, NO CACHEAR
 * ===========================================================================
 */

export async function getTransacciones(equipoId?: string) {
  // SIN 'use cache' → Siempre dinámico
  const supabase = createServerClient()
  let query = supabase
    .from('transacciones_pago')
    .select('*, equipos(nombre)')
    .order('fecha', { ascending: false })

  if (equipoId) {
    query = query.eq('equipo_id', equipoId)
  }

  const { data, error } = await query

  if (error) throw new Error(`Failed to fetch transacciones: ${error.message}`)
  return data || []
}

/**
 * ===========================================================================
 * PARTIDOS - Dinámicos (en vivo), NO CACHEAR
 * ===========================================================================
 */

export async function getPartidoById(id: string) {
  // SIN 'use cache' → Siempre dinámico
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('partidos')
    .select(`
      *,
      goles(*),
      tarjetas(*),
      cambios(*),
      equipo_1:equipos!equipo_1_id(*),
      equipo_2:equipos!equipo_2_id(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(`Failed to fetch partido: ${error.message}`)
  return data
}

export async function getPartidosDelTorneo(torneoId: string) {
  // SIN 'use cache' → Siempre dinámico (pueden tener cambios en vivo)
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('partidos')
    .select('*, equipo_1:equipos!equipo_1_id(nombre), equipo_2:equipos!equipo_2_id(nombre)')
    .eq('torneo_id', torneoId)
    .order('fecha', { ascending: false })

  if (error) throw new Error(`Failed to fetch partidos: ${error.message}`)
  return data || []
}

/**
 * ===========================================================================
 * TABLA DE POSICIONES - Semi-estático, cachear con invalidación manual
 * ===========================================================================
 */

export async function getTablaPosiciones(torneoId: string) {
  'use cache'
  cacheTag(`torneo_${torneoId}_tabla`)
  cacheLife({
    stale: 300,       // 5 min en cliente
    revalidate: 900,  // 15 min en servidor
    expire: 3600      // 1 hora máximo
  })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .rpc('get_team_standings', {
      torneo_id: torneoId
    })

  if (error) throw new Error(`Failed to fetch tabla posiciones: ${error.message}`)
  return data || []
}
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Página de Torneos

```typescript
// app/(dashboard)/torneos/page.tsx
import { getTorneos } from '@/lib/data'
import { TorneoCard } from '@/components/torneos/torneo-card'

export default async function TorneosPage() {
  // Automáticamente cached por getTorneos()
  const torneos = await getTorneos()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Torneos</h1>
        <p className="text-gray-600">Gestiona todos tus torneos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {torneos.map((torneo) => (
          <TorneoCard key={torneo.id} torneo={torneo} />
        ))}
      </div>
    </div>
  )
}
```

### Ejemplo 2: Página de Documentos Pendientes (Sin Cache)

```typescript
// app/(dashboard)/admin/documentos/page.tsx
import { getDocumentosPendientes } from '@/lib/data'
import { DocumentoQueue } from '@/components/admin/documento-queue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

export default function DocumentosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verificación de Documentos</h1>
        <p className="text-gray-600">Documentos pendientes de aprobación</p>
      </div>

      <Suspense fallback={<div>Cargando documentos...</div>}>
        <DocumentosList />
      </Suspense>
    </div>
  )
}

async function DocumentosList() {
  // NO está cached - siempre fresh
  const documentos = await getDocumentosPendientes()

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Cola de Documentos ({documentos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DocumentoQueue documentos={documentos} />
      </CardContent>
    </Card>
  )
}
```

### Ejemplo 3: Página de Equipo con Tabla

```typescript
// app/(dashboard)/equipos/[id]/page.tsx
import { Suspense } from 'react'
import { getEquipoById, getTablaPosiciones } from '@/lib/data'
import { EquipoHeader } from '@/components/equipos/equipo-header'
import { EquipoFinanciero } from '@/components/equipos/equipo-financiero'
import { TablaPosiciones } from '@/components/torneos/tabla-posiciones'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EquipoPage({ params }: Props) {
  const { id } = await params

  // Cached
  const equipo = await getEquipoById(id)

  return (
    <div className="space-y-6">
      <EquipoHeader equipo={equipo} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<div>Cargando tabla...</div>}>
            <TablaDelTorneo torneoId={equipo.torneo_id} />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<div>Cargando datos financieros...</div>}>
            <EquipoFinanciero equipoId={id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function TablaDelTorneo({ torneoId }: { torneoId: string }) {
  // Cached con invalidación manual
  const tabla = await getTablaPosiciones(torneoId)
  return <TablaPosiciones data={tabla} />
}
```

### Ejemplo 4: Server Action con Cache Invalidation

```typescript
// app/actions.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'

export async function registrarGol(
  partidoId: string,
  jugadorId: string,
  equipoId: string,
  minuto: number
) {
  const supabase = createServerClient()

  // Registrar el gol
  const { error } = await supabase.from('goles').insert({
    partido_id: partidoId,
    jugador_id: jugadorId,
    equipo_id: equipoId,
    minuto,
  })

  if (error) throw error

  // Obtener partido para saber el torneo
  const { data: partido } = await supabase
    .from('partidos')
    .select('torneo_id')
    .eq('id', partidoId)
    .single()

  if (partido) {
    // Invalidar cache de tabla de posiciones
    revalidateTag(`torneo_${partido.torneo_id}_tabla`)

    // Revalidar página de partido
    revalidatePath(`/partidos/${partidoId}`)

    // Revalidar dashboard
    revalidatePath('/dashboard')
  }

  return { success: true }
}

export async function crearTorneo(data: FormData) {
  const supabase = createServerClient()

  // Crear torneo
  const { error } = await supabase.from('torneos').insert({
    nombre: data.get('nombre'),
    categoria_id: data.get('categoria_id'),
    fecha_inicio: data.get('fecha_inicio'),
  })

  if (error) throw error

  // Invalidar cache de torneos
  revalidateTag('torneos')

  // Revalidar página de torneos
  revalidatePath('/torneos')

  return { success: true }
}

export async function aprobarDocumento(documentoId: string) {
  const supabase = createServerClient()

  // Aprobar documento
  const { error } = await supabase
    .from('documentos')
    .update({ estado: 'aprobado' })
    .eq('id', documentoId)

  if (error) throw error

  // IMPORTANTE: No se cachea, pero revalidar por si acaso
  revalidatePath('/admin/documentos')

  return { success: true }
}
```

---

## 🎯 Patrones Comunes

### Patrón 1: Cached List + Dynamic Details

```typescript
// Página lista (cached)
export default async function EquiposPage({ params }: Props) {
  const { torneoId } = await params

  // Cached
  const equipos = await getEquiposForTorneo(torneoId)

  return (
    <div>
      {equipos.map((equipo) => (
        <Link key={equipo.id} href={`/equipos/${equipo.id}`}>
          {equipo.nombre}
        </Link>
      ))}
    </div>
  )
}

// Página detalle (cached pero con fallback dinámico)
export default async function EquipoDetailPage({ params }: Props) {
  const { id } = await params

  // Cached
  const equipo = await getEquipoById(id)

  // Dynamic - no cached
  const transacciones = await getTransacciones(id)

  return (
    <div>
      <h1>{equipo.nombre}</h1>

      <Suspense fallback={<div>Cargando transacciones...</div>}>
        <TransaccionesSection equipoId={id} />
      </Suspense>
    </div>
  )
}
```

### Patrón 2: Conditional Caching

```typescript
// Cachear solo si es histórico
export async function getReporte(mes: string, año: string) {
  const now = new Date()
  const reportMonth = new Date(`${año}-${mes}-01`)

  // Si el reporte es del pasado, cachear
  if (reportMonth < now) {
    'use cache'
    cacheTag('reports')
    cacheLife('max')
  }

  return await fetchReporte(mes, año)
}
```

### Patrón 3: User-specific + Cached

```typescript
// Obtener usuario actual (dinámico)
async function getUserContext() {
  const supabase = createServerClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

// Obtener datos del usuario (cached por usuario)
export async function getUserEquipos(userId: string) {
  'use cache'
  cacheTag(`user_${userId}_equipos`)
  cacheLife('hours')

  const supabase = createServerClient()
  const { data } = await supabase
    .from('equipos')
    .select('*')
    .eq('usuario_id', userId)

  return data
}

// En página: obtener user, luego sus equipos
export default async function MisEquiposPage() {
  const user = await getUserContext()  // Dinámico
  const equipos = await getUserEquipos(user.id)  // Cached por usuario

  return <EquiposList equipos={equipos} />
}
```

---

## ✅ Testing y Validación

### Build Test
```bash
# Ejecutar build para verificar no hay errores de "Uncached data accessed"
bun run build

# Deberías ver algo como:
# ✓ Compiled successfully
# ✓ Data has been pre-rendered
```

### Development Test
```bash
# Ejecutar en dev mode
bun run dev

# Verificar en consola logs sobre cache:
# - Datos cached se reutilizan entre requests
# - Datos sin cache se obtienen cada vez

# Abrir DevTools en navegador:
# - Network tab muestra qué se cachea
# - Timing shows prerendered shell vs streaming content
```

### Manual Verification

```typescript
// lib/test-cache.ts
import { getCategorias, getTorneos, getDocumentosPendientes } from './data'

export async function testCache() {
  console.log('Testing cache behavior...')

  // Test 1: Cached data (debería ser rápido)
  console.time('getCategorias')
  const cats1 = await getCategorias()
  console.timeEnd('getCategorias')

  console.time('getCategorias (2nd call)')
  const cats2 = await getCategorias()
  console.timeEnd('getCategorias (2nd call)')

  console.assert(JSON.stringify(cats1) === JSON.stringify(cats2), 'Cache works')

  // Test 2: Non-cached data (debería ser diferente cada vez)
  console.time('getDocumentosPendientes')
  const docs1 = await getDocumentosPendientes()
  console.timeEnd('getDocumentosPendientes')

  console.time('getDocumentosPendientes (2nd call)')
  const docs2 = await getDocumentosPendientes()
  console.timeEnd('getDocumentosPendientes (2nd call)')

  console.log('Cache test complete')
}
```

---

## 🔧 Troubleshooting

### Error: "Uncached data was accessed outside of <Suspense>"

**Problema:**
```
Error: Uncached data was accessed outside of <Suspense> boundary
at /app/page.tsx:15
```

**Solución:**
```typescript
// ❌ PROBLEMA
export default async function Page() {
  const documentos = await getDocumentos()  // Sin Suspense, sin cache
  return <div>{documentos}</div>
}

// ✅ SOLUCIÓN 1: Cachear datos
export default async function Page() {
  'use cache'
  const documentos = await getDocumentos()  // Ahora cached
  return <div>{documentos}</div>
}

// ✅ SOLUCIÓN 2: Usar Suspense
export default async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentosList />
    </Suspense>
  )
}

async function DocumentosList() {
  const documentos = await getDocumentos()
  return <div>{documentos}</div>
}
```

### Build Hangs (Timeout after 50 segundos)

**Problema:**
```
Error: Filling a cache during prerender timed out
```

**Causa:**
Estás accediendo a `cookies()`, `headers()`, o datos dinámicos dentro de `use cache`.

**Solución:**
```typescript
// ❌ PROBLEMA
async function CachedComponent() {
  'use cache'
  const cookies = await cookies()  // ❌ Acceso directo
  const role = cookies.get('role')?.value
  return <div>{role}</div>
}

// ✅ SOLUCIÓN: Pasar como props
async function Page() {
  const cookies = await cookies()
  const role = cookies.get('role')?.value

  return <CachedComponent role={role} />
}

async function CachedComponent({ role }: { role: string }) {
  'use cache'
  // Ahora role es un argumento, parte del cache key
  return <div>{role}</div>
}
```

### Cache Not Invalidating

**Problema:**
Cambias datos pero la página sigue mostrando los viejos.

**Solución:**
```typescript
'use server'

import { revalidateTag } from 'next/cache'

export async function updateTorneo(id: string, data: any) {
  await supabase.from('torneos').update(data).eq('id', id)

  // Invalidar todos los caches relacionados
  revalidateTag('torneos')
  revalidateTag(`torneo_${id}`)

  // O invalidar página completa
  revalidatePath('/torneos')
}
```

---

## 📖 Checklist de Implementación

- [ ] Habilitar `cacheComponents: true` en `next.config.ts`
- [ ] Crear `lib/data.ts` con funciones divididas por cacheable/non-cacheable
- [ ] Actualizar páginas para usar data functions
- [ ] Identificar y marcar con `use cache` todos los datos cacheable
- [ ] Añadir `Suspense` para datos dinámicos
- [ ] Crear Server Actions para mutaciones con `revalidateTag`
- [ ] Ejecutar `bun run build` sin errores
- [ ] Verificar en dev que datos se cachean correctamente
- [ ] Probar cache invalidation con `revalidateTag`
- [ ] Documenta qué se cachea y por cuánto tiempo

---

**Documento generado como parte del análisis de Cache Components para GoolStar**
