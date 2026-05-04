/**
 * Table — componente de tabla reutilizable
 *
 * columns: Array<{ key: string, label: string, render?: (row) => ReactNode, className?: string }>
 * rows:    Array<object>
 * rowKey:  string | ((row) => string|number)  — clave única por fila
 */
export default function Table({ columns = [], rows = [], rowKey = 'id', emptyMessage = 'Sin datos' }) {
  const getKey = typeof rowKey === 'function' ? rowKey : (r) => r[rowKey]

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide',
                  'text-gray-500 dark:text-gray-400',
                  col.className ?? '',
                ].join(' ')}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getKey(row)}
                className="border-b border-gray-100 dark:border-gray-700/60 last:border-0 hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={['px-4 py-3 text-gray-800 dark:text-gray-200', col.className ?? ''].join(' ')}
                  >
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
