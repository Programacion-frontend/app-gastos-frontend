/**
 * Helpers de formato de números/montos para la UI.
 */

/** Monto completo en pesos: "$1.200.000,00". */
export function formatMoney(n = 0, symbol = '$') {
  return `${symbol}${Number(n).toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Abrevia cifras grandes para que no descuadren las tarjetas/KPIs.
 * Ej: 1_200_000 -> "$1.2M", 350_000 -> "$350K", 4_500_000_000 -> "$4.5B".
 * Para montos pequeños devuelve el valor completo con separador de miles.
 *
 * @param {number} n
 * @param {{ currency?: boolean, symbol?: string }} [opts]
 *   - currency: anteponer el símbolo (por defecto true)
 *   - symbol: símbolo a anteponer, ej. el de la moneda del movimiento (por defecto "$")
 */
export function formatCompact(n, { currency = true, symbol = '$' } = {}) {
  const num = Number(n) || 0
  const sign = num < 0 ? '-' : ''
  const abs = Math.abs(num)
  const prefix = currency ? symbol : ''

  const trim = (v) => {
    // 1 decimal, sin ".0" sobrante
    const s = v.toFixed(1)
    return s.endsWith('.0') ? s.slice(0, -2) : s
  }

  let out
  if (abs >= 1e12) out = `${trim(abs / 1e12)}B`
  else if (abs >= 1e6) out = `${trim(abs / 1e6)}M`
  else if (abs >= 1e3) out = `${trim(abs / 1e3)}K`
  else out = abs.toLocaleString('es-CO')

  return `${sign}${prefix}${out}`
}
