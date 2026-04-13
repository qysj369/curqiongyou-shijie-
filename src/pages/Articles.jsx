import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { articles } from '../data/mockData'
import { getUserGuidesAsCards } from '../data/userGuidesStore'
import FavoriteButton from '../components/FavoriteButton'
import OptimizedImage from '../components/OptimizedImage'
import Breadcrumbs from '../components/Breadcrumbs'
import UserGuideForm from '../components/UserGuideForm'
import EmptyState from '../components/EmptyState'
import { matchesGuideCard } from '../utils/searchMatch'

const BUDGET_OPTIONS = [
  { value: 'any', labelKey: 'home.budgetAny' },
  { value: '2000', labelKey: 'home.budget0_2000' },
  { value: '5000', labelKey: 'home.budget2000_5000' },
  { value: '10000', labelKey: 'home.budget5000_10000' },
]
const DAYS_OPTIONS = [
  { value: 'any', labelKey: 'home.daysAny' },
  { value: '3', labelKey: 'home.days3' },
  { value: '7', labelKey: 'home.days7' },
  { value: '15', labelKey: 'home.days15' },
]

export default function Articles() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [budgetMax, setBudgetMax] = useState('any')
  const [daysFilter, setDaysFilter] = useState('any')
  const [destinationFilter, setDestinationFilter] = useState('any')
  const [sortBy, setSortBy] = useState('default')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [keyword, setKeyword] = useState('')

  const pgcWithSource = useMemo(() => articles.map((a) => ({ ...a, source: 'editor' })), [])
  const ugcCards = useMemo(() => getUserGuidesAsCards(), [])
  const destinationList = useMemo(
    () => [...new Set([...articles.map((a) => a.destination), ...ugcCards.map((c) => c.destination)].filter(Boolean))].sort(),
    [ugcCards],
  )

  const destFromUrl = searchParams.get('destination')
  useEffect(() => {
    if (!destFromUrl) return
    if (destinationList.includes(destFromUrl)) {
      setDestinationFilter(destFromUrl)
    }
  }, [destFromUrl, destinationList])

  const matchesBudget = (budget) =>
    budgetMax === 'any' || (typeof budget === 'number' && budget <= Number(budgetMax))
  const matchesDays = (days) =>
    daysFilter === 'any' || (typeof days === 'number' && days === Number(daysFilter))
  const matchesDestination = (dest) =>
    destinationFilter === 'any' || dest === destinationFilter

  const filteredArticles = useMemo(() => {
    let list =
      sourceFilter === 'editor'
        ? pgcWithSource
        : sourceFilter === 'user'
          ? ugcCards
          : [...pgcWithSource, ...ugcCards]
    list = list.filter(
      (item) =>
        matchesBudget(item.budget) &&
        matchesDays(item.days) &&
        matchesDestination(item.destination) &&
        matchesGuideCard(item, keyword),
    )
    if (sortBy === 'dateDesc') list = [...list].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    if (sortBy === 'budgetAsc') list = [...list].sort((a, b) => (a.budget ?? 0) - (b.budget ?? 0))
    if (sortBy === 'daysAsc') list = [...list].sort((a, b) => (a.days ?? 0) - (b.days ?? 0))
    if (sortBy === 'viewsDesc')
      list = [...list].sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0))
    return list
  }, [sourceFilter, pgcWithSource, ugcCards, budgetMax, daysFilter, destinationFilter, sortBy, keyword])

  const hasActiveFilters =
    budgetMax !== 'any' ||
    daysFilter !== 'any' ||
    destinationFilter !== 'any' ||
    sortBy !== 'default' ||
    sourceFilter !== 'all' ||
    keyword.trim().length > 0

  const resetFilters = () => {
    setBudgetMax('any')
    setDaysFilter('any')
    setDestinationFilter('any')
    setSortBy('default')
    setSourceFilter('all')
    setKeyword('')
    setSearchParams({})
  }

  const breadcrumbs = [{ label: t('common.home'), to: '/' }, { label: t('articles.title') }]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('articles.title')}</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{t('articles.subtitle')}</p>

        <div className="mb-8 p-4 md:p-5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="articles-keyword" className="sr-only">
              {t('articles.searchPlaceholder')}
            </label>
            <input
              id="articles-keyword"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t('articles.searchPlaceholder')}
              autoComplete="off"
              className="flex-1 min-w-[min(100%,12rem)] max-w-xl px-4 py-2.5 min-h-11 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-800 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="shrink-0 px-4 py-2.5 min-h-11 text-sm font-medium text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition"
              >
                {t('articles.resetFilters')}
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400 font-medium">{t('userGuide.sourceAll')}:</span>
            {['all', 'editor', 'user'].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSourceFilter(key)}
                className={`px-3 py-2 min-h-11 rounded-lg text-sm font-medium transition ${
                  sourceFilter === key
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {key === 'all' ? t('userGuide.sourceAll') : key === 'editor' ? t('userGuide.sourceEditor') : t('userGuide.sourceUser')}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400 font-medium">{t('articles.filterByBudget')}:</span>
            <select
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              className="px-3 py-2 min-h-11 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
            <span className="text-slate-600 dark:text-slate-400 font-medium">{t('articles.filterByDays')}:</span>
            <select
              value={daysFilter}
              onChange={(e) => setDaysFilter(e.target.value)}
              className="px-3 py-2 min-h-11 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {DAYS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
            <span className="text-slate-600 dark:text-slate-400 font-medium">{t('articles.filterByDest')}:</span>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="px-3 py-2 min-h-11 min-w-[8rem] max-w-[14rem] rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="any">{t('articles.destinationAny')}</option>
              {destinationList.map((dest) => (
                <option key={dest} value={dest}>
                  {dest}
                </option>
              ))}
            </select>
            <span className="text-slate-600 dark:text-slate-400 font-medium">{t('sort.label')}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 min-h-11 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="default">{t('sort.default')}</option>
              <option value="dateDesc">{t('sort.dateDesc')}</option>
              <option value="viewsDesc">{t('sort.viewsDesc')}</option>
              <option value="budgetAsc">{t('sort.budgetAsc')}</option>
              <option value="daysAsc">{t('sort.daysAsc')}</option>
            </select>
          </div>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
          {t('articles.resultsCount', { count: filteredArticles.length })}
        </p>

        {filteredArticles.length === 0 ? (
          <EmptyState
            emoji="📭"
            title={t('ui.emptyArticlesListTitle')}
            description={t('articles.noResults')}
            {...(hasActiveFilters
              ? { onAction: resetFilters, actionLabel: t('articles.resetFilters') }
              : { actionTo: '/', actionLabel: t('common.home') })}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((item) => (
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
                    {item.source === 'user' && (
                      <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start max-w-[75%] z-[1]">
                        <span className="px-2 py-0.5 rounded bg-amber-500/90 text-white text-xs font-medium">
                          {t('userGuide.userBadge')}
                        </span>
                        {item.reviewStatus === 'pending' && (
                          <span className="px-2 py-0.5 rounded bg-slate-900/90 dark:bg-slate-950/95 text-amber-100 text-xs font-medium">
                            {t('governance.reviewPending')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(item.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      {t('articles.daysBudget', { dest: item.destination, budget: item.budget, days: item.days })}
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                      {t('articles.authorDate', { author: item.author, date: item.date })}
                    </p>
                  </div>
                </Link>
                <div className="absolute top-2 right-2 z-10">
                  <FavoriteButton articleId={item.id} />
                </div>
              </div>
            ))}
          </div>
        )}

        <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('userGuide.formTitle')}</h2>
          <UserGuideForm onSuccess={() => window.location.reload()} />
        </section>
      </div>
    </div>
  )
}
