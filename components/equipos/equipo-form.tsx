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
import { equipoSchema, type Equipo } from "@/lib/validations/equipo"

interface EquipoFormProps {
  initialData?: Partial<Equipo>
  onSubmit?: (data: Equipo) => void | Promise<void>
}

export function EquipoForm({ initialData, onSubmit }: EquipoFormProps) {
  const form = useForm<Equipo>({
    resolver: zodResolver(equipoSchema),
    defaultValues: initialData || {
      nombre: "",
      categoria_id: "",
      torneo_id: "",
      color_principal: "#000000",
      nivel: "3",
    },
  })

  const handleSubmit = async (data: Equipo) => {
    // TODO: Connect to Server Action createEquipo() or updateEquipo()
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
              <FormLabel>Nombre del Equipo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Los Leones FC" {...field} />
              </FormControl>
              <FormDescription>
                Nombre oficial del equipo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TODO: Add remaining fields:
          - categoria_id (select)
          - torneo_id (select)
          - color_principal (color picker)
          - nivel (select: 1-5)
        */}

        <p className="text-sm text-gray-500">
          TODO: Add remaining form fields (categoria_id, torneo_id, color_principal, nivel)
        </p>

        <div className="flex gap-2">
          <Button type="submit">
            {initialData ? "Actualizar" : "Crear"} Equipo
          </Button>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}
