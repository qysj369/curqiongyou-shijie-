import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TRAVELMATE_NAME, TRAVELMATE_SYSTEM_PROMPT } from '../../lib/prompts/travelmate.prompt'

const API_URL =
  import.meta.env.VITE_TRAVELMATE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001/api/ai/chat' : '/api/ai/chat')

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function buildPlanDraft(messages) {
  const userText = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.text)
    .join('\n')
  const budgetMatch = userText.match(/(?:预算|budget)[^\d]{0,6}(\d{3,6})/i)
  const daysMatch = userText.match(/(\d{1,2})\s*(?:天|days?)/i)
  const destinationMatch = userText.match(/(?:去|到|想去|目的地)[：:\s]*([A-Za-z\u4e00-\u9fa5]{2,20})/i)
  const budget = budgetMatch ? Number(budgetMatch[1]) : null
  const days = daysMatch ? Number(daysMatch[1]) : null
  const destination = destinationMatch ? destinationMatch[1] : ''

  const tags = [
    /美食|food/i.test(userText) ? '美食优先' : null,
    /海岛|beach/i.test(userText) ? '海岛放松' : null,
    /徒步|hike/i.test(userText) ? '徒步自然' : null,
    /拍照|摄影|photo/i.test(userText) ? '拍照出片' : null,
    /博物馆|历史|museum/i.test(userText) ? '人文历史' : null,
  ].filter(Boolean)

  const split = budget
    ? {
        stay: Math.round(budget * 0.35),
        transport: Math.round(budget * 0.3),
        food: Math.round(budget * 0.2),
        ticket: Math.round(budget * 0.1),
        reserve: Math.round(budget * 0.05),
      }
    : null

  const itinerary = days
    ? [
        `D1：抵达${destination || '目的地'}，熟悉交通，办当地通信卡`,
        `D2-D${Math.max(2, days - 1)}：核心景点 + 低成本体验（步行区/免费博物馆日/夜市）`,
        `D${days}：收尾购物与返程，预留机动时间`,
      ]
    : ['补充出行天数后自动生成日程']

  return {
    budget,
    days,
    destination,
    tags,
    split,
    itinerary,
  }
}

async function fetchTravelmateReply(history, onChunk) {
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt: TRAVELMATE_SYSTEM_PROMPT,
      messages: history.map((m) => ({ role: m.role, content: m.text })),
    }),
  })
  if (!resp.ok) throw new Error(`API ${resp.status}`)
  if (resp.body && typeof resp.body.getReader === 'function') {
    const reader = resp.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let full = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      if (chunk) {
        full += chunk
        onChunk?.(full)
      }
    }
    const tail = decoder.decode()
    if (tail) {
      full += tail
      onChunk?.(full)
    }
    return full.trim()
  }
  const ct = resp.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    const data = await resp.json()
    return String(data?.reply || data?.text || '').trim()
  }
  return (await resp.text()).trim()
}

