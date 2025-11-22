# Cache Components Analysis - GoolStar Next.js 16

**Documento de análisis:** Soluciones para resolver el error de prerendering con Context (Sonner Toaster)

**Fecha:** 2025-11-22
**Versión de Next.js:** 16.0.3
**Consulta:** Documentación oficial de Next.js DevTools MCP

---

## 📋 Resumen Ejecutivo

El proyecto GoolStar enfrenta un error durante el build debido a que Next.js intenta hacer **prerendering estático** de páginas que contienen **componentes Client-side con Context** (Sonner Toaster).

Se han identificado **3 opciones de solución**, siendo la **Opción 3 (Cache Components)** la más recomendada por ser la dirección futura de Next.js 16.

---

## 🔴 Problema Actual

### Síntoma
```
Error occurred prerendering page "/admin/documentos"
TypeError: Cannot read properties of null (reading 'useContext')
```

### Causa Raíz
1. `app/layout.tsx` es un **Server Component** por defecto
2. El `Toaster` de Sonner es un **Client Component** que usa React Context
3. Durante build, Next.js intenta **prerenderar estáticamente** todas las páginas
4. Al renderizar Client Components en contexto de servidor, el Context es `null`, causando error

### Comportamiento por Defecto en Next.js 16
**Según la documentación oficial:**
> "By default, layouts and pages are Server Components. When Cache Components is enabled, all dynamic code in any page, layout, or API route is executed at request time by default."

Sin `cacheComponents: true`, Next.js usa el modelo antiguo que intenta cachear todo estáticamente por defecto.

---

## 📚 Documentación Oficial Consultada

### Fuentes:
1. **Server and Client Components** (`/docs/app/getting-started/server-and-client-components`)
   - React context is NOT supported in Server Components
   - Context providers deben ser Client Components (`'use client'`)

2. **Route Segment Config** (`/docs/app/api-reference/file-conventions/route-segment-config`)
   - `dynamic: 'force-dynamic'` - Renderiza en cada request
   - `dynamic: 'force-static'` - Cachea en build time
   - Default: `dynamic: 'auto'` (intenta cachear lo máximo)

3. **Cache Components** (`/docs/app/getting-started/cache-components`)
   - Nueva característica en Next.js 16
   - Partial Prerendering (PPR): Mix de contenido estático, cached y dinámico
   - Opt-in caching con `use cache` directive

4. **use cache** (`/docs/app/api-reference/directives/use-cache`)
   - Directiva para cachear funciones/componentes explícitamente
   - Funciona con `cacheLife()` para definir duración del cache

5. **cacheComponents** (`/docs/app/api-reference/config/next-config-js/cacheComponents`)
   - Flag en `next.config.ts` para habilitar Cache Components
   - Cambia el comportamiento por defecto a: dinámico a menos que se marque con `use cache`

---

## 🎯 OPCIÓN 1: `export const dynamic = 'force-dynamic'`

### Descripción
Marca todas las páginas del dashboard como **dinámicas**, evitando que Next.js intente hacer prerendering.

### ✅ Ventajas
- **Implementación rápida**: Un export por página
- **Compatible con Next.js 16**: Funciona sin cambios adicionales
- **Sin refactorización**: No afecta el código existente
- **Soluciona el error inmediatamente**: El build completa

### ❌ Desventajas
- **Sin caching**: Cada request renderiza todo desde cero
- **Mayor latencia**: Todos los datos se obtienen en request time
- **Mayor carga en servidor**: Sin prerendering = más trabajo por request
- **Deprecado en futuro**: Next.js está moviendo hacia Cache Components
- **No aprovecha optimizaciones**: Se pierde oportunidades de static generation

### 📝 Implementación
```typescript
// app/(dashboard)/admin/documentos/page.tsx
export const dynamic = 'force-dynamic'

export default function DocumentosPage() {
  const documentos: Documento[] = []
  return (...)
}
```

### ⚙️ Necesario para
- Todas las 25+ páginas del dashboard
- Cualquier página que importe componentes Client-side

