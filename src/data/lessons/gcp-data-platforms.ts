import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { configDb, dbPortable, embedCachePortable, requirementsGcp, testDbPortable } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Monitoring, reliability, and cost on Google Cloud, with `study-tracker` running on Cloud Run, the network from lesson 4, and the Software Engineering lesson Databases and SQL. Set the track variables plus `SA` and `REGISTRY`.',
  goals: [
    'Choose a managed database and say what Cloud SQL runs for you',
    'Create a private Cloud SQL for PostgreSQL instance and connect Study Tracker to it securely',
    'Check that automatic backups exist, and keep the database\'s cost under control',
  ],
  bigIdea: "A managed database is a database server the cloud provider runs for you: it installs updates, takes backups and replaces failed hardware, while you design tables and write queries. Study Tracker moves from SQLite inside its Cloud Run instance to Cloud SQL for PostgreSQL with a private address. Its sessions finally survive deployments, scaling to zero and replaced instances.",
  whyItMatters: "Each time Cloud Run starts a new revision or scales to zero, every Study Tracker session is lost. A demo can live with that, but a real app cannot. A database that lives apart from the app keeps data whatever happens to the instances, and because several instances can share it, Study Tracker can also scale out, as Scalability described.",
  goalSections: [
    {
      heading: 'What Cloud SQL runs for you',
      paragraphs: [
        "Cloud SQL runs PostgreSQL, MySQL and SQL Server as a managed service. You choose the version, the machine size, the storage and the backup settings. Google installs updates in a maintenance window, takes automatic backups and replaces failed hardware.",
        "Cloud SQL has two editions. Enterprise Plus adds performance and availability features, and it is the default for recent PostgreSQL versions. Study Tracker uses Enterprise with `db-f1-micro`, a small shared-core machine for testing that Google's documentation says is not covered by the service level agreement.",
        "You pay for the instance while it runs and for its storage. You can stop it when not in use, and storage is still charged while it is stopped.",
      ],
      example: {
        language: 'text',
        code: code`
          You do                               Google does
          choose engine, version, edition, size install updates in a maintenance window
          design tables, write queries          take daily backups and keep transaction logs
          decide who can connect                replace failed hardware
          choose backup retention               keep the instance available
        `,
      },
    },
    {
      heading: 'Study Tracker\'s code for PostgreSQL',
      paragraphs: [
        "Study Tracker's SQL was written for SQLite. PostgreSQL accepts almost all of it, with two differences: placeholders are `%s` instead of `?`, and automatic IDs use an identity column instead of `AUTOINCREMENT`. The new `db.py` translates both in a small class, `PostgresConnection`, so the other modules keep their SQL unchanged. These are the same files as in the Azure and AWS tracks, because the code does not care which cloud runs it.",
        "When `DATABASE_URL` is set, Study Tracker uses PostgreSQL through the `psycopg` package. Without it, SQLite works as before, so your laptop and your tests need no server. Saving a session now uses `RETURNING id`, and the embedding cache uses `ON CONFLICT`, which both databases understand.",
        "The changes were tested against a real PostgreSQL server: sessions, totals, the notes index, the cache, plans and feedback all work.",
      ],
      example: {
        language: 'python',
        code: code`
          def translate(sql):
              sql = sql.replace("INTEGER PRIMARY KEY AUTOINCREMENT", "INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY")
              return sql.replace("?", "%s")


          print(translate("SELECT subject, SUM(minutes) FROM sessions WHERE studied_on >= ? GROUP BY subject"))
        `,
        output: 'SELECT subject, SUM(minutes) FROM sessions WHERE studied_on >= %s GROUP BY subject',
      },
    },
    {
      heading: 'Connecting securely, with backups',
      paragraphs: [
        "The instance joins `vpc-study-tracker` through the private services access you set up in lesson 4, with `--no-assign-ip`, so it has only a private address. Cloud Run reaches it through Direct VPC egress into `snet-apps`. `--ssl-mode ENCRYPTED_ONLY` makes the server refuse unencrypted connections, and `sslmode=require` in the URL insists on encryption from the app's side too.",
        "The connection URL contains the password, so it goes into Secret Manager, Google Cloud's service for secrets, as the secret `database-url`. Cloud Run's `--set-secrets` exposes it to the app as the `DATABASE_URL` environment variable, read with the service's own service account, which gets the Secret Accessor role on this one secret.",
        "Automatic daily backups and point-in-time recovery are on, kept for seven days, and the resilience lesson restores one. Your laptop is outside the network and cannot connect to the database, and that is intended.",
      ],
      example: {
        language: 'text',
        code: code`
          DATABASE_URL (stored only in Secret Manager, never committed or logged):
          postgresql://studyadmin:<password>@10.100.0.3:5432/studytracker?sslmode=require

          Cloud Run settings:
            secret   DATABASE_URL <- database-url:latest
            network  vpc-study-tracker / snet-apps, private ranges only
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Creating the database and switching Study Tracker to it',
    intro: "First update your code with the files in Try it yourself, run the tests, then build and push a `v3` image. Creating the instance takes several minutes. In PowerShell, set variables as `$NAME = ...`, keep the braces in `${DB_HOST}`, and create the secret from a file written with `Set-Content -NoNewline db-url.txt $DATABASE_URL`, using `--data-file db-url.txt`, then delete the file.",
    example: {
      language: 'bash',
      code: code`
        gcloud services enable sqladmin.googleapis.com secretmanager.googleapis.com
        gcloud sql instances create study-tracker-db --database-version POSTGRES_17 --edition enterprise --tier db-f1-micro --region $REGION --network vpc-study-tracker --no-assign-ip --storage-type SSD --storage-size 10 --backup-start-time 03:00 --enable-point-in-time-recovery --retained-backups-count 7 --ssl-mode ENCRYPTED_ONLY
        gcloud beta sql instances patch study-tracker-db --update-labels project=study-tracker

        DB_PASSWORD=$(python -c "import secrets; print(secrets.token_urlsafe(24))")
        gcloud sql users create studyadmin --instance study-tracker-db --password "$DB_PASSWORD"
        gcloud sql databases create studytracker --instance study-tracker-db
        DB_HOST=$(gcloud sql instances describe study-tracker-db --format "value(ipAddresses[0].ipAddress)")

        DATABASE_URL="postgresql://studyadmin:$DB_PASSWORD@${'$'}{DB_HOST}:5432/studytracker?sslmode=require"
        printf %s "$DATABASE_URL" | gcloud secrets create database-url --data-file - --replication-policy automatic --labels project=study-tracker
        gcloud secrets add-iam-policy-binding database-url --member serviceAccount:$SA --role roles/secretmanager.secretAccessor

        docker build --platform linux/amd64 -t $REGISTRY/study-tracker:v3 .
        docker push $REGISTRY/study-tracker:v3
        gcloud run deploy study-tracker --image $REGISTRY/study-tracker:v3 --region $REGION --network vpc-study-tracker --subnet snet-apps --vpc-egress private-ranges-only --set-secrets DATABASE_URL=database-url:latest

        gcloud sql instances describe study-tracker-db --format "table(state, settings.ipConfiguration.ipv4Enabled, settings.backupConfiguration.enabled, settings.backupConfiguration.pointInTimeRecoveryEnabled)"
      `,
      output: code`
        STATE     IPV4_ENABLED  ENABLED  POINT_IN_TIME_RECOVERY_ENABLED
        RUNNABLE  False         True     True
      `,
    },
    steps: [
      { code: '--database-version POSTGRES_17 --edition enterprise --tier db-f1-micro', explanation: "PostgreSQL 17 on the Enterprise edition's smallest shared-core machine. Without `--edition enterprise`, recent versions default to Enterprise Plus, which does not offer this size." },
      { code: '--network vpc-study-tracker --no-assign-ip', explanation: "Gives the instance a private address from the range reserved in lesson 4, and no public address." },
      { code: '--enable-point-in-time-recovery --retained-backups-count 7', explanation: "Daily backups kept for seven days, plus the transaction logs that make restoring to any moment possible." },
      { code: 'gcloud beta sql instances patch study-tracker-db --update-labels project=study-tracker', explanation: "Labels the instance. The generally available Cloud SQL commands have no label flag, so this uses the beta group installed in lesson 6." },
      { code: 'printf %s "$DATABASE_URL" | gcloud secrets create database-url --data-file -', explanation: "Creates the secret from standard input, with no trailing newline, so the password never appears in a file or in your command history." },
      { code: '--set-secrets DATABASE_URL=database-url:latest', explanation: "Gives the app the latest version as `DATABASE_URL` when each instance starts. The other settings from lesson 5, such as the service account, stay as they were." },
      { code: 'RUNNABLE  False  True  True', explanation: "Running, no public address, backups on, point-in-time recovery on." },
    ],
  },
  tryIt: {
    instructions: [
      'Replace `config.py`, `db.py` and `embed_cache.py` with the versions below, update `requirements.txt`, run `python -m pip install -r requirements.txt` and `python -m pytest`. Everything still runs on SQLite.',
      'Run the commands above. Save sessions through your app\'s `/docs`, deploy any small change as `v4`, and check that the sessions survived.',
      'List your backups with `gcloud sql backups list --instance study-tracker-db`. The first automatic one appears within a day.',
      'Clean up: the instance costs money every hour it runs. To pause it, run `gcloud sql instances patch study-tracker-db --activation-policy NEVER`, and `ALWAYS` to start it again. Storage is still charged while it is stopped. To remove it, run `gcloud sql instances delete study-tracker-db --quiet`.',
    ],
    files: [
      { language: 'python', filename: 'config.py', code: configDb, runnable: false },
      { language: 'python', filename: 'db.py', code: dbPortable, runnable: false },
      { language: 'python', filename: 'embed_cache.py', code: embedCachePortable, runnable: false },
      { language: 'text', filename: 'requirements.txt', code: requirementsGcp },
      { language: 'python', filename: 'test_db_portable.py', code: testDbPortable, files: { 'config.py': configDb, 'db.py': dbPortable }, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Giving the instance a public address to connect from your laptop.', fix: 'Keep it private. Test locally against a PostgreSQL container, and let only the app reach the real one.' },
    { mistake: 'Putting the database URL in plain environment variables.', fix: 'Store it in Secret Manager and expose it with `--set-secrets`.' },
    { mistake: 'Granting Secret Accessor on the whole project.', fix: 'Grant it on the one secret the app reads, so it cannot read any other secret.' },
    { mistake: 'Forgetting `--edition enterprise` for a small instance.', fix: 'Recent PostgreSQL versions default to Enterprise Plus, which costs more and has no shared-core sizes.' },
  ],
  quiz: [
    {
      question: 'After this lesson, Cloud Run scales Study Tracker to zero overnight. What happens to the sessions saved earlier?',
      options: [
        { text: 'They are lost, as before', explanation: 'They now live in Cloud SQL, which runs separately from the instances.' },
        { text: 'They are kept, because Cloud SQL lives apart from the app\'s instances', explanation: 'Instances can come and go while the data stays in the managed database.' },
        { text: 'They are copied into the image', explanation: 'Images hold code, never runtime data.' },
        { text: 'They are kept only if min instances is 1', explanation: 'The number of instances does not matter. The data is not stored in them.' },
      ],
      answer: 1,
    },
    {
      question: 'The new revision fails to start with a permission error about accessing the secret `database-url`. What is the most likely cause?',
      options: [
        { text: 'The database has no public address', explanation: 'Reading the secret does not involve the database at all.' },
        { text: 'The image was built for the wrong processor', explanation: 'That causes an image format error, not a secret error.' },
        { text: 'The budget blocked Secret Manager', explanation: 'Budgets never block services.' },
        { text: 'The `study-tracker` service account lacks Secret Accessor on that secret', explanation: 'Cloud Run reads secrets as the service\'s own service account, which needs that role.' },
      ],
      answer: 3,
    },
    {
      question: 'What does `--no-assign-ip` do for the Cloud SQL instance?',
      options: [
        { text: 'It gives the instance no public address, so only resources connected to the network can reach it', explanation: 'Together with private services access, nothing on the internet can reach it.' },
        { text: 'It blocks the app from connecting', explanation: 'The app connects through Direct VPC egress, inside the network.' },
        { text: 'It turns off encryption', explanation: 'Encryption is controlled separately, by `--ssl-mode`.' },
        { text: 'It stops automatic backups', explanation: 'Backups are controlled by the backup flags.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Move data into a managed Cloud SQL instance with only a private address, connect over an encrypted connection whose URL lives in Secret Manager, confirm the backups exist, and stop or delete the instance when you are not using it.',
  resources: [
    { title: 'Cloud SQL for PostgreSQL', provider: 'Google Cloud Documentation', description: 'Creating, connecting to and managing PostgreSQL instances.', url: 'https://docs.cloud.google.com/sql/docs/postgres' },
    { title: 'Cloud SQL editions', provider: 'Google Cloud Documentation', description: 'Enterprise and Enterprise Plus, and which machine types each offers.', url: 'https://docs.cloud.google.com/sql/docs/postgres/editions-intro' },
    { title: 'Configure secrets for Cloud Run services', provider: 'Google Cloud Documentation', description: 'Exposing Secret Manager secrets as environment variables or files.', url: 'https://docs.cloud.google.com/run/docs/configuring/services/secrets' },
    { title: 'Psycopg 3', provider: 'Psycopg', description: 'The PostgreSQL driver used by Study Tracker.', url: 'https://www.psycopg.org/psycopg3/docs/' },
  ],
  underTheHood: {
    heading: 'When Cloud Run reads the secret',
    paragraphs: [
      "A secret in Secret Manager has versions. Each time you add a value, it becomes a new version, numbered 1, 2, 3 and so on, and the alias `latest` always points at the newest enabled one.",
      "When Cloud Run starts an instance of a revision, it fetches every secret listed in `--set-secrets` as the service's own service account, then starts your container with the values as environment variables. If the account lacks access, the instance fails to start, which is why the error appears at deployment rather than later.",
      "Because the value is read at start-up, adding a new version does not change instances that are already running. They keep the value they started with until they are replaced, for example by deploying a new revision. Pinning a number, such as `database-url:2`, instead of `latest`, makes every instance use exactly that version, which some teams prefer so that a change to a secret always goes through a deployment. The security lesson uses this when it rotates the password.",
    ],
  },
}

export default lesson
