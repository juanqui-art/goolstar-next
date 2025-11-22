"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  type Partido,
  type PartidoResultado,
  partidoResultadoSchema,
  partidoSchema,
} from "@/lib/validations/partido";
import type { Database } from "@/types/database";

type PartidoRow = Database["public"]["Tables"]["partidos"]["Row"];
type PartidoInsert = Database["public"]["Tables"]["partidos"]["Insert"];
type PartidoUpdate = Database["public"]["Tables"]["partidos"]["Update"];

/**
 * Partido with related data
 */
export interface PartidoWithRelations extends PartidoRow {
  equipo_local?: {
    id: string;
    nombre: string;
  } | null;
  equipo_visitante?: {
    id: string;
    nombre: string;
  } | null;
  arbitros?: {
    id: string;
    nombre: string;
    apellido: string;
  } | null;
  _count?: {
    goles: number;
    tarjetas: number;
    cambios: number;
  };
}

/**
 * Create a new match
 */
export async function createPartido(data: unknown): Promise<{ id: string }> {
  try {
    // 1. Validate with partidoSchema
    const validated = partidoSchema.parse(data);

    // 2. Get Supabase client
    const supabase = await createServerSupabaseClient();

    // 3. Insert into partidos
    const partidoData: PartidoInsert = {
      torneo_id: validated.torneo_id,
      equipo_1_id: validated.equipo_1_id,
      equipo_2_id: validated.equipo_2_id,
      jornada_id: validated.jornada_id || null,
      fase_eliminatoria_id: validated.fase_eliminatoria_id || null,
      arbitro_id: validated.arbitro_id || null,
      fecha: validated.fecha ? validated.fecha.toISOString() : null,
      cancha: validated.cancha || null,
      completado: false,
    };

    const { data: newPartido, error } = await supabase
      .from("partidos")
      .insert(partidoData)
      .select()
      .single();

    if (error) {
      console.error("Error creating partido:", error);
      throw new Error(`Failed to create match: ${error.message}`);
    }

    // 4. Revalidate paths
    revalidatePath("/partidos");
    revalidatePath(`/torneos/${validated.torneo_id}`);
    revalidatePath("/");

    return { id: newPartido.id };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create match");
  }
}

/**
 * Get all matches with optional filters
 */
