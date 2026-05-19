import { chinaFeaturedArticles } from './chinaFeaturedGuides.js'

/** 每篇深度路书对应的意图变体数量（测试与文档引用） */
export const INTENT_VARIANTS_PER_CITY = 24

/**
 * 为已有「深度路书」生成意图变体；列表检索靠标题、tags 与 intentSummary。
 * Trip 预填通过 guideAnchorId 指向深度路书。
 */
const INTENT_SPECS = [
  {
    suffix: 'hsr',
    tag: '高铁',
    extraTags: ['新手友好', '交通'],
    titlePattern: (city, days) => `${city}高铁${days}日：进出站省心·经典景点串联`,
    summaryPattern: (city, days, budget) =>
      `${city}${days}日高铁党：城际/地铁串联经典景点，进出站留足换乘时间；人均约 ¥${budget}，无车也能走完核心区。`,
    budgetFactor: 0.92,
    dayCap: 4,
    dayDelta: -1,
  },
  {
    suffix: 'family',
    tag: '亲子',
    extraTags: ['步行友好', '博物馆'],
    titlePattern: (city, days) => `${city}亲子${days}日：少爬山·节奏放缓`,
    summaryPattern: (city, days, budget) =>
      `带娃玩${city}${days}天：平地公园与博物馆优先，每日步行控量；人均约 ¥${budget}，爬山/长途项目能省则省。`,
    budgetFactor: 1.08,
    dayCap: 5,
    dayDelta: 0,
  },
  {
    suffix: 'budget',
    tag: '省钱',
    extraTags: ['周末', '穷游'],
    titlePattern: (city, days) => `${city}周末${days}日穷游：预算控场·公交为主`,
    summaryPattern: (city, days, budget) =>
      `${city}周末穷游${days}日：公交+步行为主，住宿锁价、餐饮小吃兜底；人均压到约 ¥${budget}。`,
    budgetFactor: 0.82,
    dayCap: 3,
    dayDelta: -1,
  },
  {
    suffix: 'drive',
    tag: '自驾',
    extraTags: ['租车', '风景路'],
    titlePattern: (city, days) => `${city}自驾${days}日：租车避坑·风景路串联`,
    summaryPattern: (city, days, budget) =>
      `${city}自驾${days}日：风景路+周边串联，油费/过路/停车费单独算账；人均约 ¥${budget}，验车与路况公告必看。`,
    budgetFactor: 1.15,
    dayCap: 6,
    dayDelta: 1,
  },
  {
    suffix: 'photo',
    tag: '摄影',
    extraTags: ['日出', '机位'],
    titlePattern: (city, days) => `${city}摄影${days}日：日出机位·轻量器材`,
    summaryPattern: (city, days, budget) =>
      `${city}摄影向${days}日：清晨/傍晚锁机位，白天拍街巷光影；人均约 ¥${budget}，轻装器材、错峰人流。`,
    budgetFactor: 1.05,
    dayCap: 5,
    dayDelta: 0,
  },
  {
    suffix: 'solo',
    tag: '独行',
    extraTags: ['背包客', '青旅'],
    titlePattern: (city, days) => `${city}独行${days}日：青旅社交·安全动线`,
    summaryPattern: (city, days, budget) =>
      `独行${city}${days}天：青旅/床位+地铁公交，夜间少走偏僻段；人均约 ¥${budget}，拼车与门票走正规平台。`,
    budgetFactor: 0.88,
    dayCap: 4,
    dayDelta: -1,
  },
  {
    suffix: 'couple',
    tag: '情侣',
    extraTags: ['夜景', '慢游'],
    titlePattern: (city, days) => `${city}情侣${days}日：夜景漫步·仪式感一餐`,
    summaryPattern: (city, days, budget) =>
      `情侣慢游${city}${days}日：步行街与江景夜景优先，预约 1–2 顿氛围餐；人均约 ¥${budget}，其余小吃扫街。`,
    budgetFactor: 1.1,
    dayCap: 5,
    dayDelta: 0,
  },
  {
    suffix: 'food',
    tag: '美食',
    extraTags: ['夜市', '小吃'],
    titlePattern: (city, days) => `${city}美食${days}日：菜市场·老字号·夜市`,
    summaryPattern: (city, days, budget) =>
      `${city}美食线${days}日：早市+老字号+夜市三段扫街，景区餐厅最多 1 顿；人均约 ¥${budget}。`,
    budgetFactor: 0.95,
    dayCap: 4,
    dayDelta: 0,
  },
  {
    suffix: 'senior',
    tag: '老年',
    extraTags: ['慢游', '省力'],
    titlePattern: (city, days) => `${city}老年${days}日：省力动线·观光车优先`,
    summaryPattern: (city, days, budget) =>
      `长辈游${city}${days}天：每日 1 核心点+午休，索道/观光车能坐则坐；人均约 ¥${budget}，台阶多的点位主动放弃。`,
    budgetFactor: 1.02,
    dayCap: 5,
    dayDelta: 0,
  },
  {
    suffix: 'hike',
    tag: '徒步',
    extraTags: ['登山', '装备'],
    titlePattern: (city, days) => `${city}徒步${days}日：轻装路线·海拔适应`,
    summaryPattern: (city, days, budget) =>
      `${city}徒步${days}日：控制每日爬升，护膝与分层穿衣必备；人均约 ¥${budget}，雨雪后台风天主动改线。`,
    budgetFactor: 0.98,
    dayCap: 6,
    dayDelta: 1,
  },
  {
    suffix: 'summer',
    tag: '避暑',
    extraTags: ['清凉', '夏季'],
    titlePattern: (city, days) => `${city}避暑${days}日：清凉片区·少曝晒动线`,
    summaryPattern: (city, days, budget) =>
      `${city}暑期避暑${days}日：林荫/高原/海滨清凉点串联，正午室内休整；人均约 ¥${budget}。`,
    budgetFactor: 1,
    dayCap: 5,
    dayDelta: 0,
  },
  {
    suffix: 'autumn',
    tag: '红叶',
    extraTags: ['秋色', '摄影'],
    titlePattern: (city, days) => `${city}秋色${days}日：红叶季通勤·季节性预期`,
    summaryPattern: (city, days, budget) =>
      `${city}秋色${days}日：红叶/银杏按旬期安排，非叶季管理预期；人均约 ¥${budget}，清晨错峰。`,
    budgetFactor: 1.03,
    dayCap: 5,
    dayDelta: 0,
  },
  {
    suffix: 'hotspring',
    tag: '温泉',
    extraTags: ['放松', '冬季'],
    titlePattern: (city, days) => `${city}温泉${days}日：泡汤节奏·防滑保暖`,
    summaryPattern: (city, days, budget) =>
      `${city}温泉${days}日：泡汤+轻量市区串联，防滑保暖与换衣时间留足；人均约 ¥${budget}，旺季房价先问清。`,
    budgetFactor: 1.12,
    dayCap: 4,
    dayDelta: 0,
  },
  {
    suffix: 'winter',
    tag: '冰雪',
    extraTags: ['滑雪', '极寒'],
    titlePattern: (city, days) => `${city}冰雪${days}日：滑雪取舍·极寒装备`,
    summaryPattern: (city, days, budget) =>
      `${city}冰雪${days}日：滑雪/冰雕按季节取舍，分层防寒与护目镜必备；人均约 ¥${budget}，路面结冰慎自驾。`,
    budgetFactor: 1.18,
    dayCap: 5,
    dayDelta: 0,
  },
  {
    suffix: 'heritage',
    tag: '非遗',
    extraTags: ['手工', '古城'],
    titlePattern: (city, days) => `${city}非遗${days}日：古城手艺·体验预约`,
    summaryPattern: (city, days, budget) =>
      `${city}非遗${days}日：古城/博物馆+手工艺体验，先预约再出发；人均约 ¥${budget}，购物理性比价。`,
    budgetFactor: 1.04,
    dayCap: 4,
    dayDelta: 0,
  },
  {
    suffix: 'night',
    tag: '夜游',
    extraTags: ['夜景', '灯光'],
    titlePattern: (city, days) => `${city}夜游${days}日：灯光秀·夜市·安全返程`,
    summaryPattern: (city, days, budget) =>
      `${city}夜游${days}日：灯光秀/夜市/江景排进傍晚至深夜段，末班地铁时间留足；人均约 ¥${budget}。`,
    budgetFactor: 1.06,
    dayCap: 4,
    dayDelta: -1,
  },
  {
    suffix: 'temple',
    tag: '寺庙',
    extraTags: ['人文', '礼佛'],
    titlePattern: (city, days) => `${city}寺庙${days}日：古刹礼佛·静音参观`,
    summaryPattern: (city, days, budget) =>
      `${city}寺庙人文${days}日：礼佛动线+静音参观，着装得体、殿内勿拍；人均约 ¥${budget}，香烛理性消费。`,
    budgetFactor: 0.96,
    dayCap: 4,
    dayDelta: 0,
  },
  {
    suffix: 'blossom',
    tag: '赏花',
    extraTags: ['春季', '公园'],
    titlePattern: (city, days) => `${city}赏花${days}日：花期通勤·公园错峰`,
    summaryPattern: (city, days, budget) =>
      `${city}赏花${days}日：樱花/油菜花等按花期安排，非花季改逛公园绿地；人均约 ¥${budget}，周末清晨错峰。`,
    budgetFactor: 1.02,
    dayCap: 4,
    dayDelta: 0,
  },
  {
    suffix: 'island',
    tag: '海岛',
    extraTags: ['海滩', '潜水'],
    titlePattern: (city, days) => `${city}海岛${days}日：跳岛取舍·防晒防风`,
    summaryPattern: (city, days, budget) =>
      `${city}海岛${days}日：跳岛/沙滩按风浪取舍，防晒+晕船药备齐；人均约 ¥${budget}，台风季关注停航。`,
    budgetFactor: 1.14,
    dayCap: 5,
    dayDelta: 1,
  },
  {
    suffix: 'study',
    tag: '研学',
    extraTags: ['博物馆', '科普'],
    titlePattern: (city, days) => `${city}研学${days}日：博物馆·科普场馆串联`,
    summaryPattern: (city, days, budget) =>
      `${city}研学${days}日：博物馆/科技馆/红色教育点预约参观，适合亲子与学生；人均约 ¥${budget}。`,
    budgetFactor: 1.05,
    dayCap: 5,
    dayDelta: 0,
  },
  {
    suffix: 'pet',
    tag: '宠物友好',
    extraTags: ['自驾', '公园'],
    titlePattern: (city, days) => `${city}宠物友好${days}日：可携宠公园·酒店确认`,
    summaryPattern: (city, days, budget) =>
      `${city}携宠${days}日：提前确认酒店/景区宠物政策，公园牵引绳必备；人均约 ¥${budget}（不含宠物托运/清洁费）。`,
    budgetFactor: 1.07,
    dayCap: 4,
    dayDelta: 0,
  },
  {
    suffix: 'town',
    tag: '古镇',
    extraTags: ['慢游', '民宿'],
    titlePattern: (city, days) => `${city}古镇${days}日：慢住民宿·清晨无客`,
    summaryPattern: (city, days, budget) =>
      `${city}古镇慢住${days}日：1 个古镇住满 2 晚+清晨扫街，少换酒店；人均约 ¥${budget}，周末房价先问清。`,
    budgetFactor: 1.09,
    dayCap: 4,
    dayDelta: 1,
  },
  {
    suffix: 'camp',
    tag: '露营',
    extraTags: ['户外', '星空'],
    titlePattern: (city, days) => `${city}露营${days}日：营地预约·防火安全`,
    summaryPattern: (city, days, budget) =>
      `${city}露营${days}日：正规营地/公园指定区，禁火区勿私搭；人均约 ¥${budget}，装备租赁比价。`,
    budgetFactor: 0.9,
    dayCap: 3,
    dayDelta: 0,
  },
  {
    suffix: 'business',
    tag: '商务',
    extraTags: ['差旅', '高效'],
    titlePattern: (city, days) => `${city}商务${days}日：高效通勤·晚间轻量游览`,
    summaryPattern: (city, days, budget) =>
      `${city}差旅${days}日：酒店近地铁/会场，白天办事晚间 1 条轻量夜游；人均约 ¥${budget}，报销票据留好。`,
    budgetFactor: 1.2,
    dayCap: 3,
    dayDelta: -1,
  },
]

