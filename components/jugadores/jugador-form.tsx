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
import { jugadorSchema, type Jugador } from "@/lib/validations/jugador"

interface JugadorFormProps {
  initialData?: Partial<Jugador>
  onSubmit?: (data: Jugador) => void | Promise<void>
}

export function JugadorForm({ initialData, onSubmit }: JugadorFormProps) {
  const form = useForm<Jugador>({
    resolver: zodResolver(jugadorSchema),
    defaultValues: initialData || {
      primer_nombre: "",
      primer_apellido: "",
      cedula: "",
      numero_dorsal: 0,
      posicion: "",
      nivel: "3",
    },
  })

  const handleSubmit = async (data: Jugador) => {
    // TODO: Connect to Server Action createJugador() or updateJugador()
    console.log("Form data:", data)
    if (onSubmit) {
      await onSubmit(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="primer_nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primer Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primer_apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primer Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* TODO: Add remaining fields:
          - segundo_nombre (optional)
          - segundo_apellido (optional)
          - cedula (optional)
          - numero_dorsal (number input)
          - posicion (select: Portero, Defensa, Medio, Delantero)
          - nivel (select: 1-5)
          - equipo_id (select)
        */}

        <p className="text-sm text-gray-500">
          TODO: Add remaining form fields (segundo_nombre, segundo_apellido, cedula, numero_dorsal, posicion, nivel, equipo_id)
        </p>

        <div className="flex gap-2">
          <Button type="submit">
            {initialData ? "Actualizar" : "Crear"} Jugador
          </Button>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}
