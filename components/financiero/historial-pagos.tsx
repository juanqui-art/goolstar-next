import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  id: string
  fecha: string
  concepto: string
  monto: number
  es_ingreso: boolean
  pagado: boolean
  observaciones?: string
}

interface HistorialPagosProps {
  transactions: Transaction[]
}

export function HistorialPagos({ transactions }: HistorialPagosProps) {
  if (transactions.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No hay transacciones registradas.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Concepto</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Monto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Observaciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.fecha}</TableCell>
            <TableCell className="font-medium">{transaction.concepto}</TableCell>
            <TableCell>
              <Badge variant={transaction.es_ingreso ? "default" : "outline"}>
                {transaction.es_ingreso ? "Ingreso" : "Gasto"}
              </Badge>
            </TableCell>
            <TableCell className={`text-right font-medium ${
              transaction.es_ingreso ? "text-green-600" : "text-red-600"
            }`}>
              {transaction.es_ingreso ? "+" : "-"}${transaction.monto.toFixed(2)}
            </TableCell>
            <TableCell>
              {transaction.pagado ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Pagado
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Pendiente
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-sm text-gray-600">
              {transaction.observaciones || "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
