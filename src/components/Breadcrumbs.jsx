import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items, className = '' }) {
  if (!items?.length) return null
  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-slate-500 mb-4 ${className}`.trim()}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-slate-300">/</span>}
            {item.to != null ? (
              <Link to={item.to} className="text-amber-600 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-700 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
