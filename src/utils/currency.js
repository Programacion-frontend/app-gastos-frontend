export const DEFAULT_USD_TO_COP = 4000

export function usdToCop(amountUsd, rate = DEFAULT_USD_TO_COP) {
  const usd = Number(amountUsd)
  if (!Number.isFinite(usd)) return 0
  return usd * rate
}

export function copToUsd(amountCop, rate = DEFAULT_USD_TO_COP) {
  const cop = Number(amountCop)
  if (!Number.isFinite(cop) || rate === 0) return 0
  return cop / rate
}

export function convertCurrency(amount, from, to, rate = DEFAULT_USD_TO_COP) {
  const f = String(from).toUpperCase()
  const t = String(to).toUpperCase()
  if (f === t) return Number(amount) || 0
  if (f === 'USD' && t === 'COP') return usdToCop(amount, rate)
  if (f === 'COP' && t === 'USD') return copToUsd(amount, rate)
  throw new Error(`Conversión no soportada: ${from} -> ${to}`)
}

export function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)
}

export function formatUSD(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount) || 0)
}
