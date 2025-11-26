# Junior Developer Task Cards - Phase 0

**Project:** GoolStar MVP
**Phase:** 0 - Setup Base
**Timeline:** Days 1-3 (Parallel with Senior setup)
**Team:** 3-4 Junior Developers
**Senior Lead:** Implementing critical infrastructure

---

## 📋 Overview

While the senior developer sets up Supabase, database migrations, and auth middleware, juniors work in **parallel** on UI components, schemas, and page structure.

### Senior's Work (Critical Path)
- Day 1: Supabase setup + migrations
- Day 2: Supabase clients + auth middleware
- Day 3: Code review + integration

### Junior's Work (Parallel)
- **Junior #1:** UI Components & Layout
- **Junior #2:** Auth Pages (Login/Register)
- **Junior #3:** Entity Schemas & Validation
- **Junior #4 (Optional):** Testing Infrastructure

---

## 🎯 Junior #1: UI Components & Layout

**Assigned to:** 1 Junior Developer
**Timeline:** Days 1-2 (8-12 hours)
**Priority:** HIGH (blocks other juniors)

### Objective
Create reusable UI components and main dashboard layout using shadcn/ui.

### Task 1.1: shadcn/ui Setup

**Description:** Initialize shadcn/ui in the project

**Steps:**
```bash
# Install shadcn/ui
npx shadcn-ui@latest init

# When prompted:
# - Choose: typescript (yes)
# - Choose: tailwind config location: ./tailwind.config.ts
# - Choose: use CSS variables: yes
```

**Add Components:**
```bash
# Button
npx shadcn-ui@latest add button

# Input
npx shadcn-ui@latest add input

# Form
npx shadcn-ui@latest add form

# Card
npx shadcn-ui@latest add card

# Dialog
npx shadcn-ui@latest add dialog

# Table
npx shadcn-ui@latest add table

# Sidebar (optional, complex)
npx shadcn-ui@latest add sidebar
```

**Deliverable:**
- `components/ui/` folder with all components
- Tailwind CSS variables configured
- PR with title: "chore: add shadcn/ui components"

**Difficulty:** ⭐ Easy

---

### Task 1.2: Navbar Component

**File:** `components/layout/navbar.tsx`

**Description:** Create top navigation bar for dashboard

**Requirements:**
- Display app logo/name
- Show user email (logged in user)
- Logout button
- Responsive design

**Code Template:**
```typescript
"use client"

import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  user?: User
}

export function Navbar({ user }: NavbarProps) {
  // TODO: Add logout action

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="font-bold text-lg">GoolStar</div>

        {/* Right: User info + logout */}
        <div className="flex items-center gap-4">
          {user && <span className="text-sm">{user.email}</span>}
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
```

**Deliverable:**
- Component working with mock user
- Responsive mobile/desktop
- PR: "feat: add navbar component"

**Difficulty:** ⭐ Easy

---

### Task 1.3: Sidebar Component

**File:** `components/layout/sidebar.tsx`

**Description:** Create left sidebar navigation

**Requirements:**
- Navigation links for dashboard sections
- Icons (use lucide-react)
- Collapse on mobile
- Highlight active route

**Navigation Items:**
```typescript
const navItems = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Torneos", href: "/torneos", icon: "Trophy" },
  { label: "Equipos", href: "/equipos", icon: "Users" },
  { label: "Jugadores", href: "/jugadores", icon: "User" },
  { label: "Partidos", href: "/partidos", icon: "Play" },
  { label: "Financiero", href: "/financiero", icon: "DollarSign" },
  { label: "Admin", href: "/admin", icon: "Settings" },
]
```

**Code Template:**
```typescript
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface SidebarProps {
  items: NavItem[]
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-gray-50">
      <nav className="space-y-2 p-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              pathname === item.href
                ? "bg-blue-100 text-blue-900"
                : "hover:bg-gray-100"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

**Deliverable:**
- Component with navigation items
- Active route highlighting
- PR: "feat: add sidebar component"

**Difficulty:** ⭐ Easy-Medium

---

### Task 1.4: Dashboard Layout

**File:** `app/(dashboard)/layout.tsx`

**Description:** Main layout combining navbar + sidebar

**Requirements:**
- Use Navbar and Sidebar components
- Two-column grid layout
- Responsive (sidebar collapses on mobile)
- Footer area

**Code Template:**
```typescript
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { Footer } from "@/components/layout/footer"

