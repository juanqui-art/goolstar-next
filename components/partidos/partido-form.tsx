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
import { partidoSchema, type Partido } from "@/lib/validations/partido"

interface PartidoFormProps {
  initialData?: Partial<Partido>
  onSubmit?: (data: Partido) => void | Promise<void>
}

export function PartidoForm({ initialData, onSubmit }: PartidoFormProps) {
  const form = useForm<Partido>({
    resolver: zodResolver(partidoSchema),
    defaultValues: initialData || {
      equipo_1_id: "",
      equipo_2_id: "",
      fecha: new Date(),
      cancha: "",
    },
  })

  const handleSubmit = async (data: Partido) => {
    // TODO: Connect to Server Action createPartido() or updatePartido()
    console.log("Form data:", data)
    if (onSubmit) {
      await onSubmit(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* TODO: Add fields:
          - equipo_1_id (select)
          - equipo_2_id (select)
          - fecha (datetime picker)
          - cancha (text input)
          - jornada_id OR fase_eliminatoria_id (radio or select, mutually exclusive)
        */}

        <p className="text-sm text-gray-500">
          TODO: Add form fields (equipo_1_id, equipo_2_id, fecha, cancha, jornada_id/fase_eliminatoria_id)
        </p>

        <div className="flex gap-2">
          <Button type="submit">
            {initialData ? "Actualizar" : "Crear"} Partido
          </Button>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}
