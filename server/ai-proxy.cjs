const express = require('express')
const cors = require('cors')
const { OpenAI } = require('openai')
require('dotenv').config({ path: '.env.local' })

const app = express()
const port = Number(process.env.AI_PROXY_PORT || 3001)
const mockMode = String(process.env.AI_MOCK_MODE || '').toLowerCase() === 'true'
const openaiBaseURL = String(process.env.OPENAI_BASE_URL || '').trim() || undefined
const openaiModel = String(process.env.OPENAI_MODEL || '').trim() || 'gpt-4o-mini'

app.use(cors())
app.use(express.json({ limit: '1mb' }))

const SYSTEM_PROMPT =
  '你叫“小元”，是一个AI穷游搭子。性格开朗、懂行、热心肠，擅长发现小众玩法并用最少的钱获得最大旅行乐趣。回复要简洁、口语化，可以偶尔用emoji。如果用户问题不具体，你要主动追问预算、天数、喜好。目标是帮他规划一次完美的省钱旅行。绝对不要推荐超出预算的选项。'

function buildMockReply(messages) {
  const latestUser = [...messages].reverse().find((m) => m.role === 'user')?.content || '我想来一场省钱旅行'
  const safePreview = Array.from(latestUser).slice(0, 80).join('')
  const budgetMatch = latestUser.match(/(\d{3,6})\s*[元块wW万]?/)
  const dayMatch = latestUser.match(/(\d+)\s*(天|日)/)
  const peopleMatch =
    latestUser.match(/(\d+)\s*(人|位)/) ||
    latestUser.match(/([两二2])\s*人/) ||
    latestUser.match(/([三3])\s*人/)
  const fromMatch = latestUser.match(/从([\u4e00-\u9fa5]{2,12})出发/)
  const toMatch = latestUser.match(/去([\u4e00-\u9fa5]{2,12})/)
  const budget = budgetMatch ? Number(budgetMatch[1]) : null
  const days = dayMatch ? Number(dayMatch[1]) : 2
  const people = peopleMatch
    ? peopleMatch[1] === '两' || peopleMatch[1] === '二'
      ? 2
      : peopleMatch[1] === '三'
        ? 3
        : Number(peopleMatch[1]) || 1
    : /(情侣|我们|俩人|双人)/.test(latestUser)
      ? 2
      : 1
  const fromCity = fromMatch ? fromMatch[1] : '出发地待定'
  const toCity = toMatch ? toMatch[1] : '目的地待定'
  const normalizedCity = toCity.replace(/市|地区|城区/g, '')
  const preferenceRules = [
    { key: '亲子', regex: /(亲子|带娃|小孩|儿童|宝宝)/ },
    { key: '情侣', regex: /(情侣|约会|纪念日|浪漫|对象)/ },
    { key: '独行', regex: /(独行|一个人|solo|单人|独自)/i },
    { key: '美食', regex: /(美食|小吃|探店|吃货|餐厅)/ },
    { key: '拍照', regex: /(拍照|出片|打卡|摄影|机位)/ },
    { key: '文化', regex: /(博物馆|园林|古镇|历史|文化)/ },
    { key: '自然', regex: /(自然|徒步|露营|爬山|湖|日落|公园)/ },
  ]
  const preference = preferenceRules.find((item) => item.regex.test(latestUser))?.key || '通用'

  const transport = budget && budget < 1800 ? '优先高铁二等座 + 地铁/公交' : '高铁为主，市内打车控制在短途'
  const hotelRange = budget
    ? `${Math.max(120, Math.floor((budget * 0.28) / Math.max(days, 1) / 10) * 10)}-${Math.max(
        180,
        Math.floor((budget * 0.36) / Math.max(days, 1) / 10) * 10
      )} 元/晚`
    : '150-260 元/晚'

  const budgetBreakdown = budget
    ? [
        `- 交通：约 ${Math.floor(budget * 0.32)} 元`,
        `- 住宿：约 ${Math.floor(budget * 0.34)} 元`,
        `- 餐饮：约 ${Math.floor(budget * 0.2)} 元`,
        `- 门票/体验：约 ${Math.floor(budget * 0.1)} 元`,
        `- 机动：约 ${Math.floor(budget * 0.04)} 元`,
      ].join('\n')
    : '- 交通 30% / 住宿 35% / 餐饮 20% / 体验 10% / 机动 5%'

  const dayPlan =
    days <= 1
      ? `- Day 1：早出发 -> 午后核心景点 -> 晚上夜游/夜市，22:00 前返程或入住。`
      : `- Day 1：上午抵达 ${toCity}，午后逛 1-2 个核心景点，晚上夜游平价街区。\n- Day 2：早起去免费/低价打卡点，午后返程，避开高峰时段。`

  const cityPlanMap = {
    苏州: {
      day1: [
        ['09:30-11:30', '平江路步行+评弹馆（低消费）', '30-60 元'],
        ['12:00-13:00', '观前街苏式面', '25-40 元'],
        ['14:00-17:00', '拙政园（提前购票）', '70-90 元'],
        ['19:00-21:00', '金鸡湖夜景步行线', '0-20 元'],
      ],
      day2: [
        ['08:30-10:30', '山塘街早市', '15-30 元'],
        ['11:30-12:30', '本帮菜小馆', '30-50 元'],
        ['14:00-16:30', '苏州博物馆（预约免费）', '0-20 元'],
        ['17:00-20:00', '返程交通', '120-260 元'],
      ],
      foodCost: '35-60 元/人/餐',
    },
    杭州: {
      day1: [
        ['09:00-11:30', '西湖环线（断桥-白堤）', '0-20 元'],
        ['12:00-13:00', '河坊街简餐', '25-45 元'],
        ['14:00-17:00', '灵隐飞来峰', '45-75 元'],
        ['19:30-21:00', '钱江新城灯光', '0-20 元'],
      ],
      day2: [
        ['08:30-10:30', '太子湾/浴鹄湾', '0-20 元'],
        ['12:00-13:00', '本地小馆', '30-50 元'],
        ['14:00-16:00', '中国茶叶博物馆', '0-20 元'],
        ['17:30-20:30', '返程交通', '120-260 元'],
      ],
      foodCost: '30-55 元/人/餐',
    },
    南京: {
      day1: [
        ['09:00-11:30', '中山陵景区', '0-20 元'],
        ['12:00-13:00', '明孝陵附近简餐', '25-45 元'],
        ['14:00-17:00', '夫子庙秦淮河', '30-80 元'],
        ['19:00-21:00', '老门东夜游', '0-30 元'],
      ],
      day2: [
        ['08:30-10:30', '玄武湖晨游', '0-20 元'],
        ['11:30-12:30', '盐水鸭简餐', '30-50 元'],
        ['14:00-16:30', '南京博物院（预约）', '0-20 元'],
        ['17:30-20:30', '返程交通', '120-260 元'],
      ],
      foodCost: '30-55 元/人/餐',
    },
  }
  const cityPlan = cityPlanMap[normalizedCity]
  const renderDayTable = (dayLabel, rows) => [
    `${dayLabel}（时间 | 地点 | 预计花费）`,
    ...rows.map((row) => `- ${row[0]} | ${row[1]} | ${row[2]}`),
  ].join('\n')

  const transportCost = budget ? Math.floor(budget * 0.32) : 500
  const hotelCost = budget ? Math.floor(budget * 0.34) : 420
  const foodCost = budget ? Math.floor(budget * 0.2) : 260
  const ticketCost = budget ? Math.floor(budget * 0.1) : 140
  const flexCost = budget ? Math.floor(budget * 0.04) : 60
  const totalCost = transportCost + hotelCost + foodCost + ticketCost + flexCost
  const perPerson = Math.max(1, Math.floor(totalCost / Math.max(people, 1)))
  const planAEconomy = {
    total: Math.floor(totalCost * 0.88),
    transport: Math.floor(transportCost * 0.85),
    hotel: Math.floor(hotelCost * 0.9),
    food: Math.floor(foodCost * 0.9),
  }
  const planBComfort = {
    total: Math.floor(totalCost * 1.12),
    transport: Math.floor(transportCost * 1.1),
    hotel: Math.floor(hotelCost * 1.18),
    food: Math.floor(foodCost * 1.12),
  }
  const budgetGap = budget ? totalCost - budget : 0
  const budgetHint = budget
    ? budgetGap > 0
      ? `⚠ 预算预警：当前方案超出 ${budgetGap} 元，建议优先执行 Plan A 或“可砍预算项”。`
      : `✓ 预算校验：当前方案在预算内，剩余约 ${Math.abs(budgetGap)} 元可做机动。`
    : 'ℹ 未提供预算上限，默认按中等省钱强度规划。'
  const targetTotal = budget ? Math.floor(budget * 0.8) : Math.floor(totalCost * 0.8)
  const needCut = Math.max(0, totalCost - targetTotal)
  const cutTransport = Math.floor(needCut * 0.45)
  const cutHotel = Math.floor(needCut * 0.35)
  const cutTicket = Math.floor(needCut * 0.2)

  const preferencePlanMap = {
    亲子: {
      activity: '- 节奏放慢，每半天安排 1 个主点，优先亲子友好场馆/公园和互动体验。',
      food: '- 餐饮优先商场内连锁或评分稳定店，避开重辣重油。',
      saveTip: '- 儿童票/家庭票常比单买便宜，订票时优先看套票。',
    },
    情侣: {
      activity: '- 重点安排 1 个日落点 + 1 个夜景点，路线以“少折返”提升体验。',
      food: '- 餐饮选 1 顿特色店 + 1 顿平价口碑店，兼顾氛围与预算。',
      saveTip: '- 夜景/游船项目工作日和非黄金时段往往更划算。',
    },
    独行: {
      activity: '- 优先公共交通可达路线，减少深夜换乘，兼顾安全与效率。',
      food: '- 用“早饭简单 + 午饭吃好 + 晚饭轻食”控制预算。',
      saveTip: '- 住宿选交通核心区青旅单间/经济酒店，单人出行性价比更高。',
    },
    美食: {
      activity: '- 上午轻景点，下午-晚上集中美食街/菜市场/夜市探店。',
      food: '- 每天 1 顿必吃 + 2 顿平价小店，避开网红排队高溢价店。',
      saveTip: '- 同一商圈先比价再下单，团购和工作日套餐常能省 20%+。',
    },
    拍照: {
      activity: '- 重点安排“早晨柔光 + 傍晚蓝调”两个黄金时段出片。',
      food: '- 咖啡馆/城市景观点与吃饭地点串联，减少往返。',
      saveTip: '- 热门机位错峰 1 小时，省排队时间也更容易出片。',
    },
    文化: {
      activity: '- 以博物馆/园林/老街为主线，每天 2-3 个点深度逛。',
      food: '- 午饭放在景区外 10 分钟步行圈内，口味和价格更稳定。',
      saveTip: '- 关注城市文旅公众号，常有免费讲解或联票活动。',
    },
    自然: {
      activity: '- 白天走绿道/湖边/山线，晚上安排低强度散步恢复体力。',
      food: '- 备简餐和水，景区内部餐饮通常溢价更高。',
      saveTip: '- 门票、摆渡车、索道分开比价，按体力组合最省钱。',
    },
    通用: {
      activity: '- 行程按“上午交通 + 下午核心点 + 晚上平价街区”执行最稳。',
      food: '- 一天控制 1 顿特色餐，其余用评分高的平价店。',
      saveTip: '- 高频打车改地铁/公交，预算可直接省下一截。',
    },
  }
  const preferencePlan = preferencePlanMap[preference] || preferencePlanMap.通用

  return [
    `收到，先给你一版可执行的省钱方案（mock增强版）。`,
    `你当前需求：${fromCity} -> ${toCity}，${days} 天，${people} 人，预算 ${
      budget ? `${budget} 元` : '待补充'
    }，偏好：${preference}。`,
    '',
    '【按天安排】',
    cityPlan
      ? `${renderDayTable('Day 1', cityPlan.day1)}\n${renderDayTable('Day 2', cityPlan.day2)}`
      : dayPlan,
    preferencePlan.activity,
    '',
    '【预算拆分】',
    budgetBreakdown,
    `- 估算合计：约 ${totalCost} 元${budget ? `（占预算 ${Math.round((totalCost / budget) * 100)}%）` : ''}`,
    `- 人均花费：约 ${perPerson} 元/人`,
    `- ${budgetHint}`,
    '',
    '【双档方案（同城同天数）】',
    `- Plan A 省钱版：约 ${planAEconomy.total} 元（交通 ${planAEconomy.transport} / 住宿 ${planAEconomy.hotel} / 餐饮 ${planAEconomy.food}）`,
    `- Plan B 舒适版：约 ${planBComfort.total} 元（交通 ${planBComfort.transport} / 住宿 ${planBComfort.hotel} / 餐饮 ${planBComfort.food}）`,
    '',
    '【交通与住宿建议】',
    `- 交通：${transport}`,
    `- 住宿：建议 ${hotelRange}，优先地铁站步行 10 分钟内民宿/快捷酒店`,
    `- 餐标：${cityPlan ? cityPlan.foodCost : '30-60 元/人/餐'}`,
    preferencePlan.food,
    '',
    '【可直接下单清单】',
    `- 先定：往返交通（预算上限 ${transportCost} 元）`,
    `- 再定：${days} 晚住宿（总预算 ${hotelCost} 元）`,
    '- 再预约：1 个收费景点 + 1 个免费场馆（博物馆/公园）',
    '- 出发前晚：把次日路线做成“同一地铁线串联”，减少打车',
    '',
    '【可砍预算项（示例压缩到约 80%）】',
    needCut > 0
      ? `- 目标总价：约 ${targetTotal} 元（需再省 ${needCut} 元）`
      : '- 当前预算结构已较紧凑，可优先保留体验不必再压缩',
    needCut > 0 ? `- 交通省 ${cutTransport} 元：把 1-2 段打车改地铁/公交，返程避开黄金时段` : '',
    needCut > 0 ? `- 住宿省 ${cutHotel} 元：酒店每晚下调一个档位，保持地铁 10-15 分钟步行圈` : '',
    needCut > 0 ? `- 门票省 ${cutTicket} 元：保留 1 个核心收费点，其余替换为免费场馆/街区` : '',
    '',
    '【省钱避坑】',
    '- 景点门票尽量提前 1-2 天线上订，常有早鸟价。',
    '- 吃饭避开景区正门 200 米范围，价格通常上浮明显。',
    '- 回程票建议同时比价 2 个时段，晚 1 小时常便宜不少。',
    preferencePlan.saveTip,
    '',
    `若要我继续细化，请补充：总预算上限、必去点、能否早起（你原话：${safePreview}${
      Array.from(latestUser).length > 80 ? '...' : ''
    }）`,
  ].join('\n')
}

