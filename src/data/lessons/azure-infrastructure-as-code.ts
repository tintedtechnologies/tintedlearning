import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe Study Tracker\'s Azure resources in a template instead of clicking them into existence',
    'Preview a deployment with a what-if check before any change is made',
    'Detect drift, where the live resources no longer match the template, and decide what to do about it',
  ],
  bigIdea: 'Infrastructure as code describes cloud resources in files that can be reviewed, versioned, and deployed the same way every time. On Azure, Bicep is a readable language that compiles to Azure Resource Manager templates. A what-if preview shows what would change before anything changes, and drift checks show when someone changed a resource by hand.',
  whyItMatters: 'A student creates Study Tracker\'s database through the portal, then later rebuilds the environment for a test. The new database has a different firewall rule and no backup policy, and nobody remembers the difference. A template would have produced the same environment both times, and the what-if check would have shown the missing backup policy before the second deployment.',
  goalSections: [
    {
      heading: 'Describing resources in a template',
      paragraphs: [
        'A Bicep file declares each resource with its type, name, location, and settings. Study Tracker needs a resource group, a container app, a database, and a storage account. Each one appears once in the file, with the settings that matter, so the whole environment can be read in one place.',
        'Parameters let the same template serve a test and a production environment. The file says what varies, such as the environment name or the size of the database, and the values are supplied at deployment time. Keep secrets out of the file, and fetch them from a secure store.',
        'Store the template in version control like any other code. A change to infrastructure then has a history, a reviewer, and a reason, which is the same protection that code changes get. Name the files and the parameters so that a new team member can find the environment settings without asking.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          param env string = 'test'
          resource db 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
            name: format('study-tracker-db-{0}', env)
            location: resourceGroup().location
            ...
          }
        `,
      },
    },
    {
      heading: 'Previewing with what-if',
      paragraphs: [
        'The what-if operation compares the template with the resources that exist now, and reports what would be created, changed, or deleted. Nothing is changed by a what-if run, so it is safe to use before every deployment and to review in a pull request.',
        'Read the preview carefully. A deletion marked in the output is the most important line, because a deleted database cannot be recovered from the template alone. If the preview shows an unexpected change, fix the template before deploying.',
        'Deploy only the change you previewed. If the template changes between the preview and the deployment, the preview no longer describes what will happen, so run it again.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          az deployment group what-if --resource-group rg-study-tracker-test --template-file main.bicep --parameters env=test
          az deployment group create --resource-group rg-study-tracker-test --template-file main.bicep --parameters env=test
        `,
      },
    },
    {
      heading: 'Drift: when live resources differ from the template',
      paragraphs: [
        'Drift happens when someone changes a resource outside the template, such as opening a firewall port in the portal to debug a problem. The live environment and the template now disagree, and the next deployment may silently undo the fix or fail in a confusing way.',
        'Decide on each drift item. Either the manual change was right, and the template should be updated to include it, or it was temporary, and the resource should be brought back in line. Writing the decision down prevents the same argument at the next deployment.',
        'Limit who can change production by hand. Give people the access they need to read and debug, and route changes through the template, so the record matches reality.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          desired = {"study-tracker-app", "study-tracker-db", "study-tracker-storage"}
          live = {"study-tracker-app", "study-tracker-storage", "debug-firewall-rule"}

          print("to create:", sorted(desired - live))
          print("drift to decide on:", sorted(live - desired))
        `,
        output: "to create: ['study-tracker-db']\ndrift to decide on: ['debug-firewall-rule']",
      },
    },
  ],
  seeItInAction: {
    title: 'Comparing the template with the live environment',
    intro: 'The program above compares the names in the template with the resources that exist, and reports what would be created and what is drift. The real tool does this in detail, but the question is the same. Run it, then remove the old backup policy from the live set and predict the output.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        desired = {"study-tracker-app", "study-tracker-db", "study-tracker-storage"}
        live = {"study-tracker-app", "study-tracker-db", "study-tracker-storage", "old-backup-policy"}

        to_create = desired - live
        drift = live - desired
        print("create:", sorted(to_create) if to_create else "nothing")
        print("drift:", sorted(drift) if drift else "nothing")
      `,
      output: "create: nothing\ndrift: ['old-backup-policy']",
    },
    steps: [
      { code: 'to_create = desired - live', explanation: 'Resources in the template that are missing from the live environment.' },
      { code: 'drift = live - desired', explanation: 'Resources that exist live but are not in the template. Each one needs a decision.' },
      { code: 'print("create:", ...)', explanation: 'Reports a clean result as "nothing", so an empty list is never mistaken for a missing check.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a Bicep resource for a storage account for Study Tracker, with a name that includes an environment parameter. Do not include any secret.',
      'Change the live set in the seeItInAction example so that a resource is missing, and predict the create line. Run it to check.',
      'Write the decision you would make for one drift item: update the template, or remove the live resource, with the reason.',
    ],
  },
  mistakes: [
    { mistake: 'Deploying without a what-if preview.', fix: 'Run what-if first, read every deletion, and deploy only the previewed change.' },
    { mistake: 'Fixing production by hand and never updating the template.', fix: 'Record the manual change as drift and decide whether to keep it in the template.' },
    { mistake: 'Putting secrets in the template file.', fix: 'Reference secrets from a secure store, and keep them out of version control.' },
  ],
  quiz: [
    {
      question: 'What does a what-if run do?',
      options: [
        { text: 'It shows what would change, without changing anything', explanation: 'Yes. A what-if preview is safe to run before every deployment.' },
        { text: 'It deploys the template to production', explanation: 'Deployment is a separate command. What-if only previews.' },
        { text: 'It deletes drift automatically', explanation: 'Drift must be decided on by a person. What-if does not remove it.' },
        { text: 'It creates a backup of the database', explanation: 'What-if does not back anything up.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the drift line?',
      code: { language: 'python', runnable: true, code: code`
        desired = {"app", "db"}
        live = {"app", "db", "debug-rule"}
        print("drift:", sorted(live - desired))
      ` },
      options: [
        { text: "drift: ['debug-rule']", explanation: 'Yes. The debug rule exists live but is not in the template.' },
        { text: "drift: ['app', 'db']", explanation: 'Those names are in both sets, so they are not drift.' },
        { text: 'drift: []', explanation: 'The debug rule is in the live set but not in the template, so it is drift.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why should a deletion in a what-if preview be read carefully?',
      options: [
        { text: 'A deleted database may not be recoverable from the template alone', explanation: 'Yes. Deletions can destroy data, so they need a deliberate decision.' },
        { text: 'Deletions are always harmless', explanation: 'A deletion can remove data that the template does not hold.' },
        { text: 'Deletions are hidden from the preview', explanation: 'They are shown, which is why they must be read.' },
        { text: 'Deletions cost nothing to recreate', explanation: 'Recreating a resource does not restore its data.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Describe Study Tracker\'s Azure resources in a versioned Bicep template, preview every change with what-if, and decide on each drift item so the template and the live environment agree.',
  resources: [
    { title: 'Bicep overview', provider: 'Microsoft Learn', description: 'An introduction to Bicep, the readable language for Azure infrastructure templates.', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview' },
    { title: 'What-if operation for Bicep deployments', provider: 'Microsoft Learn', description: 'How to preview template changes before deploying them to Azure.', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/deploy-what-if' },
  ],
}

export default lesson
