# Cache Components - Step by Step Implementation

**Guía paso a paso para implementar Cache Components en GoolStar**

---

## 📋 Fases de Implementación

### **FASE 1: Setup Inicial** ⏱️ 15 minutos

#### Paso 1.1: Actualizar next.config.ts
```typescript
// next.config.ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,      // Ya está, mantener
  cacheComponents: true,    // ← AÑADIR ESTA LÍNEA
}

export default nextConfig
```

**Verificar:** Archivo actualizado, sin errores de sintaxis

---

#### Paso 1.2: Verificar versión de Next.js
```bash
npm list next
# Debe ser v16.0.3 o superior
```

**Si no es v16:**
```bash
npm install next@latest
```

---

#### Paso 1.3: Remover suppressHydrationWarning (si existe)
```typescript
// ❌ ANTES
// app/layout.tsx
<html lang="en" suppressHydrationWarning>

// ✅ DESPUÉS
<html lang="en">
```

---

### **FASE 2: Crear Data Layer** ⏱️ 1-2 horas

#### Paso 2.1: Crear lib/data.ts

```bash
touch lib/data.ts
```

```typescript
// lib/data.ts
import { cacheLife, cacheTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'

/**
 * CACHED FUNCTIONS (con 'use cache')
 */

// Categorías - Cachear por días
export async function getCategorias() {
  'use cache'
  cacheLife('days')

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre')

  if (error) throw new Error(`Failed to fetch: ${error.message}`)
  return data || []
}

// Torneos - Cachear por horas
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

  if (error) throw new Error(`Failed to fetch: ${error.message}`)
  return data || []
}

// Torneos por ID - Cachear por horas
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

  if (error) throw new Error(`Failed to fetch: ${error.message}`)
  return data
}

// Equipos por Torneo - Cachear por horas
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

  if (error) throw new Error(`Failed to fetch: ${error.message}`)
  return data || []
}

// Equipo por ID - Cachear por horas
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

  if (error) throw new Error(`Failed to fetch: ${error.message}`)
  return data
}

// Tabla de Posiciones - Cachear con invalidación manual
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
    .rpc('get_team_standings', { torneo_id: torneoId })

  if (error) throw new Error(`Failed to fetch: ${error.message}`)
  return data || []
}

/**
 * NON-CACHED FUNCTIONS (sin 'use cache' - DINÁMICOS)
 */

// Documentos Pendientes - NO CACHEAR (crítico)
export async function getDocumentosPendientes() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('documentos')
    .select('*, jugadores(nombre), equipos(nombre)')
    .eq('estado', 'pendiente')
    .order('fecha_subida')

  if (error) throw new Error(`Failed to fetch: ${error.message}`)
  return data || []
}

// Transacciones - NO CACHEAR (crítico financiero)
export async function getTransacciones(equipoId?: string) {
  const supabase = createServerClient()
  let query = supabase
    .from('transacciones_pago')
    .select('*, equipos(nombre)')
    .order('fecha', { ascending: false })

  if (equipoId) {
    query = query.eq('equipo_id', equipoId)
  }

  const { data, error } = await query

  if (error) throw new Error(`Failed to fetch: ${error.message}`)
  return data || []
}

// Partidos - NO CACHEAR (datos en vivo)
export async function getPartidoById(id: string) {
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

  if (error) throw new Error(`Failed to fetch: ${error.message}`)
  return data
}
```

**Verificar:** `lib/data.ts` creado con todas las funciones

---

### **FASE 3: Refactorizar Páginas** ⏱️ 2-3 horas

#### Paso 3.1: Página de Torneos

```typescript
// app/(dashboard)/torneos/page.tsx
import { getTorneos } from '@/lib/data'
import { TorneoCard } from '@/components/torneos/torneo-card'
import { Button } from '@/components/ui/button'

export default async function TorneosPage() {
  // Automáticamente cached
  const torneos = await getTorneos()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Torneos</h1>
          <p className="text-gray-600">Gestiona todos tus torneos</p>
        </div>
        <Button asChild>
          <a href="/torneos/nuevo">Crear Torneo</a>
        </Button>
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

**Verificar:** Página compila sin errores

---

#### Paso 3.2: Página de Documentos (sin cache)

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
  // NO cached - siempre dinámico
  const documentos = await getDocumentosPendientes()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cola de Documentos ({documentos.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <DocumentoQueue documentos={documentos} />
      </CardContent>
    </Card>
  )
}
```

**Verificar:** Página compila sin errores

---

#### Paso 3.3: Página de Equipo Detalle

