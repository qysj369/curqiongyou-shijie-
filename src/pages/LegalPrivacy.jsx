import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../components/Breadcrumbs'
import CopyPageLinkButton from '../components/CopyPageLinkButton'

const UPDATED = '2026-04-10'

export default function LegalPrivacy() {
  const { t } = useTranslation()
  const crumbs = [
    { label: t('common.home'), to: '/' },
    { label: t('legal.privacyTitle') },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Breadcrumbs items={crumbs} />
          <CopyPageLinkButton />
        </div>
        <article className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-[15px] md:text-base">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{t('legal.privacyTitle')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('legal.lastUpdated', { date: UPDATED })}</p>
          <p>{t('legal.privacyLead')}</p>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-8 mb-3">
              {t('legal.privacySection1Title')}
            </h2>
            <p>{t('legal.privacySection1Body')}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-8 mb-3">
              {t('legal.privacySection2Title')}
            </h2>
            <p>{t('legal.privacySection2Body')}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-8 mb-3">
              {t('legal.privacySection3Title')}
            </h2>
            <p>{t('legal.privacySection3Body')}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-8 mb-3">
              {t('legal.privacySection4Title')}
            </h2>
            <p>{t('legal.privacySection4Body')}</p>
          </section>
        </article>
        <p className="mt-10">
          <Link
            to="/"
            className="text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 underline underline-offset-2 min-h-11 inline-flex items-center"
          >
            {t('legal.backHome')}
          </Link>
        </p>
      </div>
    </div>
  )
}
