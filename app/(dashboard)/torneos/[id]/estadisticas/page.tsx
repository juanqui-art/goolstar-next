import { getTopScorers, getTorneo, getTorneoStats } from "@/actions/torneos";
import { TeamStatsCard } from "@/components/torneos/team-stats-card";
import { TopScorers } from "@/components/torneos/top-scorers";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Table as TableIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EstadisticasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch data in parallel
  const [torneo, stats, topScorers] = await Promise.all([
    getTorneo(id).catch(() => null),
    getTorneoStats(id).catch(() => ({
      totalEquipos: 0,
      totalPartidos: 0,
      partidosCompletados: 0,
      partidosPendientes: 0,
      topScorers: [],
    })),
    getTopScorers(id).catch(() => []),
  ]);

  if (!torneo) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/torneos/${id}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
          </div>
          <p className="text-muted-foreground">
            {torneo.nombre}
            {torneo.categorias?.nombre ? ` - ${torneo.categorias.nombre}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/torneos/${id}/tabla`}>
            <Button variant="outline" className="gap-2">
              <TableIcon className="h-4 w-4" />
              Ver Tabla
            </Button>
          </Link>
        </div>
      </div>

      {/* Tournament Stats Cards */}
      <TeamStatsCard stats={stats} />

      {/* Top Scorers */}
      <TopScorers scorers={topScorers} />
    </div>
  );
}
