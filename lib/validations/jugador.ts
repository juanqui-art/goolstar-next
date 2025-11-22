import { z } from "zod";

/**
 * Schema for creating and updating players
 */
export const jugadorSchema = z.object({
  equipo_id: z.string().uuid("Invalid team"),
  primer_nombre: z.string().min(1, "First name is required").max(50),
  segundo_nombre: z.string().max(50).optional(),
  primer_apellido: z.string().min(1, "Last name is required").max(50),
  segundo_apellido: z.string().max(50).optional(),
  cedula: z.string().max(20).optional(),
  numero_dorsal: z
    .number()
    .min(1, "Jersey number must be between 1 and 99")
    .max(99)
    .optional(),
  posicion: z.string().max(30).optional(),
  nivel: z.enum(["1", "2", "3", "4", "5"]).default("3"),
});

export type Jugador = z.infer<typeof jugadorSchema>;
