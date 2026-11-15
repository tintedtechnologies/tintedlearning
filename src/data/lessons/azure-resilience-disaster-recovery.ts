import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Azure security engineering, with the database URL stored in Key Vault, and the architecture lesson Reliability. Set the track variables plus `PG`, `KV` and `STORAGE`.',
  goals: [
    'Explain recovery time and recovery point objectives, and set them for Study Tracker',
    'Choose between protection within a region, across zones and across regions',
    'Restore Study Tracker\'s database from a backup and prove the data came back',
  ],
  bigIdea: "Resilience means surviving failures, and disaster recovery means getting back after the ones you could not survive. Two numbers define what you need: the recovery time objective, how long you can be down, and the recovery point objective, how much recent data you can afford to lose. A backup only counts once you have restored it, so this lesson restores one.",
  whyItMatters: "A bug in a new release deletes half of Study Tracker's sessions on a Tuesday morning. The backups exist, the dashboard says so. But nobody on the team has ever restored one, nobody knows how long it takes, and the steps are guessed under pressure while learners complain. Teams that have practiced a restore do it calmly from a written plan. Teams that have not often discover a problem at the worst possible moment.",
  goalSections: [
    {
      heading: 'Recovery time and recovery point',
      paragraphs: [
        "The recovery time objective, or RTO, is the longest the service may be unavailable after a failure, such as one hour. The recovery point objective, or RPO, is the most recent data you can afford to lose, measured as time, such as five minutes of sessions.",
        "They are business decisions first. A banking system might need an RPO near zero and an RTO of minutes, which costs a great deal. For Study Tracker, losing a few minutes of sessions and being down for an hour is acceptable, which keeps the design affordable.",
        "Then check what your services actually deliver. Microsoft's documentation says Azure Database for PostgreSQL backs up its transaction logs often enough that a point-in-time restore can generally lose up to five minutes of data. The time a restore takes is something you measure by doing one.",
      ],
      example: {
        language: 'python',
        code: code`
          from datetime import datetime

          last_restorable = datetime(2026, 3, 6, 9, 55)
          failure = datetime(2026, 3, 6, 10, 0)
          back_online = datetime(2026, 3, 6, 10, 40)
          print("data lost:", failure - last_restorable)
          print("time down:", back_online - failure)
        `,
        output: 'data lost: 0:05:00\ntime down: 0:40:00',
      },
    },
    {
      heading: 'Zones, regions and backups',
      paragraphs: [
        "An availability zone is a separate data center, or group of them, within a region, with its own power and cooling. Zone-redundant setups, such as zone-redundant storage or PostgreSQL high availability in another zone, survive the loss of one data center with little or no downtime, at a higher price.",
        "A whole region failing is rare but possible. Geo-redundant options copy data to a paired region far away: geo-redundant storage, and geo-redundant backups for PostgreSQL, which must be chosen when the server is created. Microsoft's documentation warns that a restore in the other region can lose up to an hour of data, because copies travel there with a delay.",
        "Backups protect against a different kind of disaster: mistakes. If a bug deletes data, every replica faithfully deletes it too. Only a copy from before the mistake helps, which is why point-in-time restore matters even with high availability. For files, Blob Storage offers soft delete, which keeps deleted blobs for a set number of days, and versioning, which keeps old versions when a blob is overwritten.",
      ],
      example: {
        language: 'text',
        code: code`
          Failure                      Protection                      Study Tracker now
          A bug deletes sessions       point-in-time restore           yes, 7 days of backups
          A note is deleted by mistake blob soft delete, versioning    this lesson turns them on
          One data center fails        zone-redundant options          not chosen: costs more
          A whole region fails         geo-redundant backup, storage   not chosen: costs more
        `,
      },
    },
    {
      heading: 'Practicing a restore',
      paragraphs: [
        "A point-in-time restore never overwrites the original server. It creates a new server holding the data exactly as it was at the time you choose. You then check the data, point the app at the new server if it is right, and remove whichever server you no longer need.",
        "Study Tracker makes the switch easy, because the app reads its database URL from Key Vault. Updating one secret and restarting the app moves it to the restored server, and doing the same again moves it back.",
        "Write down every step and time each one as you go. That record becomes your runbook, the step-by-step plan the next person follows, and the measured time tells you whether you really meet your RTO.",
      ],
      example: {
        language: 'text',
        code: code`
          Restore drill runbook
          1. Note the time you want to restore to (before the mistake), in UTC
          2. Restore to a new server: psql-study-jd4821-restore
          3. Point Key Vault's database-url at the new server, restart the app
          4. Check GET /totals shows the expected data
          5. Point database-url back, restart, delete the restored server
          6. Record how long each step took
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Restoring Study Tracker\'s database',
    intro: "Save a few sessions first and note the UTC time. Wait 10 minutes, save one more, then restore to the noted time: the last session should be missing from the restored copy. Run these as `studyadmin`. In PowerShell, set variables as `$NAME = ...`, and the URL replacement on the `NEW_URL` line becomes `$NEW_URL = $DB_URL.Replace(\"$PG.\", \"$PG-restore.\")`.",
    example: {
      language: 'bash',
      code: code`
        az storage account blob-service-properties update --account-name $STORAGE --resource-group $RG --enable-delete-retention true --delete-retention-days 7 --enable-versioning true

        az postgres flexible-server restore --resource-group $RG --name $PG-restore --source-server $PG --restore-time "2026-11-15T10:00:00Z" --vnet vnet-study-tracker --subnet snet-db --private-dns-zone study-tracker.private.postgres.database.azure.com

        DB_URL=$(az keyvault secret show --vault-name $KV --name database-url --query value -o tsv)
        NEW_URL=${'$'}{DB_URL/$PG./$PG-restore.}
        az keyvault secret set --vault-name $KV --name database-url --value "$NEW_URL" --query name -o tsv
        REVISION=$(az containerapp show --name ca-study-tracker --resource-group $RG --query properties.latestRevisionName -o tsv)
        az containerapp revision restart --name ca-study-tracker --resource-group $RG --revision $REVISION

        az keyvault secret set --vault-name $KV --name database-url --value "$DB_URL" --query name -o tsv
        az containerapp revision restart --name ca-study-tracker --resource-group $RG --revision $REVISION
        az postgres flexible-server delete --resource-group $RG --name $PG-restore --yes
      `,
    },
    steps: [
      { code: '--enable-delete-retention true --delete-retention-days 7 --enable-versioning true', explanation: "Deleted notes are kept for 7 days and overwritten notes keep their old versions. Try it: delete a note with `az storage blob delete`, then bring it back with `az storage blob undelete`, both with `--auth-mode login`." },
      { code: '--restore-time "2026-11-15T10:00:00Z"', explanation: "Use the UTC time you noted, a moment before the last session was saved. The restore must be within the 7-day retention period." },
      { code: '--vnet vnet-study-tracker --subnet snet-db --private-dns-zone ...', explanation: "The restored server goes into the same private subnet and DNS zone, so the app can reach it. It keeps the original's administrator name and password." },
      { code: 'NEW_URL=${DB_URL/$PG./$PG-restore.}', explanation: "A bash replacement: the same URL with the restored server's name. Nothing else in the URL changes." },
      { code: 'az keyvault secret set ... --value "$NEW_URL"', explanation: "Points the app at the restored server. After the restart, `GET /totals` should be missing the last session, proving the data really came from the earlier point in time. If it has not changed yet, wait a few minutes: the app checks Key Vault for new versions within 30 minutes." },
      { code: 'az postgres flexible-server delete --resource-group $RG --name $PG-restore --yes', explanation: "After switching back, the restored copy is removed, because it is a full server charged by the hour." },
    ],
  },
  tryIt: {
    instructions: [
      'Write down an RTO and RPO for Study Tracker, with one sentence each on why they are acceptable.',
      'Run the restore drill above. Time every step and confirm, with `GET /totals`, that the restored copy is missing the last session.',
      'Turn your timings into a runbook in `docs/runbook.md` in your repository, with the exact commands, and compare your measured time with your RTO.',
      'Clean up: make sure the restored server is deleted, with `az postgres flexible-server list --resource-group $RG -o table` showing only the original. Soft delete and versioning cost very little for small notes, so keep them.',
    ],
    evidencePrompt: {
      label: 'Your drill results',
      placeholder: 'For example: RTO 1 hour, RPO 15 minutes. The restore took 14 minutes, the switch 3 minutes, total 21 minutes, within the RTO.',
    },
  },
  mistakes: [
    { mistake: 'Assuming backups work because the portal shows them.', fix: 'Restore one on a schedule, check the data, and record how long it took.' },
    { mistake: 'Relying on replicas to undo mistakes.', fix: 'Replicas copy deletions too. Use point-in-time restore and blob soft delete for mistakes.' },
    { mistake: 'Paying for zone or region redundancy without a reason.', fix: 'Set an RTO and RPO first, then buy only the redundancy those numbers require.' },
    { mistake: 'Forgetting to delete the restored copy after a drill.', fix: 'Make deletion the last step of the runbook, and check the server list afterward.' },
  ],
  quiz: [
    {
      question: 'Study Tracker can lose at most 15 minutes of sessions and be down at most 2 hours. Which number is the RPO?',
      options: [
        { text: '2 hours', explanation: 'That is how long it can be down, the recovery time objective.' },
        { text: '15 minutes', explanation: 'The recovery point objective is how much recent data you can afford to lose.' },
        { text: '2 hours and 15 minutes', explanation: 'They are two separate targets, not added together.' },
        { text: 'The backup retention period', explanation: 'Retention is how long backups are kept. RPO is how much data a failure may cost.' },
      ],
      answer: 1,
    },
    {
      question: 'A bug deletes half the sessions, and the server has zone-redundant high availability. What gets the data back?',
      options: [
        { text: 'Failing over to the standby server in the other zone', explanation: 'The standby received the same deletions, so it has the same missing data.' },
        { text: 'Restarting the container app', explanation: 'The data is gone from the database, so restarting the app changes nothing.' },
        { text: 'Waiting for the next daily backup', explanation: 'That backup would include the deletion.' },
        { text: 'A point-in-time restore to a moment before the bug ran', explanation: 'Only a copy from before the mistake contains the deleted data.' },
      ],
      answer: 3,
    },
    {
      question: 'What does `az postgres flexible-server restore` do to the original server?',
      options: [
        { text: 'Nothing: it creates a new server with the data as it was at the chosen time', explanation: 'The original is untouched, so you can compare before deciding which to keep.' },
        { text: 'It overwrites the original with the backup', explanation: 'Restores always go to a new server.' },
        { text: 'It deletes the original once the restore finishes', explanation: 'You decide what to delete, after checking the data.' },
        { text: 'It stops the original until you switch back', explanation: 'The original keeps running normally.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Set an RTO and RPO first, buy only the redundancy they require, protect against mistakes with point-in-time restore and soft delete, and practice a restore until it is a timed, written runbook.',
  resources: [
    { title: 'Backup and restore in Azure Database for PostgreSQL', provider: 'Microsoft Learn', description: 'How backups work, retention, point-in-time and geo-restore, and expected data loss.', url: 'https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-backup-restore' },
    { title: 'Soft delete for blobs', provider: 'Microsoft Learn', description: 'Recovering deleted blobs within the retention period.', url: 'https://learn.microsoft.com/en-us/azure/storage/blobs/soft-delete-blob-overview' },
    { title: 'What are availability zones?', provider: 'Microsoft Learn', description: 'Zones, regions and how Azure services use them for resilience.', url: 'https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview' },
    { title: 'Disaster recovery strategies', provider: 'Azure Well-Architected Framework', description: 'Planning recovery with RTO, RPO and runbooks.', url: 'https://learn.microsoft.com/en-us/azure/well-architected/reliability/disaster-recovery' },
  ],
  underTheHood: {
    heading: 'How point-in-time restore works',
    paragraphs: [
      "PostgreSQL records every change in a write-ahead log, or WAL, before applying it to the data files. The log is a complete, ordered history of changes: insert this row, update that one, commit.",
      "Azure keeps two kinds of backup. Snapshots capture the whole database at moments in time. Archived WAL files capture every change made between snapshots, and are copied off the server frequently, which is why the possible data loss is measured in minutes. Microsoft's documentation describes the delay as generally up to five minutes.",
      "To restore to 10:00, Azure takes the latest snapshot from before 10:00, starts a new server from it, then replays the archived WAL records in order until it reaches 10:00, and stops. The result is the database exactly as it was at that moment, including every change up to it and nothing after. The same log-replay idea powers database replicas, which simply never stop replaying.",
    ],
  },
}

export default lesson