const navItems = [
  // ... from Task 1.3
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Get current user from auth

  return (
    <div className="flex h-screen flex-col">
      {/* Navbar */}
      <Navbar user={null} />

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar items={navItems} />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
```

**Deliverable:**
- Layout component complete
- All sub-components integrated
- PR: "feat: add dashboard layout"

**Difficulty:** ⭐⭐ Medium

---

### Task 1.5: Footer Component

**File:** `components/layout/footer.tsx`

**Description:** Simple footer

**Requirements:**
- Copyright info
- Links (optional)
- Centered

**Deliverable:**
- Simple footer component
- PR: "feat: add footer component"

**Difficulty:** ⭐ Easy

---

## 🔐 Junior #2: Authentication Pages

**Assigned to:** 1 Junior Developer
**Timeline:** Days 1-2 (8-12 hours)
**Depends on:** Junior #1 (Layout)
**Blocked by:** Senior (Supabase clients + auth middleware)

### Objective
Create login and register pages with form validation.

### Task 2.1: Auth Form Components

**File:** `components/auth/login-form.tsx` & `components/auth/register-form.tsx`

**Description:** Form components for authentication

**Requirements:**
- Use react-hook-form + Zod validation
- Email + password fields
- Error messages
- Submit button (disabled while loading)
- Link to other form

**Note:** These will connect to Server Actions once senior creates them.

**Code Template (Login):**
```typescript
"use client"

import { useActionState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form } from "@/components/ui/form"
import { loginSchema } from "@/lib/validations/auth"

export function LoginForm() {
  // Note: loginSchema will be created by Junior #3
  // For now, create a placeholder or work with Senior

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // TODO: Connect to Server Action once senior creates it
  // const [state, formAction, isPending] = useActionState(login, null)

  return (
    <form>
      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <label htmlFor="password">Password</label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full">
        Sign In
      </Button>

      {/* Link to register */}
      <p className="text-center text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-600">
          Sign up
        </Link>
      </p>
    </form>
  )
}
```

**Deliverable:**
- Both form components working
- Validation styling
- PR: "feat: add auth form components"

**Difficulty:** ⭐⭐ Medium

---

### Task 2.2: Login Page

**File:** `app/(auth)/login/page.tsx`

**Description:** Login page with layout

**Requirements:**
- Use LoginForm component
- Centered card layout
- Link to register
- Auto-redirect if already logged in (senior will handle)

**Code Template:**
```typescript
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <div className="space-y-6 p-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold">GoolStar</h1>
            <p className="text-gray-600">Tournament Management System</p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>
      </Card>
    </div>
  )
}
```

**Deliverable:**
- Login page complete
- Responsive design
- PR: "feat: add login page"

**Difficulty:** ⭐ Easy

---

### Task 2.3: Register Page

**File:** `app/(auth)/register/page.tsx` & `components/auth/register-form.tsx`

**Description:** Registration page and form

**Requirements:**
- Email, password, password confirmation
- Password strength feedback (optional)
- Validation: passwords must match
- Link to login

**Code Template:**
```typescript
// app/(auth)/register/page.tsx
import { Card } from "@/components/ui/card"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <div className="space-y-6 p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-gray-600">Join GoolStar</p>
          </div>
          <RegisterForm />
        </div>
      </Card>
    </div>
  )
}
```

**Deliverable:**
- Register page + form complete
- Password match validation
- PR: "feat: add register page"

**Difficulty:** ⭐⭐ Medium

---

## 📊 Junior #3: Schemas & Validations

**Assigned to:** 1 Junior Developer
**Timeline:** Days 1-2 (6-10 hours)
**Blocks:** Other juniors (used in forms)
**No dependencies**

### Objective
Create Zod validation schemas for all entities.

### Task 3.1: Auth Schemas

**File:** `lib/validations/auth.ts`

**Description:** Validation schemas for login/register

**Code Template:**
```typescript
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  passwordConfirm: z.string(),
}).refine(data => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
})

