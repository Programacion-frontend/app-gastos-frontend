import { create } from 'zustand'
import api from '../utils/axios'

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
    const { data } = await api.post('/auth/login', credentials)
    set({ user: data, isAuthenticated: true })
    return data
  },

  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    set({ user: data, isAuthenticated: true })
    return data
  },

  logout: async () => {
    await api.post('/auth/logout')
    set({ user: null, isAuthenticated: false })
  },
}))

export default useAuthStore
