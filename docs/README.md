# GoolStar Documentation

Complete documentation for the GoolStar tournament management system (Next.js + Supabase).

## Quick Navigation

### Start Here 🚀

1. **[../QUICK_START.md](../QUICK_START.md)** - Get running in 5 minutes
2. **[../CLAUDE.md](../CLAUDE.md)** - Development guide and patterns
3. **[../ROADMAP.md](../ROADMAP.md)** - Implementation phases (read this!)
4. **[architecture/current-structure.md](architecture/current-structure.md)** - Project structure explained

### Database Documentation

- **[database/schema.md](database/schema.md)** - Complete database schema
  - All tables (categorias, torneos, equipos, jugadores, partidos, etc.)
  - Constraints and indexes
  - Data relationships

- **[database/triggers.md](database/triggers.md)** - Automated database triggers
  - Trigger 1: Update statistics when match completes
  - Trigger 2: Suspend player on red card
  - Trigger 3: Verify accumulated yellow cards
  - Trigger 4: Create stats when team is created

- **[database/functions.md](database/functions.md)** - SQL functions for complex queries
  - get_tabla_posiciones() - Get standings table
  - calcular_deuda_equipo() - Calculate team debt
  - get_jugadores_destacados() - Get top scorers

### Architecture Documentation

- **[architecture/current-structure.md](architecture/current-structure.md)** - Current monolito project structure
  - Directory organization
  - Component patterns
  - Library structure
  - Import conventions
  - Data flow examples

- **[architecture/decision-monolito.md](architecture/decision-monolito.md)** - ADR: Why we chose monolito
  - Decision rationale
  - Trade-offs
  - Migration path to monorepo
  - Future triggers

- **[architecture/future-monorepo-migration.md](architecture/future-monorepo-migration.md)** - When & how to migrate to monorepo
  - Monorepo benefits
  - Migration checklist
  - Triggers for migration
  - Bun workspaces setup

- **[architecture/business-rules.md](architecture/business-rules.md)** - Business logic and rules
  - Points system
  - Tiebreaker criteria
  - Suspension rules
  - Absence/exclusion rules
  - Financial system
  - Tournament phases

### Development Documentation

- **[development/setup.md](development/setup.md)** - Setup and getting started
  - Initial project setup
  - Environment configuration
  - Supabase configuration
  - Database migrations
  - Running locally

### AI Prompts

- **[ai-prompts/chatgpt-guide.md](ai-prompts/chatgpt-guide.md)** - For ChatGPT, Claude, or other conversational AIs
  - Main prompt with full context
  - Task-specific prompts
  - Code examples
  - Implementation flow recommendations

---

## Project Overview

**GoolStar** is a comprehensive tournament management system for indoor soccer that handles:

- Tournament management with multiple phases (groups and knockout)
- Team and player registration
- Match scheduling and result tracking
- Automatic standings calculation
- Card system with automatic suspensions
- Financial tracking (registration, fines, referee payments)
- Real-time updates
- Document verification

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions)
- **Code Quality**: Biome (linting + formatting)
- **Deployment**: Vercel (frontend) + Supabase Cloud (database)

## Quick Start

```bash
# Install dependencies
npm install

# Start Supabase locally (requires Docker)
supabase start

# Configure environment
cp .env.example .env.local
# Edit .env.local with Supabase credentials

# Run development server
npm run dev
```

## Development Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Check code with Biome
npm run format      # Format code with Biome
```

## Documentation Structure

```
docs/
├── README.md                 # This file
├── database/
│   ├── schema.md            # Database tables and structure
│   ├── triggers.md          # Automatic database triggers
│   ├── functions.md         # SQL functions
│   └── rls-policies.md      # Row level security (in schema.md)
├── architecture/
│   ├── business-rules.md    # Business logic rules
│   └── tech-stack.md        # (in CLAUDE.md)
├── development/
│   ├── setup.md             # Getting started guide
│   └── deployment.md        # (planned)
├── ai-prompts/
│   └── chatgpt-guide.md     # Prompts for other AIs
└── archive/
    └── (original docs)
```

## Key Features

### Automated Triggers
- Statistics auto-update when a match completes
- Players automatically suspended on red cards
- Yellow card accumulation tracked (3 = 1 match suspension)
- Team statistics created automatically

### Complex Queries
- Standings sorted by points, goal difference, goals scored
- Team debt calculation including registration, fines, payments
- Top scorers ranking

### Security
- Row Level Security (RLS) for all sensitive tables
- Role-based access (admin, team director, player)
- Document verification workflow

### Real-time Features
- Live standings updates via Supabase Realtime
- Match result notifications
- Financial updates

## Database at a Glance

**Core Tables:**
- `categorias` - Tournament categories
- `torneos` - Tournaments
- `equipos` - Teams
- `jugadores` - Players
- `partidos` - Matches
- `goles` - Goals
- `tarjetas` - Cards
- `estadistica_equipo` - Team standings
- `transacciones_pago` - Financial transactions

Total: 15+ tables with proper relationships, constraints, and indexes.

## Implementation Phases

**See [../ROADMAP.md](../ROADMAP.md) for complete implementation plan with detailed tasks.**

1. **Phase 0** (1-2 days): Setup Base - Supabase, Auth, UI
2. **Phase 1** (3-4 days): CRUD Básico - Torneos, Equipos, Jugadores
3. **Phase 2** (3-4 days): Gestión Partidos - Matches, Goals, Cards
4. **Phase 3** (2-3 days): Estadísticas - Standings, Live updates
5. **Phase 4** (2-3 days): Sistema Financiero - Payments, Debt
6. **Phase 5** (2-3 days): Admin Panel - Document verification
7. **Phase 6** (2-3 days): Testing & Deploy - E2E tests, Production

**Total: 4-5 weeks** (20-25 business days)

## Contributing

- Refer to **CLAUDE.md** for development guidelines specific to Claude Code
- Use **CLAUDE.md** code patterns and standards
- Check **database/** docs before writing queries
- Follow business rules in **architecture/business-rules.md**

## Support

For more information:
- Next.js docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- Biome docs: https://biomejs.dev/

---

**Project**: GoolStar (Next.js + Supabase)
**Created**: November 2024
**Version**: 1.0
