import { create } from 'zustand'
import api from '../utils/axios'

const useMonedaStore = create((set, get) => ({
  monedas: [],
  isLoading: false,

  fetchMonedas: async () => {
    if (get().monedas.length > 0) return
    set({ isLoading: true })
    try {
      const { data } = await api.get('/monedas')
      set({ monedas: data, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },
}))

export default useMonedaStore
