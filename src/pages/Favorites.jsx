import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { articles } from '../data/mockData'
import { useFavorites } from '../hooks/useFavorites'
import FavoriteButton from '../components/FavoriteButton'
import Breadcrumbs from '../components/Breadcrumbs'

export default function Favorites() {
  const { t } = useTranslation()
  const { favoriteIds } = useFavorites()
  const list = articles.filter((a) => favoriteIds.includes(a.id))
  const breadcrumbs = [{ label: t('common.home'), to: '/' }, { label: t('favorites.title') }]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('favorites.title')}</h1>
        {list.length === 0 ? (
          <p className="text-slate-600 py-8">
            {t('favorites.empty')}
            <Link to="/" className="text-amber-600 hover:underline ml-1">→ {t('common.home')}</Link>
            <Link to="/articles" className="text-amber-600 hover:underline ml-2">→ {t('common.articles')}</Link>
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {list.map((article) => (
              <div key={article.id} className="relative">
                <Link
                  to={`/articles/${article.id}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.cover}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex gap-2 mb-2">
                      {article.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-slate-800 line-clamp-2 group-hover:text-amber-600 transition">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
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
