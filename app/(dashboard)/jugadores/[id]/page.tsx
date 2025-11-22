import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JugadorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: Replace with getJugador(params.id) Server Action
  const jugador = null;

  if (!jugador) {
    return (
      <div className="space-y-6">
        <p className="text-gray-500">Cargando jugador...</p>
        {/* TODO: Add loading state or not found message */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{jugador.nombre}</h1>
          <p className="text-gray-600">Detalles del jugador</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/jugadores/${params.id}/editar`}>
            <Button variant="outline">Editar</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            TODO: Display player details, stats, cards, suspensions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
