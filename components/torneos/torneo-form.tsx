"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { torneoSchema, type Torneo } from "@/lib/validations/torneo"

interface TorneoFormProps {
  initialData?: Partial<Torneo>
  onSubmit?: (data: Torneo) => void | Promise<void>
}

export function TorneoForm({ initialData, onSubmit }: TorneoFormProps) {
  const form = useForm<Torneo>({
    resolver: zodResolver(torneoSchema),
    defaultValues: initialData || {
      nombre: "",
      categoria_id: "",
      fecha_inicio: new Date(),
      tiene_fase_grupos: true,
      tiene_eliminacion_directa: true,
    },
  })

  const handleSubmit = async (data: Torneo) => {
    // TODO: Connect to Server Action createTorneo() or updateTorneo()
    console.log("Form data:", data)
    if (onSubmit) {
      await onSubmit(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Torneo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Torneo Verano 2025" {...field} />
              </FormControl>
              <FormDescription>
                Nombre que identificará al torneo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TODO: Add remaining fields:
          - categoria_id (select)
          - fecha_inicio (date picker)
          - fecha_fin (date picker, optional)
          - tiene_fase_grupos (checkbox)
          - tiene_eliminacion_directa (checkbox)
        */}

        <p className="text-sm text-gray-500">
          TODO: Add remaining form fields (categoria_id, fecha_inicio, fecha_fin, phase toggles)
        </p>

        <div className="flex gap-2">
          <Button type="submit">
            {initialData ? "Actualizar" : "Crear"} Torneo
          </Button>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}
