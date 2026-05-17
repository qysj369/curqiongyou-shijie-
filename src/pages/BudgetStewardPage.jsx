import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { sendMessage } from '../services/aiChat'
import { useToast } from '../contexts/ToastContext'

const STEWARD_PREFILL_KEY = 'roamwise:steward-prefill'

const STEWARD_DEFAULT_LINES = [
  { id: 't', labelKey: 'stewardPage.lineTransport', amount: 900 },
  { id: 's', labelKey: 'stewardPage.lineStay', amount: 1200 },
  { id: 'f', labelKey: 'stewardPage.lineFood', amount: 700 },
  { id: 'tk', labelKey: 'stewardPage.lineTickets', amount: 400 },
  { id: 'o', labelKey: 'stewardPage.lineOther', amount: 300 },
]

const ID_TO_LABEL_KEY = {
  t: 'stewardPage.lineTransport',
  s: 'stewardPage.lineStay',
  f: 'stewardPage.lineFood',
  tk: 'stewardPage.lineTickets',
  o: 'stewardPage.lineBuffer',
}

function cloneDefaultLines() {
  return STEWARD_DEFAULT_LINES.map((row) => ({ ...row }))
}

function normalizeLines(raw) {
  if (!Array.isArray(raw)) return null
  return raw.map((row) => {
    const id = String(row?.id || '').trim() || 'x'
    const amount = Number(row?.amount)
    const labelKey = row?.labelKey || ID_TO_LABEL_KEY[id] || null
    return {
      id,
      labelKey,
      label: typeof row?.label === 'string' ? row.label : undefined,
      amount: Number.isFinite(amount) ? amount : 0,
    }
  })
}

function lineLabel(l, t) {
  if (l.labelKey) return t(l.labelKey)
  if (l.label) return l.label
  return l.id
}

/**
 * 模块 5：预算管家 — 科目拆分、AI 高价替换建议、分享链接（hash 承载草稿）。
 */
