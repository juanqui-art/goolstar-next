import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function JugadoresPage() {
  // TODO: Replace with getJugadores() Server Action
  const jugadores = []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Jugadores</h1>
          <p className="text-gray-600">Gestiona todos los jugadores registrados</p>
        </div>
        <Link href="/jugadores/nuevo">
          <Button>Crear Jugador</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Jugadores</CardTitle>
          <CardDescription>
            {jugadores.length} jugador{jugadores.length !== 1 ? 'es' : ''} registrado{jugadores.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jugadores.length === 0 ? (
            <p className="text-gray-500">No hay jugadores registrados aún.</p>
          ) : (
            <div className="overflow-x-auto">
              {/* TODO: Add table with columns: Nombre, Dorsal, Equipo, Posición, Estado, Acciones */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
