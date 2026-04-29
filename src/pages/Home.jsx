import { useState, useMemo, useEffect, useCallback } from 'react'
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
import CopyPageLinkButton from '../components/CopyPageLinkButton'
import AdSlot from '../components/AdSlot'
import { matchesGuideCard, matchesDestinationCard } from '../utils/searchMatch'
import { approxUsdFromCny, formatDate, formatInteger } from '../utils/localeFormat'
import { useUsdApproxDisplay } from '../contexts/UsdApproxPreferenceContext'
import { optimizeUnsplashUrl } from '../utils/optimizeUnsplashUrl'
import {
  assignArticleGridCoversInOrder,
  assignGridCoversInOrder,
  sortDestinationsUniqueHeroFirst,
} from '../utils/homePlaceCover.js'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { isAiChatEnabled } from '../services/aiChat'
import { PLACE_GEO_BY_ID } from '../data/placeGeo.generated'
import { useToast } from '../contexts/ToastContext'
import GlobalMapSearch from '../components/GlobalMapSearch'

/**
 * 首页主视觉：首张图 Matheus Ferrero 户外多元年轻人（public/hero-home.jpg 随站加载）
 */
const HOME_HERO_PHOTO_PAGE = 'https://unsplash.com/@matheusferrero?utm_source=roamwise&utm_medium=referral'
const HOME_HERO_UNSPLASH_BASE = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac'
/** 本地 hero 缺失或 404 时回退（同一张 Unsplash） */
const HOME_HERO_IMG_FALLBACK = optimizeUnsplashUrl(HOME_HERO_UNSPLASH_BASE, {
  w: 1920,
  q: 84,
  fit: 'max',
  auto: 'format',
})
const HERO_RESP_WIDTHS = [640, 960, 1280, 1920]

function buildLocalHeroSrcSet(prefix) {
  return HERO_RESP_WIDTHS.map((w) => `${prefix}hero-home-${w}w.jpg ${w}w`).join(', ')
}

function buildRemoteHeroSrcSet() {
  return HERO_RESP_WIDTHS.map((w) =>
    `${optimizeUnsplashUrl(HOME_HERO_UNSPLASH_BASE, { w, q: 84, fit: 'max', auto: 'format' })} ${w}w`,
  ).join(', ')
}

const BUDGET_MAX = { any: null, '2000': 2000, '5000': 5000, '10000': 10000 }
const DAYS_VALUE = { any: null, '3': 3, '7': 7, '15': 15 }
const AUTO_LOCATE_ONCE_KEY = 'roamwise-auto-locate-once-v1'
const AUTO_LOCATE_ENABLED_KEY = 'roamwise-auto-locate-enabled-v1'

