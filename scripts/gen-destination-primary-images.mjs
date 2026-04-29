import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { DESTINATIONS_EXPANSION } from '../src/data/destinationsExpansionData.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const mockPath = path.join(__dirname, '../src/data/mockData.js')
const s = fs.readFileSync(mockPath, 'utf8')
const re = /name: '([^']+)'[^]*?image: '(https:[^']+)'/g
const m = {}
let x
while ((x = re.exec(s)) !== null) {
  m[x[1]] = x[2]
}
for (const d of DESTINATIONS_EXPANSION) {
  m[d.name] = d.image
}
const lines = Object.keys(m)
  .sort()
  .map((k) => `  '${k.replace(/'/g, "\\'")}': '${m[k]}',`)
const out = `/** Aligned with mockData destinationsBase — one primary image per country for article covers. */
export const PRIMARY_IMAGE_BY_COUNTRY = {
${lines.join('\n')}
}
`
const outPath = path.join(__dirname, '../src/data/destinationPrimaryImages.js')
fs.writeFileSync(outPath, out, 'utf8')
console.log('written', outPath, Object.keys(m).length)
