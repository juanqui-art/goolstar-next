"use server";

// TODO: Implement after Senior creates database Server Actions
// These are placeholder stubs to be connected to Supabase later

export async function createJugador(_data: unknown): Promise<{ id: string }> {
  // 1. Validate with jugadorSchema
  // 2. Call Supabase: INSERT into jugadores
  // 3. Return: { id: newJugador.id }
  throw new Error("Not implemented yet");
}

export async function getJugadores() {
  // 1. Call Supabase: SELECT from jugadores with equipo relation
  // 2. Return: array of jugadores
  throw new Error("Not implemented yet");
}

export async function getJugador(_id: string) {
  // 1. Call Supabase: SELECT where id = id with stats, cards, suspensions
  // 2. Return: single jugador with complete profile
  throw new Error("Not implemented yet");
}

export async function updateJugador(_id: string, _data: unknown) {
  // 1. Validate with jugadorSchema
  // 2. Call Supabase: UPDATE where id = id
  // 3. Return: updated jugador
  throw new Error("Not implemented yet");
}

export async function deleteJugador(_id: string) {
  // 1. Call Supabase: DELETE where id = id
  // 2. Return: success status
  throw new Error("Not implemented yet");
}

export async function getJugadorStats(_id: string) {
  // 1. Call Supabase: aggregate goles, tarjetas, asistencias
  // 2. Return: player statistics
  throw new Error("Not implemented yet");
}

export async function uploadDocumento(_jugadorId: string, _file: File) {
  // 1. Upload file to Supabase Storage
  // 2. Create record in documentos table
  // 3. Return: documento ID
  throw new Error("Not implemented yet");
}
