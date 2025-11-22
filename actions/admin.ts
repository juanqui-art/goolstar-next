"use server"

// TODO: Implement after Senior creates database Server Actions
// These are placeholder stubs to be connected to Supabase later

export async function getAdminStats() {
  // 1. Count documentos pendientes
  // 2. Count usuarios activos
  // 3. Get alertas sistema
  // 4. Return: admin dashboard stats
  throw new Error("Not implemented yet")
}

export async function getDocumentosPendientes() {
  // 1. Call Supabase: SELECT from documentos where estado = 'pendiente'
  // 2. Include jugador and equipo relations
  // 3. Return: array of pending documents
  throw new Error("Not implemented yet")
}

export async function aprobarDocumento(documentoId: string) {
  // 1. Call Supabase: UPDATE documentos SET estado = 'aprobado'
  // 2. Update jugador.documento_aprobado = true
  // 3. Return: success status
  throw new Error("Not implemented yet")
}

export async function rechazarDocumento(documentoId: string, motivo: string) {
  // 1. Call Supabase: UPDATE documentos SET estado = 'rechazado', motivo_rechazo = motivo
  // 2. Notify jugador/equipo (optional)
  // 3. Return: success status
  throw new Error("Not implemented yet")
}

export async function getUsuarios() {
  // 1. Call Supabase Auth: list users
  // 2. Include metadata (rol, nombre, etc.)
  // 3. Return: array of users
  throw new Error("Not implemented yet")
}

export async function crearUsuario(data: {
  email: string
  nombre?: string
  rol: "admin" | "director_equipo" | "jugador"
}) {
  // 1. Create user in Supabase Auth
  // 2. Set user metadata (rol, nombre)
  // 3. Send invitation email
  // 4. Return: user record
  throw new Error("Not implemented yet")
}

export async function updateUsuarioRol(
  userId: string,
  rol: "admin" | "director_equipo" | "jugador"
) {
  // 1. Update user metadata in Supabase Auth
  // 2. Return: success status
  throw new Error("Not implemented yet")
}

export async function toggleUsuarioActivo(userId: string, activo: boolean) {
  // 1. Update user active status in Supabase Auth
  // 2. Return: success status
  throw new Error("Not implemented yet")
}
