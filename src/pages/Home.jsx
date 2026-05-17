import { useState, useMemo, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  featuredRoutesForHome,
  latestArticles,
  articles,
} from '../data/mockData'
import { places, popularPlaces } from '../data/placeModel'
import { getPlaceRatingMeta } from '../data/placeRatingMeta'
import StarRatingDisplay from '../components/StarRatingDisplay'
import { getUserGuidesAsCards } from '../data/userGuidesStore'
import FavoriteButton from '../components/FavoriteButton'
import OptimizedImage from '../components/OptimizedImage'
import EmptyState from '../components/EmptyState'
import { matchesGuideCard, matchesDestinationCard } from '../utils/searchMatch'
import { approxUsdFromCny, formatDate, formatInteger } from '../utils/localeFormat'
import { useUsdApproxDisplay } from '../contexts/UsdApproxPreferenceContext'
import { useMinimalUi } from '../contexts/MinimalUiContext'
import {
  assignArticleGridCoversInOrder,
  assignGridCoversInOrder,
  sortDestinationsUniqueHeroFirst,
} from '../utils/homePlaceCover.js'
import { useMapHomeImmersive } from '../hooks/useMapHomeImmersive'
import { PLACE_GEO_BY_ID } from '../data/placeGeo.generated'
import { useToast } from '../contexts/ToastContext'
import PageFallback from '../components/PageFallback'
import { readAutoLocateEnabled, AUTO_LOCATE_PREF_CHANGED } from '../lib/homeAutoLocatePreference.js'

const GlobalMapSearch = lazy(() => import('../components/GlobalMapSearch.jsx'))

