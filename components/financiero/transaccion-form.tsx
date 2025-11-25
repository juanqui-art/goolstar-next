"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createTransaccion, updateTransaccion } from "@/actions/financiero";
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
import { Textarea } from "@/components/ui/textarea";
import {
	type CreateTransaccion,
	createTransaccionSchema,
	metodosPago,
	tiposTransaccion,
} from "@/lib/validations/financiero";

interface TransaccionFormProps {
	initialData?: Partial<CreateTransaccion> & { id?: string };
	onSubmit?: (data: CreateTransaccion) => void | Promise<void>;
	equipos?: Array<{ id: string; nombre: string }>;
	defaultEquipoId?: string;
}

export function TransaccionForm({
	initialData,
	onSubmit,
	equipos = [],
	defaultEquipoId,
}: TransaccionFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CreateTransaccion>({
		resolver: zodResolver(createTransaccionSchema) as any,
		defaultValues: (initialData || {
			equipo_id: defaultEquipoId || "",
			tipo: "abono_inscripcion",
			monto: 0,
			es_ingreso: true,
			concepto: "",
			metodo_pago: "efectivo",
		}) as CreateTransaccion,
	});

	const handleSubmit = async (data: unknown) => {
		const validatedData = createTransaccionSchema.parse(data);
		try {
			setIsSubmitting(true);

			if (initialData?.id) {
				// Update existing transaction
				await updateTransaccion(initialData.id, validatedData);
				toast.success("Transacción actualizada correctamente");
			} else {
				// Create new transaction
				await createTransaccion(validatedData);
				toast.success("Transacción registrada correctamente");
				form.reset();
			}

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
				{/* Equipo Select */}
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
							<FormDescription>Equipo asociado a la transacción</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

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

				{/* Monto */}
				<FormField
					control={form.control}
					name="monto"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Monto (COP)</FormLabel>
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
							<FormDescription>Monto de la transacción en pesos colombianos</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Es Ingreso */}
				<FormField
					control={form.control}
					name="es_ingreso"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tipo de Movimiento</FormLabel>
							<Select
								onValueChange={(value) => field.onChange(value === "true")}
								defaultValue={field.value ? "true" : "false"}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona tipo" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="true">Ingreso (Pago del equipo)</SelectItem>
									<SelectItem value="false">Egreso (Cargo al equipo)</SelectItem>
								</SelectContent>
							</Select>
							<FormDescription>
								Ingreso: pago recibido. Egreso: deuda o cargo.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Concepto */}
				<FormField
					control={form.control}
					name="concepto"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Concepto</FormLabel>
							<FormControl>
								<Input placeholder="Ej: Pago inscripción torneo" {...field} />
							</FormControl>
							<FormDescription>Descripción breve de la transacción</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Metodo Pago */}
				<FormField
					control={form.control}
					name="metodo_pago"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Método de Pago</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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
									<SelectItem value="otro">Otro</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Referencia Pago */}
				<FormField
					control={form.control}
					name="referencia_pago"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Referencia de Pago (Opcional)</FormLabel>
							<FormControl>
								<Input placeholder="Ej: Nº comprobante" {...field} />
							</FormControl>
							<FormDescription>Número de referencia o comprobante bancario</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Observaciones */}
				<FormField
					control={form.control}
					name="observaciones"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Observaciones (Opcional)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Notas adicionales sobre la transacción"
									rows={3}
									{...field}
									value={field.value || ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Submit Button */}
				<div className="flex gap-2">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting
							? "Guardando..."
							: initialData?.id
								? "Actualizar Transacción"
								: "Registrar Transacción"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
