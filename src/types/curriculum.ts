export interface GuidedProject {
  goal: string
  prerequisites: string[]
  setup: string[]
  files?: { path: string; purpose: string }[]
  platformNotes?: string[]
  dependencies: string[]
  steps: { title: string; instructions: string[]; commands?: string[]; code?: string; checkpoint: string }[]
  verification?: string[]
  nextSteps: string[]
}

export interface PortfolioTrack {
  id: string
  title: string
  description: string
  deliverables: string[]
  evidence: string[]
  resources: LearningResource[]
  tone: 'teal' | 'gold' | 'neutral'
}
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type LessonCategory =
  | 'AI Foundations'
  | 'Math and Computing'
  | 'Research'
  | 'Python'
  | 'Software Engineering'
  | 'Modern AI Systems'
  | 'Using AI'
  | 'AI Engineering'
  | 'Cloud Engineering'
  | 'AI Architecture'
  | 'Build Chatbots'
  | 'AI Security'
  | 'Professional Practice'
  | 'Projects and Practice'
  | 'Game Development'
  | 'Vibe Coding'

export interface Lesson {
  id: string
  title: string
  description: string
  duration: number
  difficulty: Difficulty
  category: LessonCategory
  order: number
  status?: 'available' | 'coming-soon'
}

export interface LessonQuiz {
  question: string
  options: string[]
  answer: string
  correctFeedback: string
  incorrectFeedback: string
}

export interface StageAssessment {
  title: string
  instructions: string
  questions: LessonQuiz[]
}

export interface LearningResource {
  title: string
  provider: string
  description: string
  url: string
}

export type CurriculumStageId = 'foundation' | 'software-engineering' | 'ai-engineering' | 'cloud-engineering' | 'ai-architecture' | 'research' | 'professional-practice' | 'projects' | 'game-development' | 'vibe-coding'

export interface CurriculumModule {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  prerequisites: string[]
  resources?: LearningResource[]
  status?: 'available' | 'coming-soon'
  provider?: 'shared' | 'azure' | 'aws' | 'gcp'
}

export interface CurriculumStage {
  id: CurriculumStageId
  eyebrow: string
  title: string
  description: string
  modules: CurriculumModule[]
  tone: 'teal' | 'gold' | 'neutral'
  learnerOutcome?: { understand: string; build: string; show: string }
  assessment?: StageAssessment
  status?: 'available' | 'coming-soon'
}

export type CertificationArea = 'Cloud' | 'AI' | 'Security' | 'Programming & Developer Tools'
export type CertificationLevel = 'Entry' | 'Associate' | 'Professional'
/** Never a price: prices change and vary by country. */
export type CertificationCost = 'Free' | 'Free training, paid exam' | 'Paid exam'

export interface Certification {
  id: string
  /** The official name, exactly as the issuer writes it. */
  name: string
  issuer: string
  area: CertificationArea
  level: CertificationLevel
  cost: CertificationCost
  /** What it shows an employer, in one plain sentence. */
  employerSentence: string
  /** Lessons and sections on Tinted Learning that cover its topics, with an honest note on what else to study. */
  prepare: { links: { label: string; to: string }[]; stillNeed: string }
  /** The issuer's own page. */
  officialUrl: string
  /** Month and year someone confirmed the credential is current. */
  lastChecked: string
  /** Version or retirement notes from the official page, when there are any. */
  note?: string
}

export interface LearningSectionModuleReference {
  moduleId: string
  lessonIds: string[]
  title?: string
  description?: string
}

export interface LearningSection {
  id: string
  title: string
  description: string
  kind: 'learning' | 'reference'
  modules: LearningSectionModuleReference[]
  assessmentStageIds?: CurriculumStageId[]
  crossReferenceLessonIds?: string[]
}
