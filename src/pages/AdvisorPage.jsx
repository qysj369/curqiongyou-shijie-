import { useEffect, useMemo } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AIChat from '../components/ai/AI-Chat'
import { ADVISOR_SYSTEM_PROMPT } from '../lib/prompts/advisor.prompt.js'

/**
 * 模块 3：AI 问答顾问 — 全页深度对话（与浮窗互补），偏「自然语言 → 文字 + 路线 + 省钱交通」。
 * 支持 `?q=` / `?ask=` URL 预填并自动发出首条（strip 延迟，避免打断 AI-Chat 内短延时发送）。
 */
export default function AdvisorPage() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const urlPrompt = useMemo(() => {
    const p = new URLSearchParams(location.search)
    return (p.get('q') || p.get('ask') || '').trim()
  }, [location.search])

  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('ask')
    if (!q) return undefined
    const id = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      next.delete('q')
      next.delete('ask')
      setSearchParams(next, { replace: true })
    }, 900)
    return () => window.clearTimeout(id)
  }, [searchParams, setSearchParams])

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-7rem)] w-full max-w-6xl flex-col px-4 py-4 sm:py-6">
      <header className="mb-3 shrink-0 sm:mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('advisorPage.title')}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('advisorPage.lead')}</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-500">{t('advisorPage.footnote')}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <Link to="/trip-ai" className="text-sky-700 dark:text-sky-300 hover:underline">
            {t('advisorPage.linkTripAi')}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/map-hub" className="text-sky-700 dark:text-sky-300 hover:underline">
            {t('advisorPage.linkMapHub')}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/library" className="text-sky-700 dark:text-sky-300 hover:underline">
            {t('common.navLibrary')}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/steward" className="text-sky-700 dark:text-sky-300 hover:underline">
            {t('advisorPage.linkSteward')}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/me" className="text-sky-700 dark:text-sky-300 hover:underline">
            {t('advisorPage.linkMe')}
          </Link>
        </div>
      </header>
      <div className="min-h-0 w-full flex-1">
        <AIChat
          key={`${i18n.language}-${location.key}`}
          fullPage
          systemPrompt={ADVISOR_SYSTEM_PROMPT}
          seedAssistant={t('advisorPage.seedAssistant')}
          inputPlaceholder={t('advisorPage.inputPlaceholder')}
          autoPrompt={urlPrompt}
          autoPromptNonce={urlPrompt ? 1 : 0}
        />
      </div>
    </section>
  )
}
