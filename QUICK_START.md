# GoolStar Quick Start (5 Minutes)

Get the GoolStar MVP up and running locally in 5 minutes.

## Prerequisites

- **Node.js/Bun**: `bun --version` (v1.0+)
- **Docker**: `docker --version` (for Supabase local database)
- **Supabase CLI**: `supabase --version` (install via `npm install -g supabase`)

## Step 1: Clone & Install (1 min)

```bash
cd goolstar_next
bun install
```

## Step 2: Start Supabase Local (2 min)

```bash
# Start local Supabase (requires Docker)
supabase start

# Output will show URLs like:
# API URL: http://localhost:54321
# Anon Key: eyJ0eXAiOiJKV1QiLCJhbGc...
```

**Keep the terminal open or note the URLs.**

## Step 3: Configure Environment (1 min)

```bash
# Copy example to local
cp .env.example .env.local

# Edit .env.local and replace with values from: supabase status
# Example:
# NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGc...
```

## Step 4: Generate Database Types (1 min)

```bash
# Generate TypeScript types from database schema
supabase gen types typescript --local > types/database.ts
```

## Step 5: Start Dev Server (1 min)

```bash
bun run dev

# Dev server running at:
# ➜  http://localhost:3000
```

**Open http://localhost:3000 in browser**

---

## ✅ First Time in App

1. **Register**: Click "Sign Up"
   - Email: `test@example.com`
   - Password: `Test1234!`
   - Confirm password

2. **Login**: Use same credentials

3. **Dashboard**: You're in! 🎉

---

## 🔧 Common Commands

```bash
# Development
bun run dev           # Start dev server

# Code Quality
bun run lint          # Check code with Biome
bun run format        # Format code

# Database
supabase status       # Check running services
supabase stop         # Stop Supabase local
supabase db push      # Sync migrations with local DB
```

---

## 🗂️ Project Structure

```
goolstar_next/
├── app/              # Next.js pages & layout
├── components/       # React components
├── lib/              # Utilities, validations, database
├── actions/          # Server Actions
├── supabase/         # Database migrations
├── ROADMAP.md        # Implementation phases (READ THIS)
├── CLAUDE.md         # Development guidelines
└── .env.local        # ← Your local config (CREATE THIS)
```

---

## 📚 Next Steps

1. **Read the roadmap:** Open [ROADMAP.md](ROADMAP.md)
2. **Understand structure:** See [docs/architecture/current-structure.md](docs/architecture/current-structure.md)
3. **Development tips:** Check [CLAUDE.md](CLAUDE.md)
4. **Start coding:** Follow Phase 0 in ROADMAP.md

---

## 🐛 Troubleshooting

### "Port 3000 already in use"
```bash
# Kill existing process
pkill -f "node.*dev" || pkill -f "next dev"

# Or use different port
PORT=3001 bun run dev
```

### "Supabase connection failed"
```bash
# Check if Supabase is running
supabase status

# Restart if needed
supabase stop
supabase start
```

### "Types file not found"
```bash
# Regenerate types
supabase gen types typescript --local > types/database.ts
```

### "Environment variables not loading"
```bash
# Verify .env.local exists in project root
ls -la .env.local

# Check format (no quotes):
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
```

---

## 📞 Help

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Full Guide**: See [CLAUDE.md](CLAUDE.md)

---

**Time to hello world:** ~5 minutes ✨
