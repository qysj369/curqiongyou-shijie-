import { useTranslation } from 'react-i18next'

/**
 * 原生 details/summary 折叠面板（概况区长文）
 * @param {{ open?: boolean; onOpenChange?: (open: boolean) => void }} [props] 传入 open 时为受控模式，便于脚本展开（如目的地页签证卡片）
 */
export default function CollapsibleDetails({
  id,
  title,
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  className = '',
}) {
  const { t } = useTranslation()
  const controlled = typeof open === 'boolean'
  return (
    <details
      id={id}
      className={`collapse-panel group bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden ${className}`}
      {...(controlled
        ? {
            open,
            onToggle: (e) => onOpenChange?.(e.currentTarget.open),
          }
        : { defaultOpen })}
    >
      <summary className="cursor-pointer px-5 md:px-6 py-4 flex items-center justify-between gap-3 font-bold text-slate-800 dark:text-slate-100 list-none min-h-11 hover:bg-slate-50/90 dark:hover:bg-slate-800/60 transition select-none">
        <span className="text-lg">{title}</span>
        <span className="text-slate-400 text-xs font-medium shrink-0 flex items-center gap-1">
          <span className="group-open:hidden">{t('destinationDetail.tapExpand')}</span>
          <span className="hidden group-open:inline">{t('destinationDetail.tapCollapse')}</span>
          <span className="inline-block transition-transform group-open:rotate-180" aria-hidden>
            ▼
          </span>
        </span>
      </summary>
      <div className="px-5 md:px-6 pb-5 pt-0 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
        {children}
      </div>
    </details>
  )
}
