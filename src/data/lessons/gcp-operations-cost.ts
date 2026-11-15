import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { gcpAlertPolicyJson } from './gcp-shared'

const lesson: StructuredLesson = {
  assumes: 'Deploy a Google Cloud workload, with `study-tracker` running on Cloud Run, and the Software Engineering lesson Logging. Set the track variables first.',
  goals: [
    'Read and search Study Tracker\'s logs in Cloud Logging',
    'Get an email when the app starts returning server errors',
    'See what each Google Cloud service costs and keep logging costs under control',
  ],
  bigIdea: "Cloud Logging stores what the app writes, and Cloud Monitoring collects metrics, numbers such as requests and errors, and runs alerting policies that notify you when a metric crosses a line. Cloud Run sends both automatically, with no agent to install. Billing reports then show what each service costs, so you know whether Study Tracker is healthy and affordable without checking by hand.",
  whyItMatters: "Study Tracker is now public on Google Cloud. If it starts failing in the night, no learner will email you, they will simply stop using it. The log lines with request IDs you designed in AI Observability and Operations are already stored in Cloud Logging, and one alerting policy can email you within minutes of server errors starting. That turns a silent outage into a message on your phone.",
  goalSections: [
    {
      heading: 'Logs in Cloud Logging',
      paragraphs: [
        "Everything Study Tracker prints arrives in Cloud Logging as log entries, each tagged with the resource that wrote it, here a `cloud_run_revision` named `study-tracker`. Cloud Run also writes a request log entry for every request, with its status code and how long it took.",
        "`gcloud logging read` searches with the Logging query language. `resource.labels.service_name=\"study-tracker\"` keeps only this service, and `textPayload:\"WARNING\"` keeps lines containing that word, which Study Tracker's log format includes for warnings.",
        "Logs are kept in a log bucket, by default for 30 days, then deleted. You pay for the amount of log data stored beyond a monthly free allotment, so leave DEBUG logging off in the cloud.",
      ],
      example: {
        language: 'text',
        code: code`
          2026-11-15 10:41:07 WARNING study_tracker.api request_id=7f3a rejected session: minutes must be positive
          2026-11-15 10:41:09 WARNING study_tracker.ai call=chat/completions status=503 ms=12
        `,
      },
    },
    {
      heading: 'Alerting on errors',
      paragraphs: [
        "Cloud Run reports the metric `run.googleapis.com/request_count`, labeled with each response's code class, such as `2xx` or `5xx`. An alerting policy watches a filtered metric and opens an incident when its condition is true: here, more than five 5xx responses summed over five minutes.",
        "A notification channel says where alerts go, here an email address. Creating channels from the CLI is still a beta command, so `gcloud` offers to install its beta component the first time you run it. The channel is then attached to the policy.",
        "Choose thresholds that mean a real problem. One error in a week does not need an email at night, while a burst of them does. Alerts that fire too often get ignored, which is as bad as having none. When the errors stop, the incident closes on its own.",
      ],
      example: {
        language: 'text',
        code: code`
          Metric     run.googleapis.com/request_count, response_code_class = 5xx
          Condition  sum over 5 minutes > 5
          Channel    email to you@example.com
          States     open incident -> email, then closed when the errors stop
        `,
      },
    },
    {
      heading: 'Reading the bill',
      paragraphs: [
        "In the console, Billing, then Reports, shows costs by service, project and day, and can filter by label, such as `project=study-tracker`. Cost data arrives with a delay, so check the day after creating something new.",
        "For Study Tracker so far, the main costs are Cloud Run while handling requests, Artifact Registry storage for images, a little Cloud Storage, and Cloud Logging. An idle Cloud Run service scaled to zero costs almost nothing.",
        "Logging is a common surprise, because chatty apps write a lot. Keeping INFO as the level and logging what happened rather than every detail, as in Logging, keeps it small.",
      ],
      example: {
        language: 'text',
        code: code`
          Service            Charged for                          Keep it low by
          Cloud Run          CPU and memory while serving         scale to zero, max 2 instances
          Artifact Registry  stored image data                    delete old image versions
          Cloud Logging      log data beyond the free allotment   INFO level, no DEBUG in the cloud
          Cloud Storage      stored notes                         small notes cost very little
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Searching logs and alerting on server errors',
    intro: "Run these in your terminal, with your own email address. Save `alert-policy.json` from Try it yourself first. The single quotes around the log query work the same in bash and PowerShell.",
    example: {
      language: 'bash',
      code: code`
        gcloud logging read 'resource.type="cloud_run_revision" AND resource.labels.service_name="study-tracker" AND textPayload:"WARNING"' --limit 20 --freshness 1d --format "value(textPayload)"

        gcloud services enable monitoring.googleapis.com
        CHANNEL=$(gcloud beta monitoring channels create --type email --display-name "Study Tracker alerts" --channel-labels email_address=you@example.com --format "value(name)")
        gcloud monitoring policies create --policy-from-file alert-policy.json --notification-channels $CHANNEL
        gcloud monitoring policies list --format "table(displayName, enabled)"
      `,
      output: code`
        DISPLAY_NAME                 ENABLED
        study-tracker server errors  True
      `,
    },
    steps: [
      { code: "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"study-tracker\"", explanation: "Keeps only entries from this Cloud Run service. `AND textPayload:\"WARNING\"` narrows them to warning lines." },
      { code: '--limit 20 --freshness 1d', explanation: "Returns at most 20 entries, newest first, from the last day." },
      { code: 'gcloud beta monitoring channels create --type email ...', explanation: "Creates the email channel and saves its name, such as `projects/study-tracker-jd4821/notificationChannels/1234567890`, for the next command." },
      { code: '"metric.labels.response_code_class = \\"5xx\\""', explanation: "In `alert-policy.json`. Counts only server errors, the responses where Study Tracker itself failed." },
      { code: '"aggregations": [{ "alignmentPeriod": "300s", "perSeriesAligner": "ALIGN_SUM", ... }]', explanation: "Adds up the errors in each five-minute window, across all revisions, before comparing with the threshold." },
      { code: '--notification-channels $CHANNEL', explanation: "Sends an email when the policy opens an incident, and again when it closes." },
    ],
  },
  tryIt: {
    instructions: [
      'Save `alert-policy.json` below and run the commands above.',
      'Trigger the alert on purpose: with no model connected, the notes assistant returns 503, so call `POST /notes/ask` about ten times within a few minutes from `/docs`. Within a few minutes an incident should open and you should get an email.',
      'Open Billing, then Reports, in the console. Group by service and note what Study Tracker has cost so far.',
      'Clean up: policies and channels cost nothing, so keep them. If you stop the track, delete them with `gcloud monitoring policies delete` and `gcloud beta monitoring channels delete`, using the names from their list commands.',
    ],
    files: [{ language: 'text', filename: 'alert-policy.json', code: gcpAlertPolicyJson }],
  },
  mistakes: [
    { mistake: 'Creating an alerting policy with no notification channel.', fix: 'Attach a channel, or incidents open and close silently in the console.' },
    { mistake: 'Alerting on every single error.', fix: 'Use a threshold and window that mean a real problem, so alerts stay rare enough to act on.' },
    { mistake: 'Leaving DEBUG logging on in the cloud.', fix: 'Use INFO in Cloud Run. Debug output multiplies log volume and cost.' },
    { mistake: 'Never looking at costs until the bill arrives.', fix: 'Check Billing reports by service, and by the `project` label, after each lesson.' },
  ],
  quiz: [
    {
      question: 'You triggered errors and the console shows an open incident, but no email arrived. What is most likely missing?',
      options: [
        { text: 'A larger threshold', explanation: 'The incident opened, so the threshold was crossed.' },
        { text: 'More log retention', explanation: 'Retention does not affect alerts.' },
        { text: 'A notification channel attached to the policy, or the right address in it', explanation: 'Without a channel, incidents open with no one told.' },
        { text: 'A second Cloud Run instance', explanation: 'Instance count has nothing to do with notifications.' },
      ],
      answer: 2,
    },
    {
      question: 'Which metric and label count the server errors Study Tracker itself returned?',
      options: [
        { text: '`run.googleapis.com/request_count` with `response_code_class` 5xx', explanation: 'Cloud Run counts every response, labeled by its code class.' },
        { text: '`request_count` with `response_code_class` 4xx', explanation: '4xx means the request was wrong, such as invalid input, not that the server failed.' },
        { text: 'The number of log entries per minute', explanation: 'That measures how much the app writes, not how it is answering.' },
        { text: 'The budget\'s forecast', explanation: 'Budgets track cost, not errors.' },
      ],
      answer: 0,
    },
    {
      question: 'Your Cloud Logging costs are growing while you test. Which change helps most?',
      options: [
        { text: 'Adding more alerting policies', explanation: 'Policies do not reduce log volume.' },
        { text: 'Switching the service to more instances', explanation: 'More instances write at least as much.' },
        { text: 'Turning off request logs in the alerting policy', explanation: 'Alerting policies do not control what is logged.' },
        { text: 'Setting the app\'s log level to INFO instead of DEBUG', explanation: 'Debug output is usually most of the volume, and you pay for volume.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Search Study Tracker\'s logs in Cloud Logging, alert on Cloud Run\'s 5xx request count with a notification channel attached, keep log levels sensible, and check Billing reports by service after each lesson.',
  resources: [
    { title: 'Logging query language', provider: 'Google Cloud Documentation', description: 'Writing filters for `gcloud logging read` and the Logs Explorer.', url: 'https://docs.cloud.google.com/logging/docs/view/logging-query-language' },
    { title: 'Cloud Run metrics', provider: 'Google Cloud Documentation', description: 'Request counts, latencies and their labels.', url: 'https://docs.cloud.google.com/monitoring/api/metrics_gcp_p_z#gcp-run' },
    { title: 'Alerting overview', provider: 'Google Cloud Documentation', description: 'Policies, conditions, incidents and notification channels.', url: 'https://docs.cloud.google.com/monitoring/alerts' },
    { title: 'Cloud Billing reports', provider: 'Google Cloud Documentation', description: 'Viewing costs by service, project and label.', url: 'https://docs.cloud.google.com/billing/docs/how-to/reports' },
  ],
  underTheHood: {
    heading: 'Aligning and reducing a metric',
    paragraphs: [
      "A metric is not one number but many time series. Cloud Run writes a separate series of request counts for each revision and each response code, every minute. Before an alerting policy can compare anything with a threshold, it has to turn all of that into one value per moment.",
      "Alignment comes first. Each series is cut into windows of the alignment period, here five minutes, and the aligner combines the points in each window, here by summing them: `ALIGN_SUM` turns per-minute counts into a five-minute total.",
      "Reduction comes second. The reducer combines the aligned series into one, here by summing across revisions and codes with `REDUCE_SUM`. The result is a single number, server errors in the last five minutes, which the condition compares with 5. Choosing a different aligner, such as a rate per second, or grouping the reducer by revision, changes what the alert means, which is why these two settings deserve a careful look in every policy.",
    ],
  },
}

export default lesson
