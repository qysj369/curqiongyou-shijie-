import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  generateItinerarySpec,
  isItineraryBundle,
  wrapLegacySpecAsBundle,
} from '../services/aiItinerary'
import { enrichTripBundleWithGuideLibrary } from '../services/itineraryGuideBridge.js'
import ItineraryAmapPreview from '../components/itinerary/ItineraryAmapPreview'
import TripItineraryReadView from '../components/trip/TripItineraryReadView.jsx'
import { notifyTripDraftsChanged, TRIP_DRAFTS_CHANGED_EVENT } from '../lib/tripDraftsBridge.js'
import { useToast } from '../contexts/ToastContext'
import { pickRandomChinaTripDefaults } from '../data/chinaTripDefaultCities.js'
import { formatItineraryBundleMarkdown } from '../utils/tripItineraryText.js'
import { findEditorArticleById } from '../utils/tripGuideBridge.js'
import { articles } from '../data/mockData.js'
import {
  buildCommunityBuddiesHref,
  buildCommunityQaHref,
  buildTripCommunityBuddiesPrefill,
  buildTripCommunityQaPrefill,
} from '../utils/tripCommunityBridge.js'

const TRIP_QUICK_START = [
  { destination: '成都', days: 5, budget: 4500, departCity: '重庆', pace: 'balanced' },
  { destination: '厦门', days: 4, budget: 3800, departCity: '福州', pace: 'relaxed' },
  { destination: '西安', days: 4, budget: 3200, departCity: '郑州', pace: 'balanced' },
  { destination: '昆明', days: 6, budget: 5200, departCity: '贵阳', pace: 'relaxed' },
]

const DRAFTS_KEY = 'roamwise:trip-ai-drafts'

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function loadDrafts() {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function saveDraft(entry) {
  const arr = loadDrafts()
  arr.unshift(entry)
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(arr.slice(0, 25)))
  notifyTripDraftsChanged()
}

function deleteDraftById(id) {
  const next = loadDrafts().filter((x) => x.id !== id)
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(next))
  notifyTripDraftsChanged()
}

function firstPoiUri(spec) {
  const d0 = spec?.days?.[0]
  const p0 = d0?.pois?.[0]
  if (!p0 || !Number.isFinite(Number(p0.lng))) return null
  const name = encodeURIComponent(p0.name || 'POI')
  return `https://uri.amap.com/marker?position=${p0.lng},${p0.lat}&name=${name}`
}

function normalizeDraftSpec(raw) {
  if (!raw || typeof raw !== 'object') return null
  if (isItineraryBundle(raw)) return raw
  if (Array.isArray(raw.days) && raw.days.length) return wrapLegacySpecAsBundle(raw)
  return null
}

/**
 * 模块 1：AI 一键穷游行程（表单 → 结构化 JSON → 分日 POI / 交通 / 预算替换 → 地图预览 → 高德接力；支持迭代指令）。
 */
