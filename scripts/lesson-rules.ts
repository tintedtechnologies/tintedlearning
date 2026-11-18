// Checks a structured lesson against the writing and structure rules in CLAUDE.md.
import { explanationWordCount, underTheHoodWordCount } from '../src/data/lessons/stats'
import type { StructuredLesson } from '../src/types/lesson'

const bannedPhrases = [
  'to one concrete case', 'This example makes', 'Which situation best matches', 'What should you inspect first when applying',
  'Which practice gives stronger evidence that', "Which statement best matches this lesson", 'A task that does not use this concept at all',
  'A result that should be accepted without checking', 'A rule that applies identically to every system', 'Only the final output',
  'An unrelated tool or provider name', 'The largest possible implementation', 'Treating model output as authorization for an action',
  'The important implementation detail is to connect the concept', 'Read the example, then change one input or assumption',
]
const bannedHeadingWords = ['mechanism', 'lens', 'hypothesis', 'reasoning tool', 'leverage']
// CLAUDE.md: use US English.
const britishSpellings = /\b(behaviour|colour|favourite|centre|centres|organis\w*|recognis\w*|analys(e|ed|ing)|catalogue|licence|programme|practis\w*|metres?|kilometres?|travell\w*|labell\w*|modell\w*|cancell(ed|ing)|optimis(e|es|ed|ing|ation|ations)|summaris\w*|minimis\w*|maximis\w*|prioritis\w*|grey|whilst|towards|maths)\b/i

function allProse(lesson: StructuredLesson) {
  return [
    ...(lesson.assumes ? [lesson.assumes] : []),
    ...lesson.goals, lesson.bigIdea, lesson.whyItMatters,
    ...lesson.goalSections.flatMap((section) => [section.heading, ...section.paragraphs]),
    lesson.seeItInAction.title, lesson.seeItInAction.intro, ...lesson.seeItInAction.steps.map((step) => step.explanation),
    ...(lesson.tryIt?.instructions ?? []),
    ...lesson.mistakes.flatMap((item) => [item.mistake, item.fix]),
    ...lesson.quiz.flatMap((question) => [question.question, ...question.options.flatMap((option) => [option.text, option.explanation])]),
    lesson.takeaway,
    ...(lesson.underTheHood ? [lesson.underTheHood.heading, ...lesson.underTheHood.paragraphs] : []),
  ]
}

function allCode(lesson: StructuredLesson) {
  return [
    ...lesson.goalSections.map((section) => section.example.code),
    lesson.seeItInAction.example.code,
    ...lesson.seeItInAction.steps.map((step) => step.code),
    lesson.tryIt?.starterCode ?? '',
    ...lesson.quiz.map((question) => question.code?.code ?? ''),
  ]
}

export function checkStructuredLesson(id: string, lesson: StructuredLesson, subtitle: string) {
  const failures: string[] = []
  const fail = (message: string) => failures.push(`${id}: ${message}`)

  if (lesson.goals.length !== 3) fail('needs exactly 3 learning goals')
  if (lesson.goalSections.length !== 3) fail('needs one section per learning goal (3)')
  const bigIdeaSentences = lesson.bigIdea.split(/(?<=[.!?])\s+/).filter(Boolean).length
  if (bigIdeaSentences < 2 || bigIdeaSentences > 3) fail(`big idea should be 2 to 3 sentences (has ${bigIdeaSentences})`)
  if (lesson.mistakes.length < 2 || lesson.mistakes.length > 4) fail('needs 2 to 4 common mistakes')
  if (lesson.quiz.length !== 3) fail('needs exactly 3 quiz questions')
  if (lesson.seeItInAction.steps.length < 2) fail('see it in action needs a line-by-line walkthrough')
  if (lesson.takeaway.split(/(?<=[.!?])\s+/).filter(Boolean).length !== 1) fail('key takeaway must be one sentence')

  const words = explanationWordCount(lesson)
  if (words < 600 || words > 900) fail(`explanation is ${words} words (target 600 to 900)`)
  if (lesson.underTheHood) {
    const deeperWords = underTheHoodWordCount(lesson)
    if (deeperWords < 100 || deeperWords > 220) fail(`under the hood is ${deeperWords} words (target about 100 to 200)`)
  }

  lesson.quiz.forEach((question, index) => {
    if (question.options.length < 3 || question.options.length > 4) fail(`quiz ${index + 1} needs 3 or 4 options`)
    if (!question.options[question.answer]) fail(`quiz ${index + 1} answer index is out of range`)
    if (question.options.some((option) => !option.explanation.trim())) fail(`quiz ${index + 1} has an option without an explanation`)
    const correct = question.options[question.answer]?.text.toLowerCase().replace(/\.$/, '')
    if (correct && (correct === subtitle.toLowerCase().replace(/\.$/, '') || lesson.goals.some((goal) => goal.toLowerCase().replace(/\.$/, '') === correct))) fail(`quiz ${index + 1} answer copies a learning goal or the subtitle`)
    if (new Set(question.options.map((option) => option.text)).size !== question.options.length) fail(`quiz ${index + 1} repeats an option`)
  })

  const prose = allProse(lesson)
  for (const text of prose) {
    if (/[—–]/.test(text)) fail(`uses an em or en dash: "${text.slice(0, 60)}"`)
    for (const phrase of bannedPhrases) if (text.includes(phrase)) fail(`uses banned filler phrase "${phrase.trim()}"`)
    const british = text.match(britishSpellings)
    if (british) fail(`uses British spelling "${british[0]}": "${text.slice(0, 50)}"`)
  }
  const headings = [...lesson.goalSections.map((section) => section.heading), lesson.underTheHood?.heading ?? '']
  for (const heading of headings) for (const word of bannedHeadingWords) if (heading.toLowerCase().includes(word)) fail(`heading "${heading}" uses "${word}"`)

  for (const code of allCode(lesson)) {
    if (/[‘’“”≤≥—]/.test(code)) fail(`code uses curly quotes, an em dash, or a math symbol: "${code.slice(0, 50)}"`)
  }

  const sentences = prose.flatMap((text) => text.split(/(?<=[.!?])\s+/)).map((sentence) => sentence.trim().toLowerCase()).filter((sentence) => sentence.split(/\s+/).length >= 5)
  const seen = new Set<string>()
  for (const sentence of sentences) {
    if (seen.has(sentence)) fail(`repeats the sentence "${sentence.slice(0, 70)}"`)
    seen.add(sentence)
  }
  return failures
}
