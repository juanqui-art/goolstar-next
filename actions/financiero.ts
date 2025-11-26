"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  createTransaccionSchema,
  updateTransaccionSchema,
  registrarPagoSchema,
} from "@/lib/validations/financiero";
import type { Database } from "@/types/database";

type TransaccionRow = Database["public"]["Tables"]["transacciones_pago"]["Row"];
type TransaccionInsert =
  Database["public"]["Tables"]["transacciones_pago"]["Insert"];
type TransaccionUpdate =
  Database["public"]["Tables"]["transacciones_pago"]["Update"];

/**
 * Transaccion with related data
 * Maps database fields to frontend-friendly names
 */
export interface TransaccionWithRelations extends TransaccionRow {
  fecha: string; // Mapped from created_at (for display purposes)
  concepto: string; // Mapped from descripcion
  observaciones?: string | null; // Mapped from razon
  equipos?: {
    id: string;
    nombre: string;
  } | null;
  partidos?: {
    id: string;
    fecha: string;
  } | null;
  jugadores?: {
    id: string;
    nombre_completo: string;
  } | null;
}

/**
 * Financial dashboard statistics
 */
export interface FinancieroStats {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  totalTransacciones: number;
}

/**
 * Get financial dashboard statistics (simplified for now)
 */
export async function getFinancieroStats(): Promise<FinancieroStats> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get all transactions
    const { data: transacciones, error } = await supabase
      .from("transacciones_pago")
      .select("*");

    if (error) {
      console.error("Error fetching transactions:", error);
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }

    // Calculate basic stats
    const totalIngresos = transacciones
      .filter((t) => t.es_ingreso)
      .reduce((sum, t) => sum + Number(t.monto), 0);

    const totalEgresos = transacciones
      .filter((t) => !t.es_ingreso)
      .reduce((sum, t) => sum + Number(t.monto), 0);

    return {
      totalIngresos,
      totalEgresos,
      balance: totalIngresos - totalEgresos,
      totalTransacciones: transacciones.length,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get financial statistics");
  }
}

/**
 * Get all transactions with related data
 * Maps database fields to frontend-friendly names
 */
export async function getTransacciones(): Promise<TransaccionWithRelations[]> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("transacciones_pago")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }

    // Map database fields to frontend-friendly names
    return data.map((t) => ({
      ...t,
      fecha: t.created_at, // Map created_at to fecha for display
      concepto: t.descripcion || "",
      observaciones: t.razon,
    })) as TransaccionWithRelations[];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get transactions");
  }
}

/**
 * Get transactions for a specific team
 * Maps database fields to frontend-friendly names
 */
export async function getTransaccionesByEquipo(
  equipoId: string,
): Promise<TransaccionWithRelations[]> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("transacciones_pago")
      .select("*")
      .eq("equipo_id", equipoId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching team transactions:", error);
      throw new Error(`Failed to fetch team transactions: ${error.message}`);
    }

    // Map database fields to frontend-friendly names
    return data.map((t) => ({
      ...t,
      fecha: t.created_at, // Map created_at to fecha for display
      concepto: t.descripcion || "",
      observaciones: t.razon,
    })) as TransaccionWithRelations[];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get team transactions");
  }
}

/**
 * Create a new financial transaction
 */
export async function createTransaccion(
  data: unknown,
): Promise<{ id: string }> {
  try {
    // 1. Validate with schema
    const validated = createTransaccionSchema.parse(data);

    // 2. Get Supabase client
    const supabase = await createServerSupabaseClient();

    // 3. Get torneo_id from equipo
    const { data: equipo, error: equipoError } = await supabase
      .from("equipos")
      .select("torneo_id")
      .eq("id", validated.equipo_id)
      .single();

    if (equipoError || !equipo) {
      throw new Error("Team not found or has no tournament");
    }

    // 4. Prepare data for insert (map concepto to descripcion)
    const transaccionData: TransaccionInsert = {
      equipo_id: validated.equipo_id,
      torneo_id: equipo.torneo_id,
      partido_id: validated.partido_id || null,
      tipo: validated.tipo,
      monto: validated.monto,
      es_ingreso: validated.es_ingreso,
      descripcion: validated.concepto, // Map concepto to descripcion
      razon: validated.observaciones || null,
      metodo_pago: validated.metodo_pago || "efectivo",
      referencia_externa: validated.referencia_pago || null,
      pagado: validated.es_ingreso, // If es_ingreso, it's already paid
      fecha_pago: validated.fecha_real_transaccion
        ? validated.fecha_real_transaccion.toISOString().split("T")[0]
        : null,
    };

    // 5. Insert transaction
    const { data: newTransaccion, error } = await supabase
      .from("transacciones_pago")
      .insert(transaccionData)
      .select()
      .single();

    if (error) {
      console.error("Error creating transaction:", error);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }

    // 6. Revalidate paths
    revalidatePath("/financiero");
    revalidatePath(`/equipos/${validated.equipo_id}`);
    revalidatePath("/");

    return { id: newTransaccion.id };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create transaction");
  }
}

