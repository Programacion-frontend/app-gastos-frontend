import { useEffect } from 'react'
import { Outlet, Scripts, ScrollRestoration, Links, Meta } from 'react-router'
import { Toaster } from 'react-hot-toast'

import useAuthStore from './store/useAuthStore'
import './index.css'

export function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>mi-gasto</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  const checkSession = useAuthStore((s) => s.checkSession)

  useEffect(() => {
    checkSession()
  }, [])

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-gray-100',
          duration: 3500,
        }}
      />
      <Outlet />
    </>
  )
}
