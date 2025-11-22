"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registrarGol } from "@/actions/partidos";

interface Jugador {
  id: string;
  primer_nombre: string;
  primer_apellido: string;
  dorsal: number | null;
}

interface GolFormQuickProps {
  partidoId: string;
  equipoId: string;
  jugadores: Jugador[];
  onSuccess?: () => void;
}

export function GolFormQuick({
  partidoId,
  equipoId,
  jugadores,
  onSuccess,
}: GolFormQuickProps) {
  const [jugadorId, setJugadorId] = useState("");
  const [minuto, setMinuto] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jugadorId) {
      toast.error("Por favor selecciona un jugador");
      return;
    }

    try {
      setSubmitting(true);

      await registrarGol(partidoId, jugadorId, equipoId, minuto);

      toast.success("Gol registrado correctamente");

      // Reset form
      setJugadorId("");
      setMinuto(1);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error registering gol:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al registrar el gol. Por favor intenta de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="jugador">Jugador</Label>
        <Select value={jugadorId} onValueChange={setJugadorId}>
          <SelectTrigger id="jugador">
            <SelectValue placeholder="Selecciona el jugador" />
          </SelectTrigger>
          <SelectContent>
            {jugadores.length === 0 ? (
              <SelectItem value="none" disabled>
                No hay jugadores disponibles
              </SelectItem>
            ) : (
              jugadores.map(jugador => (
                <SelectItem key={jugador.id} value={jugador.id}>
                  {jugador.dorsal ? `#${jugador.dorsal} - ` : ""}
                  {jugador.primer_nombre} {jugador.primer_apellido}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="minuto">Minuto del Partido</Label>
        <Input
          id="minuto"
          type="number"
          min={1}
          max={120}
          value={minuto}
          onChange={e => setMinuto(Number(e.target.value))}
          placeholder="ej: 45"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? "Registrando..." : "Registrar Gol ⚽"}
        </Button>
      </div>
    </form>
  );
}
