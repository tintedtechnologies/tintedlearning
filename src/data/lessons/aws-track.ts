import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { awsBudgetJson, awsNotificationsJson, awsVariablesBash, awsVariablesPowerShell } from './aws-shared'

const lesson: StructuredLesson = {
  assumes: 'the Software Engineering section, with Study Tracker running in Docker, and the Foundations cloud lessons. This track mirrors the Azure and Google Cloud tracks lesson for lesson, so the ideas transfer if you switch providers later.',
  goals: [
    'Describe how AWS organizes accounts, regions and resources',
    'Secure a new AWS account: protect the root user, create a daily user and set a budget alert',
    'Install the AWS CLI, sign in with your daily user and check which account your commands will use',
  ],
  bigIdea: "Amazon Web Services, or AWS, is Amazon's cloud. Over these 14 lessons you will run Study Tracker on it as a real production service, with a private database, managed secrets, monitoring, backups and an AI model. On AWS, the account is the main boundary for billing, access and limits, so before creating anything you lock away the account's all-powerful root user, create a daily user and set a budget alert.",
  whyItMatters: "A new AWS account starts with one login, the root user, which can do anything, including closing the account, and cannot be restricted. If its password leaks, someone can run expensive servers on your card within minutes. And even without an attacker, a forgotten test database quietly bills you every hour. Ten minutes of setup protects you from both: MFA on the root user, a separate daily user, and a budget that emails you while a mistake is still small.",
  goalSections: [
    {
      heading: 'How AWS organizes things',
      paragraphs: [
        "An AWS account is a container for resources, users and bills. Each account has its own limits and is billed separately, and nothing in one account can reach another unless you allow it. Organizations with many teams use AWS Organizations to group accounts into organizational units, which the governance lesson covers.",
        "Every resource lives in a region, such as US East (N. Virginia), written `us-east-1`. Each region contains several availability zones, separate data centers with their own power. Choose one region near you and use it throughout the track. AWS has no resource-group container like Azure: instead, resources are grouped by tags, labels you attach, which this track adds from the first resource.",
        "This track builds toward the result shown below, one part per lesson, and each build ends with a Clean up step.",
      ],
      example: {
        language: 'text',
        code: code`
          AWS account: billing, access and limit boundary
            Region us-east-1
              ECR repository            the Study Tracker image          lesson 5
              ECS Express Mode service  the running API, public HTTPS    lesson 5
              RDS for PostgreSQL        sessions and notes, private      lesson 7
              S3 bucket                 notes files                      lesson 3
              Secrets Manager           secrets                          lesson 10
              CloudWatch                logs, metrics, alarms            lesson 6
              Lambda function           weekly summary                   lesson 9
              Amazon Bedrock            the study assistant's model      lesson 13
          Every resource tagged project=study-tracker
        `,
      },
    },
    {
      heading: 'Securing the account',
      paragraphs: [
        "Sign up for an AWS account. New accounts can get free credits and some free services, but the offer changes, so check AWS's Free Tier page rather than any number you read elsewhere. Expect to give a payment card.",
        "The email address you signed up with is the root user. AWS's documentation recommends adding MFA to it immediately and using it only for the few tasks that require it. For everything else, turn on IAM Identity Center, AWS's service for sign-in and users, and create a user called `studyadmin` with an administrator permission set. That is the account you will use daily.",
        "Then set a budget with email alerts. A budget never stops anything: AWS's documentation says budget data is updated up to three times a day, typically 8 to 12 hours apart. That is why the alerts include a forecast, which warns you when the month is heading over budget.",
      ],
      example: {
        language: 'text',
        code: code`
          Login           Used for                                    Protection
          Root user       closing the account, changing payment info  MFA, password locked away
          studyadmin      all daily work in this track                MFA, Identity Center sign-in
          Budget: 10 USD per month, emails at 50% and 100% actual, and 100% forecast
        `,
      },
    },
    {
      heading: 'The AWS CLI',
      paragraphs: [
        "The AWS CLI, the `aws` command, controls AWS from your terminal. This track uses it for every step, so you can copy, check and repeat each one. Install version 2 from AWS's installer: on macOS the `AWSCLIV2.pkg` package, on Windows the `AWSCLIV2.msi` installer, and on Linux the zip file, all linked from AWS's install page.",
        "`aws configure sso` connects the CLI to IAM Identity Center. It asks for your start URL, shown in Identity Center's settings, and creates a named profile. `aws sso login` then opens a browser to sign in, and `aws sts get-caller-identity` shows which account and user your commands will use.",
        "Each lesson starts by setting a few variables. `AWS_PROFILE` tells every command which profile to use, and `SUFFIX`, your initials and four random digits, makes names that must be unique worldwide, such as S3 bucket names.",
      ],
      example: {
        language: 'bash',
        code: `# macOS and Linux (bash or zsh)\n${awsVariablesBash}\n\n# Windows PowerShell\n${awsVariablesPowerShell}`,
      },
    },
  ],
  seeItInAction: {
    title: 'Signing in and creating a budget alert',
    intro: "First, in the AWS console as the root user: add MFA to the root user, enable IAM Identity Center, create the user `studyadmin` and give it the AdministratorAccess permission set for your account. Then sign out of root and run these commands in your terminal. Save `budget.json` and `notifications.json` from Try it yourself, with your email address.",
    example: {
      language: 'bash',
      code: code`
        aws configure sso --profile study
        aws sso login --profile study
        export AWS_PROFILE=study
        aws sts get-caller-identity --query "[Account, Arn]" --output text

        ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
        aws budgets create-budget --account-id $ACCOUNT --budget file://budget.json --notifications-with-subscribers file://notifications.json
        aws budgets describe-budgets --account-id $ACCOUNT --query "Budgets[].{name:BudgetName, limit:BudgetLimit.Amount}" --output table
      `,
      output: code`
        123456789012    arn:aws:sts::123456789012:assumed-role/AWSReservedSSO_AdministratorAccess_0123456789abcdef/studyadmin
      `,
    },
    steps: [
      { code: 'aws configure sso --profile study', explanation: "Asks for an SSO session name, your Identity Center start URL and region, then lets you pick the account and permission set. It saves them as the profile `study`." },
      { code: 'aws sso login --profile study', explanation: "Opens a browser to sign in as `studyadmin`, with MFA. The CLI then uses short-lived credentials, so no long-term access key is ever stored on your computer." },
      { code: 'export AWS_PROFILE=study', explanation: "Makes `study` the profile for every following command. In PowerShell, write `$env:AWS_PROFILE = \"study\"`." },
      { code: 'aws sts get-caller-identity', explanation: "Confirms the account and that you are signed in as `studyadmin`, not root. The account number shown is private, so do not paste it publicly." },
      { code: 'ACCOUNT=$(aws sts get-caller-identity --query Account --output text)', explanation: "Saves your account number for the budget commands. In PowerShell, write `$ACCOUNT = aws sts get-caller-identity --query Account --output text`." },
      { code: '--budget file://budget.json --notifications-with-subscribers file://notifications.json', explanation: "Reads the budget and its three alerts from files, which avoids quoting JSON differently in each shell. AWS sends email alerts to the addresses in `notifications.json`." },
    ],
  },
  tryIt: {
    instructions: [
      'Create an AWS account, add MFA to the root user and set up `studyadmin` in IAM Identity Center, as described above.',
      'Install AWS CLI version 2 and run `aws --version`. Then sign in with `aws configure sso` and `aws sso login`, and confirm with `aws sts get-caller-identity` that you are `studyadmin`.',
      'Save the two files below with your email address, create the budget and list it.',
      'Clean up: there is nothing to delete. Keep the budget for the whole track. If you ever leave AWS, delete it with `aws budgets delete-budget --account-id $ACCOUNT --budget-name study-tracker-budget`.',
    ],
    files: [
      { language: 'text', filename: 'budget.json', code: awsBudgetJson },
      { language: 'text', filename: 'notifications.json', code: awsNotificationsJson },
    ],
  },
  mistakes: [
    { mistake: 'Doing daily work as the root user.', fix: 'Add MFA to root, put its password away, and use an Identity Center user like `studyadmin` for everything else.' },
    { mistake: 'Creating long-term access keys for the CLI.', fix: 'Sign in with `aws sso login`, which gives short-lived credentials that expire on their own.' },
    { mistake: 'Believing a budget stops spending.', fix: 'Budgets only send emails, and their data can be hours old. Delete resources you are not using.' },
    { mistake: 'Running commands in the wrong region or account.', fix: 'Check `aws sts get-caller-identity` and the region before creating anything, and set them once at the top of each session.' },
  ],
  quiz: [
    {
      question: 'Which login should you use for everyday work in this track?',
      options: [
        { text: 'The root user, because it can do everything without errors', explanation: 'That power is exactly the risk. Root cannot be restricted.' },
        { text: 'An IAM Identity Center user such as `studyadmin`, signed in with `aws sso login`', explanation: 'AWS recommends this, and it gives short-lived credentials protected by MFA.' },
        { text: 'An access key created for the root user', explanation: 'Root access keys are especially dangerous and should never be created.' },
        { text: 'A shared login used by everyone on the team', explanation: 'Shared logins make it impossible to tell who did what.' },
      ],
      answer: 1,
    },
    {
      question: 'Your monthly budget is 10 USD. A forgotten database pushes spending to 13 USD. What happens?',
      options: [
        { text: 'AWS stops the database at 10 USD', explanation: 'Budgets never stop or delete resources.' },
        { text: 'The account is closed', explanation: 'A budget has no effect on the account.' },
        { text: 'Nothing, because budgets only track forecasts', explanation: 'Actual-spending alerts work too.' },
        { text: 'You get an email, possibly hours later, and the database keeps costing money until you delete it', explanation: 'Budgets only alert, and their data is updated a few times a day.' },
      ],
      answer: 3,
    },
    {
      question: 'On AWS, what is the main boundary for billing, access and limits?',
      options: [
        { text: 'The account', explanation: 'Each account is billed separately and isolated from others unless you allow access.' },
        { text: 'The region', explanation: 'A region is a location. One account can use many regions.' },
        { text: 'A tag', explanation: 'Tags label resources but do not isolate them.' },
        { text: 'An availability zone', explanation: 'A zone is a data center within a region, a resilience concept.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Before creating anything on AWS, put MFA on the root user and stop using it, sign in daily through IAM Identity Center, set a budget with a forecast alert and confirm the account and region your commands will use.',
  resources: [
    { title: 'AWS Free Tier', provider: 'AWS', description: 'What new accounts currently get for free, and for how long.', url: 'https://aws.amazon.com/free/' },
    { title: 'Root user best practices', provider: 'AWS Documentation', description: 'Protecting the root user and the tasks that need it.', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html' },
    { title: 'Install the AWS CLI', provider: 'AWS Documentation', description: 'Official installers for macOS, Windows and Linux.', url: 'https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html' },
    { title: 'Configure the CLI with IAM Identity Center', provider: 'AWS Documentation', description: 'Setting up `aws configure sso` and signing in.', url: 'https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html' },
  ],
  underTheHood: {
    heading: 'Why short-lived credentials are safer',
    paragraphs: [
      "Older AWS tutorials tell you to create an access key, a long-lived ID and secret pair, and save it on your computer with `aws configure`. That key works until someone deletes it, from anywhere in the world. If it ends up in a Git commit, a screenshot or a backup, anyone who finds it has your permissions, and automated scanners search public code for exactly these keys.",
      "IAM Identity Center works differently. When you run `aws sso login`, you sign in through a browser with MFA, and the CLI receives temporary credentials for a role, the permission set you chose. They expire after a set time, typically hours, and the CLI asks you to sign in again.",
      "A leaked temporary credential is still serious, but it stops working soon, and it was never stored long-term. That is the same idea as the managed identities and roles this track gives Study Tracker: no permanent secrets anywhere, only short-lived proof of who is asking.",
    ],
  },
}

export default lesson
