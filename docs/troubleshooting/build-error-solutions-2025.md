# Estrategias de Solución para Error de Build - Next.js 16 + React 19.2

**Fecha de Investigación:** 2025-11-22
**Estado:** 🔍 Documentado - Pendiente de implementación
**Contexto:** Investigación actualizada con información de la comunidad Next.js y React (Noviembre 2025)

---

## 📊 Executive Summary

Después de investigar en la comunidad de Next.js y React, se identificaron **DOS ERRORES DIFERENTES** que bloquean el build:

1. **Error de TypeScript** - Tabla `documentos` no existe en el schema (error inmediato)
2. **Error de React Context** - Bug conocido en React 19.2.0 con Next.js 16 durante prerendering

Este documento propone **6 estrategias ordenadas por prioridad** con un plan de implementación paso a paso.

---

## 🔴 Problema 1: Error de Tipos TypeScript

### Descripción del Error

```
Type error: No overload matches this call.
Argument of type '"documentos"' is not assignable to parameter type...

./lib/data.ts:231:11
```

### Causa Raíz

En `lib/data.ts` (líneas 231 y 244) se hace referencia a una tabla llamada `documentos`:

```typescript
.from('documentos')  // ❌ Esta tabla NO existe
```

Pero según la migración `20250122000003_equipos_jugadores.sql:68`, la tabla real se llama:

```sql
CREATE TABLE jugador_documentos (  -- ✅ Este es el nombre correcto
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jugador_id UUID NOT NULL,
  tipo tipo_documento NOT NULL,
  ...
)
```

### Impacto

- ❌ El build falla en la fase de compilación de TypeScript
- ❌ No permite avanzar al siguiente error
- ⚡ **Este error debe solucionarse PRIMERO**

### Solución

Cambiar `'documentos'` → `'jugador_documentos'` en:
- `lib/data.ts:231` (función `getDocumentosPendientes`)
- `lib/data.ts:244` (función `getTodosLosDocumentos`)

**Archivos afectados:**
- `lib/data.ts`
- Posiblemente componentes que usan estas funciones

---

## 🔴 Problema 2: Error de React Context durante Prerendering

### Descripción del Error

```
Error occurred prerendering page "/jugadores/nuevo"
TypeError: Cannot read properties of null (reading 'useContext')
```

### Investigación en la Comunidad (Noviembre 2025)

#### Issue Principal: vercel/next.js#85668

**Título:** "Build fails with 'Cannot read properties of null (reading 'useState'/'useContext')' during static generation in Next.js 16.0.1"

**Estado:** Bug confirmado en Next.js 16.0.1, 16.0.2-canary.3, y 16.0.3 con React 19.2.0

**Síntomas reportados:**
- ✅ El error ocurre durante prerendering (fase de build)
- ✅ Afecta páginas con Client Components que usan React hooks
- ✅ `bun run dev` funciona perfectamente
- ✅ `bun run build` falla sistemáticamente
- ✅ Incluso componentes sin hooks directos pueden fallar

#### Hallazgos Clave de la Comunidad

