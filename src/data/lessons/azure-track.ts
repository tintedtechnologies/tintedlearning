import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { azureVariablesBash, azureVariablesPowerShell, budgetJson } from './azure-shared'

const lesson: StructuredLesson = {
  assumes: 'the Software Engineering section, with Study Tracker running in Docker, and the Foundations cloud lessons. Everything in this track also exists on AWS and Google Cloud under other names, so the ideas transfer if you switch providers later.',
  goals: [
    'Describe how Azure organizes tenants, subscriptions, resource groups and resources',
    'Set up an Azure account safely, with multi-factor authentication and a budget alert',
    'Install the Azure CLI, sign in and check which subscription your commands will use',
  ],
  bigIdea: "Azure is Microsoft's cloud. Over these 14 lessons you will run Study Tracker on it as a real production service, with a private database, managed secrets, monitoring, backups and an AI model. Everything you create lives in a subscription, where costs are billed, inside resource groups that let you delete related things together, so before creating anything you protect the account and set a budget alert.",
  whyItMatters: "Cloud mistakes cost money quietly. A learner follows a tutorial, creates a database, closes the laptop and forgets it. Nothing breaks, nothing warns them, and a month later the bill arrives. Ten minutes of setup prevents that: multi-factor authentication stops someone else from running up your bill, and a budget alert emails you while a mistake is still small.",
  goalSections: [
    {
      heading: 'How Azure organizes things',
      paragraphs: [
        "At the top is a tenant, an organization's directory in Microsoft Entra ID, Azure's identity service. It holds users and groups. Below it are subscriptions: each one is a billing and access boundary, so costs are charged per subscription and permissions can be granted on one without the others. Large organizations group subscriptions under management groups, which the governance lesson covers.",
        "Inside a subscription, resource groups hold related resources, such as Study Tracker's database, app and storage. A resource group is the natural unit of clean-up: delete it and everything inside goes too. Every resource also lives in a region, a set of Microsoft data centers in one area, such as East US. Choose one near you and use it throughout.",
        "This track builds toward the result shown below. Each lesson adds one part and ends with a Clean up step, so you only pay for what you are using.",
      ],
      example: {
        language: 'text',
        code: code`
          Tenant (Microsoft Entra ID): your users and groups
            Subscription: billing and access boundary
              Resource group rg-study-tracker: delete it to remove everything below
                Container registry       the Study Tracker image         lesson 5
                Container app            the running API, public         lesson 5
                PostgreSQL server        sessions and notes, private     lesson 7
                Storage account          notes files                     lesson 3
                Key Vault                secrets                         lesson 10
                Monitoring and alerts    logs, metrics, emails           lesson 6
                Function app             weekly summary                  lesson 9
                AI model deployment      the study assistant's model     lesson 13
        `,
      },
    },
    {
      heading: 'Setting up the account safely',
      paragraphs: [
        "Sign up for an Azure account. New accounts usually come with free credits and some services free for a limited time, but the amounts change, so check Microsoft's free services page rather than any number you read elsewhere. Expect to give a payment card.",
        "Turn on multi-factor authentication, or MFA, straight away, with an authenticator app or a passkey. Microsoft now requires it for the Azure portal, and is rolling it out for the CLI too. The account you sign up with is the most powerful in your new tenant, so the next lesson creates a separate, limited user for daily work.",
        "Then set a budget. A budget sends email alerts at the levels you choose. It does not stop resources or block spending, and Microsoft's documentation explains that cost data arrives 8 to 24 hours late and budgets are checked once a day. That is why the alerts below include a forecast alert, which warns you when the month is heading over budget.",
      ],
      example: {
        language: 'text',
        code: code`
          Budget: 10 per month, in your billing currency
          Alert 1   actual spending reaches 50%     -> email
          Alert 2   actual spending reaches 100%    -> email
          Alert 3   forecast for the month reaches 100% -> email, earlier warning
          What it does not do: stop, delete or block anything
        `,
      },
    },
    {
      heading: 'The Azure CLI',
      paragraphs: [
        "The Azure CLI, the `az` command, controls Azure from your terminal. This track uses it for every step, so you can copy, check and repeat each one, and keep a record of what you created. The same actions are also available in the Azure portal, the website at portal.azure.com.",
        "Install it on macOS with `brew install azure-cli`, on Windows with `winget install --exact --id Microsoft.AzureCLI`, and on Linux by following Microsoft's install page for your distribution. Then `az login` opens a browser to sign in, and `az account show` tells you which subscription your commands will affect. Always check that before creating anything.",
        "Each lesson starts by setting a few shell variables, so commands stay short and names stay consistent. `SUFFIX` makes names unique, because some Azure names must be unique worldwide: use your initials and four random digits. The commands work in bash and PowerShell, which share the `$NAME` style. Only setting variables looks different.",
      ],
      example: {
        language: 'bash',
        code: `# macOS and Linux (bash or zsh)\n${azureVariablesBash}\n\n# Windows PowerShell\n${azureVariablesPowerShell}`,
      },
    },
  ],
  seeItInAction: {
    title: 'Signing in and creating a budget alert',
    intro: "Run these commands after installing the CLI. The budget is created through Azure's REST API with `az rest`, because the CLI's own budget command cannot add email alerts. Save the JSON as `budget.json` in your `study-tracker` folder first, with your own email address and the first day of the current month as the start date.",
    example: {
      language: 'bash',
      code: code`
        az login
        az account show --query "{name:name, user:user.name}" -o table

        SUB=$(az account show --query id -o tsv)
        az rest --method put --url "https://management.azure.com/subscriptions/$SUB/providers/Microsoft.Consumption/budgets/study-tracker-budget?api-version=2026-06-01" --body "@budget.json"

        az rest --method get --url "https://management.azure.com/subscriptions/$SUB/providers/Microsoft.Consumption/budgets?api-version=2026-06-01" --query "value[].{name:name, amount:properties.amount}" -o table
      `,
      output: code`
        Name                  User
        --------------------  ---------------------
        Azure subscription 1  you@example.com

        Name                  Amount
        --------------------  --------
        study-tracker-budget  10.0
      `,
    },
    steps: [
      { code: 'az login', explanation: "Opens a browser to sign in, including your MFA prompt. The CLI then remembers you until the sign-in expires." },
      { code: 'az account show --query "{name:name, user:user.name}" -o table', explanation: "`--query` picks fields from the result, and `-o table` prints them as a table. If the subscription is wrong, switch with `az account set --subscription \"name or id\"`." },
      { code: 'SUB=$(az account show --query id -o tsv)', explanation: "Saves your subscription ID in a variable. In PowerShell, write `$SUB = az account show --query id -o tsv`. The ID is private to your account, so never paste it into public places." },
      { code: '"startDate": "2026-11-01T00:00:00Z"', explanation: "In `budget.json`. A budget's start date must be the first day of a month, and the end date sets when it stops. Change both to start this month." },
      { code: '"thresholdType": "Forecasted"', explanation: "The third alert fires when Azure predicts the month will pass the budget, often days before it actually does." },
      { code: 'az rest --method put --url ".../budgets/study-tracker-budget?api-version=2026-06-01" --body "@budget.json"', explanation: "Sends the JSON file to the Budgets API. The quotes around `@budget.json` matter in PowerShell, where `@` has a special meaning." },
      { code: 'az rest --method get --url ".../budgets?api-version=2026-06-01"', explanation: "Lists your budgets to confirm it worked. In the portal, the same budget appears under Cost Management, then Budgets." },
    ],
  },
  tryIt: {
    instructions: [
      'Create an Azure account and turn on MFA. Install the Azure CLI and run `az version` to check it works.',
      'Run `az login` and `az account show`. Make sure the subscription is the one you want to use for this track.',
      'Save `budget.json` below with your email and this month\'s start date, then create and list the budget with the commands above.',
      'Clean up: there is nothing to delete. Keep the budget for the whole track. If you ever leave Azure, delete it with the same URL and `az rest --method delete`.',
    ],
    files: [{ language: 'text', filename: 'budget.json', code: budgetJson }],
  },
  mistakes: [
    { mistake: 'Creating resources before setting a budget alert.', fix: 'Set the budget first, with a forecast alert, so a forgotten resource costs you an email instead of a surprise bill.' },
    { mistake: 'Believing a budget stops spending.', fix: 'Budgets only send alerts, and cost data is up to a day late. Delete resources you are not using.' },
    { mistake: 'Running commands against the wrong subscription.', fix: 'Run `az account show` before creating anything, and switch with `az account set` when needed.' },
    { mistake: 'Leaving MFA off on the account that owns the subscription.', fix: 'Turn it on before anything else. That account can create, and pay for, anything.' },
  ],
  quiz: [
    {
      question: 'Your monthly budget is 10, with alerts at 100% of actual spending. A forgotten database pushes spending to 12. What happens?',
      options: [
        { text: 'Azure stops the database at 10', explanation: 'Budgets never stop or delete resources.' },
        { text: 'The subscription is disabled until next month', explanation: 'A budget has no effect on the subscription itself.' },
        { text: 'You get an email, and the database keeps running and costing money until you delete it', explanation: 'Budgets only alert. Acting on the alert is up to you.' },
        { text: 'Nothing, because alerts only work for forecasts', explanation: 'Actual-spending alerts work too. The forecast alert just warns earlier.' },
      ],
      answer: 2,
    },
    {
      question: 'You want to be able to remove everything Study Tracker uses in Azure with one command. What should hold all of its resources?',
      options: [
        { text: 'One resource group', explanation: 'Deleting a resource group deletes everything inside it.' },
        { text: 'One region', explanation: 'A region is a location. It does not group resources for deletion.' },
        { text: 'One tenant', explanation: 'A tenant holds identities and every subscription, far too broad to delete.' },
        { text: 'One budget', explanation: 'A budget watches costs. It does not contain resources.' },
      ],
      answer: 0,
    },
    {
      question: '`az account show` reports a work subscription, but you meant to use your own. What should you run before creating anything?',
      options: [
        { text: '`az login` again, which always picks your own subscription', explanation: 'Signing in again may still select the same default subscription.' },
        { text: '`az group create`, since resource groups pick the right subscription', explanation: 'It would be created in the work subscription.' },
        { text: '`az logout`, then use the portal instead', explanation: 'The portal has the same issue: you still have to choose the subscription.' },
        { text: '`az account set --subscription` with your subscription\'s name or ID', explanation: 'This switches the subscription that every following command uses.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Before creating anything in Azure, protect the account with MFA, set a budget with a forecast alert, install the CLI and confirm the subscription, because resources cost money whether or not you remember them.',
  resources: [
    { title: 'Explore free Azure services', provider: 'Microsoft Azure', description: 'What is currently free for new accounts, and for how long.', url: 'https://azure.microsoft.com/en-us/pricing/free-services' },
    { title: 'Install the Azure CLI', provider: 'Microsoft Learn', description: 'Official install steps for every operating system.', url: 'https://learn.microsoft.com/en-us/cli/azure/install-azure-cli' },
    { title: 'Create and manage budgets', provider: 'Microsoft Learn', description: 'Budgets in the portal, including alerts and how often they are checked.', url: 'https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets' },
    { title: 'Mandatory multifactor authentication for Azure', provider: 'Microsoft Learn', description: 'Which sign-ins require MFA, and when.', url: 'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-mandatory-multifactor-authentication' },
  ],
  underTheHood: {
    heading: 'Why a budget alert can arrive late',
    paragraphs: [
      "Azure does not count costs as they happen. Each service reports usage, such as hours a database ran or gigabytes stored, to a billing system, which turns usage into costs. According to Microsoft's documentation, that cost data is typically available 8 to 24 hours later, and budgets are compared against it once every 24 hours. Emails usually follow within an hour of the check.",
      "Add those together and an alert can arrive more than a day after spending crosses the line. A resource that costs a lot per hour could keep running for a day or two before you hear about it.",
      "That is why this track uses three habits together. The forecast alert projects the month from current spending, so it can warn early. The Clean up step in each lesson deletes resources as soon as you finish. And small sizes are chosen throughout, so even a forgotten resource costs little. For automatic action, alerts can trigger an action group that runs automation, but deleting what you no longer use is still the most reliable protection.",
    ],
  },
}

export default lesson
