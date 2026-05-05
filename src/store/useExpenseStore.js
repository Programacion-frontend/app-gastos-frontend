import { create } from 'zustand'
import api from '../utils/axios'

const useExpenseStore = create((set) => ({
  movimientos: [],
  isLoading:   false,

  fetchMovimientos: async (filters = {}) => {
    set({ isLoading: true })
    try {
      const { data } = await api.get('/movimientos', { params: filters })
      set({ movimientos: data, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  fetchIngresos: async (filters = {}) => {
    set({ isLoading: true })
    try {
      const { data } = await api.get('/movimientos/ingresos', { params: filters })
      set({ movimientos: data, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  fetchGastos: async (filters = {}) => {
    set({ isLoading: true })
    try {
      const { data } = await api.get('/movimientos/gastos', { params: filters })
      set({ movimientos: data, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  createMovimiento: async (movimientoData) => {
    const { data } = await api.post('/movimientos', movimientoData)
    set((state) => ({ movimientos: [data, ...state.movimientos] }))
    return data
  },

  updateMovimiento: async (id, movimientoData) => {
    const { data } = await api.patch(`/movimientos/${id}`, movimientoData)
    set((state) => ({
      movimientos: state.movimientos.map((m) =>
        m.id_movimiento === id ? data : m
      ),
    }))
    return data
  },

  deleteMovimiento: async (id) => {
    await api.delete(`/movimientos/${id}`)
    set((state) => ({
      movimientos: state.movimientos.filter((m) => m.id_movimiento !== id),
    }))
  },
}))

export default useExpenseStore
