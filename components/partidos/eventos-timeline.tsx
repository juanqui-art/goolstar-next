"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Evento {
  id: string;
  tipo: "gol" | "tarjeta_amarilla" | "tarjeta_roja" | "cambio";
  minuto: number;
  jugador: {
    nombre: string;
    dorsal: number | null;
  };
  equipo: {
    id: string;
    nombre: string;
  };
  jugador_entra?: {
    nombre: string;
    dorsal: number | null;
  };
}

interface EventosTimelineProps {
  eventos: Evento[];
}

export function EventosTimeline({ eventos }: EventosTimelineProps) {
  // Sort eventos by minuto (most recent first)
  const sortedEventos = [...eventos].sort((a, b) => b.minuto - a.minuto);

  const getEventoIcon = (tipo: Evento["tipo"]) => {
    switch (tipo) {
      case "gol":
        return "⚽";
      case "tarjeta_amarilla":
        return "🟨";
      case "tarjeta_roja":
        return "🟥";
      case "cambio":
        return "🔄";
    }
  };

  const getEventoText = (evento: Evento) => {
    const dorsalText = evento.jugador.dorsal ? `#${evento.jugador.dorsal}` : "";

    switch (evento.tipo) {
      case "gol":
        return (
          <span>
            <span className="font-bold">{evento.jugador.nombre}</span>{" "}
            {dorsalText} anotó un gol
          </span>
        );
      case "tarjeta_amarilla":
        return (
          <span>
            <span className="font-bold">{evento.jugador.nombre}</span>{" "}
            {dorsalText} recibió tarjeta amarilla
          </span>
        );
      case "tarjeta_roja":
        return (
          <span>
            <span className="font-bold">{evento.jugador.nombre}</span>{" "}
            {dorsalText} recibió tarjeta roja
          </span>
        );
      case "cambio":
        return (
          <span>
            Sale <span className="font-bold">{evento.jugador.nombre}</span>{" "}
            {dorsalText}
            {evento.jugador_entra && (
              <>
                , entra{" "}
                <span className="font-bold">{evento.jugador_entra.nombre}</span>{" "}
                {evento.jugador_entra.dorsal
                  ? `#${evento.jugador_entra.dorsal}`
                  : ""}
              </>
            )}
          </span>
        );
    }
  };

  if (eventos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Eventos del Partido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No hay eventos registrados aún
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Eventos del Partido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedEventos.map((evento) => (
            <div
              key={evento.id}
              className="flex items-start gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              {/* Minute Badge */}
              <div className="flex-shrink-0">
                <Badge variant="outline" className="font-mono font-bold">
                  {evento.minuto}'
                </Badge>
              </div>

              {/* Event Icon */}
              <div className="text-2xl flex-shrink-0">
                {getEventoIcon(evento.tipo)}
              </div>

              {/* Event Description */}
              <div className="flex-1 min-w-0">
                <p className="text-sm">{getEventoText(evento)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {evento.equipo.nombre}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
