import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { sendMessage } from '../services/aiChat'
import ChatMessageContent from './ChatMessageContent'

const FREE_QUOTA = Number(import.meta.env?.VITE_AI_FREE_QUOTA ?? 10)
const USAGE_STORAGE_KEY = 'ai_chat_free_usage_daily'
const LEGACY_USAGE_KEY = 'ai_chat_free_usage_count'
const DOWNLOAD_ONLY_MISSING_KEY = 'ai_chat_download_only_missing'

function localDateKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function readDailyUsageCount() {
  try {
    const raw = localStorage.getItem(USAGE_STORAGE_KEY)
    if (raw) {
      const o = JSON.parse(raw)
      const day = o?.day
      const n = Number(o?.count)
      if (day === localDateKey() && Number.isFinite(n) && n >= 0) return n
      return 0
    }
    if (localStorage.getItem(LEGACY_USAGE_KEY) != null) {
      localStorage.removeItem(LEGACY_USAGE_KEY)
    }
  } catch {
    // ignore
  }
  return 0
}

function persistDailyUsageCount(value) {
  try {
    localStorage.setItem(
      USAGE_STORAGE_KEY,
      JSON.stringify({ day: localDateKey(), count: Math.max(0, value) }),
    )
  } catch {
    // Ignore storage errors and keep UI functional.
  }
}

function readDownloadOnlyMissingPref() {
  try {
    const raw = localStorage.getItem(DOWNLOAD_ONLY_MISSING_KEY)
    if (raw == null) return true
    return raw !== '0'
  } catch {
    return true
  }
}

function persistDownloadOnlyMissingPref(value) {
  try {
    localStorage.setItem(DOWNLOAD_ONLY_MISSING_KEY, value ? '1' : '0')
  } catch {
    // ignore
  }
}

const FIELD_KEYS = ['freeScenic', 'foodUnder200', 'lowCostStay', 'realPitfall']

