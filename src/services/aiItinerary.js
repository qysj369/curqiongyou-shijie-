import { TRAVELMATE_SYSTEM_PROMPT } from '../lib/prompts/travelmate.prompt'

const API_URL =
  import.meta.env.VITE_TRAVELMATE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001/api/ai/chat' : '/api/ai/chat')

/** 中国境内示意 centroid（杭州附近）；非中文目的地时用东南亚示意点 */
const MOCK_CENTER_CN = { lng: 120.1536, lat: 30.2741 }
const MOCK_CENTER_ROW = { lng: 100.5, lat: 13.75 }

const ITIN_JSON_SYSTEM = `${TRAVELMATE_SYSTEM_PROMPT}

You are additionally a structured itinerary engine. When the user asks for a trip plan, reply with ONLY one JSON object (no markdown fences, no commentary).

Return a BUNDLE with two complete routes (same destination, same number of days, same totalBudget envelope). China-first: if the destination is in China, set countryCode to "CN" and use realistic lng/lat inside China.

Shape:
{
  "countryCode": "CN" | string,
  "primary": {
    "title": string,
    "destination": string,
    "totalBudget": number,
    "days": [{ "day": number, "theme": string, "dayBudget": number, "transport": string,
      "pois": [{ "name": string, "kind": "blue"|"green"|"orange", "budgetHint": string, "lng": number, "lat": number }]
    }],
    "replacements": [{ "from": string, "to": string, "save": number }]
  },
  "alternate": { same shape as primary }
}

Rules:
- primary: main recommended budget route (2–5 POIs per day).
- alternate: meaningfully different themes/order/clusters (e.g. more free walks), still executable and same totalBudget.
- primary.title and alternate.title must differ; alternate.destination matches primary.destination.
- Bias to free/low-cost spots when asked; keep numbers consistent with totalBudget.
`

/**
 * @param {string} text
 * @returns {object | null}
 */
export function extractJsonObject(text) {
  const raw = String(text || '').trim()
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = fence ? fence[1].trim() : raw
  const start = body.indexOf('{')
  const end = body.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(body.slice(start, end + 1))
  } catch {
    return null
  }
}

/**
 * @param {object} o
 * @returns {boolean}
 */
export function isItineraryBundle(o) {
  return Boolean(
    o &&
      typeof o === 'object' &&
      o.primary &&
      o.alternate &&
      Array.isArray(o.primary.days) &&
      o.primary.days.length > 0 &&
      Array.isArray(o.alternate.days) &&
      o.alternate.days.length > 0,
  )
}

/**
 * @param {object} o
 * @returns {boolean}
 */
export function isLegacyItinerarySpec(o) {
  return Boolean(o && typeof o === 'object' && Array.isArray(o.days) && o.days.length && !o.primary)
}

/**
 * @param {string} destination
 */
export function inferCountryCodeFromDestination(destination) {
  const s = String(destination || '').trim()
  if (!s) return 'CN'
  if (/[\u4e00-\u9fff]/.test(s)) return 'CN'
  const lower = s.toLowerCase()
  if (
    lower.includes('china') ||
    lower.includes('beijing') ||
    lower.includes('shanghai') ||
    lower.includes('hangzhou') ||
    lower.includes('chengdu') ||
    lower.includes('guangzhou') ||
    lower.includes('shenzhen') ||
    lower.includes('xian') ||
    lower.includes('xi\'an') ||
    lower.includes('chongqing') ||
    lower.includes('kunming') ||
    lower.includes('nanjing')
  ) {
    return 'CN'
  }
  return 'ROW'
}

/**
 * @param {object} leg
 * @returns {boolean}
 */
