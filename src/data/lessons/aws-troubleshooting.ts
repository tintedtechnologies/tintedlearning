import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Read a CloudFormation stack\'s events in time order and find the first failed resource',
    'Recognize the difference between a root cause and the rollback messages that follow it',
    'Use CloudTrail to find who or what made a change, and fix one cause at a time',
  ],
  bigIdea: 'When a CloudFormation stack fails, it usually rolls back, and the rollback fills the event history with messages that look like the problem. The root cause is the first resource event that failed, before the rollback started. Reading the events in time order, checking permission and limit errors, and using CloudTrail for the who and when leads to a single, verifiable fix.',
  whyItMatters: 'A Study Tracker stack fails and rolls back, and the event list ends with "ROLLBACK_COMPLETE" for the whole stack. A team looks at the stack-level message and assumes the network is broken. The first failed event was an access denied error on creating a role, and the network was fine. Reading in order found it in one screen of events.',
  goalSections: [
    {
      heading: 'Read the events in time order',
      paragraphs: [
        'List the stack events with the CLI, sorted by time. Look for the first event with a failed status, such as CREATE_FAILED or UPDATE_FAILED. That resource is the root cause to investigate. The events after it, including the rollback, are usually the stack undoing the work that was already done.',
        'The stack-level message is a summary. It tells you the stack failed, not why. Open the resource event that failed to read its reason, which often names the permission, the limit, or the setting that was wrong.',
        'Keep the stack name and the time of the failure. Those two details let you match the event to the CloudTrail record of who made the change.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          aws cloudformation describe-stack-events --stack-name study-tracker-test --query "StackEvents[].[Timestamp,LogicalResourceId,ResourceStatus,ResourceStatusReason]" --output table
        `,
      },
    },
    {
      heading: 'Common causes and what they look like',
      paragraphs: [
        'An AccessDenied reason means the account or the stack\'s service role lacks a permission for that resource. Add the specific action on the specific resource, rather than a broad administrator policy, and check the role the stack uses.',
        'A limit reason, such as a quota for elastic IPs or instances, means the account has reached a service limit in that Region. Request an increase if the need is real, or change the Region if the design allows it.',
        'A reason that names a name conflict means a resource with that name already exists. Change the name in the template, and avoid hard-coded names so that environments do not clash.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          AccessDenied: the stack's service role lacks the action on that resource. Add the specific action, not an administrator policy.
          LimitExceeded: the account has reached a service limit in this Region. Request an increase, or choose another Region.
          AlreadyExists: a resource with that name exists. Change the name in the template, and avoid fixed names.
        `,
      },
    },
    {
      heading: 'Use CloudTrail to find the change',
      paragraphs: [
        'CloudTrail records API calls, including who made them, from where, and when. If a stack that worked yesterday fails today, CloudTrail shows what changed in between, such as a policy edit or a console change.',
        'Search CloudTrail for the time window around the failure and for the role or user that ran the deployment. Look for changes to IAM policies and security groups first, since those are the most common causes of sudden failures.',
        'Fix one cause, then run the stack again with a change set. Confirm the first failed event is gone, and record the cause and the fix in the repository, so the next person does not repeat the search. Keep the event log output with the note, so the evidence is not lost when the stack is deleted. If the stack has already rolled back, the events remain visible for the retention period, so start there.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          events = [
              ("12:00:01", "NetworkStack", "CREATE_COMPLETE", ""),
              ("12:00:09", "AppRole", "CREATE_FAILED", "AccessDenied: not authorized to create role"),
              ("12:00:11", "AppStack", "ROLLBACK_IN_PROGRESS", "rolled back after AppRole failed"),
          ]
          root = next((e for e in events if e[2].endswith("FAILED")), None)
          print("root cause:", root[1], "-", root[3])
        `,
        output: 'root cause: AppRole - AccessDenied: not authorized to create role',
      },
    },
  ],
  seeItInAction: {
    title: 'Ignoring the rollback to find the cause',
    intro: 'The program above reads the stack events in order, skips the rollback messages, and reports the first failed resource with its reason. Run it, then change the AppRole event to CREATE_COMPLETE and predict which event becomes the root cause.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        events = [
            ("12:00:01", "NetworkStack", "CREATE_COMPLETE", ""),
            ("12:00:09", "AppRole", "CREATE_FAILED", "AccessDenied"),
            ("12:00:11", "AppStack", "ROLLBACK_COMPLETE", "stack rolled back"),
        ]
        root = next((e for e in events if e[2].endswith("FAILED")), None)
        print("root cause:", root[1])
        print("reason:", root[3])
      `,
      output: 'root cause: AppRole\nreason: AccessDenied',
    },
    steps: [
      { code: 'events = [...]', explanation: 'The events in time order, as they were recorded, with the rollback last.' },
      { code: 'next((e for e in events if e[2].endswith("FAILED")), None)', explanation: 'Finds the first event that failed, which is the root cause. The rollback is not a failure of its own.' },
      { code: 'print("reason:", root[3])', explanation: 'Shows the reason written by the resource, which points to the fix.' },
    ],
  },
  tryIt: {
    instructions: [
      'Run the describe-stack-events command against a test stack, or write down the command, and find the first failed event.',
      'Change the AppRole event in the seItInAction example to CREATE_COMPLETE and predict the root cause. Run it to check.',
      'Write the CloudTrail search you would run for a failure that started at 12:00, including the time window and the entity you would look for.',
    ],
  },
  mistakes: [
    { mistake: 'Treating the stack-level rollback message as the cause.', fix: 'Find the first failed resource event, and read its reason.' },
    { mistake: 'Fixing a permission error with an administrator policy.', fix: 'Add the specific action on the specific resource, and check the role the stack uses.' },
    { mistake: 'Skipping CloudTrail when a stack suddenly fails.', fix: 'Search CloudTrail for changes in the window before the failure.' },
  ],
  quiz: [
    {
      question: 'In a rolled-back stack, what is the root cause?',
      options: [
        { text: 'The stack-level ROLLBACK_COMPLETE message', explanation: 'The rollback is a result of the failure, not the cause.' },
        { text: 'The first resource event that failed, with its reason', explanation: 'Yes. Later events are the stack undoing work after that failure.' },
        { text: 'The last event in the list', explanation: 'The last event is usually the rollback.' },
        { text: 'The stack name', explanation: 'The name does not describe what failed.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for the root cause?',
      code: { language: 'python', runnable: true, code: code`
        events = [("a", "CREATE_COMPLETE"), ("b", "CREATE_FAILED"), ("c", "ROLLBACK_COMPLETE")]
        print(next((n for n, s in events if s.endswith("FAILED")), None))
      ` },
      options: [
        { text: 'a', explanation: 'Resource a completed, so it is not the failure.' },
        { text: 'b', explanation: 'Yes. Resource b is the first with a FAILED status.' },
        { text: 'c', explanation: 'Resource c is the rollback, which follows the failure.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What is CloudTrail most useful for when a stack that worked yesterday fails today?',
      options: [
        { text: 'Finding what changed between the working run and the failure, and who made the change', explanation: 'Yes. It records API calls with the actor and the time.' },
        { text: 'Speeding up the stack', explanation: 'CloudTrail records activity. It does not change performance.' },
        { text: 'Storing the template', explanation: 'Template storage is a different service and job.' },
        { text: 'Creating new resources automatically', explanation: 'CloudTrail records calls. It does not create resources.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Read CloudFormation events in time order to find the first failed resource, fix its cause with least privilege, and use CloudTrail to explain what changed.',
  resources: [
    { title: 'Troubleshooting CloudFormation', provider: 'AWS', description: 'Common stack failures, rollback behavior, and how to diagnose them.', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/troubleshooting.html' },
    { title: 'AWS CloudTrail User Guide', provider: 'AWS', description: 'How CloudTrail records API activity and how to search it.', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html' },
  ],
}

export default lesson
