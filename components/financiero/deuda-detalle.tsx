"use client";

import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TransaccionWithRelations } from "@/actions/financiero";

interface DeudaDetalleProps {
  equipoNombre?: string;
  transacciones: TransaccionWithRelations[];
  totalCargos: number;
  totalPagos: number;
  deudaPendiente: number;
  showTitle?: boolean;
}

const tipoLabels: Record<string, string> = {
  abono_inscripcion: "Inscripción",
  pago_arbitro: "Arbitraje",
  pago_balon: "Balón",
  multa_amarilla: "Multa Amarilla",
  multa_roja: "Multa Roja",
  ajuste_manual: "Ajuste Manual",
  devolucion: "Devolución",
};

export function DeudaDetalle({
  equipoNombre,
  transacciones,
  totalCargos,
  totalPagos,
  deudaPendiente,
  showTitle = true,
}: DeudaDetalleProps) {
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

  // Group transactions by type
  const cargosByTipo = transacciones
    .filter((t) => !t.es_ingreso)
    .reduce(
      (acc, t) => {
        const tipo = t.tipo;
        if (!acc[tipo]) {
          acc[tipo] = {
            total: 0,
            count: 0,
            transacciones: [],
          };
        }
        acc[tipo].total += Number(t.monto);
        acc[tipo].count += 1;
        acc[tipo].transacciones.push(t);
        return acc;
      },
      {} as Record<
        string,
        {
          total: number;
          count: number;
          transacciones: TransaccionWithRelations[];
        }
      >,
    );

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {equipoNombre
                  ? `Detalle - ${equipoNombre}`
                  : "Detalle de Deuda"}
              </CardTitle>
              <CardDescription>Desglose por tipo de concepto</CardDescription>
            </div>
            {deudaPendiente > 0 && (
              <Badge variant="destructive" className="text-sm">
                Deuda: {formatCurrency(deudaPendiente)}
              </Badge>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {/* Alert for pending debt */}
        {deudaPendiente > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Este equipo tiene una deuda pendiente de{" "}
              <strong>{formatCurrency(deudaPendiente)}</strong>
            </AlertDescription>
          </Alert>
        )}

        {/* Summary boxes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
              <p className="text-xs font-medium text-red-700 dark:text-red-300">
                Total Cargos
              </p>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalCargos)}
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
              <p className="text-xs font-medium text-green-700 dark:text-green-300">
                Total Pagos
              </p>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalPagos)}
            </p>
          </div>
        </div>

        {/* Breakdown by type */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Desglose por Concepto</h3>
          <div className="space-y-3">
            {Object.keys(cargosByTipo).length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No hay cargos registrados
              </p>
            ) : (
              Object.entries(cargosByTipo).map(([tipo, data]) => (
                <div
                  key={tipo}
                  className="flex justify-between items-center p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{tipoLabels[tipo] || tipo}</p>
                      <Badge variant="outline" className="text-xs">
                        {data.count} {data.count === 1 ? "cargo" : "cargos"}
                      </Badge>
                    </div>
                    {data.transacciones[0] && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Última: {formatDate(data.transacciones[0].fecha)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(data.total)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent transactions */}
        {transacciones.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">
              Transacciones Recientes
            </h3>
            <div className="space-y-2">
              {transacciones.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center p-2 rounded text-sm border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-xs">
                      {tipoLabels[t.tipo] || t.tipo}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">
                      {t.concepto}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        t.es_ingreso
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {t.es_ingreso ? "+" : "-"}
                      {formatCurrency(Number(t.monto))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(t.fecha)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