function isValidLeg(leg) {
  if (!leg || typeof leg !== 'object') return false
  if (typeof leg.title !== 'string' || !leg.title.trim()) return false
  if (typeof leg.destination !== 'string' || !leg.destination.trim()) return false
  if (!Number.isFinite(Number(leg.totalBudget))) return false
  if (!Array.isArray(leg.days) || leg.days.length === 0) return false
  for (const d of leg.days) {
    if (!Number.isFinite(Number(d.day))) return false
    if (!Array.isArray(d.pois) || d.pois.length === 0) return false
    for (const p of d.pois) {
      if (!Number.isFinite(Number(p.lng)) || !Number.isFinite(Number(p.lat))) return false
    }
  }
  return true
}

/**
 * 将旧版单条行程包成双轨（备选为坐标与主题偏移的副本）。
 * @param {object} legacy
 */
export function wrapLegacySpecAsBundle(legacy) {
  const dest = String(legacy.destination || '').trim() || '目的地'
  const cc = inferCountryCodeFromDestination(dest)
  const primary = JSON.parse(JSON.stringify(legacy))
  const alternate = JSON.parse(JSON.stringify(legacy))
  alternate.title = `${alternate.title || dest}（备选）`
  for (const day of alternate.days || []) {
    day.theme = `${String(day.theme || '')} · 备选动线`
    for (const p of day.pois || []) {
      p.name = `${String(p.name || '')} · 备选`
      p.lng = Number(p.lng) + 0.035
      p.lat = Number(p.lat) - 0.022
    }
  }
  if (Array.isArray(alternate.replacements)) {
    alternate.replacements = alternate.replacements.map((r) => ({
      ...r,
      from: `${r.from}（备选）`,
      to: `${r.to}（备选）`,
    }))
  }
  return { countryCode: cc, primary, alternate }
}

/**
 * @param {{ destination: string, days: number, budget: number }} form
 * @param {{ lng: number, lat: number }} center
 * @param {{ variant: 'primary' | 'alternate' }} opts
 */
function buildOneMockLeg(form, center, opts) {
  const { variant } = opts
  const dest = String(form.destination || '目的地').trim() || '目的地'
  const days = Math.max(1, Math.min(14, Number(form.days) || 3))
  const budget = Math.max(500, Number(form.budget) || 3000)
  const lngOff = variant === 'alternate' ? 0.06 : 0
  const latOff = variant === 'alternate' ? -0.04 : 0
  const baseLng = center.lng + lngOff
  const baseLat = center.lat + latOff
  const daysArr = []
  for (let d = 1; d <= days; d += 1) {
    const label =
      variant === 'primary'
        ? d === 1
          ? '经典打卡'
          : d === days
            ? '返程机动'
            : '核心体验'
        : d === 1
          ? '慢游安顿'
          : d === days
            ? '轻松收尾'
            : '免费/低价向'
    const pois = [
      {
        name:
          variant === 'primary'
            ? `${dest} · 观景/步行带（主推）`
            : `${dest} · 河滨/公园免费带（备选）`,
        kind: 'blue',
        budgetHint: variant === 'primary' ? '免费步行观景' : '免费公园步道',
        lng: baseLng + d * 0.018,
        lat: baseLat + d * 0.012,
      },
      {
        name:
          variant === 'primary'
            ? `${dest} · 平价吃喝片区`
            : `${dest} · 社区食堂/小吃街`,
        kind: 'green',
        budgetHint: `人均约 ¥${25 + d * 4}`,
        lng: baseLng + d * 0.018 + 0.014,
        lat: baseLat + d * 0.012 - 0.011,
      },
    ]
    if (d % 2 === 0) {
      pois.push({
        name: variant === 'primary' ? `${dest} · 公交地铁接驳点` : `${dest} · 共享单车友好段`,
        kind: 'orange',
        budgetHint: variant === 'primary' ? '公交/地铁日票' : '单车+步行组合',
        lng: baseLng + d * 0.018 - 0.012,
        lat: baseLat + d * 0.012 + 0.01,
      })
    }
    daysArr.push({
      day: d,
      theme: label,
      dayBudget: Math.round(budget / days),
      transport: d === 1 ? '高铁/机场巴士 + 地铁' : '市内公交地铁为主',
      pois,
    })
  }
  const title =
    variant === 'primary'
      ? `${dest} ${days} 日 · 主推穷游线（示意）`
      : `${dest} ${days} 日 · 备选慢游/省钱线（示意）`
  return {
    title,
    destination: dest,
    totalBudget: budget,
    days: daysArr,
    replacements:
      variant === 'primary'
        ? [
            { from: '打车跨区', to: '同区步行+公交', save: Math.round(budget * 0.06) },
            { from: '热门付费观景台', to: '免费高地/河滨步道', save: Math.round(budget * 0.04) },
          ]
        : [
            { from: '景区内电瓶车', to: '步行环线', save: Math.round(budget * 0.05) },
            { from: '商场正餐', to: '社区食堂/夜市小吃', save: Math.round(budget * 0.07) },
          ],
  }
}

