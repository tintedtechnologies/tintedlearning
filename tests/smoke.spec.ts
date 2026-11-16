import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('homepage exposes onboarding routes and donation link', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Start with your goal.' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'I want to become a Python developer' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'I like math and research' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'I want to lead technical work' })).toBeVisible()
  await expect(page.getByText('Free forever', { exact: true })).toBeVisible()
  await expect(page.getByText('Sample evaluation report')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Start the 5-minute AI lesson' })).toHaveAttribute('href', '/learn/what-is-ai')
  await expect(page.getByText('pat', { exact: true })).toBeVisible()
  await expect(page.getByText('terns', { exact: true })).toBeVisible()
  if (await page.getByRole('button', { name: 'Open menu' }).count()) await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('link', { name: 'Donate' })).toHaveAttribute('target', '_blank')
  await expect(page.getByRole('link', { name: 'Donate' })).toHaveAttribute('href', /buymeacoffee\.com/)
})

test('token playground shows real subword pieces', async ({ page }) => {
  await page.goto('/playground/tokens')
  await page.getByLabel('Write something').fill('unbelievable 2026!')
  await expect(page.getByText('un', { exact: true })).toBeVisible()
  await expect(page.getByText('bel', { exact: true })).toBeVisible()
  await expect(page.getByText('ievable', { exact: true })).toBeVisible()
  await expect(page.getByText('202', { exact: true })).toBeVisible()
  await expect(page.getByText('6', { exact: true })).toBeVisible()
})

test('embeddings playground is linked again and loads on demand', async ({ page }) => {
  await page.goto('/playground')
  await page.getByRole('link', { name: /Embeddings/ }).click()
  await expect(page).toHaveURL(/\/playground\/embeddings$/)
  await expect(page.getByRole('heading', { name: 'Can AI compare meaning?' })).toBeVisible()
})

test('retired playground routes redirect and agents require approval', async ({ page }) => {
  await page.goto('/playground/rag')
  await expect(page).toHaveURL(/\/playground$/)
  await page.goto('/playground/agents')
  await page.getByRole('button', { name: '0 free slots' }).click()
  await expect(page.getByText(/checking for 30-minute slots instead/i)).toBeVisible()
  await expect(page.getByText(/Add six 30-minute study blocks/i)).toBeVisible()
  await page.getByRole('button', { name: 'Approve' }).click()
  await expect(page.getByText(/Added: Mon 6:00 to 6:30 pm/i)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Run again' })).toBeVisible()
})

test('Python playground presents browser-friendly errors', async ({ page }) => {
  await page.goto('/playground/python')
  const code = page.getByLabel('Python code')
  await expect(code).toBeVisible()
  await code.fill('print(input("Name: "))')
  await page.getByRole('button', { name: /Run Python|Loading Python/ }).click()
  await expect(page.getByText(/Input is not interactive in this browser playground/)).toBeVisible({ timeout: 15000 })
})

test('prompt builder has four fields and copies the assembled prompt', async ({ page }) => {
  await page.goto('/playground/prompt-builder')
  await expect(page.getByLabel('Desired output')).toBeVisible()
  await page.getByRole('button', { name: 'Copy prompt' }).click()
  await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible()
})

test('key lesson and certification links resolve', async ({ page }) => {
  for (const route of ['/learn/math-research-capstone', '/learn/sections/certifications']) {
    await page.goto(route)
    await expect(page).not.toHaveURL(/\/$/)
    await expect(page.locator('h1')).toBeVisible()
  }
})

test('legacy stage links redirect to their compatible section', async ({ page }) => {
  await page.goto('/learn?stage=professional-practice')
  await expect(page).toHaveURL(/\/learn\/sections\/technical-leadership$/)
  await expect(page.getByRole('heading', { name: 'Technical Leadership & Communication', level: 1 })).toBeVisible()
  await expect(page.getByText('Customer Discovery and Conversations', { exact: true })).toBeVisible()
})

test('every section has a direct route and Math, Python, and Research are independent', async ({ page }) => {
  const sections = ['foundations', 'math', 'python', 'research', 'software-engineering', 'technical-leadership', 'ai-engineering', 'cloud-engineering', 'security', 'projects', 'certifications']
  for (const section of sections) {
    await page.goto(`/learn/sections/${section}`)
    await expect(page).toHaveURL(new RegExp(`/learn/sections/${section}$`))
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('meta[name="description"]')).not.toHaveAttribute('content', '')
  }
  await page.goto('/learn/sections/foundations')
  await expect(page.getByRole('heading', { name: 'Foundations', level: 1 })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Python', exact: true })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Math', exact: true })).toHaveCount(0)
})

