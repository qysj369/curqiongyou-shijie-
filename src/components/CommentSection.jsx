import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { containsProfanity } from '../utils/profanityFilter'
import { useToast } from '../contexts/ToastContext'

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
  const { t } = useTranslation()
  const { toast } = useToast()
  const [notes, setNotes] = useState([])
  const [input, setInput] = useState('')

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

  const hasGiscus = import.meta.env.VITE_GISCUS_REPO
  useEffect(() => {
    if (!hasGiscus) return
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', import.meta.env.VITE_GISCUS_REPO)
    script.setAttribute('data-repo-id', import.meta.env.VITE_GISCUS_REPO_ID || '')
    script.setAttribute('data-category', import.meta.env.VITE_GISCUS_CATEGORY || 'Comments')
    script.setAttribute('data-category-id', import.meta.env.VITE_GISCUS_CATEGORY_ID || '')
    script.setAttribute('data-mapping', 'title')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-theme', 'light')
    script.async = true
    document.body.appendChild(script)
    return () => { script.remove() }
  }, [hasGiscus])

  return (
    <section className="mt-10 print:hidden border-t border-slate-200 pt-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4">{t('comments.title')}</h2>

      {hasGiscus ? (
        <div className="giscus mb-8" />
      ) : (
        <p className="text-slate-600 text-sm mb-4">{t('comments.invite')}</p>
      )}

      {discussionUrl && (
        <a href={discussionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 text-sm font-medium mb-6">
          <span>{t('comments.discussOnGitHub')}</span>
          <span aria-hidden>→</span>
        </a>
      )}

      <div className="bg-slate-50 rounded-xl p-4">
        <p className="text-slate-600 text-sm mb-1">{t('comments.myNoteHint')}</p>
        <p className="text-amber-700 text-xs mb-3">{t('board.guidelinesShort')}</p>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('comments.placeholder')}
            className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            maxLength={200}
          />
          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition text-sm">
            {t('comments.submit')}
          </button>
        </form>
        {notes.length > 0 && (
          <ul className="mt-4 space-y-2">
            {notes.map((n, i) => (
              <li key={i} className="text-slate-700 text-sm pl-2 border-l-2 border-amber-200">
                {n.text}
                <span className="text-slate-400 text-xs ml-2">{n.at ? new Date(n.at).toLocaleDateString() : ''}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
