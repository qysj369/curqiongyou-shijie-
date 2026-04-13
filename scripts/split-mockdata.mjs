import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = path.join(root, 'src/data/mockData.js')
const t = fs.readFileSync(src, 'utf8')
const lines = t.split(/\r?\n/)

// Line numbers are 1-based; array is 0-based
// head: before `export const articles` (destinations + featuredRoutes)
const head = lines.slice(0, 417).join('\n')
// articles only: export const articles = [ ... ]
const art = lines.slice(418, 1474).join('\n')
// a1Content … articleDetail (no latestArticles block)
const bodies = lines.slice(1475, 4724).join('\n')

const articleContent = `import { articles } from './articlesData.js'\n\n${bodies}\n`

const mockDataNew = `${head}

import { articles } from './articlesData.js'
export { articles }

export const latestArticles = articles
export const popularDestinations = destinations
export const routeToArticle = { r1: 'a1', r2: 'a2', r3: 'a3', r4: 'a4' }
export const featuredRoutesForHome = articles.slice(0, 54).map((a) => ({ ...a, cover: a.cover, id: a.id }))
`

fs.writeFileSync(path.join(root, 'src/data/articlesData.js'), `${art}\n`, 'utf8')
fs.writeFileSync(path.join(root, 'src/data/articleContent.js'), articleContent, 'utf8')
fs.writeFileSync(src, mockDataNew, 'utf8')
console.log('split ok: articlesData.js, articleContent.js, mockData.js')
