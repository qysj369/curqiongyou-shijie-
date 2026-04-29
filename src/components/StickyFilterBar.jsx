export default function StickyFilterBar({ children }) {
  return (
    <div className="sticky top-16 z-20 -mx-4 mb-8 border-y border-slate-200/80 bg-white/92 px-4 py-2 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/92 md:rounded-xl md:border md:shadow-[0_2px_10px_rgba(2,6,23,0.06)]">
      {children}
    </div>
  )
}
