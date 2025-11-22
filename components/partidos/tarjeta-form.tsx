"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TarjetaFormProps {
  partidoId: string
  equipoId: string
  onSubmit?: () => void
}

export function TarjetaForm({ partidoId, equipoId, onSubmit }: TarjetaFormProps) {
  const [jugadorId, setJugadorId] = useState("")
  const [minuto, setMinuto] = useState<number>(0)
  const [tipoTarjeta, setTipoTarjeta] = useState<"amarilla" | "roja">("amarilla")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // TODO: Connect to Server Action registrarTarjeta()
    console.log("Registering tarjeta:", {
      partidoId,
      equipoId,
      jugadorId,
      minuto,
      tipoTarjeta,
    })

    setTimeout(() => {
      setSubmitting(false)
      if (onSubmit) onSubmit()
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Tarjeta</CardTitle>
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

          <div className="space-y-2">
            <Label>Tipo de Tarjeta</Label>
            <RadioGroup value={tipoTarjeta} onValueChange={(value) => setTipoTarjeta(value as "amarilla" | "roja")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amarilla" id="amarilla" />
                <Label htmlFor="amarilla">Amarilla</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="roja" id="roja" />
                <Label htmlFor="roja">Roja</Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Registrando..." : "Registrar Tarjeta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
