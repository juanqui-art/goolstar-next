"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { equipoSchema, type Equipo } from "@/lib/validations/equipo";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/database";

type EquipoRow = Database["public"]["Tables"]["equipos"]["Row"];
type EquipoInsert = Database["public"]["Tables"]["equipos"]["Insert"];
type EquipoUpdate = Database["public"]["Tables"]["equipos"]["Update"];

/**
 * Equipo with related data
 */
export interface EquipoWithRelations extends EquipoRow {
  torneos?: {
    id: string;
    nombre: string;
    activo: boolean;
  } | null;
  categorias?: {
    id: string;
    nombre: string;
  } | null;
  usuarios?: {
    id: string;
    email: string;
  } | null;
  _count?: {
    jugadores: number;
    partidos: number;
  };
}

/**
 * Create a new team
 */
export async function createEquipo(data: unknown): Promise<{ id: string }> {
  try {
    // 1. Validate with equipoSchema
    const validated = equipoSchema.parse(data);

    // 2. Get Supabase client
    const supabase = await createServerSupabaseClient();

    // 3. Insert into equipos
    const equipoData: EquipoInsert = {
      nombre: validated.nombre,
      torneo_id: validated.torneo_id,
      categoria_id: validated.categoria_id,
      dirigente_id: validated.dirigente_id || null,
      color_principal: validated.color_principal || null,
      color_secundario: validated.color_secundario || null,
      escudo_url: validated.escudo_url || null,
      nivel: validated.nivel,
      activo: true,
    };

    const { data: newEquipo, error } = await supabase
      .from("equipos")
      .insert(equipoData)
      .select()
      .single();

    if (error) {
      console.error("Error creating equipo:", error);
      throw new Error(`Failed to create team: ${error.message}`);
    }

    // 4. Revalidate paths
    revalidatePath("/equipos");
    revalidatePath(`/torneos/${validated.torneo_id}`);
    revalidatePath("/");

    return { id: newEquipo.id };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create team");
  }
}

/**
 * Get all teams with optional filters
 */
export async function getEquipos(options?: {
  torneoId?: string;
  categoriaId?: string;
  activo?: boolean;
  includeRelations?: boolean;
}): Promise<EquipoWithRelations[]> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("equipos")
      .select(
        options?.includeRelations
          ? `
          *,
          torneos (
            id,
            nombre,
            activo
          ),
          categorias (
            id,
            nombre
          ),
          usuarios (
            id,
            email
          )
        `
          : "*"
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (options?.torneoId) {
      query = query.eq("torneo_id", options.torneoId);
    }
    if (options?.categoriaId) {
      query = query.eq("categoria_id", options.categoriaId);
    }
    if (options?.activo !== undefined) {
      query = query.eq("activo", options.activo);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching equipos:", error);
      throw new Error(`Failed to fetch teams: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch teams");
  }
}

/**
 * Get a single team by ID with all related data
 */
export async function getEquipo(id: string): Promise<EquipoWithRelations> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get equipo with related information
    const { data: equipo, error } = await supabase
      .from("equipos")
      .select(
        `
        *,
        torneos (
          id,
          nombre,
          activo,
          fecha_inicio,
          fecha_fin
        ),
        categorias (
          id,
          nombre,
          precio_inscripcion
        ),
        usuarios (
          id,
          email
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching equipo:", error);
      throw new Error(`Team not found: ${error.message}`);
    }

    // Get counts for related entities
    const [{ count: jugadoresCount }, { count: partidosCount }] =
      await Promise.all([
        supabase
          .from("jugadores")
          .select("*", { count: "exact", head: true })
          .eq("equipo_id", id),
        supabase
          .from("partidos")
          .select("*", { count: "exact", head: true })
          .or(`equipo_local_id.eq.${id},equipo_visitante_id.eq.${id}`),
      ]);

    return {
      ...equipo,
      _count: {
        jugadores: jugadoresCount || 0,
        partidos: partidosCount || 0,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch team");
  }
}

/**
 * Update a team
 */
export async function updateEquipo(
  id: string,
  data: unknown
): Promise<EquipoRow> {
  try {
    // 1. Validate with equipoSchema
    const validated = equipoSchema.parse(data);

    // 2. Get Supabase client
    const supabase = await createServerSupabaseClient();

    // 3. Update equipo
    const updateData: EquipoUpdate = {
      nombre: validated.nombre,
      torneo_id: validated.torneo_id,
      categoria_id: validated.categoria_id,
      dirigente_id: validated.dirigente_id || null,
      color_principal: validated.color_principal || null,
      color_secundario: validated.color_secundario || null,
      escudo_url: validated.escudo_url || null,
      nivel: validated.nivel,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedEquipo, error } = await supabase
      .from("equipos")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating equipo:", error);
      throw new Error(`Failed to update team: ${error.message}`);
    }

    // 4. Revalidate paths
    revalidatePath("/equipos");
    revalidatePath(`/equipos/${id}`);
    revalidatePath(`/torneos/${validated.torneo_id}`);
    revalidatePath("/");

    return updatedEquipo;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update team");
  }
}

/**
 * Delete a team (soft delete by setting activo = false)
 */
export async function deleteEquipo(id: string): Promise<{ success: boolean }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get torneo_id before deletion for revalidation
    const { data: equipo } = await supabase
      .from("equipos")
      .select("torneo_id")
      .eq("id", id)
      .single();

    // Soft delete: set activo to false instead of deleting
    const { error } = await supabase
      .from("equipos")
      .update({ activo: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error deleting equipo:", error);
      throw new Error(`Failed to delete team: ${error.message}`);
    }

    // Revalidate paths
    revalidatePath("/equipos");
    if (equipo?.torneo_id) {
      revalidatePath(`/torneos/${equipo.torneo_id}`);
    }
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete team");
  }
}

/**
 * Get team statistics
 */
export async function getEquipoStats(equipoId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get statistics from estadistica_equipo table
    const { data: stats, error } = await supabase
      .from("estadistica_equipo")
      .select("*")
      .eq("equipo_id", equipoId)
      .single();

    if (error) {
      // If no stats found, return empty stats
      return {
        PJ: 0,
        PG: 0,
        PE: 0,
        PP: 0,
        GF: 0,
        GC: 0,
        puntos: 0,
      };
    }

    return stats;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch team statistics");
  }
}

/**
 * Get team financial information
 */
export async function getEquipoFinanciero(equipoId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get all transactions for this team
    const { data: transacciones, error } = await supabase
      .from("transacciones_pago")
      .select("*")
      .eq("equipo_id", equipoId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      throw new Error(`Failed to fetch team finances: ${error.message}`);
    }

    // Calculate totals
    const totalIngresos = (transacciones || [])
      .filter((t) => t.es_ingreso)
      .reduce((sum, t) => sum + t.monto, 0);

    const totalGastos = (transacciones || [])
      .filter((t) => !t.es_ingreso)
      .reduce((sum, t) => sum + t.monto, 0);

    const balance = totalIngresos - totalGastos;

    const totalPagado = (transacciones || [])
      .filter((t) => t.pagado)
      .reduce((sum, t) => sum + t.monto, 0);

    const totalPendiente = (transacciones || [])
      .filter((t) => !t.pagado)
      .reduce((sum, t) => sum + t.monto, 0);

    return {
      transacciones: transacciones || [],
      totalIngresos,
      totalGastos,
      balance,
      totalPagado,
      totalPendiente,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch team finances");
  }
}
