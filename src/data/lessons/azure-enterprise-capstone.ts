import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { bicepParams, mainBicep } from './study-tracker'

const architectureDiagram = code`
  Internet
     | HTTPS
  ca-study-tracker (Container Apps, 0 to 2 replicas)      id-study-tracker (managed identity)
     |  snet-apps 10.0.0.0/23                               | AcrPull, Blob Data Reader,
     |                                                      | Key Vault Secrets User
     |-- port 5432 only --> psql-study (PostgreSQL, private, snet-db 10.0.2.0/24, 7-day backups)
     |-- HTTPS ----------> ststudy (Blob Storage, notes, keys disabled, soft delete)
     |-- HTTPS ----------> kv-study (Key Vault: database-url)
     |-- HTTPS ----------> acrstudy (Container Registry, image pull)
  Logs -> log-study-tracker (Log Analytics, 0.1 GB/day cap) | Alert: >5 server errors in 5 min -> email
  Every resource tagged project=study-tracker | Budget alert on the subscription
`

const lesson: StructuredLesson = {
  assumes: 'all 13 earlier Azure lessons, Docker Desktop, and the architecture lessons System Design and Architecture Decision Records. Set the track variables first.',
  goals: [
    'Describe Study Tracker\'s whole Azure architecture in one diagram and one decision record',
    'Deploy the whole architecture from one Bicep file, as many times as you like',
    'Prove the deployment meets its requirements, then remove everything cleanly',
  ],
  bigIdea: "Infrastructure as code, or IaC, describes every cloud resource in files kept with the app, so the whole system can be created, reviewed, changed and deleted by running them, as the Foundations lesson introduced. The capstone rebuilds the Study Tracker you assembled by hand over 13 lessons from a single Bicep file, Azure's language for describing resources. If you can delete everything and recreate it in minutes, you truly own the system.",
  whyItMatters: "Ask a team that built its cloud setup by hand to recreate it in a new region, and the answer is usually weeks of clicking, guessing at old settings and discovering things nobody wrote down. A system described in code can be rebuilt by anyone, reviewed in a pull request before it changes, and compared against what is actually running. That, together with the diagram and decision record, is what turns a working project into a portfolio piece an employer can trust.",
  goalSections: [
    {
      heading: 'The architecture on one page',
      paragraphs: [
        "Start the capstone by drawing what you built. A good architecture diagram shows each component, where it sits in the network, how traffic flows between them and how each connection is protected. Below is Study Tracker's, as a text diagram you can put in your README or redraw in a diagram tool.",
        "Then write at least one architecture decision record, as in Architecture Decision Records, for a choice this track made. Good candidates are Container Apps instead of AKS, PostgreSQL instead of SQLite, or a stored key versus keyless access for the AI model. Include the options you rejected and when to revisit the decision.",
        "Together, the diagram and the records let a reviewer understand in five minutes both what the system is and why it is that way.",
      ],
      example: { language: 'text', code: architectureDiagram },
    },
    {
      heading: 'Bicep in practice',
      paragraphs: [
        "A Bicep file lists resources, each with a type, an API version and its settings. When one resource refers to another, such as the container app using the registry's address, Bicep works out the order to create them. Parameters, such as your `SUFFIX`, make the file reusable, and `@secure()` marks the database password so it never appears in deployment logs.",
        "Deploying is repeatable. Running the same file again changes only what differs, and `az deployment group what-if` previews those changes before anything happens, like a pull request for your cloud.",
        "One problem needs a little care: the container app needs an image that does not exist until the registry does. So the file deploys in two passes. The first creates everything except the app, you push the image, and the second, with `DEPLOY_APP=true`, adds the app and its alert. The Azure Function and the AI model are left out to keep the file readable, and adding them is a good stretch goal.",
      ],
      example: {
        language: 'text',
        code: code`
          resource registry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
            name: 'acrstudy${'$'}{suffix}'
            location: location
            tags: tags
            sku: { name: 'Basic' }
            properties: { adminUserEnabled: false }
          }
        `,
      },
    },
    {
      heading: 'Proving it, then cleaning up',
      paragraphs: [
        "Finished means each requirement from this track has evidence you can show, not just a belief that it works. Turn the track's requirements into a checklist, and next to each one write the command or screen that proves it.",
        "Some proof takes action: a restore drill from Resilience and Disaster Recovery, an alert email triggered on purpose, a session that survives the app scaling to zero. Record the results, with dates and times, in your repository.",
        "Then clean up completely. Because everything lives in one resource group and is described in code, deleting is one command, and recreating later is one deployment. Key Vault keeps deleted vaults for its retention period, so purge it too if you want to reuse the name.",
      ],
      example: {
        language: 'text',
        code: code`
          Requirement              Evidence
          Built from code          main.bicep in the repository, two deployments succeed
          Database private         az postgres flexible-server show ... public: Disabled
          Secrets managed          container app secret shows a Key Vault reference
          Monitoring and alerts    alert email received after triggering 503s
          Backups tested           restore drill runbook with measured times
          Tagged                   no resources without project=study-tracker
          Within budget            Cost analysis below the budget, no budget alerts
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Deploying Study Tracker from Bicep',
    intro: "Run these as `studyadmin` from your `study-tracker` folder, with `main.bicep` and `main.bicepparam` from Try it yourself, after deleting the hand-built resource group as the guide's first step explains. In PowerShell, set environment variables with `$env:DB_PASSWORD = ...` and `$env:DEPLOY_APP = \"true\"`. Leave `DEPLOY_APP` unset for the first deployment.",
    example: {
      language: 'bash',
      code: code`
        export DB_PASSWORD=$(python -c "import secrets; print(secrets.token_urlsafe(24))")
        az bicep build --file main.bicep
        az group create --name $RG --location $LOCATION --tags project=study-tracker
        az deployment group what-if --resource-group $RG --parameters main.bicepparam
        az deployment group create --resource-group $RG --name study-tracker-base --parameters main.bicepparam

        az acr login --name acrstudy$SUFFIX
        docker build --platform linux/amd64 -t acrstudy$SUFFIX.azurecr.io/study-tracker:v3 .
        docker push acrstudy$SUFFIX.azurecr.io/study-tracker:v3

        export DEPLOY_APP=true
        az deployment group create --resource-group $RG --name study-tracker-app --parameters main.bicepparam --query properties.outputs.appUrl.value -o tsv
      `,
      output: 'https://ca-study-tracker.example-1a2b3c4d.eastus.azurecontainerapps.io',
    },
    steps: [
      { code: 'export DB_PASSWORD=$(python -c "import secrets; print(secrets.token_urlsafe(24))")', explanation: "`main.bicepparam` reads the password from this environment variable, so it never sits in a file. The template stores it only inside the Key Vault secret and the database." },
      { code: 'az bicep build --file main.bicep', explanation: "Compiles the file and reports mistakes before anything reaches Azure. It was checked with the Bicep compiler while writing this lesson." },
      { code: 'az deployment group what-if --resource-group $RG --parameters main.bicepparam', explanation: "Lists every resource that would be created, changed or deleted, without doing any of it. Read it before every real deployment." },
      { code: 'az deployment group create ... --name study-tracker-base', explanation: "The first pass: network, identity, storage, registry, Key Vault, PostgreSQL, logging and the action group. Creating PostgreSQL takes the longest, often several minutes." },
      { code: 'export DEPLOY_APP=true', explanation: "Tells the parameters file to include the container app and its alert on the next deployment." },
      { code: '--query properties.outputs.appUrl.value -o tsv', explanation: "The second pass adds only the app and the alert, then prints the app's address from the file's outputs. Everything else is already in place, so nothing else changes." },
    ],
  },
  tryIt: {
    instructions: [
      'Work through the guided build below, using `main.bicep` and `main.bicepparam` from this lesson.',
      'Fill in the evidence checklist with real command output and dates, and commit it with the diagram and your decision record.',
      'Finish with the clean-up step and confirm in the portal that the resource group is gone.',
    ],
    files: [
      { language: 'text', filename: 'main.bicep', code: mainBicep },
      { language: 'text', filename: 'main.bicepparam', code: bicepParams },
    ],
    project: {
      goal: 'Rebuild Study Tracker on Azure from one Bicep file, prove every requirement from the track with evidence, document it with a diagram and a decision record, then delete everything.',
      prerequisites: ['All 13 earlier Azure lessons.', 'The Azure CLI signed in as `studyadmin`, Docker Desktop, and the Study Tracker repository with the PostgreSQL-ready code from lesson 7.'],
      setup: ['Set the track variables `RG`, `LOCATION` and `SUFFIX`.', 'Save `main.bicep` and `main.bicepparam` in your repository, and set your suffix and email in the parameters file.'],
      files: [
        { path: 'main.bicep', purpose: 'Every Study Tracker resource, tagged, in one file.' },
        { path: 'main.bicepparam', purpose: 'Your suffix and email, plus the password and DEPLOY_APP read from environment variables.' },
        { path: 'docs/architecture.md', purpose: 'The architecture diagram and a short description of each component.' },
        { path: 'docs/adr/0001-*.md', purpose: 'At least one architecture decision record.' },
        { path: 'docs/evidence.md', purpose: 'The requirements checklist with command output and dates.' },
      ],
      dependencies: ['az bicep install', 'Docker Desktop'],
      steps: [
        { title: 'Retire the hand-built version', instructions: ['List what you built by hand with `az resource list --resource-group $RG -o table` and save the output in `docs/evidence.md`.', 'Delete the resource group, then purge the vault so its name can be reused. If you turned on purge protection in lesson 10, choose a new `SUFFIX` instead.'], commands: ['az group delete --name $RG --yes', 'az keyvault purge --name kv-study-$SUFFIX'], checkpoint: '`az group exists --name $RG` prints `false`.' },
        { title: 'Check the code', instructions: ['Compile the template and fix anything the compiler reports.', 'Read through each resource and match it to the lesson that introduced it.'], commands: ['az bicep build --file main.bicep'], checkpoint: 'The build finishes with no errors or warnings.' },
        { title: 'First deployment', instructions: ['Set `DB_PASSWORD`, create the resource group, preview with what-if and deploy, as in See it in action.', 'Leave `DEPLOY_APP` unset.'], commands: ['az deployment group what-if --resource-group $RG --parameters main.bicepparam', 'az deployment group create --resource-group $RG --name study-tracker-base --parameters main.bicepparam'], checkpoint: 'The deployment succeeds and the portal shows about 20 resources, all tagged.' },
        { title: 'Image and second deployment', instructions: ['Push the image to the new registry.', 'Set `DEPLOY_APP=true` and deploy again. Open the app\'s `/docs`.'], commands: ['az acr login --name acrstudy$SUFFIX', 'docker build --platform linux/amd64 -t acrstudy$SUFFIX.azurecr.io/study-tracker:v3 .', 'docker push acrstudy$SUFFIX.azurecr.io/study-tracker:v3'], checkpoint: 'The app answers at its address, and a saved session survives the app scaling to zero.' },
        { title: 'Collect the evidence', instructions: ['For each requirement in the checklist, run the proving command and paste its output with the date.', 'Trigger the error alert with repeated 503s, and repeat the restore drill from lesson 11.'], checkpoint: 'Every line of the checklist has real evidence.' },
        { title: 'Diagram and decision record', instructions: ['Add the architecture diagram to `docs/architecture.md`, adjusted to what you deployed.', 'Write at least one decision record in `docs/adr/`, with options, consequences and a revisit trigger.'], checkpoint: 'A reviewer could explain the system and one key decision after five minutes of reading.' },
        { title: 'Clean up', instructions: ['Delete the resource group and purge the vault.', 'Check Cost analysis over the next two days to confirm spending stops.'], commands: ['az group delete --name $RG --yes', 'az keyvault purge --name kv-study-$SUFFIX'], checkpoint: 'No Study Tracker resources remain, and the budget shows no new costs.' },
      ],
      verification: [
        'The whole system was created from `main.bicep`, in two deployments, with no manual resource creation.',
        'The database has no public access, and the app reads its URL from Key Vault.',
        'An alert email arrived after deliberately causing server errors.',
        'A restore drill was completed and timed.',
        'Every resource carried the `project=study-tracker` tag, and costs stayed within the budget.',
        'The diagram, decision record and evidence are committed, and everything in Azure has been deleted.',
      ],
      nextSteps: [
        'Add the weekly summary function and the Foundry model deployment to the Bicep file.',
        'Run the deployment from GitHub Actions on every merge, using a federated identity instead of a password.',
        'Build the same system on AWS or Google Cloud with that track, and compare.',
      ],
    },
  },
  mistakes: [
    { mistake: 'Changing resources in the portal after deploying from code.', fix: 'Change the Bicep file and redeploy. Manual changes drift from the code and are lost or overwritten on the next deployment.' },
    { mistake: 'Putting the database password in the parameters file.', fix: 'Read it from an environment variable or a vault, and mark the parameter `@secure()`.' },
    { mistake: 'Deploying without previewing.', fix: 'Run what-if first and read it. It catches deletions and replacements before they happen.' },
    { mistake: 'Calling it finished without evidence.', fix: 'Prove each requirement with output you can show, and commit it next to the code.' },
  ],
  quiz: [
    {
      question: 'Someone raised the container app\'s maximum replicas in the portal. You redeploy `main.bicep`, which says `maxReplicas: 2`. What happens?',
      options: [
        { text: 'The portal change wins, because it is newer', explanation: 'A deployment sets what the file says, whenever the change was made.' },
        { text: 'The deployment fails because of the conflict', explanation: 'Azure simply applies the file\'s settings.' },
        { text: 'The setting goes back to 2, because the file describes the desired state', explanation: 'Manual changes drift from the code and are overwritten on the next deployment, which is why changes belong in the file.' },
        { text: 'Azure asks which value to keep', explanation: 'Deployments do not ask. what-if would have shown the change in advance.' },
      ],
      answer: 2,
    },
    {
      question: 'Why is Study Tracker deployed in two passes?',
      options: [
        { text: 'The container app needs an image in the registry, and the registry is created by the first pass', explanation: 'The first pass creates the registry, you push the image, and the second pass creates the app that uses it.' },
        { text: 'Bicep can only create ten resources at a time', explanation: 'There is no such limit for a deployment like this.' },
        { text: 'PostgreSQL must be deployed alone', explanation: 'PostgreSQL deploys with everything else in the first pass.' },
        { text: 'Each pass uses a different region', explanation: 'Both passes use the same region and resource group.' },
      ],
      answer: 0,
    },
    {
      question: 'Which command shows what a deployment would change, without changing anything?',
      options: [
        { text: '`az deployment group create`', explanation: 'That performs the deployment.' },
        { text: '`az bicep build`', explanation: 'That only compiles the file, without comparing it to Azure.' },
        { text: '`az group show`', explanation: 'That shows the resource group itself, not planned changes.' },
        { text: '`az deployment group what-if`', explanation: 'It compares the file with what exists and lists creations, changes and deletions.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Describe the whole system in code, deploy it repeatably with a preview first, prove every requirement with evidence and document the design and its decisions, so that you can delete everything and rebuild it with confidence.',
  resources: [
    { title: 'What is Bicep?', provider: 'Microsoft Learn', description: 'The language, its benefits and how it compiles to Azure Resource Manager templates.', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview' },
    { title: 'Bicep deployment what-if', provider: 'Microsoft Learn', description: 'Previewing changes before deploying.', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-what-if' },
    { title: 'Bicep parameters files', provider: 'Microsoft Learn', description: 'Writing .bicepparam files and reading environment variables.', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/parameter-files' },
    { title: 'Azure Architecture Center', provider: 'Microsoft Learn', description: 'Reference architectures and diagrams to compare with your own.', url: 'https://learn.microsoft.com/en-us/azure/architecture/' },
  ],
  underTheHood: {
    heading: 'How a Bicep deployment works',
    paragraphs: [
      "Azure never runs Bicep directly. `az` compiles the file into an Azure Resource Manager template, a JSON document, and sends it to Resource Manager, the same front door that checks Azure Policy. Resource Manager builds a graph of the resources and their references, then creates everything in parallel where it can, waiting only where one resource needs another.",
      "Each resource is sent as a desired state, like Kubernetes in lesson 8. If the resource exists and already matches, nothing happens. If a setting differs, only that setting is updated. That is why running the same deployment twice is safe, and why what-if can predict the outcome by comparing the file with what exists.",
      "By default, deployments to a resource group add and update resources but do not delete ones that are no longer in the file. Removing a resource from the code does not remove it from Azure, which is one more reason the capstone ends by deleting the whole group, and why larger teams use features such as deployment stacks to keep the two in sync.",
    ],
  },
}

export default lesson
