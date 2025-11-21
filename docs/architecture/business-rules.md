# Business Rules

Core business logic that governs how GoolStar operates.

## Points System

Teams earn points based on match results:

| Result | Points |
|--------|--------|
| Victory | 3 |
| Draw | 1 |
| Defeat | 0 |

Teams with more points rank higher in the standings.

---

## Tiebreaker Criteria

When teams have equal points, apply tiebreakers in this order:

1. **Points** (already equal)
2. **Goal Difference** - (goals scored - goals conceded)
3. **Goals For** - total goals scored
4. **Head-to-Head** - if still tied, result between the two teams

Example:
- Team A: 7 pts, GD +5, 10 GF
- Team B: 7 pts, GD +3, 9 GF
- Team C: 7 pts, GD +5, 8 GF

**Order:** A (same GD but more goals) > C > B

---

## Suspension System

### Red Card Suspension

- **Trigger**: Direct red card in a match
- **Duration**: Category-configurable (default: 2 matches)
- **Effect**: Player marked as `suspendido=true`
- **Auto-enforcement**: Database trigger activates immediately

**Trigger Reference**: [triggers.md](../database/triggers.md#trigger-2-suspend-player-on-red-card)

### Yellow Card Accumulation

- **Threshold**: Category-configurable (default: 3 yellows per tournament)
- **Suspension**: 1 match when threshold reached
- **Reset**: Yellow cards reset to 0 after suspension is served
- **Auto-enforcement**: Trigger checks count on each yellow card insertion

**Trigger Reference**: [triggers.md](../database/triggers.md#trigger-3-verify-yellow-card-accumulation)

### Suspension Details

- Suspended players **cannot play** (not even as substitutes)
- Suspension lasts until the player sits out the required number of matches
- After suspension, player's `suspendido` flag is manually reset (or via trigger)
- Multiple suspensions stack (can't play if either red or yellow suspension active)

### Rules Example

**Scenario**: VARONES category, 3-yellow limit, 2-match red card suspension

1. Player gets red card → immediately suspended for 2 matches
2. Player gets yellow card #1 → no suspension
3. Player gets yellow card #2 → no suspension
4. Player gets yellow card #3 → suspended 1 match, all 3 yellows marked as served
5. After suspension served, yellows reset, player eligible again

---

## Absence & Exclusion System

### Tracking Absences

When a team fails to appear for a scheduled match:

1. Match is marked with `inasistencia_equipo_X = true`
2. Match result is recorded as a default loss (0-3 to opponent)
3. Team's `inasistencias` counter increments

### Automatic Exclusion

- **Threshold**: Category-configurable (default: 3 absences)
- **Trigger**: When `inasistencias` reaches limit
- **Effect**: Team marked as `excluido_por_inasistencias = true`
- **Result**: Team is removed from the tournament

### Rules

- Absences are **per tournament** (not cumulative across tournaments)
- Each absence counts regardless of reason
- Once excluded, team cannot be re-included in that tournament

---

## Match Validation Rules

Before a match can begin:

1. **Team Availability**
   - Both teams must exist and be active
   - Teams must not be in same group (if group phase)
   - Teams must not already have played each other (if group phase, same round)

2. **Player Requirements**
   - Minimum 4 players per team to start
   - Players must belong to the team
   - Suspended players cannot participate

3. **Substitution Limits**
   - Maximum 3 substitutions per team per match
   - Only non-suspended players can be substituted in

### Data Validation (App Level)

These should be enforced in the Next.js application before submitting to database:

```typescript
// Example validation
if (team1Players.length < 4 || team2Players.length < 4) {
  throw new Error('Teams must have at least 4 players')
}

if (team1Players.some(p => p.suspendido)) {
  throw new Error('Cannot include suspended players')
}

if (substitutions.length > 3) {
  throw new Error('Maximum 3 substitutions allowed')
}
```

---

## Tournament Phases

### Phase 1: Registration (inscripcion)

- Teams sign up for the tournament
- Deadline for team registration is set
- Teams pay registration fees
- Player registration period

### Phase 2: Group Stage (grupos)

- Teams divided into groups (A, B, C, D)
- All-play-all within group
- Points awarded based on match results
- Standings calculated automatically

**Automatic Update**: When a match is marked complete, trigger updates standings.

### Phase 3-5: Knockout Stages (octavos, cuartos, semifinales)

- Single-elimination format
- Winners advance, losers are eliminated
- If tied after 90 minutes → penalty kicks
- No draw results (one team must advance)

### Phase 6: Final (final)

- Championship match
- Winner is tournament champion

### Phase 7: Completed (finalizado)

- Tournament concluded
- Prizes distributed
- Final standings locked

---

## Financial System

### Revenue & Expense Tracking

All financial transactions use double-entry system:

- `es_ingreso = true` → Income (team pays in)
- `es_ingreso = false` → Expense (tournament pays out)

### Registration

- **Amount**: Category-configurable (default: $500)
- **When**: Required before team can participate
- **Type**: `abono_inscripcion`
- **Verification**: Team cannot be marked complete if has outstanding debt

### Card Fines

- **Yellow Card Fine**: Category-configurable (default: $2)
- **Red Card Fine**: Category-configurable (default: $3)
- **When**: Auto-created when card is inserted
- **Payment**: Manual payment by team director

### Referee Payment

- **Amount**: Category-configurable (default: $10 per match)
- **Split**: Each team pays 50% ($5 each)
- **When**: Due after match completes
- **Responsibility**: Tournament admin tracks payments

### Example Financial Flows

**Scenario 1: Team Registration**
```
Transaction:
  type: abono_inscripcion
  monto: 500
  es_ingreso: true
  equipo_id: team-id

Team's debt = 500 - 500 = 0 (no debt)
```

**Scenario 2: Card Fines**
```
INSERT tarjeta (tipo='AMARILLA') →
  auto-creates transaction:
    type: multa_amarilla
    monto: 2
    es_ingreso: false
    tarjeta_id: card-id

Team's debt = 0 + 2 = 2 (owes $2)
```

**Scenario 3: Partial Payment**
```
Team owes:
  - Registration: $500
  - 3 yellow cards: $6
  - Total: $506

Team pays: $300

Team debt = (500 + 6) - 300 = $206
```

### Debt Calculation

Use the `calcular_deuda_equipo()` function:

**Formula**:
```
Debt = (RegistrationCost + UnpaidFines) - PaidAmounts
```

**Database Function**: See [functions.md](../database/functions.md#function-2-calculate-team-debt)

---

## Group Assignment

### Automatic Division

When phase transitions from registration → groups:

1. Get all registered teams
2. Calculate number of groups needed
3. Divide teams evenly across groups (A, B, C, D)
4. Assign each team a `grupo` value

### Strategy Options

- **Round-robin**: Teams with similar skill levels in different groups
- **Snake**: Alternate high-skill teams across groups
- **Balanced**: Ensure each group has similar total skill

**Current**: Manual assignment via admin panel (can be automated later)

---

## Group-to-Knockout Qualification

### Advancement

From each group, top N teams advance (configurable, default: 2):

1. Teams ranked by points
2. Tiebreaker rules applied
3. Top N marked as `clasificado_fase_grupos=true`

### Seeding

Top teams from groups are seeded in knockout brackets to avoid rematches in early rounds.

### Best Loser Advancement

If tournament format allows:

- Best-ranked teams that finished 3rd in their groups
- Can advance to last round before finals (e.g., Round of 16 from 8-team groups)
- Stored in `mejores_perdedores` table

---

## Real-Time Statistics

### Automatic Updates

When a match is completed:

1. `estadistica_equipo` table is updated (trigger)
2. Teams' standings refresh within ~5 seconds
3. Clients subscribed to realtime channel receive update
4. Frontend components re-render with new standings

### Subscription Example

```typescript
// Subscribe to standings updates
supabase
  .channel('standings-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'estadistica_equipo'
  }, payload => {
    // Refetch standings
    refreshStandings()
  })
  .subscribe()
```

---

## Match Result Recording

### Step-by-Step Process

1. **Schedule Match**
   - Set date, time, location
   - Assign teams and referee
   - Confirm player lists

2. **Play Match**
   - Record goals with scorer and minute
   - Record substitutions
   - Record cards with minute and reason

3. **Mark Complete**
   - Set final score
   - Add observations/notes
   - Set `completado=true`

4. **Auto-Trigger**
   - Statistics automatically updated
   - Suspensions activated
   - Fines recorded

5. **Sign Off**
   - Both team directors sign acta (match report)
   - Match becomes official

### Data Entry Validation

- No duplicate goal scorers in same minute
- Card minute must be between 0-120
- Final score must match goal records
- Substitutions must be sequential

---

## Report/Acta Format

The match report (`acta`) includes:

- Match details (date, teams, referee)
- Team lineups (starters + bench)
- Goals (scorer, minute, team)
- Cards (player, type, minute, reason)
- Substitutions (in/out, minute)
- Observations (incidents, disputed calls)
- Signatures (both team directors, ref)

**Current**: Stored as JSON in `partidos.observaciones` (can be enhanced with PDF generation)

---

## Rules by Category

Categories allow customization of:

- `limite_inasistencias` - absences before exclusion
- `limite_amarillas_suspension` - yellows before suspension
- `partidos_suspension_roja` - match count for red card
- `costo_inscripcion` - registration fee
- `costo_arbitraje` - referee payment per match
- `multa_amarilla` - fine amount for yellow
- `multa_roja` - fine amount for red
- `premio_primero/segundo/tercero/cuarto` - prize distribution

Each tournament inherits category rules, which can be overridden at tournament level.

---

## User Roles & Permissions

### Admin

- Create/edit tournaments
- Create categories
- Assign teams to groups
- View all financial records
- Verify player documents
- Manage user accounts

**DB Level**: RLS policies require `role='admin'`

### Team Director (Dirigente)

- Register team
- Add players to team
- View team standings/stats
- Submit payment proofs
- Sign match reports for their team

**DB Level**: Can only access own team's data

### Player

- View tournament standings
- View own match history
- Receive suspension notifications

**DB Level**: Read-only access

---

## Conflict Resolution

### Disputed Match Results

1. Team director submits dispute within 24 hours
2. Admin reviews match acta and evidence
3. Admin can override result if evidence supports
4. Updated statistics recalculated (may need manual SQL)

### Disqualification Appeals

Teams can appeal exclusion due to absences:

1. Submit appeal with documented reason
2. Admin reviews (medical docs, proof of error, etc.)
3. Can reinstate team with appeal approval
4. Update `excluido_por_inasistencias=false`

---

## Tournament Completion

When final is concluded:

1. Tournament status set to `finalizado=true`
2. Final standings locked
3. Prizes distributed based on finishing position
4. Team directors notified
5. Records archived for history

---

See also:
- [../database/schema.md](../database/schema.md) - Data structure
- [../database/triggers.md](../database/triggers.md) - Auto-enforcement
- [../CLAUDE.md](../CLAUDE.md) - Development patterns
