import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe Study Tracker\'s Google Cloud resources in Terraform configuration with variables and outputs',
    'Preview a change with terraform plan, and apply exactly the plan you reviewed',
    'Keep Terraform state safely, so that the record of what exists is shared and locked',
  ],
  bigIdea: 'Terraform describes infrastructure in configuration files, compares that description with its state file, and proposes the changes needed to match. The plan is the preview, and applying a saved plan runs exactly the change you reviewed. Remote, locked state makes this safe for a team, because two people cannot change the same environment at once.',
  whyItMatters: 'Two engineers deploy Study Tracker\'s test environment from their own laptops on the same afternoon. Each has a slightly different state, and one deletion removes a storage bucket the other is using. Remote state with locking would have made the second deployment wait, and a saved plan would have shown the deletion before anyone approved it.',
  goalSections: [
    {
      heading: 'Describing resources and variables',
      paragraphs: [
        'A Terraform configuration declares resources with their types, names, and settings. Study Tracker needs a Cloud Run service, a Cloud SQL database, and a Cloud Storage bucket. Each one appears once, so the whole environment can be read in one place.',
        'Variables let one configuration serve test and production. Declare each variable with a type and a description, and supply the values per environment. Keep secrets out of the files, and reference them from Secret Manager.',
        'Outputs report values that other tools need, such as the service URL. Keep the configuration in version control, so every change has a history and a reviewer.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          variable "environment" {
            type        = string
            description = "test or production"
          }
          resource "google_storage_bucket" "study_tracker_exports" {
            name     = format("study-tracker-exports-%s", var.environment)
            location = "EU"
          }
        `,
      },
    },
    {
      heading: 'Plan, then apply the saved plan',
      paragraphs: [
        'terraform plan compares the configuration with the state and prints what would be added, changed, or destroyed. Read the destroy lines first. A destroyed database or bucket may hold data that the configuration does not describe.',
        'Save the plan to a file and apply that file. A saved plan runs exactly the reviewed change, even if the configuration changes afterward. Applying again without a saved plan asks Terraform to plan again, which may produce a different result from the one you reviewed.',
        'Keep the plan with the review. A reviewer can read the same output that the person deploying will run, and the record shows what was approved.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          terraform plan -out=tfplan
          terraform show tfplan
          terraform apply tfplan
        `,
      },
    },
    {
      heading: 'State that the whole team can trust',
      paragraphs: [
        'The state file is Terraform\'s record of what it created. If the state is on one laptop, nobody else can see it, and a lost laptop can lose the record. Store the state in a shared remote backend, such as a Cloud Storage bucket, with versioning turned on.',
        'Enable state locking, so that only one apply can run against the same state at a time. Without a lock, two deployments can each read the old state and write conflicting results.',
        'Protect the state, because it can contain sensitive values. Restrict who can read the bucket, and never commit a local state file to version control. Review access to the state bucket every quarter, as people join and leave the team. Treat the state bucket like production: its access list belongs in code review, and each change to it should have a reviewer. Test the lock by starting two applies in a test project, and confirm the second one waits. Give the state bucket a clear name that includes the environment.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          state_location = "local laptop"
          lock_in_use = False

          if state_location == "local laptop" or not lock_in_use:
              print("risk: two people can change the same environment at once")
          else:
              print("safe: shared state with locking")
        `,
        output: 'risk: two people can change the same environment at once',
      },
    },
  ],
  seeItInAction: {
    title: 'Blocking an apply that would destroy data',
    intro: 'The program above checks a planned change and stops an apply when it would destroy a storage bucket without a reviewer\'s approval. It is a small rule, but teams use the same idea in their pipelines. Run it, then change the planned action to "update" and predict the result.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        planned_changes = [
            ("study-tracker-app", "update"),
            ("study-tracker-exports", "destroy"),
        ]
        approved = False

        for name, action in planned_changes:
            if action == "destroy" and not approved:
                print("blocked:", action, name, "needs approval")
            else:
                print("ok:", action, name)
      `,
      output: 'ok: update study-tracker-app\nblocked: destroy study-tracker-exports needs approval',
    },
    steps: [
      { code: 'planned_changes = [...]', explanation: 'The changes from the saved plan, in the order Terraform reported them.' },
      { code: 'if action == "destroy" and not approved:', explanation: 'A destroy is the change that needs a human decision, so it is checked first.' },
      { code: 'print("blocked:", action, name, "needs approval")', explanation: 'Stops the destroy and names the resource, so the reviewer knows exactly what is at risk.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a Terraform variable for the environment and a bucket name that uses it. Do not put a secret in the file.',
      'Change planned_changes in the seeItInAction example to include a create action, and predict the output. Run it to check.',
      'Write the steps you would follow to set up remote state for a team: the bucket, the versioning, the locking, and who can read it.',
    ],
  },
  mistakes: [
    { mistake: 'Applying without a saved plan.', fix: 'Save the plan, review it, and apply that saved file.' },
    { mistake: 'Keeping state on one laptop.', fix: 'Use a shared remote backend with versioning and locking.' },
    { mistake: 'Committing a local state file or a secret to version control.', fix: 'Keep state remote and restricted, and reference secrets from Secret Manager.' },
  ],
  quiz: [
    {
      question: 'Why apply a saved plan instead of planning again at apply time?',
      options: [
        { text: 'So the change applied is exactly the change that was reviewed', explanation: 'Yes. A saved plan removes the risk of a different result after review.' },
        { text: 'So the apply runs faster', explanation: 'Speed is not the reason. Matching the review is.' },
        { text: 'Because Terraform cannot plan twice', explanation: 'Terraform can plan twice. The concern is the result changing.' },
        { text: 'So the state file is not needed', explanation: 'The state is still needed for both the plan and the apply.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the destroy action?',
      code: { language: 'python', runnable: true, code: code`
        action, approved = "destroy", False
        print("blocked" if action == "destroy" and not approved else "ok")
      ` },
      options: [
        { text: 'ok', explanation: 'A destroy without approval is blocked by the rule.' },
        { text: 'blocked', explanation: 'Yes. A destroy with no approval is stopped.' },
        { text: 'destroy', explanation: 'The program prints the decision, not the action.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What does state locking prevent?',
      options: [
        { text: 'Two applies changing the same environment at the same time', explanation: 'Yes. A lock lets only one apply run against the state.' },
        { text: 'Anyone reading the configuration files', explanation: 'Locking is about concurrent changes, not reading files.' },
        { text: 'Plans from being shown', explanation: 'Plans are still shown. The lock controls simultaneous changes.' },
        { text: 'Costs from rising', explanation: 'Locking does not control cost.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Describe Study Tracker\'s Google Cloud resources in Terraform, save and review each plan, apply exactly the saved plan, and keep the state remote, versioned, locked, and restricted.',
  resources: [
    { title: 'Terraform on Google Cloud', provider: 'Google Cloud', description: 'Google Cloud guidance for managing resources with Terraform.', url: 'https://cloud.google.com/docs/terraform' },
    { title: 'Terraform state backends', provider: 'HashiCorp', description: 'How remote state, locking, and encryption work in Terraform.', url: 'https://developer.hashicorp.com/terraform/language/state/backends' },
  ],
}

export default lesson
