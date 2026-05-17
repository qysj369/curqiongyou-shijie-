import AIChat from '../components/ai/AI-Chat'
import { useTranslation } from 'react-i18next'

export default function AiTravelmatePage() {
  const { t, i18n } = useTranslation()
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('aiTravelmatePage.title')}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('aiTravelmatePage.lead')}</p>
      </header>
      <AIChat key={i18n.language} />
    </section>
  )
}
