# GoolStar - Tournament Management System

**Modern indoor soccer tournament management platform built with Next.js 16 and Supabase**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 🎯 Project Status

**Phase 2 of 7** - Dashboard & Entity Pages (80% complete)

```
✅ Phase 0: Setup Base                    100%
✅ Phase 1: Infrastructure                100%
🔄 Phase 2: Dashboard & Entity Pages       80%
⏳ Phase 3: Match Management                0%
⏳ Phase 4: Statistics & Standings          0%
⏳ Phase 5: Financial System                0%
⏳ Phase 6: Admin Panel                     0%
⏳ Phase 7: Testing & Deploy                0%

Overall MVP Progress: ~33%
```

See [ROADMAP.md](ROADMAP.md) for detailed implementation plan.

---

## 📖 Quick Links

| Document | Description |
|----------|-------------|
| **[ROADMAP.md](ROADMAP.md)** | Complete implementation roadmap with phases |
| **[CLAUDE.md](CLAUDE.md)** | Development guide for Claude Code |
| **[docs/README.md](docs/README.md)** | Complete documentation index |
| **[docs/guides/quick-start.md](docs/guides/quick-start.md)** | Get started in 5 minutes |
| **[docs/database/schema.md](docs/database/schema.md)** | Database schema (21 tables) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22.x or higher (recommended: use Bun)
- **Docker** (for local Supabase)
- **Supabase Account** (for cloud deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/juanqui-art/goolstar-next.git
cd goolstar-next

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Database Setup

See [docs/guides/quick-start.md](docs/guides/quick-start.md) for complete database migration instructions.

---

## ✨ Features

### Tournament Management
- ✅ Multi-phase tournaments (groups + knockout)
- ✅ Category-based organization
- ✅ Configurable point systems
- ⏳ Real-time standings updates

### Team & Player Management
- ✅ Team registration with directors
- ✅ Player profiles with documents
- ✅ Document verification workflow
- ⏳ Player statistics tracking

### Match System
- ✅ Match scheduling
- ⏳ Result recording (goals, cards, changes)
- ⏳ Automatic suspension system
- ⏳ Match reports (actas)

### Financial Tracking
- ✅ Registration fees
- ⏳ Payment tracking
- ⏳ Fine management
- ⏳ Team debt calculation

### Admin Features
- ✅ User role management
- ⏳ Document verification queue
- ⏳ Category configuration
- ⏳ System settings

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** with App Router
- **React 19** with Server Components
- **TypeScript 5** (strict mode)
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library

### Backend
- **Supabase** (PostgreSQL + Auth + Storage)
- **Server Actions** for mutations
- **Zod** for validation
- **React Hook Form** for forms

### Database
- **PostgreSQL** with advanced features
- **9 triggers** for automation
- **9 functions** for complex queries
- **139 indexes** for performance
- **Row-Level Security** for authorization

### Code Quality
- **Biome** for linting & formatting
- **TypeScript** strict mode
- **ESLint** rules
- **Git hooks** for pre-commit checks

---

## 📂 Project Structure

```
goolstar-next/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Login/Register
│   ├── (dashboard)/              # Dashboard routes
│   └── api/                      # API routes
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── torneos/                  # Tournament components
│   ├── equipos/                  # Team components
│   ├── jugadores/                # Player components
│   └── partidos/                 # Match components
├── lib/                          # Utilities & business logic
│   ├── supabase/                 # Supabase clients
│   ├── validations/              # Zod schemas
│   ├── utils/                    # Pure utilities
│   └── hooks/                    # Custom React hooks
├── actions/                      # Server Actions
├── supabase/                     # Database migrations
├── types/                        # TypeScript types
└── docs/                         # Documentation
```

See [docs/architecture/current-structure.md](docs/architecture/current-structure.md) for detailed structure.

---

## 🎓 Key Concepts

### Database-First Architecture
GoolStar uses a database-first approach with extensive automation:
- **Triggers** automatically update standings when matches complete
- **Functions** provide complex queries (standings, debt calculation)
- **RLS policies** enforce role-based access control
- **Indexes** optimize hot queries

### Server Components by Default
- Pages and layouts use Server Components
- Client Components only when needed (forms, interactivity)
- Server Actions for mutations
- Optimistic updates for better UX

### Type Safety Everywhere
- Generated TypeScript types from Supabase schema
- Zod schemas for runtime validation
- Strict TypeScript configuration
- No `any` types allowed

---

## 📚 Documentation

Complete documentation is organized in the [docs/](docs/) directory:

### Getting Started
- [Quick Start Guide](docs/guides/quick-start.md) - 5 minute setup
- [Setup Checklist](docs/guides/setup-checklist.md) - Complete setup steps
- [Team Guide](docs/guides/team-guide.md) - For team members

### Architecture
- [Current Structure](docs/architecture/current-structure.md) - Project organization
- [Business Rules](docs/architecture/business-rules.md) - Tournament logic
- [Monolito Decision](docs/architecture/decision-monolito.md) - Architecture choice

### Database
- [Schema](docs/database/schema.md) - Complete database schema
- [Triggers](docs/database/triggers.md) - Automated database operations
- [Functions](docs/database/functions.md) - SQL functions
- [RLS Policies](docs/database/rls-policies.md) - Security policies
- [Migration Guide](docs/database/migration-guide.md) - How to run migrations

### Development
- [Authentication](docs/development/authentication.md) - Auth implementation
- [Conventions](docs/development/conventions.md) - Code standards
- [Testing](docs/development/testing.md) - Testing strategy
- [Deployment](docs/development/deployment.md) - Deploy to production

### Troubleshooting
- [Build Errors](docs/troubleshooting/build-errors.md) - Common build issues
- [Cache Components](docs/troubleshooting/cache-implementation.md) - Caching strategies

---

## 🛠️ Development Commands

```bash
# Development
bun run dev              # Start dev server
bun run build            # Build for production
bun run start            # Start production server

# Code Quality
bun run lint             # Check code with Biome
bun run format           # Format code with Biome
bun run type-check       # Run TypeScript checks

# Database (Supabase CLI)
supabase start           # Start local Supabase
supabase stop            # Stop local Supabase
supabase db push         # Push migrations
supabase gen types typescript --local > types/database.ts
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Read [CLAUDE.md](CLAUDE.md) for development patterns
2. Check [docs/development/conventions.md](docs/development/conventions.md) for code standards
3. Create a feature branch from `main`
4. Make your changes with tests
5. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**GoolStar Development Team**
- Architecture & Database Design
- Frontend Development
- Backend Infrastructure
- Testing & QA

---

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

## 📞 Support

For questions or issues:
- Check [docs/](docs/) directory
- Review [ROADMAP.md](ROADMAP.md) for implementation status
- See [docs/troubleshooting/](docs/troubleshooting/) for common issues
- Consult [CLAUDE.md](CLAUDE.md) for development guidance

---

**Last Updated:** 2025-11-22
**Version:** 1.0.0-beta
**Status:** Active Development (Phase 2/7)
