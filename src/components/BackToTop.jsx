import { useState, useEffect } from 'react'

const SHOW_AFTER = 400

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 transition focus:outline-none focus:ring-2 focus:ring-amber-400"
      title="返回顶部"
      aria-label="返回顶部"
    >
      <span className="text-lg leading-none">↑</span>
    </button>
  )
}
