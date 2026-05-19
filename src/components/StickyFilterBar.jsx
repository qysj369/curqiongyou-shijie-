/** 路书筛选：手机端随页滚动；宽屏吸顶，避免小屏下半屏被白块占满。 */
export default function StickyFilterBar({ children }) {
  return (
    <div className="relative z-10 mb-8 lg:sticky lg:top-16 lg:z-20 lg:-mx-4 lg:border-y lg:border-slate-200/80 lg:bg-white/92 lg:px-4 lg:py-2 lg:backdrop-blur-md dark:lg:border-slate-800/80 dark:lg:bg-slate-950/92 lg:rounded-xl lg:border lg:shadow-[0_2px_10px_rgba(2,6,23,0.06)]">
      {children}
    </div>
  )
}
