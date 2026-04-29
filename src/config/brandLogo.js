/**
 * 品牌静态资源（public/brand）。换图：覆盖对应文件或改下方文件名。
 */
export const BRAND_LOGO_MARK_FILE = 'brand/logo-mark.svg'
export const BRAND_LOGO_LOCKUP_FILE = 'brand/roamwise-lockup.png'

function publicUrl(file) {
  const base = import.meta.env.BASE || '/'
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}${file}`
}

/** 内联 R 标备用 / 外链引用 */
export function brandLogoMarkUrl() {
  return publicUrl(BRAND_LOGO_MARK_FILE)
}

/** 横版锁图（图标 + Roamwise 字标） */
export function brandLogoLockupUrl() {
  return publicUrl(BRAND_LOGO_LOCKUP_FILE)
}
