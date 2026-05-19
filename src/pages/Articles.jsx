import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { articles } from '../data/mockData'
import { getUserGuidesAsCards } from '../data/userGuidesStore'
import Breadcrumbs from '../components/Breadcrumbs'
import UserGuideForm from '../components/UserGuideForm'
import EmptyState from '../components/EmptyState'
import RouteCard from '../components/RouteCard'
import StickyFilterBar from '../components/StickyFilterBar'
import { matchesGuideCard } from '../utils/searchMatch'
import { formatInteger } from '../utils/localeFormat'
import { useUsdApproxDisplay } from '../contexts/UsdApproxPreferenceContext'
import CopyPageLinkButton from '../components/CopyPageLinkButton'
import { assignArticleGridCoversInOrder } from '../utils/homePlaceCover.js'
import JsonLd from '../components/JsonLd'
import { absolutePageUrl } from '../utils/siteUrl'
import { keywordForTopic } from '../data/guideLibrary/topicRouteFilter.js'
import { buildTripAiHrefFromArticle } from '../utils/tripGuideBridge.js'
import { buildCommunityQaHref } from '../utils/tripCommunityBridge.js'
import {
  CHINA_GUIDE_FILTER_CITIES,
  matchesArticleDestinationFilter,
} from '../utils/chinaCityFromTitle.js'
import {
  ARTICLE_INTENT_FILTER_OPTIONS,
  INTENT_CHIP_GROUPS,
  isValidArticleIntentFilter,
  matchesArticleIntentFilter,
} from '../data/chinaIntentVariants.js'

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

const SORT_SET = new Set(['dateDesc', 'viewsDesc', 'budgetAsc', 'daysAsc'])
const BUDGET_SET = new Set(['2000', '5000', '10000'])
const DAYS_SET = new Set(['3', '7', '15'])
function parseSourceFromParams(sp) {
  const src = sp.get('source')
  return src === 'editor' || src === 'user' ? src : 'all'
}
const FILTER_KEYS = ['destination', 'keyword', 'sort', 'budget', 'days', 'source', 'intent']

function filtersMatchSearchParams(p, sp) {
  for (const k of FILTER_KEYS) {
    if ((p.get(k) ?? '') !== (sp.get(k) ?? '')) return false
  }
  return true
}

