# Database Migration Execution Guide

This document provides step-by-step instructions to execute the 10 database migrations in Supabase Cloud.

## Prerequisites

- Supabase Cloud project created: `goolstar-next`
- Project ID: `omvpzlbbfwkyqwbwqnjf`
- All migration files present in `/supabase/migrations/`

## Execution Steps

### Step 1: Access Supabase Dashboard

1. Go to https://app.supabase.com
2. Select the `goolstar-next` project
3. Navigate to the **SQL Editor** section (left sidebar)

### Step 2: Execute Migrations in Order

Execute the migrations in **STRICT ORDER** (001 → 010). Each migration depends on previous ones.

#### Migration 001: Initial Extensions
- File: `20250122000001_initial_extensions.sql`
- What it does: Creates PostgreSQL extensions and defines all enum types
- **Action**:
  1. Open `20250122000001_initial_extensions.sql` from the project
  2. Copy all SQL content
  3. In Supabase SQL Editor, paste and click "Run"
  4. Verify: No errors appear

#### Migration 002: Categories & Tournaments
- File: `20250122000002_categorias_torneos.sql`
- What it does: Creates tournament structure (categorias, torneos, fases_eliminatorias, jornadas)
- **Action**:
  1. Copy all SQL from `20250122000002_categorias_torneos.sql`
  2. Paste in SQL Editor and click "Run"
  3. Verify: Tables created successfully

#### Migration 003: Teams & Players
- File: `20250122000003_equipos_jugadores.sql`
- What it does: Creates team and player tables with document verification workflow
- **Action**:
  1. Copy and execute SQL
  2. Verify: 5 new tables created (dirigentes, equipos, jugadores, jugador_documentos, arbitros)

#### Migration 004: Matches & Competition
- File: `20250122000004_partidos_competicion.sql`
- What it does: Complete match data model with goals, cards, substitutions, events
- **Action**:
  1. Copy and execute SQL
  2. Verify: 6 new tables created
  3. **CRITICAL**: This migration includes the XOR constraint ensuring a match references EITHER group phase OR knockout phase

#### Migration 005: Statistics
- File: `20250122000005_estadisticas.sql`
- What it does: Standings table (updated by triggers) and knockout bracket management
- **Action**:
  1. Copy and execute SQL
  2. Verify: 3 new tables created

#### Migration 006: Financial System
- File: `20250122000006_sistema_financiero.sql`
- What it does: Transaction tracking and referee payments
- **Action**:
  1. Copy and execute SQL
  2. Verify: 2 new tables created

#### Migration 007: Database Triggers
- File: `20250122000007_triggers.sql`
- What it does: Creates 6 triggers that automate:
  - `updated_at` timestamp updates
  - Team statistics recalculation on match completion
  - Player suspension on red card
  - Player suspension on accumulated yellow cards
  - Team absence counter increment
  - Initial stats record creation for teams
- **Action**:
  1. Copy and execute SQL
  2. Verify: 6 triggers created (check under Database > Triggers in dashboard)

#### Migration 008: SQL Functions
- File: `20250122000008_functions.sql`
- What it does: Creates 5 utility functions:
  - `get_tabla_posiciones()`: Tournament standings
  - `calcular_deuda_equipo()`: Team debt calculation
  - `get_jugadores_destacados()`: Top goal scorers
  - `get_resumen_tarjetas_equipo()`: Card summary with fines
  - `get_jugadores_suspendidos()`: Suspended players list
- **Action**:
  1. Copy and execute SQL
  2. Verify: 5 functions created (check under Database > Functions in dashboard)

#### Migration 009: Row-Level Security (RLS)
- File: `20250122000009_rls_policies.sql`
- What it does: Enables RLS on sensitive tables and creates access policies:
  - Admin: Full access
  - Dirigente (Team Director): Can manage own team
  - Public: Read-only for tournaments, standings, matches
- **Action**:
  1. Copy and execute SQL
  2. Verify: RLS policies created (check under Database > Policies in dashboard)

#### Migration 010: Performance Indexes
- File: `20250122000010_indexes.sql`
- What it does: Creates 30+ indexes optimizing:
  - Match lookups by tournament and date
  - Card lookups by player
  - Standing calculations
  - Financial transaction queries
- **Action**:
  1. Copy and execute SQL
  2. Verify: Indexes created (check under Database > Indexes in dashboard)

