/**
 * Utilidad sencilla para convertir entre USD (dólar) y COP (peso colombiano).
 *
 * La tasa por defecto es aproximada; puedes pasar una tasa distinta (p. ej.
 * traída del backend / API de cambio) como segundo argumento en cada función.
 *
 * @example
 *   usdToCop(10)            // 40000  (con la tasa por defecto)
 *   copToUsd(40000)         // 10
 *   formatCOP(40000)        // "$ 40.000"
 *   formatUSD(10)           // "US$ 10.00"
 */

/** Pesos colombianos por 1 dólar (tasa aproximada por defecto). */
export const DEFAULT_USD_TO_COP = 4000

/** Convierte un monto en USD a COP. */
export function usdToCop(amountUsd, rate = DEFAULT_USD_TO_COP) {
  const usd = Number(amountUsd)
  if (!Number.isFinite(usd)) return 0
  return usd * rate
}

/** Convierte un monto en COP a USD. */
export function copToUsd(amountCop, rate = DEFAULT_USD_TO_COP) {
  const cop = Number(amountCop)
  if (!Number.isFinite(cop) || rate === 0) return 0
  return cop / rate
}

/**
 * Convierte entre las dos monedas según `from` -> `to`.
 * @param {number} amount
 * @param {'USD'|'COP'} from
 * @param {'USD'|'COP'} to
 * @param {number} [rate] - pesos por dólar
 */
export function convertCurrency(amount, from, to, rate = DEFAULT_USD_TO_COP) {
  const f = String(from).toUpperCase()
  const t = String(to).toUpperCase()
  if (f === t) return Number(amount) || 0
  if (f === 'USD' && t === 'COP') return usdToCop(amount, rate)
  if (f === 'COP' && t === 'USD') return copToUsd(amount, rate)
  throw new Error(`Conversión no soportada: ${from} -> ${to}`)
}

/** Formatea un monto como pesos colombianos (sin decimales). */
export function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)
}

/** Formatea un monto como dólares estadounidenses (2 decimales). */
export function formatUSD(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount) || 0)
}
