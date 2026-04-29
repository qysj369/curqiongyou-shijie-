/**
 * AI 客服 / 智能助手接口
 * 设置 VITE_AI_API_URL 后 POST { message }，响应 JSON 建议包含 { reply: string }
 * 配额/限流：HTTP 429/503，或 JSON 中 quotaExceeded / serviceBusy / error: rate_limit|quota
 * 响应头 X-RateLimit-Remaining 为 0 时视为额度用尽（与前端提示「服务繁忙」一致）
 * 未配置 API 时使用本地 mock 回复
 */
import { MAP_COUNTRY_TEMPLATES } from '../data/mapPoiOverrides'

const API_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_API_URL
  ? String(import.meta.env.VITE_AI_API_URL).replace(/\/$/, '')
  : ''

const SYSTEM_BRIEF =
  'You are Roamwise AI. Focus only on budget travel, minimalist lifestyle on the road, and anti-tourist-trap advice. Give practical, low-cost, safety-first answers in short bullet points. No ads, no product selling, no affiliate push.'
const RESPONSE_TEMPLATE =
  'Response format (always follow):\n' +
  '1) 最省钱做法 / Cheapest moves (3-5 bullets)\n' +
  '2) 极简建议 / Minimalist setup (2-4 bullets)\n' +
  '3) 安全与避坑 / Safety & anti-trap (2-4 bullets)\n' +
  '4) 下一步行动 / Next step checklist (3 bullets max)'
const TEMPLATE_FIELDS = ['freeScenic', 'foodUnder200', 'lowCostStay', 'realPitfall']

function isInScope(text) {
  const t = String(text || '').toLowerCase()
  return /(预算|省钱|便宜|穷游|极简|背包|交通|地铁|公交|青旅|住宿|吃喝|夜市|换汇|电话卡|签证|安全|避坑|被骗|solo|budget|minimal|cheap|hostel|visa|sim|safety|scam|trap|transport|food)/.test(t)
}

function retrieveCountryTemplates(query, limit = 3) {
  const q = String(query || '').toLowerCase()
  const names = Object.keys(MAP_COUNTRY_TEMPLATES || {})
  const direct = names.filter((name) => q.includes(String(name).toLowerCase()))
  if (direct.length) return direct.slice(0, limit)
  const aliasMap = {
    japan: '日本',
    thailand: '泰国',
    vietnam: '越南',
    malaysia: '马来西亚',
    turkey: '土耳其',
    georgia: '格鲁吉亚',
    portugal: '葡萄牙',
    spain: '西班牙',
    italy: '意大利',
    france: '法国',
    germany: '德国',
    uk: '英国',
    britain: '英国',
    usa: '美国',
    us: '美国',
    canada: '加拿大',
    mexico: '墨西哥',
    brazil: '巴西',
    argentina: '阿根廷',
    morocco: '摩洛哥',
    egypt: '埃及',
    'south africa': '南非',
    australia: '澳大利亚',
    'new zealand': '新西兰',
    indonesia: '印度尼西亚',
    philippines: '菲律宾',
  }
  const aliasHit = Object.entries(aliasMap)
    .filter(([k]) => q.includes(k))
    .map(([, v]) => v)
  return [...new Set(aliasHit)].slice(0, limit)
}

function buildTrainingContext(query) {
  const picked = retrieveCountryTemplates(query, 3)
  if (!picked.length) return ''
  const parts = picked.map((name) => {
    const v = MAP_COUNTRY_TEMPLATES[name]
    if (!v) return null
    return [
      `Country: ${name}`,
      `- Free scenic: ${v.freeScenic}`,
      `- Food <= 200/day: ${v.foodUnder200}`,
      `- Low-cost stay: ${v.lowCostStay}`,
      `- Pitfall: ${v.realPitfall}`,
    ].join('\n')
  }).filter(Boolean)
  return parts.length ? `Structured country context:\n${parts.join('\n\n')}` : ''
}

