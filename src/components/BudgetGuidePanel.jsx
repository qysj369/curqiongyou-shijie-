import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * 穷游特色：仅站内导航，不跳转外部 OTA（取代原外链预订条）。
 * @param {{ destinationName?: string, destinationId?: string, className?: string }} props
 */
export default function BudgetGuidePanel({ destinationName = '', destinationId = '', className = '' }) {
  const { t } = useTranslation()
  const name = destinationName.trim()
  const byDest = name ? `?destination=${encodeURIComponent(name)}` : ''

  const items = [
    { to: `/articles${byDest}`, labelKey: 'budgetGuide.linkGuides', emoji: '🗺️' },
    { to: '/destinations', labelKey: 'budgetGuide.linkDestinations', emoji: '🧭' },
    { to: '/community/qa', labelKey: 'budgetGuide.linkQa', emoji: '💬' },
    { to: '/community/buddies', labelKey: 'budgetGuide.linkBuddies', emoji: '🤝' },
  ]

  return (
    <div
      className={`rounded-xl border border-teal-200/90 dark:border-teal-800/80 bg-gradient-to-br from-teal-50/95 via-white to-amber-50/60 dark:from-teal-950/40 dark:via-slate-900 dark:to-amber-950/20 p-4 ${className}`}
    >
      <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200 mb-1">{t('budgetGuide.panelTitle')}</h3>
      <p className="text-xs text-teal-800/90 dark:text-teal-300/90 mb-3 leading-relaxed">{t('budgetGuide.panelDesc')}</p>
      <div className="flex flex-wrap gap-2">
        {destinationId && (
          <Link
            to={`/destinations/${destinationId}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-100 text-sm font-medium hover:border-amber-300 hover:bg-amber-50/80 dark:hover:bg-slate-700 transition min-h-11"
          >
            <span aria-hidden>📍</span>
            {t('budgetGuide.linkThisDest')}
          </Link>
        )}
        {items.map(({ to, labelKey, emoji }) => (
          <Link
            key={to}
            to={to}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-sm font-medium hover:border-amber-300 hover:bg-amber-50/80 dark:hover:bg-slate-700 transition min-h-11"
          >
            <span aria-hidden>{emoji}</span>
            {t(labelKey)}
          </Link>
        ))}
        <Link
          to="/board"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-sm font-medium hover:border-amber-300 hover:bg-amber-50/80 dark:hover:bg-slate-700 transition min-h-11"
        >
          <span aria-hidden>📝</span>
          {t('budgetGuide.linkBoard')}
        </Link>
      </div>
    </div>
  )
}
