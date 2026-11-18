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
  'mathematical-modeling-for-ai',
  'geometry-and-trigonometry',
  'logic-and-proof',
  'fractions-percentages-and-units',
  'sequences-and-growth',
  'exponents-and-logarithms',
  'numerical-methods-for-ai',
  'reading-charts-and-graphs',
  'sets-and-counting',
  'math-checkpoint',
]

const researchLessonIds = [
  'research-questions',
  'measuring-what-you-care-about',
  'research-ethics-and-consent',
  'data-collection-and-cleaning',
  'experiment-design',
  'statistical-inference-and-experiments',
  'reading-research-papers',
  'reporting-results',
  'research-checkpoint',
]

const securityLessonIds = (moduleById.get('security-governance')?.lessons ?? []).map((lesson) => lesson.id)
const providerSecurityLessonIds = ['azure-track', 'aws-track', 'gcp-track']
  .flatMap((moduleId) => moduleById.get(moduleId)?.lessons ?? [])
  .filter((lesson) => lesson.id.includes('security'))
  .map((lesson) => lesson.id)

const professionalPracticeModuleIds = [
  'communication',
  'customer-discovery',
  'value-and-business-cases',
  'consultative-selling',
  'scope-and-requirements',
  'commercial-practice',
  'solution-storytelling',
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
export const liveSectionIds = ['ai-foundations', 'cloud-foundations', 'networking-foundations', 'iot-foundations', 'python', 'python-next-steps', 'math', 'software-engineering', 'ai-engineering', 'cloud-engineering', 'security', 'research', 'technical-leadership', 'projects', 'game-development', 'vibe-coding', 'certifications']

export const isSectionLive = (sectionId: string) => liveSectionIds.includes(sectionId)

export const learningSections: LearningSection[] = [
  {
    id: 'ai-foundations',
    title: 'AI Foundations',
    description: 'Start with what AI is, how learning systems use data, how to describe a problem for a model, and how to read errors and confidence scores.',
    kind: 'learning',
    modules: [all('ai-fundamentals')],
    assessmentStageIds: ['foundation'],
  },
  {
    id: 'cloud-foundations',
    title: 'Cloud Foundations',
    description: 'Learn the portable cloud ideas behind every provider: shared responsibility, service models, identity, storage, networking, regions, backups, and delivery.',
    kind: 'learning',
    modules: [all('cloud-fundamentals')],
  },
  {
    id: 'networking-foundations',
    title: 'Networking Foundations',
    description: 'Learn how devices connect, how IP addresses and subnets work, how names become addresses, how ports and protocols carry traffic, and how to troubleshoot a connection step by step.',
    kind: 'learning',
    modules: [all('networking-foundations')],
  },
  {
    id: 'iot-foundations',
    title: 'IoT Foundations',
    description: 'Learn how connected devices sense and act, how to read sensor data, choose a wireless connection, send messages with MQTT, and keep devices secure.',
    kind: 'learning',
    modules: [all('iot-foundations')],
  },
  {
    id: 'math',
    title: 'Math',
    description: 'Build the mathematics behind measurement, change, chance, shape, and optimization, with examples from science, engineering, economics, and everyday life.',
    kind: 'learning',
    modules: [only('computing-math', mathLessonIds)],
  },
  {
    id: 'python',
    title: 'Python',
    description: 'Learn Python from first programs through data work, testing, package design, and a complete developer project.',
    kind: 'learning',
    modules: [
      only('computing-math', ['programming-and-data-workflows'], {
        title: 'Programming Fundamentals',
        description: 'Understand how code, data, experiments, and models fit together in a reproducible AI workflow.',
      }),
      only('python', [
        'install-python-in-vs-code',
        'python-basics',
        'python-control-flow',
        'python-functions',
        'python-data-structures',
        'python-files-and-errors',
        'python-errors-and-debugging',
        'python-packages-and-environments',
        'python-strings-and-text',
        'python-user-input-and-programs',
        'python-reading-csv-files',
        'python-beginner-checkpoint',
      ], {
        title: 'Python basics',
        description: 'Write, run, and check small programs: values, decisions, loops, functions, text, files, CSV data, and a checkpoint tool.',
      }),
    ],
  },
  {
    id: 'python-next-steps',
    title: 'Python Next Steps',
    description: 'Go further with data analysis, APIs, testing, algorithms, object-oriented design, typing, and a complete developer project.',
    kind: 'learning',
    modules: [
      only('python', [
        'python-data-analysis',
        'python-apis',
        'python-testing',
        'python-ai-projects',
        'python-project-evaluation',
        'python-search-and-sort',
        'python-recursion-and-graphs',
        'python-object-oriented-design',
        'python-iterators-generators',
        'python-typing-and-packages',
        'reading-code-you-did-not-write',
        'python-developer-capstone',
      ], {
        title: 'Python next steps',
        description: 'Analyze data, call APIs, test whole programs, study algorithms, design with objects, and finish a developer project.',
      }),
    ],
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
    description: 'Build Study Tracker, a real Python API, step by step: the command line, Git, an API, a database, tests, logging and Docker, in 15 lessons.',
    kind: 'learning',
    modules: [
      all('linux-cli'),
      all('git-github'),
      all('code-quality'),
      all('software-design'),
      all('http-networking'),
      all('apis-rest'),
      all('databases-sql'),
      only('testing-debugging', ['testing-debugging']),
      all('error-handling'),
      all('logging'),
      all('docker'),
      all('team-practice'),
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
    description: 'Start with passwords, encryption, secure web coding, phishing, threat modeling, and incident response, then apply the same thinking to AI, cloud, and supply-chain systems.',
    kind: 'learning',
    modules: [only('security-governance', securityLessonIds)],
    crossReferenceLessonIds: providerSecurityLessonIds,
  },
  {
    id: 'game-development',
    title: 'Game Development',
    description: 'Make small 2D games in Godot with GDScript: movement, pickups, signals, a score, saved best scores, and a game you export and share.',
    kind: 'learning',
    modules: [all('game-development')],
  },
  {
    id: 'vibe-coding',
    title: 'Vibe Coding',
    description: 'Build with an AI assistant without giving up control: clear goals, small steps, tested and readable code, safe sharing, and a tool you can explain.',
    kind: 'learning',
    modules: [all('vibe-coding')],
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


/**
 * The number of lessons in the whole curriculum, counted once each across the learning sections.
 * The Learn page section totals add up to this number, and progress is measured against it.
 */
export const curriculumLessonTotal = new Set(learningSections.filter((section) => section.kind === 'learning').flatMap((section) => getSectionLessonIds(section))).size


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
    foundation: 'ai-foundations',
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
