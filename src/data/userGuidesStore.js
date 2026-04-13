// 用户生成的穷游攻略（UGC）— 本地存储，与 PGC 一起形成真实攻略内容
const STORAGE_KEY = 'budget-travel-user-guides'

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function saveAll(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {}
}

/** 生成唯一 id，用于路由 /articles/ug-xxx */
export function createUserGuideId() {
  return 'ug-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9)
}

/**
 * @typedef {'pending' | 'published'} ReviewStatus
 */

/**
 * @typedef {{
 *   id: string
 *   destinationName: string
 *   title: string
 *   budget: number
 *   days: number
 *   content: string
 *   author: string
 *   createdAt: string
 *   linkedArticleId?: string | null
 *   status?: ReviewStatus
 *   reviewedAt?: string
 * }} UserGuide
 */

function normalizeGuide(g) {
  if (!g) return g
  return {
    ...g,
    status: g.status || 'published',
  }
}

/**
 * @param {Partial<UserGuide>} guide
 * @returns {UserGuide}
 */
export function addUserGuide(guide) {
  const list = loadAll()
  const id = guide.id || createUserGuideId()
  const createdAt = guide.createdAt || new Date().toISOString()
  const entry = {
    id,
    destinationName: guide.destinationName || '',
    title: guide.title || '',
    budget: Number(guide.budget) || 0,
    days: Number(guide.days) || 0,
    content: guide.content || '',
    author: guide.author || '',
    createdAt,
    linkedArticleId: guide.linkedArticleId ?? null,
    status: guide.status !== undefined ? guide.status : 'pending',
    reviewedAt: guide.reviewedAt,
  }
  list.unshift(entry)
  saveAll(list)
  return entry
}

/** @returns {UserGuide[]} 按时间倒序 */
export function getAllUserGuides() {
  return [...loadAll()].map(normalizeGuide).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/** @param {string} id 如 ug-xxx */
export function getUserGuideById(id) {
  if (!id || !id.startsWith('ug-')) return null
  const g = loadAll().find((x) => x.id === id)
  return g ? normalizeGuide(g) : null
}

/** @param {string} destinationName 目的地名称，如 泰国 */
export function getUserGuidesByDestination(destinationName) {
  if (!destinationName) return []
  return loadAll()
    .map(normalizeGuide)
    .filter((g) => g.destinationName === destinationName)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/** @param {string} articleId 关联的 PGC 攻略 id，如 a1 */
export function getUserGuidesByArticleId(articleId) {
  if (!articleId) return []
  return loadAll()
    .map(normalizeGuide)
    .filter((g) => g.linkedArticleId === articleId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/**
 * 用于攻略列表页：把 UGC 转成与 articles 同构的卡片项（含 source: 'user'）
 * @returns {Array<{ id: string, title: string, destination: string, budget: number, days: number, author: string, date: string, cover: string, tags: string[], source: 'user' }>}
 */
export function getUserGuidesAsCards() {
  return getAllUserGuides().map((g) => ({
    id: g.id,
    title: g.title,
    destination: g.destinationName,
    budget: g.budget,
    days: g.days,
    author: g.author,
    date: g.createdAt.slice(0, 10),
    cover: DEFAULT_COVER,
    tags: ['网友分享'],
    source: 'user',
    reviewStatus: g.status || 'published',
  }))
}

export { DEFAULT_COVER as userGuideDefaultCover }
