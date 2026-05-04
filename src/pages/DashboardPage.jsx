import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  TrendingDown, TrendingUp, Wallet,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis, YAxis,
} from 'recharts'

import { Button, Card, Modal, Table } from '../components/ui'
import useBalanceStore from '../store/useBalanceStore'
import useCategoryStore from '../store/useCategoryStore'
import useExpenseStore from '../store/useExpenseStore'

// ─── Constantes ────────────────────────────────────────────────
const CURRENT_YEAR  = new Date().getFullYear()
const CURRENT_MONTH = new Date().getMonth() + 1
const CHART_COLORS  = { ingresos: '#22c55e', gastos: '#ef4444', balance: '#7c3aed' }
const PIE_COLORS    = [CHART_COLORS.ingresos, CHART_COLORS.gastos]

const PERIODOS = [
  { label: 'Este mes', mes: CURRENT_MONTH, anio: CURRENT_YEAR },
  { label: 'Este año', mes: undefined,     anio: CURRENT_YEAR },
  { label: 'Todo',     mes: undefined,     anio: undefined    },
]

// ─── Helpers ───────────────────────────────────────────────────
const fmt = (n = 0) => `$${Number(n).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// ─── useDarkMode hook ──────────────────────────────────────────
function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )
  useEffect(() => {
    const el = document.documentElement
    const observer = new MutationObserver(() => {
      setIsDark(el.classList.contains('dark'))
    })
    observer.observe(el, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return isDark
}

// ─── Skeleton ──────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 animate-pulse">
      <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700 mb-3" />
      <div className="h-7 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
      <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  )
}
function SkeletonChart() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 animate-pulse">
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
      <div className="h-52 rounded-lg bg-gray-100 dark:bg-gray-700" />
    </div>
  )
}

// ─── Stat card ─────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, trend, colorClass, onClick }) {
  return (
    <Card onClick={onClick}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">{value}</p>
          {sub && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
        </div>
        <div className={`rounded-xl p-3 ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend !== undefined && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
          {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {trend >= 0 ? 'Positivo' : 'Negativo'}
        </div>
      )}
    </Card>
  )
}

// ─── Custom tooltip ────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 shadow-lg text-xs">
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

