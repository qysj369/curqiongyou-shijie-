import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { approxUsdFromCny, formatInteger } from '../utils/localeFormat'
import { useUsdApproxDisplay } from '../contexts/UsdApproxPreferenceContext'
import { articles } from '../data/mockData'
import { useFavorites } from '../hooks/useFavorites'
import FavoriteButton from '../components/FavoriteButton'
import OptimizedImage from '../components/OptimizedImage'
import Breadcrumbs from '../components/Breadcrumbs'
import EmptyState from '../components/EmptyState'
import CopyPageLinkButton from '../components/CopyPageLinkButton'
import assignArticleGridCoversInOrder from '../utils/homePlaceCover.js'

export default function Favorites() {
  const { t, i18n } = useTranslation()
  const { showUsdApprox } = useUsdApproxDisplay()
  const { favoriteIds } = useFavorites()
  const list = useMemo(
    () => articles.filter((a) => favoriteIds.includes(a.id)),
    [favoriteIds],
  )
  const favoriteGridItems = useMemo(() => assignArticleGridCoversInOrder(list), [list])
  const breadcrumbs = [{ label: t('common.navMap'), to: '/map' }, { label: t('favorites.title') }]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('favorites.title')}</h1>
          <CopyPageLinkButton />
        </div>
        {list.length === 0 ? (
          <EmptyState
            emoji="⭐"
            title={t('ui.emptyFavoritesTitle')}
            description={t('favorites.empty')}
            actionTo="/routes"
            actionLabel={t('common.articles')}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {favoriteGridItems.map(({ item: article, cover }) => (
              <div key={article.id} className="relative">
                <Link
                  to={`/routes/${article.id}`}
                  className="group block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md motion-safe:hover:shadow-lg motion-safe:transition border border-slate-100 dark:border-slate-700"
                >
                  <div className="h-48 overflow-hidden">
                    <OptimizedImage
                      src={cover}
                      alt={article.title}
                      loading="lazy"
                      w={900}
                      h={384}
                      q={75}
                      className="w-full h-full object-cover motion-safe:group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      {t(showUsdApprox ? 'articles.daysBudgetWithUsd' : 'articles.daysBudget', {
                        dest: article.destination,
                        budget: formatInteger(article.budget, i18n.language),
                        usd: approxUsdFromCny(article.budget),
                        days: formatInteger(article.days, i18n.language),
                      })}
                    </p>
                  </div>
                </Link>
                <div className="absolute top-2 right-2 z-10">
                  <FavoriteButton articleId={article.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
