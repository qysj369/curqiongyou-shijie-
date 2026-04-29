import { MAP_COUNTRY_TEMPLATES } from '../src/data/mapPoiOverrides.js'

const REQUIRED_FIELDS = ['freeScenic', 'foodUnder200', 'lowCostStay', 'realPitfall']
const MIN_COUNTRY_COUNT = 30

const names = Object.keys(MAP_COUNTRY_TEMPLATES || {})
const errors = []

if (names.length < MIN_COUNTRY_COUNT) {
  errors.push(`国家模板数量不足：当前 ${names.length}，至少需要 ${MIN_COUNTRY_COUNT}。`)
}

for (const country of names) {
  const row = MAP_COUNTRY_TEMPLATES[country] || {}
  for (const field of REQUIRED_FIELDS) {
    const value = row[field]
    if (typeof value !== 'string' || !value.trim()) {
      errors.push(`${country} 缺少字段：${field}`)
    }
  }
}

if (errors.length) {
  console.error('validate:country-templates FAILED')
  for (const msg of errors) console.error(`- ${msg}`)
  process.exit(1)
}

console.log(`validate:country-templates OK — 已检查 ${names.length} 个国家模板。`)
