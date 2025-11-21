# GoolStar MVP Roadmap

**Timeline:** 4-5 weeks (20-25 business days)
**Architecture:** Monolito (single Next.js app)
**Target:** Functional MVP for indoor soccer tournament management

---

## 📋 Phases Overview

| Phase | Focus | Duration | Status |
|-------|-------|----------|--------|
| **Phase 0** | Setup Base | 1-2 days | 🔄 Next |
| **Phase 1** | CRUD Básico | 3-4 days | Pending |
| **Phase 2** | Gestión Partidos | 3-4 days | Pending |
| **Phase 3** | Estadísticas | 2-3 days | Pending |
| **Phase 4** | Sistema Financiero | 2-3 days | Pending |
| **Phase 5** | Admin Panel | 2-3 days | Pending |
| **Phase 6** | Testing & Deploy | 2-3 days | Pending |

---

## 🚀 Phase 0: Setup Base (1-2 days)

### Objective
Get development environment ready with Supabase, authentication, and UI components.

### Deliverables
- [ ] Supabase project created and configured locally
- [ ] All 10 migrations executed successfully
- [ ] TypeScript types generated from database
- [ ] shadcn/ui installed and configured
- [ ] Authentication (login/register) working
- [ ] Protected routes middleware setup
- [ ] Basic dashboard layout

### Tasks
1. **Supabase Setup**
   - Create Supabase project
   - Install and initialize Supabase CLI locally
   - Configure `.env.local` with local Supabase URLs
   - Run `supabase start` to spin up local database

2. **Database Migrations**
   - Execute migrations in order (001-010):
     - 001: Initial extensions and enums
     - 002: Categorías and Torneos
     - 003: Equipos and Jugadores
     - 004: Partidos and Competición
     - 005: Estadísticas
     - 006: Sistema Financiero
     - 007: Triggers
     - 008: Functions
     - 009: RLS Policies
     - 010: Indexes
   - Verify all tables created: `supabase db list`

3. **Types Generation**
   - Generate TypeScript types: `supabase gen types typescript --local > types/database.ts`
   - Verify types in `types/database.ts`

4. **Authentication**
   - Set up Supabase Auth
   - Create `lib/supabase/client.ts` - Client-side Supabase instance
   - Create `lib/supabase/server.ts` - Server-side Supabase instance
   - Create auth middleware in `app/middleware.ts`
   - Create login page: `app/(auth)/login/page.tsx`
   - Create register page: `app/(auth)/register/page.tsx`
   - Test: Login/Register flow working

5. **UI Components**
   - Install shadcn/ui: `npx shadcn-ui@latest init`
   - Add essential components: Button, Input, Form, Card, Dialog, Table
   - Create layout components: Navbar, Sidebar
   - Create `app/(dashboard)/layout.tsx` with navbar/sidebar

6. **Testing**
   - [ ] Dev server starts: `bun run dev`
   - [ ] Can register new user
   - [ ] Can login with credentials
   - [ ] Protected routes redirect to login
   - [ ] Dashboard accessible after login
   - [ ] Supabase local database working
   - [ ] No TypeScript errors

### Key Files to Create
```
lib/supabase/
  ├── client.ts          # createClient() for client components
  ├── server.ts          # createServerClient() for server components
  └── types.ts           # Auto-generated from DB
app/middleware.ts        # Auth middleware
app/(auth)/
  ├── login/page.tsx
  └── register/page.tsx
app/(dashboard)/
  ├── layout.tsx         # With navbar/sidebar
  └── page.tsx           # Dashboard home
components/layout/
  ├── navbar.tsx
  └── sidebar.tsx
```

---

## 📊 Phase 1: CRUD Básico (3-4 days)

### Objective
Implement basic Create-Read-Update-Delete for Torneos, Equipos, and Jugadores.

