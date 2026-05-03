import { useEffect, useState } from 'react'
import { Plus, AlertCircle, TrendingDown, Wallet, Hash, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

import useExpenseStore   from '../store/useExpenseStore'
import useCategoryStore  from '../store/useCategoryStore'
import { Card, Badge, Button, Modal, Spinner } from '../components/ui'

// Colores por tipo_categoria (se asigna dinámicamente por índice si no hay match)
const PALETTE = ['violet', 'green', 'blue', 'yellow', 'red', 'orange', 'pink', 'gray']
const categoryColor = (() => {
  const cache = {}
  let idx = 0
  return (tipo) => {
    if (!cache[tipo]) cache[tipo] = PALETTE[idx++ % PALETTE.length]
    return cache[tipo]
  }
})()

// ── Skeleton card ────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}

// ── Stat card ────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, colorClass }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  )
}

// ── Movimiento card ──────────────────────────────────────────
// Entidad real: { id_movimiento, monto, fecha, descripcion?, categoria: { id_categoria, tipo_categoria }, moneda?, tags? }
function MovimientoCard({ movimiento }) {
  const tipo  = movimiento.categoria?.tipo_categoria ?? 'Sin categoría'
  const color = categoryColor(tipo)
  const monto = Number(movimiento.monto ?? 0)
  const fecha = movimiento.fecha

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-900 dark:text-gray-100">
            {movimiento.descripcion ?? 'Sin descripción'}
          </p>
          {movimiento.tags?.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {movimiento.tags.map((tag) => (
                <span
                  key={tag.id_tag}
                  className="inline-flex items-center gap-0.5 text-xs text-gray-400 dark:text-gray-500"
                >
                  <Hash size={10} />
                  {tag.nombre}
                </span>
              ))}
            </div>
          )}
        </div>
        <Badge label={tipo} color={color} className="shrink-0" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <Calendar size={12} />
          {fecha
            ? new Date(fecha).toLocaleDateString('es-CO', {
                day: '2-digit', month: 'short', year: 'numeric',
              })
            : '—'}
        </div>
        <div className="text-right">
          <span className="text-base font-bold text-red-500">
            -{movimiento.moneda?.simbolo ?? '$'}{monto.toFixed(2)}
          </span>
          {movimiento.moneda && (
            <p className="text-xs text-gray-400">{movimiento.moneda.codigo}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

// ── Main page ────────────────────────────────────────────────
export default function DashboardPage() {
  const { movimientos, isLoading, error, fetchGastos } = useExpenseStore()
  const { categorias, fetchCategorias } = useCategoryStore()
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchGastos()
    fetchCategorias()
  }, [])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const total = movimientos.reduce((a, m) => a + Number(m.monto ?? 0), 0)

  const thisMonth = movimientos
    .filter((m) => {
      const d = new Date(m.fecha)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((a, m) => a + Number(m.monto ?? 0), 0)

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Nuevo gasto
        </Button>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total registrado"
          value={`$${total.toFixed(2)}`}
          icon={TrendingDown}
          colorClass="bg-red-100 text-red-500 dark:bg-red-900/30"
        />
        <StatCard
          label="Este mes"
          value={`$${thisMonth.toFixed(2)}`}
          icon={Wallet}
          colorClass="bg-violet-100 text-violet-500 dark:bg-violet-900/30"
        />
        <StatCard
          label="Movimientos"
          value={movimientos.length}
          icon={Hash}
          colorClass="bg-green-100 text-green-500 dark:bg-green-900/30"
        />
      </div>

      {/* Movimientos list */}
      <Card>
        <Card.Header>
          <Card.Title>Gastos registrados</Card.Title>
          {movimientos.length > 0 && (
            <span className="text-xs text-gray-400">{movimientos.length} registros</span>
          )}
        </Card.Header>
        <Card.Body>
          {isLoading && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <AlertCircle className="h-10 w-10 text-red-400" />
              <p className="font-medium text-gray-700 dark:text-gray-300">
                No se pudieron cargar los gastos
              </p>
              <Button variant="secondary" size="sm" onClick={fetchGastos}>
                Reintentar
              </Button>
            </div>
          )}

          {!isLoading && !error && movimientos.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Wallet className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="font-medium text-gray-600 dark:text-gray-400">
                Aún no tienes gastos registrados
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Agrega tu primer gasto para empezar a controlar tus finanzas.
              </p>
              <Button size="sm" onClick={() => setModalOpen(true)}>
                <Plus size={14} /> Agregar primer gasto
              </Button>
            </div>
          )}

          {!isLoading && !error && movimientos.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {movimientos.map((m) => (
                <MovimientoCard key={m.id_movimiento} movimiento={m} />
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal: Nuevo movimiento */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Agregar nuevo gasto"
      >
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <Spinner size="md" className="text-violet-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {categorias.length === 0
              ? 'Cargando categorías...'
              : 'Formulario completo disponible en la siguiente fase.'}
          </p>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cerrar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
