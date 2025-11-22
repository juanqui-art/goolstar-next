# Deployment Guide

**Status:** Planned for Phase 7
**Last Updated:** 2025-11-22
**Platform:** Vercel (Frontend) + Supabase Cloud (Backend)

---

## Overview

GoolStar uses a modern serverless deployment architecture:
- **Frontend:** Vercel (Next.js hosting)
- **Database:** Supabase Cloud (PostgreSQL + Auth + Storage)
- **Domain:** Custom domain via Vercel
- **CI/CD:** GitHub Actions + Vercel auto-deploy

This guide covers the complete deployment process from development to production.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Production                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                │
│  │              │         │              │                │
│  │   Vercel     │◄────────│  GitHub      │                │
│  │   (Next.js)  │  Deploy │  (main)      │                │
│  │              │         │              │                │
│  └──────┬───────┘         └──────────────┘                │
│         │                                                   │
│         │ API Calls                                        │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────┐                │
│  │                                       │                │
│  │       Supabase Cloud                  │                │
│  │  ┌────────────────────────────────┐  │                │
│  │  │  PostgreSQL Database           │  │                │
│  │  │  - 21 tables                   │  │                │
│  │  │  - 9 triggers                  │  │                │
│  │  │  - 9 functions                 │  │                │
│  │  │  - RLS policies                │  │                │
│  │  └────────────────────────────────┘  │                │
│  │  ┌────────────────────────────────┐  │                │
│  │  │  Supabase Auth                 │  │                │
│  │  └────────────────────────────────┘  │                │
│  │  ┌────────────────────────────────┐  │                │
│  │  │  Supabase Storage              │  │                │
│  │  │  (Player Documents)            │  │                │
│  │  └────────────────────────────────┘  │                │
│  │                                       │                │
│  └───────────────────────────────────────┘                │
│                                                              │
└─────────────────────────────────────────────────────────────┘

                Users access via:
         https://goolstar.com (custom domain)
```

---

## Phase 1: Supabase Cloud Setup

### 1.1 Create Supabase Project

1. **Go to [Supabase Dashboard](https://app.supabase.com/)**
2. Click "New Project"
3. **Configure project:**
   - Organization: Create or select
   - Name: `goolstar-production`
   - Database Password: Generate strong password (save securely!)
   - Region: `South America (São Paulo)` or closest to Ecuador
   - Pricing Plan: Free tier (for MVP) or Pro (for production)

4. **Wait for project to provision** (~2 minutes)

5. **Save project credentials:**
   ```bash
   Project URL: https://[project-id].supabase.co
   Anon Key: eyJhbGc...
   Service Role Key: eyJhbGc... (keep secret!)
   Database Password: [saved during creation]
   ```

---

### 1.2 Configure Supabase CLI

**Link local project to production:**

```bash
# Login to Supabase
supabase login

# Link to production project
supabase link --project-ref [project-id]

# Enter database password when prompted
```

**Verify connection:**

```bash
supabase projects list
# Should show your production project
```

---

### 1.3 Run Database Migrations

**Push all migrations to production:**

```bash
# Push all migrations in order
supabase db push --linked

# Verify migrations
supabase migration list --linked
```

**Expected output:**
```
✓ 001_initial_extensions.sql - Applied
✓ 002_categorias_torneos.sql - Applied
✓ 003_equipos_jugadores.sql - Applied
✓ 004_partidos_competicion.sql - Applied
✓ 005_estadisticas.sql - Applied
✓ 006_sistema_financiero.sql - Applied
✓ 007_triggers.sql - Applied
✓ 008_functions.sql - Applied
✓ 009_rls_policies.sql - Applied
✓ 010_indexes.sql - Applied
```

---

### 1.4 Generate Production Types

**Generate TypeScript types from production database:**

```bash
supabase gen types typescript --linked > types/database.ts
```

**Commit updated types:**

```bash
git add types/database.ts
git commit -m "chore: update database types for production"
git push
```

---

### 1.5 Configure Supabase Auth

**Enable Email Auth:**

1. Go to **Authentication > Providers**
2. Enable **Email** provider
3. Disable email confirmation (for MVP) or configure SMTP:
   - **For MVP:** Turn off "Confirm email"
   - **For Production:** Configure custom SMTP (Gmail, SendGrid, etc.)

**Configure Auth settings:**

1. Go to **Authentication > Settings**
2. **Site URL:** `https://goolstar.com` (your production domain)
3. **Redirect URLs:**
   - Add: `https://goolstar.com/auth/callback`
   - Add: `https://goolstar.com/**` (wildcard for all routes)