function HomeMapEmbed() {
  const { t } = useTranslation()
  const wrapRef = useRef(null)
  const [mountMap, setMountMap] = useState(false)

  useEffect(() => {
    if (mountMap) return
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setMountMap(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMountMap(true)
          io.disconnect()
        }
      },
      { root: null, rootMargin: '200px 0px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mountMap])

  const skeleton = (
    <div
      className="min-h-[min(52vh,22rem)] md:min-h-[24rem] w-full rounded-2xl border border-slate-200 bg-slate-100/90 dark:border-slate-700 dark:bg-slate-800/60 motion-safe:animate-pulse"
      role="status"
      aria-busy="true"
      aria-label={t('home.mapEmbedLoading')}
    />
  )

  return (
    <div ref={wrapRef} className="mx-auto max-w-7xl px-2 sm:px-6">
      {mountMap ? (
        <Suspense fallback={skeleton}>
          <GlobalMapSearch compact embedInHome />
        </Suspense>
      ) : (
        skeleton
      )}
    </div>
  )
}

/** 首页仅保留四条穷游主路径；进阶地图与规划入口见右上角「更多」 */
const HOME_CORE_NAV = [
  { to: '/map', labelKey: 'common.navMap', emoji: '🗺️', circle: 'bg-sky-500 shadow-sky-500/30' },
  { to: '/routes', labelKey: 'common.navRoutes', emoji: '📖', circle: 'bg-amber-500 shadow-amber-500/25' },
  { to: '/budget', labelKey: 'common.navBudget', emoji: '🧮', circle: 'bg-emerald-500 shadow-emerald-500/25' },
  { to: '/trip-ai', labelKey: 'common.navTripAi', emoji: '✈️', circle: 'bg-violet-500 shadow-violet-500/25' },
]

const BUDGET_MAX = { any: null, '2000': 2000, '5000': 5000, '10000': 10000 }
const DAYS_VALUE = { any: null, '3': 3, '7': 7, '15': 15 }
const AUTO_LOCATE_ONCE_KEY = 'roamwise-auto-locate-once-v1'

function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = (v) => (v * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** 列表区块标题：穷游网式粗黑小标题，少装饰 */
function HomeSectionTitle({ children, id, tabIndex = undefined }) {
  return (
    <h2
      id={id}
      tabIndex={tabIndex}
      className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-xl"
    >
      {children}
    </h2>
  )
}

export default function Home() {
  const mapHomeImmersive = useMapHomeImmersive()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const { minimal } = useMinimalUi()
  const [search, setSearch] = useState('')
  const [budgetMax, setBudgetMax] = useState('any')
  const [daysFilter, setDaysFilter] = useState('any')
  const [subBandOpen, setSubBandOpen] = useState(false)
  const [autoLocateEnabled, setAutoLocateEnabled] = useState(() => readAutoLocateEnabled())

  useEffect(() => {
    const sync = () => setAutoLocateEnabled(readAutoLocateEnabled())
    window.addEventListener(AUTO_LOCATE_PREF_CHANGED, sync)
    return () => window.removeEventListener(AUTO_LOCATE_PREF_CHANGED, sync)
  }, [])

  /** 首屏主路径预取，降低首次点击白屏概率（与 Vite base 一致） */
  useEffect(() => {
    const base = import.meta.env.BASE_URL || '/'
    const prefix = base === '/' ? '' : base.replace(/\/$/, '')
    const paths = ['/map', '/routes', '/budget', '/trip-ai']
    const links = paths.map((p) => {
      const el = document.createElement('link')
      el.rel = 'prefetch'
      el.href = `${prefix}${p}`
      el.setAttribute('data-roamwise-home-prefetch', '1')
      document.head.appendChild(el)
      return el
    })
    return () => links.forEach((el) => el.remove())
  }, [])

  const { showUsdApprox } = useUsdApproxDisplay()

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

  const filteredFeaturedRoutes = useMemo(
    () =>
      featuredRoutesForHome.filter(
        (route) =>
          matchesGuideCard(route, search) &&
          matchesBudget(route.budget) &&
          matchesDays(route.days),
      ),
    [search, budgetMax, daysFilter],
  )

  const filteredPopularDestinations = useMemo(
    () => popularPlaces.filter((dest) => matchesDestinationCard(dest, search)),
    [search],
  )

  const popularDestinationCards = useMemo(() => {
    const ordered = sortDestinationsUniqueHeroFirst(filteredPopularDestinations)
    return assignGridCoversInOrder(ordered)
  }, [filteredPopularDestinations])

  const filteredLatestArticles = useMemo(
    () =>
      latestArticles.filter(
        (article) =>
          matchesGuideCard(article, search) &&
          matchesBudget(article.budget) &&
          matchesDays(article.days),
      ),
    [search, budgetMax, daysFilter],
  )

  const featuredRouteGridItems = useMemo(
    () => assignArticleGridCoversInOrder(filteredFeaturedRoutes),
    [filteredFeaturedRoutes],
  )

  const latestArticleGridItems = useMemo(
    () => assignArticleGridCoversInOrder(filteredLatestArticles),
    [filteredLatestArticles],
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

  const mergedSearchGridItems = useMemo(
    () => assignArticleGridCoversInOrder(mergedSearchResults),
    [mergedSearchResults],
  )

  const recentUserGuides = useMemo(() => {
    const narrowed = ugcList.filter(
      (item) =>
        matchesGuideCard(item, search) && matchesBudget(item.budget) && matchesDays(item.days),
    )
    return narrowed.slice(0, 6)
  }, [search, budgetMax, daysFilter, ugcList])

  const recentUserGuideGridItems = useMemo(
    () => assignArticleGridCoversInOrder(recentUserGuides),
    [recentUserGuides],
  )

  const siteSnapshot = useMemo(() => {
    const continents = new Set(places.map((d) => d.continent).filter(Boolean))
    return {
      destinationCount: places.length,
      guideCount: articles.length,
      continentCount: continents.size,
    }
  }, [places])

  const hotPickDestinations = useMemo(
    () =>
      [...popularPlaces]
        .sort((a, b) => (Number(b.routeCount) || 0) - (Number(a.routeCount) || 0))
        .slice(0, 8),
    [],
  )

  const locateAndJump = useCallback((fromAuto = false) => {
    if (!navigator?.geolocation) {
      if (!fromAuto) toast(t('home.locateUnsupported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        let nearest = null
        let minDistance = Number.POSITIVE_INFINITY
        for (const d of places) {
          const geo = PLACE_GEO_BY_ID[d.id]
          if (!geo) continue
          const km = haversineKm(latitude, longitude, geo.lat, geo.lng)
          if (km < minDistance) {
            minDistance = km
            nearest = d
          }
        }
        if (nearest?.id != null) {
          if (!fromAuto) toast(t('home.locateSuccess', { name: nearest.name }))
          navigate(`/routes?destination=${encodeURIComponent(String(nearest.name))}`)
        } else {
          if (!fromAuto) toast(t('home.locateFailed'))
        }
      },
      (err) => {
        const denied = err?.code === 1
        if (!fromAuto) toast(denied ? t('home.locateDenied') : t('home.locateFailed'))
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60 * 1000 },
    )
  }, [navigate, t, toast, places])

  useEffect(() => {
    if (mapHomeImmersive) return
    if (typeof window === 'undefined') return
    if (!navigator?.geolocation) return
    const q = searchParams.get('autolocate')
    if (q === '0') return
    if (q === '1') {
      locateAndJump(true)
      return
    }
    if (!autoLocateEnabled) return
    if (window.sessionStorage.getItem(AUTO_LOCATE_ONCE_KEY) === '1') return
    window.sessionStorage.setItem(AUTO_LOCATE_ONCE_KEY, '1')
    const timer = window.setTimeout(() => {
      locateAndJump(true)
    }, 700)
    return () => window.clearTimeout(timer)
  }, [mapHomeImmersive, locateAndJump, searchParams, autoLocateEnabled])

  if (mapHomeImmersive) {
    return (
      <Suspense fallback={<PageFallback />}>
        <GlobalMapSearch immersive />
      </Suspense>
    )
  }

  return (
    <div className="rw-surface-page home-page">
      <section
        className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950"
        aria-label={t('home.qyStyleSurfaceAria')}
      >
        <div className="mx-auto max-w-2xl px-4 pb-6 pt-5 sm:px-6 md:max-w-7xl md:pb-8">
          <div className="mx-auto max-w-xl text-center md:mx-0 md:text-left">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
              {t('home.heroTitleNew')}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t('home.heroLeadNew')}</p>
          </div>

          <form
            id="home-search-form"
            role="search"
            aria-label={t('a11y.homeSearchForm')}
            className="mx-auto mt-5 max-w-xl md:mx-0"
            onSubmit={(e) => {
              e.preventDefault()
              const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
              const behavior = reduceMotion ? 'auto' : 'smooth'
              const q = search.trim()
              if (q) {
                document.getElementById('home-search-results')?.scrollIntoView({ behavior, block: 'start' })
                queueMicrotask(() => {
                  document.getElementById('home-search-results-title')?.focus({ preventScroll: true })
                })
              } else {
                const nextId = minimal ? 'home-map-explore' : 'home-featured'
                document.getElementById(nextId)?.scrollIntoView({ behavior, block: 'start' })
                queueMicrotask(() => {
                  const focusId = minimal ? 'home-map-explore-title' : 'home-featured-title'
                  document.getElementById(focusId)?.focus({ preventScroll: true })
                })
              }
            }}
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base opacity-60" aria-hidden>
                🔍
              </span>
              <label htmlFor="home-search-q" className="sr-only">
                {t('a11y.homeSearchQueryLabel')}
              </label>
              <input
                id="home-search-q"
                type="search"
                placeholder={t('home.homeSearchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
                enterKeyHint="search"
                className="w-full min-h-[3rem] rounded-full border border-slate-200 bg-slate-50/80 py-2.5 pl-11 pr-[5.5rem] text-[15px] text-slate-900 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-sky-500"
              />
              <button
                type="submit"
                aria-label={t('a11y.homeSearchSubmit')}
                className="absolute right-1.5 top-1/2 flex min-h-9 -translate-y-1/2 items-center rounded-full bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                {t('home.searchBarButton')}
              </button>
            </div>

            {!minimal && (
            <details
              className="collapse-panel mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-600 dark:bg-slate-900/40"
              aria-label={t('a11y.homeDetailsFilters')}
            >
              <summary className="cursor-pointer list-none py-2.5 text-center text-xs font-semibold text-slate-600 marker:text-slate-400 dark:text-slate-300 [&::-webkit-details-marker]:hidden">
                {t('home.searchFiltersSummary')}
              </summary>
              <div className="flex flex-col gap-3 border-t border-slate-200/80 px-3 pb-3 pt-2 dark:border-slate-700 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <label htmlFor="home-budget-filter" className="sr-only">
                    {t('home.budgetFilterLabel')}
                  </label>
                  <select
                    id="home-budget-filter"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="app-input w-full min-h-10 text-sm"
                  >
                    <option value="any">{t('home.budgetAny')}</option>
                    <option value="2000">{t('home.budget0_2000')}</option>
                    <option value="5000">{t('home.budget2000_5000')}</option>
                    <option value="10000">{t('home.budget5000_10000')}</option>
                  </select>
                </div>
                <div className="min-w-0 flex-1">
                  <label htmlFor="home-days-filter" className="sr-only">
                    {t('home.daysFilterLabel')}
                  </label>
                  <select
                    id="home-days-filter"
                    value={daysFilter}
                    onChange={(e) => setDaysFilter(e.target.value)}
                    className="app-input w-full min-h-10 text-sm"
                  >
                    <option value="any">{t('home.daysAny')}</option>
                    <option value="3">{t('home.days3')}</option>
                    <option value="7">{t('home.days7')}</option>
                    <option value="15">{t('home.days15')}</option>
                  </select>
                </div>
              </div>
            </details>
            )}
          </form>

          <nav
            className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-x-4 gap-y-5 sm:max-w-xl sm:grid-cols-4 sm:gap-x-6"
            aria-label={t('a11y.homeCoreShortcuts')}
          >
            {HOME_CORE_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex flex-col items-center gap-2 rounded-xl pb-1 pt-0.5 text-center outline-none transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:hover:bg-slate-900/80 dark:focus-visible:ring-offset-slate-950"
              >
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl text-white shadow-md ring-2 ring-white/30 transition group-active:scale-[0.97] dark:ring-slate-900/40 ${item.circle}`}
                  aria-hidden
                >
                  {item.emoji}
                </span>
                <span className="max-w-[5.5rem] text-[11px] font-semibold leading-snug text-slate-800 dark:text-slate-100 sm:max-w-none sm:text-xs">
                  {t(item.labelKey)}
                </span>
              </Link>
            ))}
          </nav>

          {!minimal && (
          <p className="mx-auto mt-4 max-w-xl text-center text-xs text-slate-600 dark:text-slate-400 md:mx-0 md:text-left">
            <Link
              to="/trip-ai"
              className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-300"
              aria-label={`${t('home.tripAiTeaser')} ${t('a11y.homeTripAiLink')}`}
            >
              {t('home.tripAiTeaser')}
            </Link>
          </p>
          )}

          {!minimal && (
          <details
            className="collapse-panel mx-auto mt-5 max-w-xl rounded-2xl border border-slate-100 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/30 md:mx-0"
            aria-label={t('a11y.homeDetailsSnapshot')}
            open={subBandOpen}
            onToggle={(e) => setSubBandOpen(e.currentTarget.open)}
          >
            <summary className="cursor-pointer list-none px-3 py-2.5 text-center text-xs font-medium text-slate-600 dark:text-slate-300 [&::-webkit-details-marker]:hidden">
              {t('home.subBandSummary')}
            </summary>
            <div className="space-y-3 border-t border-slate-200/80 px-3 pb-3 pt-3 dark:border-slate-700">
              <div
                className="flex flex-wrap justify-center gap-1.5 text-[11px] leading-tight"
                role="group"
                aria-label={t('home.heroStatsAria')}
              >
                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  {t('home.heroStatDestinations', { count: siteSnapshot.destinationCount })}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  {t('home.heroStatGuides', { count: siteSnapshot.guideCount })}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  {t('home.heroStatRegions', { count: siteSnapshot.continentCount })}
                </span>
              </div>
              <nav className="text-center" aria-label={t('home.hotSearchAria')}>
                <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-300">{t('home.hotSearchTitle')}</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {hotPickDestinations.map((d) => (
                    <Link
                      key={d.id}
                      to={`/routes?destination=${encodeURIComponent(d.name)}`}
                      aria-label={t('a11y.homeHotPickFilter', { name: d.name })}
                      className="min-h-8 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </details>
          )}
        </div>
      </section>

      <section
        id="home-map-explore"
        className="scroll-mt-24 border-b border-slate-200/80 bg-slate-50 py-6 dark:border-slate-800 dark:bg-slate-950 sm:py-8"
        aria-labelledby="home-map-explore-title"
        aria-describedby="home-map-explore-lead"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 id="home-map-explore-title" tabIndex={-1} className="text-base font-bold text-slate-900 dark:text-slate-50 sm:text-lg">
            {t('home.mapExploreTitle')}
          </h2>
          <p id="home-map-explore-lead" className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:text-sm">
            {t('home.mapExploreLead')}
          </p>
        </div>
        <div className="mx-auto max-w-7xl px-2 sm:px-6">
          <HomeMapEmbed />
        </div>
      </section>

      {searchTrimmed ? (
        <section id="home-search-results" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-4 pt-10 sm:px-6" aria-labelledby="home-search-results-title">
          <div className="mb-6">
            <HomeSectionTitle id="home-search-results-title" tabIndex={-1}>
              {t('home.searchResultsTitle')}
            </HomeSectionTitle>
            {mergedSearchResults.length > 0 ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400" aria-live="polite">
                {t('home.searchResultsCount', { count: mergedSearchResults.length })}
              </p>
            ) : null}
          </div>
          {mergedSearchResults.length === 0 ? (
            <EmptyState
              emoji="🔍"
              title={t('ui.emptySearchTitle')}
              description={t('home.searchNoResults')}
              actionTo="/routes"
              actionLabel={t('ui.emptySearchAction')}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mergedSearchGridItems.map(({ item: article, cover }) => (
                <div key={article.id} className="relative">
                  <Link
                    to={`/routes/${article.id}`}
                    className="group block rounded-xl overflow-hidden shadow-md motion-safe:hover:shadow-lg motion-safe:transition border border-slate-100 dark:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 bg-white dark:bg-slate-900"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <OptimizedImage
                        src={cover}
                        alt={t('home.searchResultCoverAlt', { title: article.title })}
                        loading="lazy"
                        w={900}
                        h={384}
                        q={75}
                        className="w-full h-full object-cover motion-safe:group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-300"
                      />
                      {article.source === 'user' && (
                        <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start max-w-[75%] z-[1]">
                          <span className="px-2 py-0.5 rounded bg-sky-600/90 text-white text-xs font-medium">
                            {t('userGuide.userBadge')}
                          </span>
                          {article.reviewStatus === 'pending' && (
                            <span className="px-2 py-0.5 rounded bg-slate-900/90 text-sky-100 text-xs font-medium">
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
                            className="text-xs px-2 py-0.5 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-sky-700 transition">
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
        </section>
      ) : null}

      {!minimal && (
      <>
      <section id="home-featured" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 md:flex-row md:items-end md:justify-between">
          <HomeSectionTitle id="home-featured-title" tabIndex={-1}>
            {t('home.featuredRoutes')}
          </HomeSectionTitle>
          <Link
            to="/routes"
            aria-label={t('a11y.homeViewAllGuides')}
            className="shrink-0 self-start text-sm font-semibold text-sky-700 underline decoration-sky-300/80 decoration-2 underline-offset-4 hover:text-sky-900 dark:text-sky-300 dark:decoration-sky-600/80 dark:hover:text-sky-200 md:self-auto"
          >
            {t('home.viewAll')}
          </Link>
        </div>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          {t('common.fxDisclaimer')}{' '}
          <span className="text-slate-400 dark:text-slate-500">({t('common.usdToggleLead')})</span>
        </p>
        <p className="mb-6 text-xs text-slate-500 dark:text-slate-400 md:hidden">{t('ui.swipeHint')}</p>
        {filteredFeaturedRoutes.length === 0 ? (
          <EmptyState
            emoji="🔥"
            title={t('ui.emptyFeaturedTitle')}
            description={t('ui.emptyFeaturedDesc')}
            actionTo="/routes"
            actionLabel={t('home.viewAll')}
          />
        ) : (
          <div className="touch-scroll-x flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
            {featuredRouteGridItems.map(({ item: route, cover }) => (
              <Link
                key={route.id}
                to={`/routes/${route.id}`}
                className="flex-shrink-0 w-[min(18rem,calc(100vw-2.5rem))] snap-start group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 rounded-2xl"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md motion-safe:hover:shadow-xl motion-safe:transition-all motion-safe:duration-300 border border-slate-100 dark:border-slate-700">
                  <div className="h-40 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                    <OptimizedImage
                      src={cover}
                      alt={route.title}
                      loading="lazy"
                      w={720}
                      h={320}
                      q={75}
                      className="w-full h-full object-cover motion-safe:group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-300"
                    />
                    {route.destination ? (
                      <div className="absolute top-2 left-2 max-w-[calc(100%-5rem)] px-2 py-1 rounded bg-black/50 text-white text-xs font-medium truncate backdrop-blur-[2px]">
                        {route.destination}
                      </div>
                    ) : null}
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-sky-600 text-white text-sm font-medium rounded shadow-sm">
                      {t(showUsdApprox ? 'home.budgetFromWithUsd' : 'home.budgetFrom', {
                        value: formatInteger(route.budget, i18n.language),
                        usd: approxUsdFromCny(route.budget),
                      })}
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

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 md:flex-row md:items-end md:justify-between">
          <HomeSectionTitle>{t('home.popularDestinations')}</HomeSectionTitle>
          <Link
            to="/routes"
            aria-label={t('a11y.homeViewAllGuides')}
            className="shrink-0 self-start text-sm font-semibold text-sky-700 underline decoration-sky-300/80 decoration-2 underline-offset-4 hover:text-sky-900 dark:text-sky-300 dark:decoration-sky-600/80 dark:hover:text-sky-200 md:self-auto"
          >
            {t('home.viewAll')}
          </Link>
        </div>
        {popularDestinationCards.length === 0 ? (
          <EmptyState
            emoji="🌏"
            title={t('ui.emptyDestinationsTitle')}
            description={t('ui.emptyDestinationsDesc')}
            actionTo="/routes"
            actionLabel={t('home.viewAll')}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularDestinationCards.map(({ dest, cover }) => {
              return (
                <div
                  key={dest.id}
                  className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md motion-safe:hover:shadow-lg motion-safe:transition border border-slate-100 dark:border-slate-700"
                >
                  <Link to={`/routes?destination=${encodeURIComponent(dest.name)}`} className="block flex-1 min-h-0">
                    <div className="h-32 relative">
                      <OptimizedImage
                        src={cover}
                        alt={dest.name}
                        loading="lazy"
                        w={600}
                        h={256}
                        q={75}
                        className="w-full h-full object-cover motion-safe:group-hover:scale-105 motion-safe:transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <h3 className="font-semibold text-base drop-shadow">{dest.name}</h3>
                        <p className="text-[11px] sm:text-xs opacity-95 mt-0.5 drop-shadow">
                          {t('destinations.routesCount', { count: dest.routeCount ?? 0 })}
                        </p>
                        <div className="mt-1 scale-90 origin-left">
                          <StarRatingDisplay
                            value={getPlaceRatingMeta(dest).rating}
                            reviewCount={getPlaceRatingMeta(dest).reviewCount}
                            size="sm"
                            tone="dark"
                          />
                        </div>
                        <p className="text-sm opacity-90 mt-0.5">
                          {t(showUsdApprox ? 'home.perDayFromWithUsd' : 'home.perDayFrom', {
                            value: formatInteger(dest.dailyBudget, i18n.language),
                            usd: approxUsdFromCny(dest.dailyBudget),
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="grid grid-cols-2 border-t border-slate-100 dark:border-slate-700 divide-x divide-slate-100 dark:divide-slate-700 bg-slate-50/90 dark:bg-slate-800/40">
                    <Link
                      to={`/routes?destination=${encodeURIComponent(dest.name)}`}
                      className="py-2.5 text-center text-[11px] sm:text-xs font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-700/60 transition min-h-10 flex items-center justify-center"
                    >
                      {t('home.cardLinkGuides')}
                    </Link>
                    <Link
                      to="/routes"
                      className="py-2.5 text-center text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition min-h-10 flex items-center justify-center"
                    >
                      {t('home.cardLinkRegion')}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 md:flex-row md:items-end md:justify-between">
          <HomeSectionTitle>{t('home.latestArticles')}</HomeSectionTitle>
          <Link
            to="/routes"
            aria-label={t('a11y.homeViewAllGuides')}
            className="shrink-0 self-start text-sm font-semibold text-sky-700 underline decoration-sky-300/80 decoration-2 underline-offset-4 hover:text-sky-900 dark:text-sky-300 dark:decoration-sky-600/80 dark:hover:text-sky-200 md:self-auto"
          >
            {t('home.viewAll')}
          </Link>
        </div>
        {filteredLatestArticles.length === 0 ? (
          <EmptyState
            emoji="📝"
            title={t('ui.emptyLatestTitle')}
            description={t('ui.emptyLatestDesc')}
            actionTo="/routes"
            actionLabel={t('home.viewAll')}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticleGridItems.map(({ item: article, cover }) => (
              <div key={article.id} className="relative">
                <Link
                  to={`/routes/${article.id}`}
                  className="group block rounded-xl overflow-hidden shadow-md motion-safe:hover:shadow-lg motion-safe:transition border border-slate-100 dark:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 bg-white dark:bg-slate-900"
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
                      {(article.tags ?? []).map((tag) => (
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
      </section>

      {recentUserGuides.length > 0 && (
        <section className="mx-auto max-w-7xl rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50/90 via-white to-sky-50/40 px-4 py-14 shadow-inner dark:border-slate-700 dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-900/60 sm:px-8 sm:py-16">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <HomeSectionTitle>{t('userGuide.recentUserGuides')}</HomeSectionTitle>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {t('userGuide.recentUserGuidesSub')}
              </p>
            </div>
            <Link
              to="/routes"
              aria-label={t('a11y.homeViewAllUserGuides')}
              className="shrink-0 self-start text-sm font-semibold text-sky-700 underline decoration-sky-300/80 decoration-2 underline-offset-4 hover:text-sky-900 dark:text-sky-300 dark:decoration-sky-600/80 dark:hover:text-sky-200 md:self-auto"
            >
              {t('userGuide.viewAllGuides')}
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentUserGuideGridItems.map(({ item, cover }) => (
              <div key={item.id} className="relative">
                <Link
                  to={`/routes/${item.id}`}
                  className="group block rounded-xl overflow-hidden shadow-md motion-safe:hover:shadow-lg motion-safe:transition border border-slate-100 dark:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 bg-white dark:bg-slate-900"
                >
                  <div className="h-48 overflow-hidden relative">
                    <OptimizedImage
                      src={cover}
                      alt={item.title}
                      loading="lazy"
                      w={900}
                      h={384}
                      q={75}
                      className="w-full h-full object-cover motion-safe:group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-300"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start max-w-[75%] z-[1]">
                      <span className="px-2 py-0.5 rounded bg-sky-600/90 text-white text-xs font-medium">
                        {t('userGuide.userBadge')}
                      </span>
                      {item.reviewStatus === 'pending' && (
                        <span className="px-2 py-0.5 rounded bg-slate-900/90 text-sky-100 text-xs font-medium">
                          {t('governance.reviewPending')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      {t(showUsdApprox ? 'articles.daysBudgetWithUsd' : 'articles.daysBudget', {
                        dest: item.destination,
                        budget: formatInteger(item.budget, i18n.language),
                        usd: approxUsdFromCny(item.budget),
                        days: formatInteger(item.days, i18n.language),
                      })}
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                      {item.author} · {formatDate(item.date, i18n.language)}
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

      <section className="mx-auto max-w-7xl px-4 pb-14 pt-2 sm:px-6 sm:pb-16">
        <Link
          to="/community"
          aria-label={t('a11y.homeJoinCommunity')}
          className="block rounded-2xl border border-slate-200 bg-white px-5 py-6 text-center text-slate-800 shadow-sm transition hover:border-sky-200 hover:bg-sky-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-800 dark:hover:bg-slate-800/80 dark:focus-visible:ring-offset-slate-950"
        >
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">{t('home.joinCommunity')}</h2>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:text-sm">
            {t('home.joinCommunityDesc')}
          </p>
        </Link>
      </section>
      </>
      )}
    </div>
  )
}
