/**
 * 底座 2 — 穷游攻略库（Guide Library）结构约定
 *
 * 与现有运行时数据的关系：
 * - 正文列表仍以 `articlesData.js` + `articleContent.js` 为单一事实来源（不改存量字段即可跑全站）。
 * - 本模块描述「可增量挂载」的语义层：分类轴、城市分站、POI 绑定，供后续高德/AI 消费。
 *
 * 目录树（物理）：
 * - guideLibrary/schema.js       — 本文件：版本号 + 枚举 + JSDoc 类型
 * - guideLibrary/index.js        — 聚合索引（从现有 articles/places 派生）
 * - guideLibrary/stations/       — 城市分站注册表
 * - guideLibrary/bindings/       — 攻略 ↔ POI（高德等）绑定表
 * - guideLibrary/facets/       — 侧车：kinds / topicIds / stationKeys（不改 articles 源字段）
 * - guideLibrary/mapPayload.js — 详情页地图：从 facet/bindings/stations 派生标点
 */

/** 与高德/地图页对齐时递增；仅用于调试与迁移脚本。 */
export const GUIDE_LIBRARY_SCHEMA_VERSION = 1

/**
 * 攻略「形态」：用于检索与 AI 分块，不要求每篇立即打标；可由规则或人工后补。
 * @typedef {'route' | 'city_tile' | 'budget_lab' | 'visa_bureau' | 'safety_health' | 'transport' | 'food' | 'stay' | 'gear_season' | 'misc'} GuideKind
 */

/** @type {readonly GuideKind[]} */
export const GUIDE_KINDS = Object.freeze([
  'route',
  'city_tile',
  'budget_lab',
  'visa_bureau',
  'safety_health',
  'transport',
  'food',
  'stay',
  'gear_season',
  'misc',
])

/**
 * 穷游向「主题轴」：与 tags 可并存；后续可做 controlled vocabulary。
 * @typedef {{ id: string, labelZh: string, labelEn: string }} GuideTopic
 */

/** @type {readonly GuideTopic[]} */
export const GUIDE_TOPICS = Object.freeze([
  { id: 'save_money', labelZh: '省钱总览', labelEn: 'Budget overview' },
  { id: 'route_multi_day', labelZh: '多日路线', labelEn: 'Multi-day route' },
  { id: 'local_transport', labelZh: '当地交通', labelEn: 'Local transport' },
  { id: 'stay_hostel', labelZh: '青旅/低价住宿', labelEn: 'Hostels & cheap stay' },
  { id: 'food_street', labelZh: '夜市/平价吃', labelEn: 'Street food & cheap eats' },
  { id: 'visa_entry', labelZh: '签证/入境', labelEn: 'Visa & entry' },
  { id: 'safety_health', labelZh: '安全/健康', labelEn: 'Safety & health' },
  { id: 'season_gear', labelZh: '季节/装备', labelEn: 'Season & gear' },
])

/**
 * 城市分站：比国家(place)更细一级；Key 稳定后可做 URL `/guides/stations/th-bangkok` 等。
 * parentPlaceId 对应 `placeModel` 里 destinations/places 的 `id`。
 *
 * @typedef {Object} GuideStation
 * @property {string} key  稳定 slug，建议 `{国别简码}-{城市slug}`，如 `th-bangkok`
 * @property {string} nameZh
 * @property {string} [nameEn]
 * @property {string} parentPlaceId
 * @property {string} [regionHint]  省/州/大区中文，可选
 * @property {{ lng: number, lat: number }} [center]  地图默认中心；缺省可由高德地理编码后补
 */

/**
 * 单条 POI 引用：底座 1 用高德时优先 `amap`。
 *
 * @typedef {Object} GuidePoiRef
 * @property {'amap' | 'osm' | 'custom'} kind
 * @property {string} id  平台侧 POI id 或内部 stable id
 * @property {string} [nameZh]
 */

/**
 * 攻略 ↔ POI：一篇可绑多个点（行程节点）；未绑定时仍靠国家/城市语义检索。
 *
 * @typedef {Object} GuidePoiBinding
 * @property {string} articleId  `articlesData` 里的 `id`
 * @property {string} [stationKey]  若只服务某城分站则填 `GuideStation.key`
 * @property {GuidePoiRef[]} poiRefs
 * @property {string} [note]  运营备注
 */

/**
 * 侧车数据：不改变 `articles` 数组项形状时可单独增量存放，再于构建期 merge。
 *
 * @typedef {Object} GuideArticleFacet
 * @property {string} articleId
 * @property {GuideKind[]} [kinds]
 * @property {string[]} [topicIds]  `GUIDE_TOPICS[].id`
 * @property {string[]} [stationKeys]
 */

export {}