/**
 * @param {{ destination: string, days: number, budget: number }} form
 */
export function buildMockItineraryBundle(form) {
  const dest = String(form.destination || '目的地').trim() || '目的地'
  const cc = inferCountryCodeFromDestination(dest)
  const center = cc === 'CN' ? MOCK_CENTER_CN : MOCK_CENTER_ROW
  return {
    countryCode: cc,
    primary: buildOneMockLeg(form, center, { variant: 'primary' }),
    alternate: buildOneMockLeg(form, center, { variant: 'alternate' }),
  }
}

/** @deprecated 保留导出供外部单测或旧调用；内部已改为 bundle */
export function buildMockItinerary(form) {
  const b = buildMockItineraryBundle(form)
  return b.primary
}

async function fetchTravelmateTextOnce(systemPrompt, userContent) {
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt,
      messages: [{ role: 'user', content: userContent }],
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
      if (value) full += decoder.decode(value, { stream: true })
    }
    full += decoder.decode()
    return full.trim()
  }
  const ct = resp.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    const data = await resp.json()
    return String(data?.reply || data?.text || '').trim()
  }
  return (await resp.text()).trim()
}

/**
 * @param {{ destination: string, days: number, budget: number, departCity?: string, pace?: string, notes?: string }} form
 * @param {string} [tweakDirective]
 * @returns {Promise<{ ok: true, bundle: object, raw: string, mock?: boolean }>}
 */
export async function generateItinerarySpec(form, tweakDirective = '') {
  const dest = String(form.destination || '').trim()
  const days = Math.max(1, Math.min(14, Number(form.days) || 3))
  const budget = Math.max(200, Number(form.budget) || 3000)
  const ccHint = inferCountryCodeFromDestination(dest || form.destination)
  const userBlock = [
    `目的地: ${dest}`,
    `天数: ${days}`,
    `总预算(人民币): ${budget}`,
    `推断国家代码(供模型对齐坐标与交通规则): ${ccHint}`,
    form.departCity ? `出发城市: ${form.departCity}` : '',
    form.pace ? `节奏: ${form.pace}` : '',
    form.notes ? `偏好/限制: ${form.notes}` : '',
    tweakDirective ? `额外指令: ${tweakDirective}` : '',
    '必须输出包含 primary 与 alternate 的完整 JSON bundle（两条可执行线路）。',
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const text = await fetchTravelmateTextOnce(ITIN_JSON_SYSTEM, userBlock)
    const parsed = extractJsonObject(text)
    if (parsed && isItineraryBundle(parsed) && isValidLeg(parsed.primary) && isValidLeg(parsed.alternate)) {
      const bundle = {
        countryCode: String(parsed.countryCode || ccHint || 'CN'),
        primary: parsed.primary,
        alternate: parsed.alternate,
      }
      return { ok: true, bundle, raw: text }
    }
    if (parsed && isLegacyItinerarySpec(parsed) && isValidLeg(parsed)) {
      return { ok: true, bundle: wrapLegacySpecAsBundle(parsed), raw: text }
    }
  } catch {
    /* fall through mock */
  }
  return {
    ok: true,
    bundle: buildMockItineraryBundle({ ...form, destination: dest || form.destination, days, budget }),
    raw: '',
    mock: true,
  }
}
