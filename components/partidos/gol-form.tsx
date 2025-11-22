"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registrarGol } from "@/actions/partidos";

interface GolFormProps {
  partidoId: string;
  equipoId: string;
  onSubmit?: () => void;
}

export function GolForm({ partidoId, equipoId, onSubmit }: GolFormProps) {
  const [jugadorId, setJugadorId] = useState("");
  const [minuto, setMinuto] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jugadorId) {
      toast.error("Por favor selecciona un jugador");
      return;
    }

    try {
      setSubmitting(true);

      await registrarGol({
        partido_id: partidoId,
        equipo_id: equipoId,
        jugador_id: jugadorId,
        minuto,
      });

      toast.success("Gol registrado correctamente");

      // Reset form
      setJugadorId("");
      setMinuto(0);

      if (onSubmit) onSubmit();
    } catch (error) {
      console.error("Error registering gol:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al registrar el gol. Por favor intenta de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Gol</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jugador">Jugador</Label>
            {/* TODO: Replace with Select component with jugadores del equipo */}
            <Input
              id="jugador"
              placeholder="Seleccionar jugador"
              value={jugadorId}
              onChange={(e) => setJugadorId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minuto">Minuto</Label>
            <Input
              id="minuto"
              type="number"
              min={0}
              max={90}
              value={minuto}
              onChange={(e) => setMinuto(Number(e.target.value))}
            />
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Registrando..." : "Registrar Gol"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
