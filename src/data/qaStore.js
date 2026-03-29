// 旅行问答社区 — 本地存储，增强互动与归属感
const STORAGE_QUESTIONS = 'budget-travel-qa-questions'
const STORAGE_ANSWERS = 'budget-travel-qa-answers'

function loadQuestions() {
  try {
    const raw = localStorage.getItem(STORAGE_QUESTIONS)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function saveQuestions(list) {
  try {
    localStorage.setItem(STORAGE_QUESTIONS, JSON.stringify(list))
  } catch {}
}

function loadAnswers() {
  try {
    const raw = localStorage.getItem(STORAGE_ANSWERS)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function saveAnswers(list) {
  try {
    localStorage.setItem(STORAGE_ANSWERS, JSON.stringify(list))
  } catch {}
}

function nextId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * @typedef {{ id: string, title: string, content: string, author: string, destination?: string, createdAt: string }} Question
 * @typedef {{ id: string, questionId: string, content: string, author: string, createdAt: string }} Answer
 */

/** @param {Partial<Question>} q */
export function addQuestion(q) {
  const list = loadQuestions()
  const id = q.id || nextId('q')
  const createdAt = q.createdAt || new Date().toISOString()
  const entry = {
    id,
    title: (q.title || '').trim(),
    content: (q.content || '').trim(),
    author: (q.author || '').trim() || '旅友',
    destination: (q.destination || '').trim() || undefined,
    createdAt,
  }
  list.unshift(entry)
  saveQuestions(list)
  return entry
}

/** @param {Partial<Answer>} a */
export function addAnswer(a) {
  const list = loadAnswers()
  const id = a.id || nextId('a')
  const createdAt = a.createdAt || new Date().toISOString()
  const entry = {
    id,
    questionId: a.questionId || '',
    content: (a.content || '').trim(),
    author: (a.author || '').trim() || '旅友',
    createdAt,
  }
  list.push(entry)
  saveAnswers(list)
  return entry
}

/** @returns {Question[]} 按时间倒序 */
export function getAllQuestions() {
  return [...loadQuestions()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/** @param {string} questionId */
export function getQuestionById(questionId) {
  return loadQuestions().find((q) => q.id === questionId) || null
}

/** @param {string} questionId */
export function getAnswersByQuestionId(questionId) {
  return loadAnswers()
    .filter((a) => a.questionId === questionId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
}
