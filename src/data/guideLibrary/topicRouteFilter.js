/**
 * 文库主题 id → 路线列表关键词（用于 /routes?topic= 与搜索框联动）
 */
export const TOPIC_TO_ROUTE_KEYWORD = Object.freeze({
  save_money: '省钱 预算',
  route_multi_day: '路线 行程 天',
  local_transport: '交通 公交 地铁',
  stay_hostel: '青旅 住宿 酒店',
  food_street: '夜市 美食 吃',
  visa_entry: '签证 入境',
  safety_health: '安全 健康',
  season_gear: '季节 装备',
})

/** @param {string} topicId */
export function keywordForTopic(topicId) {
  const k = TOPIC_TO_ROUTE_KEYWORD[topicId]
  return k || ''
}