/**
 * Get a single transaction by ID
 */
export async function getTransaccion(
  id: string,
): Promise<TransaccionWithRelations> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("transacciones_pago")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching transaction:", error);
      throw new Error(`Transaction not found: ${error.message}`);
    }

    return data as TransaccionWithRelations;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch transaction");
  }
}

/**
 * Update a transaction
 */
export async function updateTransaccion(
  id: string,
  data: unknown,
): Promise<TransaccionRow> {
  try {
    // 1. Validate with schema
    const validated = updateTransaccionSchema.parse(data);

    // 2. Get Supabase client
    const supabase = await createServerSupabaseClient();

    // 3. Build update data
    const updateData: TransaccionUpdate = {};

    if (validated.equipo_id) updateData.equipo_id = validated.equipo_id;
    if (validated.partido_id !== undefined)
      updateData.partido_id = validated.partido_id;
    if (validated.tipo) updateData.tipo = validated.tipo;
    if (validated.monto !== undefined) updateData.monto = validated.monto;
    if (validated.es_ingreso !== undefined)
      updateData.es_ingreso = validated.es_ingreso;
    if (validated.concepto) updateData.descripcion = validated.concepto;
    if (validated.metodo_pago) updateData.metodo_pago = validated.metodo_pago;
    if (validated.referencia_pago !== undefined)
      updateData.referencia_externa = validated.referencia_pago;
    if (validated.fecha_real_transaccion)
      updateData.fecha_pago = validated.fecha_real_transaccion
        .toISOString()
        .split("T")[0];
    if (validated.observaciones !== undefined)
      updateData.razon = validated.observaciones;

    // 4. Update transaction
    const { data: updatedTransaccion, error } = await supabase
      .from("transacciones_pago")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating transaction:", error);
      throw new Error(`Failed to update transaction: ${error.message}`);
    }

    // 5. Revalidate paths
    revalidatePath("/financiero");
    revalidatePath(`/equipos/${updatedTransaccion.equipo_id}`);
    revalidatePath("/");

    return updatedTransaccion;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update transaction");
  }
}

/**
 * Delete a transaction (soft delete)
 */
export async function deleteTransaccion(
  id: string,
): Promise<{ success: boolean }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get equipo_id before deletion for revalidation
    const { data: transaccion } = await supabase
      .from("transacciones_pago")
      .select("equipo_id")
      .eq("id", id)
      .single();

    // Delete the transaction (actual delete, not soft delete)
    const { error } = await supabase
      .from("transacciones_pago")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting transaction:", error);
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }

    // Revalidate paths
    revalidatePath("/financiero");
    if (transaccion?.equipo_id) {
      revalidatePath(`/equipos/${transaccion.equipo_id}`);
    }
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete transaction");
  }
}

/**
 * Team balance information
 */
export interface EquipoBalance {
  equipoId: string;
  equipoNombre: string;
  totalCargos: number;
  totalPagos: number;
  deudaPendiente: number;
  porcentajePagado: number;
  transacciones: TransaccionWithRelations[];
}

/**
 * Get balance information for a specific team
 */
