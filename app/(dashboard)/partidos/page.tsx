import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPartidos } from "@/actions/partidos";
import { PartidosTabs } from "@/components/partidos/partidos-tabs";

export default async function PartidosPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partidos</h1>
          <p className="text-muted-foreground">
            Gestiona todos los partidos del torneo
          </p>
        </div>
        <Link href="/partidos/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Programar Partido
          </Button>
        </Link>
      </div>

      <Suspense fallback={<PartidosSkeleton />}>
        <PartidosContent />
      </Suspense>
    </div>
  );
}

async function PartidosContent() {
  const partidos = await getPartidos();

  return <PartidosTabs partidos={partidos} />;
}

function PartidosSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}
