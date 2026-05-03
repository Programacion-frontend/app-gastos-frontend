import { create } from 'zustand'
import api from '../utils/axios'

const useExpenseStore = create((set) => ({
  expenses: [],
  isLoading: false,
  error: null,

  fetchExpenses: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get('/gastos')
      set({ expenses: data, isLoading: false })
    } catch (err) {
      const message = err.response?.data?.message ?? 'Error al cargar los gastos'
      set({ error: message, isLoading: false })
    }
  },

  createExpense: async (expenseData) => {
    const { data } = await api.post('/gastos', expenseData)
    set((state) => ({ expenses: [data, ...state.expenses] }))
    return data
  },

  updateExpense: async (id, expenseData) => {
    const { data } = await api.patch(`/gastos/${id}`, expenseData)
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? data : e)),
    }))
    return data
  },

  deleteExpense: async (id) => {
    await api.delete(`/gastos/${id}`)
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    }))
  },
}))

export default useExpenseStore
