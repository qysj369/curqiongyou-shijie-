/**
 * 中国版第二轮：补回误删的纯占位模板段、去掉仍残留的「 · 英文」尾巴，
 * 并对无中文的整段英文界面串写死中文替换。
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const file = path.join(__dirname, '..', 'src', 'locales', 'zh-CN.json')

const sep = ' · '

/** 仅「 · 」分段：保留含中文、品牌、©，或主要为 i18n 占位符的段 */
function keepPart(p) {
  const t = p.trim()
  if (!t) return false
  if (/[\u4e00-\u9fff]/.test(t)) return true
  if (/^Roamwise/i.test(t)) return true
  if (/^©/.test(t)) return true
  if (/^\{\{[^}]+\}\}$/.test(t)) return true
  if (/\{\{/.test(t) && t.length < 48) return true
  return false
}

function stripBilingual(s) {
  if (typeof s !== 'string' || !s.includes(sep)) return s
  const parts = s.split(sep).map((p) => p.trim()).filter(Boolean)
  const kept = parts.filter(keepPart)
  if (kept.length === 0) return parts[0] ?? s
  return kept.join(sep)
}

/** 无汉字且含拉丁字母的叶子串 → 直接替换（品牌名等除外） */
const ASCII_LEAF_PATCH = {
  'home.mapCardPlaceNameEn': '外文地名（若有）',
  'home.mapCardTrustSafe': '✅ 独行也相对安心',
  'home.mapCardTrustNoTrap': '✅ 少踩典型游客陷阱',
  'home.heroSloganEn': '轻漫游者，向快乐出发',
  'home.heroPhotoCredit': '网络摄影素材（示意）',
  'home.sloganPrimaryEn': '聪明省钱，走得更远。',
  'home.sloganAlt1En': '智行天下，见所未见。',
  'home.sloganAlt2En': '不负每一公里。',
  'home.sloganAlt3En': '预算有价，梦想无疆。',
  'home.sloganAlt4En': '世界公民，彼此照应。',
  'home.randomDestinationEn': '随便带我去一个目的地',
  'home.globalMapSearchPlaceholder':
    '可搜国家/城市/关键词（如 日本、东京、平价住宿、日落机位）',
  'tripAiPage.dayTitle': '第 {{day}} 天',
  'mapHubPage.markerGuideTitle': '攻略点 · {{destination}}',
  'articles.authorDate': '{{author}} · {{date}}',
  'share.twitter': '推特',
  'share.youtube': '油管',
  'share.tiktok': '抖音',
  'share.instagram': '照片墙',
}

function walkStrip(o) {
  if (typeof o === 'string') return stripBilingual(o)
  if (Array.isArray(o)) return o.map(walkStrip)
  if (o && typeof o === 'object') {
    const n = {}
    for (const [k, v] of Object.entries(o)) n[k] = walkStrip(v)
    return n
  }
  return o
}

function setPath(root, dotPath, value) {
  const parts = dotPath.split('.')
  let cur = root
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i]
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {}
    cur = cur[k]
  }
  cur[parts[parts.length - 1]] = value
}

const raw = fs.readFileSync(file, 'utf8')
const data = JSON.parse(raw)

for (const [p, v] of Object.entries(ASCII_LEAF_PATCH)) {
  setPath(data, p, v)
}

// 标题模板曾被误剥，强制恢复
setPath(data, 'seo.pageTitleTemplate', '{{page}} · {{site}}')

const out = walkStrip(data)
fs.writeFileSync(file, `${JSON.stringify(out, null, 2)}\n`, 'utf8')
console.log('patched', file)
