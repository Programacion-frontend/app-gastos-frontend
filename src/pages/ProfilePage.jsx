import { Card } from '../components/ui'
import useAuthStore from '../store/useAuthStore'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const perfil = user?.perfil

  const nombre  = perfil?.nombre_completo ?? user?.email ?? 'Usuario'
  const inicial = nombre.charAt(0).toUpperCase()
  const fotoUrl = perfil?.foto_perfil

  const campos = [
    { label: 'Email',    value: user?.email },
    { label: 'Nombre',   value: perfil?.nombre_completo },
    { label: 'Edad',     value: perfil?.edad },
    { label: 'Teléfono', value: perfil?.telefono },
    { label: 'Género',   value: perfil?.genero?.nombre },
  ]

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <Card>
          <div className="flex flex-col items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-5 mb-5">
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt={nombre}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-violet-200 dark:ring-violet-700"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40 ring-2 ring-violet-200 dark:ring-violet-700 text-2xl font-bold text-violet-600 dark:text-violet-400 select-none">
                {inicial}
              </div>
            )}
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{nombre}</p>
          </div>

          <dl className="space-y-3 text-sm">
            {campos.map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <dt className="w-24 shrink-0 font-medium text-gray-500 dark:text-gray-400">{label}</dt>
                <dd className="text-gray-900 dark:text-gray-100 truncate">
                  {value ?? <span className="italic text-gray-400 dark:text-gray-500">Sin datos</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  )
}
