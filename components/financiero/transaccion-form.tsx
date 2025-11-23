"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registrarTransaccion } from "@/actions/financiero";
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
import { Textarea } from "@/components/ui/textarea";
import {
  type CreateTransaccion,
  createTransaccionSchema,
  metodosPago,
  tiposTransaccion,
} from "@/lib/validations/financiero";

interface TransaccionFormProps {
  initialData?: Partial<CreateTransaccion>;
  onSubmit?: (data: CreateTransaccion) => void | Promise<void>;
  equipos?: Array<{ id: string; nombre: string }>;
  torneos?: Array<{ id: string; nombre: string }>;
}

export function TransaccionForm({
  initialData,
  onSubmit,
  equipos = [],
  torneos = [],
}: TransaccionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTransaccion>({
    resolver: zodResolver(createTransaccionSchema) as any,
    defaultValues: (initialData || {
      equipo_id: "",
      torneo_id: "",
      tipo: "abono_inscripcion",
      monto: 0,
      es_ingreso: true,
      pagado: false,
    }) as CreateTransaccion,
  });

  const handleSubmit = async (data: unknown) => {
    const validatedData = createTransaccionSchema.parse(
      data,
    ) as CreateTransaccion;
    try {
      setIsSubmitting(true);

      // Create new transaction
      await registrarTransaccion(validatedData);
      toast.success("Transacción registrada correctamente");
      form.reset();

      // Call optional callback if provided
      if (onSubmit) {
        await onSubmit(validatedData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al registrar la transacción. Por favor intenta de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="equipo_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Transacción</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="abono_inscripcion">
                    Abono Inscripción
                  </SelectItem>
                  <SelectItem value="pago_arbitro">Pago Árbitro</SelectItem>
                  <SelectItem value="pago_balon">Pago Balón</SelectItem>
                  <SelectItem value="multa_amarilla">
                    Multa Tarjeta Amarilla
                  </SelectItem>
                  <SelectItem value="multa_roja">Multa Tarjeta Roja</SelectItem>
                  <SelectItem value="ajuste_manual">Ajuste Manual</SelectItem>
                  <SelectItem value="devolucion">Devolución</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Tipo de operación financiera</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto (USD)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="0.00"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Cantidad en dólares</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="es_ingreso"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Es Ingreso (Pago)</FormLabel>
                  <FormDescription>
                    Marcar si es un pago recibido. Dejar sin marcar si es un
                    cargo/deuda.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pagado"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Pagado</FormLabel>
                  <FormDescription>
                    Marcar si la transacción ya fue completada
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="metodo_pago"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Pago (Opcional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona método" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="deposito">Depósito</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fecha_pago"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Pago (Opcional)</FormLabel>
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

        <FormField
          control={form.control}
          name="referencia_externa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referencia Externa (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Nº de comprobante" {...field} />
              </FormControl>
              <FormDescription>
                Número de comprobante bancario o referencia
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalles de la transacción..."
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="razon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razón (Opcional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Motivo o justificación"
                  maxLength={255}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Motivo o razón de la transacción
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar Transacción"}
          </Button>
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
