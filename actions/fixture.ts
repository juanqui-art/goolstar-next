"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  generateRoundRobinFixture,
  generateDoubleRoundRobinFixture,
  calculateNumJornadas,
  type Team,
} from "@/lib/utils/fixture";
import { revalidatePath } from "next/cache";

/**
 * Generate complete fixture for a tournament
 *
 * Creates jornadas and matches for all teams in the tournament.
 * Uses round-robin algorithm (todos contra todos).
 */
export async function generateFixture(options: {
  torneoId: string;
  doubleRound?: boolean;
  startDate?: Date;
  daysInterval?: number;
}): Promise<{
  success: boolean;
  message: string;
  jornadasCreated: number;
  matchesCreated: number;
}> {
  try {
    const {
      torneoId,
      doubleRound = false,
      startDate,
      daysInterval = 7,
    } = options;

    const supabase = await createServerSupabaseClient();

    // 1. Get all teams in tournament
    const { data: equipos, error: equiposError } = await supabase
      .from("equipos")
      .select("id, nombre")
      .eq("torneo_id", torneoId)
      .order("nombre");

    if (equiposError) {
      throw new Error(`Failed to fetch teams: ${equiposError.message}`);
    }

    if (!equipos || equipos.length < 2) {
      return {
        success: false,
        message: "At least 2 teams are required to generate a fixture",
        jornadasCreated: 0,
        matchesCreated: 0,
      };
    }

    // 2. Check if fixture already exists
    const { count: existingMatches } = await supabase
      .from("partidos")
      .select("*", { count: "exact", head: true })
      .eq("torneo_id", torneoId);

    if (existingMatches && existingMatches > 0) {
      return {
        success: false,
        message: `Tournament already has ${existingMatches} matches. Delete them first to regenerate fixture.`,
        jornadasCreated: 0,
        matchesCreated: 0,
      };
    }

    // 3. Generate fixture using round-robin algorithm
    const teams: Team[] = equipos.map((e) => ({ id: e.id, nombre: e.nombre }));
    const matches = doubleRound
      ? generateDoubleRoundRobinFixture(teams)
      : generateRoundRobinFixture(teams);

    const numJornadas = calculateNumJornadas(teams.length, doubleRound);

    // 4. Create jornadas
    const jornadasToCreate = Array.from({ length: numJornadas }, (_, i) => {
      const jornadaNumber = i + 1;
      const fecha = startDate
        ? new Date(startDate.getTime() + i * daysInterval * 24 * 60 * 60 * 1000)
        : null;

      return {
        torneo_id: torneoId,
        numero: jornadaNumber,
        fecha_prevista: fecha ? fecha.toISOString().split("T")[0] : null,
      };
    });

    const { data: jornadas, error: jornadasError } = await supabase
      .from("jornadas")
      .insert(jornadasToCreate)
      .select();

    if (jornadasError) {
      throw new Error(`Failed to create jornadas: ${jornadasError.message}`);
    }

    // 5. Create map of jornada number to jornada ID
    const jornadaMap = new Map<number, string>();
    for (const jornada of jornadas) {
      jornadaMap.set(jornada.numero, jornada.id);
    }

    // 6. Create matches
    const matchesToCreate = matches.map((match) => ({
      torneo_id: torneoId,
      equipo_1_id: match.equipo_local.id,
      equipo_2_id: match.equipo_visitante.id,
      jornada_id: jornadaMap.get(match.jornada),
      completado: false,
    }));

    const { data: createdMatches, error: matchesError } = await supabase
      .from("partidos")
      .insert(matchesToCreate)
      .select();

    if (matchesError) {
      // Rollback: delete created jornadas
      await supabase
        .from("jornadas")
        .delete()
        .in(
          "id",
          jornadas.map((j) => j.id),
        );

      throw new Error(`Failed to create matches: ${matchesError.message}`);
    }

    // 7. Revalidate paths
    revalidatePath(`/torneos/${torneoId}`);
    revalidatePath(`/torneos/${torneoId}/fixture`);
    revalidatePath("/partidos");

    return {
      success: true,
      message: `Fixture generated successfully: ${jornadas.length} jornadas, ${createdMatches.length} matches`,
      jornadasCreated: jornadas.length,
      matchesCreated: createdMatches.length,
    };
  } catch (error) {
    console.error("Error generating fixture:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to generate fixture",
      jornadasCreated: 0,
      matchesCreated: 0,
    };
  }
}

/**
 * Delete all matches and jornadas for a tournament
 *
 * Use this to reset a tournament's fixture before regenerating
 */
