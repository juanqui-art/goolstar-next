# Row Level Security (RLS) Policies

**Migration:** `supabase/migrations/20250122000009_rls_policies.sql`
**Last Updated:** 2025-11-22

---

## Overview

GoolStar uses PostgreSQL Row Level Security (RLS) to enforce role-based access control at the database level. This ensures that users can only access and modify data they're authorized to see, even if the application logic is bypassed.

### Security Model

**Three User Roles:**
1. **Admin** - Full access to all data (tournament organizers)
2. **Team Director (dirigente)** - Manage own team and players
3. **Public/Player** - Read-only access to most data

**Role Storage:**
- User role is stored in `auth.users.raw_user_meta_data->>'role'`
- Team director is linked via `equipos.dirigente_id = auth.uid()`
- Checked on every query via RLS policies

---

## Tables with RLS Enabled

All sensitive tables have RLS enabled:

- ✅ `categorias` - Tournament categories
- ✅ `torneos` - Tournaments
- ✅ `equipos` - Teams
- ✅ `jugadores` - Players
- ✅ `partidos` - Matches
- ✅ `goles` - Goals
- ✅ `tarjetas` - Cards (yellow/red)
- ✅ `cambios_jugador` - Player substitutions
- ✅ `participacion_jugador` - Player participation
- ✅ `estadistica_equipo` - Team statistics
- ✅ `transacciones_pago` - Financial transactions
- ✅ `jugador_documentos` - Player documents

---

## Policy Patterns

### Pattern 1: Public Read, Admin Write

**Applied to:** `categorias`, `torneos`, `partidos`, `goles`, `tarjetas`

**Rationale:** Everyone needs to see tournament data, but only admins can create/modify it.

```sql
-- Read: Anyone can SELECT
CREATE POLICY table_select_all ON table_name
  FOR SELECT
  USING (true);

-- Write: Only admins can INSERT/UPDATE
CREATE POLICY table_insert_admin ON table_name
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );
```

**Use Cases:**
- Viewing tournament schedules
- Checking match results
- Seeing card statistics
- Browsing categories

---

### Pattern 2: Public Read, Director Write Own Team

**Applied to:** `equipos`, `jugadores`

**Rationale:** Everyone can see teams/players, but directors can only modify their own.

```sql
-- Read: Anyone can SELECT
CREATE POLICY equipos_select_all ON equipos
  FOR SELECT
  USING (true);

-- Write: Director or Admin
CREATE POLICY equipos_update_director ON equipos
  FOR UPDATE
  USING (
    dirigente_id = auth.uid()  -- Director owns this team
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );
```

**Use Cases:**
- Director updates team name/logo
- Director adds players to roster
- Director updates player info
- Admin manages any team

---

### Pattern 3: Restricted Read, Admin Write

**Applied to:** `transacciones_pago`

**Rationale:** Financial data is sensitive - only show to team directors and admins.

```sql
CREATE POLICY transacciones_pago_select_director ON transacciones_pago
  FOR SELECT
  USING (
    -- Directors can see own team transactions
    EXISTS (
      SELECT 1 FROM equipos e
      WHERE e.id = equipo_id
        AND e.dirigente_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );
```

**Use Cases:**
- Director views own team payments
- Admin views all financial data
- Regular users cannot see transactions

---

### Pattern 4: Public Read, No Write (Auto-Update Only)

**Applied to:** `estadistica_equipo`

**Rationale:** Statistics are calculated by triggers - no manual updates allowed.

```sql
CREATE POLICY estadistica_equipo_select_all ON estadistica_equipo
  FOR SELECT
  USING (true);

-- No INSERT/UPDATE policies = triggers only
```

**Use Cases:**
- Viewing standings table
- Checking team statistics
- No manual modification possible

---

## Detailed Policies by Table

### 1. Categorias (Tournament Categories)

**Access Model:** Public Read, Admin Write

| Operation | Who Can Access | Policy Name |
|-----------|----------------|-------------|
| SELECT | Everyone | `categorias_select_all` |
| INSERT | Admin only | `categorias_insert_admin` |
| UPDATE | Admin only | `categorias_update_admin` |
| DELETE | No policy (restricted) | - |

**Example Queries:**
```sql
-- ✅ Anyone can read categories
SELECT * FROM categorias;

-- ✅ Admin can create category
INSERT INTO categorias (nombre, precio_inscripcion)
VALUES ('Sub-17', 150000);

-- ❌ Non-admin INSERT fails
-- Error: new row violates row-level security policy
```

---

### 2. Torneos (Tournaments)

**Access Model:** Public Read, Admin Write