### 📊 Impacto
- **Build time**: Normal (no prerendering)
- **Runtime performance**: Reducido (sin cache)
- **Server load**: Alto (cada request hace trabajo)
- **User experience**: Más lento si hay muchos datos

---

## 🎯 OPCIÓN 2: Context Providers Pattern (Patrón Recomendado Tradicional)

### Descripción
Implementar el patrón oficial de Next.js para Context Providers: **Client Component wrapper solo en el layout**.

### ✅ Ventajas
- **Patrón oficial de Next.js**: Recomendado en documentación
- **Optimiza Server Components**: Solo el wrapper es client
- **Permite caching parcial**: Contenido estático puede ser cached
- **Mejor performance que Opción 1**: Aprovecha static generation

### ❌ Desventajas
- **Requiere refactorización**: Necesita crear un componente wrapper
- **Modelo "all-or-nothing"**: Aún tienes que elegir static o dynamic por ruta
- **No es el futuro**: Next.js está moviendo hacia Cache Components
- **Más boilerplate**: Código adicional necesario

### 📝 Implementación

**Paso 1: Crear Toaster Provider**
```typescript
// app/toaster-provider.tsx
'use client'

import { Toaster } from "@/components/ui/toaster"

export default function ToasterProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster position="top-right" expand={false} richColors closeButton />
    </>
  )
}
```

**Paso 2: Actualizar Root Layout**
```typescript
// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import ToasterProvider from "@/app/toaster-provider"

export const metadata: Metadata = {
  title: "GoolStar - Tournament Management",
  description: "Indoor soccer tournament management system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToasterProvider>{children}</ToasterProvider>
      </body>
    </html>
  )
}
```

**Paso 3: Remover `suppressHydrationWarning` si existiera**

### 📊 Impacto
- **Build time**: Normal
- **Runtime performance**: Bueno (con static generation parcial)
- **Server load**: Moderado
- **User experience**: Bueno

---

## 🎯 OPCIÓN 3: Cache Components + "use cache" ⭐ RECOMENDADO

### Descripción
**Nueva característica de Next.js 16**: Habilitar Cache Components para usar Partial Prerendering (PPR).

Con Cache Components, **todos los datos son dinámicos por defecto** a menos que se marquen explícitamente con `use cache`.

### ✅ VENTAJAS PRINCIPALES

**1. Mix de Static + Cached + Dynamic**
```
┌─────────────────────────────────────┐
│     Static HTML Shell (instant)     │ ← Enviado al cliente inmediatamente
├─────────────────────────────────────┤
│  Cached Data (revalidado cada hora) │ ← Incluído en shell si no cambia
├─────────────────────────────────────┤
│    Dynamic Data (streaming)         │ ← Se carga mientras el usuario ve la UI
└─────────────────────────────────────┘
```

**2. Performance Superior**
- Usuario ve contenido **inmediatamente** (static shell)
- Datos dinámicos se actualizan en background
- No hay espera de "Loading..." para todo

**3. Caching Explícito**
- Solo cacheas lo que necesites con `use cache`
- Todo lo demás es dinámico por defecto (seguro para datos sensibles)
- Control fino con `cacheLife('hours')`, `cacheLife('days')`, etc.

**4. Perfecto para GoolStar**
- **Torneos y categorías**: Cachear (cambian pocas veces al día)
- **Documentos pendientes**: Sin cache (deben ser siempre frescos)
- **Transacciones financieras**: Sin cache (crítico que sean actuales)
- **Standings**: Cachear 5-15 min (actualizar después de partidos)

**5. Future-Proof**
- Dirección oficial de Next.js para el futuro
- Elimina necesidad de `dynamic = 'force-dynamic'`
- Reemplaza `export const revalidate`, `fetchCache`, etc.

### ❌ Desventajas
- **Requiere refactorización**: Identificar qué cachear
- **Cambio de mentalidad**: Pensar en términos de "qué se puede cachear"
- **Documentación en evolución**: Aún hay patrones emergentes
- **Compilador es más estricto**: Errores de build si hay problemas

### 📝 Implementación Paso a Paso

**Paso 1: Habilitar en next.config.ts**
```typescript
// next.config.ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,  // ← HABILITAR AQUÍ
}

export default nextConfig
```

