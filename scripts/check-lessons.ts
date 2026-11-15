// Quick per-lesson check while writing: npm run check:lessons [lesson-id ...]
import { lessons } from '../src/data/curriculum'
import { structuredLessons } from '../src/data/lessons'
import { explanationWordCount, underTheHoodWordCount } from '../src/data/lessons/stats'
import { checkStructuredLesson } from './lesson-rules'

const only = process.argv.slice(2)
let problems = 0
for (const [id, lesson] of Object.entries(structuredLessons)) {
  if (only.length && !only.includes(id)) continue
  const meta = lessons.find((item) => item.id === id)
  const failures = checkStructuredLesson(id, lesson, meta?.description ?? '')
  problems += failures.length
  console.log(`${failures.length ? 'FAIL' : 'ok  '} ${id}: ${explanationWordCount(lesson)} words, under the hood ${underTheHoodWordCount(lesson)}, ${meta?.duration} min`)
  failures.forEach((failure) => console.log(`     ${failure}`))
}
if (problems) process.exitCode = 1
