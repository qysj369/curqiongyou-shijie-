/**
 * 封面图地理标志（Unsplash photo-id）白名单：与目的地绑定，用于构建期校验。
 * 结构集 = 各国封面池（主图+coverVariantOverrides）+ 中/日/美专用池；其余合规 id 在 coverAllowlistExtras.js。
 */

import {
  CHINA_COVER_POOL,
  CHINA_COVER_PEARL_DELTA,
  CHINA_COVER_YANGTZE_DELTA,
  CHINA_COVER_BEIJING_TJ_HE,
  JAPAN_COVER_POOL,
  JAPAN_COVER_FUJI_CHUREITO,
  USA_COVER_POOL,
  FALLBACK_EXTRA_COVER,
} from './budgetRouteGenerator.js'
import { COVER_ALLOWLIST_EXTRA_IDS } from './coverAllowlistExtras.js'
import { eachDestinationCoverPools } from './coverPoolUrls.js'

/**
 * @param {string | undefined | null} url
 * @returns {string | null} Unsplash 图片 id（photo- 后第一段数字）
 */
export function extractUnsplashPhotoId(url) {
  if (!url || typeof url !== 'string') return null
  const m = /images\.unsplash\.com\/photo-(\d+)-/i.exec(url)
  return m ? m[1] : null
}

function addTo(map, dest, url) {
  const id = extractUnsplashPhotoId(url)
  if (!id) return
  if (!map[dest]) map[dest] = new Set()
  map[dest].add(id)
}

/**
 * 不含 extras：各国至少主图；中国/日本含全部生成用封面池。
 * @returns {Record<string, Set<string>>}
 */
export function buildStructuralCoverIdsByDestination() {
  /** @type {Record<string, Set<string>>} */
  const map = {}

  for (const [name, urls] of eachDestinationCoverPools()) {
    for (const u of urls) addTo(map, name, u)
  }

  const chinaUrls = [
    ...CHINA_COVER_POOL,
    CHINA_COVER_PEARL_DELTA,
    CHINA_COVER_YANGTZE_DELTA,
    CHINA_COVER_BEIJING_TJ_HE,
  ]
  for (const u of chinaUrls) addTo(map, '中国', u)

  const japanUrls = [...JAPAN_COVER_POOL, JAPAN_COVER_FUJI_CHUREITO]
  for (const u of japanUrls) addTo(map, '日本', u)

  for (const u of USA_COVER_POOL) addTo(map, '美国', u)

  addTo(map, '__fallback__', FALLBACK_EXTRA_COVER)

  return map
}

/**
 * 结构集 + coverAllowlistExtras 合并后的允许 id（按目的地）。
 * @returns {Record<string, Set<string>>}
 */
export function buildFullCoverAllowlistByDestination() {
  const structural = buildStructuralCoverIdsByDestination()
  /** @type {Record<string, Set<string>>} */
  const out = {}
  for (const [dest, set] of Object.entries(structural)) {
    out[dest] = new Set(set)
  }
  for (const [dest, ids] of Object.entries(COVER_ALLOWLIST_EXTRA_IDS)) {
    if (!out[dest]) out[dest] = new Set()
    for (const id of ids) {
      if (typeof id === 'string' && /^\d+$/.test(id)) out[dest].add(id)
    }
  }
  return out
}

/**
 * @param {string} destination
 * @param {string | undefined} coverUrl
 * @param {Record<string, Set<string>>} [fullAllowlist] 默认 buildFullCoverAllowlistByDestination()
 */
export function isCoverAllowedForDestination(destination, coverUrl, fullAllowlist) {
  const list = fullAllowlist ?? buildFullCoverAllowlistByDestination()
  const id = extractUnsplashPhotoId(coverUrl)
  if (!id) return { ok: true, reason: 'non-unsplash-or-empty' }
  const set = list[destination]
  if (!set) return { ok: false, reason: 'unknown-destination', id }
  if (set.has(id)) return { ok: true, id }
  const fb = list['__fallback__']
  if (fb?.has(id)) return { ok: true, id, reason: 'fallback-pool' }
  return { ok: false, id, reason: 'id-not-in-allowlist' }
}
