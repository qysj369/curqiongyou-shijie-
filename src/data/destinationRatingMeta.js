/**
 * 目的地「旅行者口碑」元数据（对标 OTA/点评类站点的评分与条数展示）。
 * 按目的地 id 确定性生成，避免为上百条目的地手写数据。
 */

export function getDestinationRatingMeta(dest) {
  const n = Number(dest?.id) || 0
  const seed = (n * 1103515245 + 12345) >>> 0
  const frac = (seed % 11) / 10
  const rating = Math.min(5, Math.round((4 + frac) * 10) / 10)
  const reviewCount = 320 + (seed % 11800)
  const photoCount = 48 + (seed % 420)
  return { rating, reviewCount, photoCount }
}
