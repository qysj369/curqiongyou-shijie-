import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { articles } from '../data/mockData'
import { getUserGuidesAsCards } from '../data/userGuidesStore'
import FavoriteButton from '../components/FavoriteButton'
import Breadcrumbs from '../components/Breadcrumbs'
import UserGuideForm from '../components/UserGuideForm'

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
  const [budgetMax, setBudgetMax] = useState('any')
  const [daysFilter, setDaysFilter] = useState('any')
  const [destinationFilter, setDestinationFilter] = useState('any')
  const [sortBy, setSortBy] = useState('default')
  const [sourceFilter, setSourceFilter] = useState('all')

  const pgcWithSource = useMemo(() => articles.map((a) => ({ ...a, source: 'editor' })), [])
  const ugcCards = useMemo(() => getUserGuidesAsCards(), [])
  const destinationList = useMemo(
    () => [...new Set([...articles.map((a) => a.destination), ...ugcCards.map((c) => c.destination)].filter(Boolean))].sort(),
    [ugcCards],
  )

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
        matchesDestination(item.destination),
    )
    if (sortBy === 'dateDesc') list = [...list].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    if (sortBy === 'budgetAsc') list = [...list].sort((a, b) => (a.budget ?? 0) - (b.budget ?? 0))
    if (sortBy === 'daysAsc') list = [...list].sort((a, b) => (a.days ?? 0) - (b.days ?? 0))
    return list
  }, [sourceFilter, pgcWithSource, ugcCards, budgetMax, daysFilter, destinationFilter, sortBy])

  const breadcrumbs = [{ label: t('common.home'), to: '/' }, { label: t('articles.title') }]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('articles.title')}</h1>
        <p className="text-slate-600 mb-6">{t('articles.subtitle')}</p>

        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-xl shadow-sm">
          <span className="text-slate-600 font-medium">{t('userGuide.sourceAll')}:</span>
          {['all', 'editor', 'user'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSourceFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                sourceFilter === key ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {key === 'all' ? t('userGuide.sourceAll') : key === 'editor' ? t('userGuide.sourceEditor') : t('userGuide.sourceUser')}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-white rounded-xl shadow-sm">
          <span className="text-slate-600 font-medium">{t('articles.filterByBudget')}:</span>
          <select
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
            ))}
          </select>
          <span className="text-slate-600 font-medium">{t('articles.filterByDays')}:</span>
          <select
            value={daysFilter}
            onChange={(e) => setDaysFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {DAYS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
            ))}
          </select>
          <span className="text-slate-600 font-medium">{t('articles.filterByDest')}:</span>
          <select
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="any">{t('articles.destinationAny')}</option>
            {destinationList.map((dest) => (
              <option key={dest} value={dest}>{dest}</option>
            ))}
          </select>
          <span className="text-slate-600 font-medium ml-2">{t('sort.label')}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="default">{t('sort.default')}</option>
            <option value="dateDesc">{t('sort.dateDesc')}</option>
            <option value="budgetAsc">{t('sort.budgetAsc')}</option>
            <option value="daysAsc">{t('sort.daysAsc')}</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.length === 0 ? (
            <p className="col-span-full text-slate-500 text-center py-8">{t('articles.noResults')}</p>
          ) : (
            filteredArticles.map((item) => (
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
                    {item.source === 'user' && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500/90 text-white text-xs font-medium">
                        {t('userGuide.userBadge')}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(item.tags || []).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-slate-800 line-clamp-2 group-hover:text-amber-600 transition">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      {t('articles.daysBudget', { dest: item.destination, budget: item.budget, days: item.days })}
                    </p>
                    <p className="text-slate-400 text-xs mt-2">{t('articles.authorDate', { author: item.author, date: item.date })}</p>
                  </div>
                </Link>
                <div className="absolute top-2 right-2 z-10">
                  <FavoriteButton articleId={item.id} />
                </div>
              </div>
            ))
          )}
        </div>

        <section className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">{t('userGuide.formTitle')}</h2>
          <UserGuideForm onSuccess={() => window.location.reload()} />
        </section>
      </div>
    </div>
  )
}
