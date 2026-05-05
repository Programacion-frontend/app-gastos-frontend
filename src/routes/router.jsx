import { Routes, Route, Navigate } from 'react-router'

import ProtectedRoute  from './ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'

import LandingPage     from '../pages/LandingPage'
import LoginPage       from '../pages/LoginPage'
import RegisterPage    from '../pages/RegisterPage'
import DashboardPage   from '../pages/DashboardPage'
import MovimientosPage from '../pages/MovimientosPage'
import GastosPage      from '../pages/GastosPage'
import IngresosPage    from '../pages/IngresosPage'
import ProfilePage     from '../pages/ProfilePage'

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard"             element={<DashboardPage />} />
          <Route path="/dashboard/movimientos" element={<MovimientosPage />} />
          <Route path="/dashboard/gastos"      element={<GastosPage />} />
          <Route path="/dashboard/ingresos"    element={<IngresosPage />} />
          <Route path="/dashboard/perfil"      element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
