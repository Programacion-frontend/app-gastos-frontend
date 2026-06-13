const colorMap = {
  violet: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  green:  'bg-green-100  text-green-700  dark:bg-green-900/40  dark:text-green-300',
  red:    'bg-red-100    text-red-700    dark:bg-red-900/40    dark:text-red-300',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  blue:   'bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-300',
  gray:   'bg-gray-100   text-gray-700   dark:bg-gray-700      dark:text-gray-300',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  pink:   'bg-pink-100   text-pink-700   dark:bg-pink-900/40   dark:text-pink-300',
}

export const CATEGORY_COLORS = {
  Comida:      'green',
  Transporte:  'blue',
  Ocio:        'violet',
  Salud:       'red',
  Educación:   'yellow',
  Ropa:        'pink',
  Servicios:   'orange',
  Otro:        'gray',
}

export default function Badge({ label, color = 'gray', className = '' }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorMap[color] ?? colorMap.gray,
        className,
      ].join(' ')}
    >
      {label}
    </span>
  )
}