test('new learners get a clear Learn-page starting point', async ({ page }) => {
  await page.goto('/learn')
  await expect(page.getByText('New here?', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Start Learning' })).toBeVisible()
  await expect(page.getByText('Each section stands on its own. New to AI? Start with Foundations, or jump straight to what you need.', { exact: true })).toBeVisible()
  await expect(page.getByText('Looking for certifications?')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign in to start your portfolio' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'See an example' })).toBeVisible()
})

test('Foundations points beginners toward Python without mislabeling the lesson', async ({ page }) => {
  await page.goto('/learn/sections/foundations')
  await expect(page.getByRole('heading', { name: 'Programming Fundamentals', level: 2 })).toBeVisible()
  await expect(page.getByText('Continue with the Python section')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Cloud Fundamentals', level: 2 })).toBeVisible()
  await expect(page.getByText('Basic familiarity with files, applications, and the internet.')).toBeVisible()
})

test('certifications catalog says Tinted Learning does not issue credentials, and filters work', async ({ page }) => {
  await page.goto('/learn/sections/certifications')
  await expect(page.getByRole('heading', { name: /Credentials that count on a resume/, level: 1 })).toBeVisible()
  await expect(page.getByText('Tinted Learning does not issue these credentials.')).toBeVisible()
  await expect(page.getByText(/Showing 21 of 21/)).toBeVisible()
  await page.getByRole('button', { name: 'AI', exact: true }).click()
  await expect(page.getByText(/Showing 3 of 21/)).toBeVisible()
  await page.getByRole('button', { name: 'Free', exact: true }).click()
  await expect(page.getByText(/No credentials match|Showing 1 of 21/)).toBeVisible()
})

test('old certification detail URLs redirect to the catalog', async ({ page }) => {
  await page.goto('/learn/certification/cloud-architect')
  await expect(page).toHaveURL(/\/learn\/sections\/certifications$/)
})

test('lesson pages expose unique clean-url metadata', async ({ page }) => {
  await page.goto('/learn/what-is-ai')
  await expect(page).toHaveTitle(/What is Artificial Intelligence\? \| Tinted Learning/)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Define AI/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/learn\/what-is-ai$/)
})

test('first lesson turns learning into saved evidence', async ({ page }) => {
  await page.goto('/learn/what-is-ai')
  await expect(page.getByRole('link', { name: 'Start the 5-minute AI lesson' })).toHaveCount(0)
  const evidence = page.getByLabel('Your example')
  await expect(evidence).toBeVisible()
  await evidence.fill('My music app takes in listening history and predicts songs I may enjoy.')
  await evidence.blur()
  await expect(evidence).toHaveValue('My music app takes in listening history and predicts songs I may enjoy.')
  await expect(page.getByRole('button', { name: 'Mark lesson complete' })).toBeEnabled()
  await expect(page.getByRole('link', { name: 'Next lesson' })).toBeVisible()
  await expect(page.getByText('Learning loop')).toHaveCount(0)
  const quickChecks = page.getByRole('heading', { name: 'Check your understanding' })
  const optionalReading = page.getByRole('heading', { name: 'Go deeper (optional)' })
  await expect(quickChecks).toBeVisible()
  await expect(optionalReading).toBeVisible()
  const headings = await page.locator('h2').allTextContents()
  expect(headings.indexOf('Check your understanding')).toBeLessThan(headings.indexOf('Go deeper (optional)'))
  expect(headings.slice(0, 3)).toEqual(["What you'll learn", 'The big idea', 'Why it matters'])
})

test('lesson quiz advances numbering after each answer', async ({ page }) => {
  await page.goto('/learn/what-is-ai')
  await expect(page.getByText('Question 1 of 3')).toBeVisible()
  await page.getByRole('button', { name: 'A music app suggesting a song you may like' }).click()
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByText('Question 2 of 3')).toBeVisible()
  await page.getByRole('button', { name: /Using patterns learned from many faces/ }).click()
  await expect(page.getByText(/Correct\. The model learned what makes faces similar/)).toBeVisible()
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByText('Question 3 of 3')).toBeVisible()
  await page.getByRole('button', { name: 'Previous question' }).click()
  await expect(page.getByText('Question 2 of 3')).toBeVisible()
  await page.getByRole('button', { name: 'Retry quiz' }).click()
  await expect(page.getByText('Question 1 of 3')).toBeVisible()
})

test('section assessments open in their own view', async ({ page }) => {
  await page.goto('/learn/sections/foundations')
  await page.getByRole('link', { name: 'Foundations assessment' }).click()
  await expect(page).toHaveURL(/learn\/stage\/foundation\/test/)
  await expect(page.locator('h1', { hasText: 'Foundations assessment' })).toBeVisible()
  await expect(page.getByText('This assessment contains 3 questions.')).toBeVisible()
})

test('stage assessment locks answers on next and only moves forward', async ({ page }) => {
  await page.goto('/learn/stage/foundation/test')
  await page.locator('input[type="radio"]').first().check()
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByText('Question 2 of 3')).toBeVisible()
  await expect(page.getByRole('button', { name: /Previous/ })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Lock answer' })).toHaveCount(0)
})

test('authenticated learners can complete a lesson and earn an existing badge', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'authenticated', 'Set E2E_AUTH_STORAGE_STATE to run authenticated coverage.')

  await page.goto('/learn/what-is-ai')
  await page.getByRole('radio', { name: 'A music app suggesting a song you may like' }).check()
  await page.getByRole('radio', { name: 'Different methods can help software find patterns, make predictions, understand language, or choose useful actions' }).check()
  await page.reload()
  await expect(page.getByRole('radio', { name: 'A music app suggesting a song you may like' })).toBeChecked()
  await expect(page.getByRole('radio', { name: 'Different methods can help software find patterns, make predictions, understand language, or choose useful actions' })).toBeChecked()
  for (const label of ['Practice', 'Explain', 'Evidence']) await page.getByRole('checkbox', { name: new RegExp(label) }).check()
  await page.getByRole('button', { name: 'Mark lesson complete' }).click()

  await page.goto('/learn/sections/foundations')
  const incompleteLessonButtons = page.locator('button[aria-label^="Mark"][aria-label$="complete"]')
  while (await incompleteLessonButtons.count()) await incompleteLessonButtons.first().click()

  await page.goto('/learn/stage/foundation/test')
  await page.locator('input[type="radio"]').first().check()
  await page.getByRole('button', { name: 'Next question' }).click()
  await page.reload()
  await expect(page.getByText('Question 2 of 3')).toBeVisible()

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
    await page.getByRole('button', { name: question === 49 ? 'Finish assessment' : 'Next question' }).click()
  }
  await expect(page.getByText('50/50')).toBeVisible()

  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Badges' }).click()
  await expect(page.getByText('Foundation badge earned')).toBeVisible()
})

