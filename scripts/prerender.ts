import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { lessons } from '../src/data/curriculum'
import { learningSections } from '../src/data/learningSections'

const root = dirname(fileURLToPath(import.meta.url))
const dist = join(root, '..', 'dist')
const siteUrl = process.env.VITE_SITE_URL || 'https://tintedlearning.com'
const shareImage = `${siteUrl}/tintedlearninglogo.png`

const publicPages = [
  { path: '/', title: 'Learn tech without the overwhelm', description: 'Free, friendly tech education, from first code to AI, with plain-language lessons, interactive practice, and portfolio projects.' },
  { path: '/learn', title: 'Learn', description: 'Explore independent sections in AI, math, Python, research, software engineering, AI engineering, cloud, security, and certifications.' },
  { path: '/about', title: 'About Tinted Learning', description: 'Tinted Learning is a free way into tech for learners who have been left out of technical education, with browser practice and portfolio projects.' },
  { path: '/why-this-matters', title: 'Why this matters', description: 'For Black students and students without the resources to learn computing, the gap starts in school. The sourced evidence, with links to each study.' },
  { path: '/playground', title: 'AI Playgrounds', description: 'Practice AI concepts through interactive Python, tokens, context, temperature, prompting, embeddings, and agent experiments.' },
  { path: '/playground/python', title: 'Python playground', description: 'Practice Python in your browser without installing anything. Start with a guided exercise, change the code, and run it.' },
  { path: '/playground/tokens', title: 'Tokens playground', description: 'See how text is split into tokens, and why token count differs from word count.' },
  { path: '/playground/context', title: 'Context windows playground', description: 'See what fits in a context window, and what a model can no longer see when a conversation exceeds the limit.' },
  { path: '/playground/temperature', title: 'Temperature playground', description: 'See how temperature changes the variation in a model response.' },
  { path: '/playground/prompt-builder', title: 'Prompt builder', description: 'Shape the role, task, context, and output of a prompt, and see how a clearer request reads.' },
  { path: '/playground/embeddings', title: 'Embeddings playground', description: 'Compare the meaning of sentences with a small embedding model that runs locally in your browser.' },
  { path: '/playground/agents', title: 'AI agents playground', description: 'Watch an agent plan, act, and check its work, and decide whether to approve or deny its next action.' },
  { path: '/portfolio', title: 'Portfolio Studio', description: 'Turn your learning into public projects, useful artifacts, and evidence of how you make technical decisions.' },
  { path: '/terms', title: 'Terms', description: 'The terms for using Tinted Learning.' },
  { path: '/privacy', title: 'Privacy', description: 'What Tinted Learning collects, what it does not, and how your data is handled.' },
]

function escapeAttribute(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function metadataHtml(title: string, description: string, path: string) {
  const pageTitle = `${title} | Tinted Learning`
  const canonical = `${siteUrl}${path === '/' ? '/' : `${path}/`}`
  return `<title>${escapeAttribute(pageTitle)}</title><meta name="description" content="${escapeAttribute(description)}" /><meta property="og:title" content="${escapeAttribute(pageTitle)}" /><meta property="og:description" content="${escapeAttribute(description)}" /><meta property="og:url" content="${escapeAttribute(canonical)}" /><meta property="og:image" content="${escapeAttribute(shareImage)}" /><meta name="twitter:title" content="${escapeAttribute(pageTitle)}" /><meta name="twitter:description" content="${escapeAttribute(description)}" /><meta name="twitter:image" content="${escapeAttribute(shareImage)}" /><link rel="canonical" href="${escapeAttribute(canonical)}" />`
}

function applyMetadata(template: string, title: string, description: string, path: string) {
  const withoutRouteMetadata = template
    .replace(/<title>.*?<\/title>/, '')
    .replace(/\s*<meta name="description"[^>]*\/>/, '')
    .replace(/\s*<meta property="og:[^"]+"[^>]*\/>/g, '')
    .replace(/\s*<meta name="twitter:[^"]+"[^>]*\/>/g, '')
  return withoutRouteMetadata.replace('</head>', `${metadataHtml(title, description, path)}</head>`)
}

async function writeRoute(template: string, page: { path: string; title: string; description: string }) {
  if (page.path === '/') {
    await writeFile(join(dist, 'index.html'), applyMetadata(template, page.title, page.description, page.path))
    return
  }
  const routeFile = join(dist, page.path.slice(1), 'index.html')
  await mkdir(dirname(routeFile), { recursive: true })
  await writeFile(routeFile, applyMetadata(template, page.title, page.description, page.path))
}

async function main() {
  const template = await readFile(join(dist, 'index.html'), 'utf8')
  const lessonPages = lessons.map((lesson) => ({ path: `/learn/${lesson.id}`, title: lesson.title, description: lesson.description }))
  const sectionPages = learningSections.map((section) => ({ path: `/learn/sections/${section.id}`, title: section.title, description: section.description }))
  const pages = [...publicPages, ...sectionPages, ...lessonPages]
  for (const page of pages) await writeRoute(template, page)

  const sitemap = pages.map((page) => `  <url><loc>${siteUrl}${page.path === '/' ? '/' : `${page.path}/`}</loc></url>`).join('\n')
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`
  await writeFile(join(dist, 'sitemap.xml'), sitemapXml)
  // Keep the copy in public/ identical, so the file in the repository never goes stale.
  await writeFile(join(root, '..', 'public', 'sitemap.xml'), sitemapXml)
  await writeFile(join(dist, '404.html'), applyMetadata(template, 'Page not found', 'The page you requested could not be found.', '/404'))

  for (const page of pages) {
    const routeFile = page.path === '/' ? join(dist, 'index.html') : join(dist, page.path.slice(1), 'index.html')
    const html = await readFile(routeFile, 'utf8')
    const expectedTitle = `<title>${escapeAttribute(`${page.title} | Tinted Learning`)}</title>`
    const expectedCanonical = `<link rel="canonical" href="${escapeAttribute(`${siteUrl}${page.path === '/' ? '/' : `${page.path}/`}`)}" />`
    if (!html.includes(expectedTitle) || !html.includes(expectedCanonical) || !html.includes(`name="description" content="${escapeAttribute(page.description)}"`)) {
      throw new Error(`Prerendered metadata is incomplete for ${page.path}`)
    }
  }
}

void main()