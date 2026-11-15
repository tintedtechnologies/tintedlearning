import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { aiGcp, configGcp, testAiGcp } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Google Cloud governance and landing zones, Google Cloud security engineering with the app pinned to version 2 of `database-url`, and the AI Engineering lessons What is an AI API? and Embeddings. Set the track variables plus `SA` and `REGISTRY`.',
  goals: [
    'Describe what Agent Platform offers and how it fits with the code from AI Engineering',
    'Give Study Tracker\'s service account permission to call Agent Platform models',
    'Point Study Tracker\'s `ask_model()` at Agent Platform with short-lived tokens instead of a key',
  ],
  bigIdea: "Gemini Enterprise Agent Platform, Agent Platform for short and formerly called Vertex AI, is Google Cloud's platform for AI: it hosts Google's Gemini models and many others, called over HTTPS and paid per use, with tools for evaluation, safety settings and agents around them. It offers an OpenAI-compatible Chat Completions endpoint, so chat needs only new settings. And because it accepts the same short-lived Google access tokens as every other Google API, the app can use its own service account, with no API key at all.",
  whyItMatters: "In AI Engineering you built `ai.py` so that switching providers would mean changing one file and a few settings. This lesson cashes that design in. The notes assistant, the planner and the session parser, which have returned \"unavailable\" since Study Tracker moved to Google Cloud, start working inside your project, under your budget, with access controlled by the same IAM as everything else.",
  goalSections: [
    {
      heading: 'What Agent Platform offers',
      paragraphs: [
        "Agent Platform gives you Google's Gemini models and, through Model Garden, models from other providers. You do not deploy Google's own models: you call them by ID and pay for the tokens used. Model IDs and their availability change, so check Google's model list for current IDs instead of copying one from a tutorial.",
        "Study Tracker uses the OpenAI-compatible endpoint, `https://aiplatform.googleapis.com/v1/projects/` plus your project ID and `/locations/global/endpoints/openapi`, for chat, tools and streaming, with model names written as `google/` followed by the model ID. Embeddings use Agent Platform's own `predict` call, one text per request.",
        "For the reviews in Enterprise Integration: Google's documentation states that it does not use your data to train or fine-tune models without your permission, and that Gemini's caching of requests is never used for training. Check the current data governance terms for your own use.",
      ],
      example: {
        language: 'text',
        code: code`
          AI Engineering setting   Ollama on your laptop        Agent Platform
          AI_BASE_URL              http://localhost:11434/v1    https://aiplatform.googleapis.com/v1/projects/<id>/locations/global/endpoints/openapi
          AI_MODEL                 a local model's name         google/ followed by a Gemini model ID
          AI_EMBED_MODEL           a local embedding model      an embedding model ID, called with predict
          AI_AUTH                  key (the default)            google: a token for the app's service account
        `,
      },
    },
    {
      heading: 'Permission for the service account',
      paragraphs: [
        "Calling Agent Platform models needs the permission `aiplatform.endpoints.predict`, which the Agent Platform User role, `roles/aiplatform.user`, includes. Google's models are not resources inside your project, so the role is granted on the project itself.",
        "That is broader than the bucket and secret grants in earlier lessons: the role also allows other Agent Platform actions in the project. In a shared project, an IAM condition or a custom role with only the permissions the app uses narrows it. In Study Tracker's own project, the project is the boundary.",
        "Costs come from tokens, so cap what the app can spend the same way as before: a budget alert on the project, and limits on how long prompts and replies can be, as in Cost, Latency, and Performance.",
      ],
      example: {
        language: 'text',
        code: code`
          study-tracker service account
            Storage Object Viewer           the notes bucket          lesson 3
            Secret Manager Secret Accessor  database-url              lesson 7
            Agent Platform User                  the project               this lesson
        `,
      },
    },
    {
      heading: 'Tokens instead of keys',
      paragraphs: [
        "Agent Platform accepts the same OAuth access tokens as Cloud Storage or Secret Manager. On Cloud Run, the `google-auth` library, which comes with `google-cloud-storage`, gets one for the service account from the metadata server. Each token lasts about an hour, and the library refreshes it when it expires.",
        "The new `ai.py` adds a setting, `AI_AUTH`. When it is `google`, each request carries a fresh token, and embeddings go to Agent Platform's `predict` address in your region. Otherwise it sends the bearer key as before, so your laptop with Ollama and every test from AI Engineering work unchanged.",
        "Changing embedding models changes the vectors, as Embeddings warned, so the notes must be indexed again. The index lives in the private database, so you run `sync_notes.py` and `index_notes.py` as a Cloud Run job, a container that runs to completion, with the same image, service account and network as the service.",
      ],
      example: {
        language: 'text',
        code: code`
          Laptop (AI_AUTH=key):        Authorization: Bearer <key, or nothing for Ollama>
          Cloud Run (AI_AUTH=google):  Authorization: Bearer ya29....  (about an hour, refreshed automatically)
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Connecting Study Tracker to Agent Platform',
    intro: "Replace `config.py` and `ai.py` with the versions in Try it yourself and run the tests. Choose a chat model and an embedding model from Google's model lists, and put their IDs into `CHAT_MODEL` and `EMBED_MODEL`. In PowerShell, set variables as `$NAME = ...`. Tokens are charged per use, so try a few requests, not hundreds.",
    example: {
      language: 'bash',
      code: code`
        gcloud services enable aiplatform.googleapis.com
        CHAT_MODEL=REPLACE-WITH-CHAT-MODEL-ID
        EMBED_MODEL=REPLACE-WITH-EMBEDDING-MODEL-ID
        gcloud projects add-iam-policy-binding $PROJECT_ID --member serviceAccount:$SA --role roles/aiplatform.user --condition None

        AI_ENV="AI_AUTH=google,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,AI_BASE_URL=https://aiplatform.googleapis.com/v1/projects/$PROJECT_ID/locations/global/endpoints/openapi,AI_MODEL=google/$CHAT_MODEL,AI_EMBED_MODEL=$EMBED_MODEL,AI_EMBED_LOCATION=$REGION"
        docker build --platform linux/amd64 -t $REGISTRY/study-tracker:v4 .
        docker push $REGISTRY/study-tracker:v4
        gcloud run deploy study-tracker --image $REGISTRY/study-tracker:v4 --region $REGION --update-env-vars $AI_ENV

        gcloud run jobs create index-notes --image $REGISTRY/study-tracker:v4 --region $REGION --service-account $SA --network vpc-study-tracker --subnet snet-apps --vpc-egress private-ranges-only --set-secrets DATABASE_URL=database-url:2 --set-env-vars "NOTES_BUCKET=study-notes-$SUFFIX,$AI_ENV" --command sh --args "-c,python sync_notes.py && python index_notes.py" --labels project=study-tracker
        gcloud run jobs execute index-notes --region $REGION --wait
        gcloud logging read 'resource.type="cloud_run_job" AND textPayload:"Indexed"' --limit 1 --format "value(textPayload)"
      `,
      output: 'Indexed 4 paragraphs from notes/',
    },
    steps: [
      { code: '--role roles/aiplatform.user --condition None', explanation: "Lets the app's service account call Agent Platform models in this project. `--condition None` adds the role without an IAM condition." },
      { code: 'AI_ENV="AI_AUTH=google,...,AI_EMBED_LOCATION=$REGION"', explanation: "Collects the AI settings once, for both the service and the job. No key appears anywhere: neither in the settings nor in Secret Manager." },
      { code: '--update-env-vars $AI_ENV', explanation: "Adds the AI settings to the service and keeps the others, such as `NOTES_BUCKET` and the secret." },
      { code: 'gcloud run jobs create index-notes ... --network vpc-study-tracker --subnet snet-apps', explanation: "A job with the service's image, service account and network, so it can reach the private database. It runs the two scripts, then stops." },
      { code: '--set-secrets DATABASE_URL=database-url:2', explanation: "The same pinned version as the service, from lesson 11. If you rotated again, use your current number." },
      { code: 'Indexed 4 paragraphs from notes/', explanation: "The job's log line. Now open `/docs` and try `POST /notes/ask`, `POST /assistant` and `POST /sessions/parse`. They answer instead of returning 503, worded differently from the examples in AI Engineering, as always." },
    ],
  },
  tryIt: {
    instructions: [
      'Replace `config.py` and `ai.py` with the files below, add `test_ai_gcp.py`, and run `python -m pytest`. Every earlier test still passes, and the new ones check tokens and embeddings without a Google Cloud account.',
      'Run the commands above, choosing the models yourself. Write down which ones you chose and why.',
      'Ask the notes assistant one question your notes answer and one they do not, then rerun your test set from Evaluating AI Responses and compare the results with your local model.',
      'Clean up: Agent Platform charges only for tokens used, so there is nothing running to delete. If you stop the track, delete the job with `gcloud run jobs delete index-notes --region $REGION --quiet` and remove the role with `gcloud projects remove-iam-policy-binding $PROJECT_ID --member serviceAccount:$SA --role roles/aiplatform.user`. Check Billing reports the next day for Agent Platform.',
    ],
    files: [
      { language: 'python', filename: 'config.py', code: configGcp, runnable: false },
      { language: 'python', filename: 'ai.py', code: aiGcp, runnable: false },
      { language: 'python', filename: 'test_ai_gcp.py', code: testAiGcp, files: { 'ai.py': aiGcp, 'config.py': configGcp }, runWith: 'pytest' },
    ],
    evidencePrompt: {
      label: 'Your comparison',
      placeholder: 'For example: Local model passed 4 of 5 parser tests, the Agent Platform chat model 5 of 5. The notes assistant cited the right note for both questions.',
    },
  },
  mistakes: [
    { mistake: 'Creating an API key or service account key for the app.', fix: 'Use the attached service account, so the app only ever holds tokens that expire within the hour.' },
    { mistake: 'Copying a model ID from an old tutorial.', fix: 'Check Google\'s current model list. IDs change as models are added and retired.' },
    { mistake: 'Switching embedding models without re-indexing.', fix: 'Vectors from different models cannot be compared. Run the indexing job after every embedding change.' },
    { mistake: 'Granting Agent Platform User to people and apps that do not need it.', fix: 'Grant it only to the app\'s service account, and narrow it with a condition in shared projects.' },
  ],
  quiz: [
    {
      question: 'The app logs `the model service returned status 403` for every chat request. What is most likely missing?',
      options: [
        { text: 'An OpenAI API key', explanation: 'Agent Platform uses Google access tokens, not OpenAI keys.' },
        { text: 'The Agent Platform User role for the app\'s service account', explanation: 'Without it, the token is valid but not allowed to call the model.' },
        { text: 'A larger budget', explanation: 'Budgets alert. They never refuse requests.' },
        { text: 'A second Cloud Run instance', explanation: 'Instance count has nothing to do with permission.' },
      ],
      answer: 1,
    },
    {
      question: 'You change `AI_EMBED_MODEL` to a different embedding model. The notes assistant now says "not found" for questions it used to answer. Why?',
      options: [
        { text: 'Agent Platform needs a day to activate a new model', explanation: 'Models are available straight away.' },
        { text: 'The access token expired', explanation: 'Then requests would fail with an error, not return "not found".' },
        { text: 'The labeling check blocked the request', explanation: 'That script only reads labels. It never touches requests.' },
        { text: 'The stored note vectors came from the old model, so new question vectors no longer match them', explanation: 'Vectors from different models are not comparable. Run the indexing job again.' },
      ],
      answer: 3,
    },
    {
      question: 'Why does the indexing run as a Cloud Run job instead of on your laptop?',
      options: [
        { text: 'The index is stored in the private Cloud SQL instance, which only resources connected to the VPC network can reach', explanation: 'The job uses the service\'s network settings, on the right side of that boundary.' },
        { text: 'Agent Platform only accepts requests from Cloud Run', explanation: 'Your laptop can call Agent Platform with your own sign-in.' },
        { text: 'The notes bucket is only readable from Cloud Run', explanation: 'You can read it with your own sign-in too.' },
        { text: 'Python cannot run on laptops in Google Cloud projects', explanation: 'You have run Python locally throughout the course.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Call Agent Platform with the app\'s own service account and short-lived tokens, check model IDs against Google\'s current list, and because Study Tracker\'s `ai.py` speaks the same chat format, connecting it is a few settings, a token and a re-index, not a rewrite.',
  resources: [
    { title: 'Agent Platform overview', provider: 'Google Cloud Documentation', description: 'Models, Model Garden and the tools around them.', url: 'https://docs.cloud.google.com/vertex-ai/docs/start/introduction-unified-platform' },
    { title: 'Using OpenAI libraries with Agent Platform', provider: 'Google Cloud Documentation', description: 'The OpenAI-compatible endpoint and how to authenticate.', url: 'https://docs.cloud.google.com/vertex-ai/generative-ai/docs/migrate/openai/auth-and-credentials' },
    { title: 'Get text embeddings', provider: 'Google Cloud Documentation', description: 'Embedding models and the predict request used by Study Tracker.', url: 'https://docs.cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-text-embeddings' },
    { title: 'Data governance for generative AI', provider: 'Google Cloud Documentation', description: 'How Google handles prompts, responses and caching.', url: 'https://docs.cloud.google.com/vertex-ai/generative-ai/docs/data-governance' },
  ],
  underTheHood: {
    heading: 'Where the app\'s token comes from',
    paragraphs: [
      "Every Cloud Run instance can reach a metadata server at a fixed internal address, `metadata.google.internal`. It answers only requests from inside that instance, and only for the service account attached to it.",
      "When `google.auth.default()` runs on Cloud Run, it finds no key file and no laptop login, so it asks the metadata server for an access token. The server returns a token and its expiry time. `ai.py` keeps the credentials object and reuses the token until it is close to expiring, then refreshes it, so most requests make no extra call at all.",
      "The token is a bearer token: whoever holds it can use it until it expires, which is why it must never be logged. But it lasts about an hour, is scoped to one service account, and is never stored in the image, the settings or Secret Manager. On your laptop the same call finds your `application-default` login instead, which is why identical code works in both places without a single change.",
    ],
  },
}

export default lesson
