// Runs every Python example (and every bash example marked runnable) in the structured lessons,
// and checks that it prints what the lesson says.
// Usage: npm run check:lesson-code [lesson-id ...]
// Set PYTHON to an interpreter that has fastapi, httpx and pytest installed to check Software Engineering lessons.
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { structuredLessons } from '../src/data/lessons'
import type { CodeExample } from '../src/types/lesson'

const python = process.env.PYTHON ?? 'python3'
const pythonBin = dirname(python)
const only = process.argv.slice(2)
const failures: string[] = []
let checked = 0

function write(dir: string, name: string, content: string) {
  const path = join(dir, name)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf-8')
}

function run(label: string, example: CodeExample, expectedOutput = example.output) {
  const isPython = example.language === 'python' && example.runnable !== false
  const isBash = example.language === 'bash' && example.runnable === true
  if (!isPython && !isBash) return
  const dir = mkdtempSync(join(tmpdir(), 'lesson-code-'))
  try {
    for (const [name, content] of Object.entries(example.files ?? {})) write(dir, name, content)
    const filename = example.filename ?? (isPython ? 'example.py' : 'example.sh')
    // Shell scripts live outside the working folder, so commands like ls only see what the lesson creates.
    const scriptDir = isBash ? mkdtempSync(join(tmpdir(), 'lesson-script-')) : dir
    write(scriptDir, filename, example.code)
    const env = { ...process.env, PATH: `${pythonBin}:${process.env.PATH}`, PYTHONDONTWRITEBYTECODE: '1', GIT_AUTHOR_NAME: 'Learner', GIT_AUTHOR_EMAIL: 'learner@example.com', GIT_COMMITTER_NAME: 'Learner', GIT_COMMITTER_EMAIL: 'learner@example.com' }
    const args = isBash ? ['bash', ['-e', join(scriptDir, filename)]] as const
      : example.runWith === 'pytest' ? [python, ['-m', 'pytest', '-q', '-p', 'no:cacheprovider']] as const
      : example.captureStderr ? ['bash', ['-c', `"${python}" ${filename} 2>&1`]] as const
      : [python, [filename]] as const
    const result = spawnSync(args[0], [...args[1]], { cwd: dir, encoding: 'utf-8', timeout: 60000, env })
    checked += 1
    const stdout = result.stdout.replace(/\s+$/, '')
    if (example.raises) {
      if (result.status === 0 || !result.stderr.includes(example.raises)) failures.push(`${label}: expected ${example.raises}, got exit ${result.status}\n${result.stderr}`)
    } else if (result.status !== 0) {
      failures.push(`${label}: exited with ${result.status}\n${result.stdout}\n${result.stderr}`)
      return
    }
    if (expectedOutput !== undefined && stdout !== expectedOutput.replace(/\s+$/, '')) failures.push(`${label}: output mismatch\n--- expected\n${expectedOutput}\n--- actual\n${stdout}`)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

for (const [id, lesson] of Object.entries(structuredLessons)) {
  if (only.length && !only.includes(id)) continue
  lesson.goalSections.forEach((section, index) => run(`${id} goal ${index + 1}`, section.example))
  run(`${id} see it in action`, lesson.seeItInAction.example)
  if (lesson.tryIt?.starterCode) run(`${id} starter code`, { language: 'python', code: lesson.tryIt.starterCode })
  lesson.tryIt?.files?.forEach((file, index) => run(`${id} try it file ${index + 1}${file.filename ? ` (${file.filename})` : ''}`, file))
  lesson.quiz.forEach((question, index) => {
    if (!question.code) return
    const expected = question.answerIsOutput ? question.options[question.answer].text.replace(/`/g, '') : undefined
    run(`${id} quiz ${index + 1}`, question.code, expected)
  })
}

if (failures.length) {
  console.error(failures.join('\n\n'))
  console.error(`\n${failures.length} problem(s) in ${checked} examples.`)
  process.exitCode = 1
} else {
  console.log(`Lesson code valid: ${checked} examples ran and matched their stated output.`)
}
