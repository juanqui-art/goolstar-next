import { z } from "zod"

/**
 * Schema for creating and updating teams
 */
export const equipoSchema = z.object({
  nombre: z.string().min(1, "Team name is required").max(100),
  categoria_id: z.string().uuid("Invalid category"),
  torneo_id: z.string().uuid("Invalid tournament"),
  dirigente_id: z.string().uuid("Invalid director").optional(),
  color_principal: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/i, "Invalid hex color")
    .optional(),
  color_secundario: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/i, "Invalid hex color")
    .optional(),
  escudo_url: z.string().url("Invalid URL").optional(),
  nivel: z.enum(["1", "2", "3", "4", "5"]).default("3"),
})

export type Equipo = z.infer<typeof equipoSchema>
