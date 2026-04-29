import { useTranslation } from 'react-i18next'

/**
 * 攻略「推荐度」条：相对同一目的地下攻略的热度归一化（演示）
 */
export default function GuideRecommendBar({ percent = 0 }) {
  const { t } = useTranslation()
  const p = Math.min(100, Math.max(0, Math.round(Number(percent) || 0)))
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs text-emerald-800 dark:text-emerald-300 mb-1">
        <span>{t('destinationDetail.recommendLabel')}</span>
        <span className="tabular-nums font-semibold">{p}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden" role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-sky-400"
          style={{ width: `${p}%` }}
        />
      </div>
    </div>
  )
}
