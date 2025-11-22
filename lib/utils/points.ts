/**
 * Points Calculation Utilities
 * Business rules for tournament point system
 */

/**
 * Calculate points awarded based on match result
 * Win = 3 points, Draw = 1 point, Loss = 0 points
 */
export function calculatePoints(
  goalsFor: number,
  goalsAgainst: number
): number {
  if (goalsFor > goalsAgainst) return 3 // Win
  if (goalsFor === goalsAgainst) return 1 // Draw
  return 0 // Loss
}

/**
 * Calculate goal difference
 */
export function calculateGoalDifference(
  goalsFor: number,
  goalsAgainst: number
): number {
  return goalsFor - goalsAgainst
}

/**
 * Determine match result
 */
export function getMatchResult(
  goalsFor: number,
  goalsAgainst: number
): "win" | "draw" | "loss" {
  if (goalsFor > goalsAgainst) return "win"
  if (goalsFor === goalsAgainst) return "draw"
  return "loss"
}

/**
 * Get match result display text in Spanish
 */
export function getMatchResultText(
  goalsFor: number,
  goalsAgainst: number
): string {
  const result = getMatchResult(goalsFor, goalsAgainst)
  const labels = {
    win: "Victoria",
    draw: "Empate",
    loss: "Derrota",
  }
  return labels[result]
}

/**
 * Calculate total points from multiple matches
 */
export function calculateTotalPoints(
  matches: Array<{ goalsFor: number; goalsAgainst: number }>
): number {
  return matches.reduce(
    (total, match) =>
      total + calculatePoints(match.goalsFor, match.goalsAgainst),
    0
  )
}
