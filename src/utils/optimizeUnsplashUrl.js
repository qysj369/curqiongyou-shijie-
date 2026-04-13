/**
 * Normalize Unsplash image URLs with width, height, quality and format hints.
 * Non-Unsplash URLs are returned unchanged.
 *
 * @param {string} url
 * @param {{ w?: number; h?: number; q?: number; fit?: string; auto?: string }} [opts]
 * @returns {string}
 */
export function optimizeUnsplashUrl(url, opts = {}) {
  if (!url || typeof url !== 'string') return url
  if (!url.includes('images.unsplash.com')) return url
  const { w = 1200, h, q = 75, fit = 'max', auto = 'format' } = opts
  try {
    const u = /^https?:\/\//i.test(url) ? new URL(url) : new URL(url, 'https://images.unsplash.com')
    if (w != null) u.searchParams.set('w', String(w))
    if (h != null) u.searchParams.set('h', String(h))
    if (q != null) u.searchParams.set('q', String(q))
    if (fit) u.searchParams.set('fit', fit)
    if (auto) u.searchParams.set('auto', auto)
    return u.toString()
  } catch {
    return url
  }
}
