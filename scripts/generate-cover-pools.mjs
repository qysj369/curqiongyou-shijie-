/**
 * 聚合各国封面池：攻略 cover/gallery、目的地头图、精选路线、中/日/美专用池、extras 白名单可解析的 URL。
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outPath = path.join(__dirname, '../src/data/coverPoolsGenerated.js')

const { articles } = await import('../src/data/articlesData.js')
const { destinations, featuredRoutes } = await import('../src/data/mockData.js')
const { COVER_ALLOWLIST_EXTRA_IDS } = await import('../src/data/coverAllowlistExtras.js')
const { coverGeoPolicyAllows } = await import('../src/data/coverGeoPolicy.js')
const { COVER_BANNED_UNSPLASH_IDS } = await import('../src/data/coverBannedPhotoIds.js')
const BR = await import('../src/data/budgetRouteGenerator.js')

function photoId(url) {
  const m = /images\.unsplash\.com\/photo-(\d+)-/i.exec(url || '')
  return m ? m[1] : null
}

function normalizeUnsplash(url) {
  if (!url || typeof url !== 'string') return url
  if (!url.includes('images.unsplash.com/photo-')) return url
  const base = url.split('?')[0]
  return `${base}?w=600`
}

/** id -> 任意出现过的规范 URL（供 extras 数字 id 还原） */
const idToUrl = new Map()

function rememberUrl(url) {
  const id = photoId(url)
  if (id && !idToUrl.has(id)) idToUrl.set(id, normalizeUnsplash(url))
}

/** @type {Record<string, Map<string, string>>} */
const byDest = {}

function add(dest, url) {
  if (!dest || !url || typeof url !== 'string') return
  const pid = photoId(url)
  if (pid && COVER_BANNED_UNSPLASH_IDS.has(pid)) return
  if (!coverGeoPolicyAllows(dest, url)) return
  rememberUrl(url)
  const id = photoId(url)
  if (!id) return
  if (!byDest[dest]) byDest[dest] = new Map()
  if (!byDest[dest].has(id)) {
    byDest[dest].set(id, normalizeUnsplash(url))
  }
}

for (const a of articles) {
  add(a.destination, a.cover)
  if (Array.isArray(a.gallery)) {
    for (const u of a.gallery.slice(0, 12)) add(a.destination, u)
  }
}

for (const d of destinations) {
  if (d?.name && d.image) add(d.name, d.image)
}

for (const r of featuredRoutes || []) {
  if (r?.destination) {
    add(r.destination, r.cover || r.image)
  }
}

const chinaUrls = [
  ...BR.CHINA_COVER_POOL,
  BR.CHINA_COVER_PEARL_DELTA,
  BR.CHINA_COVER_YANGTZE_DELTA,
  BR.CHINA_COVER_BEIJING_TJ_HE,
]
chinaUrls.forEach((u) => add('中国', u))
;[...BR.JAPAN_COVER_POOL, BR.JAPAN_COVER_FUJI_CHUREITO].forEach((u) => add('日本', u))
BR.USA_COVER_POOL.forEach((u) => add('美国', u))

for (const [dest, ids] of Object.entries(COVER_ALLOWLIST_EXTRA_IDS)) {
  for (const id of ids) {
    const u = idToUrl.get(id)
    if (u) add(dest, u)
  }
}

const COVER_URLS_BY_DESTINATION = {}
for (const [dest, idMap] of Object.entries(byDest)) {
  COVER_URLS_BY_DESTINATION[dest] = [...idMap.values()]
}

const body = JSON.stringify(COVER_URLS_BY_DESTINATION, null, 2)
fs.writeFileSync(
  outPath,
  `/**\n * 由 scripts/generate-cover-pools.mjs 自动生成 — 勿手改。\n * 更新：npm run generate:cover-pools\n */\nexport const COVER_URLS_BY_DESTINATION = ${body}\n`,
  'utf8',
)

const total = Object.values(COVER_URLS_BY_DESTINATION).reduce((n, a) => n + a.length, 0)
console.log('[generate-cover-pools] wrote', outPath)
console.log('  destinations:', Object.keys(COVER_URLS_BY_DESTINATION).length, 'unique urls total:', total)
