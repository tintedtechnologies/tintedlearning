import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { gitignoreTerraform, terraformMainGcp, terraformVarsGcp } from './study-tracker'

const architectureDiagram = code`
  Internet
     | HTTPS
  study-tracker (Cloud Run, 0 to 2 instances, service account study-tracker)
     |  Direct VPC egress, private ranges only -> snet-apps 10.0.0.0/24
     |-- port 5432 --> study-tracker-db (Cloud SQL PostgreSQL, private address only,
     |                 ENCRYPTED_ONLY, 7 days of point-in-time recovery)
     |-- HTTPS ------> study-notes-<suffix> (Cloud Storage, public access prevented, soft delete)
     |-- at start ---> Secret Manager: database-url (Secret Accessor for study-tracker only)
     |-- image ------> Artifact Registry: study-tracker
  Logs -> Cloud Logging | Alert: >5 server errors in 5 min -> email
  Every resource labeled project=study-tracker | Budget alert on the project
`

const lesson: StructuredLesson = {
  assumes: 'all 13 earlier Google Cloud lessons, Docker Desktop, and the architecture lessons System Design and Architecture Decision Records. Set the track variables and `BILLING`, your billing account ID.',
  goals: [
    'Describe Study Tracker\'s whole Google Cloud architecture in one diagram and one decision record',
    'Deploy the whole architecture from one Terraform configuration, into a fresh project',
    'Prove the deployment meets its requirements, then remove everything cleanly',
  ],
  bigIdea: "Infrastructure as code, or IaC, describes every cloud resource in files kept with the app, so the whole system can be created, reviewed, changed and deleted by running them, as the Foundations lesson introduced. The capstone rebuilds the Study Tracker you assembled by hand over 13 lessons from one Terraform configuration, the infrastructure-as-code tool Google documents for Google Cloud, in a brand-new project. If you can delete everything and recreate it in minutes, you truly own the system.",
  whyItMatters: "Ask a team that built its Google Cloud setup by hand to recreate it in a second project for production, and the answer is usually weeks of console screenshots, guessed settings and surprises nobody wrote down. A system described in Terraform can be rebuilt by anyone, reviewed in a pull request before it changes, and compared against what is actually running. That, with the diagram and decision record, turns a working project into a portfolio piece an employer can trust.",
  goalSections: [
    {
      heading: 'The architecture on one page',
      paragraphs: [
        "Start by drawing what you built. A good architecture diagram shows each component, where it sits in the network, how traffic flows and how each connection is protected. Below is Study Tracker's, as a text diagram you can put in your README or redraw in a diagram tool.",
        "Then write at least one architecture decision record, as in Architecture Decision Records, for a choice this track made. Good candidates are Cloud Run instead of GKE, Cloud SQL instead of SQLite, or service account tokens instead of an API key for the AI model. Include the options you rejected and when to revisit the decision.",
        "Together, the diagram and the records let a reviewer understand in five minutes both what the system is and why it is that way.",
      ],
      example: { language: 'text', code: architectureDiagram },
    },
    {
      heading: 'Terraform in practice',
      paragraphs: [
        "Terraform reads `.tf` files that list resources, each with a type, such as `google_storage_bucket`, and arguments. When one resource refers to another, such as the subnet naming the network, Terraform works out the order. It records what it created in a state file, `terraform.tfstate`, and compares that with your files on every run.",
        "`terraform plan` shows every resource it would create, change or destroy, without doing any of it. `terraform apply` carries out a saved plan. The provider's `default_labels` setting labels every resource that supports labels, so nothing is forgotten.",
        "The database password comes from Terraform's `random_password`, so it is never typed. It is, however, stored in the state file, which therefore must never be committed: the `.gitignore` lines below keep it out. Teams keep state in a private, versioned Cloud Storage bucket instead. The app needs an image before it can run, so the configuration deploys in two passes, the second with `deploy_app=true`.",
      ],
      example: {
        language: 'text',
        code: code`
          resource "google_artifact_registry_repository" "images" {
            repository_id = "study-tracker"
            location      = var.region
            format        = "DOCKER"
          }
        `,
      },
    },
    {
      heading: 'Proving it, then cleaning up',
      paragraphs: [
        "Finished means each requirement from this track has evidence you can show, not just a belief that it works. Turn the requirements into a checklist, and next to each one write the command or screen that proves it.",
        "Some proof takes action: a restore drill from Resilience and Disaster Recovery, an alert email triggered on purpose, a note brought back from soft delete. Record the results, with dates and times, in your repository.",
        "Then clean up completely. `terraform destroy` removes everything the configuration created. Deleting the project afterward removes anything left over, and Google stops billing for its resources when you do.",
      ],
      example: {
        language: 'text',
        code: code`
          Requirement              Evidence
          Built from code          main.tf in the repository, two applies succeed
          Database private         ipv4Enabled False, ENCRYPTED_ONLY
          Secrets managed          the service's DATABASE_URL comes from Secret Manager
          Monitoring and alerts    alert email received after triggering 503s
          Backups tested           restore drill runbook with measured times
          Labeled                  check_labels.py exits with status 0
          Within budget            Billing reports below the budget, no budget alerts
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Deploying Study Tracker from Terraform',
    intro: "Use a new suffix, such as your old one plus `c`, because bucket names and project IDs stay reserved for a while after deletion. Save `main.tf` and `terraform.tfvars` from Try it yourself in your `study-tracker` folder, with your own values, and add the `.gitignore` lines. Install Terraform from HashiCorp's install page. In PowerShell, set variables as `$NAME = ...`.",
    example: {
      language: 'bash',
      code: code`
        SUFFIX=jd4821c
        PROJECT_ID=study-tracker-$SUFFIX
        gcloud projects create $PROJECT_ID --name "Study Tracker" --labels project=study-tracker
        gcloud billing projects link $PROJECT_ID --billing-account $BILLING
        gcloud config set project $PROJECT_ID
        gcloud auth application-default set-quota-project $PROJECT_ID
        gcloud billing budgets create --billing-account $BILLING --display-name study-tracker-capstone --budget-amount 10USD --filter-projects projects/$PROJECT_ID --threshold-rule percent=0.5 --threshold-rule percent=1.0 --threshold-rule percent=1.0,basis=forecasted-spend

        terraform init
        terraform validate
        terraform plan -out base.tfplan
        terraform apply base.tfplan

        gcloud auth configure-docker $REGION-docker.pkg.dev
        docker build --platform linux/amd64 -t $(terraform output -raw repository)/study-tracker:v4 .
        docker push $(terraform output -raw repository)/study-tracker:v4
        terraform apply -var deploy_app=true
        terraform output -raw app_url
      `,
      output: 'https://study-tracker-123456789012.us-central1.run.app',
    },
    steps: [
      { code: 'gcloud billing projects link $PROJECT_ID --billing-account $BILLING', explanation: "Links the fresh, empty project to billing, and the next commands give it its own budget. Building into an empty project is the real test that the code describes everything." },
      { code: 'terraform init', explanation: "Downloads the Google and random providers named in `main.tf` into a `.terraform` folder." },
      { code: 'terraform validate', explanation: "Checks the files for mistakes before anything reaches Google Cloud. The configuration was checked against the provider's documentation while this lesson was written." },
      { code: 'terraform plan -out base.tfplan', explanation: "Lists every resource that would be created, without creating any. Read it, then apply exactly that plan." },
      { code: 'terraform apply base.tfplan', explanation: "The first pass: APIs, network, private services access, service account, bucket, repository, database, secret and alert channel. The database takes the longest, often ten minutes." },
      { code: 'terraform apply -var deploy_app=true', explanation: "The second pass adds the Cloud Run service, public access and the alert policy. Terraform shows the plan and asks you to type `yes`." },
      { code: 'terraform output -raw app_url', explanation: "Prints the app's address from the configuration's outputs. Open it followed by `/docs`." },
    ],
  },
  tryIt: {
    instructions: [
      'Work through the guided build below, using `main.tf` and `terraform.tfvars` from this lesson.',
      'Fill in the evidence checklist with real command output and dates, and commit it with the diagram and your decision record, but never the state file.',
      'Finish with the clean-up step and confirm in the console that both projects are scheduled for deletion.',
    ],
    files: [
      { language: 'text', filename: 'main.tf', code: terraformMainGcp },
      { language: 'text', filename: 'terraform.tfvars', code: terraformVarsGcp },
      { language: 'text', filename: '.gitignore (add these lines)', code: gitignoreTerraform },
    ],
    project: {
      goal: 'Rebuild Study Tracker on Google Cloud from one Terraform configuration in a fresh project, prove every requirement from the track with evidence, document it with a diagram and a decision record, then delete everything.',
      prerequisites: ['All 13 earlier Google Cloud lessons.', 'The Google Cloud CLI signed in, with application-default credentials, Docker Desktop, Terraform, and the Study Tracker repository with the code from lesson 13.'],
      setup: ['Choose a new `SUFFIX` and project ID, and find your `BILLING` account ID with `gcloud billing accounts list`.', 'Save `main.tf` and `terraform.tfvars` in your repository with your values, and add the `.gitignore` lines.'],
      files: [
        { path: 'main.tf', purpose: 'Every Study Tracker resource, labeled, in one configuration.' },
        { path: 'terraform.tfvars', purpose: 'Your project ID, suffix and alert email.' },
        { path: 'docs/architecture.md', purpose: 'The architecture diagram and a short description of each component.' },
        { path: 'docs/adr/0001-*.md', purpose: 'At least one architecture decision record.' },
        { path: 'docs/evidence.md', purpose: 'The requirements checklist with command output and dates.' },
      ],
      dependencies: ['Terraform, from HashiCorp\'s install page', 'Google Cloud CLI', 'Docker Desktop'],
      steps: [
        { title: 'Retire the hand-built version', instructions: ['Save the list of what you built by hand, with `gcloud asset search-all-resources --scope projects/study-tracker-jd4821 --format "table(assetType, displayName)"`, in `docs/evidence.md`. Keep your local `notes` folder.', 'Delete the hand-built project. Its resources stop being billed, and it can be restored for 30 days if you change your mind.'], commands: ['gcloud projects delete study-tracker-jd4821 --quiet'], checkpoint: '`gcloud projects describe study-tracker-jd4821 --format "value(lifecycleState)"` prints `DELETE_REQUESTED`.' },
        { title: 'Create the new project', instructions: ['Create the project, link billing, set it as the default and create its budget, as in See it in action.'], commands: ['gcloud projects create $PROJECT_ID --name "Study Tracker" --labels project=study-tracker', 'gcloud billing projects link $PROJECT_ID --billing-account $BILLING'], checkpoint: '`gcloud billing budgets list --billing-account $BILLING` shows `study-tracker-capstone`.' },
        { title: 'First apply', instructions: ['Initialize, validate, plan and apply.', 'Confirm the alert email channel if Google asks you to verify it.'], commands: ['terraform init', 'terraform validate', 'terraform plan -out base.tfplan', 'terraform apply base.tfplan'], checkpoint: '`terraform state list` shows the network, bucket, repository, database and secret.' },
        { title: 'Image, notes and second apply', instructions: ['Push the image to the new repository and apply again with `deploy_app=true`.', 'Upload your notes to the new bucket and open the app\'s `/docs`. Save a session.'], commands: ['docker push $(terraform output -raw repository)/study-tracker:v4', 'terraform apply -var deploy_app=true', 'gcloud storage rsync notes gs://$(terraform output -raw notes_bucket)'], checkpoint: 'The app answers at its address, and a saved session is still there after the service scales to zero.' },
        { title: 'Collect the evidence', instructions: ['For each requirement in the checklist, run the proving command and paste its output with the date.', 'Trigger the error alert with repeated 503s, repeat the restore drill from lesson 11 against the new database, and run `check_labels.py` from lesson 12.'], checkpoint: 'Every line of the checklist has real evidence.' },
        { title: 'Diagram and decision record', instructions: ['Add the architecture diagram to `docs/architecture.md`, adjusted to what you deployed.', 'Write at least one decision record in `docs/adr/`, with options, consequences and a revisit trigger.'], checkpoint: 'A reviewer could explain the system and one key decision after five minutes of reading.' },
        { title: 'Clean up', instructions: ['Destroy everything Terraform created, then delete the project.', 'Check Billing reports over the next two days to confirm spending stops. Delete the capstone budget once it does.'], commands: ['terraform destroy -var deploy_app=true', 'gcloud projects delete $PROJECT_ID --quiet'], checkpoint: '`gcloud projects list --filter "labels.project=study-tracker"` shows no active projects, and Billing reports show no new costs.' },
      ],
      verification: [
        'The whole system was created from `main.tf`, in two applies, in a fresh project, with no manual resource creation inside it.',
        'The database has only a private address and refuses unencrypted connections, and the app reads its URL from Secret Manager.',
        'An alert email arrived after deliberately causing server errors.',
        'A restore drill was completed and timed.',
        'Every resource carried the `project=study-tracker` label, and costs stayed within the budget.',
        'The diagram, decision record and evidence are committed without the state file, and both projects have been deleted.',
      ],
      nextSteps: [
        'Add the weekly summary function, its scheduler job and the Agent Platform settings to `main.tf`.',
        'Store Terraform state in a private, versioned Cloud Storage bucket, and run plans from GitHub Actions using Workload Identity Federation instead of keys.',
        'Build the same system on Azure or AWS with that track, and compare.',
      ],
    },
  },
  mistakes: [
    { mistake: 'Committing `terraform.tfstate`.', fix: 'It contains the database password. Keep it out of Git, and use a private remote backend for teams.' },
    { mistake: 'Changing resources in the console after applying.', fix: 'Change `main.tf` and apply. `terraform plan` shows console changes as drift and would undo them.' },
    { mistake: 'Applying without reading the plan.', fix: 'Save a plan with `-out`, read it, and apply exactly that file. Look for anything marked to destroy or replace.' },
    { mistake: 'Calling it finished without evidence.', fix: 'Prove each requirement with output you can show, and commit it next to the code.' },
  ],
  quiz: [
    {
      question: 'Someone raised the service\'s maximum instances in the console. You run `terraform plan`, and `main.tf` still says `max_instance_count = 2`. What does the plan show?',
      options: [
        { text: 'Nothing, because Terraform only tracks resources it created', explanation: 'It created this one, and it compares the real settings with the file on every plan.' },
        { text: 'A change back to 2, because the file describes the desired state', explanation: 'Console changes show up as drift. Changes belong in the file.' },
        { text: 'An error that stops Terraform', explanation: 'Drift is normal. Terraform plans to correct it.' },
        { text: 'The console\'s value copied into `main.tf`', explanation: 'Terraform never edits your files.' },
      ],
      answer: 1,
    },
    {
      question: 'Why must `terraform.tfstate` never be committed to Git?',
      options: [
        { text: 'It is too large for Git', explanation: 'Size is not the problem.' },
        { text: 'Git cannot store JSON files', explanation: 'Git stores any file.' },
        { text: 'It changes on every apply', explanation: 'Files that change are normal in Git. The danger is what it contains.' },
        { text: 'It contains values such as the generated database password in plain text', explanation: 'Anyone with the repository would have the password. Keep state private.' },
      ],
      answer: 3,
    },
    {
      question: 'Why is Study Tracker deployed in two applies?',
      options: [
        { text: 'The Cloud Run service needs an image in the repository, and the repository is created by the first apply', explanation: 'The first apply creates the repository, you push the image, and the second creates the service that uses it.' },
        { text: 'Terraform can only create ten resources at a time', explanation: 'There is no such limit for a configuration like this.' },
        { text: 'The database must be created in a separate project', explanation: 'Everything lives in the one new project.' },
        { text: 'Each apply uses a different region', explanation: 'Both use the same region and project.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Describe the whole system in Terraform, build it into a fresh project from a reviewed plan, keep the state file private, prove every requirement with evidence and document the design and its decisions, so that you can delete everything and rebuild it with confidence.',
  resources: [
    { title: 'Terraform on Google Cloud', provider: 'Google Cloud Documentation', description: 'Getting started, best practices and the Google provider.', url: 'https://docs.cloud.google.com/docs/terraform' },
    { title: 'Google provider for Terraform', provider: 'HashiCorp', description: 'Every resource and argument used in `main.tf`.', url: 'https://registry.terraform.io/providers/hashicorp/google/latest/docs' },
    { title: 'Install Terraform', provider: 'HashiCorp', description: 'Installers for macOS, Windows and Linux.', url: 'https://developer.hashicorp.com/terraform/install' },
    { title: 'Store Terraform state in Cloud Storage', provider: 'Google Cloud Documentation', description: 'A private, versioned remote backend for teams.', url: 'https://docs.cloud.google.com/docs/terraform/resource-management/store-state' },
  ],
  underTheHood: {
    heading: 'How Terraform decides what to do',
    paragraphs: [
      "Terraform keeps three pictures of your system: the configuration in your `.tf` files, the state file recording what it created last time, and the real resources in Google Cloud. A plan starts by refreshing the state, asking Google for each resource's current settings.",
      "It then compares each resource in the configuration, by its address such as `google_sql_database_instance.db`, with its refreshed state. A new address means create, a missing one means destroy, and a changed argument means update. Some arguments cannot change in place, such as a database instance's name, so Terraform plans to replace the resource, destroying and recreating it, and marks that clearly in the plan.",
      "References between resources form a dependency graph. Terraform creates independent resources in parallel and waits for dependencies, so the database waits for private services access, which waits for the network. Destroying walks the same graph in reverse. That is how one configuration safely creates and removes twenty connected resources.",
    ],
  },
}

export default lesson
