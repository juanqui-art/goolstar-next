"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  calculateDebtBreakdown,
  calculateTotalDebt,
  type Transaction,
} from "@/lib/utils/debt";
import {
  createTransaccionSchema,
  marcarPagadoSchema,
} from "@/lib/validations/financiero";
import type { Database } from "@/types/database";

type TransaccionRow = Database["public"]["Tables"]["transacciones_pago"]["Row"];
type TransaccionInsert =
  Database["public"]["Tables"]["transacciones_pago"]["Insert"];

/**
 * Transaccion with related data
 */
export interface TransaccionWithRelations extends TransaccionRow {
  equipos?: {
    id: string;
    nombre: string;
  } | null;
  torneos?: {
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
  transaccionesPendientes: number;
  montoPendiente: number;
  equiposConDeuda: number;
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
 * Get financial dashboard statistics
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

    // Calculate stats
    const ingresos = transacciones.filter((t) => t.es_ingreso);
    const egresos = transacciones.filter((t) => !t.es_ingreso);
    const pendientes = transacciones.filter((t) => !t.pagado);

    const totalIngresos = ingresos.reduce((sum, t) => sum + Number(t.monto), 0);
    const totalEgresos = egresos.reduce((sum, t) => sum + Number(t.monto), 0);
    const montoPendiente = pendientes.reduce(
      (sum, t) => sum + Number(t.monto),
      0,
    );

    // Get unique teams with debt
    const equiposConDeudaSet = new Set(pendientes.map((t) => t.equipo_id));

    return {
      totalIngresos,
      totalEgresos,
      balance: totalIngresos - totalEgresos,
      transaccionesPendientes: pendientes.length,
      montoPendiente,
      equiposConDeuda: equiposConDeudaSet.size,
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

    return data as TransaccionWithRelations[];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get transactions");
  }
}

/**
 * Get transactions for a specific team
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

    return data as TransaccionWithRelations[];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get team transactions");
  }
}

/**
 * Register a new financial transaction
 */
export async function registrarTransaccion(
  data: unknown,
): Promise<{ id: string }> {
  try {
    // 1. Validate with schema
    const validated = createTransaccionSchema.parse(data);

    // 2. Get Supabase client
    const supabase = await createServerSupabaseClient();

    // 3. Prepare data for insert
    const transaccionData: TransaccionInsert = {
      equipo_id: validated.equipo_id,
      torneo_id: validated.torneo_id,
      tipo: validated.tipo,
      monto: validated.monto,
      es_ingreso: validated.es_ingreso,
      descripcion: validated.descripcion || null,
      razon: validated.razon || null,
      metodo_pago: validated.metodo_pago || null,
      referencia_externa: validated.referencia_externa || null,
      pagado: validated.pagado,
      fecha_pago: validated.fecha_pago
        ? validated.fecha_pago.toISOString().split("T")[0]
        : null,
    };

    // 4. Insert transaction
    const { data: newTransaccion, error } = await supabase
      .from("transacciones_pago")
      .insert(transaccionData)
      .select()
      .single();

    if (error) {
      console.error("Error creating transaction:", error);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }

    // 5. Revalidate paths
    revalidatePath("/financiero");
    revalidatePath(`/equipos/${validated.equipo_id}`);
    revalidatePath(`/torneos/${validated.torneo_id}`);

    return { id: newTransaccion.id };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to register transaction");
  }
}

/**
 * Mark a transaction as paid
 */
export async function marcarPagado(
  data: unknown,
): Promise<{ success: boolean }> {
  try {
    // 1. Validate input
    const validated = marcarPagadoSchema.parse(data);

    // 2. Get Supabase client
    const supabase = await createServerSupabaseClient();

    // 3. Update transaction
    const updateData: Partial<TransaccionRow> = {
      pagado: true,
      fecha_pago: validated.fecha_pago
        ? validated.fecha_pago.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    };

    if (validated.metodo_pago) {
      updateData.metodo_pago = validated.metodo_pago;
    }

    if (validated.referencia_externa) {
      updateData.referencia_externa = validated.referencia_externa;
    }

    const { error } = await supabase
      .from("transacciones_pago")
      .update(updateData)
      .eq("id", validated.transaccion_id);

    if (error) {
      console.error("Error marking transaction as paid:", error);
      throw new Error(`Failed to mark transaction as paid: ${error.message}`);
    }

    // 4. Get transaction to revalidate related paths
    const { data: transaccion } = await supabase
      .from("transacciones_pago")
      .select("equipo_id, torneo_id")
      .eq("id", validated.transaccion_id)
      .single();

    // 5. Revalidate paths
    revalidatePath("/financiero");
    if (transaccion) {
      revalidatePath(`/equipos/${transaccion.equipo_id}`);
      revalidatePath(`/torneos/${transaccion.torneo_id}`);
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to mark transaction as paid");
  }
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

    // 3. Convert to Transaction type for debt utils
    const transaccionesForCalc: Transaction[] = transacciones.map((t) => ({
      monto: Number(t.monto),
      es_ingreso: t.es_ingreso,
      pagado: t.pagado,
    }));

    // 4. Calculate using debt utilities
    const deudaPendiente = calculateTotalDebt(transaccionesForCalc);
    const breakdown = calculateDebtBreakdown(transaccionesForCalc);

    // 5. Calculate totals
    const totalCargos = transacciones
      .filter((t) => !t.es_ingreso)
      .reduce((sum, t) => sum + Number(t.monto), 0);

    const totalPagos = transacciones
      .filter((t) => t.es_ingreso)
      .reduce((sum, t) => sum + Number(t.monto), 0);

    return {
      equipoId: equipo.id,
      equipoNombre: equipo.nombre,
      totalCargos,
      totalPagos,
      deudaPendiente,
      porcentajePagado: breakdown.percentagePaid,
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
      .select("id, nombre");

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
        .select("monto, es_ingreso, pagado")
        .eq("equipo_id", equipo.id);

      if (transError) {
        console.error(
          `Error fetching transactions for team ${equipo.id}:`,
          transError,
        );
        continue;
      }

      // Calculate debt
      const transaccionesForCalc: Transaction[] = transacciones.map((t) => ({
        monto: Number(t.monto),
        es_ingreso: t.es_ingreso,
        pagado: t.pagado,
      }));

      const deuda = calculateTotalDebt(transaccionesForCalc);

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
