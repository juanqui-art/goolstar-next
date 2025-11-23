"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createTorneo, updateTorneo } from "@/actions/torneos";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { type Torneo, torneoSchema } from "@/lib/validations/torneo";

interface TorneoFormProps {
  initialData?: Partial<Torneo> & { id?: string };
  onSubmit?: (data: Torneo) => void | Promise<void>;
  categorias?: Array<{ id: string; nombre: string }>;
}

export function TorneoForm({
  initialData,
  onSubmit,
  categorias = [],
}: TorneoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Torneo>({
    resolver: zodResolver(torneoSchema) as any,
    defaultValues: (initialData || {
      nombre: "",
      categoria_id: "",
      fecha_inicio: undefined,
      tiene_fase_grupos: true,
      tiene_eliminacion_directa: true,
    }) as Torneo,
  });

  // Set fecha_inicio to current date after component mounts (client-side only)
  useEffect(() => {
    if (!initialData?.fecha_inicio) {
      form.setValue("fecha_inicio", new Date());
    }
  }, [initialData, form]);

  const handleSubmit = async (data: Torneo) => {
    try {
      setIsSubmitting(true);

      if (initialData?.id) {
        // Update existing torneo
        await updateTorneo(initialData.id, data);
        toast.success("Torneo actualizado correctamente");
      } else {
        // Create new torneo
        const result = await createTorneo(data);
        toast.success("Torneo creado correctamente");
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
          : "Error al guardar el torneo. Por favor intenta de nuevo.",
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

        <FormField
          control={form.control}
          name="categoria_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categorias.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No hay categorías disponibles
                    </SelectItem>
                  ) : (
                    categorias.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Selecciona la categoría del torneo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fecha_inicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Inicio</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fecha_fin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Fin (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="tiene_fase_grupos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Fase de Grupos</FormLabel>
                  <FormDescription>
                    El torneo incluirá una fase de grupos
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tiene_eliminacion_directa"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Eliminación Directa</FormLabel>
                  <FormDescription>
                    El torneo incluirá una fase de eliminación directa
                    (playoffs)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Guardando..."
              : initialData
                ? "Actualizar"
                : "Crear"}{" "}
            Torneo
          </Button>
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
