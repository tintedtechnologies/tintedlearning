import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain why describing cloud resources in files beats clicking in a console',
    'Read a short Terraform file and say what it will create',
    'Use plan before apply, and explain what state and drift are',
  ],
  bigIdea: "Infrastructure as code means writing down the servers, networks and storage you want in text files, and letting a tool create them for you. The files live in Git next to your app, so every change is reviewed, recorded and repeatable. Rebuilding an entire environment becomes one command instead of a day of clicking.",
  whyItMatters: "A company's production setup was built by one engineer clicking through the cloud console over two years. That engineer leaves. Months later, the team needs an identical test environment, and nobody knows every setting that was chosen. With infrastructure as code, the answer would be sitting in the repository, and creating a copy would take minutes.",
  goalSections: [
    {
      heading: 'Why write infrastructure down',
      paragraphs: [
        "Clicking through a console is fine for learning, but it leaves no record. Nobody can review a click before it happens, repeat it exactly in another environment, or see who changed what last month.",
        "With infrastructure as code, often shortened to IaC, the files are the record. Changes go through pull requests, so a teammate can review them before anything changes in the cloud. Git history shows every change and who made it. The same files can build a test environment and a production environment that match.",
        "Most IaC tools are declarative: you describe the end result you want, not the steps to get there. The tool works out what to create, change or delete to make reality match your description. Terraform and its open-source fork OpenTofu are the most widely used tools across providers.",
      ],
      example: {
        language: 'text',
        code: code`
          Clicking in the console           Infrastructure as code
          -----------------------           ----------------------
          no record of settings             every setting in a file
          no review before changes          changes reviewed in pull requests
          hard to copy exactly              same files build test and production
          "who changed this?"               Git history answers it
        `,
      },
    },
    {
      heading: 'Reading a Terraform file',
      paragraphs: [
        "Terraform files end in `.tf` and are written in a language called HCL. Each `resource` block describes one thing to create. The first label is its type, set by the provider, and the second is a name you choose for referring to it in your files.",
        "Inside the block, you set the resource's settings. One resource can refer to another by type and name, such as `aws_s3_bucket.photos.id`. Terraform reads those references and creates things in the right order automatically.",
        "You do not need to memorize resource types. Each provider documents them, and the shape is always the same: a type, a name and settings.",
      ],
      example: {
        language: 'text',
        code: code`
          resource "aws_s3_bucket" "photos" {
            bucket = "recipe-site-photos"
          }

          resource "aws_s3_bucket_versioning" "photos" {
            bucket = aws_s3_bucket.photos.id
            versioning_configuration {
              status = "Enabled"
            }
          }
        `,
      },
    },
    {
      heading: 'Plan, apply, state and drift',
      paragraphs: [
        "Terraform works in two steps. `terraform plan` compares your files with what exists and prints exactly what it would create, change or destroy, without touching anything. `terraform apply` carries out that plan after you confirm.",
        "Always read the plan. A line saying a resource will be destroyed and recreated is the moment to stop and check, because for a database that can mean lost data.",
        "To know what exists, Terraform keeps a state file: its record of every resource it manages. Teams store state remotely, in a shared, locked location, so two people cannot apply changes at once. If someone changes a resource by hand in the console, reality no longer matches the files. That mismatch is called drift, and the next plan will show it.",
      ],
      example: {
        language: 'bash',
        code: code`
          terraform init      # download the provider plugins
          terraform plan      # preview: what would change?
          terraform apply     # make the changes after you confirm
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Reading a plan before applying a change',
    intro: "A teammate edited the files to rename the photo bucket and add a tag to a server. Before applying, you run `terraform plan`. Here is the output, shortened, and how to read it.",
    example: {
      language: 'text',
      code: code`
        # aws_instance.web will be updated in-place
        ~ tags = { "team" = "recipes" }

        # aws_s3_bucket.photos must be replaced
        -/+ bucket = "recipe-site-photos" -> "recipe-photos-prod" # forces replacement

        Plan: 1 to add, 1 to change, 1 to destroy.
      `,
    },
    steps: [
      { code: '# aws_instance.web will be updated in-place', explanation: "The `~` symbol means a change to an existing resource. Adding a tag is harmless, and the server keeps running." },
      { code: '# aws_s3_bucket.photos must be replaced', explanation: "The `-/+` symbol means destroy, then create a new one. Some settings, like a bucket's name, cannot be changed in place." },
      { code: '"recipe-site-photos" -> "recipe-photos-prod" # forces replacement', explanation: "Terraform tells you exactly which setting causes the replacement. The new bucket would start empty." },
      { code: 'Plan: 1 to add, 1 to change, 1 to destroy.', explanation: "The summary. Any destroy in production deserves a pause. Here, applying would delete the bucket holding every recipe photo." },
      { code: '(decision)', explanation: "Do not apply. Keep the old bucket name, or plan a careful migration that copies the photos first. Reading the plan turned a disaster into a comment on a pull request." },
    ],
  },
  mistakes: [
    { mistake: 'Running `apply` without reading the plan.', fix: 'Read every line, and stop at anything marked destroy or replace until you understand why.' },
    { mistake: 'Fixing things by hand in the console after using IaC.', fix: 'Make the change in the files and apply it, otherwise the next apply may undo your fix or fight with it.' },
    { mistake: 'Keeping the state file only on one laptop.', fix: 'Store state in a shared remote location with locking, and never commit it to Git, because it can contain secrets.' },
  ],
  quiz: [
    {
      question: 'What does `terraform plan` do?',
      options: [
        { text: 'Creates every resource in the files immediately', explanation: 'That is `apply`. Plan never changes anything.' },
        { text: 'Shows what would be created, changed or destroyed, without changing anything', explanation: 'It is a safe preview, so you can check the effects before applying.' },
        { text: 'Deletes resources not in the files', explanation: 'Plan may show deletions it would make, but it does not carry them out.' },
        { text: 'Downloads the provider plugins', explanation: 'That is `terraform init`.' },
      ],
      answer: 1,
    },
    {
      question: 'A plan shows `-/+` next to your production database. What should you do?',
      options: [
        { text: 'Apply, since Terraform knows best', explanation: 'Terraform does exactly what the files say, even if that destroys data.' },
        { text: 'Delete the state file and try again', explanation: 'Terraform would lose track of what exists and might try to create duplicates.' },
        { text: 'Change the database by hand in the console instead', explanation: 'That creates drift, and the next plan will try to undo it.' },
        { text: 'Stop and find which setting forces replacement, because replacing a database can lose its data', explanation: '`-/+` means destroy then create. For a database, find the cause and change approach before applying.' },
      ],
      answer: 3,
    },
    {
      question: 'Someone opened a firewall port by hand in the console. The Terraform files do not include that change. What is this called?',
      options: [
        { text: 'Drift', explanation: 'Reality has drifted from the files. The next plan will show the difference.' },
        { text: 'A rollback', explanation: 'A rollback returns to an earlier version on purpose. This is an unrecorded manual change.' },
        { text: 'State locking', explanation: 'Locking stops two people applying at once. It is unrelated to manual changes.' },
        { text: 'A canary release', explanation: 'That is a way of releasing app versions gradually, not a mismatch in infrastructure.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Describe infrastructure in reviewed files, read every plan before applying, keep state shared and safe, and make changes through code so reality never drifts from the record.',
  resources: [
    { title: 'What is infrastructure as code with Terraform?', provider: 'HashiCorp', description: 'The official introduction and getting-started tutorials.', url: 'https://developer.hashicorp.com/terraform/tutorials/aws-get-started/infrastructure-as-code' },
    { title: 'OpenTofu getting started', provider: 'OpenTofu', description: 'The open-source fork of Terraform, with the same file format.', url: 'https://opentofu.org/docs/intro/' },
  ],
  underTheHood: {
    heading: 'How Terraform decides what to do',
    paragraphs: [
      "When you run plan, Terraform gathers three pictures: your files, which describe what you want; the state file, which records what it created last time; and the real cloud, which it reads through the provider's API to see what exists right now.",
      "It compares them resource by resource. In the files but not in state means create. In both, with different settings, means update in place, unless the provider says that setting cannot change, which means replace. In state but removed from the files means destroy.",
      "Terraform also builds a dependency graph from the references between resources. A bucket's versioning setting refers to the bucket, so the bucket must exist first. Resources that do not depend on each other are created in parallel, which is why large environments can be built in minutes.",
    ],
  },
}

export default lesson
