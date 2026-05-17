import { useEffect, useMemo, useRef } from 'react'
import { hasAmapKey, loadAmapApi } from '../../lib/loadAmapApi'

/**
 * @param {{ itinerary: { days?: { pois?: { lng: number, lat: number, name?: string }[] }[] } | null, className?: string }} props
 */
export default function ItineraryAmapPreview({ itinerary, className = '' }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  const points = useMemo(() => {
    if (!itinerary?.days?.length) return []
    const out = []
    for (const d of itinerary.days) {
      for (const p of d.pois || []) {
        const lng = Number(p.lng)
        const lat = Number(p.lat)
        if (Number.isFinite(lng) && Number.isFinite(lat)) {
          out.push({ lng, lat, title: p.name || 'POI' })
        }
      }
    }
    return out
  }, [itinerary])

  useEffect(() => {
    if (!hasAmapKey() || points.length === 0) return undefined
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
          zoom: 10,
          center: [points[0].lng, points[0].lat],
        })
        map.addControl(new AMap.Scale())
        try {
          map.addControl(new AMap.ToolBar({ position: 'RB' }))
        } catch {
          /* noop */
        }
        const markers = points.map(
          (pt) =>
            new AMap.Marker({
              position: [pt.lng, pt.lat],
              title: pt.title,
            }),
        )
        map.add(markers)
        map.setFitView(markers, false, [40, 40, 40, 40])
        mapRef.current = map
      })
      .catch(() => {})

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    }
  }, [points])

  if (!hasAmapKey()) {
    return (
      <p className={`text-xs text-slate-500 dark:text-slate-400 ${className}`}>
        配置 VITE_AMAP_KEY 后显示行程标点地图预览。
      </p>
    )
  }
  if (points.length === 0) {
    return (
      <p className={`text-xs text-slate-500 dark:text-slate-400 ${className}`}>暂无带坐标的 POI，无法预览地图。</p>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`h-56 w-full rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-800/80 overflow-hidden ${className}`}
    />
  )
}
