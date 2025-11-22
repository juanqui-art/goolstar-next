"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createJugador, updateJugador } from "@/actions/jugadores";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Jugador, jugadorSchema } from "@/lib/validations/jugador";

interface JugadorFormProps {
  initialData?: Partial<Jugador>;
  onSubmit?: (data: Jugador) => void | Promise<void>;
  equipos?: Array<{ id: string; nombre: string }>;
}

export function JugadorForm({
  initialData,
  onSubmit,
  equipos = [],
}: JugadorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Jugador>({
    resolver: zodResolver(jugadorSchema),
    defaultValues: initialData || {
      equipo_id: "",
      primer_nombre: "",
      primer_apellido: "",
      nivel: "3",
    },
  });

  const handleSubmit = async (data: Jugador) => {
    try {
      setIsSubmitting(true);

      if (initialData?.id) {
        // Update existing jugador
        await updateJugador(initialData.id, data);
        toast.success("Jugador actualizado correctamente");
      } else {
        // Create new jugador
        await createJugador(data);
        toast.success("Jugador creado correctamente");
        form.reset();
      }

      // Call optional callback if provided
      if (onSubmit) {
        await onSubmit(data);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al guardar el jugador. Por favor intenta de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="equipo_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un equipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {equipos.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No hay equipos disponibles
                    </SelectItem>
                  ) : (
                    equipos.map((equipo) => (
                      <SelectItem key={equipo.id} value={equipo.id}>
                        {equipo.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Equipo al que pertenece el jugador
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
            name="segundo_nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segundo Nombre (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Carlos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="segundo_apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segundo Apellido (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="González" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="cedula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cédula (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} />
                </FormControl>
                <FormDescription>Número de identificación</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numero_dorsal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Dorsal (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={99}
                    placeholder="10"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormDescription>1-99</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nivel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona nivel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Nivel 1 (Principiante)</SelectItem>
                    <SelectItem value="2">Nivel 2 (Básico)</SelectItem>
                    <SelectItem value="3">Nivel 3 (Intermedio)</SelectItem>
                    <SelectItem value="4">Nivel 4 (Avanzado)</SelectItem>
                    <SelectItem value="5">Nivel 5 (Experto)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="posicion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posición (Opcional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una posición" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Portero">Portero</SelectItem>
                  <SelectItem value="Defensa">Defensa</SelectItem>
                  <SelectItem value="Medio">Medio</SelectItem>
                  <SelectItem value="Delantero">Delantero</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Posición principal del jugador en el campo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Guardando..."
              : initialData
                ? "Actualizar"
                : "Crear"}{" "}
            Jugador
          </Button>
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
