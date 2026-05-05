import { useEffect } from 'react'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'react-hot-toast'

import useAuthStore from './store/useAuthStore'
import AppRouter    from './routes/router'

export default function App() {
  const checkSession = useAuthStore((s) => s.checkSession)

  useEffect(() => {
    checkSession()
  }, [])

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-gray-100',
          duration: 3500,
        }}
      />
      <AppRouter />
    </BrowserRouter>
  )
}
