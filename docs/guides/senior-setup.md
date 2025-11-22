# Senior Developer Setup Guide - Phase 0

**Role:** Senior/Lead Developer
**Responsibility:** Critical infrastructure setup
**Timeline:** Days 1-3
**Parallel with:** Junior developers working on UI/schemas/auth pages

---

## 🎯 Your Role

You are responsible for:
1. ✅ Supabase project configuration
2. ✅ Database schema creation & migrations
3. ✅ TypeScript type generation
4. ✅ Supabase client setup
5. ✅ Authentication middleware
6. ✅ Supervising juniors (code review, unblocking)

---

## 📋 Task Checklist - Senior

### TASK S1: Create Supabase Project (Day 1 - 30 min)

**Option A: Supabase Cloud (Recommended for MVP)**
```bash
# 1. Go to https://app.supabase.com
# 2. Click "New Project"
# 3. Fill in:
#    - Name: goolstar-dev
#    - Database password: (generate strong password)
#    - Region: Pick closest to you
# 4. Wait ~2 minutes for project to initialize
# 5. Save credentials
```

**Option B: Local Supabase (for development)**
```bash
# Initialize Supabase locally
supabase init

# Start local Supabase (requires Docker)
supabase start

# This creates local PostgreSQL + Supabase API
# Check status:
supabase status
```

**Output:**
- [ ] Supabase project created
- [ ] Have these values:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

**Next:** Store these in `.env.local` (see Task S2)

---

### TASK S2: Create .env.local (Day 1 - 5 min)

**File:** `.env.local` (at project root)

```bash
# Copy from example
cp .env.example .env.local

# Edit with your values
# If using Supabase Cloud:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Or if using local Supabase:
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=[from supabase status]
SUPABASE_SERVICE_ROLE_KEY=[from supabase status]
```

**Verify:**
```bash
# Test connection (you can do this after creating clients)
# For now, just verify the file exists
cat .env.local | grep NEXT_PUBLIC_SUPABASE_URL
```

**Output:**
- [ ] `.env.local` created with all variables
- [ ] NOT committed to git (already in .gitignore)

---

### TASK S3: Create Database Migrations (Day 1 - 2-3 hours)

This is the **critical** task. Database schema is everything.

#### Step 1: Create migrations directory structure

```bash
mkdir -p supabase/migrations

# Supabase will auto-detect migration files
# Format: YYYYMMDDHHMMSS_description.sql
```

#### Step 2: Create migrations (10 total)

You have two options:

**Option A: Copy from Documentation**
- See [docs/database/schema.md](docs/database/schema.md)
- Copy each section into .sql files
- **Time:** 2-3 hours

**Option B: Use provided migration templates**
- I'll create template files below
- You fill in the details
- **Time:** 1-2 hours

#### Migration Order & Content

Create these files in `supabase/migrations/` in this order:

**001_initial_schema.sql** (Extensions, types, enums)
```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE nivel_enum AS ENUM ('1', '2', '3', '4', '5');

-- Add more from docs/database/schema.md
```

**002_categorias_torneos.sql** (Base tournament setup)
```sql
-- Categorias table
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,
  -- ... (see schema.md)
);

-- Torneos table
CREATE TABLE torneos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- ... (see schema.md)
);

-- Fases eliminatorias
CREATE TABLE fases_eliminatorias (
  -- ... (see schema.md)
);
```

**003_equipos_jugadores.sql** (Teams & players)
- `dirigentes` table
- `equipos` table
- `jugadores` table
- `jugador_documentos` table

**004_partidos_competicion.sql** (Match data)
- `jornadas` table
- `partidos` table
- `goles` table
- `tarjetas` table
- `cambios_jugador` table
- `eventos_partido` table
- `participacion_jugador` table

**005_estadisticas.sql** (Standings)
- `estadistica_equipo` table
- `llaves_eliminatorias` table
- `mejores_perdedores` table
- `eventos_torneo` table

**006_financiero.sql** (Financial)
- `transacciones_pago` table
- `pagos_arbitro` table
- `arbitros` table

