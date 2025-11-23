# 🎯 SPRINT 1: Complete Phase 2 - Dashboard & Entity Pages

**Duration:** 1-2 días
**Developers:** 3
**Phase:** Phase 2 (80% → 100%)
**Priority:** 🔴 CRITICAL

---

## 📋 OVERVIEW

### Objective
Complete the remaining 20% of Phase 2 by implementing:
- Complete form validation with Zod
- Enhanced dashboard home page
- Structured list components

### Current Status
- ✅ Project structure created (67 files)
- ✅ Server Actions implemented
- ✅ Utility functions implemented
- ⏳ Form validation incomplete
- ⏳ Dashboard home basic
- ⏳ List components basic

### Deliverables
- All forms with complete Zod validation
- Dashboard home with stats cards
- List components with table structure
- 0 TypeScript errors
- Responsive design

---

## 👥 TRACK ASSIGNMENTS

### Track A - Component Forms (6-8h)
**Assigned to:** Developer #1
**Files to modify:** 5 form components
**Dependencies:** None
**Can start:** Immediately

### Track B - Dashboard Home (3-5h)
**Assigned to:** Developer #2
**Files to modify:** 1 page + 3 new components
**Dependencies:** None
**Can start:** Immediately

### Track C - Component Lists (4-6h)
**Assigned to:** Developer #3
**Files to modify:** 4 list components
**Dependencies:** None
**Can start:** Immediately

---

## 🔧 TRACK A: Component Forms

### Developer: #1
### Timeline: 6-8 hours
### Priority: ⭐⭐⭐ CRITICAL

### Tasks Checklist

#### 1. Torneo Form (1.5h)
- [ ] Open `components/torneos/torneo-form.tsx`
- [ ] Verify all fields present: nombre, categoria_id, fecha_inicio, fecha_fin, tiene_fase_grupos, tiene_eliminacion_directa
- [ ] Add categoria select with data fetching
- [ ] Add date pickers for fecha_inicio/fin
- [ ] Add checkboxes for phase toggles
- [ ] Test validation works
- [ ] Test form submission

#### 2. Equipo Form (1.5h)
- [ ] Open `components/equipos/equipo-form.tsx`
- [ ] Add all fields from `lib/validations/equipo.ts`
- [ ] Add torneo select dropdown
- [ ] Add grupo select (A, B, C, D)
- [ ] Add delegado info fields
- [ ] Test validation
- [ ] Test form submission

#### 3. Jugador Form (2h)
- [ ] Open `components/jugadores/jugador-form.tsx`
- [ ] Add personal info fields (4 name fields, cedula, fecha_nacimiento)
- [ ] Add equipo select dropdown
- [ ] Add position select (Portero, Defensa, Mediocampista, Delantero)
- [ ] Add numero_camiseta input
- [ ] Add contacto fields (telefono, email)
- [ ] Test validation
- [ ] Test form submission

#### 4. Partido Form (2h)
- [ ] Open `components/partidos/partido-form.tsx`
- [ ] Add torneo select
- [ ] Add equipos select (local/visitante)
- [ ] Add fecha/hora pickers
- [ ] Add cancha input
- [ ] Add jornada select (if fase grupos)
- [ ] Add fase_eliminatoria select (if knockout)
- [ ] Test validation
- [ ] Test form submission

#### 5. Transaccion Form (1h)
- [ ] Open `components/financiero/transaccion-form.tsx`
- [ ] Add equipo select
- [ ] Add tipo select (inscripción, multa, pago_arbitro, pago_cancha, otro)
- [ ] Add monto input (currency)
- [ ] Add concepto textarea
- [ ] Add pagado checkbox
- [ ] Test validation
- [ ] Test form submission

### Code Template: Form Field Pattern

