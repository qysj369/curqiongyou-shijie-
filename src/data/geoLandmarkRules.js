/**
 * 攻略标题「地理标志」校验：标题中出现某城市/区域名时，应同时出现对应地标关键词，避免空泛地名。
 * 规则可随业务扩充；校验脚本见 scripts/validate-geo-landmarks.mjs
 *
 * 注意：意大利「罗马」规则使用 /罗马(?!尼亚)/，避免误匹配「罗马尼亚」。
 * 国家/地区名规则由 geoLandmarkPools.LANDMARKS_BY_DESTINATION 生成；「中国」排除日本线路里「中国：」
 * （日本中国地方）误触发。
 *
 * 【策略】标题中出现具体城市/区域名时，须同时出现与之对应的真实地标关键词，避免空泛或误导。
 * 自动补篇若仅国家名（如「泰国7日…」）不触发规则；含「北京」「巴黎」等则必须可核对。
 */
import { LANDMARKS_BY_DESTINATION } from './geoLandmarkPools.js'
import { ALL_DESTINATION_NAMES } from './un193MembersZh.js'

export const ENABLE_GEO_TITLE_LANDMARK_RULES = true

/** @typedef {{ id: string, note?: string, trigger: RegExp, requireAnyOf: string[], destinationName?: string }} GeoLandmarkRule */

function escapeRegExp(s) {
  return s.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
}

/**
 * 标题中出现国家/地区全称时，须含该地地标池任一词（与 ALL_DESTINATION_NAMES 对齐）。
 * 触发词按名称长度从长到短，减少「刚果（金）/刚果（布）」等短名抢先匹配。
 */
function buildDestinationRules() {
  const names = [...ALL_DESTINATION_NAMES].sort((a, b) => b.length - a.length || a.localeCompare(b, 'zh-Hans'))
  return names.flatMap((name, idx) => {
    const pool = LANDMARKS_BY_DESTINATION[name] || []
    if (!pool.length) return []
    const trigger =
      name === '中国'
        ? /中国(?!：|地方)/u
        : name === '苏丹'
          ? /苏丹(?!纪念馆|王宫|办公厅|清真寺)/u
        : name === '马里'
          ? /(?<![拉])马里(?!波萨|安曼)/u
        : name === '汤加'
          ? /(?<![罗])汤加/u
        : name === '西班牙'
          ? /西班牙(?!港)/u
        : name === '法国'
          ? /法国(?!区)/u
        : name === '墨西哥'
          ? /墨西哥(?!州)/u
        : name === '哥伦比亚'
          ? /哥伦比亚(?!特区|河谷)/u
        : name === '蒙古'
          ? /(?<![内])蒙古/u
        : name === '黑山'
          ? /(?<![老])黑山/u
        : name === '冰岛'
          ? /冰岛(?!茶)/u
        : name === '巴林'
          ? /(?<![强])巴林(?!寺)/u
        : name === '海地'
          ? /(?<![黑])海地/u
          : new RegExp(escapeRegExp(name), 'u')
    return [
      {
        id: `dst-${idx}`,
        destinationName: name,
        note: `标题含「${name}」时须出现可核对的地理标志之一`,
        trigger,
        requireAnyOf: pool,
      },
    ]
  })
}

