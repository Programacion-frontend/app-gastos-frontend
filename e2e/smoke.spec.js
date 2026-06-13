import { test, expect } from '@playwright/test'

test('landing page renders the main heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('finanzas')
})

test('login page renders the login form', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByLabel('Correo electrónico')).toBeVisible()
  await expect(page.getByLabel('Contraseña')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeVisible()
})

test('dashboard redirects to login when logged out', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login$/)
})
