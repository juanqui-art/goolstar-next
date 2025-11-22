import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EstadisticasTorneoPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: Replace with getTorneoStats(params.id) Server Action
  const stats = {
    totalGoles: 0,
    totalTarjetas: 0,
    maxGoleador: null,
    equipoMasGoles: null,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Estadísticas</h1>
        <p className="text-gray-600">Estadísticas del torneo</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Goles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGoles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Tarjetas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTarjetas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Máximo Goleador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              {stats.maxGoleador || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Equipo Más Goles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              {stats.equipoMasGoles || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TODO: Add charts and detailed statistics */}
    </div>
  );
}
