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
  fecha: string;
  cancha: string | null;
  completado: boolean;
  equipo_local: { nombre: string } | null;
  equipo_visitante: { nombre: string } | null;
}

interface UpcomingMatchesProps {
  matches: Match[];
  title?: string;
  description?: string;
}

export function UpcomingMatches({
  matches,
  title = "Próximos partidos",
  description = "Partidos programados",
}: UpcomingMatchesProps) {
  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No hay partidos programados.
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
                <div className="font-medium text-sm">
                  {match.equipo_local?.nombre || "TBD"} vs{" "}
                  {match.equipo_visitante?.nombre || "TBD"}
                </div>
                {match.cancha && (
                  <div className="text-xs text-muted-foreground">
                    Cancha {match.cancha}
                  </div>
                )}
              </div>
              <div className="text-right text-xs text-muted-foreground space-y-1">
                <div>{formatDate(new Date(match.fecha))}</div>
                <div className="font-medium">
                  {formatTime(new Date(match.fecha))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
