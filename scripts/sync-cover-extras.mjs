/**
 * 根据当前 articles 封面与「结构白名单」差集，重写 src/data/coverAllowlistExtras.js。
 * 新文章若使用合规但非主图/池的 Unsplash，跑一次本脚本即可通过 validate:cover。
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { articles } from '../src/data/articlesData.js'
import {
  buildStructuralCoverIdsByDestination,
  extractUnsplashPhotoId,
} from '../src/data/coverGeoAllowlist.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outFile = path.join(__dirname, '../src/data/coverAllowlistExtras.js')

const structural = buildStructuralCoverIdsByDestination()

/** @type {Record<string, Set<string>>} */
const needed = {}

function consider(dest, url) {
  if (!dest || typeof dest !== 'string') return
  const id = extractUnsplashPhotoId(url)
  if (!id) return
  const allowed = structural[dest]
  if (allowed?.has(id)) return
  if (structural['__fallback__']?.has(id)) return
  if (!needed[dest]) needed[dest] = new Set()
  needed[dest].add(id)
}

for (const a of articles) {
  consider(a.destination, a.cover)
  if (Array.isArray(a.gallery)) {
    for (const u of a.gallery) consider(a.destination, u)
  }
}

const sortedDests = Object.keys(needed).sort()
const lines = sortedDests.map((d) => {
  const ids = [...needed[d]].sort((x, y) => Number(x) - Number(y))
  return `  '${d}': [${ids.map((x) => `'${x}'`).join(', ')}],`
})

const header = `/**
 * 额外允许的 Unsplash photo-id（仅数字串），按目的地名。
 * 由 scripts/sync-cover-extras.mjs 根据 articles 与结构白名单差集生成，可手工删改纠错。
 */

/** @type {Record<string, string[]>} */
export const COVER_ALLOWLIST_EXTRA_IDS = {
`

const footer = `
}
`

fs.writeFileSync(outFile, header + lines.join('\n') + footer, 'utf8')
console.log('written', outFile, 'destinations with extras:', sortedDests.length)
