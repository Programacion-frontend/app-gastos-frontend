import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'
import Spinner from '../components/ui/Spinner'
import useAuthStore from '../store/useAuthStore'

export default function AuthGuard() {
  const { isAuthenticated, isCheckingAuth, checkSession } = useAuthStore()

  useEffect(() => {
    checkSession()
  }, [])

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" className="text-violet-600" />
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
