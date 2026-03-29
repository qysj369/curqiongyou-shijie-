import { useTranslation } from 'react-i18next'
import { getServiceLinks } from '../config/affiliate'

/**
 * 在用户决策场景无缝展示：机票、酒店、当地游（佣金/联盟链接）
 * @param {{ destinationName?: string, className?: string }} props
 */
export default function ServiceLinks({ destinationName = '', className = '' }) {
  const { t } = useTranslation()
  const links = getServiceLinks(destinationName)

  const items = [
    { key: 'flights', url: links.flights, labelKey: 'commerce.flights' },
    { key: 'hotels', url: links.hotels, labelKey: 'commerce.hotels' },
    { key: 'tours', url: links.tours, labelKey: 'commerce.localTours' },
  ]

  return (
    <div className={`rounded-xl border border-slate-200 bg-slate-50/80 p-4 ${className}`}>
      <p className="text-slate-500 text-xs mb-2">{t('commerce.bookingHint')}</p>
      <div className="flex flex-wrap gap-3">
        {items.map(({ key, url, labelKey }) => (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition"
          >
            <span>{key === 'flights' ? '✈️' : key === 'hotels' ? '🏨' : '🎫'}</span>
            <span>{t(labelKey)}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