export default function TripAiPage() {
  const { t, i18n } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const lastDirectiveRef = useRef('')
  const chinaTripSeedRef = useRef(null)
  if (chinaTripSeedRef.current === null) {
    chinaTripSeedRef.current = pickRandomChinaTripDefaults()
  }
  const [destination, setDestination] = useState(() => chinaTripSeedRef.current.destination)
  const [days, setDays] = useState(5)
  const [budget, setBudget] = useState(4500)
  const [departCity, setDepartCity] = useState(() => chinaTripSeedRef.current.departCity)
  const [pace, setPace] = useState('balanced')
  const [notes, setNotes] = useState('')
  const [tweak, setTweak] = useState('')
  const [bundle, setBundle] = useState(null)
  const [activeLeg, setActiveLeg] = useState('primary')
  const [meta, setMeta] = useState({ mock: false, loading: false, err: '' })
  const [loadedDraftId, setLoadedDraftId] = useState(null)
  const [draftsTick, setDraftsTick] = useState(0)
  const [viewMode, setViewMode] = useState('read')
  const [sourceArticle, setSourceArticle] = useState(null)

  useEffect(() => {
    const onDrafts = () => setDraftsTick((n) => n + 1)
    window.addEventListener(TRIP_DRAFTS_CHANGED_EVENT, onDrafts)
    return () => window.removeEventListener(TRIP_DRAFTS_CHANGED_EVENT, onDrafts)
  }, [])

  const recentDrafts = useMemo(() => loadDrafts().slice(0, 5), [draftsTick])

  const form = useMemo(
    () => ({
      destination,
      days,
      budget,
      departCity,
      pace,
      notes,
    }),
    [destination, days, budget, departCity, pace, notes],
  )

  const runGenerate = useCallback(
    async (directive = '', formOverrides = {}) => {
      lastDirectiveRef.current = directive
      const mergedForm = { ...form, ...formOverrides }
      setMeta((m) => ({ ...m, loading: true, err: '' }))
      try {
        const res = await generateItinerarySpec(mergedForm, directive)
        const destName = res.bundle?.primary?.destination || mergedForm.destination
        const { bundle: merged } = enrichTripBundleWithGuideLibrary(res.bundle, destName)
        setBundle(merged)
        setActiveLeg('primary')
        setMeta({ mock: Boolean(res.mock), loading: false, err: '' })
        const title =
          merged?.primary?.title ||
          t('tripAiPage.defaultDraftTitle', { city: mergedForm.destination })
        const entry = {
          id: uid(),
          title,
          createdAt: new Date().toISOString(),
          spec: merged,
        }
        saveDraft(entry)
        navigate(`/trip-ai?draft=${encodeURIComponent(entry.id)}`, { replace: true })
      } catch (e) {
        setMeta((m) => ({ ...m, loading: false, err: e?.message || String(e) }))
      }
    },
    [form, destination, t, navigate],
  )

  useEffect(() => {
    const draftId = searchParams.get('draft')
    if (!draftId) {
      setLoadedDraftId(null)
      return
    }
    const list = loadDrafts()
    const hit = list.find((x) => x.id === draftId)
    if (hit?.spec) {
      const normalized = normalizeDraftSpec(hit.spec)
      if (!normalized) {
        setLoadedDraftId(null)
        setBundle(null)
        return
      }
      const destName = normalized.primary?.destination || ''
      const { bundle: merged } = enrichTripBundleWithGuideLibrary(normalized, destName)
      setBundle(merged)
      setActiveLeg('primary')
      if (merged.primary?.destination) setDestination(String(merged.primary.destination))
      setLoadedDraftId(draftId)
    } else {
      setLoadedDraftId(null)
      setBundle(null)
    }
  }, [searchParams])

  /** 无 draft 时：?destination=&days=&budget=&depart=&pace=&notes= 预填表单，随后从 URL 移除以免分享脏链 */
  useEffect(() => {
    if (searchParams.get('draft')) return
    const dest = searchParams.get('destination')
    const daysP = searchParams.get('days')
    const budgetP = searchParams.get('budget')
    const departP = searchParams.get('depart')
    const paceP = searchParams.get('pace')
    const notesP = searchParams.get('notes')
    const articleIdP = searchParams.get('articleId')
    if (!dest && !daysP && !budgetP && !departP && !paceP && !notesP && !articleIdP) return

    if (articleIdP) {
      const fromArticle = findEditorArticleById(articleIdP)
      if (fromArticle) {
        setSourceArticle(fromArticle)
        if (!dest) setDestination(fromArticle.destination || destination)
        if (!daysP && fromArticle.days) setDays(Number(fromArticle.days) || days)
        if (!budgetP && fromArticle.budget) setBudget(Number(fromArticle.budget) || budget)
      }
    }

    if (dest) {
      try {
        setDestination(decodeURIComponent(dest))
      } catch {
        setDestination(dest)
      }
    }
    if (daysP) {
      const n = parseInt(daysP, 10)
      if (Number.isFinite(n) && n > 0 && n <= 90) setDays(n)
    }
    if (budgetP) {
      const n = parseInt(budgetP, 10)
      if (Number.isFinite(n) && n > 0) setBudget(n)
    }
    if (departP) {
      try {
        setDepartCity(decodeURIComponent(departP))
      } catch {
        setDepartCity(departP)
      }
    }
    if (paceP && ['relaxed', 'balanced', 'intense'].includes(paceP)) setPace(paceP)
    if (notesP) {
      try {
        setNotes(decodeURIComponent(notesP))
      } catch {
        setNotes(notesP)
      }
    }

    const next = new URLSearchParams(searchParams)
    ;['destination', 'days', 'budget', 'depart', 'pace', 'notes', 'articleId'].forEach((k) => next.delete(k))
    const qs = next.toString()
    navigate(qs ? `/trip-ai?${qs}` : '/trip-ai', { replace: true })
  }, [searchParams, navigate])

  const autoGenOnceRef = useRef(false)
  useEffect(() => {
    if (searchParams.get('draft')) return
    if (searchParams.get('autogenerate') !== '1') return
    if (autoGenOnceRef.current) return
    const dParam = searchParams.get('destination')
    let fromUrl = ''
    if (dParam) {
      try {
        fromUrl = decodeURIComponent(dParam)
      } catch {
        fromUrl = dParam
      }
    }
    const effectiveDest = (fromUrl || destination).trim()
    if (!effectiveDest) return
    autoGenOnceRef.current = true
    const overrides = fromUrl ? { destination: fromUrl } : {}
    void runGenerate('', overrides)
  }, [searchParams, destination, runGenerate])

  const activeSpec = useMemo(() => {
    if (!bundle) return null
    return activeLeg === 'alternate' ? bundle.alternate : bundle.primary
  }, [bundle, activeLeg])

  const navUri = firstPoiUri(activeSpec)

  const advisorPrefillHref = useMemo(() => {
    if (!activeSpec) return null
    const dest = activeSpec.destination || destination
    const dayCount = activeSpec.days?.length || days
    const totalB = activeSpec.totalBudget ?? budget
    const q = t('tripAiPage.advisorPrefillMsg', {
      destination: dest,
      days: dayCount,
      budget: totalB,
      title: activeSpec.title || '',
    })
    return `/advisor?q=${encodeURIComponent(q)}`
  }, [activeSpec, destination, days, budget, t])

  const communityBrowseHref = useMemo(() => {
    if (!activeSpec) return null
    const dest = activeSpec.destination || destination
    if (!dest) return '/community/qa'
    return buildCommunityQaHref({ destination: dest })
  }, [activeSpec, destination])

  const communityAskHref = useMemo(() => {
    if (!activeSpec) return null
    return buildCommunityQaHref(buildTripCommunityQaPrefill(activeSpec, t))
  }, [activeSpec, t])

  const buddiesBrowseHref = useMemo(() => {
    if (!activeSpec) return null
    const dest = activeSpec.destination || destination
    if (!dest) return '/community/buddies'
    return buildCommunityBuddiesHref({ destination: dest })
  }, [activeSpec, destination])

  const buddiesPostHref = useMemo(() => {
    if (!activeSpec) return null
    return buildCommunityBuddiesHref(buildTripCommunityBuddiesPrefill(activeSpec, t))
  }, [activeSpec, t])

  const relatedGuides = useMemo(() => {
    if (!activeSpec) return []
    const dest = activeSpec.destination || destination
    if (!dest) return []
    return articles
      .filter((a) => a.destination === dest && a.id !== sourceArticle?.id)
      .slice(0, 3)
  }, [activeSpec, destination, sourceArticle?.id])

  const syncToSteward = () => {
    if (!activeSpec) return
    const total = Math.round(Number(activeSpec.totalBudget) || 0)
    const a = Math.round(total * 0.28)
    const b = Math.round(total * 0.35)
    const c = Math.round(total * 0.22)
    const d = Math.round(total * 0.1)
    const sum = a + b + c + d
    const lines = [
      { id: 't', labelKey: 'stewardPage.lineTransport', amount: a },
      { id: 's', labelKey: 'stewardPage.lineStay', amount: b },
      { id: 'f', labelKey: 'stewardPage.lineFood', amount: c },
      { id: 'tk', labelKey: 'stewardPage.lineTickets', amount: d },
      { id: 'o', labelKey: 'stewardPage.lineBuffer', amount: Math.max(0, total - sum) },
    ]
    try {
      sessionStorage.setItem('roamwise:steward-prefill', JSON.stringify({ lines, total, title: activeSpec.title }))
    } catch {
      /* noop */
    }
    navigate('/steward')
  }

  const copyItineraryJson = async () => {
    if (!bundle) return
    const text = JSON.stringify(bundle, null, 2)
    try {
      await navigator.clipboard.writeText(text)
      toast(t('tripAiPage.copyJsonOk'))
    } catch {
      toast(t('tripAiPage.copyJsonFail'))
    }
  }

  const copyItineraryMarkdown = async () => {
    if (!bundle) return
    const text = formatItineraryBundleMarkdown(bundle)
    try {
      await navigator.clipboard.writeText(text)
      toast(t('tripAiPage.copyMarkdownOk'))
    } catch {
      toast(t('tripAiPage.copyMarkdownFail'))
    }
  }

  const downloadItineraryMarkdown = () => {
    if (!bundle || !activeSpec) return
    const text = formatItineraryBundleMarkdown(bundle)
    const slug = (activeSpec.destination || 'trip').replace(/\s+/g, '-').slice(0, 24)
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roamwise-${slug}-${activeSpec.days?.length || 0}d.md`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    toast(t('tripAiPage.downloadMarkdownOk'))
  }

  const applyQuickStart = (preset) => {
    setDestination(preset.destination)
    setDays(preset.days)
    setBudget(preset.budget)
    setDepartCity(preset.departCity)
    setPace(preset.pace)
    void runGenerate('', {
      destination: preset.destination,
      days: preset.days,
      budget: preset.budget,
      departCity: preset.departCity,
      pace: preset.pace,
    })
  }

  const onDeleteLoadedDraft = () => {
    if (!loadedDraftId) return
    if (!window.confirm(t('tripAiPage.deleteDraftConfirm'))) return
    deleteDraftById(loadedDraftId)
    setLoadedDraftId(null)
    setBundle(null)
    navigate('/trip-ai', { replace: true })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('tripAiPage.title')}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 print:hidden">{t('tripAiPage.lead')}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm print:hidden">
          <Link to="/me" className="text-sky-700 hover:underline dark:text-sky-300">
            {t('tripAiPage.linkMe')}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/steward" className="text-sky-700 hover:underline dark:text-sky-300">
            {t('tripAiPage.linkSteward')}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/advisor" className="text-sky-700 hover:underline dark:text-sky-300">
            {t('tripAiPage.linkAdvisor')}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/library" className="text-sky-700 hover:underline dark:text-sky-300">
            {t('tripAiPage.linkLibrary')}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/map-hub" className="text-sky-700 hover:underline dark:text-sky-300">
            {t('tripAiPage.linkMapHub')}
          </Link>
        </div>
      </header>

      <section
        className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900 print:hidden"
        aria-label={t('tripAiPage.draftsSectionTitle')}
      >
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('tripAiPage.draftsSectionTitle')}</h2>
        {recentDrafts.length === 0 ? (
          <p className="mt-2 text-slate-600 dark:text-slate-400">{t('tripAiPage.draftsEmpty')}</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {recentDrafts.map((d) => (
              <li key={d.id}>
                <Link
                  to={`/trip-ai?draft=${encodeURIComponent(d.id)}`}
                  className="text-sky-700 underline-offset-2 hover:underline dark:text-sky-300"
                >
                  {t('tripAiPage.draftsOpenHint')}: {d.title || d.id}
                </Link>
                <span className="ml-2 text-xs text-slate-500">
                  {new Date(d.createdAt).toLocaleString(i18n.language === 'zh-CN' ? 'zh-CN' : undefined, {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 print:hidden">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('tripAiPage.sectionForm')}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              {t('tripAiPage.lblDestination')}
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </label>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              {t('tripAiPage.lblDays')}
              <input
                type="number"
                min={1}
                max={14}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </label>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              {t('tripAiPage.lblBudget')}
              <input
                type="number"
                min={200}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </label>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              {t('tripAiPage.lblDepart')}
              <input
                value={departCity}
                onChange={(e) => setDepartCity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </label>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 sm:col-span-2">
              {t('tripAiPage.lblPace')}
              <select
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="relaxed">{t('tripAiPage.paceRelaxed')}</option>
                <option value="balanced">{t('tripAiPage.paceBalanced')}</option>
                <option value="intense">{t('tripAiPage.paceIntense')}</option>
              </select>
            </label>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 sm:col-span-2">
              {t('tripAiPage.lblNotes')}
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={meta.loading}
              onClick={() => void runGenerate('', {})}
              className="min-h-10 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
            >
              {meta.loading ? t('tripAiPage.btnGenerating') : t('tripAiPage.btnGenerate')}
            </button>
            <button
              type="button"
              disabled={meta.loading}
              onClick={() => void runGenerate(t('tripAiPage.directiveRegen'), {})}
              className="min-h-10 rounded-xl border border-slate-300 px-3 text-sm font-medium dark:border-slate-600"
            >
              {t('tripAiPage.btnRegen')}
            </button>
            <button
              type="button"
              disabled={meta.loading}
              onClick={() => void runGenerate(t('tripAiPage.directiveSimplify'), {})}
              className="min-h-10 rounded-xl border border-slate-300 px-3 text-sm font-medium dark:border-slate-600"
            >
              {t('tripAiPage.btnSimplify')}
            </button>
            <button
              type="button"
              disabled={meta.loading}
              onClick={() => void runGenerate(t('tripAiPage.directiveFree'), {})}
              className="min-h-10 rounded-xl border border-slate-300 px-3 text-sm font-medium dark:border-slate-600"
            >
              {t('tripAiPage.btnFreePoints')}
            </button>
            <button
              type="button"
              disabled={meta.loading}
              onClick={() => void runGenerate(t('tripAiPage.directiveSqueeze'), {})}
              className="min-h-10 rounded-xl border border-emerald-400 px-3 text-sm font-medium text-emerald-800 dark:border-emerald-700 dark:text-emerald-200"
            >
              {t('tripAiPage.btnSqueeze')}
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">{t('tripAiPage.lblTweak')}</label>
            <div className="mt-1 flex gap-2">
              <input
                value={tweak}
                onChange={(e) => setTweak(e.target.value)}
                placeholder={t('tripAiPage.tweakPlaceholder')}
                className="min-h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
              <button
                type="button"
                disabled={meta.loading || !tweak.trim()}
                onClick={() => void runGenerate(tweak.trim(), {})}
                className="min-h-10 shrink-0 rounded-xl bg-slate-800 px-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-slate-200 dark:text-slate-900"
              >
                {t('tripAiPage.btnApply')}
              </button>
            </div>
          </div>

          {meta.err ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <p className="text-sm text-red-600">{meta.err}</p>
              <button
                type="button"
                disabled={meta.loading}
                onClick={() => void runGenerate(lastDirectiveRef.current, {})}
                className="min-h-9 rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-slate-900 dark:text-red-300"
              >
                {t('tripAiPage.errRetry')}
              </button>
            </div>
          ) : null}
          {meta.mock && bundle ? (
            <p className="mt-3 text-xs text-amber-800 dark:text-amber-200/90">{t('tripAiPage.mockHint')}</p>
          ) : null}
        </section>

        <section className="trip-print-root rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('tripAiPage.sectionResult')}</h2>
          {!bundle || !activeSpec ? (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">{t('tripAiPage.resultEmpty')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('tripAiPage.resultEmptyHint')}</p>
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('tripAiPage.quickStartTitle')}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TRIP_QUICK_START.map((preset) => (
                    <button
                      key={preset.destination}
                      type="button"
                      disabled={meta.loading}
                      onClick={() => applyQuickStart(preset)}
                      className="min-h-9 rounded-full border border-sky-200 bg-sky-50 px-3 text-xs font-semibold text-sky-900 hover:bg-sky-100 disabled:opacity-50 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100 dark:hover:bg-sky-900"
                    >
                      {t('tripAiPage.quickStartChip', {
                        dest: preset.destination,
                        days: preset.days,
                        budget: preset.budget,
                      })}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-2 print:hidden">
                <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setViewMode('read')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      viewMode === 'read'
                        ? 'bg-white text-sky-700 shadow dark:bg-slate-900 dark:text-sky-300'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t('tripAiPage.viewRead')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('detail')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      viewMode === 'detail'
                        ? 'bg-white text-sky-700 shadow dark:bg-slate-900 dark:text-sky-300'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t('tripAiPage.viewDetail')}
                  </button>
                </div>
                <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveLeg('primary')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      activeLeg === 'primary'
                        ? 'bg-white text-sky-700 shadow dark:bg-slate-900 dark:text-sky-300'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t('tripAiPage.tabPrimary')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLeg('alternate')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      activeLeg === 'alternate'
                        ? 'bg-white text-sky-700 shadow dark:bg-slate-900 dark:text-sky-300'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t('tripAiPage.tabAlternate')}
                  </button>
                </div>
                {bundle.countryCode ? (
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:border-slate-600 dark:text-slate-400">
                    {t('tripAiPage.countryBadge', { code: bundle.countryCode })}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">{activeSpec.title}</h3>
              {sourceArticle ? (
                <p className="mt-2 text-xs text-violet-800 dark:text-violet-200 print:hidden">
                  {t('tripAiPage.sourceArticleLead')}{' '}
                  <Link
                    to={`/routes/${sourceArticle.id}`}
                    className="font-semibold underline underline-offset-2"
                  >
                    {sourceArticle.title}
                  </Link>
                </p>
              ) : null}
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('tripAiPage.totalLine', {
                  total: activeSpec.totalBudget,
                  days: activeSpec.days?.length || 0,
                })}
              </p>
              {activeSpec._guideMeta?.placeName ? (
                <div className="mt-2 rounded-xl border border-sky-100 bg-sky-50/80 px-3 py-2 text-xs text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-100 print:hidden">
                  <span className="font-semibold">{t('tripAiPage.guideMetaTitle')}</span>
                  {t('tripAiPage.guideMetaCountry', { place: activeSpec._guideMeta.placeName })}
                  {activeSpec._guideMeta.stationKeys?.length
                    ? t('tripAiPage.guideMetaStations', { count: activeSpec._guideMeta.stationKeys.length })
                    : t('tripAiPage.guideMetaNoStations')}
                  {activeSpec._guideMeta.placeId ? (
                    <>
                      {' '}
                      <Link
                        className="font-semibold underline"
                        to={`/map-hub?mode=city&place=${encodeURIComponent(activeSpec._guideMeta.placeId)}`}
                      >
                        {t('tripAiPage.guideMapLink')}
                      </Link>
                    </>
                  ) : null}
                </div>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex min-h-10 items-center rounded-lg border border-slate-400 px-3 text-sm font-semibold text-slate-800 dark:border-slate-500 dark:text-slate-100"
                >
                  {t('tripAiPage.btnPrint')}
                </button>
                {navUri ? (
                  <a
                    href={navUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center rounded-lg bg-sky-600 px-3 text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    {t('tripAiPage.amapFirst')}
                  </a>
                ) : null}
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-600"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent('roamwise:ai-itinerary', {
                        detail: {
                          message: `请根据以下 JSON 行程（含主推 primary 与备选 alternate）做「省钱交通」复核与风险提示，用要点列出：\n${JSON.stringify(bundle).slice(0, 3500)}`,
                        },
                      }),
                    )
                  }
                >
                  {t('tripAiPage.aiFloatReview')}
                </button>
                {advisorPrefillHref ? (
                  <Link
                    to={advisorPrefillHref}
                    className="inline-flex min-h-10 items-center rounded-lg border border-sky-500 px-3 text-sm font-semibold text-sky-800 dark:border-sky-600 dark:text-sky-200"
                  >
                    {t('tripAiPage.openAdvisorPage')}
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => void copyItineraryMarkdown()}
                  className="inline-flex min-h-10 items-center rounded-lg bg-sky-600 px-3 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  {t('tripAiPage.copyMarkdown')}
                </button>
                <button
                  type="button"
                  onClick={downloadItineraryMarkdown}
                  className="inline-flex min-h-10 items-center rounded-lg border border-sky-400 px-3 text-sm font-semibold text-sky-800 dark:border-sky-600 dark:text-sky-200"
                >
                  {t('tripAiPage.downloadMarkdown')}
                </button>
                <button
                  type="button"
                  onClick={() => void copyItineraryJson()}
                  className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-600"
                >
                  {t('tripAiPage.copyJson')}
                </button>
                <button
                  type="button"
                  onClick={syncToSteward}
                  className="inline-flex min-h-10 items-center rounded-lg border border-emerald-500 px-3 text-sm font-semibold text-emerald-800 dark:border-emerald-600 dark:text-emerald-200"
                >
                  {t('tripAiPage.syncSteward')}
                </button>
                {loadedDraftId ? (
                  <button
                    type="button"
                    onClick={onDeleteLoadedDraft}
                    className="inline-flex min-h-10 items-center rounded-lg border border-rose-300 px-3 text-sm font-medium text-rose-800 dark:border-rose-800 dark:text-rose-200"
                  >
                    {t('tripAiPage.deleteDraft')}
                  </button>
                ) : null}
              </div>

              {viewMode === 'read' ? (
                <TripItineraryReadView spec={activeSpec} destinationFallback={destination} />
              ) : (
                <>
              <div className="mt-4 print:hidden">
                <ItineraryAmapPreview itinerary={activeSpec} />
              </div>

              <ul className="mt-4 space-y-4">
                {(activeSpec.days || []).map((d) => (
                  <li key={`${activeLeg}-${d.day}`} className="rounded-xl border border-slate-100 p-3 dark:border-slate-700">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {t('tripAiPage.dayTitle', { day: d.day, theme: d.theme })}
                      </span>
                      <span className="text-xs text-slate-500">
                        {t('tripAiPage.dayBudget', { amount: d.dayBudget })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {t('tripAiPage.transport')}
                      {d.transport}
                    </p>
                    <ul className="mt-2 space-y-2 text-sm">
                      {(d.pois || []).map((p) => (
                        <li key={`${activeLeg}-${d.day}-${p.name}`} className="flex flex-wrap gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-semibold ${
                              p.kind === 'blue'
                                ? 'bg-sky-100 text-sky-800'
                                : p.kind === 'green'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {p.kind}
                          </span>
                          <span className="font-medium text-slate-800 dark:text-slate-100">{p.name}</span>
                          {p.guideStationKey ? (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {t('tripAiPage.stationTag', { key: p.guideStationKey })}
                            </span>
                          ) : null}
                          <span className="text-xs text-slate-500">{p.budgetHint}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              {(activeSpec.replacements || []).length ? (
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-sm dark:border-emerald-900 dark:bg-emerald-950/30">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-200">{t('tripAiPage.replacementsTitle')}</h4>
                  <ul className="mt-2 space-y-1">
                    {activeSpec.replacements.map((r, i) => (
                      <li key={i} className="text-emerald-900/90 dark:text-emerald-100/90">
                        {t('tripAiPage.replacementLine', { from: r.from, to: r.to, save: r.save })}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
                </>
              )}

              <div className="mt-5 print:hidden rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/25">
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">{t('tripAiPage.communityBlockTitle')}</p>
                <p className="mt-1 text-xs text-emerald-900/80 dark:text-emerald-200/80">{t('tripAiPage.communityBlockLead')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {communityBrowseHref ? (
                    <Link
                      to={communityBrowseHref}
                      className="inline-flex min-h-9 items-center rounded-lg border border-emerald-400 px-3 text-xs font-semibold text-emerald-900 dark:border-emerald-700 dark:text-emerald-100"
                    >
                      {t('tripAiPage.communityBrowse')}
                    </Link>
                  ) : null}
                  {communityAskHref ? (
                    <Link
                      to={communityAskHref}
                      className="inline-flex min-h-9 items-center rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      {t('tripAiPage.communityAsk')}
                    </Link>
                  ) : null}
                  {buddiesBrowseHref ? (
                    <Link
                      to={buddiesBrowseHref}
                      className="inline-flex min-h-9 items-center rounded-lg border border-amber-400 px-3 text-xs font-semibold text-amber-950 dark:border-amber-700 dark:text-amber-100"
                    >
                      {t('tripAiPage.buddiesBrowse')}
                    </Link>
                  ) : null}
                  {buddiesPostHref ? (
                    <Link
                      to={buddiesPostHref}
                      className="inline-flex min-h-9 items-center rounded-lg bg-amber-500 px-3 text-xs font-semibold text-white hover:bg-amber-600"
                    >
                      {t('tripAiPage.buddiesPost')}
                    </Link>
                  ) : null}
                </div>
              </div>

              {relatedGuides.length > 0 ? (
                <section className="mt-5 print:hidden" aria-label={t('tripAiPage.relatedGuidesTitle')}>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('tripAiPage.relatedGuidesTitle')}</h4>
                  <ul className="mt-2 space-y-2">
                    {relatedGuides.map((a) => (
                      <li key={a.id}>
                        <Link
                          to={`/routes/${a.id}`}
                          className="block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-sky-700"
                        >
                          <span className="font-semibold text-slate-900 dark:text-slate-50">{a.title}</span>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            {a.destination} · ¥{a.budget} · {a.days}天
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