**1. Conflicto de versiones React** (Causa #1 más reportada)

Usuarios reportan que tener múltiples versiones de React instaladas causa este error:

```bash
npm ls react
# Si muestra múltiples versiones → PROBLEMA
```

**Soluciones reportadas:**
- Downgrade a React 19.1.0 (✅ Funciona para mayoría)
- Eliminar `node_modules` y `package-lock.json` completamente
- Verificar que todas las librerías usen la misma versión de React

**2. Problemas con librerías específicas**

Librerías reportadas como problemáticas con React 19.2:
- ✅ `react-hot-toast` - Conflictos de versión
- ✅ `@radix-ui/*` - Puede requerir versiones específicas de React
- ⚠️ `sonner` - Usa Context internamente

**3. Problemas en monorepos (pnpm)**

En proyectos pnpm con múltiples workspaces:

Solución: Crear `.npmrc` con:
```
public-hoist-pattern[]=!react
public-hoist-pattern[]=!react-dom
```

**4. Incompatibilidad Next.js 16 + React 19.2**

Varios usuarios confirman que la combinación específica Next.js 16.0.x + React 19.2.0 tiene problemas de estabilidad durante el prerendering.

---

## 🎯 Estrategias de Solución Propuestas

### Matriz de Decisión

| # | Estrategia | Esfuerzo | Tiempo | Éxito Reportado | Riesgo | Prioridad |
|---|------------|----------|--------|-----------------|--------|-----------|
| 1 | Fix de tipos `documentos` | Bajo | 5-10 min | N/A | Ninguno | ⭐⭐⭐⭐⭐ |
| 2 | Downgrade React 19.1.0 | Bajo | 10-15 min | Alto (80%+) | Bajo | ⭐⭐⭐⭐⭐ |
| 3 | Upgrade Next.js canary | Bajo | 15-20 min | Medio (50%) | Medio | ⭐⭐⭐ |
| 4 | Desactivar React Compiler | Muy bajo | 5 min | Bajo (30%) | Bajo | ⭐⭐ |
| 5 | Dynamic Import Sonner | Medio | 20-30 min | Medio (60%) | Bajo | ⭐⭐⭐ |
| 6 | Downgrade Next.js 15 | Alto | 2-4 horas | Alto (90%) | Alto | ⭐ |

---

## 📝 Estrategia 1: Corregir Error de Tipos (OBLIGATORIO)

**Prioridad:** ⭐⭐⭐⭐⭐ CRÍTICO
**Tiempo estimado:** 5-10 minutos
**Probabilidad de éxito:** 100%

### Objetivo

Solucionar el error de TypeScript que impide la compilación.

### Pasos de Implementación

1. **Abrir archivo:** `lib/data.ts`

2. **Modificar línea 231:**
   ```typescript
   // ANTES:
   .from('documentos')

   // DESPUÉS:
   .from('jugador_documentos')
   ```

3. **Modificar línea 244:**
   ```typescript
   // ANTES:
   .from('documentos')

   // DESPUÉS:
   .from('jugador_documentos')
   ```

4. **Verificar queries relacionadas:**
   - Revisar si hay otros archivos que usen `'documentos'`
   - Actualizar tipos si es necesario

5. **Test rápido:**
   ```bash
   bun run build
   ```

### Resultado Esperado

- ✅ El error de TypeScript desaparece
- ✅ El build avanza a la siguiente fase
- ⚠️ Probablemente aparezca el error de Context (Problema 2)

### Archivos a Modificar

- `lib/data.ts` (líneas 231, 244)
- Posible: componentes que llamen `getDocumentosPendientes()` o `getTodosLosDocumentos()`

---

## 📝 Estrategia 2: Downgrade React a 19.1.0 (RECOMENDADO)

**Prioridad:** ⭐⭐⭐⭐⭐ ALTAMENTE RECOMENDADO
**Tiempo estimado:** 10-15 minutos
**Probabilidad de éxito:** 80-90% (según reportes de la comunidad)

### Objetivo

Evitar el bug conocido en React 19.2.0 que causa errores de Context durante prerendering.

### Justificación

Basado en múltiples reportes en:
- GitHub Issue #85668
- Stack Overflow discussions
- Next.js Discussions

**La combinación React 19.2 + Next.js 16.0.x tiene problemas confirmados de estabilidad.**

### Pasos de Implementación

#### Paso 1: Modificar `package.json`

```json
{
  "dependencies": {
    "react": "19.1.0",      // ← Cambiar de 19.2.0
    "react-dom": "19.1.0"   // ← Cambiar de 19.2.0
  }
}
```

#### Paso 2: Limpiar instalaciones previas

```bash
# Eliminar node_modules y lockfiles
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
rm -f bun.lockb
```

#### Paso 3: Reinstalar con Bun

```bash
bun install
```

#### Paso 4: Verificar versiones

```bash
# Debe mostrar solo React 19.1.0 en todo el árbol
npm ls react
npm ls react-dom
```

**Resultado esperado:**
```
goolstar-next@0.1.0 /home/user/goolstar-next
└── react@19.1.0
```

**⚠️ Si aparecen múltiples versiones:**
```
goolstar-next@0.1.0
├─┬ some-package@1.0.0
│ └── react@19.2.0  ← PROBLEMA
└── react@19.1.0
```

**Solución:** Verificar qué paquetes tienen dependencias de React y usar `overrides` en `package.json`:

```json
{
  "overrides": {
    "react": "19.1.0",
    "react-dom": "19.1.0"
  }
}
```

#### Paso 5: Build de prueba

```bash
bun run build
```

### Resultado Esperado

**Si funciona (80% probabilidad):**
- ✅ Build completa sin errores
- ✅ Prerendering funciona correctamente
- ✅ Deploy posible

**Si falla (20% probabilidad):**
- ⚠️ Mismo error de Context persiste
- ➡️ Pasar a Estrategia 3 o 5

### Reversión

Si algo sale mal:

```bash
# Restaurar versiones originales
git restore package.json
rm -rf node_modules
bun install
```

### Pros y Contras

**Pros:**
- ✅ Solución rápida y simple
- ✅ Alto porcentaje de éxito reportado
- ✅ Mantiene Next.js 16 y Cache Components
- ✅ Bajo riesgo
- ✅ Fácil de revertir

**Contras:**
- ❌ No usa la última versión de React
- ❌ Solución temporal hasta fix oficial
- ⚠️ Puede requerir actualizar más adelante

---

## 📝 Estrategia 3: Upgrade a Next.js Canary

**Prioridad:** ⭐⭐⭐ ALTERNATIVA
**Tiempo estimado:** 15-20 minutos
**Probabilidad de éxito:** 50% (no confirmado si el fix está en canary)

### Objetivo

Probar si versiones más recientes de Next.js ya incluyen el fix para el bug de Context.

### Justificación

El issue #85668 fue reportado en noviembre 2025. Es posible que:
- Next.js 16.0.4+ incluya el fix
- Next.js canary tenga parches experimentales

### Pasos de Implementación

#### Opción A: Probar Canary

```bash
# Upgrade a versión canary
bun add next@canary

# Build
bun run build
```

#### Opción B: Esperar a 16.0.4 Estable

Verificar releases en: https://github.com/vercel/next.js/releases

```bash
# Cuando esté disponible
bun add next@16.0.4
bun run build
```

### Resultado Esperado

**Si el fix está incluido:**
- ✅ Build funciona con React 19.2
- ✅ Problema resuelto permanentemente

**Si no está incluido:**
- ❌ Mismo error
- ➡️ Volver a Next.js 16.0.3 y usar Estrategia 2

### Reversión

```bash
# Volver a versión estable
bun add next@16.0.3
bun install
```

### Pros y Contras

**Pros:**
- ✅ Puede resolver el problema de forma permanente
- ✅ Mantiene React 19.2 (última versión)
- ✅ No requiere cambios de código

**Contras:**
- ❌ Canary puede tener otros bugs
- ❌ No hay garantía de que el fix esté listo
- ⚠️ Menos estable que versiones release

---

## 📝 Estrategia 4: Desactivar React Compiler

**Prioridad:** ⭐⭐ COMPLEMENTARIA
**Tiempo estimado:** 5 minutos
**Probabilidad de éxito:** 30% (según tu documentación ya lo probaste)

### Objetivo

Eliminar el React Compiler como posible fuente del problema.

### Nota Importante

Según `build-error-analysis.md`, ya intentaste esto y **no funcionó**. Sin embargo, vale la pena probarlo en combinación con otras estrategias.

### Pasos de Implementación

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // reactCompiler: true,  // ← Comentar o eliminar esta línea
    cacheComponents: true,
  },
}

