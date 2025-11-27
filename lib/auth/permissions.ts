import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { UserWithRole } from "./types";

/**
 * Sistema de permisos granular basado en roles
 *
 * Define qué roles pueden realizar qué acciones en cada recurso.
 * Esto permite un control de acceso fino y fácil de mantener.
 */

/**
 * Matriz de permisos por recurso y acción
 *
 * Estructura:
 * - Recurso (torneos, equipos, etc.)
 *   - Acción (create, read, update, delete)
 *     - Array de roles permitidos
 */
export const permissions = {
  // Gestión de torneos
  torneos: {
    create: ["admin"],
    read: ["admin", "director", "user"],
    update: ["admin"],
    delete: ["admin"],
  },

  // Gestión de equipos
  equipos: {
    create: ["admin"],
    read: ["admin", "director", "user"],
    update: ["admin", "director"], // Director solo su equipo
    delete: ["admin"],
  },

  // Gestión de jugadores
  jugadores: {
    create: ["admin", "director"], // Director solo en su equipo
    read: ["admin", "director", "user"],
    update: ["admin", "director"], // Director solo su equipo
    delete: ["admin"],
  },

  // Gestión de partidos
  partidos: {
    create: ["admin"],
    read: ["admin", "director", "user"],
    update: ["admin"],
    delete: ["admin"],
  },

  // Gestión financiera
  financiero: {
    create: ["admin"],
    read: ["admin", "director"], // Director solo su equipo
    update: ["admin"],
    delete: ["admin"],
  },

  // Panel de administración
  admin: {
    access: ["admin"],
    usuarios: ["admin"],
    preinscripciones: ["admin"],
    documentos: ["admin"],
  },
} as const;

/**
 * Verifica si un usuario puede realizar una acción en un recurso
 *
 * @param user Usuario a verificar (puede ser null)
 * @param resource Recurso (torneos, equipos, etc.)
 * @param action Acción (create, read, update, delete)
 * @returns true si el usuario tiene permiso, false si no
 *
 * @example
 * ```ts
 * const user = await getCurrentUser();
 * if (can(user, "torneos", "create")) {
 *   // Mostrar botón de crear torneo
 * }
 * ```
 */
export function can(
  user: UserWithRole | null,
  resource: keyof typeof permissions,
  action: string
): boolean {
  if (!user) return false;

  const resourcePermissions = permissions[resource];
  if (!resourcePermissions) return false;

  const allowedRoles =
    resourcePermissions[action as keyof typeof resourcePermissions];
  if (!allowedRoles) return false;

  // Type assertion needed because TypeScript can't infer the array type from const object
  return (allowedRoles as readonly string[]).includes(user.role);
}

/**
 * Verifica si un usuario puede acceder al panel de admin
 *
 * @param user Usuario a verificar
 * @returns true si puede acceder al panel de admin
 *
 * @example
 * ```ts
 * const user = await getCurrentUser();
 * if (canAccessAdmin(user)) {
 *   // Mostrar link al panel de admin
 * }
 * ```
 */
export function canAccessAdmin(user: UserWithRole | null): boolean {
  return can(user, "admin", "access");
}

/**
 * Verifica si un usuario puede gestionar un equipo específico
 *
 * Admin puede gestionar cualquier equipo.
 * Director solo puede gestionar su propio equipo.
 *
 * @param user Usuario a verificar
 * @param equipoId ID del equipo
 * @returns true si puede gestionar el equipo
 *
 * @example
 * ```ts
 * const user = await getCurrentUser();
 * const canManage = await canManageEquipo(user, equipoId);
 * if (canManage) {
 *   // Mostrar opciones de edición
 * }
 * ```
 */
export async function canManageEquipo(
  user: UserWithRole | null,
  equipoId: string
): Promise<boolean> {
  if (!user) return false;

  // Admin puede gestionar cualquier equipo
  if (user.role === "admin") return true;

  // Director solo puede gestionar su propio equipo
  if (user.role === "director") {
    const supabase = await createServerSupabaseClient();

    const { data: equipo } = await supabase
      .from("equipos")
      .select("dirigente_id")
      .eq("id", equipoId)
      .single();

    return equipo?.dirigente_id === user.id;
  }

  return false;
}

/**
 * Verifica si un usuario puede gestionar jugadores de un equipo
 *
 * @param user Usuario a verificar
 * @param equipoId ID del equipo del jugador
 * @returns true si puede gestionar jugadores del equipo
 */
export async function canManageJugadores(
  user: UserWithRole | null,
  equipoId: string
): Promise<boolean> {
  // Misma lógica que equipos
  return canManageEquipo(user, equipoId);
}

/**
 * Verifica si un usuario puede ver información financiera de un equipo
 *
 * @param user Usuario a verificar
 * @param equipoId ID del equipo
 * @returns true si puede ver info financiera
 */
export async function canViewFinanciero(
  user: UserWithRole | null,
  equipoId: string
): Promise<boolean> {
  // Admin y director del equipo pueden ver
  return canManageEquipo(user, equipoId);
}
