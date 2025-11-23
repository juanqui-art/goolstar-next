"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Target, AlertTriangle, ArrowLeftRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Evento {
  id: string;
  tipo: "gol" | "tarjeta" | "cambio";
  minuto: number;
  descripcion: string;
}

interface EventosTimelineProps {
  partidoId: string;
}

export function EventosTimeline({ partidoId }: EventosTimelineProps) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const supabase = createClient();

        const [golesRes, tarjetasRes, cambiosRes] = await Promise.all([
          supabase
            .from("goles")
            .select(
              `
              id,
              minuto,
              es_propio,
              jugadores (primer_nombre, primer_apellido),
              equipos (nombre)
            `,
            )
            .eq("partido_id", partidoId)
            .order("minuto", { ascending: true }),

          supabase
            .from("tarjetas")
            .select(
              `
              id,
              minuto,
              tipo,
              jugadores (primer_nombre, primer_apellido),
              equipos (nombre)
            `,
            )
            .eq("partido_id", partidoId)
            .order("minuto", { ascending: true }),

          supabase
            .from("cambios_jugador")
            .select("id, minuto, jugador_sale_id, jugador_entra_id, equipo_id")
            .eq("partido_id", partidoId)
            .order("minuto", { ascending: true }),
        ]);

        const eventosArray: Evento[] = [];

        if (golesRes.data) {
          for (const gol of golesRes.data) {
            const tipoText = gol.es_propio ? " (Autogol)" : "";
            eventosArray.push({
              id: gol.id,
              tipo: "gol",
              minuto: gol.minuto,
              descripcion: `Gol de ${gol.jugadores?.primer_nombre || "Jugador"} ${gol.jugadores?.primer_apellido || ""}${tipoText} - ${gol.equipos?.nombre || "Equipo"}`,
            });
          }
        }

        if (tarjetasRes.data) {
          for (const tarjeta of tarjetasRes.data) {
            const tipoText = tarjeta.tipo.replace("_", " ").toLowerCase();
            eventosArray.push({
              id: tarjeta.id,
              tipo: "tarjeta",
              minuto: tarjeta.minuto,
              descripcion: `Tarjeta ${tipoText} para ${tarjeta.jugadores?.primer_nombre || "Jugador"} ${tarjeta.jugadores?.primer_apellido || ""} - ${tarjeta.equipos?.nombre || "Equipo"}`,
            });
          }
        }

        if (cambiosRes.data) {
          for (const cambio of cambiosRes.data) {
            eventosArray.push({
              id: cambio.id,
              tipo: "cambio",
              minuto: cambio.minuto,
              descripcion: `Cambio realizado`,
            });
          }
        }

        eventosArray.sort((a, b) => a.minuto - b.minuto);
        setEventos(eventosArray);
      } catch (error) {
        console.error("Error fetching eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [partidoId]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay eventos registrados para este partido.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {eventos.map((evento) => (
        <div
          key={evento.id}
          className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
            evento.tipo === "gol"
              ? "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
              : evento.tipo === "tarjeta"
                ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800"
                : "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800"
          }`}
        >
          {evento.tipo === "gol" && (
            <Target className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
          )}
          {evento.tipo === "tarjeta" && (
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          )}
          {evento.tipo === "cambio" && (
            <ArrowLeftRight className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          )}

          <Badge variant="outline" className="font-mono font-bold min-w-[50px] justify-center">
            {evento.minuto}'
          </Badge>

          <div className="flex-1">
            <div className="text-sm font-medium">{evento.descripcion}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