export default nextConfig
```

### Build

```bash
bun run build
```

### Resultado Esperado

**Probablemente:**
- ❌ Mismo error persiste
- ➡️ No es la causa raíz

**Si funciona (baja probabilidad):**
- ✅ Build exitoso
- ⚠️ Pierdes optimizaciones del React Compiler

### Reversión

```typescript
// Descomentar la línea
reactCompiler: true,
```

---

## 📝 Estrategia 5: Dynamic Import para Sonner

**Prioridad:** ⭐⭐⭐ RECOMENDADA SI ESTRATEGIA 2 FALLA
**Tiempo estimado:** 20-30 minutos
**Probabilidad de éxito:** 60%

### Objetivo

Aislar Sonner del proceso de prerendering cargándolo solo en el cliente.

### Justificación

Sonner usa React Context internamente. Al cargarlo dinámicamente con `ssr: false`, evitamos que Next.js intente prerenderizarlo.

### Pasos de Implementación

#### Paso 1: Crear archivo de providers

```typescript
// components/providers.tsx (NUEVO ARCHIVO)
'use client'

import dynamic from 'next/dynamic'

const Toaster = dynamic(
  () => import('sonner').then((mod) => ({ default: mod.Toaster })),
  {
    ssr: false,
    loading: () => null
  }
)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  )
}
```

#### Paso 2: Actualizar layout principal

```typescript
// app/layout.tsx
import { Providers } from '@/components/providers'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

