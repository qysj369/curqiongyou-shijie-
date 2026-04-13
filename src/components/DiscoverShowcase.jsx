import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * 站内发现区（取代外链品牌联盟）：穷游网式「内容 + 社区」闭环，仅 React Router 内链。
 */
export default function DiscoverShowcase({ className = '' }) {
  const { t } = useTranslation()

  const tiles = [
    { to: '/articles', labelKey: 'discover.guides', descKey: 'discover.guidesDesc', emoji: '📚' },
    { to: '/destinations', labelKey: 'discover.destinations', descKey: 'discover.destinationsDesc', emoji: '🌏' },
    { to: '/community/qa', labelKey: 'discover.qa', descKey: 'discover.qaDesc', emoji: '❓' },
    { to: '/community/buddies', labelKey: 'discover.buddies', descKey: 'discover.buddiesDesc', emoji: '👥' },
  ]

  return (
    <section className={className}>
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{t('discover.title')}</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">{t('discover.desc')}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tiles.map(({ to, labelKey, descKey, emoji }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-start text-left p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md transition"
          >
            <span className="text-2xl mb-2" aria-hidden>
              {emoji}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{t(labelKey)}</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">{t(descKey)}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
