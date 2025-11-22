import { z } from "zod"

/**
 * Schema for creating and updating tournaments
 */
export const torneoSchema = z.object({
  nombre: z.string().min(1, "Tournament name is required").max(100),
  categoria_id: z.string().uuid("Invalid category"),
  fecha_inicio: z.coerce.date(),
  fecha_fin: z.coerce.date().optional(),
  tiene_fase_grupos: z.boolean().default(true),
  tiene_eliminacion_directa: z.boolean().default(true),
})

export type Torneo = z.infer<typeof torneoSchema>
