import { TorneoForm } from "@/components/torneos/torneo-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditarTorneoPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: Replace with getTorneo(params.id) Server Action
  const torneo = null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Torneo</h1>
        <p className="text-gray-600">Actualiza la información del torneo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Torneo</CardTitle>
        </CardHeader>
        <CardContent>
          {torneo ? (
            <TorneoForm initialData={torneo} />
          ) : (
            <p className="text-gray-500">Cargando...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
