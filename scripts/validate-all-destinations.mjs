/**
 * 对全部注册目的地（与 mockData / 主图表一致）做一致性校验：
 * - 名称三方对齐：DESTINATION_NAMES、destinationPrimaryImages、mockData.destinations
 * - 每国主图为合法 Unsplash URL
 * - 每目的地攻略数量不低于下限（与中国/日本覆盖规则一致）
 * - 无「未知目的地」攻略
 *
 * 用法：npm run validate:destinations
 */
import { DESTINATION_NAMES } from '../src/data/budgetRouteGenerator.js'
import { PRIMARY_IMAGE_BY_COUNTRY } from '../src/data/destinationPrimaryImages.js'
import { HOT_DESTINATION_ARTICLE_MIN, HOT_DESTINATION_NAMES } from '../src/data/hotDestinations.js'
import { destinations } from '../src/data/mockData.js'
import { articles } from '../src/data/articlesData.js'

const MIN_DEFAULT = 40
const MIN_HOT = HOT_DESTINATION_ARTICLE_MIN
const MIN_OVERRIDES = { 中国: 180 }
const hotDestinationSet = new Set(HOT_DESTINATION_NAMES)

function asSet(arr) {
  return new Set(arr)
}

const namesFromList = asSet(DESTINATION_NAMES)
const namesFromPrimary = asSet(Object.keys(PRIMARY_IMAGE_BY_COUNTRY))
const namesFromMock = asSet(destinations.map((d) => d.name))

const problems = []

if (DESTINATION_NAMES.length !== namesFromList.size) {
  problems.push('DESTINATION_NAMES 中存在重复项')
}

function diffLabel(a, b, labelA, labelB) {
  const onlyA = [...a].filter((x) => !b.has(x))
  const onlyB = [...b].filter((x) => !a.has(x))
  if (onlyA.length || onlyB.length) {
    problems.push(
      `${labelA} 与 ${labelB} 不一致：仅在 ${labelA} 有 [${onlyA.join('、')}]；仅在 ${labelB} 有 [${onlyB.join('、')}]`,
    )
  }
}

diffLabel(namesFromList, namesFromPrimary, 'DESTINATION_NAMES', 'PRIMARY_IMAGE_BY_COUNTRY')
diffLabel(namesFromList, namesFromMock, 'DESTINATION_NAMES', 'mockData.destinations')

for (const n of DESTINATION_NAMES) {
  const url = PRIMARY_IMAGE_BY_COUNTRY[n]
  if (!url || typeof url !== 'string') {
    problems.push(`缺少主图 URL：${n}`)
    continue
  }
  if (!/^https:\/\/images\.unsplash\.com\/photo-\d+-/.test(url)) {
    problems.push(`主图非预期 Unsplash 格式：${n} → ${url.slice(0, 80)}`)
  }
}

/** @type {Record<string, number>} */
const countByDest = {}
for (const a of articles) {
  const d = a.destination
  if (!d) continue
  countByDest[d] = (countByDest[d] || 0) + 1
}

for (const n of DESTINATION_NAMES) {
  const min = MIN_OVERRIDES[n] ?? (hotDestinationSet.has(n) ? MIN_HOT : MIN_DEFAULT)
  const c = countByDest[n] ?? 0
  if (c < min) {
    problems.push(`攻略篇数不足：${n} 当前 ${c} 篇，要求 ≥ ${min}`)
  }
}

const allowed = namesFromList
for (const d of Object.keys(countByDest)) {
  if (!allowed.has(d)) {
    problems.push(`存在未注册目的地的攻略：destination =「${d}」共 ${countByDest[d]} 篇`)
  }
}

if (problems.length === 0) {
  const n = DESTINATION_NAMES.length
  console.log(
    `validate:destinations OK — 共 ${n} 个目的地已全部校验（名称/主图/篇数/无孤儿目的地）。`,
  )
  process.exit(0)
}

console.error(`validate:destinations FAILED — ${problems.length} 项：\n`)
for (const p of problems) console.error(`— ${p}`)
console.error('')
process.exit(1)
