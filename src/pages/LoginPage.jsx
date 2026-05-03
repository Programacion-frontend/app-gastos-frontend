import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'

import useAuthStore from '../store/useAuthStore'
import { Input, Button } from '../components/ui'
import { ThemeToggle } from '../components/ui'

const schema = z.object({
  email:    z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export default function LoginPage() {
  const login    = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      await login(data)
      toast.success('¡Bienvenido de vuelta!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Credenciales incorrectas'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold text-violet-600">MiGasto</span>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ingresa a tu cuenta
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
