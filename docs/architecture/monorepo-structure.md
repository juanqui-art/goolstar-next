# Monorepo Architecture with Bun Workspaces

Decision document for GoolStar's monorepo structure using Bun workspaces.

## Executive Summary

**Decision:** Implement modular monorepo with Bun workspaces while maintaining single web app for MVP phase.

**Rationale:** Balance fast MVP development with future scalability for mobile apps, admin panels, or separate services.

---

## Why Monorepo for GoolStar?

### The Problem with Monolith

As GoolStar grows, a single monolithic Next.js app has issues:

```
Single App Problem:
├── Database logic mixed with UI components
├── Validation schemas only usable in web
├── Business logic tightly coupled to Next.js
├── Can't test business rules without React/Next.js
├── Mobile app would duplicate all logic
└── Hard to maintain separation of concerns
```

### The Monorepo Solution

```
Monorepo Structure:
├── apps/web                    ← One web app for now
├── packages/database           ← Reusable: DB, types, clients
├── packages/schemas            ← Reusable: Validations
├── packages/business           ← Reusable: Pure logic
├── packages/ui                 ← Reusable: Components (later)
└── packages/typescript-config  ← Reusable: Configs

Benefits:
✅ Web app stays focused on UI
✅ Business logic testable independently
✅ Easy to add mobile app later (reuse packages)
✅ Type safety across projects
✅ Shared validation rules
```

---

## Project Structure

### Complete Directory Tree

```
goolstar_next/
├── bun.lock                    # Shared lock file for all workspaces
├── package.json                # Root workspace config
├── turbo.json                  # Task runner config (optional)
│
├── apps/
│   └── web/                    # Next.js app (only app for now)
│       ├── package.json        # "@goolstar/web"
│       ├── app/                # Next.js App Router
│       │   ├── (auth)/         # Auth pages
│       │   ├── (dashboard)/    # Protected routes
│       │   ├── api/            # API routes
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── globals.css
│       ├── components/         # React components
│       │   ├── ui/             # shadcn components
│       │   ├── layout/
│       │   ├── torneos/
│       │   ├── equipos/
│       │   ├── jugadores/
│       │   └── partidos/
│       ├── public/
│       ├── next.config.ts
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       └── postcss.config.mjs
│
├── packages/
│   │
│   ├── database/               # 🔥 Critical: Database layer
│   │   ├── package.json        # "@goolstar/database"
│   │   ├── src/
│   │   │   ├── index.ts        # Exports
│   │   │   ├── client.ts       # Supabase client component
│   │   │   ├── server.ts       # Supabase client server
│   │   │   ├── middleware.ts   # Auth middleware
│   │   │   └── types.ts        # Auto-generated from DB
│   │   ├── supabase/           # Supabase config
│   │   │   ├── config.toml
│   │   │   ├── migrations/     # SQL migrations
│   │   │   │   ├── 001_initial_schema.sql
│   │   │   │   ├── 002_categorias_torneos.sql
│   │   │   │   ├── 003_equipos_jugadores.sql
│   │   │   │   ├── 004_partidos_competicion.sql
│   │   │   │   ├── 005_estadisticas.sql
│   │   │   │   ├── 006_financiero.sql
│   │   │   │   ├── 007_triggers.sql
│   │   │   │   ├── 008_functions.sql
│   │   │   │   ├── 009_rls_policies.sql
│   │   │   │   └── 010_indexes.sql
│   │   │   └── functions/      # Edge Functions (Deno)
│   │   │       └── (future use)
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── schemas/                # 📋 Validation schemas
│   │   ├── package.json        # "@goolstar/schemas"
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── auth.ts         # Login/Register schemas
│   │   │   ├── torneo.ts       # Tournament schemas
│   │   │   ├── equipo.ts       # Team schemas
│   │   │   ├── jugador.ts      # Player schemas
│   │   │   ├── partido.ts      # Match schemas
│   │   │   └── financiero.ts   # Payment schemas
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── business/               # 🧮 Business logic (add in Phase 2+)
│   │   ├── package.json        # "@goolstar/business"
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── rules/          # Game rules
│   │   │   │   ├── points.ts   # Win=3, Draw=1, Loss=0
│   │   │   │   ├── suspension.ts
│   │   │   │   ├── standings.ts
│   │   │   │   └── debt.ts
│   │   │   ├── utils/          # Utilities
│   │   │   │   ├── date.ts
│   │   │   │   ├── format.ts
│   │   │   │   └── currency.ts
│   │   │   └── validators/     # Custom validators
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── ui/                     # 🎨 Design system (add in Phase 2+)
│   │   ├── package.json        # "@goolstar/ui"
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── components/     # shadcn components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   └── ...
│   │   │   ├── hooks/          # Custom hooks (useForm, etc.)
│   │   │   └── utils/          # cn(), classNames, etc.
│   │   ├── tailwind.config.ts  # Base Tailwind config
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── typescript-config/      # ⚙️ Shared TS configs
│       ├── package.json        # "@goolstar/typescript-config"
│       ├── base.json           # Base TypeScript config
│       ├── nextjs.json         # Extended for Next.js
│       └── react-library.json  # Extended for libraries
│
├── docs/                       # 📚 Documentation (preserved)
│   ├── README.md
│   ├── database/
│   ├── architecture/
│   │   ├── business-rules.md
│   │   └── monorepo-structure.md  ← This file
│   └── ...
│
└── .github/                    # GitHub workflows (future)
    └── workflows/
        └── (CI/CD configs)
```