| Operation | Who Can Access | Policy Name |
|-----------|----------------|-------------|
| SELECT | Everyone | `torneos_select_all` |
| INSERT | Admin only | `torneos_insert_admin` |
| UPDATE | Admin only | `torneos_update_admin` |
| DELETE | No policy (restricted) | - |

**Example Queries:**
```sql
-- ✅ Anyone can view tournaments
SELECT * FROM torneos WHERE activo = true;

-- ✅ Admin can create tournament
INSERT INTO torneos (nombre, categoria_id, fecha_inicio)
VALUES ('Torneo Verano 2025', 'uuid', '2025-07-01');

-- ❌ Non-admin UPDATE fails
UPDATE torneos SET activo = false WHERE id = 'uuid';
```

---

### 3. Equipos (Teams)

**Access Model:** Public Read, Director/Admin Write

| Operation | Who Can Access | Policy Name |
|-----------|----------------|-------------|
| SELECT | Everyone | `equipos_select_all` |
| INSERT | Admin only | `equipos_insert_admin` |
| UPDATE | Director (own team) or Admin | `equipos_update_director` |
| DELETE | No policy (restricted) | - |

**Example Queries:**
```sql
-- ✅ Anyone can view teams
SELECT * FROM equipos WHERE torneo_id = 'uuid';

-- ✅ Admin can create team
INSERT INTO equipos (nombre, torneo_id, dirigente_id)
VALUES ('Los Tigres', 'torneo-uuid', 'user-uuid');

-- ✅ Director can update own team
UPDATE equipos
SET nombre = 'Los Tigres FC'
WHERE id = 'equipo-uuid' AND dirigente_id = auth.uid();

-- ❌ Director cannot update another team
UPDATE equipos
SET nombre = 'Hacked'
WHERE dirigente_id != auth.uid();  -- Fails silently (0 rows updated)
```

---

### 4. Jugadores (Players)

**Access Model:** Public Read, Director/Admin Write

| Operation | Who Can Access | Policy Name |
|-----------|----------------|-------------|
| SELECT | Everyone | `jugadores_select_all` |
| INSERT | Director (own team) or Admin | `jugadores_insert_director` |
| UPDATE | Director (own team) or Admin | `jugadores_update_director` |
| DELETE | No policy (restricted) | - |

**Example Queries:**
```sql
-- ✅ Anyone can view players
SELECT * FROM jugadores WHERE equipo_id = 'uuid';

-- ✅ Director can add player to own team
INSERT INTO jugadores (nombre, equipo_id, dorsal)
VALUES ('Juan Pérez', 'my-team-uuid', 10);

-- ✅ Director can update own team player
UPDATE jugadores
SET dorsal = 11
WHERE id = 'jugador-uuid'
  AND equipo_id IN (
    SELECT id FROM equipos WHERE dirigente_id = auth.uid()
  );

-- ❌ Director cannot add player to another team
INSERT INTO jugadores (nombre, equipo_id, dorsal)
VALUES ('Hacker', 'other-team-uuid', 99);  -- Fails RLS check
```

---

### 5. Partidos (Matches)

**Access Model:** Public Read, Admin Write

| Operation | Who Can Access | Policy Name |
|-----------|----------------|-------------|
| SELECT | Everyone | `partidos_select_all` |
| INSERT | Admin only | `partidos_insert_admin` |
| UPDATE | Admin only | `partidos_update_admin` |
| DELETE | No policy (restricted) | - |

**Example Queries:**
```sql
-- ✅ Anyone can view match results
SELECT * FROM partidos WHERE torneo_id = 'uuid' ORDER BY fecha DESC;

-- ✅ Admin can create/update matches
INSERT INTO partidos (torneo_id, equipo_local_id, equipo_visitante_id, fecha)
VALUES ('torneo-uuid', 'team1-uuid', 'team2-uuid', '2025-07-15');

-- ❌ Non-admin cannot modify match results
UPDATE partidos SET goles_local = 5 WHERE id = 'uuid';  -- Fails
```

---

### 6. Goles (Goals)

**Access Model:** Public Read, Admin Write

| Operation | Who Can Access | Policy Name |
|-----------|----------------|-------------|
| SELECT | Everyone | `goles_select_all` |
| INSERT | Admin only | `goles_insert_admin` |
| UPDATE | No policy | - |
| DELETE | No policy | - |

**Use Case:** Admins record goals during match data entry.

---

### 7. Tarjetas (Cards - Yellow/Red)

**Access Model:** Public Read, Admin Write

