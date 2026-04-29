/**
 * 目的地卡片网格、攻略列表等：减轻同屏重复使用同一 Unsplash 占位图。
 * 数据层仍应以 primaryImageGeoFixes 逐国加强锚点；此处为展示层去重与排序。
 */
import { getDestinationHeroImageUrl } from '../data/destinationPrimaryImages.js'
import { buildCoverUrlPoolForDestination } from '../data/coverPoolUrls.js'
import { extractUnsplashPhotoId } from '../data/coverGeoAllowlist.js'
import { coverGeoPolicyAllows } from '../data/coverGeoPolicy.js'
import { CONTINENT_BY_PLACE_NAME } from '../data/placeContinents.generated.js'

/** 与 mockData.destinations[].continent 中文一致 */
const CONTINENT_HOME_GRID_DIVERSITY = {
  非洲: [
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600',
    'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600',
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600',
    'https://images.unsplash.com/photo-1516426122078-c23e763fe01b?w=600',
    'https://images.unsplash.com/photo-1523805009345-7448847a17a4?w=600',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600',
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600',
    'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=600',
  ],
  欧洲: [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
    'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600',
    'https://images.unsplash.com/photo-1560930950-5c79b4d45879?w=600',
    'https://images.unsplash.com/photo-1513326738671-b96407a66789?w=600',
    'https://images.unsplash.com/photo-1543785734-4b6e564642f8?w=600',
    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600',
    'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600',
  ],
  亚洲: [
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
    'https://images.unsplash.com/photo-1524492479098-5e0a4b2f52e0?w=600',
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
    'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
    /** 不列入 1524231757912：与中东/高加索主图占位重复，易在网格里去重失败时扎堆 */
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
    'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?w=600',
    'https://images.unsplash.com/photo-1478865858807-4fd415904439?w=600',
    'https://images.unsplash.com/photo-1584118624014-d89a2c218c60?w=600',
    'https://images.unsplash.com/photo-1596422846543-75c6ee1976e5?w=600',
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=600',
  ],
  北美: [
    'https://images.unsplash.com/photo-1519832979-6fa011b87667?w=600',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600',
    'https://images.unsplash.com/photo-1518638150340-f706e16654f4?w=600',
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600',
    'https://images.unsplash.com/photo-1568572933382-5dcaefb27068?w=600',
  ],
  南美: [
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600',
    'https://images.unsplash.com/photo-1612296480922-207807b05c99?w=600',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
    'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600',
  ],
  大洋洲: [
    'https://images.unsplash.com/photo-1507699629798-6870a1e2d1d8?w=600',
    'https://images.unsplash.com/photo-1469521669194-babb45f83517?w=600',
    'https://images.unsplash.com/photo-1523482580671-f216ba185ece?w=600',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600',
    'https://images.unsplash.com/photo-1584118624014-d89a2c218c60?w=600',
  ],
  南极洲: [
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
  ],
}

/** 与各大洲表去重合并：大图集列表页用尽主图+池后仍缺独立 id 时补充（站内生成/攻略已引用） */
const EXTRA_HOME_GRID_DIVERSITY = [
  'https://images.unsplash.com/photo-1519046904884-02404a0b2ec9?w=600',
  'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600',
  'https://images.unsplash.com/photo-1547981609-4b6a09b7a341?w=600',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
  'https://images.unsplash.com/photo-1465188162883-09ebb8c9e17a?w=600',
  'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab1?w=600',
  'https://images.unsplash.com/photo-1536599018102-23f4bdd2356d?w=600',
  'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600',
  'https://images.unsplash.com/photo-1485738422979-f5c18d67c959?w=600',
  'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=600',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600',
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',
  'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=600',
  'https://images.unsplash.com/photo-1490763939896-063c038d71f0?w=600',
  'https://images.unsplash.com/photo-1474044150017-7c79bc86aa21?w=600',
  'https://images.unsplash.com/photo-1494522358652-f3c3b5f45e8d?w=600',
  'https://images.unsplash.com/photo-1506929562872-b94aa2565b4b?w=600',
  'https://images.unsplash.com/photo-1605836246008-cf8b9492bef4?w=600',
]

function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/** 各洲备用图合并去重，供单批网格用尽候选后仍尽量不重复 */
function collectAllDiversityUrlsDeduped() {
  const seen = new Set()
  const out = []
  const pushUnique = (u) => {
    const pid = extractUnsplashPhotoId(u)
    if (!pid || seen.has(pid)) return
    seen.add(pid)
    out.push(u)
  }
  for (const arr of Object.values(CONTINENT_HOME_GRID_DIVERSITY)) {
    for (const u of arr) pushUnique(u)
  }
  for (const u of EXTRA_HOME_GRID_DIVERSITY) pushUnique(u)
  return out
}

/**
 * @param {string[]} urls
 * @param {{ id?: string, name?: string }} dest
 * @param {Set<string>} usedPhotoIds
 * @param {boolean} requireGeoPolicy
 * @returns {string | null}
 */
function pickFirstUnusedFromRotated(urls, dest, usedPhotoIds, requireGeoPolicy) {
  if (!urls.length) return null
  const name = dest?.name
  let list = urls
  if (requireGeoPolicy) {
    if (!name) return null
    list = urls.filter((u) => coverGeoPolicyAllows(name, u))
    if (!list.length) return null
  }
  const start = name ? hashStr(`${dest.id ?? ''}|${name}`) % list.length : 0
  const rotated = [...list.slice(start), ...list.slice(0, start)]
  for (const u of rotated) {
    const id = extractUnsplashPhotoId(u) ?? u
    if (!usedPhotoIds.has(id)) {
      usedPhotoIds.add(id)
      return u
    }
  }
  return null
}

