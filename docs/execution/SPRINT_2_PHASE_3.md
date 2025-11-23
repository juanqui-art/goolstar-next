# ⚽ SPRINT 2: Phase 3 - Match Management System

**Duration:** 3-4 días
**Developers:** 3
**Phase:** Phase 3 - Gestión Partidos
**Priority:** 🔴 CRITICAL

---

## 📋 OVERVIEW

### Objective
Build complete match management system including:
- Match CRUD operations
- Live events (goals, cards, substitutions)
- Fixture generation
- Match reports (actas)
- Automatic statistics updates via database triggers

### Dependencies
- ✅ Sprint 1 complete (forms functional)
- ✅ Database triggers configured (migrations 007)
- ✅ Partido validation schema exists

---

## 👥 TRACK ASSIGNMENTS

### Track A - Partidos CRUD (1 día)
**Developer #1** | **Independent** | Can start immediately

### Track B - Events System (1 día)
**Developer #2** | **Independent** | Can start immediately

### Track C - Fixture & Calendar (1 día)
**Developer #3** | **Independent** | Can start immediately

### Track D - Acta & Finalization (1 día)
**Developer #1 or #2** | **⚠️ Depends on A + B** | Sequential

---

## 🎯 TRACK A: Partidos CRUD

### Developer: #1 | 1 día (8h)

### Tasks

#### 1. Complete Validation Schema (30min)
```bash
File: lib/validations/partido.ts
```

**Add missing fields:**
```typescript
export const partidoSchema = z.object({
  torneo_id: z.string().uuid(),
  equipo_local_id: z.string().uuid(),
  equipo_visitante_id: z.string().uuid(),
  fecha: z.date(),
  hora: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  cancha: z.string().min(1),
  jornada_id: z.string().uuid().optional(),
  fase_eliminatoria_id: z.string().uuid().optional(),
  arbitro_principal: z.string().optional(),
  arbitro_asistente: z.string().optional(),
}).refine(
  (data) => data.jornada_id || data.fase_eliminatoria_id,
  { message: "Must have either jornada_id or fase_eliminatoria_id" }
);
```

#### 2. Implement List Page (2h)
```bash
File: app/(dashboard)/partidos/page.tsx
```

**Features:**
- [ ] Server Component que fetches partidos con `getPartidos()`
- [ ] Filters: torneo, jornada, estado (pendiente/completado)
- [ ] Date range picker
- [ ] Use `PartidosList` component
- [ ] Pagination (20 per page)

**Code:**
```typescript
import { getPartidos } from "@/actions/partidos";
import { PartidosList } from "@/components/partidos/partido-list";

export default async function PartidosPage({
  searchParams,
}: {
  searchParams: { torneo?: string; estado?: string };
}) {
  const partidos = await getPartidos({
    torneoId: searchParams.torneo,
    completado: searchParams.estado === "completado" ? true :
                searchParams.estado === "pendiente" ? false : undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Partidos</h1>
        <Link href="/partidos/nuevo">
          <Button>Programar Partido</Button>
        </Link>
      </div>

      {/* Filters */}
      <PartidosFilters />

      {/* List */}
      <PartidosList partidos={partidos} />
    </div>
  );
}
```

#### 3. Implement Create Page (2h)
```bash
File: app/(dashboard)/partidos/nuevo/page.tsx
```

**Features:**
- [ ] Use `PartidoForm` component
- [ ] Fetch torneos for select
- [ ] Fetch equipos based on selected torneo
- [ ] Date/time pickers
- [ ] Redirect to partido detail on success

#### 4. Implement Detail Page (2.5h)
```bash
File: app/(dashboard)/partidos/[id]/page.tsx
```

**Features:**
- [ ] Display match info (teams, date, location)
- [ ] Display current score
- [ ] Display events timeline (goals, cards, changes)
- [ ] Show both team lineups
- [ ] Action buttons: Edit, Complete Match, View Acta
- [ ] Conditional UI based on match status

