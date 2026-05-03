export default function Card({ children, className = '', onClick }) {
  const interactive = onClick
    ? 'cursor-pointer hover:shadow-md transition-shadow'
    : ''

  return (
    <div
      onClick={onClick}
      className={[
        'rounded-xl border border-gray-200 bg-white p-4 shadow-sm',
        'dark:border-gray-700 dark:bg-gray-800',
        interactive,
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-3 flex items-center justify-between ${className}`}>
      {children}
    </div>
  )
}

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base font-semibold text-gray-800 dark:text-gray-100 ${className}`}>
      {children}
    </h3>
  )
}

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-3 border-t border-gray-100 pt-3 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  )
}
