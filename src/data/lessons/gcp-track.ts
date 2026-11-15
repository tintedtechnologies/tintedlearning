import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { gcpVariablesBash, gcpVariablesPowerShell } from './gcp-shared'

const lesson: StructuredLesson = {
  assumes: 'the Software Engineering section, with Study Tracker running in Docker, and the Foundations cloud lessons. This track mirrors the Azure and AWS tracks lesson for lesson, so the ideas transfer if you switch providers later.',
  goals: [
    'Describe how Google Cloud organizes billing accounts, projects, regions and resources',
    'Secure your Google account, create a project for Study Tracker and set a budget alert',
    'Install the Google Cloud CLI, sign in and check which account and project your commands will use',
  ],
  bigIdea: "Google Cloud is Google's cloud. Over these 14 lessons you will run Study Tracker on it as a real production service, with a private database, managed secrets, monitoring, backups and an AI model. On Google Cloud, the project is the main boundary for resources, access and limits, and a billing account pays for it, so before creating anything you protect your Google account, create one project for Study Tracker and set a budget alert.",
  whyItMatters: "Google Cloud signs you in with an ordinary Google account, the same one that may hold your email and photos. If its password leaks and it has no second factor, someone can create expensive machines billed to your card. And even without an attacker, a test database left running keeps billing every hour. Ten minutes of setup protects you from both: 2-Step Verification, one clearly named project, and a budget that emails you while a mistake is still small.",
  goalSections: [
    {
      heading: 'How Google Cloud organizes things',
      paragraphs: [
        "A project holds resources, permissions and settings, and each one has a project ID that is unique worldwide, such as `study-tracker-jd4821`. A billing account, linked to the project, pays for what it uses. Companies add an organization above their projects, with folders for teams, which the governance lesson covers. A personal account starts with projects only.",
        "Every resource lives in a region, such as `us-central1` in Iowa, or in a zone inside it, such as `us-central1-a`, a separate data center. Choose one region near you and use it throughout the track. Labels, key and value pairs such as `project=study-tracker`, describe resources for searches and cost reports.",
        "This track builds toward the result shown below, one part per lesson, and each build ends with a Clean up step.",
      ],
      example: {
        language: 'text',
        code: code`
          Billing account: pays for linked projects
            Project study-tracker-jd4821: resource, access and limit boundary
              Region us-central1
                Artifact Registry         the Study Tracker image          lesson 5
                Cloud Run service         the running API, public HTTPS    lesson 5
                Cloud SQL for PostgreSQL  sessions and notes, private      lesson 7
                Cloud Storage bucket      notes files                      lesson 3
                Secret Manager            secrets                          lesson 7
                Cloud Logging, Monitoring logs, metrics, alerts            lesson 6
                Cloud Run function        weekly summary                   lesson 9
                Agent Platform            the study assistant's model      lesson 13
          Resources labeled project=study-tracker
        `,
      },
    },
    {
      heading: 'Securing the account and setting a budget',
      paragraphs: [
        "Sign up for Google Cloud with your Google account. New customers can get free credits and some always-free services, but the offer changes, so check Google's free program page rather than any number you read elsewhere. Expect to give a payment card.",
        "Turn on 2-Step Verification for that Google account first. A personal account has no separate root user: the account you sign up with owns the billing account and every project you create, so it needs the strongest protection. If you use a company Google Workspace account, never use a super administrator for cloud work, and ask for an ordinary account with access to one project.",
        "Then set a budget for the project. A budget never stops anything. Google's documentation says it does not cap spending, that cost data arrives with a delay, and that the first email can take several hours. That is why the alerts include a forecast, which warns you when the month is heading over budget. Alerts go by email to the billing account's administrators and users, which includes you.",
      ],
      example: {
        language: 'text',
        code: code`
          Protection                      Why
          2-Step Verification             your Google account owns the billing and every project
          One project for Study Tracker   one place to see, secure and delete everything
          Budget: 10 USD per month, emails at 50% and 100% actual, and 100% forecast
        `,
      },
    },
    {
      heading: 'The Google Cloud CLI',
      paragraphs: [
        "The Google Cloud CLI, the `gcloud` command, controls Google Cloud from your terminal. This track uses it for every step, so you can copy, check and repeat each one. Install it from Google's install page: an archive with an install script on macOS and Linux, or the installer on Windows.",
        "`gcloud auth login` opens a browser to sign in. `gcloud auth application-default login` signs in a second time for code, so Python libraries on your laptop can use your account, the way the app will use its own identity in the cloud. `gcloud config list` shows which account and project your commands will use.",
        "Each lesson starts by setting a few variables. `PROJECT_ID` must be unique worldwide, so it ends with `SUFFIX`, your initials and four random digits. `gcloud config set project` makes it the default for every following command.",
      ],
      example: {
        language: 'bash',
        code: `# macOS and Linux (bash or zsh)\n${gcpVariablesBash}\n\n# Windows PowerShell\n${gcpVariablesPowerShell}`,
      },
    },
  ],
  seeItInAction: {
    title: 'Creating the project and a budget alert',
    intro: "First, turn on 2-Step Verification for your Google account and sign up for Google Cloud. Then run these in your terminal. The billing account ID comes from the list command, in the format `000000-000000-000000`: copy yours into `BILLING`. The budget currency must match your billing account's currency, so change `USD` if yours differs. In PowerShell, set variables as `$NAME = ...`.",
    example: {
      language: 'bash',
      code: code`
        gcloud auth login
        gcloud auth application-default login
        gcloud billing accounts list --format "value(name, displayName)"
        BILLING=000000-000000-000000

        gcloud projects create $PROJECT_ID --name "Study Tracker" --labels project=study-tracker
        gcloud billing projects link $PROJECT_ID --billing-account $BILLING
        gcloud config set project $PROJECT_ID
        gcloud auth application-default set-quota-project $PROJECT_ID
        gcloud services enable billingbudgets.googleapis.com

        gcloud billing budgets create --billing-account $BILLING --display-name study-tracker-budget --budget-amount 10USD --filter-projects projects/$PROJECT_ID --threshold-rule percent=0.5 --threshold-rule percent=1.0 --threshold-rule percent=1.0,basis=forecasted-spend
        gcloud billing budgets list --billing-account $BILLING --format "table(displayName, amount.specifiedAmount.units)"
      `,
      output: code`
        DISPLAY_NAME          UNITS
        study-tracker-budget  10
      `,
    },
    steps: [
      { code: 'gcloud auth application-default login', explanation: "Signs in a second time for code. Python libraries such as `google-cloud-storage` find these credentials on their own, so no key file is ever created." },
      { code: 'gcloud projects create $PROJECT_ID --name "Study Tracker" --labels project=study-tracker', explanation: "Creates the project with a label. If the ID is taken, change `SUFFIX` and try again." },
      { code: 'gcloud billing projects link $PROJECT_ID --billing-account $BILLING', explanation: "Lets the project use paid services, billed to your billing account. Without it, most commands in this track fail." },
      { code: 'gcloud auth application-default set-quota-project $PROJECT_ID', explanation: "Tells Google which project to count your code's API requests against, which some APIs require." },
      { code: 'gcloud services enable billingbudgets.googleapis.com', explanation: "Google Cloud APIs are off in a new project until you enable them. Each lesson enables the ones it needs." },
      { code: '--filter-projects projects/$PROJECT_ID --threshold-rule percent=1.0,basis=forecasted-spend', explanation: "Counts only this project's costs, and adds an alert when the forecast for the month passes the budget." },
    ],
  },
  tryIt: {
    instructions: [
      'Turn on 2-Step Verification for your Google account and sign up for Google Cloud.',
      'Install the Google Cloud CLI and run `gcloud --version`. Sign in, and confirm with `gcloud config list` which account and project are active.',
      'Create the project, link billing and create the budget, then find it in the console under Billing, then Budgets and alerts.',
      'Clean up: there is nothing to delete. Keep the project and the budget for the whole track. The capstone ends by deleting the project, which removes everything in it.',
    ],
  },
  mistakes: [
    { mistake: 'Leaving the Google account without a second factor.', fix: 'Turn on 2-Step Verification before linking a payment card. That account owns everything you create.' },
    { mistake: 'Creating resources in a random existing project.', fix: 'Use one project for Study Tracker only, so you can see, secure and finally delete it as a unit.' },
    { mistake: 'Believing a budget stops spending.', fix: 'Budgets only send alerts, and cost data arrives with a delay. Delete resources you are not using.' },
    { mistake: 'Running commands against the wrong project.', fix: 'Check `gcloud config list` before creating anything, and set the project once at the top of each session.' },
  ],
  quiz: [
    {
      question: 'On Google Cloud, what is the main boundary for resources, access and limits?',
      options: [
        { text: 'The region', explanation: 'A region is a location. One project can use many regions.' },
        { text: 'A label', explanation: 'Labels describe resources but do not isolate them.' },
        { text: 'The project', explanation: 'Resources, permissions and settings belong to a project, which a billing account pays for.' },
        { text: 'The zone', explanation: 'A zone is a data center within a region, a resilience concept.' },
      ],
      answer: 2,
    },
    {
      question: 'Your monthly budget is 10 USD. A forgotten database pushes spending to 13 USD. What happens?',
      options: [
        { text: 'Google Cloud stops the database at 10 USD', explanation: 'An alerts-only budget never stops or deletes resources.' },
        { text: 'You get an email, possibly hours later, and the database keeps costing money until you delete it', explanation: 'Budgets alert, and cost data arrives with a delay.' },
        { text: 'The project is deleted', explanation: 'A budget has no effect on the project.' },
        { text: 'Nothing, because budgets only track forecasts', explanation: 'Actual-spending thresholds alert too.' },
      ],
      answer: 1,
    },
    {
      question: '`gcloud storage buckets list` works, but a Python script using `google-cloud-storage` on your laptop fails with an error about default credentials. What did you most likely skip?',
      options: [
        { text: '`gcloud auth application-default login`', explanation: 'Libraries use Application Default Credentials, a separate sign-in from the one `gcloud` itself uses.' },
        { text: 'Enabling 2-Step Verification', explanation: 'That protects the account but does not affect which credentials code finds.' },
        { text: 'Creating a budget', explanation: 'Budgets do not affect sign-in at all.' },
        { text: 'Linking a billing account', explanation: '`gcloud storage` would fail too if billing were the problem.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Before creating anything on Google Cloud, protect your Google account with 2-Step Verification, give Study Tracker its own project, set a budget with a forecast alert and confirm the account and project your commands will use.',
  resources: [
    { title: 'Google Cloud free program', provider: 'Google Cloud', description: 'What new customers currently get for free, and for how long.', url: 'https://cloud.google.com/free' },
    { title: 'Install the Google Cloud CLI', provider: 'Google Cloud Documentation', description: 'Official installers for macOS, Windows and Linux.', url: 'https://docs.cloud.google.com/sdk/docs/install-sdk' },
    { title: 'Create, edit, or delete budgets and budget alerts', provider: 'Google Cloud Documentation', description: 'How budgets and their alerts work, and who receives them.', url: 'https://docs.cloud.google.com/billing/docs/how-to/budgets' },
    { title: 'How Application Default Credentials works', provider: 'Google Cloud Documentation', description: 'How code finds credentials on your laptop and in the cloud.', url: 'https://docs.cloud.google.com/docs/authentication/application-default-credentials' },
  ],
  underTheHood: {
    heading: 'Access tokens and refresh tokens',
    paragraphs: [
      "When you run `gcloud auth login`, Google gives the CLI two things. An access token proves who you are to Google's APIs and expires after about an hour. A refresh token lets the CLI ask for a new access token without opening the browser again.",
      "Every request carries only the access token, so a token copied from a log or a screenshot stops working within the hour. The refresh token is more valuable, which is why it stays in the CLI's configuration folder on your computer and should never be copied anywhere else. `gcloud auth revoke` cancels it, for example on a laptop you are giving away.",
      "Code in the cloud works the same way without any stored token at all. Cloud Run and other services give each app a service account, and the app asks a local metadata server for a fresh access token whenever it needs one. Nothing long-lived is stored in the app, its image or its settings, which is the idea this track builds on lesson by lesson.",
    ],
  },
}

export default lesson
