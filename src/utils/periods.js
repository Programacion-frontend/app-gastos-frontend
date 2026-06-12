const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export const RANGOS = [
  { value: 'diario',    label: 'Diario' },
  { value: 'semanal',   label: 'Semanal' },
  { value: 'quincenal', label: 'Quincenal' },
  { value: 'mensual',   label: 'Mensual' },
]

const startOfDay = (d) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

const dd = (d) => String(d.getDate()).padStart(2, '0')

const parseFecha = (f) => {
  if (f instanceof Date) return startOfDay(f)
  const m = String(f).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return startOfDay(new Date(f))
}

function bucketsFor(rango, now = new Date()) {
  const today = startOfDay(now)
  const buckets = []

  if (rango === 'diario') {
    for (let i = 13; i >= 0; i--) {
      const start = new Date(today); start.setDate(today.getDate() - i)
      const end = new Date(start); end.setDate(start.getDate() + 1)
      buckets.push({ start, end, name: `${dd(start)} ${MESES[start.getMonth()]}` })
    }
  } else if (rango === 'semanal') {
    const dow = (today.getDay() + 6) % 7
    const thisMonday = new Date(today); thisMonday.setDate(today.getDate() - dow)
    for (let i = 7; i >= 0; i--) {
      const start = new Date(thisMonday); start.setDate(thisMonday.getDate() - i * 7)
      const end = new Date(start); end.setDate(start.getDate() + 7)
      buckets.push({ start, end, name: `${dd(start)} ${MESES[start.getMonth()]}` })
    }
  } else if (rango === 'quincenal') {
    for (let m = 3; m >= 0; m--) {
      const ref = new Date(today.getFullYear(), today.getMonth() - m, 1)
      const y = ref.getFullYear(), mo = ref.getMonth()
      buckets.push({ start: new Date(y, mo, 1),  end: new Date(y, mo, 16),    name: `1-15 ${MESES[mo]}` })
      buckets.push({ start: new Date(y, mo, 16), end: new Date(y, mo + 1, 1), name: `16+ ${MESES[mo]}` })
    }
  } else {
    for (let m = 5; m >= 0; m--) {
      const ref = new Date(today.getFullYear(), today.getMonth() - m, 1)
      buckets.push({
        start: new Date(ref.getFullYear(), ref.getMonth(), 1),
        end:   new Date(ref.getFullYear(), ref.getMonth() + 1, 1),
        name:  MESES[ref.getMonth()],
      })
    }
  }

  return buckets
}

export function buildComparativo(movimientos = [], rango = 'mensual', now = new Date()) {
  const buckets = bucketsFor(rango, now).map((b) => ({ ...b, ingresos: 0, gastos: 0 }))

  for (const mov of movimientos) {
    if (!mov?.fecha) continue
    const f = parseFecha(mov.fecha)
    const bucket = buckets.find((b) => f >= b.start && f < b.end)
    if (!bucket) continue

    const monto = Number(mov.monto) || 0
    const tipo = mov.categoria?.tipo_categoria?.toLowerCase()
    if (tipo === 'gasto') bucket.gastos += monto
    else if (tipo === 'ingreso') bucket.ingresos += monto
  }

  return buckets.map(({ name, ingresos, gastos }) => ({ name, ingresos, gastos }))
}
