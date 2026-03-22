/**
 * Production canonical host: https://www.theuploader.in
 * Override with VITE_SITE_URL in env (e.g. Vercel project settings).
 */
export function getSiteUrl() {
  const raw = import.meta.env.VITE_SITE_URL || 'https://www.theuploader.in'
  return String(raw).trim().replace(/\/+$/, '')
}

/** Path like "/image-to-pdf" or "/" */
export function canonicalUrl(pathname) {
  const base = getSiteUrl()
  if (!pathname || pathname === '/') {
    return `${base}/`
  }
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${base}${p.replace(/\/+$/, '') || '/'}`
}
