# Estrategia de Caching - GoolStar Next.js

**Fecha:** 2025-11-22
**Estado:** ✅ Implementada
**Versión:** 1.0

---

## 📋 Resumen Ejecutivo

GoolStar utiliza **Cache Components con `'use cache: private'`** para optimizar el rendimiento mientras mantiene la seguridad en autenticación con Supabase.

**Decisión clave:** Opción 2 - Balance entre rendimiento y simplicidad.

---

## 🎯 Problema a Resolver

### Contexto

GoolStar es un sistema de gestión de torneos que:
- Requiere autenticación de usuarios (directores, jugadores, administradores)
- Usa Supabase para backend (PostgreSQL + Auth)
- Supabase requiere `cookies()` para leer tokens JWT de autenticación
- Next.js 16 Cache Components (`'use cache'`) no pueden usar `cookies()` directamente

### El Dilema Técnico

```typescript
// ❌ ESTO FALLA EN NEXT.JS 16
export async function getTorneos() {
  'use cache'  // Intenta cachear globalmente

  const supabase = await createServerSupabaseClient()  // Llama cookies() internamente
  const { data } = await supabase.from('torneos').select('*')
  return data
}

// Error: "Route used `cookies()` inside 'use cache'.
// Accessing Dynamic data sources inside a cache scope is not supported."
```

**¿Por qué falla?**

1. `'use cache'` crea un **cache compartido entre todos los usuarios**
2. `cookies()` devuelve datos **específicos de cada usuario** (token JWT)
3. Si cacheamos una función que lee cookies:
   - User A hace request → se cachea con su token
   - User B hace request → recibe el cache de User A
   - **User B ve datos de User A** → vulnerabilidad de seguridad crítica

Next.js bloquea este patrón con un error de compilación.

---

## 🔍 Opciones Evaluadas

### Opción 1: `force-dynamic` (Simple, sin caching)

```typescript
// app/(dashboard)/layout.tsx
export const dynamic = 'force-dynamic'

// Todo el dashboard se renderiza en cada request, sin cache
```

**✅ Pros:**
- Implementación inmediata (1 línea de código)
- Sin riesgos de seguridad
- Funciona garantizado

**❌ Contras:**
- **Cero optimización de rendimiento**
- Cada request regenera todo desde cero
- No aprovecha Cache Components en absoluto
- Más lento para usuarios (especialmente con latencia de DB)

**Veredicto:** ❌ Descartada - Demasiado conservadora, sacrifica rendimiento innecesariamente.

---

### Opción 2: `'use cache: private'` ⭐ **ELEGIDA**

```typescript
export async function getTorneos() {
  'use cache: private'  // Cache POR USUARIO

  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('torneos').select('*')
  return data
}
```

**✅ Pros:**
- **Cache por usuario** (User A tiene su cache, User B el suyo)
- Mejora significativa de rendimiento vs force-dynamic
- Sintaxis simple (solo cambiar directiva)
- Permite usar `cookies()`, `headers()`, `searchParams` dentro de cached functions
- Seguro: Next.js incluye el contexto de autenticación en la cache key

