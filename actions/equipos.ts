"use server"

import { equipoSchema, type Equipo } from "@/lib/validations/equipo"

// TODO: Implement after Senior creates database Server Actions
// These are placeholder stubs to be connected to Supabase later

export async function createEquipo(data: unknown): Promise<{ id: string }> {
  // 1. Validate with equipoSchema
  // 2. Call Supabase: INSERT into equipos
  // 3. Return: { id: newEquipo.id }
  throw new Error("Not implemented yet")
}

export async function getEquipos() {
  // 1. Call Supabase: SELECT from equipos with relations
  // 2. Return: array of equipos
  throw new Error("Not implemented yet")
}

export async function getEquipo(id: string) {
  // 1. Call Supabase: SELECT where id = id with jugadores
  // 2. Return: single equipo with roster and stats
  throw new Error("Not implemented yet")
}

export async function updateEquipo(id: string, data: unknown) {
  // 1. Validate with equipoSchema
  // 2. Call Supabase: UPDATE where id = id
  // 3. Return: updated equipo
  throw new Error("Not implemented yet")
}

export async function deleteEquipo(id: string) {
  // 1. Call Supabase: DELETE where id = id
  // 2. Return: success status
  throw new Error("Not implemented yet")
}

export async function getEquipoFinanciero(id: string) {
  // 1. Call Supabase: SELECT transacciones_pago where equipo_id = id
  // 2. Calculate balance using debt utility functions
  // 3. Return: financial summary
  throw new Error("Not implemented yet")
}

export async function getEquipoStats(id: string) {
  // 1. Call Supabase: SELECT estadistica_equipo where equipo_id = id
  // 2. Return: team statistics (PJ, PG, PE, PP, GF, GC, puntos)
  throw new Error("Not implemented yet")
}