function buildMatchedCountryHits(names) {
  return names.map((name) => {
    const template = MAP_COUNTRY_TEMPLATES?.[name] || {}
    const fields = TEMPLATE_FIELDS.map((field) => {
      const value = template[field]
      const present = typeof value === 'string' ? Boolean(value.trim()) : Boolean(value)
      return { key: field, present, value: present ? String(value).trim() : '' }
    })
    const hit = fields.filter((item) => item.present).length
    return {
      name,
      hit,
      total: TEMPLATE_FIELDS.length,
      fields,
    }
  })
}

const MOCK_REPLIES = [
  '我会按“省钱 + 安全 + 可执行”回答。先告诉我目的地、天数和预算上限，我给你最低成本方案。',
  '极简省钱模型：公共交通优先、住宿离地铁一站路、餐饮选本地市场，先把每天总花费压住再优化体验。',
  '避坑清单：避开网红高价点、确认总价和附加费、夜间不走偏僻换乘站、证件和现金分开放。',
  '如果你是 solo traveler，我会默认给“安全优先路线”，并标注不建议去的高风险区域类型。',
  '可继续问我“签证/换汇/电话卡/机票时机/城市交通卡”，我会给最省钱做法。',
]

function pickMockReply(userText) {
  if (!isInScope(userText)) {
    return '我只回答「极简生活 + 省钱技巧 + 安全避坑」相关问题。你可以问我：预算压缩、青旅选择、电话卡与换汇、公共交通、省钱吃喝、常见旅游陷阱。'
  }
  const t = (userText || '').toLowerCase()
  if (/\d+|预算|花钱|便宜|省钱/.test(t)) return MOCK_REPLIES[1]
  if (/签证|禁忌|风险|注意/.test(t)) return MOCK_REPLIES[2]
  if (/旅伴|结伴|一起/.test(t)) return MOCK_REPLIES[3]
  if (/留言|发帖|社区/.test(t)) return MOCK_REPLIES[4]
  const countries = retrieveCountryTemplates(userText, 1)
  if (countries.length) {
    const c = MAP_COUNTRY_TEMPLATES[countries[0]]
    if (c) {
      return `按「${countries[0]}」模板给你：\n- 最省钱做法：${c.foodUnder200}\n- 极简建议：${c.lowCostStay}\n- 安全避坑：${c.realPitfall}\n- 下一步：先按免费风景线 ${c.freeScenic} 走一条半日路线。`
    }
  }
  return MOCK_REPLIES[0]
}

/**
 * @param {string} message
 * @returns {Promise<{ reply: string; rollbackQuota?: boolean }>}
 */
export async function sendMessage(message) {
  const trimmed = String(message || '').trim()
  if (!trimmed) return { reply: '请说点什么～' }
  const matchedCountries = retrieveCountryTemplates(trimmed, 3)
  const matchedCountryHits = buildMatchedCountryHits(matchedCountries)
  const trainingContext = buildTrainingContext(trimmed)
  const enrichedMessage = `${SYSTEM_BRIEF}\n\n${RESPONSE_TEMPLATE}\n\n${trainingContext}\n\nUser question:\n${trimmed}`

  if (API_URL) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: enrichedMessage }),
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
      return { reply: text || pickMockReply(trimmed), matchedCountries, matchedCountryHits }
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
        return { reply: msg, rollbackQuota: true, busy: true, matchedCountries, matchedCountryHits }
      }

      if (!res.ok) {
        throw new Error(res.statusText || String(res.status))
      }

      const reply = data.reply != null ? String(data.reply) : pickMockReply(trimmed)
      return { reply, matchedCountries, matchedCountryHits }
    } catch (err) {
      console.warn('AI API error:', err)
      return { reply: '网络或服务暂时不可用，您可以先逛逛攻略和社区～', matchedCountries, matchedCountryHits }
    }
  }

  await new Promise((r) => setTimeout(r, 400 + Math.random() * 300))
  return { reply: pickMockReply(trimmed), matchedCountries, matchedCountryHits }
}

/** 默认开启；设为 false/0 可关闭 AI 助手入口 */
export const isAiChatEnabled = () => {
  const v = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_CHAT_ENABLED
  if (v === 'false' || v === '0') return false
  return true
}