/** 快捷 chip 三行：人群 / 季节 / 交通（下拉仍保留全部 24 类） */
export const INTENT_CHIP_GROUPS = [
  {
    id: 'crowd',
    labelKey: 'articles.intentChipGroupCrowd',
    values: [
      'featured',
      'variant',
      'family',
      'couple',
      'solo',
      'senior',
      'pet',
      'study',
      'food',
      'business',
      'town',
    ],
  },
  {
    id: 'season',
    labelKey: 'articles.intentChipGroupSeason',
    values: ['summer', 'winter', 'autumn', 'blossom', 'hotspring', 'night', 'island', 'camp'],
  },
  {
    id: 'transport',
    labelKey: 'articles.intentChipGroupTransport',
    values: ['hsr', 'drive', 'hike', 'photo', 'budget', 'temple', 'heritage'],
  },
]

export const INTENT_QUICK_CHIP_VALUES = [...new Set(INTENT_CHIP_GROUPS.flatMap((g) => g.values))]

/** 列表「出行意图」筛选项（value → i18n key articles.intentKind.*） */
export const INTENT_KIND_SUFFIXES = INTENT_SPECS.map((s) => s.suffix)

export const ARTICLE_INTENT_FILTER_OPTIONS = [
  { value: 'any', labelKey: 'articles.intentFilterAny' },
  { value: 'featured', labelKey: 'articles.intentFilterFeatured' },
  { value: 'variant', labelKey: 'articles.intentFilterVariant' },
  ...INTENT_SPECS.map((s) => ({ value: s.suffix, labelKey: `articles.intentKind.${s.suffix}` })),
]

