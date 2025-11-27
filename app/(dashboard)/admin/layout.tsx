import { requireAdmin } from "@/lib/auth/dal";
import { redirect } from "next/navigation";

/**
 * Layout para rutas de administración
 *
 * Protege todas las rutas bajo /dashboard/admin/*
 * Solo usuarios con rol "admin" pueden acceder
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // Verificar que el usuario es admin
    // Si no lo es, lanzará un error
    await requireAdmin();
  } catch (error) {
    // Usuario no es admin, redirect a dashboard
    redirect("/dashboard");
  }

  return (
    <div className="admin-layout">
      {/* Header de administración */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestión avanzada del sistema
        </p>
      </div>

      {/* Contenido de admin */}
      {children}
    </div>
  );
}
