import { careerLevels, curriculumModules, curriculumStages, lessons, portfolioProjects, portfolioTracks } from '../src/data/curriculum'
import { certifications } from '../src/data/certifications'
import { getSectionLessonIds, getSectionModules, learningSections, liveSectionIds } from '../src/data/learningSections'
import { lessonContent } from '../src/data/lessonContent'
import { lessonResources } from '../src/data/lessonResources'
import { getLearningPlanModules } from '../src/data/learningPlans'
import { structuredLessons } from '../src/data/lessons'
import { projectPlans } from '../src/data/projects'
import { checkStructuredLesson } from './lesson-rules'

const failures: string[] = []
const liveLessonIds = new Set(learningSections.filter((section) => liveSectionIds.includes(section.id)).flatMap((section) => getSectionLessonIds(section)))
const lessonIds = lessons.map((lesson) => lesson.id)
const securityLessonIds = lessons.filter((lesson) => lesson.category === 'AI Security').map((lesson) => lesson.id)
const duplicateLessonIds = lessonIds.filter((id, index) => lessonIds.indexOf(id) !== index)

if (duplicateLessonIds.length) failures.push(`Duplicate lesson IDs: ${[...new Set(duplicateLessonIds)].join(', ')}`)

for (const lesson of lessons) {
  if (!lessonContent[lesson.id] && !structuredLessons[lesson.id] && !projectPlans[lesson.id]) failures.push(`Missing lesson content: ${lesson.id}`)
  // Live lessons must use the structured format and pass the CLAUDE.md content rules.
  // Greyed-out lessons are not checked for quizzes or examples, because generated filler is worse than a hidden section.
  const structured = structuredLessons[lesson.id]
  if (liveLessonIds.has(lesson.id) && !structured && !projectPlans[lesson.id]) failures.push(`Live lesson is missing structured content: ${lesson.id}`)
  if (structured) failures.push(...checkStructuredLesson(lesson.id, structured, lesson.description))
  const resources = structuredLessons[lesson.id]?.resources ?? lessonResources[lesson.id] ?? lessonContent[lesson.id]?.resources ?? []
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

const expectedSectionIds = ['foundations', 'math', 'python', 'research', 'software-engineering', 'technical-leadership', 'ai-engineering', 'projects', 'cloud-engineering', 'security', 'certifications']
if (learningSections.map((section) => section.id).join(',') !== expectedSectionIds.join(',')) failures.push('Learning sections do not match the defined section catalog and order')
if (new Set(learningSections.map((section) => section.id)).size !== learningSections.length) failures.push('Duplicate learning section IDs')
const sectionLessonReferences = learningSections.flatMap((section) => getSectionLessonIds(section))
const duplicateSectionLessonReferences = sectionLessonReferences.filter((id, index) => sectionLessonReferences.indexOf(id) !== index)
if (duplicateSectionLessonReferences.length) failures.push(`Duplicate section lesson references: ${[...new Set(duplicateSectionLessonReferences)].join(', ')}`)
for (const lessonId of lessonIds) {
  if (!sectionLessonReferences.includes(lessonId)) failures.push(`Lesson is not assigned to a learning section: ${lessonId}`)
}
for (const lessonId of sectionLessonReferences) {
  if (!lessonIds.includes(lessonId)) failures.push(`Learning section references an unknown lesson: ${lessonId}`)
}
for (const section of learningSections) {
  const sectionModuleIds = section.modules.map((reference) => reference.moduleId)
  if (new Set(sectionModuleIds).size !== sectionModuleIds.length) failures.push(`Section ${section.id} repeats a module reference`)
  for (const reference of section.modules) {
    if (!moduleIds.includes(reference.moduleId)) failures.push(`Section ${section.id} references an unknown module: ${reference.moduleId}`)
    if (new Set(reference.lessonIds).size !== reference.lessonIds.length) failures.push(`Section ${section.id} repeats lessons in module ${reference.moduleId}`)
    const moduleLessonIds = new Set(curriculumModules.find((module) => module.id === reference.moduleId)?.lessons.map((lesson) => lesson.id) ?? [])
    for (const lessonId of reference.lessonIds) {
      if (!moduleLessonIds.has(lessonId)) failures.push(`Section ${section.id} lesson ${lessonId} is not in referenced module ${reference.moduleId}`)
    }
  }
  for (const assessmentStageId of section.assessmentStageIds ?? []) {
    if (!curriculumStages.some((stage) => stage.id === assessmentStageId && stage.assessment)) failures.push(`Section ${section.id} references an unavailable assessment: ${assessmentStageId}`)
  }
}
const foundationsSection = learningSections.find((section) => section.id === 'foundations')
const foundationsLessons = getSectionModules('foundations').flatMap((module) => module.lessons)
if (foundationsSection?.modules.map((reference) => reference.moduleId).join(',') !== 'ai-fundamentals,cloud-fundamentals,computing-math') failures.push('Foundations must reference only AI, cloud, and programming fundamentals modules')
if (foundationsLessons.some((lesson) => lesson.category === 'Math and Computing' && lesson.id !== 'programming-and-data-workflows' || lesson.category === 'Python' || lesson.id === 'algorithms-and-data-structures')) failures.push('Foundations contains material outside AI, cloud, and programming fundamentals')
for (const sectionId of ['math', 'python', 'research']) {
  if (!learningSections.some((section) => section.id === sectionId)) failures.push(`${sectionId} must be an independent learning section`)
  if (learningSections.find((section) => section.id === sectionId)?.kind !== 'learning') failures.push(`${sectionId} must be an independent learning section, not a reference catalog`)
}
const researchSection = learningSections.find((section) => section.id === 'research')
if (researchSection?.modules.some((reference) => reference.moduleId === 'math-project' || reference.lessonIds.includes('mathematical-modeling-for-ai'))) failures.push('Research must not contain the mathematics project or mathematical modeling lesson')
if (!researchSection?.modules.some((reference) => reference.lessonIds.includes('experiment-design') && reference.lessonIds.includes('statistical-inference-and-experiments'))) failures.push('Research must include experiment design and statistical inference')
const leadershipSection = learningSections.find((section) => section.id === 'technical-leadership')
if (!leadershipSection || leadershipSection.modules.length !== 11) failures.push('Technical Leadership & Communication must be its own section with all professional practice modules')
if (learningSections.find((section) => section.id === 'software-engineering')?.modules.some((reference) => reference.moduleId === 'customer-discovery')) failures.push('Technical Leadership modules must not be included in Software Engineering')
const projectsSection = learningSections.find((section) => section.id === 'projects')
if (projectsSection?.modules.map((reference) => reference.moduleId).join(',') !== 'starter-project,developer-project,data-project,engineer-project,architecture-project,math-project,client-project') failures.push('Projects must be its own section with the starter, developer, data, engineer, architecture, math and client projects')
for (const projectModuleId of ['developer-project', 'engineer-project', 'architecture-project', 'math-project']) {
  if (learningSections.filter((section) => section.modules.some((reference) => reference.moduleId === projectModuleId)).length !== 1) failures.push(`Project module must have one section owner: ${projectModuleId}`)
}
const pythonSectionIds = new Set(getSectionLessonIds(learningSections.find((section) => section.id === 'python')!))
if (getSectionLessonIds(foundationsSection!).some((lessonId) => pythonSectionIds.has(lessonId))) failures.push('Python lessons must not be assigned to Foundations')
if (getSectionModules('certifications').length || getSectionLessonIds(learningSections.find((section) => section.id === 'certifications')!).length) failures.push('Certifications must not count as modules or lessons')
const expectedSoftwareOrder = ['linux-cli', 'git-github', 'code-quality', 'http-networking', 'apis-rest', 'databases-sql', 'testing-debugging', 'logging', 'docker', 'software-engineering-capstone']
const softwareSectionModuleIds = learningSections.find((section) => section.id === 'software-engineering')?.modules.map((reference) => reference.moduleId) ?? []
if (softwareSectionModuleIds.join(',') !== expectedSoftwareOrder.join(',')) failures.push('Software Engineering modules must follow the 11-lesson order in CLAUDE.md')
const expectedAiOrder = ['llms', 'prompting', 'ai-apis', 'observability', 'system-design', 'scalability', 'reliability', 'distributed-systems', 'architecture-patterns', 'enterprise-integration', 'cost-optimization', 'architecture-decision-records']
const aiSectionModuleIds = learningSections.find((section) => section.id === 'ai-engineering')?.modules.map((reference) => reference.moduleId) ?? []
if (aiSectionModuleIds.slice(0, expectedAiOrder.length).join(',') !== expectedAiOrder.join(',')) failures.push('AI Engineering does not begin with model concepts and progress through retrieval, tools, agents, and evaluation')
const cloudSection = learningSections.find((section) => section.id === 'cloud-engineering')
if (cloudSection?.modules.map((reference) => reference.moduleId).join(',') !== 'azure-track,aws-track,gcp-track') failures.push('Cloud Engineering must contain provider-specific operational content, not Cloud Fundamentals')
const securitySection = learningSections.find((section) => section.id === 'security')
if (!securitySection?.modules.some((reference) => reference.lessonIds.length === securityLessonIds.length)) failures.push('Security must include the AI security lessons')
if (new Set(certifications.map((certification) => certification.id)).size !== certifications.length) failures.push('Duplicate certification IDs')
const certificationAreas = ['Cloud', 'AI', 'Security', 'Programming & Developer Tools']
const certificationLevels = ['Entry', 'Associate', 'Professional']
const certificationCosts = ['Free', 'Free training, paid exam', 'Paid exam']
for (const certification of certifications) {
  if (!certificationAreas.includes(certification.area)) failures.push(`Certification ${certification.id} has an unknown area`)
  if (!certificationLevels.includes(certification.level)) failures.push(`Certification ${certification.id} has an unknown level`)
  if (!certificationCosts.includes(certification.cost)) failures.push(`Certification ${certification.id} must show a cost type, not a price`)
  if (!certification.officialUrl.startsWith('https://')) failures.push(`Certification ${certification.id} needs an https official link`)
  if (!certification.lastChecked.trim()) failures.push(`Certification ${certification.id} needs a last checked date`)
  for (const link of certification.prepare.links) {
    const target = link.to.split('/').pop() ?? ''
    const resolves = link.to.startsWith('/learn/sections/') ? learningSections.some((section) => section.id === target) : lessonIds.includes(target)
    if (!resolves) failures.push(`Certification ${certification.id} links to an unknown page: ${link.to}`)
  }
}
const securitySectionLessonIds = new Set(securitySection ? getSectionLessonIds(securitySection) : [])
for (const lessonId of securitySection?.crossReferenceLessonIds ?? []) {
  if (!lessonIds.includes(lessonId) || securitySectionLessonIds.has(lessonId)) failures.push(`Security provider cross-reference must be a valid related lesson not duplicated in Security: ${lessonId}`)
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