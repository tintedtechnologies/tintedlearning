import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { configDb, dbPortable, embedCachePortable, requirementsCloud, testDbPortable } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Monitoring, reliability, and cost on Azure, with `ca-study-tracker` deployed into `vnet-study-tracker`, and the Software Engineering lesson Databases and SQL. Set the track variables, plus `ACR` from lesson 5.',
  goals: [
    'Choose a managed database and say what the provider runs for you',
    'Create a private PostgreSQL server and connect Study Tracker to it securely',
    'Check that automatic backups exist, and keep the database\'s cost under control',
  ],
  bigIdea: "A managed database is a database server the cloud provider runs for you: it installs updates, takes backups and replaces failed hardware, while you design tables and write queries. Study Tracker moves from SQLite, a file inside the container, to Azure Database for PostgreSQL, a server in its own private subnet. Its sessions finally survive restarts, scaling to zero and redeployments.",
  whyItMatters: "Right now, every time Study Tracker scales to zero, every session is lost. That is fine for a demo and fatal for a real app. A database server that lives apart from the app keeps data safe however often the app restarts, and because several app copies can share it, Study Tracker can also scale out, exactly the stateless design from Scalability.",
  goalSections: [
    {
      heading: 'What a managed database gives you',
      paragraphs: [
        "Running a database yourself means installing it, patching it, monitoring disk space, taking and testing backups and recovering from hardware failures. With a managed database such as Azure Database for PostgreSQL, Azure does those jobs. You choose the size, the PostgreSQL version and the backup settings, and connect to it like any PostgreSQL server.",
        "Study Tracker uses PostgreSQL because it is open source, widely used, and offered by every major cloud, so the same code would work on AWS or Google Cloud. It also supports pgvector, which Vector Databases mentioned for growing past simple search.",
        "The smallest Burstable size suits a learning project. It is charged by the hour while running, plus storage. You can stop it when not in use, but Microsoft's documentation notes that a stopped server starts again automatically after seven days.",
      ],
      example: {
        language: 'text',
        code: code`
          You do                               Azure does
          choose size, version, region         install and patch PostgreSQL
          design tables, write queries         take daily backups, keep them 7 to 35 days
          decide who may connect               replace failed hardware
          choose backup retention              keep the server available
        `,
      },
    },
    {
      heading: 'Moving Study Tracker\'s code to PostgreSQL',
      paragraphs: [
        "Study Tracker's SQL was written for SQLite. PostgreSQL understands almost all of it, with two differences: placeholders are written `%s` instead of `?`, and automatic IDs use an identity column instead of `AUTOINCREMENT`. The new `db.py` handles both in one small class, `PostgresConnection`, which translates the SQL as it runs, so the other modules keep their queries unchanged.",
        "Which database to use comes from configuration, as in Configuration and Secrets. When `DATABASE_URL` is set, Study Tracker connects to PostgreSQL through the `psycopg` package. Without it, SQLite is used as before, so your laptop and your tests keep working with no server at all.",
        "Two other small changes help both databases: saving a session now asks the database to return the new ID with `RETURNING id`, and the embedding cache uses `ON CONFLICT` instead of a SQLite-only command. These versions were tested against a real PostgreSQL server.",
      ],
      example: {
        language: 'python',
        code: code`
          def translate(sql):
              sql = sql.replace("INTEGER PRIMARY KEY AUTOINCREMENT", "INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY")
              return sql.replace("?", "%s")


          print(translate("INSERT INTO sessions (subject, minutes, studied_on) VALUES (?, ?, ?) RETURNING id"))
        `,
        output: 'INSERT INTO sessions (subject, minutes, studied_on) VALUES (%s, %s, %s) RETURNING id',
      },
    },
    {
      heading: 'Connecting securely, with backups',
      paragraphs: [
        "The server goes into `snet-db`, the private subnet from lesson 4, so it has no public address. Its name is resolved through a private DNS zone that the CLI creates and links to your network. Only the apps subnet can reach port 5432, and connections must be encrypted, which `sslmode=require` in the connection URL insists on.",
        "The connection URL contains the database password, so it must not sit in a plain environment variable where anyone with read access to the app's settings can see it. Container Apps has secrets for this: the URL is stored as a secret, and the environment variable only refers to it. The security lesson moves it further, into Key Vault.",
        "Backups are automatic. Azure takes them every day and keeps them for the retention period you set, from 7 to 35 days, and the resilience lesson restores one. Because your laptop is outside the private network, you cannot connect to this database directly. That is the point.",
      ],
      example: {
        language: 'text',
        code: code`
          DATABASE_URL format (never commit it, never log it):
          postgresql://studyadmin:<password>@psql-study-jd4821.postgres.database.azure.com:5432/studytracker?sslmode=require

          Container app settings:
            secret   database-url = <the URL above>
            env var  DATABASE_URL = secretref:database-url
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Creating the database and switching Study Tracker to it',
    intro: "First update your code with the files in Try it yourself and run the tests. Register the service once with your sign-up account, then run the rest as `studyadmin`. Creating the server takes several minutes. In PowerShell, set variables as `$NAME = ...`.",
    example: {
      language: 'bash',
      code: code`
        az provider register --namespace Microsoft.DBforPostgreSQL

        PG=psql-study-$SUFFIX
        DB_PASSWORD=$(python -c "import secrets; print(secrets.token_urlsafe(24))")
        az postgres flexible-server create --name $PG --resource-group $RG --location $LOCATION --tier Burstable --sku-name Standard_B1ms --storage-size 32 --version 17 --vnet vnet-study-tracker --subnet snet-db --private-dns-zone study-tracker.private.postgres.database.azure.com --admin-user studyadmin --admin-password "$DB_PASSWORD" --backup-retention 7 --tags project=study-tracker --yes
        az postgres flexible-server db create --resource-group $RG --server-name $PG --name studytracker

        DATABASE_URL="postgresql://studyadmin:$DB_PASSWORD@$PG.postgres.database.azure.com:5432/studytracker?sslmode=require"
        az containerapp secret set --name ca-study-tracker --resource-group $RG --secrets database-url="$DATABASE_URL"

        docker build --platform linux/amd64 -t $ACR.azurecr.io/study-tracker:v3 .
        docker push $ACR.azurecr.io/study-tracker:v3
        az containerapp update --name ca-study-tracker --resource-group $RG --image $ACR.azurecr.io/study-tracker:v3 --set-env-vars DATABASE_URL=secretref:database-url

        az postgres flexible-server show --name $PG --resource-group $RG --query "{state:state, version:version, public:network.publicNetworkAccess}" -o table
      `,
      output: code`
        State    Version    Public
        -------  ---------  --------
        Ready    17         Disabled
      `,
    },
    steps: [
      { code: 'DB_PASSWORD=$(python -c "import secrets; print(secrets.token_urlsafe(24))")', explanation: "Generates a long random password using only letters, digits, `-` and `_`, which are safe inside a URL. In PowerShell, write `$DB_PASSWORD = python -c \"...\"`. Store it in a password manager. Lesson 10 moves it into Key Vault." },
      { code: '--tier Burstable --sku-name Standard_B1ms --storage-size 32', explanation: "The smallest size, with 32 GB of storage, enough for a learning project. Burstable sizes suit apps that are idle most of the time." },
      { code: '--vnet vnet-study-tracker --subnet snet-db --private-dns-zone study-tracker.private.postgres.database.azure.com', explanation: "Private access only. The CLI creates the private DNS zone if it does not exist and links it to the network, so the app can find the server by name." },
      { code: 'az postgres flexible-server db create ... --name studytracker', explanation: "Creates Study Tracker's database inside the server. The app creates its tables itself on first use, as it did with SQLite." },
      { code: 'az containerapp secret set ... --secrets database-url="$DATABASE_URL"', explanation: "Stores the URL as a secret. The quotes keep special characters intact in both bash and PowerShell." },
      { code: '--set-env-vars DATABASE_URL=secretref:database-url', explanation: "The environment variable points at the secret instead of containing it, and the new image with PostgreSQL support starts using it." },
      { code: 'public: Disabled', explanation: "Confirms the server has no public access. Only the app, inside the network, can reach it." },
    ],
  },
  tryIt: {
    instructions: [
      'Replace `config.py`, `db.py` and `embed_cache.py` with the versions below, update `requirements.txt` and run `python -m pip install -r requirements.txt` and `python -m pytest`. Everything still runs on SQLite.',
      'Optional: test PostgreSQL locally with Docker, `docker run --name study-postgres -e POSTGRES_PASSWORD=local-only-password -p 5432:5432 -d postgres:17`, then set `DATABASE_URL=postgresql://postgres:local-only-password@localhost:5432/postgres` and run the app.',
      'Run the commands above. Save sessions through your app\'s `/docs`, wait for it to scale to zero, then check `GET /totals`: the sessions are still there.',
      'Run `az postgres flexible-server backup list --resource-group $RG --server-name $PG -o table` to see your automatic backups, which can take a day to appear.',
      'Clean up: the server costs money every hour it runs. If you pause the track, stop it with `az postgres flexible-server stop --name $PG --resource-group $RG`, remembering it restarts after seven days. To remove it, run `az postgres flexible-server delete --name $PG --resource-group $RG --yes`.',
    ],
    files: [
      { language: 'python', filename: 'config.py', code: configDb, runnable: false },
      { language: 'python', filename: 'db.py', code: dbPortable, runnable: false },
      { language: 'python', filename: 'embed_cache.py', code: embedCachePortable, runnable: false },
      { language: 'text', filename: 'requirements.txt', code: requirementsCloud },
      { language: 'python', filename: 'test_db_portable.py', code: testDbPortable, files: { 'config.py': configDb, 'db.py': dbPortable }, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Giving the database a public address so you can connect from your laptop.', fix: 'Keep it private. Test locally against a PostgreSQL container, and let only the app reach the real one.' },
    { mistake: 'Putting the connection URL in a plain environment variable.', fix: 'Store it as a secret and reference it, so it is not visible in the app\'s settings or logs.' },
    { mistake: 'Leaving the server running after you stop working on the track.', fix: 'Stop or delete it. A stopped server still charges for storage and starts again after seven days.' },
    { mistake: 'Assuming backups are fine because they are automatic.', fix: 'Check that they exist and practice restoring one, which the resilience lesson does.' },
  ],
  quiz: [
    {
      question: 'After this lesson, Study Tracker scales to zero overnight. What happens to the sessions saved yesterday?',
      options: [
        { text: 'They are lost, as before', explanation: 'They now live in PostgreSQL, which keeps running separately from the app.' },
        { text: 'They are kept, because the database server lives apart from the app\'s containers', explanation: 'The app can stop and start freely, while the data stays in the managed database.' },
        { text: 'They are kept only if the app had two replicas', explanation: 'The number of replicas does not matter. The data is not stored in the app.' },
        { text: 'They are moved into the container image', explanation: 'Images hold code, never runtime data.' },
      ],
      answer: 1,
    },
    {
      question: 'What does `PostgresConnection.translate` turn `SELECT * FROM sessions WHERE id = ?` into?',
      options: [
        { text: '`SELECT * FROM sessions WHERE id = $1`', explanation: 'That is another placeholder style, but psycopg uses `%s`.' },
        { text: 'It leaves it unchanged', explanation: 'The `?` is replaced, because PostgreSQL through psycopg does not accept it.' },
        { text: '`SELECT * FROM sessions WHERE id = :id`', explanation: 'Named placeholders are a different style, not used here.' },
        { text: '`SELECT * FROM sessions WHERE id = %s`', explanation: 'Each `?` becomes `%s`, the placeholder psycopg uses, and the value is still passed separately and safely.' },
      ],
      answer: 3,
    },
    {
      question: 'You stopped the database server to save money and forgot about it. What happens after seven days?',
      options: [
        { text: 'It starts again automatically and resumes charging for compute', explanation: 'Microsoft\'s documentation says stopped servers start automatically after seven days, so delete servers you no longer need.' },
        { text: 'It is deleted', explanation: 'Stopping never deletes the server or its data.' },
        { text: 'Nothing: it stays stopped until you start it', explanation: 'That is the risk: it does not stay stopped forever.' },
        { text: 'Its backups are deleted', explanation: 'Backups follow the retention period, not the stop.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Move data out of the app into a managed database in a private subnet, connect with an encrypted connection whose URL is stored as a secret, confirm the backups exist, and stop or delete the server when you are not using it.',
  resources: [
    { title: 'Azure Database for PostgreSQL overview', provider: 'Microsoft Learn', description: 'What the managed service runs for you, and its options.', url: 'https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/overview' },
    { title: 'Private networking for PostgreSQL', provider: 'Microsoft Learn', description: 'Delegated subnets and private DNS zones, as used in this lesson.', url: 'https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-networking-private' },
    { title: 'Manage secrets in Container Apps', provider: 'Microsoft Learn', description: 'Storing secrets and referring to them from environment variables.', url: 'https://learn.microsoft.com/en-us/azure/container-apps/manage-secrets' },
    { title: 'Psycopg 3', provider: 'Psycopg', description: 'The PostgreSQL driver used by Study Tracker, with its placeholder rules.', url: 'https://www.psycopg.org/psycopg3/docs/' },
  ],
  underTheHood: {
    heading: 'Why the app connects as admin, for now',
    paragraphs: [
      "Study Tracker connects as `studyadmin`, the server's administrator, which can create and drop any table. That keeps this lesson short, and it works, but it breaks the least-privilege rule from lesson 2: a bug or an attacker using the app's connection could do anything the administrator can.",
      "The better setup gives the app its own database role, a PostgreSQL user that can read and write Study Tracker's tables but not drop them or create others, and keeps the administrator for migrations and maintenance. It is a few lines of SQL, such as `CREATE ROLE` and `GRANT`, run by the administrator.",
      "Better still, Azure Database for PostgreSQL supports signing in with Microsoft Entra ID, so the app could connect using its managed identity and a short-lived token, with no database password at all. Setting that up requires connecting to the private server as an Entra administrator, which is why this track stores the password safely in Key Vault in lesson 10 and leaves passwordless database access as a next step.",
    ],
  },
}

export default lesson
