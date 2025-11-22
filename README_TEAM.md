# Team Documentation Index - Phase 0

**Project:** GoolStar MVP
**Current Phase:** 0 - Setup Base
**Team:** 1 Senior Developer + 3-4 Junior Developers
**Timeline:** 3 Business Days
**Status:** 📋 Ready to begin implementation

---

## 🎯 If You're The Senior Developer

### Start Here (Read in Order)

1. **[TEAM_ORGANIZATION.md](TEAM_ORGANIZATION.md)** ⭐ START HERE
   - 5 min read
   - Understand team structure
   - Timeline overview
   - Your role & responsibilities

2. **[SENIOR_SETUP.md](SENIOR_SETUP.md)** - Your Complete Playbook
   - Step-by-step guide for 10 tasks (S1-S10)
   - Code templates for critical components
   - Troubleshooting section
   - Integration points with juniors
   - **Time to read:** 30 minutes
   - **Time to execute:** 15 hours over 3 days

3. **[docs/database/schema.md](docs/database/schema.md)** - Reference
   - Complete database schema
   - Use when creating migrations (Task S3)
   - 20+ tables with full definitions

4. **[CLAUDE.md](CLAUDE.md)** - Code Patterns
   - Development guidelines
   - How imports work
   - Code organization
   - Common workflows

### Your Daily Workflow

**Day 1:** Infrastructure Foundation
```bash
# Morning
- Read: SENIOR_SETUP.md (Tasks S1-S2)
- Do: S1: Create Supabase project
- Do: S2: Create .env.local
- Morning standup with juniors (10 min)

# Afternoon
- Do: S3: Create 10 migration files
- Do: S4: Execute migrations
- Do: S5: Generate TypeScript types
- Code review on J1/J3 PRs (as they come)
```

**Day 2:** Integration
```bash
# Morning
- Morning standup (10 min)
- Do: S7: Create Supabase clients
- Do: S8: Create auth middleware

# Afternoon
- Do: S9: Create auth Server Actions
- Do: S10: Test everything
- Code review all junior PRs
```

**Day 3:** Final Integration
```bash
# Morning
- Morning standup (10 min)
- Final code reviews (1 hour)
- Merge all approved PRs (30 min)

# Afternoon
- Integration testing
- Fix any issues
- Phase 0 complete! 🎉
```

### Key Commands You'll Run

```bash
# Supabase setup
supabase init
supabase start
supabase status
supabase gen types typescript --local > types/database.ts

# Git workflow
git add -A
git commit -m "feat: add description"
git push origin branch-name

# Development
bun run dev        # Start dev server
bun run lint       # Check code
bun run format     # Format code
```

### Your Responsibilities

✅ **Critical Infrastructure** (Only you)
- Supabase configuration
- Database migrations
- Auth setup
- Supabase clients
- Middleware

✅ **Supervision & Unblocking** (You lead)
- Daily standup
- Code review on all PRs
- Merge pull requests
- Unblock juniors immediately
- Final integration testing

✅ **Quality Assurance** (You verify)
- Auth flow works end-to-end
- Database queries work
- No TypeScript errors
- No console errors
- Responsive design

---

## 🎯 If You're A Junior Developer #1 (UI & Layout)

### Start Here (Read in Order)

1. **[TEAM_ORGANIZATION.md](TEAM_ORGANIZATION.md)** ⭐ START HERE
   - 3 min read
   - Understand team structure
   - Your role in the team
   - Timeline

2. **[JUNIOR_TASKS.md](JUNIOR_TASKS.md)** - Your Task List
   - Go to section: **"Junior #1: UI Components & Layout"**
   - 5 tasks with full instructions
   - Task 1.1: shadcn/ui Setup
   - Task 1.2: Navbar Component
   - Task 1.3: Sidebar Component
   - Task 1.4: Dashboard Layout
   - Task 1.5: Footer Component

3. **[QUICK_START.md](QUICK_START.md)** - Setup Guide
   - 5 min setup
   - If stuck, refer here

4. **[CLAUDE.md](CLAUDE.md)** - Code Patterns
   - How to structure components
   - Import conventions
   - Code style

5. **[docs/development/conventions.md](docs/development/conventions.md)** - Standards
   - Component naming
   - File organization
   - Code patterns

### Your Daily Workflow

**Day 1:** Component Foundation
```bash
# Morning
- Read: JUNIOR_TASKS.md "Junior #1" section
- Do: T1.1 - shadcn/ui setup (30 min)
- Do: T1.2 - Create Navbar component (1 hour)
- Do: T1.3 - Create Sidebar component (1.5 hours)

# Afternoon
- Do: T1.4 - Create Dashboard layout (1.5 hours)
- Do: T1.5 - Create Footer component (30 min)
- Create PR for T1.1-T1.2
- Request senior review
```

