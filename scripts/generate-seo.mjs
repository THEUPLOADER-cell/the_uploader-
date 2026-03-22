import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { TOOLS } from '../src/data/tools.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://www.theuploader.in')
  .trim()
  .replace(/\/+$/, '')

const publicDir = path.join(projectRoot, 'public')
fs.mkdirSync(publicDir, { recursive: true })

const CORE_PAGES = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/help', changefreq: 'monthly', priority: '0.4' },
  { loc: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
]

const canonicalToolPaths = Array.from(new Set(TOOLS.map((t) => t.to))).sort()
const TOOL_PAGES = canonicalToolPaths.map((p) => ({
  loc: p,
  changefreq: 'weekly',
  priority: p === '/pdf-compressor' || p === '/image-to-pdf' ? '0.95' : '0.8',
}))

function xmlEscape(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

const urls = [...CORE_PAGES, ...TOOL_PAGES]

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${xmlEscape(`${SITE_URL}${u.loc}`)}</loc>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        `  </url>`
    )
    .join('\n') +
  `\n</urlset>\n`

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8')

const robots =
  `User-agent: *\n` +
  `Allow: /\n\n` +
  `# Dev-only paths are not deployed; listed for crawlers that probe common URLs\n` +
  `Disallow: /src/\n` +
  `Disallow: /node_modules/\n\n` +
  `Sitemap: ${SITE_URL}/sitemap.xml\n`

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8')

console.log(`[seo] Wrote public/sitemap.xml and public/robots.txt for ${SITE_URL}`)

