import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Find the first failing operation in an Azure deployment, rather than the last error shown',
    'Match common Azure error codes to their likely causes, such as permissions, quota, and naming',
    'Fix one cause, preview the change, and redeploy with a record of what was tried',
  ],
  bigIdea: 'A failed Azure deployment often shows a long list of errors, and the last one is usually a symptom. The useful signal is the first operation that failed, because the later ones were blocked by it. Reading the deployment operations in order, matching the error code to a cause, and changing one thing at a time turns a confusing failure into a short fix.',
  whyItMatters: 'A deployment of Study Tracker fails with "ResourceNotFound" on the container app, and the team spends an afternoon rebuilding the image. The first failed operation was actually the database, which could not be created because its name was already taken in the region. Reading in order would have found the name clash in five minutes, and the image was never the problem.',
  goalSections: [
    {
      heading: 'Read the operations in order',
      paragraphs: [
        'List the operations of the failed deployment with the Azure CLI, and look at their status and order. The first operation with a failed status is the root cause to investigate. Operations after it were skipped or blocked, so their errors are usually effects, not causes.',
        'The deployment error is often a summary. Open the failed operation to read its status message and its error code. Codes such as AuthorizationFailed, QuotaExceeded, and a name conflict each point to a different kind of fix.',
        'Use the activity log for the same resource group when the operation details are not enough. It shows who made each change and when, which helps when a deployment worked yesterday and fails today.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          az deployment operation group list --resource-group rg-study-tracker-test --name main --query "[].{op:operationId, state:properties.provisioningState, resource:properties.targetResource.resourceType}" -o table
          az monitor activity-log list --resource-group rg-study-tracker-test --offset 1h -o table
        `,
      },
    },
    {
      heading: 'Common causes and their fixes',
      paragraphs: [
        'AuthorizationFailed means the account running the deployment lacks a role on the scope. The fix is to grant the least role needed on that resource group, not to grant the owner role to make the error go away.',
        'QuotaExceeded means the subscription has reached a limit in that region. Choose another region if the design allows it, or request a quota increase with the reason written down.',
        'A name conflict means a resource name is already taken, often globally for storage accounts and some databases. Change the name in the template parameters, and keep the naming rule in the template so the next environment avoids the same clash.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          AuthorizationFailed: grant the least role on the resource group to the account that runs the deployment.
          QuotaExceeded: choose another region if the design allows it, or request an increase with the reason written down.
          Name conflict: a storage account or database name is taken. Change the name parameter, and keep the naming rule in the template.
        `,
      },
    },
    {
      heading: 'Fix one thing and redeploy',
      paragraphs: [
        'Change one thing at a time. If you change the role, the region, and the name together, you will not know which change fixed the problem, and the next person will inherit a deployment they cannot explain.',
        'Preview the fix with what-if before redeploying, as covered in the infrastructure as code lesson. Then redeploy and read the operations again, so you confirm the first failure is gone and not just moved.',
        'Write down what failed, what the cause was, and the change that fixed it. A short note in the repository saves the next person from repeating the search. Include the time of the failure, so the note can be matched to the activity log. If the error persists after a clean retry, ask the platform team for the correlation identifier. Record how long the cause took to find, so the team can see where searches are slow.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          operations = [
              ("resource group", "Succeeded"),
              ("database", "Failed"),
              ("container app", "Skipped"),
              ("storage", "Skipped"),
          ]
          first_failure = next((name for name, state in operations if state == "Failed"), None)
          print("investigate first:", first_failure)
        `,
        output: 'investigate first: database',
      },
    },
  ],
  seeItInAction: {
    title: 'Finding the first failed operation',
    intro: 'The program above reads the operations of a deployment in order and reports the first one that failed. The container app failed only because the database was blocked. Run it, then change the database to Succeeded and predict which operation is investigated next.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        operations = [
            ("resource group", "Succeeded"),
            ("database", "Failed"),
            ("container app", "Skipped"),
        ]
        blocked = [name for name, state in operations if state == "Skipped"]
        first_failure = next((name for name, state in operations if state == "Failed"), None)
        print("investigate first:", first_failure)
        print("blocked by it:", blocked)
      `,
      output: "investigate first: database\nblocked by it: ['container app']",
    },
    steps: [
      { code: 'first_failure = next((name for name, state in operations if state == "Failed"), None)', explanation: 'Finds the first failure in deployment order, which is the root cause to investigate.' },
      { code: 'blocked = [name for name, state in operations if state == "Skipped"]', explanation: 'Lists what was never tried, so the team knows those errors are effects, not causes.' },
      { code: 'print("investigate first:", first_failure)', explanation: 'Points the team to one place to start, instead of the whole error list.' },
    ],
  },
  tryIt: {
    instructions: [
      'Run the operation list command against a test deployment, or write down the commands you would run, and identify the first failed operation.',
      'Change the database state in the seItInAction example to Succeeded and predict which operation is investigated. Run it to check.',
      'Write the note you would leave in the repository after fixing a name conflict, with the cause, the change, and the check you ran.',
    ],
  },
  mistakes: [
    { mistake: 'Investigating the last error in the list.', fix: 'Find the first failed operation in order, and treat later errors as possible effects.' },
    { mistake: 'Granting the owner role to fix an authorization error.', fix: 'Grant the least role needed on the specific scope.' },
    { mistake: 'Changing several things at once and redeploying.', fix: 'Change one thing, preview it, redeploy, and confirm the first failure is gone.' },
  ],
  quiz: [
    {
      question: 'Which operation should you investigate first in a failed deployment?',
      options: [
        { text: 'The last error shown on the screen', explanation: 'The last error is often a symptom of an earlier failure.' },
        { text: 'The first operation that failed, in deployment order', explanation: 'Yes. Later operations may have been blocked by it.' },
        { text: 'The operation that took the longest', explanation: 'Duration does not show the cause of a failure.' },
        { text: 'The image build, by default', explanation: 'The build is not always the failure. Read the operations first.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        ops = [("network", "Succeeded"), ("database", "Failed"), ("app", "Skipped")]
        print(next((n for n, s in ops if s == "Failed"), None))
      ` },
      options: [
        { text: 'network', explanation: 'The network succeeded, so it is not the first failure.' },
        { text: 'database', explanation: 'Yes. It is the first operation with a failed state.' },
        { text: 'app', explanation: 'The app was skipped, not failed.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why grant only the least role needed to fix an AuthorizationFailed error?',
      options: [
        { text: 'Broad roles give more access than the deployment needs, which increases the risk', explanation: 'Yes. Least privilege limits the damage if the account is misused.' },
        { text: 'Broad roles are not supported by Azure', explanation: 'Azure supports broad roles. The problem is the extra access they give.' },
        { text: 'Least role makes deployments faster', explanation: 'Role size does not change deployment speed.' },
        { text: 'The owner role cannot deploy resources', explanation: 'Owners can deploy. The concern is the extra access.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Read an Azure deployment in order to find the first failed operation, match its error code to a cause, fix one thing with least privilege, preview it, and record what was learned.',
  resources: [
    { title: 'Troubleshoot common Azure deployment errors', provider: 'Microsoft Learn', description: 'Common Azure Resource Manager deployment errors and how to resolve them.', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/common-deployment-errors' },
    { title: 'Azure activity log', provider: 'Microsoft Learn', description: 'How to find who changed what in a subscription and when.', url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/activity-log' },
  ],
}

export default lesson
