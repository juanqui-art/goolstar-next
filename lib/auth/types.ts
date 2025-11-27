import type { User } from "@supabase/supabase-js";

/**
 * Roles disponibles en el sistema
 * - admin: Administrador del sistema (acceso completo)
 * - director: Director de equipo (gestiona su equipo)
 * - user: Usuario regular (solo lectura)
 */
export type UserRole = "admin" | "director" | "user";

/**
 * Usuario con información de rol
 * Extiende el tipo User de Supabase con el campo role
 */
export interface UserWithRole extends User {
  role: UserRole;
}

/**
 * Estructura de error de autenticación
 */
export interface AuthError {
  code: string;
  message: string;
}
