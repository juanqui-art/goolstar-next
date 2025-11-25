"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BalanceCardProps {
	equipoNombre?: string;
	totalCargos: number;
	totalPagos: number;
	deudaPendiente: number;
	porcentajePagado: number;
	showTitle?: boolean;
}

export function BalanceCard({
	equipoNombre,
	totalCargos,
	totalPagos,
	deudaPendiente,
	porcentajePagado,
	showTitle = true,
}: BalanceCardProps) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const getStatusColor = () => {
		if (deudaPendiente <= 0) return "bg-green-500";
		if (porcentajePagado >= 50) return "bg-yellow-500";
		return "bg-red-500";
	};

	const getStatusText = () => {
		if (deudaPendiente <= 0) return "Al día";
		if (porcentajePagado >= 75) return "Deuda baja";
		if (porcentajePagado >= 50) return "Deuda media";
		return "Deuda alta";
	};

	return (
		<Card>
			{showTitle && (
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>{equipoNombre || "Balance Financiero"}</CardTitle>
							<CardDescription>Estado financiero del equipo</CardDescription>
						</div>
						<Badge
							variant={deudaPendiente <= 0 ? "default" : "destructive"}
							className="text-xs"
						>
							{getStatusText()}
						</Badge>
					</div>
				</CardHeader>
			)}
			<CardContent className="space-y-6">
				{/* Resumen de montos */}
				<div className="grid grid-cols-3 gap-4">
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Total Cargos</p>
						<p className="text-lg font-semibold">{formatCurrency(totalCargos)}</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Total Pagos</p>
						<p className="text-lg font-semibold text-green-600">
							{formatCurrency(totalPagos)}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Deuda Pendiente</p>
						<p
							className={`text-lg font-semibold ${
								deudaPendiente > 0
									? "text-red-600 dark:text-red-400"
									: "text-green-600 dark:text-green-400"
							}`}
						>
							{formatCurrency(deudaPendiente)}
						</p>
					</div>
				</div>

				{/* Barra de progreso */}
				<div className="space-y-2">
					<div className="flex justify-between text-xs">
						<span className="text-muted-foreground">Progreso de Pago</span>
						<span className="font-medium">
							{Math.min(porcentajePagado, 100).toFixed(1)}%
						</span>
					</div>
					<div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
						<div
							className={`h-full ${getStatusColor()} transition-all duration-300`}
							style={{ width: `${Math.min(porcentajePagado, 100)}%` }}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
