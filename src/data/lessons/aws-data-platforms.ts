import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { readDatabaseUrlPolicyJson, updateServiceDbJson } from './aws-shared'
import { configDb, dbPortable, embedCachePortable, requirementsAws, testDbPortable } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Monitoring, reliability, and cost on AWS, with the `study-tracker` service running in `vpc-study-tracker`, and the Software Engineering lesson Databases and SQL. Set the track variables, plus `PRIV1`, `PRIV2`, `SG_DB`, `ACCOUNT` and `REGISTRY` from earlier lessons.',
  goals: [
    'Choose a managed database and say what AWS runs for you',
    'Create a private Amazon RDS for PostgreSQL database and connect Study Tracker to it securely',
    'Check that automatic backups exist, and keep the database\'s cost under control',
  ],
  bigIdea: "A managed database is a database server the cloud provider runs for you: it installs updates, takes backups and replaces failed hardware, while you design tables and write queries. Study Tracker moves from SQLite inside its task to Amazon RDS for PostgreSQL in the private subnets. Its sessions finally survive deployments, restarts and replaced tasks.",
  whyItMatters: "Each time ECS replaces Study Tracker's task, for a deployment or a failed health check, every session is lost. A demo can live with that, but a real app cannot. A database that lives apart from the app keeps data whatever happens to the tasks, and because several tasks can share it, Study Tracker can also scale out, as Scalability described.",
  goalSections: [
    {
      heading: 'What RDS runs for you',
      paragraphs: [
        "Amazon RDS, the Relational Database Service, runs PostgreSQL and other database engines as a managed service. You choose the engine version, the instance size, the storage and the backup settings. AWS installs updates in a maintenance window, takes automatic backups and replaces failed hardware.",
        "Study Tracker uses PostgreSQL, which every major cloud offers, so the same code would work on Azure or Google Cloud. The smallest burstable class, `db.t4g.micro`, suits a learning project. Check AWS's Free Tier page to see whether your account covers it.",
        "You pay for the instance by the hour and for storage. You can stop the instance when not in use, but AWS's documentation notes that RDS starts a stopped instance automatically after seven consecutive days.",
      ],
      example: {
        language: 'text',
        code: code`
          You do                               AWS does
          choose engine, version, size          install minor updates in a maintenance window
          design tables, write queries          take daily backups, keep them 1 to 35 days
          decide who can connect                replace failed hardware
          choose backup retention               keep the instance available
        `,
      },
    },
    {
      heading: 'Study Tracker\'s code for PostgreSQL',
      paragraphs: [
        "Study Tracker's SQL was written for SQLite. PostgreSQL accepts almost all of it, with two differences: placeholders are `%s` instead of `?`, and automatic IDs use an identity column instead of `AUTOINCREMENT`. The new `db.py` translates both in a small class, `PostgresConnection`, so the other modules keep their SQL unchanged. These are the same files as in the Azure track, because the code does not care which cloud runs it.",
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
        "The database goes into a DB subnet group made of the two private subnets, with public access turned off and `sg-study-db` attached, so only the app's tasks can reach it. Storage encryption is turned on, and RDS for recent PostgreSQL versions requires encrypted connections by default, which `sslmode=require` in the URL also insists on.",
        "The connection URL contains the password, so it is stored in AWS Systems Manager Parameter Store as a SecureString, an encrypted parameter. The service's container lists it under `secrets`, and ECS reads it at start-up using the execution role, which gets permission to read that one parameter. The security lesson moves it into Secrets Manager.",
        "Automatic backups are on, kept for the retention period you choose, from 1 to 35 days, and the resilience lesson restores one. Your laptop is outside the private subnets and cannot connect to the database, and that is intended.",
      ],
      example: {
        language: 'text',
        code: code`
          DATABASE_URL (stored only in Parameter Store, never committed or logged):
          postgresql://studyadmin:<password>@study-tracker-db.abc123xyz.us-east-1.rds.amazonaws.com:5432/studytracker?sslmode=require

          Container settings:
            secrets  DATABASE_URL <- arn:aws:ssm:...:parameter/study-tracker/database-url
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Creating the database and switching Study Tracker to it',
    intro: "First update your code with the files in Try it yourself, run the tests, then build and push a `v3` image. Edit `read-database-url-policy.json` and `update-service.json` with your account number, suffix and service ARN. Creating the database takes several minutes. In PowerShell, set variables as `$NAME = ...`, and keep the braces in `${DB_HOST}`.",
    example: {
      language: 'bash',
      code: code`
        aws rds create-db-subnet-group --db-subnet-group-name study-tracker-db --db-subnet-group-description "Private subnets for Study Tracker" --subnet-ids $PRIV1 $PRIV2 --tags Key=project,Value=study-tracker
        DB_PASSWORD=$(python -c "import secrets; print(secrets.token_urlsafe(24))")
        aws rds create-db-instance --db-instance-identifier study-tracker-db --engine postgres --engine-version 17 --db-instance-class db.t4g.micro --allocated-storage 20 --storage-type gp3 --master-username studyadmin --master-user-password "$DB_PASSWORD" --db-name studytracker --vpc-security-group-ids $SG_DB --db-subnet-group-name study-tracker-db --no-publicly-accessible --backup-retention-period 7 --storage-encrypted --tags Key=project,Value=study-tracker
        aws rds wait db-instance-available --db-instance-identifier study-tracker-db

        DB_HOST=$(aws rds describe-db-instances --db-instance-identifier study-tracker-db --query "DBInstances[0].Endpoint.Address" --output text)
        DATABASE_URL="postgresql://studyadmin:$DB_PASSWORD@${'$'}{DB_HOST}:5432/studytracker?sslmode=require"
        aws ssm put-parameter --name /study-tracker/database-url --type SecureString --value "$DATABASE_URL" --tags Key=project,Value=study-tracker
        aws iam put-role-policy --role-name study-tracker-execution-role --policy-name read-database-url --policy-document file://read-database-url-policy.json

        docker build --platform linux/amd64 -t $REGISTRY/study-tracker:v3 .
        docker push $REGISTRY/study-tracker:v3
        aws ecs update-express-gateway-service --cli-input-json file://update-service.json

        aws rds describe-db-instances --db-instance-identifier study-tracker-db --query "DBInstances[0].{status:DBInstanceStatus, public:PubliclyAccessible, encrypted:StorageEncrypted, backupDays:BackupRetentionPeriod}" --output table
      `,
      output: code`
        ---------------------------------------------------
        |               DescribeDBInstances               |
        +------------+------------+---------+-------------+
        | backupDays | encrypted  | public  |   status    |
        +------------+------------+---------+-------------+
        |  7         |  True      |  False  |  available  |
        +------------+------------+---------+-------------+
      `,
    },
    steps: [
      { code: '--subnet-ids $PRIV1 $PRIV2', explanation: "The DB subnet group uses only the two private subnets, in two zones, which RDS requires even for a single instance." },
      { code: '--db-instance-class db.t4g.micro --allocated-storage 20 --storage-type gp3', explanation: "The smallest burstable class with 20 GB of general-purpose storage, enough for a learning project." },
      { code: '--vpc-security-group-ids $SG_DB --no-publicly-accessible', explanation: "Attaches the database security group from lesson 4 and gives the database no public address. Only `sg-study-app` members can connect." },
      { code: '--backup-retention-period 7 --storage-encrypted', explanation: "Keeps automatic backups for 7 days and encrypts the stored data and its backups with an AWS managed key." },
      { code: 'aws rds wait db-instance-available --db-instance-identifier study-tracker-db', explanation: "Waits until the database is ready, which often takes 5 to 15 minutes." },
      { code: '--type SecureString --value "$DATABASE_URL"', explanation: "Stores the URL encrypted. In PowerShell, build it with `\"postgresql://studyadmin:$DB_PASSWORD@${DB_HOST}:5432/studytracker?sslmode=require\"`: the braces stop PowerShell reading `:5432` as part of the variable name." },
      { code: '"secrets": [{ "name": "DATABASE_URL", "valueFrom": "arn:aws:ssm:...:parameter/study-tracker/database-url" }]', explanation: "In `update-service.json`. ECS fetches the parameter with the execution role and sets it as `DATABASE_URL` inside the container, without it ever appearing in the service's settings." },
    ],
  },
  tryIt: {
    instructions: [
      'Replace `config.py`, `db.py` and `embed_cache.py` with the versions below, update `requirements.txt`, run `python -m pip install -r requirements.txt` and `python -m pytest`. Everything still runs on SQLite.',
      'Save the two JSON files below with your own values and run the commands above. Save sessions through your app\'s `/docs`, deploy any small change as `v4`, and check that the sessions survived.',
      'List your automatic backups with `aws rds describe-db-instance-automated-backups --db-instance-identifier study-tracker-db --output table`. The first appears within a day.',
      'Clean up: the database costs money every hour it runs. To pause, run `aws rds stop-db-instance --db-instance-identifier study-tracker-db`, remembering it restarts after seven days. To remove it, run `aws rds delete-db-instance --db-instance-identifier study-tracker-db --skip-final-snapshot`.',
    ],
    files: [
      { language: 'text', filename: 'read-database-url-policy.json', code: readDatabaseUrlPolicyJson },
      { language: 'text', filename: 'update-service.json', code: updateServiceDbJson },
      { language: 'python', filename: 'config.py', code: configDb, runnable: false },
      { language: 'python', filename: 'db.py', code: dbPortable, runnable: false },
      { language: 'python', filename: 'embed_cache.py', code: embedCachePortable, runnable: false },
      { language: 'text', filename: 'requirements.txt', code: requirementsAws },
      { language: 'python', filename: 'test_db_portable.py', code: testDbPortable, files: { 'config.py': configDb, 'db.py': dbPortable }, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Making the database publicly accessible to connect from your laptop.', fix: 'Keep it private. Test locally against a PostgreSQL container, and let only the app reach the real one.' },
    { mistake: 'Putting the database URL in the service\'s plain environment variables.', fix: 'Store it as a SecureString and list it under `secrets`, so ECS injects it at start-up.' },
    { mistake: 'Forgetting that a stopped RDS instance restarts after seven days.', fix: 'Delete the instance when you are done, or plan to stop it again each week.' },
    { mistake: 'Writing `$DB_HOST:5432` in PowerShell.', fix: 'Write `${DB_HOST}:5432`, which works in both bash and PowerShell.' },
  ],
  quiz: [
    {
      question: 'After this lesson, ECS replaces Study Tracker\'s task during a deployment. What happens to the sessions saved earlier?',
      options: [
        { text: 'They are lost, as before', explanation: 'They now live in RDS, which runs separately from the tasks.' },
        { text: 'They are copied into the new image', explanation: 'Images hold code, never runtime data.' },
        { text: 'They are kept, because RDS lives apart from the app\'s tasks', explanation: 'Tasks can come and go while the data stays in the managed database.' },
        { text: 'They are kept only if two tasks were running', explanation: 'The number of tasks does not matter. The data is not stored in them.' },
      ],
      answer: 2,
    },
    {
      question: 'The task fails to start with an error about fetching the `DATABASE_URL` secret. What is the most likely cause?',
      options: [
        { text: 'The execution role is missing permission for `ssm:GetParameters` on that parameter', explanation: 'ECS fetches secrets with the execution role, which needs that permission.' },
        { text: 'The task role is missing permission for `ssm:GetParameters`', explanation: 'The task role is used by your code after start-up. Secrets are fetched by ECS before that, with the execution role.' },
        { text: 'The database is not publicly accessible', explanation: 'Fetching the parameter does not involve the database at all.' },
        { text: 'The image was built for the wrong processor', explanation: 'That causes an image format error, not a secret error.' },
      ],
      answer: 0,
    },
    {
      question: 'What does `--no-publicly-accessible` do for the RDS instance?',
      options: [
        { text: 'It turns off encryption', explanation: 'Encryption is controlled separately, by `--storage-encrypted`.' },
        { text: 'It blocks the app from connecting', explanation: 'The app connects from inside the VPC, which is still allowed by the security group.' },
        { text: 'It stops automatic backups', explanation: 'Backups are controlled by the retention period.' },
        { text: 'It gives the database no public address, so it can only be reached from inside the VPC', explanation: 'Together with private subnets and the security group, nothing on the internet can reach it.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Move data into a managed RDS database in private subnets, connect with an encrypted connection whose URL is stored encrypted and injected by ECS, confirm the backups exist, and stop or delete the database when you are not using it.',
  resources: [
    { title: 'Amazon RDS for PostgreSQL', provider: 'AWS Documentation', description: 'Creating, connecting to and managing PostgreSQL on RDS.', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html' },
    { title: 'Stopping an RDS DB instance', provider: 'AWS Documentation', description: 'What stopping does, and the automatic restart after seven days.', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html' },
    { title: 'Passing Parameter Store values to ECS', provider: 'AWS Documentation', description: 'Injecting parameters into containers as environment variables.', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-ssm-paramstore.html' },
    { title: 'Psycopg 3', provider: 'Psycopg', description: 'The PostgreSQL driver used by Study Tracker.', url: 'https://www.psycopg.org/psycopg3/docs/' },
  ],
  underTheHood: {
    heading: 'Who reads the secret, and when',
    paragraphs: [
      "ECS uses two roles at different moments. Before your container starts, the ECS agent uses the execution role to pull the image from ECR and to fetch every value listed under `secrets`, such as the database URL. It then starts the container with those values as environment variables.",
      "Once your code is running, it uses the task role for anything it does itself, such as reading the notes bucket with boto3. Your code never sees the execution role, and the agent never uses the task role.",
      "This split is least privilege in action. The execution role can read one parameter but cannot read the notes bucket. The task role can read the bucket but cannot fetch secrets. If either is misused, the damage is limited to its own small job. It also explains the most common ECS secret error: granting the permission to the task role, when ECS needs it on the execution role.",
    ],
  },
}

export default lesson
