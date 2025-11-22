import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BalanceCardProps {
  equipoNombre: string;
  totalDeuda: number;
  totalPagado: number;
  totalPendiente: number;
  porcentajePagado: number;
}

export function BalanceCard({
  equipoNombre,
  totalDeuda,
  totalPagado,
  totalPendiente,
  porcentajePagado,
}: BalanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{equipoNombre}</CardTitle>
        <CardDescription>Estado financiero</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Deuda</span>
            <span className="font-medium">${totalDeuda.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pagado</span>
            <span className="font-medium text-green-600">
              ${totalPagado.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pendiente</span>
            <span className="font-medium text-red-600">
              ${totalPendiente.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progreso de Pago</span>
            <span className="font-medium">{porcentajePagado.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all"
              style={{ width: `${porcentajePagado}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
