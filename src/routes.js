import { route, index, layout } from '@react-router/dev/routes'

export default [
  index('pages/LandingPage.jsx'),
  route('login', 'pages/LoginPage.jsx'),
  route('register', 'pages/RegisterPage.jsx'),

  layout('routes/ProtectedRoute.jsx', [
    layout('layouts/DashboardLayout.jsx', [
      route('dashboard', 'pages/DashboardPage.jsx'),
      route('dashboard/movimientos', 'pages/MovimientosPage.jsx'),
      route('dashboard/gastos', 'pages/GastosPage.jsx'),
      route('dashboard/ingresos', 'pages/IngresosPage.jsx'),
      route('dashboard/perfil', 'pages/ProfilePage.jsx'),
    ]),
  ]),

  route('*', 'routes/NotFound.jsx'),
]