**Configure JWT expiry:**
- Access token expiry: `3600` (1 hour)
- Refresh token expiry: `604800` (7 days)

---

### 1.6 Configure Storage (Optional)

**Create Storage Bucket for Player Documents:**

1. Go to **Storage**
2. Create new bucket: `player-documents`
3. **Bucket Settings:**
   - Public: `false` (private)
   - File size limit: `5MB`
   - Allowed MIME types: `image/*, application/pdf`

**Add RLS Policies:**

```sql
-- Allow authenticated users to read own team's documents
CREATE POLICY "Users can read own team documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'player-documents'
  AND auth.role() = 'authenticated'
);

-- Allow directors to upload documents for own team
CREATE POLICY "Directors can upload team documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'player-documents'
  AND auth.role() = 'authenticated'
);
```

---

### 1.7 Seed Initial Data (Optional)

**Create admin user:**

```bash
# Via Supabase SQL Editor
INSERT INTO auth.users (
  email,
  encrypted_password,
  raw_user_meta_data
) VALUES (
  'admin@goolstar.com',
  crypt('your-admin-password', gen_salt('bf')),
  '{"role": "admin"}'::jsonb
);
```

**Or via Supabase Dashboard:**
1. Go to **Authentication > Users**
2. Click "Invite User"
3. Enter: `admin@goolstar.com`
4. After user is created, edit metadata:
   ```json
   {
     "role": "admin"
   }
   ```

**Create sample category:**

```sql
INSERT INTO categorias (nombre, precio_inscripcion, limite_amarillas)
VALUES ('Open', 150000, 3);
```

---

## Phase 2: Vercel Deployment

### 2.1 Create Vercel Project

