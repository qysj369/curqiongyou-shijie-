/** 站点绝对地址（用于 canonical / og:url）。构建时设置 VITE_SITE_URL，勿尾斜杠。 */
export function getSiteOrigin() {
  const v = import.meta.env?.VITE_SITE_URL
  if (!v || typeof v !== 'string') return ''
  const s = v.trim().replace(/\/$/, '')
  return /^https?:\/\//i.test(s) ? s : ''
}

/** 当前部署 base（与 Vite `base` 一致，如 /budget-travel）。 */
export function getBasePath() {
  const base = import.meta.env.BASE_URL || '/'
  if (base === '/') return ''
  return base.replace(/\/$/, '')
}

/**
 * @param {string} pathname - React Router 的 location.pathname（不含 basename）
 */
export function absolutePageUrl(pathname) {
  const origin = getSiteOrigin()
  if (!origin) return ''
  const basePath = getBasePath()
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${origin}${basePath}${path}`
}

/**
 * 将站内路径或已是 https 的图片地址转为绝对 URL（用于 og:image）。
 * @param {string} url
 */
export function toAbsoluteMediaUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const u = url.trim()
  if (/^https?:\/\//i.test(u)) return u
  return absolutePageUrl(u.startsWith('/') ? u : `/${u}`)
}

/** 默认分享图：优先 VITE_OG_IMAGE（完整 https），否则用站点 favicon 的绝对地址 */
export function getDefaultOgImageUrl() {
  const custom = import.meta.env.VITE_OG_IMAGE?.trim()
  if (custom && /^https?:\/\//i.test(custom)) return custom
  return toAbsoluteMediaUrl('/favicon.svg')
}
