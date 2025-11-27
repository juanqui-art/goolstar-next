import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Session } from "@supabase/supabase-js";

/**
 * Helpers para gestión de sesiones
 *
 * Funciones auxiliares para trabajar con sesiones de Supabase
 */

/**
 * Obtiene la sesión actual del usuario
 *
 * @returns Sesión actual o null si no hay sesión
 */
export async function getSession(): Promise<Session | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Refresca la sesión actual
 *
 * Útil para renovar tokens antes de que expiren
 *
 * @returns Nueva sesión o null si falla
 */
export async function refreshSession(): Promise<Session | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession();

    if (error) {
      console.error("Error refreshing session:", error);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error refreshing session:", error);
    return null;
  }
}

/**
 * Verifica si hay una sesión activa
 *
 * @returns true si hay sesión activa, false si no
 */
export async function hasActiveSession(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Obtiene el tiempo restante de la sesión en segundos
 *
 * @returns Segundos restantes o null si no hay sesión
 */
export async function getSessionTimeRemaining(): Promise<number | null> {
  const session = await getSession();

  if (!session?.expires_at) {
    return null;
  }

  const expiresAt = new Date(session.expires_at * 1000);
  const now = new Date();
  const remaining = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);

  return remaining > 0 ? remaining : 0;
}
