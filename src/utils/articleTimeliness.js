/** 距今超过该天数则视为「可能过时」 */
export const STALE_AFTER_DAYS = 365

/**
 * @param {{ date?: string, updatedAt?: string } | null | undefined} article
 * @returns {string | null} ISO 日期字符串 YYYY-MM-DD，用于展示「最后更新」
 */
export function getLastUpdatedDay(article) {
  if (!article) return null
  const raw = article.updatedAt || article.date
  if (!raw || typeof raw !== 'string') return null
  return raw.slice(0, 10)
}

/**
 * @param {{ date?: string, updatedAt?: string } | null | undefined} article
 * @param {Date} [now]
 */
export function isPossiblyOutdated(article, now = new Date()) {
  const day = getLastUpdatedDay(article)
  if (!day) return false
  const t = new Date(day + 'T12:00:00')
  if (Number.isNaN(t.getTime())) return false
  const ms = now.getTime() - t.getTime()
  return ms > STALE_AFTER_DAYS * 24 * 60 * 60 * 1000
}