async function streamMockText(res, text) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Transfer-Encoding', 'chunked')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('X-Accel-Buffering', 'no')

  // Use code points rather than UTF-16 units to avoid broken emoji/Chinese characters.
  const points = Array.from(text)
  const chunks = []
  for (let i = 0; i < points.length; i += 14) {
    chunks.push(points.slice(i, i + 14).join(''))
  }
  for (const chunk of chunks) {
    res.write(chunk)
    await new Promise((resolve) => setTimeout(resolve, 35))
  }
  res.end()
}

app.post('/api/ai/chat', async (req, res) => {
  try {
    const incoming = Array.isArray(req.body?.messages) ? req.body.messages : []
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...incoming
        .filter((m) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
        .map((m) => ({ role: m.role, content: m.content })),
    ]

    const apiKey = String(process.env.OPENAI_API_KEY || '').trim()
    const hasApiKey = apiKey.length >= 20
    if (!hasApiKey) {
      if (!mockMode) {
        return res.status(503).json({
          error: 'AI service unavailable',
          detail: 'Missing OPENAI_API_KEY in .env.local',
        })
      }
      const mockText = buildMockReply(messages)
      return streamMockText(res, mockText)
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: openaiBaseURL,
    })

    const completion = await openai.chat.completions.create({
      model: openaiModel,
      messages,
      stream: true,
    })

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('X-Accel-Buffering', 'no')

    for await (const chunk of completion) {
      const content = chunk.choices?.[0]?.delta?.content || ''
      if (content) res.write(content)
    }
    res.end()
  } catch (error) {
    console.error('AI proxy error:', error)
    if (!res.headersSent) {
      res.status(500).json({ error: 'AI 服务请求失败' })
    } else {
      res.end()
    }
  }
})

const server = app.listen(port, () => {
  console.log(`本地 AI 代理服务运行在: http://localhost:${port}`)
  console.log(
    `[info] AI provider: ${openaiBaseURL ? openaiBaseURL : 'https://api.openai.com/v1'} | model: ${openaiModel}`
  )
  if (String(process.env.OPENAI_API_KEY || '').trim().length < 20) {
    if (mockMode) {
      console.log('[warn] OPENAI_API_KEY 未配置，已启用 AI_MOCK_MODE=true（/api/ai/chat 返回模拟流式内容）。')
    } else {
      console.log('[warn] OPENAI_API_KEY 未配置：服务可启动，但 /api/ai/chat 会返回 503。')
    }
  }
})

// Keep process alive reliably in all local shells/runners.
const keepAliveTimer = setInterval(() => {}, 60 * 1000)

function shutdown() {
  clearInterval(keepAliveTimer)
  server.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
