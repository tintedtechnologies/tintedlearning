import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain the difference between a backup and high availability',
    'Set a recovery point objective and a recovery time objective for a simple app',
    'Plan a backup schedule, and test that a restore actually works',
  ],
  bigIdea: 'A backup is a copy of your data at a moment in time, so you can recover after loss or damage. High availability keeps a service running when one part fails, but it does not protect you from deleted or corrupted data. You need both ideas, and you need a tested plan for restoring the copy.',
  whyItMatters: 'A team runs its database on a managed service that replicates the data across zones. One day an engineer runs a script with the wrong filter, and it deletes half the customer orders. The replicas delete the same rows within seconds, because replication copies changes, including mistakes. The team restores from a backup taken the night before, and they lose one day of orders, not the whole history.',
  goalSections: [
    {
      heading: 'Backups and high availability are different',
      paragraphs: [
        'High availability means the service keeps working when a machine, a zone, or a network link fails. Replicas take over, and users may not notice. It protects against hardware failure, but a deleted row is deleted on every replica, so high availability does not help with that case.',
        'A backup is a separate copy, kept at a point in time, that you can restore from. It protects against human error, bad deployments, ransomware, and corrupted data. Keep backups in a place that the failing system cannot change, so a single mistake or attack cannot remove every copy. Test that the backup credentials cannot delete the backups, not only that the backups exist.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Problem                        High availability   Backup
          A server crashes               Helps               Helps
          A zone goes offline            Helps               Helps
          A script deletes rows          Does not help       Helps
          Data is corrupted by a bug     Does not help       Helps
        `,
      },
    },
    {
      heading: 'Setting recovery targets',
      paragraphs: [
        'The recovery point objective, or RPO, is the most data you can afford to lose, measured as time. If your RPO is one day, a nightly backup is enough. If you cannot lose more than an hour of orders, a nightly backup is not enough, and you need more frequent copies. Changing the schedule costs more storage, so the RPO is a business decision as well as a technical one.',
        'The recovery time objective, or RTO, is how long the service can be down while you restore. A restore that takes a day cannot meet an RTO of one hour. Write both numbers for each service, and check the backup plan against them before you rely on it.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Service          RPO (data you can lose)   RTO (time to restore)
          Customer orders  1 hour                    2 hours
          Blog archive     1 day                     1 day
          Analytics data   1 week                    3 days
        `,
      },
    },
    {
      heading: 'Scheduling backups and testing restores',
      paragraphs: [
        'Choose a schedule that meets the RPO, keep several past copies so you can go back before a mistake was made, and delete old copies on a clear schedule to control cost. Store at least one copy in a second region, so a regional failure does not take every copy with it. Check that the second region’s copies are readable, since a copy that cannot be opened is no copy at all.',
        'A backup that has never been restored is a hope, not a plan. Restore to a separate place on a schedule, check the data is complete, and time the restore so you know whether the RTO is realistic. Write the result down, and fix anything that failed the test. A failed restore test is the most useful test you can run, because it finds the gap before an emergency does.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Backup plan
          - Full backup every night, kept for 14 days
          - Copy to a second region each night
          - Restore test every month, to a separate environment
          - Test record: date, time to restore, rows checked, result
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking a backup plan against the targets',
    intro: 'This check compares a backup schedule with the recovery point objective. A nightly backup gives up to 24 hours of data loss, so it fails an RPO of one hour. Run the check and read the message it prints.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'backup_check.py',
      code: code`
        backup_interval_hours = 24
        rpo_hours = 1
        if backup_interval_hours <= rpo_hours:
            print("Plan meets the RPO")
        else:
            print("Plan does not meet the RPO: up to", backup_interval_hours, "hours of data could be lost")
      `,
      output: 'Plan does not meet the RPO: up to 24 hours of data could be lost',
    },
    steps: [
      { code: 'backup_interval_hours = 24', explanation: 'How often a backup is taken. A nightly backup is 24 hours apart.' },
      { code: 'rpo_hours = 1', explanation: 'The most data the team can afford to lose, in hours.' },
      { code: 'if backup_interval_hours <= rpo_hours:', explanation: 'A backup taken at least as often as the RPO keeps the loss within the target.' },
      { code: 'print("Plan does not meet the RPO: ...")', explanation: 'Reports the gap. The fix is a more frequent schedule, not a smaller number in this message.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the backup interval to 1 and predict the output before you run the check. Then run it.',
      'For one application you use, write its RPO and RTO, and check whether its backups are frequent enough.',
      'Write a restore test plan with the date, the steps, and the checks you would run on the restored data.',
    ],
  },
  mistakes: [
    { mistake: 'Assuming replication is a backup.', fix: 'Keep separate backups that a mistake in the live system cannot change or delete.' },
    { mistake: 'Keeping backups that have never been restored.', fix: 'Restore to a separate place on a schedule, and record how long it took.' },
    { mistake: 'Storing every backup in the same place as the data.', fix: 'Keep at least one copy in another region, so one failure cannot take every copy.' },
  ],
  quiz: [
    {
      question: 'A script accidentally deletes customer rows. The database has replicas in three zones. Which statement is true?',
      options: [
        { text: 'The replicas may delete the same rows, so you also need a backup to restore from', explanation: 'Yes. Replication copies changes, including mistakes, so high availability does not undo them.' },
        { text: 'The replicas keep the deleted rows, so nothing is lost', explanation: 'Replicas normally receive the same delete, so they do not keep the rows.' },
        { text: 'The deleted rows come back automatically after a few minutes', explanation: 'Nothing restores the rows automatically in this case. A backup is needed.' },
        { text: 'Three zones protect against this mistake', explanation: 'Zones protect against failures of hardware and location, not against deleted data.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this check print?',
      code: { language: 'python', runnable: true, code: code`
        backup_interval_hours = 6
        rpo_hours = 12
        if backup_interval_hours <= rpo_hours:
            print("Plan meets the RPO")
        else:
            print("Plan does not meet the RPO")
      ` },
      options: [
        { text: 'Plan meets the RPO', explanation: 'Yes. Backups every 6 hours keep the possible loss within the 12-hour target.' },
        { text: 'Plan does not meet the RPO', explanation: 'That message only prints when the interval is longer than the RPO.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
        { text: 'Nothing', explanation: 'One of the two messages always prints.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Which practice shows that a backup plan works?',
      options: [
        { text: 'Restoring to a separate place on a schedule and checking the data', explanation: 'Yes. A tested restore shows the backup is usable and how long it takes.' },
        { text: 'Seeing that the backup job reports success', explanation: 'A successful job does not prove the copy can be restored.' },
        { text: 'Keeping the backups in the same account as the live data', explanation: 'Keeping them together lets one mistake or attack remove every copy.' },
        { text: 'Adding more replicas', explanation: 'Replicas do not protect against deleted or corrupted data.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Set a recovery point and recovery time for each service, keep backups that a live mistake cannot remove, and prove the plan by restoring from it on a schedule.',
  resources: [
    { title: 'Disaster recovery of workloads on AWS', provider: 'Amazon Web Services', description: 'A whitepaper on recovery objectives, backup strategies, and testing recovery for cloud workloads.', url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html' },
  ],
}

export default lesson
