import { AlertCircle, DollarSign, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FinancieroPage() {
  // TODO: Replace with getFinancieroStats() Server Action
  const stats = {
    totalIngresos: 0,
    totalPendiente: 0,
    equiposConDeuda: 0,
    porcentajePagado: 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financiero</h1>
          <p className="text-gray-600">Dashboard financiero del torneo</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Ingresos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalIngresos}</div>
            <p className="text-xs text-muted-foreground">Pagos recibidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${stats.totalPendiente}
            </div>
            <p className="text-xs text-muted-foreground">Por cobrar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Equipos con Deuda
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.equiposConDeuda}</div>
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
            <div className="text-2xl font-bold">{stats.porcentajePagado}%</div>
            <p className="text-xs text-muted-foreground">Tasa de pago</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen por Equipo</CardTitle>
          <CardDescription>Estado de pagos de cada equipo</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            TODO: Display team payment summary table
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
