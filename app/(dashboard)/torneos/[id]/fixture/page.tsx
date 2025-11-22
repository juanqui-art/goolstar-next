import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { FixtureManager } from "@/components/torneos/fixture-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FixturePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getTorneoData(torneoId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: torneo, error } = await supabase
    .from("torneos")
    .select(`
      *,
      categoria:categoria_id (
        nombre
      )
    `)
    .eq("id", torneoId)
    .single();

  if (error || !torneo) {
    return null;
  }

  // Get teams count
  const { count: teamsCount } = await supabase
    .from("equipos")
    .select("*", { count: "exact", head: true })
    .eq("torneo_id", torneoId);

  // Get matches count
  const { count: matchesCount } = await supabase
    .from("partidos")
    .select("*", { count: "exact", head: true })
    .eq("torneo_id", torneoId);

  return {
    torneo,
    teamsCount: teamsCount || 0,
    matchesCount: matchesCount || 0,
  };
}

async function getFixtureData(torneoId: string) {
  const supabase = await createServerSupabaseClient();

  // Get all jornadas
  const { data: jornadas } = await supabase
    .from("jornadas")
    .select("id, numero, fecha_prevista")
    .eq("torneo_id", torneoId)
    .order("numero");

  // Get all matches for this tournament
  const { data: partidos } = await supabase
    .from("partidos")
    .select("id, fecha, cancha, completado, goles_equipo_1, goles_equipo_2, jornada_id, equipo_1_id, equipo_2_id")
    .eq("torneo_id", torneoId);

  // Get all teams for this tournament
  const { data: equipos } = await supabase
    .from("equipos")
    .select("id, nombre")
    .eq("torneo_id", torneoId);

  // Create a map of equipos for quick lookup
  const equiposMap = new Map((equipos || []).map(e => [e.id, e]));

  // Enrich matches with team names
  const partidosEnriquecidos = (partidos || []).map(p => ({
    id: p.id,
    fecha: p.fecha,
    cancha: p.cancha,
    completado: p.completado,
    goles_equipo_1: p.goles_equipo_1,
    goles_equipo_2: p.goles_equipo_2,
    equipo_local: equiposMap.get(p.equipo_1_id) ?? null,
    equipo_visitante: equiposMap.get(p.equipo_2_id) ?? null,
    jornada_id: p.jornada_id,
  }));

  // Group matches by jornada
  const fixture = jornadas?.map(jornada => {
    const matches = partidosEnriquecidos.filter(p => p.jornada_id === jornada.id);
    return {
      jornada,
      partidos: matches,
    };
  }) || [];

  return { fixture, hasFixture: (partidos?.length || 0) > 0 };
}

export default async function FixturePage({ params }: FixturePageProps) {
  const { id: torneoId } = await params;

  const data = await getTorneoData(torneoId);

  if (!data) {
    notFound();
  }

  const { torneo, teamsCount, matchesCount } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{torneo.nombre}</h1>
        <p className="text-muted-foreground">
          Generador de Fixture - {torneo.categoria?.nombre}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Equipos Inscritos</CardDescription>
            <CardTitle className="text-3xl">{teamsCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Partidos Programados</CardDescription>
            <CardTitle className="text-3xl">{matchesCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Fase Actual</CardDescription>
            <CardTitle className="text-xl capitalize">{torneo.fase_actual}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Fixture Manager */}
      <Suspense fallback={<FixtureSkeleton />}>
        <FixtureContent torneoId={torneoId} />
      </Suspense>
    </div>
  );
}

async function FixtureContent({ torneoId }: { torneoId: string }) {
  const { fixture, hasFixture } = await getFixtureData(torneoId);

  return <FixtureManager torneoId={torneoId} fixture={fixture} hasFixture={hasFixture} />;
}

function FixtureSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
