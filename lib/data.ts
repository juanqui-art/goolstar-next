/**
 * Data Layer for GoolStar - Cache Components Implementation
 *
 * This file contains all data fetching functions with explicit caching strategies:
 * - ✅ CACHED: Data that changes infrequently (Categorías, Torneos, Equipos)
 * - ❌ NO CACHED: Critical/dynamic data (Documentos, Transacciones, Partidos en vivo)
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * ===========================================================================
 * CATEGORÍAS - Estáticas, cachear por días
 * ===========================================================================
 */

export async function getCategorias() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("nombre");

  if (error) throw new Error(`Failed to fetch categorías: ${error.message}`);
  return data || [];
}

export async function getCategoriaById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Failed to fetch categoría: ${error.message}`);
  return data;
}

/**
 * ===========================================================================
 * TORNEOS - Semi-estáticos, cachear por horas
 * ===========================================================================
 */

export async function getTorneos() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("torneos")
    .select("*, categorias(nombre)")
    .eq("activo", true)
    .order("fecha_inicio", { ascending: false });

  if (error) throw new Error(`Failed to fetch torneos: ${error.message}`);
  return data || [];
}

export async function getTorneoById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("torneos")
    .select("*, categorias(*)")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Failed to fetch torneo: ${error.message}`);
  return data;
}

/**
 * ===========================================================================
 * EQUIPOS - Semi-estáticos, cachear por horas
 * ===========================================================================
 */

export async function getEquiposForTorneo(torneoId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("equipos")
    .select("*, jugadores(count)")
    .eq("torneo_id", torneoId)
    .order("nombre");

  if (error) throw new Error(`Failed to fetch equipos: ${error.message}`);
  return data || [];
}

export async function getEquipoById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("equipos")
    .select("*, torneos(nombre, id), jugadores(*)")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Failed to fetch equipo: ${error.message}`);
  return data;
}

export async function getTodosLosEquipos() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("equipos")
    .select("*, torneos(nombre)")
    .order("nombre");

  if (error) throw new Error(`Failed to fetch equipos: ${error.message}`);
  return data || [];
}

/**
 * ===========================================================================
 * JUGADORES - Semi-estáticos, cachear por horas
 * ===========================================================================
 */

export async function getJugadoresForEquipo(equipoId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("jugadores")
    .select("*")
    .eq("equipo_id", equipoId)
    .order("nombre");

  if (error) throw new Error(`Failed to fetch jugadores: ${error.message}`);
  return data || [];
}

export async function getJugadorById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("jugadores")
    .select("*, equipos(nombre, id, torneos(nombre, id))")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Failed to fetch jugador: ${error.message}`);
  return data;
}

export async function getTodosLosJugadores() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("jugadores")
    .select("*, equipos(nombre)")
    .order("nombre");

  if (error) throw new Error(`Failed to fetch jugadores: ${error.message}`);
  return data || [];
}

/**
 * ===========================================================================
 * TABLA DE POSICIONES - Semi-estático, cachear con invalidación manual
 * ===========================================================================
 */

export async function getTablaPosiciones(torneoId: string) {
  const supabase = await createServerSupabaseClient();

  // Usar la función RPC si existe, o consulta directa a estadistica_equipo
  const { data, error } = await supabase
    .from("estadistica_equipo")
    .select("*, equipos(nombre)")
    .eq("torneo_id", torneoId)
    .order("puntos", { ascending: false })
    .order("diferencia_goles", { ascending: false });

  if (error)
    throw new Error(`Failed to fetch tabla posiciones: ${error.message}`);
  return data || [];
}

/**
 * ===========================================================================
 * DOCUMENTOS - Dinámicos, NO CACHEAR (CRÍTICO)
 * ===========================================================================
 */

