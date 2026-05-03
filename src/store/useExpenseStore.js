import { create } from 'zustand'
import api from '../utils/axios'

// Entidad Movimiento: { id_movimiento, monto, fecha, descripcion?, categoria, moneda?, tags? }
// CreateMovimientoDto:  { monto, fecha, descripcion?, id_categoria, id_moneda?, tags?, id_usuario? }
// FilterMovimientoDto:  { termino?, fechaInicio?, fechaFin?, tags? }

const useExpenseStore = create((set) => ({
  movimientos: [],
  isLoading: false,
  error: null,

  // Todos los movimientos del usuario (gastos + ingresos)
  fetchMovimientos: async (filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get('/movimientos', { params: filters })
      set({ movimientos: data, isLoading: false })
    } catch (err) {
      const message = err.response?.data?.message ?? 'Error al cargar los movimientos'
      set({ error: message, isLoading: false })
    }
  },

  // Solo gastos — para el dashboard
  fetchGastos: async (filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get('/movimientos/gastos', { params: filters })
      set({ movimientos: data, isLoading: false })
    } catch (err) {
      const message = err.response?.data?.message ?? 'Error al cargar los gastos'
      set({ error: message, isLoading: false })
    }
  },

  createMovimiento: async (movimientoData) => {
    // { monto, fecha (YYYY-MM-DD), descripcion?, id_categoria, id_moneda? }
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
