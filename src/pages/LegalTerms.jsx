import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../components/Breadcrumbs'

const UPDATED = '2026-04-10'

export default function LegalTerms() {
  const { t } = useTranslation()
  const crumbs = [
    { label: t('common.home'), to: '/' },
    { label: t('legal.termsTitle') },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumbs items={crumbs} />
        <article className="mt-6 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-[15px] md:text-base">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{t('legal.termsTitle')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('legal.lastUpdated', { date: UPDATED })}</p>
          <p>{t('legal.termsLead')}</p>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-8 mb-3">
              {t('legal.termsSection1Title')}
            </h2>
            <p>{t('legal.termsSection1Body')}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-8 mb-3">
              {t('legal.termsSection2Title')}
            </h2>
            <p>{t('legal.termsSection2Body')}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-8 mb-3">
              {t('legal.termsSection3Title')}
            </h2>
            <p>{t('legal.termsSection3Body')}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-8 mb-3">
              {t('legal.termsSection4Title')}
            </h2>
            <p>{t('legal.termsSection4Body')}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-8 mb-3">
              {t('legal.termsSection5Title')}
            </h2>
            <p>{t('legal.termsSection5Body')}</p>
          </section>
        </article>
        <p className="mt-10">
          <Link
            to="/"
            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline underline-offset-2 min-h-11 inline-flex items-center"
          >
            {t('legal.backHome')}
          </Link>
        </p>
      </div>
    </div>
  )
}
