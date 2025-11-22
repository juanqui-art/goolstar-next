import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EquipoDetailPage({ params }: { params: { id: string } }) {
  // TODO: Replace with getEquipo(params.id) Server Action
  const equipo = null

  if (!equipo) {
    return (
      <div className="space-y-6">
        <p className="text-gray-500">Cargando equipo...</p>
        {/* TODO: Add loading state or not found message */}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{equipo.nombre}</h1>
          <p className="text-gray-600">Detalles del equipo</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/equipos/${params.id}/editar`}>
            <Button variant="outline">Editar</Button>
          </Link>
          <Link href={`/equipos/${params.id}/financiero`}>
            <Button>Ver Finanzas</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">TODO: Display team details, roster, statistics</p>
        </CardContent>
      </Card>
    </div>
  )
}
