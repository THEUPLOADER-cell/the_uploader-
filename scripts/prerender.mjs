import fs from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import handler from 'serve-handler'
import { chromium } from 'playwright'
import { PRERENDER_PATHS } from './prerender-paths.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(__dirname, '../dist')

/** Extra time after readiness so Framer Motion / layout paint settle (ms). */
const RENDER_SETTLE_MS = Number(process.env.PRERENDER_SETTLE_MS || 2000)

function distPathForRoute(routePath) {
  if (routePath === '/') {
    return path.join(dist, 'index.html')
  }
  const clean = routePath.replace(/^\/+/, '').replace(/\/+$/, '')
  return path.join(dist, clean, 'index.html')
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
}

function startStaticServer(root, port) {
  const server = http.createServer((req, res) =>
    handler(req, res, {
      public: root,
      rewrites: [{ source: '**', destination: '/index.html' }],
    })
  )
  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', () => resolve(server))
    server.on('error', reject)
  })
}

/**
 * Wait until the route has real UI in <main>: not Suspense fallback, enough text, route-specific signals.
 */
async function waitForFullyRendered(page, routePath) {
  await page.waitForSelector('link[rel="canonical"]', { state: 'attached', timeout: 60000 })
  await page.waitForSelector('meta[name="description"][content]', { state: 'attached', timeout: 60000 })

  await page.locator('main h1').first().waitFor({ state: 'visible', timeout: 90000 })

  await page.waitForFunction(
    (path) => {
      const main = document.querySelector('main')
      if (!main) return false
      const text = (main.innerText || '').trim()
      if (text.length < 280) return false

      if (path === '/') {
        return (
          text.includes('Most Used Tools') ||
          text.includes('All tools') ||
          (text.includes('THE UPLOADER') && text.length > 400)
        )
      }
      if (path === '/help') {
        return text.includes('upload') && text.length > 350
      }
      if (path === '/privacy-policy') {
        return text.includes('Privacy') && text.length > 350
      }
      const hasToolCard = !!main.querySelector('.shadow-card')
      const hasUploadOrToolUi =
        !!main.querySelector('[class*="border-dashed"]') ||
        !!main.querySelector('input[type="file"]') ||
        !!main.querySelector('button[type="button"]')
      return hasToolCard && (hasUploadOrToolUi || text.length > 450)
    },
    routePath,
    { timeout: 90000 }
  )

  await page.waitForFunction(
    () => {
      const main = document.querySelector('main')
      if (!main) return true
      const spinners = main.querySelectorAll(
        '.border-t-transparent.rounded-full, [class*="animate-spin"]'
      )
      for (const el of spinners) {
        const r = el.getBoundingClientRect()
        if (r.width > 0 && r.height > 0) return false
      }
      return true
    },
    { timeout: 30000 }
  )

  // Framer Motion whileInView: slow scroll so staggered sections actually reach their "show" state.
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const step = Math.max(160, Math.floor(window.innerHeight * 0.55))
    for (let y = 0; y <= max; y += step) {
      window.scrollTo(0, y)
      await sleep(320)
    }
    window.scrollTo(0, max)
    await sleep(1200)
    window.scrollTo(0, 0)
    await sleep(400)
  })

  if (routePath === '/') {
    await page.locator('main h2').filter({ hasText: 'Most Used Tools' }).scrollIntoViewIfNeeded()
    await page
      .waitForFunction(
        () => {
          const h2 = [...document.querySelectorAll('main h2')].find((el) =>
            (el.textContent || '').includes('Most Used Tools')
          )
          if (!h2) return false
          return parseFloat(getComputedStyle(h2).opacity || '0') >= 0.85
        },
        { timeout: 15000 }
      )
      .catch(() => {})
  }

  await new Promise((r) => setTimeout(r, RENDER_SETTLE_MS))
}

async function main() {
  try {
    await fs.access(path.join(dist, 'index.html'))
  } catch {
    console.error('[prerender] dist/index.html missing. Run `vite build` first.')
    process.exit(1)
  }

  const port = Number(process.env.PRERENDER_PORT || 47821)
  const server = await startStaticServer(dist, port)
  const base = `http://127.0.0.1:${port}`

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewportSize({ width: 1280, height: 720 })

    for (const routePath of PRERENDER_PATHS) {
      const url = `${base}${routePath === '/' ? '/' : routePath}`
      process.stdout.write(`[prerender] ${routePath} ... `)

      await page.goto(url, { waitUntil: 'load', timeout: 120000 })

      try {
        await page.waitForLoadState('networkidle', { timeout: 12000 })
      } catch {
        /* pdf workers / long-polling can block networkidle; continue */
      }

      await waitForFullyRendered(page, routePath)

      const html = await page.content()
      const outFile = distPathForRoute(routePath)
      await ensureDir(outFile)
      await fs.writeFile(outFile, html, 'utf8')

      console.log(`→ ${path.relative(dist, outFile)}`)
    }
  } finally {
    await browser.close()
    await new Promise((resolve) => server.close(resolve))
  }

  console.log(`[prerender] Done. ${PRERENDER_PATHS.length} pages written.`)
}

main().catch((err) => {
  console.error('[prerender] Failed:', err)
  process.exit(1)
})
