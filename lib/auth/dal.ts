import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cache } from "react";
import type { UserRole, UserWithRole } from "./types";

/**
 * Data Access Layer (DAL) para autenticación y autorización
 *
 * Este módulo centraliza toda la lógica de verificación de usuarios y permisos.
 * Todas las funciones realizan validación REAL contra la base de datos.
 *
 * IMPORTANTE: Estas funciones deben usarse en:
 * - Server Components
 * - Server Actions
 * - Route Handlers
 *
 * NO usar en Client Components (usar contexto de cliente si es necesario)
 */

/**
 * Obtiene el usuario actual con validación REAL de sesión en DB
 *
 * Usa React cache() para evitar múltiples llamadas a la DB en el mismo render.
 * La sesión se valida contra Supabase para asegurar que no esté expirada.
 *
 * @returns Usuario con rol o null si no está autenticado
 */
export const getCurrentUser = cache(
  async (): Promise<UserWithRole | null> => {
    try {
      const supabase = await createServerSupabaseClient();

      // Verificación REAL: Consulta a base de datos
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      // Obtener rol del usuario desde metadata
      // Si no tiene rol asignado, usar "user" por defecto
      const role = (user.user_metadata?.role as UserRole) || "user";

      return {
        ...user,
        role,
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }
);

/**
 * Requiere que el usuario esté autenticado
 *
 * Lanza error si no está autenticado.
 * Útil para Server Actions que requieren autenticación.
 *
 * @throws Error si el usuario no está autenticado
 * @returns Usuario autenticado con rol
 *
 * @example
 * ```ts
 * export async function myAction() {
 *   const user = await requireAuth();
 *   // user está garantizado que no es null
 * }
 * ```
 */
export async function requireAuth(): Promise<UserWithRole> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }

  return user;
}

/**
 * Requiere que el usuario sea administrador
 *
 * Lanza error si no está autenticado o no es admin.
 * Útil para Server Actions que solo admins pueden ejecutar.
 *
 * @throws Error si el usuario no es admin
 * @returns Usuario admin
 *
 * @example
 * ```ts
 * export async function createTorneo() {
 *   await requireAdmin();
 *   // Solo admins llegan aquí
 * }
 * ```
 */
export async function requireAdmin(): Promise<UserWithRole> {
  const user = await requireAuth();

  if (user.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  return user;
}

/**
 * Requiere que el usuario sea director de un equipo específico
 *
 * Lanza error si:
 * - No está autenticado
 * - No es director del equipo especificado
 * - No es admin (los admins pueden gestionar cualquier equipo)
 *
 * @param equipoId ID del equipo a verificar
 * @throws Error si el usuario no puede gestionar el equipo
 * @returns Usuario autorizado
 *
 * @example
 * ```ts
 * export async function addJugador(equipoId: string) {
 *   await requireDirector(equipoId);
 *   // Solo director del equipo o admin llegan aquí
 * }
 * ```
 */
export async function requireDirector(
  equipoId: string
): Promise<UserWithRole> {
  const user = await requireAuth();

  // Admin puede acceder a todo
  if (user.role === "admin") {
    return user;
  }

  // Verificar que el usuario es director del equipo
  const supabase = await createServerSupabaseClient();
  const { data: equipo, error } = await supabase
    .from("equipos")
    .select("dirigente_id")
    .eq("id", equipoId)
    .single();

  if (error || !equipo) {
    throw new Error("Team not found");
  }

  if (equipo.dirigente_id !== user.id) {
    throw new Error("Forbidden: You are not the director of this team");
  }

  return user;
}

/**
 * Verifica si el usuario tiene un rol específico
 *
 * @param role Rol a verificar
 * @returns true si el usuario tiene el rol, false si no
 *
 * @example
 * ```ts
 * const isAdmin = await hasRole("admin");
 * if (isAdmin) {
 *   // Mostrar opciones de admin
 * }
 * ```
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Verifica si el usuario tiene al menos uno de los roles especificados
 *
 * @param roles Array de roles a verificar
 * @returns true si el usuario tiene alguno de los roles
 *
 * @example
 * ```ts
 * const canManage = await hasAnyRole(["admin", "director"]);
 * if (canManage) {
 *   // Mostrar opciones de gestión
 * }
 * ```
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  return user ? roles.includes(user.role) : false;
}

// Re-export permission functions
export {
    can,
    canAccessAdmin,
    canManageEquipo,
    canManageJugadores,
    canViewFinanciero
} from "./permissions";

