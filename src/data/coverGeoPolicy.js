/**
 * 封面 Unsplash 图地理标志策略：跨大洲复用拦截 + 按目的地剔除（同洲误判仍用 COVER_POOL_DENY_IDS）。
 * 与「地理性标志」一致：主场景应可核对到目的地大洲；明显错洲的 id 记入 PHOTO_HOME_CONTINENT。
 */
import { CONTINENT_BY_PLACE_NAME } from './placeContinents.generated.js'

/** @typedef {'AS'|'EU'|'AF'|'NA'|'SA'|'OC'|'AN'} ContinentCode */

/** mockData.continent 中文 → 统一代码（与 CONTINENT_BY_PLACE_NAME 一致） */
const ZH_TO_CODE = {
  亚洲: 'AS',
  欧洲: 'EU',
  非洲: 'AF',
  北美: 'NA',
  南美: 'SA',
  大洋洲: 'OC',
  南极洲: 'AN',
}

/**
 * Unsplash 图「主场景」所在大洲（仅收录需全局拦截的 id；未收录则不做跨洲判断）。
 * 扩展：发现跨洲误用时在此追加，或运行分析脚本后批量补全。
 * @type {Record<string, ContinentCode>}
 */
export const PHOTO_HOME_CONTINENT = {
  // 埃及金字塔 — 非洲（勿配欧洲/美洲等非非洲目的地；西亚沙漠图另用未标注 id）
  '1539650116574': 'AF',
  // 巴尔干/中欧古城暖色调 — 欧洲
  '1559827260': 'EU',
  // 太平洋/热带海岸（本站多用于菲等）— 亚洲
  '1584118624014': 'AS',
}

/**
 * 按目的地剔除明显错国/错子区的 photo-id（同大洲内仍可能误判，需人工表）。
 * @type {Record<string, Set<string>>}
 */
export const COVER_POOL_DENY_IDS = {
  越南: new Set([
    '1539650116574',
    '1559827260',
    '1584118624014',
    '1512453979798',
    '1489749798305',
    '1578662996442',
    '1469854523086',
  ]),
  /** 长城泛用占位（1544735716）及京畿长城主图（1508804185872）勿进蒙古池 */
  蒙古: new Set(['1544735716', '1508804185872']),
}

function photoId(url) {
  const m = /images\.unsplash\.com\/photo-(\d+)-/i.exec(url || '')
  return m ? m[1] : null
}

/**
 * @param {string | undefined} destZh
 * @returns {ContinentCode | null}
 */
function destinationContinentCode(destZh) {
  if (!destZh) return null
  const zh = CONTINENT_BY_PLACE_NAME[destZh]
  if (!zh) return null
  return ZH_TO_CODE[zh] ?? null
}

/**
 * 是否允许将 url 挂到目的地 destName 的封面池（聚合与运行时共用）。
 * @param {string} destName
 * @param {string} url
 */
export function coverGeoPolicyAllows(destName, url) {
  const id = photoId(url)
  if (!id) return true

  if (COVER_POOL_DENY_IDS[destName]?.has(id)) return false

  const destCode = destinationContinentCode(destName)
  if (!destCode) return true

  const home = PHOTO_HOME_CONTINENT[id]
  if (home && home !== destCode) return false

  return true
}
