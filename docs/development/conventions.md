# Code Conventions & Patterns

Conventions and patterns for GoolStar development.

---

## 📁 File & Folder Naming

### Components
- **Format:** `PascalCase.tsx`
- **Example:** `TorneoForm.tsx`, `EquipoCard.tsx`, `JugadorList.tsx`
- **One component per file** (except small subcomponents in same folder)

```
// Good
components/torneos/
  ├── torneo-form.tsx
  ├── torneo-card.tsx
  └── torneo-list.tsx

// Avoid
components/torneos.tsx (multiple components in one file)
```

### Functions & Utilities
- **Format:** `camelCase.ts`
- **Example:** `sortStandings.ts`, `calculateDebt.ts`, `formatDate.ts`
- **Group by domain, not by type**

```
// Good
lib/utils/
  ├── standings.ts (all standings functions)
  ├── debt.ts (all debt functions)
  └── format.ts (all formatting functions)

// Avoid
lib/utils/
  ├── functions.ts (mixed concerns)
  └── helpers.ts (too vague)
```

### Validation Schemas
- **Format:** `camelCase.ts`
- **Export:** `{Entity}Schema` and `{Entity}FormSchema`
- **Example:** `torneoSchema`, `torneoFormSchema`

```
lib/validations/
  ├── torneo.ts
  ├── equipo.ts
  ├── jugador.ts
  └── partido.ts
```

### Server Actions
- **Format:** `camelCase.ts`
- **Export:** action names as functions
- **Example:** `createTorneo()`, `updateEquipo()`, `deleteJugador()`

```
actions/
  ├── torneos.ts (all torneo actions)
  ├── equipos.ts (all equipo actions)
  └── jugadores.ts (all jugador actions)
```

---

## 📝 Code Organization

### Component Structure

```typescript
"use client"

// 1. External imports
import { useState } from "react"
import { useActionState } from "react"
import { z } from "zod"

// 2. App imports (organized)
import { createTorneo, getTorneos } from "@/actions/torneos"
import { torneoSchema } from "@/lib/validations/torneo"
import { TorneoCard } from "@/components/torneos/torneo-card"

// 3. Types
import { Database } from "@/types/database"
import type { Torneo } from "@/lib/validations/torneo"

export function TorneoList() {
  // Component code
}
```

### Server Action Structure

```typescript
"use server"

// 1. External imports
import { revalidatePath } from "next/cache"

// 2. App imports
import { createServerClient } from "@/lib/supabase/server"
import { torneoSchema } from "@/lib/validations/torneo"

// 3. Function
export async function createTorneo(formData: unknown) {
  try {
    // Validate
    const data = torneoSchema.parse(formData)

    // Get client
    const supabase = createServerClient()

    // Authenticate
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Execute
    const { data: result, error } = await supabase
      .from("torneos")
      .insert([data])
      .select()

    if (error) throw error

    // Revalidate
    revalidatePath("/torneos")

    return { success: true, data: result[0] }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
```

---

## 🎯 When to Use Client vs Server Components

### Server Components (Default)
Use for:
- ✅ Fetching data directly
- ✅ Protecting secrets (API keys)
- ✅ Large library rendering (charts, tables)
- ✅ Simple display logic

```typescript
// app/(dashboard)/torneos/page.tsx
import { getTorneos } from "@/actions/torneos"
import { TorneoList } from "@/components/torneos/torneo-list"

export default async function TorneosPage() {
  const torneos = await getTorneos()
  return <TorneoList initialTorneos={torneos} />
}
```

### Client Components (`"use client"`)
Use for:
- ✅ Interactive forms
- ✅ useState, useEffect, hooks
- ✅ Event listeners
- ✅ User interactions (clicks, typing)

```typescript
// components/torneos/torneo-form.tsx
"use client"
import { useActionState } from "react"
import { createTorneo } from "@/actions/torneos"

export function TorneoForm() {
  const [state, formAction, isPending] = useActionState(
    createTorneo,
    null
  )
  return <form action={formAction}>...</form>
}
```

