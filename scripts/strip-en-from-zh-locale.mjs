/**
 * 中国版：zh-CN.json 中按「 · 」分段，只保留含中文、品牌或版权标记的片段。
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const file = path.join(__dirname, '..', 'src', 'locales', 'zh-CN.json')

const sep = ' · '

function keepPart(p) {
  const t = p.trim()
  if (!t) return false
  if (/[\u4e00-\u9fff]/.test(t)) return true
  if (/^Roamwise/i.test(t)) return true
  if (/^©/.test(t)) return true
  // 仅含占位符且无中文的段落（多为英文说明）丢弃
  if (/\{\{/.test(t) && /[\u4e00-\u9fff]/.test(t)) return true
  return false
}

function stripAggressive(s) {
  if (typeof s !== 'string' || !s.includes(sep)) return s
  const parts = s.split(sep).map((p) => p.trim()).filter(Boolean)
  const kept = parts.filter(keepPart)
  if (kept.length === 0) return parts[0] ?? s
  return kept.join(sep)
}

function walk(o) {
  if (typeof o === 'string') return stripAggressive(o)
  if (Array.isArray(o)) return o.map(walk)
  if (o && typeof o === 'object') {
    const n = {}
    for (const [k, v] of Object.entries(o)) n[k] = walk(v)
    return n
  }
  return o
}

const raw = fs.readFileSync(file, 'utf8')
const data = JSON.parse(raw)
const out = walk(data)
fs.writeFileSync(file, `${JSON.stringify(out, null, 2)}\n`, 'utf8')
console.log('wrote', file)
