import {
  AlertCircle, ArrowDownRight, ArrowUpRight,
  Plus, TrendingDown, TrendingUp, Wallet,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend,
  Pie, PieChart, ResponsiveContainer, Sector,
  Tooltip, XAxis, YAxis,
} from 'recharts'

import { Button, Card, Modal, Table, Tooltip as UiTooltip } from '../components/ui'
import useBalanceStore  from '../store/useBalanceStore'
import useCategoryStore from '../store/useCategoryStore'
import useExpenseStore  from '../store/useExpenseStore'
import { useFetch, useDarkMode } from '../hooks'
import { formatMoney, formatCompact } from '../utils/format'
import { buildComparativo, RANGOS } from '../utils/periods'

const CURRENT_YEAR  = new Date().getFullYear()
const CURRENT_MONTH = new Date().getMonth() + 1
// Ingresos en azul (primario) y gastos en gris neutro.
const CHART_COLORS = {
  light: { ingresos: '#2563eb', gastos: '#64748b' },
  dark:  { ingresos: '#3b82f6', gastos: '#94a3b8' },
}

const PERIODOS = [
  { label: 'Este mes', mes: CURRENT_MONTH, anio: CURRENT_YEAR },
  { label: 'Este año', mes: undefined,     anio: CURRENT_YEAR },
  { label: 'Todo',     mes: undefined,     anio: undefined    },
]

const fmt = formatMoney

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-card dark:bg-gray-800 p-5 animate-pulse">
      <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700 mb-3" />
      <div className="h-7 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
      <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  )
}

function SkeletonChart() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-card dark:bg-gray-800 p-5 animate-pulse">
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
      <div className="h-52 rounded-lg bg-gray-100 dark:bg-gray-700" />
    </div>
  )
}