---

## Package Purposes

### 1. `@goolstar/database`

**What:** Supabase configuration, migrations, and generated types.

**Contains:**
- Supabase client initialization (`client.ts`, `server.ts`)
- Auth middleware
- Auto-generated types from database schema
- SQL migrations
- Supabase config (`config.toml`)

**Used by:**
- `@goolstar/web` - For all database operations
- `@goolstar/business` - For type definitions
- Future mobile app - Same database clients
- Future API service - Same migrations

**Example:**
```typescript
// In apps/web/app/api/torneos/route.ts
import { supabase } from '@goolstar/database/server'
import type { Database } from '@goolstar/database'

export async function GET() {
  const { data } = await supabase.from('torneos').select()
  return Response.json(data)
}
```

---

### 2. `@goolstar/schemas`

**What:** Zod validation schemas for all entities.

**Contains:**
- Auth schemas (login, register)
- Tournament schemas
- Team schemas
- Player schemas
- Match schemas
- Payment schemas

**Used by:**
- `@goolstar/web` - Form validation
- `@goolstar/business` - Data validation
- API routes - Request validation
- Future mobile app - Same validations

**Example:**
```typescript
// In apps/web/components/torneos/torneo-form.tsx
import { torneoSchema } from '@goolstar/schemas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function TorneoForm() {
  const form = useForm({
    resolver: zodResolver(torneoSchema),
  })
  // ...
}
```

---

### 3. `@goolstar/business`

**What:** Pure business logic and calculations (no UI, no database).

**Contains:**
- Game rules (points system, tiebreakers)
- Suspension logic
- Standings calculations
- Debt calculations
- Date calculations
- Format utilities

**Used by:**
- `@goolstar/web` - Display logic
- API routes - Complex calculations
- Tests - Testable in isolation

**Example:**
```typescript
// In apps/web/components/torneos/tabla-posiciones.tsx
import { calculateStandings, calculateTiebreakers } from '@goolstar/business'

const sorted = calculateStandings(equipos)
```

---

### 4. `@goolstar/ui` (Phase 2+)

**What:** Reusable React components and hooks.

**Contains:**
- shadcn/ui components
- Custom hooks (useTeams, useStandings, etc.)
- Utility functions (cn, classNames)
- Base Tailwind configuration

**Used by:**
- `@goolstar/web` - All UI components
- Future apps - Design consistency

**Note:** Not created in Phase 1 because all components are currently in `apps/web/components/`. Extract later when patterns emerge.

---

### 5. `@goolstar/typescript-config`

