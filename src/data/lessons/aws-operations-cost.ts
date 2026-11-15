import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Deploy an AWS workload, with the `study-tracker` Express Mode service running and logging to `/ecs/study-tracker`, and the AI Engineering lesson AI Observability and Operations. Set the track variables first.',
  goals: [
    'Read and search Study Tracker\'s logs in CloudWatch',
    'Get an email when the app starts returning server errors',
    'See what each AWS service costs and keep logging costs under control',
  ],
  bigIdea: "Amazon CloudWatch collects logs, metrics and alarms. Logs record what the app said, metrics count what happened, such as requests and errors, and alarms watch a metric and notify you when it crosses a line. AWS Cost Explorer then shows what each service costs, so you know whether Study Tracker is healthy and affordable without checking by hand.",
  whyItMatters: "Study Tracker is now public on AWS. If it starts failing in the night, no learner will email you, they will simply stop using it. The log lines with request IDs you designed in AI Observability and Operations are now stored in CloudWatch, and one alarm can email you within minutes of server errors starting. That turns a silent outage into a message on your phone.",
  goalSections: [
    {
      heading: 'Logs in CloudWatch',
      paragraphs: [
        "Every line Study Tracker writes to the terminal is now stored in the log group `/ecs/study-tracker`, one log stream per task. `aws logs filter-log-events` searches them, and `--filter-pattern WARNING` keeps only lines containing that word.",
        "For more complex questions, CloudWatch Logs Insights has its own query language in the console: choose the log group, then write queries such as `fields @timestamp, @message | filter @message like /WARNING/ | sort @timestamp desc | limit 20`, which reads as a pipeline from left to right.",
        "Logs are charged for the data stored and how long it is kept. The log group was created with a 30-day retention period in lesson 5, so old lines are deleted automatically.",
      ],
      example: {
        language: 'text',
        code: code`
          fields @timestamp, @message        choose the columns
          | filter @message like /WARNING/   only warning lines
          | sort @timestamp desc             newest first
          | limit 20                          at most 20 rows
        `,
      },
    },
    {
      heading: 'Alarms on errors',
      paragraphs: [
        "Express Mode's load balancer publishes a metric called `HTTPCode_Target_5XX_Count`: how many server errors the app returned. A CloudWatch alarm can watch its sum over five minutes and change to the ALARM state when it passes a threshold.",
        "Alarms notify through Amazon SNS, the Simple Notification Service. You create a topic, subscribe your email address to it and confirm the subscription from the email AWS sends. Any number of alarms can use one topic.",
        "The alarm needs the load balancer's name, in the form `app/name/id`, which Express Mode chose for you. The commands find it from the ECS service: service, then target group, then load balancer, then the last part of its ARN.",
      ],
      example: {
        language: 'text',
        code: code`
          Alarm study-tracker-5xx
            metric      AWS/ApplicationELB  HTTPCode_Target_5XX_Count
            dimension   LoadBalancer = app/<name>/<id>
            condition   sum over 5 minutes > 5
            notifies    SNS topic study-tracker-alerts -> you@example.com
        `,
      },
    },
    {
      heading: 'Reading the bill',
      paragraphs: [
        "Cost Explorer shows costs by service, region and tag. From the CLI, `aws ce get-cost-and-usage` returns the month's costs grouped by service. Each Cost Explorer API request has a small charge of its own, listed on AWS's pricing page, so use it occasionally rather than in a loop.",
        "To filter costs by your `project` tag, it must first be activated as a cost allocation tag, which can take up to a day to show results. After that, the Cost Explorer console can show exactly what Study Tracker costs.",
        "Expect the load balancer and the Fargate task to cost a steady amount every hour while the service exists, the registry and logs a little, and S3 almost nothing.",
      ],
      example: {
        language: 'text',
        code: code`
          Month-to-date costs by service (shape of a typical result)
          Elastic Load Balancing          steady, every hour the service exists
          Amazon Elastic Container Service (Fargate)   steady, for one running task
          Amazon CloudWatch               depends on how much is logged
          Amazon EC2 Container Registry   small, for stored images
          Amazon Simple Storage Service   tiny for a few notes
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Logs and an error alarm for Study Tracker',
    intro: "Run these as `studyadmin`, using your own email address and this month's dates in the cost query. In PowerShell, set variables as `$NAME = ...`. The Python one-liner works the same in both shells.",
    example: {
      language: 'bash',
      code: code`
        aws logs filter-log-events --log-group-name /ecs/study-tracker --filter-pattern WARNING --max-items 20 --query "events[].message" --output text

        TG_ARN=$(aws ecs describe-services --cluster default --services study-tracker --query "services[0].loadBalancers[0].targetGroupArn" --output text)
        LB_ARN=$(aws elbv2 describe-target-groups --target-group-arns $TG_ARN --query "TargetGroups[0].LoadBalancerArns[0]" --output text)
        LB_DIM=$(python -c "import sys; print(sys.argv[1].split('loadbalancer/')[1])" $LB_ARN)

        TOPIC_ARN=$(aws sns create-topic --name study-tracker-alerts --tags Key=project,Value=study-tracker --query TopicArn --output text)
        aws sns subscribe --topic-arn $TOPIC_ARN --protocol email --notification-endpoint you@example.com
        aws cloudwatch put-metric-alarm --alarm-name study-tracker-5xx --namespace AWS/ApplicationELB --metric-name HTTPCode_Target_5XX_Count --dimensions Name=LoadBalancer,Value=$LB_DIM --statistic Sum --period 300 --evaluation-periods 1 --threshold 5 --comparison-operator GreaterThanThreshold --treat-missing-data notBreaching --alarm-actions $TOPIC_ARN --tags Key=project,Value=study-tracker

        aws ce update-cost-allocation-tags-status --cost-allocation-tags-status TagKey=project,Status=Active
        aws ce get-cost-and-usage --time-period Start=2026-11-01,End=2026-11-15 --granularity MONTHLY --metrics UnblendedCost --group-by Type=DIMENSION,Key=SERVICE --query "ResultsByTime[0].Groups[].[Keys[0], Metrics.UnblendedCost.Amount]" --output table
      `,
    },
    steps: [
      { code: '--filter-pattern WARNING --max-items 20', explanation: "Finds warning lines across every task's log stream, such as rejected future-dated sessions or failed AI calls." },
      { code: '--cluster default --services study-tracker', explanation: "Express Mode creates an ordinary ECS service named after your Express service, in the default cluster. Its target group points to the load balancer." },
      { code: 'LB_DIM=$(python -c "...split(\'loadbalancer/\')[1]" $LB_ARN)', explanation: "Takes the part of the load balancer's ARN after `loadbalancer/`, such as `app/ecs-express-.../50dc6c...`, which is the name CloudWatch metrics use." },
      { code: 'aws sns subscribe ... --protocol email --notification-endpoint you@example.com', explanation: "AWS emails you a confirmation link. Alarms reach you only after you click it." },
      { code: '--statistic Sum --period 300 --threshold 5 --comparison-operator GreaterThanThreshold', explanation: "Fires when more than 5 server errors happen in 5 minutes. `--treat-missing-data notBreaching` keeps quiet periods, with no requests at all, from counting as problems." },
      { code: 'aws ce update-cost-allocation-tags-status ... TagKey=project,Status=Active', explanation: "Activates the `project` tag for cost reports. A tag only becomes available here after billing has seen it, so if AWS reports it as not found, try again a day after tagging resources. Results by tag then appear within about a day." },
      { code: '--time-period Start=2026-11-01,End=2026-11-15', explanation: "Use the first day of this month and today's date. The end date is not included in the results." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the commands above with your own email address, and confirm the SNS subscription from your inbox.',
      'Trigger the alarm on purpose: with no model connected, the notes assistant returns 503, so call `POST /notes/ask` about ten times within a few minutes. The alarm state should change and you should get an email.',
      'Open Logs Insights in the CloudWatch console, choose `/ecs/study-tracker` and run the query from the first section.',
      'Clean up: alarms and SNS topics cost little or nothing, so keep them. If you stop the track, delete them with `aws cloudwatch delete-alarms --alarm-names study-tracker-5xx` and `aws sns delete-topic --topic-arn $TOPIC_ARN`.',
    ],
  },
  mistakes: [
    { mistake: 'Forgetting to confirm the SNS email subscription.', fix: 'Click the confirmation link AWS sends. Until then, alarms change state silently.' },
    { mistake: 'Alarming on every single error.', fix: 'Use a threshold and period that mean a real problem, so alarms stay rare enough to act on.' },
    { mistake: 'Keeping logs forever.', fix: 'Set a retention period on every log group, and keep DEBUG logging off in AWS.' },
    { mistake: 'Never looking at costs until the bill arrives.', fix: 'Check Cost Explorer by service, and by the `project` tag once it is active, after each lesson.' },
  ],
  quiz: [
    {
      question: 'You created the alarm and triggered errors, but no email arrives. The alarm shows ALARM in the console. What is most likely missing?',
      options: [
        { text: 'The log group\'s retention period', explanation: 'Retention affects how long logs are kept, not alarm notifications.' },
        { text: 'A larger threshold', explanation: 'The alarm already fired, so the threshold worked.' },
        { text: 'The email subscription to the SNS topic was never confirmed', explanation: 'SNS only delivers email after the recipient clicks the confirmation link.' },
        { text: 'The cost allocation tag', explanation: 'Cost tags affect billing reports, not alarms.' },
      ],
      answer: 2,
    },
    {
      question: 'Which metric counts the server errors Study Tracker itself returned through the load balancer?',
      options: [
        { text: '`HTTPCode_Target_5XX_Count` in AWS/ApplicationELB', explanation: 'Target 5XX responses are errors returned by the app\'s tasks.' },
        { text: '`HTTPCode_ELB_5XX_Count`', explanation: 'That counts errors generated by the load balancer itself, such as having no healthy targets.' },
        { text: '`CPUUtilization`', explanation: 'Processor use is about load, not errors.' },
        { text: '`IncomingLogEvents`', explanation: 'That counts log lines, not HTTP responses.' },
      ],
      answer: 0,
    },
    {
      question: 'Your CloudWatch costs are growing while you test. Which change helps most?',
      options: [
        { text: 'Delete the SNS topic', explanation: 'Topics cost almost nothing. The cost is log data.' },
        { text: 'Set retention to never expire', explanation: 'Keeping logs longer adds cost.' },
        { text: 'Run more tasks', explanation: 'More tasks write more logs.' },
        { text: 'Set `LOG_LEVEL=INFO` instead of DEBUG and keep a short retention period', explanation: 'Less verbose logs and shorter retention reduce what is stored and charged.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Keep logs in CloudWatch with a retention period, alarm on a meaningful rate of server errors through a confirmed SNS email, and check costs by service and by your project tag.',
  resources: [
    { title: 'Analyzing logs with CloudWatch Logs Insights', provider: 'AWS Documentation', description: 'The query language and example queries.', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html' },
    { title: 'Application Load Balancer metrics', provider: 'AWS Documentation', description: 'Every metric the load balancer publishes, including target 5XX counts.', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-cloudwatch-metrics.html' },
    { title: 'Using Amazon CloudWatch alarms', provider: 'AWS Documentation', description: 'Alarm states, periods and missing data.', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html' },
    { title: 'Cost allocation tags', provider: 'AWS Documentation', description: 'Activating tags so costs can be grouped by project.', url: 'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html' },
  ],
  underTheHood: {
    heading: 'Alarm states and missing data',
    paragraphs: [
      "A CloudWatch alarm is always in one of three states: OK, ALARM or INSUFFICIENT_DATA. Each period, here every five minutes, it compares the metric with the threshold and moves between states. It only notifies when the state changes, so you get one email when trouble starts, not one every five minutes.",
      "Missing data needs a decision. If nobody uses Study Tracker for an hour, the load balancer reports no 5XX count at all, not zero. By default, an alarm in that situation can drift to INSUFFICIENT_DATA, and an alarm on a quiet service can look broken. Setting missing data to `notBreaching` tells CloudWatch that silence means no errors.",
      "For other metrics, silence means the opposite. An alarm on a heartbeat metric, one your app should send every minute, should treat missing data as breaching, because silence means the app has stopped. Choosing how each alarm treats missing data is part of designing it, not a detail.",
    ],
  },
}

export default lesson