```typescript
// app/(dashboard)/equipos/[id]/page.tsx
import { Suspense } from 'react'
import { getEquipoById, getTablaPosiciones, getTransacciones } from '@/lib/data'
import { EquipoHeader } from '@/components/equipos/equipo-header'
import { TablaPosiciones } from '@/components/torneos/tabla-posiciones'
import { TransaccionesTable } from '@/components/financiero/transacciones-table'

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
            <TablaSection torneoId={equipo.torneo_id} />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<div>Cargando transacciones...</div>}>
            <TransaccionesSection equipoId={id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function TablaSection({ torneoId }: { torneoId: string }) {
  // Cached con invalidación manual
  const tabla = await getTablaPosiciones(torneoId)
  return <TablaPosiciones data={tabla} />
}

async function TransaccionesSection({ equipoId }: { equipoId: string }) {
  // NO cached - datos dinámicos
  const transacciones = await getTransacciones(equipoId)
  return <TransaccionesTable data={transacciones} />
}
```

**Verificar:** Página compila sin errores

---

### **FASE 4: Actualizar Server Actions** ⏱️ 30 minutos

#### Paso 4.1: Añadir cache invalidation

```typescript
// app/actions.ts
'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'

// Crear Torneo
export async function crearTorneo(formData: FormData) {
  const supabase = createServerClient()

  const { error } = await supabase.from('torneos').insert({
    nombre: formData.get('nombre'),
    categoria_id: formData.get('categoria_id'),
    fecha_inicio: formData.get('fecha_inicio'),
  })

  if (error) throw error

  // Invalidar cache de torneos
  revalidateTag('torneos')
  revalidatePath('/torneos')

  return { success: true }
}

// Registrar Gol
export async function registrarGol(
  partidoId: string,
  jugadorId: string,
  equipoId: string,
  minuto: number
) {
  const supabase = createServerClient()

  const { error } = await supabase.from('goles').insert({
    partido_id: partidoId,
    jugador_id: jugadorId,
    equipo_id: equipoId,
    minuto,
  })

  if (error) throw error

  // Obtener torneo para invalidar tabla
  const { data: partido } = await supabase
    .from('partidos')
    .select('torneo_id')
    .eq('id', partidoId)
    .single()

  if (partido) {
    // Invalidar tabla de posiciones
    revalidateTag(`torneo_${partido.torneo_id}_tabla`)
  }

  return { success: true }
}

// Aprobar Documento
export async function aprobarDocumento(documentoId: string) {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('documentos')
    .update({ estado: 'aprobado' })
    .eq('id', documentoId)

  if (error) throw error

  // Revalidar página de documentos
  revalidatePath('/admin/documentos')

  return { success: true }
}

// Crear Transacción
export async function crearTransaccion(data: {
  equipoId: string
  monto: number
  tipo: string
  descripcion?: string
}) {
  const supabase = createServerClient()

  const { error } = await supabase.from('transacciones_pago').insert({
    equipo_id: data.equipoId,
    monto: data.monto,
    tipo: data.tipo,
    descripcion: data.descripcion,
  })

  if (error) throw error

  // Revalidar finanzas
  revalidatePath(`/equipos/${data.equipoId}/financiero`)

  return { success: true }
}
```

**Verificar:** Server actions compilados sin errores

---

### **FASE 5: Testing** ⏱️ 1-2 horas

#### Paso 5.1: Build Test

```bash
# Ejecutar build
bun run build

# Debería mostrar:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages (0/X)
```

**Expected:** Build completa sin errores de "Uncached data accessed"

---

#### Paso 5.2: Dev Mode Test

```bash
# Ejecutar en desarrollo
bun run dev

# Abrir navegador a http://localhost:3000
# Verificar:
# 1. Páginas cargan sin errores
# 2. Datos mostrados correctamente
# 3. Verificar en DevTools Network que datos se cachean
```

**Expected:** No hay errores, datos visibles correctamente

---

#### Paso 5.3: Cache Behavior Test

```typescript
// Para verificar que el cache funciona:

// En navegador DevTools Console:
// 1. Ir a página de Torneos
// 2. Abrir DevTools → Network tab
// 3. Recargar página (Cmd+R)
// 4. Ver que ciertas peticiones se cachean

// Para documentos (sin cache):
// 1. Ir a /admin/documentos
// 2. Cada carga hace nuevas peticiones (sin cache)
```

**Expected:** Documentos sin cache hacen nuevas requests cada vez

---

#### Paso 5.4: Manual Cache Invalidation Test

```typescript
// En app/actions.ts, crear una acción de test:

export async function testCacheInvalidation() {
  'use server'

  import { revalidateTag } from 'next/cache'

  // Invalidar cache de torneos
  revalidateTag('torneos')

  // Debería ver que la próxima llamada a getTorneos() es fresca
  return { success: true }
}
```

