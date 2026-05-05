import { ArrowLeftRight, LayoutDashboard, TrendingDown, TrendingUp, UserCircle, X } from 'lucide-react'
import { NavLink } from 'react-router'
import useAuthStore from '../../store/useAuthStore'

const navLinks = [
  { to: '/dashboard',             icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/dashboard/gastos',      icon: TrendingDown,    label: 'Gastos'      },
  { to: '/dashboard/ingresos',    icon: TrendingUp,      label: 'Ingresos'    },
  { to: '/dashboard/movimientos', icon: ArrowLeftRight,  label: 'Movimientos' },
  { to: '/dashboard/perfil',      icon: UserCircle,      label: 'Perfil'      },
]

const linkClass = ({ isActive }) =>
  [
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50',
  ].join(' ')

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuthStore()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-gray-200',
          'bg-white dark:bg-gray-800 dark:border-gray-700 transition-transform duration-200',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:static lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-bold text-violet-600">MiGasto</span>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/dashboard'} className={linkClass}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <p className="truncate text-xs font-medium text-gray-700 dark:text-gray-300">
            {user?.perfil?.nombre_completo ?? user?.email ?? 'Usuario'}
          </p>
          <p className="truncate text-xs text-gray-400">{user?.email}</p>
        </div>
      </aside>
    </>
  )
}
