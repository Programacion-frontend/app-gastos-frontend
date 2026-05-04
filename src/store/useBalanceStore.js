import { create } from 'zustand'
import api from '../utils/axios'

// GET /movimientos/balance?mes=&anio=
// Respuesta: { totalGastos, totalIngresos, balance, resumen, estadisticas, graficas: { circular, barras } }
// Lanza 404 si no hay movimientos — se trata como "sin datos", no como error grave.

const useBalanceStore = create((set) => ({
  balance: null,      // null = sin datos todavía
  isLoading: false,
  isEmpty: false,     // true cuando el backend responde 404 (sin movimientos)
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
        // Sin movimientos — estado vacío, no es un error de red
        set({ balance: null, isEmpty: true, isLoading: false })
      } else {
        const message = err.response?.data?.message ?? 'Error al cargar el balance'
        set({ error: message, isLoading: false })
      }
    }
  },
}))

export default useBalanceStore
