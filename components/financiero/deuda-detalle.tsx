import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DeudaDetalleProps {
  equipoNombre: string;
  conceptos: Array<{
    concepto: string;
    monto: number;
    pagado: boolean;
    fechaVencimiento?: string;
  }>;
}

export function DeudaDetalle({ equipoNombre, conceptos }: DeudaDetalleProps) {
  const deudaPendiente = conceptos
    .filter((c) => !c.pagado)
    .reduce((sum, c) => sum + c.monto, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalle de Deuda - {equipoNombre}</CardTitle>
        <CardDescription>Desglose de conceptos pendientes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {deudaPendiente > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Deuda pendiente: <strong>${deudaPendiente.toFixed(2)}</strong>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {conceptos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay conceptos registrados
            </p>
          ) : (
            conceptos.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-3 rounded border ${
                  item.pagado
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium">{item.concepto}</p>
                  {item.fechaVencimiento && !item.pagado && (
                    <p className="text-sm text-gray-600">
                      Vence: {item.fechaVencimiento}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold">${item.monto.toFixed(2)}</p>
                  <p
                    className={`text-sm ${item.pagado ? "text-green-600" : "text-red-600"}`}
                  >
                    {item.pagado ? "Pagado" : "Pendiente"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