## Verification Checklist

After executing all 10 migrations, verify the schema:

- [ ] **Tables**: 21 tables created
  - categorias, torneos, fases_eliminatorias, jornadas
  - dirigentes, equipos, jugadores, jugador_documentos, arbitros
  - partidos, goles, tarjetas, cambios_jugador, participacion_jugador, eventos_partido
  - estadistica_equipo, llaves_eliminatorias, mejores_perdedores, eventos_torneo
  - transacciones_pago, pagos_arbitro

- [ ] **Triggers**: 6 triggers active
- [ ] **Functions**: 5 functions available
- [ ] **RLS Enabled**: On sensitive tables (torneos, equipos, jugadores, partidos, transacciones_pago)
- [ ] **Indexes**: 30+ indexes created

## Testing the Schema

### Test 1: Verify Tables Exist

In SQL Editor, run:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected: Should see all 21 tables listed

### Test 2: Verify Functions Exist

In SQL Editor, run:
```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

Expected: Should see 5 functions (get_tabla_posiciones, calcular_deuda_equipo, etc.)

### Test 3: Verify Triggers Exist

In SQL Editor, run:
```sql
SELECT trigger_name, trigger_schema
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;
```

Expected: Should see 6 triggers (update_updated_at_column, actualizar_estadisticas_partido, etc.)

### Test 4: Test Sample Data

After migrations, test inserting sample data:

```sql
-- Create a test category
INSERT INTO categorias (nombre, costo_inscripcion, limite_amarillas, suspension_roja_partidos, multa_amarilla, multa_roja, pago_arbitro, limite_inasistencias)
VALUES ('Test Category', 100000, 3, 2, 10000, 20000, 50000, 3)
RETURNING id;

-- Use the returned category_id in the next query
-- Create a test tournament (replace category_id_from_above with actual ID)
INSERT INTO torneos (nombre, categoria_id, fecha_inicio, fecha_fin, tiene_fase_grupos, tiene_eliminacion_directa)
VALUES ('Test Tournament', 'category_id_from_above', NOW(), NOW() + INTERVAL '1 month', true, false)
RETURNING id;
```

If both inserts succeed without errors, the schema is working correctly.

## Troubleshooting

### Error: "relation already exists"
- **Cause**: Migration was already executed
- **Fix**: This is safe to ignore if the schema is already correct. Verify tables exist using Test 1 above.

### Error: "type ... already exists"
- **Cause**: Enum type already defined (from Migration 001)
- **Fix**: This is safe to ignore. Verify enums exist using SQL Editor.

### Error: "function ... already exists"
- **Cause**: Function already created (from Migration 008)
- **Fix**: This is safe to ignore. Verify functions exist using Test 3 above.

### Error: "Missing Foreign Key"
- **Cause**: Migrations were executed out of order
- **Fix**:
  1. Contact Supabase support to reset the database
  2. Start over from Migration 001 in strict order

## Next Steps

Once all 10 migrations are successfully executed:

1. **Regenerate TypeScript Types** (optional):
   ```bash
   supabase gen types typescript --project-id omvpzlbbfwkyqwbwqnjf > types/database.ts
   ```
   (If Supabase CLI login is configured)

2. **Enable Email Auth**:
   - Go to Authentication > Providers
   - Enable Email Provider
   - Set Redirect URL: `http://localhost:3000/auth/callback`

3. **Test Locally**:
   ```bash
   bun run dev
   ```
   - Navigate to http://localhost:3000/login
   - Try registration and login flows

4. **Begin Development**:
   - Start implementing Phase 1 features
   - Use TypeScript types for type-safe database queries

## Reference Files

- **Migrations**: `/supabase/migrations/` (10 files)
- **Config**: `/supabase/config.toml`
- **Environment**: `/env.local` (with credentials)
- **TypeScript Types**: `/types/database.ts` (auto-generated)
- **Supabase Client**: `/lib/supabase/client.ts` (browser) and `/lib/supabase/server.ts` (server)

## Questions?

If migrations fail or schema looks incorrect, review:
1. Are migrations executed in order (001 → 010)?
2. Did any migration show errors in Supabase SQL Editor?
3. Are all enum types defined (from Migration 001)?
4. Do foreign keys reference existing tables?
