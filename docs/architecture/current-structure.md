# GoolStar Current Project Structure

**Architecture:** Monolito (Single Next.js App)
**Why?** Simple, fast for MVP, easy to scale, clear migration path to monorepo later.

---

## 📁 Directory Overview

```
goolstar_next/
├── app/                          # Next.js App Router
├── components/                   # React components
├── lib/                          # Core logic & utilities
├── actions/                      # Server Actions
├── supabase/                     # Database migrations
├── types/                        # TypeScript types
├── public/                       # Static assets
├── docs/                         # Documentation
├── package.json
├── tsconfig.json
├── CLAUDE.md                     # Development guide
├── ROADMAP.md                    # Implementation phases
└── .env.local                    # Environment (local only)
```

---

## 🏠 App Directory (`/app`)

Next.js App Router - all pages, routes, and layouts.

### Structure

```
app/
├── layout.tsx                    # Root layout (HTML wrapper)
├── page.tsx                      # Home page
├── middleware.ts                 # Auth middleware
│
├── (auth)/                       # Auth routes (grouped)
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── register/
│   │   └── page.tsx              # Register page
│   └── layout.tsx                # Auth layout
│
├── (dashboard)/                  # Protected routes (grouped)
│   ├── layout.tsx                # Dashboard layout (navbar + sidebar)
│   │
│   ├── page.tsx                  # Dashboard home
│   │
│   ├── torneos/                  # Tournament routes
│   │   ├── page.tsx              # List tournaments
│   │   ├── nuevo/
│   │   │   └── page.tsx          # Create tournament
│   │   └── [id]/
│   │       ├── page.tsx          # View tournament
│   │       ├── tabla/
│   │       │   └── page.tsx      # Standings table
│   │       └── estadisticas/
│   │           └── page.tsx      # Tournament stats
│   │
│   ├── equipos/                  # Team routes
│   │   ├── page.tsx              # List teams
│   │   ├── nuevo/
│   │   │   └── page.tsx          # Create team
│   │   └── [id]/
│   │       ├── page.tsx          # View team
│   │       └── financiero/
│   │           └── page.tsx      # Team financials
│   │
│   ├── jugadores/                # Player routes
│   │   ├── page.tsx              # List players
│   │   ├── nuevo/
│   │   │   └── page.tsx          # Create player
│   │   └── [id]/
│   │       └── page.tsx          # View player
│   │
│   ├── partidos/                 # Match routes
│   │   ├── page.tsx              # List matches
│   │   ├── nuevo/
│   │   │   └── page.tsx          # Create match
│   │   └── [id]/
│   │       ├── page.tsx          # View match
│   │       └── acta/
│   │           └── page.tsx      # Match report
│   │
│   ├── financiero/               # Financial routes
│   │   ├── page.tsx              # Financial dashboard
│   │   └── transacciones/
│   │       └── page.tsx          # Transaction list
│   │
│   └── admin/                    # Admin routes
│       ├── page.tsx              # Admin dashboard
│       ├── documentos/
│       │   └── page.tsx          # Document verification
│       └── usuarios/
│           └── page.tsx          # User management
│
└── api/                          # API routes (if needed)
    ├── torneos/
    │   ├── route.ts              # GET /api/torneos, POST
    │   └── [id]/
    │       └── route.ts          # GET, PUT, DELETE by ID
    ├── equipos/
    │   ├── route.ts
    │   └── [id]/route.ts
    └── upload/
        └── route.ts              # File upload endpoint
```

### Naming Conventions

- **Folders with parentheses** `(auth)`, `(dashboard)` = route grouping (invisible in URL)
- **[id]** = dynamic route parameter
- **layout.tsx** = layout for this folder and children
- **page.tsx** = the actual page/route
- **API routes** use `route.ts` with methods: GET, POST, PUT, DELETE

---

## 🧩 Components Directory (`/components`)

Reusable React components, organized by feature.

### Structure