/** @type {GeoLandmarkRule[]} */
const GEO_TITLE_LANDMARK_RULES_LEGACY = [
  {
    id: 'cn-jinan',
    note: '济南以趵突泉为第一地理标志',
    trigger: /济南/,
    requireAnyOf: ['趵突泉'],
  },
  {
    id: 'cn-beijing',
    note: '北京须点出紫禁城/天安门等核心意象之一',
    trigger: /北京/,
    requireAnyOf: [
      '紫禁城',
      '天安门',
      '故宫',
      '长城',
      '颐和园',
      '天坛',
      '皇城',
      '国博',
      '国家博物馆',
    ],
  },
  {
    id: 'us-nyc',
    note: '纽约须点出自由女神等地标之一；「纽约」可作城市核对词（与骨架标题一致）',
    trigger: /纽约/,
    requireAnyOf: ['纽约', '自由女神', '时代广场', '中央公园', '曼哈顿', '布鲁克林', '华尔街', '第五大道', '百老汇', '大都会博物馆', '帝国大厦'],
  },
  {
    id: 'us-la',
    note: '洛杉矶常用好莱坞/环球等；「洛杉矶」可作城市核对词',
    trigger: /洛杉矶/,
    requireAnyOf: ['洛杉矶', '好莱坞', '环球影城', '圣莫尼卡', '格里斐斯', '迪士尼', '比弗利'],
  },
  {
    id: 'us-sf',
    note: '旧金山常用金门大桥等；「旧金山」可作城市核对词',
    trigger: /旧金山|三藩/,
    requireAnyOf: ['旧金山', '金门', '渔人码头', '九曲花街', '恶魔岛', '铛铛车'],
  },
  {
    id: 'fr-paris',
    note: '巴黎常用埃菲尔等地标；「巴黎」本身可作为首都级核对词（与自动补篇「法国·巴黎…」一致）',
    trigger: /巴黎/,
    requireAnyOf: ['巴黎', '埃菲尔', '卢浮宫', '凯旋门', '圣母院', '蒙马特', '塞纳河', '卢浮', '凯旋', '埃菲', '蒙马', '博物'],
  },
  {
    id: 'uk-london',
    note: '伦敦常用大本钟/塔桥等；「伦敦」可作城市核对词',
    trigger: /伦敦/,
    requireAnyOf: ['伦敦', '大本钟', '伦敦塔', '大英博物馆', '塔桥', '西敏寺', '白金汉宫', '泰晤士'],
  },
  {
    id: 'cn-xian',
    note: '西安常用兵马俑/大雁塔等',
    trigger: /西安/,
    requireAnyOf: ['兵马俑', '大雁塔', '华山', '回民街', '钟楼', '城墙', '陕博', '碑林'],
  },
  {
    id: 'cn-chengdu',
    note: '成都常用大熊猫基地/宽窄巷子或川西线名山',
    trigger: /成都/,
    requireAnyOf: ['大熊猫', '宽窄', '锦里', '武侯', '青城山', '都江堰', '杜甫草堂', '四姑娘', '乐山', '峨眉', '康定', '毕棚沟'],
  },
  {
    id: 'cn-lhasa',
    note: '拉萨/藏南线常用布达拉宫、珠峰、日喀则等地标',
    trigger: /拉萨/,
    requireAnyOf: [
      '布达拉宫',
      '大昭寺',
      '八廓',
      '羊湖',
      '纳木错',
      '扎基寺',
      '罗布林卡',
      '日喀则',
      '珠峰',
      '珠峰大本营',
      '林芝',
      '阿里',
      '冈仁波齐',
    ],
  },
  {
    id: 'cn-hangzhou',
    note: '杭州常用西湖/灵隐等',
    trigger: /杭州/,
    requireAnyOf: ['西湖', '灵隐', '西溪', '运河', '千岛湖', '钱塘江', '法喜寺'],
  },
  {
    id: 'cn-nanjing',
    note: '南京常用中山陵/夫子庙等',
    trigger: /南京/,
    requireAnyOf: ['中山陵', '夫子庙', '明城墙', '总统府', '博物院', '美龄宫', '玄武湖', '秦淮河'],
  },
  {
    id: 'cn-chongqing',
    note: '重庆常用洪崖洞/长江索道或三峡线景点；「重庆」可作城市核对词',
    trigger: /重庆/,
    requireAnyOf: ['重庆', '洪崖洞', '长江索道', '武隆', '三峡', '磁器口', '大足', '天生三桥', '白帝城', '酉阳', '奉节', '万州', '巫山', '山城'],
  },
  {
    id: 'jp-tokyo',
    note: '东京常用晴空塔/浅草等；「东京」可作城市核对词',
    trigger: /东京/,
    requireAnyOf: [
      '东京',
      '晴空塔',
      '浅草',
      '秋叶原',
      '涩谷',
      '迪士尼',
      '御台场',
      '台场',
      '目黑',
      '千鸟渊',
      '新宿',
      '镰仓',
      '下北泽',
      '谷中',
      '隅田川',
      '丸之内',
      '皇居',
      '六本木',
      '池袋',
      '原宿',
    ],
  },
  {
    id: 'jp-osaka',
    note: '大阪常用道顿堀/黑门市场/USJ 等；「大阪」可作城市核对词',
    trigger: /大阪/,
    requireAnyOf: ['大阪', '道顿堀', 'USJ', '大阪城', '梅田', '环球影城', '心斋桥', '通天阁', '黑门'],
  },
  {
    id: 'jp-kyoto',
    note: '京都市/京都府北部常用清水寺、天桥立、伊根舟屋等；「京都」可作城市核对词',
    trigger: /京都/,
    requireAnyOf: ['京都', '清水寺', '祇园', '岚山', '金阁', '伏见', '锦市场', '南禅寺', '银阁', '天桥立', '伊根', '宫津'],
  },
  {
    id: 'es-barcelona',
    note: '巴塞罗那常用圣家堂/兰布拉等；「巴塞罗那」可作城市核对词',
    trigger: /巴塞罗那/,
    requireAnyOf: ['巴塞罗那', '圣家堂', '高迪', '兰布拉', '巴特罗', '古埃尔', '诺坎普', '哥特区'],
  },
  {
    id: 'it-rome',
    note: '罗马（意大利）常用斗兽场/梵蒂冈等；不匹配「罗马尼亚」；「罗马」可作城市核对词',
    trigger: /罗马(?!尼亚)/,
    requireAnyOf: ['罗马', '斗兽场', '梵蒂冈', '许愿池', '西班牙广场', '万神殿', '真理之口', '帕拉蒂尼'],
  },
]

