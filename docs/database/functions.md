# SQL Functions

Pre-built PostgreSQL functions for complex queries that are used frequently in the application.

## Function 1: Get Tournament Standings

Returns the complete standings table for a tournament, sorted by group and points.

### Definition

```sql
CREATE OR REPLACE FUNCTION get_tabla_posiciones(torneo_uuid UUID)
RETURNS TABLE (
  equipo_id UUID,
  equipo_nombre VARCHAR,
  logo_url TEXT,
  grupo VARCHAR,
  partidos_jugados SMALLINT,
  partidos_ganados SMALLINT,
  partidos_empatados SMALLINT,
  partidos_perdidos SMALLINT,
  goles_favor SMALLINT,
  goles_contra SMALLINT,
  diferencia_goles INTEGER,
  puntos SMALLINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id AS equipo_id,
    e.nombre AS equipo_nombre,
    e.logo_url,
    e.grupo,
    ee.partidos_jugados,
    ee.partidos_ganados,
    ee.partidos_empatados,
    ee.partidos_perdidos,
    ee.goles_favor,
    ee.goles_contra,
    ee.diferencia_goles,
    ee.puntos
  FROM equipos e
  JOIN estadistica_equipo ee ON e.id = ee.equipo_id
  WHERE e.torneo_id = torneo_uuid
    AND e.activo = true
  ORDER BY
    e.grupo ASC,                    -- Group (A, B, C, D)
    ee.puntos DESC,                 -- Most points first
    ee.diferencia_goles DESC,       -- Best goal difference
    ee.goles_favor DESC;            -- Most goals scored (tiebreaker)
END;
$$ LANGUAGE plpgsql;
```

### Usage

```typescript
// In Next.js API route
const { data, error } = await supabase.rpc('get_tabla_posiciones', {
  torneo_uuid: tournamentId
});
```

### Returns

Ordered list of teams with standings, grouped by group phase.

### Example Output

```
| Equipo      | Grupo | PJ | PG | PE | PP | GF | GC | DIF | PTS |
|-------------|-------|----|----|----|----|----|----|-----|-----|
| FC Strikers | A     | 3  | 2  | 1  | 0  | 7  | 2  | +5  | 7   |
| Los Tanos   | A     | 3  | 2  | 0  | 1  | 5  | 3  | +2  | 6   |
| Real Madrid | A     | 3  | 1  | 1  | 1  | 4  | 4  | 0   | 4   |
| ...         | B     | 3  | ...
```

### Performance Notes

- Uses indexed joins on `e.id` and `ee.equipo_id`
- Filters on `e.torneo_id` (indexed)
- Sorting uses indexed columns

---

## Function 2: Calculate Team Debt

Returns the total debt for a team, including registration costs, unpaid fines, and deductions.

### Definition

```sql
CREATE OR REPLACE FUNCTION calcular_deuda_equipo(equipo_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_inscripcion DECIMAL;
  total_abonos DECIMAL;
  deuda_multas DECIMAL;
BEGIN
  -- Get registration cost for the team's category
  SELECT c.costo_inscripcion INTO total_inscripcion
  FROM equipos e
  JOIN categorias c ON e.categoria_id = c.id
  WHERE e.id = equipo_uuid;

  -- Sum all paid amounts
  SELECT COALESCE(SUM(monto), 0) INTO total_abonos
  FROM transacciones_pago
  WHERE equipo_id = equipo_uuid
    AND tipo = 'abono_inscripcion'
    AND es_ingreso = true;

  -- Calculate unpaid fines
  SELECT COALESCE(SUM(
    CASE
      WHEN t.tipo = 'AMARILLA' THEN c.multa_amarilla
      WHEN t.tipo = 'ROJA' THEN c.multa_roja
      ELSE 0
    END
  ), 0) INTO deuda_multas
  FROM tarjetas t
  JOIN jugadores j ON t.jugador_id = j.id
  JOIN equipos e ON j.equipo_id = e.id
  JOIN categorias c ON e.categoria_id = c.id
  WHERE e.id = equipo_uuid
    AND t.pagada = false;

  -- Return total debt (registration + fines) - payments made
  RETURN (total_inscripcion + deuda_multas) - total_abonos;
END;
$$ LANGUAGE plpgsql;
```

### Usage

```typescript
// In Next.js API route
const { data, error } = await supabase.rpc('calcular_deuda_equipo', {
  equipo_uuid: teamId
});

// data = 450.00 (decimal)
```

### Returns

Decimal number representing total debt. Positive = owes money, Negative = has credit.

### Calculation

```
Debt = (RegistrationCost + UnpaidFines) - PaidAmounts

Example:
- Registration: $500
- Unpaid fines (4 yellow @ $2 = $8, 1 red @ $3): $11
- Total owed: $511
- Paid: $150
- Final debt: $511 - $150 = $361
```

### Performance Notes

- Uses indexes on `equipos.id`, `categorias.id`
- Filters on `equipo_id` (indexed)
- Aggregation on indexed columns

---

## Function 3: Get Tournament Top Scorers

