# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GoolStar** is a modern tournament management system for indoor soccer, being migrated from Django to a Next.js + Supabase stack. The application manages teams, players, matches, standings, cards/suspensions, and financial transactions for sports tournaments.

Current status: Fresh Next.js 16 project (bootstrap phase) with detailed architecture planned in `info_project.md`.

## Development Commands

### Common Tasks (Using Bun)

```bash
# Development server (runs apps/web)
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Linting & code quality
bun run lint           # Check code with Biome
bun run format         # Format code with Biome

# Monorepo workspaces
bun --filter @goolstar/web dev        # Dev in web app only
bun --filter '*' lint                 # Lint all packages
bun add package-name --workspace @goolstar/web  # Add to web workspace

# Database operations
bun run db:push        # Push migrations to Supabase
bun run db:types       # Generate TypeScript types from DB
```

### Environment Setup

- Copy `.env.example` to `.env.local` and configure Supabase credentials (required to run the app)
- Project uses TypeScript with strict mode enabled
- Path alias: `@/*` resolves to root directory

## Architecture Overview

### Stack Components

**Frontend Framework**
- Next.js 16.0 with App Router
- React 19.2 with Server Components
- TypeScript 5+ (strict mode)
- Tailwind CSS 4 for styling
- React Compiler enabled for optimization

**Backend Infrastructure** (To be implemented)
- Supabase PostgreSQL for database
- Supabase Auth for authentication
- Supabase Storage for file uploads
- Supabase Edge Functions for complex logic
- API Routes + Server Actions for backend

**Code Quality**
- Biome 2.2 for linting and formatting (replaces ESLint/Prettier)
- All Biome rules configured in `biome.json`

### Project Structure: Bun Monorepo with Workspaces

**See:** [docs/architecture/monorepo-structure.md](docs/architecture/monorepo-structure.md) for complete monorepo architecture.

```
goolstar_next/                         # Monorepo root
├── apps/web/                          # Main Next.js app
│   ├── app/                           # Next.js App Router
│   │   ├── (auth)/                    # Login/Register
│   │   ├── (dashboard)/               # Protected routes
│   │   ├── api/                       # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/                    # React components
│   ├── public/
│   ├── next.config.ts
│   └── package.json                   # "@goolstar/web"
│
├── packages/
│   ├── database/                      # 🔥 Supabase config + types
│   │   ├── src/client.ts              # Supabase client
│   │   ├── src/server.ts              # Server client
│   │   ├── supabase/migrations/       # SQL migrations
│   │   └── package.json               # "@goolstar/database"
│   │
│   ├── schemas/                       # 📋 Zod validations
│   │   ├── src/torneo.ts
│   │   ├── src/equipo.ts
│   │   └── package.json               # "@goolstar/schemas"
│   │
│   ├── business/                      # 🧮 Pure business logic (Phase 2+)
│   │   ├── src/rules/
│   │   └── package.json               # "@goolstar/business"
│   │
│   └── typescript-config/             # ⚙️ Shared TS configs
│       └── package.json               # "@goolstar/typescript-config"
│
└── docs/                              # Documentation (preserved)
```

**Key Points:**
- Single app (`apps/web`) for MVP development
- Internal packages (`@goolstar/*`) for shared code
- Prepare for future mobile app, admin panel, etc.
- All imports use `@goolstar/database`, `@goolstar/schemas`

### Database Architecture (Critical)

The database is **PostgreSQL with extensive automation**:

**Key Tables:**
- `categorias` - Tournament categories with pricing & rules
- `torneos` - Tournaments with phase management
- `equipos` - Teams with group assignment & exclusion tracking
- `jugadores` - Players with suspension tracking
- `partidos` - Matches with results, goals, cards, changes
- `tarjetas` - Yellow/red cards with automatic suspensions
- `estadistica_equipo` - Auto-updated standings
- `transacciones_pago` - Financial tracking

