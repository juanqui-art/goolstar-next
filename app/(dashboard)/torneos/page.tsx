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
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getTorneos } from "@/lib/data";
import Link from "next/link";

export default async function TorneosPage() {
  // Cached data - revalidates hourly
  const torneos = await getTorneos();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Torneos</h1>
          <p className="text-gray-600">
            Gestiona y visualiza todos los torneos
          </p>
        </div>
        <Link href="/torneos/nuevo">
          <Button>Crear Torneo</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Torneos</CardTitle>
          <CardDescription>
            {torneos.length} torneo{torneos.length !== 1 ? "s" : ""} registrado
            {torneos.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {torneos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No hay torneos registrados aún.
              </p>
              <Link href="/torneos/nuevo">
                <Button variant="outline">Crear primer torneo</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead>Fecha Fin</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {torneos.map((torneo) => (
                  <TableRow key={torneo.id}>
                    <TableCell className="font-medium">{torneo.nombre}</TableCell>
                    <TableCell>{torneo.categorias?.nombre || "N/A"}</TableCell>
                    <TableCell>
                      {torneo.fecha_inicio
                        ? new Date(torneo.fecha_inicio).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {torneo.fecha_fin
                        ? new Date(torneo.fecha_fin).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          torneo.activo
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {torneo.activo ? "Activo" : "Inactivo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/torneos/${torneo.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                      <Link href={`/torneos/${torneo.id}/tabla`}>
                        <Button variant="outline" size="sm">
                          Tabla
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
