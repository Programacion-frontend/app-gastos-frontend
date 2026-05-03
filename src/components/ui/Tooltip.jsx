import { useState } from 'react'

const positionMap = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
}

export default function Tooltip({ text, position = 'top', children }) {
  const [visible, setVisible] = useState(false)

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <span
          role="tooltip"
          className={[
            'pointer-events-none absolute z-50 whitespace-nowrap rounded-md px-2.5 py-1',
            'text-xs font-medium shadow-md',
            'bg-gray-900 text-white dark:bg-gray-700',
            positionMap[position],
          ].join(' ')}
        >
          {text}
        </span>
      )}
    </span>
  )
}
