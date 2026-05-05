import { create } from 'zustand'
import api from '../utils/axios'


const useBalanceStore = create((set) => ({
  balance: null,    
  isLoading: false,
  isEmpty: false,   
  error: null,

  fetchBalance: async ({ mes, anio } = {}) => {
    set({ isLoading: true, error: null, isEmpty: false })
    try {
      const params = {}
      if (mes)  params.mes  = mes
      if (anio) params.anio = anio
      const { data } = await api.get('/movimientos/balance', { params })
      set({ balance: data, isLoading: false })
    } catch (err) {
      if (err.response?.status === 404) {
        set({ balance: null, isEmpty: true, isLoading: false })
      } else {
        const message = err.response?.data?.message ?? 'Error al cargar el balance'
        set({ error: message, isLoading: false })
      }
    }
  },
}))

export default useBalanceStore
