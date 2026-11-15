import { Check, ChevronDown, Clock3, ExternalLink, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ProjectGuide } from '../components/learning/ProjectGuide'
import { ProjectPage } from '../components/learning/ProjectPage'
import { projectPlans } from '../data/projects'
import { LessonConceptArea } from '../components/learning/LessonConceptArea'
import { getCurriculumLessonSequence, lessons } from '../data/curriculum'
import { lessonContent } from '../data/lessonContent'
import { lessonResources } from '../data/lessonResources'
import { useProgress } from '../hooks/useProgress'
import type { LearningResource, LessonContent, LessonQuiz, LessonVisual as LessonVisualData } from '../types/curriculum'
import { SeoMetadata } from '../components/common/SeoMetadata'
import { StructuredLessonBody } from '../components/learning/StructuredLessonBody'
import { structuredLessons } from '../data/lessons'
import { buildMinutes as structuredBuildMinutes, readingMinutes as structuredReadingMinutes } from '../data/lessons/stats'

const stage3FlowSteps: Record<string, string[]> = {
  models: ['Task', 'Criteria', 'Models', 'Compare', 'Choice'],
  'talk-to-ai': ['Goal', 'Context', 'Instruction', 'Response', 'Refine'],
  'prompt-engineering': ['Task', 'Examples', 'Constraints', 'Response', 'Iterate'],
  'system-prompts': ['App intent', 'System rules', 'User input', 'Response', 'Review'],
  'structured-outputs': ['Schema', 'Request', 'JSON', 'Validate', 'Use'],
  'vector-databases': ['Vector', 'Index', 'Search', 'Filter', 'Results'],
  'tool-calling': ['Intent', 'Tool request', 'Permission', 'Execute', 'Result'],
  mcp: ['Application', 'MCP server', 'Capability', 'Permission', 'Result'],
  evaluation: ['Cases', 'Baseline', 'Run', 'Inspect', 'Improve'],
  'ai-assistants': ['User need', 'Context', 'Model', 'Guardrail', 'Response'],
  hallucinations: ['Claim', 'Evidence', 'Confidence', 'Verify', 'Answer'],
  'evaluating-ai-responses': ['Response', 'Rubric', 'Review', 'Failure', 'Improve'],
  'responsible-ai': ['Data', 'Model', 'Risk check', 'Human review', 'Decision'],
  'ai-observability': ['Request', 'Trace', 'Metrics', 'Alert', 'Improve'],
  'ai-product-design': ['User goal', 'AI assist', 'Feedback', 'Control', 'Outcome'],
  'ai-cost-and-performance': ['Quality', 'Latency', 'Cost', 'Tradeoff', 'Target'],
  'ai-governance': ['Purpose', 'Data', 'Risk review', 'Owner', 'Record'],
  'ai-apis': ['Request', 'Model API', 'Response', 'Validate', 'Integrate'],
}

function ResourceSection({ resources }: { resources: LearningResource[] }) {
  return <section className="not-prose my-12"><p className="eyebrow">Optional reading</p><h2 className="mt-2 font-display text-3xl font-bold text-teal">Go deeper when you are ready</h2><p className="mt-3 max-w-2xl text-base leading-7 text-muted">The lesson and quick check are enough to continue. Use these references for extra context and practice.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{resources.map((resource) => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-line bg-white p-4 hover:border-teal/30 hover:bg-mist"><span className="flex items-start justify-between gap-3"><span><span className="block text-sm font-bold text-teal">{resource.title}</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-muted">{resource.provider}</span></span><ExternalLink size={15} className="shrink-0 text-teal" /></span><span className="mt-2 block text-sm leading-6 text-muted">{resource.description}</span></a>)}</div></section>
}

const emptyLegacyContent: LessonContent = { learningPoints: [], sections: [{ heading: '', paragraphs: [''] }], callouts: [], deeper: '', takeaway: '' }

function getLessonResources(lessonId: string, fallback?: LearningResource[]) {
  return lessonResources[lessonId] ?? fallback
}

