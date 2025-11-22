import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PartidosPage() {
  // TODO: Replace with getPartidos() Server Action
  const partidos = []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Partidos</h1>
          <p className="text-gray-600">Gestiona todos los partidos del torneo</p>
        </div>
        <Link href="/partidos/nuevo">
          <Button>Crear Partido</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Partidos</CardTitle>
          <CardDescription>
            {partidos.length} partido{partidos.length !== 1 ? 's' : ''} registrado{partidos.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {partidos.length === 0 ? (
            <p className="text-gray-500">No hay partidos registrados aún.</p>
          ) : (
            <div className="overflow-x-auto">
              {/* TODO: Add table with columns: Fecha, Equipos, Resultado, Estado, Acciones */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
