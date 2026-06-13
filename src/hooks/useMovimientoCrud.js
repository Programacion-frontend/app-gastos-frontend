import toast from 'react-hot-toast'

import useExpenseStore from '../store/useExpenseStore'
import { useModal } from './useModal'
import { useErrorToast } from './useErrorToast'

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

const toFormDefaults = (m) =>
  m
    ? {
        monto:        m.monto,
        fecha:        m.fecha?.split('T')[0] ?? m.fecha,
        descripcion:  m.descripcion ?? '',
        id_categoria: m.categoria?.id_categoria ?? '',
        id_moneda:    m.moneda?.id_moneda ?? '',
      }
    : undefined

export function useMovimientoCrud({ label }) {
  const { createMovimiento, updateMovimiento, deleteMovimiento } = useExpenseStore()
  const errorToast = useErrorToast()
  const modal = useModal()

  const handleCreate = async (data) => {
    try {
      await createMovimiento(data)
      toast.success(`${capitalize(label)} creado`)
      modal.closeModal()
    } catch (err) {
      errorToast(err, 'Error al crear')
    }
  }

  const handleEdit = async (data) => {
    try {
      await updateMovimiento(modal.selected.id_movimiento, data)
      toast.success(`${capitalize(label)} actualizado`)
      modal.closeModal()
    } catch (err) {
      errorToast(err, 'Error al actualizar')
    }
  }

  const handleDelete = async () => {
    modal.setIsDeleting(true)
    try {
      await deleteMovimiento(modal.selected.id_movimiento)
      toast.success(`${capitalize(label)} eliminado`)
      modal.closeModal()
    } catch (err) {
      errorToast(err, 'Error al eliminar')
    } finally {
      modal.setIsDeleting(false)
    }
  }

  return {
    ...modal,
    handleCreate,
    handleEdit,
    handleDelete,
    editDefaults: toFormDefaults(modal.selected),
  }
}
