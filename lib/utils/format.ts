/**
 * Data Formatting Utilities
 * Consistent formatting across the application
 *
 * All formatters use Ecuador locale (es-EC) and standards:
 * - Currency: USD ($)
 * - Date format: Spanish
 * - Phone: Ecuador format (10 digits)
 * - ID: Ecuador cédula format (10 digits)
 */

/**
 * Format currency amount in USD (Ecuador standard)
 *
 * @param amount - Numeric amount to format
 * @returns Formatted currency string (e.g., "$25.50")
 *
 * @example
 * ```ts
 * formatCurrency(25.5) // => "$25.50"
 * formatCurrency(1000) // => "$1,000.00"
 * formatCurrency(0) // => "$0.00"
 * ```
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

/**
 * Format date for display (long format)
 *
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "15 de marzo de 2025")
 *
 * @example
 * ```ts
 * formatDate(new Date("2025-03-15")) // => "15 de marzo de 2025"
 * formatDate("2025-12-25") // => "25 de diciembre de 2025"
 * ```
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
 *
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "15/03/2025")
 *
 * @example
 * ```ts
 * formatDateShort(new Date("2025-03-15")) // => "15/03/2025"
 * formatDateShort("2025-12-25") // => "25/12/2025"
 * ```
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
 * Format datetime for display (date + time)
 *
 * @param date - Date object or ISO string
 * @returns Formatted datetime string (e.g., "15 de marzo de 2025, 14:30")
 *
 * @example
 * ```ts
 * formatDateTime(new Date("2025-03-15T14:30:00"))
 * // => "15 de marzo de 2025, 14:30"
 * ```
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
 *
 * @param date - Date object or ISO string
 * @returns Formatted time string (e.g., "14:30")
 *
 * @example
 * ```ts
 * formatTime(new Date("2025-03-15T14:30:00")) // => "14:30"
 * formatTime("2025-03-15T09:00:00") // => "09:00"
 * ```
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
}

/**
 * Format player full name from Ecuador name structure
 *
 * @param primerNombre - First given name
 * @param segundoNombre - Second given name (optional)
 * @param primerApellido - First surname
 * @param segundoApellido - Second surname (optional)
 * @returns Full name string
 *
 * @example
 * ```ts
 * formatPlayerName("Juan", "Carlos", "Pérez", "García")
 * // => "Juan Carlos Pérez García"
 *
 * formatPlayerName("María", null, "López", null)
 * // => "María López"
 * ```
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
 *
 * @param primerNombre - First given name
 * @param primerApellido - First surname
 * @returns Short name string
 *
 * @example
 * ```ts
 * formatPlayerShortName("Juan", "Pérez") // => "Juan Pérez"
 * ```
 */
export function formatPlayerShortName(
  primerNombre: string,
  primerApellido: string
): string {
  return `${primerNombre} ${primerApellido}`
}

/**
 * Format match result score
 *
 * @param goalsTeam1 - Goals scored by team 1
 * @param goalsTeam2 - Goals scored by team 2
 * @returns Formatted score (e.g., "3 - 1")
 *
 * @example
 * ```ts
 * formatMatchResult(3, 1) // => "3 - 1"
 * formatMatchResult(0, 0) // => "0 - 0"
 * ```
 */
export function formatMatchResult(
  goalsTeam1: number,
  goalsTeam2: number
): string {
  return `${goalsTeam1} - ${goalsTeam2}`
}

/**
 * Format percentage with specified decimal places
 *
 * @param value - Numeric percentage value (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 *
 * @example
 * ```ts
 * formatPercentage(75.5) // => "75.5%"
 * formatPercentage(75.567, 2) // => "75.57%"
 * formatPercentage(100, 0) // => "100%"
 * ```
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format number with thousands separator
 *
 * @param value - Numeric value to format
 * @returns Formatted number string
 *
 * @example
 * ```ts
 * formatNumber(1000) // => "1,000"
 * formatNumber(1234567) // => "1,234,567"
 * formatNumber(42) // => "42"
 * ```
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-EC").format(value)
}

/**
 * Format phone number to Ecuador standard
 *
 * @param phone - Phone number string (with or without formatting)
 * @returns Formatted phone (e.g., "0999-123-456" or "02-123-4567")
 *
 * @example
 * ```ts
 * formatPhone("0999123456") // => "0999-123-456" (mobile)
 * formatPhone("021234567") // => "02-123-4567" (landline)
 * formatPhone("12345") // => "12345" (invalid - returned as-is)
 * ```
 *
 * @note Ecuador phone numbers are 10 digits:
 * - Mobile: starts with 09 (format: 0999-123-456)
 * - Landline: starts with 02-07 (format: 02-123-4567)
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
 * Format Ecuador cédula (national ID) to standard format
 *
 * @param cedula - Cédula number string (with or without formatting)
 * @returns Formatted cédula (e.g., "171-234-5678")
 *
 * @example
 * ```ts
 * formatCedula("1712345678") // => "171-234-5678"
 * formatCedula("171-234-5678") // => "171-234-5678"
 * formatCedula("12345") // => "12345" (invalid - returned as-is)
 * ```
 *
 * @note Ecuador cédulas are exactly 10 digits
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
 * Truncate text with ellipsis if too long
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncating
 * @returns Truncated text with "..." or original if short enough
 *
 * @example
 * ```ts
 * truncate("This is a long text", 10) // => "This is a..."
 * truncate("Short", 10) // => "Short"
 * ```
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Format relative time in Spanish (e.g., "hace 2 horas")
 *
 * @param date - Date object or ISO string
 * @returns Relative time string in Spanish
 *
 * @example
 * ```ts
 * // Assuming current time is 2025-03-15 14:00:00
 * formatRelativeTime("2025-03-15T13:50:00") // => "hace 10 minutos"
 * formatRelativeTime("2025-03-15T12:00:00") // => "hace 2 horas"
 * formatRelativeTime("2025-03-14T14:00:00") // => "hace 1 día"
 * formatRelativeTime("2025-03-01T14:00:00") // => "01/03/2025"
 * ```
 *
 * @note Returns short date format if > 7 days ago
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
