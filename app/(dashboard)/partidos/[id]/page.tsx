import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  MapPin,
  Clock,
  Edit,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPartido } from "@/actions/partidos";
import { formatDate, formatTime } from "@/lib/utils/format";
import { EventosTimeline } from "@/components/partidos/eventos-timeline";

export default async function PartidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let partido;
  try {
    partido = await getPartido(id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Partido</h1>
          <p className="text-muted-foreground">
            Detalles y eventos del partido
          </p>
        </div>
        <div className="flex gap-2">
          {!partido.completado && (
            <Link href={`/partidos/${id}/editar`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
          )}
          {partido.completado && (
            <Link href={`/partidos/${id}/acta`}>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Ver Acta
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Match Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Información del Partido</CardTitle>
            <Badge variant={partido.completado ? "secondary" : "outline"}>
              {partido.completado ? "Finalizado" : "Programado"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Teams and Score */}
          <div className="flex items-center justify-center gap-8">
            <div className="flex-1 text-right">
              <div className="text-2xl font-bold mb-2">
                {partido.equipo_local?.nombre || "TBD"}
              </div>
              <Link href={`/equipos/${partido.equipo_1_id}`}>
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Ver Equipo
                </Button>
              </Link>
            </div>

            <div className="flex flex-col items-center gap-2">
              {partido.completado ? (
                <div className="text-5xl font-bold font-mono">
                  {partido.goles_equipo_1 ?? 0} - {partido.goles_equipo_2 ?? 0}
                </div>
              ) : (
                <div className="text-4xl font-bold text-muted-foreground">
                  vs
                </div>
              )}
              {partido.penales_equipo_1 !== null &&
                partido.penales_equipo_2 !== null && (
                  <div className="text-sm text-muted-foreground">
                    Penales: {partido.penales_equipo_1} -{" "}
                    {partido.penales_equipo_2}
                  </div>
                )}
            </div>

            <div className="flex-1 text-left">
              <div className="text-2xl font-bold mb-2">
                {partido.equipo_visitante?.nombre || "TBD"}
              </div>
              <Link href={`/equipos/${partido.equipo_2_id}`}>
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Ver Equipo
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t my-6" />

          {/* Match Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {partido.fecha && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Fecha</div>
                  <div className="text-muted-foreground">
                    {formatDate(new Date(partido.fecha))}
                  </div>
                </div>
              </div>
            )}

            {partido.fecha && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Hora</div>
                  <div className="text-muted-foreground">
                    {formatTime(new Date(partido.fecha))}
                  </div>
                </div>
              </div>
            )}

            {partido.cancha && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Cancha</div>
                  <div className="text-muted-foreground">{partido.cancha}</div>
                </div>
              </div>
            )}

            {partido._count && (
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Eventos</div>
                  <div className="flex gap-2 text-muted-foreground">
                    ⚽ {partido._count.goles} | 🟨 {partido._count.tarjetas} |
                    🔄 {partido._count.cambios}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Result Details */}
          {partido.completado && (
            <>
              <div className="border-t my-6" />
              <div className="space-y-2">
                {partido.resultado_retiro && (
                  <div className="text-sm">
                    <span className="font-medium">Retiro:</span>{" "}
                    <span className="text-muted-foreground">
                      Equipo {partido.resultado_retiro === "equipo_1" ? "1" : "2"}
                    </span>
                  </div>
                )}
                {partido.resultado_inasistencia && (
                  <div className="text-sm">
                    <span className="font-medium">Inasistencia:</span>{" "}
                    <span className="text-muted-foreground">
                      Equipo {partido.resultado_inasistencia === "equipo_1" ? "1" : "2"}
                    </span>
                  </div>
                )}
                {partido.sancion && (
                  <div className="text-sm">
                    <span className="font-medium">Sanción:</span>{" "}
                    <span className="text-muted-foreground">
                      Equipo {partido.sancion === "equipo_1" ? "1" : "2"}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Events Timeline */}
      {(partido._count?.goles ?? 0) > 0 ||
      (partido._count?.tarjetas ?? 0) > 0 ||
      (partido._count?.cambios ?? 0) > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Eventos del Partido</CardTitle>
          </CardHeader>
          <CardContent>
            <EventosTimeline partidoId={id} />
          </CardContent>
        </Card>
      ) : (
        !partido.completado && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>No hay eventos registrados aún.</p>
              <p className="text-sm mt-2">
                Los eventos se registrarán durante el partido.
              </p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
