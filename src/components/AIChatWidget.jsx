import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { sendMessage } from '../services/aiChat'

const FREE_QUOTA = Number(import.meta.env?.VITE_AI_FREE_QUOTA ?? 10)
const USAGE_STORAGE_KEY = 'ai_chat_free_usage_daily'
const LEGACY_USAGE_KEY = 'ai_chat_free_usage_count'

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

export default function AIChatWidget() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => [
    { role: 'assistant', text: t('aiChat.welcome') },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [usageCount, setUsageCountState] = useState(() => readDailyUsageCount())
  const [showLimitModal, setShowLimitModal] = useState(false)
  const listRef = useRef(null)

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

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    const used = readDailyUsageCount()
    if (used !== usageCount) setUsageCountState(used)
    if (used >= FREE_QUOTA) {
      setShowLimitModal(true)
      return
    }
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text }])
    setLoading(true)
    const nextUsageCount = used + 1
    setUsageCountState(nextUsageCount)
    persistDailyUsageCount(nextUsageCount)
    try {
      const { reply, rollbackQuota, busy } = await sendMessage(text)
      if (rollbackQuota) {
        persistDailyUsageCount(used)
        setUsageCountState(used)
      }
      const display =
        busy && !(reply && String(reply).trim())
          ? t('aiChat.serviceBusy')
          : (reply && String(reply).trim()) || t('aiChat.error')
      setMessages((prev) => [...prev, { role: 'assistant', text: display }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: t('aiChat.error') }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 transition flex items-center justify-center"
        aria-label={t('aiChat.toggle')}
      >
        <span className="text-2xl" aria-hidden>💬</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[480px]">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-100">{t('aiChat.title')}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300"
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
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {m.text}
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
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 border-t border-slate-100 dark:border-slate-700 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('aiChat.placeholder')}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              maxLength={500}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition"
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
          className="fixed inset-0 z-50 bg-slate-900/55 flex items-center justify-center px-4"
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
                  navigate('/membership')
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition"
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