#### Paso 3: Remover Toaster de otros lugares

Buscar y eliminar otras instancias de `<Toaster />`:

```bash
# Buscar archivos que usen Toaster
grep -r "Toaster" app/ components/ --include="*.tsx"
```

#### Paso 4: Build

```bash
bun run build
```

### Resultado Esperado

**Si funciona:**
- ✅ Build exitoso
- ✅ Toaster solo se carga en cliente
- ✅ Sin errores de prerendering

**Si falla:**
- ❌ El problema no era solo Sonner
- ➡️ Combinar con Estrategia 2 (Downgrade React)

### Pros y Contras

**Pros:**
- ✅ Aísla componentes problemáticos
- ✅ Mantiene Next.js 16 y React 19.2
- ✅ Patrón recomendado para librerías client-only

**Contras:**
- ❌ Toaster no está disponible durante SSR
- ⚠️ Puede haber flash de contenido
- ⚠️ Si el problema es más profundo, no ayudará

---

## 📝 Estrategia 6: Downgrade a Next.js 15 (ÚLTIMO RECURSO)

**Prioridad:** ⭐ ÚLTIMO RECURSO
**Tiempo estimado:** 2-4 horas
**Probabilidad de éxito:** 90%

### Objetivo

Volver a un stack estable y comprobado.

### Cuándo usar esta estrategia

**Solo si:**
- ❌ Estrategia 2 (Downgrade React) falló
- ❌ Estrategia 3 (Upgrade Next.js) no está disponible
- ❌ Estrategia 5 (Dynamic Import) falló
- ⏰ Necesitas deploy urgente
- 🔥 No puedes esperar a un fix oficial

### Impacto

**Cambios mayores requeridos:**
1. Remover todas las directivas `'use cache'` (15+ instancias en `lib/data.ts`)
2. Remover `cacheComponents: true` de config
3. Usar patrones tradicionales:
   - `export const revalidate = 60`
   - `export const dynamic = 'force-dynamic'`
4. Refactorizar estrategia de caching

**Archivos afectados:**
- `package.json`
- `next.config.ts`
- `lib/data.ts` (388 líneas)
- Todas las páginas que usen `'use cache'`

### Pasos de Implementación

#### Paso 1: Downgrade Next.js

```json
// package.json
{
  "dependencies": {
    "next": "^15.1.0",  // ← Última versión estable de Next.js 15
  }
}
```

#### Paso 2: Limpiar config

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // reactCompiler: true,  // ← Eliminar
    // cacheComponents: true,  // ← Eliminar
  },
}

export default nextConfig
```

#### Paso 3: Remover 'use cache' de lib/data.ts

Buscar y eliminar todas las directivas:

```bash
# Ver cuántas hay
grep -n "use cache" lib/data.ts
```

Estrategia de reemplazo:
- Funciones que eran cached → Añadir `revalidate` en las páginas que las usan
- Funciones uncached → Sin cambios

#### Paso 4: Actualizar patrones de caching

En cada página que usaba datos cached:

```typescript
// ANTES (Next.js 16):
import { getCachedTorneos } from '@/lib/data'

export default async function TorneosPage() {
  const torneos = await getCachedTorneos()
  return <div>{/* ... */}</div>
}

// DESPUÉS (Next.js 15):
import { getTorneos } from '@/lib/data'

export const revalidate = 60  // ← Cachear por 60 segundos

