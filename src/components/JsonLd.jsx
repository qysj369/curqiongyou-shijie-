import { useEffect } from 'react'

export default function JsonLd({ data }) {
  useEffect(() => {
    if (!data) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    script.id = 'jsonld-article'
    const existing = document.getElementById(script.id)
    if (existing) existing.remove()
    document.head.appendChild(script)
    return () => {
      const el = document.getElementById(script.id)
      if (el) el.remove()
    }
  }, [data])
  return null
}
