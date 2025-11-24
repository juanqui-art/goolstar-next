import { notFound } from "next/navigation";
import { ActaPartido } from "@/components/partidos/acta-partido";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrintButton } from "@/components/partidos/print-button";
import { getPartidoActa } from "@/actions/partidos";
import { formatDate } from "@/lib/utils/format";

export default async function ActaPartidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let actaData;
  try {
    actaData = await getPartidoActa(id);
  } catch (error) {
    notFound();
  }

  const { partido, goles, tarjetas, cambios } = actaData;

  // Helper functions to safely extract data
  const getEquipoNombre = (equipo: unknown): string => {
    if (equipo && typeof equipo === "object" && "nombre" in equipo) {
      return String(equipo.nombre);
    }
    return "Equipo";
  };

  const getJugadorNombre = (jugador: unknown): string => {
    if (jugador && typeof jugador === "object") {
      const primerNombre =
        "primer_nombre" in jugador ? String(jugador.primer_nombre) : "";
      const primerApellido =
        "primer_apellido" in jugador ? String(jugador.primer_apellido) : "";
      return `${primerNombre} ${primerApellido}`.trim() || "Jugador";
    }
    return "Jugador";
  };

  // Transform data to match ActaPartido component interface
  const partidoFormatted = {
    id: partido.id,
    fecha: partido.fecha ? formatDate(new Date(partido.fecha)) : "Sin fecha",
    equipo_1: getEquipoNombre(partido.equipo_local),
    equipo_2: getEquipoNombre(partido.equipo_visitante),
    resultado: `${partido.goles_equipo_1 ?? 0} - ${partido.goles_equipo_2 ?? 0}`,
    goles: goles.map((gol) => ({
      jugador: getJugadorNombre(gol.jugadores),
      minuto: gol.minuto,
      equipo: gol.equipo_id || "",
    })),
    tarjetas: tarjetas.map((tarjeta) => ({
      jugador: getJugadorNombre(tarjeta.jugadores),
      minuto: tarjeta.minuto,
      tipo: tarjeta.tipo.toLowerCase(),
      equipo: tarjeta.equipo_id || "",
    })),
    cambios: cambios.map((cambio) => ({
      sale: getJugadorNombre(cambio.jugador_sale),
      entra: getJugadorNombre(cambio.jugador_entra),
      minuto: cambio.minuto,
      equipo: cambio.equipo_id || "",
    })),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Acta del Partido</h1>
          <p className="text-muted-foreground">Registro oficial del partido</p>
        </div>
        <PrintButton />
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardHeader className="print:pb-2">
          <CardTitle>Acta Oficial</CardTitle>
        </CardHeader>
        <CardContent>
          <ActaPartido partido={partidoFormatted} />
        </CardContent>
      </Card>
    </div>
  );
}