function StatCard({ label, amount, sub, icon: Icon, trend, colorClass, onClick }) {
  return (
    <Card onClick={onClick}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          {/* Cifra abreviada para no descuadrar la tarjeta; valor completo en el tooltip. */}
          <UiTooltip text={fmt(amount)} position="bottom">
            <p className="mt-1 truncate text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums cursor-default">
              {formatCompact(amount)}
            </p>
          </UiTooltip>
          {sub && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 truncate">{sub}</p>}
        </div>
        <div className={`shrink-0 rounded-xl p-3 ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend !== undefined && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {trend >= 0 ? 'Positivo' : 'Negativo'}
        </div>
      )}
    </Card>
  )
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-surface-card dark:bg-gray-800 px-3 py-2 shadow-lg text-xs">
      {label && <p className="mb-1 font-semibold text-gray-700 dark:text-gray-300">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="flex items-center gap-1">
          <span className="font-medium capitalize">{p.name}:</span>
          <span>{fmt(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { balance, isLoading: loadingBal, isEmpty, fetchBalance } = useBalanceStore()
  const { movimientos, fetchMovimientos } = useExpenseStore()
  const { fetchCategorias } = useCategoryStore()

  const [periodo,   setPeriodo]   = useState(0)
  const [pieIndex,  setPieIndex]  = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [rango,     setRango]     = useState('mensual')

  const isDark   = useDarkMode()
  const navigate = useNavigate()
  const { mes, anio } = PERIODOS[periodo]

  useFetch(
    useCallback(() => fetchBalance({ mes, anio }), [periodo]),
    { fallback: 'Error al cargar el balance', deps: [periodo] }
  )

  useFetch(fetchMovimientos, { fallback: 'Error al cargar los movimientos' })
  useFetch(fetchCategorias)

  const renderActiveShape = useCallback((props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props
    const textColor = isDark ? '#f8fafc' : '#0f172a'
    const subColor  = isDark ? '#94a3b8' : '#64748b'
    return (
      <g>
        <text x={cx} y={cy - 10} textAnchor="middle" fill={textColor} fontSize={13} fontWeight={600} fontFamily="inherit">
          {payload.name}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill={subColor} fontSize={13} fontFamily="inherit">
          {fmt(value)}
        </text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} innerRadius={outerRadius + 10} outerRadius={outerRadius + 14} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      </g>
    )
  }, [isDark])

  const b = balance
  const recientes = [...movimientos].sort((a, z) => new Date(z.fecha) - new Date(a.fecha)).slice(0, 5)

  // Comparativo por rango (diario/semanal/quincenal/mensual) calculado en el
  // cliente a partir de los movimientos ya cargados.
  const comparativo = useMemo(() => buildComparativo(movimientos, rango), [movimientos, rango])
  const comparativoVacio = comparativo.every((d) => d.ingresos === 0 && d.gastos === 0)

  const gridColor   = isDark ? '#334155' : '#e2e8f0'
  const tickColor   = isDark ? '#94a3b8' : '#64748b'
  const cursorFill  = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
  const chartColors = CHART_COLORS[isDark ? 'dark' : 'light']
  const pieColors   = [chartColors.ingresos, chartColors.gastos]

  const recentColumns = [
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (m) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {m.descripcion ?? <span className="italic text-gray-400">Sin descripción</span>}
        </span>
      ),
    },
    {
      key: 'monto',
      label: 'Monto',
      className: 'w-32 whitespace-nowrap',
      render: (m) => {
        const isGasto = m.categoria?.tipo_categoria?.toLowerCase().includes('gasto')
        return (
          <span className="font-bold tabular-nums text-gray-900 dark:text-gray-100">
            {isGasto ? '-' : '+'}{fmt(m.monto)}
          </span>
        )
      },
    },
    {
      key: 'fecha',
      label: 'Fecha',
      className: 'w-36 whitespace-nowrap',
      render: (m) => m.fecha
        ? new Date(m.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
        : '—',
    },
    {
      key: 'moneda',
      label: 'Moneda',
      className: 'w-28 whitespace-nowrap',
      render: (m) => m.moneda
        ? (
          <span className="inline-flex items-center gap-1">
            <span className="font-medium">{m.moneda.simbolo}</span>
            <span className="text-gray-400 dark:text-gray-500 text-xs">{m.moneda.codigo}</span>
          </span>
        )
        : <span className="text-gray-400 dark:text-gray-500">—</span>,
    },
    {
      key: 'categoria',
      label: 'Categoría',
      className: 'w-32 whitespace-nowrap',
      render: (m) => {
        const tipo = m.categoria?.tipo_categoria
        if (!tipo) return <span className="text-gray-400 dark:text-gray-500">—</span>
        const isGasto = tipo.toLowerCase().includes('gasto')
        return (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isGasto
              ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {tipo}
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {b?.filtrosAplicados
              ? `Período: ${b.filtrosAplicados.mes} ${b.filtrosAplicados.anio}`
              : 'Resumen financiero'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
            {PERIODOS.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setPeriodo(i)}
                className={[
                  'px-3 py-1.5 transition-colors',
                  periodo === i
                    ? 'bg-violet-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
                ].join(' ')}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={14} /> Nuevo
          </Button>
        </div>
      </div>

      {loadingBal ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-12 text-center">
          <Wallet className="h-10 w-10 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Sin movimientos en el período seleccionado</p>
        </div>
      ) : b ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Gastos"
            amount={b.totalGastos}
            sub={`${b.estadisticas.cantidadGastos} movimientos · Prom: ${fmt(b.estadisticas.promedioGasto)}`}
            icon={TrendingDown}
            colorClass="bg-gray-100 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400"
            onClick={() => navigate('/dashboard/gastos')}
          />
          <StatCard
            label="Total Ingresos"
            amount={b.totalIngresos}
            sub={`${b.estadisticas.cantidadIngresos} movimientos · Prom: ${fmt(b.estadisticas.promedioIngreso)}`}
            icon={TrendingUp}
            colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            onClick={() => navigate('/dashboard/ingresos')}
          />
          <StatCard
            label="Balance"
            amount={b.balance}
            sub={b.resumen}
            icon={Wallet}
            trend={b.balance}
            colorClass={b.balance >= 0
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400'}
          />
        </div>
      ) : null}

      {loadingBal ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <SkeletonChart /><SkeletonChart />
        </div>
      ) : b && !isEmpty && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <Card.Header>
              <Card.Title>Distribución</Card.Title>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Ingresos</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-gray-500 dark:bg-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Gastos</span>
                </span>
              </div>
            </Card.Header>
            <Card.Body>
              {b.graficas.circular.every(d => d.value === 0) ? (
                <div className="flex h-52 items-center justify-center text-sm text-gray-400">Sin datos</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={b.graficas.circular}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={90}
                      dataKey="value"
                      activeIndex={pieIndex}
                      activeShape={renderActiveShape}
                      onMouseEnter={(_, i) => setPieIndex(i)}
                    >
                      {b.graficas.circular.map((_, i) => (
                        <Cell key={i} fill={pieColors[i]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className="flex-wrap gap-2">
              <Card.Title>Comparativo</Card.Title>
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-xs">
                {RANGOS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRango(r.value)}
                    className={[
                      'px-2.5 py-1 transition-colors',
                      rango === r.value
                        ? 'bg-violet-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
                    ].join(' ')}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </Card.Header>
            <Card.Body>
              {comparativoVacio ? (
                <div className="flex h-52 items-center justify-center text-sm text-gray-400">
                  Sin datos en este rango
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={comparativo} barGap={2} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} tickFormatter={(v) => formatCompact(v)} width={56} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: cursorFill }} />
                    <Legend wrapperStyle={{ fontSize: 12, color: tickColor }} />
                    <Bar dataKey="ingresos" fill={chartColors.ingresos} radius={[3,3,0,0]} name="Ingresos" />
                    <Bar dataKey="gastos"   fill={chartColors.gastos}   radius={[3,3,0,0]} name="Gastos" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </div>
      )}

      <Card>
        <Card.Header>
          <Card.Title>Últimos movimientos</Card.Title>
          {recientes.length > 0 && (
            <Link to="/dashboard/movimientos" className="text-xs text-violet-600 hover:underline dark:text-violet-400">
              Ver todos →
            </Link>
          )}
        </Card.Header>
        <Card.Body>
          {movimientos.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <AlertCircle className="h-8 w-8 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-400 dark:text-gray-500">No hay movimientos registrados aún</p>
              <Button size="sm" onClick={() => setModalOpen(true)}>
                <Plus size={14} /> Nuevo
              </Button>
            </div>
          ) : (
            <Table columns={recentColumns} rows={recientes} rowKey="id_movimiento" emptyMessage="No hay movimientos registrados aún" />
          )}
        </Card.Body>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo movimiento" size="md">
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Usa la página de{' '}
            <Link to="/dashboard/movimientos" className="text-violet-600 hover:underline">Movimientos</Link>{' '}
            para crear registros.
          </p>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  )
}