### Deliverables
- [ ] Torneos: List, Create, Read, Edit, Delete
- [ ] Equipos: List, Create, Read, Edit, Delete
- [ ] Jugadores: List, Create, Read, Edit
- [ ] Form validations with Zod
- [ ] All connected to Supabase

### Phase 1a: Torneos (1 day)

**Tasks:**
1. Create Zod schema: `lib/validations/torneo.ts`
2. Create Server Actions: `actions/torneos.ts`
   - `createTorneo(data)`
   - `updateTorneo(id, data)`
   - `deleteTorneo(id)`
   - `getTorneos()`
   - `getTorneo(id)`
3. Create components:
   - `components/torneos/torneo-form.tsx` - Form for create/edit
   - `components/torneos/torneo-card.tsx` - Card display
   - `components/torneos/torneo-list.tsx` - List with table
4. Create pages:
   - `app/(dashboard)/torneos/page.tsx` - List torneos
   - `app/(dashboard)/torneos/[id]/page.tsx` - View torneo
   - `app/(dashboard)/torneos/nuevo/page.tsx` - Create torneo
5. Test: Create, list, edit, delete torneos

**Files to Create:**
```
lib/validations/torneo.ts
actions/torneos.ts
components/torneos/
  ├── torneo-form.tsx
  ├── torneo-card.tsx
  └── torneo-list.tsx
app/(dashboard)/torneos/
  ├── page.tsx
  ├── nuevo/page.tsx
  └── [id]/page.tsx
```

### Phase 1b: Equipos (1 day)

**Same pattern as Torneos:**
1. Schema: `lib/validations/equipo.ts`
2. Server Actions: `actions/equipos.ts`
3. Components: `components/equipos/`
4. Pages: `app/(dashboard)/equipos/`
5. Test: CRUD working

**Files to Create:**
```
lib/validations/equipo.ts
actions/equipos.ts
components/equipos/
  ├── equipo-form.tsx
  ├── equipo-card.tsx
  └── equipo-list.tsx
app/(dashboard)/equipos/
  ├── page.tsx
  ├── nuevo/page.tsx
  └── [id]/page.tsx
```

### Phase 1c: Jugadores (1 day)

**Same pattern plus:**
1. Schema: `lib/validations/jugador.ts`
2. Server Actions: `actions/jugadores.ts`
3. Components: `components/jugadores/`
4. Pages: `app/(dashboard)/jugadores/`
5. Add document upload capability (basic file upload to Supabase Storage)

**Files to Create:**
```
lib/validations/jugador.ts
actions/jugadores.ts
components/jugadores/
  ├── jugador-form.tsx
  ├── jugador-card.tsx
  ├── jugador-list.tsx
  └── documento-upload.tsx
app/(dashboard)/jugadores/
  ├── page.tsx
  ├── nuevo/page.tsx
  └── [id]/page.tsx
```

### Phase 1 Testing Checklist
- [ ] Create torneo → appears in list
- [ ] Edit torneo → changes saved
- [ ] Delete torneo → removed from list
- [ ] Create equipo with valid category
- [ ] Create jugador → appears in team's player list
- [ ] Edit jugador → changes saved
- [ ] All forms validate correctly
- [ ] No database errors in console

---

## ⚽ Phase 2: Gestión Partidos (3-4 days)

### Objective
Implement full match management including results, goals, cards, and changes.

### Deliverables
- [ ] Partidos: Create, Read, Edit, Complete
- [ ] Register goals by player
- [ ] Register cards (yellow/red) by player
- [ ] Register player changes/substitutions
- [ ] Auto-trigger updates to statistics via database triggers
- [ ] Match report/acta generation

### Phase 2a: Partidos CRUD (1 day)

**Tasks:**
1. Schema: `lib/validations/partido.ts`
2. Server Actions: `actions/partidos.ts`
3. Components:
   - `components/partidos/partido-form.tsx` - Create/edit
   - `components/partidos/partido-card.tsx` - Display
   - `components/partidos/partido-list.tsx` - List