**Paso 2: Layout sin cambios especiales**
```typescript
// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "GoolStar - Tournament Management",
  description: "Indoor soccer tournament management system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

**Paso 3: Crear funciones de datos con `use cache`**
```typescript
// lib/data.ts
import { cacheLife } from 'next/cache'

// Datos que cambian raramente → Cachear por horas
export async function getCategorias() {
  'use cache'
  cacheLife('hours')  // Cachear por 1 hora

  const supabase = createServerClient()
  const { data } = await supabase.from('categorias').select('*')
  return data
}

// Datos que cambian frecuentemente → No cachear
export async function getDocumentosPendientes() {
  // Sin 'use cache' → Siempre dinámico, fresh data
  const supabase = createServerClient()
  const { data } = await supabase
    .from('documentos')
    .select('*')
    .eq('estado', 'pendiente')
  return data
}

// Datos con actualización manual → Cachear con tags
export async function getTorneos() {
  'use cache'
  cacheTag('torneos')
  cacheLife('hours')

  const supabase = createServerClient()
  const { data } = await supabase.from('torneos').select('*')
  return data
}
```

**Paso 4: Usar en componentes/páginas**
```typescript
// app/(dashboard)/torneos/page.tsx
import { getCategorias } from '@/lib/data'
import { TorneoList } from '@/components/torneos/torneo-list'

export default async function TorneosPage() {
  // Automáticamente cached por getCategorias()
  const torneos = await getTorneos()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Torneos</h1>
      <TorneoList torneos={torneos} />
    </div>
  )
}
```

**Paso 5: Invalidar cache cuando sea necesario**
```typescript
// app/actions.ts
'use server'

import { updateTag } from 'next/cache'
import { createTorneo } from '@/lib/supabase/server'

export async function crearTorneo(data: TorneoFormData) {
  // Crear nuevo torneo
  await createTorneo(data)

  // Invalidar cache de torneos
  updateTag('torneos')

  // Revalidar también al actualizar
  revalidatePath('/torneos')
}
```

**Paso 6: Para datos que necesitan request-time (cookies, headers)**

> **IMPORTANTE:** Cookies y headers SÍ se soportan en Cache Components, pero con patrones específicos.

#### ❌ LO QUE NO FUNCIONA:
```typescript
// Esto FALLA - No puedes usar cookies() dentro de 'use cache'
'use cache'
const cookies = await cookies()  // ❌ Error
```

#### ✅ OPCIÓN A: Pasar cookies como parámetros (Recomendado para datos compartidos)
```typescript
// app/(dashboard)/admin/usuarios/page.tsx
import { cookies } from 'next/headers'

export default async function UsuariosPage() {
  // Leer cookies FUERA del cached component
  const userRole = (await cookies()).get('user_role')?.value

  return <UsuariosList userRole={userRole} />
}

async function UsuariosList({ userRole }: { userRole?: string }) {
  'use cache'  // ✅ Funciona porque userRole es un parámetro
  cacheTag('usuarios')

  if (userRole !== 'admin') return <div>No autorizado</div>

  const usuarios = await getUsuarios()
  return <UserList usuarios={usuarios} />
}
```

**Ventajas:**
- El valor se convierte en parte de la cache key automáticamente
- Permite Partial Prerendering
- Compatible con prerendering estático

#### ✅ OPCIÓN B: Usar `"use cache: private"` (Para datos personalizados por usuario)
```typescript
// lib/data.ts
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

// Datos personalizados por usuario
export async function getEquiposDelUsuario() {
  'use cache: private'  // ✅ Permite cookies() directamente
  cacheTag('equipos-usuario')
  cacheLife('hours')  // Mínimo 30 segundos para private

  const userId = (await cookies()).get('user-id')?.value
  return await supabase
    .from('equipos')
    .select()
    .eq('director_id', userId)
}

