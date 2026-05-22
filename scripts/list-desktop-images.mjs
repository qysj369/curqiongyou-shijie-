import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

const desktop = join(homedir(), 'Desktop')
const exts = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const files = []
for (const name of readdirSync(desktop)) {
  const ext = name.slice(name.lastIndexOf('.')).toLowerCase()
  if (!exts.has(ext)) continue
  const full = join(desktop, name)
  try {
    const st = statSync(full)
    if (st.isFile()) files.push({ name, full, size: st.size, mtime: st.mtimeMs })
  } catch {
    /* skip */
  }
}
files.sort((a, b) => b.mtime - a.mtime)
console.log('Desktop images (newest first):\n')
files.forEach((f, i) => {
  console.log(`${i + 1}. ${f.name}  (${Math.round(f.size / 1024)} KB)`)
  console.log(`   ${f.full}\n`)
})
