import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TorneoDetailPage({ params }: { params: { id: string } }) {
  // TODO: Replace with getTorneo(params.id) Server Action
  const torneo = null

  if (!torneo) {
    return (
      <div className="space-y-6">
        <p className="text-gray-500">Cargando torneo...</p>
        {/* TODO: Add loading state or not found message */}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{torneo.nombre}</h1>
          <p className="text-gray-600">Detalles del torneo</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/torneos/${params.id}/editar`}>
            <Button variant="outline">Editar</Button>
          </Link>
          <Link href={`/torneos/${params.id}/tabla`}>
            <Button>Ver Tabla</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">TODO: Display tournament details, teams, matches</p>
        </CardContent>
      </Card>
    </div>
  )
}
