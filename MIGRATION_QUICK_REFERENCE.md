# Database Migrations - Quick Reference

## Quick Copy-Paste Guide

For each migration below, copy the entire SQL content and paste into Supabase SQL Editor, then click "Run".

---

## Migration 001: Initial Extensions
**File**: `20250122000001_initial_extensions.sql`
**Time**: ~10 seconds
**What it creates**:
- PostgreSQL extensions: uuid-ossp, pgcrypto
- 6 Enum types: nivel_enum, fase_torneo, tipo_tarjeta, tipo_transaccion, estado_documento, tipo_documento

**Expected result**: No tables yet, just types created

---

## Migration 002: Categories & Tournaments
**File**: `20250122000002_categorias_torneos.sql`
**Time**: ~15 seconds
**What it creates**:
- `categorias` - Tournament categories with pricing rules
- `torneos` - Tournaments with phase configuration
- `fases_eliminatorias` - Knockout phase brackets
- `jornadas` - Group phase match days

**Key tables**:
```
categorias(id, nombre, costo_inscripcion, limite_amarillas, suspension_roja_partidos, ...)
torneos(id, nombre, categoria_id, fecha_inicio, tiene_fase_grupos, tiene_eliminacion_directa, ...)
```

---

## Migration 003: Teams & Players
**File**: `20250122000003_equipos_jugadores.sql`
**Time**: ~20 seconds
**What it creates**:
- `dirigentes` - Team directors/managers
- `equipos` - Teams
- `jugadores` - Players
- `jugador_documentos` - Player document verification
- `arbitros` - Referees

**Key fields**:
- Teams track: status (activo/retirado/suspendido), inasistencias, exclusion
- Players track: suspensions, jersey numbers, position, skill level

---

## Migration 004: Matches & Competition
**File**: `20250122000004_partidos_competicion.sql`
**Time**: ~25 seconds
**What it creates**:
- `partidos` - Matches (with XOR: jornada_id XOR fase_eliminatoria_id)
- `goles` - Goals scored in matches
- `tarjetas` - Yellow/Red cards issued
- `cambios_jugador` - Player substitutions
- `participacion_jugador` - Player participation tracking
- `eventos_partido` - Match events

**CRITICAL CONSTRAINT**:
```sql
-- A match must reference EITHER group phase OR knockout phase, not both
CHECK (
  (jornada_id IS NOT NULL AND fase_eliminatoria_id IS NULL) OR
  (jornada_id IS NULL AND fase_eliminatoria_id IS NOT NULL) OR
  (jornada_id IS NULL AND fase_eliminatoria_id IS NULL)
)
```

---

## Migration 005: Statistics
**File**: `20250122000005_estadisticas.sql`
**Time**: ~15 seconds
**What it creates**:
- `estadistica_equipo` - Team standings (auto-updated by trigger)
  - Fields: PJ (played), PG (won), PE (drew), PP (lost), GF (for), GC (against), puntos
- `llaves_eliminatorias` - Knockout bracket structure
- `mejores_perdedores` - Consolation bracket for losers

---

## Migration 006: Financial System
**File**: `20250122000006_sistema_financiero.sql`
**Time**: ~15 seconds
**What it creates**:
- `transacciones_pago` - All financial transactions
  - Types: abono_inscripcion, pago_arbitro, pago_balon, multa_amarilla, multa_roja, ajuste_manual, devolucion
- `pagos_arbitro` - Referee payment tracking

---

## Migration 007: Database Triggers
**File**: `20250122000007_triggers.sql`
**Time**: ~20 seconds
**What it creates**: 6 Triggers

1. **`update_updated_at_column()`**
   - Auto-updates `updated_at` timestamp on any row modification

2. **`actualizar_estadisticas_partido()`**
   - Recalculates team standings when match is completed
   - Updates: PJ, PG, PE, PP, GF, GC, puntos

3. **`suspender_por_tarjeta_roja()`**
   - When red card issued → Auto-suspends player for suspension_roja_partidos matches

4. **`verificar_amarillas_acumuladas()`**
   - When yellow card issued → Check accumulated count
   - If >= limite_amarillas → Auto-suspend for suspension_roja_partidos matches

5. **`registrar_inasistencia()`**
   - When match has walkover/absence result → Increment team's inasistencia counter