```typescript
<FormField
  control={form.control}
  name="field_name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label</FormLabel>
      <FormControl>
        <Input
          placeholder="Placeholder text"
          {...field}
        />
      </FormControl>
      <FormDescription>
        Help text for the user
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Code Template: Select Field Pattern

```typescript
<FormField
  control={form.control}
  name="select_field"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Select Label</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.id}>
              {opt.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Code Template: Date Field Pattern

```typescript
<FormField
  control={form.control}
  name="fecha_inicio"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Fecha de Inicio</FormLabel>
      <FormControl>
        <Input
          type="date"
          value={
            field.value instanceof Date
              ? field.value.toISOString().split("T")[0]
              : ""
          }
          onChange={(e) => field.onChange(new Date(e.target.value))}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Code Template: Checkbox Field Pattern

```typescript
<FormField
  control={form.control}
  name="tiene_fase_grupos"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Fase de Grupos</FormLabel>
        <FormDescription>
          El torneo incluirá una fase de grupos
        </FormDescription>
      </div>
    </FormItem>
  )}
/>
```

### Acceptance Criteria
- [ ] All 5 forms have complete field implementation
- [ ] All fields use proper Zod validation
- [ ] Error messages display correctly
- [ ] Loading states work (disabled button during submit)
- [ ] Success toasts appear after submission
- [ ] Forms reset after successful create
- [ ] Forms populate with initialData for edit mode
- [ ] 0 TypeScript errors
- [ ] Responsive design (mobile-friendly)

---

## 🏠 TRACK B: Dashboard Home

### Developer: #2
### Timeline: 3-5 hours
### Priority: ⭐⭐ HIGH

### Tasks Checklist

#### 1. Dashboard Stats Cards (1.5h)
- [ ] Create `components/dashboard/stats-card.tsx`
- [ ] Update `app/(dashboard)/page.tsx`
- [ ] Add 4 stat cards:
  - Torneos Activos (Trophy icon)
  - Equipos Registrados (Users icon)
  - Jugadores Total (User icon)
  - Partidos del Mes (Play icon)
- [ ] Add Server Action to fetch real counts
- [ ] Style with hover effects

#### 2. Upcoming Matches Section (1h)
- [ ] Create `components/dashboard/upcoming-matches.tsx`
- [ ] Query próximos 5 partidos (fecha >= today, completado = false)
- [ ] Display: fecha, hora, equipos, cancha
- [ ] Add link to partido details
- [ ] Handle empty state

#### 3. Alerts Section (1h)
- [ ] Create `components/dashboard/dashboard-alerts.tsx`
- [ ] Query for alerts:
  - Documentos pendientes verificación
  - Equipos con deuda
  - Jugadores suspendidos
- [ ] Display with color-coded badges
- [ ] Add action buttons (view, resolve)
- [ ] Handle empty state

#### 4. Integration & Polish (0.5h)
- [ ] Integrate all components into dashboard page
- [ ] Add responsive grid layout
- [ ] Test on mobile/tablet
- [ ] Add loading states
- [ ] Add error boundaries

### File: `components/dashboard/stats-card.tsx`

```typescript
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value} desde el mes pasado
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

### File: `app/(dashboard)/page.tsx` (Updated)

```typescript
import { Trophy, Users, User, Play } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { UpcomingMatches } from "@/components/dashboard/upcoming-matches";
import { DashboardAlerts } from "@/components/dashboard/dashboard-alerts";
import { getDashboardStats } from "@/actions/dashboard";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al Sistema de Gestión GoolStar</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Torneos Activos"
          value={stats.torneosActivos}
          description="En curso actualmente"
          icon={Trophy}
        />
        <StatsCard
          title="Equipos Registrados"
          value={stats.totalEquipos}
          description="Total en el sistema"
          icon={Users}
        />
        <StatsCard
          title="Jugadores"
          value={stats.totalJugadores}
          description="Activos en equipos"
          icon={User}
        />
        <StatsCard
          title="Partidos del Mes"
          value={stats.partidosEsteMes}
          description="Jugados en el mes actual"
          icon={Play}
        />
      </div>

      {/* Quick Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        <UpcomingMatches />
        <DashboardAlerts />
      </div>
    </div>
  );
}
```

### File: `actions/dashboard.ts`

