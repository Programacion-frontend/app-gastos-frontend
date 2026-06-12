import { Modal, ConfirmDialog } from './ui'
import MovimientoForm from './MovimientoForm'
import useMonedaStore from '../store/useMonedaStore'
import { useFetch } from '../hooks'

export default function MovimientoModals({ tipo, label, categorias, crud }) {
  const {
    modalMode, selected, isDeleting,
    closeModal, handleCreate, handleEdit, handleDelete, editDefaults,
  } = crud

  const { monedas, fetchMonedas } = useMonedaStore()
  useFetch(fetchMonedas)

  return (
    <>
      <Modal isOpen={modalMode === 'create'} onClose={closeModal} title={`Nuevo ${label}`} size="md">
        <MovimientoForm
          tipo={tipo}
          categorias={categorias}
          monedas={monedas}
          onSubmit={handleCreate}
          onCancel={closeModal}
        />
      </Modal>

      <Modal isOpen={modalMode === 'edit'} onClose={closeModal} title={`Editar ${label}`} size="md">
        {selected && (
          <MovimientoForm
            key={selected.id_movimiento}
            tipo={tipo}
            categorias={categorias}
            monedas={monedas}
            defaultValues={editDefaults}
            onSubmit={handleEdit}
            onCancel={closeModal}
          />
        )}
      </Modal>

      <Modal isOpen={modalMode === 'delete'} onClose={closeModal} title={`Eliminar ${label}`} size="sm">
        {selected && (
          <ConfirmDialog
            isLoading={isDeleting}
            onConfirm={handleDelete}
            onCancel={closeModal}
            description={
              <>
                ¿Eliminar el {label}{' '}
                <strong className="text-gray-900 dark:text-gray-100">
                  "{selected.descripcion ?? 'sin descripción'}"
                </strong>
                ? Esta acción no se puede deshacer.
              </>
            }
          />
        )}
      </Modal>
    </>
  )
}
