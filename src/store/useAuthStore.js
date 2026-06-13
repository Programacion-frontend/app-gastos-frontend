import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import api from '../utils/axios'

const noopStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }

const resetDataStores = async () => {
  const [
    { default: useExpenseStore },
    { default: useBalanceStore },
    { default: useCategoryStore },
  ] = await Promise.all([
    import('./useExpenseStore'),
    import('./useBalanceStore'),
    import('./useCategoryStore'),
  ])

  useExpenseStore.setState({ movimientos: [], isLoading: false })
  useBalanceStore.setState({ balance: null, isLoading: false, isEmpty: false })
  useCategoryStore.setState({ categorias: [], isLoading: false })
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      _validated: false,

      checkSession: async () => {
        if (get()._validated) return
        set({ _validated: true })
        try {
          const { data } = await api.get('/auth/check-status')
          set({ user: data, isAuthenticated: true, isCheckingAuth: false })
        } catch {
          set({ user: null, isAuthenticated: false, isCheckingAuth: false })
        }
      },

      login: async (credentials) => {
        await resetDataStores()
        await api.post('/auth/login', credentials)
        const { data } = await api.get('/auth/check-status')
        set({ user: data, isAuthenticated: true, isCheckingAuth: false, _validated: true })
        return data
      },

      register: async (userData) => {
        await resetDataStores()
        const payload = {
          ...userData,
          edad: userData.edad !== undefined ? String(userData.edad) : undefined,
        }
        await api.post('/auth/register', payload)
        await api.post('/auth/login', {
          email: userData.email,
          password: userData.password,
        })
        const { data } = await api.get('/auth/check-status')
        set({ user: data, isAuthenticated: true, isCheckingAuth: false, _validated: true })
        return data
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } finally {
          await resetDataStores()
          set({ user: null, isAuthenticated: false, _validated: true })
        }
      },
    }),
    {
      name: 'migasto-auth',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : noopStorage)),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export default useAuthStore