**Day 2:** Finalization
```bash
# Morning
- Address senior's code review feedback (1 hour)
- Create PR for T1.3-T1.5
- Final polish (responsive design, styling)

# Afternoon
- Wait for senior to merge (they approve)
- Help other juniors if needed
- Ready for Phase 1!
```

### Key Commands You'll Use

```bash
# Setup
bun install
bun run dev

# Git workflow
git checkout -b feature/navbar
git add components/layout/navbar.tsx
git commit -m "feat: add navbar component"
git push origin feature/navbar

# Code quality
bun run lint
bun run format
```

### What You're Learning

✅ shadcn/ui component library
✅ React component patterns
✅ Responsive design (Tailwind CSS)
✅ Git workflow & PRs
✅ Code review process
✅ Professional development standards

---

## 🎯 If You're A Junior Developer #2 (Auth Pages)

### Start Here (Read in Order)

1. **[TEAM_ORGANIZATION.md](TEAM_ORGANIZATION.md)** ⭐ START HERE

2. **[JUNIOR_TASKS.md](JUNIOR_TASKS.md)** - Your Task List
   - Go to section: **"Junior #2: Authentication Pages"**
   - Wait for J1's layout (you're blocked initially)
   - 3 tasks once layout is ready
   - Task 2.1: Auth Form Components
   - Task 2.2: Login Page
   - Task 2.3: Register Page

3. **[QUICK_START.md](QUICK_START.md)** - Setup

4. **[CLAUDE.md](CLAUDE.md)** - Patterns

5. **[docs/development/conventions.md](docs/development/conventions.md)** - Standards

### Your Daily Workflow

**Day 1:** Planning & Setup
```bash
# Morning
- Read JUNIOR_TASKS.md "Junior #2" section
- Wait for J1 to finish layout (dependency)
- Read CLAUDE.md about forms & validation
- Setup your dev environment

# Afternoon
- J1 should finish layout by now
- Start T2.1: Auth form components
- Create LoginForm and RegisterForm components
```

**Day 2:** Pages & Polish
```bash
# Morning
- Finish T2.1 form components
- Do T2.2: Login page
- Do T2.3: Register page
- Create PR with all 3 tasks

# Afternoon
- Address senior's feedback
- Merge PR (once approved)
- Ready for integration!
```

### What You're Learning

✅ React Hook Form (form library)
✅ Zod validation (from J3)
✅ Form error handling
✅ Next.js pages & routing
✅ Client component patterns

---

## 🎯 If You're A Junior Developer #3 (Data Layer)

### Start Here (Read in Order)

1. **[TEAM_ORGANIZATION.md](TEAM_ORGANIZATION.md)** ⭐ START HERE

2. **[JUNIOR_TASKS.md](JUNIOR_TASKS.md)** - Your Task List
   - Go to section: **"Junior #3: Schemas & Validations"**
   - No dependencies! Start immediately
   - 6 tasks:
   - Task 3.1: Auth Schemas
   - Task 3.2: Tournament Schemas
   - Task 3.3: Team Schemas
   - Task 3.4: Player Schemas
   - Task 3.5: Match Schemas
   - Task 3.6: Component Structure

3. **[docs/database/schema.md](docs/database/schema.md)** - Reference
   - Database table definitions
   - Use when creating schemas

4. **[QUICK_START.md](QUICK_START.md)** - Setup

5. **[CLAUDE.md](CLAUDE.md)** - Patterns

### Your Daily Workflow

**Day 1:** All Schemas
```bash
# Morning
- Read JUNIOR_TASKS.md "Junior #3" section
- Read database schema.md for field definitions
- Do T3.1: Auth schemas (1 hour)
- Do T3.2: Tournament schema (30 min)
- Do T3.3: Team schema (30 min)

# Afternoon
- Do T3.4: Player schema (30 min)
- Do T3.5: Match schema (30 min)
- Create PR with T3.1-T3.5
- Request senior review
```

**Day 2:** Structure & Polish
```bash
# Morning
- Address code review feedback
- Do T3.6: Component folder structure (30 min)
- Create final PR
- Merge!

# Afternoon
- Help J2 with schemas in their forms
- Ready for Phase 1!
```

### What You're Learning

✅ Zod validation library
✅ TypeScript type inference
✅ Schema design patterns
✅ Database field validation
✅ Professional error handling

---

## 🎯 If You're A Junior Developer #4 (Testing - Optional)

### Start Here

1. **[TEAM_ORGANIZATION.md](TEAM_ORGANIZATION.md)** ⭐ START HERE

2. **[JUNIOR_TASKS.md](JUNIOR_TASKS.md)** - Your Task
   - Go to section: **"Junior #4 (Optional): Testing Setup"**
   - Lower priority (can skip)
   - Task 4.1: Configure Vitest

### Your Daily Workflow

**Day 2-3:** Testing Setup
```bash
# Day 2 Afternoon
- Setup Vitest
- Create sample test
- Create PR

# Day 3
- Address feedback
- Merge
- Help with final integration
```

---

## 📚 Reference Documents

