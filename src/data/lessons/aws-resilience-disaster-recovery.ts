import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'AWS security engineering, with the database URL stored in Secrets Manager, and the architecture lesson Reliability. Set the track variables plus `SG_DB`, the database security group from the networking lesson.',
  goals: [
    'Explain recovery time and recovery point objectives, and set them for Study Tracker',
    'Choose between protection within a zone, across zones and across regions',
    'Restore Study Tracker\'s database to a point in time and prove the data came back',
  ],
  bigIdea: "Resilience means surviving failures, and disaster recovery means getting back after the ones you could not survive. Two numbers define what you need: the recovery time objective, how long you can be down, and the recovery point objective, how much recent data you can afford to lose. A backup only counts once you have restored it, so this lesson restores one.",
  whyItMatters: "A release with a bad migration wipes most of Study Tracker's sessions on a Friday evening. RDS has seven days of backups, so the data is recoverable, but nobody knows the restore command, that it creates a new instance, how long it takes or how to point the app at it. A team that has practiced follows a written runbook and is back within the hour. A team that has not is guessing, at night, under pressure.",
  goalSections: [
    {
      heading: 'Recovery time and recovery point',
      paragraphs: [
        "The recovery time objective, or RTO, is the longest the service may be unavailable after a failure, such as one hour. The recovery point objective, or RPO, is the most recent data you can afford to lose, measured as time, such as fifteen minutes of sessions.",
        "They are business decisions first, because lower numbers cost more. For Study Tracker, losing a few minutes of sessions and being down for an hour is acceptable, which keeps the design simple and cheap.",
        "Then check what your services deliver. AWS's documentation says RDS uploads the database's transaction logs every five minutes, so a point-in-time restore can lose up to about five minutes of changes. How long a restore takes, you find out by doing one.",
      ],
      example: {
        language: 'python',
        code: code`
          from datetime import datetime

          latest_restorable = datetime(2026, 11, 13, 19, 56)
          failure = datetime(2026, 11, 13, 20, 0)
          back_online = datetime(2026, 11, 13, 20, 35)
          print("data lost:", failure - latest_restorable)
          print("time down:", back_online - failure)
        `,
        output: 'data lost: 0:04:00\ntime down: 0:35:00',
      },
    },
    {
      heading: 'Zones, regions and backups',
      paragraphs: [
        "Each AWS region has several availability zones, separate data centers with their own power and networking. A Multi-AZ RDS deployment keeps a standby copy in a second zone and switches to it automatically if the first fails, at roughly double the instance cost. ECS Express Mode already spreads tasks across zones.",
        "For a whole region failing, which is rare, RDS can copy automated backups to another region or keep a read replica there, and S3 can replicate objects to a bucket in another region. Each adds cost and steps to fail over.",
        "Backups protect against a different disaster: mistakes. If a bug deletes sessions, a Multi-AZ standby deletes them too, within milliseconds. Only a copy from before the mistake helps. For files, S3 versioning keeps every old version of an object, and a delete only adds a marker on top, so the note can be brought back.",
      ],
      example: {
        language: 'text',
        code: code`
          Failure                       Protection                        Study Tracker now
          A bug deletes sessions        point-in-time restore             yes, 7 days of backups
          A note is deleted by mistake  S3 versioning                     this lesson turns it on
          One zone fails                Multi-AZ RDS, tasks in 2 zones    tasks yes, database not chosen
          A whole region fails          cross-region backups, replicas    not chosen: costs more
        `,
      },
    },
    {
      heading: 'Practicing a restore',
      paragraphs: [
        "A point-in-time restore never touches the original instance. It creates a new one, here `study-tracker-db-restore`, with the data exactly as it was at the time you choose. You check it, point the app at it if it is right, and delete whichever instance you no longer need.",
        "The new instance gets AWS's default security group unless you name one, so the command passes the database security group, keeping it private and reachable only from the app.",
        "Study Tracker reads its database URL from Secrets Manager, so moving it is one new secret version and one new deployment. Write down every step and how long it took. That record is your runbook, the plan the next person follows, and its total tells you whether you meet your RTO.",
      ],
      example: {
        language: 'text',
        code: code`
          Restore drill runbook
          1. Note the time to restore to (before the mistake), in UTC
          2. Restore to a new instance: study-tracker-db-restore
          3. Put the restored host in the secret, force a new deployment
          4. Check GET /totals shows the expected data
          5. Put the original URL back, redeploy, delete the restored instance
          6. Record how long each step took
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Restoring Study Tracker\'s database',
    intro: "Save a few sessions and note the UTC time. Wait ten minutes, save one more, then restore to the noted time: the last session should be missing from the restored copy. The restore takes several minutes. In PowerShell, set variables as `$NAME = ...`, and write the `NEW_URL` line as `$NEW_URL = $DB_URL.Replace(\"study-tracker-db.\", \"study-tracker-db-restore.\")`.",
    example: {
      language: 'bash',
      code: code`
        aws s3api put-bucket-versioning --bucket study-notes-$SUFFIX --versioning-configuration Status=Enabled

        aws rds describe-db-instances --db-instance-identifier study-tracker-db --query "DBInstances[0].LatestRestorableTime" --output text
        aws rds restore-db-instance-to-point-in-time --source-db-instance-identifier study-tracker-db --target-db-instance-identifier study-tracker-db-restore --restore-time 2026-11-15T10:00:00Z --db-instance-class db.t4g.micro --db-subnet-group-name study-tracker-db --vpc-security-group-ids $SG_DB --no-publicly-accessible --tags Key=project,Value=study-tracker
        aws rds wait db-instance-available --db-instance-identifier study-tracker-db-restore

        DB_URL=$(aws secretsmanager get-secret-value --secret-id study-tracker/database-url --query SecretString --output text)
        NEW_URL=${'$'}{DB_URL/study-tracker-db./study-tracker-db-restore.}
        aws secretsmanager put-secret-value --secret-id study-tracker/database-url --secret-string "$NEW_URL" --query Name --output text
        aws ecs update-service --cluster default --service study-tracker --force-new-deployment --query service.serviceName --output text
        aws ecs wait services-stable --cluster default --services study-tracker

        aws secretsmanager put-secret-value --secret-id study-tracker/database-url --secret-string "$DB_URL" --query Name --output text
        aws ecs update-service --cluster default --service study-tracker --force-new-deployment --query service.serviceName --output text
        aws ecs wait services-stable --cluster default --services study-tracker
        aws rds delete-db-instance --db-instance-identifier study-tracker-db-restore --skip-final-snapshot --delete-automated-backups --query DBInstance.DBInstanceStatus --output text
      `,
    },
    steps: [
      { code: '--versioning-configuration Status=Enabled', explanation: "Keeps old versions of every note from now on. Versioning can later be suspended but never fully turned off." },
      { code: 'LatestRestorableTime', explanation: "The newest moment you can restore to, usually a few minutes ago. The oldest is the start of the 7-day retention period." },
      { code: '--restore-time 2026-11-15T10:00:00Z', explanation: "Use the UTC time you noted, a moment before the last session was saved." },
      { code: '--vpc-security-group-ids $SG_DB --no-publicly-accessible', explanation: "Gives the restored instance the same private network rules as the original. It keeps the original's user name and password." },
      { code: 'NEW_URL=${DB_URL/study-tracker-db./study-tracker-db-restore.}', explanation: "A bash replacement: the same URL with the restored instance's host name, which differs only in its first part." },
      { code: 'aws ecs update-service ... --force-new-deployment', explanation: "Starts new tasks, which read the new secret version. When the service is stable, `GET /totals` should be missing the last session, proving the data came from the earlier point in time." },
      { code: 'aws rds delete-db-instance ... --skip-final-snapshot --delete-automated-backups', explanation: "After switching back, deletes the restored copy and its backups, because it is a full instance charged by the hour. It prints `deleting`." },
    ],
  },
  tryIt: {
    instructions: [
      'Write down an RTO and RPO for Study Tracker, with one sentence each on why they are acceptable.',
      'Run the restore drill above. Time every step and confirm, with `GET /totals`, that the restored copy is missing the last session.',
      'Bring back a deleted note: run `aws s3 rm s3://study-notes-$SUFFIX/biology.md`, find the delete marker with `aws s3api list-object-versions --bucket study-notes-$SUFFIX --prefix biology.md --query "DeleteMarkers[?IsLatest].VersionId" --output text`, then remove it with `aws s3api delete-object --bucket study-notes-$SUFFIX --key biology.md --version-id` followed by that ID.',
      'Turn your timings into a runbook in `docs/runbook.md` in your repository, with the exact commands, and compare the total with your RTO.',
      'Clean up: check that `aws rds describe-db-instances --query "DBInstances[].DBInstanceIdentifier"` lists only `study-tracker-db`. Versioning costs little for small notes, so keep it, but note that a versioned bucket must be emptied of every version, for example with Empty in the S3 console, before it can be deleted.',
    ],
    evidencePrompt: {
      label: 'Your drill results',
      placeholder: 'For example: RTO 1 hour, RPO 15 minutes. The restore took 12 minutes, the switch 6 minutes, total 18 minutes, within the RTO.',
    },
  },
  mistakes: [
    { mistake: 'Assuming backups work because the console lists them.', fix: 'Restore one on a schedule, check the data, and record how long it took.' },
    { mistake: 'Expecting Multi-AZ to undo a mistake.', fix: 'The standby copies deletions too. Use point-in-time restore for mistakes and Multi-AZ for zone failures.' },
    { mistake: 'Restoring without naming the security group.', fix: 'Pass the database security group, or the restored instance gets the default one and the app cannot connect.' },
    { mistake: 'Leaving the restored instance running after a drill.', fix: 'Make deletion the last step of the runbook, and list instances afterward to confirm.' },
  ],
  quiz: [
    {
      question: 'Study Tracker can lose at most 15 minutes of sessions and be down at most 2 hours. Which number is the RPO?',
      options: [
        { text: '2 hours', explanation: 'That is how long it can be down, the recovery time objective.' },
        { text: 'The 7-day backup retention', explanation: 'Retention is how far back you can go. RPO is how much recent data a failure may cost.' },
        { text: '15 minutes', explanation: 'The recovery point objective is how much recent data you can afford to lose.' },
        { text: '2 hours and 15 minutes', explanation: 'They are two separate targets, not added together.' },
      ],
      answer: 2,
    },
    {
      question: 'A bug deletes half the sessions. The database is a Multi-AZ deployment. What gets the data back?',
      options: [
        { text: 'Failing over to the standby in the other zone', explanation: 'The standby received the same deletions within milliseconds.' },
        { text: 'Forcing a new deployment of the service', explanation: 'The data is gone from the database, so new tasks see the same thing.' },
        { text: 'Waiting for tonight\'s automated snapshot', explanation: 'That snapshot would include the deletion.' },
        { text: 'A point-in-time restore to a moment before the bug ran', explanation: 'Only a copy from before the mistake contains the deleted data.' },
      ],
      answer: 3,
    },
    {
      question: 'The notes bucket has versioning on. You run `aws s3 rm s3://study-notes-jd4821/biology.md`. What happens?',
      options: [
        { text: 'S3 adds a delete marker, and the earlier version stays, so removing the marker brings the note back', explanation: 'In a versioned bucket, a simple delete hides the object instead of erasing it.' },
        { text: 'The note is erased permanently', explanation: 'That only happens when you delete a specific version ID.' },
        { text: 'The command fails because versioned objects cannot be deleted', explanation: 'The command succeeds. It just does not erase the data.' },
        { text: 'S3 restores the previous version automatically after a day', explanation: 'Nothing is restored unless you remove the delete marker.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Set an RTO and RPO first, buy only the redundancy they require, protect against mistakes with point-in-time restore and S3 versioning, and practice a restore until it is a timed, written runbook.',
  resources: [
    { title: 'Restoring a DB instance to a specified time', provider: 'AWS Documentation', description: 'Point-in-time restore, latest restorable time and the settings a restore takes.', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html' },
    { title: 'Multi-AZ DB instance deployments', provider: 'AWS Documentation', description: 'How the standby works and when failover happens.', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html' },
    { title: 'Retaining multiple versions of objects with S3 Versioning', provider: 'AWS Documentation', description: 'Versions, delete markers and restoring deleted objects.', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html' },
    { title: 'Disaster recovery options in the cloud', provider: 'AWS Whitepaper', description: 'Backup and restore, pilot light, warm standby and active-active, with RTO and RPO.', url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html' },
  ],
  underTheHood: {
    heading: 'Snapshots plus a log of every change',
    paragraphs: [
      "PostgreSQL writes every change to its write-ahead log, or WAL, before changing the data files. Read in order, the log is a full history: insert this session, update that one, commit.",
      "RDS combines two things. Once a day, during the backup window, it takes a snapshot of the instance's storage. And every five minutes it uploads the latest transaction logs to S3. Together they cover every moment in the retention period, and the five-minute upload is where the possible data loss comes from.",
      "To restore to 10:00, RDS starts a new instance from the last snapshot before 10:00, then replays the saved log records in order until it reaches 10:00, and stops. The result contains every change up to that moment and none after it. This is also why a restore takes longer when the snapshot is many hours older than the chosen time: there is more log to replay. Read replicas use the same idea, replaying the log continuously instead of stopping.",
    ],
  },
}

export default lesson
