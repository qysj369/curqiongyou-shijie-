/**
 * 高德 PlaceSearch：对占位 intent 做一轮检索纠偏（异步、串行节流）。
 * @see https://lbs.amap.com/api/javascript-api-v2/documentation#placesearch
 */

/**
 * @param {number} lng1
 * @param {number} lat1
 * @param {number} lng2
 * @param {number} lat2
 */
export function haversineKm(lng1, lat1, lng2, lat2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function readLngLat(loc) {
  if (!loc) return null
  if (typeof loc.getLng === 'function' && typeof loc.getLat === 'function') {
    return { lng: loc.getLng(), lat: loc.getLat() }
  }
  const lng = loc.lng
  const lat = loc.lat
  if (typeof lng === 'number' && typeof lat === 'number') return { lng, lat }
  return null
}

/**
 * @param {*} AMap
 * @param {{ keyword: string, city?: string, anchor: { lng: number, lat: number }, maxDriftKm?: number }} opts
 * @returns {Promise<{ lng: number, lat: number, name?: string } | null>}
 */
export function placeSearchOne(AMap, opts) {
  const { keyword, anchor, maxDriftKm = 220 } = opts
  const city = opts.city != null ? String(opts.city) : ''

  return new Promise((resolve) => {
    if (!keyword?.trim()) {
      resolve(null)
      return
    }
    try {
      const ps = new AMap.PlaceSearch({
        pageSize: 8,
        pageIndex: 1,
        city: city || '',
        // 海外/多语言城市名不宜强限 citylimit，仍以锚点距离过滤为主
        citylimit: false,
      })
      ps.search(keyword.trim(), (status, result) => {
        try {
          if (status !== 'complete' || !result?.poiList?.pois?.length) {
            resolve(null)
            return
          }
          for (const poi of result.poiList.pois) {
            const ll = readLngLat(poi.location)
            if (!ll) continue
            const d = haversineKm(anchor.lng, anchor.lat, ll.lng, ll.lat)
            if (d <= maxDriftKm) {
              resolve({ lng: ll.lng, lat: ll.lat, name: poi.name })
              return
            }
          }
          resolve(null)
        } catch {
          resolve(null)
        }
      })
    } catch {
      resolve(null)
    }
  })
}

/**
 * @param {*} AMap
 * @param {{ marker: unknown, meta: { id: string, lng: number, lat: number, usePlaceSearch?: boolean, placeSearchKeyword?: string, placeSearchCity?: string } }}[] markerTuples
 * @param {{ delayMs?: number, maxDriftKm?: number }} [options]
 * @returns {Promise<Record<string, { lng: number, lat: number }>>}
 */
export async function refineMarkersWithPlaceSearch(AMap, markerTuples, options = {}) {
  const delayMs = options.delayMs ?? 160
  const maxDriftKm = options.maxDriftKm ?? 220
  /** @type {Record<string, { lng: number, lat: number }>} */
  const refined = {}

  for (const { marker, meta } of markerTuples) {
    if (!meta?.usePlaceSearch || !meta.placeSearchKeyword?.trim()) continue
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, delayMs))
    // eslint-disable-next-line no-await-in-loop
    const hit = await placeSearchOne(AMap, {
      keyword: meta.placeSearchKeyword,
      city: meta.placeSearchCity || '',
      anchor: { lng: meta.lng, lat: meta.lat },
      maxDriftKm,
    })
    if (hit) {
      try {
        marker.setPosition([hit.lng, hit.lat])
      } catch {
        /* noop */
      }
      refined[meta.id] = { lng: hit.lng, lat: hit.lat }
    }
  }
  return refined
}
