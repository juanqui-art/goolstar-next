"use server";

import { canManageJugadores, requireAdmin, requireAuth } from "@/lib/auth/dal";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { jugadorSchema } from "@/lib/validations/jugador";
import type { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

type JugadorRow = Database["public"]["Tables"]["jugadores"]["Row"];
type JugadorInsert = Database["public"]["Tables"]["jugadores"]["Insert"];
type JugadorUpdate = Database["public"]["Tables"]["jugadores"]["Update"];

/**
 * Jugador with related data
 */
export interface JugadorWithRelations extends JugadorRow {
  equipos?: {
    id: string;
    nombre: string;
    torneo_id: string;
  } | null;
  _count?: {
    goles: number;
    tarjetas: number;
    partidos: number;
  };
}

/**
 * Create a new player
 */
export async function createJugador(data: unknown): Promise<{ id: string }> {
  try {
    // 1. Validate with jugadorSchema
    const validated = jugadorSchema.parse(data);

    // 2. Verify permissions
    const user = await requireAuth();
    const canManage = await canManageJugadores(user, validated.equipo_id);

    if (!canManage) {
      throw new Error("Forbidden: You cannot add players to this team");
    }

    // 3. Get Supabase client
    const supabase = await createServerSupabaseClient();

    // 4. Insert into jugadores
    const jugadorData: JugadorInsert = {
      equipo_id: validated.equipo_id,
      primer_nombre: validated.primer_nombre,
      segundo_nombre: validated.segundo_nombre || null,
      primer_apellido: validated.primer_apellido,
      segundo_apellido: validated.segundo_apellido || null,
      cedula: validated.cedula || null,
      numero_dorsal: validated.numero_dorsal || null,
      posicion: validated.posicion || null,
      nivel: validated.nivel,
      activo: true,
    };

    const { data: newJugador, error } = await supabase
      .from("jugadores")
      .insert(jugadorData)
      .select()
      .single();

    if (error) {
      console.error("Error creating jugador:", error);
      throw new Error(`Failed to create player: ${error.message}`);
    }

    // 5. Revalidate paths
    revalidatePath("/jugadores");
    revalidatePath(`/equipos/${validated.equipo_id}`);
    revalidatePath("/");

    return { id: newJugador.id };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create player");
  }
}

/**
 * Get all players with optional filters
 */
export async function getJugadores(options?: {
  equipoId?: string;
  activo?: boolean;
  suspendido?: boolean;
  includeRelations?: boolean;
}): Promise<JugadorWithRelations[]> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("jugadores")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (options?.equipoId) {
      query = query.eq("equipo_id", options.equipoId);
    }
    if (options?.activo !== undefined) {
      query = query.eq("activo", options.activo);
    }
    if (options?.suspendido !== undefined) {
      query = query.eq("suspendido", options.suspendido);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching jugadores:", error);
      throw new Error(`Failed to fetch players: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch players");
  }
}

/**
 * Get a single player by ID with all related data
 */
export async function getJugador(id: string): Promise<JugadorWithRelations> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get jugador with related information
    // Note: Only 1 level of nesting supported by Supabase
    const { data: jugador, error } = await supabase
      .from("jugadores")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching jugador:", error);
      throw new Error(`Player not found: ${error.message}`);
    }

    // Get counts for related entities
    const [
      { count: golesCount },
      { count: tarjetasCount },
      { count: partidosCount },
    ] = await Promise.all([
      supabase
        .from("goles")
        .select("*", { count: "exact", head: true })
        .eq("jugador_id", id),
      supabase
        .from("tarjetas")
        .select("*", { count: "exact", head: true })
        .eq("jugador_id", id),
      // Count partidos where player scored or got a card
      supabase
        .from("goles")
        .select("partido_id", { count: "exact", head: true })
        .eq("jugador_id", id),
    ]);

    return {
      ...jugador,
      _count: {
        goles: golesCount || 0,
        tarjetas: tarjetasCount || 0,
        partidos: partidosCount || 0,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch player");
  }
}

/**
 * Update a player
 */
export async function updateJugador(
  id: string,
  data: unknown,
): Promise<JugadorRow> {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Get current player to check permissions
    const { data: currentPlayer, error: fetchError } = await supabase
      .from("jugadores")
      .select("equipo_id")
      .eq("id", id)
      .single();

    if (fetchError || !currentPlayer) {
      throw new Error("Player not found");
    }

    // 2. Verify permissions
    const user = await requireAuth();
    const canManage = await canManageJugadores(user, currentPlayer.equipo_id);

    if (!canManage) {
      throw new Error("Forbidden: You cannot manage this player");
    }

    // 3. Validate with jugadorSchema
    const validated = jugadorSchema.parse(data);

    // 4. Update jugador
    const updateData: JugadorUpdate = {
      equipo_id: validated.equipo_id,
      primer_nombre: validated.primer_nombre,
      segundo_nombre: validated.segundo_nombre || null,
      primer_apellido: validated.primer_apellido,
      segundo_apellido: validated.segundo_apellido || null,
      cedula: validated.cedula || null,
      numero_dorsal: validated.numero_dorsal || null,
      posicion: validated.posicion || null,
      nivel: validated.nivel,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedJugador, error } = await supabase
      .from("jugadores")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating jugador:", error);
      throw new Error(`Failed to update player: ${error.message}`);
    }

    // 5. Revalidate paths
    revalidatePath("/jugadores");
    revalidatePath(`/jugadores/${id}`);
    revalidatePath(`/equipos/${validated.equipo_id}`);
    revalidatePath("/");

    return updatedJugador;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update player");
  }
}

/**
 * Delete a player (soft delete by setting activo = false)
 */
export async function deleteJugador(id: string): Promise<{ success: boolean }> {
  try {
    // 0. Verify admin role
    await requireAdmin();

    const supabase = await createServerSupabaseClient();

    // Get equipo_id before deletion for revalidation
    const { data: jugador } = await supabase
      .from("jugadores")
      .select("equipo_id")
      .eq("id", id)
      .single();

    // Soft delete: set activo to false instead of deleting
    const { error } = await supabase
      .from("jugadores")
      .update({ activo: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error deleting jugador:", error);
      throw new Error(`Failed to delete player: ${error.message}`);
    }

    // Revalidate paths
    revalidatePath("/jugadores");
    if (jugador?.equipo_id) {
      revalidatePath(`/equipos/${jugador.equipo_id}`);
    }
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete player");
  }
}

/**
 * Get player statistics
 */
export async function getJugadorStats(jugadorId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get player statistics
    const [
      { data: goles },
      { data: tarjetasAmarillas },
      { data: tarjetasRojas },
      jugador,
    ] = await Promise.all([
      // Total goals
      supabase
        .from("goles")
        .select("*")
        .eq("jugador_id", jugadorId),

      // Yellow cards
      supabase
        .from("tarjetas")
        .select("*")
        .eq("jugador_id", jugadorId)
        .eq("tipo_tarjeta", "amarilla"),

      // Red cards
      supabase
        .from("tarjetas")
        .select("*")
        .eq("jugador_id", jugadorId)
        .eq("tipo_tarjeta", "roja"),

      // Get player's suspension info
      supabase
        .from("jugadores")
        .select("suspendido, partidos_suspension_restantes")
        .eq("id", jugadorId)
        .single(),
    ]);

    return {
      totalGoles: goles?.length || 0,
      totalTarjetasAmarillas: tarjetasAmarillas?.length || 0,
      totalTarjetasRojas: tarjetasRojas?.length || 0,
      suspendido: jugador.data?.suspendido || false,
      partidosSuspensionRestantes:
        jugador.data?.partidos_suspension_restantes || 0,
      golesPorPartido: goles || [],
      tarjetas: [...(tarjetasAmarillas || []), ...(tarjetasRojas || [])],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch player statistics");
  }
}

/**
 * Upload a document for a player
 * Note: This is a simplified version. Full implementation would handle file uploads to Supabase Storage
 */
export async function uploadDocumento(
  jugadorId: string,
  documentoData: {
    tipo: string;
    url: string;
    nombre: string;
  },
): Promise<{ id: string }> {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Get player to check permissions
    const { data: player, error: fetchError } = await supabase
      .from("jugadores")
      .select("equipo_id")
      .eq("id", jugadorId)
      .single();

    if (fetchError || !player) {
      throw new Error("Player not found");
    }

    // 2. Verify permissions
    const user = await requireAuth();
    const canManage = await canManageJugadores(user, player.equipo_id);

    if (!canManage) {
      throw new Error("Forbidden: You cannot manage this player's documents");
    }

    // 3. Insert documento record
    const { data: documento, error } = await supabase
      .from("jugador_documentos")
      .insert({
        jugador_id: jugadorId,
        tipo: documentoData.tipo as
          | "dni_frontal"
          | "dni_posterior"
          | "cedula_frontal"
          | "cedula_posterior"
          | "pasaporte"
          | "otro",
        url: documentoData.url,
        estado: "pendiente" as
          | "pendiente"
          | "verificado"
          | "rechazado"
          | "resubir",
      })
      .select()
      .single();

    if (error) {
      console.error("Error uploading documento:", error);
      throw new Error(`Failed to upload document: ${error.message}`);
    }

    // Revalidate paths
    revalidatePath(`/jugadores/${jugadorId}`);
    revalidatePath("/admin/documentos");

    return { id: documento.id };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to upload document");
  }
}

/**
 * Get player documents
 */
export async function getJugadorDocumentos(jugadorId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Get player to check permissions
    const { data: player, error: fetchError } = await supabase
      .from("jugadores")
      .select("equipo_id")
      .eq("id", jugadorId)
      .single();

    if (fetchError || !player) {
      throw new Error("Player not found");
    }

    // 2. Verify permissions
    const user = await requireAuth();
    const canManage = await canManageJugadores(user, player.equipo_id);

    if (!canManage) {
      throw new Error("Forbidden: You cannot view this player's documents");
    }

    const { data: documentos, error } = await supabase
      .from("jugador_documentos")
      .select("*")
      .eq("jugador_id", jugadorId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }

    return documentos || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch documents");
  }
}
