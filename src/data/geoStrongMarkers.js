/**
 * 强地理性标志（全站目标）
 *
 * 建设与验收顺序：**先亚洲各国**，再按洲推进至**全部国家/地区**（与 heroCoverRollout 的 HERO_PHASE 一致）。
 *
 * 各国封面/头图应优先锚定 `destinationPrimaryImages` + `primaryImageGeoFixes` 合并后的主图，
 * 辅以封面池与 coverGeoPolicy 过滤；标题层由 geoLandmarkPools / ensureLandmarkInTitle 约束。
 *
 * 自动补篇：`pickWeightedStrongGeoCover` 在约半数场景固定使用该国「主锚点」URL，
 * 其余在合规池内轮换，避免弱泛用图占比过高。
 */
import { PRIMARY_IMAGE_BY_COUNTRY } from './destinationPrimaryImages.js'
import { buildCoverUrlPoolForDestination } from './coverPoolUrls.js'

export const STRONG_GEO_FALLBACK_COVER =
  'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600'

function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/**
 * @param {string} destinationName 与 mockData destinations[].name 一致
 * @param {string} title
 * @param {number} idNum
 * @param {number} seqForDest
 */
export function pickWeightedStrongGeoCover(destinationName, title, idNum, seqForDest) {
  const pool = buildCoverUrlPoolForDestination(destinationName)
  if (!pool.length) return STRONG_GEO_FALLBACK_COVER

  const primary = PRIMARY_IMAGE_BY_COUNTRY[destinationName]
  const anchor = primary && pool.includes(primary) ? primary : pool[0]

  const roll = hashStr(`${destinationName}|${idNum}|${seqForDest}`) % 100
  if (roll < 52) return anchor

  const h = hashStr(`${destinationName}|${title}|${idNum}`)
  return pool[h % pool.length]
}
