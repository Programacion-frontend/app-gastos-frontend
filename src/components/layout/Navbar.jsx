import { LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router'
import { ThemeToggle, Tooltip } from '../ui'
import useAuthStore from '../../store/useAuthStore'

export default function Navbar({ onOpenSidebar }) {
  const { logout } = useAuthStore()
  const navigate   = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-surface-card px-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        <span className="hidden text-sm font-semibold text-gray-700 dark:text-gray-200 sm:block">
          Panel de Gastos
        </span>
      </div>

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
  )
}