export async function getPartidos(options?: {
  torneoId?: string;
  equipoId?: string;
  jornadaId?: string;
  completado?: boolean;
  includeRelations?: boolean;
}): Promise<PartidoWithRelations[]> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("partidos")
      .select("*")
      .order("fecha", { ascending: false });

    // Apply filters
    if (options?.torneoId) {
      query = query.eq("torneo_id", options.torneoId);
    }
    if (options?.equipoId) {
      query = query.or(
        `equipo_1_id.eq.${options.equipoId},equipo_2_id.eq.${options.equipoId}`,
      );
    }
    if (options?.jornadaId) {
      query = query.eq("jornada_id", options.jornadaId);
    }
    if (options?.completado !== undefined) {
      query = query.eq("completado", options.completado);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching partidos:", error);
      throw new Error(`Failed to fetch matches: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch matches");
  }
}

/**
 * Get a single match by ID with all related data
 */
export async function getPartido(id: string): Promise<PartidoWithRelations> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get partido with related information
    const { data: partido, error } = await supabase
      .from("partidos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching partido:", error);
      throw new Error(`Match not found: ${error.message}`);
    }

    // Get counts for related entities
    const [
      { count: golesCount },
      { count: tarjetasCount },
      { count: cambiosCount },
    ] = await Promise.all([
      supabase
        .from("goles")
        .select("*", { count: "exact", head: true })
        .eq("partido_id", id),
      supabase
        .from("tarjetas")
        .select("*", { count: "exact", head: true })
        .eq("partido_id", id),
      supabase
        .from("cambios_jugador")
        .select("*", { count: "exact", head: true })
        .eq("partido_id", id),
    ]);

    return {
      ...partido,
      _count: {
        goles: golesCount || 0,
        tarjetas: tarjetasCount || 0,
        cambios: cambiosCount || 0,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch match");
  }
}

/**
 * Update a match
 */
export async function updatePartido(
  id: string,
  data: unknown,
): Promise<PartidoRow> {
  try {
    // 1. Validate with partidoSchema
    const validated = partidoSchema.parse(data);

    // 2. Get Supabase client
    const supabase = await createServerSupabaseClient();

    // 3. Update partido
    const updateData: PartidoUpdate = {
      torneo_id: validated.torneo_id,
      equipo_1_id: validated.equipo_1_id,
      equipo_2_id: validated.equipo_2_id,
      jornada_id: validated.jornada_id || null,
      fase_eliminatoria_id: validated.fase_eliminatoria_id || null,
      arbitro_id: validated.arbitro_id || null,
      fecha: validated.fecha ? validated.fecha.toISOString() : null,
      cancha: validated.cancha || null,
    };

    const { data: updatedPartido, error } = await supabase
      .from("partidos")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating partido:", error);
      throw new Error(`Failed to update match: ${error.message}`);
    }

    // 4. Revalidate paths
    revalidatePath("/partidos");
    revalidatePath(`/partidos/${id}`);
    revalidatePath(`/torneos/${validated.torneo_id}`);
    revalidatePath("/");

    return updatedPartido;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update match");
  }
}

/**
 * Delete a match
 */
export async function deletePartido(id: string): Promise<{ success: boolean }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get torneo_id before deletion for revalidation
    const { data: partido } = await supabase
      .from("partidos")
      .select("torneo_id")
      .eq("id", id)
      .single();

    // Hard delete (only if not completed)
    const { error } = await supabase.from("partidos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting partido:", error);
      throw new Error(`Failed to delete match: ${error.message}`);
    }

    // Revalidate paths
    revalidatePath("/partidos");
    if (partido?.torneo_id) {
      revalidatePath(`/torneos/${partido.torneo_id}`);
    }
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete match");
  }
}

/**
 * Register a goal
 */
export async function registrarGol(
  partidoId: string,
  jugadorId: string,
  equipoId: string,
  minuto: number,
): Promise<{ id: string }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get partido and torneo_id
    const { data: partido } = await supabase
      .from("partidos")
      .select("torneo_id")
      .eq("id", partidoId)
      .single();

    if (!partido) {
      throw new Error("Match not found");
    }

    // Insert gol
    const { data: gol, error } = await supabase
      .from("goles")
      .insert({
        partido_id: partidoId,
        jugador_id: jugadorId,
        equipo_id: equipoId,
        torneo_id: partido.torneo_id,
        minuto,
      })
      .select()
      .single();

    if (error) {
      console.error("Error registering goal:", error);
      throw new Error(`Failed to register goal: ${error.message}`);
    }

    // Revalidate paths
    revalidatePath(`/partidos/${partidoId}`);
    revalidatePath(`/jugadores/${jugadorId}`);
    revalidatePath(`/equipos/${equipoId}`);

    return { id: gol.id };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to register goal");
  }
}

/**
 * Register a card (yellow or red)
 */
export async function registrarTarjeta(data: {
  partido_id: string;
  equipo_id: string;
  jugador_id: string;
  tipo: "AMARILLA" | "ROJA";
  minuto: number;
}): Promise<{ id: string }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Insert tarjeta
    const { data: tarjeta, error } = await supabase
      .from("tarjetas")
      .insert({
        partido_id: data.partido_id,
        jugador_id: data.jugador_id,
        equipo_id: data.equipo_id,
        tipo: data.tipo,
        minuto: data.minuto,
      })
      .select()
      .single();

    if (error) {
      console.error("Error registering card:", error);
      throw new Error(`Failed to register card: ${error.message}`);
    }

    // Revalidate paths
    revalidatePath(`/partidos/${partidoId}`);
    revalidatePath(`/jugadores/${jugadorId}`);

    return { id: tarjeta.id };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to register card");
  }
}

/**
 * Register a player substitution
 */
export async function registrarCambio(
  partidoId: string,
  jugadorSaleId: string,
  jugadorEntraId: string,
  equipoId: string,
  minuto: number,
): Promise<{ id: string }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Insert cambio
    const { data: cambio, error } = await supabase
      .from("cambios_jugador")
      .insert({
        partido_id: partidoId,
        jugador_sale_id: jugadorSaleId,
        jugador_entra_id: jugadorEntraId,
        equipo_id: equipoId,
        minuto,
      })
      .select()
      .single();

    if (error) {
      console.error("Error registering substitution:", error);
      throw new Error(`Failed to register substitution: ${error.message}`);
    }

    // Revalidate paths
    revalidatePath(`/partidos/${partidoId}`);

    return { id: cambio.id };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to register substitution");
  }
}

/**
 * Finalize a match with result
 */
export async function finalizarPartido(
  partidoId: string,
  resultado: unknown,
): Promise<{ success: boolean }> {
  try {
    // Validate result
    const validatedResultado = partidoResultadoSchema.parse(resultado);

    const supabase = await createServerSupabaseClient();

    // Update partido with final result
    const { data: partido, error } = await supabase
      .from("partidos")
      .update({
        goles_equipo_1: validatedResultado.goles_equipo_1,
        goles_equipo_2: validatedResultado.goles_equipo_2,
        resultado_retiro: validatedResultado.resultado_retiro || null,
        resultado_inasistencia:
          validatedResultado.resultado_inasistencia || null,
        sancion: validatedResultado.sancion || null,
        penales_equipo_1: validatedResultado.penales_equipo_1 || null,
        penales_equipo_2: validatedResultado.penales_equipo_2 || null,
        completado: true,
      })
      .eq("id", partidoId)
      .select("torneo_id, equipo_1_id, equipo_2_id")
      .single();

    if (error) {
      console.error("Error finalizing match:", error);
      throw new Error(`Failed to finalize match: ${error.message}`);
    }

    // Revalidate paths
    revalidatePath("/partidos");
    revalidatePath(`/partidos/${partidoId}`);
    if (partido.torneo_id) {
      revalidatePath(`/torneos/${partido.torneo_id}`);
      revalidatePath(`/torneos/${partido.torneo_id}/tabla`);
    }
    revalidatePath(`/equipos/${partido.equipo_1_id}`);
    revalidatePath(`/equipos/${partido.equipo_2_id}`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to finalize match");
  }
}

/**
 * Get match acta (report) with all details
 */
export async function getPartidoActa(partidoId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get partido with all related data
    const [partido, goles, tarjetas, cambios] = await Promise.all([
      supabase
        .from("partidos")
        .select(
          `
          *,
          equipo_local:equipo_1_id (
            id,
            nombre
          ),
          equipo_visitante:equipo_2_id (
            id,
            nombre
          ),
          arbitros (
            id,
            nombre,
            apellido
          ),
          torneos (
            id,
            nombre
          )
        `,
        )
        .eq("id", partidoId)
        .single(),

      supabase
        .from("goles")
        .select(
          `
          *,
          jugadores (
            primer_nombre,
            primer_apellido
          )
        `,
        )
        .eq("partido_id", partidoId)
        .order("minuto", { ascending: true }),

      supabase
        .from("tarjetas")
        .select(
          `
          *,
          jugadores (
            primer_nombre,
            primer_apellido
          )
        `,
        )
        .eq("partido_id", partidoId)
        .order("minuto", { ascending: true }),

      supabase
        .from("cambios_jugador")
        .select(
          `
          *,
          jugador_sale:jugador_sale_id (
            primer_nombre,
            primer_apellido
          ),
          jugador_entra:jugador_entra_id (
            primer_nombre,
            primer_apellido
          )
        `,
        )
        .eq("partido_id", partidoId)
        .order("minuto", { ascending: true }),
    ]);

    if (partido.error) {
      throw new Error(`Match not found: ${partido.error.message}`);
    }

    return {
      partido: partido.data,
      goles: goles.data || [],
      tarjetas: tarjetas.data || [],
      cambios: cambios.data || [],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch match report");
  }
}
