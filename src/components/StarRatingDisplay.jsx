/**
 * 星级 + 分数 + 条数（猫途鹰式口碑条展示）
 */
export default function StarRatingDisplay({
  value = 0,
  reviewCount,
  size = 'md',
  className = '',
  showCount = true,
  /** 深色底图（如目的地头图）上使用浅色星星与文字 */
  tone = 'light',
}) {
  const v = Number.isFinite(Number(value)) ? Number(value) : 0
  const full = Math.min(5, Math.max(0, Math.round(v)))
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'
  const starSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg'
  const starOn = tone === 'dark' ? 'text-emerald-300' : 'text-emerald-500'
  const starOff = tone === 'dark' ? 'text-white/25' : 'text-slate-300 dark:text-slate-600'
  const numCls = tone === 'dark' ? 'text-white' : 'text-slate-800 dark:text-slate-100'
  const cntCls = tone === 'dark' ? 'text-white/85' : 'text-slate-500 dark:text-slate-400'

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className={`flex ${starSize} leading-none`} aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= full ? starOn : starOff}>
            ★
          </span>
        ))}
      </span>
      <span className={`font-bold ${numCls} ${textSize}`}>{v.toFixed(1)}</span>
      {showCount && reviewCount != null && (
        <span className={`${cntCls} text-sm`}>
          （{Number(reviewCount).toLocaleString()}）
        </span>
      )}
    </div>
  )
}