| Operation | Who Can Access | Policy Name |
|-----------|----------------|-------------|
| SELECT | Everyone | `tarjetas_select_all` |
| INSERT | Admin only | `tarjetas_insert_admin` |
| UPDATE | No policy | - |
| DELETE | No policy | - |

**Use Case:** Admins record cards; triggers automatically suspend players.

---

### 8. Estadistica_Equipo (Team Statistics)

**Access Model:** Public Read, Trigger Write Only

| Operation | Who Can Access | Policy Name |
|-----------|----------------|-------------|
| SELECT | Everyone | `estadistica_equipo_select_all` |
| INSERT | Trigger only (no policy) | - |
| UPDATE | Trigger only (no policy) | - |
| DELETE | No policy | - |

**Important:** No manual write policies exist. Only the `actualizar_estadisticas_equipo()` trigger can modify this table.

**Use Case:** Automatically updated standings/statistics after each match.

---

### 9. Transacciones_Pago (Financial Transactions)

**Access Model:** Director/Admin Read, Admin Write

| Operation | Who Can Access | Policy Name |
|-----------|----------------|-------------|
| SELECT | Director (own team) or Admin | `transacciones_pago_select_director` |
| INSERT | Admin only | `transacciones_pago_insert_admin` |
| UPDATE | No policy (restricted) | - |
| DELETE | No policy (restricted) | - |

**Example Queries:**
```sql
-- ✅ Director can see own team transactions
SELECT * FROM transacciones_pago
WHERE equipo_id IN (
  SELECT id FROM equipos WHERE dirigente_id = auth.uid()
);

-- ✅ Admin can see all transactions
SELECT * FROM transacciones_pago;  -- Returns all if admin

-- ❌ Director cannot see other team transactions
SELECT * FROM transacciones_pago WHERE equipo_id = 'other-team';
-- Returns 0 rows (filtered by RLS)

-- ✅ Admin can record payments
INSERT INTO transacciones_pago (equipo_id, monto, tipo)
VALUES ('team-uuid', 150000, 'inscripcion');
```

---

### 10. Jugador_Documentos (Player Documents)

**Access Model:** Player/Admin Read, Director/Admin Write

| Operation | Who Can Access | Policy Name |
|-----------|----------------|-------------|
| SELECT | Player (own docs) or Admin | `jugador_documentos_select_player` |
| INSERT | Director (own team) or Admin | `jugador_documentos_insert_director` |
| UPDATE | No policy | - |
| DELETE | No policy | - |

**Example Queries:**
```sql
-- ✅ Player can see own documents
SELECT * FROM jugador_documentos
WHERE jugador_id IN (
  SELECT id FROM jugadores WHERE id = 'my-player-uuid'
);

-- ✅ Director can upload documents for own team players
INSERT INTO jugador_documentos (jugador_id, tipo_documento, storage_path)
VALUES ('player-uuid', 'cedula', 'documents/cedula-123.pdf');

-- ❌ Director cannot upload docs for other teams
INSERT INTO jugador_documentos (jugador_id, tipo_documento, storage_path)
VALUES ('other-team-player-uuid', 'cedula', 'fake.pdf');  -- Fails RLS
```

---

## Admin Role Setup

### How to Grant Admin Role

When a user signs up, set their role in metadata:

```typescript
// During registration (Server Action)
const { data, error } = await supabase.auth.signUp({
  email: 'admin@goolstar.com',
  password: 'securepassword',
  options: {
    data: {
      role: 'admin',  // ← Sets raw_user_meta_data->>'role'
    },
  },
});
```

### Checking Current User Role

```sql
-- In SQL query
SELECT raw_user_meta_data->>'role' as user_role
FROM auth.users
WHERE id = auth.uid();

-- In TypeScript
const { data: { user } } = await supabase.auth.getUser();
const userRole = user?.user_metadata?.role;
```

---

## Testing RLS Policies

### Test as Admin

```sql
-- Set role in session
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE id = auth.uid();

-- Now test admin operations
INSERT INTO torneos (nombre, categoria_id) VALUES (...);
-- ✅ Should succeed
```

### Test as Director

```sql
-- Create test director account and link to team
INSERT INTO equipos (nombre, torneo_id, dirigente_id)
VALUES ('Test Team', 'torneo-uuid', auth.uid());

-- Try to update own team
UPDATE equipos SET nombre = 'Updated Name'
WHERE dirigente_id = auth.uid();
-- ✅ Should succeed

-- Try to update another team
UPDATE equipos SET nombre = 'Hacked'
WHERE dirigente_id != auth.uid();
-- ❌ Should fail (0 rows updated)
```