4. Pages:
   - `app/(dashboard)/partidos/page.tsx` - List
   - `app/(dashboard)/partidos/nuevo/page.tsx` - Create
   - `app/(dashboard)/partidos/[id]/page.tsx` - View/Edit

### Phase 2b: Goals & Cards (1 day)

**Tasks:**
1. Schema: `lib/validations/partido.ts` (update with goals/cards)
2. Components:
   - `components/partidos/gol-form.tsx` - Add goal
   - `components/partidos/tarjeta-form.tsx` - Add card
   - `components/partidos/cambio-form.tsx` - Substitution
3. Server Actions: Update `actions/partidos.ts`
   - `addGol(partidoId, jugadorId, minuto)`
   - `addTarjeta(partidoId, jugadorId, tipo, minuto)`
   - `addCambio(partidoId, jugadorSaleId, jugadorEntraId, minuto)`
4. Test: Goals, cards, changes saved correctly

### Phase 2c: Acta & Finalization (1 day)

**Tasks:**
1. Create `components/partidos/acta-partido.tsx` - Match report display/print
2. Server Action: `completePartido(id)` - Mark as complete
3. Triggers verification: Check statistics auto-update
   - Create partido
   - Register result
   - Check `estadistica_equipo` auto-updated
4. Test:
   - [ ] Complete match → statistics updated
   - [ ] Add yellow card → player suspension at 3
   - [ ] Add red card → player suspended
   - [ ] Acta prints correctly

### Phase 2 Key Database Triggers (Verify Working)
- When `partidos.completado = true`:
  - Auto-update `estadistica_equipo` (wins, draws, losses, goals)
  - Increment team inasistencias if applicable
- When adding red card:
  - Auto-suspend jugador
- When adding 3 yellow cards:
  - Auto-suspend jugador for 1 match

### Files to Create
```
lib/validations/partido.ts
actions/partidos.ts
components/partidos/
  ├── partido-form.tsx
  ├── partido-list.tsx
  ├── partido-card.tsx
  ├── gol-form.tsx
  ├── tarjeta-form.tsx
  ├── cambio-form.tsx
  └── acta-partido.tsx
app/(dashboard)/partidos/
  ├── page.tsx
  ├── nuevo/page.tsx
  └── [id]/page.tsx
```

---

## 📈 Phase 3: Estadísticas y Tabla de Posiciones (2-3 days)

### Objective
Display standings table and tournament statistics with realtime updates.

### Deliverables
- [ ] Standings table showing: Pts, W, D, L, GF, GA, GD
- [ ] Sorted by points → goal difference → goals for
- [ ] Grouped by category/group
- [ ] Top scorers ranking
- [ ] Team statistics page
- [ ] Realtime updates when matches complete

### Phase 3a: Tabla de Posiciones (1 day)

**Tasks:**
1. Create utility: `lib/utils/standings.ts`
   - `getStandings(torneoId, grupo?)` - Query from `estadistica_equipo`
   - `sortStandings(equipos)` - Sort by criteria
2. Create component: `components/torneos/tabla-posiciones.tsx`
3. Create page: `app/(dashboard)/torneos/[id]/tabla/page.tsx`
4. Test: Standings update after completing matches

**Query Pattern:**
```typescript
// Use SQL function get_tabla_posiciones(torneo_id)
// Already defined in migrations as database function
const { data: standings } = await supabase
  .rpc('get_tabla_posiciones', { torneo_uuid: torneoId })
```

### Phase 3b: Estadísticas Generales (1 day)

**Tasks:**
1. Create utility: `lib/utils/estadisticas.ts`
   - `getTopScorers(torneoId)` - Top 10 goal scorers
   - `getTeamStats(equipoId)` - Team statistics
2. Components:
   - `components/torneos/top-scorers.tsx` - Top scorers table
   - `components/equipos/equipo-stats.tsx` - Team stats card
