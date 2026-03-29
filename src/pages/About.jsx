import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../components/Breadcrumbs'

export default function About() {
  const { t } = useTranslation()
  const breadcrumbs = [
    { label: t('common.home'), to: '/' },
    { label: t('about.title') },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-3xl font-bold text-slate-800 mb-6">{t('about.title')}</h1>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">{t('about.introTitle')}</h2>
          <p className="text-slate-600 leading-relaxed">{t('about.introBody')}</p>
        </section>

        <section className="bg-amber-50 rounded-2xl border border-amber-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-amber-800 mb-3">{t('about.guidelinesTitle')}</h2>
          <p className="text-amber-800 leading-relaxed whitespace-pre-line">{t('about.guidelinesBody')}</p>
          <Link
            to="/board"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition text-sm"
          >
            {t('about.goToBoard')}
          </Link>
        </section>

        <p className="text-slate-500 text-sm text-center">
          <Link to="/" className="text-amber-600 hover:underline">{t('common.home')}</Link>
          {' · '}
          <Link to="/board" className="text-amber-600 hover:underline">{t('common.board')}</Link>
        </p>
      </div>
    </div>
  )
}
