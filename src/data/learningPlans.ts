import { curriculumModules } from './curriculum'
import type { CurriculumModule } from '../types/curriculum'

export type LearningGoal = 'explore-ai' | 'ai-developer' | 'ai-engineer' | 'cloud-engineer' | 'ai-architect'
export type ExperienceLevel = 'beginner' | 'some-coding' | 'working-developer'
export type CloudProvider = 'undecided' | 'azure' | 'aws' | 'gcp'
export type LearningObjective = 'career-change' | 'current-role' | 'certification' | 'build-project'
export type ModulePreference = 'required' | 'optional' | 'known'

export interface PlanEvidence {
  id: string
  title: string
}

export interface LearningPlanProfile {
  version: 1
  goal: LearningGoal
  experience: ExperienceLevel
  provider: CloudProvider
  objective: LearningObjective
  weeklyHours: 3 | 5 | 10
  modulePreferences?: Record<string, ModulePreference>
  completedEvidenceIds?: string[]
}

export const goalOptions: { id: LearningGoal; title: string; description: string }[] = [
  { id: 'explore-ai', title: 'Explore AI', description: 'Build a practical foundation and discover which technical direction fits.' },
  { id: 'ai-developer', title: 'AI Developer', description: 'Build dependable applications that use model APIs and local models.' },
  { id: 'ai-engineer', title: 'AI Engineer', description: 'Build retrieval, agent, evaluation, and observable AI systems.' },
  { id: 'cloud-engineer', title: 'Cloud Engineer for AI', description: 'Deploy and operate secure, repeatable cloud workloads for AI applications.' },
  { id: 'ai-architect', title: 'AI Architect', description: 'Design secure, reliable, cost-aware AI and cloud systems.' },
]

export const experienceOptions: { id: ExperienceLevel; title: string; description: string }[] = [
  { id: 'beginner', title: 'I am starting fresh', description: 'Include computing, Python, and software foundations.' },
  { id: 'some-coding', title: 'I have written some code', description: 'Keep the practical engineering essentials and move faster.' },
  { id: 'working-developer', title: 'I build software already', description: 'Focus the plan on AI, cloud, and architecture capabilities.' },
]

export const providerOptions: { id: CloudProvider; title: string }[] = [
  { id: 'undecided', title: 'Help me stay provider-neutral' },
  { id: 'azure', title: 'Microsoft Azure' },
  { id: 'aws', title: 'Amazon Web Services' },
  { id: 'gcp', title: 'Google Cloud' },
]

export const objectiveOptions: { id: LearningObjective; title: string }[] = [
  { id: 'career-change', title: 'Prepare for a new role' },
  { id: 'current-role', title: 'Grow in my current role' },
  { id: 'certification', title: 'Prepare for certification' },
  { id: 'build-project', title: 'Build a portfolio project' },
]

const foundations = ['ai-fundamentals', 'computing-math', 'python', 'git-github', 'linux-cli']
const practicalFoundations = ['ai-fundamentals', 'python', 'git-github', 'linux-cli']
const software = ['apis-rest', 'http-networking', 'databases-sql', 'data-structures', 'testing-debugging', 'docker']
const aiEngineering = ['llms', 'prompting', 'structured-outputs', 'embeddings', 'vector-databases', 'rag', 'tool-calling', 'agents', 'evaluation', 'guardrails', 'observability']
const cloudCore = ['cloud-fundamentals', 'iam-security', 'cloud-storage-compute', 'cloud-networking', 'containers-serverless', 'ci-cd', 'infrastructure-as-code']
const architecture = ['system-design', 'distributed-systems', 'scalability', 'reliability', 'security-governance', 'cost-optimization', 'architecture-patterns', 'enterprise-integration', 'architecture-decision-records']

function startingModules(experience: ExperienceLevel) {
  if (experience === 'beginner') return foundations
  if (experience === 'some-coding') return practicalFoundations
  return ['git-github', 'testing-debugging', 'docker']
}

function providerModule(provider: CloudProvider) {
  return provider === 'undecided' ? [] : [`${provider}-track`]
}

function projectModule(goal: LearningGoal) {
  if (goal === 'ai-engineer') return ['engineer-project']
  if (goal === 'ai-architect') return ['architecture-project']
  return ['developer-project']
}

function objectiveModules(profile: LearningPlanProfile) {
  if (profile.objective === 'career-change') return ['git-github', 'linux-cli', 'testing-debugging', ...projectModule(profile.goal)]
  if (profile.objective === 'current-role') return ['observability', 'security-governance']
  if (profile.objective === 'certification') return ['cloud-fundamentals', 'iam-security', ...providerModule(profile.provider)]
  return ['testing-debugging', 'docker', ...projectModule(profile.goal)]
}

