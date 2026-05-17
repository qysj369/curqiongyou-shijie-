import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'rw-site-cap-hint-dismissed'

export default function SiteCapabilityHint() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return
    } catch {
      /* ignore */
    }
    setVisible(true)
  }, [])

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label={t('common.siteCapabilityHintAria')}
      className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 leading-relaxed">
          <span className="font-semibold">{t('common.siteCapabilityHintTitle')} </span>
          {t('common.siteCapabilityHintBody')}
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link
            to="/about#outline-tech"
            className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            {t('common.siteCapabilityHintLink')}
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/50 dark:text-amber-50 dark:hover:bg-amber-900"
          >
            {t('common.siteCapabilityHintDismiss')}
          </button>
        </div>
      </div>
    </div>
  )
}
