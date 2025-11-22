"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CambioFormProps {
  partidoId: string
  equipoId: string
  onSubmit?: () => void
}

export function CambioForm({ partidoId, equipoId, onSubmit }: CambioFormProps) {
  const [jugadorSaleId, setJugadorSaleId] = useState("")
  const [jugadorEntraId, setJugadorEntraId] = useState("")
  const [minuto, setMinuto] = useState<number>(0)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // TODO: Connect to Server Action registrarCambio()
    console.log("Registering cambio:", {
      partidoId,
      equipoId,
      jugadorSaleId,
      jugadorEntraId,
      minuto,
    })

    setTimeout(() => {
      setSubmitting(false)
      if (onSubmit) onSubmit()
    }, 1000)
  }

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
  )
}
