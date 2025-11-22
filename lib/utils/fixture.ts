/**
 * Fixture generation utilities
 *
 * Implements round-robin (todos contra todos) algorithm for tournament fixtures.
 */

export interface Team {
  id: string;
  nombre: string;
}

export interface Match {
  equipo_local: Team;
  equipo_visitante: Team;
  jornada: number;
}

/**
 * Generate round-robin fixture (todos contra todos)
 *
 * Uses the circle method algorithm:
 * - For even number of teams: each team plays (n-1) matches
 * - For odd number of teams: add a "bye" team, one team rests per round
 *
 * @param teams - Array of teams to schedule
 * @returns Array of matches organized by round (jornada)
 *
 * @example
 * ```typescript
 * const teams = [
 *   { id: '1', nombre: 'Team A' },
 *   { id: '2', nombre: 'Team B' },
 *   { id: '3', nombre: 'Team C' },
 *   { id: '4', nombre: 'Team D' },
 * ];
 * const fixture = generateRoundRobinFixture(teams);
 * // Returns: [
 * //   { equipo_local: Team A, equipo_visitante: Team D, jornada: 1 },
 * //   { equipo_local: Team B, equipo_visitante: Team C, jornada: 1 },
 * //   ...
 * // ]
 * ```
 */
export function generateRoundRobinFixture(teams: Team[]): Match[] {
  if (teams.length < 2) {
    throw new Error("At least 2 teams are required to generate a fixture");
  }

  const numTeams = teams.length;
  const isOdd = numTeams % 2 === 1;

  // If odd number of teams, add a "bye" placeholder
  const teamsWithBye = isOdd
    ? [...teams, { id: 'bye', nombre: 'BYE' }]
    : [...teams];

  const totalTeams = teamsWithBye.length;
  const numRounds = totalTeams - 1;
  const matchesPerRound = totalTeams / 2;

  const matches: Match[] = [];

  // Create a working copy of teams array
  const rotating = [...teamsWithBye];

  // Keep first team fixed, rotate the rest
  const fixed = rotating[0];
  let rotatingTeams = rotating.slice(1);

  for (let round = 0; round < numRounds; round++) {
    const currentRound = round + 1;

    // First match: fixed team vs last rotating team
    const opponent = rotatingTeams[rotatingTeams.length - 1];

    // Skip if either team is BYE
    if (fixed.id !== 'bye' && opponent.id !== 'bye') {
      matches.push({
        equipo_local: round % 2 === 0 ? fixed : opponent,
        equipo_visitante: round % 2 === 0 ? opponent : fixed,
        jornada: currentRound,
      });
    }

    // Rest of matches: pair up rotating teams
    for (let i = 0; i < rotatingTeams.length - 1; i++) {
      const home = rotatingTeams[i];
      const away = rotatingTeams[rotatingTeams.length - 2 - i];

      // Skip if either team is BYE
      if (home.id !== 'bye' && away.id !== 'bye') {
        matches.push({
          equipo_local: home,
          equipo_visitante: away,
          jornada: currentRound,
        });
      }
    }

    // Rotate teams (circle method)
    rotatingTeams = [
      rotatingTeams[rotatingTeams.length - 1],
      ...rotatingTeams.slice(0, rotatingTeams.length - 1),
    ];
  }

  return matches;
}

/**
 * Generate fixture with home-and-away rounds (ida y vuelta)
 *
 * Generates a complete double round-robin where each team plays:
 * - Once at home vs every other team
 * - Once away vs every other team
 *
 * @param teams - Array of teams to schedule
 * @returns Array of matches with double the rounds
 *
 * @example
 * ```typescript
 * const teams = [
 *   { id: '1', nombre: 'Team A' },
 *   { id: '2', nombre: 'Team B' },
 * ];
 * const fixture = generateDoubleRoundRobinFixture(teams);
 * // Returns matches for both home and away games
 * ```
 */
export function generateDoubleRoundRobinFixture(teams: Team[]): Match[] {
  const firstRound = generateRoundRobinFixture(teams);
  const numRounds = Math.max(...firstRound.map(m => m.jornada));

  // Second round: reverse home/away and shift jornada numbers
  const secondRound = firstRound.map(match => ({
    equipo_local: match.equipo_visitante,
    equipo_visitante: match.equipo_local,
    jornada: match.jornada + numRounds,
  }));

  return [...firstRound, ...secondRound];
}

/**
 * Group matches by jornada
 *
 * @param matches - Array of matches
 * @returns Map of jornada number to matches in that round
 *
 * @example
 * ```typescript
 * const grouped = groupMatchesByJornada(matches);
 * // Returns: { 1: [...matches in round 1], 2: [...matches in round 2], ... }
 * ```
 */
export function groupMatchesByJornada(matches: Match[]): Record<number, Match[]> {
  return matches.reduce((groups, match) => {
    const jornada = match.jornada;
    if (!groups[jornada]) {
      groups[jornada] = [];
    }
    groups[jornada].push(match);
    return groups;
  }, {} as Record<number, Match[]>);
}

/**
 * Calculate number of jornadas for a given number of teams
 *
 * @param numTeams - Number of teams
 * @param doubleRound - Whether to include return matches
 * @returns Number of jornadas
 *
 * @example
 * ```typescript
 * calculateNumJornadas(8, false) // Returns 7
 * calculateNumJornadas(8, true)  // Returns 14
 * calculateNumJornadas(7, false) // Returns 7 (odd number)
 * ```
 */
export function calculateNumJornadas(numTeams: number, doubleRound = false): number {
  if (numTeams < 2) return 0;

  const singleRound = numTeams % 2 === 0 ? numTeams - 1 : numTeams;
  return doubleRound ? singleRound * 2 : singleRound;
}

/**
 * Validate that fixture is complete and balanced
 *
 * Checks that:
 * - Each team plays the same number of matches
 * - No team plays against itself
 * - All matches have valid teams
 *
 * @param matches - Array of matches to validate
 * @param teams - Array of teams
 * @returns Object with validation result and errors
 *
 * @example
 * ```typescript
 * const validation = validateFixture(matches, teams);
 * if (!validation.valid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
export function validateFixture(
  matches: Match[],
  teams: Team[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const teamIds = new Set(teams.map(t => t.id));
  const matchCounts = new Map<string, number>();

  // Initialize match counts
  for (const team of teams) {
    matchCounts.set(team.id, 0);
  }

  // Validate each match
  for (const match of matches) {
    // Check teams exist
    if (!teamIds.has(match.equipo_local.id)) {
      errors.push(`Unknown team: ${match.equipo_local.nombre}`);
    }
    if (!teamIds.has(match.equipo_visitante.id)) {
      errors.push(`Unknown team: ${match.equipo_visitante.nombre}`);
    }

    // Check teams are different
    if (match.equipo_local.id === match.equipo_visitante.id) {
      errors.push(`Team cannot play against itself: ${match.equipo_local.nombre}`);
    }

    // Count matches per team
    matchCounts.set(
      match.equipo_local.id,
      (matchCounts.get(match.equipo_local.id) || 0) + 1
    );
    matchCounts.set(
      match.equipo_visitante.id,
      (matchCounts.get(match.equipo_visitante.id) || 0) + 1
    );
  }

  // Check all teams have same number of matches
  const counts = Array.from(matchCounts.values());
  const expectedMatches = teams.length - 1; // Each team plays n-1 matches in single round-robin

  for (const [teamId, count] of matchCounts.entries()) {
    if (count !== expectedMatches) {
      const team = teams.find(t => t.id === teamId);
      errors.push(
        `Team ${team?.nombre} has ${count} matches, expected ${expectedMatches}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
