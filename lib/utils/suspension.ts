/**
 * Suspension Logic Utilities
 * Business rules for player suspensions based on cards
 *
 * Suspension rules:
 * - Red card: 1+ match suspension (can be extended for violent conduct)
 * - Yellow cards: Accumulation threshold triggers suspension (default: 3 yellows = 1 match)
 * - Suspensions are served in upcoming matches
 */

/**
 * Calculate number of matches a player must sit out
 *
 * @param yellowCards - Total yellow cards accumulated
 * @param redCards - Total red cards received
 * @param limiteAmarillas - Yellow card threshold for suspension (default: 3)
 * @returns Number of matches player must miss
 *
 * @example
 * ```ts
 * calculateSuspensionMatches(5, 0, 3) // => 1 (5 yellows / 3 = 1 suspension)
 * calculateSuspensionMatches(0, 1, 3) // => 1 (1 red card)
 * calculateSuspensionMatches(7, 1, 3) // => 3 (2 from yellows + 1 from red)
 * calculateSuspensionMatches(2, 0, 3) // => 0 (not enough yellows)
 * ```
 */
export function calculateSuspensionMatches(
  yellowCards: number,
  redCards: number,
  limiteAmarillas: number = 3,
): number {
  let matches = 0;

  // Each red card = at least 1 match (can be more for violent conduct)
  matches += redCards;

  // Every N yellow cards = 1 match suspension
  matches += Math.floor(yellowCards / limiteAmarillas);

  return matches;
}

/**
 * Check if player is currently suspended
 *
 * @param suspensionMatches - Number of suspension matches remaining
 * @returns True if player cannot play in next match
 *
 * @example
 * ```ts
 * isPlayerSuspended(2) // => true (suspended for 2 matches)
 * isPlayerSuspended(0) // => false (eligible to play)
 * ```
 */
export function isPlayerSuspended(suspensionMatches: number): boolean {
  return suspensionMatches > 0;
}

/**
 * Get human-readable suspension reason in Spanish
 *
 * @param yellowCards - Total yellow cards accumulated
 * @param redCards - Total red cards received
 * @param limiteAmarillas - Yellow card threshold (default: 3)
 * @returns Localized reason text, or null if no suspension
 *
 * @example
 * ```ts
 * getSuspensionReason(0, 1, 3) // => "1 tarjeta roja"
 * getSuspensionReason(0, 2, 3) // => "2 tarjetas rojas"
 * getSuspensionReason(5, 0, 3) // => "Acumulación de 5 tarjetas amarillas"
 * getSuspensionReason(2, 0, 3) // => null (no suspension)
 * ```
 */
export function getSuspensionReason(
  yellowCards: number,
  redCards: number,
  limiteAmarillas: number = 3,
): string | null {
  if (redCards > 0) {
    return `${redCards} tarjeta${redCards > 1 ? "s" : ""} roja${redCards > 1 ? "s" : ""}`;
  }

  if (yellowCards >= limiteAmarillas) {
    return `Acumulación de ${yellowCards} tarjetas amarillas`;
  }

  return null;
}

/**
 * Calculate match number when player will be eligible again
 *
 * @param currentMatch - Current match number in tournament
 * @param suspensionMatches - Number of matches player must miss
 * @returns Match number when player can return
 *
 * @example
 * ```ts
 * getEligibilityMatchNumber(5, 2) // => 7 (returns on match 7)
 * getEligibilityMatchNumber(10, 0) // => 10 (can play immediately)
 * ```
 */
export function getEligibilityMatchNumber(
  currentMatch: number,
  suspensionMatches: number,
): number {
  return currentMatch + suspensionMatches;
}

/**
 * Get number of yellow cards remaining before next suspension
 *
 * @param yellowCards - Current yellow card count
 * @param limiteAmarillas - Yellow card threshold (default: 3)
 * @returns Cards remaining until suspension (0 if at/over threshold)
 *
 * @example
 * ```ts
 * getCardWarning(2, 3) // => 1 (danger zone - 1 more yellow = suspension)
 * getCardWarning(5, 3) // => 1 (next yellow triggers another suspension)
 * getCardWarning(0, 3) // => 0 (no warnings - 3 cards away)
 * ```
 */
export function getCardWarning(
  yellowCards: number,
  limiteAmarillas: number = 3,
): number {
  const cardsUntilSuspension =
    limiteAmarillas - (yellowCards % limiteAmarillas);
  return cardsUntilSuspension === limiteAmarillas ? 0 : cardsUntilSuspension;
}

/**
 * Check if player is one yellow card away from suspension
 *
 * @param yellowCards - Current yellow card count
 * @param limiteAmarillas - Yellow card threshold (default: 3)
 * @returns True if next yellow card will trigger suspension
 *
 * @example
 * ```ts
 * isInDangerZone(2, 3) // => true (1 more yellow = suspended)
 * isInDangerZone(5, 3) // => true (1 more yellow = another suspension)
 * isInDangerZone(1, 3) // => false (2 more yellows needed)
 * ```
 */
export function isInDangerZone(
  yellowCards: number,
  limiteAmarillas: number = 3,
): boolean {
  return getCardWarning(yellowCards, limiteAmarillas) === 1;
}

/**
 * Get complete suspension status summary text in Spanish
 *
 * @param yellowCards - Total yellow cards accumulated
 * @param redCards - Total red cards received
 * @param suspensionMatches - Remaining suspension matches
 * @param limiteAmarillas - Yellow card threshold (default: 3)
 * @returns Formatted status text with warnings/suspension info
 *
 * @example
 * ```ts
 * getSuspensionSummary(0, 1, 1, 3)
 * // => "Suspendido 1 partido (1 tarjeta roja)"
 *
 * getSuspensionSummary(2, 0, 0, 3)
 * // => "⚠️ Peligro: 1 amarilla más y queda suspendido"
 *
 * getSuspensionSummary(1, 0, 0, 3)
 * // => "Advertencia: 2 amarillas más y queda suspendido"
 *
 * getSuspensionSummary(0, 0, 0, 3)
 * // => "Sin suspensiones"
 * ```
 */
export function getSuspensionSummary(
  yellowCards: number,
  redCards: number,
  suspensionMatches: number,
  limiteAmarillas: number = 3,
): string {
  if (suspensionMatches > 0) {
    const reason = getSuspensionReason(yellowCards, redCards, limiteAmarillas);
    return `Suspendido ${suspensionMatches} partido${suspensionMatches > 1 ? "s" : ""} (${reason})`;
  }

  const warning = getCardWarning(yellowCards, limiteAmarillas);
  if (warning === 1) {
    return `⚠️ Peligro: 1 amarilla más y queda suspendido`;
  }

  if (warning === 2) {
    return `Advertencia: 2 amarillas más y queda suspendido`;
  }

  return "Sin suspensiones";
}
