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
    fecha: z.coerce.date(),
    cancha: z.string().min(1, "Field location is required").max(100),
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

/**
 * Schema for recording a goal
 */
export const golSchema = z.object({
  partido_id: z.string().uuid("Invalid match"),
  jugador_id: z.string().uuid("Invalid player"),
  equipo_id: z.string().uuid("Invalid team"),
  minuto: z.number().min(0, "Minute must be positive").max(120, "Minute must be <= 120"),
  es_propio: z.boolean().default(false),
});

export type Gol = z.infer<typeof golSchema>;

/**
 * Schema for recording a card
 */
export const tarjetaSchema = z.object({
  partido_id: z.string().uuid("Invalid match"),
  jugador_id: z.string().uuid("Invalid player"),
  equipo_id: z.string().uuid("Invalid team"),
  tipo: z.enum(["AMARILLA", "ROJA", "AMARILLA_ROJA"]),
  minuto: z.number().min(0, "Minute must be positive").max(120, "Minute must be <= 120"),
  razon: z.string().max(255).optional(),
});

export type Tarjeta = z.infer<typeof tarjetaSchema>;

/**
 * Schema for recording a substitution
 */
export const cambioSchema = z.object({
  partido_id: z.string().uuid("Invalid match"),
  equipo_id: z.string().uuid("Invalid team"),
  jugador_sale_id: z.string().uuid("Invalid player"),
  jugador_entra_id: z.string().uuid("Invalid player"),
  minuto: z.number().min(0, "Minute must be positive").max(120, "Minute must be <= 120"),
})
.refine((data) => data.jugador_sale_id !== data.jugador_entra_id, {
  message: "Players must be different",
  path: ["jugador_entra_id"],
});

export type Cambio = z.infer<typeof cambioSchema>;
