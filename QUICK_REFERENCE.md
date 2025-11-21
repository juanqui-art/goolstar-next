# GoolStar Quick Reference Card

## 🚀 Quick Start

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (localhost:3000)
npm run lint            # Check code with Biome
npm run format          # Format code with Biome
npm run build           # Build for production
```

## 📚 Documentation Map

| Need | Read |
|------|------|
| **Overview** | [docs/README.md](docs/README.md) |
| **Development setup** | [CLAUDE.md](CLAUDE.md) |
| **Database tables** | [docs/database/schema.md](docs/database/schema.md) |
| **Auto-update logic** | [docs/database/triggers.md](docs/database/triggers.md) |
| **SQL queries** | [docs/database/functions.md](docs/database/functions.md) |
| **Game rules** | [docs/architecture/business-rules.md](docs/architecture/business-rules.md) |
| **Environment vars** | [.env.example](.env.example) |

## 🏗️ Architecture at a Glance

```
Next.js 16 (App Router) + React 19
    ↓
Supabase (PostgreSQL + Auth + Storage + Realtime)
    ↓
Biome (Linting + Formatting)
    ↓
Deployed: Vercel (frontend) + Supabase Cloud (DB)
```

## 📊 Database Tables (20+)

**Core**: `categorias`, `torneos`, `equipos`, `jugadores`, `partidos`
**Cards**: `tarjetas`, `goles`, `cambios_jugador`
**Stats**: `estadistica_equipo`, `llaves_eliminatorias`
**Finance**: `transacciones_pago`, `pagos_arbitro`
**Details**: `jugador_documentos`, `arbitros`, `dirigentes`, `fases_eliminatorias`, `jornadas`, `participacion_jugador`, `eventos_partido`, `eventos_torneo`, `mejores_perdedores`

## ⚡ Key Triggers (Auto-Update)

1. **Match complete** → Update standings
2. **Red card** → Suspend player (2 matches)
3. **Yellow cards** → Accumulate (3 = 1-match suspension)
4. **Create team** → Create stats record

## 💰 Business Rules Summary

| Rule | Value |
|------|-------|
| **Win** | 3 points |
| **Draw** | 1 point |
| **Loss** | 0 points |
| **Tiebreaker** | 1. Points 2. Goal Diff 3. Goals For |
| **Red card** | 2-match suspension |
| **Yellow cards** | 3 = 1-match suspension |
| **Absences** | 3 = Exclusion |

## 🔐 Environment Setup

```bash
# Copy template
cp .env.example .env.local

# Add from Supabase project settings:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 📂 Project Structure

```
app/                    # Next.js pages & API routes
components/             # React components
lib/                    # Utilities, Supabase config, validations
actions/                # Server Actions
types/                  # TypeScript definitions
docs/                   # Documentation (modular)
supabase/               # Database migrations
```

## 🎯 Common Tasks

### Add a Database Table
1. Create migration in `supabase/migrations/`
2. Document in [docs/database/schema.md](docs/database/schema.md)
3. Run migration locally with `supabase db push`

### Create a New Feature
1. Create validation schema in `lib/validations/`
2. Create Server Action in `actions/`
3. Create component in `components/`
4. Create page in `app/(dashboard)/`

### Query Standings
```typescript
const { data } = await supabase.rpc('get_tabla_posiciones', {
  torneo_uuid: tournamentId
})
```

### Calculate Team Debt
```typescript
const { data } = await supabase.rpc('calcular_deuda_equipo', {
  equipo_uuid: teamId
})
```

## 🔍 Find Information

| Question | Search in |
|----------|-----------|
| "How does suspension work?" | `docs/architecture/business-rules.md` → Suspension System |
| "What's in the jugadores table?" | `docs/database/schema.md` → JUGADORES section |
| "When do triggers fire?" | `docs/database/triggers.md` → Trigger Execution Order |
| "How to get team stats?" | `docs/database/functions.md` → Usage examples |
| "Setup instructions?" | `CLAUDE.md` → Development Notes |

## 🛠️ Development Patterns

### Validation (Zod)
```typescript
// lib/validations/torneo.ts
export const torneoSchema = z.object({
  nombre: z.string().min(1),
  // ...
})
```

### Server Action
```typescript
// actions/torneos.ts
'use server'
export async function createTorneo(data: FormData) {
  // Validate → Insert → Revalidate
}
```

### API Route
```typescript
// app/api/torneos/route.ts
export async function GET() {
  const { data } = await supabase.from('torneos').select()
  return Response.json(data)
}
```

## 📋 Checklist Before Deploy

- [ ] Environment variables configured (`.env.local`)
- [ ] Supabase migrations executed (`supabase db push`)
- [ ] Type generation updated (`supabase gen types`)
- [ ] All tests passing
- [ ] Build succeeds (`npm run build`)
- [ ] No linting errors (`npm run lint`)

## 🚨 Important Notes

- **Partidos constraint**: Can reference EITHER `jornada_id` OR `fase_eliminatoria_id`, NOT both
- **Triggers are critical**: They maintain data consistency (don't disable unless you know why)
- **RLS enabled** on sensitive tables (check before queries)
- **React Compiler enabled** in next.config.ts (performance optimization)
- **Biome** replaces ESLint + Prettier (single tool for linting & formatting)

## 📞 Need Help?

1. **Overview**: Read [docs/README.md](docs/README.md)
2. **Specific question**: Check [DOCUMENTATION_SUMMARY.md](DOCUMENTATION_SUMMARY.md)
3. **Code patterns**: See [CLAUDE.md](CLAUDE.md)
4. **Database**: See `docs/database/` files
5. **Business logic**: See [docs/architecture/business-rules.md](docs/architecture/business-rules.md)

---

**Last Updated**: November 2024 | **Status**: ✅ Ready for Development
