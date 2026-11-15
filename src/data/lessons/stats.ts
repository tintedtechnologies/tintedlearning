import type { StructuredLesson } from '../../types/lesson'

export const WORDS_PER_MINUTE = 200

function countWords(text: string) {
  return text.replace(/`/g, '').trim().split(/\s+/).filter(Boolean).length
}

/** Words in the explanation sections (2 to 5): big idea, why it matters, goal sections, see it in action. */
export function explanationWordCount(lesson: StructuredLesson) {
  const parts = [
    lesson.bigIdea,
    lesson.whyItMatters,
    ...lesson.goalSections.flatMap((section) => [section.heading, ...section.paragraphs]),
    lesson.seeItInAction.title,
    lesson.seeItInAction.intro,
    ...lesson.seeItInAction.steps.map((step) => step.explanation),
  ]
  return countWords(parts.join(' '))
}

export function readingMinutes(lesson: StructuredLesson) {
  return Math.max(1, Math.ceil(explanationWordCount(lesson) / WORDS_PER_MINUTE))
}

export function underTheHoodWordCount(lesson: StructuredLesson) {
  return lesson.underTheHood ? countWords([lesson.underTheHood.heading, ...lesson.underTheHood.paragraphs].join(' ')) : 0
}

/** Build time for a hands-on project, from its steps and files (same rule as the legacy lessons). */
export function buildMinutes(lesson: StructuredLesson) {
  const project = lesson.tryIt?.project
  return project ? Math.max(20, Math.ceil(project.steps.length * 12 + (project.files?.length ?? 0) * 3)) : undefined
}
