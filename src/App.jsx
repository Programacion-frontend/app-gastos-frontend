import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Toaster } from 'react-hot-toast'

import ProtectedRoute   from './routes/ProtectedRoute'
import DashboardLayout  from './layouts/DashboardLayout'

import LandingPage      from './pages/LandingPage'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import DashboardPage    from './pages/DashboardPage'
import ProfilePage      from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-gray-100',
          duration: 3500,
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"        element={<DashboardPage />} />
            <Route path="/dashboard/perfil" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
