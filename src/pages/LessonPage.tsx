import { Check, Clock3 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ProjectPage } from '../components/learning/ProjectPage'
import { projectPlans } from '../data/projects'
import { getCurriculumLessonSequence, lessons } from '../data/curriculum'
import { lessonProjects } from '../data/lessonProjects'
import { useProgress } from '../hooks/useProgress'
import { SeoMetadata } from '../components/common/SeoMetadata'
import { StructuredLessonBody } from '../components/learning/StructuredLessonBody'
import { structuredLessons } from '../data/lessons'
import { buildMinutes as structuredBuildMinutes, readingMinutes as structuredReadingMinutes } from '../data/lessons/stats'

export function LessonPage() {
  const { lessonId } = useParams()
  const progress = useProgress(lessons.length)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [evidenceNote, setEvidenceNote] = useState('')
  const lesson = lessons.find((item) => item.id === lessonId)
  const structured = lesson ? structuredLessons[lesson.id] : undefined
  const projectPlan = lesson ? projectPlans[lesson.id] : undefined

  // Each visit starts the quiz empty. Earlier answers are kept in saved progress for the
  // "tested" record, but they are not shown again, so a learner always answers the questions.
  useEffect(() => {
    setAnswers({})
    setEvidenceNote(progress.getLessonEvidenceNote(lessonId ?? ''))
  }, [lessonId])

  // When saved progress finishes loading, merge in the evidence note without wiping one typed meanwhile.
  useEffect(() => {
    if (!progress.isLoaded) return
    setEvidenceNote((current) => current || progress.getLessonEvidenceNote(lessonId ?? ''))
  }, [progress.isLoaded])

  if (!lesson) return <Navigate to="/learn" replace />
  if (projectPlan) return <ProjectPage lesson={lesson} plan={projectPlan} lessonTitles={Object.fromEntries(lessons.map((item) => [item.id, item.title]))} />
  // Every lesson is either a project or a structured lesson. Anything else has no content to show.
  if (!structured) return <Navigate to="/learn" replace />

  const quizzes = structured.quiz.map((quiz) => ({ answer: quiz.options[quiz.answer].text }))
  const readingMinutes = structuredReadingMinutes(structured)
  const buildMinutes = structuredBuildMinutes(structured)
  const answerQuiz = (index: number, choice: string) => {
    const nextAnswers = { ...answers, [index]: choice }
    setAnswers(nextAnswers)
    progress.setLessonQuizAnswers(lesson.id, nextAnswers)
    progress.setLessonLearningCheck(lesson.id, 'tested', quizzes.every((quiz, quizIndex) => nextAnswers[quizIndex] === quiz.answer))
  }
  const retryQuiz = () => {
    setAnswers({})
    progress.setLessonQuizAnswers(lesson.id, {})
    progress.setLessonLearningCheck(lesson.id, 'tested', false)
  }
  const saveEvidenceNote = () => progress.setLessonEvidenceNote(lesson.id, evidenceNote)
  const curriculumLessons = getCurriculumLessonSequence()
  const currentIndex = curriculumLessons.findIndex((item) => item.id === lesson.id)
  const previousLesson = curriculumLessons[currentIndex - 1]
  const nextLesson = curriculumLessons[currentIndex + 1]

  return <><SeoMetadata title={lesson.title} description={lesson.description} /><article className="shell max-w-4xl py-12 sm:py-16">
    <div className="text-sm font-bold text-muted"><Link to="/learn" className="hover:text-teal">Learn</Link><span className="mx-2">/</span><span>{lesson.category}</span></div>
    <header className="mt-10 border-b border-line pb-10">
      <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-muted"><span className="rounded-full bg-sand px-3 py-1 text-teal">{lesson.difficulty}</span><span className="inline-flex items-center"><Clock3 size={16} className="mr-2" />{readingMinutes} min reading</span>{buildMinutes && <span className="rounded-full bg-mist px-3 py-1 text-teal">~{buildMinutes} min build</span>}</div>
      <h1 className="mt-5 max-w-3xl break-words font-display text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-teal sm:text-6xl">{lesson.title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{lesson.description}</p>
    </header>

    <StructuredLessonBody lessonId={lesson.id} lesson={structured} answers={answers} onAnswer={answerQuiz} onRetry={retryQuiz} evidenceNote={evidenceNote} onEvidenceChange={setEvidenceNote} onEvidenceSave={saveEvidenceNote} project={lessonProjects[lesson.id]} />
    <div className="mt-10 border-t border-line pt-8"><div className="grid gap-4 sm:grid-cols-3 sm:items-center"><div className="sm:justify-self-start">{previousLesson && <Link to={`/learn/${previousLesson.id}`} className="text-sm font-bold text-muted hover:text-teal">Previous lesson</Link>}</div><div className="sm:justify-self-center"><button type="button" aria-pressed={progress.isLessonComplete(lesson.id)} onClick={() => progress.setLessonComplete(lesson.id, !progress.isLessonComplete(lesson.id))} className={`button ${progress.isLessonComplete(lesson.id) ? 'bg-mist text-teal' : 'button-secondary'}`}><Check size={17} className="mr-2" />{progress.isLessonComplete(lesson.id) ? 'Lesson complete' : 'Mark lesson complete'}</button></div><div className="sm:justify-self-end">{nextLesson ? <Link to={`/learn/${nextLesson.id}`} onClick={() => progress.markLessonComplete(lesson.id)} className="button button-primary">Next lesson</Link> : <Link to="/learn" onClick={() => progress.markLessonComplete(lesson.id)} className="button button-primary">Back to curriculum</Link>}</div></div></div>
  </article></>
}
