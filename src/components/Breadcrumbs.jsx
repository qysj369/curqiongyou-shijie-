import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Breadcrumbs({ items, className = '' }) {
  const { t } = useTranslation()
  if (!items?.length) return null
  return (
    <nav aria-label={t('a11y.breadcrumb')} className={`text-sm text-slate-500 dark:text-slate-400 mb-4 ${className}`.trim()}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-slate-300 dark:text-slate-600">/</span>}
            {item.to != null ? (
              <Link
                to={item.to}
                className="text-amber-600 dark:text-amber-400 hover:underline min-h-8 inline-flex items-center"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-700 dark:text-slate-200 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
