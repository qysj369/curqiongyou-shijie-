/**
 * 简单不文明用语过滤，用于提醒用户遵守社区公约。
 * 仅作基础提示，无法替代人工审核。
 */
const BLOCKED = [
  // 常见粗俗、攻击性词汇（示例，可增补）
  'fuck', 'shit', 'damn', 'asshole', 'bitch', 'idiot', 'stupid',
  '傻逼', '草泥马', '去死', '妈的', '你妈', '他妈的', '神经病',
  '智障', '废物', '垃圾', '滚蛋', '去你',
]

function normalize(text) {
  if (!text || typeof text !== 'string') return ''
  return text.toLowerCase().replace(/\s/g, '')
}

export function containsProfanity(text) {
  const n = normalize(text)
  return BLOCKED.some((word) => n.includes(normalize(word)))
}