export default function AIChat({ withDraft = false, autoPrompt = '', autoPromptNonce = 0 }) {
  const [messages, setMessages] = useState([
    {
      id: uid(),
      role: 'assistant',
      text: `嗨，我是${TRAVELMATE_NAME}。告诉我你的预算、天数和出发地，我给你做一版省钱又好玩的穷游方案。`,
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [recording, setRecording] = useState(false)
  const listRef = useRef(null)
  const recognitionRef = useRef(null)
  const lastAutoPromptRef = useRef('')

  const canSend = useMemo(() => input.trim().length > 0 && !thinking, [input, thinking])
  const draft = useMemo(() => buildPlanDraft(messages), [messages])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
    })
  }, [])

  const streamAssistantText = useCallback(async (messageId, text) => {
    let i = 0
    return new Promise((resolve) => {
      const timer = window.setInterval(() => {
        i += 1
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, text: text.slice(0, i), streaming: i < text.length } : m,
          ),
        )
        scrollToBottom()
        if (i >= text.length) {
          window.clearInterval(timer)
          resolve()
        }
      }, 18)
    })
  }, [scrollToBottom])

  const performSend = useCallback(async (rawContent) => {
    const content = String(rawContent || '').trim()
    if (!content || thinking) return
    const userMsg = { id: uid(), role: 'user', text: content }
    const pendingId = uid()
    const pendingMsg = { id: pendingId, role: 'assistant', text: 'AI正在思考...', pending: true }
    const next = [...messages, userMsg]
    setInput('')
    setMessages([...next, pendingMsg])
    setThinking(true)
    scrollToBottom()
    try {
      setMessages((prev) =>
        prev.map((m) => (m.id === pendingId ? { ...m, text: '', pending: false, streaming: true } : m)),
      )
      let lastSnapshot = ''
      const reply = await fetchTravelmateReply(next, (partial) => {
        lastSnapshot = partial
        setMessages((prev) =>
          prev.map((m) => (m.id === pendingId ? { ...m, text: partial, pending: false, streaming: true } : m)),
        )
        scrollToBottom()
      })
      const safeReply =
        (reply || lastSnapshot || '').trim() ||
        '我刚刚没拿到有效回复，你可以再发一次，我会继续帮你规划。'
      if (lastSnapshot.trim() !== safeReply) {
        await streamAssistantText(pendingId, safeReply)
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? { ...m, text: '网络有点波动，我还在。请重试一下，或先告诉我你要去哪里。', pending: false }
            : m,
        ),
      )
    } finally {
      setThinking(false)
      scrollToBottom()
    }
  }, [thinking, messages, scrollToBottom, streamAssistantText])

  const handleSend = useCallback(async () => {
    await performSend(input)
  }, [performSend, input])

  useEffect(() => {
    const prompt = String(autoPrompt || '').trim()
    if (!prompt) return
    const runToken = `${autoPromptNonce}:${prompt}`
    if (lastAutoPromptRef.current === runToken) return
    if (thinking) return
    lastAutoPromptRef.current = runToken
    setInput(prompt)
    const timer = window.setTimeout(() => {
      setInput('')
      void performSend(prompt)
    }, 180)
    return () => window.clearTimeout(timer)
  }, [autoPrompt, autoPromptNonce, thinking, performSend])

  const toggleVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      window.alert('当前浏览器不支持语音识别，请改用手动输入。')
      return
    }
    if (recording && recognitionRef.current) {
      recognitionRef.current.stop()
      setRecording(false)
      return
    }
    const recognition = new SR()
    recognition.lang = 'zh-CN'
    recognition.interimResults = true
    recognition.continuous = false
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0]?.transcript || '')
        .join('')
      setInput(transcript)
    }
    recognition.onend = () => setRecording(false)
    recognition.onerror = () => setRecording(false)
    recognitionRef.current = recognition
    recognition.start()
    setRecording(true)
  }, [recording])

  return (
    <div className={`mx-auto w-full ${withDraft ? 'max-w-7xl' : 'max-w-5xl'}`}>
      <div className={`grid gap-4 ${withDraft ? 'lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]' : 'grid-cols-1'}`}>
        <div className="flex h-[calc(100vh-10rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${m.role === 'assistant' ? 'flex items-start gap-2' : ''}`}>
              {m.role === 'assistant' ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm dark:bg-sky-900/40">
                  🤖
                </div>
              ) : null}
              <div
                className={`rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                }`}
              >
                {m.text}
              </div>
            </div>
          </div>
        ))}
          </div>

          <div className="border-t border-slate-200 p-3 dark:border-slate-700">
            <div className="mb-2 h-5 text-xs text-slate-500 dark:text-slate-400">
              {thinking ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />
                  {TRAVELMATE_NAME} 正在思考...
                </span>
              ) : null}
            </div>
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void handleSend()
                  }
                }}
                rows={2}
                placeholder="例如：预算 3000，7 天，从广州出发，想去东南亚。"
                className="min-h-[44px] flex-1 resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={toggleVoice}
                className={`h-11 rounded-xl border px-3 text-sm ${
                  recording
                    ? 'border-rose-400 bg-rose-50 text-rose-700'
                    : 'border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'
                }`}
                title="语音输入"
              >
                🎤
              </button>
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={!canSend}
                className="h-11 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                发送
              </button>
            </div>
          </div>
        </div>

        {withDraft ? (
          <aside className="h-[calc(100vh-10rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">旅行计划草稿</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">根据当前对话实时生成，可继续让小元细化。</p>

            <div className="mt-4 space-y-4 text-sm">
              <section>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">基础信息</h4>
                <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                  <li>目的地：{draft.destination || '待补充'}</li>
                  <li>预算：{draft.budget ? `¥${draft.budget}` : '待补充'}</li>
                  <li>天数：{draft.days ? `${draft.days} 天` : '待补充'}</li>
                </ul>
              </section>

              <section>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">旅行偏好</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(draft.tags.length ? draft.tags : ['待补充偏好']).map((tag) => (
                    <span key={tag} className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">预算拆分建议</h4>
                {draft.split ? (
                  <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                    <li>住宿：¥{draft.split.stay}</li>
                    <li>交通：¥{draft.split.transport}</li>
                    <li>餐饮：¥{draft.split.food}</li>
                    <li>门票/体验：¥{draft.split.ticket}</li>
                    <li>机动金：¥{draft.split.reserve}</li>
                  </ul>
                ) : (
                  <p className="mt-1 text-slate-500 dark:text-slate-400">补充预算后自动生成。</p>
                )}
              </section>

              <section>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">行程草稿</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
                  {draft.itinerary.map((line) => <li key={line}>{line}</li>)}
                </ul>
              </section>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  )
}
