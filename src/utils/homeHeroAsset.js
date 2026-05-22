/** 与 public/hero-home.jpg 同步；改图后递增以刷新 CDN/浏览器缓存 */
export const HOME_HERO_VERSION = '20260523mock'

/** 明亮结伴旅行 · Unsplash */
export const HOME_HERO_FALLBACK =
  'https://images.unsplash.com/photo-1529156069898-bcefb029e104?w=1920&q=88&auto=format'

export function homeHeroAsset(filename) {
  const base = import.meta.env.BASE_URL || '/'
  const root = base.endsWith('/') ? base : `${base}/`
  return `${root}${filename}?v=${HOME_HERO_VERSION}`
}
