import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTodosLosEquipos } from "@/lib/data";

export default async function EquiposPage() {
  // Cached data - revalidates hourly
  const equipos = await getTodosLosEquipos();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Equipos</h1>
          <p className="text-gray-600">
            Gestiona todos los equipos registrados
          </p>
        </div>
        <Link href="/equipos/nuevo">
          <Button>Crear Equipo</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Equipos</CardTitle>
          <CardDescription>
            {equipos.length} equipo{equipos.length !== 1 ? "s" : ""} registrado
            {equipos.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {equipos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No hay equipos registrados aún.
              </p>
              <Link href="/equipos/nuevo">
                <Button variant="outline">Crear primer equipo</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Torneo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead className="text-right">Jugadores</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* TODO: Map equipos data here */}
                {/* Example row structure:
                <TableRow>
                  <TableCell className="font-medium">{equipo.nombre}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: equipo.color }}
                      />
                      {equipo.color}
                    </div>
                  </TableCell>
                  <TableCell>{equipo.torneo.nombre}</TableCell>
                  <TableCell>{equipo.categoria.nombre}</TableCell>
                  <TableCell>{equipo.grupo || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{equipo.jugadores_count || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/equipos/${equipo.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/equipos/${equipo.id}/editar`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
                */}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
