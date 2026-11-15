import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { functionRequirementsGcp, functionSummaryGcp, testFunctionSummaryGcp } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Google Cloud databases and data platforms, with Study Tracker saving sessions in Cloud SQL and running on Cloud Run. Set the track variables first.',
  goals: [
    'Explain how Cloud Run functions and their triggers work, and when they fit',
    'Write a function that builds Study Tracker\'s weekly summary',
    'Run it on a schedule with Cloud Scheduler, test it often, then switch to weekly',
  ],
  bigIdea: "A Cloud Run function runs your code only when something triggers it, such as an HTTP request, a scheduled job or a new file in Cloud Storage, and scales to zero in between. In an event-driven system, parts react to things that happened instead of calling each other directly. Study Tracker uses one function, called by Cloud Scheduler every Sunday, to write a weekly study summary.",
  whyItMatters: "A weekly summary does not belong inside the web app. The app would need to know when Sunday evening arrives, two instances might both send it, and the code would clutter the API. A function on a schedule runs once at the right time, does its single job and stops, and you can add more jobs like it without touching the app learners use.",
  goalSections: [
    {
      heading: 'Cloud Run functions and their triggers',
      paragraphs: [
        "A Cloud Run function is a Cloud Run service built from a single function in your source code. You deploy the source, Google builds an image with a base image it keeps updated, and the function runs like any other Cloud Run service. The `functions-framework` package turns a Python function into one that answers HTTP requests.",
        "Triggers include plain HTTP calls, Cloud Scheduler for schedules, and Eventarc for events such as an object created in a bucket or a message published to Pub/Sub. Each function runs as its own service account, which decides what it may do.",
        "Functions suit short, independent jobs. Each request has a time limit, and instances keep nothing between runs that you can rely on, so state belongs in a database or a bucket.",
      ],
      example: {
        language: 'text',
        code: code`
          Trigger            Starts the function when       Study Tracker example
          Cloud Scheduler    a schedule says so             weekly summary, Sundays 18:00
          Eventarc, Storage  an object is created           re-index a note when it is uploaded
          Eventarc, Pub/Sub  a message is published         index jobs, from Scalability
          HTTP               a request arrives              a webhook from another service
        `,
      },
    },
    {
      heading: 'The weekly summary function',
      paragraphs: [
        "The function fetches Study Tracker's sessions from its public API with Python's built-in `urllib`, builds a Markdown summary of the last seven days and saves it to a separate bucket, `study-summaries-` plus your suffix. Using the API means the function needs no access to the private database.",
        "It runs as its own service account, `study-tracker-summary`, with Storage Object User on the summaries bucket only. Saving under the date as the name means running it twice in a day overwrites the same object, and overwriting needs the delete permission that Object User includes, while Object Creator does not.",
        "Keeping the summary logic in its own function, `weekly_summary`, makes it easy to test without Google Cloud.",
      ],
      example: {
        language: 'text',
        code: code`
          Cloud Scheduler (Sunday 18:00 UTC), signed in as study-tracker-scheduler
             -> POST https://study-tracker-weekly-summary-....run.app   (only this account may call it)
                -> GET https://<your app>/sessions
                -> upload study-summaries-jd4821 / 2026-11-15.md, as study-tracker-summary
        `,
      },
    },
    {
      heading: 'Schedules and events',
      paragraphs: [
        "Cloud Scheduler uses the standard five-field cron format: minute, hour, day of month, month and day of week. `*/5 * * * *` means every five minutes, ideal for testing, and `0 18 * * 0` means 18:00 every Sunday. Jobs use the time zone you give them, here UTC.",
        "The function is private: `--no-allow-unauthenticated` means callers need the Cloud Run Invoker role. The scheduler job signs each request with an OIDC token, a signed proof of identity, for its own service account, which holds that role on this one function. That keeps even the scheduler on least privilege.",
        "Events in general can arrive late or more than once, as Distributed Systems explained. Handlers should be safe to run twice, which the date-named object achieves here.",
      ],
      example: {
        language: 'text',
        code: code`
          Expression       Means
          */5 * * * *      every 5 minutes, for testing
          0 18 * * 0       18:00 every Sunday, in the job's time zone
          30 7 * * 1-5     07:30, Monday to Friday
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Deploying the weekly summary',
    intro: "Save the files from Try it yourself in a new `weekly-summary` folder and run these from there. The first source deployment may ask to enable APIs and create an Artifact Registry repository named `cloud-run-source-deploy`: answer yes. In PowerShell, set variables as `$NAME = ...`.",
    example: {
      language: 'bash',
      code: code`
        gcloud services enable cloudscheduler.googleapis.com cloudbuild.googleapis.com
        gcloud storage buckets create gs://study-summaries-$SUFFIX --location $REGION --uniform-bucket-level-access --public-access-prevention --labels project=study-tracker
        gcloud iam service-accounts create study-tracker-summary --display-name "Weekly summary function"
        SUMMARY_SA=study-tracker-summary@$PROJECT_ID.iam.gserviceaccount.com
        gcloud storage buckets add-iam-policy-binding gs://study-summaries-$SUFFIX --member serviceAccount:$SUMMARY_SA --role roles/storage.objectUser

        APP_URL=$(gcloud run services describe study-tracker --region $REGION --format "value(status.url)")
        gcloud run deploy study-tracker-weekly-summary --source . --function handler --base-image python312 --region $REGION --service-account $SUMMARY_SA --no-allow-unauthenticated --set-env-vars STUDY_TRACKER_URL=$APP_URL,SUMMARIES_BUCKET=study-summaries-$SUFFIX --labels project=study-tracker
        FUNCTION_URL=$(gcloud run services describe study-tracker-weekly-summary --region $REGION --format "value(status.url)")
        curl -X POST -H "Authorization: Bearer $(gcloud auth print-identity-token)" $FUNCTION_URL

        gcloud iam service-accounts create study-tracker-scheduler --display-name "Weekly summary scheduler"
        SCHEDULER_SA=study-tracker-scheduler@$PROJECT_ID.iam.gserviceaccount.com
        gcloud run services add-iam-policy-binding study-tracker-weekly-summary --region $REGION --member serviceAccount:$SCHEDULER_SA --role roles/run.invoker
        gcloud scheduler jobs create http study-tracker-weekly --location $REGION --schedule "*/5 * * * *" --time-zone Etc/UTC --uri $FUNCTION_URL --http-method POST --oidc-service-account-email $SCHEDULER_SA --oidc-token-audience $FUNCTION_URL
      `,
      output: '{"saved":"2026-11-15.md"}',
    },
    steps: [
      { code: '--role roles/storage.objectUser', explanation: "Lets the function create and overwrite objects in the summaries bucket, and nothing anywhere else." },
      { code: '--source . --function handler --base-image python312', explanation: "Builds the function from this folder, calling `handler` in `main.py`, on Google's Python 3.12 base image, which Google keeps patched." },
      { code: '--no-allow-unauthenticated', explanation: "Makes the function private. Only identities with Cloud Run Invoker on it can call it." },
      { code: 'curl -X POST -H "Authorization: Bearer $(gcloud auth print-identity-token)" $FUNCTION_URL', explanation: "Calls the function once, straight away, signed in as you. The reply names the saved object." },
      { code: '--schedule "*/5 * * * *" --time-zone Etc/UTC', explanation: "Runs every five minutes, in UTC, for testing. The quotes keep the expression as one argument." },
      { code: '--oidc-service-account-email $SCHEDULER_SA --oidc-token-audience $FUNCTION_URL', explanation: "Signs every request as the scheduler's own service account, for this function's address, so Cloud Run can check it holds the Invoker role." },
    ],
  },
  tryIt: {
    instructions: [
      'Save the files below, run `python -m pip install functions-framework google-cloud-storage` and `python -m pytest` in the `weekly-summary` folder, then run the commands above.',
      'Wait for a scheduled run, then list and download a summary with `gcloud storage ls gs://study-summaries-$SUFFIX` and `gcloud storage cp gs://study-summaries-$SUFFIX/2026-11-15.md summary.md`, using your own date.',
      'Switch to the weekly schedule: `gcloud scheduler jobs update http study-tracker-weekly --location $REGION --schedule "0 18 * * 0"`.',
      'Clean up: an idle function scales to zero and costs almost nothing, but if you stop the track, delete the job, function and bucket with `gcloud scheduler jobs delete study-tracker-weekly --location $REGION --quiet`, `gcloud run services delete study-tracker-weekly-summary --region $REGION --quiet` and `gcloud storage rm --recursive gs://study-summaries-$SUFFIX`.',
    ],
    files: [
      { language: 'python', filename: 'weekly-summary/main.py', code: functionSummaryGcp, runnable: false },
      { language: 'text', filename: 'weekly-summary/requirements.txt', code: functionRequirementsGcp },
      { language: 'python', filename: 'weekly-summary/test_main.py', code: testFunctionSummaryGcp, files: { 'main.py': functionSummaryGcp }, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Leaving a test schedule of every few minutes running.', fix: 'Switch to the real cron expression as soon as testing is done.' },
    { mistake: 'Making the function public so the scheduler can call it.', fix: 'Keep it private and give the scheduler\'s own service account the Invoker role on it.' },
    { mistake: 'Granting Object Creator, then seeing the second run of the day fail.', fix: 'Overwriting needs delete permission. Grant Object User on the one bucket.' },
    { mistake: 'Writing handlers that break when run twice.', fix: 'Make repeated runs harmless, for example by overwriting an object named after the date.' },
  ],
  quiz: [
    {
      question: 'What does the Cloud Scheduler expression `0 18 * * 0` mean?',
      options: [
        { text: 'Every 18 minutes', explanation: 'The first field is the minute, set to 0, and the second is the hour, set to 18.' },
        { text: 'At 18:00 every Sunday, in the job\'s time zone', explanation: 'Minute 0, hour 18, any day of month, any month, day of week 0, which is Sunday.' },
        { text: 'At 18:00 on the first of each month', explanation: 'Day of month is `*`, any day. The last field limits it to Sundays.' },
        { text: 'At midnight on day 18', explanation: 'The fields are minute, hour, day of month, month, day of week, in that order.' },
      ],
      answer: 1,
    },
    {
      question: 'Each scheduled call fails with status 403. The function works when you call it with your own token. What is most likely missing?',
      options: [
        { text: 'A larger timeout on the function', explanation: 'A timeout gives a different error. 403 means the caller was refused.' },
        { text: 'Object User on the summaries bucket', explanation: 'That would fail inside the function, after it was allowed to run.' },
        { text: 'A public function, with `--allow-unauthenticated`', explanation: 'That would work, but it lets anyone trigger the job. Fix the scheduler\'s permission instead.' },
        { text: 'Cloud Run Invoker for the scheduler\'s service account on the function', explanation: 'The scheduler signs in as its own account, which needs permission to call this function.' },
      ],
      answer: 3,
    },
    {
      question: 'Why does the summary function call Study Tracker\'s API instead of connecting to Cloud SQL?',
      options: [
        { text: 'The database has only a private address, and the API is the public way in, so the function needs no network or database access', explanation: 'Calling the API avoids connecting the function to the VPC and giving it the database password.' },
        { text: 'Cloud Run functions cannot run Python database drivers', explanation: 'They can, if listed in requirements. The reason is access.' },
        { text: 'Cloud SQL only allows one connection', explanation: 'Cloud SQL allows many connections.' },
        { text: 'The API is always faster than the database', explanation: 'Speed is not the reason.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Use Cloud Run functions for small jobs that run on a trigger, keep them private, give each function and scheduler its own narrow service account, test with a short schedule, switch to the real one, and make every handler safe to run twice.',
  resources: [
    { title: 'Deploy functions to Cloud Run', provider: 'Google Cloud Documentation', description: 'Deploying from source with `gcloud run deploy --function`.', url: 'https://docs.cloud.google.com/run/docs/deploy-functions' },
    { title: 'Cron job format and time zone', provider: 'Google Cloud Documentation', description: 'Cloud Scheduler\'s schedule expressions.', url: 'https://docs.cloud.google.com/scheduler/docs/configuring/cron-job-schedules' },
    { title: 'Use authentication with HTTP targets', provider: 'Google Cloud Documentation', description: 'OIDC tokens from Cloud Scheduler to private Cloud Run services.', url: 'https://docs.cloud.google.com/scheduler/docs/http-target-auth' },
    { title: 'Functions Framework for Python', provider: 'Google Cloud on GitHub', description: 'How Python functions receive HTTP requests and events.', url: 'https://github.com/GoogleCloudPlatform/functions-framework-python' },
  ],
  underTheHood: {
    heading: 'How an OIDC token proves who is calling',
    paragraphs: [
      "When the job fires, Cloud Scheduler asks Google for an ID token for `study-tracker-scheduler`. An ID token is a JSON Web Token: a small JSON document saying who the caller is, which audience it is meant for, here the function's URL, and when it expires, all signed with Google's private key.",
      "The token travels in the request's `Authorization` header. Before your code runs, Cloud Run checks the signature against Google's public keys, checks that the audience matches its own address and that the token has not expired, and finally checks that the identity holds Cloud Run Invoker. Only then does it start an instance and call `handler`.",
      "Because the audience is part of the signed token, a token made for one service is useless against another, and because it expires within about an hour, a copied token soon stops working. Your function never handles a password or key at all: proving identity happens entirely between Google's services.",
    ],
  },
}

export default lesson
