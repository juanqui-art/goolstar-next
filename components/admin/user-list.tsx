import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Usuario {
  id: string;
  email: string;
  rol: "admin" | "director_equipo" | "jugador";
  nombre?: string;
  activo: boolean;
  fecha_registro: string;
}

interface UserListProps {
  usuarios: Usuario[];
}

export function UserList({ usuarios }: UserListProps) {
  if (usuarios.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No hay usuarios registrados.
      </p>
    );
  }

  const rolBadge = {
    admin: "bg-purple-100 text-purple-800",
    director_equipo: "bg-blue-100 text-blue-800",
    jugador: "bg-gray-100 text-gray-800",
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha Registro</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usuarios.map((usuario) => (
          <TableRow key={usuario.id}>
            <TableCell className="font-medium">{usuario.email}</TableCell>
            <TableCell>{usuario.nombre || "N/A"}</TableCell>
            <TableCell>
              <Badge className={rolBadge[usuario.rol]}>
                {usuario.rol.replace("_", " ")}
              </Badge>
            </TableCell>
            <TableCell>
              {usuario.activo ? (
                <Badge variant="default">Activo</Badge>
              ) : (
                <Badge variant="destructive">Inactivo</Badge>
              )}
            </TableCell>
            <TableCell>{usuario.fecha_registro}</TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm">
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  {usuario.activo ? "Desactivar" : "Activar"}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
