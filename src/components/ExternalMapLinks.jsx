import { useTranslation } from 'react-i18next'

/**
 * 系统地图外链：Google / Apple（无嵌入地图，符合当前「诚实进度」）
 * @param {{ mapsQuery: string, className?: string }} props
 */
export default function ExternalMapLinks({ mapsQuery, className = '' }) {
  const { t } = useTranslation()
  const q = String(mapsQuery || '').trim()
  if (!q) return null
  const encoded = encodeURIComponent(q)
  const googleHref = `https://www.google.com/maps/search/?api=1&query=${encoded}`
  const appleHref = `https://maps.apple.com/?q=${encoded}`

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      role="group"
      aria-label={t('maps.openGroupAria')}
    >
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('maps.openLabel')}</span>
      <a
        href={googleHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center min-h-9 px-3 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:border-sky-400/80 hover:bg-sky-50/80 dark:hover:bg-slate-700 transition"
      >
        {t('maps.openGoogle')}
      </a>
      <a
        href={appleHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center min-h-9 px-3 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:border-sky-400/80 hover:bg-sky-50/80 dark:hover:bg-slate-700 transition"
      >
        {t('maps.openApple')}
      </a>
    </div>
  )
}
