/**
 * Suspension Logic Utilities
 * Business rules for player suspensions based on cards
 */

/**
 * Calculate remaining suspension matches
 * - Red card = 1+ matches (depends on severity)
 * - N yellow cards = 1 match suspension (configurable threshold)
 */
export function calculateSuspensionMatches(
  yellowCards: number,
  redCards: number,
  limiteAmarillas: number = 3
): number {
  let matches = 0

  // Each red card = at least 1 match (can be more for violent conduct)
  matches += redCards

  // Every N yellow cards = 1 match suspension
  matches += Math.floor(yellowCards / limiteAmarillas)

  return matches
}

/**
 * Check if player is currently suspended
 */
export function isPlayerSuspended(suspensionMatches: number): boolean {
  return suspensionMatches > 0
}

/**
 * Get suspension reason text in Spanish
 */
export function getSuspensionReason(
  yellowCards: number,
  redCards: number,
  limiteAmarillas: number = 3
): string | null {
  if (redCards > 0) {
    return `${redCards} tarjeta${redCards > 1 ? "s" : ""} roja${redCards > 1 ? "s" : ""}`
  }

  if (yellowCards >= limiteAmarillas) {
    return `Acumulación de ${yellowCards} tarjetas amarillas`
  }

  return null
}

/**
 * Calculate when player will be eligible to play again
 */
export function getEligibilityMatchNumber(
  currentMatch: number,
  suspensionMatches: number
): number {
  return currentMatch + suspensionMatches
}

/**
 * Get next card threshold warning
 * Returns number of cards remaining before suspension
 */
export function getCardWarning(
  yellowCards: number,
  limiteAmarillas: number = 3
): number {
  const cardsUntilSuspension = limiteAmarillas - (yellowCards % limiteAmarillas)
  return cardsUntilSuspension === limiteAmarillas ? 0 : cardsUntilSuspension
}

/**
 * Check if player is in danger zone (1 card away from suspension)
 */
export function isInDangerZone(
  yellowCards: number,
  limiteAmarillas: number = 3
): boolean {
  return getCardWarning(yellowCards, limiteAmarillas) === 1
}

/**
 * Get suspension status summary
 */
export function getSuspensionSummary(
  yellowCards: number,
  redCards: number,
  suspensionMatches: number,
  limiteAmarillas: number = 3
): string {
  if (suspensionMatches > 0) {
    const reason = getSuspensionReason(yellowCards, redCards, limiteAmarillas)
    return `Suspendido ${suspensionMatches} partido${suspensionMatches > 1 ? "s" : ""} (${reason})`
  }

  const warning = getCardWarning(yellowCards, limiteAmarillas)
  if (warning === 1) {
    return `⚠️ Peligro: 1 amarilla más y queda suspendido`
  }

  if (warning === 2) {
    return `Advertencia: 2 amarillas más y queda suspendido`
  }

  return "Sin suspensiones"
}
