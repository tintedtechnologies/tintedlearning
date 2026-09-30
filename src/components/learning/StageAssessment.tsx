import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { lessonContent } from '../../data/lessonContent'
import type { CurriculumStage, LessonQuiz, StageAssessment as StageAssessmentData } from '../../types/curriculum'
import type { StageAssessmentAttempt } from '../../hooks/useProgress'

interface StageAssessmentProps {
  assessment: StageAssessmentData
  stage: CurriculumStage
  stageComplete: boolean
  onResult: (score: number, total: number) => void
  savedAttempt?: StageAssessmentAttempt
  onAttemptChange: (attempt: StageAssessmentAttempt) => void
  onAttemptClear: () => void
}

interface AssessmentQuestion {
  quiz: LessonQuiz
  reviewModuleId: string
}

function buildQuestionBank(assessment: StageAssessmentData, stage: CurriculumStage) {
  const stageLessons = stage.modules.flatMap((module) => module.lessons.map((lesson) => ({ lesson, moduleId: module.id })))
  const lessonTitles = stageLessons.map(({ lesson }) => lesson.title)
  const generatedQuestions: AssessmentQuestion[] = []
  const promptForLesson = (lesson: typeof stageLessons[number]['lesson'], promptIndex: number) => {
    const content = lessonContent[lesson.id]
    const focus = content?.learningPoints ?? []
    const prompts = [
      `Which lesson is described by this outcome: ${lesson.description}`,
      `Which lesson includes this focus: ${focus[0] ?? lesson.description}`,
      `Which lesson includes this focus: ${focus[1] ?? lesson.description}`,
      `Which lesson includes this focus: ${focus[2] ?? lesson.description}`,
      `Which lesson is represented by this takeaway: ${content?.takeaway ?? lesson.description}`,
    ]
    return prompts[promptIndex]
  }
  for (let promptIndex = 0; promptIndex < 5; promptIndex += 1) {
    stageLessons.forEach(({ lesson, moduleId }, lessonIndex) => {
      const prompt = promptForLesson(lesson, promptIndex)
      const distractors = lessonTitles.filter((title) => title !== lesson.title).slice(lessonIndex % Math.max(1, lessonTitles.length - 3), lessonIndex % Math.max(1, lessonTitles.length - 3) + 3)
      const options = [...new Set([lesson.title, ...distractors])].slice(0, 4)
      if (options.length >= 2) generatedQuestions.push({ quiz: { question: prompt, options, answer: lesson.title, correctFeedback: 'Correct. This description or focus belongs to that lesson.', incorrectFeedback: `Review the lesson: ${lesson.title}` }, reviewModuleId: moduleId })
    })
  }
  const authoredQuestions: AssessmentQuestion[] = assessment.questions.map((quiz, index) => ({ quiz, reviewModuleId: stage.modules[index % Math.max(1, stage.modules.length)]?.id ?? stage.id }))
  const questions = [...authoredQuestions, ...generatedQuestions]
  const target = Math.min(50, Math.max(40, questions.length))
  return questions.slice(0, target)
}

