# GoolStar Infrastructure Overview

Complete visual and technical overview of the entire infrastructure setup.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Components (Next.js 16)                       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  - /login              (LoginForm)                   │   │
│  │  - /register           (RegisterForm)                │   │
│  │  - / (dashboard)       (Protected by middleware)     │   │
│  │  - Navigation bar      (Logout button)               │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Supabase Browser Client                             │   │
│  │  (lib/supabase/client.ts)                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTPS
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER (Node.js)                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middleware (middleware.ts)                          │   │
│  │  ├─ Check auth state                                 │   │
│  │  ├─ Redirect unauthorized to /login                  │   │
│  │  └─ Redirect authenticated away from /auth           │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Server Actions (actions/auth.ts)                    │   │
│  │  ├─ login(email, password)                           │   │
│  │  ├─ register(email, password, confirm)               │   │
│  │  ├─ logout()                                         │   │
│  │  └─ getCurrentUser()                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Validation Schemas (lib/validations/)               │   │
│  │  ├─ authSchema    (login/register)                   │   │
│  │  ├─ torneoSchema  (tournament CRUD)                  │   │
│  │  ├─ equipoSchema  (team CRUD)                        │   │
│  │  ├─ jugadorSchema (player CRUD)                      │   │
│  │  └─ partidoSchema (match CRUD + XOR)                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Supabase Server Client                              │   │
│  │  (lib/supabase/server.ts)                            │   │
│  │  ├─ Session management via cookies                   │   │
│  │  ├─ Server-side authentication                       │   │
│  │  └─ Secure database access                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTPS + API Key
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE CLOUD (Managed)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Auth Service (Email Provider)                       │   │
│  │  ├─ Email/Password authentication                    │   │
│  │  ├─ Session management                               │   │
│  │  └─ JWT tokens                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database (21 Tables)                     │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Tournament Tables:                                  │   │
│  │  ├─ categorias                                       │   │
│  │  ├─ torneos                                          │   │
│  │  ├─ fases_eliminatorias (knockout phases)            │   │
│  │  └─ jornadas (group phase days)                      │   │
│  │                                                      │   │
│  │  Team & Player Tables:                              │   │
│  │  ├─ dirigentes (team directors)                      │   │
│  │  ├─ equipos (teams)                                  │   │
│  │  ├─ jugadores (players)                              │   │
│  │  ├─ jugador_documentos (document verification)       │   │
│  │  └─ arbitros (referees)                              │   │
│  │                                                      │   │
│  │  Match Tables:                                       │   │
│  │  ├─ partidos (matches with XOR constraint)           │   │
│  │  ├─ goles (goals)                                    │   │
│  │  ├─ tarjetas (cards)                                 │   │
│  │  ├─ cambios_jugador (substitutions)                  │   │
│  │  ├─ participacion_jugador (participation)            │   │
│  │  └─ eventos_partido (match events)                   │   │
│  │                                                      │   │
│  │  Statistics Tables:                                  │   │
│  │  ├─ estadistica_equipo (standings, auto-updated)     │   │
│  │  ├─ llaves_eliminatorias (knockout brackets)         │   │
│  │  └─ mejores_perdedores (consolation)                 │   │
│  │                                                      │   │
│  │  Financial Tables:                                   │   │
│  │  ├─ transacciones_pago (all transactions)            │   │
│  │  └─ pagos_arbitro (referee payments)                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Database Automation (6 Triggers)                    │   │
│  │  ├─ update_updated_at_column()                       │   │
│  │  ├─ actualizar_estadisticas_partido()                │   │
│  │  ├─ suspender_por_tarjeta_roja()                     │   │
│  │  ├─ verificar_amarillas_acumuladas()                 │   │
│  │  ├─ registrar_inasistencia()                         │   │
│  │  └─ crear_estadistica_equipo()                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Database Functions (5 Functions)                    │   │
│  │  ├─ get_tabla_posiciones()      (standings)          │   │
│  │  ├─ calcular_deuda_equipo()     (team debt)          │   │
│  │  ├─ get_jugadores_destacados()  (top scorers)        │   │
│  │  ├─ get_resumen_tarjetas_equipo() (card summary)     │   │
│  │  └─ get_jugadores_suspendidos()  (suspended players) │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Security (Row-Level Security)                       │   │
│  │  ├─ Admin: Full access to all tables                 │   │
│  │  ├─ Dirigente: Manage own team/players               │   │
│  │  └─ Public: Read-only for tournaments/standings      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Performance (30+ Indexes)                           │   │
│  │  ├─ partidos(torneo_id, fecha)                       │   │
│  │  ├─ tarjetas(jugador_id)                             │   │
│  │  ├─ estadistica_equipo(puntos)                       │   │
│  │  ├─ transacciones_pago(equipo_id)                    │   │
│  │  └─ ... and 26+ more specialized indexes             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Authentication Flow

