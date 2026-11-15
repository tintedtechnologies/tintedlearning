import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Azure Cloud Engineering overview, with the Azure CLI signed in, MFA on and a budget alert set. Set the variables from that lesson in your terminal first.',
  goals: [
    'Explain how Azure grants access with users, roles and scopes',
    'Give a person only the access a job needs, at the smallest scope that works',
    'Create a managed identity so Study Tracker can reach Azure services without any password',
  ],
  bigIdea: "Azure decides who can do what with role-based access control, or RBAC. A role assignment gives a security principal, meaning a user, a group or an app's identity, a role, a named set of allowed actions, at a scope: a subscription, a resource group or one resource. Least privilege means the smallest role at the smallest scope that still does the job, and apps get managed identities, so they can prove who they are without a secret in your code.",
  whyItMatters: "Study Tracker will need to read notes from storage and pull its image from a registry. The quick way is to paste an access key into an environment variable. Then one leaked log line or committed file gives a stranger full control of your storage. With a managed identity that can only read one container, there is no key to leak at all, and even a compromised app can do very little.",
  goalSections: [
    {
      heading: 'Users, roles and scopes',
      paragraphs: [
        "A security principal is anything that can be given access: a user, a group, or an identity used by an app. Your sign-up account is a user, and the most powerful one in your tenant: it is a Global Administrator of the directory and Owner of the subscription.",
        "A role is a list of allowed actions. Reader can look but not change. Contributor can create and change resources but cannot give anyone access. Owner can do everything, including granting access. Specialized roles exist for specific jobs, such as Storage Blob Data Reader, which can read files in storage and nothing else.",
        "A scope says where the role applies, and access flows downward. A role on a subscription applies to every resource group in it. A role on one resource group applies only to that group and what is inside it.",
      ],
      example: {
        language: 'text',
        code: code`
          One role assignment = who + what + where

          Who (principal)        What (role)                     Where (scope)
          studyadmin (a user)    Contributor                     resource group rg-study-tracker
          id-study-tracker       Storage Blob Data Reader        storage account, from lesson 3
          id-study-tracker       AcrPull                         container registry, from lesson 5
        `,
      },
    },
    {
      heading: 'Least privilege for people',
      paragraphs: [
        "Do daily work with an account that can only affect what you are working on. If that account is ever phished, or you run a command in the wrong place, the damage stays inside one resource group instead of reaching the whole subscription and directory.",
        "In this lesson you create a user called `studyadmin` with two roles on Study Tracker's resource group only: Contributor, to build things, and Role Based Access Control Administrator, so it can give Study Tracker's identity the narrow roles later lessons need. It gets no rights anywhere else.",
        "Keep your original account for the rare jobs that need it, such as registering a new Azure service for the subscription. Each lesson says when that happens. In an organization, administrators would create this kind of limited account for you.",
      ],
      example: {
        language: 'text',
        code: code`
          Account                     Used for                              Access
          Your sign-up account        rare subscription-wide jobs           Owner, Global Administrator
          studyadmin                  all daily work in this track          Contributor + RBAC Administrator,
                                                                            on rg-study-tracker only
          id-study-tracker (the app)  reading notes, pulling its image      a few data roles, per resource
        `,
      },
    },
    {
      heading: 'Managed identities for apps',
      paragraphs: [
        "A managed identity is an identity in Microsoft Entra ID that Azure manages for you. You attach it to a resource, such as Study Tracker's container app, and the app can then get short-lived access tokens for other Azure services. There is no password or key to store, rotate or leak.",
        "There are two kinds. A system-assigned identity is created with one resource and deleted with it. A user-assigned identity is a resource of its own, which you can attach to several resources and grant roles before the app even exists. Study Tracker uses a user-assigned identity, `id-study-tracker`, so later lessons can grant it access step by step.",
        "In Python, the `azure-identity` package's `DefaultAzureCredential` finds the right credentials automatically: your `az login` session on your laptop, and the managed identity in Azure. The same code works in both places.",
      ],
      example: {
        language: 'text',
        code: code`
          On your laptop:   DefaultAzureCredential -> your az login session
          In Azure:         DefaultAzureCredential -> the managed identity id-study-tracker
          In both:          no key or password in code, .env or environment variables
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Setting up identities for Study Tracker',
    intro: "Run these with your sign-up account, after setting the variables from the overview lesson. They create the resource group, a daily-use user with access to that group only, and Study Tracker's managed identity. The shell commands are for bash; the PowerShell differences are explained in the steps.",
    example: {
      language: 'bash',
      code: code`
        az group create --name $RG --location $LOCATION --tags project=study-tracker
        RG_ID=$(az group show --name $RG --query id -o tsv)

        DOMAIN=$(az rest --method get --url https://graph.microsoft.com/v1.0/domains --query "value[?isDefault].id" -o tsv)
        read -rs PASSWORD
        az ad user create --display-name "Study Tracker Admin" --user-principal-name studyadmin@$DOMAIN --password "$PASSWORD" --force-change-password-next-sign-in true

        az role assignment create --assignee studyadmin@$DOMAIN --role Contributor --scope $RG_ID
        az role assignment create --assignee studyadmin@$DOMAIN --role "Role Based Access Control Administrator" --scope $RG_ID

        az identity create --name id-study-tracker --resource-group $RG --tags project=study-tracker
        az role assignment list --assignee studyadmin@$DOMAIN --all --query "[].{role:roleDefinitionName, scope:scope}" -o table
      `,
      output: code`
        Role                                     Scope
        ---------------------------------------  ----------------------------------------------------------------
        Contributor                              /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-study-tracker
        Role Based Access Control Administrator  /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-study-tracker
      `,
    },
    steps: [
      { code: 'az group create --name $RG --location $LOCATION --tags project=study-tracker', explanation: "Creates the resource group that will hold everything in this track. The tag labels it, which helps with costs and governance later." },
      { code: 'RG_ID=$(az group show --name $RG --query id -o tsv)', explanation: "Saves the group's full ID, its scope, for role assignments. In PowerShell, write `$RG_ID = az group show --name $RG --query id -o tsv`, and the same pattern for `DOMAIN`." },
      { code: 'read -rs PASSWORD', explanation: "Asks for the new user's first password without showing it or saving it in your shell history. In PowerShell, use `$PASSWORD = Read-Host \"Password\"`. Choose a strong password you will change at first sign-in." },
      { code: '--force-change-password-next-sign-in true', explanation: "The first sign-in as `studyadmin` forces a new password and asks you to set up MFA for this user too." },
      { code: '--role "Role Based Access Control Administrator" --scope $RG_ID', explanation: "Lets `studyadmin` grant roles, but only inside this resource group. Later lessons use it to give Study Tracker's identity narrow access." },
      { code: 'az identity create --name id-study-tracker --resource-group $RG', explanation: "Creates the user-assigned managed identity. It costs nothing on its own and has no access to anything yet." },
      { code: 'az role assignment list --assignee studyadmin@$DOMAIN --all', explanation: "Confirms exactly two roles, both scoped to `rg-study-tracker`. Your real subscription ID appears where the zeros are." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the commands above with your sign-up account.',
      'Run `az logout`, then `az login` and sign in as `studyadmin`. Change the password and set up MFA when asked.',
      'As `studyadmin`, run `az group list -o table`. You should see only `rg-study-tracker`. Then try `az group create --name rg-test --location $LOCATION` and read the authorization error: least privilege working.',
      'Clean up: the resource group, the user and the identity cost nothing, so keep them for the next lesson. If you stop the track, delete them with your sign-up account: `az group delete --name $RG --yes`, then `az ad user delete --id studyadmin@$DOMAIN`.',
    ],
  },
  mistakes: [
    { mistake: 'Doing daily work with the account that owns the subscription.', fix: 'Use a limited account like `studyadmin`, and keep the owner account for rare subscription-wide jobs.' },
    { mistake: 'Granting roles at the subscription when one resource group would do.', fix: 'Use the smallest scope that works. Access flows down, so a subscription-wide role reaches everything.' },
    { mistake: 'Giving the app an access key or connection string.', fix: 'Use a managed identity with a narrow data role, so there is no secret to leak.' },
    { mistake: 'Typing a password directly into a command.', fix: 'Read it into a variable with a prompt, so it never appears on screen or in your shell history.' },
  ],
  quiz: [
    {
      question: '`studyadmin` has Contributor on `rg-study-tracker` only. Can it delete a resource group belonging to another project in the same subscription?',
      options: [
        { text: 'Yes, because Contributor can delete resources', explanation: 'Contributor can delete, but only within the scope it was granted.' },
        { text: 'No, because the role only applies inside rg-study-tracker', explanation: 'Scope limits where a role works. The other group is outside it.' },
        { text: 'Yes, because both groups are in the same subscription', explanation: 'Access flows down from a scope, never sideways to other groups.' },
        { text: 'Only if it signs in with MFA', explanation: 'MFA proves who you are. It does not add permissions.' },
      ],
      answer: 1,
    },
    {
      question: 'Study Tracker\'s container app needs to read notes from storage. What is the best way to give it access?',
      options: [
        { text: 'Put the storage account key in an environment variable', explanation: 'A key gives full control of the account, and it can leak through logs or code.' },
        { text: 'Sign in to Azure inside the container with your own account', explanation: 'Your account has far more access than the app needs, and its password would be inside the app.' },
        { text: 'Give the app Owner on the subscription so it never hits an error', explanation: 'That gives a compromised app control of everything.' },
        { text: 'Attach a managed identity with Storage Blob Data Reader on that storage account', explanation: 'No secret to leak, and the app can only read storage data, in one place.' },
      ],
      answer: 3,
    },
    {
      question: 'What can a user with only the Contributor role on a resource group not do there?',
      options: [
        { text: 'Give other users or identities access by assigning roles', explanation: 'Contributor deliberately excludes managing access. That needs a role such as Owner or Role Based Access Control Administrator.' },
        { text: 'Create a storage account', explanation: 'Contributor can create and change resources.' },
        { text: 'Delete a resource in the group', explanation: 'Contributor can delete resources in its scope.' },
        { text: 'Read the group\'s resources', explanation: 'Contributor includes reading.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Grant every person and app the smallest role at the smallest scope that does the job, work day to day with a limited account, and give apps managed identities instead of keys.',
  resources: [
    { title: 'What is Azure role-based access control?', provider: 'Microsoft Learn', description: 'Principals, roles, scopes and how assignments combine.', url: 'https://learn.microsoft.com/en-us/azure/role-based-access-control/overview' },
    { title: 'Azure built-in roles', provider: 'Microsoft Learn', description: 'Every built-in role and what it allows.', url: 'https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles' },
    { title: 'What are managed identities?', provider: 'Microsoft Learn', description: 'System-assigned and user-assigned identities, and which services support them.', url: 'https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview' },
  ],
  underTheHood: {
    heading: 'How a managed identity proves who it is',
    paragraphs: [
      "When an app with a managed identity wants to call another Azure service, it does not send a password. It asks a local token endpoint that the Azure platform provides inside the resource, reachable only from that resource. For a container app, the address is given to the app in an environment variable.",
      "The platform already knows which resource is asking, because it is running it. It asks Microsoft Entra ID for an access token for that resource's identity and hands it back. The token is short-lived and says who the caller is and which service it is meant for. The receiving service, such as Storage, checks the token's signature and then checks the identity's role assignments to decide what it may do.",
      "Because tokens expire quickly and are only issued from inside the resource, there is nothing long-lived to steal. Libraries such as `DefaultAzureCredential` request and refresh tokens automatically, which is why application code never needs to handle them.",
    ],
  },
}

export default lesson