```
components/
├── ui/                           # shadcn/ui components (auto-generated)
│   ├── button.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── table.tsx
│   └── ...
│
├── layout/                       # Layout components
│   ├── navbar.tsx                # Top navigation
│   ├── sidebar.tsx               # Sidebar navigation
│   └── footer.tsx                # Footer
│
├── torneos/                      # Tournament components
│   ├── torneo-form.tsx           # Create/edit form
│   ├── torneo-card.tsx           # Display card
│   ├── torneo-list.tsx           # List component
│   ├── tabla-posiciones.tsx      # Standings table
│   ├── tabla-posiciones-live.tsx # Realtime standings
│   ├── top-scorers.tsx           # Top scorers table
│   └── estadisticas.tsx          # Tournament stats
│
├── equipos/                      # Team components
│   ├── equipo-form.tsx
│   ├── equipo-card.tsx
│   ├── equipo-list.tsx
│   └── equipo-stats.tsx
│
├── jugadores/                    # Player components
│   ├── jugador-form.tsx
│   ├── jugador-card.tsx
│   ├── jugador-list.tsx
│   └── documento-upload.tsx
│
├── partidos/                     # Match components
│   ├── partido-form.tsx
│   ├── partido-card.tsx
│   ├── partido-list.tsx
│   ├── gol-form.tsx
│   ├── tarjeta-form.tsx
│   ├── cambio-form.tsx
│   └── acta-partido.tsx
│
├── financiero/                   # Financial components
│   ├── transaccion-form.tsx
│   ├── historial-pagos.tsx
│   ├── balance-card.tsx
│   └── deuda-detalle.tsx
│
└── admin/                        # Admin components
    ├── documento-queue.tsx
    ├── documento-viewer.tsx
    ├── documento-verificacion.tsx
    ├── user-list.tsx
    └── user-form.tsx
```

### Component Patterns

**Form Component:**
```typescript
// components/torneos/torneo-form.tsx
"use client"
import { useActionState } from "react"
import { createTorneo } from "@/actions/torneos"
import { torneoSchema } from "@/lib/validations/torneo"

export function TorneoForm() {
  const [state, formAction, isPending] = useActionState(
    createTorneo,
    null
  )
  return (
    <form action={formAction}>
      {/* form fields */}
    </form>
  )
}
```

**List Component:**
```typescript
// components/torneos/torneo-list.tsx
"use client"
import { getTorneos } from "@/actions/torneos"
import { TorneoCard } from "./torneo-card"

export async function TorneoList() {
  const torneos = await getTorneos()
  return (
    <div className="grid gap-4">
      {torneos.map(t => <TorneoCard key={t.id} torneo={t} />)}
    </div>
  )
}
```

---

## 📚 Lib Directory (`/lib`)

Core business logic, utilities, database access, and validations.

### Structure

```
lib/
├── supabase/                     # Database access
│   ├── client.ts                 # createClient() for client components
│   ├── server.ts                 # createServerClient() for server
│   └── types.ts                  # Auto-generated DB types (DON'T EDIT)
│
├── validations/                  # Zod schemas
│   ├── torneo.ts                 # Tournament validation schema
│   ├── equipo.ts                 # Team validation schema
│   ├── jugador.ts                # Player validation schema
│   ├── partido.ts                # Match validation schema
│   └── financiero.ts             # Financial validation schema
│
├── utils/                        # Pure utility functions
│   ├── points.ts                 # calculatePoints(result)
│   ├── standings.ts              # sortStandings(teams)
│   ├── suspension.ts             # checkSuspension(player)
│   ├── debt.ts                   # calculateDebt(team)
│   ├── format.ts                 # formatDate(), formatCurrency()
│   └── date.ts                   # Date utilities
│
└── hooks/                        # Custom React hooks
    ├── use-torneos.ts            # Fetch & cache tournaments
    ├── use-equipos.ts            # Fetch & cache teams
    ├── use-jugadores.ts          # Fetch & cache players
    └── use-partidos.ts           # Fetch & cache matches
```

