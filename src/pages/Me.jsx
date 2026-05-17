import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../contexts/ToastContext'
import { useUsdApproxDisplay } from '../contexts/UsdApproxPreferenceContext'
import { useMinimalUi } from '../contexts/MinimalUiContext'
import { articles } from '../data/mockData'
import { clearRecentPaths, loadRecentPaths, RECENT_PATHS_KEY } from '../lib/recentPaths.js'
import { TRIP_DRAFTS_CHANGED_EVENT, notifyTripDraftsChanged } from '../lib/tripDraftsBridge.js'

const TRIP_DRAFTS_KEY = 'roamwise:trip-ai-drafts'

function loadTripDrafts() {
  try {
    const raw = localStorage.getItem(TRIP_DRAFTS_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function persistTripDrafts(next) {
  localStorage.setItem(TRIP_DRAFTS_KEY, JSON.stringify(next.slice(0, 25)))
  notifyTripDraftsChanged()
}

function deleteTripDraftById(id) {
  const next = loadTripDrafts().filter((x) => x.id !== id)
  persistTripDrafts(next)
}

/**
 * 模块 6：用户中心 — 我的行程草稿、收藏与社区入口、离线说明、历史占位与跳转编辑。
 */
export default function Me() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { showUsdApprox, toggleUsdApprox } = useUsdApproxDisplay()
  const { minimal, setMinimal } = useMinimalUi()
  const { favoriteIds } = useFavorites()
  const [tab, setTab] = useState('overview')
  const [draftTick, setDraftTick] = useState(0)
  const [recentTick, setRecentTick] = useState(0)
  const drafts = useMemo(() => loadTripDrafts(), [draftTick])
  const recentPaths = useMemo(() => (tab === 'history' ? loadRecentPaths() : []), [tab, recentTick])

  const favoritePreview = useMemo(() => {
    const set = new Set(favoriteIds)
    return articles.filter((a) => set.has(a.id)).slice(0, 5)
  }, [favoriteIds])

  const refreshDrafts = useCallback(() => setDraftTick((n) => n + 1), [])
  const bumpLocalViews = useCallback(() => {
    setDraftTick((n) => n + 1)
    setRecentTick((n) => n + 1)
  }, [])

  useEffect(() => {
    const onTripDraftsChanged = () => refreshDrafts()
    window.addEventListener(TRIP_DRAFTS_CHANGED_EVENT, onTripDraftsChanged)
    return () => window.removeEventListener(TRIP_DRAFTS_CHANGED_EVENT, onTripDraftsChanged)
  }, [refreshDrafts])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === TRIP_DRAFTS_KEY) refreshDrafts()
      if (e.key === RECENT_PATHS_KEY) setRecentTick((n) => n + 1)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refreshDrafts])

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') bumpLocalViews()
    }
    const onPageShow = (e) => {
      if (e.persisted) bumpLocalViews()
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pageshow', onPageShow)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [bumpLocalViews])

  const tabs = useMemo(
    () =>
      [
        { id: 'overview', labelKey: 'me.tabOverview' },
        { id: 'trips', labelKey: 'me.tabTrips' },
        { id: 'collections', labelKey: 'me.tabCollections' },
        { id: 'offline', labelKey: 'me.tabOffline' },
        { id: 'history', labelKey: 'me.tabHistory' },
      ].map((x) => ({ ...x, label: t(x.labelKey) })),
    [t],
  )

  const formatAt = useCallback(
    (iso) => {
      if (!iso) return ''
      try {
        return new Date(iso).toLocaleString('zh-CN', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      } catch {
        return String(iso).slice(0, 16)
      }
    },
    [],
  )

  const copyDraftJson = async (d) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(d, null, 2))
      toast(t('me.tripsCopyJsonOk'))
    } catch {
      toast(t('me.tripsCopyJsonFail'))
    }
  }

  const onDeleteDraft = (id) => {
    if (!window.confirm(t('me.tripsDeleteConfirm'))) return
    deleteTripDraftById(id)
    refreshDrafts()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">{t('common.navMe')}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">{t('me.lead')}</p>

      <div
        className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-2 dark:border-slate-700"
        role="tablist"
        aria-label={t('me.tabsAriaLabel')}
      >
        {tabs.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={tab === x.id}
            id={`me-tab-${x.id}`}
            onClick={() => setTab(x.id)}
            className={`min-h-9 rounded-full px-3 text-sm font-semibold ${
              tab === x.id ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      {tab === 'overview' ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:col-span-2 dark:border-slate-700 dark:bg-slate-800/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('minimalUi.meTitle')}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('minimalUi.meLead')}</p>
              </div>
              <button
                type="button"
                onClick={() => setMinimal(!minimal)}
                aria-pressed={minimal}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
                  minimal
                    ? 'bg-sky-600 text-white dark:bg-sky-600'
                    : 'border border-slate-200 text-slate-700 hover:bg-white dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {minimal ? t('minimalUi.meToggleToOff') : t('minimalUi.meToggleToOn')}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">{t('minimalUi.bookmarkHint')}</p>
          </div>
          <Link
            to="/trip-ai"
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('me.cardTripAiTitle')}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('me.cardTripAiDesc')}</p>
          </Link>
          <Link
            to="/map-hub"
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('me.cardMapHubTitle')}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('me.cardMapHubDesc')}</p>
          </Link>
          <Link
            to="/favorites"
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('me.cardFavoritesTitle')}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('me.favoritesHint')}</p>
          </Link>
          <Link
            to="/steward"
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('me.cardStewardTitle')}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('me.cardStewardDesc')}</p>
          </Link>
          <Link
            to="/china-readiness"
            className="rounded-xl border border-sky-200 bg-sky-50/80 p-4 transition hover:border-sky-400 dark:border-sky-800 dark:bg-sky-950/40"
          >
            <h2 className="font-semibold text-sky-900 dark:text-sky-100">{t('me.cardChinaReadinessTitle')}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('me.cardChinaReadinessDesc')}</p>
          </Link>
          <Link
            to="/community"
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-400 sm:col-span-2 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('common.navCommunity')}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('me.communityHubHint')}</p>
          </Link>
          <div className="flex flex-col justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:col-span-2 dark:border-slate-700 dark:bg-slate-800/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-300">{t('common.usdToggleLead')}</span>
              <button
                type="button"
                onClick={toggleUsdApprox}
                aria-pressed={showUsdApprox}
                aria-label={t('a11y.usdApproxToggle')}
                title={t('common.fxDisclaimer')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  showUsdApprox
                    ? 'bg-emerald-600 text-white dark:bg-emerald-600'
                    : 'border border-slate-200 text-slate-700 hover:bg-white dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {showUsdApprox ? t('common.usdToggleOn') : t('common.usdToggleOff')}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500">{t('common.fxDisclaimer')}</p>
          </div>
        </div>
      ) : null}

      {tab === 'trips' ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('me.tripsTitle')}</h2>
            <button type="button" onClick={refreshDrafts} className="text-xs font-medium text-sky-700 dark:text-sky-300">
              {t('me.tripsRefresh')}
            </button>
          </div>
          {drafts.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">{t('me.tripsEmpty')}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {drafts.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-stretch gap-2 rounded-xl border border-slate-100 p-2 dark:border-slate-700"
                >
                  <Link
                    to={`/trip-ai?draft=${encodeURIComponent(d.id)}`}
                    className="min-w-0 flex-1 rounded-lg px-2 py-1 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-100">{d.title || t('me.tripDraftUntitled')}</span>
                    <span className="mt-1 block text-xs text-slate-500">{d.createdAt?.slice(0, 19) || ''}</span>
                  </Link>
                  <div className="flex shrink-0 flex-col gap-1 sm:flex-row sm:items-center">
                    <Link
                      to={`/advisor?q=${encodeURIComponent(
                        t('me.draftAdvisorQuestion', { title: d.title || t('me.tripDraftUntitled') }),
                      )}`}
                      className="rounded-lg border border-emerald-200 px-2 py-1 text-center text-xs font-medium text-emerald-800 dark:border-emerald-900/50 dark:text-emerald-200"
                    >
                      {t('me.tripsAskAdvisor')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => void copyDraftJson(d)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
                    >
                      {t('me.tripsCopyJson')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteDraft(d.id)}
                      className="rounded-lg border border-rose-200 px-2 py-1 text-xs font-medium text-rose-800 dark:border-rose-900/60 dark:text-rose-200"
                    >
                      {t('me.tripsDelete')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {tab === 'collections' ? (
        <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>{t('me.collectionsIntro')}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/favorites"
              className="inline-flex min-h-9 items-center rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white"
            >
              {t('me.collectionsFavoritesCta', { count: favoriteIds.length })}
            </Link>
            <Link
              to="/map-hub"
              className="inline-flex min-h-9 items-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100"
            >
              {t('me.collectionsMapCta')}
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('me.favoritesPreviewTitle')}</h3>
            {favoritePreview.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">{t('me.favoritesPreviewEmpty')}</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {favoritePreview.map((a) => (
                  <li key={a.id}>
                    <Link to={`/routes/${a.id}`} className="text-sky-700 hover:underline dark:text-sky-300">
                      {a.title}
                    </Link>
                    <span className="ml-2 text-xs text-slate-500">{a.destination}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}

      {tab === 'offline' ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200">
          <p>{t('me.offlineBody')}</p>
        </div>
      ) : null}

      {tab === 'history' ? (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">{t('me.historyBody')}</p>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('me.recentPathsTitle')}</h2>
              {recentPaths.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    clearRecentPaths()
                    setRecentTick((n) => n + 1)
                  }}
                  className="text-xs font-medium text-slate-600 underline decoration-slate-400 hover:text-sky-700 dark:text-slate-400 dark:hover:text-sky-300"
                >
                  {t('me.recentPathsClear')}
                </button>
              ) : null}
            </div>
            {recentPaths.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">{t('me.recentPathsEmpty')}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {recentPaths.map((row) => (
                  <li key={`${row.path}-${row.at}`}>
                    <Link
                      to={row.path}
                      className="block rounded-xl border border-slate-100 px-3 py-2 text-sm hover:border-sky-300 dark:border-slate-700 dark:hover:border-sky-600"
                      title={row.path}
                    >
                      <span className="font-mono text-[13px] text-slate-800 dark:text-slate-100">{row.path}</span>
                      <span className="mt-1 block text-xs text-slate-500">{formatAt(row.at)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
