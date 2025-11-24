"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { torneoSchema } from "@/lib/validations/torneo";
import type { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

type TorneoRow = Database["public"]["Tables"]["torneos"]["Row"];
type TorneoInsert = Database["public"]["Tables"]["torneos"]["Insert"];
type TorneoUpdate = Database["public"]["Tables"]["torneos"]["Update"];

/**
 * Torneo with related data
 */
export interface TorneoWithRelations extends TorneoRow {
  categorias?: {
    id: string;
    nombre: string;
    precio_inscripcion: number;
  } | null;
  _count?: {
    equipos: number;
    partidos: number;
  };
}

/**
 * Create a new tournament
 */
export async function createTorneo(data: unknown): Promise<{ id: string }> {
  try {
    // 1. Validate with torneoSchema
    const validated = torneoSchema.parse(data);

    // 2. Get Supabase client
    const supabase = await createServerSupabaseClient();

    // 3. Insert into torneos
    const torneoData: TorneoInsert = {
      nombre: validated.nombre,
      categoria_id: validated.categoria_id,
      fecha_inicio: validated.fecha_inicio.toISOString(),
      fecha_fin: validated.fecha_fin ? validated.fecha_fin.toISOString() : null,
      tiene_fase_grupos: validated.tiene_fase_grupos,
      tiene_eliminacion_directa: validated.tiene_eliminacion_directa,
      activo: true,
    };

    const { data: newTorneo, error } = await supabase
      .from("torneos")
      .insert(torneoData)
      .select()
      .single();

    if (error) {
      console.error("Error creating torneo:", error);
      throw new Error(`Failed to create tournament: ${error.message}`);
    }

    // 4. Revalidate paths
    revalidatePath("/torneos");
    revalidatePath("/");

    return { id: newTorneo.id };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create tournament");
  }
}

/**
 * Get all tournaments with optional filters
 */
export async function getTorneos(options?: {
  activo?: boolean;
  includeRelations?: boolean;
}): Promise<TorneoWithRelations[]> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("torneos")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (options?.activo !== undefined) {
      query = query.eq("activo", options.activo);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching torneos:", error);
      throw new Error(`Failed to fetch tournaments: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch tournaments");
  }
}

/**
 * Get a single tournament by ID with all related data
 */
export async function getTorneo(id: string): Promise<TorneoWithRelations> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get torneo with category information
    const { data: torneo, error } = await supabase
      .from("torneos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching torneo:", error);
      throw new Error(`Tournament not found: ${error.message}`);
    }

    // Get counts for related entities
    const [{ count: equiposCount }, { count: partidosCount }] =
      await Promise.all([
        supabase
          .from("equipos")
          .select("*", { count: "exact", head: true })
          .eq("torneo_id", id),
        supabase
          .from("partidos")
          .select("*", { count: "exact", head: true })
          .eq("torneo_id", id),
      ]);

    return {
      ...torneo,
      _count: {
        equipos: equiposCount || 0,
        partidos: partidosCount || 0,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch tournament");
  }
}

/**
 * Update a tournament
 */
export async function updateTorneo(
  id: string,
  data: unknown,
): Promise<TorneoRow> {
  try {
    // 1. Validate with torneoSchema
    const validated = torneoSchema.parse(data);

    // 2. Get Supabase client
    const supabase = await createServerSupabaseClient();

    // 3. Update torneo
    const updateData: TorneoUpdate = {
      nombre: validated.nombre,
      categoria_id: validated.categoria_id,
      fecha_inicio: validated.fecha_inicio.toISOString(),
      fecha_fin: validated.fecha_fin ? validated.fecha_fin.toISOString() : null,
      tiene_fase_grupos: validated.tiene_fase_grupos,
      tiene_eliminacion_directa: validated.tiene_eliminacion_directa,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedTorneo, error } = await supabase
      .from("torneos")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating torneo:", error);
      throw new Error(`Failed to update tournament: ${error.message}`);
    }

    // 4. Revalidate paths
    revalidatePath("/torneos");
    revalidatePath(`/torneos/${id}`);
    revalidatePath("/");

    return updatedTorneo;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update tournament");
  }
}

/**
 * Delete a tournament (soft delete by setting activo = false)
 */
export async function deleteTorneo(id: string): Promise<{ success: boolean }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Soft delete: set activo to false instead of deleting
    const { error } = await supabase
      .from("torneos")
      .update({ activo: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error deleting torneo:", error);
      throw new Error(`Failed to delete tournament: ${error.message}`);
    }

    // Revalidate paths
    revalidatePath("/torneos");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete tournament");
  }
}

/**
 * Get standings (tabla de posiciones) for a tournament
 * Uses the database function get_tabla_posiciones
 */
export async function getStandings(torneoId: string, grupo?: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Use database function for standings calculation
    // The function is defined in migration 008_functions.sql
    // Note: The database function only accepts p_torneo_id
    const { data, error } = await supabase.rpc("get_tabla_posiciones", {
      p_torneo_id: torneoId,
    });

    if (error) {
      console.error("Error fetching standings:", error);
      throw new Error(`Failed to fetch standings: ${error.message}`);
    }

    let standings = data || [];

    // Filter by group if provided
    if (grupo) {
      standings = standings.filter((team) => team.grupo === grupo);
    }

    return standings;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch standings");
  }
}

/**
 * Get tournament statistics
 */
export async function getTorneoStats(torneoId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get various statistics for the tournament
    const [
      { count: totalEquipos },
      { count: totalPartidos },
      { count: partidosCompletados },
      { data: topScorers },
    ] = await Promise.all([
      // Total teams
      supabase
        .from("equipos")
        .select("*", { count: "exact", head: true })
        .eq("torneo_id", torneoId),

      // Total matches
      supabase
        .from("partidos")
        .select("*", { count: "exact", head: true })
        .eq("torneo_id", torneoId),

      // Completed matches
      supabase
        .from("partidos")
        .select("*", { count: "exact", head: true })
        .eq("torneo_id", torneoId)
        .eq("completado", true),

      // Top scorers - get players with most goals
      supabase
        .from("goles")
        .select(
          `
          jugador_id,
          jugadores (
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            equipos (
              nombre
            )
          )
        `,
        )
        .eq("torneo_id", torneoId)
        .limit(10),
    ]);

    // Count goals per player
    const scorerCounts = (topScorers || []).reduce(
      (acc, gol) => {
        const jugadorId = gol.jugador_id;
        if (jugadorId) {
          acc[jugadorId] = (acc[jugadorId] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalEquipos: totalEquipos || 0,
      totalPartidos: totalPartidos || 0,
      partidosCompletados: partidosCompletados || 0,
      partidosPendientes: (totalPartidos || 0) - (partidosCompletados || 0),
      topScorers: Object.entries(scorerCounts)
        .map(([jugadorId, goles]) => ({
          jugadorId,
          goles,
        }))
        .sort((a, b) => b.goles - a.goles)
        .slice(0, 10),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch tournament statistics");
  }
}

/**
 * Get top scorers for a tournament
 */
export async function getTopScorers(torneoId: string, limit = 10) {
  try {
    const supabase = await createServerSupabaseClient();

    // Use database function for top scorers
    const { data, error } = await supabase.rpc("get_jugadores_destacados", {
      p_torneo_id: torneoId,
      p_limit: limit,
    });

    if (error) {
      console.error("Error fetching top scorers:", error);
      throw new Error(`Failed to fetch top scorers: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch top scorers");
  }
}
