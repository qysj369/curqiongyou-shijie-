import { useTranslation } from 'react-i18next'

/**
 * 广告位占位：后续可接入广告脚本（佣金/广告变现）
 * @param {{ slotId?: string, className?: string }} props
 */
export default function AdSlot({ slotId = '', className = '' }) {
  const { t } = useTranslation()
  return (
    <div
      className={`rounded-xl border border-dashed border-slate-200 bg-slate-100/50 flex flex-col items-center justify-center min-h-[100px] ${className}`}
      data-ad-slot={slotId || undefined}
    >
      <span className="text-slate-400 text-xs font-medium">{t('commerce.adLabel')}</span>
      {slotId && <span className="text-slate-300 text-xs mt-0.5">{slotId}</span>}
    </div>
  )
}
