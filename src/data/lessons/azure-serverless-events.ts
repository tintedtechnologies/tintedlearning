import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { functionApp, functionHostJson, functionRequirements, testFunctionApp } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Azure databases and data platforms, with Study Tracker saving sessions in PostgreSQL, and Azure compute and storage for the storage account. Set the track variables plus `STORAGE`.',
  goals: [
    'Explain how serverless functions and triggers work, and when they fit',
    'Write a timer-triggered Azure Function that builds Study Tracker\'s weekly summary',
    'Deploy it, test it on a short schedule, then switch it to weekly',
  ],
  bigIdea: "Serverless functions are small pieces of code that Azure runs only when something triggers them, such as a schedule, a new file or a message. You do not manage any server and pay little or nothing while they sit idle. In event-driven systems, parts react to things that happened instead of being called directly, and Study Tracker uses one for a weekly study summary.",
  whyItMatters: "A weekly summary does not belong in the web app. The app would need to be awake at the right moment, it could send the summary twice if two copies run, and the code would clutter the API. A function with a timer runs once at the chosen time, does its one job and stops, and adding more features like it never touches the app that learners use.",
  goalSections: [
    {
      heading: 'Functions and triggers',
      paragraphs: [
        "Every function has exactly one trigger, the event that starts it. A timer trigger runs on a schedule. An HTTP trigger runs when a web request arrives. A blob trigger runs when a file is added or changed in storage. Functions can also have bindings, ready-made connections to read or write other services, though Study Tracker's function uses the SDKs directly so you can see each step.",
        "Azure Functions offers several hosting plans. This track uses Flex Consumption, the plan Microsoft's documentation recommends for new serverless apps: it scales to zero and charges for what runs. Like Container Apps, a function app can use a managed identity.",
        "Functions suit short, independent jobs. A long-running process, or anything that must keep state in memory between runs, belongs elsewhere.",
      ],
      example: {
        language: 'text',
        code: code`
          Trigger    Starts the function when            Study Tracker example
          Timer      a schedule says so                  weekly summary, Sundays 18:00
          HTTP       a web request arrives               a webhook from another service
          Blob       a file is added or changed          re-index a note when it is uploaded
          Queue      a message arrives in a queue        index jobs, from Scalability
        `,
      },
    },
    {
      heading: 'A timer function for the weekly summary',
      paragraphs: [
        "In Python, functions are declared with decorators on a `FunctionApp`. `@app.timer_trigger` takes a schedule written as a six-part cron expression: seconds, minutes, hours, day of month, month and day of week. `0 0 18 * * 0` means 18:00 every Sunday, in Coordinated Universal Time, or UTC, unless you configure a time zone.",
        "Study Tracker's function puts the schedule in an app setting, written as `%SUMMARY_SCHEDULE%`. You can then run it every five minutes while testing and switch to weekly without changing code.",
        "The function asks Study Tracker's public API for its sessions, so it needs no access to the private database, then writes a Markdown summary into a `summaries` container in Blob Storage using the managed identity. The summary logic is a plain function, `weekly_summary`, which is easy to test without Azure.",
      ],
      example: {
        language: 'text',
        code: code`
          Cron expression       Means
          0 */5 * * * *         every 5 minutes, for testing
          0 0 18 * * 0          18:00 UTC every Sunday
          0 30 7 * * 1-5        07:30 UTC, Monday to Friday
        `,
      },
    },
    {
      heading: 'Events instead of calls',
      paragraphs: [
        "In an event-driven design, one part announces that something happened, and others react, as in Architecture Patterns. Azure delivers events through services such as Event Grid, which routes notifications like \"a blob was created\" to whatever subscribes.",
        "For example, a blob trigger with an Event Grid source could re-index a note the moment it is uploaded, instead of waiting for someone to run `index_notes.py`. The uploading code would not need to know that indexing exists.",
        "Events carry the same rules as in Distributed Systems: they can arrive more than once or late, so handlers should be safe to repeat. Writing the summary under the same file name each time, with `overwrite=True`, makes the weekly function safe to run twice.",
      ],
      example: {
        language: 'python',
        runnable: false,
        code: code`
          @app.blob_trigger(arg_name="note", path="notes/{name}", connection="NotesStorage", source="EventGrid")
          def note_uploaded(note: func.InputStream) -> None:
              logging.info("New or changed note: %s", note.name)
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Deploying the weekly summary function',
    intro: "Put `function_app.py`, `host.json` and `requirements.txt` from Try it yourself in a new folder, `weekly-summary`, inside your project, and run these from that folder. Register the service with your sign-up account first, then continue as `studyadmin`. On Windows PowerShell, make the zip file with `Compress-Archive -Path function_app.py, host.json, requirements.txt -DestinationPath summary.zip` instead of `zip`.",
    example: {
      language: 'bash',
      code: code`
        az provider register --namespace Microsoft.Web

        FUNC=func-study-$SUFFIX
        FUNC_STORAGE=stfunc$SUFFIX
        az storage account create --name $FUNC_STORAGE --resource-group $RG --location $LOCATION --sku Standard_LRS --allow-blob-public-access false --min-tls-version TLS1_2 --tags project=study-tracker
        IDENTITY_ID=$(az identity show --name id-study-tracker --resource-group $RG --query id -o tsv)
        az functionapp create --name $FUNC --resource-group $RG --storage-account $FUNC_STORAGE --flexconsumption-location $LOCATION --runtime python --runtime-version 3.12 --assign-identity $IDENTITY_ID --tags project=study-tracker

        az storage container create --account-name $STORAGE --name summaries --auth-mode login
        STORAGE_ID=$(az storage account show --name $STORAGE --resource-group $RG --query id -o tsv)
        APP_ID=$(az identity show --name id-study-tracker --resource-group $RG --query principalId -o tsv)
        az role assignment create --assignee-object-id $APP_ID --assignee-principal-type ServicePrincipal --role "Storage Blob Data Contributor" --scope "$STORAGE_ID/blobServices/default/containers/summaries"

        CLIENT_ID=$(az identity show --name id-study-tracker --resource-group $RG --query clientId -o tsv)
        APP_URL=$(az containerapp show --name ca-study-tracker --resource-group $RG --query properties.configuration.ingress.fqdn -o tsv)
        az functionapp config appsettings set --name $FUNC --resource-group $RG --settings STUDY_TRACKER_URL=https://$APP_URL STORAGE_ACCOUNT=$STORAGE AZURE_CLIENT_ID=$CLIENT_ID "SUMMARY_SCHEDULE=0 */5 * * * *"

        zip summary.zip function_app.py host.json requirements.txt
        az functionapp deployment source config-zip --name $FUNC --resource-group $RG --src summary.zip --build-remote true
        az storage blob list --account-name $STORAGE --container-name summaries --auth-mode login --query "[].name" -o tsv
      `,
      output: '2026-11-15.md',
    },
    steps: [
      { code: 'az storage account create --name $FUNC_STORAGE ...', explanation: "A separate, small storage account the Functions platform uses for itself. Its default setup connects with a storage key, which your main account no longer allows, so the function's own housekeeping lives here while the summaries go to your main account." },
      { code: '--flexconsumption-location $LOCATION --runtime python --runtime-version 3.12', explanation: "Creates the function app on the Flex Consumption plan, running Python 3.12, in your region." },
      { code: '--scope "$STORAGE_ID/blobServices/default/containers/summaries"', explanation: "Write access to one container only, the narrowest scope a storage role can have. The identity still only reads the `notes` container." },
      { code: 'AZURE_CLIENT_ID=$CLIENT_ID', explanation: "`DefaultAzureCredential` uses this setting to pick the user-assigned identity, because an app can have more than one." },
      { code: '"SUMMARY_SCHEDULE=0 */5 * * * *"', explanation: "Every five minutes, for testing. The quotes keep the spaces and asterisks as one value in bash and PowerShell." },
      { code: '--build-remote true', explanation: "Azure installs the packages in `requirements.txt` while deploying, on the same kind of machine the function runs on." },
      { code: '2026-11-15.md', explanation: "After about five minutes, the first summary appears, named by date. Download it with `az storage blob download --account-name $STORAGE --container-name summaries --name 2026-11-15.md --file summary.md --auth-mode login`, using your own date." },
    ],
  },
  tryIt: {
    instructions: [
      'Create the `weekly-summary` folder with the files below, install the packages and run `python -m pytest` there.',
      'Run the commands above, wait for the first summary, download it and read it. Check that it matches your sessions from the last seven days.',
      'Switch to the weekly schedule: `az functionapp config appsettings set --name $FUNC --resource-group $RG --settings "SUMMARY_SCHEDULE=0 0 18 * * 0"`.',
      'Clean up: an idle Flex Consumption function costs little, but if you stop the track, delete it with `az functionapp delete --name $FUNC --resource-group $RG` and its storage with `az storage account delete --name $FUNC_STORAGE --resource-group $RG --yes`.',
    ],
    files: [
      { language: 'python', filename: 'weekly-summary/function_app.py', code: functionApp, runnable: false },
      { language: 'text', filename: 'weekly-summary/host.json', code: functionHostJson },
      { language: 'text', filename: 'weekly-summary/requirements.txt', code: functionRequirements },
      { language: 'python', filename: 'weekly-summary/test_function_app.py', code: testFunctionApp, files: { 'function_app.py': functionApp }, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Leaving a test schedule of every few minutes running.', fix: 'Switch to the real schedule as soon as testing is done. Each run makes requests and writes files.' },
    { mistake: 'Forgetting that cron schedules use UTC by default.', fix: 'Convert to UTC when writing the expression, or set the function app\'s time zone setting.' },
    { mistake: 'Giving the function write access to the whole storage account.', fix: 'Scope its write role to the one container it writes to.' },
    { mistake: 'Writing handlers that break when an event arrives twice.', fix: 'Make them safe to repeat, for example by overwriting a file with a fixed name instead of appending.' },
  ],
  quiz: [
    {
      question: 'What does the cron expression `0 0 18 * * 0` mean in an Azure Functions timer trigger?',
      options: [
        { text: 'Every 18 minutes', explanation: 'The third field is hours, so 18 means 18:00, not every 18 of anything.' },
        { text: 'At 18:00 UTC every Sunday', explanation: 'The fields are second, minute, hour, day of month, month and day of week, and 0 is Sunday.' },
        { text: 'At midnight on the 18th of each month', explanation: 'Day of month is the fourth field, which is `*` here.' },
        { text: 'At 18:00 in your own time zone every day', explanation: 'The last field limits it to Sundays, and the default time zone is UTC.' },
      ],
      answer: 1,
    },
    {
      question: 'The function app has a user-assigned identity but `DefaultAzureCredential` fails to authenticate. Which setting is most likely missing?',
      options: [
        { text: '`SUMMARY_SCHEDULE`', explanation: 'That controls when the function runs, not how it signs in.' },
        { text: '`STUDY_TRACKER_URL`', explanation: 'That is the API address. A missing value causes a different error.' },
        { text: '`AZURE_CLIENT_ID`, set to the identity\'s client ID', explanation: 'It tells the credential which user-assigned identity to use.' },
        { text: '`LOG_LEVEL`', explanation: 'Logging does not affect authentication.' },
      ],
      answer: 2,
    },
    {
      question: 'Why does the weekly function read sessions from Study Tracker\'s API instead of connecting to PostgreSQL?',
      options: [
        { text: 'Functions cannot use PostgreSQL', explanation: 'They can, given network access and a driver. The reason here is the network.' },
        { text: 'The API is faster than a database', explanation: 'Speed is not the reason. The database is private.' },
        { text: 'Azure only allows one app to use a database', explanation: 'Many apps can share one database.' },
        { text: 'The database is private, and the API is the public way in, so the function needs no network changes', explanation: 'Using the API avoids putting the function inside the virtual network and opening another rule.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Use serverless functions for small jobs that run on a trigger, keep their schedule in a setting, give them only the access they need through a managed identity, and make every handler safe to run twice.',
  resources: [
    { title: 'Azure Functions overview', provider: 'Microsoft Learn', description: 'Triggers, bindings and hosting plans.', url: 'https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview' },
    { title: 'Flex Consumption plan', provider: 'Microsoft Learn', description: 'How the plan scales and how to create apps on it.', url: 'https://learn.microsoft.com/en-us/azure/azure-functions/flex-consumption-how-to' },
    { title: 'Timer trigger', provider: 'Microsoft Learn', description: 'Cron expressions, time zones and app setting schedules.', url: 'https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer' },
    { title: 'What is Azure Event Grid?', provider: 'Microsoft Learn', description: 'Routing events such as new blobs to functions and other handlers.', url: 'https://learn.microsoft.com/en-us/azure/event-grid/overview' },
  ],
  underTheHood: {
    heading: 'How a function wakes up',
    paragraphs: [
      "When nothing is happening, a Flex Consumption function app has no running instances. A part of the Azure Functions platform called the scale controller watches the app's triggers instead: for a timer, it knows when the next run is due, and for a blob trigger with Event Grid, it receives the event.",
      "When work arrives, the platform starts an instance, loads your code and the installed packages, and calls your function. The first call after idle is slower, a cold start, just like Container Apps scaling from zero. Later calls reuse the warm instance until it goes idle again.",
      "Timers need one more safeguard. If several instances were running, each might think it should run the Sunday job. The platform prevents this by taking a lock in the function app's storage account before each scheduled run, so only one instance runs it. That storage account is one reason every function app needs one, and why you created `stfunc` alongside it.",
    ],
  },
}

export default lesson