---

## 🔄 Server Actions vs API Routes

### Use Server Actions (Preferred)
- ✅ Form submissions
- ✅ Mutations (create, update, delete)
- ✅ Direct database calls
- ✅ Protected by authentication middleware

```typescript
// actions/torneos.ts - Server Action
"use server"
export async function createTorneo(data: unknown) {
  // Automatic: user authentication, error handling
  // Automatic: revalidate cache
}
```

### Use API Routes
- ✅ External integrations (webhooks)
- ✅ Non-web clients (mobile apps)
- ✅ Complex request/response handling
- ⚠️ Manual authentication needed

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  // Non-web client needs explicit auth
}
```

---

## 🛡️ Authentication & Authorization

### Check User in Server Actions
```typescript
"use server"
import { createServerClient } from "@/lib/supabase/server"

export async function createTorneo(data: unknown) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")
  if (user.user_metadata?.role !== "admin") {
    throw new Error("Forbidden")
  }

  // Safe to proceed
}
```

### Middleware for Protected Routes
```typescript
// app/middleware.ts
import { createServerClient } from "@/lib/supabase/server"

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/(dashboard)")) {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }
}
```

---

## 📊 Database Queries

### Use Types from Database
```typescript
import { Database } from "@/types/database"

// Row = full row data
type Torneo = Database["public"]["Tables"]["torneos"]["Row"]

// Insert = fields you provide
type TorneoInsert = Database["public"]["Tables"]["torneos"]["Insert"]

// Update = optional fields
type TorneoUpdate = Database["public"]["Tables"]["torneos"]["Update"]
```

### Query Pattern
```typescript
const { data, error } = await supabase
  .from("torneos")
  .select("*, equipos(*)")        // Include relationships
  .eq("categoria_id", categoryId)  // Filter
  .order("created_at", { ascending: false })
  .limit(10)

if (error) throw error
return data
```

### Use Database Functions
```typescript
// Call SQL function from Supabase
const { data: standings } = await supabase
  .rpc("get_tabla_posiciones", {
    torneo_uuid: torneoId
  })
```

---

## ✅ Validation

### Always Validate Input
```typescript
import { z } from "zod"

// Define schema
export const torneoSchema = z.object({
  nombre: z.string().min(1, "Required"),
  categoria_id: z.string().uuid(),
  fecha_inicio: z.coerce.date(),
})

// Validate in Server Action
export async function createTorneo(formData: unknown) {
  const torneo = torneoSchema.parse(formData) // Throws on invalid
  // Safe to use torneo here
}

// Type inference
export type Torneo = z.infer<typeof torneoSchema>
```

### Form Validation in Component
```typescript
"use client"
import { useActionState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { torneoSchema } from "@/lib/validations/torneo"

export function TorneoForm() {
  const form = useForm({
    resolver: zodResolver(torneoSchema),
  })

  return (
    <form onSubmit={form.handleSubmit(createTorneo)}>
      {/* form.formState.errors shows validation errors */}
    </form>
  )
}
```

---

## 🎨 Component Patterns

### Form Component Pattern
```typescript
"use client"
import { useActionState } from "react"
import { createTorneo } from "@/actions/torneos"

export function TorneoForm() {
  const [state, formAction, isPending] = useActionState(
    createTorneo,
    null
  )

  return (
    <form action={formAction}>
      <input name="nombre" required />
      <input name="fecha_inicio" type="date" required />
      <button disabled={isPending}>
        {isPending ? "Creating..." : "Create"}
      </button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  )
}
```

### List Component Pattern
```typescript
"use client"
import { Suspense } from "react"
import { getTorneos } from "@/actions/torneos"
import { TorneoCard } from "@/components/torneos/torneo-card"

async function TorneoListContent() {
  const torneos = await getTorneos()
  return (
    <div className="grid gap-4">
      {torneos.map(t => (
        <TorneoCard key={t.id} torneo={t} />
      ))}
    </div>
  )
}

export function TorneoList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TorneoListContent />
    </Suspense>
  )
}
```

### Card Component Pattern
```typescript
"use client"
import Link from "next/link"
import { Database } from "@/types/database"

