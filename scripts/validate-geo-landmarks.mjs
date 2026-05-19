/**
 * 扫描全部攻略标题是否符合 geoLandmarkRules 中的地理标志约束。
 * 用法：npm run validate:geo
 *
 * 若 geoLandmarkRules 中 ENABLE_GEO_TITLE_LANDMARK_RULES 为 false，本脚本仍会退出 0，
 * 并提示「已跳过」。精修内容后改为 true 再跑此脚本做严格校验。
 */
import { articles } from '../src/data/articlesData.js'
import {
  ENABLE_GEO_TITLE_LANDMARK_RULES,
  validateArticleTitle,
} from '../src/data/geoLandmarkRules.js'
import {
  CHINA_ROUTE_TITLES,
  JAPAN_ROUTE_TITLES,
  USA_ROUTE_TITLES,
} from '../src/data/budgetRouteGenerator.js'

function checkLabel(label, title) {
  const { ok, failures } = validateArticleTitle(title)
  if (ok) return null
  return { label, title, failures }
}

const problems = []

if (!ENABLE_GEO_TITLE_LANDMARK_RULES) {
  console.log(
    'validate:geo SKIPPED — ENABLE_GEO_TITLE_LANDMARK_RULES is false (title↔landmark rules off).',
  )
  process.exit(0)
}

for (const a of articles) {
  // 意图变体标题侧重出行场景，地标以深度路书为准，不在此做城市地标硬校验
  if (String(a.id).startsWith('cn-var-')) continue
  const r = checkLabel(`article ${a.id}`, a.title)
  if (r) problems.push(r)
}

CHINA_ROUTE_TITLES.forEach((title, i) => {
  const r = checkLabel(`CHINA_ROUTE_TITLES[${i}]`, title)
  if (r) problems.push(r)
})

JAPAN_ROUTE_TITLES.forEach((title, i) => {
  const r = checkLabel(`JAPAN_ROUTE_TITLES[${i}]`, title)
  if (r) problems.push(r)
})

USA_ROUTE_TITLES.forEach((title, i) => {
  const r = checkLabel(`USA_ROUTE_TITLES[${i}]`, title)
  if (r) problems.push(r)
})

if (problems.length === 0) {
  console.log(
    `validate:geo OK — ${articles.length} articles + route title pools checked.`,
  )
  process.exit(0)
}

console.error(`validate:geo FAILED — ${problems.length} problem(s):\n`)
for (const p of problems) {
  console.error(`— ${p.label}`)
  console.error(`  title: ${p.title}`)
  for (const f of p.failures) {
    console.error(`  [${f.ruleId}] ${f.note ?? ''}`)
    console.error(`    need one of: ${f.needOneOf.join('、')}`)
  }
  console.error('')
}
process.exit(1)
