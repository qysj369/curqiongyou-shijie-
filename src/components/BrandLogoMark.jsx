/**
 * 内联 R 标（不依赖 /public 请求，避免路径/缓存导致「换了图还是老样子」）。
 * 若改造型：改此处并与 public/brand/logo-mark.svg 保持一致（外链/分享图用）。
 */
export default function BrandLogoMark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M9 7v18"
        stroke="#0c4a6e"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      <path
        d="M9 7h6.5q5.5 0 5.5 5.2v0.6q0 5.2-5.5 5.2H9"
        stroke="#0c4a6e"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8 17.8 22 25"
        stroke="#ea580c"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
    </svg>
  )
}
