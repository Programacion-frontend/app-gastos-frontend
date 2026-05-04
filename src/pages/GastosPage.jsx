import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'

import useExpenseStore   from '../store/useExpenseStore'
import useCategoryStore  from '../store/useCategoryStore'
import { Card, Button, Modal, Spinner, Table, Tooltip } from '../components/ui'
import MovimientoForm    from '../components/MovimientoForm'

// ── Confirm delete ──────────────────────────────────────────
function DeleteConfirm({ movimiento, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        ¿Eliminar el gasto{' '}
        <strong className="text-gray-900 dark:text-gray-100">
          "{movimiento?.descripcion ?? 'sin descripción'}"
        </strong>
        ? Esta acción no se puede deshacer.
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isDeleting} disabled={isDeleting}>
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────
export default function GastosPage() {
  const {
    movimientos, isLoading, error,
    fetchGastos, createMovimiento, updateMovimiento, deleteMovimiento,
  } = useExpenseStore()

  const { categorias, fetchCategorias } = useCategoryStore()

  const [modalMode,  setModalMode]  = useState(null)   // 'create' | 'edit' | 'delete'
  const [selected,   setSelected]   = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [search,     setSearch]     = useState('')

  useEffect(() => { fetchGastos(); fetchCategorias() }, [])
  useEffect(() => { if (error) toast.error(error) }, [error])

  // ── Filtro local por descripción ──
  const rows = movimientos.filter((m) =>
    !search.trim() ||
    (m.descripcion ?? '').toLowerCase().includes(search.toLowerCase())
  )

  // ── CRUD handlers ──
  const handleCreate = async (data) => {
    try {
      await createMovimiento(data)
      toast.success('Gasto creado')
      setModalMode(null)
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Error al crear'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    }
  }

  const handleEdit = async (data) => {
    try {
      await updateMovimiento(selected.id_movimiento, data)
      toast.success('Gasto actualizado')
      setModalMode(null); setSelected(null)
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Error al actualizar'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteMovimiento(selected.id_movimiento)
      toast.success('Gasto eliminado')
      setModalMode(null); setSelected(null)
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Error al eliminar'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setIsDeleting(false)
    }
  }

  const openEdit = (m) => { setSelected(m); setModalMode('edit') }
  const openDelete = (m) => { setSelected(m); setModalMode('delete') }
  const closeModal = () => { setModalMode(null); setSelected(null) }

  const editDefaults = selected ? {
    monto:        selected.monto,
    fecha:        selected.fecha?.split('T')[0] ?? selected.fecha,
    descripcion:  selected.descripcion ?? '',
    id_categoria: selected.categoria?.id_categoria ?? '',
    id_moneda:    selected.moneda?.id_moneda ?? '',
  } : undefined

  // ── Columnas de la tabla ──
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
        <span className="font-bold tabular-nums text-red-500">
          -${Number(m.monto).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
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
          <span className="inline-flex rounded-full bg-red-50 dark:bg-red-900/30 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
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
              className="rounded-lg p-1.5 text-gray-400 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/30 dark:hover:text-violet-400 transition-colors"
            >
              <Pencil size={15} />
            </button>
          </Tooltip>
          <Tooltip text="Eliminar" position="top">
            <button
              onClick={() => openDelete(m)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
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
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Gestión de Gastos
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {rows.length} {rows.length === 1 ? 'registro' : 'registros'}
            {search && ` · Filtrando por "${search}"`}
          </p>
        </div>
        <Button onClick={() => setModalMode('create')}>
          <Plus size={16} /> Nuevo gasto
        </Button>
      </div>

      {/* Search */}
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

      {/* Tabla */}
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
            emptyMessage={
              search
                ? `Sin resultados para "${search}"`
                : 'No hay gastos registrados. ¡Agrega tu primer gasto!'
            }
          />
        )}
      </Card>

      {/* Totales */}
      {rows.length > 0 && (
        <div className="mt-3 flex justify-end">
          <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
            <span className="text-base font-bold text-red-600 dark:text-red-400 tabular-nums">
              -${rows.reduce((s, m) => s + Number(m.monto), 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      {/* Modal: crear */}
      <Modal isOpen={modalMode === 'create'} onClose={closeModal} title="Nuevo gasto" size="md">
        <MovimientoForm tipo="gasto" categorias={categorias} onSubmit={handleCreate} onCancel={closeModal} />
      </Modal>

      {/* Modal: editar */}
      <Modal isOpen={modalMode === 'edit'} onClose={closeModal} title="Editar gasto" size="md">
        {selected && (
          <MovimientoForm
            key={selected.id_movimiento}
            tipo="gasto"
            categorias={categorias}
            defaultValues={editDefaults}
            onSubmit={handleEdit}
            onCancel={closeModal}
          />
        )}
      </Modal>

      {/* Modal: eliminar */}
      <Modal isOpen={modalMode === 'delete'} onClose={closeModal} title="Eliminar gasto" size="sm">
        {selected && (
          <DeleteConfirm
            movimiento={selected}
            onConfirm={handleDelete}
            onCancel={closeModal}
            isDeleting={isDeleting}
          />
        )}
      </Modal>
    </div>
  )
}
