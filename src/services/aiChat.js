/**
 * AI 客服 / 智能助手接口
 * 设置 VITE_AI_API_URL 后 POST { message }，响应 JSON 建议包含 { reply: string }
 * 配额/限流：HTTP 429/503，或 JSON 中 quotaExceeded / serviceBusy / error: rate_limit|quota
 * 响应头 X-RateLimit-Remaining 为 0 时视为额度用尽（与前端提示「服务繁忙」一致）
 * 未配置 API 时使用本地 mock 回复
 */
const API_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_API_URL
  ? String(import.meta.env.VITE_AI_API_URL).replace(/\/$/, '')
  : ''

const MOCK_REPLIES = [
  '您好，我是 Roamwise 小助手。您可以问我关于目的地、预算、签证等问题，我会尽量帮您～',
  '想省钱出行的话，可以先在本站看看「穷游攻略」和「目的地」的日花费，再做预算规划。',
  '具体某个国家的签证和禁忌，建议在目的地详情页查看「民俗与禁忌」「旅游风险」；也可以到社区「旅行问答」问问去过的人。',
  '找旅伴可以到社区 → 找旅伴，发布你的行程与需求。',
  '更多问题欢迎在「网友留言板」发帖，或稍后接入完整 AI 后继续问我～',
]

function pickMockReply(userText) {
  const t = (userText || '').toLowerCase()
  if (/\d+|预算|花钱|便宜|省钱/.test(t)) return MOCK_REPLIES[1]
  if (/签证|禁忌|风险|注意/.test(t)) return MOCK_REPLIES[2]
  if (/旅伴|结伴|一起/.test(t)) return MOCK_REPLIES[3]
  if (/留言|发帖|社区/.test(t)) return MOCK_REPLIES[4]
  return MOCK_REPLIES[0]
}

/**
 * @param {string} message
 * @returns {Promise<{ reply: string; rollbackQuota?: boolean }>}
 */
export async function sendMessage(message) {
  const trimmed = String(message || '').trim()
  if (!trimmed) return { reply: '请说点什么～' }

  if (API_URL) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })

      const remainingHdr = res.headers.get('X-RateLimit-Remaining')
      const remainingNum = remainingHdr != null && remainingHdr !== '' ? Number(remainingHdr) : NaN
      const headerQuotaExhausted = Number.isFinite(remainingNum) && remainingNum <= 0

      let data = {}
      const ct = res.headers.get('Content-Type') || ''
      if (ct.includes('application/json')) {
        try {
          data = await res.json()
        } catch {
          data = {}
        }
      } else if (res.ok) {
        const text = await res.text()
        return { reply: text || pickMockReply(trimmed) }
      }

      const errCode = data.error || data.code
      const busyBody =
        data.quotaExceeded === true ||
        data.serviceBusy === true ||
        errCode === 'rate_limit' ||
        errCode === 'quota' ||
        errCode === 'busy' ||
        /quota|rate|busy|limit/i.test(String(errCode || ''))

      if (res.status === 429 || res.status === 503 || headerQuotaExhausted || busyBody) {
        const msg = typeof data.message === 'string' && data.message.trim() ? data.message.trim() : ''
        return { reply: msg, rollbackQuota: true, busy: true }
      }

      if (!res.ok) {
        throw new Error(res.statusText || String(res.status))
      }

      const reply = data.reply != null ? String(data.reply) : pickMockReply(trimmed)
      return { reply }
    } catch (err) {
      console.warn('AI API error:', err)
      return { reply: '网络或服务暂时不可用，您可以先逛逛攻略和社区～' }
    }
  }

  await new Promise((r) => setTimeout(r, 400 + Math.random() * 300))
  return { reply: pickMockReply(trimmed) }
}

/** 默认开启；设为 false/0 可关闭 AI 助手入口 */
export const isAiChatEnabled = () => {
  const v = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_CHAT_ENABLED
  if (v === 'false' || v === '0') return false
  return true
}