test('invalid lesson routes redirect without crashing', async ({ page }) => {
  await page.goto('/learn/not-a-real-lesson')
  await expect(page).toHaveURL(/\/learn$/)
  await expect(page.getByRole('heading', { name: 'Choose what you want to learn.' })).toBeVisible()
})

test('portfolio studio exposes current project tracks and detail guides', async ({ page }) => {
  await page.goto('/portfolio')
  await expect(page.getByRole('heading', { name: 'Jordan Lee', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Projects · GitHub links' })).toBeVisible()
  await page.goto('/portfolio/ai-system-evaluation')
  await expect(page.getByText('Build steps', { exact: true })).toBeVisible()
  await page.locator('summary', { hasText: 'Red-team and inspect failures' }).click()
  await expect(page.locator('summary', { hasText: 'Red-team and inspect failures' })).toBeVisible()
})

test('signed-out visitors can view the finished portfolio example', async ({ page }) => {
  await page.goto('/portfolio/example')
  await expect(page.getByRole('heading', { name: 'Jordan Lee', exact: true })).toBeVisible()
  await expect(page.getByText('This example shows the new portfolio format')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Professional summary' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign in to build your portfolio' })).toBeVisible()
})

test('guest plan route offers free continuation', async ({ page }) => {
  await page.goto('/dashboard?section=plan&goal=python-developer')
  await expect(page.getByRole('heading', { name: 'Choose how to continue' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Continue free' })).toHaveAttribute('href', /learn\/sections\/python/)
  await expect(page.getByRole('button', { name: 'Save my plan' })).toBeVisible()
})

test('guest math route selects the independent Math section', async ({ page }) => {
  await page.goto('/dashboard?section=plan&goal=ai-mathematics')
  await page.getByRole('link', { name: 'Continue free' }).click()
  await expect(page).toHaveURL(/\/learn\/sections\/math$/)
  await expect(page.getByRole('heading', { name: 'Math', level: 1 })).toBeVisible()
})

test('homepage has no horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test('learning sections have no horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/learn')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  await page.goto('/learn/sections/certifications')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test('key public pages have no serious accessibility violations', async ({ page }) => {
  for (const route of ['/', '/learn', '/learn/sections/foundations', '/learn/sections/certifications', '/portfolio', '/about']) {
    await page.goto(route)
    const results = await new AxeBuilder({ page }).analyze()
    const serious = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')
    expect(serious, `${route} accessibility violations: ${serious.map((violation) => violation.id).join(', ')}`).toEqual([])
  }
})

test('every live lesson renders the standard sections without generic filler', async ({ page }) => {
  test.setTimeout(600_000)
  const { structuredLessons } = await import('../src/data/lessons')
  const fillerPatterns = [/Which situation best matches/, /What should you inspect first when applying/, /The important implementation detail/, /Read the example, then change one input/, /Part 1/]
  for (const [lessonId, lesson] of Object.entries(structuredLessons)) {
    await page.goto(`/learn/${lessonId}`, { waitUntil: 'networkidle' })
    await page.waitForLoadState('networkidle')
    const headings = await page.locator('h2').allTextContents()
    const expected = ["What you'll learn", 'The big idea', 'Why it matters', ...lesson.goalSections.map((section) => section.heading), 'See it in action', ...(lesson.tryIt ? ['Try it yourself'] : []), 'Common mistakes', 'Check your understanding', 'Key takeaway', 'Go deeper (optional)']
    expect(headings.slice(0, expected.length), lessonId).toEqual(expected)
    await expect(page.getByText('Question 1 of 3'), lessonId).toBeVisible()
    const body = await page.locator('article').innerText()
    for (const pattern of fillerPatterns) expect(body, `${lessonId} contains ${pattern}`).not.toMatch(pattern)
  }
})

test('python playground opens the lesson starter code', async ({ page }) => {
  await page.goto('/playground/python?lesson=python-control-flow')
  await expect(page.getByLabel('Python code')).toHaveValue(/scores = \[82, 45, 67, 91, 58\]/)
})

test('unfinished sections show as coming soon while finished ones link', async ({ page }) => {
  await page.goto('/learn')
  await expect(page.getByRole('link', { name: /Software Engineering/ }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /^AI Engineering/ }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /^Cloud Engineering/ }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /^Security/ }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /^Research/ }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /^Technical Leadership/ }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /^Projects/ }).first()).toBeVisible()
})