// page.tsx
export default async function EquiposPage() {
  const equipos = await getEquiposDelUsuario()
  return <EquiposList equipos={equipos} />
}
```

**Ventajas:**
- Acceso directo a cookies(), headers(), searchParams
- Caching personalizado por usuario
- No compartido entre usuarios (privado)

**Diferencias entre `"use cache"` vs `"use cache: private"`:**

| Aspecto | `"use cache"` | `"use cache: private"` |
|---------|---|---|
| **Soporta cookies()** | ❌ NO | ✅ SÍ |
| **Soporta headers()** | ❌ NO | ✅ SÍ |
| **Soporta searchParams** | ❌ NO | ✅ SÍ |
| **Prerendered** | ✅ SÍ | ❌ NO |
| **Compartido entre usuarios** | ✅ SÍ | ❌ NO (privado) |
| **Duración mínima cache** | Flexible | 30 segundos |
| **Caso de uso** | Datos globales, compartibles | Datos personalizados por usuario |

### 📊 Impacto
- **Build time**: Más rápido (no prerendering completo, solo static shell)
- **Runtime performance**: Excelente (static shell + streaming)
- **Server load**: Bajo (caching inteligente)
- **User experience**: Excelente (contenido visible inmediatamente)

---

## 🔄 Migración de Route Segment Config

Si anteriormente usabas estas opciones, aquí cómo migrar a Cache Components:

### `dynamic = 'force-dynamic'` → Remover
```typescript
// ❌ ANTES
export const dynamic = 'force-dynamic'
export default function Page() { ... }

// ✅ DESPUÉS (simplemente remover)
export default function Page() { ... }
```

### `dynamic = 'force-static'` → Usar `use cache`
```typescript
// ❌ ANTES
export const dynamic = 'force-static'
export const revalidate = 3600

export default async function Page() {
  const data = await fetch('/api/data')
  return <div>{data}</div>
}

// ✅ DESPUÉS
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours')

  const data = await fetch('/api/data')
  return <div>{data}</div>
}
```

### `revalidate = 3600` → Usar `cacheLife`
```typescript
// ✅ DESPUÉS
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife({
    stale: 300,      // 5 min en cliente
    revalidate: 3600, // 1 hora en servidor
    expire: 86400    // 1 día máximo
  })

  const data = await fetch('/api/data')
  return <div>{data}</div>
}
```

---

## 📊 COMPARATIVA DE OPCIONES

| Criterio | Opción 1 | Opción 2 | Opción 3 ⭐ |
|----------|----------|----------|-----------|
| **Velocidad implementación** | ⚡ 5 min | 🔄 30 min | 🏗️ 2-3 horas |
| **Cambios necesarios** | Mínimos (25+ exports) | Moderados (refactor) | Significativos (refactor) |
| **Performance en build** | Normal | Normal | Mejorado (no full prerender) |
| **Performance en runtime** | ❌ Bajo (sin cache) | ✅ Bueno | ✅✅ Excelente |
| **Caching** | Ninguno | Parcial | Inteligente/Selective |
| **Latencia inicial** | Alta (espera data) | Normal | Baja (static shell) |
| **Server load** | Alto | Moderado | Bajo |
| **Control fino** | ❌ No | Parcial | ✅ Sí |
| **Documentado** | ✅ Sí | ✅ Sí | ⚠️ En evolución |
| **Futuro-proof** | ❌ Deprecado | ✅ Estable | ✅✅ Nuevo estándar |
| **Compatible Next.js 16** | ✅ Sí | ✅ Sí | ✅ Sí (feature nueva) |
| **Para SaaS/Datos dinámicos** | ✅ Seguro | ✅ Bueno | ✅✅ Óptimo |

---

## 🎯 RECOMENDACIÓN PARA GOOLSTAR

### **USAR OPCIÓN 3: Cache Components + "use cache"**

### Razones técnicas:
1. **GoolStar es SaaS full-stack**: Datos dinámicos + datos cacheable = caso perfecto para PPR
2. **Datos naturalmente cacheable**:
   - ✅ Cachear: Torneos, Categorías, Equipos, Reglas
   - ❌ No cachear: Documentos, Transacciones, Tarjetas, Cambios en vivo
3. **Supabase integración perfecta**: Datos se obtienen en el server, fácil marcar con `use cache`
4. **Escalabilidad**: A medida que crece, tienes control fino sobre qué cachear
5. **Mejor UX para usuarios**: Ven la UI inmediatamente (static shell) mientras datos se cargan

### Razones estratégicas:
1. **Next.js está moviendo aquí**: Cache Components es el futuro de Next.js
2. **Prepara para el futuro**: Cuando Next.js deprece `dynamic`, ya estará listo
3. **Mejor para producción**: Performance superior = menos costo de servidor
4. **Documentación mejorada**: Next.js 16 tiene soporte completo

### Estimación de esfuerzo:
- **Habilitar flag**: 5 min
- **Crear data functions**: 1-2 horas
- **Identificar qué cachear**: 1 hora
- **Refactor pages**: 2-3 horas
- **Testing**: 1-2 horas
- **Total**: ~4-6 horas

---

## 🚀 Plan de Implementación (Opción 3)

### Fase 1: Setup (15 min)
1. Actualizar `next.config.ts` con `cacheComponents: true`
2. Verificar que `reactCompiler: true` esté presente
3. Instalar/verificar `next@16.0.3`

### Fase 2: Crear Data Layer (1-2 horas)
1. Crear `lib/data.ts` con funciones cached/uncached
2. Separar datos por frecuencia de cambio:
   - **Estáticos** (Categorías, Reglas) → `cacheLife('days')`
   - **Semi-dinámicos** (Torneos, Equipos) → `cacheLife('hours')`
   - **Dinámicos** (Documentos, Transacciones) → Sin cache

### Fase 3: Refactor Pages (2-3 horas)
1. Usar data functions en lugar de queries directas
2. Envolver componentes dinámicos en `Suspense` cuando sea necesario
3. Remover `export const dynamic = 'force-dynamic'` donde sea posible

### Fase 4: Testing (1-2 horas)
1. Ejecutar `bun run build`
2. Verificar que no hay errores de "Uncached data accessed"
3. Probar en dev mode que los datos se actualizan
4. Verificar cache invalidation con `updateTag()`

### Fase 5: Deployment
1. Deploy a staging
2. Monitorear performance (build time, runtime)
3. Comparar con baseline anterior

---

## ⚠️ Consideraciones Especiales para GoolStar

### Datos sensibles / Específicos del usuario
```typescript
// ❌ NO CACHEAR: Información personal
export async function getUserProfile(userId: string) {
  // Sin 'use cache' → Siempre fresco
  return await supabase
    .from('usuarios')
    .select('*')
    .eq('id', userId)
}