export async function deleteFixture(
  torneoId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Get all partidos for this tournament
    const { data: partidos } = await supabase
      .from("partidos")
      .select("id, jornada_id")
      .eq("torneo_id", torneoId);

    if (!partidos || partidos.length === 0) {
      return {
        success: true,
        message: "No matches to delete",
      };
    }

    // 2. Get unique jornada IDs
    const jornadaIds = Array.from(
      new Set(partidos.map((p) => p.jornada_id).filter(Boolean)),
    ) as string[];

    // 3. Delete matches (will cascade delete goles, tarjetas, cambios)
    const { error: matchesError } = await supabase
      .from("partidos")
      .delete()
      .eq("torneo_id", torneoId);

    if (matchesError) {
      throw new Error(`Failed to delete matches: ${matchesError.message}`);
    }

    // 4. Delete jornadas
    if (jornadaIds.length > 0) {
      const { error: jornadasError } = await supabase
        .from("jornadas")
        .delete()
        .in("id", jornadaIds);

      if (jornadasError) {
        console.error("Warning: Could not delete jornadas:", jornadasError);
        // Don't throw, matches are already deleted
      }
    }

    // 5. Revalidate paths
    revalidatePath(`/torneos/${torneoId}`);
    revalidatePath(`/torneos/${torneoId}/fixture`);
    revalidatePath("/partidos");

    return {
      success: true,
      message: `Deleted ${partidos.length} matches and ${jornadaIds.length} jornadas`,
    };
  } catch (error) {
    console.error("Error deleting fixture:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete fixture",
    };
  }
}

/**
 * Get fixture for a tournament grouped by jornada
 */
export async function getFixture(torneoId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get all jornadas
    const { data: jornadas, error: jornadasError } = await supabase
      .from("jornadas")
      .select("*")
      .order("numero");

    if (jornadasError) {
      throw new Error(`Failed to fetch jornadas: ${jornadasError.message}`);
    }

    // Get all matches for this tournament
    const { data: partidos, error: partidosError } = await supabase
      .from("partidos")
      .select(`
        *,
        equipo_local:equipo_1_id (id, nombre),
        equipo_visitante:equipo_2_id (id, nombre),
        jornada:jornada_id (id, nombre, numero, fecha)
      `)
      .eq("torneo_id", torneoId)
      .order("fecha", { ascending: true });

    if (partidosError) {
      throw new Error(`Failed to fetch matches: ${partidosError.message}`);
    }

    // Group matches by jornada
    const fixture = jornadas?.map((jornada) => {
      const matches =
        partidos?.filter((p) => p.jornada_id === jornada.id) || [];
      return {
        jornada,
        partidos: matches,
      };
    });

    return { data: fixture, error: null };
  } catch (error) {
    console.error("Error fetching fixture:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch fixture",
    };
  }
}

/**
 * Update jornada dates
 */
export async function updateJornadaDates(
  torneoId: string,
  updates: Array<{ jornadaId: string; fecha: Date }>,
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Update each jornada
    for (const update of updates) {
      const { error } = await supabase
        .from("jornadas")
        .update({ fecha_prevista: update.fecha.toISOString().split("T")[0] })
        .eq("id", update.jornadaId);

      if (error) {
        throw new Error(`Failed to update jornada: ${error.message}`);
      }
    }

    // Revalidate paths
    revalidatePath(`/torneos/${torneoId}/fixture`);

    return {
      success: true,
      message: `Updated ${updates.length} jornadas`,
    };
  } catch (error) {
    console.error("Error updating jornada dates:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update jornadas",
    };
  }
}

/**
 * Assign dates and times to matches in a jornada
 */
export async function assignMatchDates(
  jornadaId: string,
  assignments: Array<{ partidoId: string; fecha: Date; cancha?: string }>,
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Update each match
    for (const assignment of assignments) {
      const updateData: {
        fecha: string;
        cancha?: string;
      } = {
        fecha: assignment.fecha.toISOString(),
      };

      if (assignment.cancha) {
        updateData.cancha = assignment.cancha;
      }

      const { error } = await supabase
        .from("partidos")
        .update(updateData)
        .eq("id", assignment.partidoId);

      if (error) {
        throw new Error(`Failed to update match: ${error.message}`);
      }
    }

    // Revalidate paths
    revalidatePath("/partidos");

    return {
      success: true,
      message: `Updated ${assignments.length} matches`,
    };
  } catch (error) {
    console.error("Error assigning match dates:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to assign match dates",
    };
  }
}
