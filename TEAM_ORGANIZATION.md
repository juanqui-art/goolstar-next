# Team Organization Guide - Phase 0 Implementation

**Project:** GoolStar MVP
**Phase:** 0 - Setup Base (Days 1-3)
**Team Structure:** 1 Senior + 3-4 Juniors
**Timeline:** 3 business days (parallel work)
**Goal:** Fully functional auth + ready for Phase 1

---

## 👥 Team Roles & Responsibilities

### Senior Developer (You)
**Role:** Lead Architect & Infrastructure Lead
**Responsibility:** Critical path items, code review, unblocking

**Your Tasks:**
- S1-S10: Setup Supabase, auth, clients, middleware
- Code review on all junior PRs
- Daily supervision & guidance
- Final integration & testing

**Success Metric:** Infrastructure 100% working by Day 3 EOD

**Time Allocation:**
- Day 1: 6-7 hours (Supabase setup)
- Day 2: 5-6 hours (Integration)
- Day 3: 3-4 hours (Review + integration)
- **Total:** ~15 hours senior work

---

### Junior #1: Frontend Infrastructure
**Name:** [Assign]
**Tasks:** UI Components & Layout

**Deliverables:**
- shadcn/ui components installed
- Navbar, Sidebar, Footer, Dashboard Layout
- 5 PRs ready to merge

**Time:** 8-12 hours (Days 1-2)
**Blocks:** All other juniors (they need layout)
**Success:** All components responsive & styled

---

### Junior #2: Authentication Pages
**Name:** [Assign]
**Tasks:** Login & Register Pages

**Deliverables:**
- Login form component
- Register form component
- Login page (/login)
- Register page (/register)
- 3 PRs ready to merge

**Time:** 8-12 hours (Days 1-2)
**Blocked by:** Junior #1 (needs layout)
**Integration:** Connects to Senior's auth actions (Day 3)

---

### Junior #3: Data Layer
**Name:** [Assign]
**Tasks:** Zod Schemas & Validations

**Deliverables:**
- Auth schemas
- Torneo, Equipo, Jugador, Partido schemas
- Component folder structure
- 6 PRs ready to merge

**Time:** 6-10 hours (Days 1-2)
**No dependencies:** Can start immediately
**Success:** All schemas with proper validation

---

### Junior #4 (Optional): Testing
**Name:** [Assign - if available]
**Tasks:** Testing infrastructure

**Deliverables:**
- Vitest configured
- Sample tests passing
- 1 PR ready to merge

**Time:** 4-6 hours (Days 2-3)
**Priority:** LOW (can skip or do in Phase 1)

---

## 📋 Task Distribution Matrix

```
            Day 1          Day 2          Day 3
Senior    [S1-S6: 6h]   [S7-S10: 5h]   [Review: 3h]
└─────────────────────────────────────────────────
J1        [T1-T5: 10h]  [Continue]     [Finalize]
J2        [T1-T4: wait] [T1-T4: 12h]   [Integrate]
J3        [T1-T6: 8h]   [Finalize]     [Ready]
J4        [Optional]    [T1: 4h]       [Finalize]
```

**Key:** Parallel work = 3x faster than sequential!

---

## 🗓️ Timeline & Checkpoints

### Day 1: Foundation

**Morning (Senior):**
- [ ] S1: Supabase project created (0.5h)
- [ ] S2: .env.local created (0.1h)
- [ ] Daily standup with juniors (0.2h)

**Afternoon (Senior):**
- [ ] S3: Migrations created (2-3h)
- [ ] S4: Execute migrations (0.5h)
- [ ] S5: Generate types (0.2h)

**Meanwhile, Juniors:**
- **J1:** Start T1.1 (shadcn install) + T1.2-T1.5 (components)
- **J2:** Blocked on J1's layout → Start reading docs, plan implementation
- **J3:** T3.1-T3.6 (Create all schemas)
- **J4:** Setup Vitest