export async function getDocumentosPendientes() {
  // SIN  → Siempre dinámico
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("jugador_documentos")
    .select("*")
    .eq("estado", "pendiente")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch documentos: ${error.message}`);
  return data || [];
}

export async function getTodosLosDocumentos() {
  // SIN  → Siempre dinámico
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("jugador_documentos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch documentos: ${error.message}`);
  return data || [];
}

/**
 * ===========================================================================
 * TRANSACCIONES FINANCIERAS - Críticas, NO CACHEAR
 * ===========================================================================
 */

export async function getTransacciones(equipoId?: string) {
  // SIN  → Siempre dinámico (datos financieros críticos)
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("transacciones_pago")
    .select("*, equipos(nombre, id)")
    .order("fecha", { ascending: false });

  if (equipoId) {
    query = query.eq("equipo_id", equipoId);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Failed to fetch transacciones: ${error.message}`);
  return data || [];
}

export async function getDeudaEquipo(equipoId: string) {
  // SIN  → Siempre dinámico (financiero crítico)
  const supabase = await createServerSupabaseClient();

  // Calcular deuda total del equipo
  const { data, error } = await supabase
    .from("transacciones_pago")
    .select("monto")
    .eq("equipo_id", equipoId);

  if (error) throw new Error(`Failed to fetch deuda: ${error.message}`);

  const total = data?.reduce((sum, t) => sum + (t.monto || 0), 0) || 0;
  return total;
}

/**
 * ===========================================================================
 * PARTIDOS - Dinámicos (en vivo), NO CACHEAR
 * ===========================================================================
 */

export async function getPartidoById(id: string) {
  // SIN  → Siempre dinámico (partidos pueden estar en vivo)
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("partidos")
    .select(`
      *,
      goles(*),
      tarjetas(*),
      cambios(*),
      equipo_1:equipos!equipo_1_id(id, nombre),
      equipo_2:equipos!equipo_2_id(id, nombre),
      torneos(id, nombre)
    `)
    .eq("id", id)
    .single();

  if (error) throw new Error(`Failed to fetch partido: ${error.message}`);
  return data;
}

export async function getPartidosDelTorneo(torneoId: string) {
  // SIN  → Siempre dinámico (pueden tener cambios en vivo)
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("partidos")
    .select(`
      *,
      equipo_1:equipos!equipo_1_id(id, nombre),
      equipo_2:equipos!equipo_2_id(id, nombre),
      jornadas(numero)
    `)
    .eq("torneo_id", torneoId)
    .order("fecha", { ascending: false });

  if (error) throw new Error(`Failed to fetch partidos: ${error.message}`);
  return data || [];
}

export async function getTodosLosPartidos() {
  // SIN  → Siempre dinámico
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("partidos")
    .select(`
      *,
      equipo_1:equipos!equipo_1_id(id, nombre),
      equipo_2:equipos!equipo_2_id(id, nombre),
      torneos(nombre)
    `)
    .order("fecha", { ascending: false });

  if (error) throw new Error(`Failed to fetch partidos: ${error.message}`);
  return data || [];
}

/**
 * ===========================================================================
 * TARJETAS Y SUSPENSIONES - Críticas, NO CACHEAR
 * ===========================================================================
 */

export async function getTarjetasActivas(jugadorId: string) {
  // SIN  → Siempre dinámico (crítico para elegibilidad)
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("tarjetas")
    .select("*")
    .eq("jugador_id", jugadorId)
    .eq("activa", true);

  if (error) throw new Error(`Failed to fetch tarjetas: ${error.message}`);
  return data || [];
}

/**
 * ===========================================================================
 * USUARIOS - Sensibles, NO CACHEAR
 * ===========================================================================
 */

export async function getUsuarios() {
  // SIN  → Siempre dinámico (datos sensibles de usuarios)
  const supabase = await createServerSupabaseClient();

  // Obtener usuarios de Supabase Auth
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  if (error) throw new Error(`Failed to fetch usuarios: ${error.message}`);
  return users || [];
}
