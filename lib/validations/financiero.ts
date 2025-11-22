import { z } from "zod";

/**
 * Schema for creating and updating financial transactions
 */
export const transaccionSchema = z.object({
  equipo_id: z.string().uuid("Invalid team"),
  concepto: z.string().min(1, "Concept is required").max(255),
  monto: z.number().min(0, "Amount must be non-negative"),
  es_ingreso: z.boolean().default(false),
  pagado: z.boolean().default(false),
  fecha_transaccion: z.coerce.date().optional(),
  metodo_pago: z.string().max(50).optional(),
  referencia: z.string().max(100).optional(),
  notas: z.string().optional(),
});

export type Transaccion = z.infer<typeof transaccionSchema>;

/**
 * Schema for payment records
 */
export const pagoSchema = z.object({
  transaccion_id: z.string().uuid("Invalid transaction"),
  monto: z.number().min(0, "Amount must be non-negative"),
  metodo_pago: z.string().max(50),
  fecha_pago: z.coerce.date(),
  referencia: z.string().max(100).optional(),
  notas: z.string().optional(),
});

export type Pago = z.infer<typeof pagoSchema>;
