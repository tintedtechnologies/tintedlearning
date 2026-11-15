import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { ai, configAi, envExampleAi, tryAi } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'the Python section and the Software Engineering section, especially Build Your Own API and Configuration and Secrets. You need the finished Study Tracker from the Software Engineering capstone.',
  goals: [
    'Send a prompt to a model from Python and read the reply',
    'Keep the model\'s address, name and key in configuration, so you can switch providers without touching code',
    'Handle failed requests, retrying only the ones worth retrying',
  ],
  bigIdea: "An AI API, short for application programming interface, lets your code send a prompt to a model and get the reply back as data. It works just like Study Tracker's own API: an HTTP POST request with a JSON body, and a JSON response. Wrap that call in one small function, `ask_model()`, and the rest of your app never needs to know which model or provider is behind it.",
  whyItMatters: "Study Tracker's next features, turning a sentence into a session, answering questions about your notes and planning your week, all need a model. If each feature called a provider directly, with its own address, key and error handling, switching from a free local model to a hosted one would mean editing every feature. And one slow or failed request could break a page. A single, careful `ask_model()` solves both problems.",
  goalSections: [
    {
      heading: 'One request, one reply',
      paragraphs: [
        "Most model services accept the same request format, often called chat completions. You POST to an address ending in `/chat/completions` with a JSON body holding the model's name and a list of messages, each with a role: `system`, `user` or `assistant`, as in System Prompts.",
        "The reply comes back as JSON. The text is inside `choices`, a list that usually holds one item, under `message` and then `content`. The response also reports `usage`: how many tokens you sent and received, which is what paid services charge for.",
        "The format was first published by one provider and is now accepted by many others, and by Ollama, a free tool that runs models on your own computer. That shared format is what lets Study Tracker switch providers by changing settings alone. The example uses `httpx`, which you already installed for testing, and its output is a typical reply.",
      ],
      example: {
        language: 'python',
        runnable: false,
        code: code`
          import httpx

          response = httpx.post(
              "http://localhost:11434/v1/chat/completions",
              json={
                  "model": "your-model-name",
                  "messages": [{"role": "user", "content": "Name one study tip."}],
              },
              timeout=60,
          )
          data = response.json()
          print(data["choices"][0]["message"]["content"])
          print(data["usage"])
        `,
        output: "Test yourself instead of rereading: recalling information strengthens memory.\n{'prompt_tokens': 14, 'completion_tokens': 13, 'total_tokens': 27}",
      },
    },
    {
      heading: 'Configuration: where requests go',
      paragraphs: [
        "Three settings decide where a request goes: the base address, the model name and, for hosted services, the API key, a secret code that identifies your account. They go in `config.py` and `.env`, exactly like `DATABASE_PATH` in Configuration and Secrets.",
        "For the free local option, install Ollama from ollama.com, choose a small model from its online library and run `ollama pull` followed by the model's name. Ollama then listens at `http://localhost:11434/v1` and needs no key. Small models download in a few minutes and run on most laptops.",
        "For a hosted model, the provider's documentation gives its compatible base address, model names and where to create a key. Hosted calls may cost money after any free allowance, so set a spending limit in the provider's console before you start. Only `.env` changes. The code stays the same.",
      ],
      example: { language: 'text', filename: '.env.example', code: envExampleAi },
    },
    {
      heading: 'When requests fail',
      paragraphs: [
        "Network calls fail in a few predictable ways. Ollama might not be running, so nothing answers. The key might be wrong, giving status 401. The model name might be misspelled, giving 404. You might be sending too many requests, giving 429. Or the provider might be having trouble, giving a 500-range status.",
        "Some failures are temporary and some are permanent. A 429 or a 503 may well succeed a moment later, so it is worth retrying a couple of times with a short pause. A wrong key or a missing model will fail every time, so retrying just wastes time.",
        "Set a timeout, so a stuck request cannot freeze your app forever. When `ask_model()` gives up, it raises one clear error type, `AIError`, which the rest of the app can catch and turn into a friendly message.",
      ],
      example: {
        language: 'text',
        code: code`
          Problem                     What you see                  Retry?
          Ollama is not running       connection refused            yes, briefly
          Wrong or missing API key    status 401                    no
          Model name misspelled       status 404                    no
          Too many requests           status 429                    yes, with a pause
          Provider having trouble     status 500, 502, 503 or 504   yes, with a pause
          No answer for 60 seconds    timeout                       yes, briefly
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Study Tracker\'s ai.py',
    intro: "Save `ai.py` in your `study-tracker` folder, and replace `config.py` with the version in Try it yourself, which adds three AI settings at the end. Every AI feature in this section calls `ask_model()` or a function built the same way. The output shown is a typical reply, and yours will be worded differently.",
    example: { language: 'python', filename: 'ai.py', code: ai, runnable: false, files: { 'config.py': configAi } },
    steps: [
      { code: 'AI_BASE_URL = os.environ.get("AI_BASE_URL", "http://localhost:11434/v1")', explanation: "In `config.py`. The address defaults to Ollama on your own computer, so the free option works with no extra settings beyond the model name." },
      { code: 'if config.AI_API_KEY:\n    headers["Authorization"] = f"Bearer {config.AI_API_KEY}"', explanation: "Hosted providers expect the key in an `Authorization` header in this form. Ollama needs no key, so the header is only added when one is set." },
      { code: 'for attempt in range(retries + 1):', explanation: "With the default `retries=2`, the loop tries up to three times in total." },
      { code: 'except httpx.TransportError as error:', explanation: "A transport error means no response arrived at all, such as a refused connection or a timeout. It is recorded as the problem and retried." },
      { code: 'if response.status_code not in RETRY_STATUSES:\n    break', explanation: "A 401 or 404 will never fix itself, so the loop stops at once instead of waiting and trying again." },
      { code: 'wait = 2 ** attempt', explanation: "The pause doubles: 1 second, then 2. Under the hood explains why waits grow. A warning is logged each time, so you can see retries happening." },
      { code: 'raise AIError(problem)', explanation: "After the last attempt, one clear error with the reason. With Ollama stopped, you see: `AIError: could not reach the model at http://localhost:11434/v1: [Errno 61] Connection refused`. The error number can differ on Windows and Linux." },
      { code: '$ python try_ai.py\nSpacing out practice makes you recall information just as it starts to fade, which strengthens the memory each time.', explanation: "Running `try_ai.py`, shown below, prints a typical one-sentence reply. Your wording will differ every time." },
    ],
  },
  tryIt: {
    instructions: [
      'Install Ollama, pull a small model from its library and copy `.env.example` into your `.env` with `AI_MODEL` set to that model\'s name. Or use a hosted provider\'s address, model and key instead, with a spending limit set.',
      'Save `ai.py`, the new `config.py` and `try_ai.py` below. Activate your virtual environment and run `python try_ai.py`.',
      'Break it on purpose: stop Ollama, or misspell `AI_MODEL`, and read the `AIError`. Note which failure retried and which stopped at once.',
      'Add a `GET /tip` endpoint to `app.py` that returns `{"tip": ask_model("Give one short study tip.")}`. Catch `AIError` and raise `HTTPException(status_code=503, detail="The study assistant is unavailable")`. Commit, but check `git status` first to make sure `.env` is not included.',
    ],
    files: [
      { language: 'python', filename: 'config.py', code: configAi, runnable: false },
      { language: 'python', filename: 'try_ai.py', code: tryAi, runnable: false },
    ],
  },
  mistakes: [
    { mistake: 'Writing the API key in the code or a prompt.', fix: 'Keep it in `.env`, which Git ignores, and read it through `config.py`. If a key is ever committed, delete it in the provider\'s console and create a new one.' },
    { mistake: 'Retrying every failure, including 401 and 404.', fix: 'Retry only connection problems, 429 and 500-range statuses. A wrong key or model name needs fixing, not repeating.' },
    { mistake: 'Leaving out a timeout.', fix: 'Always pass `timeout=`, so one stuck request cannot hang a page or a test forever.' },
    { mistake: 'Calling the provider directly from many places in the code.', fix: 'Send every request through `ask_model()` in `ai.py`, so a provider change or a bug fix happens in one file.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: {
        language: 'python',
        code: code`
          data = {
              "choices": [{"message": {"role": "assistant", "content": "Try 25-minute blocks."}}],
              "usage": {"prompt_tokens": 31, "completion_tokens": 7},
          }
          print(data["choices"][0]["message"]["content"], data["usage"]["completion_tokens"])
        `,
      },
      options: [
        { text: 'Try 25-minute blocks. 38', explanation: '38 would be both counts added together. The code prints only `completion_tokens`.' },
        { text: 'assistant 7', explanation: '`["content"]` picks the reply text. `"assistant"` is the value of `"role"`.' },
        { text: 'Try 25-minute blocks. 7', explanation: 'The reply text is inside the first item of `choices`, and `completion_tokens` is 7.' },
        { text: 'A KeyError, because choices is a list', explanation: '`[0]` takes the first item of the list before looking up `"message"`, so it works.' },
      ],
      answer: 2,
      answerIsOutput: true,
    },
    {
      question: '`ask_model()` sends a request to a hosted provider and gets status 401. What should it do?',
      options: [
        { text: 'Retry three more times with growing pauses', explanation: 'A rejected key will be rejected every time, so retrying only wastes time.' },
        { text: 'Try again without the `Authorization` header', explanation: 'A hosted provider needs the key. Removing it guarantees another 401.' },
        { text: 'Switch to a different model name automatically', explanation: 'The model is not the problem. The key is.' },
        { text: 'Stop and raise an error saying the request was refused, so you can fix the key', explanation: '401 means the key was missing or wrong, which only a person can fix.' },
      ],
      answer: 3,
    },
    {
      question: 'With the design in this lesson, what do you change to move Study Tracker from Ollama to a hosted provider?',
      options: [
        { text: '`AI_BASE_URL`, `AI_MODEL` and `AI_API_KEY` in `.env`', explanation: 'Every request goes through `ask_model()`, which reads these three settings.' },
        { text: 'Every feature that uses AI', explanation: 'Features call `ask_model()`, so they do not change.' },
        { text: 'The retry loop in `ai.py`', explanation: 'Retries work the same way for any provider using this format.' },
        { text: 'Nothing, because Ollama connects to hosted providers automatically', explanation: 'Ollama runs models locally. Your settings decide where requests go.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Send every model request through one `ask_model()` that reads its address, model and key from configuration, sets a timeout and retries only failures that can fix themselves.',
  resources: [
    { title: 'OpenAI compatibility', provider: 'Ollama', description: 'The endpoints and fields Ollama supports in the shared chat completions format.', url: 'https://docs.ollama.com/api/openai-compatibility' },
    { title: 'OpenAI compatibility', provider: 'Google AI for Developers', description: 'An example of a hosted provider documenting its compatible base address.', url: 'https://ai.google.dev/gemini-api/docs/openai' },
    { title: 'HTTPX quickstart', provider: 'HTTPX', description: 'Requests, JSON bodies, headers and timeouts with the library used in ai.py.', url: 'https://www.python-httpx.org/quickstart/' },
  ],
  underTheHood: {
    heading: 'Why retry pauses grow',
    paragraphs: [
      "Picture a provider that is briefly overloaded. If every app retried instantly, the overloaded service would be hit with a second wave of requests on top of the first, and then a third. Instant retries can turn a short hiccup into a long outage.",
      "Waiting longer after each failure, 1 second, then 2, then 4, is called exponential backoff. It gives the service time to recover and spreads the extra load out. Large systems also add a small random amount to each wait, called jitter, so thousands of clients that failed at the same moment do not all retry at the same moment too. When a 429 response includes a `Retry-After` header, it is polite and wise to wait at least that long.",
      "Retries have one more cost. If a request was processed but the response got lost, a retry can do the work twice. For a question, that is only a little extra cost. For an action, such as saving a session, it could save it twice, which is why the Tool Calling lesson treats actions more carefully.",
    ],
  },
}

export default lesson
