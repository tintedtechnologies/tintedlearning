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
  { path: '/', title: 'Learn AI without the overwhelm', description: 'Free, friendly AI education with plain-language lessons, interactive practice, and portfolio projects.' },
  { path: '/learn', title: 'Learn', description: 'Explore independent sections in AI, math, Python, research, software engineering, AI engineering, cloud, security, and certifications.' },
  { path: '/about', title: 'About Tinted Learning', description: 'Tinted Learning is a free bridge into AI understanding, browser practice, trusted resources, and portfolio evidence.' },
  { path: '/playground', title: 'AI Playgrounds', description: 'Practice AI concepts through interactive Python, tokens, context, prompting, embeddings, RAG, and agent experiments.' },
  { path: '/portfolio', title: 'Portfolio Studio', description: 'Turn your learning into public projects, useful artifacts, and evidence of how you make technical decisions.' },
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
  await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`)
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