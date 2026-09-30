import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { StageAssessment } from '../components/learning/StageAssessment'
import { curriculumStages, getModuleProgress, lessons } from '../data/curriculum'
import { useProgress } from '../hooks/useProgress'

export function StageAssessmentPage() {
  const { stageId } = useParams()
  const progress = useProgress(lessons.length)
  const stage = curriculumStages.find((item) => item.id === stageId)

  if (!stage?.assessment) return <Navigate to="/learn" replace />
  if (!progress.isLoaded) return <main className="shell max-w-5xl py-16"><p className="font-bold text-teal">Loading your assessment...</p></main>

  const lessonCount = stage.modules.reduce((total, module) => total + module.lessons.length, 0)
  const completedCount = stage.modules.reduce((total, module) => total + getModuleProgress(module, progress.completedLessons).completed, 0)
  const stageComplete = lessonCount > 0 && completedCount === lessonCount

  return <main className="shell max-w-5xl py-10 sm:py-16">
    <Link to={`/learn?stage=${stage.id}`} className="inline-flex items-center text-sm font-bold text-muted hover:text-teal"><ArrowLeft size={16} className="mr-2" />Back to {stage.title}</Link>
    <header className="mt-10 border-b border-line pb-8"><p className="eyebrow">{stage.eyebrow} · Dedicated assessment</p><h1 className="mt-3 section-title">{stage.assessment.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-muted">This assessment covers the complete {stage.title} section. Finish the questions in one focused view, review every result, and earn the stage badge after completing the lessons and passing with 80% or higher.</p><div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-teal"><span className="rounded-full bg-mist px-3 py-2">{completedCount}/{lessonCount} lessons complete</span>{progress.hasPassedStageAssessment(stage.id) && <span className="rounded-full bg-sand px-3 py-2">Previous pass saved</span>}</div></header>
    <StageAssessment assessment={stage.assessment} stage={stage} stageComplete={stageComplete} onResult={(score, total) => progress.setStageAssessmentResult(stage.id, score, total)} savedAttempt={progress.stageAssessmentAttempts[stage.id]} onAttemptChange={(attempt) => progress.saveStageAssessmentAttempt(stage.id, attempt)} onAttemptClear={() => progress.saveStageAssessmentAttempt(stage.id, null)} />
  </main>
}
