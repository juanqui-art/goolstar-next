import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface EquipoCardProps {
  id: string
  nombre: string
  colorPrincipal: string
  categoria: string
  jugadores?: number
  nivel: string
}

export function EquipoCard({
  id,
  nombre,
  colorPrincipal,
  categoria,
  jugadores = 0,
  nivel,
}: EquipoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded border flex-shrink-0"
            style={{ backgroundColor: colorPrincipal }}
          />
          <div className="flex-1">
            <CardTitle>{nombre}</CardTitle>
            <CardDescription>{categoria}</CardDescription>
          </div>
          <Badge variant="outline">Nivel {nivel}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Jugadores:</span> {jugadores}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Color:</span> {colorPrincipal}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/equipos/${id}`}>
          <Button variant="outline" size="sm">Ver Detalles</Button>
        </Link>
        <Link href={`/equipos/${id}/financiero`}>
          <Button size="sm">Finanzas</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