function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = (v) => (v * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function Home() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [budgetMax, setBudgetMax] = useState('any')
  const [daysFilter, setDaysFilter] = useState('any')
  const [heroVariant, setHeroVariant] = useState('local')
  const [mobileSubBandOpen, setMobileSubBandOpen] = useState(false)
  const [roadbookBudget, setRoadbookBudget] = useState('5000')
  const [roadbookDays, setRoadbookDays] = useState('7')
  const [roadbookRegion, setRoadbookRegion] = useState('')
  const [roadbookNotes, setRoadbookNotes] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const [autoLocateEnabled, setAutoLocateEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    const v = window.localStorage.getItem(AUTO_LOCATE_ENABLED_KEY)
    if (v == null) return true
    return v !== '0'
  })
  const isDesktopLayout = useMediaQuery('(min-width: 768px)')
  const subBandDetailsOpen = isDesktopLayout || mobileSubBandOpen
  const mediaPrefix = useMemo(() => {
    const base = import.meta.env.BASE || '/'
    return base.endsWith('/') ? base : `${base}/`
  }, [])
  const localHeroDefaultSrc = `${mediaPrefix}hero-home-1920w.jpg`
  const { showUsdApprox } = useUsdApproxDisplay()

  const ugcList = useMemo(() => getUserGuidesAsCards(), [])

  useEffect(() => {
    const href = `${mediaPrefix}hero-home-1280w.jpg`
    if (document.head.querySelector(`link[data-roamwise-hero-preload="1"]`)) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = href
    link.setAttribute('fetchpriority', 'high')
    link.setAttribute('data-roamwise-hero-preload', '1')
    document.head.appendChild(link)
    return () => {
      link.remove()
    }
  }, [mediaPrefix])

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

  const filteredPopularDestinations = popularPlaces.filter((dest) =>
    matchesDestinationCard(dest, search),
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

  const goRandomDestination = useCallback(() => {
    if (!places.length) return
    const i = Math.floor(Math.random() * places.length)
    const d = places[i]
    if (d?.name) navigate(`/routes?destination=${encodeURIComponent(String(d.name))}`)
  }, [navigate, places])

  const locateAndJump = useCallback((fromAuto = false) => {
    if (!navigator?.geolocation) {
      if (!fromAuto) toast(t('home.locateUnsupported'))
      return
    }
    setIsLocating(true)
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
        setIsLocating(false)
      },
      (err) => {
        const denied = err?.code === 1
        if (!fromAuto) toast(denied ? t('home.locateDenied') : t('home.locateFailed'))
        setIsLocating(false)
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60 * 1000 },
    )
  }, [navigate, t, toast, places])

  const toggleAutoLocate = useCallback(() => {
    setAutoLocateEnabled((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(AUTO_LOCATE_ENABLED_KEY, next ? '1' : '0')
      }
      toast(next ? t('home.autoLocateEnabled') : t('home.autoLocateDisabled'))
      return next
    })
  }, [t, toast])

  useEffect(() => {
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
  }, [locateAndJump, searchParams, autoLocateEnabled])

  const dispatchRoadbookPrompt = useCallback(() => {
    const budgetPhrase =
      roadbookBudget === 'any'
        ? t('home.oneClickBudgetAnyPhrase')
        : t('home.oneClickBudgetCappedPhrase', {
            amount: formatInteger(Number(roadbookBudget), i18n.language),
          })
    const daysPhrase =
      roadbookDays === 'any'
        ? t('home.oneClickDaysAnyPhrase')
        : t('home.oneClickDaysFixedPhrase', {
            days: formatInteger(Number(roadbookDays), i18n.language),
          })
    const regionPhrase = roadbookRegion.trim() || t('home.roadbookRegionUnspecified')
    const notesPhrase = roadbookNotes.trim() || t('home.roadbookNotesUnspecified')
    const message = t('home.roadbookAiPrompt', {
      budget: budgetPhrase,
      days: daysPhrase,
      region: regionPhrase,
      notes: notesPhrase,
    })
    window.dispatchEvent(new CustomEvent('roamwise:ai-itinerary', { detail: { message } }))
  }, [roadbookBudget, roadbookDays, roadbookRegion, roadbookNotes, t, i18n.language])

  return (
    <div>
      <section
        className="relative flex min-h-[min(76vh,34rem)] md:min-h-[36rem] flex-col text-white overflow-hidden"
        aria-label={t('home.heroRegionAria')}
      >
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <img
            src={heroVariant === 'local' ? localHeroDefaultSrc : HOME_HERO_IMG_FALLBACK}
            srcSet={heroVariant === 'local' ? buildLocalHeroSrcSet(mediaPrefix) : buildRemoteHeroSrcSet()}
            sizes="100vw"
            alt=""
            width={1920}
            height={1080}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-[72%_center] sm:object-[76%_center] md:object-[78%_center]"
            onError={() => setHeroVariant((v) => (v === 'local' ? 'remote' : v))}
          />
          {/* 顶部条带：标语区可读性（与用户标注的「最上沿区域」对齐） */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(38%,11rem)] sm:h-[min(36%,12rem)] bg-gradient-to-b from-slate-950/60 via-slate-900/25 to-transparent" />
          {/* 左侧留白区：压暗渐变便于白字；右侧保留画面主体 */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[min(92%,28rem)] sm:w-[min(88%,34rem)] md:w-[min(52%,36rem)] bg-gradient-to-r from-slate-950/55 via-slate-900/30 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] max-h-[10rem] bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 flex flex-1 flex-col items-stretch justify-start px-5 sm:px-8 md:px-12 lg:px-16 pt-4 pb-10 sm:pt-5 sm:pb-12 md:pt-6 md:pb-14">
          <p className="sr-only">{t('home.heroImageAlt')}</p>
          <div className="max-w-[min(100%,26rem)] sm:max-w-2xl text-left">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] text-sky-200/95">
              {t('home.heroEyebrowNew')}
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-white leading-tight drop-shadow-md [text-shadow:0_2px_20px_rgba(0,0,0,0.7)]">
              {t('home.heroTitleNew')}
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg font-medium text-white/92 leading-snug drop-shadow-md [text-shadow:0_1px_14px_rgba(0,0,0,0.6)]">
              {t('home.heroLeadNew')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link
                to="/map"
                className="inline-flex min-h-11 items-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                {t('home.heroCtaPrimary')}
              </Link>
              <Link
                to="/routes"
                className="inline-flex min-h-11 items-center rounded-xl border border-white/60 bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition hover:bg-white/25"
              >
                {t('home.heroCtaSecondary')}
              </Link>
              <Link
                to="/budget"
                className="inline-flex min-h-11 items-center rounded-xl border border-emerald-300/80 bg-emerald-200/15 px-4 py-2 text-sm font-semibold text-emerald-100 shadow-sm backdrop-blur-sm transition hover:bg-emerald-200/25"
              >
                {t('home.heroCtaBudget')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="home-map-explore"
        className="scroll-mt-24 border-b border-slate-200 bg-slate-50 py-6 sm:py-8 dark:border-slate-800 dark:bg-slate-950"
        aria-label={t('home.mapExploreAria')}
      >
        <div className="max-w-7xl mx-auto px-4 mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">{t('home.mapExploreTitle')}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto sm:mx-0">{t('home.mapExploreLead')}</p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-2 shrink-0">
            <a
              href="#home-map-explore"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              {t('home.mapExploreJump')}
            </a>
            {isAiChatEnabled() ? (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('roamwise:ai-open'))}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {t('home.openAiAssistant')}
              </button>
            ) : null}
          </div>
        </div>
        <GlobalMapSearch compact />
      </section>

      {/* 热门与快捷入口移出主视觉区，避免叠在人脸与画面上 */}
      <section
        className="border-b border-slate-200/90 bg-slate-50/95 dark:border-slate-800 dark:bg-slate-950/95"
        aria-label={t('home.heroSubBandAria')}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4 text-center">
          <div className="flex flex-wrap items-center justify-between gap-2 print:hidden mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={goRandomDestination}
                aria-label={t('home.randomDestinationAria')}
                className="min-h-10 rounded-xl border-2 border-sky-400/90 bg-white/95 px-4 py-2 text-left shadow-sm transition hover:bg-sky-50/95 hover:border-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:bg-slate-900/95 dark:hover:bg-slate-800 dark:border-sky-500/80 dark:focus-visible:ring-offset-slate-950"
              >
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {t('home.randomDestinationZh')}
                </span>
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('home.randomDestinationEn')}
                </span>
              </button>
              <button
                type="button"
                onClick={() => locateAndJump(false)}
                disabled={isLocating}
                className="min-h-10 rounded-xl border border-emerald-300/90 bg-emerald-50/90 px-3 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100/90 disabled:cursor-not-allowed disabled:opacity-70 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                {isLocating ? t('home.locating') : t('home.locateCta')}
              </button>
              <button
                type="button"
                onClick={toggleAutoLocate}
                className="min-h-10 rounded-xl border border-slate-300/90 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
              >
                {autoLocateEnabled ? t('home.autoLocateOn') : t('home.autoLocateOff')}
              </button>
            </div>
            <CopyPageLinkButton className="!min-h-9 !px-2.5 !py-1.5 !text-xs rounded-lg shadow-sm shrink-0" />
          </div>
          <form
            id="home-search-form"
            role="search"
            aria-label={t('home.searchFormAria')}
            className="bg-white dark:bg-slate-900/95 dark:border dark:border-slate-700 rounded-2xl p-2.5 sm:p-3 shadow-lg border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row gap-2 sm:gap-2.5 mb-3 text-left"
            onSubmit={(e) => {
              e.preventDefault()
              const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
              const behavior = reduceMotion ? 'auto' : 'smooth'
              if (search.trim()) {
                document.getElementById('home-search-results')?.scrollIntoView({ behavior, block: 'start' })
              } else {
                document.getElementById('home-featured')?.scrollIntoView({ behavior, block: 'start' })
              }
            }}
          >
            <div className="flex-1 min-w-0">
              <label htmlFor="home-search-q" className="sr-only">
                {t('home.searchQueryLabel')}
              </label>
              <input
                id="home-search-q"
                type="search"
                placeholder={t('home.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
                className="w-full px-3 py-2.5 min-h-10 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-800 dark:bg-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div className="md:min-w-[10.5rem]">
              <label htmlFor="home-budget-filter" className="sr-only">
                {t('home.budgetFilterLabel')}
              </label>
              <select
                id="home-budget-filter"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                className="w-full px-3 py-2.5 min-h-10 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:bg-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="any">{t('home.budgetAny')}</option>
                <option value="2000">{t('home.budget0_2000')}</option>
                <option value="5000">{t('home.budget2000_5000')}</option>
                <option value="10000">{t('home.budget5000_10000')}</option>
              </select>
            </div>
            <div className="md:min-w-[10.5rem]">
              <label htmlFor="home-days-filter" className="sr-only">
                {t('home.daysFilterLabel')}
              </label>
              <select
                id="home-days-filter"
                value={daysFilter}
                onChange={(e) => setDaysFilter(e.target.value)}
                className="w-full px-3 py-2.5 min-h-10 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:bg-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="any">{t('home.daysAny')}</option>
                <option value="3">{t('home.days3')}</option>
                <option value="7">{t('home.days7')}</option>
                <option value="15">{t('home.days15')}</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 min-h-10 bg-sky-600 hover:bg-sky-700 rounded-xl font-semibold text-white text-sm transition shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            >
              {t('home.searchButton')}
            </button>
          </form>
          {isAiChatEnabled() ? (
            <div className="mb-3 rounded-2xl border border-slate-200/90 bg-white/90 dark:border-slate-700 dark:bg-slate-900/80 px-3 py-3 shadow-sm text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{t('home.roadbookTitle')}</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 mb-3 leading-relaxed">{t('home.roadbookLead')}</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-2">
                <div className="flex-1 min-w-0 sm:max-w-[11rem]">
                  <label htmlFor="roadbook-budget" className="sr-only">
                    {t('home.roadbookBudgetLabel')}
                  </label>
                  <select
                    id="roadbook-budget"
                    value={roadbookBudget}
                    onChange={(e) => setRoadbookBudget(e.target.value)}
                    className="w-full px-3 py-2 min-h-10 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:bg-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="any">{t('home.budgetAny')}</option>
                    <option value="2000">{t('home.budget0_2000')}</option>
                    <option value="5000">{t('home.budget2000_5000')}</option>
                    <option value="10000">{t('home.budget5000_10000')}</option>
                  </select>
                </div>
                <div className="flex-1 min-w-0 sm:max-w-[11rem]">
                  <label htmlFor="roadbook-days" className="sr-only">
                    {t('home.roadbookDaysLabel')}
                  </label>
                  <select
                    id="roadbook-days"
                    value={roadbookDays}
                    onChange={(e) => setRoadbookDays(e.target.value)}
                    className="w-full px-3 py-2 min-h-10 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:bg-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="any">{t('home.daysAny')}</option>
                    <option value="3">{t('home.days3')}</option>
                    <option value="7">{t('home.days7')}</option>
                    <option value="15">{t('home.days15')}</option>
                  </select>
                </div>
              </div>
              <div className="mb-2">
                <label htmlFor="roadbook-region" className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {t('home.roadbookRegionLabel')}
                </label>
                <input
                  id="roadbook-region"
                  type="text"
                  value={roadbookRegion}
                  onChange={(e) => setRoadbookRegion(e.target.value)}
                  placeholder={t('home.roadbookRegionPlaceholder')}
                  maxLength={80}
                  className="w-full px-3 py-2 min-h-10 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-800 dark:bg-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="roadbook-notes" className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {t('home.roadbookNotesLabel')}
                </label>
                <textarea
                  id="roadbook-notes"
                  value={roadbookNotes}
                  onChange={(e) => setRoadbookNotes(e.target.value)}
                  placeholder={t('home.roadbookNotesPlaceholder')}
                  rows={3}
                  maxLength={400}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-800 dark:bg-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-y min-h-[4.5rem]"
                />
              </div>
              <button
                type="button"
                onClick={dispatchRoadbookPrompt}
                className="mb-2 w-full min-h-11 px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              >
                {t('home.roadbookCta')}
              </button>
              <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed">{t('home.roadbookHint')}</p>
            </div>
          ) : (
            <p className="mb-3 text-center text-[11px] text-slate-500 dark:text-slate-500">{t('home.roadbookDisabled')}</p>
          )}
          <details
            className="collapse-panel group mb-3 rounded-xl border border-slate-200/90 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/30 text-left md:border-0 md:bg-transparent"
            open={subBandDetailsOpen}
            onToggle={(e) => {
              if (isDesktopLayout) return
              setMobileSubBandOpen(e.currentTarget.open)
            }}
          >
            <summary className="md:hidden cursor-pointer list-none rounded-xl px-3 py-2.5 text-center text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('home.subBandSummary')}
            </summary>
            <div className="space-y-3 px-1 pb-3 pt-0 md:space-y-3 md:px-0 md:pb-0">
              {/* 站点统计（首页极简：理念与五柱见关于页） */}
              <div className="rounded-xl border border-slate-200/90 bg-white/70 dark:border-slate-700 dark:bg-slate-900/50 px-3 py-2.5 text-center shadow-sm">
                <div
                  className="flex flex-wrap justify-center gap-1.5 text-[11px] leading-tight"
                  role="group"
                  aria-label={t('home.heroStatsAria')}
                >
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800/90 px-2 py-0.5 border border-slate-200/90 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                    {t('home.heroStatDestinations', { count: siteSnapshot.destinationCount })}
                  </span>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800/90 px-2 py-0.5 border border-slate-200/90 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                    {t('home.heroStatGuides', { count: siteSnapshot.guideCount })}
                  </span>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800/90 px-2 py-0.5 border border-slate-200/90 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                    {t('home.heroStatRegions', { count: siteSnapshot.continentCount })}
                  </span>
                </div>
              </div>
              <nav className="max-w-2xl mx-auto text-center" aria-label={t('home.hotSearchAria')}>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-2">{t('home.hotSearchTitle')}</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {hotPickDestinations.map((d) => (
                    <Link
                      key={d.id}
                      to={`/routes?destination=${encodeURIComponent(d.name)}`}
                      className="px-2.5 py-1 min-h-8 rounded-full bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-medium border border-slate-200/90 dark:border-slate-600 transition [touch-action:manipulation] shadow-sm"
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              </nav>
              <nav
                className="pt-4 border-t border-slate-200/80 dark:border-slate-700/80 text-center"
                aria-label={t('home.quickNavAria')}
              >
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{t('home.quickNavLead')}</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  <Link
                    to="/map"
                    className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-medium border border-slate-200/90 dark:border-slate-600 transition min-h-9 inline-flex items-center shadow-sm"
                  >
                    {t('common.navMap')}
                  </Link>
                  <Link
                    to="/routes"
                    className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-medium border border-slate-200/90 dark:border-slate-600 transition min-h-9 inline-flex items-center shadow-sm"
                  >
                    {t('common.navHotCountries')}
                  </Link>
                  <Link
                    to="/budget"
                    className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-medium border border-slate-200/90 dark:border-slate-600 transition min-h-9 inline-flex items-center shadow-sm"
                  >
                    {t('common.navSavingTips')}
                  </Link>
                  <Link
                    to="/about"
                    className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-medium border border-slate-200/90 dark:border-slate-600 transition min-h-9 inline-flex items-center shadow-sm"
                  >
                    {t('common.navAbout')}
                  </Link>
                </div>
              </nav>
            </div>
          </details>
          <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-500">
            <span>{t('home.heroPhotoCreditPrefix')} </span>
            <a
              href={HOME_HERO_PHOTO_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sky-800 dark:text-sky-300 underline underline-offset-2 hover:opacity-90"
            >
              {t('home.heroPhotoCredit')}
            </a>
          </p>
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
              actionTo="/routes"
              actionLabel={t('ui.emptySearchAction')}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mergedSearchGridItems.map(({ item: article, cover }) => (
                <div key={article.id} className="relative">
                  <Link
                    to={`/routes/${article.id}`}
                    className="group block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md motion-safe:hover:shadow-lg motion-safe:transition border border-slate-100 dark:border-slate-700"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <OptimizedImage
                        src={cover}
                        alt=""
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

      <section id="home-featured" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-24">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 md:mb-6">
          🔥 {t('home.featuredRoutes')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          {t('common.fxDisclaimer')}{' '}
          <span className="text-slate-400 dark:text-slate-500">({t('common.usdToggleLead')})</span>
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 md:hidden">{t('ui.swipeHint')}</p>
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
                className="flex-shrink-0 w-[min(18rem,calc(100vw-2.5rem))] snap-start group"
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

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🌏 {t('home.popularDestinations')}</h2>
          <Link
            to="/routes"
            className="text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 font-medium min-h-11 inline-flex items-center shrink-0"
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

      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdSlot slotId="home-mid" className="min-h-[80px]" />
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">📝 {t('home.latestArticles')}</h2>
          <Link
            to="/routes"
            className="text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 font-medium min-h-11 inline-flex items-center shrink-0"
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
      </section>

      {recentUserGuides.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex justify-between items-center mb-6 gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">✨ {t('userGuide.recentUserGuides')}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('userGuide.recentUserGuidesSub')}</p>
            </div>
            <Link
              to="/routes"
              className="text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 font-medium whitespace-nowrap min-h-11 inline-flex items-center shrink-0"
            >
              {t('userGuide.viewAllGuides')}
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentUserGuideGridItems.map(({ item, cover }) => (
              <div key={item.id} className="relative">
                <Link
                  to={`/routes/${item.id}`}
                  className="group block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md motion-safe:hover:shadow-lg motion-safe:transition border border-slate-100 dark:border-slate-700"
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

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/community"
          className="block text-center py-6 px-4 min-h-[5.5rem] rounded-2xl bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-emerald-500/10 dark:from-sky-500/5 dark:via-cyan-500/5 dark:to-emerald-500/5 border border-sky-200/80 dark:border-slate-600 hover:border-sky-300 dark:hover:border-sky-600/60 transition"
        >
          <span className="text-xl">🤝</span>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-2">{t('home.joinCommunity')}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('home.joinCommunityDesc')}</p>
        </Link>
      </section>
    </div>
  )
}
