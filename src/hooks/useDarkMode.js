import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const el = document.documentElement
    const observer = new MutationObserver(() =>
      setIsDark(el.classList.contains('dark'))
    )
    observer.observe(el, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark
}
