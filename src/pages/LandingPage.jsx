import { Link } from 'react-router'
import { TrendingDown, ShieldCheck, BarChart2 } from 'lucide-react'
import { Button } from '../components/ui'
import { ThemeToggle } from '../components/ui'

const features = [
  { icon: TrendingDown, title: 'Registra tus gastos', desc: 'Agrega gastos por categoría en segundos.' },
  { icon: BarChart2,    title: 'Visualiza tu progreso', desc: 'Estadísticas claras de tu dinero cada mes.' },
  { icon: ShieldCheck,  title: 'Seguro y privado', desc: 'Tu información protegida con JWT y cookies HttpOnly.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <span className="text-lg font-bold text-violet-600">MiGasto</span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="secondary" size="sm">Iniciar sesión</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Registrarse</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Controla tus finanzas<br />
          <span className="text-violet-600">sin complicaciones</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Registra, categoriza y analiza tus gastos personales en un solo lugar.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/register">
            <Button size="lg">Empezar gratis</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">Iniciar sesión</Button>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-left shadow-sm"
            >
              <Icon className="mb-3 h-7 w-7 text-violet-600" />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
