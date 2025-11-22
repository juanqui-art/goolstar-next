import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface PartidoCardProps {
  id: string
  fecha: string
  equipo1: string
  equipo2: string
  resultado?: string
  estado: "programado" | "en_curso" | "finalizado"
  cancha?: string
}

export function PartidoCard({
  id,
  fecha,
  equipo1,
  equipo2,
  resultado,
  estado,
  cancha,
}: PartidoCardProps) {
  const estadoBadge = {
    programado: "bg-blue-100 text-blue-800",
    en_curso: "bg-green-100 text-green-800",
    finalizado: "bg-gray-100 text-gray-800",
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {equipo1} vs {equipo2}
          </CardTitle>
          <Badge className={estadoBadge[estado]}>
            {estado.replace("_", " ")}
          </Badge>
        </div>
        <CardDescription>{fecha}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {resultado && (
            <div className="text-center py-4">
              <p className="text-3xl font-bold">{resultado}</p>
            </div>
          )}
          {cancha && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Cancha:</span> {cancha}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/partidos/${id}`}>
          <Button variant="outline" size="sm">Ver Detalles</Button>
        </Link>
        <Link href={`/partidos/${id}/acta`}>
          <Button size="sm">Ver Acta</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
