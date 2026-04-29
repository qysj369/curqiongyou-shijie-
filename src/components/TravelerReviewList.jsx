import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import StarRatingDisplay from './StarRatingDisplay'
import ReviewHelpfulButton, { STORAGE_PREFIX } from './ReviewHelpfulButton'

function parseReviewDate(d) {
  if (!d || typeof d !== 'string') return ''
  if (/^\d{4}-\d{2}$/.test(d)) return `${d}-01`
  return d
}

function loadVotedIdsFromStorage(reviewIds) {
  const next = new Set()
  for (const id of reviewIds) {
    try {
      if (sessionStorage.getItem(`${STORAGE_PREFIX}${id}`)) next.add(id)
    } catch {
      /* ignore */
    }
  }
  return next
}

/**
 * 精选口碑（排序 + 「有用」与「最有用」实时联动，sessionStorage 记住已投）
 */
export default function TravelerReviewList({ reviews = [], destinationName = '', className = '' }) {
  const { t } = useTranslation()
  const list = Array.isArray(reviews) ? reviews : []
  const [sortBy, setSortBy] = useState('helpful')
  const [votedIds, setVotedIds] = useState(() => new Set())

  const reviewIds = useMemo(() => list.map((r) => r.id).filter(Boolean), [list])

  useEffect(() => {
    setVotedIds(loadVotedIdsFromStorage(reviewIds))
  }, [reviewIds])

  const helpfulTotal = useCallback(
    (r) => (Number(r.helpfulCount) || 0) + (votedIds.has(r.id) ? 1 : 0),
    [votedIds],
  )

  const handleVote = useCallback((reviewId) => {
    if (!reviewId || votedIds.has(reviewId)) return
    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}${reviewId}`, '1')
    } catch {
      /* ignore */
    }
    setVotedIds((prev) => {
      if (prev.has(reviewId)) return prev
      const next = new Set(prev)
      next.add(reviewId)
      return next
    })
  }, [votedIds])

  const sorted = useMemo(() => {
    const copy = [...list]
    if (sortBy === 'newest') {
      return copy.sort((a, b) => parseReviewDate(b.date).localeCompare(parseReviewDate(a.date)))
    }
    return copy.sort((a, b) => helpfulTotal(b) - helpfulTotal(a))
  }, [list, sortBy, helpfulTotal])

  if (list.length === 0) return null

  return (
    <section className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('travelerVoice.reviewsTitle')}</h2>
        <Link
          to="/board"
          className="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline min-h-11 inline-flex items-center"
        >
          {t('travelerVoice.writeReview')} →
        </Link>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t('travelerVoice.sortHint')}</p>
      {sortBy === 'helpful' && (
        <p className="text-xs text-emerald-700/90 dark:text-emerald-400/95 mb-3 font-medium">{t('travelerVoice.sortLiveHint')}</p>
      )}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setSortBy('helpful')}
          className={`px-3 py-2 min-h-9 rounded-lg text-sm font-medium transition ${
            sortBy === 'helpful'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-emerald-400'
          }`}
        >
          {t('travelerVoice.sortHelpful')}
        </button>
        <button
          type="button"
          onClick={() => setSortBy('newest')}
          className={`px-3 py-2 min-h-9 rounded-lg text-sm font-medium transition ${
            sortBy === 'newest'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-emerald-400'
          }`}
        >
          {t('travelerVoice.sortNewest')}
        </button>
      </div>
      <ul className="space-y-4">
        {sorted.map((r) => (
          <li
            key={r.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 md:p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <StarRatingDisplay value={r.rating} showCount={false} size="sm" />
              <span className="font-semibold text-slate-800 dark:text-slate-100">{r.author}</span>
              <span className="text-slate-400 text-sm">{r.date}</span>
              {sortBy === 'helpful' && helpfulTotal(r) >= 20 && (
                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200 border border-sky-200/80 dark:border-sky-800">
                  {t('travelerVoice.hotReview')}
                </span>
              )}
              {r.tripType && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
                  {r.tripType}
                </span>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{r.text}</p>
            <ReviewHelpfulButton
              count={helpfulTotal(r)}
              voted={votedIds.has(r.id)}
              onVote={handleVote}
              reviewId={r.id}
            />
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">{t('travelerVoice.reviewsDisclaimer', { name: destinationName })}</p>
    </section>
  )
}
