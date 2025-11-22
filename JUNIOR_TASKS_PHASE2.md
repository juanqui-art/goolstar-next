# Junior Developer Task Cards - Phase 2

**Project:** GoolStar MVP
**Phase:** 2 - Dashboard & Entity Pages
**Timeline:** 4-5 days parallel work (after Phase 0/1 complete)
**Team:** 3-4 Junior Developers
**Senior Lead:** Code review, database migration execution, Server Actions integration

---

## 📌 IMPORTANT: Read First

**Prerequisite:** Phase 0/1 must be complete ✅ DONE

**Status:** Phase 2 Task 1 COMPLETE ✅ | Task 2 IN PROGRESS | 3 Tasks Remaining

**What's Ready:**
- ✅ Database schema designed (10 migrations, 21 tables, 139 indexes)
- ✅ TypeScript types generated (1471 lines)
- ✅ Validation schemas created (auth, torneo, equipo, jugador, partido)
- ✅ Authentication working (login/register/logout)
- ✅ Dashboard layout ready (navbar, sidebar, footer)
- ✅ UI components available (shadcn/ui)
- ✅ **TASK 1 COMPLETE:** 67 files created (pages, components, actions, utilities, hooks)

**What Juniors Are Building (Phase 2):**
- 🔄 Task 2: Dashboard List Pages (implement real content) - **IN PROGRESS**
- ⏳ Task 3: Improve Utility Functions (polish & documentation)
- ⏳ Task 4: Polish Component Skeletons (form validation)
- ⏳ Task 5: Improved dashboard home (stats + alerts)

**What Juniors Will NOT Do:**
- ❌ Database setup (Senior already completed migrations)
- ❌ Backend Server Actions for CRUD (Senior will do next - Phase 3)
- ❌ Authentication (already complete)
- ❌ Type definitions (already complete)

---

## 🎯 Overview: Phase 2 Tasks Status

| # | Task | Priority | Time | Status | Junior Ideal | Progress |
|---|------|----------|------|--------|--------------|----------|
| **1** | Project Structure & Placeholders | ✅ DONE | 2-3h | **COMPLETE** | - | 67 files, commit `81de5d4` |
| **2** | Dashboard List Pages | ⭐⭐ HIGH | 4-6h | **IN PROGRESS** | #1 or #2 | Junior working on PR |
| **3** | Utility Functions | ⭐⭐ HIGH | 2-3h | READY | #3 | Polish & add JSDoc |
| **4** | Component Skeletons | ⭐⭐ MEDIUM | 4-6h | READY | #2 | Add form validation |
| **5** | Dashboard Home Improvements | ⭐ LOW | 3-5h | READY | #1 | Add stats & alerts |

**Total Phase 2 Effort:** 13-21 hours remaining | **Status:** 1/5 Complete (20%) | **No Blockers** - Tasks 3,4,5 can run in parallel

---

## 📂 TASK 1: Project Structure & Placeholders

**Assigned to:** Junior #3 (or any available)
**Timeline:** 2-3 hours
**Priority:** ⭐⭐⭐ CRITICAL (blocks Task 2 & 4)
**Difficulty:** ⭐ Easy (mostly file creation)

### Objective
Create complete project structure for Phase 2 with placeholder files.

### Dashboard Pages Structure

Create the following page files in `app/(dashboard)/`:

```
app/(dashboard)/
├── torneos/
│   ├── page.tsx              # List torneos
│   ├── nuevo/page.tsx        # Create torneo
│   ├── [id]/page.tsx         # View torneo details
│   ├── [id]/editar/page.tsx  # Edit torneo
│   ├── [id]/tabla/page.tsx   # Standings table
│   └── [id]/estadisticas/page.tsx # Tournament stats
├── equipos/
│   ├── page.tsx
│   ├── nuevo/page.tsx
│   ├── [id]/page.tsx
│   ├── [id]/editar/page.tsx
│   └── [id]/financiero/page.tsx  # Team finances
├── jugadores/
│   ├── page.tsx
│   ├── nuevo/page.tsx
│   ├── [id]/page.tsx
│   └── [id]/editar/page.tsx
├── partidos/
│   ├── page.tsx
│   ├── nuevo/page.tsx
│   ├── [id]/page.tsx
│   └── [id]/acta/page.tsx  # Match report
├── financiero/
│   ├── page.tsx           # Financial dashboard
│   └── transacciones/page.tsx
└── admin/
    ├── page.tsx           # Admin dashboard
    ├── documentos/page.tsx # Document verification
    └── usuarios/page.tsx  # User management
```

