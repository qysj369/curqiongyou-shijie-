/**
 * 全站禁用的 Unsplash photo-id（仅数字段）。
 * 聚合脚本 `generate-cover-pools` 与运行时 `buildCoverUrlPoolForDestination` 均会跳过。
 */
export const COVER_BANNED_UNSPLASH_IDS = new Set([
  /** 威尼斯水道塔楼，与加拉塔观感易混且曾多卡撞车 */
  '1523906834658',
])
