import { careerLevels, curriculumModules, curriculumStages, lessons, portfolioProjects, portfolioTracks } from '../src/data/curriculum'
import { lessonContent } from '../src/data/lessonContent'
import { lessonResources } from '../src/data/lessonResources'
import { getLearningPlanModules } from '../src/data/learningPlans'

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

const cloudStage = curriculumStages.find((stage) => stage.id === 'cloud-engineering')
const expectedCloudModuleIds = ['cloud-fundamentals', 'azure-track', 'aws-track', 'gcp-track']
if (!cloudStage || cloudStage.modules.map((module) => module.id).join(',') !== expectedCloudModuleIds.join(',')) failures.push('Cloud Engineering must contain Cloud Foundations followed by the Azure, AWS, and Google Cloud paths')
const cloudFoundations = cloudStage?.modules.find((module) => module.id === 'cloud-fundamentals')
if (!cloudFoundations || cloudFoundations.lessons.length !== 7) failures.push('Cloud Foundations must contain the seven portable cloud lessons')
for (const legacyModuleId of ['iam-security', 'cloud-storage-compute', 'cloud-networking', 'containers-serverless', 'ci-cd', 'infrastructure-as-code']) {
  if (cloudStage?.modules.some((module) => module.id === legacyModuleId)) failures.push(`Legacy generic cloud module must remain consolidated: ${legacyModuleId}`)
}

for (const providerId of ['azure', 'aws', 'gcp'] as const) {
  const providerModule = curriculumModules.find((module) => module.id === `${providerId}-track`)
  if (!providerModule || providerModule.lessons.length !== 14) failures.push(`${providerId.toUpperCase()} path must contain fourteen in-app lessons`)
  const expectedAdvancedLessons = ['governance-landing-zones', 'data-platforms', providerId === 'azure' ? 'containers-aks' : providerId === 'aws' ? 'containers-eks' : 'containers-gke', 'serverless-events', 'security-engineering', 'resilience-disaster-recovery', 'ai-ml-platforms', 'enterprise-capstone']
  for (const lessonSuffix of expectedAdvancedLessons) {
    if (!providerModule?.lessons.some((lesson) => lesson.id === `${providerId}-${lessonSuffix}`)) failures.push(`${providerId.toUpperCase()} path is missing advanced lesson: ${lessonSuffix}`)
  }
  const providerOrders = providerModule?.lessons.map((lesson) => lesson.order).sort((left, right) => left - right) ?? []
  if (providerOrders.join(',') !== Array.from({ length: 14 }, (_, index) => index + 1).join(',')) failures.push(`${providerId.toUpperCase()} lessons must use unique order values 1 through 14`)
  for (const lesson of providerModule?.lessons ?? []) {
    const resources = lessonContent[lesson.id]?.resources ?? []
    if (resources.length < 2) failures.push(`Provider lesson must include at least two documentation links: ${lesson.id}`)
  }
  const capstone = lessonContent[`${providerId}-enterprise-capstone`]?.project
  if (!capstone || capstone.steps.length < 6 || (capstone.files?.length ?? 0) < 6 || !capstone.verification?.length) failures.push(`${providerId.toUpperCase()} path must include a complete enterprise architecture capstone`)

  const certificationProvider = providerId === 'azure' ? 'Azure' : providerId === 'aws' ? 'AWS' : 'Google Cloud'
  const providerCertifications = curriculumStages.find((stage) => stage.id === 'cloud-engineering')?.certifications?.filter((certification) => certification.provider === certificationProvider) ?? []
  if (providerCertifications.length !== 3 || providerCertifications.map((certification) => certification.pathStep).join(',') !== '1,2,3') failures.push(`${providerId.toUpperCase()} path must include foundational, associate, and professional certifications`)
  if (providerCertifications.some((certification) => !certification.url.startsWith('https://'))) failures.push(`${providerId.toUpperCase()} certifications must link to official HTTPS pages`)

  const providerPlan = getLearningPlanModules({ version: 1, goal: 'cloud-engineer', experience: 'beginner', provider: providerId, objective: 'career-change', weeklyHours: 5 })
  const cloudModuleIds = new Set(curriculumStages.find((stage) => stage.id === 'cloud-engineering')?.modules.map((module) => module.id) ?? [])
  const architectureModuleIds = new Set(curriculumStages.find((stage) => stage.id === 'ai-architecture')?.modules.map((module) => module.id) ?? [])
  const selectedCloudModules = providerPlan.filter((module) => cloudModuleIds.has(module.id)).map((module) => module.id)
  if (selectedCloudModules.length !== 1 || selectedCloudModules[0] !== `${providerId}-track`) failures.push(`${providerId.toUpperCase()} Cloud Engineer plan must contain only its provider-specific cloud module`)
  if (providerPlan.some((module) => architectureModuleIds.has(module.id))) failures.push(`${providerId.toUpperCase()} Cloud Engineer plan must not add generic AI Architecture modules`)
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