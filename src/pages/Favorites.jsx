import { useTranslation } from 'react-i18next'
import { articles } from '../data/mockData'
import { useFavorites } from '../hooks/useFavorites'
import FavoriteButton from '../components/FavoriteButton'
import OptimizedImage from '../components/OptimizedImage'
import Breadcrumbs from '../components/Breadcrumbs'
import EmptyState from '../components/EmptyState'

export default function Favorites() {
  const { t } = useTranslation()
  const { favoriteIds } = useFavorites()
  const list = articles.filter((a) => favoriteIds.includes(a.id))
  const breadcrumbs = [{ label: t('common.home'), to: '/' }, { label: t('favorites.title') }]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('favorites.title')}</h1>
        {list.length === 0 ? (
          <EmptyState
            emoji="⭐"
            title={t('ui.emptyFavoritesTitle')}
            description={t('favorites.empty')}
            actionTo="/articles"
            actionLabel={t('common.articles')}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {list.map((article) => (
              <div key={article.id} className="relative">
                <Link
                  to={`/articles/${article.id}`}
                  className="group block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition border border-slate-100 dark:border-slate-700"
                >
                  <div className="h-48 overflow-hidden">
                    <OptimizedImage
                      src={article.cover}
                      alt={article.title}
                      loading="lazy"
                      w={900}
                      h={384}
                      q={75}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      {t('articles.daysBudget', { dest: article.destination, budget: article.budget, days: article.days })}
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
