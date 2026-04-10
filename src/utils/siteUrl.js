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
