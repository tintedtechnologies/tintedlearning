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
export type Difficulty = 'Beginner' | 'Intermediate'
export type LessonCategory =
  | 'AI Foundations'
  | 'Math and Computing'
  | 'Python'
  | 'Software Engineering'
  | 'Modern AI Systems'
  | 'Using AI'
  | 'AI Engineering'
  | 'Cloud Engineering'
  | 'AI Architecture'
  | 'Build Chatbots'
  | 'AI Security'
  | 'Projects and Practice'

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

export interface LessonSection {
  heading: string
  paragraphs: string[]
}

export interface LessonCallout {
  title: string
  text: string
  tone: 'teal' | 'gold'
}

export interface LessonExample {
  title: string
  explanation: string
  kind: 'code' | 'math' | 'json' | 'diagram'
  content: string
  language?: string
  visual?: LessonVisual
}

export interface LessonVisual {
  type: 'tokens' | 'embedding-space' | 'rag-pipeline' | 'agent-loop' | 'function-graph' | 'probability-bars' | 'vector-space' | 'matrix-transform' | 'gradient-descent' | 'workflow-pipeline' | 'algorithm-search' | 'algorithm-sort' | 'data-cleaning' | 'experiment-compare' | 'python-values' | 'python-collections' | 'python-files' | 'python-analysis' | 'python-api' | 'python-project' | 'ai-system-flow'
  caption: string
  description: string
  steps?: string[]
}

export interface LessonQuiz {
  question: string
  options: string[]
  answer: string
  correctFeedback: string
  incorrectFeedback: string
}

export interface LessonContent {
  learningPoints: string[]
  sections: LessonSection[]
  callouts: LessonCallout[]
  examples?: LessonExample[]
  resources?: LearningResource[]
  quiz?: LessonQuiz
  deeper: string
  takeaway: string
  project?: GuidedProject
}

export interface LearningResource {
  title: string
  provider: string
  description: string
  url: string
}

export type CurriculumStageId = 'foundation' | 'software-engineering' | 'ai-engineering' | 'cloud-engineering' | 'ai-architecture' | 'projects'

export type CareerLevelId = 'start-here' | 'ai-developer' | 'ai-engineer' | 'ai-architect'

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
  certifications?: Certification[]
  status?: 'available' | 'coming-soon'
}

export interface Certification {
  title: string
  provider: 'Azure' | 'AWS' | 'Google Cloud'
  level: 'Foundational' | 'Associate' | 'Professional'
  pathStep: 1 | 2 | 3
  examCode?: string
  description: string
  statusNote?: string
  url: string
}

export interface CareerLevel {
  id: CareerLevelId
  title: string
  description: string
  unlockText: string
  requiredModuleIds: string[]
  requiredLessonIds?: string[]
  projectId?: string
  requiredProjectLessonIds?: string[]
  projectCompletion?: 'any' | 'all'
  providerModuleIds?: string[]
  portfolioArtifacts: string[]
  tone: 'teal' | 'gold' | 'neutral'
}