export async function getEquipoBalance(
  equipoId: string,
): Promise<EquipoBalance> {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Get team info
    const { data: equipo, error: equipoError } = await supabase
      .from("equipos")
      .select("id, nombre")
      .eq("id", equipoId)
      .single();

    if (equipoError) {
      console.error("Error fetching team:", equipoError);
      throw new Error(`Failed to fetch team: ${equipoError.message}`);
    }

    // 2. Get all transactions for team
    const transacciones = await getTransaccionesByEquipo(equipoId);

    // 3. Calculate totals
    const totalCargos = transacciones
      .filter((t) => !t.es_ingreso)
      .reduce((sum, t) => sum + Number(t.monto), 0);

    const totalPagos = transacciones
      .filter((t) => t.es_ingreso)
      .reduce((sum, t) => sum + Number(t.monto), 0);

    const deudaPendiente = totalCargos - totalPagos;
    const porcentajePagado =
      totalCargos > 0 ? (totalPagos / totalCargos) * 100 : 0;

    return {
      equipoId: equipo.id,
      equipoNombre: equipo.nombre,
      totalCargos,
      totalPagos,
      deudaPendiente,
      porcentajePagado,
      transacciones,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get team balance");
  }
}

/**
 * Get all teams with outstanding debt
 */
export async function getEquiposConDeuda(): Promise<
  Array<{
    equipoId: string;
    equipoNombre: string;
    deuda: number;
  }>
> {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Get all teams
    const { data: equipos, error: equiposError } = await supabase
      .from("equipos")
      .select("id, nombre")
      .eq("activo", true);

    if (equiposError) {
      console.error("Error fetching teams:", equiposError);
      throw new Error(`Failed to fetch teams: ${equiposError.message}`);
    }

    // 2. Get transactions for each team and calculate debt
    const equiposConDeuda: Array<{
      equipoId: string;
      equipoNombre: string;
      deuda: number;
    }> = [];

    for (const equipo of equipos) {
      const { data: transacciones, error: transError } = await supabase
        .from("transacciones_pago")
        .select("monto, es_ingreso")
        .eq("equipo_id", equipo.id);

      if (transError) {
        console.error(
          `Error fetching transactions for team ${equipo.id}:`,
          transError,
        );
        continue;
      }

      // Calculate debt (cargos - pagos)
      const totalCargos = transacciones
        .filter((t) => !t.es_ingreso)
        .reduce((sum, t) => sum + Number(t.monto), 0);

      const totalPagos = transacciones
        .filter((t) => t.es_ingreso)
        .reduce((sum, t) => sum + Number(t.monto), 0);

      const deuda = totalCargos - totalPagos;

      // Only include teams with debt > 0
      if (deuda > 0) {
        equiposConDeuda.push({
          equipoId: equipo.id,
          equipoNombre: equipo.nombre,
          deuda,
        });
      }
    }

    // 3. Sort by debt (highest first)
    return equiposConDeuda.sort((a, b) => b.deuda - a.deuda);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get teams with debt");
  }
}

/**
 * Get tournament financial summary
 */
export async function getTorneoFinanciero(torneoId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get all teams in tournament
    const { data: equipos, error: equiposError } = await supabase
      .from("equipos")
      .select("id")
      .eq("torneo_id", torneoId);

    if (equiposError) {
      throw new Error(
        `Failed to fetch tournament teams: ${equiposError.message}`,
      );
    }

    const equipoIds = equipos.map((e) => e.id);

    // Get all transactions for tournament teams
    const { data: transacciones, error: transError } = await supabase
      .from("transacciones_pago")
      .select("*")
      .in("equipo_id", equipoIds);

    if (transError) {
      throw new Error(
        `Failed to fetch tournament transactions: ${transError.message}`,
      );
    }

    // Calculate totals
    const totalIngresos = transacciones
      .filter((t) => t.es_ingreso)
      .reduce((sum, t) => sum + Number(t.monto), 0);

    const totalEgresos = transacciones
      .filter((t) => !t.es_ingreso)
      .reduce((sum, t) => sum + Number(t.monto), 0);

    const balance = totalIngresos - totalEgresos;
    const deudaPendiente = totalEgresos - totalIngresos;

    return {
      totalIngresos,
      totalEgresos,
      balance,
      deudaPendiente: deudaPendiente > 0 ? deudaPendiente : 0,
      totalTransacciones: transacciones.length,
      equiposCount: equipos.length,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get tournament finances");
  }
}
