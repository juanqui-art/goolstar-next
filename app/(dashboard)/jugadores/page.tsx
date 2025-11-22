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

export default function JugadoresPage() {
  // TODO: Replace with getJugadores() Server Action
  const jugadores = [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Jugadores</h1>
          <p className="text-gray-600">
            Gestiona todos los jugadores registrados
          </p>
        </div>
        <Link href="/jugadores/nuevo">
          <Button>Crear Jugador</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Jugadores</CardTitle>
          <CardDescription>
            {jugadores.length} jugador{jugadores.length !== 1 ? "es" : ""}{" "}
            registrado{jugadores.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jugadores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No hay jugadores registrados aún.
              </p>
              <Link href="/jugadores/nuevo">
                <Button variant="outline">Registrar primer jugador</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Dorsal</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* TODO: Map jugadores data here */}
                {/* Example row structure:
                <TableRow>
                  <TableCell className="font-medium">
                    {formatPlayerName(
                      jugador.primer_nombre,
                      jugador.segundo_nombre,
                      jugador.primer_apellido,
                      jugador.segundo_apellido
                    )}
                  </TableCell>
                  <TableCell>{jugador.cedula}</TableCell>
                  <TableCell>
                    <span className="font-mono font-bold">#{jugador.numero_camiseta}</span>
                  </TableCell>
                  <TableCell>{jugador.equipo.nombre}</TableCell>
                  <TableCell className="capitalize">{jugador.posicion || '-'}</TableCell>
                  <TableCell>
                    {jugador.suspendido ? (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs">Suspendido</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">Habilitado</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/jugadores/${jugador.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/jugadores/${jugador.id}/editar`}>
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
