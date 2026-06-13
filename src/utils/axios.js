import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      import('../store/useAuthStore').then(({ default: useAuthStore }) => {
        const { isAuthenticated } = useAuthStore.getState()
        if (isAuthenticated) {
          useAuthStore.setState({ user: null, isAuthenticated: false })
          window.location.replace('/login')
        }
      })
    }
    return Promise.reject(error)
  }
)

export default api
