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
    // El backend devuelve { message: '...' } y setea la cookie HttpOnly
    await api.post('/auth/login', credentials)
    // Con la cookie ya activa, fetcheamos el usuario real
    const { data } = await api.get('/auth/check-status')
    set({ user: data, isAuthenticated: true, isCheckingAuth: false })
    return data
  },

  register: async (userData) => {
    // El backend NO setea cookie al registrar — auto-login después
    const payload = {
      ...userData,
      edad: userData.edad !== undefined ? String(userData.edad) : undefined,
    }
    await api.post('/auth/register', payload)
    // Auto-login para obtener la cookie
    await api.post('/auth/login', {
      email: userData.email,
      password: userData.password,
    })
    // Fetchear el usuario real con la cookie recién seteada
    const { data } = await api.get('/auth/check-status')
    set({ user: data, isAuthenticated: true, isCheckingAuth: false })
    return data
  },

  logout: async () => {
    await api.post('/auth/logout')
    set({ user: null, isAuthenticated: false })
  },
}))

export default useAuthStore
