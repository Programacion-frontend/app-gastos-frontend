import { useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

import useExpenseStore  from '../store/useExpenseStore'
import useCategoryStore from '../store/useCategoryStore'
import { Card, Button, Spinner, Table, Tooltip } from '../components/ui'
import MovimientoModals from '../components/MovimientoModals'
import { useFetch, useMovimientoCrud } from '../hooks'
import { formatMoney, formatCompact } from '../utils/format'

export default function GastosPage() {
  const { movimientos, isLoading, fetchGastos } = useExpenseStore()
  const { categorias, fetchCategorias } = useCategoryStore()

  const crud = useMovimientoCrud({ label: 'gasto' })
  const { openCreate, openEdit, openDelete } = crud

  const [search, setSearch] = useState('')

  useFetch(fetchGastos, { fallback: 'Error al cargar los gastos' })
  useFetch(fetchCategorias)

  const rows = movimientos.filter((m) =>
    !search.trim() ||
    (m.descripcion ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const total = rows.reduce((s, m) => s + Number(m.monto), 0)

  const columns = [
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
      render: (m) => (
        <span className="font-bold tabular-nums text-gray-900 dark:text-gray-100">
          -{formatMoney(m.monto)}
        </span>
      ),
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
        return (
          <span className="inline-flex rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
            {tipo}
          </span>
        )
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      className: 'w-20 text-center',
      render: (m) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip text="Editar" position="top">
            <button
              onClick={() => openEdit(m)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/30 dark:hover:text-violet-400 transition-colors"
            >
              <Pencil size={15} />
            </button>
          </Tooltip>
          <Tooltip text="Eliminar" position="top">
            <button
              onClick={() => openDelete(m)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestión de Gastos</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {rows.length} {rows.length === 1 ? 'registro' : 'registros'}
            {search && ` · Filtrando por "${search}"`}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Nuevo gasto
        </Button>
      </div>

      <Card className="mb-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descripción..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-9 pr-4 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" className="text-violet-600" />
          </div>
        ) : (
          <Table
            columns={columns}
            rows={rows}
            rowKey="id_movimiento"
            emptyMessage={search ? `Sin resultados para "${search}"` : 'No hay gastos registrados. ¡Agrega tu primer gasto!'}
          />
        )}
      </Card>

      {rows.length > 0 && (
        <div className="mt-3 flex justify-end">
          <div className="flex min-w-0 items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2">
            <span className="shrink-0 text-sm text-gray-600 dark:text-gray-400">Total:</span>
            {/* Cifra abreviada para no descuadrar la tarjeta; valor completo en el tooltip. */}
            <Tooltip text={`-${formatMoney(total)}`} position="top">
              <span className="max-w-[10rem] truncate text-base font-bold text-gray-900 dark:text-gray-100 tabular-nums cursor-default">
                -{formatCompact(total)}
              </span>
            </Tooltip>
          </div>
        </div>
      )}

      <MovimientoModals tipo="gasto" label="gasto" categorias={categorias} crud={crud} />
    </div>
  )
}