function escapeSingleQuoteText(text) {
  return String(text || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function toTemplateSnippet(countryHit, onlyMissingFields = false) {
  const draftLines = FIELD_KEYS.map((fieldKey) => {
    const matchedField = countryHit?.fields?.find((field) => field.key === fieldKey)
    const fieldValue = onlyMissingFields && matchedField?.present ? '' : (matchedField?.value || '')
    const normalized = fieldValue ? `'${escapeSingleQuoteText(fieldValue)}'` : "'TODO: 待补全'"
    return `  ${fieldKey}: ${normalized},`
  })
  return `'${escapeSingleQuoteText(countryHit.name)}': {\n${draftLines.join('\n')}\n},`
}

export default function AIChatWidget() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const stackAboveBottomNav = pathname !== '/plan' && pathname !== '/globe'
  const [narrowScreen, setNarrowScreen] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia('(max-width: 767px)').matches
  })
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(max-width: 767px)')
    const fn = () => setNarrowScreen(mq.matches)
    fn()
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  const mapHomeImmersiveChrome =
    narrowScreen && stackAboveBottomNav && (pathname === '/' || pathname === '/map')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => [
    { role: 'assistant', text: t('aiChat.welcome') },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [usageCount, setUsageCountState] = useState(() => readDailyUsageCount())
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState('')
  const [downloadOnlyMissing, setDownloadOnlyMissing] = useState(() => readDownloadOnlyMissingPref())
  const listRef = useRef(null)
  const quickPrompts = [
    t('aiChat.quickBudget'),
    t('aiChat.quickSafe'),
    t('aiChat.quickScam'),
    t('aiChat.quickEssentials'),
  ]

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [open, messages])

  useEffect(() => {
    if (open) setUsageCountState(readDailyUsageCount())
  }, [open])

  useEffect(() => {
    if (!showLimitModal) return
    const onKey = (e) => {
      if (e.key === 'Escape') setShowLimitModal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showLimitModal])

  const sendUserText = useCallback(
    async (rawText) => {
      const text = String(rawText || '').trim()
      if (!text || loading) return
      const used = readDailyUsageCount()
      if (used !== usageCount) setUsageCountState(used)
      if (used >= FREE_QUOTA) {
        setShowLimitModal(true)
        return
      }
      setMessages((prev) => [...prev, { role: 'user', text }])
      setLoading(true)
      const nextUsageCount = used + 1
      setUsageCountState(nextUsageCount)
      persistDailyUsageCount(nextUsageCount)
      try {
        const { reply, rollbackQuota, busy, matchedCountries, matchedCountryHits } = await sendMessage(text)
        if (rollbackQuota) {
          persistDailyUsageCount(used)
          setUsageCountState(used)
        }
        const display =
          busy && !(reply && String(reply).trim())
            ? t('aiChat.serviceBusy')
            : (reply && String(reply).trim()) || t('aiChat.error')
        setMessages((prev) => [...prev, { role: 'assistant', text: display, matchedCountries, matchedCountryHits }])
      } catch {
        setMessages((prev) => [...prev, { role: 'assistant', text: t('aiChat.error') }])
      } finally {
        setLoading(false)
      }
    },
    [loading, t, usageCount],
  )

  useEffect(() => {
    const onItinerary = (e) => {
      const msg = e?.detail?.message
      if (typeof msg !== 'string' || !msg.trim()) return
      setOpen(true)
      void sendUserText(msg.trim())
    }
    window.addEventListener('roamwise:ai-itinerary', onItinerary)
    return () => window.removeEventListener('roamwise:ai-itinerary', onItinerary)
  }, [sendUserText])

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('roamwise:ai-open', onOpen)
    return () => window.removeEventListener('roamwise:ai-open', onOpen)
  }, [])

  const handleSend = async (e) => {
    e?.preventDefault?.()
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    await sendUserText(text)
  }

  const requestTemplateBackfill = async (countryHit) => {
    if (!countryHit || loading) return
    const missingKeys = FIELD_KEYS.filter((fieldKey) => {
      const matched = countryHit?.fields?.find((field) => field.key === fieldKey)?.present
      return !matched
    })
    if (!missingKeys.length) return
    const missingLabels = missingKeys.map((key) => t(`aiChat.fieldLabel.${key}`)).join('、')
    const prompt = t('aiChat.backfillPromptTemplate', { country: countryHit.name, fields: missingLabels })
    await sendUserText(prompt)
  }

  const copyTemplateDraft = async (countryHit) => {
    if (!countryHit) return
    const snippet = toTemplateSnippet(countryHit, downloadOnlyMissing)
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(snippet)
      } else {
        throw new Error('clipboard unavailable')
      }
      const mode = downloadOnlyMissing ? t('aiChat.copyModeMissing') : t('aiChat.copyModeAll')
      setCopyFeedback(t('aiChat.copyDraftSuccess', { country: countryHit.name, mode }))
    } catch {
      setCopyFeedback(t('aiChat.copyDraftFail'))
    }
  }

  const downloadTemplateDrafts = (countryHits) => {
    if (!Array.isArray(countryHits) || !countryHits.length) return
    const picked = downloadOnlyMissing
      ? countryHits.filter((item) => Number(item?.hit) < Number(item?.total))
      : countryHits
    if (!picked.length) {
      setCopyFeedback(t('aiChat.downloadDraftEmpty'))
      return
    }
    const body = picked.map((item) => toTemplateSnippet(item, downloadOnlyMissing)).join('\n\n')
    const content = `export const MAP_COUNTRY_TEMPLATES_DRAFT = {\n${body}\n}\n`
    try {
      const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' })
      const href = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
      a.href = href
      a.download = `country-templates-draft-${stamp}.js`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(href)
      setCopyFeedback(t('aiChat.downloadDraftSuccess', { count: picked.length }))
    } catch {
      setCopyFeedback(t('aiChat.downloadDraftFail'))
    }
  }

  useEffect(() => {
    if (!copyFeedback) return
    const timer = window.setTimeout(() => setCopyFeedback(''), 2200)
    return () => window.clearTimeout(timer)
  }, [copyFeedback])

  useEffect(() => {
    persistDownloadOnlyMissingPref(downloadOnlyMissing)
  }, [downloadOnlyMissing])

  const fabBottomClass = stackAboveBottomNav
    ? mapHomeImmersiveChrome
      ? 'bottom-[calc(9rem+env(safe-area-inset-bottom))]'
      : 'bottom-[calc(5rem+env(safe-area-inset-bottom))]'
    : 'bottom-6'
  const panelBottomClass = stackAboveBottomNav
    ? mapHomeImmersiveChrome
      ? 'bottom-[calc(13.5rem+env(safe-area-inset-bottom))]'
      : 'bottom-[calc(9.5rem+env(safe-area-inset-bottom))]'
    : 'bottom-24'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`fixed ${fabBottomClass} right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg motion-safe:transition motion-safe:hover:bg-sky-700`}
        aria-label={t('aiChat.toggle')}
      >
        <span className="text-2xl" aria-hidden>💬</span>
      </button>

      {open && (
        <div
          className={`fixed ${panelBottomClass} right-6 z-[100] flex max-h-[480px] w-[360px] max-w-[calc(100vw-3rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900`}
        >
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-100">{t('aiChat.title')}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              aria-label={t('aiChat.close')}
            >
              ✕
            </button>
          </div>
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  <ChatMessageContent text={m.text} variant={m.role === 'user' ? 'user' : 'assistant'} />
                  {m.role === 'assistant' && (
                    Array.isArray(m.matchedCountryHits) && m.matchedCountryHits.length > 0
                      ? (
                        <div className="mt-2 border-t border-slate-300/70 dark:border-slate-600 pt-2">
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-1">
                            {t('aiChat.sourceHitLabel')}
                          </p>
                          <label className="mb-1 inline-flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                            <input
                              type="checkbox"
                              checked={downloadOnlyMissing}
                              onChange={(e) => setDownloadOnlyMissing(e.target.checked)}
                              className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                            />
                            <span>{t('aiChat.downloadOnlyMissing')}</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => downloadTemplateDrafts(m.matchedCountryHits)}
                            className="mb-1 rounded-md border border-sky-300 bg-sky-50 px-2 py-1 text-[11px] font-medium text-sky-800 hover:bg-sky-100 dark:border-sky-700/80 dark:bg-sky-900/20 dark:text-sky-200 dark:hover:bg-sky-900/35"
                          >
                            {t('aiChat.downloadDraftAction')}
                          </button>
                          <div className="flex flex-wrap gap-1.5">
                            {m.matchedCountryHits.map((item) => (
                              <details
                                key={item.name}
                                className="group rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-900/20 dark:text-emerald-200"
                              >
                                <summary className="cursor-pointer list-none font-medium">
                                  {`${item.name} · ${item.hit}/${item.total}`}
                                </summary>
                                <div className="mt-1 space-y-0.5 border-t border-emerald-200/80 pt-1 dark:border-emerald-800/70">
                                  {FIELD_KEYS.map((fieldKey) => {
                                    const matched = item?.fields?.find((field) => field.key === fieldKey)?.present
                                    return (
                                      <div key={fieldKey} className="flex items-center justify-between gap-2">
                                        <span>{t(`aiChat.fieldLabel.${fieldKey}`)}</span>
                                        <span className={matched ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}>
                                          {matched ? t('aiChat.fieldHit') : t('aiChat.fieldMissing')}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                                {item.hit < item.total ? (
                                  <button
                                    type="button"
                                    onClick={() => void requestTemplateBackfill(item)}
                                    disabled={loading}
                                    className="mt-1 w-full rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-left text-[11px] font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-60 dark:border-amber-700/80 dark:bg-amber-900/20 dark:text-amber-200 dark:hover:bg-amber-900/35"
                                  >
                                    {t('aiChat.backfillAction')}
                                  </button>
                                ) : null}
                                <button
                                  type="button"
                                  onClick={() => void copyTemplateDraft(item)}
                                  className="mt-1 w-full rounded-md border border-sky-300 bg-sky-50 px-2 py-1 text-left text-[11px] font-medium text-sky-800 hover:bg-sky-100 dark:border-sky-700/80 dark:bg-sky-900/20 dark:text-sky-200 dark:hover:bg-sky-900/35"
                                >
                                  {t('aiChat.copyDraftAction')}
                                </button>
                              </details>
                            ))}
                          </div>
                        </div>
                      )
                      : (Array.isArray(m.matchedCountries) && m.matchedCountries.length > 0 ? (
                    <div className="mt-2 border-t border-slate-300/70 dark:border-slate-600 pt-2">
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-1">
                        {t('aiChat.sourceHitLabel')}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.matchedCountries.map((name) => (
                          <span
                            key={name}
                            className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                      ) : null)
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                  ...
                </div>
              </div>
            )}
          </div>
          <div className="px-3 pb-2 flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-700">
            {copyFeedback ? (
              <p className="mt-2 w-full text-[11px] text-emerald-700 dark:text-emerald-300">
                {copyFeedback}
              </p>
            ) : null}
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendUserText(prompt)}
                className="mt-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-300 dark:hover:bg-sky-900/40"
              >
                {prompt}
              </button>
            ))}
          </div>
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-100 dark:border-slate-700 flex gap-2"
          >
            <input
              id="ai-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('aiChat.placeholder')}
              aria-label={t('aiChat.placeholder')}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              maxLength={500}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-medium motion-safe:hover:bg-sky-700 disabled:opacity-50 motion-safe:transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            >
              {t('aiChat.send')}
            </button>
          </form>
          <div className="px-3 pb-3 text-xs text-slate-500 dark:text-slate-400">
            {t('aiChat.quotaHint', {
              used: usageCount,
              total: FREE_QUOTA,
            })}
          </div>
        </div>
      )}

      {showLimitModal && (
        <div
          className="fixed inset-0 z-[110] bg-slate-900/55 flex items-center justify-center px-4"
          role="presentation"
          onClick={() => setShowLimitModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-limit-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="ai-limit-title" className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('aiChat.limitTitle')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">{t('aiChat.limitBody')}</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-6">
              <li>{t('aiChat.limitFeatureUnlimited')}</li>
              <li>{t('aiChat.limitFeatureFast')}</li>
              <li>{t('aiChat.limitFeatureAdvanced')}</li>
            </ul>
            <div className="flex gap-3 justify-end flex-wrap">
              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                {t('aiChat.limitLater')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLimitModal(false)
                  navigate('/about')
                }}
                className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
              >
                {t('aiChat.limitUpgrade')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
