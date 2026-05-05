import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Search, AlertCircle, SlidersHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'

import useExpenseStore  from '../store/useExpenseStore'
import useCategoryStore from '../store/useCategoryStore'
import { Card, Badge, Button, Modal, Input, Spinner } from '../components/ui'
import { useFetch, useModal, useErrorToast } from '../hooks'

const schema = z.object({
  monto:        z.coerce.number({ invalid_type_error: 'Ingresa un monto válido' }).positive('El monto debe ser mayor a 0'),
  fecha:        z.string().min(1, 'La fecha es requerida').regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD'),
  descripcion:  z.string().optional(),
  id_categoria: z.coerce.number({ invalid_type_error: 'Selecciona una categoría' }).min(1, 'La categoría es requerida'),
  id_moneda:    z.coerce.number().optional().nullable(),
})

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
      <span className={`text-base font-bold shrink-0 ${isGasto ? 'text-red-500' : 'text-green-500'}`}>
        {isGasto ? '-' : '+'}{movimiento.moneda?.simbolo ?? '$'}{monto.toFixed(2)}
      </span>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(movimiento)}
          aria-label="Editar"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(movimiento)}
          aria-label="Eliminar"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}

function MovimientoForm({ defaultValues, categorias, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { fecha: new Date().toISOString().split('T')[0] },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input id="monto" label="Monto" type="number" step="0.01" placeholder="0.00" error={errors.monto?.message} {...register('monto')} />
        <Input id="fecha" label="Fecha" type="date" error={errors.fecha?.message} {...register('fecha')} />
      </div>
      <Input id="descripcion" label="Descripción (opcional)" type="text" placeholder="Ej: Almuerzo, pago de luz..." error={errors.descripcion?.message} {...register('descripcion')} />
      <div className="flex flex-col gap-1">
        <label htmlFor="id_categoria" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Categoría <span className="text-red-500">*</span>
        </label>
        <select
          id="id_categoria"
          className={[
            'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
            'bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100',
            errors.id_categoria
              ? 'border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-gray-600',
          ].join(' ')}
          {...register('id_categoria')}
        >
          <option value="">Seleccionar categoría...</option>
          {categorias.map((c) => (
            <option key={c.id_categoria} value={c.id_categoria}>{c.tipo_categoria}</option>
          ))}
        </select>
        {errors.id_categoria && <p className="text-xs text-red-500">{errors.id_categoria.message}</p>}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting
            ? defaultValues ? 'Guardando...' : 'Creando...'
            : defaultValues ? 'Guardar cambios' : 'Crear movimiento'}
        </Button>
      </div>
    </form>
  )
}

function DeleteConfirm({ movimiento, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        ¿Seguro que deseas eliminar{' '}
        <strong className="text-gray-900 dark:text-gray-100">
          "{movimiento.descripcion ?? 'este movimiento'}"
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

export default function MovimientosPage() {
  const {
    movimientos, isLoading,
    fetchMovimientos, createMovimiento, updateMovimiento, deleteMovimiento,
  } = useExpenseStore()

  const { categorias, fetchCategorias } = useCategoryStore()

  const errorToast = useErrorToast()
  const {
    modalMode, selected, isDeleting, setIsDeleting,
    openCreate, openEdit, openDelete, closeModal,
  } = useModal()

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
  }, [fetchMovimientos])

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

  const handleCreate = async (formData) => {
    try {
      await createMovimiento({
        monto:        Number(formData.monto),
        fecha:        formData.fecha,
        descripcion:  formData.descripcion || undefined,
        id_categoria: Number(formData.id_categoria),
        id_moneda:    formData.id_moneda ? Number(formData.id_moneda) : undefined,
      })
      toast.success('Movimiento creado')
      closeModal()
    } catch (err) {
      errorToast(err, 'Error al crear el movimiento')
    }
  }

  const handleEdit = async (formData) => {
    try {
      await updateMovimiento(selected.id_movimiento, {
        monto:        Number(formData.monto),
        fecha:        formData.fecha,
        descripcion:  formData.descripcion || undefined,
        id_categoria: Number(formData.id_categoria),
        id_moneda:    formData.id_moneda ? Number(formData.id_moneda) : undefined,
      })
      toast.success('Movimiento actualizado')
      closeModal()
    } catch (err) {
      errorToast(err, 'Error al actualizar')
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteMovimiento(selected.id_movimiento)
      toast.success('Movimiento eliminado')
      closeModal()
    } catch (err) {
      errorToast(err, 'Error al eliminar')
    } finally {
      setIsDeleting(false)
    }
  }

  const editDefaults = selected ? {
    monto:        selected.monto,
    fecha:        selected.fecha?.split('T')[0] ?? selected.fecha,
    descripcion:  selected.descripcion ?? '',
    id_categoria: selected.categoria?.id_categoria ?? '',
    id_moneda:    selected.moneda?.id_moneda ?? '',
  } : undefined

  const total = movimientos.reduce((a, m) => a + Number(m.monto ?? 0), 0)

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Movimientos</h1>
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
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{movimientos.length} movimientos encontrados</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">Total: ${total.toFixed(2)}</span>
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

      <Modal isOpen={modalMode === 'create'} onClose={closeModal} title="Nuevo movimiento" size="md">
        <MovimientoForm categorias={categorias} onSubmit={handleCreate} onCancel={closeModal} />
      </Modal>

      <Modal isOpen={modalMode === 'edit'} onClose={closeModal} title="Editar movimiento" size="md">
        {selected && (
          <MovimientoForm key={selected.id_movimiento} defaultValues={editDefaults} categorias={categorias} onSubmit={handleEdit} onCancel={closeModal} />
        )}
      </Modal>

      <Modal isOpen={modalMode === 'delete'} onClose={closeModal} title="Eliminar movimiento" size="sm">
        {selected && (
          <DeleteConfirm movimiento={selected} onConfirm={handleDelete} onCancel={closeModal} isDeleting={isDeleting} />
        )}
      </Modal>
    </div>
  )
}
