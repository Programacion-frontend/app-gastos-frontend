import { Link } from 'react-router'
import {
  MdOutlineAccountBalanceWallet,
  MdOutlineBarChart,
  MdOutlineCategory,
  MdOutlineNotificationsActive,
  MdOutlineSecurity,
  MdOutlineDevices,
} from 'react-icons/md'
import { ThemeToggle, Button } from '../components/ui'

const features = [
  {
    icon: MdOutlineAccountBalanceWallet,
    title: 'Control total de gastos',
    desc: 'Registra cada gasto al instante y lleva un historial detallado de tus finanzas personales.',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon: MdOutlineBarChart,
    title: 'Estadísticas en tiempo real',
    desc: 'Visualiza hacia dónde va tu dinero con gráficas y resúmenes mensuales automáticos.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: MdOutlineCategory,
    title: 'Categorías inteligentes',
    desc: 'Organiza tus gastos por Comida, Transporte, Ocio, Salud y más para entender tus hábitos.',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: MdOutlineNotificationsActive,
    title: 'Alertas de presupuesto',
    desc: 'Define límites de gasto por categoría y recibe avisos antes de sobrepasarlos.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
  {
    icon: MdOutlineSecurity,
    title: 'Seguridad garantizada',
    desc: 'Tu información protegida con autenticación JWT y cookies HttpOnly cifradas.',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
  {
    icon: MdOutlineDevices,
    title: 'Accede desde cualquier lugar',
    desc: 'Diseño responsive optimizado para móvil, tablet y escritorio.',
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
  },
]

const stats = [
  { value: '100%', label: 'Gratuito' },
  { value: '8+',   label: 'Categorías' },
  { value: '∞',    label: 'Gastos registrables' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* ── Navbar ───────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <MdOutlineAccountBalanceWallet className="text-2xl text-violet-600" />
            <span className="text-lg font-bold text-violet-600">MiGasto</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="secondary" size="sm">Iniciar sesión</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Registrarse gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <span className="inline-block rounded-full bg-violet-100 dark:bg-violet-900/40 px-4 py-1 text-xs font-semibold text-violet-600 dark:text-violet-300 mb-6">
          Control financiero personal
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl leading-tight">
          Toma el control de{' '}
          <span className="text-violet-600">tus finanzas</span>
          <br />sin complicaciones
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          Registra, categoriza y analiza tus gastos personales en un solo lugar.
          Saber en qué gastas es el primer paso para ahorrar más.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto px-8">
              Empezar gratis ahora
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
              Ya tengo cuenta
            </Button>
          </Link>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-16 grid max-w-sm grid-cols-3 gap-6 sm:max-w-none sm:grid-cols-3">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-violet-600">{value}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sección: Control de presupuesto ──────────────── */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Todo lo que necesitas para{' '}
              <span className="text-violet-600">controlar tu presupuesto</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-500 dark:text-gray-400">
              Herramientas simples y efectivas diseñadas para que tomes mejores
              decisiones financieras cada día.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${bg}`}>
                  <Icon className={`text-2xl ${color}`} />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sección: Hábitos financieros ─────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight">
                Pequeños cambios,{' '}
                <span className="text-violet-600">grandes resultados</span>
              </h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400 leading-relaxed">
                El 78% de las personas que registran sus gastos logran ahorrar
                más dinero al mes siguiente. Empieza hoy y descubre hacia
                dónde va cada peso.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Registra gastos en menos de 10 segundos',
                  'Identifica patrones de gasto innecesario',
                  'Establece metas de ahorro realistas',
                  'Revisa tu historial completo en cualquier momento',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 text-xs font-bold">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-8 inline-block">
                <Button size="lg">Crear mi cuenta gratis</Button>
              </Link>
            </div>

            {/* Visual card mockup */}
            <div className="flex-1 w-full max-w-sm lg:max-w-none">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                  Resumen del mes
                </p>
                {[
                  { cat: 'Comida',     pct: 40, color: 'bg-green-500',  amount: '$320.00' },
                  { cat: 'Transporte', pct: 25, color: 'bg-blue-500',   amount: '$200.00' },
                  { cat: 'Ocio',       pct: 20, color: 'bg-violet-500', amount: '$160.00' },
                  { cat: 'Servicios',  pct: 15, color: 'bg-orange-500', amount: '$120.00' },
                ].map(({ cat, pct, color, amount }) => (
                  <div key={cat} className="mb-4">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{cat}</span>
                      <span className="text-gray-500 dark:text-gray-400">{amount}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded-full ${color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-5 flex justify-between border-t border-gray-100 dark:border-gray-700 pt-4 text-sm font-semibold">
                  <span className="text-gray-700 dark:text-gray-300">Total gastado</span>
                  <span className="text-violet-600">$800.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────── */}
      <section className="bg-violet-600 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">¿Listo para tomar el control?</h2>
        <p className="mx-auto mt-3 max-w-md text-violet-200">
          Únete y empieza a registrar tus gastos hoy mismo. Es gratis.
        </p>
        <Link to="/register" className="mt-8 inline-block">
          <Button
            size="lg"
            className="bg-white !text-violet-700 hover:bg-violet-50 focus-visible:ring-white px-10"
          >
            Comenzar ahora
          </Button>
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} MiGasto · Control de finanzas personales
      </footer>
    </div>
  )
}
