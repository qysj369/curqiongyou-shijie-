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
import ArticleMediaSection from '../components/ArticleMediaSection'
import EmptyState from '../components/EmptyState'
import { useSeoOverride } from '../contexts/SeoOverrideContext'
import { excerptForMeta } from '../utils/seoExcerpt'
import { getLastUpdatedDay, isPossiblyOutdated } from '../utils/articleTimeliness'

export default function ArticleDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const { setOverride, clear } = useSeoOverride()
  const articleRef = useRef(null)
  const [userGuidesRefresh, setUserGuidesRefresh] = useState(0)
  const [detail, setDetail] = useState(null)

  const isUserGuide = id && id.startsWith('ug-')
  const userGuide = isUserGuide ? getUserGuideById(id) : null
  const article = isUserGuide ? null : articles.find(a => a.id === id)
  const dest = article ? destinations.find(d => d.name === article.destination) : (userGuide ? destinations.find(d => d.name === userGuide.destinationName) : null)

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
  const shareText = article ? `${article.title} · ${article.destination} ¥${article.budget}` : (userGuide ? `${userGuide.title} · ${userGuide.destinationName} ¥${userGuide.budget}` : '')

  useEffect(() => {
    if (article) {
      const raw = detail?.content || ''
      const desc = excerptForMeta(raw, { stripMarkdown: true }) || t('seo.description')
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
  }, [article, userGuide, detail, t, setOverride, clear])

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
        { label: t('common.home'), to: '/' },
        { label: t('common.articles'), to: '/articles' },
        { label: article.title },
      ]
    : userGuide
      ? [
          { label: t('common.home'), to: '/' },
          { label: t('common.articles'), to: '/articles' },
          { label: userGuide.title },
        ]
      : []

  const jsonLd = useMemo(() => {
    if ((!article && !userGuide) || typeof window === 'undefined') return null
    const headline = article?.title || userGuide?.title
    const desc = (detail?.content || userGuide?.content || '').slice(0, 200)
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
      author: { '@type': 'Person', name: authorName },
      url: window.location.href,
    }
  }, [article, userGuide, detail])

  if (isUserGuide && !userGuide)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-12">
        <div className="max-w-lg mx-auto">
          <EmptyState
            emoji="🔍"
            title={t('articleDetail.notFound')}
            actionTo="/articles"
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
            to="/articles"
            className="text-amber-600 dark:text-amber-400 hover:underline mb-4 min-h-11 inline-flex items-center print:hidden"
          >
            {t('articleDetail.backToList')}
          </Link>
          <div className="mb-4 print:hidden">
            <ShareBar articleRef={articleRef} shareUrl={shareUrl} shareTitle={shareTitle} shareText={shareText} />
          </div>
          <article
            ref={articleRef}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700 print:shadow-none"
          >
            <OptimizedImage src={userGuideDefaultCover} alt="" w={1200} h={675} q={75} className="w-full aspect-video object-cover" />
            <div className="p-6 md:p-8">
              <span className="inline-block px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-medium mb-2">
                {t('userGuide.userBadge')}
              </span>
              {userGuide.status === 'pending' && (
                <div
                  className="mb-4 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-sm"
                  role="status"
                >
                  <p className="font-semibold text-amber-900 dark:text-amber-200 flex flex-wrap items-center gap-2">
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
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">¥{userGuide.budget}</span>
                  </>
                )}
                <span>·</span>
                <span>{userGuide.author}</span>
                {dest && (
                  <>
                    <span>·</span>
                    <Link to={`/destinations/${dest.id}`} className="text-teal-600 dark:text-teal-400 hover:underline">
                      {dest.name}
                    </Link>
                  </>
                )}
                <span>·</span>
                <span>{userGuide.createdAt.slice(0, 10)}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {t('governance.lastUpdated', {
                  date: getLastUpdatedDay({ date: userGuide.createdAt.slice(0, 10) }) || '—',
                })}
              </p>
              {isPossiblyOutdated({ date: userGuide.createdAt.slice(0, 10) }) && (
                <div
                  className="mt-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/90 dark:bg-amber-950/35 px-4 py-3"
                  role="status"
                >
                  <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">{t('governance.possiblyOutdated')}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">{t('governance.outdatedHint')}</p>
                </div>
              )}
              <div className="mt-4 print:hidden">
                <BudgetGuidePanel destinationName={userGuide.destinationName} />
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
            actionTo="/articles"
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
          to="/articles"
          className="text-amber-600 dark:text-amber-400 hover:underline mb-4 min-h-11 inline-flex items-center print:hidden"
        >
          {t('articleDetail.backToList')}
        </Link>

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
            <div className="flex flex-wrap gap-2 mt-3 text-slate-500 dark:text-slate-400 text-sm">
              <span>{t('articleDetail.days', { count: article.days })}</span>
              <span>·</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">¥{article.budget}</span>
              <span>·</span>
              <span>{article.author}</span>
              {dest && (
                <>
                  <span>·</span>
                  <Link to={`/destinations/${dest.id}`} className="text-teal-600 dark:text-teal-400 hover:underline">
                    {dest.name}
                  </Link>
                </>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t('governance.lastUpdated', { date: getLastUpdatedDay(article) || '—' })}
            </p>
            {isPossiblyOutdated(article) && (
              <div
                className="mt-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/90 dark:bg-amber-950/35 px-4 py-3"
                role="status"
              >
                <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">{t('governance.possiblyOutdated')}</p>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">{t('governance.outdatedHint')}</p>
              </div>
            )}
            <ArticleMediaSection
              className="mt-6"
              title={article.title}
              gallery={article.gallery}
              videoYoutubeId={article.videoYoutubeId}
              videoMp4={article.videoMp4}
            />
            <div className="mt-4 print:hidden">
              <BudgetGuidePanel destinationName={article.destination} destinationId={dest?.id} />
            </div>

            <div className="mt-6 max-w-none">
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
                    className="inline-block h-5 w-5 shrink-0 border-2 border-amber-500 border-t-transparent rounded-full animate-spin motion-reduce:animate-none"
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
                  to={`/articles/${a.id}`}
                  className="block bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition border border-slate-100 dark:border-slate-700"
                >
                  <OptimizedImage src={a.cover} alt="" w={800} h={450} q={75} loading="lazy" className="w-full aspect-video object-cover" />
                  <div className="p-3">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2">{a.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {a.destination} · ¥{a.budget}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 print:hidden">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('userGuide.relatedExperiences')}</h2>
          {relatedUserGuides.length > 0 ? (
            <ul className="space-y-4 mb-6">
              {relatedUserGuides.map((g) => (
                <li key={g.id}>
                  <Link
                    to={`/articles/${g.id}`}
                    className="block bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm hover:shadow-md transition border border-slate-100 dark:border-slate-700"
                  >
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{g.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      {g.destinationName} · ¥{g.budget} · {g.author} · {g.createdAt.slice(0, 10)}
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
