import { Link } from 'react-router-dom'

const actionBtnClass =
  'inline-flex min-h-11 min-w-[7rem] items-center justify-center px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'

/**
 * 列表/区块无数据时的友好空状态
 * @param {string} [emoji]
 * @param {string} title
 * @param {string} [description]
 * @param {string} [actionTo]
 * @param {string} [actionLabel]
 * @param {() => void} [onAction] 与 actionLabel 同时传入时渲染按钮（用于清除筛选等）
 */
export default function EmptyState({ emoji = '📭', title, description, actionTo, actionLabel, onAction }) {
  const showLink = actionTo && actionLabel && !onAction
  const showButton = actionLabel && onAction

  return (
    <div
      className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/90 px-5 py-10 text-center dark:border-slate-600 dark:bg-slate-900/60"
      role="status"
    >
      <div className="text-4xl mb-3 select-none" aria-hidden>
        {emoji}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
      {description ? (
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-md mx-auto mb-5">
          {description}
        </p>
      ) : null}
      {showButton ? (
        <button type="button" onClick={onAction} className={actionBtnClass} aria-label={actionLabel}>
          {actionLabel}
        </button>
      ) : showLink ? (
        <Link to={actionTo} className={actionBtnClass}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
