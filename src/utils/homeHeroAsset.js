/** 与 public/hero-home.jpg 同步；改图后递增以刷新 CDN/浏览器缓存 */
export const HOME_HERO_VERSION = '20260522b'

/** Matheus Ferrero · Unsplash — 与 hero-home.jpg 同场景 */
export const HOME_HERO_FALLBACK =
  'https://images.unsplash.com/photo-1547981609-4b6a09b7a341?w=1920&q=82&auto=format'

export function homeHeroAsset(filename) {
  const base = import.meta.env.BASE_URL || '/'
  const root = base.endsWith('/') ? base : `${base}/`
  return `${root}${filename}?v=${HOME_HERO_VERSION}`
}
