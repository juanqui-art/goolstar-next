import { TorneoForm } from "@/components/torneos/torneo-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NuevoTorneoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Torneo</h1>
        <p className="text-gray-600">Registra un nuevo torneo en el sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Torneo</CardTitle>
        </CardHeader>
        <CardContent>
          <TorneoForm />
        </CardContent>
      </Card>
    </div>
  );
}
