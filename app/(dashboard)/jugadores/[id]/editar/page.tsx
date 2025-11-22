import { JugadorForm } from "@/components/jugadores/jugador-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditarJugadorPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: Replace with getJugador(params.id) Server Action
  const jugador = null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Jugador</h1>
        <p className="text-gray-600">Actualiza la información del jugador</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Jugador</CardTitle>
        </CardHeader>
        <CardContent>
          {jugador ? (
            <JugadorForm initialData={jugador} />
          ) : (
            <p className="text-gray-500">Cargando...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
