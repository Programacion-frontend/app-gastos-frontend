import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'

import { Button, Input, Spinner, ThemeToggle } from '../components/ui'
import useAuthStore from '../store/useAuthStore'
import api from '../utils/axios'

const schema = z.object({
  nombre_completo: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email:           z.string().min(1, 'El email es requerido').email('Email inválido'),
  password:        z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  edad:            z.string().regex(/^\d+$/, 'Debe ser un número').min(1, 'La edad es requerida'),
  telefono:        z.string().min(7, 'Teléfono inválido'),
  id_genero:       z.coerce.number({ invalid_type_error: 'Selecciona un género' }).min(1, 'Selecciona un género'),
})

function SelectField({ id, label, error, loading, children, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          disabled={loading}
          className={[
            'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors appearance-none',
            'bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-gray-600',
          ].join(' ')}
          {...props}
        >
          {children}
        </select>
        {loading && (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <Spinner size="sm" className="text-gray-400" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function RegisterPage() {
  const register_user = useAuthStore((s) => s.register)
  const navigate      = useNavigate()

  const [generos,          setGeneros]          = useState([])
  const [loadingCatalogos, setLoadingCatalogos] = useState(true)
  const [rolUsuarioId,     setRolUsuarioId]     = useState(null)

  useEffect(() => {
    Promise.all([api.get('/rol'), api.get('/genero')])
      .then(([rolesRes, generosRes]) => {
        const rolUsuario = rolesRes.data.find((r) => r.nombre?.toLowerCase() === 'usuario')
        if (rolUsuario) {
          setRolUsuarioId(rolUsuario.id)
        } else {
          toast.error('No se encontró el rol de usuario en el sistema')
        }
        setGeneros(generosRes.data)
      })
      .catch(() => toast.error('No se pudieron cargar los catálogos'))
      .finally(() => setLoadingCatalogos(false))
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    if (!rolUsuarioId) {
      toast.error('No se pudo determinar el rol de usuario. Intenta recargar la página.')
      return
    }
    try {
      await register_user({ ...data, rolId: rolUsuarioId })
      toast.success('¡Cuenta creada exitosamente!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Error al crear la cuenta'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold text-violet-600">MiGasto</span>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Crea tu cuenta gratuita</p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              id="nombre_completo"
              label="Nombre completo"
              type="text"
              placeholder="Juan Pérez"
              autoComplete="name"
              error={errors.nombre_completo?.message}
              {...register('nombre_completo')}
            />
            <Input
              id="email"
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              id="password"
              label="Contraseña"
              type="password"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                id="edad"
                label="Edad"
                type="number"
                placeholder="25"
                min="1"
                error={errors.edad?.message}
                {...register('edad')}
              />
              <Input
                id="telefono"
                label="Teléfono"
                type="tel"
                placeholder="3001234567"
                autoComplete="tel"
                error={errors.telefono?.message}
                {...register('telefono')}
              />
            </div>
            <SelectField
              id="id_genero"
              label="Género"
              loading={loadingCatalogos}
              error={errors.id_genero?.message}
              {...register('id_genero')}
            >
              <option value="">Seleccionar...</option>
              {generos.map((g) => (
                <option key={g.id_genero} value={g.id_genero}>{g.nombre}</option>
              ))}
            </SelectField>
            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting || loadingCatalogos || !rolUsuarioId}
            >
              {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
