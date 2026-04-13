import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../components/Breadcrumbs'
import AdSlot from '../components/AdSlot'
import DiscoverShowcase from '../components/DiscoverShowcase'

const BENEFITS = [
  { key: 'benefit1', icon: '📖' },
  { key: 'benefit2', icon: '🎫' },
  { key: 'benefit3', icon: '👥' },
  { key: 'benefit4', icon: '🚫' },
]

export default function Membership() {
  const { t } = useTranslation()
  const memberUrl = (import.meta.env.VITE_MEMBERSHIP_URL || '').trim()

  const breadcrumbs = [
    { label: t('common.home'), to: '/' },
    { label: t('commerce.membership') },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            {t('commerce.membership')}
          </h1>
          <p className="text-slate-600">{t('commerce.membershipSub')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">{t('commerce.benefitsTitle')}</h2>
          <ul className="space-y-4">
            {BENEFITS.map(({ key, icon }) => (
              <li key={key} className="flex gap-3 items-start">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <span className="text-slate-700">{t(`commerce.${key}`)}</span>
              </li>
            ))}
          </ul>
          {memberUrl ? (
            <a
              href={memberUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block px-8 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition min-h-11"
            >
              {t('commerce.ctaSubscribe')}
            </a>
          ) : (
            <Link
              to="/about"
              className="mt-6 inline-block px-8 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition min-h-11"
            >
              {t('commerce.ctaJoinInternal')}
            </Link>
          )}
          <p className="text-slate-500 text-sm mt-3">{t('commerce.membershipNote')}</p>
        </div>

        <div className="mb-8 print:hidden">
          <AdSlot slotId="membership-side" />
        </div>

        <DiscoverShowcase className="mb-8" />

        <p className="text-slate-500 text-xs text-center">
          {t('commerce.disclosure')}
        </p>
      </div>
    </div>
  )
}