**Code:**
```typescript
import { getPartido } from "@/actions/partidos";
import { PartidoCard } from "@/components/partidos/partido-card";
import { EventosTimeline } from "@/components/partidos/eventos-timeline";
import { FinalizarPartidoForm } from "@/components/partidos/finalizar-partido-form";

export default async function PartidoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const partido = await getPartido(params.id);

  return (
    <div className="space-y-6">
      {/* Match Header */}
      <PartidoCard partido={partido} />

      {/* Events Timeline (if match started) */}
      {partido.goles || partido.tarjetas ? (
        <EventosTimeline partidoId={partido.id} />
      ) : null}

      {/* Finalize Match Form (if not completed) */}
      {!partido.completado && (
        <FinalizarPartidoForm partidoId={partido.id} />
      )}

      {/* View Acta (if completed) */}
      {partido.completado && (
        <Link href={`/partidos/${partido.id}/acta`}>
          <Button>Ver Acta del Partido</Button>
        </Link>
      )}
    </div>
  );
}
```

#### 5. Update Server Actions (1h)
```bash
File: actions/partidos.ts
```

**Ensure these functions work:**
- `getPartidos(filters)` - List with filters
- `getPartido(id)` - Single with relations
- `createPartido(data)` - Create new
- `updatePartido(id, data)` - Update
- `deletePartido(id)` - Soft delete

### Acceptance Criteria
- [ ] Can list all partidos with filters
- [ ] Can create new partido
- [ ] Can view partido details
- [ ] Can edit partido (if not completed)
- [ ] All TypeScript types correct
- [ ] Responsive design

---

## 🎮 TRACK B: Events System

### Developer: #2 | 1 día (8h)

### Tasks

#### 1. Goal Quick Form (1.5h)
```bash
File: components/partidos/gol-form-quick.tsx
```

**Features:**
- [ ] Select jugador (from both teams)
- [ ] Input minuto
- [ ] Select tipo (normal, penal, autogol)
- [ ] Optional: asistencia (jugador_id)
- [ ] Submit calls `addGol()` Server Action

**Code:**
```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addGol } from "@/actions/partidos";

const golSchema = z.object({
  partido_id: z.string().uuid(),
  jugador_id: z.string().uuid(),
  minuto: z.number().min(0).max(120),
  tipo_gol: z.enum(["normal", "penal", "autogol"]),
  asistencia_jugador_id: z.string().uuid().optional(),
});

export function GolFormQuick({ partidoId, jugadores }: Props) {
  const form = useForm({
    resolver: zodResolver(golSchema),
    defaultValues: {
      partido_id: partidoId,
      tipo_gol: "normal",
    },
  });

  const onSubmit = async (data) => {
    await addGol(data);
    toast.success("Gol registrado");
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Jugador Select */}
        {/* Minuto Input */}
        {/* Tipo Select */}
        <Button type="submit">Registrar Gol</Button>
      </form>
    </Form>
  );
}
```

#### 2. Card Quick Form (1.5h)
```bash
File: components/partidos/tarjeta-form-quick.tsx
```

**Features:**
- [ ] Select jugador
- [ ] Input minuto
- [ ] Select tipo (amarilla, roja, amarilla_roja)
- [ ] Optional: motivo textarea
- [ ] Submit calls `addTarjeta()` Server Action
- [ ] Show warning if player reaches 3 yellow cards

#### 3. Change Quick Form (1h)
```bash
File: components/partidos/cambio-form-quick.tsx
```

**Features:**
- [ ] Select equipo
- [ ] Select jugador_sale (must be in lineup)
- [ ] Select jugador_entra (must not be in lineup)
- [ ] Input minuto
- [ ] Submit calls `addCambio()` Server Action

#### 4. Events Timeline (2h)
```bash
File: components/partidos/eventos-timeline.tsx
```

**Features:**
- [ ] Display all events chronologically
- [ ] Icons for each event type (goal, card, substitution)
- [ ] Minute marker
- [ ] Player names
- [ ] Color-coded by event type
- [ ] Realtime updates (optional)

