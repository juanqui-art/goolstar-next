/**
 * Debt Calculation Utilities
 * Business rules for financial transactions and team debts
 *
 * Financial model:
 * - Fees (gastos): Tournament inscription, fines, referee payments
 * - Payments (ingresos): Team payments reducing their debt
 * - Team debt = Total unpaid fees
 */

/**
 * Transaction data structure
 */
export interface Transaction {
  /** Amount in USD */
  monto: number;
  /** true = payment (reduces debt), false = fee (increases debt) */
  es_ingreso: boolean;
  /** true = completed, false = pending */
  pagado: boolean;
}

/**
 * Calculate total outstanding debt for a team
 *
 * @param transacciones - Array of team transactions
 * @returns Total debt amount (positive = owes money, 0 or negative = overpaid)
 *
 * @example
 * ```ts
 * const transactions = [
 *   { monto: 100, es_ingreso: false, pagado: false }, // Fee: $100 pending
 *   { monto: 50, es_ingreso: true, pagado: false },   // Payment: $50 pending
 * ]
 * calculateTotalDebt(transactions) // => $50 (owes $50 net)
 * ```
 *
 * @note Only includes unpaid (pagado: false) transactions
 */
export function calculateTotalDebt(transacciones: Transaction[]): number {
  return transacciones
    .filter((t) => !t.pagado)
    .reduce((total, t) => {
      // es_ingreso = payment (negative), not es_ingreso = fee (positive)
      return total + (t.es_ingreso ? -t.monto : t.monto);
    }, 0);
}

/**
 * Calculate paid vs pending breakdown with percentage
 *
 * @param transacciones - Array of team transactions
 * @returns Breakdown object with paid, pending, total amounts and percentage paid
 *
 * @example
 * ```ts
 * const transactions = [
 *   { monto: 100, es_ingreso: false, pagado: true },  // Fee: $100 paid
 *   { monto: 50, es_ingreso: false, pagado: false },  // Fee: $50 pending
 * ]
 * calculateDebtBreakdown(transactions)
 * // => { paid: 100, pending: 50, total: 150, percentagePaid: 66.7 }
 * ```
 */
export function calculateDebtBreakdown(transacciones: Transaction[]) {
  const paid = transacciones
    .filter((t) => t.pagado)
    .reduce((sum, t) => sum + t.monto, 0);

  const pending = transacciones
    .filter((t) => !t.pagado)
    .reduce((sum, t) => sum + t.monto, 0);

  const total = paid + pending;
  const percentagePaid = total > 0 ? (paid / total) * 100 : 0;

  return {
    paid,
    pending,
    total,
    percentagePaid,
  };
}

/**
 * Check if team has outstanding debt
 *
 * @param transacciones - Array of team transactions
 * @returns True if team owes money
 *
 * @example
 * ```ts
 * const withDebt = [{ monto: 100, es_ingreso: false, pagado: false }]
 * hasDebt(withDebt) // => true
 *
 * const noDebt = [{ monto: 100, es_ingreso: false, pagado: true }]
 * hasDebt(noDebt) // => false
 * ```
 */
export function hasDebt(transacciones: Transaction[]): boolean {
  return calculateTotalDebt(transacciones) > 0;
}

/**
 * Calculate total fees (all gastos)
 *
 * @param transacciones - Array of team transactions
 * @returns Sum of all fees regardless of payment status
 *
 * @example
 * ```ts
 * const transactions = [
 *   { monto: 100, es_ingreso: false, pagado: true },
 *   { monto: 50, es_ingreso: false, pagado: false },
 *   { monto: 30, es_ingreso: true, pagado: true }, // Payment - not counted
 * ]
 * calculateTotalFees(transactions) // => $150
 * ```
 */
export function calculateTotalFees(transacciones: Transaction[]): number {
  return transacciones
    .filter((t) => !t.es_ingreso)
    .reduce((sum, t) => sum + t.monto, 0);
}

/**
 * Calculate total payments (all ingresos)
 *
 * @param transacciones - Array of team transactions
 * @returns Sum of all payments regardless of payment status
 *
 * @example
 * ```ts
 * const transactions = [
 *   { monto: 100, es_ingreso: true, pagado: true },
 *   { monto: 50, es_ingreso: true, pagado: false },
 *   { monto: 30, es_ingreso: false, pagado: true }, // Fee - not counted
 * ]
 * calculateTotalPayments(transactions) // => $150
 * ```
 */
export function calculateTotalPayments(transacciones: Transaction[]): number {
  return transacciones
    .filter((t) => t.es_ingreso)
    .reduce((sum, t) => sum + t.monto, 0);
}

/**
 * Get UI color indicator for payment status
 *
 * @param paid - Amount paid
 * @param total - Total amount owed
 * @returns Color indicator: "green" (100%+), "yellow" (50-99%), "red" (<50%)
 *
 * @example
 * ```ts
 * getPaymentStatusColor(100, 100) // => "green" (fully paid)
 * getPaymentStatusColor(75, 100) // => "yellow" (75% paid)
 * getPaymentStatusColor(25, 100) // => "red" (25% paid)
 * getPaymentStatusColor(0, 0) // => "green" (no debt)
 * ```
 */
