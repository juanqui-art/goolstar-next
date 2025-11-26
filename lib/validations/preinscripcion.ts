import { z } from "zod";

/**
 * Validation schemas for pre-registration (preinscripciones_torneo)
 * Used in landing page form for Facebook Ads campaigns
 */

// =====================================================
// 1. Main schema for creating pre-registration
// =====================================================

export const preinscripcionSchema = z.object({
  // Relación con torneo
  torneo_id: z.string().uuid({
    message: "ID de torneo inválido",
  }),

  // Datos de contacto (3 campos mínimos)
  nombre_completo: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(100, { message: "El nombre no puede superar 100 caracteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
      message: "El nombre solo puede contener letras y espacios",
    })
    .transform((val) => val.trim()),

  email: z
    .string()
    .min(1, { message: "El email es requerido" })
    .email({ message: "Email inválido" })
    .max(255, { message: "El email no puede superar 255 caracteres" })
    .toLowerCase()
    .transform((val) => val.trim()),

  telefono: z
    .string()
    .min(10, { message: "El teléfono debe tener al menos 10 dígitos" })
    .max(20, { message: "El teléfono no puede superar 20 caracteres" })
    .regex(/^[0-9+\s()-]+$/, {
      message: "El teléfono solo puede contener números, +, espacios, paréntesis y guiones",
    })
    .transform((val) => val.trim()),

  // UTM parameters (optional)
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  utm_content: z.string().max(100).optional(),
  utm_term: z.string().max(100).optional(),

  // Additional tracking (optional)
  referrer: z.string().optional(),
  landing_page_url: z.string().url().optional(),
  user_agent: z.string().optional(),
  ip_address: z.string().max(45).optional(),
});

export type PreinscripcionFormData = z.infer<typeof preinscripcionSchema>;

// =====================================================
// 2. Schema for updating pre-registration (admin only)
// =====================================================

export const updatePreinscripcionSchema = z.object({
  estado: z.enum(["pendiente", "contactado", "confirmado", "rechazado", "convertido"], {
    message: "Estado inválido",
  }),
  fecha_contacto: z.date().optional(),
  notas_seguimiento: z.string().max(1000).optional(),
});

export type UpdatePreinscripcionData = z.infer<typeof updatePreinscripcionSchema>;

// =====================================================
// 3. Schema for filtering/querying (admin dashboard)
// =====================================================

export const preinscripcionFiltersSchema = z.object({
  torneo_id: z.string().uuid().optional(),
  estado: z.enum(["pendiente", "contactado", "confirmado", "rechazado", "convertido"]).optional(),
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  fecha_desde: z.date().optional(),
  fecha_hasta: z.date().optional(),
});

export type PreinscripcionFilters = z.infer<typeof preinscripcionFiltersSchema>;

// =====================================================
// 4. Client-side validation schema (progressive enhancement)
// =====================================================

// Separate schema for real-time validation on each field
export const nombreCompletoSchema = z
  .string()
  .min(3, { message: "Mínimo 3 caracteres" })
  .max(100, { message: "Máximo 100 caracteres" })
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: "Solo letras y espacios",
  });

export const emailSchema = z
  .string()
  .min(1, { message: "Requerido" })
  .email({ message: "Email inválido" });

export const telefonoSchema = z
  .string()
  .min(10, { message: "Mínimo 10 dígitos" })
  .regex(/^[0-9+\s()-]+$/, {
    message: "Solo números y símbolos +()-",
  });

// =====================================================
// 5. Utility: Extract UTM params from URL
// =====================================================

export function extractUtmParams(url: string): Partial<PreinscripcionFormData> {
  try {
    const urlObj = new URL(url);
    return {
      utm_source: urlObj.searchParams.get("utm_source") || undefined,
      utm_medium: urlObj.searchParams.get("utm_medium") || undefined,
      utm_campaign: urlObj.searchParams.get("utm_campaign") || undefined,
      utm_content: urlObj.searchParams.get("utm_content") || undefined,
      utm_term: urlObj.searchParams.get("utm_term") || undefined,
    };
  } catch {
    return {};
  }
}

// =====================================================
// 6. Utility: Phone number formatting for Ecuador
// =====================================================

export function formatPhoneEcuador(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Ecuador mobile format: +593 9X XXX XXXX
  if (digits.startsWith("593") && digits.length === 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  // Local format: 09X XXX XXXX
  if (digits.startsWith("09") && digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  // Return as-is if doesn't match
  return phone;
}

// =====================================================
// 7. Utility: WhatsApp link generator
// =====================================================

export function generateWhatsAppLink(telefono: string, mensaje?: string): string {
  // Clean phone number
  const digits = telefono.replace(/\D/g, "");

  // Ensure Ecuador country code
  const phoneWithCode = digits.startsWith("593") ? digits : `593${digits.replace(/^0+/, "")}`;

  // Default message
  const defaultMessage = "Hola! Me interesa participar en el torneo de GoolStar.";
  const text = encodeURIComponent(mensaje || defaultMessage);

  return `https://wa.me/${phoneWithCode}?text=${text}`;
}