1. **Go to [Vercel Dashboard](https://vercel.com/)**
2. Click "Add New Project"
3. **Import Git Repository:**
   - Connect GitHub account
   - Select `goolstar-next` repository
   - Click "Import"

4. **Configure Project:**
   - Framework Preset: `Next.js`
   - Root Directory: `./` (leave default)
   - Build Command: `bun run build` (or leave default)
   - Output Directory: `.next` (default)

---

### 2.2 Configure Environment Variables

**Add production environment variables:**

1. In Vercel project settings, go to **Settings > Environment Variables**

2. **Add the following variables:**

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[project-id].supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` (from Supabase) | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` (service key) | Production |
| `NEXT_PUBLIC_APP_URL` | `https://goolstar.com` | Production |
| `NODE_ENV` | `production` | Production |

**Important:**
- ✅ Use `NEXT_PUBLIC_` prefix for client-side variables
- ❌ NEVER expose `SUPABASE_SERVICE_ROLE_KEY` to client
- 🔒 Service role key bypasses RLS - use only in Server Actions

---

### 2.3 Deploy to Production

**Trigger deployment:**

```bash
# Option 1: Push to main branch (auto-deploy)
git push origin main

# Option 2: Manual deploy via Vercel CLI
bunx vercel --prod
```

**Vercel will:**
1. Clone repository
2. Install dependencies (`bun install`)
3. Run build (`bun run build`)
4. Deploy to production
5. Assign production URL

**Monitor deployment:**
- Go to Vercel Dashboard > Deployments
- Watch build logs in real-time
- Check for errors

---

### 2.4 Configure Custom Domain

**Add custom domain:**

1. Go to **Settings > Domains**
2. Add domain: `goolstar.com`
3. Vercel will provide DNS records:

**Add to your DNS provider:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Wait for DNS propagation (~5-30 minutes)
5. Vercel will auto-generate SSL certificate (Let's Encrypt)

**Verify:**
- Visit `https://goolstar.com`
- Check SSL certificate is valid
- Test redirect from `http://` to `https://`

---

## Phase 3: CI/CD Setup

### 3.1 GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test:coverage

  build:
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  deploy:
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Add GitHub Secrets:**

1. Go to GitHub repo > **Settings > Secrets and variables > Actions**
2. Add secrets:
   - `VERCEL_TOKEN` (from Vercel account settings)
   - `VERCEL_ORG_ID` (from Vercel project settings)
   - `VERCEL_PROJECT_ID` (from Vercel project settings)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 3.2 Vercel Auto-Deploy

**Vercel automatically deploys:**
- ✅ Every push to `main` → Production
- ✅ Every pull request → Preview deployment
- ✅ Unique URL for each preview

**Preview deployments:**
```
PR #123 → https://goolstar-next-git-feature-branch-username.vercel.app
```

**Configure in Vercel:**
1. Go to **Settings > Git**
2. **Production Branch:** `main`
3. **Preview Deployments:** Enabled for all branches
4. **Deploy Hooks:** Optional webhook for manual triggers

---

## Phase 4: Database Migrations

### 4.1 Migration Workflow

**For schema changes:**

1. **Create migration locally:**
   ```bash
   supabase migration new add_new_column
   ```

2. **Write SQL:**
   ```sql
   -- supabase/migrations/20250123000011_add_new_column.sql
   ALTER TABLE equipos ADD COLUMN logo_url TEXT;
   ```

3. **Test locally:**
   ```bash
   supabase db reset
   supabase db push
   ```

4. **Commit and push:**
   ```bash
   git add supabase/migrations/
   git commit -m "feat: add logo_url column to equipos"
   git push
   ```

5. **Apply to production:**
   ```bash
   supabase db push --linked
   ```

---

### 4.2 Zero-Downtime Migrations

**Best practices:**

1. **Add columns as nullable first:**
   ```sql
   -- Good: No downtime
   ALTER TABLE equipos ADD COLUMN logo_url TEXT;

   -- Bad: Requires default, locks table
   ALTER TABLE equipos ADD COLUMN logo_url TEXT NOT NULL DEFAULT '';
   ```

2. **Create indexes concurrently:**
   ```sql
   -- Good: No table lock
   CREATE INDEX CONCURRENTLY idx_equipos_logo ON equipos(logo_url);

   -- Bad: Locks table during creation
   CREATE INDEX idx_equipos_logo ON equipos(logo_url);
   ```

3. **Use transactions for data migrations:**
   ```sql
   BEGIN;
   -- Multiple updates
   UPDATE equipos SET logo_url = 'default.png' WHERE logo_url IS NULL;
   COMMIT;
   ```

---

## Phase 5: Monitoring & Analytics

### 5.1 Vercel Analytics

**Enable Vercel Analytics:**

1. Go to Vercel project > **Analytics** tab
2. Click "Enable Analytics"
3. Add to `app/layout.tsx`:

```typescript
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Metrics tracked:**
- Page views
- Unique visitors
- Top pages
- Top referrers
- Devices & browsers
- Geography

---

### 5.2 Error Tracking (Optional)

**Option 1: Sentry**

```bash
bunx @sentry/wizard -i nextjs
```

**Option 2: LogRocket**

```typescript
import LogRocket from "logrocket"

if (process.env.NODE_ENV === "production") {
  LogRocket.init("your-app-id")
}
```

---

### 5.3 Performance Monitoring

**Vercel Speed Insights:**

```bash
bun add @vercel/speed-insights
```

```typescript
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

## Phase 6: Security Checklist

### 6.1 Pre-Deployment Security

**✅ Environment Variables**
- [ ] All secrets use environment variables (no hardcoded values)
- [ ] `.env.local` is in `.gitignore`
- [ ] Service role key is NEVER exposed to client
- [ ] Production keys are different from development keys

**✅ Authentication**
- [ ] RLS policies enabled on all sensitive tables
- [ ] Admin role properly restricted
- [ ] Password requirements enforced (min 8 chars)
- [ ] Email confirmation configured (or disabled intentionally)

**✅ Database**
- [ ] All migrations applied successfully
- [ ] Triggers functioning correctly
- [ ] Indexes created for performance
- [ ] No SQL injection vulnerabilities

**✅ Code**
- [ ] No `console.log()` in production code
- [ ] Error messages don't expose sensitive info
- [ ] CORS configured properly
- [ ] Rate limiting considered (Supabase auto-limits)

---

### 6.2 Post-Deployment Security

**✅ SSL/TLS**
- [ ] HTTPS enforced (Vercel auto-redirects)
- [ ] SSL certificate valid
- [ ] No mixed content warnings

**✅ Headers**
- [ ] CSP (Content Security Policy) configured
- [ ] X-Frame-Options set
- [ ] X-Content-Type-Options set

Add to `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ]
  },
}
```

---

## Phase 7: Deployment Checklist

### 7.1 Pre-Deployment

**Database:**
- [ ] Supabase Cloud project created
- [ ] All 10 migrations applied
- [ ] Database types generated
- [ ] RLS policies verified
- [ ] Admin user created
- [ ] Sample data seeded (optional)

**Code:**
- [ ] All tests passing (`bun test`)
- [ ] No TypeScript errors (`bun run type-check`)
- [ ] No linting errors (`bun run lint`)
- [ ] Build succeeds locally (`bun run build`)

**Configuration:**
- [ ] Environment variables set in Vercel
- [ ] Supabase auth configured
- [ ] Custom domain DNS records added
- [ ] GitHub Actions secrets configured

---

### 7.2 Deployment

**Execute:**
- [ ] Push to main branch
- [ ] Monitor Vercel deployment
- [ ] Check build logs for errors
- [ ] Verify deployment URL

**Verify:**
- [ ] Site loads at production URL
- [ ] Authentication works (login/register)
- [ ] Database queries succeed
- [ ] Images and assets load
- [ ] Forms submit successfully

---

### 7.3 Post-Deployment

**Smoke Tests:**
- [ ] Create a test torneo
- [ ] Create a test equipo
- [ ] Create a test jugador
- [ ] Create a test partido
- [ ] Verify standings update

**Performance:**
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] No console errors
- [ ] Page load time < 3s

**Monitoring:**
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured
- [ ] Performance monitoring enabled

---

## Phase 8: Rollback Procedure

### 8.1 Application Rollback

**Via Vercel Dashboard:**

1. Go to **Deployments**
2. Find last working deployment
3. Click "⋯" menu → "Promote to Production"
4. Confirm rollback

**Via Vercel CLI:**

```bash
# List recent deployments
vercel ls

# Promote specific deployment to production
vercel promote [deployment-url]
```

---

### 8.2 Database Rollback

**Rollback migration:**

```bash
# Create rollback migration
supabase migration new rollback_add_new_column

# Write reverse SQL
# File: supabase/migrations/20250123000012_rollback_add_new_column.sql
ALTER TABLE equipos DROP COLUMN logo_url;

# Apply to production
supabase db push --linked
```

**Important:**
- ⚠️ Database rollbacks can cause data loss
- ✅ Always backup before major migrations
- ✅ Test rollback procedure in staging first

---

## Phase 9: Maintenance

### 9.1 Regular Tasks

**Weekly:**
- [ ] Check error logs in Vercel
- [ ] Review performance metrics
- [ ] Monitor database size (Supabase dashboard)

**Monthly:**
- [ ] Update dependencies (`bun update`)
- [ ] Review and rotate API keys if needed
- [ ] Check Supabase usage (approaching limits?)

**Quarterly:**
- [ ] Review and optimize database queries
- [ ] Clean up unused data
- [ ] Update documentation

---

### 9.2 Scaling Considerations

**When to upgrade Supabase plan:**
- Database size > 500MB (Free tier limit)
- API requests > 2GB/month
- Need for more than 2 concurrent connections

**When to upgrade Vercel plan:**
- Serverless function execution > 100GB-Hrs
- Bandwidth > 100GB
- Need for team collaboration features

---

## Troubleshooting

### Common Issues

**1. Build fails on Vercel**
```
Error: Cannot find module '@/lib/supabase/client'
```

**Solution:** Check `tsconfig.json` has correct path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

**2. Authentication not working**
```
Error: Invalid JWT
```

**Solution:** Verify environment variables in Vercel match Supabase project:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

**3. Database connection fails**
```
Error: Could not connect to database
```

**Solution:** Check Supabase project status:
1. Go to Supabase Dashboard
2. Check project is not paused
3. Verify firewall allows connections from Vercel IPs

---

**4. Slow page loads**
```
TTFB > 5 seconds
```

**Solution:**
- Check database query performance
- Add indexes to frequently queried columns
- Use `revalidate` in Server Components
- Enable Vercel Edge Network

---

## Resources

### Official Documentation
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Tools
- [Vercel CLI](https://vercel.com/cli)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [GitHub Actions](https://github.com/features/actions)

### Related Documentation
- [ROADMAP.md](../../ROADMAP.md) - Phase 7 deployment deliverables
- [testing.md](./testing.md) - Testing before deployment
- [CLAUDE.md](../../CLAUDE.md) - Development workflow

---

**Status:** Planned for Phase 7
**Platform:** Vercel + Supabase Cloud
**Estimated Deployment Time:** 1-2 hours
**Last Updated:** 2025-11-22
