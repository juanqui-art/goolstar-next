import { EquipoForm } from "@/components/equipos/equipo-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditarEquipoPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: Replace with getEquipo(params.id) Server Action
  const equipo = null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Equipo</h1>
        <p className="text-gray-600">Actualiza la información del equipo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Equipo</CardTitle>
        </CardHeader>
        <CardContent>
          {equipo ? (
            <EquipoForm initialData={equipo} />
          ) : (
            <p className="text-gray-500">Cargando...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
