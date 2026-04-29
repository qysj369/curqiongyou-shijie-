/**
 * 攻略封面 URL 池：主图 + 全站攻略聚合（coverPoolsGenerated）+ coverVariantOverrides，按 photo-id 去重。
 * 供 budgetRouteGenerator 与 coverGeoAllowlist 结构白名单共用。
 */
import { PRIMARY_IMAGE_BY_COUNTRY } from './destinationPrimaryImages.js'
import { COVER_VARIANT_OVERRIDES } from './coverVariantOverrides.js'
import { COVER_URLS_BY_DESTINATION } from './coverPoolsGenerated.js'
import { coverGeoPolicyAllows } from './coverGeoPolicy.js'
import { COVER_BANNED_UNSPLASH_IDS } from './coverBannedPhotoIds.js'

function photoId(url) {
  const m = /images\.unsplash\.com\/photo-(\d+)-/i.exec(url || '')
  return m ? m[1] : null
}

export function buildCoverUrlPoolForDestination(name) {
  const primary = PRIMARY_IMAGE_BY_COUNTRY[name]
  const fromArticles = COVER_URLS_BY_DESTINATION[name] || []
  const manual = COVER_VARIANT_OVERRIDES[name] || []
  const list = [primary, ...fromArticles, ...manual].filter(Boolean)
  const seen = new Set()
  const out = []
  for (const u of list) {
    const id = photoId(u)
    if (!id || seen.has(id)) continue
    if (COVER_BANNED_UNSPLASH_IDS.has(id)) continue
    if (!coverGeoPolicyAllows(name, u)) continue
    seen.add(id)
    out.push(u)
  }
  if (out.length) return out
  if (primary) {
    const pid = photoId(primary)
    if (pid && COVER_BANNED_UNSPLASH_IDS.has(pid)) return []
    return [primary]
  }
  return []
}

/** 供结构白名单：每个目的地对应的去重 URL 列表 */
export function eachDestinationCoverPools() {
  return Object.keys(PRIMARY_IMAGE_BY_COUNTRY).map((name) => [name, buildCoverUrlPoolForDestination(name)])
}