// ─── Main page ─────────────────────────────────────────────────
export default function DashboardPage() {
  const { balance, isLoading: loadingBal, isEmpty, error: errorBal, fetchBalance } = useBalanceStore()
  const { movimientos, fetchMovimientos } = useExpenseStore()
  const { fetchCategorias } = useCategoryStore()

  const [periodo,   setPeriodo]   = useState(0)
  const [pieIndex,  setPieIndex]  = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const isDark   = useDarkMode()
  const navigate = useNavigate()
  const { mes, anio } = PERIODOS[periodo]

  // ─── Dark-mode-aware pie active shape ─────────────────────────
  const renderActiveShape = useCallback((props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props
    const textColor = isDark ? '#f3f4f6' : '#111827'
    const subColor  = isDark ? '#9ca3af' : '#6b7280'
    return (
      <g>
        <text
          x={cx} y={cy - 10}
          textAnchor="middle"
          fill={textColor}
          fontSize={13}
          fontWeight={600}
          fontFamily="inherit"
        >
          {payload.name}
        </text>
        <text
          x={cx} y={cy + 14}
          textAnchor="middle"
          fill={subColor}
          fontSize={13}
          fontFamily="inherit"
        >
          {fmt(value)}
        </text>
        <Sector
          cx={cx} cy={cy}
          innerRadius={innerRadius} outerRadius={outerRadius + 6}
          startAngle={startAngle} endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx} cy={cy}
          innerRadius={outerRadius + 10} outerRadius={outerRadius + 14}
          startAngle={startAngle} endAngle={endAngle}
          fill={fill}
        />
      </g>
    )
  }, [isDark])

  useEffect(() => { fetchBalance({ mes, anio }) }, [periodo])

  useEffect(() => {
    fetchMovimientos()
    fetchCategorias()
  }, [])

  useEffect(() => {
    if (errorBal) toast.error(errorBal)
  }, [errorBal])

  const b = balance

  const recientes = [...movimientos]
    .sort((a, z) => new Date(z.fecha) - new Date(a.fecha))
    .slice(0, 5)

  // ─── Chart theme values ────────────────────────────────────────
  const gridColor   = isDark ? '#374151' : '#e5e7eb'
  const tickColor   = isDark ? '#9ca3af' : '#6b7280'
  const cursorFill  = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'

  // ─── Últimos movimientos columns (sin acciones) ────────────────
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
          <span className={`font-bold tabular-nums ${isGasto ? 'text-red-500' : 'text-green-500 dark:text-green-400'}`}>
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
              ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
          }`}>
            {tipo}
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
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

      {/* ── Stat cards ─────────────────────────────────────── */}
      {loadingBal ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-12 text-center">
          <Wallet className="h-10 w-10 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sin movimientos en el período seleccionado
          </p>
        </div>
      ) : b ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Gastos"
            value={fmt(b.totalGastos)}
            sub={`${b.estadisticas.cantidadGastos} movimientos · Prom: ${fmt(b.estadisticas.promedioGasto)}`}
            icon={TrendingDown}
            colorClass="bg-red-100 text-red-500 dark:bg-red-900/30"
            onClick={() => navigate('/dashboard/gastos')}
          />
          <StatCard
            label="Total Ingresos"
            value={fmt(b.totalIngresos)}
            sub={`${b.estadisticas.cantidadIngresos} movimientos · Prom: ${fmt(b.estadisticas.promedioIngreso)}`}
            icon={TrendingUp}
            colorClass="bg-green-100 text-green-500 dark:bg-green-900/30"
            onClick={() => navigate('/dashboard/ingresos')}
          />
          <StatCard
            label="Balance"
            value={fmt(b.balance)}
            sub={b.resumen}
            icon={Wallet}
            trend={b.balance}
            colorClass={b.balance >= 0
              ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/30'
              : 'bg-red-100 text-red-500 dark:bg-red-900/30'}
          />
        </div>
      ) : null}

      {/* ── Charts ─────────────────────────────────────────── */}
      {loadingBal ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <SkeletonChart /><SkeletonChart />
        </div>
      ) : b && !isEmpty && (
        <div className="grid gap-4 lg:grid-cols-2">

          {/* Pie: Distribución */}
          <Card>
            <Card.Header>
              <Card.Title>Distribución</Card.Title>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">Ingresos</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
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
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>

          {/* Bar: Comparativo mensual */}
          <Card>
            <Card.Header>
              <Card.Title>Comparativo mensual</Card.Title>
            </Card.Header>
            <Card.Body>
              {!b.graficas.barras?.length ? (
                <div className="flex h-52 items-center justify-center text-sm text-gray-400">Sin datos mensuales</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={b.graficas.barras} barGap={2} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} tickFormatter={(v) => `$${v}`} width={60} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: cursorFill }} />
                    <Legend wrapperStyle={{ fontSize: 12, color: tickColor }} />
                    <Bar dataKey="ingresos" fill={CHART_COLORS.ingresos} radius={[3,3,0,0]} name="Ingresos" />
                    <Bar dataKey="gastos"   fill={CHART_COLORS.gastos}   radius={[3,3,0,0]} name="Gastos" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </div>
      )}

      {/* ── Últimos movimientos ─────────────────────────────── */}
      <Card>
        <Card.Header>
          <Card.Title>Últimos movimientos</Card.Title>
          {recientes.length > 0 && (
            <Link
              to="/dashboard/movimientos"
              className="text-xs text-violet-600 hover:underline dark:text-violet-400"
            >
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
            <Table
              columns={recentColumns}
              rows={recientes}
              rowKey="id_movimiento"
              emptyMessage="No hay movimientos registrados aún"
            />
          )}
        </Card.Body>
      </Card>

      {/* ── Modal placeholder ───────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo movimiento" size="md">
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Usa la página de{' '}
            <Link to="/dashboard/movimientos" className="text-violet-600 hover:underline">
              Movimientos
            </Link>{' '}
            para crear registros.
          </p>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  )
}
