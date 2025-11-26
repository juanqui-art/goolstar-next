import { z } from "zod";

/**
 * Transaction types (matches tipo ENUM in transacciones_pago table)
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
 * Payment methods (matches metodo_pago ENUM in database)
 */
export const metodosPago = [
  "efectivo",
  "transferencia",
  "deposito",
  "tarjeta",
  "otro",
] as const;

export type MetodoPago = (typeof metodosPago)[number];

/**
 * Schema for creating and updating financial transactions
 * Matches transacciones_pago table structure exactly:
 * - tipo, monto, es_ingreso, concepto are REQUIRED
 * - metodo_pago defaults to 'efectivo'
 * - All other fields are optional
 */
export const transaccionSchema = z.object({
  equipo_id: z.string().uuid("Invalid team ID"),
  partido_id: z.string().uuid("Invalid match ID").optional().nullable(),
  tipo: z.enum(tiposTransaccion),
  monto: z
    .number()
    .min(0, "Amount must be positive")
    .max(99999999.99, "Amount too large"),
  es_ingreso: z.boolean().default(false),
  concepto: z
    .string()
    .min(1, "Concept is required")
    .max(100, "Concept too long"),
  metodo_pago: z.enum(metodosPago).default("efectivo"),
  referencia_pago: z.string().max(100, "Reference too long").optional(),
  fecha_real_transaccion: z.coerce.date().optional(),
  tarjeta_id: z.string().uuid("Invalid card ID").optional().nullable(),
  jugador_id: z.string().uuid("Invalid player ID").optional().nullable(),
  observaciones: z.string().optional().nullable(),
});

export type Transaccion = z.infer<typeof transaccionSchema>;

/**
 * Schema for creating a transaction (simplified for forms)
 */
export const createTransaccionSchema = transaccionSchema.pick({
  equipo_id: true,
  partido_id: true,
  tipo: true,
  monto: true,
  es_ingreso: true,
  concepto: true,
  metodo_pago: true,
  referencia_pago: true,
  fecha_real_transaccion: true,
  observaciones: true,
});

export type CreateTransaccion = z.infer<typeof createTransaccionSchema>;

/**
 * Schema for updating a transaction
 */
export const updateTransaccionSchema = createTransaccionSchema.partial();

export type UpdateTransaccion = z.infer<typeof updateTransaccionSchema>;

/**
 * Schema for payment registration (payment of existing debts)
 */
export const registrarPagoSchema = z.object({
  equipo_id: z.string().uuid("Invalid team ID"),
  tipo: z.enum(tiposTransaccion),
  monto: z.number().min(0, "Amount must be positive"),
  concepto: z.string().min(1, "Concept is required").max(100),
  metodo_pago: z.enum(metodosPago).default("efectivo"),
  referencia_pago: z.string().max(100).optional(),
  fecha_real_transaccion: z.coerce.date().optional(),
  observaciones: z.string().optional(),
});

export type RegistrarPago = z.infer<typeof registrarPagoSchema>;

/**
 * Schema for registering multiple card payments at once
 */
export const pagoMultipleTarjetasSchema = z.object({
  equipo_id: z.string().uuid("Invalid team ID"),
  tarjeta_ids: z.array(z.string().uuid()).min(1, "Select at least one card"),
  metodo_pago: z.enum(metodosPago).default("efectivo"),
  referencia_pago: z.string().max(100).optional(),
  fecha_pago: z.coerce.date().optional(),
  observaciones: z.string().optional(),
});

export type PagoMultipleTarjetas = z.infer<typeof pagoMultipleTarjetasSchema>;

/**
 * Schema for financial filters
 */
export const filtrosFinancierosSchema = z.object({
  equipo_id: z.string().uuid().optional(),
  tipo: z.enum(tiposTransaccion).optional(),
  es_ingreso: z.boolean().optional(),
  fecha_desde: z.coerce.date().optional(),
  fecha_hasta: z.coerce.date().optional(),
});

export type FiltrosFinancieros = z.infer<typeof filtrosFinancierosSchema>;