/**
 * 按目的地轮换「同洲备用图」顺序，避免列表前几项抢同一备用图。
 * @param {{ id?: string, name?: string, continent?: string }} dest
 */
function diversityUrlsForDestination(dest) {
  const raw = dest?.continent && CONTINENT_HOME_GRID_DIVERSITY[dest.continent]
  if (!raw?.length || !dest?.name) return []
  const name = dest.name
  const filtered = raw.filter((u) => coverGeoPolicyAllows(name, u))
  if (filtered.length < 2) return filtered
  const start = hashStr(`${dest.id ?? ''}|${name}`) % filtered.length
  return [...filtered.slice(start), ...filtered.slice(0, start)]
}

/**
 * @param {string[]} candidates 已按优先级去重 photo-id
 * @param {string | undefined} primaryFallback candidates 为空时返回
 * @param {{ id?: string, name?: string, continent?: string } | undefined} destStub
 */
function resolveCoverFromCandidates(candidates, primaryFallback, destStub, usedPhotoIds) {
  if (!candidates.length) return primaryFallback

  for (const u of candidates) {
    const id = extractUnsplashPhotoId(u) ?? u
    if (!usedPhotoIds.has(id)) {
      usedPhotoIds.add(id)
      return u
    }
  }

  const globalPool = collectAllDiversityUrlsDeduped()
  let overflow = pickFirstUnusedFromRotated(globalPool, destStub, usedPhotoIds, true)
  if (overflow) return overflow
  overflow = pickFirstUnusedFromRotated(globalPool, destStub, usedPhotoIds, false)
  if (overflow) return overflow

  const fallback = candidates[0]
  const fid = extractUnsplashPhotoId(fallback) ?? fallback
  usedPhotoIds.add(fid)
  return fallback
}

/**
 * 优先展示主图 photo-id 尚未出现的国家，把高度复用占位图的目的地排到后面，提升首屏辨识度。
 * @param {Array<{ id?: string, name?: string, image?: string }>} list
 */
export function sortDestinationsUniqueHeroFirst(list) {
  if (!Array.isArray(list) || list.length < 2) return list
  const seen = new Set()
  const unique = []
  const dup = []
  for (const d of list) {
    const url = getDestinationHeroImageUrl(d) ?? d?.image
    const id = extractUnsplashPhotoId(url) ?? url
    if (id && !seen.has(id)) {
      seen.add(id)
      unique.push(d)
    } else dup.push(d)
  }
  return [...unique, ...dup]
}

/**
 * 在单批渲染内避免重复使用同一 Unsplash id；优先主图，其次该国封面池内下一项。
 * @param {{ name?: string, image?: string }} dest
 * @param {Set<string>} usedPhotoIds
 */
export function pickHomePopularCover(dest, usedPhotoIds) {
  const hero = getDestinationHeroImageUrl(dest) ?? dest?.image
  const pool = dest?.name ? buildCoverUrlPoolForDestination(dest.name) : []
  const seenId = new Set()
  const candidates = []
  for (const u of [hero, ...pool, ...diversityUrlsForDestination(dest)]) {
    if (!u) continue
    const pid = extractUnsplashPhotoId(u) ?? u
    if (seenId.has(pid)) continue
    seenId.add(pid)
    candidates.push(u)
  }
  if (!candidates.length) return hero
  return resolveCoverFromCandidates(candidates, hero, dest, usedPhotoIds)
}

/**
 * 攻略列表卡片：优先 `item.cover`，冲突时换目的地主图/封面池/同洲备用图。
 * @param {{ id?: string, cover?: string, destination?: string }} item
 */
export function pickArticleGridCover(item, usedPhotoIds) {
  const destName = item?.destination
  const primary = item?.cover
  const continent = destName ? CONTINENT_BY_PLACE_NAME[destName] : undefined
  const stub =
    destName && continent
      ? { id: item?.id, name: destName, continent }
      : destName
        ? { id: item?.id, name: destName }
        : { id: item?.id, name: '' }

  const pool = destName ? buildCoverUrlPoolForDestination(destName) : []
  const hero = destName ? getDestinationHeroImageUrl(destName) : undefined
  const seenId = new Set()
  const candidates = []
  const diversity = continent ? diversityUrlsForDestination(stub) : []
  for (const u of [primary, hero, ...pool, ...diversity]) {
    if (!u) continue
    const pid = extractUnsplashPhotoId(u) ?? u
    if (seenId.has(pid)) continue
    seenId.add(pid)
    candidates.push(u)
  }
  if (!candidates.length) return primary
  return resolveCoverFromCandidates(candidates, primary, stub, usedPhotoIds)
}

/**
 * @param {Array<{ id?: string, cover?: string, destination?: string }>} list
 */
export function assignArticleGridCoversInOrder(list) {
  if (!Array.isArray(list) || list.length === 0) return []
  const usedPhotoIds = new Set()
  return list.map((item) => ({
    item,
    cover: pickArticleGridCover(item, usedPhotoIds),
  }))
}

/**
 * 按当前列表顺序为网格分配封面（不改动排序）；用于目的地列表等需保留用户排序的场景。
 * @param {Array<{ id?: string, name?: string, image?: string, continent?: string }>} list
 */
export function assignGridCoversInOrder(list) {
  if (!Array.isArray(list) || list.length === 0) return []
  const usedPhotoIds = new Set()
  return list.map((dest) => ({
    dest,
    cover: pickHomePopularCover(dest, usedPhotoIds),
  }))
}

export { assignArticleGridCoversInOrder as default }
