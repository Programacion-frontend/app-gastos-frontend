import { Card } from '../components/ui'
import useAuthStore from '../store/useAuthStore'

export default function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Perfil
      </h1>
      <Card className="max-w-md">
        <Card.Header>
          <Card.Title>Datos de la cuenta</Card.Title>
        </Card.Header>
        <Card.Body>
          <dl className="space-y-3 text-sm">
            {[
              ['Nombre', user?.nombre_completo],
              ['Email',  user?.email],
              ['Rol',    user?.rol?.nombre ?? user?.rolId],
            ].map(([key, val]) => (
              <div key={key} className="flex gap-2">
                <dt className="w-20 font-medium text-gray-500 dark:text-gray-400">{key}</dt>
                <dd className="text-gray-900 dark:text-gray-100">{val ?? '—'}</dd>
              </div>
            ))}
          </dl>
        </Card.Body>
      </Card>
    </div>
  )
}
