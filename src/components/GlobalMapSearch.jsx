import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useToast } from '../contexts/ToastContext'
import MoreMenuDrawer from './MoreMenuDrawer'
import NotificationBell from './NotificationBell'
import { places } from '../data/placeModel'
import { PLACE_GEO_BY_ID } from '../data/placeGeo.generated'
import { getCountryTemplate } from '../data/mapPoiOverrides'
import { hasAmapKey } from '../lib/loadAmapApi'
import { reverseGeocodeCity } from '../lib/reverseGeocodeCity.js'
import { buildBudgetGuidePois, normalized } from '../lib/budgetGuidePois.js'

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

function escapeHtml(input) {
  const text = String(input ?? '')
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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
 * @param {{ compact?: boolean, immersive?: boolean, embedInHome?: boolean }} [props]
 * `compact`：用于首页嵌入，降低地图高度，减少瓦片未加载时的「大块空白」观感。
 * `immersive`：移动端全屏地图 + 浮层（对齐高德首屏信息架构）。
 * `embedInHome`：嵌入首页时隐藏组件内重复标题（由首页区块 `h2` 承担）。
 */
export default function GlobalMapSearch({ compact = false, immersive = false, embedInHome = false } = {}) {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [moreOpen, setMoreOpen] = useState(false)
  const mapSearchHeading = hasAmapKey()
    ? t('home.globalMapSearchTitleWhenAmap')
    : t('home.globalMapSearchTitle')
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

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!immersive || !moreOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [immersive, moreOpen])

  const onLocate = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    if (!navigator.geolocation) {
      toast(t('mapHome.locateUnsupported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lng = pos.coords.longitude
        const lat = pos.coords.latitude
        map.flyTo({
          center: [lng, lat],
          zoom: Math.max(map.getZoom(), 3.2),
          essential: true,
        })
        if (!immersive) return
        void (async () => {
          const { city } = await reverseGeocodeCity(lng, lat)
          const label = city?.trim() || t('mapHome.locateFallbackCity')
          toast(t('mapHome.locateTripNavigating', { city: label }))
          navigate(
            `/trip-ai?destination=${encodeURIComponent(label)}&autogenerate=1&notes=${encodeURIComponent(t('mapHome.notesLocateGenerated'))}`,
          )
        })()
      },
      () => {
        toast(t('mapHome.locateDenied'))
      },
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 12_000 },
    )
  }, [immersive, navigate, t, toast])

  const onScanStub = useCallback(() => {
    toast(t('mapHome.scanComingSoon'))
  }, [t, toast])

  const onVoiceStub = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      toast(t('mapHome.voiceUnsupported'))
      return
    }
    try {
      const r = new SR()
      r.lang = 'zh-CN'
      r.onresult = (ev) => {
        const text = ev.results?.[0]?.[0]?.transcript
        if (text) setQuery((q) => (q ? `${q} ${text}` : text))
      }
      r.onerror = () => {
        toast(t('mapHome.voiceError'))
      }
      r.start()
    } catch {
      toast(t('mapHome.voiceUnsupported'))
    }
  }, [i18n.language, t, toast])

  const allPoints = useMemo(() => buildBudgetGuidePois(t, { countryPlaceId: null }), [t])

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

  const filterChipItems = useMemo(
    () => [
      { key: 'all', label: t('home.mapFilterAll'), chip: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' },
      { key: 'blue', label: t('home.mapFilterBlue'), chip: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
      { key: 'green', label: t('home.mapFilterGreen'), chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
      { key: 'orange', label: t('home.mapFilterYellow'), chip: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
    ],
    [t],
  )

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
    if (!immersive) {
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    }
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
        const safeNextStep = escapeHtml(t('home.mapPopupNextStep'))
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
              <p style="margin-top:8px;font-size:11px;color:#64748b;line-height:1.35">${safeNextStep}</p>
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
  }, [geoJson, immersive, t])

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

  if (immersive) {
    return (
      <>
        <h1 className="sr-only">{t('home.heroTitleNew')}</h1>
        <div className="fixed inset-0 z-0 bg-slate-200 dark:bg-slate-950">
          <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />
        </div>

        <div className="pointer-events-none fixed inset-0 z-20">
          <div className="pointer-events-auto px-3 pt-[max(0.5rem,env(safe-area-inset-top))]">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex shrink-0 flex-col gap-2">
                <Link
                  to="/me"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-lg shadow-lg ring-1 ring-slate-200/80 dark:bg-slate-800/95 dark:ring-slate-700"
                  aria-label={t('common.navMe')}
                >
                  <span aria-hidden>👤</span>
                </Link>
                <div className="pointer-events-auto flex justify-center rounded-full bg-white/95 p-0.5 shadow-lg ring-1 ring-slate-200/80 dark:bg-slate-800/95 dark:ring-slate-700">
                  <NotificationBell />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <label htmlFor="global-map-search-immersive-top" className="sr-only">
                  {t('home.globalMapSearchPlaceholder')}
                </label>
                <div className="flex items-center gap-1 rounded-full bg-white/95 px-3 py-2.5 shadow-lg ring-1 ring-slate-200/80 dark:bg-slate-800/95 dark:ring-slate-700">
                  <span className="text-slate-400" aria-hidden>⌄</span>
                  <input
                    id="global-map-search-immersive-top"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('mapHome.searchPlaceholderFloating')}
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                  />
                  {query ? (
                    <button
                      type="button"
                      className="rounded-full px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => setQuery('')}
                      aria-label={t('mapHome.clearSearch')}
                    >
                      ✕
                    </button>
                  ) : null}
                </div>
                <div className="scrollbar-hide mt-2 flex gap-1.5 overflow-x-auto pb-1">
                  {filterChipItems.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setCategoryFilter(item.key)}
                      className={`pointer-events-auto shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ring-1 ${
                        categoryFilter === item.key
                          ? 'bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900 dark:ring-white'
                          : `${item.chip} ring-transparent`
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setMoreOpen(true)}
                  className="flex min-h-11 min-w-11 flex-col items-center justify-center rounded-xl bg-white/95 px-1 py-1 text-[10px] font-semibold leading-tight text-slate-800 shadow-lg ring-1 ring-slate-200/80 dark:bg-slate-800/95 dark:text-slate-100 dark:ring-slate-700"
                  aria-label={t('a11y.openMoreMenu')}
                >
                  <span className="text-base leading-none" aria-hidden>＋</span>
                  <span>{t('common.moreMenuTitle')}</span>
                </button>
                <Link
                  to="/map-hub"
                  className="flex min-h-11 min-w-11 flex-col items-center justify-center rounded-xl bg-white/95 px-1 py-1 text-[10px] font-semibold leading-tight text-slate-800 shadow-lg ring-1 ring-slate-200/80 dark:bg-slate-800/95 dark:text-slate-100 dark:ring-slate-700"
                >
                  <span className="text-base leading-none" aria-hidden>◫</span>
                  <span>{t('common.navMapHub')}</span>
                </Link>
                <Link
                  to="/about"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white shadow-lg ring-2 ring-white/20 dark:bg-slate-700 dark:ring-slate-900/40"
                  aria-label={t('mapHome.promoAria')}
                >
                  <span aria-hidden>于</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="pointer-events-auto fixed bottom-[calc(8.75rem+env(safe-area-inset-bottom))] left-3 z-20 flex items-center gap-1.5 rounded-2xl bg-white/95 px-3 py-2 text-xs font-medium text-slate-700 shadow-lg ring-1 ring-slate-200/80 dark:bg-slate-800/95 dark:text-slate-200 dark:ring-slate-700">
            <span aria-hidden>☁️</span>
            <span>{t('mapHome.weatherDemo')}</span>
          </div>

          <div className="pointer-events-auto fixed bottom-[calc(8.75rem+env(safe-area-inset-bottom))] right-3 z-20 flex flex-col gap-2">
            <button
              type="button"
              onClick={onLocate}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 text-lg shadow-lg ring-1 ring-slate-200/80 dark:bg-slate-800/95 dark:ring-slate-700"
              aria-label={t('mapHome.locate')}
              title={t('mapHome.locate')}
            >
              <span aria-hidden>⊙</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/trip-ai')}
              className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-white/95 px-1 py-1 text-[10px] font-semibold leading-tight text-sky-700 shadow-lg ring-1 ring-sky-200/90 dark:bg-slate-800/95 dark:text-sky-300 dark:ring-sky-800"
              aria-label={t('mapHome.routePlanShort')}
            >
              <span className="text-lg leading-none text-sky-600 dark:text-sky-400" aria-hidden>➤</span>
              <span>{t('mapHome.routePlanShort')}</span>
            </button>
          </div>

          <div className="pointer-events-auto fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] left-0 right-0 z-30 px-3 pb-1">
            <div className="mx-auto max-w-7xl rounded-2xl bg-white/98 px-3 py-2.5 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/90 dark:bg-slate-900/98 dark:ring-slate-700">
              <label htmlFor="global-map-search-immersive-panel" className="sr-only">
                {t('home.globalMapSearchPlaceholder')}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-slate-400" aria-hidden>🔍</span>
                <input
                  id="global-map-search-immersive-panel"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('mapHome.searchPlaceholderPanel')}
                  className="min-w-0 flex-1 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={onScanStub}
                  className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  aria-label={t('mapHome.scan')}
                >
                  <span className="text-lg" aria-hidden>▢</span>
                </button>
                <button
                  type="button"
                  onClick={onVoiceStub}
                  className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  aria-label={t('mapHome.voice')}
                >
                  <span className="text-lg" aria-hidden>🎙</span>
                </button>
              </div>
              <p className="mt-1 truncate text-center text-[11px] text-slate-500 dark:text-slate-400">
                {t('home.globalMapSearchCount', { count: filteredPoints.length })}
              </p>
            </div>
          </div>
        </div>

        <MoreMenuDrawer open={moreOpen} onClose={() => setMoreOpen(false)} />
      </>
    )
  }

  return (
    <section className={compact ? 'max-w-7xl mx-auto px-2 sm:px-4 pt-0 sm:pt-1' : 'max-w-7xl mx-auto px-2 sm:px-4 pt-3 sm:pt-6'}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {!(compact && embedInHome) ? (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {compact ? (
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {mapSearchHeading}
            </h3>
          ) : (
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {mapSearchHeading}
            </h2>
          )}
          <span className="text-sm sm:text-xs text-slate-500 dark:text-slate-400">
            {t('home.globalMapSearchCount', { count: filteredPoints.length })}
          </span>
        </div>
        ) : (
        <p className="sr-only">
          {mapSearchHeading} · {t('home.globalMapSearchCount', { count: filteredPoints.length })}
        </p>
        )}
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
          {filterChipItems.map((item) => (
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
