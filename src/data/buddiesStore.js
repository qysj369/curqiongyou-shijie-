// 找旅伴 — 本地存储，旅伴匹配增强归属感
const STORAGE_KEY = 'budget-travel-buddies'

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

function nextId() {
  return `buddy-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * @typedef {{ id: string, destination: string, dateFrom: string, dateTo: string, intro: string, author: string, createdAt: string }} BuddyPost
 */

/** @param {Partial<BuddyPost>} post */
export function addBuddyPost(post) {
  const list = loadAll()
  const id = post.id || nextId()
  const createdAt = post.createdAt || new Date().toISOString()
  const entry = {
    id,
    destination: (post.destination || '').trim(),
    dateFrom: (post.dateFrom || '').trim(),
    dateTo: (post.dateTo || '').trim(),
    intro: (post.intro || '').trim(),
    author: (post.author || '').trim() || '旅友',
    createdAt,
  }
  list.unshift(entry)
  saveAll(list)
  return entry
}

/** @returns {BuddyPost[]} 按时间倒序 */
export function getAllBuddyPosts() {
  return [...loadAll()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
