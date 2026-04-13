import { useTranslation } from 'react-i18next'

export const STORAGE_PREFIX = 'tv4-helpful-'

/**
 * 点评「有用」——由父组件传入票数与是否已投，便于列表排序联动
 */
export default function ReviewHelpfulButton({ count = 0, voted = false, onVote, reviewId = '' }) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      disabled={voted}
      onClick={() => onVote?.(reviewId)}
      className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-sm font-medium border transition min-h-9 ${
        voted
          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:bg-emerald-50/80 dark:hover:bg-slate-800'
      }`}
    >
      <span aria-hidden>👍</span>
      {voted ? t('travelerVoice.helpfulThanks') : t('travelerVoice.helpful')}
      <span className="tabular-nums text-slate-500 dark:text-slate-400">({count})</span>
    </button>
  )
}
