import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { indexOverridesJson, invokeModelsPolicyJson, updateServiceAiJson } from './aws-shared'
import { aiAws, configAws, testAiAws } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'AWS governance and landing zones, AWS security engineering with the database URL in Secrets Manager, and the AI Engineering lessons What is an AI API? and Embeddings. Set the track variables plus `REGISTRY`, `SERVICE_ARN` and `SECRET_ARN`.',
  goals: [
    'Describe what Amazon Bedrock offers and how it fits with the code from AI Engineering',
    'Give Study Tracker\'s role permission to call one chat model and one embedding model',
    'Point Study Tracker\'s `ask_model()` at Bedrock, signing requests with the app\'s role instead of a key',
  ],
  bigIdea: "Amazon Bedrock is AWS's service for hosted AI models from Amazon and other providers, called over HTTPS and paid per use, with tools for safety filters, evaluation and agents around them. It offers the same chat completions format Study Tracker already speaks, so chat needs only new settings. And because Bedrock accepts requests signed with AWS credentials, the app can use its own role, with no API key to store at all.",
  whyItMatters: "In AI Engineering you built `ai.py` so that switching providers would mean changing one file and a few settings. This lesson cashes that design in. The notes assistant, the planner and the session parser, which have returned \"unavailable\" since Study Tracker moved to AWS, start working inside your account, under your budget, with access controlled by the same IAM roles as everything else.",
  goalSections: [
    {
      heading: 'What Amazon Bedrock offers',
      paragraphs: [
        "Bedrock has a catalog of models, each with an ID and a model card that lists which APIs it supports. You do not deploy anything: you call a model by its ID and pay for the tokens used. Most models are enabled the first time your account calls them. Some providers' models are sold through AWS Marketplace and need extra permissions or a short form first, as each model card explains.",
        "Bedrock offers several APIs. Study Tracker uses its OpenAI-compatible Chat Completions endpoint, `https://bedrock-runtime.us-east-1.amazonaws.com/openai/v1`, for chat, tools and streaming. Bedrock has no OpenAI-compatible embeddings route, so embeddings use Bedrock's own `InvokeModel` call through boto3, with an Amazon Titan text embeddings model.",
        "For the reviews in Enterprise Integration: AWS's documentation states that model providers have no access to the accounts where Bedrock runs their models, so they cannot see your prompts or replies. Check the current data privacy terms for your own use.",
      ],
      example: {
        language: 'text',
        code: code`
          AI Engineering setting   Ollama on your laptop        Amazon Bedrock
          AI_BASE_URL              http://localhost:11434/v1    https://bedrock-runtime.us-east-1.amazonaws.com/openai/v1
          AI_MODEL                 a local model's name         a chat model ID from the catalog
          AI_EMBED_MODEL           a local embedding model      an Amazon Titan text embeddings model ID
          AI_AUTH                  key (the default)            aws: sign with the app's role
        `,
      },
    },
    {
      heading: 'Permission for two models',
      paragraphs: [
        "Calling a model is the IAM action `bedrock:InvokeModel`, plus `bedrock:InvokeModelWithResponseStream` for streamed replies. The resource is the model's ARN, such as `arn:aws:bedrock:us-east-1::foundation-model/` followed by the model ID. The account part is empty, because AWS owns the models.",
        "Study Tracker's task role gets those actions on exactly two models, the chat model and the embedding model you choose. The app cannot call any other model, so nobody can switch it to a far more expensive one without changing the policy.",
        "List the models available in your region with `aws bedrock list-foundation-models`, then read their model cards. For chat, pick one whose card lists Chat Completions on the `bedrock-runtime` endpoint. At the time of writing, November 2026, the OpenAI open-weight GPT OSS models do and need no Marketplace subscription. Availability changes, which is why this track never hard-codes a model.",
      ],
      example: {
        language: 'text',
        code: code`
          study-tracker-task-role
            read-notes      s3:GetObject on the notes bucket                    lesson 3
            invoke-models   bedrock:InvokeModel and InvokeModelWithResponseStream
                            on your chat model and your embedding model only   this lesson
        `,
      },
    },
    {
      heading: 'Signing requests with the app\'s role',
      paragraphs: [
        "Bedrock accepts API keys, but a key is one more secret to store and rotate. It also accepts requests signed with Signature Version 4, or SigV4, AWS's standard way of proving who sent a request using the caller's temporary role credentials. boto3 does this automatically for its own calls, and botocore, which comes with boto3, can sign any HTTPS request too.",
        "The new `ai.py` adds a setting, `AI_AUTH`. When it is `aws`, each request is signed with the task role's credentials for the service `bedrock`, and embeddings go through boto3. Otherwise it sends the bearer key as before, so your laptop with Ollama and every test from AI Engineering work unchanged.",
        "Changing embedding models changes the vectors, as Embeddings warned, so the notes must be indexed again. The index lives in the private database, so you run `sync_notes.py` and `index_notes.py` as a one-off ECS task inside the VPC, with the same image, roles and network as the service.",
      ],
      example: {
        language: 'text',
        code: code`
          Laptop (AI_AUTH=key):  Authorization: Bearer <key, or nothing for Ollama>
          ECS task (AI_AUTH=aws): Authorization: AWS4-HMAC-SHA256 Credential=ASIA.../us-east-1/bedrock/aws4_request, ...
                                  X-Amz-Security-Token: <temporary, from study-tracker-task-role>
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Connecting Study Tracker to Bedrock',
    intro: "Replace `config.py` and `ai.py` with the versions in Try it yourself and run the tests. After listing models, choose a chat model and an embedding model, and put their IDs into `invoke-models-policy.json` and `update-service.json`, with your account, suffix, service ARN and secret ARN. The container name printed by `describe-task-definition` goes into `index-overrides.json`. On Windows PowerShell 5.1, write `network.json` with `| Out-File -Encoding ascii network.json`. The output shown is the last command's. Tokens are charged per use, so try a few requests, not hundreds.",
    example: {
      language: 'bash',
      code: code`
        aws bedrock list-foundation-models --by-output-modality EMBEDDING --query "modelSummaries[?providerName=='Amazon'].modelId" --output text
        aws bedrock list-foundation-models --by-output-modality TEXT --query "modelSummaries[].modelId" --output text

        aws iam put-role-policy --role-name study-tracker-task-role --policy-name invoke-models --policy-document file://invoke-models-policy.json
        docker build --platform linux/amd64 -t $REGISTRY/study-tracker:v4 .
        docker push $REGISTRY/study-tracker:v4
        aws ecs update-express-gateway-service --cli-input-json file://update-service.json
        aws ecs wait services-stable --cluster default --services study-tracker

        TASK_DEF=$(aws ecs describe-services --cluster default --services study-tracker --query "services[0].taskDefinition" --output text)
        aws ecs describe-task-definition --task-definition $TASK_DEF --query "taskDefinition.containerDefinitions[0].name" --output text
        aws ecs describe-services --cluster default --services study-tracker --query "services[0].networkConfiguration" --output json > network.json
        TASK_ARN=$(aws ecs run-task --cluster default --task-definition $TASK_DEF --launch-type FARGATE --network-configuration file://network.json --overrides file://index-overrides.json --query "tasks[0].taskArn" --output text)
        aws ecs wait tasks-stopped --cluster default --tasks $TASK_ARN
        aws logs filter-log-events --log-group-name /ecs/study-tracker --filter-pattern Indexed --query "events[].message" --output text
      `,
      output: 'Indexed 4 paragraphs from notes/',
    },
    steps: [
      { code: '--by-output-modality EMBEDDING --query "modelSummaries[?providerName==\'Amazon\'].modelId"', explanation: "Lists Amazon's embedding models in your region. Pick a Titan text embeddings model: `ai.py` sends the request shape those models expect." },
      { code: 'aws iam put-role-policy --role-name study-tracker-task-role --policy-name invoke-models', explanation: "Lets the app call your two models and nothing else. The app's code uses this role through the credentials ECS gives each task." },
      { code: '"AI_AUTH": "aws", "AI_BASE_URL": "https://bedrock-runtime.us-east-1.amazonaws.com/openai/v1"', explanation: "In `update-service.json`, with the two model IDs and the region. No key appears anywhere: neither in the settings nor in Secrets Manager." },
      { code: '--query "services[0].networkConfiguration" --output json > network.json', explanation: "Saves the service's subnets and security group, so the one-off task runs where the service does and can reach the private database." },
      { code: '--overrides file://index-overrides.json', explanation: "Runs the service's image with a different command, syncing the notes from S3 and indexing them with the new embedding model, then stops." },
      { code: 'Indexed 4 paragraphs from notes/', explanation: "The indexing task's log line. Now open `/docs` and try `POST /notes/ask`, `POST /assistant` and `POST /sessions/parse`. They answer instead of returning 503, worded differently from the examples in AI Engineering, as always." },
    ],
  },
  tryIt: {
    instructions: [
      'Replace `config.py` and `ai.py` with the files below, add `test_ai_aws.py`, and run `python -m pytest`. Every earlier test still passes, and the new ones check signing and embeddings without an AWS account.',
      'Run the commands above, choosing the models yourself. Write down which ones you chose and why.',
      'Ask the notes assistant one question your notes answer and one they do not, then rerun your test set from Evaluating AI Responses and compare the results with your local model.',
      'Clean up: Bedrock charges only for tokens used, so there is nothing running to delete. If you stop the track, remove the permission with `aws iam delete-role-policy --role-name study-tracker-task-role --policy-name invoke-models`. Check Cost Explorer the next day for Bedrock.',
    ],
    files: [
      { language: 'python', filename: 'config.py', code: configAws, runnable: false },
      { language: 'python', filename: 'ai.py', code: aiAws, runnable: false },
      { language: 'python', filename: 'test_ai_aws.py', code: testAiAws, files: { 'ai.py': aiAws, 'config.py': configAws }, runWith: 'pytest' },
      { language: 'text', filename: 'invoke-models-policy.json', code: invokeModelsPolicyJson },
      { language: 'text', filename: 'update-service.json', code: updateServiceAiJson },
      { language: 'text', filename: 'index-overrides.json', code: indexOverridesJson },
    ],
    evidencePrompt: {
      label: 'Your comparison',
      placeholder: 'For example: Local model passed 4 of 5 parser tests, the Bedrock chat model 5 of 5. The notes assistant cited the right note for both questions.',
    },
  },
  mistakes: [
    { mistake: 'Creating a long-lived Bedrock API key for the app.', fix: 'Sign requests with the task role, so there is no key to leak or rotate.' },
    { mistake: 'Allowing `bedrock:InvokeModel` on every model.', fix: 'List the exact model ARNs, so a setting change cannot quietly move the app to a costlier model.' },
    { mistake: 'Switching embedding models without re-indexing.', fix: 'Vectors from different models cannot be compared. Run the indexing task after every embedding change.' },
    { mistake: 'Choosing a chat model without reading its model card.', fix: 'Check that it supports Chat Completions on `bedrock-runtime` and whether it needs Marketplace access.' },
  ],
  quiz: [
    {
      question: 'The app logs `the model service returned status 403` for every chat request after you changed `AI_MODEL` to a different model ID. What is most likely wrong?',
      options: [
        { text: 'Bedrock is down in your region', explanation: 'An outage would show up as 5xx errors or timeouts, not a steady 403.' },
        { text: 'The signature is wrong because the region changed', explanation: 'The region did not change. Only the model ID did.' },
        { text: 'The task role\'s `invoke-models` policy does not list the new model\'s ARN', explanation: 'The role may call only the models named in its policy. Add the new ARN.' },
        { text: 'The app needs an API key as well as the role', explanation: 'A signed request needs no key.' },
      ],
      answer: 2,
    },
    {
      question: 'You switch `AI_EMBED_MODEL` to a different Titan model. The notes assistant now says "not found" for questions it used to answer. Why?',
      options: [
        { text: 'The stored note vectors came from the old model, so new question vectors no longer match them', explanation: 'Vectors from different models are not comparable. Run the indexing task again.' },
        { text: 'Titan models cannot embed questions', explanation: 'They embed any text, questions included.' },
        { text: 'The new model needs a Marketplace subscription', explanation: 'Then calls would fail with an error, not return "not found".' },
        { text: 'The tag guardrail blocked the request', explanation: 'That rule covers creating secrets, repositories and functions, not model calls.' },
      ],
      answer: 0,
    },
    {
      question: 'Why does the indexing run as a one-off ECS task instead of on your laptop?',
      options: [
        { text: 'Bedrock only accepts requests from ECS', explanation: 'Your laptop can call Bedrock with your own sign-in.' },
        { text: 'boto3 does not work on laptops', explanation: 'You ran boto3 on your laptop in lesson 3.' },
        { text: 'The notes bucket is only readable from ECS', explanation: 'You can read it with your own sign-in too.' },
        { text: 'The index is stored in the private RDS database, which only resources inside the VPC can reach', explanation: 'The task runs with the service\'s network settings, on the right side of that boundary.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Call Bedrock with the app\'s own role and a policy naming exactly two models, and because Study Tracker\'s `ai.py` speaks the same chat format, connecting it is a few settings, a signing step and a re-index, not a rewrite.',
  resources: [
    { title: 'What is Amazon Bedrock?', provider: 'AWS Documentation', description: 'Models, APIs and the tools around them.', url: 'https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html' },
    { title: 'Chat Completions API on Bedrock', provider: 'AWS Documentation', description: 'The OpenAI-compatible endpoint Study Tracker uses, with key and SigV4 examples.', url: 'https://docs.aws.amazon.com/bedrock/latest/userguide/inference-chat-completions.html' },
    { title: 'Access to Bedrock models', provider: 'AWS Documentation', description: 'How models are enabled on first use, and which need Marketplace permissions.', url: 'https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html' },
    { title: 'Models at a glance', provider: 'AWS Documentation', description: 'Model cards, with model IDs and supported APIs per endpoint.', url: 'https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards.html' },
  ],
  underTheHood: {
    heading: 'What a SigV4 signature proves',
    paragraphs: [
      "An API key is a password: anyone who copies it can use it until someone notices. A SigV4 signature works differently. The caller holds a secret key that is never sent anywhere.",
      "To sign, botocore builds a canonical version of the request: the method, path, selected headers, a hash of the body, the time, the region and the service name. It derives a signing key from the secret key, the date, the region and the service, and uses it to compute an HMAC, a keyed hash, of that canonical request. The request carries the access key ID and the resulting signature.",
      "AWS repeats the same calculation with its own copy of the secret. If the results match, the request came from someone holding the secret, and nothing in it was changed on the way, because changing even one byte of the body changes the hash.",
      "The signature includes the time, so AWS rejects it after a few minutes, and a copied request cannot be replayed later. The task role's credentials are themselves temporary and replaced automatically. Together, there is nothing long-lived to leak.",
    ],
  },
}

export default lesson
