"use server"

import { torneoSchema, type Torneo } from "@/lib/validations/torneo"

// TODO: Implement after Senior creates database Server Actions
// These are placeholder stubs to be connected to Supabase later

export async function createTorneo(data: unknown): Promise<{ id: string }> {
  // 1. Validate with torneoSchema
  // 2. Call Supabase: INSERT into torneos
  // 3. Return: { id: newTorneo.id }
  throw new Error("Not implemented yet")
}

export async function getTorneos() {
  // 1. Call Supabase: SELECT from torneos
  // 2. Return: array of torneos
  throw new Error("Not implemented yet")
}

export async function getTorneo(id: string) {
  // 1. Call Supabase: SELECT where id = id
  // 2. Return: single torneo with related data
  throw new Error("Not implemented yet")
}

export async function updateTorneo(id: string, data: unknown) {
  // 1. Validate with torneoSchema
  // 2. Call Supabase: UPDATE where id = id
  // 3. Return: updated torneo
  throw new Error("Not implemented yet")
}

export async function deleteTorneo(id: string) {
  // 1. Call Supabase: DELETE where id = id
  // 2. Return: success status
  throw new Error("Not implemented yet")
}

export async function getStandings(torneoId: string) {
  // 1. Call Supabase function: get_standings(torneo_id)
  // 2. Return: array of team standings sorted
  throw new Error("Not implemented yet")
}

export async function getTorneoStats(torneoId: string) {
  // 1. Call Supabase to aggregate stats
  // 2. Return: tournament statistics
  throw new Error("Not implemented yet")
}