type Torneo = Database["public"]["Tables"]["torneos"]["Row"]

export function TorneoCard({ torneo }: { torneo: Torneo }) {
  return (
    <div className="card">
      <h3>{torneo.nombre}</h3>
      <p>{torneo.fecha_inicio}</p>
      <Link href={`/torneos/${torneo.id}`}>
        View Details
      </Link>
    </div>
  )
}
```

---

## 🔍 Error Handling

### In Server Actions
```typescript
"use server"
export async function createTorneo(data: unknown) {
  try {
    const torneo = torneoSchema.parse(data) // Throws ZodError

    const { data: result, error } = await supabase
      .from("torneos")
      .insert([torneo])

    if (error) throw new Error(error.message)

    revalidatePath("/torneos")
    return { success: true, data: result[0] }
  } catch (error) {
    // Return error object, don't throw
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}
```

### In Client Components
```typescript
"use client"
const [state, formAction] = useActionState(createTorneo, null)

return (
  <>
    <form action={formAction}>...</form>
    {state?.error && (
      <div role="alert" className="error">
        {state.error}
      </div>
    )}
  </>
)
```

---

## 📚 Imports Best Practices

### Good Imports
```typescript
// ✅ Relative to root
import { createTorneo } from "@/actions/torneos"
import { TorneoForm } from "@/components/torneos/torneo-form"
import { torneoSchema } from "@/lib/validations/torneo"
import { Database } from "@/types/database"
```

### Avoid
```typescript
// ❌ Relative paths
import { createTorneo } from "../../../actions/torneos"

// ❌ Index imports (not set up)
import { createTorneo } from "@/actions"

// ❌ Importing everything
import * as actions from "@/actions/torneos"
```

---

## 🧪 Testing Patterns

### Test Pure Functions
```typescript
// lib/utils/standings.ts - Easy to test!
export function sortStandings(equipos: Equipo[]): Equipo[] {
  return equipos.sort((a, b) => {
    if (a.puntos !== b.puntos) return b.puntos - a.puntos
    if (a.diferencia_goles !== b.diferencia_goles) {
      return b.diferencia_goles - a.diferencia_goles
    }
    return b.goles_favor - a.goles_favor
  })
}

// __tests__/standings.test.ts
import { sortStandings } from "@/lib/utils/standings"

test("sorts by points first", () => {
  const equipos = [
    { puntos: 3, diferencia_goles: 0, goles_favor: 1 },
    { puntos: 6, diferencia_goles: 0, goles_favor: 1 },
  ]
  const result = sortStandings(equipos)
  expect(result[0].puntos).toBe(6)
})
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Fetching Data in Client Component
```typescript
"use client" // Wrong!
export function TorneoList() {
  const [torneos, setTorneos] = useState([])
  useEffect(() => {
    // Fetching in client is slower & less secure
    getTorneos().then(setTorneos)
  }, [])
}
```

### ✅ Fetch in Server Component
```typescript
// ✅ Right!
export default async function TorneosPage() {
  const torneos = await getTorneos() // Server-side
  return <TorneoList torneos={torneos} />
}
```

### ❌ Storing Secrets in Client
```typescript
// ❌ Wrong! Never do this
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY // OK
const SECRET_KEY = process.env.SECRET_KEY // Not in client!
```

### ✅ Use Server Actions for Secrets
```typescript
// ✅ Right!
"use server"
export async function mySecretAction() {
  const secret = process.env.SECRET_KEY // Only in server
  // Use secret safely
}
```

---

## 📖 References

- [CLAUDE.md](../../CLAUDE.md) - Development guide
- [docs/architecture/current-structure.md](../architecture/current-structure.md) - Project structure
- [ROADMAP.md](../../ROADMAP.md) - Implementation phases
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)

---

**Last Updated:** 2025-11-21
