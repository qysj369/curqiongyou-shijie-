import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { listInbox, unreadCount, markRead, markAllRead } from '../data/notificationsStore'
import { formatDateTime } from '../utils/localeFormat'

export default function NotificationBell() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const panelRef = useRef(null)

  const refresh = () => {
    setItems(listInbox())
    setCount(unreadCount())
  }

  useEffect(() => {
    refresh()
    const onInbox = () => refresh()
    window.addEventListener('budget-travel-inbox', onInbox)
    return () => window.removeEventListener('budget-travel-inbox', onInbox)
  }, [])

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative min-h-11 min-w-11 px-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center justify-center"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t('notifications.inbox')}
      >
        <span className="text-lg" aria-hidden>
          🔔
        </span>
        {count > 0 ? (
          <span className="absolute top-1 right-1 min-w-[1.125rem] h-4 px-1 rounded-full bg-sky-600 text-white text-[10px] font-bold leading-4 text-center">
            {count > 9 ? '9+' : count}
          </span>
        ) : null}
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-[min(100vw-2rem,22rem)] rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-lg z-[60] py-2 max-h-[min(70vh,24rem)] overflow-y-auto">
          <div className="flex items-center justify-between px-3 pb-2 border-b border-slate-100 dark:border-slate-700">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t('notifications.inbox')}</span>
            {items.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  markAllRead()
                  refresh()
                }}
                className="text-xs text-sky-700 dark:text-sky-300 hover:underline min-h-8 px-1"
                aria-label={t('a11y.markAllNotificationsRead')}
              >
                {t('notifications.markAllRead')}
              </button>
            ) : null}
          </div>
          {items.length === 0 ? (
            <p className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{t('notifications.empty')}</p>
          ) : (
            <ul className="py-1">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!n.read) markRead(n.id)
                      refresh()
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 ${n.read ? 'opacity-75' : ''}`}
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-100 block">{n.title}</span>
                    {n.body ? <span className="text-slate-600 dark:text-slate-400 text-xs mt-0.5 block leading-snug">{n.body}</span> : null}
                    <span className="text-slate-400 text-[10px] mt-1 block">
                      {n.at ? formatDateTime(n.at, i18n.language) : ''}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="px-3 pt-2 pb-1 text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700 leading-relaxed">
            {t('governance.notificationsEmailHint')}
          </p>
        </div>
      )}
    </div>
  )
}
