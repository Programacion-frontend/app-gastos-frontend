import { useEffect } from 'react'
import { X } from 'lucide-react'

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-overlay-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={[
          'relative flex max-h-[90vh] w-full flex-col rounded-2xl shadow-2xl ring-1 ring-black/5',
          'bg-surface-card dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          'animate-panel-in',
          sizeMap[size],
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <h2
            id="modal-title"
            className="text-base font-semibold text-gray-900 dark:text-gray-100"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  )
}
