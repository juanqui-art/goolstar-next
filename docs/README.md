# GoolStar Documentation

**Complete documentation for the GoolStar tournament management system (Next.js + Supabase)**

> **📌 Documentation was reorganized on 2025-11-25** - Files have been renamed and consolidated for better clarity. See [REORGANIZATION_MAP.md](REORGANIZATION_MAP.md) for a complete map of changes.

---

## 🚀 Start Here

New to the project? Start with these documents:

1. **[../README.md](../README.md)** - Project overview and quick start
2. **[../ROADMAP.md](../ROADMAP.md)** - Implementation phases and current status
3. **[../CLAUDE.md](../CLAUDE.md)** - Development guide and patterns
4. **[guides/quick-start.md](guides/quick-start.md)** - Get running in 5 minutes
5. **[architecture/current-structure.md](architecture/current-structure.md)** - Project structure explained

---

## 📚 Documentation Index

### 📖 Getting Started Guides

Essential guides to get you up and running:

| Document | Description | Audience |
|----------|-------------|----------|
| **[guides/quick-start.md](guides/quick-start.md)** | 5-minute setup guide | Everyone |
| **[guides/setup-checklist.md](guides/setup-checklist.md)** | Complete setup checklist | Developers |
| **[guides/quick-reference.md](guides/quick-reference.md)** | Command reference | Developers |
| **[guides/team-guide.md](guides/team-guide.md)** | Team collaboration guide | Team Members |
| **[guides/team-organization.md](guides/team-organization.md)** | Team structure & roles | Team Leads |
| **[guides/senior-setup.md](guides/senior-setup.md)** | Senior developer setup | Senior Devs |

---

### 🏗️ Architecture Documentation

Understand the system design and architecture decisions:

| Document | Description |
|----------|-------------|
| **[architecture/current-structure.md](architecture/current-structure.md)** | Current monolito project structure |
| **[architecture/decision-monolito.md](architecture/decision-monolito.md)** | ADR: Why we chose monolito architecture |
| **[architecture/future-monorepo-migration.md](architecture/future-monorepo-migration.md)** | When & how to migrate to monorepo |
| **[architecture/business-rules.md](architecture/business-rules.md)** | Business logic and tournament rules |
| **[architecture/caching-strategy.md](architecture/caching-strategy.md)** | ⭐ Caching strategy with 'use cache: private' |

**Key Topics:**
- Directory organization & component patterns
- Library structure & import conventions
- Data flow examples
- **Caching strategy for Supabase + Next.js 16**
- Points system & tiebreaker criteria
- Suspension rules & financial system
- Tournament phases (groups + knockout)

---

### 💾 Database Documentation

Complete database schema, automation, and security:

| Document | Description |
|----------|-------------|
| **[database/schema.md](database/schema.md)** | Complete database schema (21 tables) |
| **[database/triggers.md](database/triggers.md)** | Automated database triggers (9 triggers) |
| **[database/functions.md](database/functions.md)** | SQL functions for complex queries (9 functions) |
| **[database/rls-policies.md](database/rls-policies.md)** | Row-Level Security policies |
| **[database/migrations-step-by-step.md](database/migrations-step-by-step.md)** | Step-by-step migration guide |
| **[database/migrations-quick-reference.md](database/migrations-quick-reference.md)** | Quick migration reference |

**Database Stats:**
- 21 tables with proper relationships
- 9 triggers for automation
- 9 functions for complex queries
- 139 indexes for performance
- 13+ RLS policies for security

**Key Features:**
- Statistics auto-update when matches complete
- Players automatically suspended on cards
- Yellow card accumulation tracking
- Team statistics created automatically

---

### 👨‍💻 Development Documentation

Development practices, testing, and deployment:

| Document | Description |
|----------|-------------|
| **[development/authentication.md](development/authentication.md)** | Authentication implementation |
| **[development/conventions.md](development/conventions.md)** | Code conventions and standards |
| **[development/testing.md](development/testing.md)** | Testing strategy and guidelines |
| **[development/deployment.md](development/deployment.md)** | Deployment to production |

**Key Topics:**
- Login and registration pages
- Form validation with Zod
- Supabase Auth integration
- TypeScript patterns & naming conventions
- Component structure & import organization
- Vercel deployment steps

---

### 📊 Phase Tracking

Track implementation progress and status:

| Document | Description |
|----------|-------------|
| **[phases/phase-1-complete.md](phases/phase-1-complete.md)** | Phase 1: Infrastructure completion summary |
| **[phases/phase-2-complete.md](phases/phase-2-complete.md)** | Phase 2: Dashboard completion summary |
| **[phases/phase-2-task1-complete.md](phases/phase-2-task1-complete.md)** | Phase 2 Task 1: Tournament pages completion |
| **[phases/infrastructure-status.md](phases/infrastructure-status.md)** | Infrastructure setup status |
| **[phases/infrastructure-overview.md](phases/infrastructure-overview.md)** | Infrastructure architecture diagrams |
| **[phases/junior-tasks-phase2.md](phases/junior-tasks-phase2.md)** | Junior developer tasks for Phase 2 |