**EOD Day 1 Checkpoint:**
- ✅ Supabase fully configured
- ✅ Types generated (`types/database.ts`)
- ✅ J1: 50% components created
- ✅ J3: Schemas complete
- ⏳ J2: Ready to start (waiting for J1)

---

### Day 2: Integration

**Morning (Senior):**
- [ ] Daily standup (0.2h)
- [ ] S7: Create Supabase clients (1h)
- [ ] Code review on J1/J3 PRs (0.5h)

**Afternoon (Senior):**
- [ ] S8: Auth middleware (1.5h)
- [ ] S9: Auth Server Actions (2h)
- [ ] More code reviews (0.5h)

**Meanwhile, Juniors:**
- **J1:** Finish T1.4-T1.5, create PRs
- **J2:** T2.1-T2.3 (Auth pages) using Senior's schemas
- **J3:** Create component folder structure, finalize
- **J4:** Configure tests

**EOD Day 2 Checkpoint:**
- ✅ Supabase clients created
- ✅ Auth middleware working
- ✅ Auth actions ready
- ✅ J1: All components done, PRs submitted
- ✅ J2: Auth pages done, PRs submitted
- ✅ J3: Schemas + structure done, PRs submitted
- ✅ J4: Testing setup done

---

### Day 3: Final Integration & Testing

**Morning (Senior):**
- [ ] Daily standup (0.2h)
- [ ] Final code reviews (1h)
- [ ] Merge all junior PRs (0.5h)
- [ ] S10: Test everything (1h)

**Afternoon (Senior + Juniors):**
- [ ] Integration testing (all PRs merged)
- [ ] Connect auth forms to Server Actions
- [ ] Fix any issues
- [ ] Final check: Can register/login/logout?

**EOD Day 3: Phase 0 Complete** ✅
- ✅ Users can register
- ✅ Users can login
- ✅ Dashboard accessible
- ✅ All code merged
- ✅ No console errors
- ✅ Responsive design
- ✅ Ready for Phase 1

---

## 📚 Documentation for Team

### For Senior: Read These First
1. **[SENIOR_SETUP.md](SENIOR_SETUP.md)** - Detailed step-by-step guide
2. **[docs/database/schema.md](docs/database/schema.md)** - Database schema reference
3. **[CLAUDE.md](CLAUDE.md)** - Code patterns

### For Juniors: Read These First
1. **[QUICK_START.md](QUICK_START.md)** - 5-minute setup
2. **[JUNIOR_TASKS.md](JUNIOR_TASKS.md)** - Your specific task cards
3. **[CLAUDE.md](CLAUDE.md)** - Development patterns
4. **[docs/development/conventions.md](docs/development/conventions.md)** - Code standards

### For Everyone
- **[ROADMAP.md](ROADMAP.md)** - Phases overview
- **[docs/architecture/current-structure.md](docs/architecture/current-structure.md)** - Project structure

---

## 🚀 How to Start

### For Senior

**Step 1:** Read SENIOR_SETUP.md completely
```bash
# Takes 15-20 minutes to understand all tasks
cat SENIOR_SETUP.md
```

**Step 2:** Assign juniors to their tasks
```
J1 Name → JUNIOR_TASKS.md Tasks 1.1-1.5 (UI & Layout)
J2 Name → JUNIOR_TASKS.md Tasks 2.1-2.3 (Auth Pages)
J3 Name → JUNIOR_TASKS.md Tasks 3.1-3.6 (Schemas)
J4 Name → JUNIOR_TASKS.md Task 4.1 (Testing) - optional
```

**Step 3:** Start S1 (Supabase)
```bash
# Begin with: Create Supabase project
# See SENIOR_SETUP.md TASK S1
```

### For Juniors

**Step 1:** Watch senior demo (5 min)
- "Here's the project structure"
- "Here's your task doc"
- "Ask me if blocked"

