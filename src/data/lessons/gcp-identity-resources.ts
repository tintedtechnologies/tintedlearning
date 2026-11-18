import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Google Cloud Engineering overview, signed in with `gcloud auth login`, with the `study-tracker` project and a budget. Set the track variables first.',
  goals: [
    'Read an IAM allow policy and say exactly who can do what',
    'Apply least privilege by granting a narrow role on the smallest resource that works',
    'Create a service account so Study Tracker can reach Google Cloud services without any key file',
  ],
  bigIdea: "Identity and Access Management, or IAM, decides who can do what on Google Cloud. You grant a role, a named bundle of permissions such as reading objects, to a principal, a person or service, on a resource such as a project or a bucket. A service account is an identity for code, which is how Study Tracker will get permissions without a key in its files.",
  whyItMatters: "Study Tracker will need to read notes from Cloud Storage and pull its image from a registry. The quick way is to download a service account key, a JSON file with a private key, and copy it into the app. Those files end up in Git, in Docker images and in backups, and anyone who finds one can act as your app. With a service account attached to the app and one narrow role, there is no file to leak and very little to steal.",
  goalSections: [
    {
      heading: 'Roles, principals and allow policies',
      paragraphs: [
        "A permission is a single action, such as `storage.objects.get`. Roles bundle permissions. Basic roles, Owner, Editor and Viewer, cover almost everything in a project and are too broad for apps. Predefined roles, such as Storage Object Viewer, `roles/storage.objectViewer`, cover one job in one service.",
        "Each resource has an allow policy, a list of bindings. A binding joins one role to its principals, such as `user:you@example.com` or `serviceAccount:study-tracker@study-tracker-jd4821.iam.gserviceaccount.com`. Anything not granted is denied.",
        "Policies are inherited downward: a role granted on the project applies to every bucket and database in it. A role granted on one bucket applies to that bucket only.",
      ],
      example: {
        language: 'text',
        code: code`
          bindings:
          - members:
            - serviceAccount:study-tracker@study-tracker-jd4821.iam.gserviceaccount.com
            role: roles/storage.objectViewer
          Allows: reading objects in this one bucket.  Not: writing, deleting, other buckets.
        `,
      },
    },
    {
      heading: 'Least privilege on Google Cloud',
      paragraphs: [
        "Least privilege means each identity gets only the permissions its job needs, on the smallest resource that works. For an app, choose a predefined role for exactly what it does and grant it on the bucket, secret or database rather than on the whole project. If no predefined role fits, you can create a custom role with exactly the permissions you list.",
        "You, as the project's creator, hold Owner on it, which this one-person learning project needs, because you build everything, including IAM bindings. In a team, people would get narrower roles, and IAM's role descriptions show exactly which permissions each role contains before you grant it.",
        "Google Cloud also offers deny policies, which block named permissions even when a role allows them. They suit guardrails and come up again in the governance lesson.",
      ],
      example: {
        language: 'text',
        code: code`
          Principal                         Role                            On                      Lesson
          you                               Owner                           the project             1
          study-tracker (service account)   Storage Object Viewer           the notes bucket only   3
          study-tracker (service account)   Secret Manager Secret Accessor  one secret only         12
        `,
      },
    },
    {
      heading: 'Service accounts instead of keys',
      paragraphs: [
        "A service account is an identity for code, with an email address ending in `iam.gserviceaccount.com`. You attach it to a Cloud Run service or a function, and Google gives the running code short-lived access tokens for it. The client libraries, such as `google-cloud-storage`, find them automatically, as they find your `application-default` login on your laptop.",
        "A service account can also have keys, downloadable JSON files that work until deleted. Google's documentation recommends avoiding them whenever an attached service account is possible, which it always is in this track. Organizations often block key creation entirely with a policy.",
        "Cloud Asset Inventory searches every resource in a project, and a label query finds Study Tracker's. The project itself is the group: everything in it belongs to Study Tracker, and labels add detail for searches and cost reports.",
      ],
      example: {
        language: 'text',
        code: code`
          In Cloud Run:  google-cloud-storage -> metadata server -> token for study-tracker@...
          On your laptop: google-cloud-storage -> your application-default login
          Key files:      none, anywhere
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Creating Study Tracker\'s service account',
    intro: "Run these in your terminal, with the track variables set. In PowerShell, write `$SA = \"study-tracker@$PROJECT_ID.iam.gserviceaccount.com\"`.",
    example: {
      language: 'bash',
      code: code`
        gcloud services enable iam.googleapis.com cloudasset.googleapis.com
        gcloud iam service-accounts create study-tracker --display-name "Study Tracker app" --description "Runs the Study Tracker API. Roles are added per resource."
        SA=study-tracker@$PROJECT_ID.iam.gserviceaccount.com

        gcloud projects get-iam-policy $PROJECT_ID --flatten "bindings[].members" --filter "bindings.members:serviceAccount:$SA" --format "value(bindings.role)"
        gcloud iam roles describe roles/storage.objectViewer --format "value(includedPermissions)"
        gcloud asset search-all-resources --scope projects/$PROJECT_ID --query "labels.project:study-tracker" --format "table(assetType, displayName)"
      `,
      output: code`
        resourcemanager.projects.get;resourcemanager.projects.list;storage.folders.get;storage.folders.list;storage.managedFolders.get;storage.managedFolders.list;storage.objects.get;storage.objects.list
        ASSET_TYPE                                    DISPLAY_NAME
        cloudresourcemanager.googleapis.com/Project   Study Tracker
      `,
    },
    steps: [
      { code: 'gcloud iam service-accounts create study-tracker', explanation: "Creates the identity `study-tracker@` your project ID `.iam.gserviceaccount.com`. It starts with no roles, so it can do nothing." },
      { code: '--filter "bindings.members:serviceAccount:$SA" --format "value(bindings.role)"', explanation: "Lists the project-level roles the service account holds. It prints nothing, which is the point: roles will be granted on single resources in later lessons." },
      { code: 'gcloud iam roles describe roles/storage.objectViewer', explanation: "Shows exactly which permissions a role contains before you grant it. This one reads and lists objects, and nothing else. Your list may differ slightly as Google adds permissions." },
      { code: '--query "labels.project:study-tracker"', explanation: "Searches the project for labeled resources. Only the project itself appears so far. The list grows with each lesson." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the commands above.',
      'Read the example binding in the first section and write in your own words exactly what it allows and what it does not.',
      'In the console, open IAM and admin, then Service accounts, and open `study-tracker`. Note that it has no keys, and keep it that way.',
      'Clean up: service accounts cost nothing, so keep it for the next lessons. If you stop the track, delete it with `gcloud iam service-accounts delete $SA`.',
    ],
  },
  mistakes: [
    { mistake: 'Downloading a service account key for the app.', fix: 'Attach the service account to the service, and let Google supply short-lived tokens.' },
    { mistake: 'Granting Editor or Owner to an app.', fix: 'Choose a predefined role for exactly what the app does, such as Storage Object Viewer.' },
    { mistake: 'Granting roles on the project when one resource would do.', fix: 'Grant on the bucket or secret, because project roles reach everything in the project.' },
    { mistake: 'Granting a role without reading what it contains.', fix: 'Run `gcloud iam roles describe` first and check its permissions.' },
  ],
  quiz: [
    {
      question: 'A service account holds `roles/storage.objectViewer` on the notes bucket and nothing else. Can it delete an object in that bucket?',
      options: [
        { text: 'Yes, because it has a role on the bucket', explanation: 'Roles contain specific permissions. This one only reads and lists.' },
        { text: 'No, because the role does not include `storage.objects.delete`, and anything not granted is denied', explanation: 'Deleting needs a role that contains the delete permission.' },
        { text: 'Yes, if it uses the console', explanation: 'The console checks the same permissions as the CLI and libraries.' },
        { text: 'Only for objects it created', explanation: 'IAM does not track who created an object for this role.' },
      ],
      answer: 1,
    },
    {
      question: 'Which grant follows least privilege for an app that only reads one bucket?',
      options: [
        { text: 'Editor on the project', explanation: 'Editor can change almost every resource in the project.' },
        { text: 'Storage Object Viewer on the project', explanation: 'That reads every bucket in the project, not just one.' },
        { text: 'Storage Admin on the bucket', explanation: 'Admin can also delete objects and change the bucket\'s settings.' },
        { text: 'Storage Object Viewer on that bucket', explanation: 'The narrowest role, on the smallest resource that works.' },
      ],
      answer: 3,
    },
    {
      question: 'Why does this track never download service account keys?',
      options: [
        { text: 'A key file works until deleted, from anywhere, and is easily leaked through Git, images or backups', explanation: 'An attached service account gives the app short-lived tokens instead, with nothing stored.' },
        { text: 'Keys only work on Windows', explanation: 'Keys work everywhere, which is part of the danger.' },
        { text: 'Keys cannot be used with Cloud Storage', explanation: 'They can, which is why a leaked key is so harmful.' },
        { text: 'Keys cost more than tokens', explanation: 'The reason is security, not price.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Grant narrow predefined roles on the smallest resource that works, remember that anything not granted is denied and that project roles reach everything below, and give apps attached service accounts instead of key files.',
  resources: [
    { title: 'IAM overview', provider: 'Google Cloud Documentation', description: 'Principals, roles, allow policies and inheritance.', url: 'https://docs.cloud.google.com/iam/docs/overview' },
    { title: 'Roles and permissions', provider: 'Google Cloud Documentation', description: 'Basic, predefined and custom roles, and how to choose.', url: 'https://docs.cloud.google.com/iam/docs/roles-overview' },
    { title: 'Best practices for using service accounts', provider: 'Google Cloud Documentation', description: 'Attaching service accounts and avoiding keys.', url: 'https://docs.cloud.google.com/iam/docs/best-practices-service-accounts' },
    { title: 'Search resources with Cloud Asset Inventory', provider: 'Google Cloud Documentation', description: 'Finding resources across a project with queries.', url: 'https://docs.cloud.google.com/asset-inventory/docs/searching-resources' },
  ],
  underTheHood: {
    heading: 'How inherited allow policies add up',
    paragraphs: [
      "Google Cloud resources form a tree: an organization, optional folders, projects, then resources such as buckets inside them. Each node can have its own allow policy.",
      "When a request arrives, IAM collects the allow policies of the resource and every node above it, and combines them. The principal's effective permissions are everything granted at any of those levels. A role on the project therefore reaches every bucket, and a role on one bucket adds to whatever the project already grants.",
      "The important consequence is that allow policies only ever add. You cannot remove, on a bucket, a permission someone holds through the project. That is why broad grants high in the tree are dangerous, and why deny policies exist: they are checked before allow policies and block a permission wherever it was granted. For an app, the safe pattern is the one this track follows: nothing at the project level, and narrow roles on single resources.",
    ],
  },
}

export default lesson
