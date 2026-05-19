import { getPlaceByName } from '../data/placeModel.js'
import { guideStations } from '../data/guideLibrary/stations/stationsIndex.js'
import { resolveGuideArticleId } from '../utils/tripArticleLinks.js'

/**
 * 将行程 JSON 与攻略库「国家 place + 城市分站」对齐，写入 `spec._guideMeta` 与 POI 上的 `guideStationKey`（启发式）。
 * @param {object} spec
 * @param {string} destinationName 与 `places.name` 一致时匹配最佳
 */
export function enrichItineraryWithGuideLibrary(spec, destinationName) {
  if (!spec || typeof spec !== 'object') return { spec, place: null, linkedStations: [] }
  const place = getPlaceByName(destinationName || spec.destination || '')
  const linkedStations = place
    ? guideStations.filter((s) => String(s.parentPlaceId) === String(place.id))
    : []

  const cloned = JSON.parse(JSON.stringify(spec))
  cloned._guideMeta = {
    placeId: place?.id ?? null,
    placeName: place?.name ?? null,
    stationKeys: linkedStations.map((s) => s.key),
  }

  const destLabel = place?.name || destinationName || cloned.destination || ''
  for (const day of cloned.days || []) {
    for (const poi of day.pois || []) {
      const name = String(poi.name || '')
      const hit = linkedStations.find(
        (st) =>
          name.includes(st.nameZh) ||
          (st.nameZh.length >= 2 && name.includes(st.nameZh.slice(0, 2))),
      )
      if (hit) poi.guideStationKey = hit.key
      const articleId = resolveGuideArticleId(poi, destLabel)
      if (articleId) poi.guideArticleId = articleId
    }
  }

  return { spec: cloned, place, linkedStations }
}

/**
 * 双轨行程：分别对 primary / alternate 做攻略库对齐。
 * @param {{ primary: object, alternate: object, countryCode?: string }} bundle
 * @param {string} destinationName
 */
export function enrichTripBundleWithGuideLibrary(bundle, destinationName) {
  if (!bundle || typeof bundle !== 'object' || !bundle.primary || !bundle.alternate) {
    return { bundle, place: null, linkedStations: [] }
  }
  const dest = destinationName || bundle.primary?.destination || bundle.alternate?.destination || ''
  const { spec: primary, place, linkedStations } = enrichItineraryWithGuideLibrary(bundle.primary, dest)
  const { spec: alternate } = enrichItineraryWithGuideLibrary(bundle.alternate, dest)
  return {
    bundle: { ...bundle, primary, alternate },
    place,
    linkedStations,
  }
}