export type Login = z.infer<typeof loginSchema>
export type Register = z.infer<typeof registerSchema>
```

**Deliverable:**
- Auth schemas complete
- PR: "feat: add auth validation schemas"

**Difficulty:** ⭐ Easy

---

### Task 3.2: Tournament Schemas

**File:** `lib/validations/torneo.ts`

**Description:** Validation for tournament creation

**Read:** [docs/database/schema.md](docs/database/schema.md) "torneos" table

**Fields:**
- nombre: string, required
- categoria_id: UUID, required
- fecha_inicio: date, required
- fecha_fin: date, optional
- tiene_fase_grupos: boolean
- tiene_eliminacion_directa: boolean

**Code Template:**
```typescript
import { z } from "zod"

export const torneoSchema = z.object({
  nombre: z.string().min(1, "Tournament name required"),
  categoria_id: z.string().uuid("Invalid category"),
  fecha_inicio: z.coerce.date(),
  fecha_fin: z.coerce.date().optional(),
  tiene_fase_grupos: z.boolean().default(true),
  tiene_eliminacion_directa: z.boolean().default(true),
})

export type Torneo = z.infer<typeof torneoSchema>
```

**Deliverable:**
- Torneo schema complete
- PR: "feat: add torneo validation schema"

**Difficulty:** ⭐ Easy

---

### Task 3.3: Team Schemas

**File:** `lib/validations/equipo.ts`

**Description:** Validation for team creation

**Read:** [docs/database/schema.md](docs/database/schema.md) "equipos" table

**Fields:**
- nombre: string, required
- categoria_id: UUID, required
- torneo_id: UUID, required
- color_principal: string (hex color)
- nivel: enum ('1', '2', '3', '4', '5')

**Code Template:**
```typescript
import { z } from "zod"

export const equipoSchema = z.object({
  nombre: z.string().min(1, "Team name required"),
  categoria_id: z.string().uuid(),
  torneo_id: z.string().uuid(),
  color_principal: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color"),
  nivel: z.enum(["1", "2", "3", "4", "5"]),
})

export type Equipo = z.infer<typeof equipoSchema>
```

**Deliverable:**
- Equipo schema complete
- PR: "feat: add equipo validation schema"

**Difficulty:** ⭐ Easy

---

### Task 3.4: Player Schemas

**File:** `lib/validations/jugador.ts`

**Description:** Validation for player creation

**Read:** [docs/database/schema.md](docs/database/schema.md) "jugadores" table

**Fields:**
- primer_nombre: string
- primer_apellido: string
- cedula: string (optional)
- numero_dorsal: number (1-99)
- posicion: string (optional)
- nivel: enum

**Deliverable:**
- Jugador schema complete
- PR: "feat: add jugador validation schema"

**Difficulty:** ⭐ Easy

---

### Task 3.5: Match Schemas

**File:** `lib/validations/partido.ts`

**Description:** Validation for match creation

**Read:** [docs/database/schema.md](docs/database/schema.md) "partidos" table

**Fields:**
- equipo_1_id: UUID
- equipo_2_id: UUID
- fecha: datetime
- cancha: string (optional)
- jornada_id OR fase_eliminatoria_id (mutually exclusive)

**Deliverable:**
- Partido schema complete
- PR: "feat: add partido validation schema"

**Difficulty:** ⭐⭐ Medium (mutual exclusivity)

---

### Task 3.6: Component Structure

**Description:** Create empty component folders and files for next phases

**Folders to Create:**
```bash
mkdir -p components/torneos
mkdir -p components/equipos
mkdir -p components/jugadores
mkdir -p components/partidos
mkdir -p components/financiero
mkdir -p components/admin
```

**Files to Create (empty/placeholder):**
```
components/torneos/
  ├── torneo-form.tsx
  ├── torneo-list.tsx
  ├── torneo-card.tsx
  └── tabla-posiciones.tsx

components/equipos/
  ├── equipo-form.tsx
  ├── equipo-list.tsx
  └── equipo-card.tsx

components/jugadores/
  ├── jugador-form.tsx
  ├── jugador-list.tsx
  └── jugador-card.tsx

components/partidos/
  ├── partido-form.tsx
  ├── partido-list.tsx
  └── partido-card.tsx