**007_triggers.sql** (Database automation)
- Auto-update timestamps
- Auto-update standings on match complete
- Auto-suspend players on red card
- Verify yellow card accumulation
- Create stats on team creation

**008_functions.sql** (Complex queries)
- `get_tabla_posiciones()`
- `calcular_deuda_equipo()`
- `get_jugadores_destacados()`

**009_rls_policies.sql** (Row-level security)
- Enable RLS on sensitive tables
- Policies for torneos, equipos, jugadores, partidos
- RLS for transacciones_pago (admin only)

**010_indexes.sql** (Performance)
- Index on `partidos(fecha, torneo_id)`
- Index on `tarjetas(jugador_id)`
- Index on `jugador_documentos`
- Index on `transacciones_pago`

#### Reference
- **Full schema:** [docs/database/schema.md](docs/database/schema.md)
- **Triggers:** [docs/database/triggers.md](docs/database/triggers.md)
- **Functions:** [docs/database/functions.md](docs/database/functions.md)

**Output:**
- [ ] 10 migration files created in `supabase/migrations/`
- [ ] Filenames follow: `YYYYMMDDHHMMSS_description.sql`
- [ ] Each file can be executed independently
- [ ] All tested locally first

---

### TASK S4: Execute Migrations (Day 1 - 30 min)

**If using Supabase Cloud:**
```bash
# Push migrations to cloud
supabase migration push

# Or use web console:
# 1. Go to supabase.co dashboard
# 2. Copy/paste migration SQL into SQL editor
# 3. Execute each migration in order
```

**If using Local Supabase:**
```bash
# Migrations auto-apply on supabase start
# Or push manually:
supabase db push
```

**Verify:**
```bash
# Check tables were created
# In Supabase web console:
# 1. Go to SQL Editor
# 2. Run:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

# Should see ~20 tables
```

**Output:**
- [ ] All migrations executed successfully
- [ ] No errors in SQL
- [ ] All ~20 tables created
- [ ] Can see data in Supabase dashboard

---

### TASK S5: Generate TypeScript Types (Day 1 - 10 min)

**Install Supabase CLI globally** (if not already done):
```bash
npm install -g supabase
# or
brew install supabase/tap/supabase
```

**Generate types from local or cloud database:**

```bash
# For LOCAL Supabase:
supabase gen types typescript --local > types/database.ts

# For CLOUD Supabase:
supabase gen types typescript \
  --project-id YOUR_PROJECT_ID \
  > types/database.ts

# (Get project ID from: https://app.supabase.com/projects)
```

**Verify:**
```bash
# Check file was generated
ls -lh types/database.ts

# Should be 10-20 KB with lots of types
# Check it has your tables:
grep "Tables" types/database.ts | head
```

**Output:**
- [ ] `types/database.ts` generated
- [ ] File contains all table types
- [ ] No TypeScript errors in project

---

### TASK S6: Load Seed Data (Day 1 - Optional, 15 min)

Create sample data for testing. This is optional but speeds up juniors' work.

**File:** `supabase/seed.sql`

```sql
-- Insert a category
INSERT INTO categorias (nombre, descripcion, costo_inscripcion)
VALUES ('Nivel 3', 'Intermediate level', 100.00);

-- Get the ID
-- SELECT id FROM categorias WHERE nombre = 'Nivel 3';

-- Insert a tournament
INSERT INTO torneos (
  nombre, categoria_id, fecha_inicio,
  tiene_fase_grupos, tiene_eliminacion_directa
)
SELECT 'Test Tournament', id, NOW()::date, true, true
FROM categorias WHERE nombre = 'Nivel 3';

-- Insert test teams/players
-- ...
```

**To run:**
```bash
# Local Supabase:
supabase db seed -f supabase/seed.sql

# Cloud Supabase:
# Use SQL editor in dashboard
```

**Output:**
- [ ] Sample data inserted (optional)
- [ ] Can query data via Supabase dashboard

---

### TASK S7: Create Supabase Clients (Day 2 - 1 hour)

These are critical for all other code.