export default function BudgetStewardPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [lines, setLines] = useState(() => cloneDefaultLines())
  const [title, setTitle] = useState('')
  const [aiNote, setAiNote] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let appliedFromSession = false
    try {
      const raw = sessionStorage.getItem(STEWARD_PREFILL_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        sessionStorage.removeItem(STEWARD_PREFILL_KEY)
        const next = normalizeLines(data.lines)
        if (next) {
          setLines(next)
          appliedFromSession = true
        }
        if (typeof data.title === 'string') setTitle(data.title)
      }
    } catch {
      /* noop */
    }

    if (appliedFromSession) return

    try {
      const h = window.location.hash || ''
      if (!h.startsWith('#steward=')) return
      const raw = decodeURIComponent(atob(h.slice('#steward='.length)))
      const data = JSON.parse(raw)
      const next = normalizeLines(data.lines)
      if (next) setLines(next)
      if (typeof data.title === 'string') setTitle(data.title)
    } catch {
      /* noop */
    }
  }, [])

  const total = useMemo(() => lines.reduce((s, x) => s + (Number(x.amount) || 0), 0), [lines])

  const advisorPrefillHref = useMemo(() => {
    const body = lines.map((l) => `${lineLabel(l, t)}:¥${l.amount}`).join('；')
    const titleLine = title.trim() ? `${t('stewardPage.advisorTitleLine', { title: title.trim() })}\n` : ''
    const q = t('stewardPage.advisorPrefillMsg', { total, titleLine, body })
    return `/advisor?q=${encodeURIComponent(q)}`
  }, [lines, total, title, t])

  const updateLine = (id, patch) => {
    setLines((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }

  const runReplaceAdvice = async () => {
    setBusy(true)
    setAiNote('')
    const body = lines.map((l) => `${lineLabel(l, t)}:¥${l.amount}`).join('；')
    const titleLine = title.trim() ? `${t('stewardPage.aiTitleLine', { title: title.trim() })}\n` : ''
    const prompt = t('stewardPage.aiUserPrompt', { titleLine, total, body })
    try {
      const { reply } = await sendMessage(prompt)
      setAiNote(reply || '')
    } finally {
      setBusy(false)
    }
  }

  const buildShareUrl = () => {
    const payload = { v: 1, lines, total, title: title.trim() || undefined }
    const hash = btoa(encodeURIComponent(JSON.stringify(payload)))
    return `${window.location.origin}${window.location.pathname}#steward=${hash}`
  }

  const copyShare = async () => {
    const url = buildShareUrl()
    try {
      await navigator.clipboard.writeText(url)
      toast(t('stewardPage.copyShareOk'))
    } catch {
      window.prompt(t('stewardPage.copyShare'), url)
    }
  }

  const copyBreakdown = async () => {
    const parts = []
    if (title.trim()) parts.push(`${t('stewardPage.aiTitleLine', { title: title.trim() })}`)
    for (const l of lines) {
      parts.push(`${lineLabel(l, t)}: ¥${l.amount}`)
    }
    parts.push(t('stewardPage.totalLabel', { amount: total }))
    try {
      await navigator.clipboard.writeText(parts.join('\n'))
      toast(t('stewardPage.copyBreakdownOk'))
    } catch {
      toast(t('stewardPage.copyBreakdownFail'))
    }
  }

  const resetDefaults = () => {
    setLines(cloneDefaultLines())
    setTitle('')
    setAiNote('')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('stewardPage.title')}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('stewardPage.lead')}</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold">
          <Link to={advisorPrefillHref} className="text-emerald-700 hover:underline dark:text-emerald-300">
            {t('stewardPage.openAdvisorPrefill')}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/trip-ai" className="text-sky-700 hover:underline dark:text-sky-300">
            {t('stewardPage.linkTripAi')}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/advisor" className="text-sky-700 hover:underline dark:text-sky-300">
            {t('stewardPage.linkAdvisor')}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/map-hub" className="text-sky-700 hover:underline dark:text-sky-300">
            {t('stewardPage.linkMapHub')}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/library" className="text-sky-700 hover:underline dark:text-sky-300">
            {t('stewardPage.linkLibrary')}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/me" className="text-sky-700 hover:underline dark:text-sky-300">
            {t('stewardPage.linkMe')}
          </Link>
        </div>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
          {t('stewardPage.titleOptional')}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('stewardPage.titlePlaceholder')}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
        </label>

        <div className="mt-4 space-y-3">
          {lines.map((l) => (
            <div key={l.id} className="flex flex-wrap items-center gap-2">
              <label className="w-28 shrink-0 text-sm font-medium text-slate-700 dark:text-slate-200">
                {lineLabel(l, t)}
              </label>
              <input
                type="number"
                min={0}
                value={l.amount}
                onChange={(e) => updateLine(l.id, { amount: Number(e.target.value) })}
                className="min-h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-600 dark:bg-slate-800 sm:max-w-[12rem]"
              />
              <span className="text-xs text-slate-500">¥</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {t('stewardPage.totalLabel', { amount: total })}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void runReplaceAdvice()}
              className="min-h-10 rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy ? t('stewardPage.aiBusy') : t('stewardPage.aiButton')}
            </button>
            <button
              type="button"
              onClick={() => void copyShare()}
              className="min-h-10 rounded-xl border border-slate-300 px-3 text-sm dark:border-slate-600"
            >
              {t('stewardPage.copyShare')}
            </button>
            <button
              type="button"
              onClick={() => void copyBreakdown()}
              className="min-h-10 rounded-xl border border-slate-300 px-3 text-sm dark:border-slate-600"
            >
              {t('stewardPage.copyBreakdown')}
            </button>
            <button
              type="button"
              onClick={resetDefaults}
              className="min-h-10 rounded-xl border border-amber-300 px-3 text-sm text-amber-900 dark:border-amber-800 dark:text-amber-100"
            >
              {t('stewardPage.resetDefaults')}
            </button>
          </div>
        </div>
        {aiNote ? (
          <div className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800 dark:bg-slate-800/70 dark:text-slate-100">
            {aiNote}
          </div>
        ) : null}
      </div>
    </div>
  )
}
