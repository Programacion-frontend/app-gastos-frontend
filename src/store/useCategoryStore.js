import { create } from 'zustand'
import api from '../utils/axios'

const useCategoryStore = create((set) => ({
  categorias: [],
  isLoading: false,

  fetchCategorias: async () => {
    set({ isLoading: true })
    try {
      const { data } = await api.get('/categoria')
      set({ categorias: data, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },
}))

export default useCategoryStore