export function StageAssessment({ assessment, stage, stageComplete, onResult, savedAttempt, onAttemptChange, onAttemptClear }: StageAssessmentProps) {
  const questions: AssessmentQuestion[] = buildQuestionBank(assessment, stage)
  const [answers, setAnswers] = useState<Record<number, string>>(savedAttempt?.answers ?? {})
  const [currentIndex, setCurrentIndex] = useState(Math.min(savedAttempt?.currentIndex ?? 0, questions.length - 1))
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const score = questions.filter((question, index) => answers[index] === question.quiz.answer).length
  const currentQuestion = questions[currentIndex]
  const missedQuestions = questions.filter((question, index) => answers[index] !== question.quiz.answer)
  const moveNext = () => {
    if (!selected) return
    const nextAnswers = { ...answers, [currentIndex]: selected as string }
    if (currentIndex === questions.length - 1) {
      const finalScore = questions.filter((question, index) => nextAnswers[index] === question.quiz.answer).length
      setAnswers(nextAnswers)
      setSubmitted(true)
      onResult(finalScore, questions.length)
      onAttemptClear()
      return
    }
    setAnswers(nextAnswers)
    setCurrentIndex((current) => current + 1)
    setSelected(null)
    onAttemptChange({ answers: nextAnswers, currentIndex: currentIndex + 1 })
  }

  return <section className="mt-8 rounded-3xl border border-teal/15 bg-white p-5 sm:p-7" aria-labelledby={`${assessment.title.replaceAll(' ', '-').toLowerCase()}-title`}>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="eyebrow">End-of-stage assessment</p><h3 id={`${assessment.title.replaceAll(' ', '-').toLowerCase()}-title`} className="mt-2 font-display text-3xl font-bold text-teal">{assessment.title}</h3><p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{assessment.instructions} This assessment contains {questions.length} questions. You need 80% to pass.</p></div>{submitted && <div className="shrink-0 rounded-2xl bg-mist px-4 py-3 text-center"><span className="block font-display text-3xl font-bold text-teal">{score}/{questions.length}</span><span className="text-xs font-bold uppercase tracking-widest text-muted">Score</span></div>}</div>

    {!submitted ? <div className="mt-6"><div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-widest text-muted"><span>Question {currentIndex + 1} of {questions.length}</span><span>{savedAttempt && currentIndex > 0 ? 'Resumed attempt' : selected ? 'Ready to continue' : 'Choose one answer'}</span></div><fieldset className="mt-3 rounded-2xl border border-line bg-cream/40 p-4 sm:p-5"><legend className="max-w-full px-1 text-base font-bold leading-6 text-teal">{currentQuestion.quiz.question}</legend><div className="mt-4 grid gap-2">{currentQuestion.quiz.options.map((option) => <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm leading-6 ${selected === option ? 'border-teal bg-white font-bold text-teal' : 'border-line bg-white/70 text-ink hover:border-teal/30'}`}><input type="radio" name={`${assessment.title}-${currentIndex}`} value={option} checked={selected === option} onChange={() => setSelected(option)} className="mt-1 accent-teal" />{option}</label>)}</div></fieldset><div className="mt-5 flex justify-end"><button type="button" disabled={!selected} onClick={moveNext} className="button button-primary disabled:cursor-not-allowed disabled:opacity-50">{currentIndex === questions.length - 1 ? 'Finish test' : 'Next question'} <ArrowRight size={17} className="ml-2" /></button></div><p className="mt-4 text-sm text-muted">Next question locks this answer. You cannot return to it.</p></div> : <div className="mt-6"><div className={`rounded-2xl p-5 ${score / questions.length >= 0.8 ? 'bg-mist' : 'bg-red-50'}`}><p className="flex items-center gap-2 font-bold text-teal">{score / questions.length >= 0.8 ? <CheckCircle2 size={18} /> : <XCircle size={18} />}{score / questions.length >= 0.8 ? stageComplete ? 'Stage badge requirements met.' : 'Assessment passed. Finish every lesson to unlock the badge.' : 'Assessment not passed yet.'}</p><p className="mt-2 text-sm leading-6 text-muted">{score / questions.length >= 0.8 ? 'Your result is saved to your signed-in progress.' : 'Review the missed questions below, revisit the linked modules, and retake the assessment when you are ready.'}</p></div>{missedQuestions.length > 0 && <div className="mt-5"><h4 className="font-display text-2xl font-bold text-teal">Review missed questions</h4><div className="mt-3 space-y-3">{missedQuestions.map((question, index) => <article key={`${index}-${question.quiz.question}`} className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-950"><p className="font-bold">{question.quiz.question}</p><p className="mt-2"><strong>Correct answer:</strong> {question.quiz.answer}</p><p className="mt-2">{question.quiz.incorrectFeedback}</p><Link to={`/learn?stage=${stage.id}#${question.reviewModuleId}`} className="mt-3 inline-flex items-center font-bold text-teal hover:text-gold">Review this module <ArrowRight size={16} className="ml-2" /></Link></article>)}</div></div>}<button type="button" onClick={() => { setAnswers({}); setCurrentIndex(0); setSelected(null); setSubmitted(false); onAttemptClear() }} className="mt-6 inline-flex items-center text-sm font-bold text-teal hover:text-gold"><RotateCcw size={16} className="mr-2" />Retake stage test</button></div>}
  </section>
}