export function LessonPage() {
  const { lessonId } = useParams()
  const progress = useProgress(lessons.length)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [quizIndex, setQuizIndex] = useState(0)
  const [evidenceNote, setEvidenceNote] = useState('')
  const [deeperOpen, setDeeperOpen] = useState(false)
  const lesson = lessons.find((item) => item.id === lessonId)
  // New lessons exist only in the structured format, so give them an empty legacy record.
  const content = lesson ? lessonContent[lesson.id] ?? (structuredLessons[lesson.id] || projectPlans[lesson.id] ? emptyLegacyContent : undefined) : undefined
  const structured = lesson ? structuredLessons[lesson.id] : undefined

  // A new lesson starts from its saved answers.
  useEffect(() => {
    setAnswers(progress.getLessonQuizAnswers(lessonId ?? ''))
    setQuizIndex(0)
    setEvidenceNote(progress.getLessonEvidenceNote(lessonId ?? ''))
    setDeeperOpen(false)
  }, [lessonId])

  // When saved progress finishes loading, merge it in without wiping answers given in the meantime.
  useEffect(() => {
    if (!progress.isLoaded) return
    setAnswers((current) => ({ ...progress.getLessonQuizAnswers(lessonId ?? ''), ...current }))
    setEvidenceNote((current) => current || progress.getLessonEvidenceNote(lessonId ?? ''))
  }, [progress.isLoaded])

  if (!lesson || !content) return <Navigate to="/learn" replace />
  const projectPlan = projectPlans[lesson.id]
  if (projectPlan) return <ProjectPage lesson={lesson} plan={projectPlan} lessonTitles={Object.fromEntries(lessons.map((item) => [item.id, item.title]))} />

  const resources = getLessonResources(lesson.id, content.resources)
  const legacyQuizzes: LessonQuiz[] = content.quizzes ?? (content.quiz ? [content.quiz] : [])
  const quizzes: { answer: string }[] = structured ? structured.quiz.map((quiz) => ({ answer: quiz.options[quiz.answer].text })) : legacyQuizzes
  const readingWords = [content.learningPoints.join(' '), ...content.sections.flatMap((section) => [section.heading, ...section.paragraphs]), content.deeper, content.takeaway].join(' ').trim().split(/\s+/).filter(Boolean).length
  const readingMinutes = structured ? structuredReadingMinutes(structured) : Math.max(1, Math.ceil(readingWords / 200))
  const visualExample = content.examples?.find((example) => example.visual)?.visual
  const stage3Visual: LessonVisualData | undefined = !visualExample && ['Modern AI Systems', 'Using AI', 'AI Engineering'].includes(lesson.category)
    ? { type: 'ai-system-flow', steps: stage3FlowSteps[lesson.id] ?? ['Input', 'Context', 'Model', 'Check', 'Outcome'], caption: 'AI behavior becomes easier to understand when the path from one decision to the next is visible.', description: `An animated AI system flow for ${lesson.title}, showing its lesson-specific path from input to outcome.` }
    : undefined
  const conceptVisual = visualExample ?? stage3Visual
  const answerQuiz = (index: number, choice: string) => {
    const nextAnswers = { ...answers, [index]: choice }
    setAnswers(nextAnswers)
    progress.setLessonQuizAnswers(lesson.id, nextAnswers)
    progress.setLessonLearningCheck(lesson.id, 'tested', quizzes.every((quiz, quizIndex) => nextAnswers[quizIndex] === quiz.answer))
  }
  const currentQuiz = legacyQuizzes[quizIndex]
  const currentAnswer = answers[quizIndex]
  const currentCorrect = currentAnswer === currentQuiz?.answer
  const retryQuiz = () => {
    setAnswers({})
    setQuizIndex(0)
    progress.setLessonQuizAnswers(lesson.id, {})
    progress.setLessonLearningCheck(lesson.id, 'tested', false)
  }
  const saveEvidenceNote = () => progress.setLessonEvidenceNote(lesson.id, evidenceNote)
  const nonVisualExamples = content.examples?.filter((example) => !example.visual) ?? []
  const curriculumLessons = getCurriculumLessonSequence()
  const currentIndex = curriculumLessons.findIndex((item) => item.id === lesson.id)
  const previousLesson = curriculumLessons[currentIndex - 1]
  const nextLesson = curriculumLessons[currentIndex + 1]

  return <><SeoMetadata title={lesson.title} description={lesson.description} /><article className="shell max-w-4xl py-12 sm:py-16">
    <div className="text-sm font-bold text-muted"><Link to="/learn" className="hover:text-teal">Learn</Link><span className="mx-2">/</span><span>{lesson.category}</span></div>
    <header className="mt-10 border-b border-line pb-10">
      <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-muted"><span className="rounded-full bg-sand px-3 py-1 text-teal">{lesson.difficulty}</span><span className="inline-flex items-center"><Clock3 size={16} className="mr-2" />{readingMinutes} min reading</span>{(structured ? structuredBuildMinutes(structured) : content.buildTimeMinutes) && <span className="rounded-full bg-mist px-3 py-1 text-teal">~{structured ? structuredBuildMinutes(structured) : content.buildTimeMinutes} min build</span>}</div>
      <h1 className="mt-5 max-w-3xl break-words font-display text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-teal sm:text-6xl">{lesson.title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{lesson.description}</p>
    </header>

    {structured ? <StructuredLessonBody lessonId={lesson.id} lesson={structured} answers={answers} onAnswer={answerQuiz} onRetry={retryQuiz} evidenceNote={evidenceNote} onEvidenceChange={setEvidenceNote} onEvidenceSave={saveEvidenceNote} project={content.project} /> : <>
    <section className="lesson-copy py-10">
      <h2>What you will learn</h2>
      <ul>{content.learningPoints.map((point) => <li key={point}>{point}</li>)}</ul>
      {conceptVisual && <LessonConceptArea lesson={lesson} visual={conceptVisual} />}
      <div className="not-prose my-10 grid gap-4">
        <div className="lesson-layer bg-mist"><p className="lesson-layer-label">Start here</p><h2 className="mt-3 font-display text-3xl font-bold leading-tight text-teal">The simple idea</h2><p className="mt-4 text-base leading-7 text-muted">{content.sections[0].paragraphs[0]}</p></div>
      </div>
      {content.sections.map((section, index) => <div key={section.heading}><h2>{section.heading}</h2>{index === 0 ? section.paragraphs.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>) : section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>)}
      <div className="my-10 grid gap-3 sm:grid-cols-2">{content.callouts.map((callout) => <div key={callout.title} className={`rounded-2xl p-5 ${callout.tone === 'teal' ? 'bg-mist' : 'bg-sand'}`}><p className="font-bold text-teal">{callout.title}</p><p className="mt-2 text-sm leading-6 text-muted">{callout.text}</p></div>)}</div>
      {nonVisualExamples.length > 0 && <section className="not-prose my-12 space-y-5"><div><p className="eyebrow">Worked example</p><h2 className="mt-2 font-display text-3xl font-bold text-teal">See it in practice</h2></div>{nonVisualExamples.map((example) => <div key={example.title} className="overflow-hidden rounded-3xl border border-teal/15 bg-white"><div className="border-b border-line bg-mist px-5 py-4"><p className="font-display text-xl font-bold text-teal">{example.title}</p><p className="mt-1 text-sm leading-6 text-muted">{example.explanation}</p></div><pre className="overflow-x-auto bg-[#173b38] p-5 text-sm leading-7 text-white"><code>{example.content}</code></pre></div>)}</section>}
      {content.commonMistakes?.length ? <section className="not-prose my-12 rounded-3xl border border-gold/30 bg-sand p-6 sm:p-8"><p className="eyebrow">Common mistakes</p><h2 className="mt-2 font-display text-3xl font-bold text-teal">Watch for these traps</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-ink">{content.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul></section> : null}
    </section>

    {lesson.id === 'tokens' && <div className="mb-10"><Link to="/playground/tokens" className="button button-secondary">Try the token playground <ExternalLink size={16} className="ml-2" /></Link></div>}
    {lesson.category === 'Python' && <div className="mb-10 rounded-3xl bg-teal p-6 text-white sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Practice this lesson</p><h2 className="mt-3 font-display text-3xl font-bold">Try Python in your browser.</h2><p className="mt-3 max-w-2xl leading-7 text-white/75">Run a small example, change the code, and see the result before you continue.</p><Link to="/playground/python" className="button button-secondary mt-5">Open Python playground <ExternalLink size={16} className="ml-2" /></Link></div>}
    {content.project && <ProjectGuide project={content.project} />}

    {legacyQuizzes.length > 0 && <section className="mx-auto max-w-3xl rounded-3xl bg-teal p-6 text-white sm:p-8"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Quick checks</p><h2 className="mt-3 font-display text-3xl font-bold">Test what you understand.</h2></div><span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">Question {quizIndex + 1} of {legacyQuizzes.length}</span></div>{currentQuiz && <div className="mt-6"><p className="font-bold leading-7">{currentQuiz.question}</p><div className="mt-3 grid gap-3">{currentQuiz.options.map((choice) => <button type="button" key={choice} disabled={Boolean(currentAnswer)} onClick={() => answerQuiz(quizIndex, choice)} className={`rounded-2xl border px-4 py-4 text-left text-sm font-bold transition-colors disabled:cursor-default ${currentAnswer === choice ? currentCorrect ? 'border-gold bg-gold text-teal' : 'border-red-300 bg-red-100 text-red-900' : currentAnswer ? 'border-white/10 bg-white/5 text-white/50' : 'border-white/20 bg-white/10 text-white hover:bg-white/20'}`}>{choice}</button>)}</div>{currentAnswer && <p className={`mt-3 rounded-2xl p-4 text-sm leading-6 ${currentCorrect ? 'bg-white/10 text-white/80' : 'bg-red-100 text-red-900'}`}>{currentCorrect ? currentQuiz.correctFeedback : currentQuiz.incorrectFeedback}</p>}<div className="mt-5 flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={() => setQuizIndex((index) => Math.max(index - 1, 0))} disabled={quizIndex === 0} className="button border border-white/25 text-white disabled:cursor-not-allowed disabled:opacity-40">Previous question</button><div className="flex gap-3">{currentAnswer && quizIndex < legacyQuizzes.length - 1 && <button type="button" onClick={() => setQuizIndex((index) => Math.min(index + 1, legacyQuizzes.length - 1))} className="button bg-gold text-teal">Next question</button>}<button type="button" onClick={retryQuiz} className="inline-flex items-center text-sm font-bold text-white/80 hover:text-white"><RotateCcw size={15} className="mr-2" />Retry quiz</button></div></div></div>}</section>}
    {lesson.id === 'what-is-ai' && <section className="mx-auto my-10 max-w-3xl rounded-3xl border border-gold/30 bg-sand p-6 sm:p-8"><p className="eyebrow">Your first piece of evidence</p><h2 className="mt-2 font-display text-3xl font-bold text-teal">Explain one AI system you use.</h2><p className="mt-3 text-sm leading-6 text-muted">Pick an app you use. Explain what it takes in, what it predicts, and how you would tell if the prediction was useful.</p><label className="mt-5 block"><span className="text-sm font-bold text-teal">Your example</span><textarea value={evidenceNote} onChange={(event) => setEvidenceNote(event.target.value)} onBlur={saveEvidenceNote} rows={5} placeholder="For example: My music app takes in listening history, predicts which song I may enjoy, and I could measure usefulness by whether I save or finish the recommended songs." className="mt-2 w-full rounded-2xl border border-line bg-white p-4 text-sm leading-6 text-ink outline-none focus:border-teal" /></label><p className="mt-2 text-xs text-muted">Your answer is saved with your lesson evidence when you leave the field.</p></section>}
    {resources && <ResourceSection resources={resources} />}
    <section className="my-10 border-y border-line py-8"><button type="button" onClick={() => setDeeperOpen((open) => !open)} className="flex w-full items-center justify-between text-left"><span><span className="eyebrow">Under the hood</span><span className="mt-2 block font-display text-2xl font-bold text-teal">How the idea works technically</span></span><ChevronDown className={`text-teal transition-transform ${deeperOpen ? 'rotate-180' : ''}`} /></button>{deeperOpen && <div className="mt-5 max-w-3xl rounded-2xl bg-cream p-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Technical explanation</p><p className="mt-3 leading-7 text-muted">{content.deeper}</p></div>}</section>
    <section className="rounded-3xl bg-sand p-6 sm:p-8"><p className="eyebrow">Key takeaway</p><p className="mt-3 font-display text-2xl font-bold leading-8 text-teal">{content.takeaway}</p></section>
    </>}
    <div className="mt-10 border-t border-line pt-8"><div className="grid gap-4 sm:grid-cols-3 sm:items-center"><div className="sm:justify-self-start">{previousLesson && <Link to={`/learn/${previousLesson.id}`} className="text-sm font-bold text-muted hover:text-teal">Previous lesson</Link>}</div><div className="sm:justify-self-center"><button type="button" aria-pressed={progress.isLessonComplete(lesson.id)} onClick={() => progress.setLessonComplete(lesson.id, !progress.isLessonComplete(lesson.id))} className={`button ${progress.isLessonComplete(lesson.id) ? 'bg-mist text-teal' : 'button-secondary'}`}><Check size={17} className="mr-2" />{progress.isLessonComplete(lesson.id) ? 'Lesson complete' : 'Mark lesson complete'}</button></div><div className="sm:justify-self-end">{nextLesson ? <Link to={`/learn/${nextLesson.id}`} onClick={() => progress.markLessonComplete(lesson.id)} className="button button-primary">Next lesson</Link> : <Link to="/learn" onClick={() => progress.markLessonComplete(lesson.id)} className="button button-primary">Back to curriculum</Link>}</div></div></div>
  </article></>
}
