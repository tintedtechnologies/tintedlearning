import { careerLevels, curriculumModules, curriculumStages, lessons, portfolioProjects, portfolioTracks } from '../src/data/curriculum'
import { lessonContent } from '../src/data/lessonContent'
import { lessonResources } from '../src/data/lessonResources'

const failures: string[] = []
const lessonIds = lessons.map((lesson) => lesson.id)
const duplicateLessonIds = lessonIds.filter((id, index) => lessonIds.indexOf(id) !== index)

if (duplicateLessonIds.length) failures.push(`Duplicate lesson IDs: ${[...new Set(duplicateLessonIds)].join(', ')}`)

for (const lesson of lessons) {
  if (!lessonContent[lesson.id]) failures.push(`Missing lesson content: ${lesson.id}`)
  const resources = lessonResources[lesson.id] ?? lessonContent[lesson.id]?.resources ?? []
  if (!resources.length) failures.push(`Missing topic-specific resources: ${lesson.id}`)
  const invalidResources = resources.filter((resource) => !resource || !resource.url)
  if (invalidResources.length) failures.push(`Invalid resource entry in lesson: ${lesson.id}`)
  const resourceUrls = resources.filter((resource) => resource?.url).map((resource) => resource.url)
  if (new Set(resourceUrls).size !== resourceUrls.length) failures.push(`Duplicate resource URL in lesson: ${lesson.id}`)
}

for (const lessonId of Object.keys(lessonResources)) {
  if (!lessonIds.includes(lessonId)) failures.push(`Resources reference an unknown lesson: ${lessonId}`)
}

for (const lesson of lessons) {
  const project = lessonContent[lesson.id]?.project
  if (!project) continue
  if (!project.goal.trim()) failures.push(`Project has no goal: ${lesson.id}`)
  if (!project.steps.length) failures.push(`Project has no build steps: ${lesson.id}`)
  if (project.steps.some((step) => !step.instructions.length || !step.checkpoint.trim())) failures.push(`Project step is missing instructions or checkpoint: ${lesson.id}`)
  if (!project.verification?.length) failures.push(`Project has no verification checklist: ${lesson.id}`)
  if (lesson.id === 'capstone-evaluation' && !project.steps.some((step) => step.code?.includes('parse_args') && step.code.includes('--responses'))) failures.push('Evaluation project does not implement its --responses command')
  if (lesson.id === 'chatbot-openai' && !project.setup.some((item) => item.includes('OPENAI_MODEL'))) failures.push('OpenAI project does not document OPENAI_MODEL')
  if (lesson.id === 'chatbot-gemini' && !project.setup.some((item) => item.includes('GEMINI_MODEL'))) failures.push('Gemini project does not document GEMINI_MODEL')
}

const moduleIds = curriculumModules.map((module) => module.id)
const duplicateModuleIds = moduleIds.filter((id, index) => moduleIds.indexOf(id) !== index)
if (duplicateModuleIds.length) failures.push(`Duplicate module IDs: ${[...new Set(duplicateModuleIds)].join(', ')}`)

for (const stage of curriculumStages) {
  for (const module of stage.modules) {
    if (!module.prerequisites.length || module.prerequisites.some((item) => !item.trim())) failures.push(`Module has missing prerequisites: ${module.id}`)
    if (module.id === 'python' && module.resources?.some((resource) => resource.url.includes('khanacademy.org/math'))) failures.push('Python module contains math-course resources')
  }
  const orders = stage.modules.flatMap((module) => module.lessons.map((lesson) => lesson.order))
  if (orders.some((order) => !Number.isInteger(order) || order < 1)) failures.push(`Invalid lesson order in stage: ${stage.id}`)
}

const curriculumLessonIds = curriculumStages.flatMap((stage) => stage.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id)))
for (const id of lessonIds) {
  if (!curriculumLessonIds.includes(id)) failures.push(`Lesson is not placed in a curriculum module: ${id}`)
}

const careerIds = careerLevels.map((level) => level.id)
if (new Set(careerIds).size !== careerIds.length) failures.push('Duplicate career level IDs')
for (const level of careerLevels) {
  for (const moduleId of level.requiredModuleIds) {
    if (!moduleIds.includes(moduleId)) failures.push(`Career level ${level.id} references unknown module: ${moduleId}`)
  }
  for (const lessonId of [...(level.requiredLessonIds ?? []), ...(level.requiredProjectLessonIds ?? [])]) {
    if (!lessonIds.includes(lessonId)) failures.push(`Career level ${level.id} references unknown lesson: ${lessonId}`)
  }
  for (const providerModuleId of level.providerModuleIds ?? []) {
    const providerModule = curriculumModules.find((module) => module.id === providerModuleId)
    if (!providerModule || !providerModule.provider || providerModule.provider === 'shared') failures.push(`Career level ${level.id} references invalid provider module: ${providerModuleId}`)
  }
  if (!level.portfolioArtifacts.length) failures.push(`Career level has no portfolio artifacts: ${level.id}`)
}

for (const track of portfolioTracks) {
  if (!track.deliverables.length || !track.evidence.length || !track.resources.length) failures.push(`Portfolio track is incomplete: ${track.id}`)
}

for (const projectKey of ['cloudDeployment', 'cicdDeployment', 'infrastructureAsCode'] as const) {
  const project = portfolioProjects[projectKey]
  if (!project || !project.files?.length || !project.verification?.length || !project.steps.length) failures.push(`Portfolio project is incomplete: ${projectKey}`)
}

const cloudDeploymentCode = portfolioProjects.cloudDeployment.steps[0].code ?? ''
const terraformCode = portfolioProjects.infrastructureAsCode.steps[0].code ?? ''
const ciCode = portfolioProjects.cicdDeployment.steps[1].code ?? ''
if (!terraformCode.includes('google_cloud_run_v2_service_iam_member') || !terraformCode.includes('roles/run.invoker')) failures.push('Terraform walkthrough does not configure Cloud Run invocation access')
if (!ciCode.includes('deploy-cloudrun@v3') || !ciCode.includes('id-token: write')) failures.push('CI/CD walkthrough does not use the maintained deploy action and OIDC permission')
if (!cloudDeploymentCode.includes('cat > app.py') || !cloudDeploymentCode.includes('cat > Dockerfile')) failures.push('Cloud deployment walkthrough does not provide separate copyable file creation')
if (!(portfolioProjects.cicdDeployment.steps[0].code ?? '').includes('test_client')) failures.push('CI/CD test example does not define a runnable Flask test client')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Curriculum valid: ${lessons.length} lessons, ${curriculumModules.length} modules, ${curriculumStages.length} stages.`)
}