**Code:**
```typescript
import { Target, AlertTriangle, ArrowLeftRight } from "lucide-react";

export function EventosTimeline({ partidoId }: { partidoId: string }) {
  const eventos = useEventos(partidoId); // Custom hook

  return (
    <div className="space-y-2">
      {eventos.map((evento) => (
        <div key={evento.id} className="flex items-center gap-4 p-3 border rounded">
          {/* Icon based on type */}
          {evento.tipo === "gol" && <Target className="h-5 w-5 text-green-600" />}
          {evento.tipo === "tarjeta" && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
          {evento.tipo === "cambio" && <ArrowLeftRight className="h-5 w-5 text-blue-600" />}

          {/* Minute */}
          <span className="font-bold">{evento.minuto}'</span>

          {/* Description */}
          <span>{evento.descripcion}</span>
        </div>
      ))}
    </div>
  );
}
```

#### 5. Server Actions (2h)
```bash
File: actions/partidos.ts (add these)
```

**Implement:**
```typescript
export async function addGol(data: GolData) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("goles")
    .insert({
      partido_id: data.partido_id,
      jugador_id: data.jugador_id,
      minuto: data.minuto,
      tipo_gol: data.tipo_gol,
      asistencia_jugador_id: data.asistencia_jugador_id,
    });

  if (error) throw new Error(error.message);

  revalidatePath(`/partidos/${data.partido_id}`);
  return { success: true };
}

export async function addTarjeta(data: TarjetaData) {
  // Similar pattern
  // NOTE: Database trigger will handle suspension logic
}

export async function addCambio(data: CambioData) {
  // Similar pattern
}
```

### Acceptance Criteria
- [ ] Can register goals with all details
- [ ] Can register cards (yellow/red)
- [ ] Can register substitutions
- [ ] Events display in timeline
- [ ] Database triggers update player suspensions
- [ ] All forms validate correctly

---

## 📅 TRACK C: Fixture & Calendar

### Developer: #3 | 1 día (8h)

### Tasks

#### 1. Fixture Manager Component (4h)
```bash
File: components/torneos/fixture-manager.tsx
```

**Features:**
- [ ] Display all jornadas for tournament
- [ ] Group matches by jornada
- [ ] Show match cards with teams, date, time
- [ ] Allow adding matches to jornada
- [ ] Drag-and-drop to reschedule (optional)

#### 2. Fixture Page (2h)
```bash
File: app/(dashboard)/torneos/[id]/fixture/page.tsx
```

**Code:**
```typescript
import { getJornadas } from "@/actions/fixture";
import { FixtureManager } from "@/components/torneos/fixture-manager";

export default async function FixturePage({
  params,
}: {
  params: { id: string };
}) {
  const jornadas = await getJornadas(params.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Fixture - Torneo</h1>
      <FixtureManager torneoId={params.id} jornadas={jornadas} />
    </div>
  );
}
```

#### 3. Calendar Component (2h)
```bash
File: components/partidos/calendario-partidos.tsx
```

**Features:**
- [ ] Calendar view of all matches
- [ ] Color-coded by tournament
- [ ] Click to view match details
- [ ] Filter by torneo/cancha

### Acceptance Criteria
- [ ] Fixture displays all jornadas
- [ ] Can view matches organized by matchday
- [ ] Calendar shows matches by date
- [ ] Can navigate between dates
- [ ] Links to match details work

---

## 📄 TRACK D: Acta & Finalization

### Developer: #1 or #2 | 1 día (8h)
### ⚠️ **Depends on:** Track A + B complete

### Tasks

#### 1. Finalize Match Form (2h)
```bash
File: components/partidos/finalizar-partido-form.tsx
```

**Features:**
- [ ] Show current score
- [ ] Confirm lineup for both teams
- [ ] Add final observations
- [ ] Button: "Finalizar Partido"
- [ ] Calls `completePartido()` Server Action

**Code:**
```typescript
export function FinalizarPartidoForm({ partidoId }: Props) {
  const handleFinalize = async () => {
    await completePartido(partidoId);
    toast.success("Partido finalizado - Estadísticas actualizadas");
    router.push(`/partidos/${partidoId}/acta`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finalizar Partido</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current score */}
        {/* Observations textarea */}
        <Button onClick={handleFinalize}>Finalizar Partido</Button>
      </CardContent>
    </Card>
  );
}
```

