import { useState } from 'react'

export function useModal() {
  const [modalMode,  setModalMode] = useState(null)
  const [selected,   setSelected]  = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  return {
    modalMode,
    selected,
    isDeleting,
    setIsDeleting,
    openCreate: ()  => setModalMode('create'),
    openEdit:   (m) => { setSelected(m); setModalMode('edit') },
    openDelete: (m) => { setSelected(m); setModalMode('delete') },
    closeModal: ()  => { setModalMode(null); setSelected(null) },
  }
}
