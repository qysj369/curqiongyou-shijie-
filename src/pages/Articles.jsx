import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { articles } from '../data/mockData'
import { getUserGuidesAsCards } from '../data/userGuidesStore'
import Breadcrumbs from '../components/Breadcrumbs'
import UserGuideForm from '../components/UserGuideForm'
import EmptyState from '../components/EmptyState'
import RouteCard from '../components/RouteCard'
import { matchesGuideCard } from '../utils/searchMatch'
import { formatInteger } from '../utils/localeFormat'
import { useUsdApproxDisplay } from '../contexts/UsdApproxPreferenceContext'
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
  isValidArticleIntentFilter,
  matchesArticleIntentFilter,
} from '../data/chinaIntentVariants.js'

const SORT_SET = new Set(['dateDesc', 'viewsDesc', 'budgetAsc', 'daysAsc'])
const BUDGET_SET = new Set(['2000', '5000', '10000'])
const DAYS_SET = new Set(['3', '7', '15'])
const HOT_CITY_CHIPS = ['成都', '西安', '重庆', '杭州', '厦门', '青岛', '大理', '丽江']
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

  const breadcrumbs = [
    { label: t('common.bottomNavHome'), to: '/' },
    { label: t('home.designedGuidesTitle'), to: '/#guides' },
    { label: t('articles.title') },
  ]

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
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">{t('articles.title')}</h1>
          <Link
            to={t('articles.backHomeHref')}
            className="text-sm font-semibold text-sky-700 underline-offset-2 hover:underline dark:text-sky-300"
          >
            ← {t('articles.backHome')}
          </Link>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">{t('articles.simplePageLead')}</p>

        <form
          role="search"
          className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault()
            const p = new URLSearchParams(searchParams)
            const q = keyword.trim()
            if (q) p.set('keyword', q)
            else p.delete('keyword')
            setSearchParams(p, { replace: true })
          }}
        >
          <label htmlFor="routes-simple-search" className="sr-only">
            {t('articles.searchPlaceholder')}
          </label>
          <input
            id="routes-simple-search"
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t('articles.searchPlaceholder')}
            autoComplete="off"
            enterKeyHint="search"
            className="app-input min-h-11 flex-1 text-[15px]"
          />
          <div className="flex shrink-0 gap-2">
            <button type="submit" className="min-h-11 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white hover:bg-sky-700">
              {t('home.searchBarButton')}
            </button>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t('articles.resetFilters')}
              </button>
            ) : null}
          </div>
        </form>

        <nav className="mb-5 flex flex-wrap items-center gap-2" aria-label={t('articles.hotCityChipsLabel')}>
          {HOT_CITY_CHIPS.map((city) => (
            <Link
              key={city}
              to={`/routes?destination=${encodeURIComponent(city)}&sort=budgetAsc`}
              className={`min-h-9 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                destinationFilter === city
                  ? 'border-sky-400 bg-sky-50 text-sky-800 dark:border-sky-600 dark:bg-sky-950/50 dark:text-sky-100'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {city}
            </Link>
          ))}
          <Link
            to="/routes?sort=budgetAsc"
            className="min-h-9 rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-sky-300 dark:border-slate-600 dark:text-slate-400"
          >
            {t('articles.allGuidesLink')}
          </Link>
        </nav>

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

        <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
          {t('articles.resultsCount', { count: filteredArticles.length })}
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

        <details className="collapse-panel mt-10 rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/40">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 [&::-webkit-details-marker]:hidden">
            {t('articles.submitGuideSummary')}
          </summary>
          <div className="border-t border-slate-200 px-4 pb-4 pt-3 dark:border-slate-700">
            <UserGuideForm onSuccess={() => window.location.reload()} />
          </div>
        </details>
      </div>
    </div>
  )
}
