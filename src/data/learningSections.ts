import { curriculumModules, lessons } from './curriculum'
import type { LearningSection, LearningSectionModuleReference } from '../types/curriculum'

const moduleById = new Map(curriculumModules.map((module) => [module.id, module]))

function all(moduleId: string): LearningSectionModuleReference {
  const module = moduleById.get(moduleId)
  if (!module) throw new Error(`Unknown curriculum module in learning section: ${moduleId}`)
  return { moduleId, lessonIds: module.lessons.map((lesson) => lesson.id) }
}

function only(moduleId: string, lessonIds: string[], presentation?: Pick<LearningSectionModuleReference, 'title' | 'description'>): LearningSectionModuleReference {
  const module = moduleById.get(moduleId)
  if (!module) throw new Error(`Unknown curriculum module in learning section: ${moduleId}`)
  const availableLessonIds = new Set(module.lessons.map((lesson) => lesson.id))
  const unknownLessonIds = lessonIds.filter((lessonId) => !availableLessonIds.has(lessonId))
  if (unknownLessonIds.length) throw new Error(`Unknown lessons in learning section module ${moduleId}: ${unknownLessonIds.join(', ')}`)
  return { moduleId, lessonIds, ...presentation }
}

const mathLessonIds = [
  'probability-and-statistics',
  'algebra-and-functions',
  'vectors-and-representations',
  'matrices-and-linear-algebra',
  'calculus-and-gradients',
  'optimization-and-training',
  'numerical-methods-for-ai',
  'mathematical-modeling-for-ai',
]

const researchLessonIds = [
  'research-questions',
  'data-collection-and-cleaning',
  'experiment-design',
  'statistical-inference-and-experiments',
  'reading-research-papers',
  'reporting-results',
]

const securityLessonIds = lessons.filter((lesson) => lesson.category === 'AI Security').map((lesson) => lesson.id)
const providerSecurityLessonIds = ['azure-track', 'aws-track', 'gcp-track']
  .flatMap((moduleId) => moduleById.get(moduleId)?.lessons ?? [])
  .filter((lesson) => lesson.id.includes('security'))
  .map((lesson) => lesson.id)

const professionalPracticeModuleIds = [
  'customer-discovery',
  'scope-and-requirements',
  'value-and-business-cases',
  'consultative-selling',
  'solution-storytelling',
  'commercial-practice',
  'communication',
  'planning-and-execution',
  'collaboration-and-influence',
  'leadership-systems',
  'leadership-practicum',
]

const architectureModuleIds = [
  'system-design',
  'scalability',
  'reliability',
  'distributed-systems',
  'architecture-patterns',
  'enterprise-integration',
  'cost-optimization',
  'architecture-decision-records',
]

/**
 * Sections open to learners. Every other section shows as "Coming soon" on the Learn page.
 * Add a section here only when all of its lessons are rewritten (scripts/validate-curriculum.ts enforces this).
 */
export const liveSectionIds = ['foundations', 'python', 'math', 'software-engineering', 'ai-engineering', 'cloud-engineering', 'security', 'research', 'technical-leadership', 'projects', 'certifications']

export const isSectionLive = (sectionId: string) => liveSectionIds.includes(sectionId)

