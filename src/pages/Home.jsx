import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { featuredRoutesForHome, latestArticles, popularDestinations, articles } from '../data/mockData'
import { getDestinationRatingMeta } from '../data/destinationRatingMeta'
import StarRatingDisplay from '../components/StarRatingDisplay'
import { getUserGuidesAsCards } from '../data/userGuidesStore'
import FavoriteButton from '../components/FavoriteButton'
import OptimizedImage from '../components/OptimizedImage'
import EmptyState from '../components/EmptyState'
import AdSlot from '../components/AdSlot'
import { matchesGuideCard, matchesDestinationCard } from '../utils/searchMatch'

const BUDGET_MAX = { any: null, '2000': 2000, '5000': 5000, '10000': 10000 }
const DAYS_VALUE = { any: null, '3': 3, '7': 7, '15': 15 }

export default function Home() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [budgetMax, setBudgetMax] = useState('any')
  const [daysFilter, setDaysFilter] = useState('any')

  const ugcList = useMemo(() => getUserGuidesAsCards(), [])

  const matchesBudget = (budget) => {
    const max = BUDGET_MAX[budgetMax]
    if (max == null) return true
    return typeof budget === 'number' && budget <= max
  }

  const matchesDays = (days) => {
    const d = DAYS_VALUE[daysFilter]
    if (d == null) return true
    return typeof days === 'number' && days === d
  }

  const filteredFeaturedRoutes = featuredRoutesForHome.filter(
    (route) =>
      matchesGuideCard(route, search) && matchesBudget(route.budget) && matchesDays(route.days),
  )

  const filteredPopularDestinations = popularDestinations.filter((dest) =>
    matchesDestinationCard(dest, search),
  )

  const filteredLatestArticles = latestArticles.filter(
    (article) =>
      matchesGuideCard(article, search) &&
      matchesBudget(article.budget) &&
      matchesDays(article.days),
  )

  const searchTrimmed = search.trim()
  const mergedSearchResults = useMemo(() => {
    if (!searchTrimmed) return []
    const mb = (budget) => {
      const max = BUDGET_MAX[budgetMax]
      if (max == null) return true
      return typeof budget === 'number' && budget <= max
    }
    const md = (days) => {
      const d = DAYS_VALUE[daysFilter]
      if (d == null) return true
      return typeof days === 'number' && days === d
    }
    const matchAll = (item) =>
      matchesGuideCard(item, search) && mb(item.budget) && md(item.days)
    return [...articles.filter(matchAll), ...ugcList.filter(matchAll)]
  }, [search, searchTrimmed, budgetMax, daysFilter, ugcList, articles])

  const recentUserGuides = useMemo(() => {
    const list = getUserGuidesAsCards()
    const narrowed = list.filter(
      (item) =>
        matchesGuideCard(item, search) && matchesBudget(item.budget) && matchesDays(item.days),
    )
    return narrowed.slice(0, 6)
  }, [search, budgetMax, daysFilter])

  return (
    <div>
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm md:text-base tracking-wide mb-2 opacity-95">
            {t('home.heroEyebrow')}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.heroTitle')}</h1>
          <p className="text-lg opacity-95 mb-8">{t('home.heroSubtitle')}</p>
          <form
            className="bg-white dark:bg-slate-900/95 dark:border dark:border-slate-700 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              document.getElementById('home-search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            <input
              type="search"
              placeholder={t('home.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
              className="flex-1 px-4 py-3 min-h-11 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-800 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <select
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              className="px-4 py-3 min-h-11 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label={t('home.budgetAny')}
            >
              <option value="any">{t('home.budgetAny')}</option>
              <option value="2000">{t('home.budget0_2000')}</option>
              <option value="5000">{t('home.budget2000_5000')}</option>
              <option value="10000">{t('home.budget5000_10000')}</option>
            </select>
            <select
              value={daysFilter}
              onChange={(e) => setDaysFilter(e.target.value)}
              className="px-4 py-3 min-h-11 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label={t('home.daysAny')}
            >
              <option value="any">{t('home.daysAny')}</option>
              <option value="3">{t('home.days3')}</option>
              <option value="7">{t('home.days7')}</option>
              <option value="15">{t('home.days15')}</option>
            </select>
            <button
              type="submit"
              className="px-8 py-3 min-h-11 bg-amber-500 hover:bg-amber-600 rounded-xl font-semibold text-white transition"
            >
              {t('home.searchButton')}
            </button>
          </form>
          <nav className="mt-8 pt-6 border-t border-white/25" aria-label={t('home.quickNavAria')}>
            <p className="text-sm text-white/90 mb-3">{t('home.quickNavLead')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                to="/articles"
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm font-medium border border-white/30 transition min-h-11 inline-flex items-center"
              >
                {t('home.quickGuides')}
              </Link>
              <Link
                to="/destinations"
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm font-medium border border-white/30 transition min-h-11 inline-flex items-center"
              >
                {t('home.quickDestinations')}
              </Link>
              <Link
                to="/community/qa"
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm font-medium border border-white/30 transition min-h-11 inline-flex items-center"
              >
                {t('home.quickQa')}
              </Link>
              <Link
                to="/community/buddies"
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm font-medium border border-white/30 transition min-h-11 inline-flex items-center"
              >
                {t('home.quickBuddies')}
              </Link>
            </div>
          </nav>
        </div>
      </section>

      {searchTrimmed ? (
        <section id="home-search-results" className="max-w-7xl mx-auto px-4 pt-6 pb-2 scroll-mt-24">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">{t('home.searchResultsTitle')}</h2>
          {mergedSearchResults.length > 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{t('home.searchResultsCount', { count: mergedSearchResults.length })}</p>
          ) : null}
          {mergedSearchResults.length === 0 ? (
            <EmptyState
              emoji="🔍"
              title={t('ui.emptySearchTitle')}
              description={t('home.searchNoResults')}
              actionTo="/articles"
              actionLabel={t('ui.emptySearchAction')}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mergedSearchResults.map((article) => (
                <div key={article.id} className="relative">
                  <Link
                    to={`/articles/${article.id}`}
                    className="group block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition border border-slate-100 dark:border-slate-700"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <OptimizedImage
                        src={article.cover}
                        alt=""
                        loading="lazy"
                        w={900}
                        h={384}
                        q={75}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {article.source === 'user' && (
                        <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start max-w-[75%] z-[1]">
                          <span className="px-2 py-0.5 rounded bg-amber-500/90 text-white text-xs font-medium">
                            {t('userGuide.userBadge')}
                          </span>
                          {article.reviewStatus === 'pending' && (
                            <span className="px-2 py-0.5 rounded bg-slate-900/90 text-amber-100 text-xs font-medium">
                              {t('governance.reviewPending')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(article.tags || []).slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-amber-600 transition">
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
        </section>
      ) : null}

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400 mb-2">
            {t('home.sloganTag')}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            {t('home.sloganPrimaryEn')}
          </h2>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-4">{t('home.sloganPrimaryZh')}</p>
          <p className="text-slate-600 dark:text-slate-400 leading-7">{t('home.sloganRationale')}</p>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-600 p-4">
              <p className="text-slate-800 dark:text-slate-100 font-semibold">{t('home.sloganAlt1En')}</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('home.sloganAlt1Zh')}</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-600 p-4">
              <p className="text-slate-800 dark:text-slate-100 font-semibold">{t('home.sloganAlt2En')}</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('home.sloganAlt2Zh')}</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-600 p-4">
              <p className="text-slate-800 dark:text-slate-100 font-semibold">{t('home.sloganAlt3En')}</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('home.sloganAlt3Zh')}</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-600 p-4">
              <p className="text-slate-800 dark:text-slate-100 font-semibold">{t('home.sloganAlt4En')}</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('home.sloganAlt4Zh')}</p>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Link
              to="/about#slogan-playbook"
              className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 underline underline-offset-2 min-h-11 inline-flex items-center"
            >
              {t('home.viewSloganPlaybook')}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 md:mb-6">
          🔥 {t('home.featuredRoutes')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 md:hidden">{t('ui.swipeHint')}</p>
        {filteredFeaturedRoutes.length === 0 ? (
          <EmptyState
            emoji="🔥"
            title={t('ui.emptyFeaturedTitle')}
            description={t('ui.emptyFeaturedDesc')}
            actionTo="/articles"
            actionLabel={t('home.viewAll')}
          />
        ) : (
          <div className="touch-scroll-x flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
            {filteredFeaturedRoutes.map((route) => (
              <Link
                key={route.id}
                to={`/articles/${route.id}`}
                className="flex-shrink-0 w-[min(18rem,calc(100vw-2.5rem))] snap-start group"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700">
                  <div className="h-40 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                    <OptimizedImage
                      src={route.cover}
                      alt={route.title}
                      loading="lazy"
                      w={720}
                      h={320}
                      q={75}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-amber-500 text-white text-sm font-medium rounded">
                      {t('home.budgetFrom', { value: route.budget })}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2">{route.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      {t('home.daysDest', { days: route.days, dest: route.destination })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🌏 {t('home.popularDestinations')}</h2>
          <Link
            to="/destinations"
            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium min-h-11 inline-flex items-center shrink-0"
          >
            {t('home.viewAll')}
          </Link>
        </div>
        {filteredPopularDestinations.length === 0 ? (
          <EmptyState
            emoji="🌏"
            title={t('ui.emptyDestinationsTitle')}
            description={t('ui.emptyDestinationsDesc')}
            actionTo="/destinations"
            actionLabel={t('home.viewAll')}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredPopularDestinations.map((dest) => (
              <Link key={dest.id} to={`/destinations/${dest.id}`} className="group">
                <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition border border-slate-100 dark:border-slate-700">
                  <div className="h-32 relative">
                    <OptimizedImage
                      src={dest.image}
                      alt={dest.name}
                      loading="lazy"
                      w={600}
                      h={256}
                      q={75}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <h3 className="font-semibold text-base drop-shadow">{dest.name}</h3>
                      <div className="mt-1 scale-90 origin-left">
                        <StarRatingDisplay
                          value={getDestinationRatingMeta(dest).rating}
                          reviewCount={getDestinationRatingMeta(dest).reviewCount}
                          size="sm"
                          tone="dark"
                        />
                      </div>
                      <p className="text-sm opacity-90 mt-0.5">{t('home.perDayFrom', { value: dest.dailyBudget })}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdSlot slotId="home-mid" className="min-h-[80px]" />
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">📝 {t('home.latestArticles')}</h2>
          <Link
            to="/articles"
            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium min-h-11 inline-flex items-center shrink-0"
          >
            {t('home.viewAll')}
          </Link>
        </div>
        {filteredLatestArticles.length === 0 ? (
          <EmptyState
            emoji="📝"
            title={t('ui.emptyLatestTitle')}
            description={t('ui.emptyLatestDesc')}
            actionTo="/articles"
            actionLabel={t('home.viewAll')}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLatestArticles.map((article) => (
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
      </section>

      {recentUserGuides.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex justify-between items-center mb-6 gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">✨ {t('userGuide.recentUserGuides')}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('userGuide.recentUserGuidesSub')}</p>
            </div>
            <Link
              to="/articles"
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium whitespace-nowrap min-h-11 inline-flex items-center shrink-0"
            >
              {t('userGuide.viewAllGuides')}
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentUserGuides.map((item) => (
              <div key={item.id} className="relative">
                <Link
                  to={`/articles/${item.id}`}
                  className="group block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition border border-slate-100 dark:border-slate-700"
                >
                  <div className="h-48 overflow-hidden relative">
                    <OptimizedImage
                      src={item.cover}
                      alt={item.title}
                      loading="lazy"
                      w={900}
                      h={384}
                      q={75}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start max-w-[75%] z-[1]">
                      <span className="px-2 py-0.5 rounded bg-amber-500/90 text-white text-xs font-medium">
                        {t('userGuide.userBadge')}
                      </span>
                      {item.reviewStatus === 'pending' && (
                        <span className="px-2 py-0.5 rounded bg-slate-900/90 text-amber-100 text-xs font-medium">
                          {t('governance.reviewPending')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      {t('articles.daysBudget', { dest: item.destination, budget: item.budget, days: item.days })}
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                      {item.author} · {item.date}
                    </p>
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
          className="block text-center py-6 px-4 min-h-[5.5rem] rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-500/5 dark:via-orange-500/5 dark:to-rose-500/5 border border-amber-200/80 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-600/60 transition"
        >
          <span className="text-xl">🤝</span>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-2">{t('home.joinCommunity')}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('home.joinCommunityDesc')}</p>
        </Link>
      </section>
    </div>
  )
}
