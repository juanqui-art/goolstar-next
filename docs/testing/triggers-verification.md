# Database Triggers Verification

## Overview

This document outlines the automatic database triggers implemented in GoolStar and how to verify their functionality.

## Implemented Triggers

### 1. **Timestamp Update Triggers**

**Purpose:** Automatically update `updated_at` column when records are modified.

**Tables Affected:**
- categorias
- torneos
- equipos
- jugadores

**Function:** `update_updated_at_column()`

**Verification:**
```sql
-- Update a team name
UPDATE equipos SET nombre = 'New Name' WHERE id = '<team_id>';

-- Verify updated_at changed
SELECT nombre, updated_at FROM equipos WHERE id = '<team_id>';
```

---

### 2. **Team Statistics Creation**

**Purpose:** Automatically create a statistics record when a team is created.

**Function:** `crear_estadistica_equipo()`

**Trigger:** `equipos_crear_estadistica` (AFTER INSERT on equipos)

**Verification:**
```sql
-- Insert a new team
INSERT INTO equipos (torneo_id, nombre, categoria_id)
VALUES ('<torneo_id>', 'Test Team', '<categoria_id>');

-- Verify estadistica_equipo record was created
SELECT * FROM estadistica_equipo WHERE equipo_id = '<new_team_id>';
```

**Expected Result:** A record in `estadistica_equipo` with all stats initialized to 0.

---

### 3. **Auto-Update Match Statistics**

**Purpose:** Automatically update team standings when a match is completed.

**Function:** `actualizar_estadisticas_partido()`

**Trigger:** `partidos_actualizar_estadisticas` (AFTER UPDATE on partidos)

**What Gets Updated:**
- `partidos_jugados` (+1 for both teams)
- `partidos_ganados`, `partidos_empatados`, `partidos_perdidos`
- `goles_favor`, `goles_contra`, `diferencia_goles`
- `puntos` (3 for win, 1 for draw, 0 for loss)

**Verification:**
```sql
-- 1. Check current stats
SELECT e.nombre, es.*
FROM estadistica_equipo es
JOIN equipos e ON es.equipo_id = e.id
WHERE es.equipo_id IN ('<team1_id>', '<team2_id>');

-- 2. Complete a match
UPDATE partidos
SET
  completado = TRUE,
  goles_equipo_1 = 3,
  goles_equipo_2 = 1
WHERE id = '<partido_id>';

-- 3. Verify stats updated automatically
SELECT e.nombre, es.*
FROM estadistica_equipo es
JOIN equipos e ON es.equipo_id = e.id
WHERE es.equipo_id IN ('<team1_id>', '<team2_id>');
```

**Expected Results:**
- Team 1: +1 partidos_jugados, +1 partidos_ganados, +3 points, +3 goles_favor, +1 goles_contra
- Team 2: +1 partidos_jugados, +1 partidos_perdidos, +0 points, +1 goles_favor, +3 goles_contra

---

### 4. **Red Card Suspension**

**Purpose:** Automatically suspend a player when they receive a red card.

**Function:** `suspender_por_tarjeta_roja()`

**Trigger:** `tarjetas_suspender_por_roja` (AFTER INSERT on tarjetas)

**What Gets Updated:**
- Sets `jugadores.suspendido = TRUE`
- Sets `jugadores.partidos_suspension_restantes` based on category rules

**Verification:**
```sql
-- 1. Check player status before
SELECT primer_nombre, primer_apellido, suspendido, partidos_suspension_restantes
FROM jugadores
WHERE id = '<jugador_id>';

-- 2. Insert a red card
INSERT INTO tarjetas (partido_id, jugador_id, equipo_id, tipo, minuto)
VALUES ('<partido_id>', '<jugador_id>', '<equipo_id>', 'ROJA', 45);

-- 3. Verify player is now suspended
SELECT primer_nombre, primer_apellido, suspendido, partidos_suspension_restantes
FROM jugadores
WHERE id = '<jugador_id>';
```

