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

export default function PartidosPage() {
  // TODO: Replace with getPartidos() Server Action
  const partidos = [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Partidos</h1>
          <p className="text-gray-600">
            Gestiona todos los partidos del torneo
          </p>
        </div>
        <Link href="/partidos/nuevo">
          <Button>Crear Partido</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Partidos</CardTitle>
          <CardDescription>
            {partidos.length} partido{partidos.length !== 1 ? "s" : ""}{" "}
            registrado{partidos.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {partidos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No hay partidos registrados aún.
              </p>
              <Link href="/partidos/nuevo">
                <Button variant="outline">Programar primer partido</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Equipos</TableHead>
                  <TableHead className="text-center">Resultado</TableHead>
                  <TableHead>Jornada/Fase</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* TODO: Map partidos data here */}
                {/* Example row structure:
                <TableRow>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(partido.fecha)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatTime(partido.fecha)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{partido.equipo_local.nombre}</div>
                      <div className="text-gray-600">{partido.equipo_visitante.nombre}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {partido.completado ? (
                      <div className="font-mono font-bold text-lg">
                        {partido.goles_local} - {partido.goles_visitante}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {partido.jornada ? (
                      <span className="text-sm">Jornada {partido.jornada.numero}</span>
                    ) : (
                      <span className="text-sm">{partido.fase_eliminatoria}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {partido.completado ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Completado
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Programado
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/partidos/${partido.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    {!partido.completado && (
                      <Link href={`/partidos/${partido.id}/editar`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
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