test('removed algorithms lesson redirects to python search and sort', async ({ page }) => {
  await page.goto('/learn/algorithms-and-data-structures')
  await expect(page).toHaveURL(/\/learn\/python-search-and-sort$/)
})

test('every revised project page shows the project sections in order, with the show-your-work parts', async ({ page }) => {
  for (const slug of ['build-a-chatbot', 'capstone-rag', 'capstone-agent', 'capstone-evaluation', 'math-research-capstone', 'automate-a-real-task', 'analyze-a-public-dataset', 'build-for-a-real-client']) {
    await page.goto(`/learn/${slug}`, { waitUntil: 'networkidle' })
    const headings = await page.locator('h2').allTextContents()
    expect(headings, slug).toEqual(['What you\'ll build', 'Before you start', 'Requirements', 'Milestones', 'Finished means', 'Show your work', 'Stretch goals'])
    await expect(page.getByText('A short write-up (about 300 words)'), slug).toBeVisible()
    await expect(page.getByText('A demo GIF or screen recording (under 60 seconds)'), slug).toBeVisible()
    await expect(page.getByText('Quick checks'), slug).toHaveCount(0)
  }
})

test('the old production project URL redirects to the merged chatbot project', async ({ page }) => {
  await page.goto('/learn/chatbot-production')
  await expect(page).toHaveURL(/\/learn\/build-a-chatbot$/)
})

