"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface DocumentoVerificacionProps {
  documentoId: string
  onComplete?: () => void
}

export function DocumentoVerificacion({ documentoId, onComplete }: DocumentoVerificacionProps) {
  const [motivo, setMotivo] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleApprove = async () => {
    setSubmitting(true)
    // TODO: Connect to Server Action aprobarDocumento()
    console.log("Approving document:", documentoId)
    setTimeout(() => {
      setSubmitting(false)
      if (onComplete) onComplete()
    }, 1000)
  }

  const handleReject = async () => {
    if (!motivo.trim()) {
      alert("Debes proporcionar un motivo de rechazo")
      return
    }

    setSubmitting(true)
    // TODO: Connect to Server Action rechazarDocumento()
    console.log("Rejecting document:", documentoId, "Motivo:", motivo)
    setTimeout(() => {
      setSubmitting(false)
      if (onComplete) onComplete()
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificación de Documento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="motivo">Motivo (requerido para rechazo)</Label>
          <Textarea
            id="motivo"
            placeholder="Describe el motivo del rechazo..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={handleApprove}
            disabled={submitting}
          >
            {submitting ? "Procesando..." : "Aprobar"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={submitting || !motivo.trim()}
          >
            {submitting ? "Procesando..." : "Rechazar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
