import { JugadorForm } from "@/components/jugadores/jugador-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NuevoJugadorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Jugador</h1>
        <p className="text-gray-600">Registra un nuevo jugador en el sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Jugador</CardTitle>
        </CardHeader>
        <CardContent>
          <JugadorForm />
        </CardContent>
      </Card>
    </div>
  );
}
