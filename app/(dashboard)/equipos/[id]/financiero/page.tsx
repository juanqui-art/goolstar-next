import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BalanceCard } from "@/components/financiero/balance-card";
import { DeudaDetalle } from "@/components/financiero/deuda-detalle";
import { HistorialPagos } from "@/components/financiero/historial-pagos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEquipoBalance } from "@/actions/financiero";

export default async function EquipoFinancieroPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	// Fetch team financial data
	let balanceData;
	try {
		balanceData = await getEquipoBalance(id);
	} catch (error) {
		console.error("Error fetching team balance:", error);
		notFound();
	}

	const {
		equipoNombre,
		totalCargos,
		totalPagos,
		deudaPendiente,
		porcentajePagado,
		transacciones,
	} = balanceData;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<Link href={`/equipos/${id}`}>
							<Button variant="ghost" size="sm">
								<ArrowLeft className="h-4 w-4 mr-1" />
								Volver
							</Button>
						</Link>
					</div>
					<h1 className="text-3xl font-bold">Finanzas - {equipoNombre}</h1>
					<p className="text-muted-foreground">
						Historial de pagos y deudas del equipo
					</p>
				</div>
				<Link href={`/equipos/${id}`}>
					<Button variant="outline">Ver Equipo</Button>
				</Link>
			</div>

			{/* Balance Card */}
			<BalanceCard
				equipoNombre={equipoNombre}
				totalCargos={totalCargos}
				totalPagos={totalPagos}
				deudaPendiente={deudaPendiente}
				porcentajePagado={porcentajePagado}
				showTitle={true}
			/>

			{/* Debt Detail */}
			<DeudaDetalle
				equipoNombre={equipoNombre}
				transacciones={transacciones}
				totalCargos={totalCargos}
				totalPagos={totalPagos}
				deudaPendiente={deudaPendiente}
				showTitle={true}
			/>

			{/* Transaction History */}
			<Card>
				<CardHeader>
					<CardTitle>Historial Completo de Transacciones</CardTitle>
				</CardHeader>
				<CardContent>
					<HistorialPagos transactions={transacciones} showActions={false} />
				</CardContent>
			</Card>
		</div>
	);
}