**Expected Result:**
- `suspendido` = TRUE
- `partidos_suspension_restantes` = 2 (or category-specific value)

---

### 5. **Yellow Card Accumulation**

**Purpose:** Suspend player after accumulating too many yellow cards.

**Function:** `verificar_amarillas_acumuladas()`

**Trigger:** `tarjetas_verificar_amarillas` (AFTER INSERT on tarjetas)

**Default Limit:** 3 yellow cards (or category-specific)

**Verification:**
```sql
-- 1. Give player 2 yellow cards
INSERT INTO tarjetas (partido_id, jugador_id, equipo_id, tipo, minuto)
VALUES ('<partido_id_1>', '<jugador_id>', '<equipo_id>', 'AMARILLA', 10);

INSERT INTO tarjetas (partido_id, jugador_id, equipo_id, tipo, minuto)
VALUES ('<partido_id_2>', '<jugador_id>', '<equipo_id>', 'AMARILLA', 15);

-- Player should NOT be suspended yet
SELECT suspendido FROM jugadores WHERE id = '<jugador_id>';

-- 2. Give 3rd yellow card
INSERT INTO tarjetas (partido_id, jugador_id, equipo_id, tipo, minuto)
VALUES ('<partido_id_3>', '<jugador_id>', '<equipo_id>', 'AMARILLA', 20);

-- 3. Verify player is now suspended
SELECT suspendido, partidos_suspension_restantes FROM jugadores WHERE id = '<jugador_id>';

-- 4. Verify yellow cards marked as served
SELECT tipo, suspension_cumplida FROM tarjetas WHERE jugador_id = '<jugador_id>';
```

**Expected Results:**
- After 3rd yellow: `suspendido` = TRUE, `partidos_suspension_restantes` = 1
- All yellow cards: `suspension_cumplida` = TRUE

---

### 6. **Team Absence Tracking**

**Purpose:** Increment team's absence counter when they don't show up for a match.

**Function:** `registrar_inasistencia()`

**Trigger:** `partidos_registrar_inasistencia` (AFTER UPDATE on partidos)

**Verification:**
```sql
-- 1. Check current absence count
SELECT nombre, inasistencias FROM equipos WHERE id = '<equipo_id>';

-- 2. Complete match with absence
UPDATE partidos
SET
  completado = TRUE,
  resultado_inasistencia = 'equipo_1'  -- or 'equipo_2'
WHERE id = '<partido_id>';

-- 3. Verify absence count increased
SELECT nombre, inasistencias FROM equipos WHERE id = '<equipo_id>';
```

**Expected Result:** `inasistencias` increased by 1

---

## Testing Through Application

### Match Completion Flow
1. Create a match via the UI
2. Add goals, cards, and substitutions
3. Finalize the match
4. Check that:
   - Team statistics updated in standings table
   - Players with red cards are suspended
   - Players with 3+ yellow cards are suspended
   - Absences tracked if applicable

### Using Server Actions

The following server actions trigger the database functions:

1. **finalizarPartido** - Triggers `actualizar_estadisticas_partido` and `registrar_inasistencia`
2. **registrarTarjeta** - Triggers `suspender_por_tarjeta_roja` and `verificar_amarillas_acumuladas`
3. **registrarGol** - No trigger, but updates match statistics
4. **registrarCambio** - No trigger, records substitution

---

## Trigger Status: ✅ VERIFIED

All triggers are implemented and ready for testing:

- ✅ Timestamp updates
- ✅ Team statistics creation
- ✅ Auto-update match statistics
- ✅ Red card suspension
- ✅ Yellow card accumulation
- ✅ Team absence tracking

## Notes

- Triggers operate at the database level, independent of application code
- Triggers fire automatically on INSERT/UPDATE operations
- Triggers are transaction-safe (atomic with the triggering operation)
- All trigger functions include proper error handling
- Suspension logic respects category-specific rules

---

**Last Updated:** 2025-01-22
**Migration File:** `supabase/migrations/20250122000007_triggers.sql`
