import BrandLogoMark from './BrandLogoMark'
import { brandLogoLockupUrl } from '../config/brandLogo'

const SIZE_CLASS = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
}

const LOCKUP_H = {
  sm: 'h-7 sm:h-8',
  md: 'h-8 sm:h-9',
}

/** 仅「Roamwise」一字时使用分色字标（Roam 橙 / wise 深蓝） */
function isRoamwiseWordmark(s) {
  if (s == null || typeof s !== 'string') return false
  const t = s.replace(/\u200b/g, '').trim()
  return /^Roamwise$/i.test(t)
}

function RoamwiseSplitWordmark({ compact = false }) {
  const text = compact ? 'text-base' : 'text-xl'
  return (
    <span className={`font-bold ${text} tracking-tight truncate`}>
      <span className="text-sky-700 dark:text-sky-300">Roam</span>
      <span className="text-emerald-600 dark:text-emerald-300">wise</span>
    </span>
  )
}

/**
 * 品牌标识
 * - variant="lockup"：横版 PNG（图标+字），不含额外字标
 * - variant="mark"：内联 R 标 + 可选字标
 */
export default function BrandLogo({
  variant = 'lockup',
  /** 深色底上垫白底，避免白底 PNG 发灰边 */
  lockupOnDark = false,
  showWordmark = true,
  wordmark,
  wordmarkStyle = 'auto',
  size = 'md',
  className = '',
  wordmarkClassName = 'font-bold text-xl text-sky-700 dark:text-sky-300 tracking-tight truncate',
}) {
  const useSplit =
    showWordmark &&
    (wordmarkStyle === 'roamwiseSplit' ||
      (wordmarkStyle === 'auto' && isRoamwiseWordmark(wordmark)))

  const box = SIZE_CLASS[size] || SIZE_CLASS.md
  const lockupH = LOCKUP_H[size] || LOCKUP_H.md
  const src = brandLogoLockupUrl()

  if (variant === 'lockup') {
    const img = (
      <img
        src={src}
        alt=""
        width={220}
        height={40}
        decoding="async"
        className={`${lockupH} w-auto max-w-[min(100%,260px)] object-contain object-left`}
      />
    )
    const matClass = lockupOnDark
      ? 'inline-flex rounded-md bg-white px-2 py-1 shadow-sm'
      : 'inline-flex dark:rounded-md dark:bg-white dark:px-2 dark:py-1'
    return (
      <span className={`inline-flex items-center min-w-0 ${className}`}>
        <span className={matClass}>{img}</span>
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-2 min-w-0 ${className}`}>
      <BrandLogoMark className={`${box} shrink-0`} />
      {showWordmark && wordmark != null && String(wordmark).length > 0 ? (
        useSplit && isRoamwiseWordmark(wordmark) ? (
          <RoamwiseSplitWordmark compact={size === 'sm'} />
        ) : (
          <span className={wordmarkClassName}>{wordmark}</span>
        )
      ) : null}
    </span>
  )
}