#### Client 1: Browser Client

**File:** `lib/supabase/client.ts`

```typescript
import { createBrowserClient } from "@supabase/ssr"
import { Database } from "@/types/database"

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Usage in client components:
// const supabase = createClient()
// const { data } = await supabase.from("torneos").select()
```

#### Client 2: Server Client

**File:** `lib/supabase/server.ts`

```typescript
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Database } from "@/types/database"

export async function createServerClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll was called from a Server Component
            // This can be ignored if you have middleware
            // refreshing user sessions
          }
        },
      },
    }
  )
}

// Usage in server components:
// const supabase = await createServerClient()
// const { data } = await supabase.from("torneos").select()
```

**Output:**
- [ ] Both client files created
- [ ] No TypeScript errors
- [ ] Import Database type working

---

### TASK S8: Create Auth Middleware (Day 2 - 1-2 hours)

This protects dashboard routes.

**File:** `app/middleware.ts`

```typescript
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/(dashboard)")) {
    if (!user) {
      // Redirect to login
      return NextResponse.redirect(
        new URL("/login", request.url)
      )
    }
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  if (
    request.nextUrl.pathname.startsWith("/(auth)") &&
    user
  ) {
    return NextResponse.redirect(
      new URL("/", request.url)
    )
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/(auth)/:path*",
    "/(dashboard)/:path*",
  ],
}
```

**Test:**
```bash
# Start dev server
bun run dev

# Try to access http://localhost:3000/dashboard
# Should redirect to http://localhost:3000/login
```

**Output:**
- [ ] Middleware created
- [ ] Dashboard redirects to login when not authenticated
- [ ] Auth pages redirect to dashboard when authenticated

---

### TASK S9: Create Auth Server Actions (Day 2 - 2 hours)

These handle login/register/logout.

**File:** `actions/auth.ts`

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { loginSchema, registerSchema } from "@/lib/validations/auth"

export async function login(formData: unknown) {
  try {
    const { email, password } = loginSchema.parse(formData)
    const supabase = await createServerClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    revalidatePath("/")
    redirect("/")
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Login failed",
    }
  }
}

export async function register(formData: unknown) {
  try {
    const { email, password } = registerSchema.parse(formData)
    const supabase = await createServerClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    revalidatePath("/")
    redirect("/login?message=Check your email to confirm")
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Registration failed",
    }
  }
}

export async function logout() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()

  revalidatePath("/")
  redirect("/login")
}
```

**Output:**
- [ ] Auth actions created
- [ ] `login()`, `register()`, `logout()` functions working
- [ ] No TypeScript errors

---

### TASK S10: Test Everything (Day 2-3 - 1 hour)

Create a simple test page to verify all connections work.

**File:** `app/(dashboard)/page.tsx`

```typescript
import { createServerClient } from "@/lib/supabase/server"

export default async function DashboardHome() {
  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Test database query
  const { data: torneos } = await supabase
    .from("torneos")
    .select("id, nombre")
    .limit(5)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {user && (
        <div className="rounded bg-blue-100 p-4">
          <p>Logged in as: <strong>{user.email}</strong></p>
        </div>
      )}

      <div className="rounded bg-green-100 p-4">
        <p>Database connection: <strong>✅ OK</strong></p>
        <p>Tournaments found: <strong>{torneos?.length || 0}</strong></p>
      </div>
    </div>
  )
}
```

**Manual Testing:**
```bash
# 1. Start dev server
bun run dev

# 2. Try to access http://localhost:3000
# Should redirect to login (✅ middleware works)

# 3. Register new account
# Should show confirmation message

# 4. Access http://localhost:3000 (dashboard)
# Should show user email + DB status (✅ auth + DB work)

