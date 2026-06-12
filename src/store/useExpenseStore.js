import { create } from 'zustand'
import api from '../utils/axios'

const fetchInto = (set) => async (url, filters) => {
  set({ isLoading: true, movimientos: [] })
  try {
    const { data } = await api.get(url, { params: filters })
    set({ movimientos: data, isLoading: false })
  } catch (err) {
    set({ movimientos: [], isLoading: false })
    throw err
  }
}

const useExpenseStore = create((set) => {
  const run = fetchInto(set)

  return {
  movimientos: [],
  isLoading:   false,

  fetchMovimientos: (filters = {}) => run('/movimientos', filters),

  fetchIngresos: (filters = {}) => run('/movimientos/ingresos', filters),

  fetchGastos: (filters = {}) => run('/movimientos/gastos', filters),

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
  }
})

export default useExpenseStore
