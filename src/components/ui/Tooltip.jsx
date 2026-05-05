import { useState, useRef } from 'react'

const transformMap = {
  top:    'translate(-50%, -100%)',
  bottom: 'translate(-50%, 0%)',
  left:   'translate(-100%, -50%)',
  right:  'translate(0%, -50%)',
}

export default function Tooltip({ text, position = 'top', children }) {
  const [visible, setVisible] = useState(false)
  const [coords,  setCoords]  = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)

  const updateCoords = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()

    let top  = 0
    let left = 0

    switch (position) {
      case 'top':    top = rect.top - 8;              left = rect.left + rect.width / 2; break
      case 'bottom': top = rect.bottom + 8;           left = rect.left + rect.width / 2; break
      case 'left':   top = rect.top + rect.height / 2; left = rect.left - 8;             break
      case 'right':  top = rect.top + rect.height / 2; left = rect.right + 8;            break
    }

    setCoords({ top, left })
  }

  const handleMouseEnter = () => {
    updateCoords()
    setVisible(true)
  }

  return (
    <>
      <span
        ref={triggerRef}
        className="relative inline-flex"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
        onFocus={handleMouseEnter}
        onBlur={() => setVisible(false)}
      >
        {children}
      </span>

      {visible && text && (
        <span
          role="tooltip"
          style={{
            position:  'fixed',
            top:       coords.top,
            left:      coords.left,
            transform: transformMap[position],
            zIndex:    9999,
          }}
          className="pointer-events-none whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium shadow-md bg-gray-900 text-white dark:bg-gray-700"
        >
          {text}
        </span>
      )}
    </>
  )
}
