"use server";

// TODO: Implement after Senior creates database Server Actions
// These are placeholder stubs to be connected to Supabase later

export async function createPartido(_data: unknown): Promise<{ id: string }> {
  // 1. Validate with partidoSchema
  // 2. Call Supabase: INSERT into partidos
  // 3. Return: { id: newPartido.id }
  throw new Error("Not implemented yet");
}

export async function getPartidos() {
  // 1. Call Supabase: SELECT from partidos with equipos relations
  // 2. Return: array of partidos
  throw new Error("Not implemented yet");
}

export async function getPartido(_id: string) {
  // 1. Call Supabase: SELECT where id = id with goles, tarjetas, cambios
  // 2. Return: single partido with complete data
  throw new Error("Not implemented yet");
}

export async function updatePartido(_id: string, _data: unknown) {
  // 1. Validate with partidoSchema
  // 2. Call Supabase: UPDATE where id = id
  // 3. Return: updated partido
  throw new Error("Not implemented yet");
}

export async function deletePartido(_id: string) {
  // 1. Call Supabase: DELETE where id = id
  // 2. Return: success status
  throw new Error("Not implemented yet");
}

export async function registrarGol(
  _partidoId: string,
  _jugadorId: string,
  _equipoId: string,
  _minuto: number,
) {
  // 1. Call Supabase: INSERT into goles
  // 2. Trigger updates standings automatically
  // 3. Return: gol record
  throw new Error("Not implemented yet");
}

export async function registrarTarjeta(
  _partidoId: string,
  _jugadorId: string,
  _tipoTarjeta: "amarilla" | "roja",
  _minuto: number,
) {
  // 1. Call Supabase: INSERT into tarjetas
  // 2. Trigger updates suspension automatically
  // 3. Return: tarjeta record
  throw new Error("Not implemented yet");
}

export async function registrarCambio(
  _partidoId: string,
  _jugadorSaleId: string,
  _jugadorEntraId: string,
  _minuto: number,
) {
  // 1. Call Supabase: INSERT into cambios
  // 2. Return: cambio record
  throw new Error("Not implemented yet");
}

export async function finalizarPartido(_partidoId: string) {
  // 1. Update partido estado to 'finalizado'
  // 2. Trigger final standings update
  // 3. Return: success status
  throw new Error("Not implemented yet");
}

export async function getPartidoActa(_partidoId: string) {
  // 1. Get partido with all related data (goles, tarjetas, cambios)
  // 2. Format data for acta display
  // 3. Return: formatted acta data
  throw new Error("Not implemented yet");
}
