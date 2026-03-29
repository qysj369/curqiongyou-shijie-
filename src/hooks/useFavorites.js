import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'budget-travel-favorites'

function loadIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {}
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(loadIds)

  useEffect(() => {
    const stored = loadIds()
    setFavoriteIds(stored)
  }, [])

  const toggleFavorite = useCallback((articleId) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
      saveIds(next)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (articleId) => favoriteIds.includes(articleId),
    [favoriteIds],
  )

  return { favoriteIds, toggleFavorite, isFavorite }
}
