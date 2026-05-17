/**
 * 与 `GlobalMapSearch` 同源：从目的地 + 攻略标签生成蓝/绿/橙三类穷游点位（供高德等其它地图引擎复用）。
 */
import { articles } from '../data/mockData.js'
import { places } from '../data/placeModel.js'
import { PLACE_GEO_BY_ID } from '../data/placeGeo.generated.js'
import { MAP_POI_OVERRIDES } from '../data/mapPoiOverrides.js'

export function normalized(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function buildDestinationKeywords(dest, relatedArticleTags) {
  return normalized(
    [
      dest.name,
      dest.country,
      dest.region,
      dest.continent,
      dest.description,
      ...(dest.tags || []),
      ...(relatedArticleTags || []),
    ].join(' '),
  )
}

function classifyPointCategory(dest, relatedArticleTags) {
  const text = normalized(
    [
      ...(dest.tags || []),
      ...(relatedArticleTags || []),
      dest.description || '',
      dest.name || '',
      dest.country || '',
    ].join(' '),
  )
  if (/(free|免费|观景|view|sunset|日落|徒步|街区|古城|海滩|公园|hike)/.test(text)) return 'blue'
  if (/(cheap|budget|便宜|夜市|美食|food|咖啡|青旅|hostel|省钱|物价友好)/.test(text)) return 'green'
  return 'orange'
}

function buildPoiName(dest, category) {
  if (category === 'blue') return `${dest.name} Free View Spot`
  if (category === 'green') return `${dest.name} Budget Food/Stay`
  return `${dest.name} Budget Hostel Deal`
}

function getDefaultPoiCopy(t, category) {
  return {
    savingTips:
      category === 'blue'
        ? t('home.mapCardSavingBlue')
        : category === 'green'
          ? t('home.mapCardSavingGreen')
          : t('home.mapCardSavingYellow'),
    highlights:
      category === 'blue'
        ? t('home.mapCardHighlightsBlue')
        : category === 'green'
          ? t('home.mapCardHighlightsGreen')
          : t('home.mapCardHighlightsYellow'),
    transport:
      category === 'blue'
        ? t('home.mapCardTransportBlue')
        : category === 'green'
          ? t('home.mapCardTransportGreen')
          : t('home.mapCardTransportYellow'),
    pitfall:
      category === 'blue'
        ? t('home.mapCardPitfallBlue')
        : category === 'green'
          ? t('home.mapCardPitfallGreen')
          : t('home.mapCardPitfallYellow'),
  }
}

/**
 * @param {(key: string) => string} t
 * @param {{ countryPlaceId?: string | null }} [options] 传入国家 `places[].id` 时仅该国目的地
 */
export function buildBudgetGuidePois(t, options = {}) {
  const countryPlaceId = options.countryPlaceId != null && options.countryPlaceId !== ''
    ? String(options.countryPlaceId)
    : null

  const destinationToTags = new Map()
  for (const a of articles) {
    const key = a.destination
    if (!key) continue
    const prev = destinationToTags.get(key) || []
    destinationToTags.set(key, [...prev, ...(a.tags || [])])
  }

  const placeList = countryPlaceId ? places.filter((d) => String(d.id) === countryPlaceId) : places

  return placeList.flatMap((d) => {
    const geo = PLACE_GEO_BY_ID[d.id]
    if (!geo) return []
    const relatedTags = destinationToTags.get(d.name) || []
    const baseKeywords = buildDestinationKeywords(d, relatedTags)
    const primaryCategory = classifyPointCategory(d, relatedTags)
    const line = Array.isArray(geo.line) && geo.line.length >= 3
      ? geo.line
      : [
          [geo.lng - 0.18, geo.lat + 0.06],
          [geo.lng, geo.lat],
          [geo.lng + 0.18, geo.lat - 0.06],
        ]
    const categories = ['blue', 'green', 'orange']
    return categories.map((category, idx) => {
      const [lng, lat] = line[idx] || [geo.lng, geo.lat]
      const defaultCopy = getDefaultPoiCopy(t, category)
      const destinationOverride = MAP_POI_OVERRIDES?.[d.name] || {}
      const override =
        destinationOverride[category] || (category === 'orange' ? destinationOverride.yellow : {}) || {}
      const poiName = override.placeNameEn || buildPoiName(d, category)
      const categoryKeywords =
        category === 'blue'
          ? 'free view sunset spot scenic walk 免费 观景 日落'
          : category === 'green'
            ? 'cheap stay budget food hostel night market 便宜 省钱 美食 青旅 夜市'
            : 'cheap hotel hostel deal couchsurfing low price 低价 住宿 青旅 特价 酒店 沙发客'
      return {
        id: `${d.id}-${category}`,
        destinationId: d.id,
        destinationName: d.name,
        name: poiName,
        country: d.country,
        lng,
        lat,
        category,
        primaryCategory,
        savingTips: override.savingTips || defaultCopy.savingTips,
        highlights: override.highlights || defaultCopy.highlights,
        transport: override.transport || defaultCopy.transport,
        pitfall: override.pitfall || defaultCopy.pitfall,
        keywords: normalized(`${baseKeywords} ${poiName} ${categoryKeywords}`),
      }
    })
  })
}
