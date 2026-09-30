import { useCallback, useEffect, useRef, useState } from 'react'
import { useUser } from '@clerk/react'
import { curriculumStages, lessons } from '../data/curriculum'

const VALID_LESSON_IDS = new Set(lessons.map((lesson) => lesson.id))
export type LessonLearningCheck = 'practiced' | 'explained' | 'tested' | 'evidenced'
export type LessonLearningChecks = Record<LessonLearningCheck, boolean>
export interface StageAssessmentResult {
  score: number
  total: number
  passed: boolean
  completedAt: string
}
export interface StageAssessmentAttempt {
  answers: Record<number, string>
  currentIndex: number
}
interface ProgressSnapshot {
  completedLessons: string[]
  lessonChecks: Record<string, LessonLearningChecks>
  lessonQuizAnswers: Record<string, Record<number, string>>
  stageAssessmentResults: Record<string, StageAssessmentResult>
  stageAssessmentAttempts: Record<string, StageAssessmentAttempt>
}

const emptyLessonLearningChecks = (): LessonLearningChecks => ({ practiced: false, explained: false, tested: false, evidenced: false })

function readRemoteProgress(value: unknown): { completedLessons: string[]; lessonChecks: Record<string, LessonLearningChecks>; lessonQuizAnswers: Record<string, Record<number, string>>; stageAssessmentResults: Record<string, StageAssessmentResult>; stageAssessmentAttempts: Record<string, StageAssessmentAttempt> } {
  const lessonsValue = Array.isArray(value) ? value : typeof value === 'object' && value !== null && 'completedLessons' in value ? (value as { completedLessons?: unknown }).completedLessons : []
  const completedLessons = Array.isArray(lessonsValue) && lessonsValue.every((item) => typeof item === 'string')
    ? [...new Set(lessonsValue.filter((item) => VALID_LESSON_IDS.has(item)))]
    : []
  const rawChecks = typeof value === 'object' && value !== null && 'lessonChecks' in value ? (value as { lessonChecks?: unknown }).lessonChecks : {}
  const lessonChecks = typeof rawChecks === 'object' && rawChecks !== null
    ? Object.fromEntries(Object.entries(rawChecks).filter(([lessonId, checks]) => {
      if (!VALID_LESSON_IDS.has(lessonId) || typeof checks !== 'object' || checks === null) return false
      return Object.keys(emptyLessonLearningChecks()).every((key) => typeof (checks as Record<string, unknown>)[key] === 'boolean')
    }).map(([lessonId, checks]) => [lessonId, { ...emptyLessonLearningChecks(), ...(checks as Partial<LessonLearningChecks>) }]))
    : {}
  const rawResults = typeof value === 'object' && value !== null && 'stageAssessmentResults' in value ? (value as { stageAssessmentResults?: unknown }).stageAssessmentResults : {}
  const stageAssessmentResults = typeof rawResults === 'object' && rawResults !== null
    ? Object.fromEntries(Object.entries(rawResults).filter(([, result]) => {
      if (typeof result !== 'object' || result === null) return false
      const value = result as Record<string, unknown>
      return typeof value.score === 'number' && typeof value.total === 'number' && typeof value.passed === 'boolean' && typeof value.completedAt === 'string'
    })) as Record<string, StageAssessmentResult>
    : {}
  const rawQuizAnswers = typeof value === 'object' && value !== null && 'lessonQuizAnswers' in value ? (value as { lessonQuizAnswers?: unknown }).lessonQuizAnswers : {}
  const lessonQuizAnswers = typeof rawQuizAnswers === 'object' && rawQuizAnswers !== null
    ? Object.fromEntries(Object.entries(rawQuizAnswers).filter(([lessonId, answers]) => VALID_LESSON_IDS.has(lessonId) && typeof answers === 'object' && answers !== null).map(([lessonId, answers]) => [lessonId, answers as Record<number, string>])) as Record<string, Record<number, string>>
    : {}
  const rawAttempts = typeof value === 'object' && value !== null && 'stageAssessmentAttempts' in value ? (value as { stageAssessmentAttempts?: unknown }).stageAssessmentAttempts : {}
  const stageAssessmentAttempts = typeof rawAttempts === 'object' && rawAttempts !== null
    ? Object.fromEntries(Object.entries(rawAttempts).filter(([stageId, attempt]) => {
      if (!curriculumStages.some((stage) => stage.id === stageId) || typeof attempt !== 'object' || attempt === null) return false
      const value = attempt as Record<string, unknown>
      return typeof value.currentIndex === 'number' && typeof value.answers === 'object' && value.answers !== null
    })) as Record<string, StageAssessmentAttempt>
    : {}
  return { completedLessons, lessonChecks, lessonQuizAnswers, stageAssessmentResults, stageAssessmentAttempts }
}