**What:** Shared TypeScript configurations.

**Contains:**
- `base.json` - Base TypeScript config
- `nextjs.json` - Extends base for Next.js projects
- `react-library.json` - Extends base for React libraries

**Used by:**
- All packages and apps extend these configs
- Ensures consistency across the monorepo

**Example:**
```json
{
  "extends": "@goolstar/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## Development Workflow

### Installing Dependencies

```bash
# Install dependencies for entire monorepo
bun install

# Add dependency to specific workspace
bun add express --workspace @goolstar/web

# Add devDependency
bun add -D typescript --workspace @goolstar/database
```

### Running Commands

```bash
# Run dev server in @goolstar/web
bun --filter @goolstar/web dev

# Run in all workspaces
bun --filter '*' lint

# Run in specific package
bun --filter @goolstar/database db:push
```

### Using Internal Packages

```typescript
// apps/web/app/api/torneos/route.ts

// Import from @goolstar/database
import { supabase } from '@goolstar/database'
import type { Database } from '@goolstar/database'

// Import from @goolstar/schemas
import { torneoSchema } from '@goolstar/schemas'

// Import from @goolstar/business
import { calculateStandings } from '@goolstar/business'

export async function GET() {
  // Use all packages together
  const { data } = await supabase.from('torneos').select()
  const validated = torneoSchema.parse(data)
  return Response.json(validated)
}
```

---

## When to Create Each Package

### Phase 1 (Immediate)
- ✅ `@goolstar/database` - Setup Supabase migrations
- ✅ `@goolstar/schemas` - Validation schemas for forms
- ✅ `@goolstar/typescript-config` - Shared TS configs

### Phase 2 (Features 3-4)
- ✅ `@goolstar/business` - Extract complex calculations
- ⏳ `@goolstar/ui` - When you have 10+ reusable components

### Phase 3+ (Future)
- ✅ `apps/mobile` - React Native app (reuse packages)
- ✅ `apps/admin` - Admin dashboard (reuse packages)
- ✅ `apps/landing` - Marketing site (minimal package usage)

---

## Migration Path: Monolith → Monorepo

### Current State
```
goolstar_next/
├── app/
├── components/
├── lib/
├── public/
├── package.json  (single)
└── tsconfig.json
```

### Target State
```
goolstar_next/
├── apps/web/       ← Move all app/* here
├── packages/       ← Extract reusable code here
├── package.json    ← Root workspace config
└── bun.lock
```

### Step-by-Step Migration
1. Create `apps/web/` and `packages/` structure
2. Move `app/`, `components/`, `public/` to `apps/web/`
3. Create root `package.json` with workspaces
4. Update `apps/web/package.json`
5. Extract `lib/supabase/` → `packages/database/`
6. Extract `lib/validations/` → `packages/schemas/`
7. Create `packages/typescript-config/`
8. Update all imports to use `@goolstar/*`
9. Test everything still works
10. Deploy

---

## Benefits of This Structure

### For Development
| Benefit | How |
|---------|-----|
| **Type Safety** | Shared types from `@goolstar/database` |
| **DRY** | Validation rules only in `@goolstar/schemas` |
| **Testability** | Pure logic in `@goolstar/business` testable without Next.js |
| **Modularity** | Each package has clear responsibility |
| **Reusability** | Mobile app can use same packages |

### For Maintenance
| Benefit | How |
|---------|-----|
| **Separation of Concerns** | UI in app, logic in packages |
| **Easy to Find Code** | Database code in database package |
| **Easier to Test** | Pure functions in business package |
| **Shared Config** | TypeScript config consistency |
| **Single Lock File** | Bun manages all versions together |

### For Scaling
| Future Scenario | How Monorepo Helps |
|-----------------|-------------------|
| **Add Mobile App** | Reuse database + schemas + business |
| **Add Admin Panel** | Separate UI, share business logic |
| **Add API Service** | Share database migrations + schemas |
| **Add Landing Page** | Minimal dependencies, just tailwind config |

---

## Monolith vs Monorepo Comparison

### Monolith (Single App)
```
Pros:
✅ Fast to start
✅ Simple deploy
✅ No workspace complexity

Cons:
❌ Business logic mixed with React
❌ Hard to extract later
❌ Can't test logic without Next.js
❌ Mobile app would need duplicated code
❌ Harder to maintain as it grows
```

### Monorepo (Bun Workspaces)
```
Pros:
✅ Clear separation of concerns
✅ Business logic testable independently
✅ Reusable across projects
✅ Prepared for mobile/admin later
✅ Easier to maintain
✅ Type safety across packages

Cons:
⚠️ Initial setup complexity
⚠️ Need to understand workspaces
⚠️ Slightly more files to manage
```

### Recommendation
For GoolStar specifically:
- **Complex business rules** → Logic benefits from monorepo
- **Multiple entities** (20+ tables) → Schemas benefit from monorepo
- **Future mobile app** → Database benefits from monorepo
- **One current app** → Development speed not impacted
- **Bun is simple** → Workspace setup is trivial

**Verdict:** Monorepo is worth the minimal setup cost.

---

## Configuration Files

### Root `package.json`
```json
{
  "name": "goolstar",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "bun --filter @goolstar/web dev",
    "build": "bun --filter @goolstar/web build",
    "lint": "bun --filter '*' lint",
    "type-check": "bun --filter '*' type-check",
    "db:push": "bun --filter @goolstar/database db:push",
    "db:types": "bun --filter @goolstar/database db:types"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.2.0",
    "typescript": "^5"
  }
}
```

### Workspace Package (`packages/database/package.json`)
```json
{
  "name": "@goolstar/database",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./client": "./src/client.ts",
    "./server": "./src/server.ts",
    "./types": "./src/types.ts"
  },
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.43.0",
    "@supabase/auth-helpers-nextjs": "^0.10.0"
  }
}
```

### Internal Dependencies
```json
{
  "name": "@goolstar/web",
  "dependencies": {
    "@goolstar/database": "workspace:*",
    "@goolstar/schemas": "workspace:*",
    "@goolstar/business": "workspace:*",
    "next": "16.0.3"
  }
}
```

The `workspace:*` protocol tells Bun to use the local package instead of npm.

---

## FAQ

### Q: Will this slow down my MVP development?
**A:** No. All code still goes in `apps/web`. We're just preparing packages for extraction later. Migration is transparent.

### Q: What if I just want a monolith?
**A:** You can keep everything in `apps/web` for Phase 1. Extract later when needed. No pressure to create all packages immediately.

### Q: How do I deploy this?
**A:** Same as before. Deploy `apps/web` to Vercel. Packages are just internal dependencies.

### Q: Will this increase bundle size?
**A:** No. Only code used by `apps/web` is bundled. Unused packages don't affect output.

### Q: Can I still use API routes and Server Actions?
**A:** Yes. Nothing changes. API routes stay in `apps/web/app/api/`.

### Q: What about shared environment variables?
**A:** Use `.env.local` at the root. All workspaces can access it.

### Q: When should I extract to packages?
**A:** Extract when you have:
- Logic used in multiple places
- Tests for that logic
- Stable API that won't change often
- Business logic separate from UI

---

## Next Steps

1. **Phase 1:** Create initial workspaces structure
   - Set up `@goolstar/database`, `@goolstar/schemas`
   - Move Supabase config to database package
   - Update imports in `apps/web`

2. **Phase 2:** Add business logic
   - Create `@goolstar/business`
   - Extract calculation functions
   - Create unit tests

3. **Phase 3+:** Add more apps or packages as needed
   - Mobile app reuses packages
   - Admin panel reuses packages
   - Different teams can own different packages

---

## References

- [Bun Workspaces Docs](https://bun.sh/docs/install/workspaces)
- [Monorepo Benefits](https://monorepo.tools/)
- [GoolStar Business Rules](./business-rules.md)

---

**Status:** ✅ Architecture Decision Approved
**Created:** November 2024
**Updated:** November 2024
