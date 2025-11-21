# Database Triggers

Automated database operations for GoolStar. These triggers handle critical business logic at the database level to ensure data consistency.

## Trigger 1: Auto-Update Statistics on Match Completion

When a match is marked as complete, automatically update both teams' standings.

### Function

```sql
CREATE OR REPLACE FUNCTION actualizar_estadisticas_partido()
RETURNS TRIGGER AS $$
BEGIN
  -- Only execute if match just transitioned from incomplete to complete
  IF NEW.completado = true AND OLD.completado = false THEN

    -- Update TEAM 1 statistics
    UPDATE estadistica_equipo
    SET
      partidos_jugados = partidos_jugados + 1,
      goles_favor = goles_favor + NEW.goles_equipo_1,
      goles_contra = goles_contra + NEW.goles_equipo_2,
      diferencia_goles = (goles_favor + NEW.goles_equipo_1) - (goles_contra + NEW.goles_equipo_2),
      puntos = puntos + CASE
        WHEN NEW.goles_equipo_1 > NEW.goles_equipo_2 THEN 3  -- Win
        WHEN NEW.goles_equipo_1 = NEW.goles_equipo_2 THEN 1  -- Draw
        ELSE 0  -- Loss
      END,
      partidos_ganados = partidos_ganados + CASE
        WHEN NEW.goles_equipo_1 > NEW.goles_equipo_2 THEN 1 ELSE 0
      END,
      partidos_empatados = partidos_empatados + CASE
        WHEN NEW.goles_equipo_1 = NEW.goles_equipo_2 THEN 1 ELSE 0
      END,
      partidos_perdidos = partidos_perdidos + CASE
        WHEN NEW.goles_equipo_1 < NEW.goles_equipo_2 THEN 1 ELSE 0
      END
    WHERE equipo_id = NEW.equipo_1_id;

    -- Update TEAM 2 statistics (inverse logic)
    UPDATE estadistica_equipo
    SET
      partidos_jugados = partidos_jugados + 1,
      goles_favor = goles_favor + NEW.goles_equipo_2,
      goles_contra = goles_contra + NEW.goles_equipo_1,
      diferencia_goles = (goles_favor + NEW.goles_equipo_2) - (goles_contra + NEW.goles_equipo_1),
      puntos = puntos + CASE
        WHEN NEW.goles_equipo_2 > NEW.goles_equipo_1 THEN 3  -- Win
        WHEN NEW.goles_equipo_2 = NEW.goles_equipo_1 THEN 1  -- Draw
        ELSE 0  -- Loss
      END,
      partidos_ganados = partidos_ganados + CASE
        WHEN NEW.goles_equipo_2 > NEW.goles_equipo_1 THEN 1 ELSE 0
      END,
      partidos_empatados = partidos_empatados + CASE
        WHEN NEW.goles_equipo_2 = NEW.goles_equipo_1 THEN 1 ELSE 0
      END,
      partidos_perdidos = partidos_perdidos + CASE
        WHEN NEW.goles_equipo_2 < NEW.goles_equipo_1 THEN 1 ELSE 0
      END
    WHERE equipo_id = NEW.equipo_2_id;

    -- Track absences if either team didn't show up
    IF NEW.inasistencia_equipo_1 THEN
      UPDATE equipos SET inasistencias = inasistencias + 1 WHERE id = NEW.equipo_1_id;
    END IF;

    IF NEW.inasistencia_equipo_2 THEN
      UPDATE equipos SET inasistencias = inasistencias + 1 WHERE id = NEW.equipo_2_id;
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_estadisticas
AFTER UPDATE ON partidos
FOR EACH ROW
EXECUTE FUNCTION actualizar_estadisticas_partido();
```

### When It Fires

- **Event**: UPDATE on `partidos` table
- **Condition**: `completado` changes from `false` to `true`
- **Timing**: AFTER the update completes

### What It Does

1. Increments `partidos_jugados` for both teams
2. Adds goals to `goles_favor` and `goles_contra`
3. Recalculates `diferencia_goles` (goal difference)
4. Awards points (3 for win, 1 for draw, 0 for loss)
5. Updates win/draw/loss counters
6. Increments absence counter if team didn't show up

### Example

