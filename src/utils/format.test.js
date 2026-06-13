import { describe, it, expect } from 'vitest'
import { formatMoney, formatCompact } from './format'

describe('formatMoney', () => {
  it('formats zero with two decimals and the default symbol', () => {
    expect(formatMoney(0)).toBe('$0,00')
  })

  it('formats decimals using es-CO locale', () => {
    expect(formatMoney(1234.5)).toBe('$1.234,50')
  })

  it('supports a custom symbol', () => {
    expect(formatMoney(10, '€')).toBe('€10,00')
  })
})

describe('formatCompact', () => {
  it('formats small numbers without a suffix', () => {
    expect(formatCompact(500)).toBe('$500')
  })

  it('formats thousands with a K suffix', () => {
    expect(formatCompact(1500)).toBe('$1.5K')
  })

  it('formats millions with an M suffix', () => {
    expect(formatCompact(2500000)).toBe('$2.5M')
  })

  it('formats billions with a B suffix', () => {
    expect(formatCompact(3000000000000)).toBe('$3B')
  })

  it('formats negative numbers with a leading minus sign', () => {
    expect(formatCompact(-1500)).toBe('-$1.5K')
  })

  it('omits the currency symbol when currency is false', () => {
    expect(formatCompact(1500, { currency: false })).toBe('1.5K')
  })
})
