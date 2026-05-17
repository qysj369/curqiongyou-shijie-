import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../components/Breadcrumbs'
import CopyPageLinkButton from '../components/CopyPageLinkButton'

/** @typedef {'ready' | 'partial' | 'demo' | 'notYet'} ReadinessStatus */

const STATUS_BADGE_CLASS = {
  ready: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/35 dark:text-emerald-100',
  partial: 'bg-amber-100 text-amber-950 dark:bg-amber-900/40 dark:text-amber-100',
  demo: 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100',
  notYet: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
}

const SECTIONS = /** @type {const} */ ([
  {
    titleKey: 'chinaReadiness.sectionProductTitle',
    leadKey: 'chinaReadiness.sectionProductLead',
    items: [
      { titleKey: 'chinaReadiness.itemLocaleTitle', descKey: 'chinaReadiness.itemLocaleDesc', status: 'ready' },
      { titleKey: 'chinaReadiness.itemMoneyTitle', descKey: 'chinaReadiness.itemMoneyDesc', status: 'ready' },
      { titleKey: 'chinaReadiness.itemRoutesTitle', descKey: 'chinaReadiness.itemRoutesDesc', status: 'demo' },
      { titleKey: 'chinaReadiness.itemFavoritesTitle', descKey: 'chinaReadiness.itemFavoritesDesc', status: 'ready' },
    ],
  },
  {
    titleKey: 'chinaReadiness.sectionMapTitle',
    leadKey: 'chinaReadiness.sectionMapLead',
    items: [
      { titleKey: 'chinaReadiness.itemHomeMapTitle', descKey: 'chinaReadiness.itemHomeMapDesc', status: 'demo' },
      { titleKey: 'chinaReadiness.itemAmapKeyTitle', descKey: 'chinaReadiness.itemAmapKeyDesc', status: 'partial' },
      { titleKey: 'chinaReadiness.itemGeoTitle', descKey: 'chinaReadiness.itemGeoDesc', status: 'demo' },
    ],
  },
  {
    titleKey: 'chinaReadiness.sectionAiTitle',
    leadKey: 'chinaReadiness.sectionAiLead',
    items: [
      { titleKey: 'chinaReadiness.itemTripAiTitle', descKey: 'chinaReadiness.itemTripAiDesc', status: 'partial' },
      { titleKey: 'chinaReadiness.itemAdvisorTitle', descKey: 'chinaReadiness.itemAdvisorDesc', status: 'partial' },
      { titleKey: 'chinaReadiness.itemLibraryTitle', descKey: 'chinaReadiness.itemLibraryDesc', status: 'partial' },
      { titleKey: 'chinaReadiness.itemStewardTitle', descKey: 'chinaReadiness.itemStewardDesc', status: 'partial' },
    ],
  },
  {
    titleKey: 'chinaReadiness.sectionCommunityTitle',
    leadKey: 'chinaReadiness.sectionCommunityLead',
    items: [
      { titleKey: 'chinaReadiness.itemQaTitle', descKey: 'chinaReadiness.itemQaDesc', status: 'ready' },
      { titleKey: 'chinaReadiness.itemBoardTitle', descKey: 'chinaReadiness.itemBoardDesc', status: 'ready' },
    ],
  },
  {
    titleKey: 'chinaReadiness.sectionAccountTitle',
    leadKey: 'chinaReadiness.sectionAccountLead',
    items: [
      { titleKey: 'chinaReadiness.itemLoginTitle', descKey: 'chinaReadiness.itemLoginDesc', status: 'notYet' },
      { titleKey: 'chinaReadiness.itemBookingTitle', descKey: 'chinaReadiness.itemBookingDesc', status: 'notYet' },
    ],
  },
])

const BADGE_KEY = {
  ready: 'chinaReadiness.badgeReady',
  partial: 'chinaReadiness.badgePartial',
  demo: 'chinaReadiness.badgeDemo',
  notYet: 'chinaReadiness.badgeNotYet',
}

function StatusBadge({ status }) {
  const { t } = useTranslation()
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_BADGE_CLASS[status]}`}
    >
      {t(BADGE_KEY[status])}
    </span>
  )
}

export default function ChinaReadinessPage() {
  const { t } = useTranslation()
  const breadcrumbs = useMemo(
    () => [
      { label: t('common.navMap'), to: '/map' },
      { label: t('footer.about'), to: '/about' },
      { label: t('chinaReadiness.title') },
    ],
    [t],
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <Breadcrumbs items={breadcrumbs} />
          <CopyPageLinkButton />
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            {t('chinaReadiness.title')}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t('chinaReadiness.lead')}</p>
          <p className="mt-3 rounded-xl border border-sky-200 bg-sky-50/90 px-4 py-3 text-sm leading-relaxed text-sky-950 dark:border-sky-800 dark:bg-sky-950/35 dark:text-sky-100">
            {t('chinaReadiness.callout')}
          </p>
        </header>

        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <section
              key={section.titleKey}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{t(section.titleKey)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t(section.leadKey)}</p>
              <ul className="mt-5 space-y-4">
                {section.items.map((item) => (
                  <li
                    key={item.titleKey}
                    className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0 dark:border-slate-700"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 gap-y-2">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t(item.titleKey)}</h3>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t(item.descKey)}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <footer className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-5 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
          <p>{t('chinaReadiness.footerNote')}</p>
          <p className="mt-3">
            <Link to="/about#about-china-market" className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-300">
              {t('chinaReadiness.backToAbout')}
            </Link>
          </p>
        </footer>
      </div>
    </div>
  )
}
