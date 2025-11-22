import { z } from "zod";

/**
 * Transaction types (matches tipo_transaccion ENUM in database)
 */
export const tiposTransaccion = [
  "abono_inscripcion",
  "pago_arbitro",
  "pago_balon",
  "multa_amarilla",
  "multa_roja",
  "ajuste_manual",
  "devolucion",
] as const;

export type TipoTransaccion = (typeof tiposTransaccion)[number];

/**
 * Payment methods
 */
export const metodosPago = [
  "efectivo",
  "transferencia",
  "deposito",
  "tarjeta",
  "cheque",
  "otro",
] as const;

export type MetodoPago = (typeof metodosPago)[number];

/**
 * Schema for creating and updating financial transactions
 * Matches transacciones_pago table structure
 */
export const transaccionSchema = z.object({
  equipo_id: z.string().uuid("Invalid team ID"),
  torneo_id: z.string().uuid("Invalid tournament ID"),
  tipo: z.enum(tiposTransaccion).catch("abono_inscripcion"),
  monto: z.number().positive("Amount must be positive"),
  es_ingreso: z.boolean().default(true),
  descripcion: z.string().optional(),
  razon: z.string().max(255).optional(),
  partido_id: z.string().uuid("Invalid match ID").optional(),
  tarjeta_id: z.string().uuid("Invalid card ID").optional(),
  jugador_id: z.string().uuid("Invalid player ID").optional(),
  metodo_pago: z.enum(metodosPago).optional(),
  referencia_externa: z.string().max(100).optional(),
  pagado: z.boolean().default(false),
  fecha_pago: z.coerce.date().optional(),
  usuario_admin: z.string().uuid("Invalid admin user ID").optional(),
});

export type Transaccion = z.infer<typeof transaccionSchema>;

/**
 * Schema for creating a transaction (simplified for forms)
 */
export const createTransaccionSchema = transaccionSchema.pick({
  equipo_id: true,
  torneo_id: true,
  tipo: true,
  monto: true,
  es_ingreso: true,
  descripcion: true,
  razon: true,
  metodo_pago: true,
  referencia_externa: true,
  pagado: true,
  fecha_pago: true,
});

export type CreateTransaccion = z.infer<typeof createTransaccionSchema>;

/**
 * Schema for updating transaction payment status
 */
export const marcarPagadoSchema = z.object({
  transaccion_id: z.string().uuid("Invalid transaction ID"),
  fecha_pago: z.coerce.date().optional(),
  metodo_pago: z.enum(metodosPago).optional(),
  referencia_externa: z.string().max(100).optional(),
});
