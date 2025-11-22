import { UserList } from "@/components/admin/user-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Usuario {
  id: string;
  email: string;
  rol: "admin" | "director_equipo" | "jugador";
  nombre?: string;
  activo: boolean;
  fecha_registro: string;
}

export const dynamic = "force-dynamic";

export default function UsuariosPage() {
  // TODO: Replace with getUsuarios() Server Action
  const usuarios: Usuario[] = [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios del sistema</p>
        </div>
        <Button>Crear Usuario</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""}{" "}
            registrado{usuarios.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserList usuarios={usuarios} />
        </CardContent>
      </Card>
    </div>
  );
}