test('the Projects section cards show real project times and no old template lines', async ({ page }) => {
  await page.goto('/learn/sections/projects', { waitUntil: 'networkidle' })
  await expect(page.getByText('about 8 hours, plus the deploy')).toBeVisible()
  await expect(page.getByText(/How to design a complete RAG workflow/)).toHaveCount(0)
  await expect(page.getByText(/Helpful context:/)).toHaveCount(0)
})

test('footer newsletter sends only the email address to the Google Form response endpoint', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  const input = page.locator('#newsletter-email')
  test.skip((await input.count()) === 0, 'Set VITE_NEWSLETTER_FORM_URL to show the newsletter form.')
  let posted = ''
  await page.route('**/formResponse**', async (route) => {
    posted = route.request().postData() ?? ''
    await route.fulfill({ status: 200, body: '' })
  })
  await input.fill('reader@example.com')
  await page.getByRole('button', { name: 'Subscribe' }).click()
  await expect(page.getByText('Thanks. You are on the list.')).toBeVisible()
  expect(new URLSearchParams(posted).get('entry.1332342356')).toBe('reader@example.com')
  expect([...new URLSearchParams(posted).keys()]).toEqual(['entry.1332342356'])
})

test('section totals are shown in hours, and no minute totals remain', async ({ page }) => {
  await page.goto('/learn/sections/projects', { waitUntil: 'networkidle' })
  await expect(page.getByText('About 3 hours total', { exact: true }).first()).toBeVisible()
  await expect(page.getByText(/\d+ min total/)).toHaveCount(0)
})

test('the Learn page links to the certifications catalog, and the old URLs redirect there', async ({ page }) => {
  await page.goto('/learn', { waitUntil: 'networkidle' })
  await expect(page.getByRole('link', { name: /Open the catalog/ })).toHaveAttribute('href', '/learn/sections/certifications')
  for (const path of ['/certifications', '/learn/certifications']) {
    await page.goto(path)
    await expect(page).toHaveURL(/\/learn\/sections\/certifications$/)
  }
})

test('the ISC2 card says the free program closed and shows the exam as paid', async ({ page }) => {
  await page.goto('/learn/sections/certifications', { waitUntil: 'networkidle' })
  await expect(page.getByText(/closed its free One Million Certified in Cybersecurity program on May 20, 2026/)).toBeVisible()
  await expect(page.getByText(/exam codes issued under it can be used until December 31, 2026/i)).toBeVisible()
})

test('the public header has no sign-up prompt', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByRole('button', { name: /^Sign up$/ })).toHaveCount(0)
})

test('the Instagram link appears in the footer and on the About page', async ({ page }) => {
  await page.goto('/about', { waitUntil: 'networkidle' })
  await expect(page.getByRole('link', { name: 'Instagram: @tintedtechnologies' })).toHaveAttribute('href', 'https://www.instagram.com/tintedtechnologies')
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', 'https://www.instagram.com/tintedtechnologies')
})

test('the About page shows its call to action near the top, and the statistics page links every source', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/about', { waitUntil: 'networkidle' })
  await expect(page.getByRole('link', { name: /Explore the pathway/ }).first()).toBeInViewport()
  await expect(page.getByRole('link', { name: /Try Python/ }).first()).toBeInViewport()
  await page.goto('/why-this-matters', { waitUntil: 'networkidle' })
  await expect(page.getByRole('link', { name: /OECD, PISA 2025 Results/ }).first()).toHaveAttribute('href', 'https://www.oecd.org/en/publications/2026/09/pisa-2025-results-volume-i_5265bfb1.html')
  await expect(page.getByRole('link', { name: /UNESCO, Global Education Monitoring Report 2023/ })).toHaveAttribute('href', 'https://www.unesco.org/gem-report/en/technology')
})