# 5. Logout
# Should redirect to login
```

**Output:**
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Dashboard shows user email
- [ ] Database query returns data
- [ ] Logout works

---

## 📋 Daily Workflow for Senior

### Day 1 (Setup):
- [ ] S1: Create Supabase project (30 min)
- [ ] S2: Create .env.local (5 min)
- [ ] S3: Create 10 migration files (2-3 hours)
- [ ] S4: Execute migrations (30 min)
- [ ] S5: Generate types (10 min)
- [ ] S6: Load seed data (optional, 15 min)

**End of Day 1:** Supabase fully configured, types generated ✅

### Day 2 (Integration):
- [ ] S7: Create Supabase clients (1 hour)
- [ ] S8: Create auth middleware (1-2 hours)
- [ ] S9: Create auth server actions (2 hours)
- [ ] S10: Test everything (1 hour)

**End of Day 2:** Full auth flow working ✅

### Day 3 (Supervision):
- [ ] Review juniors' code
- [ ] Fix any blockers
- [ ] Merge PRs
- [ ] Integration testing with junior code
- [ ] Final Phase 0 checklist

**End of Day 3:** Phase 0 complete, ready for Phase 1 ✅

---

## 🔗 Integration with Juniors

### What Juniors Need From You

1. **Day 1 EOD:**
   - `.env.local` created
   - TypeScript types in `types/database.ts`

2. **Day 2 EOD:**
   - Supabase clients in `lib/supabase/`
   - Auth Server Actions in `actions/auth.ts`
   - Middleware protecting routes

3. **Day 3:**
   - Review & merge auth page PRs
   - Connect login form to `login()` action
   - Connect register form to `register()` action
   - Connect logout button to `logout()` action

### Communication

**Stand-ups (10 min daily):**
```
Senior: "Juniors, status?"
J1: "Navbar + sidebar components done, waiting for layout integration"
J2: "Login/register forms created, ready to connect to auth actions"
J3: "All schemas created, tests passing"
Senior: "Great. Today I'm finishing auth middleware. Tomorrow we integrate everything."
```

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module '@/types/database'"
**Solution:** Types file not generated. Run:
```bash
supabase gen types typescript --local > types/database.ts
```

### Issue: "No migrations showing in Supabase"
**Solution:** Check filenames follow format: `YYYYMMDDHHMMSS_name.sql`

### Issue: "Auth not working"
**Solution:**
1. Check `.env.local` has correct URLs
2. Verify Supabase project is running
3. Check middleware.ts is created
4. Check Server Actions import correct supabase client

### Issue: "Type errors in database queries"
**Solution:** Regenerate types after schema changes:
```bash
supabase gen types typescript --local > types/database.ts
```

---

## ✅ Phase 0 Completion Checklist

Phase 0 is done when ALL of these are true:

### Infrastructure
- [ ] Supabase project created
- [ ] `.env.local` configured
- [ ] 10 migrations executed
- [ ] All ~20 tables created in database
- [ ] Types generated in `types/database.ts`

### Code
- [ ] Supabase clients created (`client.ts`, `server.ts`)
- [ ] Auth middleware working
- [ ] Auth Server Actions created (`login`, `register`, `logout`)
- [ ] Auth routes protected/redirected correctly

### Integration (from juniors)
- [ ] Navbar component merged
- [ ] Sidebar component merged
- [ ] Dashboard layout merged
- [ ] Login page merged
- [ ] Register page merged
- [ ] Auth forms connected to Server Actions

### Functionality
- [ ] Users can register
- [ ] Users can login
- [ ] Dashboard accessible after login
- [ ] Logout redirects to login
- [ ] Database queries work
- [ ] No console errors in dev mode
- [ ] Responsive on mobile

---

## 📚 Resources & References

**Supabase Official:**
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [Supabase SSR Auth](https://supabase.com/docs/guides/auth/server-side-rendering)

**Project Docs:**
- [docs/database/schema.md](docs/database/schema.md) - Full schema
- [docs/database/triggers.md](docs/database/triggers.md) - Triggers
- [docs/database/functions.md](docs/database/functions.md) - Functions
- [CLAUDE.md](CLAUDE.md) - Development patterns

---

**Phase 0 Est. Time:** 3 days
**Parallel Work:** With juniors (multiplies productivity)
**Critical Success Factor:** Getting Supabase setup right

Let's ship this! 🚀
