"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarIcon, Trash2, Plus, RefreshCw } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { generateFixture, deleteFixture } from "@/actions/fixture";
import { formatDate, formatTime } from "@/lib/utils/format";

interface FixtureManagerProps {
  torneoId: string;
  fixture: Array<{
    jornada: {
      id: string;
      nombre: string;
      numero: number;
      fecha: string | null;
      activa: boolean;
    };
    partidos: Array<{
      id: string;
      fecha: string | null;
      cancha: string | null;
      completado: boolean;
      goles_equipo_1: number | null;
      goles_equipo_2: number | null;
      equipo_local: { id: string; nombre: string } | null;
      equipo_visitante: { id: string; nombre: string } | null;
    }>;
  }>;
  hasFixture: boolean;
}

export function FixtureManager({ torneoId, fixture, hasFixture }: FixtureManagerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Generate fixture options
  const [doubleRound, setDoubleRound] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [daysInterval, setDaysInterval] = useState(7);

  const handleGenerateFixture = async () => {
    try {
      setIsGenerating(true);

      const result = await generateFixture({
        torneoId,
        doubleRound,
        startDate: startDate ? new Date(startDate) : undefined,
        daysInterval,
      });

      if (result.success) {
        toast.success(result.message);
        setShowGenerateDialog(false);
        // Reload page to show new fixture
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error generating fixture:", error);
      toast.error("Error al generar el fixture");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteFixture = async () => {
    try {
      setIsDeleting(true);

      const result = await deleteFixture(torneoId);

      if (result.success) {
        toast.success(result.message);
        setShowDeleteDialog(false);
        // Reload page
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting fixture:", error);
      toast.error("Error al eliminar el fixture");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Fixture</CardTitle>
          <CardDescription>
            {hasFixture
              ? "Administra el fixture del torneo. Puedes editar fechas, horarios y regenerar el fixture."
              : "Genera automáticamente el fixture para todos los equipos del torneo usando el algoritmo round-robin (todos contra todos)."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {!hasFixture ? (
              <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Generar Fixture
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generar Fixture Automático</DialogTitle>
                    <DialogDescription>
                      Configura las opciones para generar el fixture del torneo.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="double-round">Ida y Vuelta</Label>
                        <p className="text-sm text-muted-foreground">
                          Cada equipo juega dos veces contra todos (local y visitante)
                        </p>
                      </div>
                      <Switch
                        id="double-round"
                        checked={doubleRound}
                        onCheckedChange={setDoubleRound}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="start-date">Fecha de Inicio (Opcional)</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Fecha de la primera jornada
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="days-interval">Días entre Jornadas</Label>
                      <Input
                        id="days-interval"
                        type="number"
                        min="1"
                        max="30"
                        value={daysInterval}
                        onChange={e => setDaysInterval(Number(e.target.value))}
                      />
                      <p className="text-sm text-muted-foreground">
                        Días de separación entre cada jornada (recomendado: 7)
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowGenerateDialog(false)}
                      disabled={isGenerating}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleGenerateFixture} disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Generando...
                        </>
                      ) : (
                        "Generar Fixture"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Editar Fechas
                </Button>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar Fixture
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>¿Eliminar Fixture?</DialogTitle>
                      <DialogDescription>
                        Esta acción eliminará todas las jornadas y partidos del torneo.
                        Los resultados ya registrados se perderán.
                        <br />
                        <br />
                        ¿Estás seguro de que deseas continuar?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteDialog(false)}
                        disabled={isDeleting}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteFixture}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Eliminando...
                          </>
                        ) : (
                          "Eliminar Fixture"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fixture Display */}
      {hasFixture && fixture.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fixture del Torneo</CardTitle>
            <CardDescription>
              Calendario completo de partidos organizados por jornada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {fixture.map(({ jornada, partidos }) => (
                <AccordionItem key={jornada.id} value={jornada.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{jornada.nombre}</span>
                      {jornada.fecha && (
                        <span className="text-sm text-muted-foreground">
                          {formatDate(new Date(jornada.fecha))}
                        </span>
                      )}
                      {jornada.activa && (
                        <Badge variant="default">Activa</Badge>
                      )}
                      <Badge variant="outline">{partidos.length} partidos</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {partidos.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          No hay partidos programados para esta jornada
                        </p>
                      ) : (
                        partidos.map(partido => (
                          <Card key={partido.id}>
                            <CardContent className="pt-6">
                              <div className="grid grid-cols-12 gap-4 items-center">
                                {/* Team 1 */}
                                <div className="col-span-4 text-right">
                                  <p className="font-medium">
                                    {partido.equipo_local?.nombre || "TBD"}
                                  </p>
                                </div>

                                {/* Score */}
                                <div className="col-span-4 text-center">
                                  {partido.completado ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <span className="text-2xl font-bold">
                                        {partido.goles_equipo_1 ?? 0}
                                      </span>
                                      <span className="text-muted-foreground">-</span>
                                      <span className="text-2xl font-bold">
                                        {partido.goles_equipo_2 ?? 0}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="text-sm text-muted-foreground">
                                      {partido.fecha ? (
                                        <>
                                          <p>{formatDate(new Date(partido.fecha))}</p>
                                          <p className="font-medium">
                                            {formatTime(new Date(partido.fecha))}
                                          </p>
                                        </>
                                      ) : (
                                        <p>Por programar</p>
                                      )}
                                      {partido.cancha && (
                                        <p className="text-xs mt-1">{partido.cancha}</p>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Team 2 */}
                                <div className="col-span-4 text-left">
                                  <p className="font-medium">
                                    {partido.equipo_visitante?.nombre || "TBD"}
                                  </p>
                                </div>
                              </div>

                              {partido.completado && (
                                <div className="mt-2 text-center">
                                  <Badge variant="secondary">Finalizado</Badge>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!hasFixture && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay fixture generado</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Genera automáticamente el fixture para todos los equipos usando el
              algoritmo round-robin. Cada equipo jugará contra todos los demás.
            </p>
            <Button onClick={() => setShowGenerateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Generar Fixture
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