```
User
  │
  ├─── Visit /register
  │        │
  │        ├─ Load RegisterForm component
  │        ├─ User enters: email, password, password confirm
  │        └─ User clicks "Create Account"
  │
  ├─ Form triggers Server Action: register()
  │        │
  │        ├─ Validate with registerSchema (Zod)
  │        ├─ Extract: email, password, passwordConfirm
  │        ├─ Call Supabase: auth.signUp({ email, password })
  │        │
  │        └─ If success:
  │             └─ Redirect to /login (confirmation email sent)
  │
  ├─── Visit /login
  │        │
  │        ├─ Load LoginForm component
  │        ├─ User enters: email, password
  │        └─ User clicks "Sign In"
  │
  ├─ Form triggers Server Action: login()
  │        │
  │        ├─ Validate with loginSchema (Zod)
  │        ├─ Extract: email, password
  │        ├─ Call Supabase: auth.signInWithPassword({ email, password })
  │        │
  │        └─ If success:
  │             ├─ Create session cookie
  │             ├─ Revalidate layout cache
  │             └─ Redirect to / (dashboard)
  │
  ├─── Middleware checks every request:
  │        │
  │        ├─ Get auth user from Supabase
  │        │
  │        ├─ If accessing /(dashboard) without auth:
  │        │   └─ Redirect to /login
  │        │
  │        └─ If accessing /(auth) with auth:
  │            └─ Redirect to /
  │
  ├─── On dashboard (/):
  │        │
  │        ├─ User is authenticated
  │        ├─ Navbar shows: Logout button
  │        └─ User clicks "Logout"
  │
  └─ Logout Server Action:
         │
         ├─ Call Supabase: auth.signOut()
         ├─ Clear session cookie
         ├─ Revalidate layout cache
         └─ Redirect to /login
```

### Database Query Flow (Example: Creating Tournament)

```
User fills tournament form (Phase 2):
  │
  └─ Form triggers Server Action: createTorneo(data)
      │
      ├─ Validate with torneoSchema (Zod)
      │   └─ Ensure: nome not empty, valid category_id, dates valid
      │
      ├─ Server Supabase client inserts into database
      │   │
      │   ├─ INSERT INTO torneos (nombre, categoria_id, fecha_inicio, ...)
      │   │
      │   └─ Check RLS policy:
      │       ├─ If admin: ✅ Allow
      │       ├─ If dirigente: ❌ Deny (only own team)
      │       └─ If public: ❌ Deny
      │
      ├─ Database processes insert:
      │   ├─ Validate all constraints
      │   ├─ Assign UUID id
      │   ├─ Set created_at and updated_at timestamps
      │   └─ Return inserted row
      │
      └─ Revalidate cache and redirect to torneos page

Tournament created successfully ✅
```

---

## File Structure & Dependencies

```
goolstar_next/
├── .env.local                          ⚠️ REQUIRED: Credentials
│   ├─ NEXT_PUBLIC_SUPABASE_URL
│   ├─ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
│   └─ SUPABASE_SECRET_KEY
│
├── supabase/
│   ├── config.toml                     ✅ Supabase config
│   └── migrations/                     ✅ Database schema
│       ├── 20250122000001_...         (Extensions + Enums)
│       ├── 20250122000002_...         (Tournaments)
│       ├── 20250122000003_...         (Teams + Players)
│       ├── 20250122000004_...         (Matches)
│       ├── 20250122000005_...         (Statistics)
│       ├── 20250122000006_...         (Financial)
│       ├── 20250122000007_...         (Triggers)
│       ├── 20250122000008_...         (Functions)
│       ├── 20250122000009_...         (RLS Policies)
│       └── 20250122000010_...         (Indexes)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  ✅ Browser client
│   │   └── server.ts                  ✅ Server client + sessions
│   │
│   ├── validations/
│   │   ├── auth.ts                    ✅ Login + Register schemas
│   │   ├── torneo.ts                  ✅ Tournament schema
│   │   ├── equipo.ts                  ✅ Team schema
│   │   ├── jugador.ts                 ✅ Player schema
│   │   └── partido.ts                 ✅ Match schema + XOR constraint
│   │
│   └── utils/
│       ├── points.ts                  (Future: scoring logic)
│       ├── standings.ts                (Future: standings calculation)
│       ├── suspension.ts               (Future: suspension logic)
│       └── format.ts                   (Future: formatting utilities)
│
├── actions/
│   └── auth.ts                         ✅ Server actions
│       ├─ login()
│       ├─ register()
│       ├─ logout()
│       └─ getCurrentUser()
│
├── components/
│   ├── auth/
│   │   ├── login-form.tsx              ✅ Connected to login()
│   │   └── register-form.tsx           ✅ Connected to register()
│   │
│   ├── layout/
│   │   └── navbar.tsx                  ✅ Logout connected
│   │
│   ├── ui/                             (shadcn/ui components)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── form.tsx
│   │
│   ├── torneos/                        (Future: tournament components)
│   ├── equipos/                        (Future: team components)
│   ├── jugadores/                      (Future: player components)
│   └── partidos/                       (Future: match components)
│
├── app/
│   ├── middleware.ts                   ✅ Route protection
│   │   ├─ Redirect unauthenticated to /login
│   │   └─ Redirect authenticated away from /auth
│   │
│   ├── layout.tsx                      ✅ Root layout
│   ├── page.tsx                        ✅ Dashboard (protected)
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx                ✅ Login page
│   │   └── register/
│   │       └── page.tsx                ✅ Register page
│   │
│   └── (dashboard)/                    (Future: protected routes)
│       ├── torneos/page.tsx
│       ├── equipos/page.tsx
│       ├── jugadores/page.tsx
│       └── partidos/page.tsx
│
├── types/
│   └── database.ts                     ✅ TypeScript types (1471 lines)
│
└── MIGRATION_EXECUTION_GUIDE.md        📖 Step-by-step guide
    MIGRATION_QUICK_REFERENCE.md        📖 Quick lookup
    INFRASTRUCTURE_STATUS.md             📖 Current status
    INFRASTRUCTURE_OVERVIEW.md           📖 This file
    SETUP_CHECKLIST.md                   📖 Checklist
    CLAUDE.md                            📖 Development guidelines
```

