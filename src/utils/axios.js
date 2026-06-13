import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLogoutRequest = error.config?.url?.includes('/auth/logout')

    if (error.response?.status === 401 && !isLogoutRequest) {
      import('../store/useAuthStore').then(({ default: useAuthStore }) => {
        if (!useAuthStore.getState().isAuthenticated) return

        api.post('/auth/logout').catch(() => {})
        useAuthStore.setState({ user: null, isAuthenticated: false, isCheckingAuth: false })
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/login'
      })
    }

    return Promise.reject(error)
  }
)

export default api