Returns the top 10 goal scorers for a tournament.

### Definition

```sql
CREATE OR REPLACE FUNCTION get_jugadores_destacados(torneo_uuid UUID)
RETURNS TABLE (
  jugador_id UUID,
  jugador_nombre VARCHAR,
  equipo_nombre VARCHAR,
  total_goles BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id AS jugador_id,
    CONCAT(j.primer_apellido, ' ', j.primer_nombre) AS jugador_nombre,
    e.nombre AS equipo_nombre,
    COUNT(g.id) AS total_goles
  FROM jugadores j
  JOIN equipos e ON j.equipo_id = e.id
  LEFT JOIN goles g ON j.id = g.jugador_id
  JOIN partidos p ON g.partido_id = p.id
  WHERE e.torneo_id = torneo_uuid
    AND p.completado = true
    AND g.autogol = false
  GROUP BY j.id, e.nombre
  HAVING COUNT(g.id) > 0
  ORDER BY total_goles DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
```

### Usage

```typescript
// In Next.js API route
const { data, error } = await supabase.rpc('get_jugadores_destacados', {
  torneo_uuid: tournamentId
});
```

### Returns

Array of players with their goal count, ordered by goals descending, max 10 results.

### Example Output

```
| Jugador         | Equipo       | Goles |
|-----------------|--------------|-------|
| García, Carlos  | FC Strikers  | 12    |
| López, Juan     | Los Tanos    | 10    |
| Martínez, Pedro | Real Madrid  | 9     |
| ...             | ...          | ...   |
```

### Notes

- Excludes own goals (`g.autogol = false`)
- Only counts completed matches (`p.completado = true`)
- Groups by player and team
- Ordered by total goals, then alphabetically

---

## How to Call Functions from Next.js

### In API Routes

```typescript
// app/api/tournaments/[id]/standings/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const revalidate = 300  // Cache for 5 minutes

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase.rpc('get_tabla_posiciones', {
    torneo_uuid: params.id
  })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}
```

### In Server Actions

```typescript
// actions/tournaments.ts
'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getStandings(tournamentId: string) {
  const supabase = createServerActionClient({ cookies })

  const { data, error } = await supabase.rpc('get_tabla_posiciones', {
    torneo_uuid: tournamentId
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
```

### In Client Components with TanStack Query

```typescript
// hooks/use-standings.ts
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useQuery } from '@tanstack/react-query'

export function useStandings(tournamentId: string) {
  const supabase = createClientComponentClient()

  return useQuery({
    queryKey: ['standings', tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_tabla_posiciones', {
        torneo_uuid: tournamentId
      })

      if (error) throw new Error(error.message)
      return data
    }
  })
}
```

---

## Custom Functions (To Be Created)

Other functions that could be useful:

### Get Team Debt with Details
```sql
CREATE OR REPLACE FUNCTION obtener_deuda_equipo_detallado(equipo_uuid UUID)
RETURNS TABLE (...)
-- Returns debt breakdown by category
```

### Get Player Statistics
```sql
CREATE OR REPLACE FUNCTION obtener_estadisticas_jugador(jugador_uuid UUID)
RETURNS TABLE (...)
-- Goals, assists, cards, matches played
```

### Get Available Referees
```sql
CREATE OR REPLACE FUNCTION obtener_arbitros_disponibles(fecha TIMESTAMPTZ)
RETURNS TABLE (...)
-- Referees not scheduled on given date
```

---

## Performance Optimization

### Indexes Used

The functions rely on these indexes for performance:

```sql
CREATE INDEX idx_equipos_torneo_id ON equipos(torneo_id);
CREATE INDEX idx_estadistica_equipo_torneo ON estadistica_equipo(torneo_id);
CREATE INDEX idx_transacciones_equipo ON transacciones_pago(equipo_id);
CREATE INDEX idx_tarjetas_jugador ON tarjetas(jugador_id);
CREATE INDEX idx_goles_jugador ON goles(jugador_id);
CREATE INDEX idx_partidos_completado ON partidos(completado);
```

### Query Plans

To optimize further, check execution plans:

```sql
EXPLAIN ANALYZE SELECT * FROM get_tabla_posiciones('tournament-id');
EXPLAIN ANALYZE SELECT * FROM calcular_deuda_equipo('team-id');
EXPLAIN ANALYZE SELECT * FROM get_jugadores_destacados('tournament-id');
```

---

## Adding New Functions

To add a new function:

1. Create it in a migration file
2. Test with `EXPLAIN ANALYZE`
3. Create a wrapper in your actions/hooks
4. Update this documentation

Example migration:

```sql
-- supabase/migrations/XXXXX_new_function.sql
CREATE OR REPLACE FUNCTION your_function_name(param UUID)
RETURNS TABLE (...)
AS $$
BEGIN
  -- Implementation
END;
$$ LANGUAGE plpgsql;
```

---

See also:
- [schema.md](schema.md) - Table definitions
- [triggers.md](triggers.md) - Automated operations
- [../CLAUDE.md](../CLAUDE.md) - Development patterns
