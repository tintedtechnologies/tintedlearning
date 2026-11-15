import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Azure governance and landing zones, with the `project` tag policy in place, Azure security engineering for Key Vault, and the AI Engineering lessons What is an AI API? and Embeddings. Set the track variables plus `KV`.',
  goals: [
    'Describe what Microsoft Foundry offers and how it fits with the code from AI Engineering',
    'Deploy a chat model and an embedding model with the Azure CLI',
    'Point Study Tracker\'s `ask_model()` at the hosted models without changing its code',
  ],
  bigIdea: "Microsoft Foundry is Azure's platform for AI: it hosts models from several providers, including OpenAI models sold through Azure, and adds tools for evaluation, safety filters and agents. You create a resource, deploy the models you choose under names you pick, and call them over HTTPS. Because Foundry offers the same chat completions format Study Tracker already uses, connecting it is a configuration change, not a code change.",
  whyItMatters: "In AI Engineering you built `ai.py` so that switching providers would mean changing settings in one place. This lesson cashes that design in. The notes assistant, the planner and the session parser, which have returned \"unavailable\" since Study Tracker moved to Azure, start working, inside your subscription, under your budget and governed by the same roles, tags and Key Vault as everything else.",
  goalSections: [
    {
      heading: 'What Microsoft Foundry offers',
      paragraphs: [
        "Foundry gives you a catalog of models from Microsoft, OpenAI and other providers, each deployed into your own resource. You choose a deployment type, which affects where requests are processed and how capacity is shared, and you pay per token used.",
        "Around the models, Foundry adds content filters that screen harmful inputs and outputs, tools to evaluate models against test sets, as in Evaluating AI Responses, and services for building agents. Study Tracker only needs the models, because it already has its own retrieval, tools and agent from AI Engineering.",
        "Data handling matters for the reviews in Enterprise Integration. Microsoft's documentation states that prompts, completions and embeddings sent to models sold by Azure are not available to other customers or model providers, and are not used to train models without your permission. Check the current terms for your own use.",
      ],
      example: {
        language: 'text',
        code: code`
          AI Engineering setting      Ollama on your laptop          Foundry in Azure
          AI_BASE_URL                 http://localhost:11434/v1      https://ai-study-jd4821.openai.azure.com/openai/v1
          AI_MODEL                    a local model's name           chat   (your deployment name)
          AI_EMBED_MODEL              a local embedding model        embed  (your deployment name)
          AI_API_KEY                  empty                          from Key Vault
        `,
      },
    },
    {
      heading: 'Deploying models',
      paragraphs: [
        "First create a Foundry resource, of kind `AIServices`, with a custom domain, which gives it its own web address. Then list the models available in your region, because availability differs by region and changes over time.",
        "A deployment makes one model version available under a name you choose. Study Tracker deploys a small chat model as `chat` and an embedding model as `embed`. Requests name the deployment, not the model, so the code never mentions a model version, and you can switch models later by redeploying under the same name.",
        "Each deployment has a capacity, a rate limit on tokens per minute. A capacity of 1, the smallest, is enough to test. Larger capacity serves more users but needs quota, a limit Azure sets per subscription and region.",
      ],
      example: {
        language: 'text',
        code: code`
          Foundry resource ai-study-jd4821 (kind AIServices)
            Deployment chat    a small chat model of your choice      capacity 1
            Deployment embed   an embedding model of your choice      capacity 1
          Requests say:  "model": "chat"   or   "model": "embed"
        `,
      },
    },
    {
      heading: 'Connecting Study Tracker',
      paragraphs: [
        "The API key goes into Key Vault as `ai-api-key`, and the container app reads it through a Key Vault reference, exactly like the database URL. Then four environment variables point `ai.py` at Foundry. Study Tracker's code sends the key as a bearer token, which the endpoint accepts.",
        "Switching embedding models changes the vectors, as Embeddings warned, so the notes must be indexed again. The index lives in the private database, which your laptop cannot reach, so you run `sync_notes.py` and `index_notes.py` inside the running app with `az containerapp exec`.",
        "A key works, but an even better setup is keyless. The app's managed identity could get a token for Foundry, with the Cognitive Services OpenAI User role, and no key would exist at all. That needs `ai.py` to request tokens, a good next step once everything else works.",
      ],
      example: {
        language: 'text',
        code: code`
          Container app settings after this lesson
            secret   ai-api-key    = keyvaultref:https://kv-study-jd4821.vault.azure.net/secrets/ai-api-key,...
            env      AI_BASE_URL    = https://ai-study-jd4821.openai.azure.com/openai/v1
            env      AI_MODEL       = chat
            env      AI_EMBED_MODEL = embed
            env      AI_API_KEY     = secretref:ai-api-key
            env      AZURE_CLIENT_ID = id-study-tracker's client ID, for the storage SDK
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Connecting Study Tracker to Foundry models',
    intro: "Register the service with your sign-up account, then continue as `studyadmin`. After listing models, set `CHAT_MODEL`, `CHAT_VERSION`, `EMBED_MODEL` and `EMBED_VERSION` from the list: pick a small chat model and an embedding model. Tokens are charged per use, so try a few requests, not hundreds.",
    example: {
      language: 'bash',
      code: code`
        az provider register --namespace Microsoft.CognitiveServices

        AI=ai-study-$SUFFIX
        az cognitiveservices account create --name $AI --resource-group $RG --location $LOCATION --kind AIServices --sku S0 --custom-domain $AI --tags project=study-tracker --yes
        az cognitiveservices account list-models --name $AI --resource-group $RG --query "[?format=='OpenAI'].{name:name, version:version}" -o table

        az cognitiveservices account deployment create --name $AI --resource-group $RG --deployment-name chat --model-name $CHAT_MODEL --model-version $CHAT_VERSION --model-format OpenAI --sku-name GlobalStandard --sku-capacity 1
        az cognitiveservices account deployment create --name $AI --resource-group $RG --deployment-name embed --model-name $EMBED_MODEL --model-version $EMBED_VERSION --model-format OpenAI --sku-name GlobalStandard --sku-capacity 1

        AI_KEY=$(az cognitiveservices account keys list --name $AI --resource-group $RG --query key1 -o tsv)
        az keyvault secret set --vault-name $KV --name ai-api-key --value "$AI_KEY" --query name -o tsv
        IDENTITY_ID=$(az identity show --name id-study-tracker --resource-group $RG --query id -o tsv)
        CLIENT_ID=$(az identity show --name id-study-tracker --resource-group $RG --query clientId -o tsv)
        az containerapp secret set --name ca-study-tracker --resource-group $RG --secrets "ai-api-key=keyvaultref:https://$KV.vault.azure.net/secrets/ai-api-key,identityref:$IDENTITY_ID"
        az containerapp update --name ca-study-tracker --resource-group $RG --set-env-vars AI_BASE_URL=https://$AI.openai.azure.com/openai/v1 AI_MODEL=chat AI_EMBED_MODEL=embed AI_API_KEY=secretref:ai-api-key AZURE_CLIENT_ID=$CLIENT_ID

        az containerapp exec --name ca-study-tracker --resource-group $RG --command "python sync_notes.py"
        az containerapp exec --name ca-study-tracker --resource-group $RG --command "python index_notes.py"
      `,
      output: code`
        Downloaded 3 notes
        Indexed 4 paragraphs from notes/
      `,
    },
    steps: [
      { code: '--kind AIServices --sku S0 --custom-domain $AI', explanation: "Creates the Foundry resource. The custom domain gives it the address `https://ai-study-jd4821.openai.azure.com`, and the `project` tag satisfies the policy from lesson 12." },
      { code: 'az cognitiveservices account list-models ...', explanation: "Shows which OpenAI models and versions you can deploy in your region today. The list changes as models are added and retired, which is why this track never hard-codes one." },
      { code: '--deployment-name chat ... --sku-name GlobalStandard --sku-capacity 1', explanation: "Deploys your chosen chat model under the name `chat`, with the smallest capacity. Global Standard can process requests in any region Microsoft chooses. If your organization requires data to stay in one area, choose a regional or data-zone deployment type instead." },
      { code: 'az keyvault secret set --vault-name $KV --name ai-api-key ...', explanation: "Stores the key in Key Vault without printing it. The container app reads it through a reference, as with the database URL." },
      { code: 'AI_BASE_URL=https://$AI.openai.azure.com/openai/v1 AI_MODEL=chat AI_EMBED_MODEL=embed', explanation: "Points `ai.py` at Foundry. `ai.py` adds `/chat/completions` or `/embeddings` to the base address, which are exactly the routes this endpoint offers." },
      { code: 'az containerapp exec ... --command "python index_notes.py"', explanation: "Runs inside the app, which can reach the private database. The notes are downloaded from Blob Storage, then embedded with the new `embed` deployment and stored." },
      { code: 'Indexed 4 paragraphs from notes/', explanation: "Now open `/docs` and try `POST /notes/ask`, `POST /assistant` and `POST /sessions/parse`. They answer instead of returning 503. Replies will be worded differently from the examples in AI Engineering, as always." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the commands above, choosing the models yourself from the list. Write down which ones you chose and why.',
      'Ask the notes assistant one question your notes answer and one they do not. Check the sources and the "not found" reply.',
      'Rerun your test set from Evaluating AI Responses against the new models. Compare the results with your local model.',
      'Check Cost analysis the next day for the Foundry resource. Then decide: keep it, or clean up with `az cognitiveservices account delete --name $AI --resource-group $RG`, followed by `az cognitiveservices account purge --name $AI --resource-group $RG --location $LOCATION` so the name can be reused.',
    ],
    evidencePrompt: {
      label: 'Your comparison',
      placeholder: 'For example: Local model passed 4 of 5 parser tests, the Foundry chat deployment 5 of 5. The notes assistant cited the right note for both questions.',
    },
  },
  mistakes: [
    { mistake: 'Hard-coding a model name and version in the app.', fix: 'Call deployment names such as `chat`, and change the model behind the name when a newer one is available.' },
    { mistake: 'Switching embedding models without re-indexing.', fix: 'Vectors from different models cannot be compared. Run `index_notes.py` after every embedding change.' },
    { mistake: 'Putting the model\'s API key in an environment variable.', fix: 'Store it in Key Vault and reference it, or move to keyless access with the managed identity.' },
    { mistake: 'Choosing a deployment type without checking where data is processed.', fix: 'Global types may process data in any region. Check your data rules, and pick a regional or data-zone type if needed.' },
  ],
  quiz: [
    {
      question: 'Study Tracker calls `ask_model()` with `AI_MODEL=chat`. Next month you redeploy a newer model under the same name, `chat`. What code changes are needed?',
      options: [
        { text: 'None: requests name the deployment, so they reach the new model automatically', explanation: 'That is the point of deployment names. Rerun your test set, though, because a new model can behave differently.' },
        { text: 'Change every call to use the new model\'s name', explanation: 'Calls use the deployment name, which did not change.' },
        { text: 'Rebuild the container image', explanation: 'No code or setting changed, so the image is fine.' },
        { text: 'Change `AI_BASE_URL`', explanation: 'The resource and its address are the same.' },
      ],
      answer: 0,
    },
    {
      question: 'You deploy a different embedding model under `embed`. The notes assistant now says "not found" for questions it used to answer. Why?',
      options: [
        { text: 'The new model refuses questions about notes', explanation: 'Embedding models only produce vectors. They do not refuse anything.' },
        { text: 'The stored note vectors came from the old model, so new question vectors no longer match them', explanation: 'Vectors from different models are not comparable. Re-index the notes with the new model.' },
        { text: 'Key Vault lost the API key', explanation: 'Then requests would fail with an error, not return "not found".' },
        { text: 'The minimum score policy blocks the new model', explanation: 'Azure Policy governs resources, not search scores.' },
      ],
      answer: 1,
    },
    {
      question: 'Why does this lesson run `index_notes.py` with `az containerapp exec` instead of on your laptop?',
      options: [
        { text: 'Python is not allowed on laptops in Azure projects', explanation: 'You have run Python locally throughout the course.' },
        { text: 'The embedding deployment only accepts requests from containers', explanation: 'The endpoint accepts any request with a valid key.' },
        { text: 'The index is stored in the private PostgreSQL server, which only the app inside the network can reach', explanation: 'Running the script inside the app puts it on the right side of the network boundary.' },
        { text: 'Notes cannot be downloaded to a laptop', explanation: 'You downloaded them yourself in lesson 3.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'Deploy hosted models under stable names like `chat` and `embed`, keep their key in Key Vault, and because Study Tracker\'s `ai.py` speaks the same format, connecting them is a change of settings plus a re-index, not a rewrite.',
  resources: [
    { title: 'What is Microsoft Foundry?', provider: 'Microsoft Learn', description: 'The platform, its resources and how projects and models fit together.', url: 'https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry' },
    { title: 'Azure OpenAI v1 API', provider: 'Microsoft Learn', description: 'The OpenAI-compatible endpoint Study Tracker uses, with key and keyless examples.', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/api-version-lifecycle' },
    { title: 'Data, privacy and security for Foundry Models', provider: 'Microsoft Learn', description: 'How prompts, completions and embeddings are handled.', url: 'https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy' },
    { title: 'Embeddings', provider: 'Microsoft Learn', description: 'Generating embeddings with Foundry models.', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/embeddings' },
  ],
  underTheHood: {
    heading: 'What a deployment and its capacity really are',
    paragraphs: [
      "When you deploy a model, Azure does not copy it into your subscription. Microsoft runs the model on its own hardware, and your deployment is a reserved slice of access to it, with your name attached, your settings and your rate limit.",
      "Capacity is measured in tokens per minute, and each unit of capacity adds a fixed amount. Azure counts the tokens in each request, including an estimate of the reply's length, against that budget. When a minute's budget is used up, further requests get status 429, too many requests, until the next minute. That is the same 429 that `ai.py` retries with growing pauses, from What is an AI API?",
      "The deployment type decides where requests may run. Global types route each request to whichever region has spare capacity, which is cheapest and most available. Data-zone and regional types keep processing within a geographic area, for organizations whose rules require it. The same model, the same code and the same key work with any of them: only the routing behind the name changes.",
    ],
  },
}

export default lesson
