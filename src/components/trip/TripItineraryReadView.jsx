import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import { formatItineraryDayShareText, formatItineraryLegSummary } from '../../utils/tripItineraryText.js'
import { buildCommunityBuddiesHref, buildCommunityQaHref } from '../../utils/tripCommunityBridge.js'

const KIND_STYLE = {
  blue: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100',
  orange: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100',
}

const KIND_LABEL_KEY = {
  blue: 'tripAiPage.kindBlue',
  green: 'tripAiPage.kindGreen',
  orange: 'tripAiPage.kindOrange',
}

/**
 * 行程「阅读视图」：以分日叙事为主，弱化 JSON/技术字段。
 * @param {{ spec: object, destinationFallback?: string }} props
 */
export default function TripItineraryReadView({ spec, destinationFallback = '' }) {
  const { t } = useTranslation()
  const { toast } = useToast()

  const copyDayShare = useCallback(
    async (dayNum) => {
      const text = formatItineraryDayShareText(spec, dayNum)
      if (!text) return
      try {
        await navigator.clipboard.writeText(text)
        toast(t('tripAiPage.copyDayShareOk'))
      } catch {
        toast(t('tripAiPage.copyDayShareFail'))
      }
    },
    [spec, t, toast],
  )

  if (!spec) return null

  const dest = spec.destination || destinationFallback
  const guidesHref = dest
    ? `/routes?destination=${encodeURIComponent(dest)}`
    : '/routes'

  return (
    <article className="trip-print-area mt-4 space-y-5 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
      <p className="rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
        {formatItineraryLegSummary(spec) || t('tripAiPage.readSummaryFallback')}
      </p>

      <p className="text-xs text-slate-500 dark:text-slate-400 print:hidden">
        <Link to={guidesHref} className="font-semibold text-sky-700 underline-offset-2 hover:underline dark:text-sky-300">
          {t('tripAiPage.readGuidesLink', { dest: dest || t('tripAiPage.readGuidesGeneric') })}
        </Link>
      </p>

      {(spec.days || []).map((d) => (
        <section
          key={d.day}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 print:break-inside-avoid print:shadow-none"
          aria-labelledby={`trip-day-${d.day}-title`}
        >
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 id={`trip-day-${d.day}-title`} className="text-base font-bold text-slate-900 dark:text-slate-50">
                {t('tripAiPage.readDayHeading', { day: d.day, theme: d.theme })}
              </h3>
              <span className="text-xs font-medium text-slate-500">
                {t('tripAiPage.dayBudget', { amount: d.dayBudget })}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void copyDayShare(d.day)}
              className="print:hidden min-h-9 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t('tripAiPage.copyDayShare')}
            </button>
          </header>
          <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{t('tripAiPage.transport')}</span>
            {d.transport}
          </p>
          <ol className="mt-4 space-y-3">
            {(d.pois || []).map((p, idx) => {
              const poiSearch = `/routes?destination=${encodeURIComponent(dest || '')}&keyword=${encodeURIComponent(p.name || '')}`
              const guideHref = p.guideArticleId ? `/routes/${p.guideArticleId}` : poiSearch
              return (
                <li
                  key={`${d.day}-${p.name}-${idx}`}
                  className={`rounded-xl border px-3 py-2.5 ${KIND_STYLE[p.kind] || KIND_STYLE.blue}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold">{p.name}</p>
                    <Link
                      to={guideHref}
                      className="print:hidden shrink-0 text-xs font-semibold text-sky-800 underline-offset-2 hover:underline dark:text-sky-200"
                    >
                      {p.guideArticleId ? t('tripAiPage.poiGuideLink') : t('tripAiPage.poiSearchGuide')}
                    </Link>
                  </div>
                  <p className="mt-1 text-xs opacity-90">
                    {t(KIND_LABEL_KEY[p.kind] || 'tripAiPage.kindBlue')}
                    {p.budgetHint ? ` · ${p.budgetHint}` : ''}
                    {p.guideStationKey
                      ? ` · ${t('tripAiPage.stationTag', { key: p.guideStationKey })}`
                      : ''}
                  </p>
                </li>
              )
            })}
          </ol>
        </section>
      ))}

      {dest ? (
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs print:hidden">
          <Link
            to={buildCommunityQaHref({ destination: dest })}
            className="font-semibold text-emerald-800 underline-offset-2 hover:underline dark:text-emerald-200"
          >
            {t('tripAiPage.readCommunityLink', { dest })}
          </Link>
          <Link
            to={buildCommunityBuddiesHref({ destination: dest })}
            className="font-semibold text-amber-800 underline-offset-2 hover:underline dark:text-amber-200"
          >
            {t('tripAiPage.readBuddiesLink', { dest })}
          </Link>
        </p>
      ) : null}

      {(spec.replacements || []).length ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
          <h4 className="font-bold text-emerald-900 dark:text-emerald-200">{t('tripAiPage.replacementsTitle')}</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-emerald-900/90 dark:text-emerald-100/90">
            {spec.replacements.map((r, i) => (
              <li key={i}>{t('tripAiPage.replacementLine', { from: r.from, to: r.to, save: r.save })}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
