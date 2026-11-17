import type { GuidedProject, LearningResource } from './curriculum'

/**
 * Structured lesson format used by the live sections (Foundations, Python, Math).
 * Each field maps to one section of the lesson page, in the order defined in CLAUDE.md.
 * Optional fields are hidden on the page when they are missing. Never fill them with generic text.
 *
 * Inline code in prose is written with backticks, for example "Call `print()` to show a value."
 */

export interface CodeExample {
  language: 'python' | 'bash' | 'text'
  code: string
  /** Exact text the code prints. Python examples with output are checked by scripts/check-lesson-code.ts. */
  output?: string
  /** Name of the exception this Python example is meant to raise, such as "TypeError". */
  raises?: string
  /**
   * Python: set to false when it cannot run in the checker (for example, it needs the network or Docker).
   * Bash: set to true to have the checker run the commands in an empty folder.
   */
  runnable?: boolean
  /** File name the checker saves this example as, such as "app.py". Defaults to example.py or example.sh. */
  filename?: string
  /** Other files the checker writes into the folder first, keyed by file name. Use code shown elsewhere in the lesson. */
  files?: Record<string, string>
  /** Compare stdout and stderr together, for examples whose output is logging (which writes to stderr). */
  captureStderr?: boolean
  /** Run the folder with pytest instead of running the file directly. */
  runWith?: 'pytest'
}

export interface LessonFigure {
  /** Path under public/, starting with a slash. */
  src: string
  /** Describes the image for screen readers, in one sentence. */
  alt: string
  /** Says what to click or look for, using the numbers shown on the image. */
  caption: string
  /** Required for screenshots taken from the Godot documentation. */
  credit: { text: string; url: string }
}

export interface GoalSection {
  heading: string
  paragraphs: string[]
  /** Screenshot-style illustrations placed after the paragraphs. */
  figures?: LessonFigure[]
  example: CodeExample
}

export interface WalkthroughStep {
  /** The line (or few lines) being explained, copied from the example. */
  code: string
  explanation: string
}

export interface SeeItInAction {
  title: string
  intro: string
  example: CodeExample
  steps: WalkthroughStep[]
}

export interface TryItYourself {
  instructions: string[]
  /** Code loaded into the Python playground when the learner opens it from this lesson. */
  starterCode?: string
  playground?: 'python' | 'tokens' | 'context' | 'temperature' | 'prompt-builder' | 'agents' | 'embeddings'
  /** Shows a saved free-text answer box under the instructions. */
  evidencePrompt?: { label: string; placeholder: string }
  /** Files the learner creates or changes, shown under the instructions. Checked by scripts/check-lesson-code.ts. */
  files?: CodeExample[]
  /** A step-by-step build. Its time is shown separately from reading time. */
  project?: GuidedProject
}

export interface CommonMistake {
  mistake: string
  fix: string
}

export interface QuizOption {
  text: string
  explanation: string
}

export interface QuizQuestion {
  question: string
  code?: CodeExample
  options: QuizOption[]
  /** Index into options. */
  answer: number
  /** When true, the checker confirms the correct option equals what `code` prints. */
  answerIsOutput?: boolean
}

export interface UnderTheHood {
  heading: string
  paragraphs: string[]
}

export interface StructuredLesson {
  /** For building lessons: the earlier lessons this one assumes, shown above the goals. */
  assumes?: string
  goals: [string, string, string]
  bigIdea: string
  whyItMatters: string
  goalSections: [GoalSection, GoalSection, GoalSection]
  seeItInAction: SeeItInAction
  tryIt?: TryItYourself
  mistakes: CommonMistake[]
  quiz: [QuizQuestion, QuizQuestion, QuizQuestion]
  takeaway: string
  resources?: LearningResource[]
  underTheHood?: UnderTheHood
}
