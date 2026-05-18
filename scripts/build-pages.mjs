/**
 * GitHub Pages 子路径构建（与 .github/workflows/deploy-pages.yml 默认 BASE 一致）。
 * 用法：npm run build:pages
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const repoBase = process.env.PAGES_BASE || '/curqiongyou-shijie-/'
const siteUrl =
  process.env.VITE_SITE_URL || 'https://qysj369.github.io/curqiongyou-shijie-'

const env = {
  ...process.env,
  BASE: repoBase,
  VITE_SITE_URL: siteUrl.replace(/\/$/, ''),
  NODE_OPTIONS: [
    process.env.NODE_OPTIONS,
    '--max-old-space-size=4096',
  ]
    .filter(Boolean)
    .join(' '),
}

console.log('[build:pages] BASE=%s', env.BASE)
console.log('[build:pages] VITE_SITE_URL=%s', env.VITE_SITE_URL)

const r = spawnSync('npm run build', {
  env,
  stdio: 'inherit',
  shell: true,
})

if (typeof r.status !== 'number' || r.status !== 0) {
  process.exit(typeof r.status === 'number' ? r.status : 1)
}

const assetsDir = resolve('dist', 'assets')
if (!existsSync(assetsDir) || readdirSync(assetsDir).length < 2) {
  console.error(
    '[build:pages] 构建未完成：dist/assets 缺失。请关闭其它占用内存的程序后重试，或在本机用 START.bat 先 npm run dev 预览。',
  )
  process.exit(1)
}

console.log('[build:pages] OK — dist/assets 已生成')
