import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getArticleGuideMapPayload } from '../data/guideLibrary/mapPayload.js'
import { hasAmapKey, loadAmapApi } from '../lib/loadAmapApi'
import { refineMarkersWithPlaceSearch } from '../lib/amapPlaceSearchRefine.js'

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * 攻略详情内「行程地图」：分站筛选、高德标点 + 信息窗跳转 uri.amap.com（与高德 App 接力）。
 * @param {{ articleId: string }} props
 */
export default function GuideAmapPanel({ articleId }) {
  const { t, i18n } = useTranslation()
  const refineGenRef = useRef(0)
  const [refinedCoords, setRefinedCoords] = useState({})
  const [refining, setRefining] = useState(false)
  const payload = useMemo(
    () => getArticleGuideMapPayload(articleId, i18n.language),
    [articleId, i18n.language],
  )
  const [activeStationKey, setActiveStationKey] = useState(null)

  const filteredMarkers = useMemo(() => {
    if (!activeStationKey) return payload.markers
    return payload.markers.filter((m) => m.stationKey === activeStationKey)
  }, [payload.markers, activeStationKey])

  const fitSignature = useMemo(
    () =>
      filteredMarkers
        .map((m) => `${m.id}:${m.lng.toFixed(6)}:${m.lat.toFixed(6)}`)
        .sort()
        .join(';'),
    [filteredMarkers],
  )

  useEffect(() => {
    setRefinedCoords({})
  }, [fitSignature])

  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const infoRef = useRef(null)

  useEffect(() => {
    if (!hasAmapKey() || !payload.hasData || filteredMarkers.length === 0) return undefined

    const gen = ++refineGenRef.current
    let cancelled = false
    const el = containerRef.current
    if (!el) return undefined

    loadAmapApi()
      .then((AMap) => {
        if (cancelled || !containerRef.current) return
        if (mapRef.current) {
          mapRef.current.destroy()
          mapRef.current = null
        }
        const map = new AMap.Map(containerRef.current, {
          zoom: 6,
          center: [filteredMarkers[0].lng, filteredMarkers[0].lat],
        })
        map.addControl(new AMap.Scale())
        try {
          map.addControl(new AMap.ToolBar({ position: 'RB' }))
        } catch {
          /* 部分环境 ToolBar 异常时保留比例尺 */
        }

        const infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -32),
          closeWhenClickMap: true,
        })
        infoRef.current = infoWindow

        const markerObjs = filteredMarkers.map((m) => {
          const mk = new AMap.Marker({
            position: [m.lng, m.lat],
            title: m.title,
          })
          mk.on('click', () => {
            const pos = mk.getPosition()
            const lng = pos.getLng()
            const lat = pos.getLat()
            const uri = `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(m.title)}`
            const linkText = t('articleDetail.guideMapOpenInAmap')
            const html = `
              <div style="padding:10px 12px;font-size:13px;max-width:240px;line-height:1.45;color:#1f2937">
                <div style="font-weight:600;margin-bottom:4px">${escapeHtml(m.title)}</div>
                <div style="opacity:.85;font-size:12px;margin-bottom:8px">${escapeHtml(m.stationName)}</div>
                <a href="${uri}" target="_blank" rel="noopener noreferrer" style="color:#0284c7;font-size:12px;font-weight:600">${escapeHtml(linkText)}</a>
              </div>`
            infoWindow.setContent(html)
            map.setCenter([lng, lat])
            infoWindow.open(map, mk.getPosition())
          })
          return mk
        })

        map.add(markerObjs)
        map.setFitView(markerObjs, false, [52, 52, 52, 52])
        mapRef.current = map

        const markerTuples = markerObjs.map((mk, i) => ({ marker: mk, meta: filteredMarkers[i] }))
        const anyRefine = markerTuples.some((x) => x.meta?.usePlaceSearch)
        setRefining(false)
        if (!anyRefine || typeof AMap.PlaceSearch !== 'function') return

        setRefining(true)
        void (async () => {
          try {
            const coords = await refineMarkersWithPlaceSearch(AMap, markerTuples, { delayMs: 170 })
            if (cancelled || gen !== refineGenRef.current) return
            setRefinedCoords(coords)
            if (mapRef.current && markerObjs.length) {
              mapRef.current.setFitView(markerObjs, false, [52, 52, 52, 52])
            }
          } catch {
            /* PlaceSearch 失败时保留锚点偏移位置 */
          } finally {
            if (!cancelled && gen === refineGenRef.current) setRefining(false)
          }
        })()
      })
      .catch(() => {
        /* 错误在容器下层文案展示；此处避免未捕获 Promise */
      })

    return () => {
      cancelled = true
      setRefining(false)
      if (infoRef.current) {
        try {
          infoRef.current.close()
        } catch {
          /* noop */
        }
        infoRef.current = null
      }
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    }
  }, [articleId, fitSignature, payload.hasData, i18n.language])

  if (!payload.hasData) return null

  const showMap = hasAmapKey() && filteredMarkers.length > 0
  const stationKeysUnique = [...new Set(payload.markers.map((m) => m.stationKey))]

  return (
    <section
      id="article-section-map"
      className="mt-6 print:hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      aria-label={t('articleDetail.guideMapAria')}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{t('articleDetail.guideMapTitle')}</h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            {t('articleDetail.guideMapLead')}
          </p>
        </div>
      </div>

      {payload.topicLabels.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {payload.topicLabels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {label}
            </span>
          ))}
        </div>
      ) : null}

      {stationKeysUnique.length > 1 ? (
        <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label={t('articleDetail.guideMapStationFilterAria')}>
          <button
            type="button"
            role="tab"
            aria-selected={activeStationKey === null}
            onClick={() => setActiveStationKey(null)}
            className={`min-h-9 rounded-full px-3 py-1.5 text-xs font-semibold transition border ${
              activeStationKey === null
                ? 'border-sky-600 bg-sky-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {t('articleDetail.guideMapFilterAll')}
          </button>
          {payload.stations.map((st) => (
            <button
              key={st.key}
              type="button"
              role="tab"
              aria-selected={activeStationKey === st.key}
              onClick={() => setActiveStationKey(st.key)}
              className={`min-h-9 rounded-full px-3 py-1.5 text-xs font-semibold transition border ${
                activeStationKey === st.key
                  ? 'border-sky-600 bg-sky-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st.nameZh}
            </button>
          ))}
        </div>
      ) : null}

      {!hasAmapKey() && payload.markers.length > 0 ? (
        <p className="mt-3 text-xs text-amber-800 dark:text-amber-200/90 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-xl px-3 py-2">
          {t('articleDetail.guideMapNoKeyHint')}
        </p>
      ) : null}

      {showMap ? (
        <>
          <div
            ref={containerRef}
            className="mt-3 h-64 md:h-80 w-full rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-800/80 overflow-hidden"
          />
          {refining ? (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400" role="status">
              {t('articleDetail.guideMapRefining')}
            </p>
          ) : null}
        </>
      ) : null}

      {filteredMarkers.length > 0 ? (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {filteredMarkers.map((m) => {
            const rc = refinedCoords[m.id]
            const lng = rc?.lng ?? m.lng
            const lat = rc?.lat ?? m.lat
            const uri = `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(m.title)}`
            return (
              <li key={m.id}>
                <a
                  href={uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 flex-col justify-center rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2 text-left text-sm transition hover:border-sky-300 hover:bg-sky-50/80 dark:border-slate-600 dark:bg-slate-800/60 dark:hover:border-sky-600 dark:hover:bg-slate-800"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{m.title}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.stationName}</span>
                </a>
              </li>
            )
          })}
        </ul>
      ) : null}
    </section>
  )
}
