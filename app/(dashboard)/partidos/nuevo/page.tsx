import { PartidoForm } from "@/components/partidos/partido-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NuevoPartidoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Partido</h1>
        <p className="text-gray-600">Programa un nuevo partido</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Partido</CardTitle>
        </CardHeader>
        <CardContent>
          <PartidoForm />
        </CardContent>
      </Card>
    </div>
  );
}
