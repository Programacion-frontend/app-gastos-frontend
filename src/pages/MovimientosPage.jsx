import { useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search, AlertCircle, SlidersHorizontal } from 'lucide-react'

import useExpenseStore  from '../store/useExpenseStore'
import useCategoryStore from '../store/useCategoryStore'
import { Card, Badge, Button, Tooltip } from '../components/ui'
import MovimientoModals from '../components/MovimientoModals'
import { useFetch, useMovimientoCrud, useErrorToast } from '../hooks'
import { formatMoney, formatCompact } from '../utils/format'

const PALETTE = ['violet', 'green', 'blue', 'yellow', 'red', 'orange', 'pink', 'gray']
const colorCache = {}
let colorIdx = 0
const categoryColor = (tipo) => {
  if (!colorCache[tipo]) colorCache[tipo] = PALETTE[colorIdx++ % PALETTE.length]
  return colorCache[tipo]
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  )
}

function MovimientoCard({ movimiento, onEdit, onDelete }) {
  const tipo    = movimiento.categoria?.tipo_categoria ?? 'Sin categoría'
  const color   = categoryColor(tipo)
  const monto   = Number(movimiento.monto ?? 0)
  const isGasto = tipo.toLowerCase().includes('gasto')
  const simbolo = movimiento.moneda?.simbolo ?? '$'

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-gray-900 dark:text-gray-100">
          {movimiento.descripcion ?? 'Sin descripción'}
        </p>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
          {movimiento.fecha
            ? new Date(movimiento.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—'}
        </p>
      </div>
      <Badge label={tipo} color={color} className="hidden sm:inline-flex shrink-0" />
      {/* Cifra abreviada para no descuadrar la tarjeta; valor completo en el tooltip. */}
      <Tooltip text={`${isGasto ? '-' : '+'}${formatMoney(monto, simbolo)}`} position="top">
        <span className={`max-w-[7rem] truncate text-base font-bold shrink-0 cursor-default ${isGasto ? 'text-red-500' : 'text-green-500'}`}>
          {isGasto ? '-' : '+'}{formatCompact(monto, { symbol: simbolo })}
        </span>
      </Tooltip>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(movimiento)}
          aria-label="Editar"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(movimiento)}
          aria-label="Eliminar"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}

export default function MovimientosPage() {
  const { movimientos, isLoading, fetchMovimientos } = useExpenseStore()
  const { categorias, fetchCategorias } = useCategoryStore()

  const errorToast = useErrorToast()
  const crud = useMovimientoCrud({ label: 'movimiento' })
  const { openCreate, openEdit, openDelete } = crud

  const [loadError,   setLoadError]   = useState(false)
  const [termino,     setTermino]     = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin,    setFechaFin]    = useState('')

  useFetch(
    useCallback(() => {
      setLoadError(false)
      return fetchMovimientos().catch((err) => { setLoadError(true); throw err })
    }, [fetchMovimientos]),
    { fallback: 'Error al cargar los movimientos' }
  )
  useFetch(fetchCategorias)

  const load = useCallback((params = {}) => {
    setLoadError(false)
    fetchMovimientos(params).catch((err) => {
      errorToast(err, 'Error al cargar los movimientos')
      setLoadError(true)
    })
  }, [fetchMovimientos, errorToast])

  const applyFilters = () => {
    const params = {}
    if (termino.trim()) params.termino    = termino.trim()
    if (fechaInicio)    params.fechaInicio = fechaInicio
    if (fechaFin)       params.fechaFin    = fechaFin
    load(params)
  }

  const clearFilters = () => {
    setTermino(''); setFechaInicio(''); setFechaFin('')
    load()
  }

  const total = movimientos.reduce((a, m) => a + Number(m.monto ?? 0), 0)

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Movimientos</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Todos tus ingresos y gastos en un solo lugar
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Nuevo movimiento
        </Button>
      </div>

      <Card className="mb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Buscar descripción</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={termino}
                onChange={(e) => setTermino(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                placeholder="Buscar..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-8 pr-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Desde</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Hasta</label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-gray-900 dark:text-gray-100" />
          </div>
          <div className="flex gap-2">
            <Button onClick={applyFilters} size="sm"><SlidersHorizontal size={14} /> Filtrar</Button>
            <Button onClick={clearFilters} size="sm" variant="secondary">Limpiar</Button>
          </div>
        </div>
      </Card>

      {movimientos.length > 0 && (
        <div className="mb-4 flex min-w-0 items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="shrink-0">{movimientos.length} movimientos encontrados</span>
          {/* Cifra abreviada para no descuadrar; valor completo en el tooltip. */}
          <Tooltip text={`Total: ${formatMoney(total)}`} position="top">
            <span className="max-w-[10rem] truncate font-medium text-gray-900 dark:text-gray-100 cursor-default">
              Total: {formatCompact(total)}
            </span>
          </Tooltip>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {!isLoading && loadError && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="font-medium text-gray-700 dark:text-gray-300">No se pudieron cargar los movimientos</p>
          <Button variant="secondary" size="sm" onClick={() => load()}>Reintentar</Button>
        </div>
      )}

      {!isLoading && !loadError && movimientos.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <SlidersHorizontal className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="font-medium text-gray-600 dark:text-gray-400">No hay movimientos registrados</p>
          <Button size="sm" onClick={openCreate}><Plus size={14} /> Crear primer movimiento</Button>
        </div>
      )}

      {!isLoading && !loadError && movimientos.length > 0 && (
        <div className="space-y-2">
          {movimientos.map((m) => (
            <MovimientoCard key={m.id_movimiento} movimiento={m} onEdit={openEdit} onDelete={openDelete} />
          ))}
        </div>
      )}

      <MovimientoModals label="movimiento" categorias={categorias} crud={crud} />
    </div>
  )
}
