/**
 * One-off: list African destinations sharing same primary photo slug.
 */
import { PRIMARY_IMAGE_BY_COUNTRY } from '../src/data/destinationPrimaryImages.js'
import { destinations } from '../src/data/mockData.js'

const africa = new Set(destinations.filter((d) => d.continent === '非洲').map((d) => d.name))
const idToNames = {}
for (const [name, url] of Object.entries(PRIMARY_IMAGE_BY_COUNTRY)) {
  if (!africa.has(name)) continue
  const slug = url?.match(/photo-(\d+-\w+)/)?.[1]
  if (!slug) continue
  if (!idToNames[slug]) idToNames[slug] = []
  idToNames[slug].push(name)
}
const dupes = Object.entries(idToNames)
  .filter(([, names]) => names.length > 1)
  .sort((a, b) => b[1].length - a[1].length)
for (const [slug, names] of dupes) {
  console.log(`${slug}\t${names.length}\t${names.join('、')}`)
}
