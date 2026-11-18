import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Use Cloud Logging filters to find the first error in a failed Google Cloud deployment',
    'Match common Google Cloud errors, such as permission denied, a disabled API, and a quota, to their fixes',
    'Confirm a fix with a repeatable check, and record what caused the failure',
  ],
  bigIdea: 'A failed Google Cloud deployment leaves its evidence in Cloud Logging and in the build logs. Filtering for errors in the time window, reading the first one, and matching its code to a cause turns a wall of output into a single question to answer. A fix is confirmed when the same deployment succeeds, not when the error message stops appearing.',
  whyItMatters: 'A Cloud Run deployment of Study Tracker fails, and the build log is hundreds of lines long. The team searches for the word "error" and finds a dozen. The first real error was that the Cloud SQL API was not enabled in the new project. Filtering the logs by severity and time found it in a minute, and enabling the API fixed all of the later errors at once.',
  goalSections: [
    {
      heading: 'Filter the logs by severity and time',
      paragraphs: [
        'Cloud Logging stores the messages from services, builds, and deployments. Narrow the search with a filter for severity and time, so that you read only the errors from the window when the deployment ran. A search for every log line from the day is rarely useful.',
        'Read the first error in time order, not the most dramatic one. Later errors often report that something failed because an earlier step did not finish. The first error is the one that started the chain.',
        'Keep the request or build identifier from the failed run. It links the logs of each service involved, so you can follow one deployment through the system.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          gcloud logging read 'severity>=ERROR AND timestamp>="2026-11-16T09:00:00Z"' --project study-tracker-test --limit 20 --format "table(timestamp, resource.type, textPayload)"
        `,
      },
    },
    {
      heading: 'Common causes and their fixes',
      paragraphs: [
        'PERMISSION_DENIED means the identity running the deployment lacks a role on the project or resource. Grant the specific role the service needs, not the owner role, and check which service account the deployment uses.',
        'An API that is not enabled, such as the Cloud SQL Admin API, produces an error that names the API. Enable it in the project, and keep the list of required APIs in the infrastructure code, so a new project starts with them already on.',
        'A quota error means the project has reached a limit for a resource in that region. Choose another region if the design allows it, or request an increase with the reason written down.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          PERMISSION_DENIED: grant the specific role the service needs to the service account that runs the deployment.
          API not enabled: the error names the API. Enable it, and list the required APIs in the infrastructure code.
          Quota exceeded: choose another region if the design allows it, or request an increase.
        `,
      },
    },
    {
      heading: 'Confirm the fix with a repeatable check',
      paragraphs: [
        'After a fix, run the deployment again from the same configuration, rather than checking one resource by hand. The repeat is the proof, because it shows the whole path works, not only the piece you changed.',
        'Record the cause and the fix in the repository, with the log filter that found the cause. A future engineer can then search for the same error in minutes instead of hours.',
        'Watch the first few minutes after a fix. Some errors appear only once a service receives traffic, so a successful deployment is the first step, not the last. Set an alert on the error rate for the first day, so a new failure is noticed quickly. Keep a short runbook entry for each common error, with the filter that finds it. Review the runbook after each incident, and remove entries that no longer apply.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          errors = [
              ("2026-11-16T09:02:10", "build", "step 2 failed: permission denied"),
              ("2026-11-16T09:01:55", "sql api", "API not enabled: sqladmin.googleapis.com"),
              ("2026-11-16T09:03:40", "deploy", "service not ready"),
          ]
          first = min(errors, key=lambda e: e[0])
          print("start with:", first[1], "-", first[2])
        `,
        output: 'start with: sql api - API not enabled: sqladmin.googleapis.com',
      },
    },
  ],
  seeItInAction: {
    title: 'Finding the first error in time order',
    intro: 'The program above sorts a set of error entries by their timestamps and reports the earliest. Notice that the most visible error is not the first one. Run it, then change the sql api timestamp to 09:04:00 and predict which error is reported first.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        errors = [
            ("2026-11-16T09:02:10", "build", "permission denied"),
            ("2026-11-16T09:01:55", "sql api", "API not enabled"),
            ("2026-11-16T09:03:40", "deploy", "service not ready"),
        ]
        ordered = sorted(errors)
        print("first:", ordered[0][1], "-", ordered[0][2])
        print("later errors:", len(ordered) - 1)
      `,
      output: 'first: sql api - API not enabled\nlater errors: 2',
    },
    steps: [
      { code: 'ordered = sorted(errors)', explanation: 'Sorts by the timestamp at the start of each entry, which is the order the failures happened.' },
      { code: 'print("first:", ordered[0][1], "-", ordered[0][2])', explanation: 'Reports the earliest error, which is the one that started the chain.' },
      { code: 'print("later errors:", len(ordered) - 1)', explanation: 'Shows how many errors came after, so the team knows they may be effects, not causes.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a Cloud Logging filter that finds errors from one Cloud Run service in the last hour. Run it on a test project if you have one, or write it down.',
      'Change the sql api timestamp in the seItInAction example and predict the first error. Run it to check.',
      'Write the note you would leave in the repository after fixing a disabled API, including the log filter that found it.',
    ],
  },
  mistakes: [
    { mistake: 'Searching for the word error and reading the most dramatic message.', fix: 'Filter by severity and time, and read the first error in order.' },
    { mistake: 'Granting the owner role to fix a permission error.', fix: 'Grant the specific role the service needs, to the service account that runs the deployment.' },
    { mistake: 'Declaring a fix done after one resource works by hand.', fix: 'Repeat the full deployment from the same configuration, and confirm it succeeds.' },
  ],
  quiz: [
    {
      question: 'Which error should you read first in a long list from one deployment?',
      options: [
        { text: 'The most alarming one', explanation: 'The most alarming message is not always the first failure.' },
        { text: 'The earliest error in time order', explanation: 'Yes. It started the chain, and later errors may follow from it.' },
        { text: 'The last error', explanation: 'The last error is often a result of an earlier failure.' },
        { text: 'The longest message', explanation: 'Length does not show the cause.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        errors = [("09:05", "deploy"), ("09:01", "api")]
        print(sorted(errors)[0][1])
      ` },
      options: [
        { text: 'deploy', explanation: 'The deploy error is later, at 09:05.' },
        { text: 'api', explanation: 'Yes. Sorting by time puts the 09:01 entry first.' },
        { text: '09:01', explanation: 'The program prints the source, not the time.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why repeat the whole deployment after a fix, instead of checking one resource by hand?',
      options: [
        { text: 'Because the repeat shows the full path works, not only the piece that was changed', explanation: 'Yes. A full run is the evidence that the fix holds end to end.' },
        { text: 'Because manual checks are not allowed', explanation: 'Manual checks are allowed. The full run gives stronger evidence.' },
        { text: 'Because a repeat makes the logs smaller', explanation: 'Log size is not the purpose of the repeat.' },
        { text: 'Because the first deployment is always deleted', explanation: 'The first deployment is not deleted as a rule.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Filter Cloud Logging by severity and time, read the first error in order, match its code to a cause with least privilege, and confirm the fix by running the full deployment again.',
  resources: [
    { title: 'Cloud Logging query language', provider: 'Google Cloud', description: 'How to write filters to find errors and events in Cloud Logging.', url: 'https://cloud.google.com/logging/docs/view/logging-query-language' },
    { title: 'Troubleshoot Cloud Build', provider: 'Google Cloud', description: 'Common Cloud Build failures and how to read their logs.', url: 'https://cloud.google.com/build/docs/troubleshooting' },
  ],
}

export default lesson
