/**
 * 行程草稿写入后派发，供「我的」等页面在同标签内立即刷新（`storage` 仅跨文档触发）。
 */
export const TRIP_DRAFTS_CHANGED_EVENT = 'roamwise:trip-drafts-changed'

export function notifyTripDraftsChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(TRIP_DRAFTS_CHANGED_EVENT))
}