```typescript
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: torneosActivos },
    { count: totalEquipos },
    { count: totalJugadores },
    { count: partidosEsteMes },
  ] = await Promise.all([
    supabase
      .from("torneos")
      .select("*", { count: "exact", head: true })
      .eq("activo", true),

    supabase
      .from("equipos")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("jugadores")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("partidos")
      .select("*", { count: "exact", head: true })
      .gte("fecha", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      .eq("completado", true),
  ]);

  return {
    torneosActivos: torneosActivos || 0,
    totalEquipos: totalEquipos || 0,
    totalJugadores: totalJugadores || 0,
    partidosEsteMes: partidosEsteMes || 0,
  };
}

export async function getUpcomingMatches(limit = 5) {
  const supabase = await createServerSupabaseClient();

  const { data: partidos } = await supabase
    .from("partidos")
    .select(`
      *,
      equipo_local:equipos!partidos_equipo_local_id_fkey(nombre),
      equipo_visitante:equipos!partidos_equipo_visitante_id_fkey(nombre)
    `)
    .gte("fecha", new Date().toISOString())
    .eq("completado", false)
    .order("fecha", { ascending: true })
    .limit(limit);

  return partidos || [];
}

export async function getDashboardAlerts() {
  const supabase = await createServerSupabaseClient();

  // Get pending documents
  const { count: documentosPendientes } = await supabase
    .from("jugadores")
    .select("*", { count: "exact", head: true })
    .eq("estado_documento", "pendiente");

  // Get teams with debt
  const { count: equiposConDeuda } = await supabase
    .from("equipos")
    .select("*", { count: "exact", head: true })
    .gt("deuda_total", 0);

  // Get suspended players
  const { count: jugadoresSuspendidos } = await supabase
    .from("jugadores")
    .select("*", { count: "exact", head: true })
    .gt("partidos_suspension", 0);

  return {
    documentosPendientes: documentosPendientes || 0,
    equiposConDeuda: equiposConDeuda || 0,
    jugadoresSuspendidos: jugadoresSuspendidos || 0,
  };
}
```

### Acceptance Criteria
- [ ] Dashboard displays 4 stat cards with real data
- [ ] Upcoming matches section shows next 5 matches
- [ ] Alerts section shows pending items
- [ ] All sections responsive (mobile/tablet/desktop)
- [ ] Loading states display while fetching
- [ ] Empty states show when no data
- [ ] Icons from lucide-react display correctly
- [ ] 0 TypeScript errors

---

## 📊 TRACK C: Component Lists

### Developer: #3
### Timeline: 4-6 hours
### Priority: ⭐⭐ HIGH

### Tasks Checklist

#### 1. Torneo List (1h)
- [ ] Update `components/torneos/torneo-list.tsx`
- [ ] Add Table component from shadcn/ui
- [ ] Columns: Nombre, Categoría, Fecha Inicio, Equipos, Acciones
- [ ] Add loading skeleton
- [ ] Add empty state
- [ ] Add action buttons (ver, editar, eliminar)
- [ ] Test with data

#### 2. Equipo List (1h)
- [ ] Update `components/equipos/equipo-list.tsx`
- [ ] Columns: Nombre, Torneo, Grupo, Delegado, PJ, Pts, Acciones
- [ ] Add filters (por torneo, por grupo)
- [ ] Add search
- [ ] Add loading/empty states
- [ ] Test with data

#### 3. Jugador List (1.5h)
- [ ] Update `components/jugadores/jugador-list.tsx`
- [ ] Columns: Nombre, Cédula, Equipo, Posición, Tarjetas, Estado Doc, Acciones
- [ ] Add filters (por equipo, por estado doc)
- [ ] Add search by name/cedula
- [ ] Add badges for suspensions
- [ ] Add loading/empty states
- [ ] Test with data

#### 4. Partido List (1.5h)
- [ ] Update `components/partidos/partido-list.tsx`
- [ ] Columns: Fecha, Hora, Local, Visitante, Resultado, Estado, Acciones
- [ ] Add filters (por torneo, por jornada, por estado)
- [ ] Add date range picker
- [ ] Add status badges (pendiente, completado)
- [ ] Add loading/empty states
- [ ] Test with data

### Code Template: Table List Component

```typescript
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface ListItem {
  id: string;
  // Add other fields
}

interface ListProps {
  items: ListItem[];
  isLoading?: boolean;
}

export function EntityList({ items, isLoading }: ListProps) {
  if (isLoading) {
    return <div>Loading...</div>; // TODO: Add skeleton
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay registros aún.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Column 1</TableHead>
            <TableHead>Column 2</TableHead>
            <TableHead>Column 3</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>
                <Badge variant="default">Status</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/entity/${item.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/entity/${item.id}/editar`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Code Template: Loading Skeleton