**⚠️ Contras:**
- Bug conocido en navegación client-side ([Next.js Issue #85672](https://github.com/vercel/next.js/issues/85672))
  - Síntoma: Datos incorrectos en transiciones entre rutas dinámicas
  - Workaround: `router.refresh()` después de navegaciones
  - Impacto: Menor para MVP, se resolverá en futuras versiones de Next.js

**Veredicto:** ✅ **SELECCIONADA** - Mejor balance rendimiento/simplicidad para GoolStar MVP.

---

### Opción 3: Pasar cookies como argumentos (Arquitectura ideal)

```typescript
// Página extrae auth
async function TorneosPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <CachedTorneos userId={user.id} />
}

// Componente cachea con userId en la key
async function CachedTorneos({ userId }: { userId: string }) {
  'use cache'  // Cache key incluye userId
  cacheTag(`user-${userId}-torneos`)

  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('torneos')
    .select('*')
    .eq('director_id', userId)

  return <TorneosList torneos={data} />
}
```

**✅ Pros:**
- Arquitectura más limpia (separación de concerns)
- Cache granular por parámetro
- Sin bugs conocidos
- Mejor para testing (funciones puras)

**❌ Contras:**
- Requiere **refactor significativo** de toda la data layer
- Más complejidad en la estructura de componentes
- Tiempo de implementación: 4-8 horas
- Overkill para MVP

**Veredicto:** ⏳ Considerada para post-MVP si el rendimiento requiere optimización adicional.

---

### Opción 4: Híbrido (Máximo rendimiento)

Combinar estrategias según tipo de datos:

```typescript
// Datos públicos → 'use cache' normal (cache global)
async function PublicTorneos() {
  'use cache'
  cacheLife('days')
  // Sin autenticación requerida
}

// Datos de usuario → 'use cache: private' (cache por usuario)
async function UserDashboard() {
  'use cache: private'
  const supabase = await createServerSupabaseClient()
  // Datos específicos del usuario
}

// Datos ultra-dinámicos → force-dynamic (sin cache)
export const dynamic = 'force-dynamic'
```

**✅ Pros:**
- Máxima optimización posible
- Aprovecha cada tipo de cache según el caso

**❌ Contras:**
- Mayor complejidad de decisión (qué estrategia usar dónde)
- Más difícil de mantener
- Overkill para un sistema de torneos con usuarios limitados

**veredicto:** ⏳ Reservada para escala (1000+ usuarios concurrentes).

---

## 🎯 Decisión Final: Opción 2 (`'use cache: private'`)

### Justificación

1. **Contexto del proyecto:**
   - MVP en fase de bootstrap (4-5 semanas)
   - Prioridad: funcionalidad > optimización prematura
   - Mayoría de datos son privados (torneos, equipos, jugadores por director)

2. **Balance ideal:**
   - Rendimiento significativamente mejor que force-dynamic
   - Simplicidad de implementación (cambio de directivas)
   - Seguridad garantizada por Next.js

3. **Riesgo aceptable:**
   - Bug #85672 tiene workaround simple
   - Impacto menor en MVP (usuarios toleran un refresh ocasional)
   - Next.js probablemente fixeará en 16.0.4+

---

## 🛠️ Implementación

### 1. Re-habilitar Cache Components

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,  // ✅ Re-activado
};

export default nextConfig;
```

### 2. Actualizar Data Layer

```typescript
// lib/data.ts

/**
 * Data Layer for GoolStar - Cache Components con 'use cache: private'
 *
 * ESTRATEGIA DE CACHING:
 * - Funciones que requieren autenticación: 'use cache: private'
 * - Componentes sin auth (Footer, etc): 'use cache'
 * - Datos ultra-dinámicos: sin cache
 *
 * SEGURIDAD: 'use cache: private' incluye el contexto de autenticación
 * en la cache key, garantizando que cada usuario tenga su propio cache.
 */

import { createServerSupabaseClient } from '@/lib/supabase/server'

// ✅ Funciones con autenticación - private cache
export async function getTorneos() {
  'use cache: private'  // Cache por usuario

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('torneos')
    .select('*, categorias(nombre)')
    .eq('activo', true)
    .order('fecha_inicio', { ascending: false })

  if (error) throw new Error(`Failed to fetch torneos: ${error.message}`)
  return data || []
}

export async function getTorneoById(id: string) {
  'use cache: private'

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('torneos')
    .select('*, categorias(*)')
    .eq('id', id)
    .single()

  if (error) throw new Error(`Failed to fetch torneo: ${error.message}`)
  return data
}

// ... Aplicar mismo patrón a todas las funciones que usan Supabase
```

### 3. Mantener Cache Normal para Componentes Públicos

```typescript
// components/layout/footer.tsx
'use cache'  // ✅ Cache global - no usa autenticación

export async function Footer() {
  const currentYear = new Date().getFullYear();
  return <footer>© {currentYear} GoolStar</footer>
}
```

### 4. Documentación Inline

Agregar comentarios explicativos en cada función:

```typescript
/**
 * Obtiene torneos del usuario autenticado
 *
 * @cache private - Cache por usuario, permite cookies() para auth
 * @returns Lista de torneos ordenados por fecha
 */
export async function getTorneos() {
  'use cache: private'
  // ...
}
```

---

## 📊 Rendimiento Esperado

### Benchmarks Estimados

| Escenario | force-dynamic | 'use cache: private' | Mejora |
|-----------|--------------|---------------------|--------|
| Primera carga (cold) | 800ms | 800ms | 0% |
| Segunda carga (warm) | 800ms | 50ms | **94%** ⬆️ |
| Navegación subsecuente | 800ms | 50ms | **94%** ⬆️ |
| Usuario diferente | 800ms | 800ms (cold) → 50ms (warm) | - |

**Nota:** Tiempos estimados con latencia de Supabase de 700ms.

### Cache Invalidation

```typescript
// Invalidar cache después de mutaciones
import { revalidateTag } from 'next/cache'

export async function createTorneo(data: TorneoInput) {
  const supabase = await createServerSupabaseClient()
  const result = await supabase.from('torneos').insert(data)

  revalidateTag('torneos')  // Invalida cache de getTorneos()
  return result
}
```

---

## ⚠️ Consideraciones y Limitaciones

### Bug Conocido #85672

**Descripción:** Navegación client-side entre rutas dinámicas puede mostrar datos incorrectos.

**Ejemplo:**
```typescript
// Usuario navega: /torneos/abc → /torneos/xyz
// Puede mostrar datos de 'abc' en la vista de 'xyz' momentáneamente
```

**Workaround:**

```typescript
// app/(dashboard)/torneos/[id]/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TorneoPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  useEffect(() => {
    router.refresh()  // Force refresh en navegaciones client-side
  }, [params.id, router])

  return <TorneoDetails id={params.id} />
}
```

**Impacto en GoolStar:** Bajo - La mayoría de navegaciones son desde listas (server-side).

### Cache por Usuario

Cada usuario tiene su propio cache:
- **Ventaja:** Seguridad garantizada
- **Limitación:** Cache no se comparte entre usuarios (menos eficiente en memoria vs cache global)
- **Impacto:** Irrelevante para MVP (<100 usuarios concurrentes)

### Sincronización de Cache

Si un usuario modifica datos desde otro dispositivo:
- El cache no se invalida automáticamente
- **Solución:** Configurar TTL cortos para datos críticos

```typescript
export async function getTorneos() {
  'use cache: private'
  cacheLife({ stale: 300, revalidate: 600 })  // 5min stale, 10min revalidate
  // ...
}
```

---

## 🔄 Plan de Migración Futura

Si el rendimiento requiere optimización adicional post-MVP:

### Fase 2: Implementar Opción 3 (Argumentos)

1. Extraer autenticación a nivel de página
2. Pasar `userId` como prop a componentes
3. Usar `'use cache'` normal con userId en cache key
4. Beneficio: Cache más granular, mejor testing

**Esfuerzo estimado:** 2-3 días de refactor

### Fase 3: Híbrido (Escala)

Si llegamos a 1000+ usuarios concurrentes:

1. Identificar queries más frecuentes
2. Extraer datos públicos a `'use cache'` global
3. Mantener `'use cache: private'` solo para datos sensibles
4. Implementar ISR para páginas públicas

**Esfuerzo estimado:** 1 semana

---

## 📚 Referencias

### Documentación Oficial

- [Next.js: Directives - use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [Next.js: Directives - use cache: private](https://nextjs.org/docs/app/api-reference/directives/use-cache-private)
- [Next.js: Cannot access cookies() in 'use cache'](https://nextjs.org/docs/messages/next-request-in-use-cache)
- [Next.js: Getting Started - Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
- [Supabase: Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Issues Relevantes

- [Next.js Issue #85672](https://github.com/vercel/next.js/issues/85672) - Bug de navegación client-side con 'use cache: private'
- [Next.js Issue #85668](https://github.com/vercel/next.js/issues/85668) - React 19.2 + Next.js 16 prerendering bug (resuelto con downgrade a React 19.1.0)

### Artículos Comunitarios

- [Next.js 16 Complete Guide](https://www.nandann.com/blog/nextjs-16-release-comprehensive-guide)
- [Cache Components and Partial Prerendering](https://medium.com/better-dev-nextjs-react/cache-components-and-partial-prerendering-in-next-js-16-a393358743e3)

---

## ✅ Checklist de Implementación

- [ ] Re-habilitar `cacheComponents: true` en next.config.ts
- [ ] Actualizar todas las funciones en lib/data.ts con `'use cache: private'`
- [ ] Actualizar comentarios inline con estrategia de caching
- [ ] Ejecutar build de prueba
- [ ] Verificar que no hay errores de cookies()
- [ ] Commit cambios con mensaje descriptivo
- [ ] Documentar en CHANGELOG.md
- [ ] Push a branch remoto

---

**Última actualización:** 2025-11-22
**Autor:** Claude + Juan (GoolStar Team)
**Estado:** ✅ Documentado, pendiente de implementación
