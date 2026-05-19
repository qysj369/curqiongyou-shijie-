import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FavoriteButton from './FavoriteButton'
import OptimizedImage from './OptimizedImage'
import { approxUsdFromCny, formatDate, formatInteger } from '../utils/localeFormat'
import { buildTripAiHrefFromArticle } from '../utils/tripGuideBridge.js'

export default function RouteCard({ item, cover, showUsdApprox, language }) {
  const { t } = useTranslation()

  return (
    <div className="relative app-surface-card overflow-hidden">
      <Link
        to={`/routes/${item.id}`}
        className="group block motion-safe:transition motion-safe:hover:shadow-[0_8px_24px_rgba(2,6,23,0.12)]"
      >
        <div className="relative h-48 overflow-hidden">
          <OptimizedImage
            src={cover}
            alt={item.title}
            loading="lazy"
            w={900}
            h={384}
            q={75}
            className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
          />
          {item.source === 'user' && (
            <div className="absolute left-2 top-2 z-[1] flex max-w-[75%] flex-col items-start gap-1.5">
              <span className="rounded bg-sky-600/90 px-2 py-0.5 text-xs font-medium text-white">
                {t('userGuide.userBadge')}
              </span>
              {item.reviewStatus === 'pending' && (
                <span className="rounded bg-slate-900/90 px-2 py-0.5 text-xs font-medium text-sky-100 dark:bg-slate-950/95">
                  {t('governance.reviewPending')}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-2 flex flex-wrap gap-2">
            {(item.tags || []).map((tag) => (
              <span
                key={tag}
                className="rounded bg-sky-100 px-2 py-0.5 text-xs text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="line-clamp-2 flex-1 font-semibold text-slate-800 transition group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-300">
              {item.title}
            </h3>
            {item.featured ? (
              <span className="shrink-0 rounded bg-violet-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {t('articles.featuredBadge')}
              </span>
            ) : null}
            {item.intentVariant ? (
              <span className="shrink-0 rounded bg-amber-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {t('articles.intentVariantBadge')}
              </span>
            ) : null}
            {item.city && item.destination === '中国' ? (
              <span className="shrink-0 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {item.city}
              </span>
            ) : null}
          </div>
          {item.intentSummary ? (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {item.intentSummary}
            </p>
          ) : null}
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {(() => {
              const usd = approxUsdFromCny(item.budget)
              const key = showUsdApprox && usd != null ? 'articles.daysBudgetWithUsd' : 'articles.daysBudget'
              return t(key, {
                dest: item.destination,
                budget: formatInteger(item.budget, language),
                usd,
                days: formatInteger(item.days, language),
              })
            })()}
          </p>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {t('articles.authorDate', {
              author: item.author,
              date: formatDate(item.date, language),
            })}
          </p>
          {item.days > 0 && typeof item.budget === 'number' && item.budget > 0 ? (
            <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {(() => {
                const daily = Math.max(1, Math.round(item.budget / item.days))
                const usd = showUsdApprox ? approxUsdFromCny(daily) : null
                return usd != null
                  ? t('articles.routeCardPerDayUsd', {
                      cny: formatInteger(daily, language),
                      usd,
                    })
                  : t('articles.routeCardPerDay', { cny: formatInteger(daily, language) })
              })()}
            </p>
          ) : null}
        </div>
      </Link>
      {item.source !== 'user' ? (
        <div className="border-t border-slate-100 px-4 py-2.5 dark:border-slate-700">
          <Link
            to={buildTripAiHrefFromArticle(item)}
            className="text-xs font-semibold text-violet-700 hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-100"
          >
            {t('articles.cardTripAi')}
          </Link>
        </div>
      ) : null}
      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton articleId={item.id} />
      </div>
    </div>
  )
}
