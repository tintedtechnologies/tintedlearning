import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Azure databases and data platforms, with the `database-url` secret set on `ca-study-tracker`, and the Software Engineering lesson Configuration and Secrets. Set the track variables first.',
  goals: [
    'Keep secrets in Azure Key Vault and let the app read them with its managed identity',
    'Check that Study Tracker\'s data is encrypted at rest and in transit',
    'Find and fix security weaknesses with Microsoft Defender for Cloud',
  ],
  bigIdea: "Security engineering is layering protections so that one mistake does not expose everything. Secrets live in Azure Key Vault, a service built to store them, and apps read them through managed identities, so no secret appears in code, settings or logs. Encryption protects data stored on disk and data moving across the network, and Microsoft Defender for Cloud continuously checks your resources against security best practices.",
  whyItMatters: "Study Tracker's database URL, with its password, is stored as a Container Apps secret. Anyone with the right access to the app can read it, and if you add more apps, you copy it again and again. When the password needs to change, you have to find every copy. With Key Vault there is one copy, every read is controlled by a role, and changing it in one place updates every app that uses it.",
  goalSections: [
    {
      heading: 'Secrets in Key Vault',
      paragraphs: [
        "Azure Key Vault stores secrets, encryption keys and certificates. Access uses Azure roles, just like storage: you get Key Vault Secrets Officer, so you can create and change secrets, and `id-study-tracker` gets Key Vault Secrets User, so it can read them and nothing more.",
        "Container Apps can point a secret at Key Vault instead of holding the value itself, using the format `keyvaultref:` followed by the secret's address, plus `identityref:` with the identity that should read it. Study Tracker's code does not change at all: it still reads `DATABASE_URL`, which still refers to the `database-url` secret.",
        "If the address leaves out a version, the app uses the latest one. Microsoft's documentation says a container app picks up a newer version within 30 minutes and restarts revisions that use it. Changing the password therefore means one update in Key Vault.",
      ],
      example: {
        language: 'text',
        code: code`
          Before: secret database-url = postgresql://studyadmin:<password>@...
          After:  secret database-url = keyvaultref:https://kv-study-jd4821.vault.azure.net/secrets/database-url,
                                        identityref:<id-study-tracker's resource ID>
          App code: unchanged, still reads DATABASE_URL = secretref:database-url
        `,
      },
    },
    {
      heading: 'Encryption at rest and in transit',
      paragraphs: [
        "Encryption at rest protects stored data if disks or backups were ever taken. Azure Storage, Azure Database for PostgreSQL and Key Vault encrypt stored data automatically with keys Microsoft manages. Organizations with strict rules can use their own keys from Key Vault instead, called customer-managed keys.",
        "Encryption in transit protects data moving over a network. Study Tracker already requires it everywhere: browsers reach the app over HTTPS, the storage account only accepts modern encrypted connections, and the database connection uses `sslmode=require`, while the PostgreSQL server itself enforces encrypted connections through its `require_secure_transport` setting.",
        "Network rules add another layer. Key Vault and Storage accept connections from the internet by default, protected by sign-in and roles. You can turn public access off and add private endpoints, so they are only reachable from your virtual network, at the cost of also blocking your laptop. Larger systems usually do. This track keeps public access on, protected by Entra ID, so you can keep working from your laptop.",
      ],
      example: {
        language: 'text',
        code: code`
          Path                                  Protection
          Browser -> container app              HTTPS
          App -> PostgreSQL                     TLS, sslmode=require, private network only
          App or laptop -> Storage, Key Vault   HTTPS, TLS 1.2 or newer, Entra ID roles
          Data on disk, backups                 encrypted at rest by default
        `,
      },
    },
    {
      heading: 'Defender for Cloud',
      paragraphs: [
        "Microsoft Defender for Cloud checks your subscription against security best practices and lists recommendations, such as a storage account that allows public access or a vault without purge protection. The foundational posture management part, called Foundational CSPM, short for cloud security posture management, is free.",
        "Each recommendation explains the risk and how to fix it. Some fit a learning project, and some are meant for production systems, such as diagnostic logging on every resource. Read them, fix what is cheap and sensible, and decide consciously about the rest.",
        "Paid Defender plans add threat detection, alerts about suspicious activity such as unusual sign-ins to your database. They are worth knowing about but not needed for this track.",
      ],
      example: {
        language: 'text',
        code: code`
          Typical recommendations for a project like Study Tracker (examples, not a full list)
          Key vaults should have deletion protection enabled
          Storage accounts should restrict network access
          Container registries should not allow unrestricted network access
          Diagnostic logs in Key Vault should be enabled
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Moving the database URL into Key Vault',
    intro: "Run these as `studyadmin`. They create a vault, copy the database URL into it from the app's current secret, then point the app's secret at the vault. In PowerShell, set variables as `$NAME = ...`.",
    example: {
      language: 'bash',
      code: code`
        KV=kv-study-$SUFFIX
        az keyvault create --name $KV --resource-group $RG --location $LOCATION --enable-rbac-authorization true --retention-days 7 --tags project=study-tracker
        KV_ID=$(az keyvault show --name $KV --resource-group $RG --query id -o tsv)
        ME=$(az ad signed-in-user show --query id -o tsv)
        APP_ID=$(az identity show --name id-study-tracker --resource-group $RG --query principalId -o tsv)
        az role assignment create --assignee $ME --role "Key Vault Secrets Officer" --scope $KV_ID
        az role assignment create --assignee-object-id $APP_ID --assignee-principal-type ServicePrincipal --role "Key Vault Secrets User" --scope $KV_ID

        DB_URL=$(az containerapp secret show --name ca-study-tracker --resource-group $RG --secret-name database-url --query value -o tsv)
        az keyvault secret set --vault-name $KV --name database-url --value "$DB_URL" --query name -o tsv

        IDENTITY_ID=$(az identity show --name id-study-tracker --resource-group $RG --query id -o tsv)
        az containerapp secret set --name ca-study-tracker --resource-group $RG --secrets "database-url=keyvaultref:https://$KV.vault.azure.net/secrets/database-url,identityref:$IDENTITY_ID"
        REVISION=$(az containerapp show --name ca-study-tracker --resource-group $RG --query properties.latestRevisionName -o tsv)
        az containerapp revision restart --name ca-study-tracker --resource-group $RG --revision $REVISION

        az postgres flexible-server parameter show --resource-group $RG --server-name $PG --name require_secure_transport --query value -o tsv
        az security assessment list --query "[?status.code=='Unhealthy'].displayName" -o tsv
      `,
      output: code`
        database-url
        on
        Key vaults should have deletion protection enabled
        Storage accounts should restrict network access using virtual network rules
      `,
    },
    steps: [
      { code: '--enable-rbac-authorization true --retention-days 7', explanation: "Access is controlled by Azure roles, the same model as everywhere else in this track. Deleted secrets and vaults are kept for 7 days in case of mistakes, the shortest period allowed." },
      { code: '--role "Key Vault Secrets User" --scope $KV_ID', explanation: "The app can read secrets in this vault, but cannot create, change or delete them." },
      { code: 'DB_URL=$(az containerapp secret show ... --secret-name database-url --query value -o tsv)', explanation: "Reads the current value from the app, so you never have to type the password. Do not print it." },
      { code: '--secrets "database-url=keyvaultref:https://$KV.vault.azure.net/secrets/database-url,identityref:$IDENTITY_ID"', explanation: "Replaces the stored value with a reference. With no version at the end of the address, the app always uses the latest version." },
      { code: 'az containerapp revision restart ...', explanation: "Restarts the running revision so it loads the secret from Key Vault now. Check `/totals` afterward to confirm the database still connects." },
      { code: 'on', explanation: "The PostgreSQL server refuses connections that are not encrypted." },
      { code: 'az security assessment list --query "[?status.code==\'Unhealthy\'].displayName" -o tsv', explanation: "Lists Defender for Cloud's open recommendations. New resources can take up to a day to be assessed, and your list will differ from the example." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the commands above, then open your app\'s `/totals` to confirm it still reaches the database.',
      'In the portal, open the container app\'s Secrets page and confirm `database-url` now shows a Key Vault reference instead of a value.',
      'Read your Defender for Cloud recommendations. Choose one to fix, such as turning on purge protection with `az keyvault update --name $KV --resource-group $RG --enable-purge-protection true`, and note that purge protection cannot be turned off again.',
      'Clean up: Key Vault charges per operation, which is tiny for this use, so keep it. If you stop the track, delete it with `az keyvault delete --name $KV --resource-group $RG`. Without purge protection, `az keyvault purge --name $KV` then removes it fully so the name can be reused.',
    ],
  },
  mistakes: [
    { mistake: 'Copying the same secret into several apps\' settings.', fix: 'Keep one copy in Key Vault and reference it from each app, so changing it is a single update.' },
    { mistake: 'Giving the app a role that can change secrets.', fix: 'Grant Key Vault Secrets User, which only reads. People who manage secrets get Secrets Officer.' },
    { mistake: 'Typing secret values into commands or printing them.', fix: 'Copy them between services with commands, as with `secret show` here, and never echo them.' },
    { mistake: 'Ignoring Defender for Cloud recommendations.', fix: 'Review them regularly, fix the cheap and sensible ones, and record why you accept the rest.' },
  ],
  quiz: [
    {
      question: 'You change the database password in Key Vault. The app\'s Key Vault reference has no version in its address. What happens?',
      options: [
        { text: 'Nothing, until you redeploy the image', explanation: 'The secret is not in the image. The reference fetches it from Key Vault.' },
        { text: 'Within about 30 minutes the app picks up the new version and restarts revisions that use it', explanation: 'A reference without a version follows the latest one, as Microsoft\'s documentation describes.' },
        { text: 'The app keeps the old value forever', explanation: 'That only happens if the reference names a specific version.' },
        { text: 'The app is deleted', explanation: 'Secret changes never delete apps.' },
      ],
      answer: 1,
    },
    {
      question: 'Which role should `id-study-tracker` have on the vault?',
      options: [
        { text: 'Key Vault Secrets Officer', explanation: 'That can create, change and delete secrets, more than the app needs.' },
        { text: 'Owner', explanation: 'Owner could also grant access to others and delete the vault.' },
        { text: 'Key Vault Secrets User', explanation: 'It can read secret values and nothing more, which is exactly what the app needs.' },
        { text: 'No role, because the identity is in the same resource group', explanation: 'Being in the same group gives no access. A role is required.' },
      ],
      answer: 2,
    },
    {
      question: 'What does encryption at rest protect against?',
      options: [
        { text: 'Someone reading data from stored disks or backups they somehow obtained', explanation: 'Stored data is unreadable without the keys, which are kept separately.' },
        { text: 'Someone reading data as it travels over the network', explanation: 'That is encryption in transit, such as HTTPS and TLS.' },
        { text: 'A user with valid access reading data through the app', explanation: 'Encryption at rest does not stop authorized access. Roles and app logic do.' },
        { text: 'Bugs in Study Tracker\'s code', explanation: 'Encryption protects data, not code correctness.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Keep each secret once in Key Vault and let apps read it with a managed identity and a read-only role, rely on encryption at rest and require it in transit, and use Defender for Cloud to keep finding what to fix next.',
  resources: [
    { title: 'About Azure Key Vault', provider: 'Microsoft Learn', description: 'Secrets, keys, certificates and how access works.', url: 'https://learn.microsoft.com/en-us/azure/key-vault/general/overview' },
    { title: 'Manage secrets in Container Apps', provider: 'Microsoft Learn', description: 'Key Vault references, versions and how updates are picked up.', url: 'https://learn.microsoft.com/en-us/azure/container-apps/manage-secrets' },
    { title: 'Azure encryption overview', provider: 'Microsoft Learn', description: 'Encryption at rest and in transit across Azure services.', url: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/encryption-overview' },
    { title: 'Cloud security posture management', provider: 'Microsoft Learn', description: 'What Defender for Cloud checks, and the free and paid plans.', url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/concept-cloud-security-posture-management' },
  ],
  underTheHood: {
    heading: 'Defense in depth',
    paragraphs: [
      "No single protection is perfect, so security engineers stack several, each covering for the others, a practice called defense in depth. Study Tracker's database now has five layers.",
      "It has no public address, so the internet cannot reach it. Its subnet rules let only the apps subnet in. It requires encrypted connections. It requires a password, which lives in Key Vault, readable only by one identity with a read-only role. And its stored data and backups are encrypted.",
      "An attacker would need to defeat several of these at once. A leaked connection URL alone is useless from outside the network. Access to the network alone is useless without the password. That is the point of layers: when one fails, as one eventually will, the others still hold. The same thinking guides which Defender recommendations matter most: those that remove a layer entirely, such as public network access, come first.",
    ],
  },
}

export default lesson