export function getPaymentStatusColor(
  paid: number,
  total: number,
): "green" | "yellow" | "red" {
  if (total === 0) return "green";

  const percentage = (paid / total) * 100;

  if (percentage >= 100) return "green";
  if (percentage >= 50) return "yellow";
  return "red";
}

/**
 * Get debt priority level for admin alerts
 *
 * @param debt - Total outstanding debt amount
 * @returns Priority level based on amount
 *
 * @example
 * ```ts
 * getDebtPriority(0) // => "low" (no debt)
 * getDebtPriority(40) // => "medium" ($1-50)
 * getDebtPriority(150) // => "high" ($51-200)
 * getDebtPriority(300) // => "critical" ($200+)
 * ```
 *
 * @note Thresholds in USD:
 * - low: $0
 * - medium: $1-50
 * - high: $51-200
 * - critical: $200+
 */
export function getDebtPriority(
  debt: number,
): "low" | "medium" | "high" | "critical" {
  if (debt <= 0) return "low";
  if (debt <= 50) return "medium";
  if (debt <= 200) return "high";
  return "critical";
}

/**
 * Calculate payment deadline status
 *
 * @param fechaVencimiento - Due date (null if no deadline)
 * @param pagado - Whether payment is completed
 * @returns Status: "completed", "pending", or "overdue"
 *
 * @example
 * ```ts
 * getPaymentStatus(null, false) // => "pending" (no deadline)
 * getPaymentStatus("2025-01-01", true) // => "completed" (paid)
 * getPaymentStatus("2025-01-01", false) // => "overdue" (if past 2025-01-01)
 * getPaymentStatus("2099-12-31", false) // => "pending" (future deadline)
 * ```
 */
export function getPaymentStatus(
  fechaVencimiento: Date | string | null,
  pagado: boolean,
): "completed" | "pending" | "overdue" {
  if (pagado) return "completed";

  if (!fechaVencimiento) return "pending";

  const vencimiento =
    typeof fechaVencimiento === "string"
      ? new Date(fechaVencimiento)
      : fechaVencimiento;
  const now = new Date();

  return vencimiento < now ? "overdue" : "pending";
}

/**
 * Sort transactions by date (most recent first)
 *
 * @param transacciones - Array of transactions with fecha field
 * @returns Sorted copy of transactions (descending order)
 *
 * @example
 * ```ts
 * const transactions = [
 *   { monto: 100, fecha: "2025-01-01", ... },
 *   { monto: 50, fecha: "2025-03-15", ... },
 * ]
 * sortTransactionsByDate(transactions)
 * // => [{ fecha: "2025-03-15", ... }, { fecha: "2025-01-01", ... }]
 * ```
 */
export function sortTransactionsByDate(
  transacciones: (Transaction & { fecha: Date | string })[],
): typeof transacciones {
  return [...transacciones].sort((a, b) => {
    const dateA = typeof a.fecha === "string" ? new Date(a.fecha) : a.fecha;
    const dateB = typeof b.fecha === "string" ? new Date(b.fecha) : b.fecha;
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Filter transactions by date range (inclusive)
 *
 * @param transacciones - Array of transactions with fecha field
 * @param startDate - Start of date range (inclusive)
 * @param endDate - End of date range (inclusive)
 * @returns Filtered array of transactions
 *
 * @example
 * ```ts
 * const transactions = [
 *   { monto: 100, fecha: "2025-01-15", ... },
 *   { monto: 50, fecha: "2025-02-20", ... },
 *   { monto: 75, fecha: "2025-03-10", ... },
 * ]
 * filterTransactionsByDateRange(
 *   transactions,
 *   new Date("2025-02-01"),
 *   new Date("2025-02-28")
 * )
 * // => [{ fecha: "2025-02-20", ... }]
 * ```
 */
export function filterTransactionsByDateRange(
  transacciones: (Transaction & { fecha: Date | string })[],
  startDate: Date,
  endDate: Date,
): typeof transacciones {
  return transacciones.filter((t) => {
    const fecha = typeof t.fecha === "string" ? new Date(t.fecha) : t.fecha;
    return fecha >= startDate && fecha <= endDate;
  });
}

/**
 * Get financial summary text (compact format)
 *
 * @param transacciones - Array of team transactions
 * @returns Formatted summary string
 *
 * @example
 * ```ts
 * const transactions = [
 *   { monto: 150, es_ingreso: false, pagado: true },
 *   { monto: 50, es_ingreso: false, pagado: false },
 * ]
 * getFinancialSummary(transactions)
 * // => "Total: $200.00 | Pagado: $150.00 (75.0%) | Pendiente: $50.00"
 * ```
 */
export function getFinancialSummary(transacciones: Transaction[]): string {
  const { paid, pending, total, percentagePaid } =
    calculateDebtBreakdown(transacciones);
  return `Total: $${total.toFixed(2)} | Pagado: $${paid.toFixed(2)} (${percentagePaid.toFixed(1)}%) | Pendiente: $${pending.toFixed(2)}`;
}
