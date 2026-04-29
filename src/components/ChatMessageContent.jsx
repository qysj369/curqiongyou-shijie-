/**
 * 将助手/用户气泡中的纯文本渲染为：保留换行 + 可点击的 https 链接（路书长回复可读性）
 */
function safeHttpUrl(raw) {
  const trimmed = String(raw || '').replace(/[.,;!?)\]]+$/u, '')
  try {
    const u = new URL(trimmed)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    return trimmed
  } catch {
    return null
  }
}

function splitTextAndUrls(text) {
  const s = String(text ?? '')
  const re = /(https?:\/\/[^\s<]+)/gi
  const out = []
  let last = 0
  let m
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push({ type: 'text', value: s.slice(last, m.index) })
    const href = safeHttpUrl(m[1])
    out.push({ type: 'url', value: m[1], href: href || undefined })
    last = m.index + m[1].length
  }
  if (last < s.length) out.push({ type: 'text', value: s.slice(last) })
  return out.length ? out : [{ type: 'text', value: s }]
}

/**
 * @param {{ text: string, variant: 'user' | 'assistant' }} props
 */
export default function ChatMessageContent({ text, variant = 'assistant' }) {
  const parts = splitTextAndUrls(text)
  const linkClass =
    variant === 'user'
      ? 'underline font-medium text-sky-50 break-all'
      : 'underline font-medium text-sky-700 dark:text-sky-300 break-all'

  return (
    <span className="whitespace-pre-wrap break-words">
      {parts.map((p, i) => {
        if (p.type === 'url' && p.href) {
          return (
            <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {p.value}
            </a>
          )
        }
        if (p.type === 'url' && !p.href) {
          return (
            <span key={i} className="break-all">
              {p.value}
            </span>
          )
        }
        return <span key={i}>{p.value}</span>
      })}
    </span>
  )
}