**Current Status:**
- ✅ Phase 0: Setup Base (100% complete)
- ✅ Phase 1: Infrastructure (100% complete)
- 🔄 Phase 2: Dashboard & Entity Pages (80% complete)
- ⏳ Phase 3-7: Pending

---

### 🔧 Troubleshooting

Common issues and solutions:

| Document | Description |
|----------|-------------|
| **[troubleshooting/react-context-error-solutions.md](troubleshooting/react-context-error-solutions.md)** | React Context error solutions (complete) |
| **[troubleshooting/cache-components-overview.md](troubleshooting/cache-components-overview.md)** | Cache Components overview and analysis |
| **[troubleshooting/cache-implementation.md](troubleshooting/cache-implementation.md)** | Cache implementation guide |
| **[troubleshooting/implementation-steps.md](troubleshooting/implementation-steps.md)** | Implementation step-by-step |

> **Note:** Legacy troubleshooting docs have been moved to [archive/](archive/) - see [REORGANIZATION_MAP.md](REORGANIZATION_MAP.md) for details.

**Common Issues:**
- `TypeError: Cannot read properties of null (reading 'useContext')`
- Prerendering context issues
- Build optimization errors

**Solutions:**
- Cache Components with `use cache` directive
- Server/Client component separation
- Proper context usage patterns

---

### 📦 Archive

Legacy documentation (historical reference):

| Document | Description |
|----------|-------------|
| **[archive/session-summary.md](archive/session-summary.md)** | Historical session summaries |
| **[archive/junior-tasks-phase1.md](archive/junior-tasks-phase1.md)** | Phase 1 junior tasks (deprecated) |
| **[archive/docs-index-old.md](archive/docs-index-old.md)** | Old documentation index |
| **[archive/documentation-summary.md](archive/documentation-summary.md)** | Legacy documentation summary |
| **[archive/legacy-build-errors.md](archive/legacy-build-errors.md)** | Legacy build errors (consolidated) |
| **[archive/legacy-build-analysis.md](archive/legacy-build-analysis.md)** | Legacy build analysis (consolidated) |
| **[archive/legacy-solution-summary.md](archive/legacy-solution-summary.md)** | Legacy solution summary (consolidated) |

---

## 🎯 Quick Navigation by Role

### For New Developers
1. Read [../README.md](../README.md) for project overview
2. Follow [guides/quick-start.md](guides/quick-start.md) to set up
3. Review [architecture/current-structure.md](architecture/current-structure.md)
4. Check [development/conventions.md](development/conventions.md)
5. Start coding following [../CLAUDE.md](../CLAUDE.md)

### For Team Leads
1. Review [../ROADMAP.md](../ROADMAP.md) for progress
2. Check [guides/team-organization.md](guides/team-organization.md)
3. Review [phases/junior-tasks-phase2.md](phases/junior-tasks-phase2.md)
4. Monitor [phases/infrastructure-status.md](phases/infrastructure-status.md)

### For Database Work
1. Review [database/schema.md](database/schema.md)
2. Understand [database/triggers.md](database/triggers.md)
3. Follow [database/migrations-step-by-step.md](database/migrations-step-by-step.md)
4. Check [database/functions.md](database/functions.md)

### For Frontend Work
1. Review [architecture/current-structure.md](architecture/current-structure.md)
2. Check [development/conventions.md](development/conventions.md)
3. Study [development/authentication.md](development/authentication.md)
4. Follow patterns in [../CLAUDE.md](../CLAUDE.md)

### For DevOps/Deployment
1. Review [development/deployment.md](development/deployment.md)
2. Check [guides/setup-checklist.md](guides/setup-checklist.md)
3. Review [database/migrations-step-by-step.md](database/migrations-step-by-step.md)
4. Monitor [troubleshooting/react-context-error-solutions.md](troubleshooting/react-context-error-solutions.md)

---

## 📈 Project Overview

### What is GoolStar?

**GoolStar** is a comprehensive tournament management system for indoor soccer that handles:

- ⚽ **Tournament Management** - Multiple phases (groups and knockout)
- 👥 **Team & Player Management** - Registration, documents, verification
- 🎮 **Match Management** - Scheduling, results, goals, cards
- 📊 **Statistics** - Automatic standings calculation
- 🟨🟥 **Card System** - Automatic suspensions
- 💰 **Financial Tracking** - Registration, fines, referee payments
- ⚡ **Real-time Updates** - Live standings via Supabase Realtime
- 📄 **Document Verification** - Admin workflow

### Tech Stack

**Frontend:**
- Next.js 16 with App Router
- React 19 with Server Components
- TypeScript 5 (strict mode)
- Tailwind CSS 4 for styling
- shadcn/ui component library

