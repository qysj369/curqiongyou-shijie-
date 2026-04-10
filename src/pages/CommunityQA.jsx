import { useState, useMemo, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useToast } from '../contexts/ToastContext'
import { containsProfanity } from '../utils/profanityFilter'
import { getAllQuestions, addQuestion, getQuestionById, getAnswersByQuestionId, addAnswer } from '../data/qaStore'
import { destinations } from '../data/mockData'
import Breadcrumbs from '../components/Breadcrumbs'
import CommunityGuidelines from '../components/CommunityGuidelines'
import { useSeoOverride } from '../contexts/SeoOverrideContext'
import { excerptForMeta } from '../utils/seoExcerpt'

const destinationNames = [...new Set(destinations.map((d) => d.name).filter(Boolean))].sort()

export default function CommunityQA() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [questions, setQuestions] = useState(getAllQuestions)
  const [destFilter, setDestFilter] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formDest, setFormDest] = useState('')
  const [formAuthor, setFormAuthor] = useState('')

  const filtered = useMemo(() => {
    let list = [...questions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (destFilter) list = list.filter((q) => q.destination === destFilter)
    return list
  }, [questions, destFilter])

  const handleAsk = (e) => {
    e.preventDefault()
    const title = formTitle.trim()
    const content = formContent.trim()
    if (!title) {
      toast(t('qa.titleRequired'))
      return
    }
    if (!content) {
      toast(t('qa.contentRequired'))
      return
    }
    if (containsProfanity(title + content + formAuthor)) {
      toast(t('board.noProfanity'))
      return
    }
    addQuestion({
      title,
      content,
      author: formAuthor.trim() || t('qa.anonymous'),
      destination: formDest.trim() || undefined,
    })
    setQuestions(getAllQuestions())
    setFormTitle('')
    setFormContent('')
    setFormDest('')
    setFormAuthor('')
    toast(t('qa.questionSubmitted'))
  }

  const breadcrumbs = [
    { label: t('common.home'), to: '/' },
    { label: t('community.title'), to: '/community' },
    { label: t('community.qa') },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('community.qa')}</h1>
        <p className="text-slate-600 mb-6">{t('qa.subtitle')}</p>

        <CommunityGuidelines className="mb-6" />

        <form onSubmit={handleAsk} className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">{t('qa.askQuestion')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('qa.questionTitle')} *</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder={t('qa.titlePlaceholder')}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400"
                maxLength={120}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('qa.questionDetail')} *</label>
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder={t('qa.contentPlaceholder')}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 resize-y"
                maxLength={1000}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">{t('qa.destinationOptional')}</label>
                <select
                  value={formDest}
                  onChange={(e) => setFormDest(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">{t('qa.none')}</option>
                  {destinationNames.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">{t('qa.yourName')}</label>
                <input
                  type="text"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  placeholder={t('qa.anonymous')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400"
                  maxLength={30}
                />
              </div>
            </div>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition">
              {t('qa.submitQuestion')}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-slate-600 font-medium text-sm">{t('qa.filterByDest')}</span>
          <select
            value={destFilter}
            onChange={(e) => setDestFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm focus:ring-2 focus:ring-amber-400"
          >
            <option value="">{t('qa.allDestinations')}</option>
            {destinationNames.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-slate-500 text-center py-8">{t('qa.noQuestionsYet')}</p>
          ) : (
            filtered.map((q) => (
              <Link
                key={q.id}
                to={`/community/qa/${q.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-slate-100"
              >
                <h3 className="font-semibold text-slate-800 line-clamp-2">{q.title}</h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2">{q.content}</p>
                <p className="text-slate-400 text-xs mt-2">
                  {q.author} · {q.createdAt.slice(0, 10)}
                  {q.destination && ` · ${q.destination}`}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export function QADetail() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { id } = useParams()
  const { setOverride, clear } = useSeoOverride()
  const question = id ? getQuestionById(id) : null
  const [answers, setAnswers] = useState(() => (id ? getAnswersByQuestionId(id) : []))
  const [answerContent, setAnswerContent] = useState('')
  const [answerAuthor, setAnswerAuthor] = useState('')

  useEffect(() => {
    if (!question) {
      clear()
      return undefined
    }
    let desc = excerptForMeta(question.content)
    if (answers.length > 0) {
      desc = `${desc}${desc ? ' · ' : ''}${answers.length} ${t('qa.answers')}`
    }
    if (question.destination) {
      desc = `${desc}${desc ? ' · ' : ''}${question.destination}`
    }
    if (!desc) desc = t('seo.description')
    desc = desc.slice(0, 160)
    setOverride({
      title: t('seo.pageTitleTemplate', { page: question.title, site: t('common.siteName') }),
      description: desc,
    })
    return () => clear()
  }, [question, answers.length, t, setOverride, clear])

  const handleAnswer = (e) => {
    e.preventDefault()
    const content = answerContent.trim()
    if (!content) {
      toast(t('qa.answerRequired'))
      return
    }
    if (containsProfanity(content + answerAuthor)) {
      toast(t('board.noProfanity'))
      return
    }
    if (!id) return
    addAnswer({ questionId: id, content, author: answerAuthor.trim() || t('qa.anonymous') })
    setAnswers(getAnswersByQuestionId(id))
    setAnswerContent('')
    setAnswerAuthor('')
    toast(t('qa.answerSubmitted'))
  }

  const breadcrumbs = question
    ? [
        { label: t('common.home'), to: '/' },
        { label: t('community.title'), to: '/community' },
        { label: t('community.qa'), to: '/community/qa' },
        { label: question.title.slice(0, 20) + (question.title.length > 20 ? '…' : '') },
      ]
    : []

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">{t('qa.questionNotFound')}</p>
        <Link to="/community/qa" className="ml-2 text-amber-600 hover:underline">{t('qa.backToList')}</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <Link to="/community/qa" className="text-amber-600 hover:underline text-sm mb-4 inline-block">{t('qa.backToList')}</Link>

        <article className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{question.title}</h1>
          <p className="text-slate-500 text-sm mb-4">{question.author} · {question.createdAt.slice(0, 10)}{question.destination && ` · ${question.destination}`}</p>
          <div className="text-slate-700 whitespace-pre-wrap">{question.content}</div>
        </article>

        <h2 className="text-lg font-bold text-slate-800 mb-4">{t('qa.answers')} ({answers.length})</h2>

        <form onSubmit={handleAnswer} className="bg-amber-50/80 rounded-xl p-4 mb-6 border border-amber-100">
          <textarea
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder={t('qa.answerPlaceholder')}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400 mb-2 resize-y"
            maxLength={800}
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={answerAuthor}
              onChange={(e) => setAnswerAuthor(e.target.value)}
              placeholder={t('qa.yourName')}
              className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400"
              maxLength={30}
            />
            <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition">
              {t('qa.submitAnswer')}
            </button>
          </div>
        </form>

        <ul className="space-y-4">
          {answers.map((a) => (
            <li key={a.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <p className="text-slate-700 whitespace-pre-wrap">{a.content}</p>
              <p className="text-slate-400 text-xs mt-2">{a.author} · {a.createdAt.slice(0, 10)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
