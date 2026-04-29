import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useTranslation } from 'react-i18next'
import { articles } from '../data/mockData'
import { places } from '../data/placeModel'
import { PLACE_GEO_BY_ID } from '../data/placeGeo.generated'
import { MAP_POI_OVERRIDES, getCountryTemplate } from '../data/mapPoiOverrides'

const SOURCE_ID = 'roamwise-destination-points'
const LAYER_ID = 'roamwise-destination-circles'
const CLUSTER_SOURCE_LAYER_ID = 'roamwise-clusters'
const CLUSTER_COUNT_LAYER_ID = 'roamwise-cluster-count'
const MOBILE_LITE_OPEN_KEY = 'roamwise-map-mobile-lite-open-v1'

/** Carto CDN 底图：在部分网络下比直连 OSM 瓦片更稳定；数据仍来自 OSM 生态。 */
const RASTER_STYLE = {
  version: 8,
  sources: {
    basemap: {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors © CARTO',
    },
  },
  layers: [{ id: 'basemap-raster', type: 'raster', source: 'basemap' }],
}

function normalized(text) {
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

function escapeHtml(input) {
  const text = String(input ?? '')
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getDefaultPoiCopy(t, category) {
  return {
    placeNameEn:
      category === 'blue'
        ? 'Free View Spot'
        : category === 'green'
          ? 'Budget Food/Stay'
          : 'Budget Hostel Deal',
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

function buildCountryFourBlocks(t, destinationName, category, allPoints) {
  const countryTemplate = getCountryTemplate(destinationName)
  if (countryTemplate) {
    return {
      freeScenic: countryTemplate.freeScenic || t('home.mapCardHighlightsBlue'),
      foodUnder200: countryTemplate.foodUnder200 || t('home.mapCardSavingGreenHardCap'),
      lowCostStay: countryTemplate.lowCostStay || t('home.mapCardSavingYellow'),
      realPitfall: countryTemplate.realPitfall || t('home.mapCardPitfallDefault'),
    }
  }
  const sameCountryPoints = allPoints.filter((p) => p.destinationName === destinationName)
  const blue = sameCountryPoints.find((p) => p.category === 'blue')
  const green = sameCountryPoints.find((p) => p.category === 'green')
  const yellow = sameCountryPoints.find((p) => p.category === 'orange')
  const current = sameCountryPoints.find((p) => p.category === category)
  return {
    freeScenic: blue?.highlights || t('home.mapCardHighlightsBlue'),
    foodUnder200: green?.savingTips || t('home.mapCardSavingGreenHardCap'),
    lowCostStay: yellow?.savingTips || t('home.mapCardSavingYellow'),
    realPitfall: current?.pitfall || t('home.mapCardPitfallDefault'),
  }
}

/**
 * @param {{ compact?: boolean }} [props]
 * `compact`：用于首页嵌入，降低地图高度，减少瓦片未加载时的「大块空白」观感。
 */
export default function GlobalMapSearch({ compact = false } = {}) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [routeFrom, setRouteFrom] = useState('')
  const [routeTo, setRouteTo] = useState('')
  const [routePlan, setRoutePlan] = useState(null)
  const [mobileLiteOpen, setMobileLiteOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(MOBILE_LITE_OPEN_KEY) === '1'
  })
  const [isMobile, setIsMobile] = useState(false)
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(MOBILE_LITE_OPEN_KEY, mobileLiteOpen ? '1' : '0')
  }, [mobileLiteOpen])

  const destinationToTags = useMemo(() => {
    const m = new Map()
    for (const a of articles) {
      const key = a.destination
      if (!key) continue
      const prev = m.get(key) || []
      m.set(key, [...prev, ...(a.tags || [])])
    }
    return m
  }, [])

  const allPoints = useMemo(() => {
    return places.flatMap((d) => {
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
        // Legacy compatibility: some configs still use "yellow" while runtime category is "orange".
        const override = destinationOverride[category] || (category === 'orange' ? destinationOverride.yellow : {}) || {}
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
  }, [destinationToTags, t])

  const routeDestinations = useMemo(
    () =>
      places
        .filter((d) => PLACE_GEO_BY_ID[d.id])
        .map((d) => ({ id: String(d.id), name: d.name, country: d.country, continent: d.continent })),
    [],
  )

  const filteredPoints = useMemo(() => {
    const q = normalized(query).trim()
    const terms = q.split(/\s+/).filter(Boolean)
    return allPoints.filter((p) => {
      const categoryOk = categoryFilter === 'all' || p.category === categoryFilter
      const queryOk = !terms.length || terms.every((term) => p.keywords.includes(term))
      return categoryOk && queryOk
    })
  }, [allPoints, query, categoryFilter])

  const pointByDestinationId = useMemo(() => {
    const m = new Map()
    for (const d of places) {
      const geo = PLACE_GEO_BY_ID[d.id]
      if (!geo) continue
      m.set(String(d.id), { lng: geo.lng, lat: geo.lat, destination: d })
    }
    return m
  }, [])

  const generateRoutePlan = () => {
    if (!routeFrom || !routeTo || routeFrom === routeTo) return
    const start = pointByDestinationId.get(routeFrom)
    const end = pointByDestinationId.get(routeTo)
    if (!start || !end) return

    const c1 = start.destination.country
    const c2 = end.destination.country
    const midLat = (start.lat + end.lat) / 2
    const midLng = (start.lng + end.lng) / 2
    const distToCorridor = (p) => {
      const dlat = p.lat - midLat
      const dlng = p.lng - midLng
      return dlat * dlat + dlng * dlng
    }
    const pickStops = (category) => {
      if (!c1 || !c2) return []
      const inLeg =
        c1 === c2
          ? allPoints.filter((p) => p.category === category && p.country === c1)
          : allPoints.filter((p) => p.category === category && (p.country === c1 || p.country === c2))
      const list = inLeg.sort((a, b) => distToCorridor(a) - distToCorridor(b))
      const seen = new Set()
      const out = []
      for (const p of list) {
        const label = p.name || p.destinationName
        if (seen.has(label)) continue
        seen.add(label)
        out.push(label)
        if (out.length >= 2) break
      }
      return out
    }

    const viaBlue = pickStops('blue')
    const viaGreen = pickStops('green')

    const sameContinent = start.destination.continent === end.destination.continent
    const transportPlan = sameContinent
      ? t('home.routePlanTransportNear')
      : t('home.routePlanTransportFar')
    const safety = sameContinent
      ? [t('home.routePlanSafety1'), t('home.routePlanSafety2')]
      : [t('home.routePlanSafety2'), t('home.routePlanSafety3')]

    setRoutePlan({
      from: start.destination.name,
      to: end.destination.name,
      transportPlan,
      scenic: viaBlue.length ? viaBlue : [start.destination.name, end.destination.name],
      food: viaGreen.length ? viaGreen : [start.destination.name],
      safety,
    })
  }

  const geoJson = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: filteredPoints.map((p) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        properties: {
          id: p.id,
          destinationId: p.destinationId,
          name: p.name,
          country: p.country,
          category: p.category,
          destinationName: p.destinationName,
          savingTips: p.savingTips,
          highlights: p.highlights,
          transport: p.transport,
          pitfall: p.pitfall,
        },
      })),
    }),
    [filteredPoints],
  )

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: RASTER_STYLE,
      center: [20, 20],
      zoom: 1.4,
      minZoom: 1,
      maxZoom: 8,
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    map.on('load', () => {
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: geoJson,
        cluster: true,
        clusterMaxZoom: 5,
        clusterRadius: 42,
      })
      map.addLayer({
        id: CLUSTER_SOURCE_LAYER_ID,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#0f172a',
          'circle-radius': ['step', ['get', 'point_count'], 14, 20, 18, 60, 22],
          'circle-opacity': 0.82,
          'circle-stroke-width': 1.4,
          'circle-stroke-color': '#ffffff',
        },
      })
      map.addLayer({
        id: CLUSTER_COUNT_LAYER_ID,
        type: 'symbol',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-size': 12,
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        },
        paint: { 'text-color': '#ffffff' },
      })
      map.addLayer({
        id: LAYER_ID,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 3, 3, 4, 6, 7],
          'circle-color': [
            'match',
            ['get', 'category'],
            'blue',
            '#0284c7',
            'green',
            '#059669',
            '#eab308',
          ],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.2,
          'circle-opacity': 0.88,
        },
      })
      map.on('click', LAYER_ID, (e) => {
        const f = e.features?.[0]
        if (!f) return
        const name = f.properties?.name || ''
        const country = f.properties?.country || ''
        const destinationId = f.properties?.destinationId || ''
        const destinationName = f.properties?.destinationName || ''
        const category = f.properties?.category || ''
        const categoryLabel =
          category === 'blue'
            ? t('home.mapFilterBlue')
            : category === 'green'
              ? t('home.mapFilterGreen')
              : t('home.mapFilterYellow')
        const four = buildCountryFourBlocks(t, destinationName, category, allPoints)
        const safeDestinationName = escapeHtml(destinationName)
        const safeName = escapeHtml(name)
        const safeCountry = escapeHtml(country)
        const safeCategoryLabel = escapeHtml(categoryLabel)
        const safeFreeScenic = escapeHtml(four.freeScenic)
        const safeFoodUnder200 = escapeHtml(four.foodUnder200)
        const safeLowCostStay = escapeHtml(four.lowCostStay)
        const safeRealPitfall = escapeHtml(four.realPitfall)
        const safeTrustSafe = escapeHtml(t('home.mapCardTrustSafe'))
        const safeTrustNoTrap = escapeHtml(t('home.mapCardTrustNoTrap'))
        const destinationQuery = encodeURIComponent(destinationName)
        const routesHref =
          category === 'green'
            ? `/routes?destination=${destinationQuery}&sort=budgetAsc&budget=5000`
            : `/routes?destination=${destinationQuery}`
        const destinationHref = `/routes?destination=${destinationQuery}`
        new maplibregl.Popup({ offset: 10 })
          .setLngLat(e.lngLat)
          .setHTML(
            `<div style="font-size:12px;line-height:1.45;min-width:180px">
              <strong>${escapeHtml(t('home.mapCardPlaceName'))}: ${safeDestinationName}</strong><br/>
              <span>${escapeHtml(t('home.mapCardPlaceNameEn'))}: ${safeName}</span><br/>
              <span>${safeCountry} · ${safeCategoryLabel}</span><br/>
              <span>${escapeHtml(t('home.mapCardFourFree'))}: ${safeFreeScenic}</span><br/>
              <span>${escapeHtml(t('home.mapCardFourFood'))}: ${safeFoodUnder200}</span><br/>
              <span>${escapeHtml(t('home.mapCardFourStay'))}: ${safeLowCostStay}</span><br/>
              <span>${escapeHtml(t('home.mapCardFourPitfall'))}: ${safeRealPitfall}</span><br/>
              <span>${safeTrustSafe}</span><br/>
              <span>${safeTrustNoTrap}</span>
              <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
                <a href="${destinationHref}" style="display:inline-block;padding:4px 8px;border-radius:8px;background:#e0f2fe;color:#0369a1;text-decoration:none;font-weight:600">${t('home.mapActionDestination')}</a>
                <a href="${routesHref}" style="display:inline-block;padding:4px 8px;border-radius:8px;background:#dcfce7;color:#047857;text-decoration:none;font-weight:600">${t('home.mapActionRoutes')}</a>
              </div>
            </div>`,
          )
          .addTo(map)
      })
      map.on('click', CLUSTER_SOURCE_LAYER_ID, (e) => {
        const feature = e.features?.[0]
        if (!feature) return
        const clusterId = feature.properties?.cluster_id
        const source = map.getSource(SOURCE_ID)
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return
          map.easeTo({
            center: feature.geometry.coordinates,
            zoom: Math.max(zoom, map.getZoom() + 1),
            duration: 500,
          })
        })
      })
      map.on('mouseenter', LAYER_ID, () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', LAYER_ID, () => {
        map.getCanvas().style.cursor = ''
      })
      map.on('mouseenter', CLUSTER_SOURCE_LAYER_ID, () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', CLUSTER_SOURCE_LAYER_ID, () => {
        map.getCanvas().style.cursor = ''
      })
    })
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [geoJson, t])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const source = map.getSource(SOURCE_ID)
    if (source) source.setData(geoJson)
    if (!filteredPoints.length) return
    if (filteredPoints.length === allPoints.length) return
    const bounds = new maplibregl.LngLatBounds()
    for (const p of filteredPoints) bounds.extend([p.lng, p.lat])
    map.fitBounds(bounds, { padding: 36, maxZoom: 5.5, duration: 650 })
  }, [geoJson, filteredPoints, allPoints.length])

  return (
    <section className={compact ? 'max-w-7xl mx-auto px-2 sm:px-4 pt-0 sm:pt-1' : 'max-w-7xl mx-auto px-2 sm:px-4 pt-3 sm:pt-6'}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {compact ? (
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {t('home.globalMapSearchTitle')}
            </h3>
          ) : (
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {t('home.globalMapSearchTitle')}
            </h2>
          )}
          <span className="text-sm sm:text-xs text-slate-500 dark:text-slate-400">
            {t('home.globalMapSearchCount', { count: filteredPoints.length })}
          </span>
        </div>
        <label htmlFor="global-map-search" className="sr-only">
          {t('home.globalMapSearchPlaceholder')}
        </label>
        <input
          id="global-map-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('home.globalMapSearchPlaceholder')}
          className="w-full mb-3 rounded-xl border border-slate-200 px-3 py-3 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
        <div className="mb-3 flex flex-wrap gap-2">
          {[
            { key: 'all', label: t('home.mapFilterAll'), chip: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' },
            { key: 'blue', label: t('home.mapFilterBlue'), chip: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
            { key: 'green', label: t('home.mapFilterGreen'), chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
            { key: 'orange', label: t('home.mapFilterYellow'), chip: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setCategoryFilter(item.key)}
              className={`rounded-full px-3 py-2 min-h-10 text-sm sm:text-xs font-semibold transition border ${
                categoryFilter === item.key
                  ? 'border-slate-700 dark:border-slate-200'
                  : 'border-transparent'
              } ${item.chip}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          ref={mapContainerRef}
          className={
            compact
              ? 'h-[min(52vh,22rem)] min-h-[18rem] md:h-[24rem] w-full rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60'
              : 'h-[72vh] min-h-[24rem] md:h-[26rem] w-full rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60'
          }
        />
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/40">
          {isMobile ? (
            <button
              type="button"
              onClick={() => setMobileLiteOpen((v) => !v)}
              className="mb-2 inline-flex min-h-10 items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
            >
              {mobileLiteOpen ? t('home.mobileLiteHideRoute') : t('home.mobileLiteShowRoute')}
            </button>
          ) : null}
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">{t('home.routePlanTitle')}</h3>
          {(!isMobile || mobileLiteOpen) ? (
            <>
          <div className="grid gap-2 md:grid-cols-3">
            <select
              value={routeFrom}
              onChange={(e) => setRouteFrom(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              aria-label={t('home.routePlanFrom')}
            >
              <option value="">{t('home.routePlanFrom')}</option>
              {routeDestinations.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <select
              value={routeTo}
              onChange={(e) => setRouteTo(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              aria-label={t('home.routePlanTo')}
            >
              <option value="">{t('home.routePlanTo')}</option>
              {routeDestinations.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={generateRoutePlan}
              className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition"
            >
              {t('home.routePlanGenerate')}
            </button>
          </div>
          {routePlan ? (
            <div className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-200">
              <p><strong>{routePlan.from}</strong> → <strong>{routePlan.to}</strong></p>
              <p><strong>{t('home.routePlanCheapest')}：</strong>{routePlan.transportPlan}</p>
              <p><strong>{t('home.routePlanScenic')}：</strong>{routePlan.scenic.join(' · ')}</p>
              <p><strong>{t('home.routePlanFood')}：</strong>{routePlan.food.join(' · ')}</p>
              <p><strong>{t('home.routePlanSafety')}：</strong>{routePlan.safety.join(' · ')}</p>
            </div>
          ) : null}
            </>
          ) : (
            <p className="text-xs text-slate-600 dark:text-slate-300">{t('home.mobileLiteHint')}</p>
          )}
        </div>
      </div>
    </section>
  )
}
