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

test('stage assessments open in their own view', async ({ page }) => {
  await page.goto('/#/learn?stage=foundation')
  await page.getByRole('link', { name: 'Take the stage test' }).click()
  await expect(page).toHaveURL(/learn\/stage\/foundation\/test/)
  await expect(page.locator('h1', { hasText: 'Foundation stage test' })).toBeVisible()
  await expect(page.getByText('This assessment contains 50 questions.')).toBeVisible()
})

test('stage assessment locks answers on next and only moves forward', async ({ page }) => {
  await page.goto('/#/learn/stage/foundation/test')
  await page.locator('input[type="radio"]').first().check()
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByText('Question 2 of 50')).toBeVisible()
  await expect(page.getByRole('button', { name: /Previous/ })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Lock answer' })).toHaveCount(0)
})

test('authenticated learners can complete a lesson and earn a stage badge', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'authenticated', 'Set E2E_AUTH_STORAGE_STATE to run authenticated coverage.')

  await page.goto('/#/learn/what-is-ai')
  await page.getByRole('radio', { name: 'A music app suggesting a song you may like' }).check()
  await page.getByRole('radio', { name: 'Different methods can help software find patterns, make predictions, understand language, or choose useful actions' }).check()
  await page.reload()
  await expect(page.getByRole('radio', { name: 'A music app suggesting a song you may like' })).toBeChecked()
  await expect(page.getByRole('radio', { name: 'Different methods can help software find patterns, make predictions, understand language, or choose useful actions' })).toBeChecked()
  for (const label of ['Practice', 'Explain', 'Evidence']) await page.getByRole('checkbox', { name: new RegExp(label) }).check()
  await page.getByRole('button', { name: 'Mark lesson complete' }).click()

  await page.goto('/#/learn?stage=foundation')
  const incompleteLessonButtons = page.locator('button[aria-label^="Mark"][aria-label$="complete"]')
  while (await incompleteLessonButtons.count()) await incompleteLessonButtons.first().click()

  await page.goto('/#/learn/stage/foundation/test')
  await page.locator('input[type="radio"]').first().check()
  await page.getByRole('button', { name: 'Next question' }).click()
  await page.reload()
  await expect(page.getByText('Question 2 of 50')).toBeVisible()

  const authoredAnswers = [
    'It finds patterns and produces a prediction or recommendation',
    'Whether the model memorized the training examples and whether the evaluation data is representative',
    'Read the output, isolate the smallest failing example, and change one assumption at a time',
  ]
  await page.getByRole('radio', { name: authoredAnswers[1] }).check()
  await page.getByRole('button', { name: 'Next question' }).click()
  await page.getByRole('radio', { name: authoredAnswers[2] }).check()
  await page.getByRole('button', { name: 'Next question' }).click()
  for (let question = 3; question < 50; question += 1) {
    await page.locator('input[type="radio"]').first().check()
    await page.getByRole('button', { name: question === 49 ? 'Finish test' : 'Next question' }).click()
  }
  await expect(page.getByText('50/50')).toBeVisible()

  await page.goto('/#/dashboard')
  await page.getByRole('button', { name: 'Badges' }).click()
  await expect(page.getByText('Foundation badge earned')).toBeVisible()
})

test('invalid lesson routes redirect without crashing', async ({ page }) => {
  await page.goto('/#/learn/not-a-real-lesson')
  await expect(page).toHaveURL(/#\/learn$/)
  await expect(page.getByRole('heading', { name: 'From first steps to AI architecture.' })).toBeVisible()
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
  for (const route of ['/', '/#/learn', '/#/portfolio', '/#/about']) {
    await page.goto(route)
    const results = await new AxeBuilder({ page }).analyze()
    const serious = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')
    expect(serious, `${route} accessibility violations: ${serious.map((violation) => violation.id).join(', ')}`).toEqual([])
  }
})
