import { Modal, ConfirmDialog } from './ui'
import MovimientoForm from './MovimientoForm'

/**
 * Conjunto reutilizable de modales (crear / editar / eliminar) para movimientos.
 * Antes este bloque estaba duplicado en MovimientosPage, GastosPage e IngresosPage.
 *
 * @param {string}  tipo       - 'gasto' | 'ingreso' | undefined (todos)
 * @param {string}  label      - etiqueta singular para los títulos ('gasto', 'movimiento'...)
 * @param {Array}   categorias - catálogo de categorías
 * @param {object}  crud       - retorno de useMovimientoCrud
 */
export default function MovimientoModals({ tipo, label, categorias, crud }) {
  const {
    modalMode, selected, isDeleting,
    closeModal, handleCreate, handleEdit, handleDelete, editDefaults,
  } = crud

  return (
    <>
      <Modal isOpen={modalMode === 'create'} onClose={closeModal} title={`Nuevo ${label}`} size="md">
        <MovimientoForm
          tipo={tipo}
          categorias={categorias}
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
