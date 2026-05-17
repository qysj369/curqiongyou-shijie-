/**
 * GitHub Pages 子路径构建（与 .github/workflows/deploy-pages.yml 默认 BASE 一致）。
 * 用法：npm run build:pages
 */
import { spawnSync } from 'node:child_process'

const repoBase = process.env.PAGES_BASE || '/curqiongyou-shijie-/'
const siteUrl =
  process.env.VITE_SITE_URL || 'https://qysj369.github.io/curqiongyou-shijie-'

const env = {
  ...process.env,
  BASE: repoBase,
  VITE_SITE_URL: siteUrl.replace(/\/$/, ''),
}

console.log('[build:pages] BASE=%s', env.BASE)
console.log('[build:pages] VITE_SITE_URL=%s', env.VITE_SITE_URL)

const r = spawnSync('npm run build', {
  env,
  stdio: 'inherit',
  shell: true,
})

process.exit(typeof r.status === 'number' ? r.status : 1)