6. **`crear_estadistica_equipo()`**
   - When team created → Auto-create initial stats record with 0 values

---

## Migration 008: SQL Functions
**File**: `20250122000008_functions.sql`
**Time**: ~20 seconds
**What it creates**: 5 Functions

1. **`get_tabla_posiciones(p_torneo_id uuid)`**
   - Returns tournament standings ordered by points, goal difference, goals for
   - Output: teams with their complete statistics

2. **`calcular_deuda_equipo(p_equipo_id uuid)`**
   - Calculates team financial debt
   - Formula: (inscription + unpaid fines) - payments
   - Output: numeric debt amount

3. **`get_jugadores_destacados(p_torneo_id uuid, p_limit int)`**
   - Returns top goal scorers
   - Output: player names, goal count, ordered by goals DESC

4. **`get_resumen_tarjetas_equipo(p_equipo_id uuid, p_torneo_id uuid)`**
   - Returns card summary for team
   - Output: yellow cards, red cards, associated fines

5. **`get_jugadores_suspendidos(p_equipo_id uuid)`**
   - Returns suspended players
   - Output: player names, suspension reason, remaining match count

---

## Migration 009: Row-Level Security (RLS)
**File**: `20250122000009_rls_policies.sql`
**Time**: ~30 seconds
**What it does**:
- Enables RLS on 13 sensitive tables
- Creates access policies by role

**Policies**:

| Role | Access | Tables |
|------|--------|--------|
| Admin | Full CRUD | All tables |
| Dirigente (Team Director) | Own team only | equipos, jugadores, transacciones_pago |
| Public | Read-only | torneos, categorias, estadistica_equipo, partidos (scheduled only) |

**Example Policy**:
```sql
CREATE POLICY "Dirigentes can manage own team"
  ON equipos
  FOR ALL
  USING (dirigente_id = auth.uid())
```

---

## Migration 010: Performance Indexes
**File**: `20250122000010_indexes.sql`
**Time**: ~30 seconds
**What it creates**: 30+ Indexes

**Critical Indexes**:
```sql
-- Match lookups by tournament and date
CREATE INDEX idx_partidos_torneo_id ON partidos(torneo_id);
CREATE INDEX idx_partidos_fecha ON partidos(fecha DESC);

-- Card lookups for suspension checking
CREATE INDEX idx_tarjetas_jugador_id ON tarjetas(jugador_id);

-- Standing calculations
CREATE INDEX idx_estadistica_equipo_puntos ON estadistica_equipo(puntos DESC);

-- Financial queries
CREATE INDEX idx_transacciones_equipo_id ON transacciones_pago(equipo_id);
```

---

## Execution Checklist

- [ ] Migration 001: Initial Extensions ✓
- [ ] Migration 002: Categories & Tournaments ✓
- [ ] Migration 003: Teams & Players ✓
- [ ] Migration 004: Matches & Competition ✓
- [ ] Migration 005: Statistics ✓
- [ ] Migration 006: Financial System ✓
- [ ] Migration 007: Triggers ✓
- [ ] Migration 008: Functions ✓
- [ ] Migration 009: RLS Policies ✓
- [ ] Migration 010: Indexes ✓

**All migrations must be executed in order (001 → 010).**

---

## Verification After All Migrations

Run in Supabase SQL Editor:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
-- Expected: 21 tables

-- Check triggers
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;
-- Expected: 6 triggers

-- Check functions
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
-- Expected: 5 functions
```

---

## If Migration Fails

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| `relation already exists` | Ran migration twice | Safe to ignore if table exists |
| `type already exists` | Enum defined twice | Safe to ignore, verify with query |
| `foreign key violation` | Out of order execution | Must restart from Migration 001 |
| `permission denied` | Not admin role | Ensure logged in as admin |
| `syntax error` | SQL parsing failed | Check for typos in migration file |

---

## Next Steps After All Migrations

1. ✅ All tables exist
2. ✅ All triggers active
3. ✅ All functions available
4. ✅ RLS policies enforced
5. ✅ Indexes created

Then:
1. Enable email auth provider in Supabase Dashboard
2. Run `bun run dev` to test locally
3. Test registration/login flow
4. Begin Phase 2 development

---

**Estimated total time for all 10 migrations**: 5-10 minutes

See `MIGRATION_EXECUTION_GUIDE.md` for detailed step-by-step instructions.
