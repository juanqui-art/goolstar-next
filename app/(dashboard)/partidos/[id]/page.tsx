import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PartidoDetailPage({ params }: { params: { id: string } }) {
  // TODO: Replace with getPartido(params.id) Server Action
  const partido = null

  if (!partido) {
    return (
      <div className="space-y-6">
        <p className="text-gray-500">Cargando partido...</p>
        {/* TODO: Add loading state or not found message */}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Partido</h1>
          <p className="text-gray-600">Detalles del partido</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/partidos/${params.id}/acta`}>
            <Button>Ver Acta</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Partido</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">TODO: Display match details, score, goals, cards, changes</p>
        </CardContent>
      </Card>
    </div>
  )
}
