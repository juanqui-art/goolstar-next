import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActaPartido } from "@/components/partidos/acta-partido"

export default function ActaPartidoPage({ params }: { params: { id: string } }) {
  // TODO: Replace with getPartidoActa(params.id) Server Action
  const partido = null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Acta del Partido</h1>
        <p className="text-gray-600">Registro oficial del partido</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acta Oficial</CardTitle>
        </CardHeader>
        <CardContent>
          {partido ? (
            <ActaPartido partido={partido} />
          ) : (
            <p className="text-gray-500">Cargando...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