### Test as Public User

```sql
-- Read operations should work
SELECT * FROM torneos;
SELECT * FROM equipos;
-- ✅ Should succeed

-- Write operations should fail
INSERT INTO torneos (nombre) VALUES ('Hack');
UPDATE equipos SET nombre = 'Hack';
-- ❌ Should fail with RLS error
```

---

## Common RLS Patterns in Application Code

### Pattern 1: Admin-Only Operations

```typescript
// Server Action for creating tournament
export async function createTorneo(data: TorneoInput) {
  const supabase = await createServerSupabaseClient();

  // RLS automatically checks if user is admin
  const { data: torneo, error } = await supabase
    .from('torneos')
    .insert(data)
    .select()
    .single();

  if (error) {
    // If not admin, RLS returns error
    return { error: 'Unauthorized or invalid data' };
  }

  return { data: torneo };
}
```

### Pattern 2: Director Managing Own Team

```typescript
// Server Action for updating team
export async function updateEquipo(id: string, data: EquipoInput) {
  const supabase = await createServerSupabaseClient();

  // RLS automatically filters to teams where dirigente_id = auth.uid()
  const { data: equipo, error } = await supabase
    .from('equipos')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    // Error if user is not director of this team
    return { error: 'Not authorized to update this team' };
  }

  return { data: equipo };
}
```

### Pattern 3: Public Read Operations

```typescript
// No auth required for reading public data
export async function getTorneos() {
  const supabase = await createServerSupabaseClient();

  // RLS allows public SELECT
  const { data, error } = await supabase
    .from('torneos')
    .select('*')
    .eq('activo', true);

  return data || [];
}
```

---

## Security Best Practices

### ✅ Do's

1. **Always rely on RLS policies** - Don't duplicate checks in application code
2. **Test policies thoroughly** - Test all roles (admin, director, public)
3. **Use specific error messages** - Don't reveal RLS details to users
4. **Audit admin actions** - Log sensitive operations
5. **Use triggers for complex checks** - RLS + triggers = strong security

### ❌ Don'ts

1. **Don't disable RLS** - Even temporarily in development
2. **Don't use service_role key in client** - Bypasses all RLS
3. **Don't trust client-side validation** - RLS is the final authority
4. **Don't expose internal errors** - Generic "Unauthorized" messages only
5. **Don't hardcode admin checks** - Use `raw_user_meta_data->>'role'`

---

## Performance Considerations

### Index Support for RLS

The following indexes optimize RLS policy checks:

```sql
-- From migration 010_indexes.sql
CREATE INDEX idx_equipos_dirigente ON equipos(dirigente_id);
CREATE INDEX idx_jugadores_equipo ON jugadores(equipo_id);
CREATE INDEX idx_transacciones_equipo ON transacciones_pago(equipo_id);
```

**Impact:** RLS policies that filter by `dirigente_id` or `equipo_id` are fast.

### Query Performance

- **RLS is checked on every query** - Plan for overhead
- **Use EXPLAIN ANALYZE** - Check if RLS policies cause slow queries
- **Indexes are critical** - Ensure foreign keys are indexed
- **Avoid complex joins in policies** - Keep policies simple

---

## Troubleshooting

### Common RLS Errors

**Error:** `new row violates row-level security policy`
- **Cause:** User doesn't have permission to INSERT/UPDATE
- **Fix:** Check user role or ownership (dirigente_id)

**Error:** `Query returns 0 rows (expected data)`
- **Cause:** RLS filtered out rows user can't access
- **Fix:** Verify user is admin or director of the team

**Error:** `permission denied for table X`
- **Cause:** RLS not enabled or no SELECT policy exists
- **Fix:** Enable RLS and add SELECT policy

### Debugging RLS

```sql
-- Check current user
SELECT auth.uid();

-- Check user role
SELECT raw_user_meta_data->>'role'
FROM auth.users
WHERE id = auth.uid();

-- Check team ownership
SELECT id, nombre, dirigente_id
FROM equipos
WHERE dirigente_id = auth.uid();

-- Test policy manually
SELECT * FROM equipos WHERE dirigente_id = auth.uid();
```

---

## Related Documentation

- [schema.md](./schema.md) - Complete database schema
- [triggers.md](./triggers.md) - Automated database operations
- [functions.md](./functions.md) - SQL functions for complex queries
- [CLAUDE.md](../../CLAUDE.md) - Development patterns

---

**Migration:** 009_rls_policies.sql
**Total Policies:** 19 policies across 12 tables
**Security Model:** Role-based (admin, director, public)
**Last Updated:** 2025-11-22
