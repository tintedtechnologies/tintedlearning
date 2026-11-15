import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Google Cloud security engineering, with the app pinned to version 2 of `database-url`, and the architecture lesson Reliability. Set the track variables first.',
  goals: [
    'Explain recovery time and recovery point objectives, and set them for Study Tracker',
    'Choose between protection within a zone, across zones and across regions',
    'Restore Study Tracker\'s database to a point in time and prove the data came back',
  ],
  bigIdea: "Resilience means surviving failures, and disaster recovery means getting back after the ones you could not survive. Two numbers define what you need: the recovery time objective, how long you can be down, and the recovery point objective, how much recent data you can afford to lose. A backup only counts once you have restored it, so this lesson restores one.",
  whyItMatters: "A script meant for a test database runs against production and deletes most of Study Tracker's sessions on a Thursday afternoon. Cloud SQL has seven days of backups and transaction logs, so the data is recoverable, but nobody has tried it: does a restore overwrite the database, how long does it take, how does the app find the restored copy? A team with a practiced runbook is back within the hour. A team without one is guessing under pressure.",
  goalSections: [
    {
      heading: 'Recovery time and recovery point',
      paragraphs: [
        "The recovery time objective, or RTO, is the longest the service may be unavailable after a failure, such as one hour. The recovery point objective, or RPO, is the most recent data you can afford to lose, measured as time, such as fifteen minutes of sessions.",
        "They are business decisions first, because lower numbers cost more. For Study Tracker, losing a few minutes of sessions and being down for an hour is acceptable, which keeps the design simple and cheap.",
        "Then measure what your services deliver. `gcloud sql instances get-latest-recovery-time` shows the newest moment Cloud SQL can restore to, and the gap between that and now is your real RPO at that moment. How long a restore takes, you find out by doing one.",
      ],
      example: {
        language: 'python',
        code: code`
          from datetime import datetime

          latest_recovery = datetime(2026, 11, 12, 14, 58)
          failure = datetime(2026, 11, 12, 15, 0)
          back_online = datetime(2026, 11, 12, 15, 40)
          print("data lost:", failure - latest_recovery)
          print("time down:", back_online - failure)
        `,
        output: 'data lost: 0:02:00\ntime down: 0:40:00',
      },
    },
    {
      heading: 'Zones, regions and backups',
      paragraphs: [
        "Each region has several zones, separate data centers with their own power and networking. Cloud Run is regional, so it already runs instances across zones. A Cloud SQL instance with high availability, `--availability-type REGIONAL`, keeps a standby in a second zone and fails over to it automatically, at roughly double the instance cost.",
        "For a whole region failing, which is rare, Cloud SQL can keep a cross-region read replica to promote, and Cloud Storage offers dual-region and multi-region buckets. Each adds cost and steps to fail over.",
        "Backups protect against a different disaster: mistakes. If a script deletes sessions, the high-availability standby deletes them too, at once. Only a copy from before the mistake helps. For files, Cloud Storage's soft delete, on by default with seven days of retention, keeps deleted and overwritten objects so they can be restored.",
      ],
      example: {
        language: 'text',
        code: code`
          Failure                       Protection                         Study Tracker now
          A script deletes sessions     point-in-time recovery             yes, 7 days
          A note is deleted by mistake  Cloud Storage soft delete          yes, on by default
          One zone fails                Cloud Run across zones, SQL HA     app yes, database not chosen
          A whole region fails          cross-region replica, multi-region not chosen: costs more
        `,
      },
    },
    {
      heading: 'Practicing a restore',
      paragraphs: [
        "A point-in-time recovery never touches the original instance. It clones it into a new instance, here `study-tracker-db-restore`, with the data exactly as it was at the time you choose. The clone keeps the original's settings, network, users and passwords, but gets a new private address.",
        "Study Tracker reads its database URL from Secret Manager, so switching is one new secret version with the clone's address, then a revision pinned to it. Switching back is a revision pinned to the previous version, with no new secret at all.",
        "Write down every step and how long it took. That record is your runbook, the plan the next person follows, and its total tells you whether you meet your RTO.",
      ],
      example: {
        language: 'text',
        code: code`
          Restore drill runbook
          1. Note the time to restore to (before the mistake), in UTC
          2. Clone to a new instance: study-tracker-db-restore
          3. Add a secret version with the clone's address, pin the app to it
          4. Check GET /totals shows the expected data
          5. Pin the app back to the previous version, delete the clone
          6. Record how long each step took
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Restoring Study Tracker\'s database',
    intro: "Save a few sessions and note the UTC time. Wait ten minutes, save one more, then restore to the noted time: the last session should be missing from the restored copy. After lesson 10 the secret has versions 1 and 2, so the new one is 3: adjust if yours differ. Cloning takes several minutes. In PowerShell, set variables as `$NAME = ...`, and write the replacement as `$DB_URL -replace '@[^:]+:5432', \"@${RESTORE_HOST}:5432\"`, saved to a file with `Set-Content -NoNewline` for `--data-file`.",
    example: {
      language: 'bash',
      code: code`
        gcloud sql instances get-latest-recovery-time study-tracker-db
        gcloud sql instances clone study-tracker-db study-tracker-db-restore --point-in-time "2026-11-15T10:00:00.000Z"
        RESTORE_HOST=$(gcloud sql instances describe study-tracker-db-restore --format "value(ipAddresses[0].ipAddress)")

        DB_URL=$(gcloud secrets versions access 2 --secret database-url)
        printf %s "${'$'}{DB_URL/@*:5432/@$RESTORE_HOST:5432}" | gcloud secrets versions add database-url --data-file -
        gcloud run services update study-tracker --region $REGION --update-secrets DATABASE_URL=database-url:3

        gcloud run services update study-tracker --region $REGION --update-secrets DATABASE_URL=database-url:2
        gcloud secrets versions disable 3 --secret database-url
        gcloud sql instances delete study-tracker-db-restore --quiet
      `,
    },
    steps: [
      { code: 'gcloud sql instances get-latest-recovery-time study-tracker-db', explanation: "Shows the newest moment you can restore to. Note the gap from now: that is your current RPO." },
      { code: '--point-in-time "2026-11-15T10:00:00.000Z"', explanation: "Use the UTC time you noted, a moment before the last session was saved. It must be within the seven-day recovery window." },
      { code: 'RESTORE_HOST=$(gcloud sql instances describe study-tracker-db-restore ...)', explanation: "The clone's new private address. Its user and password are the same as the original's." },
      { code: '${DB_URL/@*:5432/@$RESTORE_HOST:5432}', explanation: "A bash replacement: the same URL with the clone's address in place of the original's. The value is piped straight into Secret Manager and never printed." },
      { code: '--update-secrets DATABASE_URL=database-url:3', explanation: "Deploys a revision that uses the clone. When it is ready, `GET /totals` should be missing the last session, proving the data came from the earlier point in time." },
      { code: 'gcloud sql instances delete study-tracker-db-restore --quiet', explanation: "After switching back to version 2, deletes the clone, because it is a full instance charged by the hour." },
    ],
  },
  tryIt: {
    instructions: [
      'Write down an RTO and RPO for Study Tracker, with one sentence each on why they are acceptable.',
      'Run the restore drill above. Time every step and confirm, with `GET /totals`, that the restored copy is missing the last session.',
      'Bring back a deleted note: run `gcloud storage rm gs://study-notes-$SUFFIX/biology.md`, find its generation number with `gcloud storage ls --soft-deleted gs://study-notes-$SUFFIX/biology.md`, then run `gcloud storage restore gs://study-notes-$SUFFIX/biology.md#` followed by that number.',
      'Turn your timings into a runbook in `docs/runbook.md` in your repository, with the exact commands, and compare the total with your RTO.',
      'Clean up: check that `gcloud sql instances list --format "value(name)"` lists only `study-tracker-db`. Soft delete keeps deleted objects for seven days, and they are charged like stored objects during that time, which costs very little for small notes.',
    ],
    evidencePrompt: {
      label: 'Your drill results',
      placeholder: 'For example: RTO 1 hour, RPO 15 minutes. The clone took 11 minutes, the switch 4 minutes, total 15 minutes, within the RTO.',
    },
  },
  mistakes: [
    { mistake: 'Assuming backups work because the console lists them.', fix: 'Restore one on a schedule, check the data, and record how long it took.' },
    { mistake: 'Expecting high availability to undo a mistake.', fix: 'The standby copies deletions too. Use point-in-time recovery for mistakes and high availability for zone failures.' },
    { mistake: 'Switching the app by editing the secret version it already uses.', fix: 'Add a new version and pin the revision to it, so switching back is just pinning the old number again.' },
    { mistake: 'Leaving the clone running after a drill.', fix: 'Make deletion the last step of the runbook, and list instances afterward to confirm.' },
  ],
  quiz: [
    {
      question: 'Study Tracker can lose at most 15 minutes of sessions and be down at most 2 hours. Which number is the RPO?',
      options: [
        { text: '15 minutes', explanation: 'The recovery point objective is how much recent data you can afford to lose.' },
        { text: '2 hours', explanation: 'That is how long it can be down, the recovery time objective.' },
        { text: 'The 7-day recovery window', explanation: 'That is how far back you can restore. RPO is how much recent data a failure may cost.' },
        { text: '2 hours and 15 minutes', explanation: 'They are two separate targets, not added together.' },
      ],
      answer: 0,
    },
    {
      question: 'A script deletes half the sessions. The instance has high availability with a standby in another zone. What gets the data back?',
      options: [
        { text: 'Failing over to the standby', explanation: 'The standby received the same deletions at once.' },
        { text: 'Deploying a new Cloud Run revision', explanation: 'The data is gone from the database, so new instances see the same thing.' },
        { text: 'A point-in-time recovery to a moment before the script ran', explanation: 'Only a copy from before the mistake contains the deleted data.' },
        { text: 'Waiting for tonight\'s automatic backup', explanation: 'That backup would include the deletion.' },
      ],
      answer: 2,
    },
    {
      question: 'What does `gcloud sql instances clone ... --point-in-time` do to the original instance?',
      options: [
        { text: 'It overwrites the original with the earlier data', explanation: 'Point-in-time recovery always creates a new instance.' },
        { text: 'It stops the original until you delete the clone', explanation: 'The original keeps running normally.' },
        { text: 'It deletes the original once the clone is ready', explanation: 'You decide what to delete, after checking the data.' },
        { text: 'Nothing: it creates a new instance with the data as it was at that time', explanation: 'The original is untouched, so you can compare before deciding.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Set an RTO and RPO first, buy only the redundancy they require, protect against mistakes with point-in-time recovery and Cloud Storage soft delete, and practice a restore until it is a timed, written runbook.',
  resources: [
    { title: 'Point-in-time recovery', provider: 'Google Cloud Documentation', description: 'How PITR works in Cloud SQL for PostgreSQL, and its limits.', url: 'https://docs.cloud.google.com/sql/docs/postgres/backup-recovery/pitr' },
    { title: 'Clone instances', provider: 'Google Cloud Documentation', description: 'What a clone keeps and what it changes.', url: 'https://docs.cloud.google.com/sql/docs/postgres/clone-instance' },
    { title: 'Soft delete', provider: 'Google Cloud Documentation', description: 'Keeping and restoring deleted objects in Cloud Storage.', url: 'https://docs.cloud.google.com/storage/docs/soft-delete' },
    { title: 'Disaster recovery planning guide', provider: 'Google Cloud Architecture Center', description: 'RTO, RPO and patterns for recovering on Google Cloud.', url: 'https://docs.cloud.google.com/architecture/dr-scenarios-planning-guide' },
  ],
  underTheHood: {
    heading: 'Backups plus a log of every change',
    paragraphs: [
      "PostgreSQL writes every change to its write-ahead log, or WAL, before changing the data files. Read in order, the log is a full history: insert this session, update that one, commit.",
      "With point-in-time recovery on, Cloud SQL keeps both a daily backup and the write-ahead log since then. Together they cover every moment in the recovery window. The latest recovery time is simply how far the saved log reaches.",
      "To recover to 10:00, Cloud SQL starts a new instance from the last backup before 10:00, then replays the log records in order until it reaches 10:00, and stops. The result contains every change up to that moment and none after it. A restore to a time long after the last backup takes longer, because there is more log to replay. Read replicas use the same idea, replaying the log continuously instead of stopping, which is also why a replica cannot protect you from a mistake: it replays the mistake too.",
    ],
  },
}

export default lesson