### Component Structure

Create folders and placeholder files in `components/`:

```
components/
├── torneos/
│   ├── torneo-form.tsx
│   ├── torneo-list.tsx
│   ├── torneo-card.tsx
│   └── tabla-posiciones.tsx
├── equipos/
│   ├── equipo-form.tsx
│   ├── equipo-list.tsx
│   ├── equipo-card.tsx
│   └── equipo-stats.tsx
├── jugadores/
│   ├── jugador-form.tsx
│   ├── jugador-list.tsx
│   ├── jugador-card.tsx
│   └── documento-upload.tsx
├── partidos/
│   ├── partido-form.tsx
│   ├── partido-list.tsx
│   ├── partido-card.tsx
│   ├── gol-form.tsx
│   ├── tarjeta-form.tsx
│   ├── cambio-form.tsx
│   └── acta-partido.tsx
├── financiero/
│   ├── transaccion-form.tsx
│   ├── historial-pagos.tsx
│   ├── balance-card.tsx
│   └── deuda-detalle.tsx
└── admin/
    ├── documento-queue.tsx
    ├── documento-viewer.tsx
    ├── documento-verificacion.tsx
    ├── user-list.tsx
    └── user-form.tsx
```

### Server Actions Structure

Create stub files in `actions/`:

```
actions/
├── torneos.ts   # CRUD torneos (TODO: implement after Senior creates Server Actions)
├── equipos.ts   # CRUD equipos
├── jugadores.ts # CRUD jugadores
├── partidos.ts  # CRUD partidos
├── financiero.ts # Financial operations
└── admin.ts     # Admin operations
```

### Utilities Structure

Create utility files in `lib/utils/` and `lib/hooks/`:

```
lib/
├── utils/
│   ├── points.ts        # Point calculation
│   ├── standings.ts     # Standings sorting
│   ├── suspension.ts    # Suspension logic
│   ├── format.ts        # Data formatting
│   └── debt.ts          # Debt calculation
└── hooks/
    ├── use-torneos.ts
    ├── use-equipos.ts
    ├── use-jugadores.ts
    └── use-partidos.ts
```

### Page Template

**Example:** `app/(dashboard)/torneos/page.tsx`

```typescript
export default function TorneosPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Torneos</h1>
          <p className="text-gray-600">Gestiona todos los torneos</p>
        </div>
        <Link href="/torneos/nuevo">
          <Button>Crear Torneo</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Torneos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No hay torneos aún.</p>
          {/* TODO: Connect to getTorneos() Server Action */}
        </CardContent>
      </Card>
    </div>
  )
}
```

### Component Placeholder Template

**Example:** `components/torneos/torneo-form.tsx`

```typescript
"use client"

export function TorneoForm() {
  return (
    <div className="space-y-4">
      <p className="text-gray-500">TODO: Implement TorneoForm</p>
      <p className="text-sm text-gray-400">
        Structure:
        - useForm with react-hook-form + Zod
        - zodResolver: torneoSchema
        - Fields: nombre, categoria_id, fecha_inicio, fecha_fin, phases
        - Connect to: actions/torneos.ts (createTorneo)
      </p>
    </div>
  )
}
```

### Server Action Stub Template

**Example:** `actions/torneos.ts`

```typescript
"use server"

import { torneoSchema, type Torneo } from "@/lib/validations/torneo"

// TODO: Implement after Senior creates database Server Actions

export async function createTorneo(data: unknown): Promise<{ id: string }> {
  // 1. Validate with torneoSchema
  // 2. Call Supabase: INSERT into torneos
  // 3. Return: { id: newTorneo.id }
  throw new Error("Not implemented yet")
}

export async function getTorneos() {
  // 1. Call Supabase: SELECT from torneos
  // 2. Return: array of torneos
  throw new Error("Not implemented yet")
}

export async function getTorneo(id: string) {
  // 1. Call Supabase: SELECT where id = id
  // 2. Return: single torneo with related data
  throw new Error("Not implemented yet")
}

export async function updateTorneo(id: string, data: unknown) {
  // 1. Validate with torneoSchema
  // 2. Call Supabase: UPDATE where id = id
  // 3. Return: updated torneo
  throw new Error("Not implemented yet")
}

export async function deleteTorneo(id: string) {
  // 1. Call Supabase: DELETE where id = id
  // 2. Return: success status
  throw new Error("Not implemented yet")
}
```

