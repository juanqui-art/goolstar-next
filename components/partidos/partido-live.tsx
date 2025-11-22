"use client";

import { useState } from "react";
import { Trophy, Plus, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EventosTimeline } from "./eventos-timeline";
import { GolFormQuick } from "./gol-form-quick";
import { TarjetaFormQuick } from "./tarjeta-form-quick";
import { CambioFormQuick } from "./cambio-form-quick";
import { FinalizarPartidoForm } from "./finalizar-partido-form";
import { toast } from "sonner";

interface Jugador {
  id: string;
  primer_nombre: string;
  primer_apellido: string;
  dorsal: number | null;
}

interface Equipo {
  id: string;
  nombre: string;
  jugadores: Jugador[];
}

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

interface PartidoLiveProps {
  partidoId: string;
  equipoLocal: Equipo;
  equipoVisitante: Equipo;
  golesLocal: number;
  golesVisitante: number;
  eventos: Evento[];
  completado: boolean;
}

export function PartidoLive({
  partidoId,
  equipoLocal,
  equipoVisitante,
  golesLocal: initialGolesLocal,
  golesVisitante: initialGolesVisitante,
  eventos: initialEventos,
  completado,
}: PartidoLiveProps) {
  const [golesLocal, setGolesLocal] = useState(initialGolesLocal);
  const [golesVisitante, setGolesVisitante] = useState(initialGolesVisitante);
  const [eventos, setEventos] = useState<Evento[]>(initialEventos);
  const [showGolDialog, setShowGolDialog] = useState(false);
  const [showTarjetaDialog, setShowTarjetaDialog] = useState(false);
  const [showCambioDialog, setShowCambioDialog] = useState(false);
  const [showFinalizarDialog, setShowFinalizarDialog] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState<"local" | "visitante">("local");

  const handleEventoRegistrado = (tipo: Evento["tipo"], equipoId: string) => {
    toast.success(`${tipo === "gol" ? "Gol" : tipo === "cambio" ? "Cambio" : "Tarjeta"} registrado correctamente`);

    // Reload page to show updated events
    window.location.reload();
  };

  const openGolDialog = (equipo: "local" | "visitante") => {
    setSelectedEquipo(equipo);
    setShowGolDialog(true);
  };

  const openTarjetaDialog = (equipo: "local" | "visitante") => {
    setSelectedEquipo(equipo);
    setShowTarjetaDialog(true);
  };

  const openCambioDialog = (equipo: "local" | "visitante") => {
    setSelectedEquipo(equipo);
    setShowCambioDialog(true);
  };

  const selectedEquipoData = selectedEquipo === "local" ? equipoLocal : equipoVisitante;

  if (completado) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Partido Finalizado
          </CardTitle>
          <CardDescription>
            Este partido ya ha sido completado. Los resultados son definitivos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Final Score Display */}
          <div className="flex items-center justify-center py-8">
            <div className="text-center flex-1">
              <h3 className="text-2xl font-bold mb-2">{equipoLocal.nombre}</h3>
              <div className="text-6xl font-bold text-primary">{golesLocal}</div>
            </div>
            <div className="text-4xl font-bold text-muted-foreground px-6">-</div>
            <div className="text-center flex-1">
              <h3 className="text-2xl font-bold mb-2">{equipoVisitante.nombre}</h3>
              <div className="text-6xl font-bold text-primary">{golesVisitante}</div>
            </div>
          </div>

          {/* Events Timeline */}
          <EventosTimeline eventos={eventos} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Scoreboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              Partido en Vivo
            </CardTitle>
            <Button onClick={() => setShowFinalizarDialog(true)} variant="default">
              <Flag className="mr-2 h-4 w-4" />
              Finalizar Partido
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Score Display */}
          <div className="flex items-center justify-center py-8 mb-6">
            <div className="text-center flex-1">
              <h3 className="text-2xl font-bold mb-2">{equipoLocal.nombre}</h3>
              <div className="text-7xl font-bold text-primary">{golesLocal}</div>
              <Badge variant="outline" className="mt-2">Local</Badge>
            </div>
            <div className="text-5xl font-bold text-muted-foreground px-8">-</div>
            <div className="text-center flex-1">
              <h3 className="text-2xl font-bold mb-2">{equipoVisitante.nombre}</h3>
              <div className="text-7xl font-bold text-primary">{golesVisitante}</div>
              <Badge variant="outline" className="mt-2">Visitante</Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-6">
            {/* Local Team Actions */}
            <div className="space-y-2">
              <h4 className="font-semibold mb-3 text-center">{equipoLocal.nombre}</h4>
              <Button
                onClick={() => openGolDialog("local")}
                variant="default"
                className="w-full h-12"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Gol
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => openTarjetaDialog("local")}
                  variant="outline"
                  className="h-10"
                >
                  🟨 Amarilla
                </Button>
                <Button
                  onClick={() => openTarjetaDialog("local")}
                  variant="outline"
                  className="h-10"
                >
                  🟥 Roja
                </Button>
              </div>
              <Button
                onClick={() => openCambioDialog("local")}
                variant="outline"
                className="w-full h-10"
              >
                🔄 Cambio
              </Button>
            </div>

            {/* Visiting Team Actions */}
            <div className="space-y-2">
              <h4 className="font-semibold mb-3 text-center">{equipoVisitante.nombre}</h4>
              <Button
                onClick={() => openGolDialog("visitante")}
                variant="default"
                className="w-full h-12"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Gol
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => openTarjetaDialog("visitante")}
                  variant="outline"
                  className="h-10"
                >
                  🟨 Amarilla
                </Button>
                <Button
                  onClick={() => openTarjetaDialog("visitante")}
                  variant="outline"
                  className="h-10"
                >
                  🟥 Roja
                </Button>
              </div>
              <Button
                onClick={() => openCambioDialog("visitante")}
                variant="outline"
                className="w-full h-10"
              >
                🔄 Cambio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Timeline */}
      <EventosTimeline eventos={eventos} />

      {/* Dialogs */}
      <Dialog open={showGolDialog} onOpenChange={setShowGolDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Gol - {selectedEquipoData.nombre}</DialogTitle>
            <DialogDescription>
              Selecciona el jugador que anotó el gol y el minuto del partido
            </DialogDescription>
          </DialogHeader>
          <GolFormQuick
            partidoId={partidoId}
            equipoId={selectedEquipoData.id}
            jugadores={selectedEquipoData.jugadores}
            onSuccess={() => {
              handleEventoRegistrado("gol", selectedEquipoData.id);
              setShowGolDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showTarjetaDialog} onOpenChange={setShowTarjetaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Tarjeta - {selectedEquipoData.nombre}</DialogTitle>
            <DialogDescription>
              Selecciona el jugador y el tipo de tarjeta
            </DialogDescription>
          </DialogHeader>
          <TarjetaFormQuick
            partidoId={partidoId}
            equipoId={selectedEquipoData.id}
            jugadores={selectedEquipoData.jugadores}
            onSuccess={() => {
              handleEventoRegistrado("tarjeta_amarilla", selectedEquipoData.id);
              setShowTarjetaDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showCambioDialog} onOpenChange={setShowCambioDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Cambio - {selectedEquipoData.nombre}</DialogTitle>
            <DialogDescription>
              Selecciona el jugador que sale y el que entra
            </DialogDescription>
          </DialogHeader>
          <CambioFormQuick
            partidoId={partidoId}
            equipoId={selectedEquipoData.id}
            jugadores={selectedEquipoData.jugadores}
            onSuccess={() => {
              handleEventoRegistrado("cambio", selectedEquipoData.id);
              setShowCambioDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showFinalizarDialog} onOpenChange={setShowFinalizarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Partido</DialogTitle>
            <DialogDescription>
              Confirma el resultado final del partido. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <FinalizarPartidoForm
            partidoId={partidoId}
            golesLocal={golesLocal}
            golesVisitante={golesVisitante}
            onSuccess={() => {
              toast.success("Partido finalizado correctamente");
              window.location.reload();
            }}
            onCancel={() => setShowFinalizarDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