```typescript
import { Skeleton } from "@/components/ui/skeleton";

export function ListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
```

### Acceptance Criteria
- [ ] All 4 list components display table structure
- [ ] Tables show correct columns per entity
- [ ] Action buttons (view, edit, delete) present
- [ ] Loading skeletons display while fetching
- [ ] Empty states show when no data
- [ ] Filters work correctly
- [ ] Search functionality works
- [ ] Responsive design (horizontal scroll on mobile)
- [ ] 0 TypeScript errors

---

## ✅ SPRINT 1 ACCEPTANCE CRITERIA

### Overall Sprint Complete When:
- [ ] All Track A tasks complete (5 forms validated)
- [ ] All Track B tasks complete (dashboard enhanced)
- [ ] All Track C tasks complete (4 lists structured)
- [ ] 0 TypeScript errors in entire project
- [ ] `bun run lint` passes
- [ ] `bun run build` succeeds
- [ ] Manual testing completed
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] All PRs created and reviewed
- [ ] Phase 2 marked as 100% complete

---

## 📦 DELIVERABLES

### Pull Requests to Create
1. **PR #1:** `feat: complete form validations` (Track A)
2. **PR #2:** `feat: enhance dashboard home page` (Track B)
3. **PR #3:** `feat: add structured list components` (Track C)

### PR Template
```markdown
## Description
[Brief description of changes]

## Changes
- [ ] List of files modified
- [ ] List of features added

## Testing
- [ ] Manual testing completed
- [ ] Forms validate correctly
- [ ] No console errors
- [ ] Responsive design verified

## Screenshots
[Add screenshots if applicable]

## Checklist
- [ ] TypeScript strict mode passes
- [ ] Biome linting passes
- [ ] No breaking changes
```

---

## 🚀 HOW TO START

### For Developer #1 (Track A)
```bash
# 1. Pull latest code
git pull origin claude/review-app-roadmap-019jdtnLAQQGtgJzRmqEiRKL

# 2. Create feature branch
git checkout -b feat/complete-form-validations

# 3. Start with torneo form
code components/torneos/torneo-form.tsx

# 4. Reference validation schema
code lib/validations/torneo.ts

# 5. Use templates from this guide
# 6. Test each form as you complete it
bun run dev
# Open http://localhost:3000

# 7. Commit and push when done
git add .
git commit -m "feat: complete form validations for all entities"
git push -u origin feat/complete-form-validations
```

### For Developer #2 (Track B)
```bash
# 1. Create feature branch
git checkout -b feat/enhance-dashboard-home

# 2. Create stats-card component
code components/dashboard/stats-card.tsx

# 3. Create dashboard actions
code actions/dashboard.ts

# 4. Update dashboard page
code app/(dashboard)/page.tsx

# 5. Test in browser
bun run dev

# 6. Commit and push
git add .
git commit -m "feat: enhance dashboard home with stats and alerts"
git push -u origin feat/enhance-dashboard-home
```

### For Developer #3 (Track C)
```bash
# 1. Create feature branch
git checkout -b feat/structured-list-components

# 2. Start with torneo list
code components/torneos/torneo-list.tsx

# 3. Use table template from guide

# 4. Test each list
bun run dev

# 5. Commit and push
git add .
git commit -m "feat: add structured list components with tables"
git push -u origin feat/structured-list-components
```

---

## 📞 SUPPORT

### Common Issues

**Issue:** Zod validation not working
- Check zodResolver is imported
- Verify schema matches form fields
- Check for typos in field names

**Issue:** Form not submitting
- Check onSubmit handler
- Verify Server Action import
- Check for console errors

**Issue:** TypeScript errors
- Run `bun run dev` to see errors
- Check types in `types/database.ts`
- Verify imports are correct

### Questions?
- Review [CODE_TEMPLATES.md](./CODE_TEMPLATES.md)
- Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- Ask in team chat

---

**Next:** [Sprint 2: Match Management](./SPRINT_2_PHASE_3.md)
