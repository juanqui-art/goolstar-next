/**
 * Standings Calculation and Sorting Utilities
 * Business rules for tournament standings table
 */

export interface TeamStanding {
  equipoId: string
  nombre: string
  PJ: number // Partidos jugados
  PG: number // Partidos ganados
  PE: number // Partidos empatados
  PP: number // Partidos perdidos
  GF: number // Goles a favor
  GC: number // Goles en contra
  puntos: number
}

/**
 * Sort standings by business rules:
 * 1. Points DESC
 * 2. Goal difference DESC
 * 3. Goals for DESC
 * 4. Head-to-head (not implemented here, requires match data)
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
 * Get team's position in standings (1-indexed)
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
 */
export function calculateWinRate(standing: TeamStanding): number {
  if (standing.PJ === 0) return 0
  return (standing.PG / standing.PJ) * 100
}

/**
 * Calculate points per match average
 */
export function calculatePointsPerMatch(standing: TeamStanding): number {
  if (standing.PJ === 0) return 0
  return standing.puntos / standing.PJ
}

/**
 * Get team standing summary text
 */
export function getStandingSummary(standing: TeamStanding): string {
  return `${standing.PJ} PJ | ${standing.PG}G ${standing.PE}E ${standing.PP}P | ${standing.GF}-${standing.GC} | ${standing.puntos} pts`
}
