/**
 * 攻略库聚合入口：从现有 `articles` / `places` 派生索引，不复制正文。
 *
 * 物理目录：
 *   guideLibrary/
 *     schema.js
 *     index.js
 *     stations/stationsIndex.js
 *     bindings/poiBindings.js
 *     facets/articleFacets.js
 *     mapPayload.js
 */
import { articles } from '../articlesData.js'
import { getPlaceByName } from '../placeModel.js'
import {
  GUIDE_LIBRARY_SCHEMA_VERSION,
} from './schema.js'
import { guideStations } from './stations/stationsIndex.js'
import { guidePoiBindings } from './bindings/poiBindings.js'
import { guideArticleFacets } from './facets/articleFacets.js'

export {
  GUIDE_LIBRARY_SCHEMA_VERSION,
  GUIDE_KINDS,
  GUIDE_TOPICS,
} from './schema.js'

export { guideStations } from './stations/stationsIndex.js'
export { guidePoiBindings } from './bindings/poiBindings.js'
export { guideArticleFacets } from './facets/articleFacets.js'
export { getArticleGuideMapPayload } from './mapPayload.js'
export { TOPIC_TO_ROUTE_KEYWORD, keywordForTopic } from './topicRouteFilter.js'

/** @returns {Record<string, import('./schema').GuideArticleFacet>} */
export function buildGuideFacetIndex() {
  return Object.fromEntries(guideArticleFacets.map((f) => [f.articleId, f]))
}

/** @returns {Record<string, import('./schema').GuideStation[]>} */
export function buildStationsByPlaceId() {
  /** @type {Record<string, import('./schema').GuideStation[]>} */
  const out = {}
  for (const s of guideStations) {
    if (!out[s.parentPlaceId]) out[s.parentPlaceId] = []
    out[s.parentPlaceId].push(s)
  }
  return out
}

/**
 * @returns {{ schemaVersion: number, articleCount: number, placeCount: number, byPlaceId: Record<string, string[]>, orphanArticleIds: string[], stationCount: number, poiBindingCount: number, facetCount: number }}
 */
export function buildGuideCatalog() {
  /** @type {Map<string, string[]>} */
  const byPlaceId = new Map()
  const orphanArticleIds = []

  for (const a of articles) {
    const place = getPlaceByName(a.destination)
    if (!place) {
      orphanArticleIds.push(a.id)
      continue
    }
    const prev = byPlaceId.get(place.id) || []
    prev.push(a.id)
    byPlaceId.set(place.id, prev)
  }

  const placeCount = byPlaceId.size

  return {
    schemaVersion: GUIDE_LIBRARY_SCHEMA_VERSION,
    articleCount: articles.length,
    placeCount,
    byPlaceId: Object.fromEntries(byPlaceId),
    orphanArticleIds,
    stationCount: guideStations.length,
    poiBindingCount: guidePoiBindings.length,
    facetCount: guideArticleFacets.length,
  }
}