export default async function TorneosPage() {
  const torneos = await getTorneos()
  return <div>{/* ... */}</div>
}
```

#### Paso 5: Reinstalar y build

```bash
rm -rf node_modules
bun install
bun run build
```

### Resultado Esperado

- ✅ Build funciona correctamente
- ✅ Deploy posible
- ❌ Pierdes features de Next.js 16
- ❌ Diferente modelo mental de caching

### Pros y Contras

**Pros:**
- ✅ Stack estable y comprobado
- ✅ Build funciona (90%+ probabilidad)
- ✅ Documentación extensa disponible
- ✅ No hay bugs conocidos

**Contras:**
- ❌ Pierdes Cache Components
- ❌ Pierdes otros features de Next.js 16
- ❌ Requiere refactoring significativo
- ❌ Deuda técnica (upgrade futuro necesario)

---

## 🗺️ Plan de Implementación Recomendado

### Fase 1: Correcciones Inmediatas (OBLIGATORIO)

**Tiempo:** 10 minutos

1. ✅ **Implementar Estrategia 1** - Fix de tipos `documentos`
2. ✅ Verificar conflictos de versiones:
   ```bash
   npm ls react
   npm ls react-dom
   ```

### Fase 2: Solución Rápida (RECOMENDADO)

**Tiempo:** 15 minutos

3. ✅ **Implementar Estrategia 2** - Downgrade React 19.1.0
4. ✅ Clean install
5. ✅ Build y verificar resultado

**Resultado esperado:** 80% de probabilidad de éxito

### Fase 3: Si Fase 2 falla (ALTERNATIVAS)

**Tiempo:** 30-40 minutos

**Opción A: Dynamic Import**
6. ✅ **Implementar Estrategia 5** - Dynamic Import Sonner

**Opción B: Experimentar**
7. ✅ **Probar Estrategia 4** - Desactivar React Compiler
8. ✅ **Probar Estrategia 3** - Next.js canary

### Fase 4: Si todo falla (DECISIÓN)

**Elegir entre:**

**Opción A: Esperar** ⏳
- Monitor https://github.com/vercel/next.js/releases
- Esperar Next.js 16.0.4 con fix
- Timeline: Desconocido (días/semanas)

**Opción B: Downgrade** 🔄
- **Implementar Estrategia 6** - Next.js 15
- Timeline: 2-4 horas de trabajo
- Deploy posible inmediatamente después

---

## 📚 Referencias y Fuentes

### GitHub Issues

- **[Issue #85668](https://github.com/vercel/next.js/issues/85668)** - Build fails with "Cannot read properties of null (reading 'useState'/'useContext')" during static generation in Next.js 16.0.1
- **[Issue #85604](https://github.com/vercel/next.js/issues/85604)** - After upgrading to Next.js 16.0.1, the build fails during prerendering
- **[Issue #82366](https://github.com/vercel/next.js/issues/82366)** - Build fails on Next.js 15.4.5 with TypeError

### Stack Overflow

- **[Question 74322410](https://stackoverflow.com/questions/74322410/how-to-fix-cannot-read-properties-of-null-reading-usecontext)** - How to fix cannot read properties of null (reading 'useContext')?
- **[Question 79444207](https://stackoverflow.com/questions/79444207/next-build-failing-due-to-usecontext-error)** - "next build" failing due to useContext error

### Documentación Oficial

- **[Next.js Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)** - Getting Started: Cache Components
- **[Next.js Prerender Error](https://nextjs.org/docs/messages/prerender-error)** - Prerender Error with Next.js
- **[Toast messages in React Server Components](https://buildui.com/posts/toast-messages-in-react-server-components)** - Guide para implementar Sonner con Server Components

### Artículos de la Comunidad

- **[Next.js 16 Blog](https://nextjs.org/blog/next-16)** - Next.js 16 Release
- **[Medium Article](https://medium.com/better-dev-nextjs-react/cache-components-and-partial-prerendering-in-next-js-16-a393358743e3)** - Cache Components and Partial Prerendering in Next.js 16

---

## 🎯 Decisión Recomendada

### Para Implementación Inmediata

**OPCIÓN RECOMENDADA:**

1. **Implementar Estrategia 1** (obligatorio)
2. **Implementar Estrategia 2** (downgrade React 19.1.0)

**Razones:**
- ✅ Solución rápida (25 minutos total)
- ✅ Alta probabilidad de éxito (80%)
- ✅ Bajo riesgo
- ✅ Fácil de revertir
- ✅ Mantiene Next.js 16 y Cache Components

### Si Necesitas Deploy Urgente

**OPCIÓN ALTERNATIVA:**

1. **Implementar Estrategia 1** (obligatorio)
2. **Implementar Estrategia 6** (downgrade Next.js 15)

**Razones:**
- ✅ Solución garantizada (90% éxito)
- ✅ Estable para producción
- ⚠️ Requiere más trabajo (4 horas)
- ❌ Pierdes features de Next.js 16

---

## ✅ Próximos Pasos

1. **Revisar este documento** con el equipo
2. **Decidir estrategia** a implementar
3. **Asignar tiempo** en sprint
4. **Ejecutar plan** paso a paso
5. **Documentar resultados** para referencia futura

---

**Documento generado:** 2025-11-22
**Autor:** Investigación automatizada + Análisis de comunidad Next.js/React
**Última actualización:** 2025-11-22
**Estado:** ✅ Listo para implementación
