/**
 * Standings Calculation and Sorting Utilities
 * Business rules for tournament standings table
 *
 * Sorting criteria (in order):
 * 1. Points (descending)
 * 2. Goal difference (descending)
 * 3. Goals for (descending)
 * 4. Head-to-head (when implemented)
 */

/**
 * Team standing data structure
 */
export interface TeamStanding {
  /** Unique team identifier (UUID) */
  equipoId: string
  /** Team name */
  nombre: string
  /** Partidos jugados (Matches played) */
  PJ: number
  /** Partidos ganados (Wins) */
  PG: number
  /** Partidos empatados (Draws) */
  PE: number
  /** Partidos perdidos (Losses) */
  PP: number
  /** Goles a favor (Goals for) */
  GF: number
  /** Goles en contra (Goals against) */
  GC: number
  /** Total points */
  puntos: number
}

/**
 * Sort standings by tournament business rules
 *
 * @param standings - Array of team standings to sort
 * @returns Sorted array (descending order by points, then GD, then GF)
 *
 * @example
 * ```ts
 * const standings = [
 *   { equipoId: "1", nombre: "Team A", PJ: 3, PG: 2, PE: 0, PP: 1, GF: 6, GC: 3, puntos: 6 },
 *   { equipoId: "2", nombre: "Team B", PJ: 3, PG: 2, PE: 0, PP: 1, GF: 5, GC: 4, puntos: 6 },
 * ]
 * sortStandings(standings) // Team A first (better GD: +3 vs +1)
 * ```
 *
 * @note Implements tie-breaking rules:
 * 1. Points (descending)
 * 2. Goal difference (descending)
 * 3. Goals for (descending)
 * 4. Original order maintained if all criteria equal
 */
export function sortStandings(standings: TeamStanding[]): TeamStanding[] {
  return [...standings].sort((a, b) => {
    // 1. Compare by points
    if (b.puntos !== a.puntos) return b.puntos - a.puntos

    // 2. Compare by goal difference
    const diffA = a.GF - a.GC
    const diffB = b.GF - b.GC
    if (diffB !== diffA) return diffB - diffA

    // 3. Compare by goals for
    if (b.GF !== a.GF) return b.GF - a.GF

    // 4. If still tied, maintain original order (or implement head-to-head)
    return 0
  })
}

/**
 * Get team's position in standings table (1-indexed)
 *
 * @param standings - Array of team standings
 * @param equipoId - Team ID to find position for
 * @returns Position (1-based index), or 0 if team not found
 *
 * @example
 * ```ts
 * const standings = [...] // sorted standings
 * getTeamPosition(standings, "team-uuid") // => 3 (third place)
 * getTeamPosition(standings, "non-existent") // => 0 (not found)
 * ```
 */
export function getTeamPosition(
  standings: TeamStanding[],
  equipoId: string
): number {
  const sorted = sortStandings(standings)
  const index = sorted.findIndex((t) => t.equipoId === equipoId)
  return index === -1 ? 0 : index + 1
}

/**
 * Get teams qualified for next phase (top N teams)
 *
 * @param standings - Array of team standings
 * @param numQualified - Number of teams that advance
 * @returns Array of qualified teams (sorted by position)
 *
 * @example
 * ```ts
 * const standings = [...] // 8 teams
 * getQualifiedTeams(standings, 4) // Top 4 teams advance
 * ```
 */
export function getQualifiedTeams(
  standings: TeamStanding[],
  numQualified: number
): TeamStanding[] {
  const sorted = sortStandings(standings)
  return sorted.slice(0, numQualified)
}

/**
 * Calculate win rate percentage
 *
 * @param standing - Team standing data
 * @returns Win rate as percentage (0-100)
 *
 * @example
 * ```ts
 * const standing = { PJ: 10, PG: 7, ... }
 * calculateWinRate(standing) // => 70.0
 * ```
 */
export function calculateWinRate(standing: TeamStanding): number {
  if (standing.PJ === 0) return 0
  return (standing.PG / standing.PJ) * 100
}

/**
 * Calculate points per match average
 *
 * @param standing - Team standing data
 * @returns Average points per match
 *
 * @example
 * ```ts
 * const standing = { PJ: 10, puntos: 24, ... }
 * calculatePointsPerMatch(standing) // => 2.4
 * ```
 */
export function calculatePointsPerMatch(standing: TeamStanding): number {
  if (standing.PJ === 0) return 0
  return standing.puntos / standing.PJ
}

/**
 * Get team standing summary text (compact format)
 *
 * @param standing - Team standing data
 * @returns Formatted summary string
 *
 * @example
 * ```ts
 * const standing = { PJ: 10, PG: 6, PE: 2, PP: 2, GF: 18, GC: 10, puntos: 20, ... }
 * getStandingSummary(standing) // => "10 PJ | 6G 2E 2P | 18-10 | 20 pts"
 * ```
 */
export function getStandingSummary(standing: TeamStanding): string {
  return `${standing.PJ} PJ | ${standing.PG}G ${standing.PE}E ${standing.PP}P | ${standing.GF}-${standing.GC} | ${standing.puntos} pts`
}
