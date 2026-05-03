import { Card } from '../components/ui'
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'

const stats = [
  { label: 'Total gastado',  value: '$0.00',  icon: TrendingDown, color: 'text-red-500' },
  { label: 'Presupuesto',    value: '$0.00',  icon: Wallet,       color: 'text-violet-500' },
  { label: 'Disponible',     value: '$0.00',  icon: TrendingUp,   color: 'text-green-500' },
]

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Dashboard
      </h1>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {value}
                </p>
              </div>
              <Icon className={`h-8 w-8 ${color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Placeholder list */}
      <Card className="mt-6">
        <Card.Header>
          <Card.Title>Últimos gastos</Card.Title>
        </Card.Header>
        <Card.Body>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Aún no hay gastos registrados.
          </p>
        </Card.Body>
      </Card>
    </div>
  )
}
