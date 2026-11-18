import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { checkLabelsGcp, testCheckLabelsGcp } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Google Cloud resilience and disaster recovery, with Study Tracker\'s resources labeled `project=study-tracker` as they were created, and Google Cloud identity and resource organization. Set the track variables first.',
  goals: [
    'Use labels and naming rules so every resource says what it is for and who owns it',
    'Check every resource against a labeling rule with a small script you can run in CI',
    'Explain how organizations, folders and organization policies govern many projects',
  ],
  bigIdea: "Governance means setting rules for a whole cloud estate and making sure they are followed automatically. Labels describe resources with facts such as project and owner, and a check written as code finds every resource that breaks the rule. At larger scale, an organization with folders and organization policies applies preventive rules to many projects at once.",
  whyItMatters: "Picture a company a year after moving to Google Cloud: eighty projects, a growing bill, and a Cloud SQL instance called `test-db-2` that nobody will admit to owning, so nobody dares delete it. Every unlabeled resource is money and risk with no name attached. Labels answer who owns it and why it exists, and an automatic check makes sure the next resource is labeled from the start instead of relying on everyone remembering.",
  goalSections: [
    {
      heading: 'Labels and naming',
      paragraphs: [
        "A label is a key and value on a resource, such as `project=study-tracker`, written in lowercase letters, digits, hyphens and underscores. Billing reports can filter and group costs by label, and Cloud Asset Inventory can search by them. Agree a small, fixed set and use it everywhere: Study Tracker uses `project`, `environment` and `owner`.",
        "Three different features share similar names. Labels describe resources. Network tags, such as those on virtual machines, choose which firewall rules apply. Resource Manager tags are a separate, centrally controlled kind of tag that organization policies and IAM conditions can refer to. This lesson uses labels.",
        "A naming convention does the same job in names. This track names things after the project, `study-tracker-...`, and adds your suffix where names must be unique worldwide, such as buckets and the project ID.",
      ],
      example: {
        language: 'text',
        code: code`
          Label          Example           Answers
          project        study-tracker     what is this for? (and cost per project)
          environment    learning          is it safe to delete? (dev, test, prod)
          owner          jd                who do I ask before changing it?

          Names: study-tracker-db, study-tracker-weekly-summary, study-notes-jd4821
        `,
      },
    },
    {
      heading: 'A labeling rule as code',
      paragraphs: [
        "`check_labels.py` searches the project with Cloud Asset Inventory for the resource types in this track that support labels, then lists every one without a `project` label. It exits with status 1 when any are missing, so a CI pipeline, as in Testing a whole app, fails the build instead of letting the drift grow.",
        "It is a detective control: it finds problems after they exist, like an audit, rather than blocking them. The first run usually finds something you never created yourself, such as the Artifact Registry repository and bucket that source deployments create automatically in lesson 11.",
        "The logic lives in one small function, `unlabeled`, so the test checks it with sample data and no Google Cloud account.",
      ],
      example: {
        language: 'bash',
        code: '$ python check_labels.py study-tracker-jd4821\n8 of 8 resources have the \'project\' label',
      },
    },
    {
      heading: 'Organizations and landing zones',
      paragraphs: [
        "Companies use an organization resource, tied to their domain through Google Workspace or Cloud Identity, at the top of a tree. Folders group projects by team or environment, and IAM roles and policies set on a folder apply to every project inside it.",
        "Organization policies are preventive rules on that tree, such as `iam.disableServiceAccountKeyCreation`, which blocks service account keys, or `gcp.resourceLocations`, which allows only certain regions. They need an organization to attach to. A personal project has none, so it uses a check like `check_labels.py` instead.",
        "A landing zone is a project set up correctly before a team moves in: identity, networking, logging, budgets and guardrails already in place. Google publishes landing zone designs and an enterprise foundations blueprint for building one. You have built a tiny one yourself in this track.",
      ],
      example: {
        language: 'text',
        code: code`
          Organization example.com     policy: disable service account keys, allowed regions only
            Folder platform            shared networking, logging
            Folder production          policy: no public IP on Cloud SQL
              Project study-tracker-prod
            Folder development
              Project study-tracker-dev
            Folder sandbox             experiments, strict budgets
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Labeling Study Tracker and checking the rule',
    intro: "Run these from your `study-tracker` folder, with `check_labels.py` from Try it yourself, and use your own initials for `owner`. The Cloud SQL command uses the beta group from lesson 8. The output shows a typical first run of the check, before the automatically created resources are labeled.",
    example: {
      language: 'bash',
      code: code`
        gcloud storage buckets update gs://study-notes-$SUFFIX --update-labels environment=learning,owner=jd
        gcloud storage buckets update gs://study-summaries-$SUFFIX --update-labels environment=learning,owner=jd
        gcloud run services update study-tracker --region $REGION --update-labels environment=learning,owner=jd
        gcloud run services update study-tracker-weekly-summary --region $REGION --update-labels environment=learning,owner=jd
        gcloud artifacts repositories update study-tracker --location $REGION --update-labels environment=learning,owner=jd
        gcloud secrets update database-url --update-labels environment=learning,owner=jd
        gcloud beta sql instances patch study-tracker-db --update-labels environment=learning,owner=jd

        python check_labels.py $PROJECT_ID
      `,
      output: code`
        missing label 'project': //artifactregistry.googleapis.com/projects/study-tracker-jd4821/locations/us-central1/repositories/cloud-run-source-deploy
        missing label 'project': //storage.googleapis.com/run-sources-study-tracker-jd4821-us-central1
        6 of 8 resources have the 'project' label
      `,
    },
    steps: [
      { code: '--update-labels environment=learning,owner=jd', explanation: "Adds or changes these labels and keeps any others. `--remove-labels` takes keys away, and `--clear-labels` removes them all." },
      { code: 'gcloud run services update ... --update-labels', explanation: "Labels the service. Cloud Run creates a new revision for the change, with the same image and settings." },
      { code: 'gcloud beta sql instances patch study-tracker-db --update-labels ...', explanation: "Cloud SQL labels are set through the beta commands, as in lesson 8." },
      { code: 'python check_labels.py $PROJECT_ID', explanation: "Searches the project and prints every resource without a `project` label, then a summary. It exits with status 1 because some are missing." },
      { code: 'cloud-run-source-deploy, run-sources-...', explanation: "Created automatically by the source deployment in lesson 11. Label them with `gcloud artifacts repositories update` and `gcloud storage buckets update`, adding `project=study-tracker` too, then run the check again until it passes. Your list may differ." },
    ],
  },
  tryIt: {
    instructions: [
      'Save `check_labels.py` and `test_check_labels.py` below and run `python -m pytest`.',
      'Run the commands above, label whatever the check reports, and run it again until it exits with status 0.',
      'Add the check to your GitHub Actions workflow from Testing a whole app, as a step that runs `python check_labels.py` for your project, and note what it would need to sign in to Google Cloud from CI.',
      'Clean up: labels cost nothing, so keep them. The final lesson deletes the whole project.',
    ],
    files: [
      { language: 'python', filename: 'check_labels.py', code: checkLabelsGcp, runnable: false },
      { language: 'python', filename: 'test_check_labels.py', code: testCheckLabelsGcp, files: { 'check_labels.py': checkLabelsGcp }, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Letting every team invent its own labels.', fix: 'Agree a short, fixed list of keys and values, and check them automatically.' },
    { mistake: 'Ignoring resources that tools create for you.', fix: 'Label them too. Source deployments, for example, create a repository and a bucket.' },
    { mistake: 'Mixing up labels, network tags and Resource Manager tags.', fix: 'Labels describe, network tags choose firewall rules, and Resource Manager tags feed policies.' },
    { mistake: 'Running the check once and forgetting it.', fix: 'Run it in CI on every change, so drift is caught the day it starts.' },
  ],
  quiz: [
    {
      question: 'Why does this lesson use a script instead of an organization policy to enforce the labeling rule?',
      options: [
        { text: 'Organization policies cannot check labels at all', explanation: 'The reason here is simpler: there is no organization to set them on.' },
        { text: 'Scripts are always stronger than policies', explanation: 'A preventive policy would be stronger. This is the best option available here.' },
        { text: 'A personal project has no organization for policies to attach to', explanation: 'Organizations come from Google Workspace or Cloud Identity, tied to a domain.' },
        { text: 'Organization policies cost more than scripts', explanation: 'Cost is not the reason.' },
      ],
      answer: 2,
    },
    {
      question: 'A pull request adds a new bucket without labels, and CI runs `check_labels.py`. What happens?',
      options: [
        { text: 'The script exits with status 1, so the CI step fails and the problem is visible before merging', explanation: 'A failing check stops drift at the moment it would start.' },
        { text: 'The script adds the missing labels automatically', explanation: 'It only reports. Fixing stays a deliberate change.' },
        { text: 'Google Cloud refuses to create the bucket', explanation: 'That would be a preventive control, which needs an organization policy.' },
        { text: 'Nothing, because CI cannot see Google Cloud', explanation: 'With credentials for the project, it can.' },
      ],
      answer: 0,
    },
    {
      question: 'The check reports `cloud-run-source-deploy`, a repository you never created. What should you do?',
      options: [
        { text: 'Delete the whole project', explanation: 'Far too drastic for a missing label.' },
        { text: 'Remove it from the script\'s list of resource types', explanation: 'That hides the problem instead of fixing it.' },
        { text: 'Ignore it, because Google created it', explanation: 'It belongs to Study Tracker and is billed to it, so it should be labeled like everything else.' },
        { text: 'Label it with the project, environment and owner labels, then run the check again', explanation: 'Source deployments created it for Study Tracker, so it gets Study Tracker\'s labels.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Agree a few labels and apply them to everything, including what tools create for you, check the rule automatically with a script in CI, and know that preventive organization policies need an organization over your projects.',
  resources: [
    { title: 'Labels overview', provider: 'Google Cloud Documentation', description: 'What labels are, their rules and how billing uses them.', url: 'https://docs.cloud.google.com/resource-manager/docs/labels-overview' },
    { title: 'Tags overview', provider: 'Google Cloud Documentation', description: 'Resource Manager tags, and how they differ from labels and network tags.', url: 'https://docs.cloud.google.com/resource-manager/docs/tags/tags-overview' },
    { title: 'Introduction to the Organization Policy Service', provider: 'Google Cloud Documentation', description: 'Constraints, inheritance and the resource hierarchy.', url: 'https://docs.cloud.google.com/resource-manager/docs/organization-policy/overview' },
    { title: 'Landing zone design in Google Cloud', provider: 'Google Cloud Architecture Center', description: 'Designing identity, networking, security and resource organization for many teams.', url: 'https://docs.cloud.google.com/architecture/landing-zones' },
  ],
  underTheHood: {
    heading: 'Preventive and detective controls',
    paragraphs: [
      "Governance rules come in two kinds. A preventive control stops a request that breaks the rule before anything is created, such as an organization policy that refuses a Cloud SQL instance with a public address. A detective control lets the request through and reports the problem afterward, such as `check_labels.py` or an audit report.",
      "Preventive controls are stronger, but they need care. A rule that blocks too much stops teams from working, and they look for ways around it. That is why organizations often start a new rule in a dry-run or audit mode, watch what it would block, fix what it finds, and only then enforce it.",
      "Detective controls are easier to add and never block anyone, but they depend on someone acting on the report. Wiring them into CI, alerts or a weekly review is what turns a report into a rule. Mature platforms use both: preventive controls for the few things that must never happen, and detective checks for everything else.",
    ],
  },
}

export default lesson
