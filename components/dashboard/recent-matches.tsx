import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatTime } from "@/lib/utils/format";

interface Match {
  id: string;
  fecha: string | null;
  cancha: string | null;
  goles_equipo_1?: number | null;
  goles_equipo_2?: number | null;
  completado: boolean;
  equipo_local: { nombre: string }[] | null;
  equipo_visitante: { nombre: string }[] | null;
}

interface RecentMatchesProps {
  matches: Match[];
  title?: string;
  description?: string;
}

export function RecentMatches({
  matches,
  title = "Partidos recientes",
  description = "Últimos resultados",
}: RecentMatchesProps) {
  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No hay partidos para mostrar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {match.equipo_local?.[0]?.nombre || "TBD"}
                  </span>
                  {match.completado && (
                    <Badge variant="outline" className="text-xs">
                      {match.goles_equipo_1 ?? 0}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {match.equipo_visitante?.[0]?.nombre || "TBD"}
                  </span>
                  {match.completado && (
                    <Badge variant="outline" className="text-xs">
                      {match.goles_equipo_2 ?? 0}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground space-y-1">
                {match.fecha && (
                  <>
                    <div>{formatDate(new Date(match.fecha))}</div>
                    <div>{formatTime(new Date(match.fecha))}</div>
                  </>
                )}
                {match.cancha && (
                  <div className="text-xs">Cancha {match.cancha}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
