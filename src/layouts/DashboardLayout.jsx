import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { LayoutDashboard, UserCircle, Menu, X, LogOut, DollarSign, TrendingDown } from 'lucide-react'
import { ThemeToggle, Tooltip } from '../components/ui'
import useAuthStore from '../store/useAuthStore'
import useExpenseStore from '../store/useExpenseStore'

const navLinks = [
  { to: '/dashboard',             icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/dashboard/movimientos', icon: TrendingDown,    label: 'Movimientos'  },
  { to: '/dashboard/perfil',      icon: UserCircle,      label: 'Perfil'       },
]

const linkClass = ({ isActive }) =>
  [
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50',
  ].join(' ')

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const movimientos = useExpenseStore((s) => s.movimientos)
  const navigate    = useNavigate()

  const totalGastado = movimientos.reduce((acc, m) => acc + Number(m.monto ?? 0), 0)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-gray-200',
          'bg-white dark:bg-gray-800 dark:border-gray-700 transition-transform duration-200',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:static lg:translate-x-0',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-bold text-violet-600">MiGasto</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/dashboard'} className={linkClass}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <p className="truncate text-xs font-medium text-gray-700 dark:text-gray-300">
            {user?.perfil?.nombre_completo ?? user?.email ?? 'Usuario'}
          </p>
          <p className="truncate text-xs text-gray-400">{user?.email}</p>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Navbar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800">
          {/* Left: hamburger + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
            <span className="hidden text-sm font-semibold text-gray-700 dark:text-gray-200 sm:block">
              Panel de Gastos
            </span>
          </div>

          {/* Center: balance total */}
          <div className="flex items-center gap-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 px-3 py-1.5">
            <DollarSign size={15} className="text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
              Total: ${totalGastado.toFixed(2)}
            </span>
          </div>

          {/* Right: theme + logout */}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Tooltip text="Cerrar sesión" position="bottom">
              <button
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </Tooltip>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
