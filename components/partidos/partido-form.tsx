"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { type Partido, partidoSchema } from "@/lib/validations/partido";
import { createPartido, updatePartido } from "@/actions/partidos";

interface PartidoFormProps {
  initialData?: Partial<Partido>;
  onSubmit?: (data: Partido) => void | Promise<void>;
  torneos?: Array<{ id: string; nombre: string }>;
  equipos?: Array<{ id: string; nombre: string }>;
  jornadas?: Array<{ id: string; numero: number }>;
  fasesEliminatorias?: Array<{ id: string; nombre: string }>;
  arbitros?: Array<{ id: string; nombre: string }>;
}

export function PartidoForm({
  initialData,
  onSubmit,
  torneos = [],
  equipos = [],
  jornadas = [],
  fasesEliminatorias = [],
  arbitros = [],
}: PartidoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Partido>({
    resolver: zodResolver(partidoSchema),
    defaultValues: initialData || {
      torneo_id: "",
      equipo_1_id: "",
      equipo_2_id: "",
      fecha: new Date(),
      cancha: "",
    },
  });

  const handleSubmit = async (data: Partido) => {
    try {
      setIsSubmitting(true);

      if (initialData?.id) {
        // Update existing partido
        await updatePartido(initialData.id, data);
        toast.success("Partido actualizado correctamente");
      } else {
        // Create new partido
        await createPartido(data);
        toast.success("Partido creado correctamente");
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
          : "Error al guardar el partido. Por favor intenta de nuevo.",
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
          name="torneo_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Torneo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un torneo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {torneos.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No hay torneos disponibles
                    </SelectItem>
                  ) : (
                    torneos.map((torneo) => (
                      <SelectItem key={torneo.id} value={torneo.id}>
                        {torneo.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="equipo_1_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipo Local</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona equipo local" />
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="equipo_2_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipo Visitante</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona equipo visitante" />
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="jornada_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jornada (Opcional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una jornada" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Sin jornada</SelectItem>
                    {jornadas.map((jornada) => (
                      <SelectItem key={jornada.id} value={jornada.id}>
                        Jornada {jornada.numero}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Para partidos de fase de grupos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fase_eliminatoria_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fase Eliminatoria (Opcional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una fase" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Sin fase</SelectItem>
                    {fasesEliminatorias.map((fase) => (
                      <SelectItem key={fase.id} value={fase.id}>
                        {fase.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Para partidos de playoffs (incompatible con jornada)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha y Hora (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormDescription>Fecha y hora del partido</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cancha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancha (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Cancha 1" {...field} />
                </FormControl>
                <FormDescription>
                  Lugar donde se jugará el partido
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="arbitro_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Árbitro (Opcional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un árbitro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Sin árbitro asignado</SelectItem>
                  {arbitros.map((arbitro) => (
                    <SelectItem key={arbitro.id} value={arbitro.id}>
                      {arbitro.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Árbitro asignado al partido</FormDescription>
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
            Partido
          </Button>
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
