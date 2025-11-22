# Quick Start - Execute Database Migrations

**Goal**: Get the database live in 5-10 minutes
**Difficulty**: Easy
**Requirements**: Browser access to Supabase Cloud

---

## The Process (5 Steps)

### 1️⃣ Open Supabase Dashboard

- URL: https://app.supabase.com
- Project: `goolstar-next`
- (You should already be logged in)

### 2️⃣ Navigate to SQL Editor

- Left sidebar → **SQL Editor**
- You should see a blank SQL editor

### 3️⃣ Execute Migrations in Order

For each migration file **001 through 010** (in strict order):

#### For Migration 001:
```
File: supabase/migrations/20250122000001_initial_extensions.sql

1. Open the file in your project
2. Copy ALL SQL content
3. Paste into SQL Editor
4. Click "Run" (blue button, top right)
5. Wait for: "Success" message
6. ✅ Done with 001
```

#### For Migration 002:
```
Repeat same steps with: supabase/migrations/20250122000002_categorias_torneos.sql
```

#### Repeat for 003-010

Each migration takes about 1 minute.

**Total time**: ~10 minutes for all 10

---

## Visual Guide

```
┌─────────────────────────────────────────────────────────┐
│ Supabase Dashboard                                      │
│ https://app.supabase.com                                │
│                                                         │
│ Left Sidebar:                                           │
│ ✓ Home                                                  │
│ ✓ SQL Editor  ← CLICK HERE                              │
│ • Database                                              │
│ • Auth                                                  │
│ • Storage                                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ SQL Editor                                              │
│                                                         │
│ ┌───────────────────────────────────────────────────┐   │
│ │ Paste migration SQL here                          │   │
│ │                                                   │   │
│ │ CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      │   │
│ │ CREATE EXTENSION IF NOT EXISTS "pgcrypto";        │   │
│ │ CREATE TYPE nivel_enum AS ENUM ('1',...);        │   │
│ │ ...                                               │   │
│ │                                                   │   │
│ └───────────────────────────────────────────────────┘   │
│                                                         │
│ [Run] ← Click here after pasting                        │
│                                                         │
│ Status: "Success" ← Should say this                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## After Migrations Complete

### ✅ Step 2: Enable Email Auth (3 minutes)

In Supabase Dashboard:
1. **Authentication** (left sidebar)
2. **Providers** (tab)
3. Find "Email"
4. Click toggle to enable
5. Set Redirect URL: `http://localhost:3000/auth/callback`
6. Save

### ✅ Step 3: Test Locally (5 minutes)

```bash
cd /Users/juanquizhpi/Desktop/projects/goolstar_next
bun run dev
```

Open: http://localhost:3000/register

Test registration:
- Email: test@example.com
- Password: TestPassword123
- Click "Create Account"

Expected: Success or confirmation email sent

---

## Migration File List

```
001: 20250122000001_initial_extensions.sql
002: 20250122000002_categorias_torneos.sql
003: 20250122000003_equipos_jugadores.sql
004: 20250122000004_partidos_competicion.sql
005: 20250122000005_estadisticas.sql
006: 20250122000006_sistema_financiero.sql
007: 20250122000007_triggers.sql
008: 20250122000008_functions.sql
009: 20250122000009_rls_policies.sql
010: 20250122000010_indexes.sql
```

All in: `/supabase/migrations/`

---

## Guides

| Guide | Purpose |
|---|---|
| `QUICK_START.md` | This file - get started in 5 min |
| `MIGRATION_QUICK_REFERENCE.md` | What each migration does |
| `MIGRATION_EXECUTION_GUIDE.md` | Detailed step-by-step |
| `SETUP_CHECKLIST.md` | Track progress |
| `INFRASTRUCTURE_OVERVIEW.md` | Full architecture |

---

**Status**: Ready to deploy! Execute these 10 migrations and the database is live.

**Time**: 5-10 minutes

**Next**: Deploy migrations → Enable email auth → Test locally → Phase 2 development

You've got this! 🚀