When you update partidos set completado=true, goles_equipo_1=2, goles_equipo_2=1:
- Team 1: +1 game, +2 goals for, +1 goal against, +1 goal diff, +3 points (win)
- Team 2: +1 game, +1 goal for, +2 goals against, -1 goal diff, +0 points (loss)

---

## Trigger 2: Suspend Player on Red Card

When a red card is issued, automatically suspend the player for the configured number of matches.

### Function

```sql
CREATE OR REPLACE FUNCTION suspender_por_tarjeta_roja()
RETURNS TRIGGER AS $$
DECLARE
  categoria_id UUID;
  partidos_suspension SMALLINT;
BEGIN
  -- Only process for red cards
  IF NEW.tipo = 'ROJA' THEN

    -- Get the tournament category to know suspension length
    SELECT e.categoria_id INTO categoria_id
    FROM jugadores j
    JOIN equipos e ON j.equipo_id = e.id
    WHERE j.id = NEW.jugador_id;

    -- Get configured red card suspension (from category)
    SELECT partidos_suspension_roja INTO partidos_suspension
    FROM categorias
    WHERE id = categoria_id;

    -- Suspend the player
    UPDATE jugadores
    SET
      suspendido = true,
      partidos_suspension_restantes = partidos_suspension
    WHERE id = NEW.jugador_id;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_suspender_por_roja
AFTER INSERT ON tarjetas
FOR EACH ROW
EXECUTE FUNCTION suspender_por_tarjeta_roja();
```

### When It Fires

- **Event**: INSERT into `tarjetas` table
- **Condition**: `tipo` = 'ROJA'
- **Timing**: AFTER the card is inserted

### What It Does

1. Looks up the player's tournament category
2. Gets the configured suspension length for red cards (typically 2 matches)
3. Sets `suspendido = true`
4. Sets `partidos_suspension_restantes` to the configured value

### Example

When a player gets a red card in a VARONES tournament where red cards = 2-match suspension:
- `suspendido` → true
- `partidos_suspension_restantes` → 2

The player cannot play in the next 2 matches.

---

## Trigger 3: Verify Yellow Card Accumulation

When a yellow card is issued, check if the player has reached the accumulation limit. If so, automatically suspend them.

### Function

```sql
CREATE OR REPLACE FUNCTION verificar_amarillas_acumuladas()
RETURNS TRIGGER AS $$
DECLARE
  categoria_id UUID;
  limite_amarillas SMALLINT;
  total_amarillas INTEGER;
BEGIN
  -- Only process for yellow cards
  IF NEW.tipo = 'AMARILLA' THEN

    -- Get the tournament category
    SELECT e.categoria_id INTO categoria_id
    FROM jugadores j
    JOIN equipos e ON j.equipo_id = e.id
    WHERE j.id = NEW.jugador_id;

    -- Get configured limit (typically 3)
    SELECT limite_amarillas_suspension INTO limite_amarillas
    FROM categorias
    WHERE id = categoria_id;

    -- Count non-served yellow cards
    SELECT COUNT(*) INTO total_amarillas
    FROM tarjetas
    WHERE jugador_id = NEW.jugador_id
      AND tipo = 'AMARILLA'
      AND suspension_cumplida = false;

    -- If limit reached, suspend the player for 1 match
    IF total_amarillas >= limite_amarillas THEN
      UPDATE jugadores
      SET
        suspendido = true,
        partidos_suspension_restantes = 1
      WHERE id = NEW.jugador_id;

      -- Mark all unserved yellows as "processed"
      UPDATE tarjetas
      SET suspension_cumplida = true
      WHERE jugador_id = NEW.jugador_id
        AND tipo = 'AMARILLA'
        AND suspension_cumplida = false;
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_verificar_amarillas
AFTER INSERT ON tarjetas
FOR EACH ROW
EXECUTE FUNCTION verificar_amarillas_acumuladas();
```

### When It Fires

- **Event**: INSERT into `tarjetas` table
- **Condition**: `tipo` = 'AMARILLA'
- **Timing**: AFTER the card is inserted

### What It Does

