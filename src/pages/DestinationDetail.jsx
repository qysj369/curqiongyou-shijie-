import { useState, useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { destinations, articles } from '../data/mockData'
import { getDestinationRatingMeta } from '../data/destinationRatingMeta'
import { getDestinationReviews } from '../data/destinationReviews'
import { destinationGuides } from '../data/destinationGuides'
import { getUserGuidesByDestination } from '../data/userGuidesStore'
import Breadcrumbs from '../components/Breadcrumbs'
import UserGuideForm from '../components/UserGuideForm'
import BudgetGuidePanel from '../components/BudgetGuidePanel'
import EmptyState from '../components/EmptyState'
import OptimizedImage from '../components/OptimizedImage'
import StarRatingDisplay from '../components/StarRatingDisplay'
import TravelerPhotoStrip from '../components/TravelerPhotoStrip'
import TravelerReviewList from '../components/TravelerReviewList'
import CollapsibleDetails from '../components/CollapsibleDetails'
import GuideRecommendBar from '../components/GuideRecommendBar'
import { useSeoOverride } from '../contexts/SeoOverrideContext'

const SECTION_IDS = {
  overview: 'dest-section-overview',
  reviews: 'dest-section-reviews',
  guides: 'dest-section-guides',
}

export default function DestinationDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [ugcRefresh, setUgcRefresh] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const { setOverride, clear } = useSeoOverride()
  const dest = destinations.find((d) => d.id === id)

  const relatedArticles = useMemo(
    () => (dest ? articles.filter((a) => a.destination === dest.name) : []),
    [dest],
  )
  const relatedUserGuides = useMemo(
    () => (dest ? getUserGuidesByDestination(dest.name) : []),
    [dest, ugcRefresh],
  )
  const guide = dest ? destinationGuides[dest.id] : undefined

  const ratingMeta = useMemo(() => (dest ? getDestinationRatingMeta(dest) : null), [dest])
  const travelerReviews = useMemo(() => (dest ? getDestinationReviews(dest) : []), [dest])
  const travelerPhotos = useMemo(() => {
    if (!dest) return []
    const covers = articles.filter((a) => a.destination === dest.name).map((a) => a.cover)
    return [...new Set([dest.image, ...covers])].slice(0, 12)
  }, [dest])

  const maxGuideHeat = useMemo(() => {
    if (!relatedArticles.length) return 1
    const heats = relatedArticles.map((a) => (Number(a.views) || 0) + (Number(a.likes) || 0) * 2)
    return Math.max(1, ...heats)
  }, [relatedArticles])

  const guideRecommendPercent = (a) => {
    const heat = (Number(a.views) || 0) + (Number(a.likes) || 0) * 2
    return Math.min(100, Math.round((heat / maxGuideHeat) * 100))
  }

  const scrollToTab = (key) => {
    const elId = SECTION_IDS[key]
    if (!elId) return
    document.getElementById(elId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveTab(key)
  }

  useEffect(() => {
    if (!dest) return undefined
    const elements = Object.values(SECTION_IDS)
      .map((sid) => document.getElementById(sid))
      .filter(Boolean)
    if (elements.length === 0) return undefined

    const idToTab = {
      [SECTION_IDS.overview]: 'overview',
      [SECTION_IDS.reviews]: 'reviews',
      [SECTION_IDS.guides]: 'guides',
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio > 0.08)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id && idToTab[visible.target.id]) {
          setActiveTab(idToTab[visible.target.id])
        }
      },
      { threshold: [0, 0.1, 0.2, 0.35], rootMargin: '-14% 0px -50% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [dest?.id])

  useEffect(() => {
    if (!dest) {
      clear()
      return undefined
    }
    const tagPart = dest.tags?.length ? ` — ${dest.tags.slice(0, 4).join('、')}` : ''
    const desc = `${dest.name} · ${dest.country} · ${dest.continent}${dest.description ? ` — ${dest.description}` : ''}${tagPart}`.slice(0, 160)
    setOverride({
      title: t('seo.pageTitleTemplate', { page: dest.name, site: t('common.siteName') }),
      description: desc || t('seo.description'),
      image: dest.image,
    })
    return () => clear()
  }, [dest, t, setOverride, clear])

  if (!dest)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-12">
        <div className="max-w-lg mx-auto">
          <EmptyState
            emoji="🗺️"
            title={t('destinationDetail.notFound')}
            actionTo="/destinations"
            actionLabel={t('common.destinations')}
          />
        </div>
      </div>
    )

  const breadcrumbs = [
    { label: t('common.home'), to: '/' },
    { label: t('common.destinations'), to: '/destinations' },
    { label: dest.name },
  ]

  const tabs = [
    { key: 'overview', label: t('destinationDetail.tabOverview') },
    { key: 'reviews', label: t('destinationDetail.tabReviews') },
    { key: 'guides', label: t('destinationDetail.tabGuides') },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 pt-6 print:hidden">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="relative h-64 md:h-80 overflow-hidden">
        <OptimizedImage src={dest.image} alt={dest.name} w={1600} h={640} q={75} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-sm">{dest.name}</h1>
          <p className="text-slate-200 mt-1">{dest.country} · {dest.continent}</p>
          {ratingMeta && (
            <div className="mt-3 flex flex-wrap items-center gap-2 md:gap-3">
              <StarRatingDisplay
                value={ratingMeta.rating}
                reviewCount={ratingMeta.reviewCount}
                size="lg"
                tone="dark"
              />
              <span className="text-xs md:text-sm rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30">
                {t('travelerVoice.photoBadge', { count: ratingMeta.photoCount })}
              </span>
              <span className="text-xs md:text-sm rounded-full bg-emerald-500/35 px-3 py-1 border border-emerald-300/40">
                {t('travelerVoice.routesBadge', { count: dest.routeCount })}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10 pb-16">
        <nav
          className="sticky top-16 z-30 -mx-4 px-4 py-2.5 mb-6 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-sm flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide"
          aria-label={t('destinationDetail.tabNavAria')}
        >
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => scrollToTab(key)}
              className={`shrink-0 px-4 py-2.5 min-h-11 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                activeTab === key
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-400/60'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <section
          id={SECTION_IDS.overview}
          className="scroll-mt-32 mb-10 rounded-2xl border border-transparent"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 md:p-8 border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('destinationDetail.overview')}</h2>
            {dest.description &&
              (dest.description.length > 120 ? (
                <CollapsibleDetails title={t('destinationDetail.introFoldTitle')} defaultOpen={false} className="mb-6">
                  <p className="whitespace-pre-line pt-4">{dest.description}</p>
                </CollapsibleDetails>
              ) : (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{dest.description}</p>
              ))}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-100/80 dark:border-amber-900/50">
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t('destinationDetail.dailyBudget')}</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">¥{dest.dailyBudget}</p>
              </div>
              <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-xl border border-teal-100/80 dark:border-teal-900/50">
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t('destinationDetail.visa')}</p>
                <p className="text-lg font-semibold text-teal-700 dark:text-teal-400">{dest.visaType}</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100/80 dark:border-blue-900/50">
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t('destinationDetail.recommendedStay')}</p>
                <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">{t('destinationDetail.recommendedDays')}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {dest.tags.map((tagItem) => (
                <span
                  key={tagItem}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-sm"
                >
                  #{tagItem}
                </span>
              ))}
            </div>
            <div className="mt-6 print:hidden">
              <BudgetGuidePanel destinationName={dest.name} destinationId={dest.id} />
            </div>
          </div>

          {guide && (
            <div className="space-y-4 mt-8">
              <CollapsibleDetails title={t('destinationDetail.customsTaboos')} defaultOpen>
                <p className="whitespace-pre-line pt-4">{guide.customsTaboos || t('destinationDetail.noInfo')}</p>
              </CollapsibleDetails>
              <CollapsibleDetails title={t('destinationDetail.beliefs')} defaultOpen={false}>
                <p className="whitespace-pre-line pt-4">{guide.beliefs || t('destinationDetail.noInfo')}</p>
              </CollapsibleDetails>
              <CollapsibleDetails title={t('destinationDetail.travelRisks')} defaultOpen={false}>
                <p className="whitespace-pre-line pt-4">{guide.travelRisks || t('destinationDetail.noInfo')}</p>
              </CollapsibleDetails>
            </div>
          )}
        </section>

        <section id={SECTION_IDS.reviews} className="scroll-mt-32 mb-10">
          <TravelerPhotoStrip photos={travelerPhotos} destinationName={dest.name} className="mb-8" />
          <TravelerReviewList reviews={travelerReviews} destinationName={dest.name} />
        </section>

        <section id={SECTION_IDS.guides} className="scroll-mt-32">
          <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/90 to-white dark:from-emerald-950/30 dark:to-slate-900 p-5 md:p-6 mb-8">
            <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mb-2">{t('destinationDetail.qaTeaserTitle')}</h2>
            <p className="text-sm text-emerald-900/85 dark:text-emerald-100/85 leading-relaxed mb-4">{t('destinationDetail.qaTeaserDesc')}</p>
            <Link
              to="/community/qa"
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-11 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
            >
              {t('destinationDetail.qaTeaserCta')}
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {t('destinationDetail.guidesHeading', {
                count: relatedArticles.length + relatedUserGuides.length,
              })}
            </h2>
            <Link
              to={`/articles?destination=${encodeURIComponent(dest.name)}`}
              className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 whitespace-nowrap min-h-11 inline-flex items-center"
            >
              {t('destinationDetail.openArticlesFiltered')}
            </Link>
          </div>
          <div className="space-y-4">
            {relatedArticles.length > 0 ? (
              relatedArticles.map((a) => (
                <Link
                  key={a.id}
                  to={`/articles/${a.id}`}
                  className="block bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm hover:shadow-md transition border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex gap-4">
                    <OptimizedImage
                      src={a.cover}
                      alt=""
                      loading="lazy"
                      w={192}
                      h={192}
                      q={75}
                      className="h-24 w-24 flex-shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">{a.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        {t('destinationDetail.daysBudgetAuthor', { days: a.days, budget: a.budget, author: a.author })}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        <span>
                          👁 {a.views != null ? Number(a.views).toLocaleString() : '—'} {t('destinationDetail.heatViews')}
                        </span>
                        <span>
                          ♥ {a.likes != null ? Number(a.likes).toLocaleString() : '—'} {t('destinationDetail.heatLikes')}
                        </span>
                      </p>
                      <GuideRecommendBar percent={guideRecommendPercent(a)} />
                    </div>
                  </div>
                </Link>
              ))
            ) : null}
            {relatedUserGuides.length > 0 && (
              <>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 mb-2">{t('userGuide.relatedExperiences')}</p>
                {relatedUserGuides.map((g) => (
                  <Link
                    key={g.id}
                    to={`/articles/${g.id}`}
                    className="block bg-amber-50/80 dark:bg-amber-950/25 rounded-xl p-4 shadow-sm hover:shadow-md transition border border-amber-100 dark:border-amber-900/50"
                  >
                    <div className="flex gap-4">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">{t('userGuide.userBadge')}</span>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{g.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                          {g.destinationName} · ¥{g.budget} · {g.author} · {g.createdAt.slice(0, 10)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            )}
            {relatedArticles.length === 0 && relatedUserGuides.length === 0 && (
              <EmptyState
                emoji="📝"
                title={t('ui.emptyDestinationGuidesTitle')}
                description={t('destinationDetail.noGuides')}
              />
            )}
          </div>

          <section className="mt-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">{t('userGuide.shareExperience')}</h3>
            <UserGuideForm initialDestination={dest.name} onSuccess={() => setUgcRefresh((n) => n + 1)} compact />
          </section>
        </section>
      </div>
    </div>
  )
}
