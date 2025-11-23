import { Suspense } from "react";
import { UserList } from "@/components/admin/user-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUsuarios } from "@/lib/data";

export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios del sistema</p>
        </div>
        <Button>Crear Usuario</Button>
      </div>

      <Suspense fallback={<UsuariosLoadingSkeleton />}>
        <UsuariosList />
      </Suspense>
    </div>
  );
}

async function UsuariosList() {
  // NO cached - always fresh data (sensitive user data)
  const rawUsuarios = await getUsuarios();

  // Transform Supabase Auth Users to expected Usuario format
  const usuarios = rawUsuarios.map((user: any) => ({
    id: user.id,
    email: user.email || "N/A",
    rol: (user.user_metadata?.rol || "jugador") as
      | "admin"
      | "director_equipo"
      | "jugador",
    nombre: user.user_metadata?.nombre || user.email?.split("@")[0],
    activo: !user.banned_until,
    fecha_registro: user.created_at || "",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Usuarios</CardTitle>
        <CardDescription>
          {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""} registrado
          {usuarios.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserList usuarios={usuarios} />
      </CardContent>
    </Card>
  );
}

function UsuariosLoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Usuarios</CardTitle>
        <CardDescription>Cargando usuarios...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
