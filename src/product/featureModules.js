/**
 * 全站六大功能模块（产品清单，供路由/AI/埋点对齐）。
 * 底座依赖：1 高德地图 · 2 攻略文库 · 3 AI 引擎（与对话里「三大底座」一致）。
 */

/** @typedef {'amap' | 'guide' | 'ai'} PillarId */

/** @typedef {{ id: PillarId, note?: string }} PillarRef */

/**
 * @typedef {Object} FeatureModuleDef
 * @property {string} id  稳定 slug（URL、埋点、配置键）
 * @property {string} titleZh
 * @property {string} titleEn
 * @property {string} summaryZh  一句话范围（与当前仓库行为一致）
 * @property {string} summaryEn  英文一句话（与当前仓库行为一致）
 * @property {PillarRef[]} pillars  主要依赖底座
 * @property {string[]} dependsOnModules  可选：依赖其它功能模块 id（拓扑）
 * @property {'planned' | 'partial' | 'shipped'} lifecycle  相对当前仓库的粗粒度状态
 */

/**
 * 各模块主入口路径（与 React Router 一致）。
 * 变更时请同步 `App.jsx` 的 `<Route>` 与 `SeoHead.jsx` 的 ROUTE_* 映射；
 * `appFeatureRoutes.contract.test.js` 会校验未漂移。
 */
export const FEATURE_MODULE_PATH = Object.freeze({
  'map-home': '/map-hub',
  'guide-library': '/library',
  'ai-advisor': '/advisor',
  'ai-itinerary': '/trip-ai',
  'budget-steward': '/steward',
  'user-hub': '/me',
})

/** @type {readonly FeatureModuleDef[]} */
export const FEATURE_MODULES = Object.freeze([
  {
    id: 'map-home',
    titleZh: '地图主页',
    titleEn: 'Map home',
    summaryZh:
      '全国/单城、分层颜色，分站与穷游攻略 POI 叠高德；侧栏高德外链、一键行程/顾问（destination、q 预填）、浮窗 AI；与首页 POI 同源。',
    summaryEn:
      'National/city layers: stations + budget guide POIs on Amap; sidebar Amap links, deep links to trip/advisor (destination / ?q prefill), floating AI; same POI source as home.',
    pillars: [{ id: 'amap' }, { id: 'guide' }, { id: 'ai', note: '推荐顺序/解释' }],
    dependsOnModules: [],
    lifecycle: 'shipped',
  },
  {
    id: 'guide-library',
    titleZh: '攻略文库',
    titleEn: 'Guide library',
    summaryZh:
      '主题轴、路线列表联动、AI 段落改写；支持 ?paste=/prefill= 写入改写框；顶栏直达其余模块主入口。',
    summaryEn:
      'Topics, route list deep links, AI rewrite; optional ?paste=/prefill= seeds the editor; header links to other module homes.',
    pillars: [{ id: 'guide' }, { id: 'ai' }],
    dependsOnModules: [],
    lifecycle: 'shipped',
  },
  {
    id: 'ai-advisor',
    titleZh: 'AI 问答顾问',
    titleEn: 'AI travel advisor',
    summaryZh:
      '全页对话；系统提示词透传后端；?q=/ask= 自动发出首条（读后清理 URL）；顶栏链行程/地图/文库/管家/我的。',
    summaryEn:
      'Full-page chat; system prompt to backend; ?q=/ask= sends first turn then strips URL; header links across modules.',
    pillars: [{ id: 'ai' }, { id: 'guide' }, { id: 'amap' }],
    dependsOnModules: [],
    lifecycle: 'shipped',
  },
  {
    id: 'ai-itinerary',
    titleZh: 'AI 一键穷游行程',
    titleEn: 'AI one-tap budget itinerary',
    summaryZh:
      '表单→路书 JSON、高德预览与首点链、草稿复制/删除/重试、同步管家（labelKey）；无 draft 时 URL 可预填 destination/days/budget 等；结果区链顾问预填。',
    summaryEn:
      'Form→JSON, Amap preview + first POI, drafts copy/delete/retry, steward sync (labelKey); URL seeds form without draft; result links to prefilled advisor.',
    pillars: [{ id: 'ai' }, { id: 'amap' }, { id: 'guide' }],
    dependsOnModules: [],
    lifecycle: 'shipped',
  },
  {
    id: 'budget-steward',
    titleZh: '预算管家',
    titleEn: 'Budget steward',
    summaryZh:
      '科目行（labelKey+i18n）、分享 hash / session 预填、复制明细、重置；「带科目问顾问」拼 URL；顶栏互通各模块。',
    summaryEn:
      'labelKey lines + i18n, share hash/session prefill, copy breakdown, reset; “ask advisor” builds ?q from lines; header cross-links.',
    pillars: [{ id: 'ai', note: '替换与解释' }],
    dependsOnModules: ['ai-itinerary'],
    lifecycle: 'shipped',
  },
  {
    id: 'user-hub',
    titleZh: '用户中心',
    titleEn: 'User hub',
    summaryZh:
      '行程草稿（打开/复制/删/「问顾问」URL 预填）、收藏预览与地图入口、最近路径、离线说明与模块卡片；本地为主，未接登录。',
    summaryEn:
      'Trip drafts (open/copy/delete/prefilled advisor link), favorites + map entry, recent paths, offline copy & hub cards; local-first, no login.',
    pillars: [{ id: 'guide' }, { id: 'amap' }, { id: 'ai' }],
    dependsOnModules: ['ai-itinerary', 'map-home', 'budget-steward'],
    lifecycle: 'shipped',
  },
])

/** @param {string} id */
export function getFeatureModuleById(id) {
  return FEATURE_MODULES.find((m) => m.id === id) || null
}

/** 建议落地顺序（拓扑 + 底座）：先强化地图主页与文库结构，再行程生成，预算管家，最后用户中心纵深。 */
export const FEATURE_MODULE_ROLLOUT_ORDER = Object.freeze([
  'map-home',
  'guide-library',
  'ai-advisor',
  'ai-itinerary',
  'budget-steward',
  'user-hub',
])
