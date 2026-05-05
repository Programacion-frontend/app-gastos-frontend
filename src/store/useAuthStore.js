import { create } from 'zustand'
import api from '../utils/axios'

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

  useExpenseStore.setState({ movimientos: [], isLoading: false, error: null })
  useBalanceStore.setState({ balance: null, isLoading: false, isEmpty: false, error: null })
  useCategoryStore.setState({ categorias: [], isLoading: false })
}

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,

  checkSession: async () => {
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
    set({ user: data, isAuthenticated: true, isCheckingAuth: false })
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
    set({ user: data, isAuthenticated: true, isCheckingAuth: false })
    return data
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      await resetDataStores()
      set({ user: null, isAuthenticated: false })
    }
  },
}))

export default useAuthStore
