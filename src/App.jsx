import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Toaster } from 'react-hot-toast'

import ProtectedRoute   from './components/ProtectedRoute'
import DashboardLayout  from './layouts/DashboardLayout'

import LandingPage      from './pages/LandingPage'
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

        {/* Placeholder — se reemplazará en la Fase 5 */}
        <Route path="/login"    element={<div className="p-10 text-center font-bold">Login (próxima fase)</div>} />
        <Route path="/register" element={<div className="p-10 text-center font-bold">Register (próxima fase)</div>} />

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
