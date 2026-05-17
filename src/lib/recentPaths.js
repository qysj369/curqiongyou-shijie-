/** 用户中心「历史」页：本机最近访问路径（无账号云同步） */

export const RECENT_PATHS_KEY = 'roamwise:recent-paths'

const MAX_ENTRIES = 14

/**
 * @param {string} fullPath pathname + search，如 `/routes?sort=budgetAsc`
 */
export function recordRecentPath(fullPath) {
  if (typeof fullPath !== 'string' || !fullPath.startsWith('/') || fullPath.startsWith('//')) return
  try {
    const raw = localStorage.getItem(RECENT_PATHS_KEY)
    let list = raw ? JSON.parse(raw) : []
    if (!Array.isArray(list)) list = []
    const at = new Date().toISOString()
    const next = [{ path: fullPath, at }, ...list.filter((x) => x && x.path !== fullPath)].slice(0, MAX_ENTRIES)
    localStorage.setItem(RECENT_PATHS_KEY, JSON.stringify(next))
  } catch {
    /* noop */
  }
}

/** @returns {{ path: string, at: string }[]} */
export function loadRecentPaths() {
  try {
    const raw = localStorage.getItem(RECENT_PATHS_KEY)
    const list = raw ? JSON.parse(raw) : []
    if (!Array.isArray(list)) return []
    return list.filter(
      (x) => x && typeof x.path === 'string' && x.path.startsWith('/') && !x.path.startsWith('//'),
    )
  } catch {
    return []
  }
}

export function clearRecentPaths() {
  try {
    localStorage.removeItem(RECENT_PATHS_KEY)
  } catch {
    /* noop */
  }
}
