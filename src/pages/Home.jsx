import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { featuredRoutesForHome, latestArticles, popularDestinations } from '../data/mockData'
import { getUserGuidesAsCards } from '../data/userGuidesStore'
import FavoriteButton from '../components/FavoriteButton'
import AdSlot from '../components/AdSlot'

export default function Home() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  const normalize = (val) => (val || '').toString().toLowerCase()
  const matchesSearch = (text) =>
    !search || normalize(text).includes(normalize(search))

  const filteredFeaturedRoutes = featuredRoutesForHome.filter((route) =>
    matchesSearch(route.title) || matchesSearch(route.destination),
  )

  const filteredPopularDestinations = popularDestinations.filter((dest) =>
    matchesSearch(dest.name) ||
    matchesSearch(dest.country) ||
    matchesSearch(dest.region),
  )

  const filteredLatestArticles = latestArticles.filter((article) =>
    matchesSearch(article.title) ||
    matchesSearch(article.destination) ||
    article.tags.some((tag) => matchesSearch(tag)),
  )

  const recentUserGuides = useMemo(() => getUserGuidesAsCards().slice(0, 6), [])

  return (
    <div>
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm md:text-base tracking-wide mb-2 opacity-95">
            踏遍全球，只为找到你
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.heroTitle')}</h1>
          <p className="text-lg opacity-95 mb-8">{t('home.heroSubtitle')}</p>
          <div className="bg-white rounded-2xl p-4 shadow-xl flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder={t('home.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <select className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option>{t('home.budgetAny')}</option>
              <option>{t('home.budget0_2000')}</option>
              <option>{t('home.budget2000_5000')}</option>
              <option>{t('home.budget5000_10000')}</option>
            </select>
            <select className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option>{t('home.daysAny')}</option>
              <option>{t('home.days3')}</option>
              <option>{t('home.days7')}</option>
              <option>{t('home.days15')}</option>
            </select>
            <button type="button" className="px-8 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl font-semibold transition">
              {t('home.searchButton')}
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">🔥 {t('home.featuredRoutes')}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {filteredFeaturedRoutes.map((route) => (
            <Link
              key={route.id}
              to={`/articles/${route.id}`}
              className="flex-shrink-0 w-72 group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="h-40 bg-slate-200 relative overflow-hidden">
                  <img
                    src={route.cover}
                    alt={route.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-amber-500 text-white text-sm font-medium rounded">
                    {t('home.budgetFrom', { value: route.budget })}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 line-clamp-2">{route.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{t('home.daysDest', { days: route.days, dest: route.destination })}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">🌏 {t('home.popularDestinations')}</h2>
          <Link to="/destinations" className="text-amber-600 hover:text-amber-700 font-medium">
            {t('home.viewAll')}
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredPopularDestinations.map((dest) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="h-32 relative">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <h3 className="font-semibold">{dest.name}</h3>
                    <p className="text-sm opacity-90">{t('home.perDayFrom', { value: dest.dailyBudget })}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdSlot slotId="home-mid" className="min-h-[80px]" />
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">📝 {t('home.latestArticles')}</h2>
          <Link to="/articles" className="text-amber-600 hover:text-amber-700 font-medium">
            {t('home.viewAll')}
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLatestArticles.map((article) => (
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
      </section>

      {recentUserGuides.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 bg-slate-100/50 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">✨ {t('userGuide.recentUserGuides')}</h2>
              <p className="text-slate-600 text-sm mt-1">{t('userGuide.recentUserGuidesSub')}</p>
            </div>
            <Link to="/articles" className="text-amber-600 hover:text-amber-700 font-medium whitespace-nowrap">
              {t('userGuide.viewAllGuides')}
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentUserGuides.map((item) => (
              <div key={item.id} className="relative">
                <Link
                  to={`/articles/${item.id}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={item.cover}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500/90 text-white text-xs font-medium">
                      {t('userGuide.userBadge')}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 line-clamp-2 group-hover:text-amber-600 transition">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      {t('articles.daysBudget', { dest: item.destination, budget: item.budget, days: item.days })}
                    </p>
                    <p className="text-slate-400 text-xs mt-2">{item.author} · {item.date}</p>
                  </div>
                </Link>
                <div className="absolute top-2 right-2 z-10">
                  <FavoriteButton articleId={item.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/community"
          className="block text-center py-6 px-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-200/80 hover:border-amber-300 transition"
        >
          <span className="text-xl">🤝</span>
          <h2 className="text-lg font-bold text-slate-800 mt-2">{t('home.joinCommunity')}</h2>
          <p className="text-slate-600 text-sm mt-1">{t('home.joinCommunityDesc')}</p>
        </Link>
      </section>
    </div>
  )
}
