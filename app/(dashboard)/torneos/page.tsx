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

export default function TorneosPage() {
  // TODO: Replace with getTorneos() Server Action
  const torneos = [];

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
                {/* TODO: Map torneos data here */}
                {/* Example row structure:
                <TableRow>
                  <TableCell className="font-medium">{torneo.nombre}</TableCell>
                  <TableCell>{torneo.categoria.nombre}</TableCell>
                  <TableCell>{formatDate(torneo.fecha_inicio)}</TableCell>
                  <TableCell>{formatDate(torneo.fecha_fin)}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Activo
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/torneos/${torneo.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/torneos/${torneo.id}/editar`}>
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
