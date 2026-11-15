import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { readDatabaseSecretPolicyJson, updateServiceSecretJson } from './aws-shared'

const lesson: StructuredLesson = {
  assumes: 'AWS databases and data platforms, with `DATABASE_URL` stored in Parameter Store and injected into the `study-tracker` service, and the Software Engineering lesson Configuration and Secrets. Set the track variables plus `SERVICE_ARN`.',
  goals: [
    'Keep secrets in AWS Secrets Manager and let ECS inject them with a narrow role',
    'Check that Study Tracker\'s data is encrypted at rest and in transit',
    'Find resources shared outside your account with IAM Access Analyzer',
  ],
  bigIdea: "Security engineering is layering protections so that one mistake does not expose everything. Secrets live in AWS Secrets Manager, a service built to store, version and rotate them, and only the role that needs a secret can read it. Encryption protects data stored on disk and data moving across the network, and analyzers keep checking for access you did not mean to grant.",
  whyItMatters: "Study Tracker's database URL sits in Parameter Store, which keeps it encrypted but was designed mainly for settings. When the password has to change, because someone left the team or it appeared in a log, you want a service that keeps versions, can rotate the password on a schedule and records every read. Secrets Manager does that, and the app's code does not change at all.",
  goalSections: [
    {
      heading: 'Secrets in Secrets Manager',
      paragraphs: [
        "A secret in Secrets Manager has a name, such as `study-tracker/database-url`, and an ARN that ends in six random characters added by AWS. Each change creates a new version, and the current one carries the label `AWSCURRENT`, so you can roll back if a new value is wrong.",
        "ECS injects a secret exactly like the Parameter Store value: the container lists it under `secrets`, and the execution role fetches it before the container starts. That role needs `secretsmanager:GetSecretValue` on this one secret. The policy ends the ARN in `-*` to match the random characters.",
        "ECS reads secrets only when a task starts. After you change a secret, running tasks keep the old value until you start new ones, with a new deployment of the service. This differs from some other platforms, which pick up new versions on their own.",
      ],
      example: {
        language: 'text',
        code: code`
          Before: DATABASE_URL <- arn:aws:ssm:us-east-1:123456789012:parameter/study-tracker/database-url
          After:  DATABASE_URL <- arn:aws:secretsmanager:us-east-1:123456789012:secret:study-tracker/database-url-AbCdEf
          Fetched by: study-tracker-execution-role, at task start only
          App code: unchanged, still reads DATABASE_URL
        `,
      },
    },
    {
      heading: 'Encryption at rest and in transit',
      paragraphs: [
        "Encryption at rest protects stored data if disks or backups were ever taken. Study Tracker's RDS database was created with `--storage-encrypted`, S3 encrypts every new object by default, and Secrets Manager always encrypts secrets with a key from AWS Key Management Service, called KMS. Organizations with strict rules can use their own KMS keys instead, called customer managed keys.",
        "Encryption in transit protects data moving over a network. Browsers reach the app over HTTPS, AWS's own APIs use HTTPS, and the database connection uses `sslmode=require`. For PostgreSQL 15 and newer, RDS also sets `rds.force_ssl` to on by default, so the server itself refuses unencrypted connections.",
        "Network rules add another layer. The database already has no public address and accepts only the app's security group. Larger systems also add VPC endpoints, so traffic to S3 and Secrets Manager never leaves AWS's network. This track keeps the simpler setup.",
      ],
      example: {
        language: 'text',
        code: code`
          Path                                  Protection
          Browser -> load balancer -> app       HTTPS
          App -> RDS PostgreSQL                 TLS, sslmode=require, rds.force_ssl on, private subnets
          App or laptop -> S3, Secrets Manager  HTTPS, IAM roles
          Data on disk, backups, secrets        encrypted at rest
        `,
      },
    },
    {
      heading: 'IAM Access Analyzer and Security Hub CSPM',
      paragraphs: [
        "An external access analyzer, part of IAM Access Analyzer, reads the resource policies in one region, such as bucket policies and role trust policies, and reports every resource that someone outside your account can reach, including the whole internet. AWS does not charge for this kind of analyzer.",
        "Each finding names the resource and who can reach it. If the access is intended, such as a bucket you meant to share, you archive the finding. If not, you fix the policy, and the finding resolves on its own.",
        "AWS Security Hub CSPM, short for cloud security posture management, goes further: it checks your account against hundreds of best practices and lists failed controls, much like Microsoft's Defender for Cloud. It relies on AWS Config and charges after a free trial, so read about it here rather than turning it on for this track.",
      ],
      example: {
        language: 'text',
        code: code`
          Typical findings an external access analyzer can report (examples, not your results)
          AWS::S3::Bucket      study-notes-jd4821             public read through a bucket policy
          AWS::IAM::Role       study-tracker-task-role        trusted by another AWS account
          AWS::Lambda::Function study-tracker-weekly-summary  invokable by anyone
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Moving the database URL into Secrets Manager',
    intro: "Run these as your daily user. Save the two files from Try it yourself first: replace `123456789012` with your account number and `jd4821` with your suffix, and fill in `update-service.json` with your service ARN and the secret ARN printed by `echo`. In PowerShell, set variables as `$NAME = ...`.",
    example: {
      language: 'bash',
      code: code`
        DB_URL=$(aws ssm get-parameter --name /study-tracker/database-url --with-decryption --query Parameter.Value --output text)
        SECRET_ARN=$(aws secretsmanager create-secret --name study-tracker/database-url --secret-string "$DB_URL" --tags Key=project,Value=study-tracker --query ARN --output text)
        echo $SECRET_ARN

        aws iam put-role-policy --role-name study-tracker-execution-role --policy-name read-database-secret --policy-document file://read-database-secret-policy.json
        aws ecs update-express-gateway-service --cli-input-json file://update-service.json
        aws ecs wait services-stable --cluster default --services study-tracker
        aws iam delete-role-policy --role-name study-tracker-execution-role --policy-name read-database-url
        aws ssm delete-parameter --name /study-tracker/database-url

        aws rds describe-db-instances --db-instance-identifier study-tracker-db --query "DBInstances[0].StorageEncrypted" --output text
        aws s3api get-bucket-encryption --bucket study-notes-$SUFFIX --query "ServerSideEncryptionConfiguration.Rules[0].ApplyServerSideEncryptionByDefault.SSEAlgorithm" --output text

        ANALYZER_ARN=$(aws accessanalyzer create-analyzer --analyzer-name study-tracker-external --type ACCOUNT --tags project=study-tracker --query arn --output text)
        aws accessanalyzer list-findings-v2 --analyzer-arn $ANALYZER_ARN --filter '{"status": {"eq": ["ACTIVE"]}}' --query "findings[].[resourceType,resource]" --output text
      `,
      output: code`
        arn:aws:secretsmanager:us-east-1:123456789012:secret:study-tracker/database-url-AbCdEf
        True
        AES256
      `,
    },
    steps: [
      { code: 'DB_URL=$(aws ssm get-parameter ... --with-decryption ...)', explanation: "Reads the current URL into a variable, so you never type or print the password." },
      { code: '--secret-string "$DB_URL" --query ARN', explanation: "Creates the secret and keeps only its ARN, which ends in six random characters." },
      { code: '"valueFrom": "REPLACE-WITH-SECRET_ARN"', explanation: "In `update-service.json`. The full secret ARN goes here, and the rest of the file repeats your current container settings." },
      { code: 'aws ecs wait services-stable --cluster default --services study-tracker', explanation: "Waits until the new tasks, reading the secret, are running. Only then is it safe to remove the old parameter and its permission." },
      { code: 'True / AES256', explanation: "The database storage is encrypted, and the notes bucket encrypts objects with S3 managed keys." },
      { code: 'aws accessanalyzer list-findings-v2 ... --filter \'{"status": {"eq": ["ACTIVE"]}}\'', explanation: "Lists open findings. Empty output is the result you want. The first scan can take a few minutes." },
    ],
  },
  tryIt: {
    instructions: [
      'Save the files below, run the commands above, then open your app\'s `/totals` to confirm it still reaches the database.',
      'In the console, open Secrets Manager and the secret\'s Versions section. Note that it shows `AWSCURRENT` and never shows the value unless you choose to retrieve it.',
      'Practice a change: run `aws secretsmanager put-secret-value --secret-id study-tracker/database-url --secret-string "$DB_URL"`, then `aws ecs update-service --cluster default --service study-tracker --force-new-deployment` so new tasks load it.',
      'Clean up: Secrets Manager charges a small monthly amount per secret, so if you stop the track, delete it with `aws secretsmanager delete-secret --secret-id study-tracker/database-url --recovery-window-in-days 7` and the analyzer with `aws accessanalyzer delete-analyzer --analyzer-name study-tracker-external`.',
    ],
    files: [
      { language: 'text', filename: 'read-database-secret-policy.json', code: readDatabaseSecretPolicyJson },
      { language: 'text', filename: 'update-service.json', code: updateServiceSecretJson },
    ],
  },
  mistakes: [
    { mistake: 'Granting `secretsmanager:*` on every secret.', fix: 'Allow only `secretsmanager:GetSecretValue`, only on the secret the app uses.' },
    { mistake: 'Changing a secret and expecting running tasks to notice.', fix: 'Start a new deployment, because ECS injects secrets only when a task starts.' },
    { mistake: 'Deleting the old parameter before the new tasks are running.', fix: 'Wait for the service to be stable on the new secret, then remove the old one.' },
    { mistake: 'Archiving analyzer findings without reading them.', fix: 'Archive only access you meant to grant. Fix the policy for everything else.' },
  ],
  quiz: [
    {
      question: 'You put a new database password into the secret. Ten minutes later, the running tasks still use the old one. Why?',
      options: [
        { text: 'Secrets Manager takes an hour to save new versions', explanation: 'The new version is current straight away.' },
        { text: 'The execution role cannot read new versions', explanation: 'The permission covers the secret, whatever its version.' },
        { text: 'The secret must be deleted and created again', explanation: 'Versions exist so you never need to do that.' },
        { text: 'ECS injects secrets only when a task starts, so you need a new deployment', explanation: 'Force a new deployment, and the new tasks read the current version.' },
      ],
      answer: 3,
    },
    {
      question: 'The external access analyzer reports a finding for `study-notes-jd4821` with public read access. What should you do?',
      options: [
        { text: 'Archive it, since findings are only advice', explanation: 'Archive only access you intended. Learners\' notes should not be public.' },
        { text: 'Remove the bucket policy statement that grants the public access', explanation: 'Once the policy no longer grants it, the finding resolves.' },
        { text: 'Delete the analyzer so the finding disappears', explanation: 'That hides the problem without fixing it.' },
        { text: 'Turn on encryption at rest', explanation: 'Encrypted objects are still readable by anyone the policy allows.' },
      ],
      answer: 1,
    },
    {
      question: 'What does encryption at rest protect against?',
      options: [
        { text: 'Someone reading data from stored disks or backups they somehow obtained', explanation: 'Stored data is unreadable without the keys, which KMS keeps separately.' },
        { text: 'Someone reading data as it travels over the network', explanation: 'That is encryption in transit, such as HTTPS and TLS.' },
        { text: 'A role with permission reading data through the app', explanation: 'Encryption at rest does not stop authorized access. Policies do.' },
        { text: 'A public bucket policy', explanation: 'S3 decrypts objects for anyone the policy allows, including the public.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Keep each secret once in Secrets Manager, let only the execution role read it and redeploy when it changes, rely on encryption at rest and in transit, and let IAM Access Analyzer tell you when something is shared that should not be.',
  resources: [
    { title: 'What is AWS Secrets Manager?', provider: 'AWS Documentation', description: 'Secrets, versions, rotation and access control.', url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html' },
    { title: 'Passing Secrets Manager secrets to ECS', provider: 'AWS Documentation', description: 'The `secrets` field, ARN formats and when values are read.', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html' },
    { title: 'Using SSL with RDS for PostgreSQL', provider: 'AWS Documentation', description: 'Encrypted connections and the `rds.force_ssl` setting.', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html' },
    { title: 'Using IAM Access Analyzer', provider: 'AWS Documentation', description: 'External, internal and unused access analyzers, and which ones cost money.', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html' },
  ],
  underTheHood: {
    heading: 'Envelope encryption with KMS',
    paragraphs: [
      "Encrypting a large amount of data directly with one master key would mean sending all of it to the service that holds the key. AWS uses envelope encryption instead.",
      "When Secrets Manager stores a secret, it asks KMS for a fresh data key. KMS returns the data key twice: once in plain form and once encrypted with a KMS key that never leaves KMS. Secrets Manager encrypts the secret locally with the plain data key, throws the plain copy away, and stores the encrypted secret next to the encrypted data key.",
      "To read the secret, Secrets Manager sends only the small encrypted data key to KMS. KMS checks that the caller is allowed, decrypts the data key and returns it, and the secret is decrypted locally. Every request to KMS is recorded in CloudTrail.",
      "This is why access to the KMS key is a second lock. Someone who copied the stored data would have only encrypted data and an encrypted key. RDS and S3 use the same pattern for disks and objects.",
    ],
  },
}

export default lesson