**Automation:**
- **Triggers** automatically update standings, suspend players on cards, increment inasistencias
- **Functions** provide complex queries (standings, player stats, team debt calculation)
- **RLS Policies** enforce role-based access (admin, team director, player)
- **Indexes** for performance on hot queries (fecha, torneo_id, jugador_id)

**Critical constraint:** Matches can only reference either a `jornada_id` (group phase) OR `fase_eliminatoria_id` (knockout), not both.

### Key Implementation Patterns

#### Form Validation
Use Zod schemas in `lib/validations/`. Example:
```typescript
import { z } from "zod";

export const torneoSchema = z.object({
  nombre: z.string().min(1),
  categoria_id: z.string().uuid(),
  fecha_inicio: z.date(),
});
```

#### Data Fetching
- **Server Components:** Query Supabase directly with server client
- **Client Components:** Use Server Actions or API Routes
- Use TanStack Query for client-side caching (to be installed)

#### Database Queries
Access Supabase via:
```typescript
const { data, error } = await supabase
  .from('torneos')
  .select()
  .eq('id', id);
```

Generated types from Supabase CLI ensure type safety (`types/database.ts`).

## Development Notes

### When Starting Implementation

1. **Database First**: Execute migrations in order (001-010) to set up schema with triggers/functions
2. **Auth Middleware**: Set up route protection before building features
3. **Validation**: Always use Zod schemas for form inputs
4. **Type Safety**: Generate Supabase types via `supabase gen types`
5. **Server Actions**: Prefer Server Actions over API Routes for mutations when possible

### Supabase-Specific Details

- Local development: `supabase start` for local PostgreSQL + API
- Type generation: `supabase gen types typescript --local > types/database.ts`
- RLS is enabled on sensitive tables (torneos, equipos, jugadores, partidos, transacciones_pago)
- Edge Functions (Deno runtime) handle complex async operations

### Performance Considerations

- Realtime subscriptions via Supabase can update standings table live
- Standings are pre-computed and stored in `estadistica_equipo` (updated by trigger)
- Use database functions instead of application logic for aggregations
- Indexes on `partidos(fecha, torneo_id)` and `tarjetas(jugador_id)` are critical

### Code Quality Standards

- **Biome** is configured with recommended rules for React/Next.js
- No manual formatting needed (use `npm run format`)
- TypeScript strict mode enforces type safety
- Import organization is automatic via Biome's assist actions

## Documentation

See **[docs/README.md](docs/README.md)** for complete documentation index.

Key files:
- `docs/database/schema.md` - Complete database schema with all 20+ tables
- `docs/database/triggers.md` - Automated database operations
- `docs/database/functions.md` - SQL functions for complex queries
- `docs/architecture/business-rules.md` - Business logic and rules
- `.env.example` - Environment variables template

## Common Workflows

### Adding a New Feature (e.g., Tournament CRUD)

1. Create Zod schema in `lib/validations/torneo.ts`
2. Create Server Action in `actions/torneos.ts` for mutations
3. Create API route in `app/api/torneos/route.ts` if needed
4. Create React component in `components/torneos/`
5. Create page in `app/(dashboard)/torneos/`
6. Add database query helpers as needed

### Running Locally

```bash
# Install dependencies
npm install

# Start Supabase (requires Docker)
supabase start

# Set environment variables
cp .env.example .env.local
# Edit .env.local with Supabase URLs/keys

# Start dev server
npm run dev
# Open http://localhost:3000
```

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs)
- [Supabase Client Library](https://supabase.com/docs/reference/javascript/introduction)
- [Biome Docs](https://biomejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Project-Specific Info

- **MVP Timeline**: 4-5 weeks (from specification in `info_project.md`)
- **Test Data**: Load via `supabase db seed` once migrations are complete
- **Deployment**: Frontend via Vercel, Database via Supabase Cloud
- **Main Business Logic**: Implemented as PostgreSQL triggers and functions, not application code
