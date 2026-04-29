import { useEffect } from 'react'

export default function JsonLd({ data, scriptId = 'jsonld-article' }) {
  useEffect(() => {
    if (!data) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    script.id = scriptId
    const existing = document.getElementById(script.id)
    if (existing) existing.remove()
    document.head.appendChild(script)
    return () => {
      const el = document.getElementById(script.id)
      if (el) el.remove()
    }
  }, [data, scriptId])
  return null
}
