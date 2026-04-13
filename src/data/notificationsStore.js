// 站内通知（本地存储）；接入后端后可替换为接口
const STORAGE_KEY = 'budget-travel-inbox'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function save(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {}
}

function emitInbox() {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('budget-travel-inbox'))
}

/**
 * @param {{ title: string, body?: string, kind?: string }} item
 */
export function pushInbox(item) {
  const list = load()
  const entry = {
    id: 'n-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    title: item.title,
    body: item.body || '',
    kind: item.kind || 'info',
    at: new Date().toISOString(),
    read: false,
  }
  list.unshift(entry)
  save(list.slice(0, 50))
  emitInbox()
  return entry
}

export function listInbox() {
  return load()
}

export function unreadCount() {
  return load().filter((n) => !n.read).length
}

export function markRead(id) {
  const list = load().map((n) => (n.id === id ? { ...n, read: true } : n))
  save(list)
  emitInbox()
}

export function markAllRead() {
  const list = load().map((n) => ({ ...n, read: true }))
  save(list)
  emitInbox()
}