export const learningSections: LearningSection[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    description: 'Get oriented with essential AI ideas, portable cloud concepts, and the programming workflows that support further study.',
    kind: 'learning',
    modules: [
      { ...all('ai-fundamentals'), title: 'AI Fundamentals', description: 'Understand what AI is, how learning systems work, and how to frame useful problems.' },
      { ...all('cloud-fundamentals'), title: 'Cloud Fundamentals', description: 'Learn portable cloud concepts: shared responsibility, identity, compute, storage, networking, delivery, and cost.' },
      only('computing-math', ['programming-and-data-workflows'], {
        title: 'Programming Fundamentals',
        description: 'Understand how code, data, experiments, and models fit together in a reproducible AI workflow.',
      }),
    ],
    assessmentStageIds: ['foundation'],
  },
  {
    id: 'math',
    title: 'Math',
    description: 'Build the mathematical intuition behind representations, probability, optimization, and numerical methods.',
    kind: 'learning',
    modules: [only('computing-math', mathLessonIds)],
  },
  {
    id: 'python',
    title: 'Python',
    description: 'Learn Python from first programs through data work, testing, package design, and a complete developer project.',
    kind: 'learning',
    modules: [all('python')],
  },
  {
    id: 'research',
    title: 'Research',
    description: 'Practice collecting evidence, designing experiments, evaluating claims, and communicating reproducible findings.',
    kind: 'learning',
    modules: [only('research-methods', researchLessonIds, {
      title: 'Research Methods',
      description: 'Learn how to collect evidence, design experiments, reason about uncertainty, and report findings clearly.',
    })],
  },
  {
    id: 'software-engineering',
    title: 'Software Engineering',
    description: 'Build Study Tracker, a real Python API, step by step: the command line, Git, an API, a database, tests, logging and Docker, in 11 lessons.',
    kind: 'learning',
    modules: [
      all('linux-cli'),
      all('git-github'),
      all('code-quality'),
      all('http-networking'),
      all('apis-rest'),
      all('databases-sql'),
      only('testing-debugging', ['testing-debugging']),
      all('logging'),
      all('docker'),
      all('software-engineering-capstone'),
    ],
    assessmentStageIds: ['software-engineering'],
  },
  {
    id: 'technical-leadership',
    title: 'Technical Leadership & Communication',
    description: 'Develop the customer, communication, planning, decision-making, and influence skills that make technical work useful.',
    kind: 'learning',
    modules: professionalPracticeModuleIds.map(all),
    assessmentStageIds: ['professional-practice'],
  },
  {
    id: 'ai-engineering',
    title: 'AI Engineering',
    description: 'Understand how modern AI works and use it well, then add AI features to Study Tracker: model calls, tools, retrieval, agents and streaming, run them in production and design systems around them.',
    kind: 'learning',
    modules: [
      all('llms'),
      all('prompting'),
      all('ai-apis'),
      all('observability'),
      ...architectureModuleIds.map(all),
    ],
    assessmentStageIds: ['ai-engineering', 'ai-architecture'],
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Turn your learning into complete, inspectable work with code, evaluation, deployment, documentation, and portfolio evidence.',
    kind: 'learning',
    modules: [all('starter-project'), all('developer-project'), all('data-project'), all('engineer-project'), all('architecture-project'), all('math-project'), all('client-project')],
  },
  {
    id: 'cloud-engineering',
    title: 'Cloud Engineering',
    description: 'Choose Azure, AWS, or Google Cloud and run Study Tracker as a real production service: identity, networking, a private database, secrets, monitoring, backups, governance and AI, built from code.',
    kind: 'learning',
    modules: [all('azure-track'), all('aws-track'), all('gcp-track')],
    assessmentStageIds: ['cloud-engineering'],
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Study threat modeling, identity, privacy, supply chains, secure deployment, and security credentials across AI and cloud systems.',
    kind: 'learning',
    modules: [only('security-governance', securityLessonIds)],
    crossReferenceLessonIds: providerSecurityLessonIds,
  },
  {
    id: 'certifications',
    title: 'Certifications',
    description: 'Real credentials from recognized organizations, free options first, with an honest guide to preparing for each one with Tinted Learning.',
    kind: 'reference',
    modules: [],
  },
]

export const learningSectionById = new Map(learningSections.map((section) => [section.id, section]))

export function getSectionModules(sectionId: string) {
  const section = learningSectionById.get(sectionId)
  if (!section) return []
  return section.modules.map((reference) => {
    const module = moduleById.get(reference.moduleId)
    if (!module) throw new Error(`Unknown curriculum module in learning section: ${reference.moduleId}`)
    const lessonIds = new Set(reference.lessonIds)
    return { module, lessons: module.lessons.filter((lesson) => lessonIds.has(lesson.id)) }
  })
}

export function getSectionLessonIds(section: LearningSection) {
  return section.modules.flatMap((reference) => reference.lessonIds)
}

export function getSectionIdForLegacyStage(stageId: string): string | undefined {
  const legacyStageSections: Record<string, string> = {
    foundation: 'foundations',
    'software-engineering': 'software-engineering',
    'ai-engineering': 'ai-engineering',
    'cloud-engineering': 'cloud-engineering',
    'ai-architecture': 'ai-engineering',
    'professional-practice': 'technical-leadership',
    projects: 'projects',
  }
  return legacyStageSections[stageId]
}

export function getSectionIdForModule(moduleId: string): string | undefined {
  return learningSections.find((section) => section.modules.some((reference) => reference.moduleId === moduleId))?.id
}

export function getSectionIdForLesson(lessonId: string): string | undefined {
  return learningSections.find((section) => section.modules.some((reference) => reference.lessonIds.includes(lessonId)))?.id
}
