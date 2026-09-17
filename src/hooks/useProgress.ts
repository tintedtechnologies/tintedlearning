import { useCallback, useEffect, useState } from 'react'
import { useUser } from '@clerk/react'
import { curriculumStages, lessons } from '../data/curriculum'

const VALID_LESSON_IDS = new Set(lessons.map((lesson) => lesson.id))

function readRemoteProgress(value: unknown): string[] {
  const lessonsValue = Array.isArray(value) ? value : typeof value === 'object' && value !== null && 'completedLessons' in value ? (value as { completedLessons?: unknown }).completedLessons : []
  return Array.isArray(lessonsValue) && lessonsValue.every((item) => typeof item === 'string')
    ? lessonsValue.filter((item) => VALID_LESSON_IDS.has(item))
    : []
}

function getCompletedStageIds(completedLessonIds: string[]) {
  return curriculumStages.filter((stage) => {
    const stageLessons = stage.modules.flatMap((module) => module.lessons)
    return stageLessons.length > 0 && stageLessons.every((lesson) => completedLessonIds.includes(lesson.id))
  }).map((stage) => stage.id)
}

function getProgressDetails(completedLessonIds: string[]) {
  const orderedLessons = curriculumStages.flatMap((stage) => stage.modules.flatMap((module) => module.lessons.map((lesson) => ({ lesson, stage, module }))))
  const next = orderedLessons.find((entry) => !completedLessonIds.includes(entry.lesson.id)) ?? orderedLessons[orderedLessons.length - 1]
  const completedStages = curriculumStages.filter((stage) => getCompletedStageIds(completedLessonIds).includes(stage.id))
  return {
    completedStages: completedStages.map((stage) => ({ id: stage.id, title: stage.title })),
    currentStage: next ? { id: next.stage.id, title: next.stage.title } : null,
    currentModule: next ? { id: next.module.id, title: next.module.title } : null,
    currentLesson: next ? { id: next.lesson.id, title: next.lesson.title } : null,
  }
}

export function useProgress(totalLessons: number) {
  const { user } = useUser()
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  useEffect(() => {
    const storedProgress = user?.unsafeMetadata?.tintedProgress
    const lessonsFromStored = readRemoteProgress(storedProgress)
    setCompletedLessons(lessonsFromStored)
    if (user && Array.isArray(storedProgress)) {
      void user.update({ unsafeMetadata: { ...user.unsafeMetadata, tintedProgress: { completedLessons: lessonsFromStored, ...getProgressDetails(lessonsFromStored) } } })
    }
  }, [user?.id, user?.unsafeMetadata?.tintedProgress])

  const saveProgress = useCallback((next: string[]) => {
    if (!user) return
    void user.update({ unsafeMetadata: { ...user.unsafeMetadata, tintedProgress: { completedLessons: next, ...getProgressDetails(next) } } })
  }, [user])

  const markLessonComplete = useCallback((lessonId: string) => {
    setCompletedLessons((current) => {
      if (current.includes(lessonId)) return current
      const next = [...current, lessonId]
      saveProgress(next)
      return next
    })
  }, [saveProgress])

  const setLessonComplete = useCallback((lessonId: string, complete: boolean) => {
    setCompletedLessons((current) => {
      const next = complete
        ? current.includes(lessonId) ? current : [...current, lessonId]
        : current.filter((id) => id !== lessonId)
      saveProgress(next)
      return next
    })
  }, [saveProgress])

  const clearProgress = useCallback(() => {
    setCompletedLessons([])
    saveProgress([])
  }, [saveProgress])

  const isLessonComplete = useCallback(
    (lessonId: string) => completedLessons.includes(lessonId),
    [completedLessons],
  )

  return {
    completedLessons,
    ...getProgressDetails(completedLessons),
    markLessonComplete,
    setLessonComplete,
    clearProgress,
    isLessonComplete,
    getCompletedLessons: () => completedLessons,
    getProgressPercentage: () => (totalLessons ? Math.round((completedLessons.length / totalLessons) * 100) : 0),
  }
}
