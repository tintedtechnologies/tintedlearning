import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { invokeLambdaPolicyJson, scheduleTargetJson, trustLambdaJson, trustSchedulerJson, writeSummariesPolicyJson } from './aws-shared'
import { lambdaSummary, testLambdaSummary } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'AWS databases and data platforms, with Study Tracker saving sessions in RDS, and the `study-tracker` service running. Set the track variables plus `ACCOUNT` and `SERVICE_ARN`.',
  goals: [
    'Explain how Lambda functions and their triggers work, and when they fit',
    'Write a Lambda function that builds Study Tracker\'s weekly summary',
    'Run it on a schedule with EventBridge Scheduler, test it often, then switch to weekly',
  ],
  bigIdea: "AWS Lambda runs a function only when something triggers it, such as a schedule, a new file in S3 or a message, and charges only for the time it runs. In an event-driven system, parts react to things that happened instead of calling each other directly. Study Tracker uses one Lambda function, started by EventBridge Scheduler every Sunday, to write a weekly study summary.",
  whyItMatters: "A weekly summary does not belong inside the web app. The app would need to know when Sunday evening arrives, two tasks might both send it, and the code would clutter the API. A Lambda function on a schedule runs once at the right time, does its single job and stops, and you can add more jobs like it without touching the app learners use.",
  goalSections: [
    {
      heading: 'Lambda and its triggers',
      paragraphs: [
        "A Lambda function is code plus a handler, the function Lambda calls with the event that triggered it. Triggers include EventBridge Scheduler for schedules, S3 for new files, SQS for queue messages and API Gateway for web requests.",
        "Each function runs with an execution role, an IAM role like Study Tracker's task role, which decides what the function may do. It also needs permission to write its own logs, which AWS's managed policy `AWSLambdaBasicExecutionRole` provides.",
        "Lambda suits short, independent jobs. Each run has a time limit, set in the function's configuration, and keeps nothing in memory between runs that it can rely on, so state belongs in a database or S3.",
      ],
      example: {
        language: 'text',
        code: code`
          Trigger                  Starts the function when       Study Tracker example
          EventBridge Scheduler    a schedule says so             weekly summary, Sundays 18:00
          S3 event notification    an object is created           re-index a note when it is uploaded
          SQS queue                a message arrives              index jobs, from Scalability
          API Gateway              a web request arrives          a webhook from another service
        `,
      },
    },
    {
      heading: 'The weekly summary function',
      paragraphs: [
        "The function fetches Study Tracker's sessions from its public API with Python's built-in `urllib`, builds a Markdown summary of the last seven days and saves it to a separate bucket, `study-summaries-` plus your suffix. Using the API means the function needs no access to the private database.",
        "Lambda's Python runtime already includes boto3, so this function has no packages to install: one file, zipped, is the whole deployment. Keeping the summary logic in its own function, `weekly_summary`, makes it easy to test without AWS.",
        "Its role can write to the summaries bucket only, and saving under the date as the key means running it twice in a day simply overwrites the same file.",
      ],
      example: {
        language: 'text',
        code: code`
          EventBridge Scheduler (Sunday 18:00 UTC)
             -> invokes study-tracker-weekly-summary, as study-tracker-scheduler-role
                -> GET https://<your app>/sessions
                -> put_object study-summaries-jd4821 / 2026-11-15.md, as study-tracker-lambda-role
        `,
      },
    },
    {
      heading: 'Schedules and events',
      paragraphs: [
        "EventBridge Scheduler starts targets on a schedule. A rate expression such as `rate(5 minutes)` repeats at a fixed interval, ideal for testing. A cron expression has six fields, minutes, hours, day of month, month, day of week and year, so `cron(0 18 ? * SUN *)` means 18:00 every Sunday. The `?` means no particular day of the month, because the day of the week is already set. Times are in UTC unless you choose a time zone.",
        "The scheduler needs its own role, with permission to invoke this one function. That keeps even the scheduler on least privilege.",
        "Events in general can arrive late or more than once, as Distributed Systems explained. Handlers should be safe to run twice, which the date-named file achieves here.",
      ],
      example: {
        language: 'text',
        code: code`
          Expression                  Means
          rate(5 minutes)             every 5 minutes, for testing
          cron(0 18 ? * SUN *)        18:00 UTC every Sunday
          cron(30 7 ? * MON-FRI *)    07:30 UTC, Monday to Friday
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Deploying the weekly summary',
    intro: "Save the files from Try it yourself in a new `weekly-summary` folder, replacing `123456789012` with your account number and `jd4821` with your suffix, and run these from there. On Windows, make the zip with `Compress-Archive -Path lambda_function.py -DestinationPath summary.zip`. In PowerShell, set variables as `$NAME = ...`. If creating the function fails because the role cannot be assumed, wait ten seconds for the new role to be ready and try again.",
    example: {
      language: 'bash',
      code: code`
        aws s3api create-bucket --bucket study-summaries-$SUFFIX --region $REGION
        aws s3api put-bucket-tagging --bucket study-summaries-$SUFFIX --tagging 'TagSet=[{Key=project,Value=study-tracker}]'

        aws iam create-role --role-name study-tracker-lambda-role --assume-role-policy-document file://trust-lambda.json --tags Key=project,Value=study-tracker
        aws iam attach-role-policy --role-name study-tracker-lambda-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
        aws iam put-role-policy --role-name study-tracker-lambda-role --policy-name write-summaries --policy-document file://write-summaries-policy.json

        APP_URL=$(aws ecs describe-express-gateway-service --service-arn $SERVICE_ARN --query "service.activeConfigurations[0].ingressPaths[0].endpoint" --output text)
        zip summary.zip lambda_function.py
        aws lambda create-function --function-name study-tracker-weekly-summary --runtime python3.12 --handler lambda_function.handler --role arn:aws:iam::$ACCOUNT:role/study-tracker-lambda-role --zip-file fileb://summary.zip --timeout 60 --environment "Variables={STUDY_TRACKER_URL=https://$APP_URL,SUMMARIES_BUCKET=study-summaries-$SUFFIX}" --tags project=study-tracker
        aws lambda invoke --function-name study-tracker-weekly-summary response.json

        aws iam create-role --role-name study-tracker-scheduler-role --assume-role-policy-document file://trust-scheduler.json --tags Key=project,Value=study-tracker
        aws iam put-role-policy --role-name study-tracker-scheduler-role --policy-name invoke-summary --policy-document file://invoke-lambda-policy.json
        aws scheduler create-schedule --name study-tracker-weekly --schedule-expression "rate(5 minutes)" --flexible-time-window Mode=OFF --target file://schedule-target.json
      `,
      output: code`
        {
            "StatusCode": 200,
            "ExecutedVersion": "$LATEST"
        }
      `,
    },
    steps: [
      { code: '--policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole', explanation: "Lets the function write its own logs to CloudWatch, where the `print` line appears." },
      { code: '--runtime python3.12 --handler lambda_function.handler', explanation: "Runs Python 3.12 and calls the function `handler` in the file `lambda_function.py`." },
      { code: '--environment "Variables={STUDY_TRACKER_URL=https://$APP_URL,SUMMARIES_BUCKET=study-summaries-$SUFFIX}"', explanation: "Settings the function reads with `os.environ`. Neither is a secret, so plain environment variables are fine here." },
      { code: 'aws lambda invoke --function-name study-tracker-weekly-summary response.json', explanation: "Runs the function once, straight away, and saves its return value to `response.json`. `StatusCode: 200` means it ran. Check `response.json` for the saved key." },
      { code: '--schedule-expression "rate(5 minutes)" --flexible-time-window Mode=OFF', explanation: "Runs every five minutes, exactly on time, for testing. The quotes keep the expression as one argument." },
      { code: '--target file://schedule-target.json', explanation: "Names the function to invoke and the scheduler role to invoke it with." },
    ],
  },
  tryIt: {
    instructions: [
      'Save the files below, run `python -m pytest` in the `weekly-summary` folder, then run the commands above.',
      'Wait for a scheduled run, then list and download a summary with `aws s3 ls s3://study-summaries-$SUFFIX/` and `aws s3 cp s3://study-summaries-$SUFFIX/2026-11-15.md summary.md`, using your own date.',
      'Switch to the weekly schedule: `aws scheduler update-schedule --name study-tracker-weekly --schedule-expression "cron(0 18 ? * SUN *)" --flexible-time-window Mode=OFF --target file://schedule-target.json`.',
      'Clean up: an idle function costs nothing, but if you stop the track, delete the schedule, function and bucket with `aws scheduler delete-schedule --name study-tracker-weekly`, `aws lambda delete-function --function-name study-tracker-weekly-summary` and `aws s3 rb s3://study-summaries-$SUFFIX --force`.',
    ],
    files: [
      { language: 'python', filename: 'weekly-summary/lambda_function.py', code: lambdaSummary, runnable: false },
      { language: 'python', filename: 'weekly-summary/test_lambda_function.py', code: testLambdaSummary, files: { 'lambda_function.py': lambdaSummary }, runWith: 'pytest' },
      { language: 'text', filename: 'weekly-summary/trust-lambda.json', code: trustLambdaJson },
      { language: 'text', filename: 'weekly-summary/write-summaries-policy.json', code: writeSummariesPolicyJson },
      { language: 'text', filename: 'weekly-summary/trust-scheduler.json', code: trustSchedulerJson },
      { language: 'text', filename: 'weekly-summary/invoke-lambda-policy.json', code: invokeLambdaPolicyJson },
      { language: 'text', filename: 'weekly-summary/schedule-target.json', code: scheduleTargetJson },
    ],
  },
  mistakes: [
    { mistake: 'Leaving a test rate of every few minutes running.', fix: 'Switch to the real cron expression as soon as testing is done.' },
    { mistake: 'Using the five-field cron format from other tools.', fix: 'EventBridge cron has six fields, including the year, and needs `?` in either day of month or day of week.' },
    { mistake: 'Giving the function broad S3 access.', fix: 'Allow `s3:PutObject` on the summaries bucket only.' },
    { mistake: 'Writing handlers that break when run twice.', fix: 'Make repeated runs harmless, for example by overwriting a file named after the date.' },
  ],
  quiz: [
    {
      question: 'What does `cron(0 18 ? * SUN *)` mean in EventBridge Scheduler?',
      options: [
        { text: 'Every 18 minutes on Sundays', explanation: 'The first field is minutes, set to 0, and the second is hours, set to 18.' },
        { text: 'At 18:00 on the 18th of each month', explanation: 'Day of month is `?`, meaning no particular day, because the day of week is set.' },
        { text: 'At 18:00 UTC every Sunday', explanation: 'Minutes 0, hours 18, any month, Sundays, any year, in UTC unless a time zone is set.' },
        { text: 'At 6 a.m. every day', explanation: 'Hours use the 24-hour clock, and the day of week limits it to Sundays.' },
      ],
      answer: 2,
    },
    {
      question: '`aws lambda invoke` returns status 200, but no summary appears in the bucket, and the logs show `AccessDenied` for `PutObject`. What is most likely missing?',
      options: [
        { text: 'The `write-summaries` policy on the function\'s role, or it names the wrong bucket', explanation: 'The function runs as its role, which needs `s3:PutObject` on that exact bucket.' },
        { text: 'The scheduler role\'s invoke permission', explanation: 'You invoked it directly, so the scheduler was not involved.' },
        { text: 'A larger timeout', explanation: 'The error is about permission, not time.' },
        { text: 'The `AWSLambdaBasicExecutionRole` policy', explanation: 'That one is for logs, which evidently work.' },
      ],
      answer: 0,
    },
    {
      question: 'Why does the summary function call Study Tracker\'s API instead of connecting to RDS?',
      options: [
        { text: 'Lambda cannot run Python database drivers', explanation: 'It can, if they are packaged. The reason is the network.' },
        { text: 'RDS only allows one connection at a time', explanation: 'RDS allows many connections.' },
        { text: 'The API is always faster than the database', explanation: 'Speed is not the reason.' },
        { text: 'The database is private, and the API is the public way in, so the function needs no VPC access', explanation: 'Calling the API avoids attaching the function to the VPC and opening another security group rule.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Use Lambda for small jobs that run on a trigger, give each function and scheduler its own narrow role, test with a short rate, switch to the real cron expression, and make every handler safe to run twice.',
  resources: [
    { title: 'What is AWS Lambda?', provider: 'AWS Documentation', description: 'Functions, handlers, triggers and execution roles.', url: 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html' },
    { title: 'Schedule types in EventBridge Scheduler', provider: 'AWS Documentation', description: 'Rate and cron expressions, with time zones.', url: 'https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html' },
    { title: 'Using Lambda with Amazon S3', provider: 'AWS Documentation', description: 'Triggering functions when objects are created.', url: 'https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html' },
    { title: 'Lambda Python handler', provider: 'AWS Documentation', description: 'How handlers receive events, and the included boto3.', url: 'https://docs.aws.amazon.com/lambda/latest/dg/python-handler.html' },
  ],
  underTheHood: {
    heading: 'Cold starts and execution environments',
    paragraphs: [
      "When a Lambda function is invoked and nothing is ready, Lambda creates an execution environment: a small, isolated machine with the Python runtime. It loads your code, runs anything at the top level of the file, such as imports, then calls your handler. This first call is slower, a cold start.",
      "After the handler returns, Lambda keeps the environment for a while. If another invocation arrives, it reuses it and calls only the handler, which is much faster. That is why code that is expensive to set up, such as creating clients, often goes at the top of the file, outside the handler.",
      "Environments are never guaranteed to last. Lambda may create several at once under load and remove idle ones at any time. So a function must never rely on memory or files from a previous run, which is the same rule as containers, and why the summary is saved to S3.",
    ],
  },
}

export default lesson
