import { AlertCircle, DollarSign, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getFinancieroStats, getEquiposConDeuda } from "@/actions/financiero";

export default async function FinancieroPage() {
	// Fetch real data from Server Actions
	const stats = await getFinancieroStats();
	const equiposConDeuda = await getEquiposConDeuda();

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const totalDeuda = equiposConDeuda.reduce((sum, e) => sum + e.deuda, 0);
	const porcentajePagado =
		stats.totalIngresos + stats.totalEgresos > 0
			? (stats.totalIngresos / (stats.totalIngresos + stats.totalEgresos)) * 100
			: 0;

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Financiero</h1>
					<p className="text-muted-foreground">
						Dashboard financiero del torneo
					</p>
				</div>
				<Link href="/financiero/transacciones">
					<Button>Ver Transacciones</Button>
				</Link>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Ingresos
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600 dark:text-green-400">
							{formatCurrency(stats.totalIngresos)}
						</div>
						<p className="text-xs text-muted-foreground">Pagos recibidos</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Cargos</CardTitle>
						<AlertCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600 dark:text-red-400">
							{formatCurrency(stats.totalEgresos)}
						</div>
						<p className="text-xs text-muted-foreground">Deudas generadas</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Equipos con Deuda
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{equiposConDeuda.length}</div>
						<p className="text-xs text-muted-foreground">
							Requieren seguimiento
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">% Pagado</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{porcentajePagado.toFixed(1)}%
						</div>
						<p className="text-xs text-muted-foreground">Tasa de pago</p>
					</CardContent>
				</Card>
			</div>

			{/* Balance Card */}
			<Card>
				<CardHeader>
					<CardTitle>Balance General</CardTitle>
					<CardDescription>Estado financiero del torneo</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-4">
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">Ingresos</p>
							<p className="text-2xl font-bold text-green-600 dark:text-green-400">
								{formatCurrency(stats.totalIngresos)}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">Cargos</p>
							<p className="text-2xl font-bold text-red-600 dark:text-red-400">
								{formatCurrency(stats.totalEgresos)}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">Balance</p>
							<p
								className={`text-2xl font-bold ${
									stats.balance >= 0
										? "text-green-600 dark:text-green-400"
										: "text-red-600 dark:text-red-400"
								}`}
							>
								{formatCurrency(stats.balance)}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Teams with Debt Table */}
			<Card>
				<CardHeader>
					<CardTitle>Equipos con Deuda Pendiente</CardTitle>
					<CardDescription>
						{equiposConDeuda.length === 0
							? "Todos los equipos están al día"
							: `${equiposConDeuda.length} equipos con deuda pendiente`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{equiposConDeuda.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-muted-foreground text-sm">
								No hay equipos con deuda pendiente
							</p>
						</div>
					) : (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Equipo</TableHead>
										<TableHead className="text-right">Deuda</TableHead>
										<TableHead className="text-center">Estado</TableHead>
										<TableHead className="text-right">Acciones</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{equiposConDeuda.map((equipo) => (
										<TableRow key={equipo.equipoId}>
											<TableCell className="font-medium">
												{equipo.equipoNombre}
											</TableCell>
											<TableCell className="text-right font-semibold text-red-600 dark:text-red-400">
												{formatCurrency(equipo.deuda)}
											</TableCell>
											<TableCell className="text-center">
												<Badge variant="destructive">Pendiente</Badge>
											</TableCell>
											<TableCell className="text-right">
												<Link href={`/equipos/${equipo.equipoId}`}>
													<Button variant="ghost" size="sm">
														Ver Detalle
													</Button>
												</Link>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Quick Stats */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Estadísticas</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">
								Total Transacciones
							</span>
							<span className="font-semibold">
								{stats.totalTransacciones}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">
								Deuda Total Pendiente
							</span>
							<span className="font-semibold text-red-600 dark:text-red-400">
								{formatCurrency(totalDeuda)}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">
								Tasa de Recaudación
							</span>
							<span className="font-semibold">
								{porcentajePagado.toFixed(1)}%
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Acciones Rápidas</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<Link href="/financiero/transacciones" className="block">
							<Button variant="outline" className="w-full justify-start">
								Ver todas las transacciones
							</Button>
						</Link>
						<Link href="/financiero/nueva" className="block">
							<Button variant="outline" className="w-full justify-start">
								Registrar nueva transacción
							</Button>
						</Link>
						<Link href="/equipos" className="block">
							<Button variant="outline" className="w-full justify-start">
								Ver estado de equipos
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
