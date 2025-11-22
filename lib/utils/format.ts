/**
 * Data Formatting Utilities
 * Consistent formatting across the application
 */

/**
 * Format currency (Ecuador - USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

/**
 * Format date for display (long format)
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

/**
 * Format date for display (short format)
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("es-EC", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d)
}

/**
 * Format datetime for display
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

/**
 * Format time for matches (HH:MM format)
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
}

/**
 * Format player full name
 */
export function formatPlayerName(
  primerNombre: string,
  segundoNombre: string | null,
  primerApellido: string,
  segundoApellido: string | null
): string {
  const nombres = [primerNombre, segundoNombre].filter(Boolean).join(" ")
  const apellidos = [primerApellido, segundoApellido].filter(Boolean).join(" ")
  return `${nombres} ${apellidos}`
}

/**
 * Format player short name (first name + first last name)
 */
export function formatPlayerShortName(
  primerNombre: string,
  primerApellido: string
): string {
  return `${primerNombre} ${primerApellido}`
}

/**
 * Format match result
 */
export function formatMatchResult(
  goalsTeam1: number,
  goalsTeam2: number
): string {
  return `${goalsTeam1} - ${goalsTeam2}`
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format number with thousands separator
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-EC").format(value)
}

/**
 * Format phone number (Ecuador format)
 */
export function formatPhone(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "")

  // Format: 0999-999-999 or 02-999-9999
  if (cleaned.length === 10) {
    if (cleaned.startsWith("0")) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1-$2-$3")
    }
    return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3")
  }

  return phone // Return original if doesn't match expected length
}

/**
 * Format cedula (Ecuador ID format)
 */
export function formatCedula(cedula: string): string {
  // Remove all non-digits
  const cleaned = cedula.replace(/\D/g, "")

  // Format: 1234567890 -> 123-456-7890
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
  }

  return cedula // Return original if doesn't match expected length
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Format relative time (e.g., "hace 2 horas")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return "hace un momento"
  if (diffMins < 60) return `hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? "s" : ""}`

  return formatDateShort(d)
}
