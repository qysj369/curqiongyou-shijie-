import { useTranslation } from 'react-i18next'
import { useToast } from '../contexts/ToastContext'

const defaultClass =
  'px-4 py-2.5 min-h-11 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition print:hidden'

/**
 * 复制当前页完整 URL（含 query），成功 / 失败均有 Toast。
 */
export default function CopyPageLinkButton({ className = '' }) {
  const { t } = useTranslation()
  const { toast } = useToast()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast(t('share.linkCopied'))
    } catch {
      toast(t('common.copyFailed'))
    }
  }

  return (
    <button type="button" onClick={copy} className={`${defaultClass} ${className}`.trim()}>
      {t('a11y.copyPageLink')}
    </button>
  )
}
