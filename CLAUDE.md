# CLAUDE.md - GoolStar Development Guide

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GoolStar** is a modern tournament management system for indoor soccer, being migrated from Django to a Next.js + Supabase stack. The application manages teams, players, matches, standings, cards/suspensions, and financial transactions for sports tournaments.

**Current Status:** Fresh Next.js 16 project (bootstrap phase)
**Architecture:** Single app monolito (simple + fast for MVP)
**Timeline:** 4-5 weeks for MVP
**See also:** [ROADMAP.md](ROADMAP.md) for detailed implementation phases

## Development Commands

### Common Tasks (Using Bun)

```bash
# Development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Linting & code quality
bun run lint           # Check code with Biome
bun run format         # Format code with Biome
```

### Database Operations (Supabase CLI)

```bash
# Start local Supabase (requires Docker)
supabase start

# Stop local Supabase
supabase stop

# Push migrations to local DB
supabase db push

# Generate TypeScript types from schema
supabase gen types typescript --local > types/database.ts

# Create new migration
supabase migration new migration_name
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

### Project Structure: Monolito Simple

**See:** [docs/architecture/current-structure.md](docs/architecture/current-structure.md) for detailed project structure.

```
goolstar_next/
├── app/                                # Next.js App Router
│   ├── (auth)/                         # Login/Register routes
│   ├── (dashboard)/                    # Protected dashboard routes
│   │   ├── torneos/
│   │   ├── equipos/
│   │   ├── jugadores/
│   │   ├── partidos/
│   │   ├── financiero/
│   │   └── admin/
│   ├── api/                            # API routes
│   ├── layout.tsx
│   └── page.tsx
├── components/                         # React components
│   ├── ui/                             # shadcn/ui components
│   ├── torneos/
│   ├── equipos/
│   ├── jugadores/
│   ├── partidos/
│   └── layout/
├── lib/                                # Utilities & business logic
│   ├── supabase/
│   │   ├── client.ts                   # Client-side Supabase
│   │   ├── server.ts                   # Server-side Supabase
│   │   └── types.ts                    # Generated from DB
│   ├── validations/                    # Zod schemas
│   │   ├── torneo.ts
│   │   ├── equipo.ts
│   │   ├── jugador.ts
│   │   ├── partido.ts
│   │   └── financiero.ts
│   ├── utils/                          # Pure utilities
│   │   ├── points.ts
│   │   ├── standings.ts
│   │   ├── suspension.ts
│   │   └── format.ts
│   └── hooks/                          # Custom React hooks
│       ├── use-torneos.ts
│       └── use-equipos.ts
├── actions/                            # Server Actions
│   ├── torneos.ts
│   ├── equipos.ts
│   └── jugadores.ts
├── supabase/
│   ├── migrations/                     # SQL migrations (001-010)
│   └── config.toml
├── public/
├── types/                              # Generated database types
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

**Key Points:**
- Single app, simpler structure
- All code in `/lib` organized by responsibility
- Imports use `@/lib/...` pattern
- Easy to scale within single app
- Migration path to monorepo documented (see docs/architecture/decision-monolito.md)

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

1. **Create Zod schema** in `lib/validations/torneo.ts`
2. **Create Server Action** in `actions/torneos.ts` for mutations
3. **Create components** in `components/torneos/`
4. **Create page** in `app/(dashboard)/torneos/`
5. **Add API routes** in `app/api/torneos/route.ts` if needed
6. **Test** with dev server

**Pattern:**
```typescript
// lib/validations/torneo.ts
import { z } from "zod"
export const torneoSchema = z.object({
  nombre: z.string().min(1),
  fecha_inicio: z.date(),
})

// actions/torneos.ts
"use server"
import { torneoSchema } from "@/lib/validations/torneo"
export async function createTorneo(data: unknown) {
  const torneo = torneoSchema.parse(data)
  // TODO: Save to Supabase
}

// app/(dashboard)/torneos/page.tsx
import { TorneoForm } from "@/components/torneos/torneo-form"
export default function TorneosPage() {
  return <TorneoForm />
}
```

### Running Locally

```bash
# Install dependencies
bun install

# Start Supabase (requires Docker - for local database)
supabase start

# Copy & configure environment
cp .env.example .env.local
# Edit .env.local with Supabase URLs from: supabase status

# Start dev server
bun run dev
# Open http://localhost:3000
```

**First time setup:**
```bash
# After starting Supabase, generate types from schema
supabase gen types typescript --local > types/database.ts
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
