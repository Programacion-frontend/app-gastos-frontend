import { create } from 'zustand'
import api from '../utils/axios'

// Entidad Categoria: { id_categoria, tipo_categoria }
// GET /categoria — requiere JwtAuthGuard (cookie)

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