### Examples

**Zod Schema:**
```typescript
// lib/validations/torneo.ts
import { z } from "zod"

export const torneoSchema = z.object({
  nombre: z.string().min(1, "Required"),
  categoria_id: z.string().uuid(),
  fecha_inicio: z.date(),
  fecha_fin: z.date().optional(),
})

export type Torneo = z.infer<typeof torneoSchema>
```

**Utility Function:**
```typescript
// lib/utils/standings.ts
import { Database } from "@/types/database"

export function sortStandings(
  equipos: Database["public"]["Tables"]["estadistica_equipo"]["Row"][]
) {
  return equipos.sort((a, b) => {
    if (a.puntos !== b.puntos) return b.puntos - a.puntos
    if (a.diferencia_goles !== b.diferencia_goles)
      return b.diferencia_goles - a.diferencia_goles
    return b.goles_favor - a.goles_favor
  })
}
```

**Supabase Client:**
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr"
import { Database } from "@/types/database"

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## ⚡ Actions Directory (`/actions`)

Server Actions for data mutations (create, update, delete).

### Structure

```
actions/
├── torneos.ts
│   ├── createTorneo(data)
│   ├── updateTorneo(id, data)
│   ├── deleteTorneo(id)
│   ├── getTorneos()
│   └── getTorneo(id)
│
├── equipos.ts
│   ├── createEquipo(data)
│   ├── updateEquipo(id, data)
│   ├── deleteEquipo(id)
│   ├── getEquipos(torneo_id?)
│   └── getEquipo(id)
│
├── jugadores.ts
│   ├── createJugador(data)
│   ├── updateJugador(id, data)
│   ├── deleteJugador(id)
│   ├── getJugadores(equipo_id?)
│   └── getJugador(id)
│
├── partidos.ts
│   ├── createPartido(data)
│   ├── updatePartido(id, data)
│   ├── completePartido(id)
│   ├── addGol(partido_id, jugador_id, minuto)
│   ├── addTarjeta(partido_id, jugador_id, tipo, minuto)
│   ├── addCambio(partido_id, jugador_sale_id, jugador_entra_id, minuto)
│   ├── getPartidos(torneo_id?)
│   └── getPartido(id)
│
├── financiero.ts
│   ├── createTransaccion(data)
│   ├── getTransacciones(equipo_id?)
│   ├── getDeuda(equipo_id)
│   └── getBalance(equipo_id)
│
└── admin.ts
    ├── verificarDocumento(id, estado, comentarios)
    ├── getPendientes()
    ├── updateUserRole(user_id, role)
    └── getUsers()
```

### Server Action Pattern

```typescript
// actions/torneos.ts
"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import { torneoSchema } from "@/lib/validations/torneo"

export async function createTorneo(formData: unknown) {
  try {
    // Validate
    const torneo = torneoSchema.parse(formData)

    // Get authenticated user
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    // Insert
    const { data, error } = await supabase
      .from("torneos")
      .insert([torneo])
      .select()

    if (error) throw error

    // Revalidate cache
    revalidatePath("/torneos")

    return { success: true, data }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
```

---

## 🗄️ Supabase Directory (`/supabase`)

Database migrations and configuration.

### Structure

```
supabase/
├── migrations/
│   ├── 20250121000000_001_initial_schema.sql
│   ├── 20250121000001_002_categorias_torneos.sql
│   ├── 20250121000002_003_equipos_jugadores.sql
│   ├── 20250121000003_004_partidos_competicion.sql
│   ├── 20250121000004_005_estadisticas.sql
│   ├── 20250121000005_006_financiero.sql
│   ├── 20250121000006_007_triggers.sql
│   ├── 20250121000007_008_functions.sql
│   ├── 20250121000008_009_rls_policies.sql
│   └── 20250121000009_010_indexes.sql
│
└── config.toml                   # Supabase local config
```

