# Testing Strategy

**Status:** Planned for Phase 7
**Last Updated:** 2025-11-22
**Framework:** Vitest + React Testing Library + Playwright

---

## Overview

GoolStar uses a comprehensive testing strategy covering unit tests, integration tests, and end-to-end tests. This document outlines the testing approach, tools, patterns, and best practices for the project.

### Testing Philosophy

1. **Test behavior, not implementation** - Focus on what users see and do
2. **Write tests as you code** - Don't defer testing to the end
3. **Mock external dependencies** - Tests should be fast and deterministic
4. **Test critical paths first** - Authentication, CRUD, business logic
5. **Maintain high coverage** - Aim for 80%+ coverage on business logic

---

## Testing Stack

### Unit & Integration Tests

**Framework:** [Vitest](https://vitest.dev/)
- Fast test runner compatible with Vite
- Compatible with Jest API
- Built-in TypeScript support
- Parallel test execution
- Watch mode for development

**Component Testing:** [React Testing Library](https://testing-library.com/react)
- User-centric testing approach
- Encourages accessibility
- Works with Server Components
- Query utilities for finding elements

**Mocking:** [MSW (Mock Service Worker)](https://mswjs.io/)
- Mock Supabase API calls
- Intercept network requests
- Realistic request/response simulation

### End-to-End Tests

**Framework:** [Playwright](https://playwright.dev/)
- Cross-browser testing (Chromium, Firefox, WebKit)
- Built-in test runner
- Screenshots and video recording
- Network interception
- Parallel execution

---

## Project Structure

```
tests/
├── unit/                           # Unit tests (pure functions)
│   ├── utils/
│   │   ├── points.test.ts
│   │   ├── standings.test.ts
│   │   ├── suspension.test.ts
│   │   ├── format.test.ts
│   │   └── debt.test.ts
│   └── validations/
│       ├── auth.test.ts
│       ├── torneo.test.ts
│       ├── equipo.test.ts
│       ├── jugador.test.ts
│       └── partido.test.ts
├── integration/                    # Integration tests (Server Actions, hooks)
│   ├── actions/
│   │   ├── torneos.test.ts
│   │   ├── equipos.test.ts
│   │   ├── jugadores.test.ts
│   │   ├── partidos.test.ts
│   │   ├── financiero.test.ts
│   │   └── auth.test.ts
│   └── hooks/
│       ├── use-torneos.test.ts
│       ├── use-equipos.test.ts
│       └── use-jugadores.test.ts
├── components/                     # Component tests
│   ├── torneos/
│   │   ├── torneo-form.test.tsx
│   │   ├── torneo-list.test.tsx
│   │   └── tabla-posiciones.test.tsx
│   ├── equipos/
│   │   ├── equipo-form.test.tsx
│   │   └── equipo-card.test.tsx
│   ├── jugadores/
│   │   └── jugador-form.test.tsx
│   └── partidos/
│       ├── partido-form.test.tsx
│       └── acta-partido.test.tsx
├── e2e/                            # End-to-end tests (Playwright)
│   ├── auth.spec.ts
│   ├── torneos.spec.ts
│   ├── equipos.spec.ts
│   ├── jugadores.spec.ts
│   ├── partidos.spec.ts
│   └── financiero.spec.ts
├── fixtures/                       # Test data
│   ├── torneos.ts
│   ├── equipos.ts
│   ├── jugadores.ts
│   └── partidos.ts
└── setup/                          # Test configuration
    ├── vitest.setup.ts
    ├── msw-handlers.ts
    └── playwright.config.ts
```

---

## Unit Tests

### Testing Utility Functions

**File:** `tests/unit/utils/points.test.ts`

```typescript
import { describe, it, expect } from "vitest"
import {
  calculatePoints,
  calculateGoalDifference,
  getMatchResult,
  getMatchResultText,
} from "@/lib/utils/points"

describe("calculatePoints", () => {
  it("returns 3 points for a win", () => {
    expect(calculatePoints(3, 1)).toBe(3)
  })

  it("returns 1 point for a draw", () => {
    expect(calculatePoints(2, 2)).toBe(1)
  })

  it("returns 0 points for a loss", () => {
    expect(calculatePoints(1, 3)).toBe(0)
  })
})

describe("calculateGoalDifference", () => {
  it("calculates positive goal difference", () => {
    expect(calculateGoalDifference(5, 2)).toBe(3)
  })

  it("calculates negative goal difference", () => {
    expect(calculateGoalDifference(1, 4)).toBe(-3)
  })

  it("returns 0 for equal goals", () => {
    expect(calculateGoalDifference(2, 2)).toBe(0)
  })
})

describe("getMatchResult", () => {
  it("returns 'win' when goals for > goals against", () => {
    expect(getMatchResult(3, 1)).toBe("win")
  })

  it("returns 'draw' when goals are equal", () => {
    expect(getMatchResult(2, 2)).toBe("draw")
  })

  it("returns 'loss' when goals for < goals against", () => {
    expect(getMatchResult(1, 3)).toBe("loss")
  })
})

describe("getMatchResultText", () => {
  it("returns 'Victoria' for a win", () => {
    expect(getMatchResultText(3, 1)).toBe("Victoria")
  })

  it("returns 'Empate' for a draw", () => {
    expect(getMatchResultText(2, 2)).toBe("Empate")
  })

  it("returns 'Derrota' for a loss", () => {
    expect(getMatchResultText(1, 3)).toBe("Derrota")
  })
})
```

**Key Points:**
- Test all edge cases (win, draw, loss)
- Test boundary conditions (0 goals, high scores)
- Use descriptive test names
- Keep tests simple and focused

---

### Testing Validation Schemas

**File:** `tests/unit/validations/torneo.test.ts`

```typescript
import { describe, it, expect } from "vitest"
import { torneoSchema } from "@/lib/validations/torneo"

describe("torneoSchema", () => {
  it("validates a valid torneo", () => {
    const data = {
      nombre: "Torneo Verano 2025",
      categoria_id: "123e4567-e89b-12d3-a456-426614174000",
      fecha_inicio: new Date("2025-07-01"),
      fecha_fin: new Date("2025-08-31"),
      numero_equipos: 8,
      activo: true,
    }

    expect(() => torneoSchema.parse(data)).not.toThrow()
  })

  it("rejects torneo with empty nombre", () => {
    const data = {
      nombre: "",
      categoria_id: "123e4567-e89b-12d3-a456-426614174000",
      fecha_inicio: new Date("2025-07-01"),
    }

    expect(() => torneoSchema.parse(data)).toThrow("Nombre is required")
  })

  it("rejects torneo with invalid UUID", () => {
    const data = {
      nombre: "Torneo Verano",
      categoria_id: "not-a-uuid",
      fecha_inicio: new Date("2025-07-01"),
    }

    expect(() => torneoSchema.parse(data)).toThrow()
  })

  it("rejects torneo with fecha_fin before fecha_inicio", () => {
    const data = {
      nombre: "Torneo Verano",
      categoria_id: "123e4567-e89b-12d3-a456-426614174000",
      fecha_inicio: new Date("2025-08-01"),
      fecha_fin: new Date("2025-07-01"),
    }

    expect(() => torneoSchema.parse(data)).toThrow()
  })
})
```

---

## Integration Tests

### Testing Server Actions

**File:** `tests/integration/actions/torneos.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest"
import { createTorneo, getTorneos, updateTorneo } from "@/actions/torneos"
import { mockSupabaseClient } from "../setup/supabase-mock"

// Mock Supabase
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: () => mockSupabaseClient,
}))

describe("Torneo Server Actions", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })

  describe("createTorneo", () => {
    it("creates a torneo successfully", async () => {
      const data = {
        nombre: "Torneo Verano 2025",
        categoria_id: "123e4567-e89b-12d3-a456-426614174000",
        fecha_inicio: new Date("2025-07-01"),
      }

      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "torneo-uuid", ...data },
              error: null,
            }),
          }),
        }),
      })

      const result = await createTorneo(data)

      expect(result.data).toBeDefined()
      expect(result.data?.nombre).toBe("Torneo Verano 2025")
      expect(result.error).toBeUndefined()
    })

    it("returns error on validation failure", async () => {
      const data = {
        nombre: "", // Invalid: empty nombre
        categoria_id: "123e4567-e89b-12d3-a456-426614174000",
      }

      const result = await createTorneo(data)

      expect(result.error).toBeDefined()
      expect(result.data).toBeUndefined()
    })

    it("returns error on database failure", async () => {
      const data = {
        nombre: "Torneo Verano 2025",
        categoria_id: "123e4567-e89b-12d3-a456-426614174000",
        fecha_inicio: new Date("2025-07-01"),
      }

      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "Database error" },
            }),
          }),
        }),
      })

      const result = await createTorneo(data)

      expect(result.error).toBeDefined()
      expect(result.data).toBeUndefined()
    })
  })

  describe("getTorneos", () => {
    it("returns all torneos", async () => {
      const mockTorneos = [
        { id: "1", nombre: "Torneo 1" },
        { id: "2", nombre: "Torneo 2" },
      ]

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockTorneos,
            error: null,
          }),
        }),
      })

      const result = await getTorneos()

      expect(result).toHaveLength(2)
      expect(result[0].nombre).toBe("Torneo 1")
    })
  })
})
```

**Key Points:**
- Mock Supabase client for all Server Actions
- Test success and error paths
- Test validation errors vs database errors
- Use realistic test data

---

### Testing Custom Hooks

**File:** `tests/integration/hooks/use-torneos.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useTorneos } from "@/lib/hooks/use-torneos"
import { getTorneos } from "@/actions/torneos"

// Mock the Server Action
vi.mock("@/actions/torneos", () => ({
  getTorneos: vi.fn(),
}))

describe("useTorneos hook", () => {
  it("fetches torneos on mount", async () => {
    const mockTorneos = [
      { id: "1", nombre: "Torneo 1" },
      { id: "2", nombre: "Torneo 2" },
    ]

    vi.mocked(getTorneos).mockResolvedValue(mockTorneos)

    const { result } = renderHook(() => useTorneos())

    // Initially loading
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toHaveLength(2)
    expect(result.current.error).toBeNull()
  })

  it("handles fetch errors", async () => {
    vi.mocked(getTorneos).mockRejectedValue(new Error("Fetch failed"))

    const { result } = renderHook(() => useTorneos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeNull()
  })
})
```

---

## Component Tests

### Testing Form Components

**File:** `tests/components/torneos/torneo-form.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TorneoForm } from "@/components/torneos/torneo-form"

describe("TorneoForm", () => {
  it("renders all form fields", () => {
    render(<TorneoForm />)

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/fecha inicio/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /crear/i })).toBeInTheDocument()
  })

  it("validates required fields", async () => {
    render(<TorneoForm />)

    const submitButton = screen.getByRole("button", { name: /crear/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/nombre.*required/i)).toBeInTheDocument()
      expect(screen.getByText(/categoría.*required/i)).toBeInTheDocument()
    })
  })

  it("submits form with valid data", async () => {
    const mockOnSubmit = vi.fn()
    render(<TorneoForm onSubmit={mockOnSubmit} />)

    const user = userEvent.setup()

    // Fill form
    await user.type(screen.getByLabelText(/nombre/i), "Torneo Verano 2025")
    await user.selectOptions(screen.getByLabelText(/categoría/i), "categoria-id")
    await user.type(screen.getByLabelText(/fecha inicio/i), "2025-07-01")

    // Submit
    await user.click(screen.getByRole("button", { name: /crear/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        nombre: "Torneo Verano 2025",
        categoria_id: "categoria-id",
        fecha_inicio: expect.any(Date),
      })
    })
  })

  it("displays server errors", async () => {
    const mockOnSubmit = vi.fn().mockRejectedValue(new Error("Server error"))
    render(<TorneoForm onSubmit={mockOnSubmit} />)

    // Fill and submit form
    // ...

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument()
    })
  })

  it("shows loading state during submission", async () => {
    const mockOnSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)))
    render(<TorneoForm onSubmit={mockOnSubmit} />)

    const user = userEvent.setup()

    // Fill and submit
    // ...
    await user.click(screen.getByRole("button", { name: /crear/i }))

    expect(screen.getByRole("button", { name: /creando/i })).toBeDisabled()
  })
})
```

**Key Points:**
- Test rendering of all fields
- Test validation (client-side and server-side)
- Test successful submission
- Test error states
- Test loading states
- Use `userEvent` for realistic interactions

---

### Testing Display Components

**File:** `tests/components/torneos/torneo-card.test.tsx`

```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { TorneoCard } from "@/components/torneos/torneo-card"
import { torneoFixture } from "@/tests/fixtures/torneos"

describe("TorneoCard", () => {
  it("displays torneo information", () => {
    const torneo = torneoFixture()

    render(<TorneoCard torneo={torneo} />)

    expect(screen.getByText(torneo.nombre)).toBeInTheDocument()
    expect(screen.getByText(/equipos/i)).toBeInTheDocument()
    expect(screen.getByText(/activo/i)).toBeInTheDocument()
  })

  it("shows inactive badge when torneo is inactive", () => {
    const torneo = torneoFixture({ activo: false })

    render(<TorneoCard torneo={torneo} />)

    expect(screen.getByText(/finalizado/i)).toBeInTheDocument()
  })

  it("displays fecha_inicio formatted", () => {
    const torneo = torneoFixture({
      fecha_inicio: new Date("2025-07-01"),
    })

    render(<TorneoCard torneo={torneo} />)

    expect(screen.getByText(/1 jul 2025/i)).toBeInTheDocument()
  })
})
```

---

## End-to-End Tests

### Testing Authentication Flow

**File:** `tests/e2e/auth.spec.ts`

```typescript
import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("user can register and login", async ({ page }) => {
    // Navigate to register page
    await page.goto("/register")

    // Fill registration form
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "password123")
    await page.fill('input[name="passwordConfirm"]', "password123")
    await page.click('button[type="submit"]')

    // Should redirect to login with success message
    await expect(page).toHaveURL(/\/login/)
    await expect(page.locator('text=Check your email')).toBeVisible()

    // Login with created account
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL("/")
    await expect(page.locator("h1:has-text('Dashboard')")).toBeVisible()
  })

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/login")

    await page.fill('input[name="email"]', "wrong@example.com")
    await page.fill('input[name="password"]', "wrongpassword")
    await page.click('button[type="submit"]')

    await expect(page.locator("text=Invalid credentials")).toBeVisible()
  })

  test("protects dashboard routes", async ({ page }) => {
    await page.goto("/torneos")

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })
})
```

---

### Testing CRUD Operations

**File:** `tests/e2e/torneos.spec.ts`

```typescript
import { test, expect } from "@playwright/test"

test.describe("Torneos CRUD", () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@goolstar.com")
    await page.fill('input[name="password"]', "admin123")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL("/")
  })

  test("admin can create a torneo", async ({ page }) => {
    // Navigate to torneos
    await page.click('text=Torneos')
    await expect(page).toHaveURL("/torneos")

    // Click create button
    await page.click('text=Crear Torneo')
    await expect(page).toHaveURL("/torneos/nuevo")

    // Fill form
    await page.fill('input[name="nombre"]', "Torneo E2E Test")
    await page.selectOption('select[name="categoria_id"]', { index: 1 })
    await page.fill('input[name="fecha_inicio"]', "2025-07-01")
    await page.fill('input[name="numero_equipos"]', "8")

    // Submit
    await page.click('button[type="submit"]')

    // Should redirect to torneo detail
    await expect(page).toHaveURL(/\/torneos\/[a-f0-9-]+/)
    await expect(page.locator("h1:has-text('Torneo E2E Test')")).toBeVisible()
  })

  test("admin can edit a torneo", async ({ page }) => {
    // Navigate to torneo detail
    await page.goto("/torneos")
    await page.click("text=Torneo E2E Test")

    // Click edit button
    await page.click("text=Editar")

    // Update nombre
    await page.fill('input[name="nombre"]', "Torneo E2E Test (Updated)")
    await page.click('button[type="submit"]')

    // Verify update
    await expect(page.locator("h1:has-text('Torneo E2E Test (Updated)')")).toBeVisible()
  })

  test("admin can delete a torneo", async ({ page }) => {
    await page.goto("/torneos")
    await page.click("text=Torneo E2E Test (Updated)")

    // Click delete button
    await page.click("text=Eliminar")

    // Confirm dialog
    await page.click("button:has-text('Confirmar')")

    // Should redirect to list
    await expect(page).toHaveURL("/torneos")
    await expect(page.locator("text=Torneo E2E Test")).not.toBeVisible()
  })
})
```

---

## Test Configuration

### Vitest Setup

**File:** `vitest.config.ts`

```typescript
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.config.ts",
        "**/*.d.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
})
```

**File:** `tests/setup/vitest.setup.ts`

```typescript
import { expect, afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"
import * as matchers from "@testing-library/jest-dom/matchers"

// Extend Vitest matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key"
```

---

### Playwright Setup

**File:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],

  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## Test Data Fixtures

### Creating Reusable Test Data

**File:** `tests/fixtures/torneos.ts`

```typescript
import type { Torneo } from "@/types/database"

export function torneoFixture(overrides?: Partial<Torneo>): Torneo {
  return {
    id: "123e4567-e89b-12d3-a456-426614174000",
    nombre: "Torneo Verano 2025",
    categoria_id: "categoria-uuid",
    fecha_inicio: new Date("2025-07-01"),
    fecha_fin: new Date("2025-08-31"),
    numero_equipos: 8,
    activo: true,
    created_at: new Date("2025-01-01"),
    updated_at: new Date("2025-01-01"),
    ...overrides,
  }
}

export function torneosFixture(count: number = 3): Torneo[] {
  return Array.from({ length: count }, (_, i) =>
    torneoFixture({
      id: `torneo-${i}`,
      nombre: `Torneo ${i + 1}`,
    })
  )
}
```

---

## Coverage Goals

### Target Coverage

| Type | Target | Priority |
|------|--------|----------|
| Unit Tests (utils) | 95%+ | High |
| Validation Schemas | 100% | High |
| Server Actions | 80%+ | High |
| Components | 70%+ | Medium |
| Pages | 60%+ | Medium |
| E2E Critical Paths | 100% | High |

### Critical Paths to Cover

1. **Authentication** (100% E2E)
   - Registration flow
   - Login flow
   - Logout flow
   - Protected routes

2. **CRUD Operations** (80%+ integration)
   - Create torneo/equipo/jugador/partido
   - Read (list and detail)
   - Update
   - Delete

3. **Business Logic** (95%+ unit)
   - Points calculation
   - Standings sorting
   - Suspension calculation
   - Debt calculation

4. **Forms** (70%+ component)
   - Validation
   - Submission
   - Error handling

---

## Running Tests

### Commands

```bash
# Run all unit tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test:coverage

# Run E2E tests
bun test:e2e

# Run E2E tests in UI mode
bun test:e2e:ui

# Run specific test file
bun test tests/unit/utils/points.test.ts

# Run tests matching pattern
bun test --grep="torneo"
```

### package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

## Best Practices

### 1. Test Organization

- **Group related tests** - Use `describe` blocks
- **Clear test names** - Describe what is being tested
- **AAA pattern** - Arrange, Act, Assert
- **One assertion per test** - Keep tests focused

### 2. Mocking Strategy

- **Mock external dependencies** - Supabase, APIs
- **Don't mock what you're testing** - Test real code
- **Use fixtures for data** - Reusable test data
- **Reset mocks between tests** - Avoid test pollution

### 3. Async Testing

- **Use waitFor** - For async state updates
- **Avoid act() warnings** - Wrap state updates properly
- **Test loading states** - Verify spinners, skeletons
- **Test error states** - Verify error messages

### 4. Accessibility

- **Use semantic queries** - getByRole, getByLabelText
- **Test keyboard navigation** - Tab, Enter, Escape
- **Test screen reader text** - aria-label, aria-describedby
- **Test focus management** - Modal focus trapping

---

## Continuous Integration

### GitHub Actions Workflow

**File:** `.github/workflows/test.yml`

```yaml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bunx playwright install --with-deps
      - run: bun test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Resources

### Documentation
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev/)
- [MSW](https://mswjs.io/)

### Related Files
- [ROADMAP.md](../../ROADMAP.md) - Phase 7 testing deliverables
- [authentication.md](./authentication.md) - Auth testing examples
- [CLAUDE.md](../../CLAUDE.md) - Development patterns

---

**Status:** Planned for Phase 7
**Framework:** Vitest + React Testing Library + Playwright
**Target Coverage:** 80%+
**Last Updated:** 2025-11-22
