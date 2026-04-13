import { useTranslation } from 'react-i18next'

/** 路由懒加载时的全页占位（含简单加载动画） */
export default function PageFallback() {
  const { t } = useTranslation()
  return (
    <div
      className="min-h-[40vh] flex flex-col items-center justify-center px-4 bg-slate-50 dark:bg-slate-950"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="w-11 h-11 border-[3px] border-amber-200 dark:border-slate-600 border-t-amber-600 dark:border-t-amber-500 rounded-full animate-spin mb-4"
        aria-hidden
      />
      <p className="text-slate-600 dark:text-slate-400 text-sm">{t('ui.pageLoading')}</p>
    </div>
  )
}
