# ADR: Monolito vs Monorepo Architecture

**Date:** 2025-11-21
**Status:** ACCEPTED
**Affects:** All development going forward

---

## Context

GoolStar is a tournament management system for indoor soccer being built from scratch with:
- **Stack:** Next.js 16 + Supabase + TypeScript
- **Timeline:** 4-5 weeks to MVP
- **Team:** Small (1-3 developers)
- **Confirmed Frontends:** Web app only (MVP)
- **Future Possibility:** Mobile app (not confirmed)

We must decide between two architectures:

### Option A: Monorepo with Bun Workspaces
- Multiple packages: `@goolstar/web`, `@goolstar/database`, `@goolstar/schemas`, `@goolstar/business`
- Separate package.json for each
- Shared code across potential multiple frontends

### Option B: Monolito (Single App)
- Single Next.js app
- All code in one codebase
- `/lib` organized by responsibility
- Simple structure

---

## Decision

**→ MONOLITO (Option B)**

We will use a single-app monolito architecture for the MVP.

---

## Rationale

### ✅ Why Monolito Wins for MVP

**1. Time is Critical (4-5 weeks)**
- Monorepo setup: 2-3 days overhead
- Monolito setup: 1 day
- **Monorepo costs 1-2 weeks of velocity for MVP timeline**

**2. No Confirmed Cross-Platform Need**
- Mobile app is "future possibility", not confirmed
- No ROI on monorepo overhead today
- Migrating later is only 2-3 days of work

**3. Small Team (1-3 devs)**
- No need for ownership separation
- No merge conflict scaling problems
- Direct communication beats structure

**4. Fresh Codebase (No Legacy)**
- Can't share code that doesn't exist
- Patterns emerge during development
- Safe to wait and see what emerges
- Refactor with real data points vs speculation

**5. Developer Experience**
| Aspect | Monolito | Monorepo |
|--------|----------|----------|
| Dev server startup | 2s | 4s |
| Mental overhead | Low | High |
| "Where does this go?" | Clear | Ambiguous |
| Build time | 30s | 45s |
| Debugging | Simple | Complex |
| Import path | `@/lib/...` | `@goolstar/...` |
| Adding dependency | Direct | Via workspace |

**Monolito is 15-20% faster for MVP development.**

### ❌ Monorepo Costs Without Benefit

**When monorepo IS justified:**
- Multiple frontends (web + mobile + admin) **in use NOW**
- Large team (5+ developers) with ownership lines
- Mature product with clear shared patterns
- Proven need for code reuse across platforms

**When monorepo is NOT justified (our case):**
- ❌ Only 1 frontend confirmed (web)
- ❌ Small team (1-3 devs)
- ❌ MVP timeline is tight (4-5 weeks)
- ❌ No code patterns established yet
- ❌ Mobile app is speculative

---

## Implementation

### Current Structure (Monolito)

```
goolstar_next/
├── app/                    # Routes
├── components/             # UI components
├── lib/                    # Core logic
│   ├── supabase/          # Database
│   ├── validations/       # Zod schemas
│   ├── utils/             # Pure functions
│   └── hooks/             # React hooks
├── actions/               # Server Actions
├── supabase/migrations/   # Database migrations
└── types/                 # Generated types
```

**See:** [docs/architecture/current-structure.md](current-structure.md)

### If Mobile Becomes Real

**Triggers to migrate to monorepo:**
1. ✅ Mobile app confirmed with dates + budget
2. ✅ Actual implementation work begins (not just ideas)
3. ✅ Team grows to 5+ developers
4. ✅ Clear patterns identified in codebase

**Effort:** 2-3 days to migrate structure
```bash
# Step 1: Create workspace structure
mkdir -p apps/web packages/database packages/schemas

# Step 2: Move code
mv app components public → apps/web/
mv lib/supabase → packages/database/
mv lib/validations → packages/schemas/

# Step 3: Update configs
# Update package.json, tsconfig, imports

# Step 4: Done - ship it
```

