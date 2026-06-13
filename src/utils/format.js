export function formatMoney(n = 0, symbol = '$') {
  return `${symbol}${Number(n).toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatCompact(n, { currency = true, symbol = '$' } = {}) {
  const num = Number(n) || 0
  const sign = num < 0 ? '-' : ''
  const abs = Math.abs(num)
  const prefix = currency ? symbol : ''

  const trim = (v) => {
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