**Backend:**
- Supabase (PostgreSQL + Auth + Storage + Realtime + Edge Functions)
- Server Actions for mutations
- API Routes for complex operations

**Database:**
- PostgreSQL with 21 tables
- 9 triggers for automation
- 9 functions for complex queries
- 139 indexes for performance
- RLS policies for security

**Code Quality:**
- Biome 2.2 for linting and formatting
- TypeScript strict mode
- Git hooks for pre-commit checks

---

## 🔑 Key Features

### Automated Database Operations
- **Triggers** automatically update standings when match completes
- **Functions** provide complex queries (standings, top scorers, debt calculation)
- **RLS Policies** enforce role-based access (admin, team director, player)
- **Indexes** optimize hot queries (fecha, torneo_id, jugador_id)

### Real-time Features
- Live standings updates via Supabase Realtime
- Match result notifications
- Financial updates
- Document verification status

### Security
- Row Level Security (RLS) on all sensitive tables
- Role-based access control
- Document verification workflow
- Authentication via Supabase Auth

---

## 📝 Development Commands

```bash
# Development
bun run dev         # Start development server
bun run build       # Build for production
bun run start       # Start production server

# Code Quality
bun run lint        # Check code with Biome
bun run format      # Format code with Biome

# Database (Supabase CLI)
supabase start      # Start local Supabase
supabase stop       # Stop local Supabase
supabase db push    # Push migrations to local DB
supabase gen types typescript --local > types/database.ts
```

---

## 🎓 Learning Path

### Week 1: Foundation
- [ ] Read [../README.md](../README.md) and [../ROADMAP.md](../ROADMAP.md)
- [ ] Complete [guides/quick-start.md](guides/quick-start.md)
- [ ] Study [architecture/current-structure.md](architecture/current-structure.md)
- [ ] Review [database/schema.md](database/schema.md)

### Week 2: Development
- [ ] Study [development/conventions.md](development/conventions.md)
- [ ] Implement first feature following [../CLAUDE.md](../CLAUDE.md)
- [ ] Understand [database/triggers.md](database/triggers.md)
- [ ] Practice with [development/testing.md](development/testing.md)

### Week 3: Advanced
- [ ] Deep dive into [architecture/business-rules.md](architecture/business-rules.md)
- [ ] Understand [database/functions.md](database/functions.md)
- [ ] Study [development/authentication.md](development/authentication.md)
- [ ] Prepare for deployment via [development/deployment.md](development/deployment.md)

---

## 🤝 Contributing

See [development/conventions.md](development/conventions.md) for:
- TypeScript patterns
- Component structure
- Naming conventions
- Import organization
- Code review process

---

## 📞 Support

**Need Help?**
- 🐛 **Bug or Error?** → Check [troubleshooting/](troubleshooting/)
- 🏗️ **Architecture Question?** → See [architecture/](architecture/)
- 💾 **Database Issue?** → Review [database/](database/)
- 👨‍💻 **Development Help?** → Check [development/](development/)
- 📋 **Implementation Status?** → See [../ROADMAP.md](../ROADMAP.md)

---

## 📊 Documentation Statistics

- **Total Documents:** 45+ markdown files
- **Total Lines:** 26,000+ lines of documentation
- **Categories:** 7 (guides, architecture, database, development, phases, troubleshooting, archive)
- **Last Updated:** 2025-11-25
- **Maintained By:** GoolStar Development Team

**Recent Reorganization (2025-11-25):**
- Removed 13 duplicate/temp files from root
- Consolidated 7 troubleshooting files → 4 files
- Moved 8 files to better locations
- Archived 3 legacy build error docs

---

## 🔄 Recent Updates

**2025-11-25:**
- ✅ **Major documentation reorganization** - See [REORGANIZATION_MAP.md](REORGANIZATION_MAP.md)
- ✅ Cleaned root directory (removed 13 duplicate/temp files)
- ✅ Consolidated troubleshooting/ folder (7→4 files)
- ✅ Renamed migration files for clarity (migrations-step-by-step.md, migrations-quick-reference.md)
- ✅ Moved phase completion docs from development/ to phases/
- ✅ Archived legacy build error documentation
- ✅ Updated all documentation references and links
- ✅ Removed empty ai-prompts/ folder

**2025-11-22:**
- ✅ Reorganized documentation into categorized folders
- ✅ Moved 21 files from root to `docs/` subdirectories
- ✅ Updated ROADMAP.md with accurate progress (Phase 2: 80%)
- ✅ Created comprehensive README.md
- ✅ Consolidated duplicate documentation
- ✅ Added troubleshooting section
- ✅ Added phase tracking section

---

**Project:** GoolStar (Next.js + Supabase)
**Created:** November 2024
**Version:** 1.0.0-beta
**Status:** Active Development (Phase 2 of 7 - 80% complete)