### Execution Order

Migrations run in alphabetical order. Execute them in this sequence:
1. Initial schema (extensions, types, basic tables)
2. Categorías and Torneos
3. Equipos and Jugadores
4. Partidos and Competición
5. Estadísticas
6. Financiero (payments, transactions)
7. Triggers (auto-updates)
8. Functions (complex queries)
9. RLS Policies (security)
10. Indexes (performance)

---

## 📝 Types Directory (`/types`)

TypeScript type definitions.

### Structure

```
types/
├── database.ts                   # Auto-generated from Supabase
│                                 # DON'T EDIT - regenerate with:
│                                 # supabase gen types typescript --local > types/database.ts
└── custom.ts                     # Custom types if needed
```

### Usage

```typescript
import { Database } from "@/types/database"

type Torneo = Database["public"]["Tables"]["torneos"]["Row"]
type TorneoInsert = Database["public"]["Tables"]["torneos"]["Insert"]
type TorneoUpdate = Database["public"]["Tables"]["torneos"]["Update"]
```

---

## 🎨 Import Patterns

### Within the app, always use `@/` alias:

```typescript
// ✅ Good
import { createTorneo } from "@/actions/torneos"
import { torneoSchema } from "@/lib/validations/torneo"
import { sortStandings } from "@/lib/utils/standings"
import { Database } from "@/types/database"

// ❌ Avoid
import { createTorneo } from "../../../actions/torneos"
import { torneoSchema } from "../../lib/validations/torneo"
```

### Organize imports:

```typescript
// 1. External packages
import { z } from "zod"
import { useActionState } from "react"

// 2. App imports
import { createTorneo } from "@/actions/torneos"
import { torneoSchema } from "@/lib/validations/torneo"
import { TorneoForm } from "@/components/torneos/torneo-form"

// 3. Types
import { Database } from "@/types/database"
```

---

## 🔄 Data Flow Example

**Creating a Tournament:**

```
1. User fills TorneoForm (client component)
   └─> calls createTorneo Server Action

2. Server Action in actions/torneos.ts
   ├─> Validates with torneoSchema (Zod)
   ├─> Authenticates user
   └─> Inserts into Supabase

3. Database trigger updates estadistica_equipo
   └─> No app code needed, automatic

4. Server Action revalidates cache
   └─> /torneos page refreshes automatically

5. User sees new tournament in TorneoList
```

---

## 📏 Code Organization Principles

### 1. **Separation of Concerns**
- `/components` = UI only
- `/actions` = Data mutations
- `/lib/utils` = Pure functions
- `/lib/validations` = Input validation
- `/lib/supabase` = Database access

### 2. **Single Responsibility**
- One component per file
- One validation schema per file
- One Server Action file per entity

### 3. **Folder Structure Mirrors Routes**
```
routes:       app/(dashboard)/torneos/page.tsx
components:   components/torneos/torneo-list.tsx
actions:      actions/torneos.ts
validations:  lib/validations/torneo.ts
```

### 4. **File Naming**
- Components: `PascalCase` + `.tsx` = `TorneoForm.tsx`
- Functions: `camelCase` + `.ts` = `sortStandings.ts`
- Schemas: `camelCase` + `.ts` = `torneo.ts`

---

## 🚀 When to Scale

**When NOT to use this structure:**
- When you have truly reusable code needed by mobile app
- When you have 5+ independent frontends
- When team is 10+ developers

**Then:** Migrate to monorepo (2-3 days effort)
See: [docs/architecture/decision-monolito.md](decision-monolito.md)

---

## 📚 Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - Development guidelines
- [ROADMAP.md](../../ROADMAP.md) - Implementation phases
- [docs/database/schema.md](../database/schema.md) - Database schema
- [docs/database/triggers.md](../database/triggers.md) - Database automation
- [docs/architecture/business-rules.md](business-rules.md) - Business logic

---

**Last Updated:** 2025-11-21
