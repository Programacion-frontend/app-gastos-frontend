import { create } from 'zustand'
import api from '../utils/axios'

const useBalanceStore = create((set) => ({
  balance:   null,
  isLoading: false,
  isEmpty:   false,

  fetchBalance: async ({ mes, anio } = {}) => {
    set({ isLoading: true, isEmpty: false })
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
        set({ isLoading: false })
        throw err
      }
    }
  },
}))

export default useBalanceStore
