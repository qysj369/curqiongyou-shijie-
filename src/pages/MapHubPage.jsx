import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { guideStations } from '../data/guideLibrary/stations/stationsIndex.js'
import { places } from '../data/placeModel.js'
import { hasAmapKey, loadAmapApi } from '../lib/loadAmapApi'
import { buildBudgetGuidePois } from '../lib/budgetGuidePois.js'

function layerForStation(st) {
  const n = Number(st.parentPlaceId) || 0
  return ['blue', 'green', 'orange'][n % 3]
}

const LAYER_KEYS = ['blue', 'green', 'orange']

function guidePoiDotColor(category) {
  if (category === 'blue') return '#0284c7'
  if (category === 'green') return '#059669'
  return '#d97706'
}

/** 全国模式下攻略点小圆点过多会拖慢高德；单城不截断 */
const NATIONAL_GUIDE_MARKER_CAP = 180

/**
 * 模块 2：地图主页增强 — 全国/单城、分层颜色、城市分站 + 与首页同源的穷游攻略 POI（高德叠加）。
 */
export default function MapHubPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [mode, setMode] = useState('national')
  const [placeId, setPlaceId] = useState('')
  const [layers, setLayers] = useState({ blue: true, green: true, orange: true })
  const [selectedStation, setSelectedStation] = useState(null)
  const [selectedGuidePoi, setSelectedGuidePoi] = useState(null)
  const [showGuidePois, setShowGuidePois] = useState(true)
  const [guideCat, setGuideCat] = useState('all')
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    const pid = searchParams.get('place')
    const md = searchParams.get('mode')
    if (md === 'national') {
      setMode('national')
      setPlaceId('')
      return
    }
    if (pid) {
      setPlaceId(pid)
      setMode('city')
    }
  }, [searchParams])

  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    if (mode === 'national') {
      next.set('mode', 'national')
      next.delete('place')
    } else {
      next.set('mode', 'city')
      if (placeId) next.set('place', placeId)
      else next.delete('place')
    }
    const sameMode = (searchParams.get('mode') || '') === (next.get('mode') || '')
    const samePlace = (searchParams.get('place') || '') === (next.get('place') || '')
    if (!sameMode || !samePlace) setSearchParams(next, { replace: true })
  }, [mode, placeId, searchParams, setSearchParams])

  const filteredStations = useMemo(() => {
    if (mode === 'national') return guideStations
    if (!placeId) return []
    return guideStations.filter((s) => String(s.parentPlaceId) === String(placeId))
  }, [mode, placeId])

  const visibleStations = useMemo(
    () => filteredStations.filter((s) => layers[layerForStation(s)]),
    [filteredStations, layers],
  )

  const guidePois = useMemo(() => {
    const cid = mode === 'city' && placeId ? placeId : null
    return buildBudgetGuidePois(t, { countryPlaceId: cid })
  }, [t, mode, placeId])

  const visibleGuidePois = useMemo(() => {
    const catOk = (p) => guideCat === 'all' || p.category === guideCat
    const layerOk = (p) => layers[p.category]
    return guidePois.filter((p) => catOk(p) && layerOk(p))
  }, [guidePois, guideCat, layers])

  const layerMeta = useMemo(
    () => ({
      blue: { label: t('mapHubPage.layerBlue'), stroke: '#0284c7', fill: '#0ea5e9' },
      green: { label: t('mapHubPage.layerGreen'), stroke: '#059669', fill: '#10b981' },
      orange: { label: t('mapHubPage.layerOrange'), stroke: '#d97706', fill: '#f59e0b' },
    }),
    [t],
  )

  const guidePoisOnMap = useMemo(() => {
    if (mode !== 'national' || visibleGuidePois.length <= NATIONAL_GUIDE_MARKER_CAP) return visibleGuidePois
    return visibleGuidePois.slice(0, NATIONAL_GUIDE_MARKER_CAP)
  }, [mode, visibleGuidePois])

  const nationalGuideTruncated =
    mode === 'national' && showGuidePois && visibleGuidePois.length > guidePoisOnMap.length

  const stationPinCount = useMemo(() => visibleStations.filter((s) => s.center).length, [visibleStations])
  const guideDotCount = showGuidePois ? guidePoisOnMap.length : 0

  const rebuildMap = useCallback(() => {
    if (!hasAmapKey() || !containerRef.current) return
    setSelectedStation(null)
    setSelectedGuidePoi(null)

    loadAmapApi().then((AMap) => {
      if (!containerRef.current) return
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
      const map = new AMap.Map(containerRef.current, { zoom: 4, center: [106, 35] })
      map.addControl(new AMap.Scale())
      try {
        map.addControl(new AMap.ToolBar({ position: 'RB' }))
      } catch {
        /* noop */
      }

      const stationMarkers = visibleStations
        .map((st) => {
          if (!st.center) return null
          const layer = layerForStation(st)
          const mk = new AMap.Marker({
            position: [st.center.lng, st.center.lat],
            title: t('mapHubPage.markerStationTitle', { name: st.nameZh, layer: layerMeta[layer].label }),
          })
          mk.on('click', () => {
            setSelectedGuidePoi(null)
            setSelectedStation(st)
          })
          return mk
        })
        .filter(Boolean)

      const guideMarkers = []
      if (showGuidePois) {
        for (const p of guidePoisOnMap) {
          const color = guidePoiDotColor(p.category)
          const mk = new AMap.Marker({
            position: [p.lng, p.lat],
            title: t('mapHubPage.markerGuideTitle', { destination: p.destinationName, name: p.name }),
            content: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.35);cursor:pointer" aria-hidden="true"></div>`,
            offset: new AMap.Pixel(-7, -7),
          })
          mk.on('click', () => {
            setSelectedStation(null)
            setSelectedGuidePoi(p)
          })
          guideMarkers.push(mk)
        }
      }

      const all = [...stationMarkers, ...guideMarkers]
      if (all.length) {
        map.add(all)
        map.setFitView(all, false, [48, 48, 48, 48])
      }
      mapRef.current = map
    })
  }, [visibleStations, guidePoisOnMap, showGuidePois, layerMeta, t])

  useEffect(() => {
    rebuildMap()
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    }
  }, [rebuildMap])

  const askAiStation = (st) => {
    const msg = t('mapHubPage.aiStationMsg', { name: st.nameZh })
    window.dispatchEvent(new CustomEvent('roamwise:ai-itinerary', { detail: { message: msg } }))
  }

  const askAiGuidePoi = (p) => {
    const msg = t('mapHubPage.aiGuideMsg', {
      destination: p.destinationName,
      name: p.name,
      type: p.category,
    })
    window.dispatchEvent(new CustomEvent('roamwise:ai-itinerary', { detail: { message: msg } }))
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('mapHubPage.title')}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t('mapHubPage.lead', { cap: NATIONAL_GUIDE_MARKER_CAP })}
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-sm font-medium text-sky-700 dark:text-sky-300">
          <Link to="/" className="hover:underline">
            {t('mapHubPage.backHome')}
          </Link>
          <Link to="/library" className="hover:underline">
            {t('mapHubPage.linkLibrary')}
          </Link>
          <Link to="/advisor" className="hover:underline">
            {t('mapHubPage.linkAdvisor')}
          </Link>
          <Link to="/trip-ai" className="hover:underline">
            {t('mapHubPage.linkTripAi')}
          </Link>
          <Link to="/steward" className="hover:underline">
            {t('mapHubPage.linkSteward')}
          </Link>
          <Link to="/me" className="hover:underline">
            {t('mapHubPage.linkMe')}
          </Link>
        </nav>
      </header>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode('national')
            setPlaceId('')
          }}
          className={`min-h-9 rounded-full px-3 text-xs font-semibold ${mode === 'national' ? 'bg-sky-600 text-white' : 'border border-slate-200 dark:border-slate-600'}`}
        >
          {t('mapHubPage.national')}
        </button>
        <button
          type="button"
          onClick={() => setMode('city')}
          className={`min-h-9 rounded-full px-3 text-xs font-semibold ${mode === 'city' ? 'bg-sky-600 text-white' : 'border border-slate-200 dark:border-slate-600'}`}
        >
          {t('mapHubPage.cityMode')}
        </button>
        {mode === 'city' ? (
          <select
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            className="min-h-9 rounded-lg border border-slate-200 px-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          >
            <option value="">{t('mapHubPage.selectPlace')}</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <div className="mb-3 flex flex-wrap gap-3 text-xs">
        {LAYER_KEYS.map((key) => {
          const v = layerMeta[key]
          return (
            <label key={key} className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={layers[key]}
                onChange={(e) => setLayers((prev) => ({ ...prev, [key]: e.target.checked }))}
              />
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: v.fill }} />
                {v.label}
              </span>
            </label>
          )
        })}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
        <label className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
          <input type="checkbox" checked={showGuidePois} onChange={(e) => setShowGuidePois(e.target.checked)} />
          {t('mapHubPage.showGuidePois')}
        </label>
        <span className="text-slate-400">|</span>
        <span className="text-slate-500">{t('mapHubPage.guideFilter')}</span>
        {[
          { id: 'all', label: t('mapHubPage.catAll') },
          { id: 'blue', label: t('mapHubPage.catBlue') },
          { id: 'green', label: t('mapHubPage.catGreen') },
          { id: 'orange', label: t('mapHubPage.catOrange') },
        ].map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setGuideCat(x.id)}
            className={`rounded-full px-2.5 py-1 font-semibold ${
              guideCat === x.id ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900' : 'border border-slate-200 dark:border-slate-600'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      {!hasAmapKey() ? (
        <p className="mb-3 text-sm text-amber-800 dark:text-amber-200">{t('mapHubPage.needAmapKey')}</p>
      ) : null}
      {mode === 'city' && !placeId ? (
        <p className="mb-3 text-sm text-amber-800 dark:text-amber-200">{t('mapHubPage.cityPickCountry')}</p>
      ) : null}
      {mode === 'city' && placeId && !visibleStations.length ? (
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{t('mapHubPage.noStations')}</p>
      ) : null}
      {nationalGuideTruncated ? (
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
          {t('mapHubPage.nationalTruncated', { total: visibleGuidePois.length, shown: guidePoisOnMap.length })}
        </p>
      ) : null}
      {hasAmapKey() ? (
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          {t('mapHubPage.statsLine', { stations: stationPinCount, guides: guideDotCount })}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,1fr)]">
        <div
          ref={containerRef}
          className="h-[min(60vh,28rem)] w-full rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60"
        />
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">{t('mapHubPage.asideTitle')}</h2>
          {!selectedStation && !selectedGuidePoi ? (
            <p className="mt-2 text-slate-500">{t('mapHubPage.asideEmpty')}</p>
          ) : null}

          {selectedStation ? (
            <div className="mt-2 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">{t('mapHubPage.kindStation')}</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{selectedStation.nameZh}</p>
              {selectedStation.nameEn ? <p className="text-xs text-slate-500">{selectedStation.nameEn}</p> : null}
              <p className="text-xs text-slate-500">{t('mapHubPage.stationKey', { key: selectedStation.key })}</p>
              {selectedStation.center ? (
                <a
                  href={`https://uri.amap.com/marker?position=${selectedStation.center.lng},${selectedStation.center.lat}&name=${encodeURIComponent(selectedStation.nameZh)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center rounded-lg bg-sky-600 px-3 text-xs font-semibold text-white"
                >
                  {t('mapHubPage.amapCityCenter')}
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => askAiStation(selectedStation)}
                className="mt-2 w-full min-h-9 rounded-lg border border-slate-300 text-xs font-semibold dark:border-slate-600"
              >
                {t('mapHubPage.aiStationOrder')}
              </button>
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-2 dark:border-slate-700">
                <Link
                  to={`/trip-ai?destination=${encodeURIComponent(selectedStation.nameZh)}`}
                  className="inline-flex min-h-9 items-center justify-center rounded-lg border border-sky-400 px-3 text-xs font-semibold text-sky-800 dark:border-sky-600 dark:text-sky-200"
                >
                  {t('mapHubPage.openTripAi')}
                </Link>
                <Link
                  to={`/advisor?q=${encodeURIComponent(t('mapHubPage.advisorQStation', { name: selectedStation.nameZh }))}`}
                  className="inline-flex min-h-9 items-center justify-center rounded-lg border border-sky-400 px-3 text-xs font-semibold text-sky-800 dark:border-sky-600 dark:text-sky-200"
                >
                  {t('mapHubPage.openAdvisor')}
                </Link>
              </div>
            </div>
          ) : null}

          {selectedGuidePoi ? (
            <div className="mt-2 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">{t('mapHubPage.kindGuide')}</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{selectedGuidePoi.destinationName}</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">{selectedGuidePoi.name}</p>
              <p className="text-xs text-slate-500">{t('mapHubPage.typeLabel', { type: selectedGuidePoi.category })}</p>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{selectedGuidePoi.highlights}</p>
              <div className="flex flex-col gap-2">
                <a
                  href={`https://uri.amap.com/marker?position=${selectedGuidePoi.lng},${selectedGuidePoi.lat}&name=${encodeURIComponent(selectedGuidePoi.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center justify-center rounded-lg bg-sky-600 px-3 text-xs font-semibold text-white"
                >
                  {t('mapHubPage.amapPoint')}
                </a>
                <Link
                  to={`/routes?destination=${encodeURIComponent(selectedGuidePoi.destinationName)}`}
                  className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-300 text-xs font-semibold dark:border-slate-600"
                >
                  {t('mapHubPage.routesForDest')}
                </Link>
                <Link
                  to={`/trip-ai?destination=${encodeURIComponent(selectedGuidePoi.destinationName)}`}
                  className="inline-flex min-h-9 items-center justify-center rounded-lg border border-sky-400 px-3 text-xs font-semibold text-sky-800 dark:border-sky-600 dark:text-sky-200"
                >
                  {t('mapHubPage.openTripAi')}
                </Link>
                <Link
                  to={`/advisor?q=${encodeURIComponent(
                    t('mapHubPage.advisorQGuide', {
                      destination: selectedGuidePoi.destinationName,
                      name: selectedGuidePoi.name,
                    }),
                  )}`}
                  className="inline-flex min-h-9 items-center justify-center rounded-lg border border-sky-400 px-3 text-xs font-semibold text-sky-800 dark:border-sky-600 dark:text-sky-200"
                >
                  {t('mapHubPage.openAdvisor')}
                </Link>
                <button
                  type="button"
                  onClick={() => askAiGuidePoi(selectedGuidePoi)}
                  className="w-full min-h-9 rounded-lg border border-emerald-500 text-xs font-semibold text-emerald-800 dark:border-emerald-600 dark:text-emerald-200"
                >
                  {t('mapHubPage.aiGuideDig')}
                </button>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
