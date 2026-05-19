import { articles } from '../data/mockData.js'
import { guidePoiBindings } from '../data/guideLibrary/bindings/poiBindings.js'

function normalizePoiName(name) {
  return String(name || '')
    .replace(/（[^）]*）/g, '')
    .split('·')[0]
    .trim()
}

/**
 * 为行程 POI 解析可链到的攻略 id（bindings 优先，否则同目的地文章启发式匹配）。
 * @param {{ name?: string, guideStationKey?: string, guideArticleId?: string }} poi
 * @param {string} destination
 */
export function resolveGuideArticleId(poi, destination) {
  if (poi?.guideArticleId) return poi.guideArticleId
  const name = normalizePoiName(poi?.name)
  const stationKey = poi?.guideStationKey
  const dest = String(destination || '').trim()

  for (const binding of guidePoiBindings) {
    if (stationKey && binding.stationKey !== stationKey) continue
    for (const ref of binding.poiRefs || []) {
      const refName = String(ref.nameZh || '')
      if (name && refName && (name.includes(refName) || refName.includes(name.slice(0, 2)))) {
        return binding.articleId
      }
    }
  }
  if (!stationKey) {
    for (const binding of guidePoiBindings) {
      for (const ref of binding.poiRefs || []) {
        const refName = String(ref.nameZh || '')
        if (name && refName && (name.includes(refName) || refName.includes(name.slice(0, 2)))) {
          return binding.articleId
        }
      }
    }
  }

  if (!dest) return null
  const destArticles = articles.filter((a) => {
    const d = String(a.destination || '')
    const c = String(a.city || '')
    return (
      c === dest ||
      d === dest ||
      d.includes(dest) ||
      dest.includes(d) ||
      (d === '中国' && c && dest.includes(c))
    )
  })
  if (!destArticles.length) return null

  const featured = destArticles.find((a) => a.featured && (!name || a.city === dest || String(a.title).includes(dest)))
  if (featured?.id) return featured.id

  if (name.length >= 2) {
    const byTitle = destArticles.find((a) => {
      const title = String(a.title || '')
      return title.includes(name.slice(0, 4)) || name.includes(title.slice(0, 4))
    })
    if (byTitle?.id) return byTitle.id
    const byTag = destArticles.find((a) =>
      (a.tags || []).some((tag) => name.includes(tag) || tag.includes(name.slice(0, 2))),
    )
    if (byTag?.id) return byTag.id
  }

  return destArticles[0]?.id ?? null
}
