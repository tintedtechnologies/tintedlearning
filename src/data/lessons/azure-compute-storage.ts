import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { syncNotesAzure, testSyncNotesAzure } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Azure identity and resource organization, signed in as `studyadmin`, with `rg-study-tracker` and `id-study-tracker` created. Set the track variables in your terminal first.',
  goals: [
    'Choose between virtual machines, containers and serverless functions for a workload',
    'Choose between object, block and file storage, and create a locked-down storage account',
    'Store Study Tracker\'s notes in Blob Storage and read them back without any key',
  ],
  bigIdea: "Azure offers compute at different levels: whole virtual machines you manage, containers it runs for you, and functions that run only when triggered. Storage comes in three shapes too: object storage for files, block storage as disks, and file shares. Choosing the most managed option that fits saves you work, and for Study Tracker that means containers for the app and Blob Storage for notes.",
  whyItMatters: "In Software Engineering, Study Tracker's notes lived in a `notes` folder on one computer. In the cloud, the app may run as several copies, each replaced at any time, so a local folder is the wrong home: each copy would see different notes, and they would vanish when a copy restarts. Moving notes to Blob Storage gives every copy the same files, kept safely in one place.",
  goalSections: [
    {
      heading: 'Choosing compute',
      paragraphs: [
        "A virtual machine, or VM, is a whole computer you rent. You choose the operating system, install updates and fix it when it breaks. Use one when you need full control, such as special software or settings.",
        "Containers run your Docker image without you managing the machine underneath. Azure Container Apps runs containers, handles HTTPS, scales the number of copies with traffic and can scale to zero when idle. Kubernetes, through AKS, gives far more control at the cost of far more to manage, which lesson 8 weighs up.",
        "Serverless functions, through Azure Functions, run small pieces of code when something triggers them, such as a timer or a new file, and cost nothing while idle. For Study Tracker: the API runs on Container Apps, because it already has a Docker image, and the weekly summary in lesson 9 uses Functions.",
      ],
      example: {
        language: 'text',
        code: code`
          Option                 You manage                    Good for
          Virtual machine        OS, updates, scaling          full control, unusual software
          Azure Container Apps   your image and settings       web APIs like Study Tracker
          AKS (Kubernetes)       cluster, nodes, many settings many services, large teams
          Azure Functions        your code only                small jobs on a schedule or event
        `,
      },
    },
    {
      heading: 'Choosing storage',
      paragraphs: [
        "Object storage keeps whole files, called blobs, reached over HTTPS by name. In Azure it is Blob Storage, organized as storage account, then container, then blob. It suits uploads, backups and Study Tracker's notes. Block storage is a disk attached to one virtual machine: Azure managed disks. File storage, Azure Files, is a shared folder that several machines can mount. Databases are a separate choice, covered in lesson 7.",
        "Lock a new storage account down from the start. Turn off anonymous public access to blobs, require a modern encryption version for connections, and turn off shared key access. That last setting disables the account's all-powerful access keys, so the only way in is through Microsoft Entra ID and RBAC roles.",
        "Storage account names must be unique across all of Azure, 3 to 24 lowercase letters and digits. That is where your `SUFFIX` comes in.",
      ],
      example: {
        language: 'text',
        code: code`
          Storage account ststudyjd4821          one per app, unique name
            Container notes                      like a top-level folder
              Blob biology.md                    one file
              Blob algebra.md
              Blob history.md
        `,
      },
    },
    {
      heading: 'Reading notes with a managed identity',
      paragraphs: [
        "With shared keys turned off, access comes from roles. You give yourself Storage Blob Data Contributor, so you can upload notes from your laptop, and give `id-study-tracker` Storage Blob Data Reader, so the app can only read them. New role assignments can take a few minutes to take effect.",
        "The CLI's storage commands need `--auth-mode login`, which tells them to use your sign-in rather than a key.",
        "In Python, `ContainerClient` from the `azure-storage-blob` package, with `DefaultAzureCredential` from `azure-identity`, reads the container. On your laptop it uses your `az login`, and in Azure the app's managed identity. Study Tracker gets a small `sync_notes.py`, shown in Try it yourself, that downloads the notes into the local `notes` folder, which the indexing from AI Engineering already reads.",
      ],
      example: {
        language: 'text',
        code: code`
          Who                  Role                            On
          you (studyadmin)     Storage Blob Data Contributor   the storage account
          id-study-tracker     Storage Blob Data Reader        the storage account
          anyone else          nothing                         anonymous access is off
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Putting Study Tracker\'s notes in Blob Storage',
    intro: "Run these as `studyadmin`, from your `study-tracker` folder, which has the `notes` folder from AI Engineering. In PowerShell, set variables as `$NAME = ...` instead of `NAME=$(...)`, exactly as in earlier lessons.",
    example: {
      language: 'bash',
      code: code`
        STORAGE=ststudy$SUFFIX
        az storage account create --name $STORAGE --resource-group $RG --location $LOCATION --sku Standard_LRS --kind StorageV2 --allow-blob-public-access false --min-tls-version TLS1_2 --allow-shared-key-access false --tags project=study-tracker

        STORAGE_ID=$(az storage account show --name $STORAGE --resource-group $RG --query id -o tsv)
        ME=$(az ad signed-in-user show --query id -o tsv)
        APP_ID=$(az identity show --name id-study-tracker --resource-group $RG --query principalId -o tsv)
        az role assignment create --assignee $ME --role "Storage Blob Data Contributor" --scope $STORAGE_ID
        az role assignment create --assignee-object-id $APP_ID --assignee-principal-type ServicePrincipal --role "Storage Blob Data Reader" --scope $STORAGE_ID

        az storage container create --account-name $STORAGE --name notes --auth-mode login
        az storage blob upload-batch --account-name $STORAGE --destination notes --source notes --auth-mode login
        az storage blob list --account-name $STORAGE --container-name notes --auth-mode login --query "[].name" -o tsv
      `,
      output: code`
        algebra.md
        biology.md
        history.md
      `,
    },
    steps: [
      { code: '--sku Standard_LRS --kind StorageV2', explanation: "Standard performance, with three copies kept in one data center, called locally redundant storage. It is the cheapest option and enough for a learning project. Lesson 11 covers stronger redundancy." },
      { code: '--allow-blob-public-access false --min-tls-version TLS1_2 --allow-shared-key-access false', explanation: "Three locks: no anonymous access, only modern encrypted connections, and no access keys. Access now comes only from roles." },
      { code: 'APP_ID=$(az identity show --name id-study-tracker ... --query principalId -o tsv)', explanation: "The managed identity's principal ID, which is what role assignments use." },
      { code: '--assignee-principal-type ServicePrincipal --role "Storage Blob Data Reader"', explanation: "Study Tracker can read notes and nothing else. Naming the principal type avoids a lookup that can fail for brand-new identities." },
      { code: 'az storage container create ... --auth-mode login', explanation: "Uses your sign-in instead of a key. If it fails with a permissions error, wait a few minutes for your new role to take effect and try again." },
      { code: 'az storage blob upload-batch ... --source notes', explanation: "Uploads every file in your local `notes` folder in one command." },
      { code: '$ STORAGE_ACCOUNT=ststudyjd4821 python sync_notes.py\nDownloaded 3 notes', explanation: "Run in a fresh folder, `sync_notes.py` downloads the notes using your `az login`. Install its packages first with `python -m pip install azure-identity azure-storage-blob`. In PowerShell, set the variable first with `$env:STORAGE_ACCOUNT = \"ststudyjd4821\"`." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the commands above, then open the storage account in the Azure portal and find your notes under Containers.',
      'Add `sync_notes.py` and `test_sync_notes.py` below, add `azure-identity` and `azure-storage-blob` to `requirements.txt`, and run `python -m pytest`.',
      'Delete your local `notes` folder, run `sync_notes.py` with `STORAGE_ACCOUNT` set, then run `index_notes.py` from AI Engineering. Your notes are back and indexed, straight from Azure.',
      'Clean up: Blob Storage costs very little for a few small files, so keep the account for the following lessons. To remove only it, run `az storage account delete --name $STORAGE --resource-group $RG --yes`.',
    ],
    files: [
      { language: 'python', filename: 'sync_notes.py', code: syncNotesAzure, runnable: false },
      { language: 'python', filename: 'test_sync_notes.py', code: testSyncNotesAzure, files: { 'sync_notes.py': syncNotesAzure }, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Storing files on an app\'s local disk in the cloud.', fix: 'Copies of the app come and go. Keep files in Blob Storage, where every copy sees the same data.' },
    { mistake: 'Leaving anonymous blob access or shared keys turned on.', fix: 'Turn both off when creating the account, and grant access with roles.' },
    { mistake: 'Giving the app Storage Blob Data Contributor when it only reads.', fix: 'Grant Storage Blob Data Reader. Write access is a separate decision, made only if a feature needs it.' },
    { mistake: 'Starting with a virtual machine out of habit.', fix: 'Pick the most managed option that fits. A VM means patching and repairing an operating system yourself.' },
  ],
  quiz: [
    {
      question: 'Which Azure service fits Study Tracker\'s web API best?',
      options: [
        { text: 'A virtual machine with Docker installed by hand', explanation: 'It works, but you would patch, secure and scale the machine yourself.' },
        { text: 'Azure Files', explanation: 'That is a shared folder for storage, not a place to run code.' },
        { text: 'Azure Container Apps', explanation: 'It runs the existing Docker image, handles HTTPS and scaling, and can scale to zero when idle.' },
        { text: 'A managed disk', explanation: 'A disk stores data for a virtual machine. It runs nothing.' },
      ],
      answer: 2,
    },
    {
      question: 'Shared key access is turned off on the storage account. `az storage blob list` without `--auth-mode login` fails. Why?',
      options: [
        { text: 'Without `--auth-mode login`, the CLI tries to use an access key, which the account no longer accepts', explanation: 'With keys disabled, requests must use your Entra ID sign-in and RBAC roles.' },
        { text: 'The container is empty', explanation: 'An empty container lists nothing, but it does not fail.' },
        { text: 'Storage accounts can only be used from the portal', explanation: 'The CLI and SDKs work fine with the right authentication.' },
        { text: 'The account name is too long', explanation: 'A bad name would have failed when the account was created.' },
      ],
      answer: 0,
    },
    {
      question: 'Study Tracker only reads notes. Which role should `id-study-tracker` have on the storage account?',
      options: [
        { text: 'Owner', explanation: 'Owner could delete the account and grant access to others.' },
        { text: 'Storage Blob Data Contributor', explanation: 'That allows writing and deleting blobs, which the app does not need.' },
        { text: 'Contributor', explanation: 'Contributor manages the account itself, such as deleting it, which the app never needs.' },
        { text: 'Storage Blob Data Reader', explanation: 'It can read blobs and nothing more, which is exactly the job.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Run the app on the most managed compute that fits, keep its files in a locked-down Blob Storage account, and let it read them through a managed identity with a read-only role.',
  resources: [
    { title: 'Choose an Azure compute service', provider: 'Microsoft Learn', description: 'A decision guide for VMs, containers, functions and more.', url: 'https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree' },
    { title: 'Introduction to Azure Blob Storage', provider: 'Microsoft Learn', description: 'Accounts, containers and blobs, and when to use them.', url: 'https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction' },
    { title: 'Prevent Shared Key authorization', provider: 'Microsoft Learn', description: 'Why and how to turn off storage account keys.', url: 'https://learn.microsoft.com/en-us/azure/storage/common/shared-key-authorization-prevent' },
  ],
  underTheHood: {
    heading: 'Why object storage scales so well',
    paragraphs: [
      "A disk is shaped like a hard drive: fixed size, attached to one machine, with a file system on top that the operating system manages. Object storage drops all of that. Each blob is addressed directly by a name, such as `notes/biology.md`, through a web request, and the service spreads blobs across many machines behind the scenes.",
      "Because there is no single disk and no shared file system to coordinate, the service can grow almost without limit and serve many readers at once. Every copy of Study Tracker can read the same notes at the same time without any of them mounting anything.",
      "The trade-off is that blobs are written whole. You replace a file rather than editing a few bytes in the middle, and listing or renaming many blobs is slower than on a local disk. That suits notes, images and backups perfectly, and suits a database very badly, which is why databases use their own storage and are the subject of a later lesson.",
    ],
  },
}

export default lesson