// ✅ CACHEAR: Datos públicos
export async function getCategorias() {
  'use cache'
  cacheLife('days')
  return await supabase.from('categorias').select('*')
}
```

### Actualización en real-time
```typescript
// Para paridos en vivo, usar updateTag
export async function registrarGol(partidoId: string) {
  'use server'
  await updatePartidoGoles(partidoId)
  updateTag(`partido_${partidoId}`)  // Invalida cache inmediatamente
}
```

### Financiero (Crítico)
```typescript
// ❌ NUNCA CACHEAR datos financieros críticos
export async function getTransacciones(equipoId: string) {
  // Sin cache → Siempre datos actuales
  return await supabase
    .from('transacciones')
    .select('*')
    .eq('equipo_id', equipoId)
}

// ✅ CACHEAR solo reportes históricos
export async function getReporteMensual(mes: string, año: string) {
  'use cache'
  cacheLife('max')  // Cache máximo, solo invalida manualmente
  cacheTag('reports')

  return await calcularReporteMensual(mes, año)
}
```

---

## 📖 Referencias Documentación Oficial

- [Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
- [use cache directive](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [cacheComponents config](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)
- [cacheLife function](https://nextjs.org/docs/app/api-reference/functions/cacheLife)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)

---

## 🔗 Links útiles

- [Next.js 16 Release Notes](https://nextjs.org/blog)
- [Cache Components GitHub Discussion](https://github.com/vercel/next.js/discussions)
- [Partial Prerendering (PPR) Video](https://www.youtube.com/watch?v=MTcPrTIBkpA)

---

**Documento generado con consultación a Next.js DevTools MCP - Next.js 16.0.3**