const evidenceByGoal: Record<LearningGoal, PlanEvidence[]> = {
  'explore-ai': [
    { id: 'learning-plan', title: 'Written learning plan and target outcome' },
    { id: 'first-program', title: 'First working Python program' },
    { id: 'concept-notes', title: 'Notes explaining three AI concepts in your own words' },
  ],
  'ai-developer': [
    { id: 'public-repository', title: 'Public Git repository' },
    { id: 'project-readme', title: 'README with setup and technical decisions' },
    { id: 'automated-tests', title: 'Automated tests for important behavior' },
    { id: 'working-ai-app', title: 'Working API-backed or local AI application' },
  ],
  'ai-engineer': [
    { id: 'rag-agent-repository', title: 'Tested RAG or agent repository' },
    { id: 'evaluation-results', title: 'Evaluation dataset and results' },
    { id: 'threat-model', title: 'Threat model and guardrail decisions' },
    { id: 'observability-evidence', title: 'Tracing or observability evidence' },
  ],
  'cloud-engineer': [
    { id: 'deployed-service', title: 'Deployed cloud service' },
    { id: 'cloud-diagram', title: 'Cloud architecture diagram' },
    { id: 'infrastructure-code', title: 'Versioned infrastructure as code' },
    { id: 'operations-runbook', title: 'Operations, recovery, and cost notes' },
  ],
  'ai-architect': [
    { id: 'architecture-design', title: 'Architecture diagram and decision records' },
    { id: 'reliability-plan', title: 'Reliability and incident plan' },
    { id: 'security-controls', title: 'Threat model and security controls' },
    { id: 'cost-review', title: 'Cost estimate and design review presentation' },
  ],
}

export function getLearningPlanModules(profile: LearningPlanProfile): CurriculumModule[] {
  const starts = startingModules(profile.experience)
  const moduleIdsByGoal: Record<LearningGoal, string[]> = {
    'explore-ai': [...starts, 'llms', 'prompting', 'developer-project'],
    'ai-developer': [...starts, ...software, 'llms', 'prompting', 'structured-outputs', 'developer-project'],
    'ai-engineer': [...starts, ...software, ...aiEngineering, 'engineer-project'],
    'cloud-engineer': [...starts, ...software, ...cloudCore, ...providerModule(profile.provider), 'observability', 'reliability', 'security-governance', 'cost-optimization'],
    'ai-architect': [...starts, ...software, ...aiEngineering, ...cloudCore, ...providerModule(profile.provider), ...architecture, 'architecture-project'],
  }
  const selectedIds = new Set([...moduleIdsByGoal[profile.goal], ...objectiveModules(profile)])
  Object.entries(profile.modulePreferences ?? {}).forEach(([moduleId, preference]) => {
    if (preference === 'known') selectedIds.delete(moduleId)
    else selectedIds.add(moduleId)
  })
  return curriculumModules.filter((module) => selectedIds.has(module.id))
}

export function getPlanEvidence(goal: LearningGoal) {
  return evidenceByGoal[goal]
}

export function readLearningPlan(value: unknown): LearningPlanProfile | null {
  if (!value || typeof value !== 'object') return null
  const profile = value as Partial<LearningPlanProfile>
  const validGoal = goalOptions.some((option) => option.id === profile.goal)
  const validExperience = experienceOptions.some((option) => option.id === profile.experience)
  const validProvider = providerOptions.some((option) => option.id === profile.provider)
  const validObjective = objectiveOptions.some((option) => option.id === profile.objective)
  const validHours = profile.weeklyHours === 3 || profile.weeklyHours === 5 || profile.weeklyHours === 10
  if (profile.version !== 1 || !validGoal || !validExperience || !validProvider || !validObjective || !validHours) return null
  const validModuleIds = new Set(curriculumModules.map((module) => module.id))
  const modulePreferences = Object.fromEntries(Object.entries(profile.modulePreferences ?? {}).filter(([moduleId, preference]) => validModuleIds.has(moduleId) && (preference === 'required' || preference === 'optional' || preference === 'known')))
  const validEvidenceIds = new Set(getPlanEvidence(profile.goal!).map((evidence) => evidence.id))
  const completedEvidenceIds = Array.isArray(profile.completedEvidenceIds) ? [...new Set(profile.completedEvidenceIds.filter((id): id is string => typeof id === 'string' && validEvidenceIds.has(id)))] : []
  return { ...profile, modulePreferences, completedEvidenceIds } as LearningPlanProfile
}

export function getGoalTitle(goal: LearningGoal) {
  return goalOptions.find((option) => option.id === goal)?.title ?? 'Learning plan'
}