const INTENT_FILTER_SET = new Set(ARTICLE_INTENT_FILTER_OPTIONS.map((o) => o.value))

/**
 * @param {{ featured?: boolean, intentVariant?: boolean, intentKind?: string, id?: string }} item
 * @param {string} intentFilter
 */
export function matchesArticleIntentFilter(item, intentFilter) {
  if (!intentFilter || intentFilter === 'any') return true
  if (intentFilter === 'featured') {
    return Boolean(item.featured) && String(item.id || '').startsWith('cn-feat-')
  }
  if (intentFilter === 'variant') return Boolean(item.intentVariant)
  return item.intentKind === intentFilter
}

export function isValidArticleIntentFilter(value) {
  return INTENT_FILTER_SET.has(value)
}

/**
 * @param {typeof chinaFeaturedArticles[0]} featured
 * @returns {Record<string, unknown>[]}
 */
export function buildIntentVariantsForFeatured(featured) {
  const anchorId = featured.id
  const slug = anchorId.replace(/^cn-feat-/, '')
  const city = featured.city
  if (!city || !slug) return []

  const baseDays = Math.max(2, Number(featured.days) || 3)
  const baseBudget = Math.max(800, Number(featured.budget) || 2000)
  const region = featured.region || null

  return INTENT_SPECS.map((spec, idx) => {
    const dayDelta = spec.dayDelta ?? 0
    const days = Math.min(spec.dayCap, Math.max(2, baseDays + dayDelta))
    const budget = Math.round(baseBudget * spec.budgetFactor)
    const intentSummary = spec.summaryPattern(city, days, budget)
    const tags = [...new Set([spec.tag, ...spec.extraTags, ...(featured.tags || []).slice(0, 1)])].slice(
      0,
      5,
    )

    return {
      id: `cn-var-${slug}-${spec.suffix}`,
      title: spec.titlePattern(city, days),
      intentSummary,
      cover: featured.cover,
      author: featured.author,
      date: featured.date,
      destination: '中国',
      city,
      ...(region ? { region } : {}),
      budget,
      days,
      likes: Math.max(180, (featured.likes || 1000) - 120 - idx * 30),
      views: Math.max(1500, (featured.views || 10000) - 800 - idx * 150),
      tags,
      contentTier: 'intent',
      intentVariant: true,
      intentKind: spec.suffix,
      guideAnchorId: anchorId,
      ...(featured.gallery ? { gallery: featured.gallery } : {}),
    }
  })
}

/** 全部深度路书对应的意图变体（每城 {@link INTENT_VARIANTS_PER_CITY} 条） */
export const chinaIntentVariantArticles = chinaFeaturedArticles.flatMap(buildIntentVariantsForFeatured)
