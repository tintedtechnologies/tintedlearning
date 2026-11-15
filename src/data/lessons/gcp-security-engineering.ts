import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Google Cloud databases and data platforms, with `DATABASE_URL` stored in the secret `database-url`, and the Software Engineering lesson Configuration and Secrets. Set the track variables first.',
  goals: [
    'Rotate a database password safely with Secret Manager versions',
    'Check that Study Tracker\'s data is encrypted at rest and in transit',
    'Find resources that anyone on the internet can reach, and decide which are intended',
  ],
  bigIdea: "Security engineering is layering protections so that one mistake does not expose everything. Secret Manager keeps every version of a secret, so a password can be changed, checked and rolled back, and only one service account can read it. Encryption protects data stored on disk and data moving across the network, and regular searches catch access you did not mean to grant.",
  whyItMatters: "Study Tracker's database password has never changed since you created it. Passwords leak in ordinary ways: a screenshot, a shared terminal, a former teammate. When that happens, you need to change it in minutes, without guessing which apps use it or breaking them for long. With the URL in Secret Manager, rotating means one new version, one password change and one deployment, and the old version can be disabled so it can never be used again.",
  goalSections: [
    {
      heading: 'Rotating a secret with versions',
      paragraphs: [
        "Each value added to a secret becomes a numbered version, and versions can be enabled, disabled or destroyed. Disabling makes a version unreadable but recoverable. Destroying deletes its value forever.",
        "Rotating Study Tracker's password takes four steps: add a new version with the new URL, set the new password on the database user, deploy the app pinned to the new version, then disable the old one. Between the password change and the new revision, new connections fail, so expect a minute of errors. The Under the hood section shows how teams avoid even that.",
        "Access is checked per secret. Only `study-tracker` holds Secret Accessor on `database-url`, granted in lesson 7, and the secret's own IAM policy shows exactly that.",
      ],
      example: {
        language: 'text',
        code: code`
          database-url
            version 1   old password   enabled -> disabled after the switch
            version 2   new password   enabled, pinned by the new revision
          Readable by: serviceAccount:study-tracker@...   (Secret Accessor, this secret only)
        `,
      },
    },
    {
      heading: 'Encryption at rest and in transit',
      paragraphs: [
        "Encryption at rest protects stored data if disks or backups were ever taken. Google Cloud encrypts all stored data by default, including Cloud SQL, Cloud Storage and Secret Manager, with keys Google manages. Organizations with strict rules can use their own keys from Cloud KMS, the Key Management Service, called customer-managed encryption keys, or CMEK.",
        "Encryption in transit protects data moving over a network. Browsers reach Cloud Run over HTTPS, Google's APIs use HTTPS, and the database connection uses `sslmode=require`. The instance was created with `--ssl-mode ENCRYPTED_ONLY`, so the server itself refuses unencrypted connections.",
        "Network rules add another layer. The database has only a private address, and Cloud Run sends only private-range traffic into the network. Larger systems also use VPC Service Controls, which stop data leaving a defined perimeter even with valid credentials. This track keeps the simpler setup.",
      ],
      example: {
        language: 'text',
        code: code`
          Path                                   Protection
          Browser -> Cloud Run                   HTTPS, certificate managed by Google
          Cloud Run -> Cloud SQL                 TLS, ENCRYPTED_ONLY, private address only
          App or laptop -> Storage, Secret Mgr   HTTPS, IAM roles
          Data on disk, backups, secrets         encrypted at rest by default
        `,
      },
    },
    {
      heading: 'Finding public access',
      paragraphs: [
        "Cloud Asset Inventory can search every IAM policy in the project. The query `memberTypes:(allUsers OR allAuthenticatedUsers)` finds every resource that anyone on the internet, or anyone with any Google account, can reach.",
        "Each result needs a decision. Study Tracker's Cloud Run service should appear, because `--allow-unauthenticated` made it public on purpose. A bucket or a secret in the list would be a serious mistake to fix at once. Running the search after each change catches mistakes early.",
        "Security Command Center, Google's security posture service, finds many more kinds of misconfiguration, but its free Standard tier is activated for an organization, which a personal account does not have. Companies usually turn it on for every project.",
      ],
      example: {
        language: 'text',
        code: code`
          Result                                                     Decision
          //run.googleapis.com/.../services/study-tracker            intended: the public app
          //storage.googleapis.com/study-notes-jd4821 (if it appears) a mistake: remove the grant
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Rotating the database password and checking access',
    intro: "Run these in your terminal. They rotate the password, pin the app to the new version and disable the old one, then check encryption and public access. If your secret already has more than one version, use the new version's number instead of `2`. In PowerShell, set variables as `$NAME = ...`, keep the braces in `${DB_HOST}`, and write the URL to a file with `Set-Content -NoNewline` for `--data-file`, as in lesson 7.",
    example: {
      language: 'bash',
      code: code`
        DB_HOST=$(gcloud sql instances describe study-tracker-db --format "value(ipAddresses[0].ipAddress)")
        NEW_PASSWORD=$(python -c "import secrets; print(secrets.token_urlsafe(24))")
        printf %s "postgresql://studyadmin:$NEW_PASSWORD@${'$'}{DB_HOST}:5432/studytracker?sslmode=require" | gcloud secrets versions add database-url --data-file -
        gcloud sql users set-password studyadmin --instance study-tracker-db --password "$NEW_PASSWORD"
        gcloud run services update study-tracker --region $REGION --update-secrets DATABASE_URL=database-url:2
        gcloud secrets versions disable 1 --secret database-url
        gcloud secrets versions list database-url --format "table(name.basename(), state)"

        gcloud sql instances describe study-tracker-db --format "value(settings.ipConfiguration.sslMode)"
        gcloud secrets get-iam-policy database-url --flatten "bindings[].members" --format "table(bindings.role, bindings.members)"
        gcloud asset search-all-iam-policies --scope projects/$PROJECT_ID --query "memberTypes:(allUsers OR allAuthenticatedUsers)" --format "value(resource)"
      `,
      output: code`
        NAME  STATE
        2     ENABLED
        1     DISABLED
        ENCRYPTED_ONLY
        ROLE                                MEMBERS
        roles/secretmanager.secretAccessor  serviceAccount:study-tracker@study-tracker-jd4821.iam.gserviceaccount.com
        //run.googleapis.com/projects/study-tracker-jd4821/locations/us-central1/services/study-tracker
      `,
    },
    steps: [
      { code: 'gcloud secrets versions add database-url --data-file -', explanation: "Adds the new URL as version 2. Running instances keep using version 1 until they are replaced." },
      { code: 'gcloud sql users set-password studyadmin ...', explanation: "Changes the password in PostgreSQL. From this moment, new connections with the old URL fail." },
      { code: '--update-secrets DATABASE_URL=database-url:2', explanation: "Deploys a new revision pinned to version 2. Check `/totals` once it is ready to confirm the app connects." },
      { code: 'gcloud secrets versions disable 1 --secret database-url', explanation: "Makes the old URL unreadable. If something still needed it, `versions enable 1` brings it back while you investigate." },
      { code: 'ENCRYPTED_ONLY', explanation: "The database refuses any connection that is not encrypted." },
      { code: '--query "memberTypes:(allUsers OR allAuthenticatedUsers)"', explanation: "Lists every resource with a public grant. Here only the app should appear. The weekly summary function is private, so it does not." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the commands above, then open your app\'s `/totals` to confirm it still reaches the database with the new password.',
      'In the console, open Secret Manager, then `database-url`, and look at its versions and permissions. Note that values are shown only when you choose to view one.',
      'Run the public access search again after each later lesson, and write down in your repository why each result is intended.',
      'Clean up: secrets cost a small amount per active version each month, so destroy versions you no longer need with `gcloud secrets versions destroy 1 --secret database-url --quiet`. Destroying cannot be undone, so do it only once the new version is working.',
    ],
  },
  mistakes: [
    { mistake: 'Changing the database password before the new secret version exists.', fix: 'Add the version first, then change the password, then deploy, so the gap is as short as possible.' },
    { mistake: 'Destroying the old version straight away.', fix: 'Disable it first. Destroy it only once you are sure nothing still needs it.' },
    { mistake: 'Granting Secret Accessor on the whole project.', fix: 'Grant it on each secret, to the one service account that reads it.' },
    { mistake: 'Ignoring public grants because the app works.', fix: 'Search for `allUsers` and `allAuthenticatedUsers` regularly, and remove every grant that is not intended.' },
  ],
  quiz: [
    {
      question: 'You add version 2 of `database-url` but do not deploy. An hour later, the running instances still use the old password. Why?',
      options: [
        { text: 'Secret Manager takes an hour to save versions', explanation: 'The version is available straight away.' },
        { text: 'Cloud Run reads secret values when each instance starts, so running instances keep version 1 until they are replaced', explanation: 'Deploy a new revision, pinned to version 2, to switch.' },
        { text: 'The service account cannot read new versions', explanation: 'Secret Accessor covers every version of the secret.' },
        { text: 'Version 2 must be enabled by hand', explanation: 'New versions are enabled when added.' },
      ],
      answer: 1,
    },
    {
      question: 'The public access search lists `//storage.googleapis.com/study-notes-jd4821`. What should you do?',
      options: [
        { text: 'Nothing, because the bucket is encrypted', explanation: 'Encryption does not stop anyone the IAM policy allows.' },
        { text: 'Disable the old secret version', explanation: 'Secrets are unrelated to the bucket\'s grant.' },
        { text: 'Delete the project', explanation: 'Removing the grant fixes it without losing everything.' },
        { text: 'Remove the `allUsers` or `allAuthenticatedUsers` grant from the bucket', explanation: 'Learners\' notes should never be public. Public access prevention from lesson 3 should have blocked it, so check that too.' },
      ],
      answer: 3,
    },
    {
      question: 'What does encryption at rest protect against?',
      options: [
        { text: 'Someone reading data from stored disks or backups they somehow obtained', explanation: 'Stored data is unreadable without the keys, which are kept separately.' },
        { text: 'Someone reading data as it travels over the network', explanation: 'That is encryption in transit, such as HTTPS and TLS.' },
        { text: 'A service account with a role reading data through the API', explanation: 'Encryption at rest does not stop authorized access. IAM does.' },
        { text: 'A public bucket grant', explanation: 'Google decrypts objects for anyone the policy allows, including the public.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Rotate secrets by adding a version, changing the password and deploying a pinned revision, then disable the old version, rely on encryption at rest and require it in transit, and search regularly for public grants you did not intend.',
  resources: [
    { title: 'Secret Manager overview', provider: 'Google Cloud Documentation', description: 'Secrets, versions, states and access control.', url: 'https://docs.cloud.google.com/secret-manager/docs/overview' },
    { title: 'Default encryption at rest', provider: 'Google Cloud Documentation', description: 'How Google encrypts stored data, and the CMEK option.', url: 'https://docs.cloud.google.com/docs/security/encryption/default-encryption' },
    { title: 'Configure SSL/TLS for Cloud SQL', provider: 'Google Cloud Documentation', description: 'SSL modes and enforcing encrypted connections.', url: 'https://docs.cloud.google.com/sql/docs/postgres/configure-ssl-instance' },
    { title: 'Search IAM policies', provider: 'Google Cloud Documentation', description: 'Finding public and broad grants with Cloud Asset Inventory.', url: 'https://docs.cloud.google.com/asset-inventory/docs/searching-iam-policies' },
  ],
  underTheHood: {
    heading: 'Rotation without any downtime',
    paragraphs: [
      "The rotation in this lesson has a short gap: once the password changes, new connections with the old URL fail until the new revision is ready. For a learning project, a minute of errors is fine. Production systems avoid it with two database users that take turns.",
      "Suppose the app connects as `app_blue`. To rotate, you set a fresh password on `app_green`, a second user with the same permissions, and add a secret version with `app_green`'s URL. You deploy, and new instances connect as `app_green` while old instances keep working as `app_blue`, because its password has not changed.",
      "Once the old revision has drained, nothing uses `app_blue` any more, and you can safely change its password, ready for the next rotation, which goes back the other way. At no moment does a running instance hold a password that no longer works. Secret Manager can also send a notification when a rotation is due, which teams connect to an automated function that performs exactly these steps.",
    ],
  },
}

export default lesson
