import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { HistorialPagos } from "@/components/financiero/historial-pagos";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getTransacciones, getFinancieroStats } from "@/actions/financiero";

export default async function TransaccionesPage() {
	// Fetch all transactions
	const transacciones = await getTransacciones();
	const stats = await getFinancieroStats();

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const ingresos = transacciones.filter((t) => t.es_ingreso);
	const egresos = transacciones.filter((t) => !t.es_ingreso);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<Link href="/financiero">
							<Button variant="ghost" size="sm">
								<ArrowLeft className="h-4 w-4 mr-1" />
								Volver al Dashboard
							</Button>
						</Link>
					</div>
					<h1 className="text-3xl font-bold">Transacciones</h1>
					<p className="text-muted-foreground">
						Historial completo de transacciones financieras
					</p>
				</div>
				<Link href="/financiero/nueva">
					<Button>
						<Plus className="h-4 w-4 mr-2" />
						Nueva Transacción
					</Button>
				</Link>
			</div>

			{/* Quick Stats */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Total</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{transacciones.length}
						</div>
						<p className="text-xs text-muted-foreground">
							Transacciones registradas
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Ingresos</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600 dark:text-green-400">
							{ingresos.length}
						</div>
						<p className="text-xs text-muted-foreground">Pagos recibidos</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Egresos</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600 dark:text-red-400">
							{egresos.length}
						</div>
						<p className="text-xs text-muted-foreground">Cargos generados</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Balance</CardTitle>
					</CardHeader>
					<CardContent>
						<div
							className={`text-2xl font-bold ${
								stats.balance >= 0
									? "text-green-600 dark:text-green-400"
									: "text-red-600 dark:text-red-400"
							}`}
						>
							{formatCurrency(stats.balance)}
						</div>
						<p className="text-xs text-muted-foreground">
							Ingresos - Egresos
						</p>
					</CardContent>
				</Card>
			</div>

			{/* All Transactions Table */}
			<Card>
				<CardHeader>
					<CardTitle>Todas las Transacciones</CardTitle>
					<CardDescription>
						{transacciones.length} transacción
						{transacciones.length !== 1 ? "es" : ""} registrada
						{transacciones.length !== 1 ? "s" : ""}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<HistorialPagos transactions={transacciones} showActions={false} />
				</CardContent>
			</Card>

			{/* Breakdown by Type */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Resumen de Ingresos</CardTitle>
						<CardDescription>
							{formatCurrency(stats.totalIngresos)} en total
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{ingresos.length === 0 ? (
								<p className="text-sm text-muted-foreground text-center py-4">
									No hay ingresos registrados
								</p>
							) : (
								<p className="text-sm text-muted-foreground">
									{ingresos.length} pago{ingresos.length !== 1 ? "s" : ""}{" "}
									recibido{ingresos.length !== 1 ? "s" : ""}
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Resumen de Egresos</CardTitle>
						<CardDescription>
							{formatCurrency(stats.totalEgresos)} en total
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{egresos.length === 0 ? (
								<p className="text-sm text-muted-foreground text-center py-4">
									No hay egresos registrados
								</p>
							) : (
								<p className="text-sm text-muted-foreground">
									{egresos.length} cargo{egresos.length !== 1 ? "s" : ""}{" "}
									generado{egresos.length !== 1 ? "s" : ""}
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
