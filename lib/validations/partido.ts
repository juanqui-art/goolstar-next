import { z } from "zod";

/**
 * Schema for creating and updating matches
 * Critical constraint: A match references EITHER a jornada (group phase)
 * OR a fase_eliminatoria (knockout phase), but NOT both
 */
export const partidoSchema = z
  .object({
    torneo_id: z.string().uuid("Invalid tournament"),
    equipo_1_id: z.string().uuid("Invalid team"),
    equipo_2_id: z.string().uuid("Invalid team"),
    jornada_id: z.string().uuid("Invalid match day").optional(),
    fase_eliminatoria_id: z.string().uuid("Invalid knockout phase").optional(),
    arbitro_id: z.string().uuid("Invalid referee").optional(),
    fecha: z.coerce.date().optional(),
    cancha: z.string().max(100).optional(),
  })
  .refine((data) => data.equipo_1_id !== data.equipo_2_id, {
    message: "Teams must be different",
    path: ["equipo_2_id"],
  })
  .refine(
    (data) => {
      const hasJornada = data.jornada_id !== undefined;
      const hasFase = data.fase_eliminatoria_id !== undefined;
      // Allow neither (TBD matches) but not both
      return !(hasJornada && hasFase);
    },
    {
      message:
        "Match must reference either group phase OR knockout phase, not both",
      path: ["fase_eliminatoria_id"],
    },
  );

export type Partido = z.infer<typeof partidoSchema>;

/**
 * Schema for recording match results
 */
export const partidoResultadoSchema = z.object({
  goles_equipo_1: z.number().min(0, "Goals must be non-negative"),
  goles_equipo_2: z.number().min(0, "Goals must be non-negative"),
  resultado_retiro: z.enum(["equipo_1", "equipo_2"]).optional(),
  resultado_inasistencia: z.enum(["equipo_1", "equipo_2"]).optional(),
  sancion: z.enum(["equipo_1", "equipo_2"]).optional(),
  penales_equipo_1: z.number().optional(),
  penales_equipo_2: z.number().optional(),
});

export type PartidoResultado = z.infer<typeof partidoResultadoSchema>;
