import { GUIDE_TOPICS } from './schema.js'
import { guideStations } from './stations/stationsIndex.js'
import { guidePoiBindings } from './bindings/poiBindings.js'
import { guideArticleFacets } from './facets/articleFacets.js'

const stationByKey = Object.fromEntries(guideStations.map((s) => [s.key, s]))

function offsetForIndex(i, total) {
  const n = Math.max(total, 1)
  const angle = (2 * Math.PI * i) / n + 0.12
  const r = 0.022
  return { dLng: Math.cos(angle) * r, dLat: Math.sin(angle) * r }
}

/**
 * @param {string} articleId
 * @param {string} [lang] i18n.language
 */
export function getArticleGuideMapPayload(articleId, lang = 'zh-CN') {
  const facet = guideArticleFacets.find((f) => f.articleId === articleId) || null
  const bindings = guidePoiBindings.filter((b) => b.articleId === articleId)
  const useEn = false

  /**
   * @type {{
   *   id: string,
   *   lng: number,
   *   lat: number,
   *   title: string,
   *   stationKey: string,
   *   stationName: string,
   *   poiKind: string,
   *   poiId: string,
   *   usePlaceSearch?: boolean,
   *   placeSearchKeyword?: string,
   *   placeSearchCity?: string,
   * }[]}
   */
  const markers = []

  for (const b of bindings) {
    const st = stationByKey[b.stationKey]
    if (!st?.center) continue
    const n = b.poiRefs.length
    b.poiRefs.forEach((poi, i) => {
      const { dLng, dLat } = offsetForIndex(i, n)
      const usePlaceSearch = poi.kind === 'custom' && String(poi.id).startsWith('intent:')
      const title = poi.nameZh || poi.id
      const placeSearchKeyword = [st.nameZh, title].filter(Boolean).join(' ').trim()
      markers.push({
        id: `${b.stationKey}-${i}-${poi.id}`,
        lng: st.center.lng + dLng,
        lat: st.center.lat + dLat,
        title,
        stationKey: b.stationKey,
        stationName: st.nameZh,
        poiKind: poi.kind,
        poiId: poi.id,
        usePlaceSearch,
        placeSearchKeyword: usePlaceSearch ? placeSearchKeyword : undefined,
        placeSearchCity: usePlaceSearch ? st.nameZh : undefined,
      })
    })
  }

  const stationKeys = facet?.stationKeys?.length
    ? facet.stationKeys
    : [...new Set(bindings.map((x) => x.stationKey))]

  const stations = stationKeys.map((k) => stationByKey[k]).filter(Boolean)

  if (markers.length === 0 && stations.length > 0) {
    for (const st of stations) {
      if (!st.center) continue
      markers.push({
        id: st.key,
        lng: st.center.lng,
        lat: st.center.lat,
        title: st.nameZh,
        stationKey: st.key,
        stationName: st.nameZh,
        poiKind: 'station',
        poiId: st.key,
        usePlaceSearch: false,
      })
    }
  }

  const topicLabels = (facet?.topicIds || [])
    .map((tid) => GUIDE_TOPICS.find((t) => t.id === tid))
    .filter(Boolean)
    .map((t) => (useEn ? t.labelEn : t.labelZh))

  const hasData = Boolean(facet || bindings.length > 0 || markers.length > 0)

  return {
    hasData,
    facet,
    stations,
    markers,
    topicLabels,
    bindings,
    useEn,
  }
}
