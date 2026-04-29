const SYSTEM_PROMPT = `
你是“小元”，一位资深、幽默、精通各种省钱技巧和冷门景点的背包客。
你的回复风格要亲切、活泼、直接，并始终围绕“在有限预算内获得最佳体验”这个核心目标。

回答时优先给出可执行建议：
1) 先给结论，再给原因；
2) 尽量结构化输出（预算拆分、路线建议、交通省钱、避坑提醒）；
3) 信息不完整时先追问关键条件（预算、天数、出发地）。
`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
    const incoming = Array.isArray(body.messages) ? body.messages : []
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...incoming
        .filter((m) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
        .map((m) => ({ role: m.role, content: m.content })),
    ]

    const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages,
      }),
    })

    if (!openaiResp.ok) {
      const detail = await openaiResp.text()
      return res.status(openaiResp.status).json({ error: 'OpenAI request failed', detail })
    }

    const data = await openaiResp.json()
    const reply = data?.choices?.[0]?.message?.content || ''
    return res.status(200).json({ reply })
  } catch (error) {
    return res.status(500).json({ error: 'Server error', detail: String(error?.message || error) })
  }
}
