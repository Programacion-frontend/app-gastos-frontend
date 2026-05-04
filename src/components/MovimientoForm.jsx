/**
 * MovimientoForm — formulario compartido para crear / editar movimientos.
 * Filtra las categorías por `tipo` ('gasto' | 'ingreso') y cuando se
 * recibe `tipo`, selecciona automáticamente esa categoría sin permitir cambio.
 */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input, Button } from './ui'

const schema = z.object({
  monto:        z.coerce.number({ invalid_type_error: 'Ingresa un monto válido' }).positive('El monto debe ser mayor a 0'),
  fecha:        z.string().min(1, 'La fecha es requerida').regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD'),
  descripcion:  z.string().optional(),
  id_categoria: z.coerce.number({ invalid_type_error: 'Selecciona una categoría' }).min(1, 'La categoría es requerida'),
  id_moneda:    z.coerce.number().optional().nullable(),
})

export default function MovimientoForm({
  defaultValues,
  categorias = [],
  tipo,             // 'gasto' | 'ingreso' — filtra y bloquea la categoría
  onSubmit,
  onCancel,
}) {
  // Filtra las categorías según el tipo recibido
  const categoriasDelTipo = tipo
    ? categorias.filter((c) => c.tipo_categoria?.toLowerCase() === tipo)
    : categorias

  // Si hay tipo definido, tomar el id de la primera categoría que coincida
  // (en modo edición se respeta el id_categoria que viene en defaultValues)
  const categoriaFija = categoriasDelTipo[0]?.id_categoria ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      fecha:        new Date().toISOString().split('T')[0],
      id_categoria: categoriaFija,
    },
  })

  const handleFormSubmit = async (data) => {
    await onSubmit({
      monto:        Number(data.monto),
      fecha:        data.fecha,
      descripcion:  data.descripcion || undefined,
      id_categoria: Number(data.id_categoria),
      id_moneda:    data.id_moneda ? Number(data.id_moneda) : undefined,
    })
  }

  const isEditing = !!defaultValues

  // La categoría se bloquea siempre que venga un `tipo` definido
  const categoriaFijada = !!tipo

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          id="monto"
          label="Monto"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.monto?.message}
          {...register('monto')}
        />
        <Input
          id="fecha"
          label="Fecha"
          type="date"
          error={errors.fecha?.message}
          {...register('fecha')}
        />
      </div>

      <Input
        id="descripcion"
        label="Descripción (opcional)"
        type="text"
        placeholder={tipo === 'ingreso' ? 'Ej: Salario, freelance...' : 'Ej: Almuerzo, pago de luz...'}
        error={errors.descripcion?.message}
        {...register('descripcion')}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="id_categoria" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Categoría <span className="text-red-500">*</span>
        </label>
        <select
          id="id_categoria"
          disabled={categoriaFijada}
          className={[
            'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
            'bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100',
            categoriaFijada
              ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
              : '',
            errors.id_categoria
              ? 'border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-gray-600',
          ].join(' ')}
          {...register('id_categoria')}
        >
          {/* Si no hay tipo fijado, mostrar opción vacía inicial */}
          {!categoriaFijada && <option value="">Seleccionar categoría...</option>}

          {categoriasDelTipo.map((c) => (
            <option key={c.id_categoria} value={c.id_categoria}>
              {c.tipo_categoria}
            </option>
          ))}
        </select>
        {errors.id_categoria && (
          <p className="text-xs text-red-500">{errors.id_categoria.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting
            ? isEditing ? 'Guardando...' : 'Creando...'
            : isEditing ? 'Guardar cambios' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}
