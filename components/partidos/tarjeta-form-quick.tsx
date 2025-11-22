"use client";

import { useState } from "react";
import { toast } from "sonner";
import { registrarTarjeta } from "@/actions/partidos";
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

interface Jugador {
  id: string;
  primer_nombre: string;
  primer_apellido: string;
  dorsal: number | null;
}

interface TarjetaFormQuickProps {
  partidoId: string;
  equipoId: string;
  jugadores: Jugador[];
  onSuccess?: () => void;
}

export function TarjetaFormQuick({
  partidoId,
  equipoId,
  jugadores,
  onSuccess,
}: TarjetaFormQuickProps) {
  const [jugadorId, setJugadorId] = useState("");
  const [tipo, setTipo] = useState<"AMARILLA" | "ROJA">("AMARILLA");
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

      await registrarTarjeta({
        partido_id: partidoId,
        equipo_id: equipoId,
        jugador_id: jugadorId,
        tipo,
        minuto,
      });

      toast.success(`Tarjeta ${tipo.toLowerCase()} registrada correctamente`);

      // Reset form
      setJugadorId("");
      setTipo("AMARILLA");
      setMinuto(1);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error registering tarjeta:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al registrar la tarjeta. Por favor intenta de nuevo.",
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
              jugadores.map((jugador) => (
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
        <Label htmlFor="tipo">Tipo de Tarjeta</Label>
        <Select
          value={tipo}
          onValueChange={(v) => setTipo(v as "AMARILLA" | "ROJA")}
        >
          <SelectTrigger id="tipo">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AMARILLA">🟨 Amarilla</SelectItem>
            <SelectItem value="ROJA">🟥 Roja</SelectItem>
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
          onChange={(e) => setMinuto(Number(e.target.value))}
          placeholder="ej: 45"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting
            ? "Registrando..."
            : `Registrar Tarjeta ${tipo === "AMARILLA" ? "🟨" : "🟥"}`}
        </Button>
      </div>
    </form>
  );
}
