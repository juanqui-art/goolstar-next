"use server";

import { createServerClient } from "@/lib/supabase/server";
import {
  type PreinscripcionFormData,
  type UpdatePreinscripcionData,
  type PreinscripcionFilters,
  preinscripcionSchema,
  updatePreinscripcionSchema,
} from "@/lib/validations/preinscripcion";
import type { Database } from "@/types/database";

type PreinscripcionRow = Database["public"]["Tables"]["preinscripciones_torneo"]["Row"];

/**
 * Result type for actions
 */
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// =====================================================
// 1. CREATE: Submit pre-registration from landing page
// =====================================================

export async function createPreinscripcion(
  formData: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validatedData = preinscripcionSchema.parse(formData);

    // Create Supabase client (no auth required for this action)
    const supabase = await createServerClient();

    // Check for duplicates using helper function
    const { data: isDuplicate } = await supabase.rpc("existe_preinscripcion", {
      p_torneo_id: validatedData.torneo_id,
      p_email: validatedData.email,
      p_telefono: validatedData.telefono,
    });

    if (isDuplicate) {
      return {
        success: false,
        error: "Ya existe una pre-inscripción con este email o teléfono para este torneo.",
      };
    }

    // Insert pre-registration
    const { data, error } = await supabase
      .from("preinscripciones_torneo")
      .insert({
        torneo_id: validatedData.torneo_id,
        nombre_completo: validatedData.nombre_completo,
        email: validatedData.email,
        telefono: validatedData.telefono,
        utm_source: validatedData.utm_source,
        utm_medium: validatedData.utm_medium,
        utm_campaign: validatedData.utm_campaign,
        utm_content: validatedData.utm_content,
        utm_term: validatedData.utm_term,
        referrer: validatedData.referrer,
        landing_page_url: validatedData.landing_page_url,
        user_agent: validatedData.user_agent,
        ip_address: validatedData.ip_address,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating preinscripcion:", error);
      return {
        success: false,
        error: "Error al registrar la pre-inscripción. Por favor intenta nuevamente.",
      };
    }

    // Send confirmation email to user
    await sendConfirmationEmail(validatedData.email, validatedData.nombre_completo);

    // Send notification email to admin
    await sendAdminNotification(validatedData);

    return {
      success: true,
      data: { id: data.id },
    };
  } catch (error) {
    console.error("Error in createPreinscripcion:", error);
    return {
      success: false,
      error: "Error al procesar la solicitud. Por favor verifica los datos.",
    };
  }
}

// =====================================================
// 2. READ: Get pre-registrations (admin only)
// =====================================================

