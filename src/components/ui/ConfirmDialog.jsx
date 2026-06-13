import Button from './Button'

export default function ConfirmDialog({
  description,
  confirmLabel = 'Eliminar',
  loadingLabel = 'Eliminando...',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={onConfirm} isLoading={isLoading} disabled={isLoading}>
          {isLoading ? loadingLabel : confirmLabel}
        </Button>
      </div>
    </div>
  )
}
