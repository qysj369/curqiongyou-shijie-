/**
 * 地理性标志（本站约定）：封面/主图应在视觉上锚定目的地或标题中的具体区域，
 * 避免「泛用海滩/古城/长城」挪作他用；校验与标题联动规则见 isGreatWallPhotoMisused、HERO_PLACEHOLDER_DENY_IDS。
 *
 * 攻略首屏头图按大洲逐一覆盖全站目的地（与 mockData 大洲字段一致）：
 * 亚洲 → 欧洲 → 非洲 → 美洲（北美+南美）→ 大洋洲 → 南极洲。
 * 落地顺序（与运营一致）：**先亚洲**（HERO_PHASE=1，全体亚洲目的地）→ 再欧洲→非洲→美洲→大洋洲→南极洲 → **HERO_PHASE=7 全站所有国家复查**。
 * 一个一个来：`npm run validate:hero:1` … `validate:hero:7`；主图/封面提质亦同序，直至覆盖全部目的地。
 * HERO_PHASE 由校验脚本读取（默认 0=跳过，不阻断构建）。
 */
import { CONTINENT_BY_PLACE_NAME } from './placeContinents.generated.js'

/**
 * 网站内「纠错/校验」推荐顺序：六大区块（南极洲通常仅 1 个目的地）。
 * 美洲 = 数据中「北美」「南美」合并展示。
 */
export const HERO_AUDIT_SEQUENCE = /** @type {const} */ ([
  { phase: 1, label: '亚洲', continentsZh: ['亚洲'] },
  { phase: 2, label: '欧洲', continentsZh: ['欧洲'] },
  { phase: 3, label: '非洲', continentsZh: ['非洲'] },
  { phase: 4, label: '美洲', continentsZh: ['北美', '南美'] },
  { phase: 5, label: '大洋洲', continentsZh: ['大洋洲'] },
  { phase: 6, label: '南极洲', continentsZh: ['南极洲'] },
])

/** @typedef {0|1|2|3|4|5|6|7} HeroPhase */
/** 0=跳过 1–6=单一大洲（或美洲合并） 7=全站所有目的地 */

/**
 * mockData 大洲字段 → 校验用分组（南北美归入「美洲」）。
 * @param {string | undefined} continentZh
 * @returns {string | null}
 */
export function heroContinentGroup(continentZh) {
  if (!continentZh) return null
  if (continentZh === '北美' || continentZh === '南美') return '美洲'
  if (continentZh === '亚洲') return '亚洲'
  if (continentZh === '欧洲') return '欧洲'
  if (continentZh === '非洲') return '非洲'
  if (continentZh === '大洋洲') return '大洋洲'
  if (continentZh === '南极洲') return '南极洲'
  return null
}

/**
 * @param {HeroPhase} phase
 * @returns {{ label: string, continentsZh: string[] } | null}
 */
export function heroPhaseMeta(phase) {
  if (phase >= 1 && phase <= 6) {
    const row = HERO_AUDIT_SEQUENCE.find((r) => r.phase === phase)
    return row ? { label: row.label, continentsZh: [...row.continentsZh] } : null
  }
  return null
}

/**
 * 某一 HERO_PHASE 下需参与头图规则的目的地名称列表。
 * @param {HeroPhase} phase
 * @returns {string[]}
 */
export function destinationNamesInHeroScope(phase) {
  const entries = Object.entries(CONTINENT_BY_PLACE_NAME)
  if (phase === 7) {
    return entries.map(([n]) => n).sort()
  }
  const meta = heroPhaseMeta(/** @type {1|2|3|4|5|6} */ (phase))
  if (!meta) return []
  return entries
    .filter(([, c]) => meta.continentsZh.includes(c))
    .map(([n]) => n)
    .sort()
}

/**
 * @param {string} destinationName
 * @param {HeroPhase} phase
 */
export function isDestinationInHeroScope(destinationName, phase) {
  if (phase === 7) return Boolean(CONTINENT_BY_PLACE_NAME[destinationName])
  const c = CONTINENT_BY_PLACE_NAME[destinationName]
  if (!c) return false
  const meta = heroPhaseMeta(/** @type {1|2|3|4|5|6} */ (phase))
  if (!meta) return false
  return meta.continentsZh.includes(c)
}

/**
 * 全站目的地按「亚洲→欧洲→非洲→美洲→大洋洲→南极洲」列出，供人工逐批换图。
 * @returns {{ region: string, phase: number, destinations: string[] }[]}
 */
export function heroAuditBatchesInOrder() {
  const byCont = () => {
    /** @type {Record<string, string[]>} */
    const m = { 亚洲: [], 欧洲: [], 非洲: [], 北美: [], 南美: [], 大洋洲: [], 南极洲: [] }
    for (const [name, c] of Object.entries(CONTINENT_BY_PLACE_NAME)) {
      if (m[c]) m[c].push(name)
    }
    for (const k of Object.keys(m)) m[k].sort()
    return m
  }
  const m = byCont()
  const americas = [...(m['北美'] ?? []), ...(m['南美'] ?? [])].sort()
  return [
    { region: '亚洲', phase: 1, destinations: m['亚洲'] ?? [] },
    { region: '欧洲', phase: 2, destinations: m['欧洲'] ?? [] },
    { region: '非洲', phase: 3, destinations: m['非洲'] ?? [] },
    { region: '美洲', phase: 4, destinations: americas },
    { region: '大洋洲', phase: 5, destinations: m['大洋洲'] ?? [] },
    { region: '南极洲', phase: 6, destinations: m['南极洲'] ?? [] },
  ]
}

/**
 * @deprecated 使用 heroAuditBatchesInOrder；保留兼容旧调用。
 * @param {number} _legacyPhase
 */
export function heroAuditBatches(_legacyPhase) {
  return heroAuditBatchesInOrder().map(({ region, destinations }) => ({ region, destinations }))
}

/**
 * 在「当前阶段覆盖的目的地」内，攻略封面禁止使用下列泛用占位 photo-id。
 */
export const HERO_PLACEHOLDER_DENY_IDS = new Set([
  '1544735716', // 长城向泛用，曾误配多國
])

/** Unsplash 长城经典构图 id：仅允许出现在「北京/京津冀/长城」相关标题的「中国」攻略 */
export const GREAT_WALL_UNSPLASH_ID = '1508804185872'

export const BEIJING_GREAT_WALL_TITLE_RE =
  /京津冀|北京|故宫|紫禁城|承德避暑|天津卫|长城|八达岭|慕田峪/

/**
 * 长城图误用：非中国目的地、或「中国」但标题与京畿/长城无关。
 * @param {string | null | undefined} articleTitle 无标题时按误用处理（校验脚本应始终传入）
 */
export function isGreatWallPhotoMisused(destinationName, photoId, articleTitle) {
  if (photoId !== GREAT_WALL_UNSPLASH_ID) return false
  if (destinationName !== '中国') return true
  const t = typeof articleTitle === 'string' ? articleTitle : ''
  return !BEIJING_GREAT_WALL_TITLE_RE.test(t)
}

/**
 * @param {string | null | undefined} destinationName
 * @param {string | null | undefined} photoId
 * @param {string | null | undefined} articleTitle
 */
export function isForbiddenHeroCoverForScope(destinationName, photoId, articleTitle = '') {
  if (!photoId) return false
  if (HERO_PLACEHOLDER_DENY_IDS.has(photoId)) return true
  if (isGreatWallPhotoMisused(destinationName, photoId, articleTitle)) return true
  return false
}
