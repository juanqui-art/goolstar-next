import { EquipoForm } from "@/components/equipos/equipo-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NuevoEquipoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Equipo</h1>
        <p className="text-gray-600">Registra un nuevo equipo en el sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Equipo</CardTitle>
        </CardHeader>
        <CardContent>
          <EquipoForm />
        </CardContent>
      </Card>
    </div>
  );
}
