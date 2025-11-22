import { HistorialPagos } from "@/components/financiero/historial-pagos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EquipoFinancieroPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: Replace with getEquipoFinanciero(params.id) Server Action
  const transactions = [];
  const balance = {
    total: 0,
    pagado: 0,
    pendiente: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Finanzas del Equipo</h1>
        <p className="text-gray-600">Historial de pagos y deudas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balance.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${balance.pagado}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pendiente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${balance.pendiente}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <HistorialPagos transactions={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}
