import { useRef, useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { articles, destinations } from '../data/mockData'
import OptimizedImage from '../components/OptimizedImage'
import { getUserGuideById, getUserGuidesByArticleId, getUserGuidesByDestination, userGuideDefaultCover } from '../data/userGuidesStore'
import FavoriteButton from '../components/FavoriteButton'
import ArticleLikeButton from '../components/ArticleLikeButton'
import ShareBar from '../components/ShareBar'
import Breadcrumbs from '../components/Breadcrumbs'
import JsonLd from '../components/JsonLd'
import CommentSection from '../components/CommentSection'
import UserGuideForm from '../components/UserGuideForm'
import BudgetGuidePanel from '../components/BudgetGuidePanel'
import GuideAmapPanel from '../components/GuideAmapPanel'
import ArticleMediaSection from '../components/ArticleMediaSection'
import { resolveDestinationRouteVideo } from '../data/destinationRouteVideo'
import EmptyState from '../components/EmptyState'
import { useSeoOverride } from '../contexts/SeoOverrideContext'
import { excerptForMeta } from '../utils/seoExcerpt'
import { getLastUpdatedDay, isPossiblyOutdated } from '../utils/articleTimeliness'
import { formatDate, formatInteger } from '../utils/localeFormat'
import { formatGuideBudgetLine } from '../utils/budgetDisplay'
import { useUsdApproxDisplay } from '../contexts/UsdApproxPreferenceContext'
import { buildTripAiHrefFromArticle } from '../utils/tripGuideBridge.js'
import { buildCommunityBuddiesHref, buildCommunityQaHref } from '../utils/tripCommunityBridge.js'

export default function ArticleDetail() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const { setOverride, clear } = useSeoOverride()
  const articleRef = useRef(null)
  const [userGuidesRefresh, setUserGuidesRefresh] = useState(0)
  const [detail, setDetail] = useState(null)
  const { showUsdApprox } = useUsdApproxDisplay()

  const isUserGuide = id && id.startsWith('ug-')
  const userGuide = isUserGuide ? getUserGuideById(id) : null
  const article = isUserGuide ? null : articles.find(a => a.id === id)
  const dest = article ? destinations.find(d => d.name === article.destination) : (userGuide ? destinations.find(d => d.name === userGuide.destinationName) : null)

  const routeVideo = useMemo(
    () => (article ? resolveDestinationRouteVideo(article) : { videoYoutubeId: '', videoMp4: '' }),
    [article],
  )

  const routeExecutionCards = useMemo(() => {
    if (!article) return []
    const daily = article.days > 0 ? Math.max(1, Math.round(article.budget / article.days)) : article.budget
    return [
      {
        id: 'budget',
        title: t('articleDetail.execBudgetTitle'),
        body: t('articleDetail.execBudgetBody', {
          total: formatInteger(article.budget, i18n.language),
          days: formatInteger(article.days || 1, i18n.language),
          daily: formatInteger(daily, i18n.language),
        }),
      },
      {
        id: 'route',
        title: t('articleDetail.execRouteTitle'),
        body: t('articleDetail.execRouteBody'),
      },
      {
        id: 'risk',
        title: t('articleDetail.execRiskTitle'),
        body: t('articleDetail.execRiskBody'),
      },
    ]
  }, [article, i18n.language, t])

  useEffect(() => {
    if (isUserGuide || !article?.id) {
      setDetail(null)
      return
    }
    setDetail(null)
    let cancelled = false
    import('../data/articleContent.js')
      .then((mod) => {
        if (!cancelled) setDetail(mod.getArticleDetail(article.id))
      })
      .catch(() => {
        if (!cancelled) setDetail(null)
      })
    return () => {
      cancelled = true
    }
  }, [isUserGuide, article?.id])
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = (article || userGuide)?.title ?? ''
  const shareText = article
    ? `${article.title} · ${article.destination} ¥${formatInteger(article.budget, i18n.language)}`
    : (userGuide
        ? `${userGuide.title} · ${userGuide.destinationName} ¥${formatInteger(userGuide.budget, i18n.language)}`
        : '')
  useEffect(() => {
    if (article) {
      const raw = detail?.content || ''
      const lead = t('seo.articleDetailMetaLead', {
        destination: article.destination,
        budget: formatInteger(article.budget, i18n.language),
        days: formatInteger(article.days || 1, i18n.language),
      })
      const excerpt = excerptForMeta(raw, { stripMarkdown: true })
      const desc = `${lead}${excerpt ? ` · ${excerpt}` : ''}`.slice(0, 160) || t('seo.description')
      setOverride({
        title: t('seo.pageTitleTemplate', { page: article.title, site: t('common.siteName') }),
        description: desc,
        image: article.cover,
      })
      return () => clear()
    }
    if (userGuide) {
      const desc = excerptForMeta(userGuide.content) || t('seo.description')
      setOverride({
        title: t('seo.pageTitleTemplate', { page: userGuide.title, site: t('common.siteName') }),
        description: desc,
        image: userGuideDefaultCover,
      })
      return () => clear()
    }
    clear()
    return () => clear()
  }, [article, userGuide, detail, t, i18n.language, setOverride, clear])

  const related = useMemo(() => {
    if (!article) return []
    const sameDest = articles.filter(a => a.id !== article.id && a.destination === article.destination)
    const other = articles.filter(a => a.id !== article.id && a.destination !== article.destination)
    return [...sameDest, ...other].slice(0, 3)
  }, [article])

  const relatedUserGuides = useMemo(() => {
    if (!article) return []
    const byArticle = getUserGuidesByArticleId(article.id)
    const byDest = getUserGuidesByDestination(article.destination)
    const seen = new Set()
    return [...byArticle, ...byDest].filter((g) => {
      if (seen.has(g.id)) return false
      seen.add(g.id)
      return true
    })
  }, [article, userGuidesRefresh])

  const breadcrumbs = article
    ? [
        { label: t('common.navMap'), to: '/map' },
        { label: t('common.navRoutes'), to: '/routes' },
        { label: article.title },
      ]
    : userGuide
      ? [
          { label: t('common.navMap'), to: '/map' },
          { label: t('common.navRoutes'), to: '/routes' },
          { label: userGuide.title },
        ]
      : []

  const jsonLd = useMemo(() => {
    if ((!article && !userGuide) || typeof window === 'undefined') return null
    const headline = article?.title || userGuide?.title
    const desc = excerptForMeta(detail?.content || userGuide?.content || '', { stripMarkdown: true }).slice(0, 200)
    const image = article?.cover || userGuideDefaultCover
    const date = article?.date || userGuide?.createdAt?.slice(0, 10)
    const authorName = article?.author || userGuide?.author
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      description: desc,
      image,
      datePublished: date,
      dateModified: date,
      inLanguage: 'zh-CN',
      author: { '@type': 'Person', name: authorName },
      publisher: {
        '@type': 'Organization',
        name: t('common.siteName'),
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': window.location.href,
      },
      url: window.location.href,
    }
  }, [article, userGuide, detail, i18n.language, t])

  if (isUserGuide && !userGuide)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-12">
        <div className="max-w-lg mx-auto">
          <EmptyState
            emoji="🔍"
            title={t('articleDetail.notFound')}
            actionTo="/routes"
            actionLabel={t('articleDetail.backToList')}
          />
        </div>
      </div>
    )

  if (userGuide) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbs} className="print:hidden" />
          <Link
            to="/routes"
            className="text-sky-700 dark:text-sky-300 hover:underline mb-4 min-h-11 inline-flex items-center print:hidden"
          >
            {t('articleDetail.backToList')}
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 print:hidden">
            {t('common.fxDisclaimer')}{' '}
            <span className="text-slate-400 dark:text-slate-500">({t('common.usdToggleLead')})</span>
          </p>
          <div className="mb-4 print:hidden">
            <ShareBar articleRef={articleRef} shareUrl={shareUrl} shareTitle={shareTitle} shareText={shareText} />
          </div>
          <article
            ref={articleRef}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700 print:shadow-none"
          >
            <OptimizedImage src={userGuideDefaultCover} alt="" w={1200} h={675} q={75} className="w-full aspect-video object-cover" />
            <div className="p-6 md:p-8">
              <span className="mb-2 inline-block rounded bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                {t('userGuide.userBadge')}
              </span>
              {userGuide.status === 'pending' && (
                <div
                  className="mb-4 rounded-xl border border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/40 px-4 py-3 text-sm"
                  role="status"
                >
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-sky-900 dark:text-sky-200">
                    <span aria-hidden>⏳</span>
                    {t('governance.reviewPending')}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 mt-1 text-xs leading-relaxed">
                    {t('governance.reviewPendingBanner')}
                  </p>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">{userGuide.title}</h1>
              <div className="flex flex-wrap gap-2 mt-3 text-slate-500 dark:text-slate-400 text-sm">
                {userGuide.days > 0 && <span>{t('articleDetail.days', { count: userGuide.days })}</span>}
                {userGuide.budget > 0 && (
                  <>
                    <span>·</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatGuideBudgetLine(userGuide.budget, {
                        showUsdApprox,
                        t,
                        lng: i18n.language,
                      })}
                    </span>
                  </>
                )}
                <span>·</span>
                <span>{userGuide.author}</span>
                {dest && (
                  <>
                    <span>·</span>
                    <Link to={`/routes?destination=${encodeURIComponent(dest.name)}`} className="text-sky-700 dark:text-sky-300 hover:underline">
                      {dest.name}
                    </Link>
                  </>
                )}
                <span>·</span>
                <span>{formatDate(userGuide.createdAt, i18n.language)}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {t('governance.lastUpdated', {
                  date: getLastUpdatedDay({ date: userGuide.createdAt.slice(0, 10) }) || '—',
                })}
              </p>
              {isPossiblyOutdated({ date: userGuide.createdAt.slice(0, 10) }) && (
                <div
                  className="mt-3 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/90 dark:bg-sky-950/35 px-4 py-3"
                  role="status"
                >
                  <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">{t('governance.possiblyOutdated')}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">{t('governance.outdatedHint')}</p>
                </div>
              )}
              <div className="mt-4 print:hidden">
                <BudgetGuidePanel destinationName={userGuide.destinationName} />
              </div>
              <div className="mt-4 print:hidden rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/80 dark:bg-sky-950/30 p-4">
                <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">{t('articleDetail.qaBlockTitle')}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{t('articleDetail.qaBlockLeadUser')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {dest ? (
                    <Link
                      to={`/community/qa?destination=${encodeURIComponent(dest.name)}`}
                      className="inline-flex min-h-10 items-center rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white hover:bg-sky-700 transition"
                    >
                      {t('articleDetail.qaAsk')}
                    </Link>
                  ) : null}
                  <Link
                    to="/community/qa"
                    className="inline-flex min-h-10 items-center rounded-lg border border-sky-300 px-3 py-2 text-xs font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-800 transition"
                  >
                    {t('articleDetail.qaBrowse')}
                  </Link>
                </div>
              </div>
              <div className="mt-6 max-w-none whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                {userGuide.content}
              </div>
            </div>
          </article>
        </div>
      </div>
    )
  }

  if (!article)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-12">
        <div className="max-w-lg mx-auto">
          <EmptyState
            emoji="🔍"
            title={t('articleDetail.notFound')}
            actionTo="/routes"
            actionLabel={t('articleDetail.backToList')}
          />
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <JsonLd data={jsonLd} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} className="print:hidden" />
        <Link
          to="/routes"
          className="text-sky-700 dark:text-sky-300 hover:underline mb-4 min-h-11 inline-flex items-center print:hidden"
        >
          {t('articleDetail.backToList')}
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 print:hidden">
          {t('common.fxDisclaimer')}{' '}
          <span className="text-slate-400 dark:text-slate-500">({t('common.usdToggleLead')})</span>
        </p>

        <div className="mb-4 print:hidden">
          <ShareBar
            articleRef={articleRef}
            shareUrl={shareUrl}
            shareTitle={shareTitle}
            shareText={shareText}
          />
        </div>

        <article
          ref={articleRef}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700 print:shadow-none"
        >
          <OptimizedImage src={article.cover} alt="" w={1200} h={675} q={75} className="w-full aspect-video object-cover" />
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex-1 min-w-0">{article.title}</h1>
              <div className="flex-shrink-0 flex items-center gap-2">
                <ArticleLikeButton articleId={article.id} />
                <FavoriteButton articleId={article.id} className="print:hidden" />
              </div>
            </div>
            {article.featured ? (
              <p className="mt-2 print:hidden">
                <span className="inline-flex rounded-full bg-violet-600 px-2.5 py-0.5 text-xs font-bold text-white">
                  {t('articleDetail.featuredBadge')}
                </span>
              </p>
            ) : null}
            {article.intentVariant ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm dark:border-amber-900/40 dark:bg-amber-950/30 print:hidden">
                <p className="font-semibold text-amber-950 dark:text-amber-100">
                  {t('articleDetail.intentVariantBannerTitle')}
                </p>
                {article.intentSummary ? (
                  <p className="mt-1 text-xs leading-relaxed text-amber-900/90 dark:text-amber-100/90">
                    {article.intentSummary}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-amber-900/80 dark:text-amber-200/80">
                  {t('articleDetail.intentVariantBannerLead')}
                </p>
                {article.guideAnchorId ? (
                  <Link
                    to={`/routes/${article.guideAnchorId}`}
                    className="mt-2 inline-flex min-h-10 items-center text-xs font-semibold text-violet-700 underline underline-offset-2 dark:text-violet-300"
                  >
                    {t('articleDetail.intentVariantAnchorLink')}
                  </Link>
                ) : null}
              </div>
            ) : null}
            {article.city ? (
              <p className="mt-1 text-sm text-violet-800 dark:text-violet-200 print:hidden">
                <Link
                  to={`/routes?destination=${encodeURIComponent(article.city)}`}
                  className="font-semibold underline underline-offset-2"
                >
                  {t('articleDetail.cityLine', { city: article.city, region: article.region || article.destination })}
                </Link>
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2 mt-3 text-slate-500 dark:text-slate-400 text-sm">
              <span>{t('articleDetail.days', { count: article.days })}</span>
              <span>·</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatGuideBudgetLine(article.budget, {
                  showUsdApprox,
                  t,
                  lng: i18n.language,
                })}
              </span>
              <span>·</span>
              <span>{article.author}</span>
              {dest && (
                <>
                  <span>·</span>
                  <Link to={`/routes?destination=${encodeURIComponent(dest.name)}`} className="text-sky-700 dark:text-sky-300 hover:underline">
                    {dest.name}
                  </Link>
                </>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t('governance.lastUpdated', { date: getLastUpdatedDay(article) || '—' })}
            </p>
            <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/25">
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">{t('articleDetail.keyFactsTitle')}</p>
              <dl className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm text-slate-800 dark:text-slate-100">
                <div>
                  <dt className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('articleDetail.keyFactDestLabel')}</dt>
                  <dd className="mt-0.5 font-medium">
                    {dest ? (
                      <Link to={`/routes?destination=${encodeURIComponent(dest.name)}`} className="text-sky-700 dark:text-sky-300 hover:underline">
                        {dest.name}
                      </Link>
                    ) : (
                      <span>{article.destination}</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('articleDetail.keyFactDaysLabel')}</dt>
                  <dd className="mt-0.5 font-medium">{formatInteger(article.days, i18n.language)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('articleDetail.keyFactBudgetLabel')}</dt>
                  <dd className="mt-0.5 font-semibold text-emerald-700 dark:text-emerald-400">
                    {formatGuideBudgetLine(article.budget, {
                      showUsdApprox,
                      t,
                      lng: i18n.language,
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('articleDetail.keyFactDailyLabel')}</dt>
                  <dd className="mt-0.5 font-medium">
                    {article.days > 0
                      ? t('articles.routeCardPerDay', {
                          cny: formatInteger(Math.max(1, Math.round(article.budget / article.days)), i18n.language),
                        })
                      : '—'}
                  </dd>
                </div>
              </dl>
            </div>
            <div
              className="mt-4 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/90 dark:bg-sky-950/35 px-4 py-3"
              role="note"
            >
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {t('articleDetail.landmarkAccuracyNote')}
              </p>
            </div>
            {isPossiblyOutdated(article) && (
              <div
                className="mt-3 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/90 dark:bg-sky-950/35 px-4 py-3"
                role="status"
              >
                <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">{t('governance.possiblyOutdated')}</p>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">{t('governance.outdatedHint')}</p>
              </div>
            )}
            <ArticleMediaSection
              className="mt-6"
              title={article.title}
              gallery={article.gallery}
              videoYoutubeId={routeVideo.videoYoutubeId}
              videoMp4={routeVideo.videoMp4}
            />
            <div className="mt-4 print:hidden">
              <BudgetGuidePanel destinationName={article.destination} destinationId={dest?.id} />
            </div>
            <div className="mt-4 print:hidden flex flex-wrap gap-2">
              <a href="#article-section-map" className="inline-flex min-h-10 items-center rounded-lg border border-sky-300 px-3 py-2 text-xs font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-800 transition">
                {t('articleDetail.quickNavMap')}
              </a>
              <a href="#article-section-plan" className="inline-flex min-h-10 items-center rounded-lg border border-sky-300 px-3 py-2 text-xs font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-800 transition">
                {t('articleDetail.quickNavPlan')}
              </a>
              <a href="#article-section-content" className="inline-flex min-h-10 items-center rounded-lg border border-sky-300 px-3 py-2 text-xs font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-800 transition">
                {t('articleDetail.quickNavBody')}
              </a>
              <a href="#article-section-community" className="inline-flex min-h-10 items-center rounded-lg border border-sky-300 px-3 py-2 text-xs font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-800 transition">
                {t('articleDetail.quickNavQa')}
              </a>
            </div>
            <GuideAmapPanel articleId={article.id} />
            <section id="article-section-plan" className="mt-4 grid gap-3 md:grid-cols-3">
              {routeExecutionCards.map((card) => (
                <article key={card.id} className="rounded-xl border border-sky-100 dark:border-sky-900/50 bg-sky-50/70 dark:bg-sky-950/25 p-3">
                  <h3 className="text-sm font-semibold text-sky-800 dark:text-sky-300">{card.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">{card.body}</p>
                </article>
              ))}
            </section>
            <div className="mt-4 print:hidden rounded-xl border border-violet-200 bg-violet-50/80 p-4 dark:border-violet-900/60 dark:bg-violet-950/30">
              <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">{t('articleDetail.tripCtaTitle')}</p>
              <p className="mt-1 text-xs leading-relaxed text-violet-900/80 dark:text-violet-200/80">{t('articleDetail.tripCtaLead')}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to={buildTripAiHrefFromArticle(article, { autogenerate: true })}
                  className="inline-flex min-h-10 items-center rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 transition"
                >
                  {t('articleDetail.tripCtaGenerate')}
                </Link>
                <Link
                  to={buildTripAiHrefFromArticle(article)}
                  className="inline-flex min-h-10 items-center rounded-lg border border-violet-300 px-3 py-2 text-xs font-semibold text-violet-900 hover:bg-violet-100/80 dark:border-violet-700 dark:text-violet-100 dark:hover:bg-violet-950/50 transition"
                >
                  {t('articleDetail.tripCtaPrefill')}
                </Link>
              </div>
            </div>
            <div className="mt-4 print:hidden rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/80 dark:bg-sky-950/30 p-4">
              <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">{t('articleDetail.qaBlockTitle')}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{t('articleDetail.qaBlockLeadArticle')}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {dest ? (
                  <Link
                    to={`/community/qa?destination=${encodeURIComponent(dest.name)}`}
                    className="inline-flex min-h-10 items-center rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white hover:bg-sky-700 transition"
                  >
                    {t('articleDetail.qaAsk')}
                  </Link>
                ) : null}
                <Link
                  to="/community/qa"
                  className="inline-flex min-h-10 items-center rounded-lg border border-sky-300 px-3 py-2 text-xs font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-800 transition"
                >
                  {t('articleDetail.qaBrowse')}
                </Link>
              </div>
            </div>

            <div id="article-section-content" className="mt-6 max-w-none">
              {detail?.content ? (
                <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:dark:text-slate-100 [&_h2]:mt-6 [&_h2]:mb-2 [&_table]:w-full [&_td]:py-2 [&_th]:text-left">
                  {detail.content.trim().split('\n').map((line, i) => {
                    if (line.startsWith('## '))
                      return (
                        <h2 key={i} className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-6 mb-2">
                          {line.slice(3)}
                        </h2>
                      )
                    if (line.startsWith('- **'))
                      return (
                        <p key={i} className="ml-4">
                          {line.replace(/- \*\*|\*\*/g, '')}
                        </p>
                      )
                    if (line.startsWith('|') && !line.includes('---')) {
                      const cells = line.split('|').filter(Boolean)
                      return (
                        <div
                          key={i}
                          className="flex gap-4 py-1 border-b border-slate-100 dark:border-slate-700"
                        >
                          <span className="flex-1">{cells[0]}</span>
                          <span className="font-semibold">{cells[1]}</span>
                        </div>
                      )
                    }
                    if (line.trim()) return <p key={i} className="mb-2">{line}</p>
                    return null
                  })}
                </div>
              ) : (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/80 px-4 py-5 flex items-start gap-3 text-slate-600 dark:text-slate-300"
                >
                  <span
                    className="inline-block h-5 w-5 shrink-0 rounded-full border-2 border-sky-500 border-t-transparent animate-spin motion-reduce:animate-none"
                    aria-hidden
                  />
                  <p className="text-sm leading-relaxed">{t('articleDetail.loading')}</p>
                </div>
              )}
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-10 print:hidden">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('articleDetail.relatedGuides')}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <Link
                  key={a.id}
                  to={`/routes/${a.id}`}
                  className="block bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden motion-safe:hover:shadow-md motion-safe:transition border border-slate-100 dark:border-slate-700"
                >
                  <OptimizedImage src={a.cover} alt="" w={800} h={450} q={75} loading="lazy" className="w-full aspect-video object-cover" />
                  <div className="p-3">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2">{a.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {a.destination} ·{' '}
                      {formatGuideBudgetLine(a.budget, {
                        showUsdApprox,
                        t,
                        lng: i18n.language,
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 print:hidden">
          <div id="article-section-community" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('userGuide.relatedExperiences')}</h2>
          {relatedUserGuides.length > 0 ? (
            <ul className="space-y-4 mb-6">
              {relatedUserGuides.map((g) => (
                <li key={g.id}>
                  <Link
                    to={`/routes/${g.id}`}
                    className="block bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm motion-safe:hover:shadow-md motion-safe:transition border border-slate-100 dark:border-slate-700"
                  >
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{g.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      {g.destinationName} ·{' '}
                      {formatGuideBudgetLine(g.budget, {
                        showUsdApprox,
                        t,
                        lng: i18n.language,
                      })}{' '}
                      · {g.author} · {formatDate(g.createdAt, i18n.language)}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 line-clamp-2">{g.content}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-600 px-4 py-6 bg-slate-50/80 dark:bg-slate-900/40">
              {t('userGuide.noUserGuidesYet')}
            </p>
          )}
          <UserGuideForm
            initialDestination={article?.destination || ''}
            linkedArticleId={article?.id || null}
            onSuccess={() => setUserGuidesRefresh((n) => n + 1)}
            compact
          />
        </section>

        <CommentSection
          articleId={article.id}
          discussionUrl={import.meta.env.VITE_GITHUB_DISCUSSIONS_URL || ''}
        />
      </div>
    </div>
  )
}
