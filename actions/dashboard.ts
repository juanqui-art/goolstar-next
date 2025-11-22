"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  torneosActivos: number
  equiposRegistrados: number
  jugadoresRegistrados: number
  partidosProximos: number
  partidosHoy: number
}

/**
 * Dashboard alert interface
 */
export interface DashboardAlert {
  id: string
  type: "warning" | "info" | "destructive"
  title: string
  description: string
}

/**
 * Get dashboard statistics
 * Returns counts for active tournaments, teams, players, and upcoming matches
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createServerSupabaseClient()

  // Get active tournaments count
  const { count: torneosActivos } = await supabase
    .from("torneos")
    .select("*", { count: "exact", head: true })
    .eq("activo", true)

  // Get registered teams count
  const { count: equiposRegistrados } = await supabase
    .from("equipos")
    .select("*", { count: "exact", head: true })

  // Get registered players count
  const { count: jugadoresRegistrados } = await supabase
    .from("jugadores")
    .select("*", { count: "exact", head: true })

  // Get upcoming matches (next 7 days)
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const { count: partidosProximos } = await supabase
    .from("partidos")
    .select("*", { count: "exact", head: true })
    .gte("fecha", today.toISOString())
    .lte("fecha", nextWeek.toISOString())
    .eq("completado", false)

  // Get matches today
  const todayStart = new Date(today.setHours(0, 0, 0, 0))
  const todayEnd = new Date(today.setHours(23, 59, 59, 999))

  const { count: partidosHoy } = await supabase
    .from("partidos")
    .select("*", { count: "exact", head: true })
    .gte("fecha", todayStart.toISOString())
    .lte("fecha", todayEnd.toISOString())
    .eq("completado", false)

  return {
    torneosActivos: torneosActivos || 0,
    equiposRegistrados: equiposRegistrados || 0,
    jugadoresRegistrados: jugadoresRegistrados || 0,
    partidosProximos: partidosProximos || 0,
    partidosHoy: partidosHoy || 0,
  }
}

/**
 * Get dashboard alerts
 * Returns important alerts for the user (suspended players, pending documents, debts, etc.)
 */
export async function getDashboardAlerts(): Promise<DashboardAlert[]> {
  const supabase = await createServerSupabaseClient()
  const alerts: DashboardAlert[] = []

  // Check for suspended players
  const { count: jugadoresSuspendidos } = await supabase
    .from("jugadores")
    .select("*", { count: "exact", head: true })
    .eq("suspendido", true)

  if (jugadoresSuspendidos && jugadoresSuspendidos > 0) {
    alerts.push({
      id: "suspended-players",
      type: "warning",
      title: "Jugadores suspendidos",
      description: `Hay ${jugadoresSuspendidos} jugador${jugadoresSuspendidos > 1 ? "es" : ""} actualmente suspendido${jugadoresSuspendidos > 1 ? "s" : ""}.`,
    })
  }

  // Check for pending documents (estado_verificacion = 'pendiente')
  const { count: documentosPendientes } = await supabase
    .from("documentos")
    .select("*", { count: "exact", head: true })
    .eq("estado_verificacion", "pendiente")

  if (documentosPendientes && documentosPendientes > 0) {
    alerts.push({
      id: "pending-documents",
      type: "info",
      title: "Documentos pendientes de verificación",
      description: `Hay ${documentosPendientes} documento${documentosPendientes > 1 ? "s" : ""} pendiente${documentosPendientes > 1 ? "s" : ""} de verificación.`,
    })
  }

  // Check for teams with high inasistencias (>= 2)
  const { data: equiposInasistencias } = await supabase
    .from("equipos")
    .select("nombre, inasistencias")
    .gte("inasistencias", 2)

  if (equiposInasistencias && equiposInasistencias.length > 0) {
    alerts.push({
      id: "high-absences",
      type: "warning",
      title: "Equipos con inasistencias",
      description: `${equiposInasistencias.length} equipo${equiposInasistencias.length > 1 ? "s" : ""} con 2 o más inasistencias.`,
    })
  }

  // Check for upcoming matches today
  const today = new Date()
  const todayStart = new Date(today.setHours(0, 0, 0, 0))
  const todayEnd = new Date(today.setHours(23, 59, 59, 999))

  const { count: partidosHoy } = await supabase
    .from("partidos")
    .select("*", { count: "exact", head: true })
    .gte("fecha", todayStart.toISOString())
    .lte("fecha", todayEnd.toISOString())
    .eq("completado", false)

  if (partidosHoy && partidosHoy > 0) {
    alerts.push({
      id: "matches-today",
      type: "info",
      title: "Partidos hoy",
      description: `Hay ${partidosHoy} partido${partidosHoy > 1 ? "s" : ""} programado${partidosHoy > 1 ? "s" : ""} para hoy.`,
    })
  }

  return alerts
}

/**
 * Get recent matches (last 5 completed matches)
 */
export async function getRecentMatches() {
  const supabase = await createServerSupabaseClient()

  const { data: partidos, error } = await supabase
    .from("partidos")
    .select(`
      id,
      fecha,
      cancha,
      resultado_local,
      resultado_visitante,
      completado,
      equipo_local:equipos!partidos_equipo_local_id_fkey(nombre),
      equipo_visitante:equipos!partidos_equipo_visitante_id_fkey(nombre)
    `)
    .eq("completado", true)
    .order("fecha", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching recent matches:", error)
    return []
  }

  return partidos || []
}

/**
 * Get upcoming matches (next 5 matches)
 */
export async function getUpcomingMatches() {
  const supabase = await createServerSupabaseClient()
  const today = new Date()

  const { data: partidos, error } = await supabase
    .from("partidos")
    .select(`
      id,
      fecha,
      cancha,
      completado,
      equipo_local:equipos!partidos_equipo_local_id_fkey(nombre),
      equipo_visitante:equipos!partidos_equipo_visitante_id_fkey(nombre)
    `)
    .eq("completado", false)
    .gte("fecha", today.toISOString())
    .order("fecha", { ascending: true })
    .limit(5)

  if (error) {
    console.error("Error fetching upcoming matches:", error)
    return []
  }

  return partidos || []
}