---

## Environment Variables Reference

### Required for Running

```bash
# Supabase Cloud Project URL
NEXT_PUBLIC_SUPABASE_URL=https://omvpzlbbfwkyqwbwqnjf.supabase.co

# Publishable key (safe to expose on client)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Secret key (server-only, never expose)
SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1NiIs...

# Application URL (for auth redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Node environment
NODE_ENV=development
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 16.0.3 | Server-rendered React with SSR |
| **Language** | TypeScript | 5.7 | Type-safe development |
| **React** | React | 19.2 | UI components and state management |
| **Styling** | Tailwind CSS | 4.0 | Utility-first CSS |
| **UI Components** | shadcn/ui | Latest | Pre-built accessible components |
| **Forms** | react-hook-form | 7.x | Form state management |
| **Validation** | Zod | 3.x | Runtime schema validation |
| **Backend** | Supabase | Cloud | PostgreSQL + Auth + API |
| **Database** | PostgreSQL | 15+ | Relational database |
| **Authentication** | Supabase Auth | JWT | Email/password authentication |
| **Code Quality** | Biome | 2.2 | Linting and formatting |
| **Package Manager** | Bun | Latest | Fast package management |

---

## Deployment Architecture (Future)

```
┌─────────────────┐                    ┌──────────────────┐
│  Next.js App    │──────────────────▶ │  Vercel Edge     │
│  (Client + SSR) │                    │  (Deployment)    │
└─────────────────┘                    └──────────────────┘
       ▲                                        │
       │                                        │
       └─────────────────────────────────────────┘
                    (git push)

┌─────────────────────────────────────────────────────┐
│  Supabase Cloud (Managed Service)                   │
├─────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐ │
│  │ PostgreSQL Database                            │ │
│  ├────────────────────────────────────────────────┤ │
│  │ 21 Tables + 6 Triggers + 5 Functions           │ │
│  │ RLS Policies + 30+ Indexes                     │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Authentication Service                         │ │
│  ├────────────────────────────────────────────────┤ │
│  │ Email/Password + Session Management + JWT      │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ PostgREST API                                  │ │
│  ├────────────────────────────────────────────────┤ │
│  │ Auto-generated REST API for all tables         │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Real-time Subscriptions                        │ │
│  ├────────────────────────────────────────────────┤ │
│  │ Live updates on table changes                  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Storage (for files/images)                     │ │
│  ├────────────────────────────────────────────────┤ │
│  │ Escudos, documentos, fotos de jugadores        │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Critical Constraints & Features

### Database Constraints

1. **XOR Constraint (Matches)**
   ```
   A match MUST reference EITHER:
   - jornada_id (group phase) OR
   - fase_eliminatoria_id (knockout phase)

   But NOT both, and NOT neither.
   ```

2. **Team Participation**
   - Each team belongs to exactly one tournament
   - Team can be in group phase OR knockout, configured at tournament level

3. **Player Suspension**
   - Automatic on accumulated yellow cards
   - Automatic on red card
   - Suspension duration = tournament category configuration

4. **Financial Tracking**
   - All transactions logged (inscriptions, fines, payments, adjustments)
   - Fines auto-deducted for cards
   - Team debt calculable from transaction history

### Automation (6 Triggers)

1. ✅ Auto-update `updated_at` timestamps
2. ✅ Auto-recalculate standings on match completion
3. ✅ Auto-suspend players on red card
4. ✅ Auto-suspend players on accumulated yellow cards
5. ✅ Auto-increment team absence counter
6. ✅ Auto-create standings record for new teams

---

## Ready for Development

All infrastructure is in place and tested:
- ✅ TypeScript compilation: 0 errors
- ✅ Build successful
- ✅ Middleware routing functional
- ✅ Server actions ready
- ✅ Validation schemas created
- ✅ Database schema designed

**Next step**: Execute 10 migrations in Supabase Cloud (5-10 minutes)

Then: Enable email auth provider → Test locally → Begin Phase 2 development