/** 城市级细则优先；其后为 199 个目的地与地标池对齐 */
export const GEO_TITLE_LANDMARK_RULES = [...GEO_TITLE_LANDMARK_RULES_LEGACY, ...buildDestinationRules()]

/**
 * @param {string} title
 * @returns {{ ok: boolean, failures: { ruleId: string, note?: string, needOneOf: string[] }[] }}
 */
export function validateArticleTitle(title) {
  if (!ENABLE_GEO_TITLE_LANDMARK_RULES) {
    return { ok: true, failures: [] }
  }
  if (!title || typeof title !== 'string') {
    return { ok: true, failures: [] }
  }
  /** 避免出现「印度」匹配「印度尼西亚」、「几内亚」匹配「巴布亚新几内亚」等短名抢先触发 */
  const namesInTitle = ALL_DESTINATION_NAMES.filter((n) => title.includes(n))
  const maximalDestination = new Set(
    namesInTitle.filter((n) => !namesInTitle.some((m) => m !== n && m.length > n.length && m.includes(n))),
  )
  const failures = []
  for (const rule of GEO_TITLE_LANDMARK_RULES) {
    if (rule.destinationName && !maximalDestination.has(rule.destinationName)) continue
    if (!rule.trigger.test(title)) continue
    const hit = rule.requireAnyOf.some((kw) => title.includes(kw))
    if (!hit) {
      failures.push({ ruleId: rule.id, note: rule.note, needOneOf: rule.requireAnyOf })
    }
  }
  return { ok: failures.length === 0, failures }
}

/**
 * @param {Array<{ title?: string, id?: string }>} items
 */
export function validateArticleList(items) {
  /** @type {{ id: string, title: string, failures: ReturnType<typeof validateArticleTitle>['failures'] }[]} */
  const bad = []
  for (const item of items) {
    const title = item.title
    if (!title) continue
    const { ok, failures } = validateArticleTitle(title)
    if (!ok) bad.push({ id: String(item.id ?? '?'), title, failures })
  }
  return bad
}
