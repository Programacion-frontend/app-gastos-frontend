import { Card } from '../components/ui'
import useAuthStore from '../store/useAuthStore'

// Estructura real del usuario desde GET /auth/check-status:
// { id_usuario, email, rol: { id, nombre }, perfil: { id_perfil, nombre_completo, edad, telefono, foto_perfil, genero } }

export default function ProfilePage() {
  const { user } = useAuthStore()
  const perfil = user?.perfil

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Perfil</h1>

      <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
        {/* Cuenta */}
        <Card>
          <Card.Header>
            <Card.Title>Cuenta</Card.Title>
          </Card.Header>
          <Card.Body>
            <dl className="space-y-3 text-sm">
              {[
                ['ID',    user?.id_usuario],
                ['Email', user?.email],
                ['Rol',   user?.rol?.nombre],
              ].map(([key, val]) => (
                <div key={key} className="flex gap-2">
                  <dt className="w-16 shrink-0 font-medium text-gray-500 dark:text-gray-400">{key}</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{val ?? '—'}</dd>
                </div>
              ))}
            </dl>
          </Card.Body>
        </Card>

        {/* Perfil personal */}
        <Card>
          <Card.Header>
            <Card.Title>Datos personales</Card.Title>
          </Card.Header>
          <Card.Body>
            <dl className="space-y-3 text-sm">
              {[
                ['Nombre',   perfil?.nombre_completo],
                ['Edad',     perfil?.edad],
                ['Teléfono', perfil?.telefono],
                ['Género',   perfil?.genero?.nombre],
              ].map(([key, val]) => (
                <div key={key} className="flex gap-2">
                  <dt className="w-20 shrink-0 font-medium text-gray-500 dark:text-gray-400">{key}</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{val ?? '—'}</dd>
                </div>
              ))}
            </dl>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