### For Code Quality
- **[CLAUDE.md](CLAUDE.md)** - Development patterns & conventions
- **[docs/development/conventions.md](docs/development/conventions.md)** - Code standards
- **[docs/architecture/current-structure.md](docs/architecture/current-structure.md)** - Project structure

### For Database
- **[docs/database/schema.md](docs/database/schema.md)** - All tables & fields
- **[docs/database/triggers.md](docs/database/triggers.md)** - Automation
- **[docs/database/functions.md](docs/database/functions.md)** - Complex queries

### For Business Logic
- **[docs/architecture/business-rules.md](docs/architecture/business-rules.md)** - Rules & calculations
- **[ROADMAP.md](ROADMAP.md)** - All phases overview

---

## 🎯 Quick Navigation

| Role | Start | Then Read | Task Doc |
|------|-------|-----------|----------|
| Senior | TEAM_ORG | SENIOR_SETUP | SENIOR_SETUP |
| J1 (UI) | TEAM_ORG | JUNIOR_TASKS | JUNIOR_TASKS |
| J2 (Auth) | TEAM_ORG | JUNIOR_TASKS | JUNIOR_TASKS |
| J3 (Schemas) | TEAM_ORG | JUNIOR_TASKS | JUNIOR_TASKS |
| J4 (Testing) | TEAM_ORG | JUNIOR_TASKS | JUNIOR_TASKS |

---

## ⏰ Timeline at a Glance

```
DAY 1 (Setup)
├─ Senior: S1-S6 (Supabase config)
├─ J1: T1.1-T1.5 (Components)
└─ J3: T3.1-T3.5 (Schemas)

DAY 2 (Integration)
├─ Senior: S7-S10 (Clients & middleware)
├─ J1: Finalize + PR
├─ J2: T2.1-T2.3 (Auth pages)
└─ J3: T3.6 (Folders) + PR

DAY 3 (Finalization)
├─ Senior: Code review + merge
├─ Everyone: Integration testing
└─ 🎉 Phase 0 Complete!
```

---

## 🚨 Important Rules

### For Everyone
- ✅ Read your assigned doc completely before asking questions
- ✅ Ask senior immediately if blocked > 15 minutes
- ✅ Small frequent commits (not huge ones)
- ✅ Descriptive commit messages
- ✅ Test locally before creating PR
- ✅ Never commit `.env.local` or secrets

### For Juniors
- ✅ Check existing code before writing new
- ✅ Follow code conventions from CLAUDE.md
- ✅ Use code templates provided
- ✅ Keep PRs < 200 lines if possible
- ✅ Wait for senior approval before merging

### For Senior
- ✅ Code review within 2 hours
- ✅ Unblock juniors immediately
- ✅ Merge small PRs first (quick wins)
- ✅ Celebrate progress! 🎓

---

## 🆘 Help & Support

### If You're Stuck

1. **First:** Check your task document
2. **Second:** Ask teammate for 5 min
3. **Third:** Ask senior immediately (don't wait > 15 min)
4. **Never:** Sit stuck in silence

### Common Questions

**Q: Where do I start?**
A: Read the "Start Here" section for your role above.

**Q: What if I finish early?**
A: Help another junior or optimize your code with tests.

**Q: Can I work on Phase 1 stuff?**
A: No, stay focused on Phase 0. One phase at a time.

**Q: What if senior is busy?**
A: Start next task or help teammates. Senior will get to you soon.

---

## ✅ Success Checklist

**Phase 0 is complete when:**
- [ ] All infrastructure tasks done (S1-S10)
- [ ] All junior PRs reviewed & merged
- [ ] Users can register
- [ ] Users can login
- [ ] Users can logout
- [ ] Dashboard accessible
- [ ] No console errors
- [ ] Responsive design works
- [ ] No TypeScript errors
- [ ] Ready for Phase 1

---

## 🚀 Let's Build This Together

**You have everything you need:**
- ✅ Clear task assignments
- ✅ Detailed step-by-step guides
- ✅ Code templates to follow
- ✅ Reference documentation
- ✅ Communication protocols
- ✅ Success criteria

**Time to ship!**

---

**Project:** GoolStar MVP
**Phase:** 0 - Setup Base
**Team:** Assembled 🎯
**Timeline:** 3 Days ⏱️
**Status:** Ready to Begin 🚀

### Next Step: Open Your Assigned Document

- **Senior:** → [SENIOR_SETUP.md](SENIOR_SETUP.md)
- **Junior #1:** → [JUNIOR_TASKS.md](JUNIOR_TASKS.md) (Task 1)
- **Junior #2:** → [JUNIOR_TASKS.md](JUNIOR_TASKS.md) (Task 2)
- **Junior #3:** → [JUNIOR_TASKS.md](JUNIOR_TASKS.md) (Task 3)
- **Junior #4:** → [JUNIOR_TASKS.md](JUNIOR_TASKS.md) (Task 4)

---

**Created:** 2025-11-21
**Last Updated:** 2025-11-21