**Cómo probar:**
1. Ir a página de Torneos
2. Anotar los torneos mostrados
3. Crear un nuevo torneo
4. Debería aparecer inmediatamente sin recargar

---

### **FASE 6: Deployment** ⏱️ 30 minutos

#### Paso 6.1: Verificar antes de deploy

```bash
# Build para producción
bun run build

# Deberías ver output sin errores
# Check: Node.js runtime (no Edge)
```

---

#### Paso 6.2: Deploy a Staging

```bash
# Usar tu proceso de deployment habitual
# Ej: git push origin main (si tienes CI/CD)

# O: vercel deploy --prod
```

---

#### Paso 6.3: Verificar en Producción

1. Abrir sitio de producción
2. Verificar páginas cargan
3. Verificar datos son correctos
4. Monitorear performance (debería mejorar)

---

## 🔍 Checklist de Implementación

- [ ] **FASE 1 - Setup**
  - [ ] `cacheComponents: true` en `next.config.ts`
  - [ ] Removed `suppressHydrationWarning` si existía
  - [ ] Next.js v16.0.3+

- [ ] **FASE 2 - Data Layer**
  - [ ] `lib/data.ts` creado
  - [ ] Todas las funciones cached
  - [ ] Todas las funciones non-cached

- [ ] **FASE 3 - Refactorizar Páginas**
  - [ ] Torneos page
  - [ ] Documentos page
  - [ ] Equipo detail page
  - [ ] (Otras páginas según sea necesario)

- [ ] **FASE 4 - Server Actions**
  - [ ] Validar que todas las actions usan `revalidateTag()`
  - [ ] Invalidación correcta

- [ ] **FASE 5 - Testing**
  - [ ] `bun run build` sin errores
  - [ ] Dev mode funciona
  - [ ] Cache behavior verificado
  - [ ] Cache invalidation funciona

- [ ] **FASE 6 - Deployment**
  - [ ] Production build testeado
  - [ ] Deployed a staging
  - [ ] Verificado en producción

---

## 📝 Notas Importantes

### ⚠️ Cosas a Evitar

- ❌ No accedas a `cookies()` o `headers()` directamente dentro de `'use cache'` (usa `'use cache: private'` o parámetros)
- ❌ No cachees datos financieros o críticos sin validar revalidación
- ❌ No olvides `revalidateTag()` después de mutaciones
- ❌ No uses `suppressHydrationWarning` en root html

### ✅ Cosas a Hacer

- ✅ Siempre añade `cacheTag()` para poder invalidar
- ✅ Usa `Suspense` para componentes dinámicos
- ✅ Prueba el build antes de deploy
- ✅ Documenta qué se cachea y por cuánto tiempo

---

## 🆘 Si Algo Sale Mal

### Error: "Uncached data was accessed outside of <Suspense>"

**Solución:** Envuelve en `<Suspense>` o añade `'use cache'`

```typescript
// Opción 1: Cachear
'use cache'
const data = await getData()

// Opción 2: Usar Suspense
<Suspense fallback={...}>
  <Component />
</Suspense>
```

### Build Timeout (50 segundos)

**Solución:** Tienes `cookies()` o `headers()` dentro de `use cache`

**Nota:** Cookies SÍ se soportan en Cache Components, pero con 2 patrones:

```typescript
// ❌ Problema - Acceso directo a cookies()
'use cache'
const cookies = await cookies()

// ✅ Solución 1: Pasar como parámetros (datos globales)
const userRole = (await cookies()).get('role')?.value
<CachedComponent userRole={userRole} />

// ✅ Solución 2: Usar 'use cache: private' (datos personalizados)
'use cache: private'
const userId = (await cookies()).get('user-id')?.value
const userData = await getUser(userId)
```

**Para GoolStar:**
- **Datos globales** (Torneos, Categorías): pasar como parámetros
- **Datos de usuario** (Mis Equipos, Documentos personales): usar `'use cache: private'`

### Cache no se invalida

**Solución:** Añadir `revalidateTag()` en actions

```typescript
'use server'
import { revalidateTag } from 'next/cache'

export async function updateData() {
  await updateDB()
  revalidateTag('my-cache')  // ← No olvides esto
}
```

---

## 📖 Documentos Relacionados

1. **CACHE_COMPONENTS_ANALYSIS.md** - Análisis completo del problema
2. **CACHE_COMPONENTS_IMPLEMENTATION_GUIDE.md** - Guía práctica detallada
3. **SOLUTION_SUMMARY.md** - Resumen ejecutivo

---

**Estimación total:** 4-6 horas para implementación completa

**Resultado esperado:** Build completo sin errores + mejor performance

---

**Documento creado:** 2025-11-22
**Status:** ✅ Listo para implementación
