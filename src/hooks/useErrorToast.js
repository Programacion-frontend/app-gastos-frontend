import toast from 'react-hot-toast'

export function parseError(err, fallback = 'Error inesperado') {
  const msg = err?.response?.data?.message ?? fallback
  return Array.isArray(msg) ? msg[0] : msg
}

export function useErrorToast() {
  return (err, fallback) => toast.error(parseError(err, fallback))
}