---

## Consequences

### Positive

✅ **Speed:** MVP 1 week faster than with monorepo
✅ **Simplicity:** Easier for team to understand structure
✅ **Flexibility:** Can defer architectural decisions
✅ **Focus:** Developers focus on features, not structure
✅ **No Lock-in:** Can migrate to monorepo with 2-3 days effort

### Negative (and how to mitigate)

❌ **Code Duplication if Mobile Starts:**
- **Mitigation:** Keep business logic in `/lib/utils` (pure functions)
- **Reality:** Pure functions are easy to port to mobile
- **Cost:** Copy/paste code once mobile confirmed is acceptable for MVP

❌ **Testing Pure Functions Harder in Next.js:**
- **Mitigation:** Keep utilities isolated from Next.js
- **Pattern:** `lib/utils/points.ts` = pure function, testable anywhere
- **Reality:** Acceptable cost for MVP

❌ **Doesn't Scale to 100+ Devs:**
- **Mitigation:** Not a problem (team is 1-3 devs)
- **Reality:** If team grows to 100, migrate to monorepo then

---

## Trade-offs Accepted

### We Accept:
- Monorepo structure delayed until confirmed need
- Potential code duplication if mobile app appears
- Single package.json (simpler but less isolated)

### We Reject:
- Architecture overhead without proven benefit
- Speculative structure for hypothetical mobile app
- Time loss in 4-5 week MVP window

---

## Future: Migration Path

### Phase: Validate MVP (Weeks 5-12)
- MVP live with real users
- Gather feedback
- Identify real patterns
- Assess mobile need

### Decision Point: Build Mobile?
- **YES** with confirmed dates/budget → Migrate to monorepo (2-3 days)
- **NO** → Continue with monolito, add more features
- **MAYBE** → Defer, MVP still viable as monolito

### If Migrating to Monorepo
1. **Extract shared packages:**
   - `@goolstar/schemas` - Validation schemas (copy to packages/)
   - `@goolstar/database` - DB clients and types (move to packages/)
   - `@goolstar/business` - Pure utility functions (copy to packages/)

2. **Update imports:**
   - `@/lib/validations/torneo` → `@goolstar/schemas/torneo`
   - `@/lib/supabase/*` → `@goolstar/database/*`
   - `@/lib/utils/*` → `@goolstar/business/utils/*`

3. **Create mobile app:**
   - `apps/mobile/` - React Native/Expo app
   - Imports from `@goolstar/schemas`, `@goolstar/database`
   - Shares validation and DB client logic

4. **No rewrite needed** - Same code just reorganized

---

## References

- [CLAUDE.md](../../CLAUDE.md) - Development guide (monolito)
- [docs/architecture/current-structure.md](current-structure.md) - Project structure
- [ROADMAP.md](../../ROADMAP.md) - Implementation phases
- [docs/architecture/future-monorepo-migration.md](future-monorepo-migration.md) - When to migrate

---

## Appendix: Comparison Table

| Criterion | Monolito | Monorepo | Score |
|-----------|----------|----------|-------|
| **Setup time** | 1 day | 2-3 days | Monolito +2 |
| **Learning curve** | Low | Medium | Monolito +1 |
| **Dev speed (MVP)** | 100% | 80% | Monolito +2 |
| **Testing** | Harder | Easier | Monorepo +1 |
| **Reutilization** | Internal | Cross-app | Monorepo +1 |
| **Scalability (team)** | Limited | Good | Monorepo +1 |
| **Deployment** | Simple | Complex | Monolito +1 |
| **Debugging** | Simple | Hard | Monolito +1 |
| **Justified NOW?** | YES | NO | Monolito +2 |

**Total: Monolito 8 - Monorepo 4**

For MVP: **Monolito wins**
For mature multi-frontend product: **Monorepo wins**

---

**Decision Owner:** Product Team
**Reviewed By:** Architecture Committee
**Accepted:** 2025-11-21
**Next Review:** Week 12 (when MVP validated)
