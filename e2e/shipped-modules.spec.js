import { test, expect } from '@playwright/test'
import { FEATURE_MODULE_PATH } from '../src/product/featureModules.js'

test.describe('six shipped modules', () => {
  test('each primary route renders a visible non-empty main h1', async ({ page }) => {
    for (const pathname of Object.values(FEATURE_MODULE_PATH)) {
      await page.goto(pathname)
      const h1 = page.locator('main').getByRole('heading', { level: 1 })
      await expect(h1).toBeVisible()
      await expect(h1).not.toHaveText('')
    }
  })
})

test.describe('URL bridges', () => {
  test('advisor strips ?q= after prefill delay', async ({ page }) => {
    await page.goto('/advisor?q=e2e_prefill_ping')
    await expect(page).toHaveURL(/[?&]q=/)
    await page.waitForTimeout(1100)
    await expect(page).not.toHaveURL(/[?&]q=/)
  })

  test('library applies ?paste= then clears query', async ({ page }) => {
    await page.goto('/library?paste=e2e_clipboard_seed')
    await expect(page.locator('main textarea').first()).toHaveValue('e2e_clipboard_seed')
    await expect(page).not.toHaveURL(/paste=/)
  })

  test('trip-ai prefills destination & days then cleans query', async ({ page }) => {
    await page.goto('/trip-ai?destination=E2E_Kyoto&days=4')
    await expect(page).toHaveURL(/\/trip-ai\/?$/)
    const formSection = page.locator('main section.rounded-2xl').first()
    await expect(formSection.locator('input').first()).toHaveValue('E2E_Kyoto')
    await expect(formSection.locator('input[type="number"]').first()).toHaveValue('4')
  })
})
