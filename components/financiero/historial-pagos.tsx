"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { TransaccionWithRelations } from "@/actions/financiero";

interface HistorialPagosProps {
	transactions: TransaccionWithRelations[];
	onEdit?: (transaction: TransaccionWithRelations) => void;
	onDelete?: (transactionId: string) => void;
	showActions?: boolean;
}

const tipoLabels: Record<string, string> = {
	abono_inscripcion: "Abono Inscripción",
	pago_arbitro: "Pago Árbitro",
	pago_balon: "Pago Balón",
	multa_amarilla: "Multa Amarilla",
	multa_roja: "Multa Roja",
	ajuste_manual: "Ajuste Manual",
	devolucion: "Devolución",
};

export function HistorialPagos({
	transactions,
	onEdit,
	onDelete,
	showActions = false,
}: HistorialPagosProps) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("es-CO", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(date);
	};

	if (transactions.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground text-sm">
					No hay transacciones registradas.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Fecha</TableHead>
						<TableHead>Tipo</TableHead>
						<TableHead>Concepto</TableHead>
						<TableHead>Método</TableHead>
						<TableHead className="text-right">Monto</TableHead>
						<TableHead className="text-center">Movimiento</TableHead>
						{showActions && <TableHead className="text-right">Acciones</TableHead>}
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions.map((transaction) => (
						<TableRow key={transaction.id}>
							<TableCell className="text-sm">
								{formatDate(transaction.fecha)}
							</TableCell>
							<TableCell>
								<Badge variant="outline" className="text-xs">
									{tipoLabels[transaction.tipo] || transaction.tipo}
								</Badge>
							</TableCell>
							<TableCell className="font-medium max-w-xs truncate">
								{transaction.concepto}
								{transaction.observaciones && (
									<p className="text-xs text-muted-foreground truncate">
										{transaction.observaciones}
									</p>
								)}
							</TableCell>
							<TableCell className="text-sm capitalize">
								{transaction.metodo_pago || "-"}
							</TableCell>
							<TableCell
								className={`text-right font-semibold ${
									transaction.es_ingreso
										? "text-green-600 dark:text-green-400"
										: "text-red-600 dark:text-red-400"
								}`}
							>
								{transaction.es_ingreso ? "+" : "-"}
								{formatCurrency(Number(transaction.monto))}
							</TableCell>
							<TableCell className="text-center">
								<Badge
									variant={transaction.es_ingreso ? "default" : "secondary"}
								>
									{transaction.es_ingreso ? "Ingreso" : "Egreso"}
								</Badge>
							</TableCell>
							{showActions && (
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										{onEdit && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onEdit(transaction)}
											>
												Editar
											</Button>
										)}
										{onDelete && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onDelete(transaction.id)}
											>
												Eliminar
											</Button>
										)}
									</div>
								</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
