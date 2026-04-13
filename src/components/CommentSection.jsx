import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { containsProfanity } from '../utils/profanityFilter'
import { useToast } from '../contexts/ToastContext'
import { getPreferredGiscusTheme, postGiscusTheme } from '../utils/giscusTheme'

const STORAGE_KEY = 'budget-travel-my-notes'

function loadNotes(articleId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const all = JSON.parse(raw)
    return Array.isArray(all[articleId]) ? all[articleId] : []
  } catch {
    return []
  }
}

function saveNote(articleId, note) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const all = raw ? JSON.parse(raw) : {}
    if (!Array.isArray(all[articleId])) all[articleId] = []
    all[articleId] = [{ text: note, at: new Date().toISOString() }, ...all[articleId]].slice(0, 20)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {}
}

export default function CommentSection({ articleId, discussionUrl }) {
  const { t, i18n } = useTranslation()
  const { toast } = useToast()
  const [notes, setNotes] = useState([])
  const [input, setInput] = useState('')
  const giscusMountRef = useRef(null)

  const hasGiscus =
    import.meta.env.VITE_GISCUS_REPO &&
    import.meta.env.VITE_GISCUS_REPO_ID &&
    import.meta.env.VITE_GISCUS_CATEGORY_ID

  useEffect(() => {
    if (articleId) setNotes(loadNotes(articleId))
  }, [articleId])

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    if (containsProfanity(text)) {
      toast(t('board.noProfanity'))
      return
    }
    saveNote(articleId, text)
    setNotes(loadNotes(articleId))
    setInput('')
  }

  useEffect(() => {
    if (!hasGiscus || !articleId) return
    const mount = giscusMountRef.current
    if (!mount) return

    mount.innerHTML = ''
    const theme = getPreferredGiscusTheme()
    const mapping = import.meta.env.VITE_GISCUS_MAPPING || 'pathname'
    const lang = i18n.language?.startsWith('zh') ? 'zh-CN' : 'en'

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', import.meta.env.VITE_GISCUS_REPO)
    script.setAttribute('data-repo-id', import.meta.env.VITE_GISCUS_REPO_ID)
    script.setAttribute('data-category', import.meta.env.VITE_GISCUS_CATEGORY || 'Comments')
    script.setAttribute('data-category-id', import.meta.env.VITE_GISCUS_CATEGORY_ID)
    script.setAttribute('data-mapping', mapping)
    if (mapping === 'specific') {
      script.setAttribute('data-term', `article-${articleId}`)
    }
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', theme)
    script.setAttribute('data-lang', lang)
    script.setAttribute('data-loading', 'lazy')

    const div = document.createElement('div')
    div.className = 'giscus'

    mount.appendChild(div)
    mount.appendChild(script)

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onScheme = () => {
      const next = getPreferredGiscusTheme()
      postGiscusTheme(next)
    }
    mq.addEventListener('change', onScheme)

    return () => {
      mq.removeEventListener('change', onScheme)
      mount.innerHTML = ''
    }
  }, [hasGiscus, articleId, i18n.language])

  return (
    <section className="mt-10 print:hidden border-t border-slate-200 dark:border-slate-700 pt-8">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('comments.title')}</h2>

      {hasGiscus ? (
        <>
          <div
            className="mb-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-700 dark:text-slate-200"
            role="note"
          >
            <p className="font-medium text-slate-800 dark:text-slate-100">{t('comments.giscusGithubLogin')}</p>
            <p className="mt-1 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{t('comments.giscusHint')}</p>
          </div>
          <div
            ref={giscusMountRef}
            className="giscus-wrapper mb-8 dark:[color-scheme:dark]"
          />
        </>
      ) : (
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{t('comments.invite')}</p>
      )}

      {discussionUrl && (
        <a
          href={discussionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 min-h-11 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium mb-6"
        >
          <span>{t('comments.discussOnGitHub')}</span>
          <span aria-hidden>→</span>
        </a>
      )}

      <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">{t('comments.myNoteHint')}</p>
        <p className="text-amber-700 dark:text-amber-400/95 text-xs mb-3">{t('board.guidelinesShort')}</p>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap items-stretch sm:items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('comments.placeholder')}
            className="flex-1 min-w-[min(100%,12rem)] min-h-11 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            maxLength={200}
          />
          <button
            type="submit"
            className="min-h-11 px-5 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition text-sm shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            {t('comments.submit')}
          </button>
        </form>
        {notes.length > 0 && (
          <ul className="mt-4 space-y-2">
            {notes.map((n, i) => (
              <li
                key={i}
                className="text-slate-700 dark:text-slate-300 text-sm pl-2 border-l-2 border-amber-200 dark:border-amber-700"
              >
                {n.text}
                <span className="text-slate-400 dark:text-slate-500 text-xs ml-2">
                  {n.at ? new Date(n.at).toLocaleDateString() : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
