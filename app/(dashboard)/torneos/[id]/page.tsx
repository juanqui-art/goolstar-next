import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TorneoWithRelations } from "@/actions/torneos";

export default function TorneoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: Replace with getTorneo(params.id) Server Action
  const torneo: TorneoWithRelations | null = null;

  if (!torneo) {
    return (
      <div className="space-y-6">
        <p className="text-gray-500">Cargando torneo...</p>
        {/* TODO: Add loading state or not found message */}
      </div>
    );
  }

  const torneoData = torneo as TorneoWithRelations;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{torneoData.nombre}</h1>
          <p className="text-gray-600">Detalles del torneo</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/torneos/${params.id}/editar`}>
            <Button variant="outline">Editar</Button>
          </Link>
          <Link href={`/torneos/${params.id}/tabla`}>
            <Button>Ver Tabla</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            TODO: Display tournament details, teams, matches
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
