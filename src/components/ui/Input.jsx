import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, id, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={[
          'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
          'bg-white text-gray-900 placeholder-gray-400',
          'dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            : 'border-gray-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-gray-600',
          className,
        ].join(' ')}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
})

export default Input