function getCompletedStageIds(completedLessonIds: string[]) {
  return curriculumStages.filter((stage) => {
    const stageLessons = stage.modules.flatMap((module) => module.lessons)
    return stageLessons.length > 0 && stageLessons.every((lesson) => completedLessonIds.includes(lesson.id))
  }).map((stage) => stage.id)
}

function getProgressDetails(completedLessonIds: string[]) {
  const orderedLessons = curriculumStages.flatMap((stage) => stage.modules.flatMap((module) => module.lessons.map((lesson) => ({ lesson, stage, module }))))
  const next = orderedLessons.find((entry) => !completedLessonIds.includes(entry.lesson.id))
  const completedStages = curriculumStages.filter((stage) => getCompletedStageIds(completedLessonIds).includes(stage.id))
  return {
    completedStages: completedStages.map((stage) => ({ id: stage.id, title: stage.title })),
    currentStage: next ? { id: next.stage.id, title: next.stage.title } : null,
    currentModule: next ? { id: next.module.id, title: next.module.title } : null,
    currentLesson: next ? { id: next.lesson.id, title: next.lesson.title } : null,
  }
}

export function useProgress(totalLessons: number) {
  const { user, isLoaded: isUserLoaded } = useUser()
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [lessonChecks, setLessonChecks] = useState<Record<string, LessonLearningChecks>>({})
  const [lessonQuizAnswers, setLessonQuizAnswersState] = useState<Record<string, Record<number, string>>>({})
  const [stageAssessmentResults, setStageAssessmentResults] = useState<Record<string, StageAssessmentResult>>({})
  const [stageAssessmentAttempts, setStageAssessmentAttempts] = useState<Record<string, StageAssessmentAttempt>>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const saveQueue = useRef<Promise<void>>(Promise.resolve())
  const progressRef = useRef<ProgressSnapshot>({ completedLessons: [], lessonChecks: {}, lessonQuizAnswers: {}, stageAssessmentResults: {}, stageAssessmentAttempts: {} })

  useEffect(() => {
    if (!isUserLoaded) return
    const storedProgress = user?.unsafeMetadata?.tintedProgress
    const stored = readRemoteProgress(storedProgress)
    progressRef.current = stored
    setCompletedLessons(stored.completedLessons)
    setLessonChecks(stored.lessonChecks)
    setLessonQuizAnswersState(stored.lessonQuizAnswers)
    setStageAssessmentResults(stored.stageAssessmentResults)
    setStageAssessmentAttempts(stored.stageAssessmentAttempts)
    setIsLoaded(true)
    if (user && Array.isArray(storedProgress)) {
      void user.updateMetadata({ unsafeMetadata: { tintedProgress: { completedLessons: stored.completedLessons, lessonChecks: stored.lessonChecks, lessonQuizAnswers: stored.lessonQuizAnswers, stageAssessmentResults: stored.stageAssessmentResults, stageAssessmentAttempts: stored.stageAssessmentAttempts, ...getProgressDetails(stored.completedLessons) } } })
    }
  }, [isUserLoaded, user?.id, user?.unsafeMetadata?.tintedProgress])

  const saveProgress = useCallback((snapshot: ProgressSnapshot) => {
    if (!user) return
    const uniqueNext = [...new Set(snapshot.completedLessons)]
    const nextSnapshot = { ...snapshot, completedLessons: uniqueNext }
    progressRef.current = nextSnapshot
    saveQueue.current = saveQueue.current.catch(() => undefined).then(async () => {
      setIsSaving(true)
      setSaveError('')
      await user.updateMetadata({ unsafeMetadata: { tintedProgress: { ...nextSnapshot, ...getProgressDetails(nextSnapshot.completedLessons) } } })
    }).catch(() => {
      setSaveError('Your latest progress change could not be saved. Please try again.')
    }).finally(() => {
      setIsSaving(false)
    })
  }, [user])

  const commitProgress = useCallback((snapshot: ProgressSnapshot) => {
    progressRef.current = snapshot
    setCompletedLessons(snapshot.completedLessons)
    setLessonChecks(snapshot.lessonChecks)
    setLessonQuizAnswersState(snapshot.lessonQuizAnswers)
    setStageAssessmentResults(snapshot.stageAssessmentResults)
    setStageAssessmentAttempts(snapshot.stageAssessmentAttempts)
    saveProgress(snapshot)
  }, [saveProgress])

  const markLessonComplete = useCallback((lessonId: string) => {
    const current = progressRef.current
    if (current.completedLessons.includes(lessonId)) return
    commitProgress({ ...current, completedLessons: [...current.completedLessons, lessonId] })
  }, [commitProgress])

  const setLessonComplete = useCallback((lessonId: string, complete: boolean) => {
    const current = progressRef.current
    const completedLessons = complete
      ? current.completedLessons.includes(lessonId) ? current.completedLessons : [...current.completedLessons, lessonId]
      : current.completedLessons.filter((id) => id !== lessonId)
    commitProgress({ ...current, completedLessons })
  }, [commitProgress])

  const setLessonLearningCheck = useCallback((lessonId: string, check: LessonLearningCheck, complete: boolean) => {
    const current = progressRef.current
    const lessonChecks = { ...current.lessonChecks, [lessonId]: { ...emptyLessonLearningChecks(), ...(current.lessonChecks[lessonId] ?? {}), [check]: complete } }
    commitProgress({ ...current, lessonChecks })
  }, [commitProgress])

  const setStageAssessmentResult = useCallback((stageId: string, score: number, total: number, passingScore = 0.8) => {
    const current = progressRef.current
    const stageAssessmentResults = { ...current.stageAssessmentResults, [stageId]: { score, total, passed: total > 0 && score / total >= passingScore, completedAt: new Date().toISOString() } }
    commitProgress({ ...current, stageAssessmentResults })
  }, [commitProgress])

  const setLessonQuizAnswers = useCallback((lessonId: string, answers: Record<number, string>) => {
    const current = progressRef.current
    commitProgress({ ...current, lessonQuizAnswers: { ...current.lessonQuizAnswers, [lessonId]: answers } })
  }, [commitProgress])

  const getLessonQuizAnswers = useCallback(
    (lessonId: string) => lessonQuizAnswers[lessonId] ?? {},
    [lessonQuizAnswers],
  )

  const saveStageAssessmentAttempt = useCallback((stageId: string, attempt: StageAssessmentAttempt | null) => {
    const current = progressRef.current
    const stageAssessmentAttempts = { ...current.stageAssessmentAttempts }
    if (attempt) stageAssessmentAttempts[stageId] = attempt
    else delete stageAssessmentAttempts[stageId]
    commitProgress({ ...current, stageAssessmentAttempts })
  }, [commitProgress])

  const clearProgress = useCallback(() => {
    commitProgress({ completedLessons: [], lessonChecks: {}, lessonQuizAnswers: {}, stageAssessmentResults: {}, stageAssessmentAttempts: {} })
  }, [commitProgress])

  const isLessonComplete = useCallback(
    (lessonId: string) => completedLessons.includes(lessonId),
    [completedLessons],
  )

  const getLessonChecks = useCallback(
    (lessonId: string) => lessonChecks[lessonId] ?? emptyLessonLearningChecks(),
    [lessonChecks],
  )

  const hasPassedStageAssessment = useCallback(
    (stageId: string) => stageAssessmentResults[stageId]?.passed === true,
    [stageAssessmentResults],
  )

  return {
    completedLessons,
    lessonChecks,
    lessonQuizAnswers,
    stageAssessmentResults,
    stageAssessmentAttempts,
    isLoaded,
    isSaving,
    saveError,
    ...getProgressDetails(completedLessons),
    markLessonComplete,
    setLessonComplete,
    clearProgress,
    isLessonComplete,
    getLessonChecks,
    getLessonQuizAnswers,
    setLessonQuizAnswers,
    setLessonLearningCheck,
    setStageAssessmentResult,
    saveStageAssessmentAttempt,
    hasPassedStageAssessment,
    getCompletedLessons: () => completedLessons,
    getProgressPercentage: () => (totalLessons ? Math.round((completedLessons.length / totalLessons) * 100) : 0),
  }
}
