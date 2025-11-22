import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TablaPosiciones } from "@/components/torneos/tabla-posiciones"

export default function TablaPosicionesPage({ params }: { params: { id: string } }) {
  // TODO: Replace with getStandings(params.id) Server Action
  const standings = []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tabla de Posiciones</h1>
        <p className="text-gray-600">Clasificación actual del torneo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <TablaPosiciones standings={standings} />
        </CardContent>
      </Card>
    </div>
  )
}
