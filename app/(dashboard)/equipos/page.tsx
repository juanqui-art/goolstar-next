import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EquiposPage() {
  // TODO: Replace with getEquipos() Server Action
  const equipos = []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Equipos</h1>
          <p className="text-gray-600">Gestiona todos los equipos registrados</p>
        </div>
        <Link href="/equipos/nuevo">
          <Button>Crear Equipo</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Equipos</CardTitle>
          <CardDescription>
            {equipos.length} equipo{equipos.length !== 1 ? 's' : ''} registrado{equipos.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {equipos.length === 0 ? (
            <p className="text-gray-500">No hay equipos registrados aún.</p>
          ) : (
            <div className="overflow-x-auto">
              {/* TODO: Add table with columns: Nombre, Color, Categoría, Torneo, Acciones */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
