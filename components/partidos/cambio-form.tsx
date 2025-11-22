"use client";

import { useState } from "react";
import { toast } from "sonner";
import { registrarCambio } from "@/actions/partidos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CambioFormProps {
  partidoId: string;
  equipoId: string;
  onSubmit?: () => void;
}

export function CambioForm({ partidoId, equipoId, onSubmit }: CambioFormProps) {
  const [jugadorSaleId, setJugadorSaleId] = useState("");
  const [jugadorEntraId, setJugadorEntraId] = useState("");
  const [minuto, setMinuto] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jugadorSaleId || !jugadorEntraId) {
      toast.error("Por favor selecciona ambos jugadores");
      return;
    }

    if (jugadorSaleId === jugadorEntraId) {
      toast.error("Los jugadores deben ser diferentes");
      return;
    }

    try {
      setSubmitting(true);

      await registrarCambio(partidoId, jugadorSaleId, jugadorEntraId, equipoId, minuto);

      toast.success("Cambio registrado correctamente");

      // Reset form
      setJugadorSaleId("");
      setJugadorEntraId("");
      setMinuto(0);

      if (onSubmit) onSubmit();
    } catch (error) {
      console.error("Error registering cambio:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al registrar el cambio. Por favor intenta de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Cambio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jugador-sale">Jugador que sale</Label>
            {/* TODO: Replace with Select component with jugadores en cancha */}
            <Input
              id="jugador-sale"
              placeholder="Seleccionar jugador"
              value={jugadorSaleId}
              onChange={(e) => setJugadorSaleId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jugador-entra">Jugador que entra</Label>
            {/* TODO: Replace with Select component with jugadores en banca */}
            <Input
              id="jugador-entra"
              placeholder="Seleccionar jugador"
              value={jugadorEntraId}
              onChange={(e) => setJugadorEntraId(e.target.value)}
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
            {submitting ? "Registrando..." : "Registrar Cambio"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
