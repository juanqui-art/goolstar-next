"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TransaccionFormProps {
  equipoId: string
  onSubmit?: () => void
}

export function TransaccionForm({ equipoId, onSubmit }: TransaccionFormProps) {
  const [concepto, setConcepto] = useState("")
  const [monto, setMonto] = useState<number>(0)
  const [esIngreso, setEsIngreso] = useState<boolean>(false)
  const [observaciones, setObservaciones] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // TODO: Connect to Server Action registrarTransaccion()
    console.log("Registering transaction:", {
      equipoId,
      concepto,
      monto,
      esIngreso,
      observaciones,
    })

    setTimeout(() => {
      setSubmitting(false)
      if (onSubmit) onSubmit()
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Transacción</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="concepto">Concepto</Label>
            <Input
              id="concepto"
              placeholder="Ej: Inscripción torneo"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monto">Monto (USD)</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              min={0}
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <RadioGroup value={esIngreso ? "ingreso" : "gasto"} onValueChange={(value) => setEsIngreso(value === "ingreso")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gasto" id="gasto" />
                <Label htmlFor="gasto">Gasto (Deuda)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ingreso" id="ingreso" />
                <Label htmlFor="ingreso">Ingreso (Pago)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              placeholder="Detalles adicionales..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Registrando..." : "Registrar Transacción"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
