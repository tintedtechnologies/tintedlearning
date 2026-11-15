import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Deploy an Azure workload, with `ca-study-tracker` running and logs going to `log-study-tracker`, and the AI Engineering lesson AI Observability and Operations. Set the track variables and `LOG_ID` from lesson 5.',
  goals: [
    'Read Study Tracker\'s logs in Azure and search them with a query',
    'Get an email alert when the app starts returning server errors',
    'Find out what each part costs, and stop monitoring from becoming a cost itself',
  ],
  bigIdea: "Azure Monitor is Azure's service for logs, metrics and alerts. Logs record what the app said, metrics count what happened, such as requests and errors, and alerts watch a metric and email you when it crosses a line. Together with Cost Management, which shows what each resource costs, they tell you whether Study Tracker is healthy and affordable without you having to look.",
  whyItMatters: "Study Tracker is now public. If it starts failing at two in the morning, nobody will tell you: learners just leave. The log lines you designed in AI Observability and Operations, with their request IDs, are now collected in Azure, and a single alert rule can email you within minutes of errors starting. That is the difference between hearing about a problem from a monitor and hearing about it from an unhappy user.",
  goalSections: [
    {
      heading: 'Logs in Azure',
      paragraphs: [
        "Everything Study Tracker writes to the terminal, every `logger.info` and `logger.warning`, now goes to the Log Analytics workspace `log-study-tracker`. For a quick look, `az containerapp logs show` prints recent lines, and `--follow` keeps printing new ones as they arrive.",
        "To search across days and replicas, use a query in KQL, the Kusto Query Language that Log Analytics uses. Container output lands in a table called `ContainerAppConsoleLogs_CL`, where the `Log_s` column holds each line. A query reads like a pipeline: start with a table, then filter, choose columns and limit, each step after a `|`.",
        "The query command comes from a CLI extension, so add it once with `az extension add --name log-analytics`. Logs reach the workspace after a short delay, typically a few minutes, so `logs show` is better for watching live.",
      ],
      example: {
        language: 'text',
        code: code`
          ContainerAppConsoleLogs_CL                         start with every console log line
          | where ContainerAppName_s == "ca-study-tracker"    only Study Tracker
          | where Log_s contains "WARNING"                     only warnings
          | project TimeGenerated, Log_s                       keep two columns
          | order by TimeGenerated desc                        newest first
          | take 20                                            at most 20 rows
        `,
      },
    },
    {
      heading: 'Alerts on errors',
      paragraphs: [
        "A metric alert rule watches a number and fires when it crosses a threshold. Container Apps publishes a `Requests` metric that can be split by status code category, so a rule can watch only the 5xx responses, the server errors from HTTP and How the Web Works.",
        "When a rule fires, it notifies an action group: a reusable list of who to tell and how, such as an email address. One action group can serve many rules.",
        "Choose thresholds that mean something. One error in a minute may be a fluke, while more than five in five minutes is worth an email. An alert that fires constantly gets ignored, which is worse than no alert at all.",
      ],
      example: {
        language: 'text',
        code: code`
          Alert rule alert-study-5xx
            watches     Requests where statusCodeCategory includes 5xx
            condition   total over 5 minutes > 5
            checked     every minute
            notifies    action group ag-study-tracker -> email you@example.com
        `,
      },
    },
    {
      heading: 'Reading the bill',
      paragraphs: [
        "Cost Management's Cost analysis page shows what each resource and service costs. In the portal, open the resource group, choose Cost analysis, and group by service name or by resource. Because every Study Tracker resource carries the `project=study-tracker` tag, you can also filter by tag across resource groups. This track uses the portal here because cost queries from the command line depend on your billing agreement type.",
        "Expect the registry to cost a small, steady amount each day, the container app almost nothing while scaled to zero, and log storage to depend on how much you log. Cost data arrives up to a day late, as the overview lesson explained.",
        "Monitoring can cost money too. Log Analytics charges for the data it takes in and for keeping it beyond the included retention period. Set a daily cap on how much it takes in, and keep retention short for a learning project.",
      ],
      example: {
        language: 'text',
        code: code`
          Cost analysis for rg-study-tracker, grouped by service (shape of a typical result)
          Container Registry    small, every day the registry exists
          Log Analytics         depends on how much is logged
          Container Apps        near zero while scaled to zero
          Storage               tiny for a few notes
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Logs and an error alert for Study Tracker',
    intro: "Run these as `studyadmin`. They read logs, search them, cap log costs, then create an email alert for server errors and trigger it on purpose. Use your own email address. In PowerShell, set variables as `$NAME = ...`.",
    example: {
      language: 'bash',
      code: code`
        az containerapp logs show --name ca-study-tracker --resource-group $RG --tail 20

        az extension add --name log-analytics
        az monitor log-analytics query --workspace $LOG_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'ca-study-tracker' and Log_s contains 'WARNING' | project TimeGenerated, Log_s | take 20" -o table

        az monitor log-analytics workspace update --resource-group $RG --workspace-name log-study-tracker --quota 0.1 --retention-time 30

        az monitor action-group create --name ag-study-tracker --resource-group $RG --short-name studytrk --action email me you@example.com
        APP_RES=$(az containerapp show --name ca-study-tracker --resource-group $RG --query id -o tsv)
        AG_ID=$(az monitor action-group show --name ag-study-tracker --resource-group $RG --query id -o tsv)
        az monitor metrics alert create --name alert-study-5xx --resource-group $RG --scopes $APP_RES --condition "total Requests > 5 where statusCodeCategory includes 5xx" --window-size 5m --evaluation-frequency 1m --action $AG_ID --description "More than 5 server errors in 5 minutes"
        az monitor metrics alert list --resource-group $RG --query "[].{name:name, enabled:enabled}" -o table
      `,
      output: code`
        Name             Enabled
        ---------------  ---------
        alert-study-5xx  True
      `,
    },
    steps: [
      { code: 'az containerapp logs show --name ca-study-tracker --resource-group $RG --tail 20', explanation: "The last 20 lines from the running app. Add `--follow` to keep watching, and stop with Ctrl+C. If the app has scaled to zero, open it in a browser first." },
      { code: '--analytics-query "ContainerAppConsoleLogs_CL | where ... contains \'WARNING\' | ..."', explanation: "Searches every stored line for warnings, such as the rejected future-dated sessions from the Logging lesson, across all replicas and days." },
      { code: '--quota 0.1 --retention-time 30', explanation: "Caps log intake at 0.1 GB a day and keeps logs for 30 days, which is plenty for a learning project and keeps this part of the bill small." },
      { code: '--action email me you@example.com', explanation: "Creates an action group that emails one address. `me` is just a name for this receiver. Azure sends a confirmation email when you are added." },
      { code: '--condition "total Requests > 5 where statusCodeCategory includes 5xx"', explanation: "Counts only server errors, summed over the window. The quotes keep the whole condition as one argument in both bash and PowerShell." },
      { code: '--window-size 5m --evaluation-frequency 1m', explanation: "Looks at the last 5 minutes, checked every minute. Metrics reach Azure Monitor within a few minutes, so expect a short delay before an alert fires." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the commands above with your own email address.',
      'Trigger the alert on purpose: the notes assistant returns 503 because no model is connected yet, so call `POST /notes/ask` from `/docs` about ten times within a few minutes. Within about ten minutes, you should receive the alert email.',
      'Open the resource group\'s Cost analysis page in the portal, group by service name, and write down which part costs the most so far.',
      'Clean up: alert rules and action groups cost little or nothing, so keep them. If you stop the track, delete them with `az monitor metrics alert delete --name alert-study-5xx --resource-group $RG` and `az monitor action-group delete --name ag-study-tracker --resource-group $RG`.',
    ],
  },
  mistakes: [
    { mistake: 'Waiting for users to report outages.', fix: 'Set at least one alert on server errors as soon as the app is public.' },
    { mistake: 'Alerting on every single error.', fix: 'Choose a threshold and window that mean a real problem, so alerts stay rare enough to act on.' },
    { mistake: 'Logging everything forever with no cap.', fix: 'Set a daily intake cap and a short retention period, and keep DEBUG logging off in Azure.' },
    { mistake: 'Never looking at the cost breakdown.', fix: 'Check Cost analysis grouped by service or tag after each lesson, so you know what each part costs.' },
  ],
  quiz: [
    {
      question: 'Which query finds Study Tracker\'s warning lines in Log Analytics?',
      options: [
        { text: '`ContainerAppConsoleLogs_CL | where ContainerAppName_s == "ca-study-tracker" and Log_s contains "WARNING"`', explanation: 'It starts from the console log table and filters by app name and message text.' },
        { text: '`SELECT * FROM logs WHERE level = WARNING`', explanation: 'That is SQL-style syntax. Log Analytics uses KQL, which starts with a table name and pipes.' },
        { text: '`az containerapp show --name ca-study-tracker --query WARNING`', explanation: 'That reads the app\'s settings, not its logs.' },
        { text: '`Requests where statusCodeCategory includes WARNING`', explanation: 'That is an alert condition on a metric. WARNING is a log level, not a status code category.' },
      ],
      answer: 0,
    },
    {
      question: 'Your alert fires whenever a single request fails, many times a day, and you have started ignoring it. What is the best fix?',
      options: [
        { text: 'Delete the alert', explanation: 'Then real outages go unnoticed.' },
        { text: 'Send it to more people', explanation: 'More people ignoring a noisy alert does not help.' },
        { text: 'Raise the threshold and window so it fires only for a real problem, such as more than 5 errors in 5 minutes', explanation: 'Alerts must be rare and meaningful to be acted on.' },
        { text: 'Check the dashboard every hour instead', explanation: 'Manual checks get skipped. A well-tuned alert is more reliable.' },
      ],
      answer: 2,
    },
    {
      question: 'Your Log Analytics costs are growing quickly while you test Study Tracker. Which change helps most?',
      options: [
        { text: 'Delete the alert rule', explanation: 'Alert rules cost little. The cost is the log data coming in.' },
        { text: 'Increase the retention period to 365 days', explanation: 'Keeping data longer adds cost.' },
        { text: 'Add more replicas', explanation: 'More replicas usually mean more log lines, not fewer.' },
        { text: 'Set `LOG_LEVEL=INFO` instead of DEBUG and set a daily intake cap with `--quota`', explanation: 'Less verbose logs and a cap limit the data that is charged for.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Collect logs centrally and search them with KQL, alert on a meaningful rate of server errors through an action group, and check costs by service and tag, including the cost of monitoring itself.',
  resources: [
    { title: 'Monitor logs in Container Apps', provider: 'Microsoft Learn', description: 'Console and system log tables, with example queries.', url: 'https://learn.microsoft.com/en-us/azure/container-apps/log-monitoring' },
    { title: 'Kusto Query Language overview', provider: 'Microsoft Learn', description: 'The query language used by Log Analytics, with tutorials.', url: 'https://learn.microsoft.com/en-us/kusto/query/' },
    { title: 'Container Apps metrics', provider: 'Microsoft Learn', description: 'Every metric Container Apps publishes, including Requests and its dimensions.', url: 'https://learn.microsoft.com/en-us/azure/container-apps/metrics' },
    { title: 'Quickstart: Cost analysis', provider: 'Microsoft Learn', description: 'Exploring costs by service, resource and tag in the portal.', url: 'https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/quick-acm-cost-analysis' },
  ],
  underTheHood: {
    heading: 'Metrics and logs are different tools',
    paragraphs: [
      "A metric is a number sampled over time, such as requests per minute, already counted and stored in a compact form. Storing one number per minute per dimension is cheap, querying it is fast, and that is why alert rules usually watch metrics: they can be checked every minute at very low cost.",
      "A log line is a full record of one event, with its text and fields. Logs answer questions you did not plan for, such as which request ID failed and what it said, but they are large, take a few minutes to become searchable, and cost more the more you write.",
      "Good monitoring uses both. A metric alert tells you quickly that something is wrong, cheaply. The logs then tell you what and why, through the request ID you attached in AI Observability and Operations. Some teams also create alerts from log queries, which can catch specific messages, but they run less often and cost more, so metrics are the better first line.",
    ],
  },
}

export default lesson
