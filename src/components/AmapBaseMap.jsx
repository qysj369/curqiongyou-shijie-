import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { hasAmapKey, loadAmapApi } from '../lib/loadAmapApi'

/**
 * 高德 JS API 2.0 底图容器（底座 1）。需配置 `VITE_AMAP_KEY`；若控制台启用了安全密钥，再配 `VITE_AMAP_SECURITY_CODE`。
 * @param {{ compact?: boolean, centerLng?: number, centerLat?: number, zoom?: number }} [props]
 */
export default function AmapBaseMap({
  compact = false,
  centerLng = 116.397428,
  centerLat = 39.90923,
  zoom = 5,
} = {}) {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasAmapKey()) {
      setLoading(false)
      return undefined
    }

    const el = containerRef.current
    if (!el) return undefined

    let cancelled = false
    setError(null)
    setLoading(true)

    loadAmapApi()
      .then((AMap) => {
        if (cancelled || !containerRef.current) return
        const map = new AMap.Map(containerRef.current, {
          zoom,
          center: [centerLng, centerLat],
        })
        map.addControl(new AMap.Scale())
        mapRef.current = map
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message || String(e))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    }
  }, [centerLng, centerLat, zoom])

  if (!hasAmapKey()) return null

  const heightClass = compact
    ? 'h-[min(52vh,22rem)] min-h-[18rem] md:h-[24rem]'
    : 'h-[72vh] min-h-[24rem] md:h-[26rem]'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          {t('home.amapBaseTitle')}
        </h3>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{t('home.amapBaseLead')}</p>
      <div
        ref={containerRef}
        className={`${heightClass} w-full rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 relative`}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/80 rounded-xl">
            {t('home.amapBaseLoading')}
          </div>
        ) : null}
        {error ? (
          <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800 dark:bg-red-950/80 dark:text-red-200">
            {t('home.amapBaseError', { message: error })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
