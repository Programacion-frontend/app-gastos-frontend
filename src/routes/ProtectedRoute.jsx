import { Navigate, Outlet } from 'react-router'
import useAuthStore from '../store/useAuthStore'
import Spinner from '../components/ui/Spinner'

export default function ProtectedRoute() {
  const { isAuthenticated, isCheckingAuth } = useAuthStore()

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" className="text-violet-600" />
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