```

**Deliverable:**
- Folder structure complete
- Placeholder files with comments
- PR: "chore: create component folder structure"

**Difficulty:** ⭐ Easy

---

## 🧪 Junior #4 (Optional): Testing Setup

**Assigned to:** 1 Junior (if available)
**Timeline:** Days 2-3 (4-6 hours)
**Priority:** LOW (can do Phase 1)

### Task 4.1: Configure Vitest

**Description:** Setup unit testing framework

**Steps:**
```bash
# Install dev dependencies
bun add -D vitest @testing-library/react @testing-library/jest-dom

# Create vitest config
# (Need senior guidance on config)
```

**Deliverable:**
- Vitest configured
- Sample test passing
- PR: "chore: configure vitest"

---

---

## 📋 Collaboration Guidelines

### Daily Stand-up
- 10 min each morning
- What you did yesterday
- What you're doing today
- Blockers/questions for senior

### Code Review Process
1. Create PR with descriptive title
2. Request review from senior
3. Wait for approval before merging
4. Address feedback promptly

### Pull Request Template

```markdown
## Description
Brief description of changes

## Files Changed
- component-name.tsx
- another-file.ts

## Tests
How to test this change manually

## Screenshots (if UI)
Add screenshots for visual changes

## Notes
Any special considerations
```

### Merge Strategy
- All PRs merged by senior
- Small PRs (< 200 lines) = faster review
- Use conventional commits: `feat:`, `fix:`, `chore:`

---

## 🚫 Blockers & Waiting

### What to Do If Blocked

**If waiting for senior (Supabase/clients):**
- Work on next task
- Or refactor existing code
- Or add TypeScript types/jsdoc
- Or write unit tests for utilities

**If waiting for another junior:**
- Check dependencies in task list
- Start next task
- Review others' code
- Help with testing

---

## ✅ Completion Checklist

### Junior #1 (UI & Layout)
- [ ] shadcn/ui installed
- [ ] Navbar component created
- [ ] Sidebar component created
- [ ] Dashboard layout created
- [ ] Footer component created
- [ ] All 5 PRs reviewed & merged

### Junior #2 (Auth Pages)
- [ ] Login form component created
- [ ] Register form component created
- [ ] Login page created
- [ ] Register page created
- [ ] All 3 PRs reviewed & merged

### Junior #3 (Schemas)
- [ ] Auth schemas created
- [ ] Torneo schema created
- [ ] Equipo schema created
- [ ] Jugador schema created
- [ ] Partido schema created
- [ ] Component folders created
- [ ] All 6 PRs reviewed & merged

### Junior #4 (Testing)
- [ ] Vitest configured
- [ ] Sample tests passing
- [ ] 1 PR reviewed & merged

---

## 📚 Resources for Juniors

### Required Reading
- [QUICK_START.md](../QUICK_START.md) - Setup guide
- [CLAUDE.md](../CLAUDE.md) - Development patterns
- [docs/development/conventions.md](../docs/development/conventions.md) - Code standards
- [docs/architecture/current-structure.md](../docs/architecture/current-structure.md) - Project structure

### Documentation to Reference
- [Zod Docs](https://zod.dev) - Validation
- [shadcn/ui Docs](https://ui.shadcn.com) - Component library
- [React Hook Form](https://react-hook-form.com) - Form handling
- [Next.js App Router](https://nextjs.org/docs/app)

### Helpful Tips
- Always check `docs/database/schema.md` before creating schemas
- Ask senior before creating custom components (might already exist)
- Test your components locally before creating PR
- Keep commits small and focused
- Add JSDoc comments to complex functions

---

## 🎯 Success Criteria for Phase 0

Phase 0 is complete when:
- ✅ All junior tasks completed and merged
- ✅ Supabase fully configured (senior)
- ✅ Auth pages connect to Supabase (senior integration)
- ✅ Users can register/login/logout
- ✅ Protected routes redirect to login
- ✅ Dashboard layout displays
- ✅ No console errors in dev mode
- ✅ Responsive design on mobile

---

**Created:** 2025-11-21
**Phase:** 0 - Setup Base
**Total Tasks:** 15+
**Estimated Time:** 3 days parallel work

Get started and let's ship this MVP! 🚀
