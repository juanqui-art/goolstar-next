import { getStandings, getTorneo } from "@/actions/torneos";
import { PrintButton } from "@/components/partidos/print-button";
import { TablaPosiciones } from "@/components/torneos/tabla-posiciones";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TablaPosicionesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch data in parallel
  const [torneo, posiciones] = await Promise.all([
    getTorneo(id).catch(() => null),
    getStandings(id).catch(() => []),
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
            <h1 className="text-3xl font-bold tracking-tight">
              Tabla de Posiciones
            </h1>
          </div>
          <p className="text-muted-foreground">
            {torneo.nombre}
            {torneo.categorias?.nombre ? ` - ${torneo.categorias.nombre}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <PrintButton />
        </div>
      </div>

      <TablaPosiciones posiciones={posiciones} />
    </div>
  );
}
