/**
 * Debt Calculation Utilities
 * Business rules for financial transactions and team debts
 */

export interface Transaction {
  monto: number
  es_ingreso: boolean // true = payment (reduces debt), false = fee (increases debt)
  pagado: boolean // true = completed, false = pending
}

/**
 * Calculate total debt for a team
 * Debt = unpaid fees - unpaid payments
 */
export function calculateTotalDebt(transacciones: Transaction[]): number {
  return transacciones
    .filter((t) => !t.pagado)
    .reduce((total, t) => {
      // es_ingreso = payment (negative), not es_ingreso = fee (positive)
      return total + (t.es_ingreso ? -t.monto : t.monto)
    }, 0)
}

/**
 * Calculate paid vs pending breakdown
 */
export function calculateDebtBreakdown(transacciones: Transaction[]) {
  const paid = transacciones
    .filter((t) => t.pagado)
    .reduce((sum, t) => sum + t.monto, 0)

  const pending = transacciones
    .filter((t) => !t.pagado)
    .reduce((sum, t) => sum + t.monto, 0)

  const total = paid + pending
  const percentagePaid = total > 0 ? (paid / total) * 100 : 0

  return {
    paid,
    pending,
    total,
    percentagePaid,
  }
}

/**
 * Check if team has outstanding debt
 */
export function hasDebt(transacciones: Transaction[]): boolean {
  return calculateTotalDebt(transacciones) > 0
}

/**
 * Calculate total fees (all gastos)
 */
export function calculateTotalFees(transacciones: Transaction[]): number {
  return transacciones
    .filter((t) => !t.es_ingreso)
    .reduce((sum, t) => sum + t.monto, 0)
}

/**
 * Calculate total payments (all ingresos)
 */
export function calculateTotalPayments(transacciones: Transaction[]): number {
  return transacciones
    .filter((t) => t.es_ingreso)
    .reduce((sum, t) => sum + t.monto, 0)
}

/**
 * Get payment status color
 */
export function getPaymentStatusColor(
  paid: number,
  total: number
): "green" | "yellow" | "red" {
  if (total === 0) return "green"

  const percentage = (paid / total) * 100

  if (percentage >= 100) return "green"
  if (percentage >= 50) return "yellow"
  return "red"
}

/**
 * Get debt priority level
 */
export function getDebtPriority(
  debt: number
): "low" | "medium" | "high" | "critical" {
  if (debt <= 0) return "low"
  if (debt <= 50) return "medium"
  if (debt <= 200) return "high"
  return "critical"
}

/**
 * Calculate payment deadline status
 */
export function getPaymentStatus(
  fechaVencimiento: Date | string | null,
  pagado: boolean
): "completed" | "pending" | "overdue" {
  if (pagado) return "completed"

  if (!fechaVencimiento) return "pending"

  const vencimiento =
    typeof fechaVencimiento === "string"
      ? new Date(fechaVencimiento)
      : fechaVencimiento
  const now = new Date()

  return vencimiento < now ? "overdue" : "pending"
}

/**
 * Sort transactions by date (most recent first)
 */
export function sortTransactionsByDate(
  transacciones: (Transaction & { fecha: Date | string })[]
): typeof transacciones {
  return [...transacciones].sort((a, b) => {
    const dateA = typeof a.fecha === "string" ? new Date(a.fecha) : a.fecha
    const dateB = typeof b.fecha === "string" ? new Date(b.fecha) : b.fecha
    return dateB.getTime() - dateA.getTime()
  })
}

/**
 * Filter transactions by date range
 */
export function filterTransactionsByDateRange(
  transacciones: (Transaction & { fecha: Date | string })[],
  startDate: Date,
  endDate: Date
): typeof transacciones {
  return transacciones.filter((t) => {
    const fecha = typeof t.fecha === "string" ? new Date(t.fecha) : t.fecha
    return fecha >= startDate && fecha <= endDate
  })
}

/**
 * Get financial summary text
 */
export function getFinancialSummary(transacciones: Transaction[]): string {
  const { paid, pending, total, percentagePaid } =
    calculateDebtBreakdown(transacciones)
  return `Total: $${total.toFixed(2)} | Pagado: $${paid.toFixed(2)} (${percentagePaid.toFixed(1)}%) | Pendiente: $${pending.toFixed(2)}`
}
