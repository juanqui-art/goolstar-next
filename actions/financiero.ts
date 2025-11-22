"use server";

// TODO: Implement after Senior creates database Server Actions
// These are placeholder stubs to be connected to Supabase later

export async function getFinancieroStats() {
  // 1. Aggregate all transacciones across equipos
  // 2. Calculate total ingresos, pendiente, % pagado
  // 3. Return: financial dashboard stats
  throw new Error("Not implemented yet");
}

export async function getTransacciones() {
  // 1. Call Supabase: SELECT from transacciones_pago with equipo relation
  // 2. Return: array of all transactions
  throw new Error("Not implemented yet");
}

export async function getTransaccionesByEquipo(_equipoId: string) {
  // 1. Call Supabase: SELECT where equipo_id = equipoId
  // 2. Return: array of team transactions
  throw new Error("Not implemented yet");
}

export async function registrarTransaccion(_data: {
  equipo_id: string;
  concepto: string;
  monto: number;
  es_ingreso: boolean;
  observaciones?: string;
}) {
  // 1. Validate data
  // 2. Call Supabase: INSERT into transacciones_pago
  // 3. Return: transaction record
  throw new Error("Not implemented yet");
}

export async function marcarPagado(_transaccionId: string) {
  // 1. Call Supabase: UPDATE transacciones_pago SET pagado = true
  // 2. Return: updated transaction
  throw new Error("Not implemented yet");
}

export async function getEquipoBalance(_equipoId: string) {
  // 1. Get all transacciones for equipo
  // 2. Calculate using debt utility functions
  // 3. Return: { total, pagado, pendiente, porcentaje }
  throw new Error("Not implemented yet");
}

export async function getEquiposConDeuda() {
  // 1. Get all equipos with pending transactions
  // 2. Calculate debt for each
  // 3. Return: array of { equipoId, nombre, deuda }
  throw new Error("Not implemented yet");
}
