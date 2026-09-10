import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'tinted-academy-progress'

function readProgress(): string[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : []
  } catch {
    return []
  }
}

export function useProgress(totalLessons: number) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  useEffect(() => {
    setCompletedLessons(readProgress())
  }, [])

  const markLessonComplete = useCallback((lessonId: string) => {
    setCompletedLessons((current) => {
      if (current.includes(lessonId)) return current
      const next = [...current, lessonId]
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Progress remains available for this session when storage is unavailable.
      }
      return next
    })
  }, [])

  const setLessonComplete = useCallback((lessonId: string, complete: boolean) => {
    setCompletedLessons((current) => {
      const next = complete
        ? current.includes(lessonId) ? current : [...current, lessonId]
        : current.filter((id) => id !== lessonId)
      try {
        if (next.length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        else window.localStorage.removeItem(STORAGE_KEY)
      } catch {
        // Progress remains available for this session when storage is unavailable.
      }
      return next
    })
  }, [])

  const clearProgress = useCallback(() => {
    setCompletedLessons([])
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Progress remains available for this session when storage is unavailable.
    }
  }, [])

  const isLessonComplete = useCallback(
    (lessonId: string) => completedLessons.includes(lessonId),
    [completedLessons],
  )

  return {
    completedLessons,
    markLessonComplete,
    setLessonComplete,
    clearProgress,
    isLessonComplete,
    getCompletedLessons: () => completedLessons,
    getProgressPercentage: () => (totalLessons ? Math.round((completedLessons.length / totalLessons) * 100) : 0),
  }
}
