import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TorneosPage() {
  // TODO: Replace with getTorneos() Server Action
  const torneos = []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Torneos</h1>
          <p className="text-gray-600">Gestiona y visualiza todos los torneos</p>
        </div>
        <Link href="/torneos/nuevo">
          <Button>Crear Torneo</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Torneos</CardTitle>
          <CardDescription>
            {torneos.length} torneo{torneos.length !== 1 ? 's' : ''} registrado{torneos.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {torneos.length === 0 ? (
            <p className="text-gray-500">No hay torneos registrados aún.</p>
          ) : (
            <div className="overflow-x-auto">
              {/* TODO: Add table with columns: Nombre, Categoría, Fechas, Acciones */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