3. Pages:
   - `app/(dashboard)/torneos/[id]/estadisticas/page.tsx` - Tournament stats
4. Test: Statistics accurate

### Phase 3c: Realtime Updates (1 day)

**Tasks:**
1. Set up Supabase Realtime subscription
2. Component: `components/torneos/tabla-posiciones-live.tsx`
   - Subscribe to `estadistica_equipo` changes
   - Update UI when standings change
3. Test: Complete a match → standings update live in browser

**Pattern:**
```typescript
useEffect(() => {
  const channel = supabase
    .channel('standings')
    .on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'estadistica_equipo' },
      () => refetch()
    )
    .subscribe()
  return () => channel.unsubscribe()
}, [])
```

### Files to Create
```
lib/utils/standings.ts
lib/utils/estadisticas.ts
components/torneos/
  ├── tabla-posiciones.tsx
  ├── tabla-posiciones-live.tsx
  ├── top-scorers.tsx
  └── estadisticas.tsx
components/equipos/equipo-stats.tsx
app/(dashboard)/torneos/[id]/
  ├── tabla/page.tsx
  └── estadisticas/page.tsx
```

---

## 💰 Phase 4: Sistema Financiero (2-3 days)

### Objective
Track team payments, fines, and financial balance.

### Deliverables
- [ ] Transaction recording (payments, fines, referee payments)
- [ ] Team balance calculation
- [ ] Payment status tracking
- [ ] Financial reports

### Phase 4a: Transacciones (1 day)

**Tasks:**
1. Schema: `lib/validations/financiero.ts`
2. Server Actions: `actions/financiero.ts`
   - `createTransaccion(equipo_id, tipo, monto, concepto)`
   - `getEquipoDeuda(equipo_id)` - Calculate team debt
   - `getTransacciones(equipo_id)` - List transactions
3. Components:
   - `components/financiero/transaccion-form.tsx` - Add transaction
   - `components/financiero/historial-pagos.tsx` - Transaction history
4. Pages:
   - `app/(dashboard)/financiero/page.tsx` - Dashboard
   - `app/(dashboard)/financiero/transacciones/page.tsx` - List

### Phase 4b: Reportes (1 day)

**Tasks:**
1. Utility: `lib/utils/debt.ts`
   - `calcularDeudaEquipo(equipo_id)` - Total debt
   - `detalleDeuda(equipo_id)` - Breakdown
2. Components:
   - `components/financiero/balance-card.tsx` - Team balance display
   - `components/financiero/deuda-detalle.tsx` - Debt breakdown
3. Pages:
   - `app/(dashboard)/equipos/[id]/financiero/page.tsx` - Team financials

### Phase 4 Testing
- [ ] Create transaction → appears in history
- [ ] Debt calculated correctly (inscription + fines - payments)
- [ ] Financial reports accurate
- [ ] Red cards generate fine automatically (trigger)

### Files to Create
```
lib/validations/financiero.ts
lib/utils/debt.ts
actions/financiero.ts
components/financiero/
  ├── transaccion-form.tsx
  ├── historial-pagos.tsx
  ├── balance-card.tsx
  └── deuda-detalle.tsx
app/(dashboard)/financiero/
  ├── page.tsx
  └── transacciones/page.tsx
app/(dashboard)/equipos/[id]/
  └── financiero/page.tsx
```

---

## 👨‍💼 Phase 5: Admin Panel (2-3 days)

### Objective
Admin functions for document verification and user management.

### Deliverables
- [ ] Document verification queue
- [ ] Approve/reject documents
- [ ] User role management
- [ ] Category configuration
- [ ] System settings

### Phase 5a: Document Verification (1-2 days)

**Tasks:**
1. Components:
   - `components/admin/documento-queue.tsx` - Pending documents list
   - `components/admin/documento-viewer.tsx` - Document preview
   - `components/admin/documento-verificacion.tsx` - Approve/reject
