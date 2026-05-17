import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../components/Breadcrumbs'
import CopyPageLinkButton from '../components/CopyPageLinkButton'
import { getAllQuestions } from '../data/qaStore'
import { getAllBuddyPosts } from '../data/buddiesStore'

const BOARD_STORAGE_POSTS = 'budget-travel-board-posts'

const CARDS = [
  { to: '/community/qa', key: 'qa', icon: '💬', descKey: 'community.qaDesc', ctaKey: 'community.cardCtaQa' },
  { to: '/community/buddies', key: 'buddies', icon: '🤝', descKey: 'community.buddiesDesc', ctaKey: 'community.cardCtaBuddies' },
  { to: '/board', key: 'board', icon: '📋', descKey: 'community.boardDesc', ctaKey: 'community.cardCtaBoard' },
]

function getBoardPostsCount() {
  try {
    const raw = localStorage.getItem(BOARD_STORAGE_POSTS)
    if (!raw) return 0
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list.length : 0
  } catch {
    return 0
  }
}

export default function Community() {
  const { t } = useTranslation()
  const [counts, setCounts] = useState({ qa: 0, buddies: 0, board: 0 })

  const refreshCounts = useCallback(() => {
    setCounts({
      qa: getAllQuestions().length,
      buddies: getAllBuddyPosts().length,
      board: getBoardPostsCount(),
    })
  }, [])

  useEffect(() => {
    refreshCounts()
    const onStorage = () => refreshCounts()
    const onFocus = () => refreshCounts()
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
    }
  }, [refreshCounts])

  const breadcrumbs = [
    { label: t('common.navMap'), to: '/map' },
    { label: t('community.title') },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Breadcrumbs items={breadcrumbs} />
          <CopyPageLinkButton />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            {t('community.heroTitle')}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-2">
            {t('community.heroSubtitle')}
          </p>
          <p className="text-slate-500 text-sm">
            {t('community.belonging')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map(({ to, key, icon, descKey, ctaKey }) => (
            <Link
              key={key}
              to={to}
              className="group block bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm motion-safe:hover:shadow-lg motion-safe:transition border border-slate-100 dark:border-slate-700"
            >
              <span className="text-4xl mb-3 block" aria-hidden>{icon}</span>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition mb-2">
                {t(`community.${key}`)}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {t(descKey)}
              </p>
              <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                {t('community.liveCountLine', { count: counts[key] || 0 })}
              </p>
              <span className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white group-hover:bg-sky-700 transition">
                {t(ctaKey)}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-sky-100 bg-sky-50/80 p-6 text-center">
          <p className="text-slate-700 font-medium">
            {t('community.oneFamily')}
          </p>
          <p className="text-slate-600 text-sm mt-1">
            {t('community.localHint')}
          </p>
        </div>
      </div>
    </div>
  )
}
