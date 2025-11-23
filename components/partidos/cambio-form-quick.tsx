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
import { registrarCambio } from "@/actions/partidos";

interface Jugador {
  id: string;
  primer_nombre: string;
  primer_apellido: string;
  dorsal: number | null;
}

interface CambioFormQuickProps {
  partidoId: string;
  equipoId: string;
  jugadores: Jugador[];
  onSuccess?: () => void;
}

export function CambioFormQuick({
  partidoId,
  equipoId,
  jugadores,
  onSuccess,
}: CambioFormQuickProps) {
  const [jugadorSaleId, setJugadorSaleId] = useState("");
  const [jugadorEntraId, setJugadorEntraId] = useState("");
  const [minuto, setMinuto] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jugadorSaleId || !jugadorEntraId) {
      toast.error("Por favor selecciona ambos jugadores");
      return;
    }

    if (jugadorSaleId === jugadorEntraId) {
      toast.error("Debes seleccionar dos jugadores diferentes");
      return;
    }

    try {
      setSubmitting(true);

      await registrarCambio(
        partidoId,
        jugadorSaleId,
        jugadorEntraId,
        equipoId,
        minuto,
      );

      toast.success("Cambio registrado correctamente");

      // Reset form
      setJugadorSaleId("");
      setJugadorEntraId("");
      setMinuto(1);

      if (onSuccess) {
        onSuccess();
      }
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="jugador-sale">Jugador que Sale</Label>
        <Select value={jugadorSaleId} onValueChange={setJugadorSaleId}>
          <SelectTrigger id="jugador-sale">
            <SelectValue placeholder="Selecciona el jugador que sale" />
          </SelectTrigger>
          <SelectContent>
            {jugadores.length === 0 ? (
              <SelectItem value="none" disabled>
                No hay jugadores disponibles
              </SelectItem>
            ) : (
              jugadores
                .filter((j) => j.id !== jugadorEntraId) // Exclude selected "entra" player
                .map((jugador) => (
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
        <Label htmlFor="jugador-entra">Jugador que Entra</Label>
        <Select value={jugadorEntraId} onValueChange={setJugadorEntraId}>
          <SelectTrigger id="jugador-entra">
            <SelectValue placeholder="Selecciona el jugador que entra" />
          </SelectTrigger>
          <SelectContent>
            {jugadores.length === 0 ? (
              <SelectItem value="none" disabled>
                No hay jugadores disponibles
              </SelectItem>
            ) : (
              jugadores
                .filter((j) => j.id !== jugadorSaleId) // Exclude selected "sale" player
                .map((jugador) => (
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
          onChange={(e) => setMinuto(Number(e.target.value))}
          placeholder="ej: 45"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? "Registrando..." : "Registrar Cambio 🔄"}
        </Button>
      </div>
    </form>
  );
}