2. Server Actions: `actions/admin.ts`
   - `verificarDocumento(id, estado, comentarios)`
   - `getPendientes()` - List pending documents
3. Pages:
   - `app/(dashboard)/admin/documentos/page.tsx` - Document queue

### Phase 5b: Gestión de Usuarios (1 day)

**Tasks:**
1. Components:
   - `components/admin/user-list.tsx` - Users table
   - `components/admin/user-form.tsx` - Edit user role
2. Server Actions:
   - `updateUserRole(userId, role)`
   - `getUsers()`
3. Pages:
   - `app/(dashboard)/admin/usuarios/page.tsx` - User management

### Files to Create
```
components/admin/
  ├── documento-queue.tsx
  ├── documento-viewer.tsx
  ├── documento-verificacion.tsx
  ├── user-list.tsx
  └── user-form.tsx
actions/admin.ts
app/(dashboard)/admin/
  ├── page.tsx
  ├── documentos/page.tsx
  └── usuarios/page.tsx
```

---

## ✅ Phase 6: Testing & Deploy (2-3 days)

### Objective
Test MVP completeness and deploy to production.

### Deliverables
- [ ] E2E tests for critical flows
- [ ] Performance testing
- [ ] Deployed to Vercel
- [ ] Supabase production configured

### Phase 6a: Testing (1 day)

**Critical flows to test:**
1. User registration → Login → Dashboard access
2. Create tournament → Create teams → Add players
3. Schedule match → Complete with goals and cards → Check statistics
4. Calculate team balance → Add payment → Verify balance
5. Admin: Upload document → Verify → User sees confirmed

### Phase 6b: Deploy (1 day)

**Tasks:**
1. Configure Supabase production environment
2. Deploy to Vercel:
   - Push to main branch
   - Verify build succeeds
   - Test in production
3. Configure environment variables on Vercel
4. Smoke tests in production
5. Setup monitoring (optional: Sentry)

### Phase 6 Checklist
- [ ] All features working
- [ ] No console errors
- [ ] TypeScript strict mode passes
- [ ] Biome linting passes
- [ ] Performance acceptable (Lighthouse > 80)
- [ ] Mobile responsive
- [ ] Deployed to Vercel
- [ ] Supabase production configured
- [ ] Database backups enabled

---

## 📅 Timeline Summary

```
Week 1: Phase 0 + Phase 1 (Setup + Basic CRUD)
Week 2: Phase 2 (Match Management)
Week 3: Phase 3 + Phase 4 (Stats + Financial)
Week 4: Phase 5 (Admin)
Week 5: Phase 6 (Testing + Deploy)

Total: ~25 business days = 5 weeks
```

---

## 🎯 Success Criteria

MVP is complete when:
- ✅ All CRUD operations working
- ✅ Statistics auto-updating via triggers
- ✅ Financial tracking functional
- ✅ Authentication and authorization working
- ✅ Deployed to production
- ✅ Handles 100+ users without issues
- ✅ All critical flows tested

---

## 🚦 Current Status

**Completed:** Phase 0 setup (partial)
- ✅ Next.js 16 project created
- ✅ Documentation setup
- ✅ Architecture decision (monolito)
- ⏳ Awaiting: Supabase project creation

**Next Steps:**
1. Create Supabase project
2. Run migrations (001-010)
3. Generate database types
4. Setup authentication
5. Start Phase 1: CRUD implementation

---

## 📝 Notes

- See [CLAUDE.md](CLAUDE.md) for development guidelines
- See [docs/architecture/current-structure.md](docs/architecture/current-structure.md) for project structure
- See [docs/database/schema.md](docs/database/schema.md) for complete database schema
- See [docs/database/triggers.md](docs/database/triggers.md) for automated database operations
- See [docs/architecture/business-rules.md](docs/architecture/business-rules.md) for business logic

---

**Last Updated:** 2025-11-21
**Owner:** GoolStar Development Team
