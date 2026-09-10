export interface GuidedProject {
  goal: string
  prerequisites: string[]
  setup: string[]
  dependencies: string[]
  steps: { title: string; instructions: string[]; commands?: string[]; code?: string; checkpoint: string }[]
  nextSteps: string[]
}
export type Difficulty = 'Beginner' | 'Intermediate'
export type LessonCategory =
  | 'AI Foundations'
  | 'Math and Computing'
  | 'Python'
  | 'Modern AI Systems'
  | 'Using AI'
  | 'AI Engineering'
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

export interface LearningPath {
  id: string
  eyebrow: string
  title: string
  description: string
  lessons: Lesson[]
  tone: 'teal' | 'gold' | 'neutral'
  level?: 'Start here' | 'Core theory' | 'Systems' | 'Practice' | 'Engineering' | 'Build' | 'Projects' | 'Programming'
  resources?: LearningResource[]
}

export interface CareerPath {
  id: string
  title: string
  description: string
  steps: { title: string; description: string; lessons: string[]; resources: LearningResource[] }[]
  tone: 'teal' | 'gold' | 'neutral'
}
