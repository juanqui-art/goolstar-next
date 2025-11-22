/**
 * Points Calculation Utilities
 * Business rules for tournament point system
 *
 * Standard soccer point system:
 * - Win: 3 points
 * - Draw: 1 point
 * - Loss: 0 points
 */

/**
 * Calculate points awarded based on match result
 *
 * @param goalsFor - Goals scored by the team
 * @param goalsAgainst - Goals scored by the opponent
 * @returns Points awarded (3 for win, 1 for draw, 0 for loss)
 *
 * @example
 * ```ts
 * calculatePoints(3, 1) // => 3 (win)
 * calculatePoints(2, 2) // => 1 (draw)
 * calculatePoints(0, 2) // => 0 (loss)
 * ```
 */
export function calculatePoints(
  goalsFor: number,
  goalsAgainst: number,
): number {
  if (goalsFor > goalsAgainst) return 3; // Win
  if (goalsFor === goalsAgainst) return 1; // Draw
  return 0; // Loss
}

/**
 * Calculate goal difference (GF - GC)
 *
 * @param goalsFor - Goals scored by the team
 * @param goalsAgainst - Goals scored by the opponent
 * @returns Goal difference (positive = favor, negative = against)
 *
 * @example
 * ```ts
 * calculateGoalDifference(3, 1) // => 2
 * calculateGoalDifference(1, 3) // => -2
 * calculateGoalDifference(2, 2) // => 0
 * ```
 */
export function calculateGoalDifference(
  goalsFor: number,
  goalsAgainst: number,
): number {
  return goalsFor - goalsAgainst;
}

/**
 * Determine match result type
 *
 * @param goalsFor - Goals scored by the team
 * @param goalsAgainst - Goals scored by the opponent
 * @returns Match result: "win", "draw", or "loss"
 *
 * @example
 * ```ts
 * getMatchResult(3, 1) // => "win"
 * getMatchResult(2, 2) // => "draw"
 * getMatchResult(0, 2) // => "loss"
 * ```
 */
export function getMatchResult(
  goalsFor: number,
  goalsAgainst: number,
): "win" | "draw" | "loss" {
  if (goalsFor > goalsAgainst) return "win";
  if (goalsFor === goalsAgainst) return "draw";
  return "loss";
}

/**
 * Get match result display text in Spanish
 *
 * @param goalsFor - Goals scored by the team
 * @param goalsAgainst - Goals scored by the opponent
 * @returns Localized result text: "Victoria", "Empate", or "Derrota"
 *
 * @example
 * ```ts
 * getMatchResultText(3, 1) // => "Victoria"
 * getMatchResultText(2, 2) // => "Empate"
 * getMatchResultText(0, 2) // => "Derrota"
 * ```
 */
export function getMatchResultText(
  goalsFor: number,
  goalsAgainst: number,
): string {
  const result = getMatchResult(goalsFor, goalsAgainst);
  const labels = {
    win: "Victoria",
    draw: "Empate",
    loss: "Derrota",
  };
  return labels[result];
}

/**
 * Calculate total points from multiple matches
 *
 * @param matches - Array of match results with goalsFor and goalsAgainst
 * @returns Total accumulated points across all matches
 *
 * @example
 * ```ts
 * const matches = [
 *   { goalsFor: 3, goalsAgainst: 1 }, // Win: 3 pts
 *   { goalsFor: 2, goalsAgainst: 2 }, // Draw: 1 pt
 *   { goalsFor: 0, goalsAgainst: 1 }, // Loss: 0 pts
 * ]
 * calculateTotalPoints(matches) // => 4
 * ```
 */
export function calculateTotalPoints(
  matches: Array<{ goalsFor: number; goalsAgainst: number }>,
): number {
  return matches.reduce(
    (total, match) =>
      total + calculatePoints(match.goalsFor, match.goalsAgainst),
    0,
  );
}
