import { Check, ChevronDown, Clock3, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ProjectGuide } from '../components/learning/ProjectGuide'
import { getCurriculumLessonSequence, lessons } from '../data/curriculum'
import { lessonContent } from '../data/lessonContent'
import { lessonResources } from '../data/lessonResources'
import { useProgress } from '../hooks/useProgress'
import type { LessonQuiz } from '../types/curriculum'

const fallbackQuiz: LessonQuiz = {
  question: 'What is the most useful next step after learning this concept?',
  options: ['Connect it to a real example and explain what could go wrong', 'Memorize the title and move on', 'Assume the model always handles it correctly', 'Skip testing because the idea sounds simple'],
  answer: 'Connect it to a real example and explain what could go wrong',
  correctFeedback: 'Correct. Understanding becomes useful when you can apply an idea, explain its limits, and check its behavior.',
  incorrectFeedback: 'A strong next step is to apply the idea to a real example and consider its limits and failure modes.',
}

export function LessonPage() {
  const { lessonId } = useParams()
  const progress = useProgress(lessons.length)
  const [answer, setAnswer] = useState<string | null>(null)
  const [deeperOpen, setDeeperOpen] = useState(false)
  const lesson = lessons.find((item) => item.id === lessonId)
  const content = lesson ? lessonContent[lesson.id] : undefined

  if (!lesson || !content) return <Navigate to="/learn" replace />

  const resources = lessonResources[lesson.id] ?? content.resources
  const quiz = content.quiz ?? fallbackQuiz
  const curriculumLessons = getCurriculumLessonSequence()
  const currentIndex = curriculumLessons.findIndex((item) => item.id === lesson.id)
  const previousLesson = curriculumLessons[currentIndex - 1]
  const nextLesson = curriculumLessons[currentIndex + 1]

  return <article className="shell max-w-4xl py-12 sm:py-16">
    <div className="text-sm font-bold text-muted"><Link to="/learn" className="hover:text-teal">Learn</Link><span className="mx-2">/</span><span>{lesson.category}</span></div>
    <header className="mt-10 border-b border-line pb-10">
      <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-muted"><span className="rounded-full bg-sand px-3 py-1 text-teal">{lesson.difficulty}</span><span className="inline-flex items-center"><Clock3 size={16} className="mr-2" />{lesson.duration} minutes</span></div>
      <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-[-0.025em] text-teal sm:text-6xl">{lesson.title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{lesson.description}</p>
    </header>

    <section className="lesson-copy py-10">
      <h2>What you will learn</h2>
      <ul>{content.learningPoints.map((point) => <li key={point}>{point}</li>)}</ul>
      <div className="not-prose my-10 grid gap-4 md:grid-cols-2">
        <div className="lesson-layer bg-mist"><p className="lesson-layer-label">Start here</p><h2 className="mt-3 font-display text-3xl font-bold leading-tight text-teal">The simple idea</h2><p className="mt-4 text-base leading-7 text-muted">{content.sections[0].paragraphs[0]}</p></div>
        <div className="lesson-layer bg-white"><p className="lesson-layer-label">Build the mental model</p><h2 className="mt-3 font-display text-3xl font-bold leading-tight text-teal">The important question</h2><p className="mt-4 text-base leading-7 text-muted">{content.learningPoints[1]}</p><p className="mt-3 text-base leading-7 text-muted">As you read, connect the examples to this question. That is how the vocabulary becomes useful instead of something to memorize.</p></div>
      </div>
      {content.sections.map((section, index) => <div key={section.heading}><h2>{section.heading}</h2>{index === 0 ? section.paragraphs.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>) : section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>)}
      <div className="my-10 grid gap-3 sm:grid-cols-2">{content.callouts.map((callout) => <div key={callout.title} className={`rounded-2xl p-5 ${callout.tone === 'teal' ? 'bg-mist' : 'bg-sand'}`}><p className="font-bold text-teal">{callout.title}</p><p className="mt-2 text-sm leading-6 text-muted">{callout.text}</p></div>)}</div>
      {content.examples && <section className="not-prose my-12 space-y-5"><div><p className="eyebrow">Work it through</p><h2 className="mt-2 font-display text-3xl font-bold text-teal">See the mechanism</h2><p className="mt-3 text-base leading-7 text-muted">A concept becomes engineering knowledge when you can inspect an example, change an assumption, and predict what should happen next.</p></div>{content.examples.map((example) => <div key={example.title} className="overflow-hidden rounded-3xl border border-teal/15 bg-white"><div className="border-b border-line bg-mist px-5 py-4"><p className="font-display text-xl font-bold text-teal">{example.title}</p><p className="mt-1 text-sm leading-6 text-muted">{example.explanation}</p></div><pre className="overflow-x-auto bg-[#173b38] p-5 text-sm leading-7 text-white"><code>{example.content}</code></pre></div>)}</section>}
      {resources && <section className="not-prose my-12"><p className="eyebrow">Continue with free resources</p><h2 className="mt-2 font-display text-3xl font-bold text-teal">Go deeper</h2><p className="mt-3 max-w-2xl text-base leading-7 text-muted">Use these references to practice beyond the lesson. Tinted Learning gives you the map; these resources provide the longer labs, exercises, and documentation.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{resources.map((resource) => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-line bg-white p-4 hover:border-teal/30 hover:bg-mist"><span className="flex items-start justify-between gap-3"><span><span className="block text-sm font-bold text-teal">{resource.title}</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-muted">{resource.provider}</span></span><ExternalLink size={15} className="shrink-0 text-teal" /></span><span className="mt-2 block text-sm leading-6 text-muted">{resource.description}</span></a>)}</div></section>}
    </section>

    {lesson.id === 'tokens' && <div className="mb-10"><Link to="/playground/tokens" className="button button-secondary">Try the token playground <ExternalLink size={16} className="ml-2" /></Link></div>}
    {lesson.category === 'Python' && <div className="mb-10 rounded-3xl bg-teal p-6 text-white sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Practice this lesson</p><h2 className="mt-3 font-display text-3xl font-bold">Try Python in your browser.</h2><p className="mt-3 max-w-2xl leading-7 text-white/75">Run a small example, change the code, and see the result before you continue.</p><Link to="/playground/python" className="button button-secondary mt-5">Open Python playground <ExternalLink size={16} className="ml-2" /></Link></div>}
    {content.project && <ProjectGuide project={content.project} />}

    <section className="rounded-3xl bg-teal p-6 text-white sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Quick check</p><h2 className="mt-3 font-display text-3xl font-bold">{quiz.question}</h2><div className="mt-6 grid gap-3">{quiz.options.map((choice) => <button type="button" key={choice} onClick={() => setAnswer(choice)} className={`rounded-2xl border px-4 py-4 text-left text-sm font-bold transition-colors ${answer === choice ? 'border-gold bg-gold text-teal' : 'border-white/20 bg-white/10 text-white hover:bg-white/20'}`}>{choice}</button>)}</div>{answer && <p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/80">{answer === quiz.answer ? quiz.correctFeedback : quiz.incorrectFeedback}</p>}</section>
    <section className="my-10 border-y border-line py-8"><button type="button" onClick={() => setDeeperOpen((open) => !open)} className="flex w-full items-center justify-between text-left"><span><span className="eyebrow">College-level lens</span><span className="mt-2 block font-display text-2xl font-bold text-teal">How the idea works technically</span></span><ChevronDown className={`text-teal transition-transform ${deeperOpen ? 'rotate-180' : ''}`} /></button>{deeperOpen && <div className="mt-5 max-w-3xl rounded-2xl bg-cream p-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Technical explanation</p><p className="mt-3 leading-7 text-muted">{content.deeper}</p></div>}</section>
    <section className="rounded-3xl bg-sand p-6 sm:p-8"><p className="eyebrow">Key takeaway</p><p className="mt-3 font-display text-2xl font-bold leading-8 text-teal">{content.takeaway}</p></section>
    <div className="mt-10 flex flex-col justify-between gap-4 border-t border-line pt-8 sm:flex-row sm:items-center"><div>{previousLesson && <Link to={`/learn/${previousLesson.id}`} className="text-sm font-bold text-muted hover:text-teal">Previous lesson</Link>}</div><div className="flex flex-wrap items-center gap-3">{nextLesson ? <Link to={`/learn/${nextLesson.id}`} onClick={() => progress.markLessonComplete(lesson.id)} className="button button-primary">Next lesson</Link> : <Link to="/learn" onClick={() => progress.markLessonComplete(lesson.id)} className="button button-primary">Back to curriculum</Link>}</div></div>
  </article>
}
