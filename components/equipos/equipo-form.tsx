"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createEquipo, updateEquipo } from "@/actions/equipos";
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
import { type Equipo, equipoSchema } from "@/lib/validations/equipo";

interface EquipoFormProps {
  initialData?: Partial<Equipo>;
  onSubmit?: (data: Equipo) => void | Promise<void>;
  categorias?: Array<{ id: string; nombre: string }>;
  torneos?: Array<{ id: string; nombre: string }>;
  dirigentes?: Array<{ id: string; nombre: string }>;
}

export function EquipoForm({
  initialData,
  onSubmit,
  categorias = [],
  torneos = [],
  dirigentes = [],
}: EquipoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Equipo>({
    resolver: zodResolver(equipoSchema),
    defaultValues: initialData || {
      nombre: "",
      categoria_id: "",
      torneo_id: "",
      color_principal: "#000000",
      nivel: "3",
    },
  });

  const handleSubmit = async (data: Equipo) => {
    try {
      setIsSubmitting(true);

      if (initialData?.id) {
        // Update existing equipo
        await updateEquipo(initialData.id, data);
        toast.success("Equipo actualizado correctamente");
      } else {
        // Create new equipo
        await createEquipo(data);
        toast.success("Equipo creado correctamente");
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
          : "Error al guardar el equipo. Por favor intenta de nuevo.",
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
              <FormLabel>Nombre del Equipo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Los Leones FC" {...field} />
              </FormControl>
              <FormDescription>Nombre oficial del equipo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoria_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="torneo_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Torneo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
        </div>

        <FormField
          control={form.control}
          name="dirigente_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirigente (Opcional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un dirigente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dirigentes.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No hay dirigentes disponibles
                    </SelectItem>
                  ) : (
                    dirigentes.map((dir) => (
                      <SelectItem key={dir.id} value={dir.id}>
                        {dir.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Usuario que gestionará este equipo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="color_principal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color Principal</FormLabel>
                <FormControl>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      {...field}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color_secundario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color Secundario (Opcional)</FormLabel>
                <FormControl>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={field.value || "#FFFFFF"}
                      onChange={field.onChange}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="#FFFFFF"
                      className="flex-1"
                    />
                  </div>
                </FormControl>
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
                <FormDescription>Nivel de habilidad del equipo</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="escudo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL del Escudo (Opcional)</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://ejemplo.com/escudo.png"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                URL pública de la imagen del escudo del equipo
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
            Equipo
          </Button>
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