### Deliverable

- ✅ 16 page files created (all routes above)
- ✅ 20+ component files created
- ✅ 5 action files created
- ✅ 5 utility files created
- ✅ 4 hook files created
- ✅ Each file has TODO comment explaining purpose
- ✅ No TypeScript errors
- ✅ All imports use `@/` path aliases
- ✅ PR: "chore: create Phase 2 project structure"

---

## 📄 TASK 2: Dashboard List Pages

**Assigned to:** Junior #1 or #2
**Timeline:** 4-6 hours
**Priority:** ⭐⭐ HIGH
**Depends on:** Task 1 (structure exists)
**Difficulty:** ⭐ Easy-Medium

### Objective
Implement dashboard pages with list views, consistent layout, and placeholder data.

### Pages to Implement (6 total)

**Pattern:** All pages follow the same structure:
1. Header with title and "Create" button
2. Card/table placeholder
3. TODO comment about Server Action connection

### Page: Torneos List

**File:** `app/(dashboard)/torneos/page.tsx`

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TorneosPage() {
  // TODO: Replace with getTorneos() Server Action
  const torneos = []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Torneos</h1>
          <p className="text-gray-600">Gestiona y visualiza todos los torneos</p>
        </div>
        <Link href="/torneos/nuevo">
          <Button>Crear Torneo</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Torneos</CardTitle>
          <CardDescription>
            {torneos.length} torneo{torneos.length !== 1 ? 's' : ''} registrado{torneos.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {torneos.length === 0 ? (
            <p className="text-gray-500">No hay torneos registrados aún.</p>
          ) : (
            <div className="overflow-x-auto">
              {/* TODO: Add table with columns: Nombre, Categoría, Fechas, Acciones */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

### Repeat for 5 more pages:
- **Equipos** - `app/(dashboard)/equipos/page.tsx`
- **Jugadores** - `app/(dashboard)/jugadores/page.tsx`
- **Partidos** - `app/(dashboard)/partidos/page.tsx`
- **Financiero** - `app/(dashboard)/financiero/page.tsx`
- **Admin** - `app/(dashboard)/admin/page.tsx`

Each with:
- ✅ Consistent header layout
- ✅ Card/table placeholder
- ✅ Link to create page
- ✅ Count badges
- ✅ Empty state message
- ✅ TODO comments

### Deliverable

- ✅ 6 list pages implemented
- ✅ Consistent layout across all pages
- ✅ Responsive design (mobile-friendly)
- ✅ Proper styling with shadcn/ui
- ✅ Navigation links working
- ✅ PR: "feat: add dashboard list pages"

---

## ⚙️ TASK 3: Utility Functions

**Assigned to:** Junior #3 (or any available)
**Timeline:** 4-6 hours
**Priority:** ⭐⭐ HIGH
**Depends on:** Nothing (can work in parallel)
**Difficulty:** ⭐ Easy-Medium

### Objective
Implement pure utility functions for business logic calculations.

### File 1: Points Calculation - `lib/utils/points.ts`

```typescript
/**
 * Calculate points awarded based on match result
 * Win = 3 points, Draw = 1 point, Loss = 0 points
 */
export function calculatePoints(goalsFor: number, goalsAgainst: number): number {
  if (goalsFor > goalsAgainst) return 3 // Win
  if (goalsFor === goalsAgainst) return 1 // Draw
  return 0 // Loss
}

/**
 * Calculate goal difference
 */
export function calculateGoalDifference(goalsFor: number, goalsAgainst: number): number {
  return goalsFor - goalsAgainst
}

/**
 * Determine match result
 */
export function getMatchResult(goalsFor: number, goalsAgainst: number): "win" | "draw" | "loss" {
  if (goalsFor > goalsAgainst) return "win"
  if (goalsFor === goalsAgainst) return "draw"
  return "loss"
}
```

### File 2: Standings Sorting - `lib/utils/standings.ts`

```typescript
interface TeamStanding {
  equipoId: string
  nombre: string
  PJ: number  // Partidos jugados
  PG: number  // Partidos ganados
  PE: number  // Partidos empatados
  PP: number  // Partidos perdidos
  GF: number  // Goles a favor
  GC: number  // Goles en contra
  puntos: number
}

/**
 * Sort standings by business rules:
 * 1. Points DESC
 * 2. Goal difference DESC
 * 3. Goals for DESC
 */
export function sortStandings(standings: TeamStanding[]): TeamStanding[] {
  return [...standings].sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos

    const diffDiff = (b.GF - b.GC) - (a.GF - a.GC)
    if (diffDiff !== 0) return diffDiff

    return b.GF - a.GF
  })
}

/**
 * Get team's position in standings
 */
export function getTeamPosition(standings: TeamStanding[], equipoId: string): number {
  const sorted = sortStandings(standings)
  return sorted.findIndex(t => t.equipoId === equipoId) + 1
}
```

### File 3: Suspension Logic - `lib/utils/suspension.ts`

```typescript
/**
 * Calculate remaining suspension matches
 * Red card = 1+ matches, 3 yellows = 1 match suspension
 */
export function calculateSuspensionMatches(
  yellowCards: number,
  redCards: number,
  limiteAmarillas: number = 3
): number {
  let matches = 0
  matches += redCards  // Each red = 1 match
  matches += Math.floor(yellowCards / limiteAmarillas)  // Each 3 yellows = 1 match
  return matches
}

/**
 * Check if player is currently suspended
 */
export function isPlayerSuspended(suspensionMatches: number): boolean {
  return suspensionMatches > 0
}

/**
 * Get suspension reason
 */
export function getSuspensionReason(
  yellowCards: number,
  redCards: number,
  limiteAmarillas: number = 3
): string | null {
  if (redCards > 0) return `${redCards} tarjeta${redCards > 1 ? 's' : ''} roja`
  if (yellowCards >= limiteAmarillas) return `${yellowCards} tarjetas amarillas`
  return null
}
```

### File 4: Data Formatting - `lib/utils/format.ts`

```typescript
/**
 * Format currency (Ecuador - USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Format player full name
 */
export function formatPlayerName(
  primerNombre: string,
  segundoNombre: string | null,
  primerApellido: string,
  segundoApellido: string | null
): string {
  const nombres = [primerNombre, segundoNombre].filter(Boolean).join(' ')
  const apellidos = [primerApellido, segundoApellido].filter(Boolean).join(' ')
  return `${nombres} ${apellidos}`
}

/**
 * Format time for matches (HH:MM format)
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
}
```

### File 5: Debt Calculation - `lib/utils/debt.ts`

```typescript
interface Transaction {
  monto: number
  es_ingreso: boolean  // true = payment, false = fee
  pagado: boolean
}

/**
 * Calculate total debt for a team
 * Debt = unpaid fees - unpaid payments
 */
export function calculateTotalDebt(transacciones: Transaction[]): number {
  return transacciones
    .filter(t => !t.pagado)
    .reduce((total, t) => {
      return total + (t.es_ingreso ? -t.monto : t.monto)
    }, 0)
}

/**
 * Calculate paid vs pending breakdown
 */
export function calculateDebtBreakdown(transacciones: Transaction[]) {
  const paid = transacciones
    .filter(t => t.pagado)
    .reduce((sum, t) => sum + t.monto, 0)

  const pending = transacciones
    .filter(t => !t.pagado)
    .reduce((sum, t) => sum + t.monto, 0)

  return {
    paid,
    pending,
    total: paid + pending,
    percentagePaid: paid > 0 ? (paid / (paid + pending)) * 100 : 0,
  }
}

/**
 * Check if team has outstanding debt
 */
export function hasDebt(transacciones: Transaction[]): boolean {
  return calculateTotalDebt(transacciones) > 0
}
```

### Testing (Optional but Recommended)

Create unit tests in `lib/utils/__tests__/`:

```typescript
// lib/utils/__tests__/points.test.ts
import { calculatePoints, getMatchResult } from "../points"

describe("calculatePoints", () => {
  it("should return 3 for a win", () => {
    expect(calculatePoints(2, 1)).toBe(3)
  })

  it("should return 1 for a draw", () => {
    expect(calculatePoints(1, 1)).toBe(1)
  })

  it("should return 0 for a loss", () => {
    expect(calculatePoints(0, 2)).toBe(0)
  })
})
```

### Deliverable

- ✅ 5 utility files created
- ✅ 20+ functions implemented
- ✅ Full JSDoc documentation
- ✅ TypeScript strict typing
- ✅ Unit tests (optional)
- ✅ PR: "feat: add utility functions"

---

## 🧩 TASK 4: Component Skeletons

**Assigned to:** Junior #2
**Timeline:** 6-8 hours
**Priority:** ⭐⭐ MEDIUM
**Depends on:** Task 1 (structure exists)
**Difficulty:** ⭐⭐ Medium

### Objective
Create form and list components with structure but without Server Action connections yet.

### Component: Torneo Form

**File:** `components/torneos/torneo-form.tsx`

```typescript
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { torneoSchema, type Torneo } from "@/lib/validations/torneo"

interface TorneoFormProps {
  initialData?: Partial<Torneo>
  onSubmit?: (data: Torneo) => void | Promise<void>
}

export function TorneoForm({ initialData, onSubmit }: TorneoFormProps) {
  const form = useForm<Torneo>({
    resolver: zodResolver(torneoSchema),
    defaultValues: initialData || {
      nombre: "",
      categoria_id: "",
      fecha_inicio: new Date(),
      tiene_fase_grupos: true,
      tiene_eliminacion_directa: true,
    },
  })

  const handleSubmit = async (data: Torneo) => {
    // TODO: Connect to Server Action createTorneo()
    console.log("Form data:", data)
    if (onSubmit) {
      await onSubmit(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Torneo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Torneo Verano 2025" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TODO: Add remaining fields */}
        <p className="text-sm text-gray-500">TODO: Add categoria_id, fecha_inicio, fecha_fin, fase toggles</p>

        <div className="flex gap-2">
          <Button type="submit">
            {initialData ? "Actualizar" : "Crear"} Torneo
          </Button>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

### Components to Create (9 total)

Create these following the pattern above:

1. `components/torneos/torneo-form.tsx` - Create/edit form
2. `components/torneos/torneo-list.tsx` - List with table
3. `components/equipos/equipo-form.tsx` - Create/edit form
4. `components/equipos/equipo-list.tsx` - List with table
5. `components/jugadores/jugador-form.tsx` - Create/edit form
6. `components/jugadores/jugador-list.tsx` - List with table
7. `components/partidos/partido-form.tsx` - Create/edit form
8. `components/partidos/partido-list.tsx` - List with table
9. `components/financiero/transaccion-form.tsx` - Add transaction form

### Key Features for All Components

✅ Use react-hook-form + zodResolver
✅ Zod schemas for validation
✅ Props with TypeScript interfaces
✅ Error messages displayed
✅ Loading states (isPending)
✅ TODO comments for Server Actions
✅ shadcn/ui form components
✅ Responsive design

### Deliverable

- ✅ 9+ components created
- ✅ All forms using react-hook-form + Zod
- ✅ All lists showing placeholder data
- ✅ Proper TypeScript typing
- ✅ TODO comments indicating next steps
- ✅ PR: "feat: add component skeletons"

---

## 📊 TASK 5: Dashboard Home Improvements

**Assigned to:** Junior #1
**Timeline:** 3-5 hours
**Priority:** ⭐ LOW (cosmetic)
**Depends on:** Nothing (can work in parallel)
**Difficulty:** ⭐ Easy

### Objective
Enhance dashboard home page with visual statistics and quick actions.

### Update: `app/(dashboard)/page.tsx`

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, User, Play, DollarSign, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  // TODO: Replace with real data from Server Actions
  const stats = {
    torneos: 0,
    equipos: 0,
    jugadores: 0,
    partidos: 0,
    proximosPartidos: [],
    alertas: [],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al Sistema de Gestión GoolStar</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Torneos Activos</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.torneos}</div>
            <p className="text-xs text-muted-foreground">+0 desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.equipos}</div>
            <p className="text-xs text-muted-foreground">Total registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jugadores</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jugadores}</div>
            <p className="text-xs text-muted-foreground">En todos los equipos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partidos</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.partidos}</div>
            <p className="text-xs text-muted-foreground">Jugados este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Partidos</CardTitle>
            <CardDescription>Partidos programados esta semana</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.proximosPartidos.length === 0 ? (
              <p className="text-gray-500">No hay partidos programados.</p>
            ) : (
              <div>
                {/* TODO: Show next 5 matches */}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas & Tareas</CardTitle>
            <CardDescription>Notificaciones pendientes</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.alertas.length === 0 ? (
              <p className="text-gray-500">No hay alertas.</p>
            ) : (
              <div className="space-y-2">
                {/* TODO: Show pending documents, debts, suspensions */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### Features to Add

✅ Stats cards with icons (4-column grid)
✅ "Próximos Partidos" section
✅ "Alertas & Tareas" section
✅ Responsive grid layout
✅ Hover effects on cards
✅ Color-coded alerts
✅ Quick action buttons

### Deliverable

- ✅ Improved dashboard page
- ✅ Visual statistics display
- ✅ Responsive design
- ✅ Icons from lucide-react
- ✅ PR: "feat: improve dashboard home page"

---

## 📈 Execution Strategy

### Timeline

**Day 1 (Parallel):**
- Junior #3: Task 1 (Structure) - 2-3h
- Junior #1: Task 5 (Dashboard) - 3-5h *(in parallel)*
- Junior #2: Task 3 (Utilities) - 4-6h *(in parallel)*

**Day 2:**
- Junior #1: Task 2 (Pages) - 4-6h
- Junior #2: Task 4 (Components) - 6-8h *(in parallel)*

**Day 3:**
- Senior: Code review + merge (1-2h per task)
- Juniors: Adjustments per feedback

### Progress Tracking

Track progress in SETUP_CHECKLIST.md:

- [ ] Task 1: Project structure complete
- [ ] Task 2: Dashboard pages implemented
- [ ] Task 3: Utility functions done
- [ ] Task 4: Component skeletons ready
- [ ] Task 5: Dashboard home improved
- [ ] All PRs reviewed and merged

---

## 🔗 Blockers & Dependencies

**Task 1 blocks:** Task 2, Task 4
- ✅ Task 3: Utilities (independent, can work in parallel)
- ✅ Task 5: Dashboard (independent, can work in parallel)

**If blocked waiting for Senior:**
- Work on next task
- Review others' code
- Add tests for utilities
- Improve component styling

---

## ✅ Acceptance Criteria

### Task 1 Complete When:
- [ ] All 16 page files exist
- [ ] All 20+ component files exist
- [ ] All 5 action files exist
- [ ] All 5 utility files exist
- [ ] Each file has TODO comments
- [ ] 0 TypeScript errors
- [ ] PR merged

### Task 2 Complete When:
- [ ] All 6 list pages implemented
- [ ] Consistent header/layout
- [ ] Navigation working
- [ ] No hardcoded data
- [ ] Responsive design verified
- [ ] PR merged

### Task 3 Complete When:
- [ ] 5 utility files with 20+ functions
- [ ] Full JSDoc documentation
- [ ] Unit tests (optional)
- [ ] No TypeScript errors
- [ ] PR merged

### Task 4 Complete When:
- [ ] 9+ components created
- [ ] All using react-hook-form + Zod
- [ ] Form validation working
- [ ] Proper TypeScript typing
- [ ] PR merged

### Task 5 Complete When:
- [ ] Dashboard page improved
- [ ] 4 stats cards displayed
- [ ] Sections for upcoming/alerts
- [ ] Responsive design verified
- [ ] PR merged

---

## 📚 Resources

### Documentation
- [CLAUDE.md](CLAUDE.md) - Development patterns
- [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Track progress
- [info_project.md](info_project.md) - Business rules

### Libraries
- [React Hook Form](https://react-hook-form.com) - Form handling
- [Zod](https://zod.dev) - Validation
- [shadcn/ui](https://ui.shadcn.com) - Components
- [Lucide React](https://lucide.dev) - Icons

---

## 🎯 Success Criteria for Phase 2

Phase 2 is complete when:
- ✅ All 5 tasks completed and merged
- ✅ Project structure complete (80+ files)
- ✅ All pages navigable
- ✅ All components have structure ready
- ✅ All utility functions implemented
- ✅ Dashboard home improved with stats
- ✅ 0 TypeScript errors
- ✅ Ready for Phase 3 (Server Actions implementation)

---

**Created:** 2025-11-22
**Phase:** 2 - Dashboard & Entity Pages
**Total Tasks:** 5
**Total Effort:** 19-28 hours
**Total Files:** 80+
**Estimated Timeline:** 3 days parallel work

Ready to build! 🚀