export default function Articles() {
  const { t, i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [budgetMax, setBudgetMax] = useState(() => {
    const b = searchParams.get('budget')
    return BUDGET_SET.has(b) ? b : 'any'
  })
  const [daysFilter, setDaysFilter] = useState(() => {
    const d = searchParams.get('days')
    return DAYS_SET.has(d) ? d : 'any'
  })
  const [destinationFilter, setDestinationFilter] = useState(() => searchParams.get('destination') || 'any')
  const [sortBy, setSortBy] = useState(() => {
    const s = searchParams.get('sort')
    return s && SORT_SET.has(s) ? s : 'budgetAsc'
  })
  const [sourceFilter, setSourceFilter] = useState(() => parseSourceFromParams(searchParams))
  const [keyword, setKeyword] = useState(() => searchParams.get('keyword') || '')
  const [intentFilter, setIntentFilter] = useState(() => {
    const intent = searchParams.get('intent')
    return intent && isValidArticleIntentFilter(intent) ? intent : 'any'
  })
  const { showUsdApprox } = useUsdApproxDisplay()

  const pgcWithSource = useMemo(() => articles.map((a) => ({ ...a, source: 'editor' })), [])
  const ugcCards = useMemo(() => getUserGuidesAsCards(), [])
  const destinationList = useMemo(() => {
    const fromData = [
      ...new Set([...articles.map((a) => a.destination), ...ugcCards.map((c) => c.destination)].filter(Boolean)),
    ]
    const chinaCities = fromData.includes('中国') ? CHINA_GUIDE_FILTER_CITIES : []
    return [...fromData, ...chinaCities.filter((c) => !fromData.includes(c))].sort((a, b) => {
      if (a === '中国') return -1
      if (b === '中国') return 1
      return a.localeCompare(b, 'zh-CN')
    })
  }, [ugcCards])

  useEffect(() => {
    const b = searchParams.get('budget')
    setBudgetMax(BUDGET_SET.has(b) ? b : 'any')
    const d = searchParams.get('days')
    setDaysFilter(DAYS_SET.has(d) ? d : 'any')
    const dest = searchParams.get('destination')
    setDestinationFilter(dest || 'any')
    const topic = searchParams.get('topic')
    const kwTopic = topic ? keywordForTopic(topic) : ''
    const kwParam = (searchParams.get('keyword') || '').trim()
    setKeyword(kwParam || kwTopic)
    const s = searchParams.get('sort')
    setSortBy(SORT_SET.has(s) ? s : 'budgetAsc')
    setSourceFilter(parseSourceFromParams(searchParams))
    const intent = searchParams.get('intent')
    setIntentFilter(intent && isValidArticleIntentFilter(intent) ? intent : 'any')
  }, [searchParams])

  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams

  useEffect(() => {
    const id = window.setTimeout(() => {
      const p = new URLSearchParams()
      if (destinationFilter !== 'any') p.set('destination', destinationFilter)
      if (keyword.trim()) p.set('keyword', keyword.trim())
      if (sortBy !== 'budgetAsc') p.set('sort', sortBy)
      if (budgetMax !== 'any') p.set('budget', budgetMax)
      if (daysFilter !== 'any') p.set('days', daysFilter)
      if (sourceFilter !== 'all') p.set('source', sourceFilter)
      if (intentFilter !== 'any') p.set('intent', intentFilter)
      if (filtersMatchSearchParams(p, searchParamsRef.current)) return
      setSearchParams(p, { replace: true })
    }, 320)
    return () => clearTimeout(id)
  }, [budgetMax, daysFilter, destinationFilter, keyword, sortBy, sourceFilter, intentFilter, setSearchParams])
  const matchesBudget = (budget) =>
    budgetMax === 'any' || (typeof budget === 'number' && budget <= Number(budgetMax))
  const matchesDays = (days) =>
    daysFilter === 'any' || (typeof days === 'number' && days === Number(daysFilter))
  const matchesDestination = (item) =>
    destinationFilter === 'any' || matchesArticleDestinationFilter(item, destinationFilter)

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
        matchesDestination(item) &&
        matchesArticleIntentFilter(item, intentFilter) &&
        matchesGuideCard(item, keyword),
    )
    if (sortBy === 'dateDesc') list = [...list].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    if (sortBy === 'budgetAsc') list = [...list].sort((a, b) => (a.budget ?? 0) - (b.budget ?? 0))
    if (sortBy === 'daysAsc') list = [...list].sort((a, b) => (a.days ?? 0) - (b.days ?? 0))
    if (sortBy === 'viewsDesc')
      list = [...list].sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0))
    if (destinationFilter !== 'any' && CHINA_GUIDE_FILTER_CITIES.includes(destinationFilter)) {
      list = [...list].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    }
    return list
  }, [sourceFilter, pgcWithSource, ugcCards, budgetMax, daysFilter, destinationFilter, sortBy, keyword, intentFilter])

  /** 同屏去重 Unsplash id：冲突时用目的地主图/封面池/洲级备用图替换列表缩略图 */
  const articleGridItems = useMemo(() => assignArticleGridCoversInOrder(filteredArticles), [filteredArticles])

  const destinationTripHref = useMemo(() => {
    if (destinationFilter === 'any') return null
    const sample =
      filteredArticles.find((a) => matchesArticleDestinationFilter(a, destinationFilter)) ||
      articles.find((a) => matchesArticleDestinationFilter(a, destinationFilter))
    const destForTrip = sample?.city || (destinationFilter === '中国' ? '成都' : destinationFilter)
    return buildTripAiHrefFromArticle(
      sample || { destination: destForTrip, days: 5, budget: 4000 },
      { autogenerate: true },
    )
  }, [destinationFilter, filteredArticles])

  const hasActiveFilters =
    budgetMax !== 'any' ||
    daysFilter !== 'any' ||
    destinationFilter !== 'any' ||
    sortBy !== 'budgetAsc' ||
    sourceFilter !== 'all' ||
    intentFilter !== 'any' ||
    keyword.trim().length > 0

  const resetFilters = () => {
    setBudgetMax('any')
    setDaysFilter('any')
    setDestinationFilter('any')
    setSortBy('budgetAsc')
    setSourceFilter('all')
    setIntentFilter('any')
    setKeyword('')
    setSearchParams({})
  }

  const sparseResultsTripHref = useMemo(() => {
    const sample = filteredArticles[0] || null
    const dest =
      sample?.city ||
      (destinationFilter !== 'any' ? destinationFilter : null) ||
      (keyword.trim() ? keyword.trim().slice(0, 12) : null) ||
      '成都'
    return buildTripAiHrefFromArticle(
      sample || { destination: dest, city: dest, days: 4, budget: 3000 },
      { autogenerate: true },
    )
  }, [filteredArticles, destinationFilter, keyword])

  const sparseResultsQaHref = useMemo(() => {
    const dest =
      filteredArticles[0]?.city ||
      (destinationFilter !== 'any' ? destinationFilter : '') ||
      keyword.trim().slice(0, 20)
    return buildCommunityQaHref({
      destination: dest || undefined,
      title: dest ? `${dest}穷游怎么安排？` : undefined,
      focusAsk: true,
    })
  }, [filteredArticles, destinationFilter, keyword])

  const showSparseResultsCta =
    (filteredArticles.length === 0 && hasActiveFilters) ||
    (filteredArticles.length > 0 && filteredArticles.length <= 2 && keyword.trim().length > 0)

  const breadcrumbs = [{ label: t('common.navMap'), to: '/map' }, { label: t('articles.title') }]

  const listJsonLd = useMemo(() => {
    if (typeof window === 'undefined') return null
    const itemListElement = articleGridItems.slice(0, 20).map(({ item }, idx) => {
      const routeUrl = absolutePageUrl(`/routes/${item.id}`) || window.location.origin + `/routes/${item.id}`
      const description = [
        item.destination,
        typeof item.budget === 'number' ? `¥${formatInteger(item.budget, i18n.language)}` : '',
        typeof item.days === 'number' ? `${item.days}d` : '',
      ]
        .filter(Boolean)
        .join(' · ')
      return {
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Article',
          name: item.title,
          url: routeUrl,
          description,
        },
      }
    })
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: t('articles.title'),
      numberOfItems: filteredArticles.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement,
    }
  }, [articleGridItems, filteredArticles.length, i18n.language, t])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <JsonLd data={listJsonLd} scriptId="jsonld-routes-list" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('articles.title')}</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-1">{t('articles.subtitle')}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2 dark:border-sky-900/50 dark:bg-sky-950/25">
          {t('articles.budgetFirstLead')}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">{t('articles.stickyFiltersLead')}</p>
        <p className="text-xs text-violet-800 dark:text-violet-200 mb-6 rounded-lg border border-violet-100 bg-violet-50/80 px-3 py-2 dark:border-violet-900/40 dark:bg-violet-950/25">
          {t('articles.filterChinaCityHint')}
        </p>

        <StickyFilterBar>
        <div className="p-3 md:p-5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
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
              className="flex-1 min-w-[min(100%,12rem)] max-w-xl px-4 py-2.5 min-h-11 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-800 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <CopyPageLinkButton />
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2.5 min-h-11 text-sm font-medium text-sky-800 dark:text-sky-200 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl hover:bg-sky-100 dark:hover:bg-sky-900/30 transition"
                >
                  {t('articles.resetFilters')}
                </button>
              ) : null}
            </div>
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
                    ? 'bg-sky-600 text-white'
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
              aria-label={t('articles.filterByBudget')}
              className="px-3 py-2 min-h-11 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
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
              aria-label={t('articles.filterByDays')}
              className="px-3 py-2 min-h-11 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
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
              aria-label={t('articles.filterByDest')}
              className="px-3 py-2 min-h-11 min-w-[8rem] max-w-[14rem] rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="any">{t('articles.destinationAny')}</option>
              {destinationList.map((dest) => (
                <option key={dest} value={dest}>
                  {dest}
                </option>
              ))}
            </select>
            <span className="text-slate-600 dark:text-slate-400 font-medium">{t('articles.filterByIntent')}:</span>
            <select
              value={intentFilter}
              onChange={(e) => setIntentFilter(e.target.value)}
              aria-label={t('articles.filterByIntent')}
              className="px-3 py-2 min-h-11 min-w-[7rem] max-w-[11rem] rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {ARTICLE_INTENT_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
            <span className="text-slate-600 dark:text-slate-400 font-medium">{t('sort.label')}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label={t('sort.label')}
              className="px-3 py-2 min-h-11 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="budgetAsc">{t('sort.budgetAsc')}</option>
              <option value="dateDesc">{t('sort.dateDesc')}</option>
              <option value="viewsDesc">{t('sort.viewsDesc')}</option>
              <option value="daysAsc">{t('sort.daysAsc')}</option>
            </select>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('articles.intentQuickChipsLabel')}</p>
            {INTENT_CHIP_GROUPS.map((group) => (
              <div key={group.id} className="flex flex-wrap items-center gap-2">
                <span className="shrink-0 text-[11px] font-semibold text-amber-800/90 dark:text-amber-200/90">
                  {t(group.labelKey)}
                </span>
                {group.values.map((value) => {
                  const opt = ARTICLE_INTENT_FILTER_OPTIONS.find((o) => o.value === value)
                  if (!opt) return null
                  const active = intentFilter === value
                  return (
                    <button
                      key={`${group.id}-${value}`}
                      type="button"
                      onClick={() => setIntentFilter(active ? 'any' : value)}
                      aria-pressed={active}
                      className={`px-2.5 py-1.5 min-h-9 rounded-full text-xs font-medium transition ${
                        active
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {t(opt.labelKey)}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        </StickyFilterBar>

        {destinationTripHref ? (
          <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50/80 px-4 py-3 text-sm dark:border-violet-900/50 dark:bg-violet-950/30">
            <p className="font-semibold text-violet-900 dark:text-violet-100">
              {t('articles.destTripCtaTitle', { dest: destinationFilter })}
            </p>
            <p className="mt-1 text-xs text-violet-900/80 dark:text-violet-200/80">{t('articles.destTripCtaLead')}</p>
            <Link
              to={destinationTripHref}
              className="mt-2 inline-flex min-h-10 items-center rounded-lg bg-violet-600 px-3 text-xs font-semibold text-white hover:bg-violet-700"
            >
              {t('articles.destTripCtaBtn')}
            </Link>
          </div>
        ) : null}

        {showSparseResultsCta ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm dark:border-amber-900/40 dark:bg-amber-950/25">
            <p className="font-semibold text-amber-950 dark:text-amber-100">{t('articles.sparseCtaTitle')}</p>
            <p className="mt-1 text-xs text-amber-900/85 dark:text-amber-200/85">{t('articles.sparseCtaLead')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to={sparseResultsTripHref}
                className="inline-flex min-h-10 items-center rounded-lg bg-violet-600 px-3 text-xs font-semibold text-white hover:bg-violet-700"
              >
                {t('articles.sparseCtaTrip')}
              </Link>
              <Link
                to={sparseResultsQaHref}
                className="inline-flex min-h-10 items-center rounded-lg border border-amber-300 bg-white px-3 text-xs font-semibold text-amber-950 hover:bg-amber-50 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-100 dark:hover:bg-amber-950/40"
              >
                {t('articles.sparseCtaQa')}
              </Link>
            </div>
          </div>
        ) : null}

        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
          {t('articles.resultsCount', { count: filteredArticles.length })}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {t('common.fxDisclaimer')}{' '}
          <span className="text-slate-400 dark:text-slate-500">({t('common.usdToggleLead')})</span>
        </p>

        {filteredArticles.length === 0 ? (
          <EmptyState
            emoji="📭"
            title={t('ui.emptyArticlesListTitle')}
            description={t('articles.noResults')}
            {...(hasActiveFilters
              ? { onAction: resetFilters, actionLabel: t('articles.resetFilters') }
              : { actionTo: '/map', actionLabel: t('common.navMap') })}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articleGridItems.map(({ item, cover }) => (
              <RouteCard
                key={item.id}
                item={item}
                cover={cover}
                showUsdApprox={showUsdApprox}
                language={i18n.language}
              />
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
