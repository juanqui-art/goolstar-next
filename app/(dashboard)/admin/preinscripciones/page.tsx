import { Suspense } from "react";
import { PreinscripcionesStats } from "@/components/admin/preinscripciones-stats";
import { PreinscripcionesTable } from "@/components/admin/preinscripciones-table";
import { getPreinscripciones } from "@/actions/preinscripciones";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  searchParams: Promise<{
    torneo_id?: string;
  }>;
}

export default async function PreinscripcionesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const torneoId = params.torneo_id;

  // Fetch preinscripciones
  const result = await getPreinscripciones(
    torneoId ? { torneo_id: torneoId } : undefined,
  );

  if (!result.success) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-destructive mb-2">
                Error al cargar datos
              </h2>
              <p className="text-muted-foreground">{result.error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pre-inscripciones</h1>
        <p className="text-muted-foreground">
          Administra las inscripciones recibidas desde la landing page
        </p>
      </div>

      {/* Stats */}
      <Suspense fallback={<StatsLoading />}>
        <PreinscripcionesStats torneoId={torneoId} />
      </Suspense>

      {/* Table */}
      <PreinscripcionesTable preinscripciones={result.data} torneoId={torneoId} />
    </div>
  );
}

function StatsLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