**Step 2:** Read your task doc
```bash
# Each junior reads their section of JUNIOR_TASKS.md
# J1 reads: Junior #1: UI Components & Layout
# J2 reads: Junior #2: Authentication Pages
# J3 reads: Junior #3: Schemas & Validations
```

**Step 3:** Start working
- Create branch: `git checkout -b feature/your-task`
- Follow the task template
- Commit frequently
- Create PR when done

---

## 💬 Communication Protocol

### Daily Standup (10 min, 9 AM)

**Format:**
```
Senior: "Let's sync. J1, status?"
J1: "Navbar done, working on sidebar. No blockers."
J2: "Waiting for layout. Got schemas from J3, ready to start when J1 is done."
J3: "All schemas created, creating component folders now."
J4: "Testing setup in progress."

Senior: "Great. Today I'm finishing migrations and types, J2 can start tomorrow.
        J1 and J3, create PRs EOD. I'll review tonight.
        See everyone tomorrow."
```

### When Blocked

**Junior is blocked?**
```
Junior: "Senior, I'm stuck on [X]. Can you help?"
Senior: "Show me. [Reviews code]. Try [suggestion]. Let me know."
```

**Never wait more than 30 minutes** - communicate immediately!

### Code Review

**PR Process:**
1. Junior creates PR with clear title
2. Request review from senior
3. Senior reviews within 2 hours
4. Junior fixes feedback
5. Senior approves & merges
6. Celebrate! 🎉

---

## 🎯 Success Criteria

### Daily Success
- Standup held on time
- No one blocked > 1 hour
- At least 1 PR created per junior
- Senior code reviewed all PRs

### EOD Day 1 Success
```
- [ ] Supabase configured
- [ ] Types generated
- [ ] J1: 50% components
- [ ] J3: All schemas
- [ ] J2: Ready to start
```

### EOD Day 2 Success
```
- [ ] Supabase clients created
- [ ] Auth middleware working
- [ ] Auth actions ready
- [ ] All juniors' PRs submitted
```

### EOD Day 3 Success (Phase 0 Complete)
```
- [ ] All PRs reviewed & merged
- [ ] Auth flow fully working
- [ ] Users can register/login/logout
- [ ] Dashboard accessible
- [ ] Zero console errors
- [ ] Ready for Phase 1
```

---

## 🔄 PR Template for Juniors

**When creating a PR, use this format:**

```markdown
## Description
[Brief description of what this PR does]

## Task Reference
[Link to JUNIOR_TASKS.md task]
- Example: Task 1.2: Navbar Component

## Files Changed
- `components/layout/navbar.tsx`
- `components/layout/sidebar.tsx`
- etc.

## Testing
[How to manually test this change]
- Example: "Visit http://localhost:3000, see navbar at top"

## Screenshots (if UI)
[Attach screenshot of component]

## Checklist
- [ ] Code follows [docs/development/conventions.md](docs/development/conventions.md)
- [ ] No console errors
- [ ] Responsive design tested
- [ ] TypeScript errors = 0
- [ ] Ready for review

---

## Notes
[Any special considerations or context]
```

---

## 🛠️ Development Workflow

### Commands Juniors Will Use

```bash
# Create feature branch
git checkout -b feature/navbar

# Install new package (ask senior first)
bun add package-name

# Format code
bun run format

# Check for errors
bun run lint

# Start dev server
bun run dev

# Create commit
git add .
git commit -m "feat: add navbar component"

# Create PR
git push origin feature/navbar
# Then create PR on GitHub
```

---

## ⚠️ Important Rules

### For Everyone
1. **Never commit .env.local** - Already in .gitignore ✅
2. **Ask before creating components** - Senior might already have code
3. **Small frequent commits** - Not huge ones
4. **Descriptive PR titles** - "feat: add", "fix:", "chore:"
5. **Test locally first** - Before creating PR

### For Juniors
1. **Read CLAUDE.md before coding** - Know the patterns
2. **Reference existing code** - Don't reinvent the wheel
3. **Ask senior for Supabase stuff** - That's their job
4. **Keep components focused** - One thing per component
5. **Responsive design always** - Mobile + desktop