1. Looks up the player's tournament category
2. Gets the configured yellow card accumulation limit (typically 3)
3. Counts unserved yellow cards for that player
4. If count >= limit:
   - Sets `suspendido = true`
   - Sets `partidos_suspension_restantes = 1`
   - Marks all yellow cards as `suspension_cumplida = true` (so they don't count again)

### Example

Scenario: Category limit is 3 yellow cards per match

**Yellow card 1**: Count = 1, no action
**Yellow card 2**: Count = 2, no action
**Yellow card 3**: Count = 3 >= limit → Suspend for 1 match, mark all 3 as served

After the player plays (sits out) 1 match, suspension is completed.

### Important Note

Yellow cards reset after the suspension is served. They don't carry over to the next phase or season.

---

## Trigger 4: Create Statistics Record on Team Creation

When a team is created, automatically create an associated statistics record.

### Function

```sql
CREATE OR REPLACE FUNCTION crear_estadistica_equipo()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new stats record when team is created
  INSERT INTO estadistica_equipo (equipo_id, torneo_id)
  VALUES (NEW.id, NEW.torneo_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_crear_estadistica
AFTER INSERT ON equipos
FOR EACH ROW
EXECUTE FUNCTION crear_estadistica_equipo();
```

### When It Fires

- **Event**: INSERT into `equipos` table
- **Condition**: Always (no condition)
- **Timing**: AFTER the team is created

### What It Does

Creates a new row in `estadistica_equipo` with:
- `equipo_id` = newly created team
- `torneo_id` = team's tournament
- All stats initialized to 0 (default values)

### Example

When you create a team in a tournament:
```
INSERT INTO equipos (nombre, torneo_id, ...) VALUES ('FC Strikers', '123abc', ...)
```

Automatically creates:
```
INSERT INTO estadistica_equipo (equipo_id, torneo_id)
VALUES ('456def', '123abc')
-- stats default to 0
```

---

## Utility Trigger: Update Timestamps

Keep `updated_at` columns current automatically.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_categorias_updated_at
  BEFORE UPDATE ON categorias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_torneos_updated_at
  BEFORE UPDATE ON torneos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipos_updated_at
  BEFORE UPDATE ON equipos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jugadores_updated_at
  BEFORE UPDATE ON jugadores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estadistica_equipo_updated_at
  BEFORE UPDATE ON estadistica_equipo
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ... and so on for other tables with updated_at
```

---

## Trigger Execution Order

When a match is completed with card issuances, triggers fire in this order:

1. **UPDATE partidos SET completado=true**
   → `trigger_actualizar_estadisticas` fires
   → Team standings updated

2. **INSERT INTO tarjetas (tipo='ROJA')**
   → `trigger_suspender_por_roja` fires (if red card)
   → Player marked suspended

3. **INSERT INTO tarjetas (tipo='AMARILLA')**
   → `trigger_verificar_amarillas` fires (if yellow)
   → Check accumulation, suspend if threshold met

---

## Important Considerations

### Data Consistency

All triggers use AFTER events to ensure the main operation completes before cascading updates. This prevents partial failures.

### Performance

Triggers are indexed on:
- `partidos.completado`
- `tarjetas.tipo`
- `tarjetas.jugador_id`
- `jugadores.suspendido`

This ensures fast lookups when triggers execute.

### Testing Triggers

To verify triggers work:

```sql
-- Test 1: Complete a match
UPDATE partidos
SET completado=true, goles_equipo_1=2, goles_equipo_2=1
WHERE id='match-uuid';

-- Check estadistica_equipo was updated
SELECT * FROM estadistica_equipo WHERE equipo_id='team-uuid';

-- Test 2: Issue a red card
INSERT INTO tarjetas (partido_id, jugador_id, tipo)
VALUES ('match-uuid', 'player-uuid', 'ROJA');

-- Check player is suspended
SELECT suspendido, partidos_suspension_restantes FROM jugadores
WHERE id='player-uuid';
```

---

## Disabling/Modifying Triggers

**CAUTION:** Triggers are critical for data integrity. Only modify if you know what you're doing.

```sql
-- Temporarily disable a trigger
ALTER TABLE partidos DISABLE TRIGGER trigger_actualizar_estadisticas;

-- Re-enable
ALTER TABLE partidos ENABLE TRIGGER trigger_actualizar_estadisticas;

-- Drop trigger
DROP TRIGGER trigger_actualizar_estadisticas ON partidos;
```

---

See also:
- [schema.md](schema.md) - Table definitions
- [functions.md](functions.md) - Complex queries
- [../CLAUDE.md](../CLAUDE.md) - Development patterns
