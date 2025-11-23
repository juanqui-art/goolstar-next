"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { finalizarPartido } from "@/actions/partidos";

interface FinalizarPartidoFormProps {
  partidoId: string;
  golesLocal: number;
  golesVisitante: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FinalizarPartidoForm({
  partidoId,
  golesLocal: initialGolesLocal,
  golesVisitante: initialGolesVisitante,
  onSuccess,
  onCancel,
}: FinalizarPartidoFormProps) {
  const [golesEquipo1, setGolesEquipo1] = useState(initialGolesLocal);
  const [golesEquipo2, setGolesEquipo2] = useState(initialGolesVisitante);
  const [resultadoRetiro, setResultadoRetiro] = useState<
    "equipo_1" | "equipo_2" | ""
  >("");
  const [resultadoInasistencia, setResultadoInasistencia] = useState<
    "equipo_1" | "equipo_2" | ""
  >("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const resultado: {
        goles_equipo_1: number;
        goles_equipo_2: number;
        resultado_retiro?: "equipo_1" | "equipo_2";
        resultado_inasistencia?: "equipo_1" | "equipo_2";
      } = {
        goles_equipo_1: golesEquipo1,
        goles_equipo_2: golesEquipo2,
      };

      if (resultadoRetiro) {
        resultado.resultado_retiro = resultadoRetiro;
      }

      if (resultadoInasistencia) {
        resultado.resultado_inasistencia = resultadoInasistencia;
      }

      await finalizarPartido(partidoId, resultado);

      toast.success("Partido finalizado correctamente");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error finalizing partido:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al finalizar el partido. Por favor intenta de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="goles-equipo-1">Goles Equipo Local</Label>
          <Input
            id="goles-equipo-1"
            type="number"
            min={0}
            max={99}
            value={golesEquipo1}
            onChange={(e) => setGolesEquipo1(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goles-equipo-2">Goles Equipo Visitante</Label>
          <Input
            id="goles-equipo-2"
            type="number"
            min={0}
            max={99}
            value={golesEquipo2}
            onChange={(e) => setGolesEquipo2(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resultado-retiro">
          Resultado por Retiro (Opcional)
        </Label>
        <Select
          value={resultadoRetiro}
          onValueChange={(v) => setResultadoRetiro(v as any)}
        >
          <SelectTrigger id="resultado-retiro">
            <SelectValue placeholder="Sin retiro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Sin retiro</SelectItem>
            <SelectItem value="equipo_1">Equipo Local se retiró</SelectItem>
            <SelectItem value="equipo_2">Equipo Visitante se retiró</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Si un equipo se retiró, selecciónalo aquí
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resultado-inasistencia">
          Resultado por Inasistencia (Opcional)
        </Label>
        <Select
          value={resultadoInasistencia}
          onValueChange={(v) => setResultadoInasistencia(v as any)}
        >
          <SelectTrigger id="resultado-inasistencia">
            <SelectValue placeholder="Sin inasistencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Sin inasistencia</SelectItem>
            <SelectItem value="equipo_1">Equipo Local no asistió</SelectItem>
            <SelectItem value="equipo_2">
              Equipo Visitante no asistió
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Si un equipo no asistió, selecciónalo aquí
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? "Finalizando..." : "Finalizar Partido"}
        </Button>
      </div>
    </form>
  );
}
