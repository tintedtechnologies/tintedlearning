import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('homepage exposes onboarding routes and donation link', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Where should I start?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'I want to become a Python developer' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'I like math and research' })).toBeVisible()
  if (await page.getByRole('button', { name: 'Open menu' }).count()) await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('link', { name: 'Donate' })).toHaveAttribute('target', '_blank')
  await expect(page.getByRole('link', { name: 'Donate' })).toHaveAttribute('href', /buymeacoffee\.com/)
})

test('direct stage links open the requested stage', async ({ page }) => {
  await page.goto('/#/learn?stage=professional-practice')
  const stage = page.locator('details#professional-practice')
  await expect(stage).toHaveAttribute('open', '')
  await expect(stage.getByText('Customer Discovery and Conversations', { exact: true })).toBeVisible()
})

test('portfolio studio exposes current project tracks and detail guides', async ({ page }) => {
  await page.goto('/#/portfolio')
  await expect(page.getByRole('heading', { name: 'Evaluate and operate an AI system' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Build a technical leadership portfolio' })).toBeVisible()
  await page.goto('/#/portfolio/ai-system-evaluation')
  await expect(page.getByText('Build steps', { exact: true })).toBeVisible()
  await page.locator('summary', { hasText: 'Red-team and inspect failures' }).click()
  await expect(page.locator('summary', { hasText: 'Red-team and inspect failures' })).toBeVisible()
})

test('guest plan route offers free continuation', async ({ page }) => {
  await page.goto('/#/dashboard?section=plan&goal=python-developer')
  await expect(page.getByRole('heading', { name: 'Choose how to continue' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Continue free' })).toHaveAttribute('href', /learn\?stage=foundation/)
  await expect(page.getByRole('button', { name: 'Save my plan' })).toBeVisible()
})

test('homepage has no horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test('key public pages have no serious accessibility violations', async ({ page }) => {
  for (const route of ['/', '/#/learn', '/#/portfolio']) {
    await page.goto(route)
    const results = await new AxeBuilder({ page }).analyze()
    const serious = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')
    expect(serious, `${route} accessibility violations: ${serious.map((violation) => violation.id).join(', ')}`).toEqual([])
  }
})