### For Senior
1. **Code review within 2 hours** - Juniors shouldn't wait
2. **Provide clear feedback** - "Change X because Y"
3. **Unblock immediately** - Your job is to enable
4. **Merge small PRs first** - Quick wins build momentum
5. **Celebrate progress** - They're learning! 🎓

---

## 📞 Escalation Path

**Issue arises:**
1. Junior tries to solve (5 min)
2. Junior asks teammate (5 min)
3. Junior asks senior (immediately)
4. Never stuck > 15 minutes

**Example:**
```
J1: "How do I import shadcn buttons?"
J3: "Check components/ui/button.tsx"
J1: "Found it! Thanks."

J2: "Senior, middleware not working, ?"
Senior: "Show code. [Reviews]. Try this... Let me know."
```

---

## 📊 Progress Tracking

### Visible Progress Board

Create in your project management tool:

```
PHASE 0 TASKS
├── SENIOR
│   ├── [ ] S1: Supabase setup
│   ├── [ ] S2: .env.local
│   ├── [X] S3: Migrations
│   └── [ ] S4-S10: (In progress)
├── J1 (UI)
│   ├── [ ] T1.1: shadcn setup
│   ├── [X] T1.2: Navbar
│   └── [ ] T1.3-T1.5: (In progress)
├── J2 (Auth)
│   ├── [ ] T2.1: Forms (blocked - waiting J1)
│   └── [ ] T2.2-T2.3: Pages
├── J3 (Schemas)
│   ├── [X] T3.1: Auth schemas
│   ├── [X] T3.2-T3.5: Entity schemas
│   └── [ ] T3.6: Folders (In progress)
└── J4 (Testing)
    └── [ ] T4.1: Vitest setup
```

---

## 🎓 Learning Opportunities

While seniors handle infrastructure, juniors learn:
- How to use shadcn/ui (popular library)
- Zod validation (industry standard)
- React Hook Form (form handling)
- TypeScript patterns
- Git workflows
- Code review process
- Collaborative development

**This is valuable experience!** Celebrate learning moments.

---

## 🚨 Contingency Plans

### If Senior Gets Stuck (e.g., Supabase issues)
- Juniors can continue with UI/schemas
- No wasted time
- Can integrate later

### If A Junior Gets Stuck
- Move to next task
- Or help another junior
- Senior unblocks next standup

### If A Junior Gets Sick
- Redistribute their tasks
- Others pick up slack
- Still finish Phase 0

### If We're Behind Schedule
- Focus on critical path only
- Skip optional tasks (S6, J4)
- Extend Phase 0 by 1-2 days
- Phase 1 can still start

---

## 🎉 Phase 0 Success Party

When Phase 0 is complete:

✅ Everyone can register & login
✅ Dashboard works
✅ No errors
✅ Ready for Phase 1

**Celebration moment:**
- Team screenshot
- "Phase 0 complete! 🚀"
- Ready for Phase 1 (Crud operations)

---

## Next Steps

### If you're the Senior:
1. Read [SENIOR_SETUP.md](SENIOR_SETUP.md)
2. Assign juniors using [JUNIOR_TASKS.md](JUNIOR_TASKS.md)
3. Start Task S1 today
4. Hold standup tomorrow morning

### If you're a Junior:
1. Find your name assignment
2. Read your section of [JUNIOR_TASKS.md](JUNIOR_TASKS.md)
3. Ask senior any questions
4. Create your feature branch
5. Start coding!

---

**Project:** GoolStar MVP
**Phase:** 0 - Setup Base
**Timeline:** 3 business days
**Team:** 1 Senior + 3-4 Juniors
**Goal:** Functional auth by EOD Day 3

### Let's ship this! 🚀

---

**Last Updated:** 2025-11-21
**Author:** Senior Development Team
