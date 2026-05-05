import { useEffect } from 'react'
import { parseError } from './useErrorToast'
import toast from 'react-hot-toast'

export function useFetch(fetchFn, { deps = [], fallback = 'Error inesperado' } = {}) {
  useEffect(() => {
    let cancelled = false

    fetchFn().catch((err) => {
      if (cancelled) return
      toast.error(parseError(err, fallback))
    })

    return () => { cancelled = true }
  }, deps)
}
