import { HistorialPagos } from "@/components/financiero/historial-pagos";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TransaccionesPage() {
  // TODO: Replace with getTransacciones() Server Action
  const transacciones = [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transacciones</h1>
          <p className="text-gray-600">Historial completo de pagos</p>
        </div>
        <Button>Registrar Pago</Button>
      </div>

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
          <HistorialPagos transactions={transacciones} />
        </CardContent>
      </Card>
    </div>
  );
}