#### 2. Acta Component (3h)
```bash
File: components/partidos/acta-partido.tsx
```

**Features:**
- [ ] Print-friendly layout
- [ ] Match info (teams, date, location, referee)
- [ ] Final score
- [ ] Lineups for both teams
- [ ] Events timeline (goals, cards, changes)
- [ ] Signatures section (referee, delegados)
- [ ] Print button

#### 3. Acta Page (1h)
```bash
File: app/(dashboard)/partidos/[id]/acta/page.tsx
```

**Features:**
- [ ] Fetch complete match data
- [ ] Render ActaPartido component
- [ ] Print styles
- [ ] Download as PDF button (optional)

#### 4. Testing Database Triggers (2h)

**Critical Tests:**
```bash
# Test 1: Complete Match Updates Statistics
1. Create partido
2. Add goals for both teams
3. Call completePartido()
4. Verify estadistica_equipo updated:
   - PJ incremented
   - PG/PE/PP updated based on result
   - GF/GC updated
   - Puntos calculated correctly

# Test 2: Red Card Suspends Player
1. Add red card to jugador
2. Verify jugador.partidos_suspension = 1
3. Verify jugador cannot be in next lineup

# Test 3: Three Yellow Cards Suspend Player
1. Add 3 yellow cards to jugador (across matches)
2. Verify jugador.partidos_suspension = 1
3. Verify yellow cards reset after suspension served

# Test 4: Inasistencia Increments
1. Create partido
2. Mark equipo as absent (no lineup)
3. Verify equipo.inasistencias incremented
```

**Verification:**
```sql
-- Check estadistica_equipo updated
SELECT * FROM estadistica_equipo WHERE torneo_id = 'xxx';

-- Check player suspensions
SELECT primer_nombre, primer_apellido, amarillas_totales, rojas_totales, partidos_suspension
FROM jugadores
WHERE partidos_suspension > 0;
```

### Acceptance Criteria
- [ ] Can finalize match
- [ ] Acta displays all match info correctly
- [ ] Acta is print-friendly
- [ ] Database triggers confirmed working:
  - [ ] Statistics update on match completion
  - [ ] Red card suspends player
  - [ ] 3 yellow cards suspend player
  - [ ] Inasistencias increment correctly
- [ ] All TypeScript types correct

---

## ✅ SPRINT 2 ACCEPTANCE CRITERIA

### Overall Sprint Complete When:
- [ ] All Track A tasks complete (CRUD working)
- [ ] All Track B tasks complete (events working)
- [ ] All Track C tasks complete (fixture working)
- [ ] All Track D tasks complete (acta + triggers verified)
- [ ] Database triggers tested and working
- [ ] Can complete full match flow:
  - [ ] Create partido
  - [ ] Add goals, cards, changes
  - [ ] Finalize partido
  - [ ] View acta
  - [ ] Verify statistics updated
- [ ] 0 TypeScript errors
- [ ] `bun run build` succeeds
- [ ] Phase 3 marked as 100% complete

---

## 🚀 HOW TO START

### Track A (Developer #1)
```bash
git checkout -b feat/partidos-crud
code lib/validations/partido.ts
code app/(dashboard)/partidos/page.tsx
bun run dev
```

### Track B (Developer #2)
```bash
git checkout -b feat/match-events-system
code components/partidos/gol-form-quick.tsx
code actions/partidos.ts
bun run dev
```

### Track C (Developer #3)
```bash
git checkout -b feat/fixture-calendar
code components/torneos/fixture-manager.tsx
bun run dev
```

### Track D (After A + B complete)
```bash
git checkout -b feat/match-finalization
code components/partidos/finalizar-partido-form.tsx
code components/partidos/acta-partido.tsx
bun run dev
```

---

**Previous:** [Sprint 1](./SPRINT_1_PHASE_2.md)
**Next:** [Sprint 3: Statistics](./SPRINT_3_PHASE_4.md)
