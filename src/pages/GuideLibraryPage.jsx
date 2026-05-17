import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GUIDE_TOPICS, keywordForTopic } from '../data/guideLibrary/index.js'
import { sendMessage } from '../services/aiChat'

/**
 * 模块 4：攻略文库 — 主题轴入口 + AI 改写/润色（接 aiChat 与攻略列表）。
 */
export default function GuideLibraryPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [raw, setRaw] = useState('')
  const [reply, setReply] = useState('')
  const [busy, setBusy] = useState(false)

  /** ?paste= / ?prefill= 写入改写框（URL 过长时请改用粘贴）；读后 strip */
  useEffect(() => {
    const paste = searchParams.get('paste') || searchParams.get('prefill')
    if (!paste) return
    try {
      setRaw(decodeURIComponent(paste))
    } catch {
      setRaw(paste)
    }
    const next = new URLSearchParams(searchParams)
    next.delete('paste')
    next.delete('prefill')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const topicLabel = (tp) => tp.labelZh

  const runRewrite = async () => {
    const text = raw.trim()
    if (!text) return
    setBusy(true)
    setReply('')
    try {
      const { reply: r } = await sendMessage(t('guideLibraryPage.rewritePrompt', { text }))
      setReply(r || '')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('guideLibraryPage.title')}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('guideLibraryPage.lead')}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
          <Link to="/routes" className="text-sky-700 hover:underline dark:text-sky-300">
            {t('guideLibraryPage.routesCta')} →
          </Link>
        </div>
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('guideLibraryPage.quickNav')}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <Link to="/map-hub" className="text-sky-700 hover:underline dark:text-sky-300">
              {t('guideLibraryPage.mapHubCta')}
            </Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <Link to="/advisor" className="text-sky-700 hover:underline dark:text-sky-300">
              {t('guideLibraryPage.advisorCta')}
            </Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <Link to="/trip-ai" className="text-sky-700 hover:underline dark:text-sky-300">
              {t('guideLibraryPage.tripAiCta')}
            </Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <Link to="/steward" className="text-sky-700 hover:underline dark:text-sky-300">
              {t('guideLibraryPage.stewardCta')}
            </Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <Link to="/me" className="text-sky-700 hover:underline dark:text-sky-300">
              {t('guideLibraryPage.meCta')}
            </Link>
          </div>
        </div>
      </header>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('guideLibraryPage.topicSectionTitle')}</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('guideLibraryPage.topicHint')}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {GUIDE_TOPICS.map((tp) => {
            const kw = keywordForTopic(tp.id)
            const label = topicLabel(tp)
            return (
              <Link
                key={tp.id}
                to={`/routes?topic=${encodeURIComponent(tp.id)}`}
                title={kw ? t('guideLibraryPage.topicChipTitle', { label, keyword: kw }) : label}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-sky-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-sky-900/40"
              >
                {label}
              </Link>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('guideLibraryPage.aiSectionTitle')}</h2>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={8}
          placeholder={t('guideLibraryPage.aiPlaceholder')}
          className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
        />
        <button
          type="button"
          disabled={busy || !raw.trim()}
          onClick={() => void runRewrite()}
          className="mt-3 min-h-10 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? t('guideLibraryPage.aiBusy') : t('guideLibraryPage.aiButton')}
        </button>
        {reply ? (
          <div className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm leading-relaxed text-slate-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100">
            {reply}
          </div>
        ) : null}
      </section>
    </div>
  )
}
