import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../components/Breadcrumbs'

const CARDS = [
  { to: '/community/qa', key: 'qa', icon: '💬', descKey: 'community.qaDesc' },
  { to: '/community/buddies', key: 'buddies', icon: '🤝', descKey: 'community.buddiesDesc' },
  { to: '/board', key: 'board', icon: '📋', descKey: 'community.boardDesc' },
  { to: '/articles', key: 'articles', icon: '📝', descKey: 'community.articlesDesc' },
]

export default function Community() {
  const { t } = useTranslation()
  const breadcrumbs = [
    { label: t('common.home'), to: '/' },
    { label: t('community.title') },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            {t('community.heroTitle')}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-2">
            {t('community.heroSubtitle')}
          </p>
          <p className="text-slate-500 text-sm">
            {t('community.belonging')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {CARDS.map(({ to, key, icon, descKey }) => (
            <Link
              key={key}
              to={to}
              className="group block bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition border border-slate-100"
            >
              <span className="text-4xl mb-3 block" aria-hidden>{icon}</span>
              <h2 className="text-xl font-bold text-slate-800 group-hover:text-amber-600 transition mb-2">
                {t(`community.${key}`)}
              </h2>
              <p className="text-slate-600 text-sm">
                {t(descKey)}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-amber-50/80 rounded-2xl border border-amber-100 text-center">
          <p className="text-slate-700 font-medium">
            {t('community.oneFamily')}
          </p>
          <p className="text-slate-600 text-sm mt-1">
            {t('community.localHint')}
          </p>
        </div>
      </div>
    </div>
  )
}