export async function getPreinscripciones(
  filters?: PreinscripcionFilters,
): Promise<ActionResult<PreinscripcionRow[]>> {
  try {
    const supabase = await createServerClient();

    // Verify admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    // Build query
    let query = supabase
      .from("preinscripciones_torneo")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters?.torneo_id) {
      query = query.eq("torneo_id", filters.torneo_id);
    }
    if (filters?.estado) {
      query = query.eq("estado", filters.estado);
    }
    if (filters?.utm_source) {
      query = query.eq("utm_source", filters.utm_source);
    }
    if (filters?.utm_campaign) {
      query = query.eq("utm_campaign", filters.utm_campaign);
    }
    if (filters?.fecha_desde) {
      query = query.gte("created_at", filters.fecha_desde.toISOString());
    }
    if (filters?.fecha_hasta) {
      query = query.lte("created_at", filters.fecha_hasta.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching preinscripciones:", error);
      return { success: false, error: "Error al obtener pre-inscripciones" };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getPreinscripciones:", error);
    return { success: false, error: "Error al procesar la solicitud" };
  }
}

// =====================================================
// 3. UPDATE: Update pre-registration status (admin only)
// =====================================================

export async function updatePreinscripcion(
  id: string,
  updateData: unknown,
): Promise<ActionResult<PreinscripcionRow>> {
  try {
    const supabase = await createServerClient();

    // Verify admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    // Validate input
    const validatedData = updatePreinscripcionSchema.parse(updateData);

    // Update record
    const { data, error } = await supabase
      .from("preinscripciones_torneo")
      .update({
        estado: validatedData.estado,
        fecha_contacto: validatedData.fecha_contacto?.toISOString(),
        notas_seguimiento: validatedData.notas_seguimiento,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating preinscripcion:", error);
      return { success: false, error: "Error al actualizar pre-inscripción" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in updatePreinscripcion:", error);
    return { success: false, error: "Error al procesar la solicitud" };
  }
}

// =====================================================
// 4. DELETE: Soft delete (change estado to 'rechazado')
// =====================================================

export async function deletePreinscripcion(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createServerClient();

    // Verify admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    // Soft delete by setting estado to 'rechazado'
    const { error } = await supabase
      .from("preinscripciones_torneo")
      .update({ estado: "rechazado" })
      .eq("id", id);

    if (error) {
      console.error("Error deleting preinscripcion:", error);
      return { success: false, error: "Error al eliminar pre-inscripción" };
    }

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error in deletePreinscripcion:", error);
    return { success: false, error: "Error al procesar la solicitud" };
  }
}

// =====================================================
// 5. EXPORT: Export to CSV (admin only)
// =====================================================

export async function exportPreinscripcionesCSV(
  torneoId?: string,
): Promise<ActionResult<string>> {
  try {
    const supabase = await createServerClient();

    // Verify admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    // Build query
    let query = supabase
      .from("preinscripciones_torneo")
      .select("*")
      .order("created_at", { ascending: false });

    if (torneoId) {
      query = query.eq("torneo_id", torneoId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error exporting preinscripciones:", error);
      return { success: false, error: "Error al exportar datos" };
    }

    // Convert to CSV
    const headers = [
      "Nombre Completo",
      "Email",
      "Teléfono",
      "Estado",
      "UTM Source",
      "UTM Campaign",
      "Fecha Registro",
      "Notas",
    ];

    const rows = data.map((row) => [
      row.nombre_completo,
      row.email,
      row.telefono,
      row.estado,
      row.utm_source || "",
      row.utm_campaign || "",
      new Date(row.created_at).toLocaleString("es-EC"),
      row.notas_seguimiento || "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    return { success: true, data: csv };
  } catch (error) {
    console.error("Error in exportPreinscripcionesCSV:", error);
    return { success: false, error: "Error al procesar la solicitud" };
  }
}

// =====================================================
// 6. STATS: Get statistics for dashboard
// =====================================================

export async function getPreinscripcionesStats(torneoId?: string): Promise<
  ActionResult<{
    total: number;
    pendientes: number;
    contactados: number;
    confirmados: number;
    convertidos: number;
    tasaConversion: number;
  }>
> {
  try {
    const supabase = await createServerClient();

    // Verify admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    // Build query
    let query = supabase.from("preinscripciones_torneo").select("estado");

    if (torneoId) {
      query = query.eq("torneo_id", torneoId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching stats:", error);
      return { success: false, error: "Error al obtener estadísticas" };
    }

    const total = data.length;
    const pendientes = data.filter((r) => r.estado === "pendiente").length;
    const contactados = data.filter((r) => r.estado === "contactado").length;
    const confirmados = data.filter((r) => r.estado === "confirmado").length;
    const convertidos = data.filter((r) => r.estado === "convertido").length;
    const tasaConversion = total > 0 ? (convertidos / total) * 100 : 0;

    return {
      success: true,
      data: {
        total,
        pendientes,
        contactados,
        confirmados,
        convertidos,
        tasaConversion: Number.parseFloat(tasaConversion.toFixed(2)),
      },
    };
  } catch (error) {
    console.error("Error in getPreinscripcionesStats:", error);
    return { success: false, error: "Error al procesar la solicitud" };
  }
}

// =====================================================
// 7. HELPERS: Email notifications
// =====================================================

async function sendConfirmationEmail(email: string, nombre: string): Promise<void> {
  try {
    // TODO: Implement with Supabase Email or Resend
    // For now, just log
    console.log(`Sending confirmation email to ${email} (${nombre})`);

    // Example with Supabase Auth (if using Supabase Email Templates)
    // const supabase = await createServerClient()
    // await supabase.auth.admin.sendEmail({
    //   to: email,
    //   template: 'preinscripcion_confirmacion',
    //   data: { nombre }
    // })
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    // Don't throw - email is not critical for registration
  }
}

async function sendAdminNotification(data: PreinscripcionFormData): Promise<void> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@goolstar.com";
    console.log(`Sending admin notification to ${adminEmail}:`, data);

    // TODO: Implement with Resend or webhook to Zapier/n8n
    // Example with webhook:
    // if (process.env.WEBHOOK_URL) {
    //   await fetch(process.env.WEBHOOK_URL, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       nombre: data.nombre_completo,
    //       email: data.email,
    //       telefono: data.telefono,
    //       utm_campaign: data.utm_campaign
    //     })
    //   })
    // }
  } catch (error) {
    console.error("Error sending admin notification:", error);
    // Don't throw - notification is not critical for registration
  }
}
