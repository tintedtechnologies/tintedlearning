import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'AI Cost, Latency, and Performance from AI Engineering, which explains where model costs come from, and Agent and Tool Security from this section. Run every example on your own local copy of Study Tracker.',
  goals: [
    'Limit input size and output length so one request cannot cost more than the app can afford',
    'Apply per-learner rate limits and a daily usage budget before any model call is made',
    'Stop runaway loops and retry storms, and set alerts and provider spending caps that act before the bill arrives',
  ],
  bigIdea: "An AI feature costs money and time on every request, so a request that is too large, too frequent or stuck in a loop can drain a shared budget or slow everyone down. Availability and cost are protected by limits checked in code before the model is called: a size limit, a rate limit, a daily budget and a step limit. Alerts and spending caps are the last safety net.",
  whyItMatters: "Study Tracker's assistant is shared by a whole class. One learner pasting a textbook, one script that sends the same question a thousand times, or one agent stuck in a loop can use up the budget for the day. Then everyone else sees errors, and the bill arrives after the damage is done.",
  goalSections: [
    {
      heading: 'Limit the size of every request',
      paragraphs: [
        "Input size is the first limit to set, because cost and delay both grow with it. Reject questions above a fixed length with a clear message before the model is called. A long paste is almost never a good question, and it can also exceed the model's context window and fail in a confusing way.",
        "Limit the output too. Ask for a maximum output length for each kind of request, and cap the number of notes sent in the prompt. The retrieval step from RAG already picks three passages, so the prompt stays a predictable size whatever is in the notes folder.",
      ],
      example: {
        language: 'text',
        code: code`
          Limit                       Typical value for Study Tracker   What it protects
          question length             up to 2,000 characters            cost and context window
          passages in a prompt        3                                 prompt size
          output length               a fixed maximum per request       reply time and cost
          steps for an agent          5                                 loops
        `,
      },
    },
    {
      heading: 'Rate limits and a daily budget',
      paragraphs: [
        "A rate limit caps how many requests one learner can send in a time window. A daily budget caps how much the whole app can spend in a day. The learner limit keeps one person from using everyone's share, and the daily budget keeps the total from growing past what you planned for.",
        "Count usage per learner and per day in a store the app can read quickly. Check both limits before the model is called, so a refused request costs nothing. Return a message that says when the learner can try again, rather than a server error. Keep the limits in one file with comments, so a teammate can change them without hunting through the code.",
      ],
      example: {
        language: 'text',
        code: code`
          Check order before every model call
            1. question length within the limit?
            2. this learner under the per-minute request limit?
            3. the day's total still under the budget?
            4. only then call the model, and count the tokens it used
        `,
      },
    },
    {
      heading: 'Runaway loops and alerts',
      paragraphs: [
        "Two things turn a small bug into a large bill: loops and retries. An agent that keeps calling tools needs the step limit from the agent lesson. A retry that runs without a cap can send the same failing request again and again, so limit retries and wait longer between each one.",
        "Alerts and caps are the last layer. Set a budget alert that fires well before the limit, and use a spending cap in your provider's dashboard if it offers one, so the account stops at a fixed amount. Both are set outside the code, which means they still work when the code has a bug.",
      ],
      example: {
        language: 'text',
        code: code`
          Layer                          Stops
          input and output limits        a single expensive request
          per-learner rate limit         one person sending a flood
          daily budget in code           the whole app spending too much in a day
          step limit and retry cap       loops and retry storms
          alert and provider spending cap a bug the code limits did not catch
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A guard that runs before every model call',
    intro: "The guard below checks the three code-level limits in order and returns a clear message for each refusal. Notice that a refusal returns before the model is called, so it costs nothing. The example numbers are for teaching. Set your own limits from what you can afford.",
    example: {
      language: 'python',
      filename: 'guard.py',
      code: code`
        MAX_INPUT_CHARS = 2000
        DAILY_TOKEN_LIMIT = 50000
        RATE_LIMIT = 3

        def check_request(question, tokens_used_today, requests_this_minute):
            if len(question) > MAX_INPUT_CHARS:
                return "too long: shorten the question"
            if tokens_used_today >= DAILY_TOKEN_LIMIT:
                return "daily AI budget used up"
            if requests_this_minute >= RATE_LIMIT:
                return "too many requests: wait a minute"
            return "ok"

        print(check_request("x" * 2500, 0, 0))
        print(check_request("What is ATP?", 50000, 0))
        print(check_request("What is ATP?", 100, 3))
        print(check_request("What is ATP?", 100, 1))
      `,
      output: "too long: shorten the question\ndaily AI budget used up\ntoo many requests: wait a minute\nok",
    },
    steps: [
      { code: 'if len(question) > MAX_INPUT_CHARS:', explanation: "The cheapest check goes first. A question that is too long is refused without reading the budget or calling the model." },
      { code: 'if tokens_used_today >= DAILY_TOKEN_LIMIT:', explanation: "The whole app's budget. Once the day's tokens are used up, every learner gets the same clear message until the day resets." },
      { code: 'if requests_this_minute >= RATE_LIMIT:', explanation: "One learner cannot use up the budget in a few seconds. The message tells them to wait, which is more helpful than a server error." },
      { code: 'print(check_request("What is ATP?", 100, 1))', explanation: "A normal request passes all three checks. Only then does the code call the model and record the tokens it used." },
    ],
  },
  tryIt: {
    instructions: [
      'Add `MAX_INPUT_CHARS`, a per-learner rate limit and a daily token budget to `assistant.py`. Run `check_request`-style checks before `ask_assistant` calls the model.',
      'Cap retries in `ai.py` at two, and make `ask_model` wait longer between each retry. Confirm that a failing provider stops the request instead of looping.',
      'Add `test_availability.py`. It should check that a 2,500-character question never reaches the model, that the fourth request in one minute is refused, and that the budget refusal arrives before any model call is made.',
    ],
  },
  mistakes: [
    { mistake: 'Leaving input length unlimited.', fix: 'Set a maximum question length and reject longer input before the model is called.' },
    { mistake: 'Checking limits in the web page only.', fix: 'Check limits on the server, where every request passes through.' },
    { mistake: 'Relying on a budget alert with no hard limit.', fix: 'Pair alerts with a daily budget in code and a provider spending cap, because alerts arrive late.' },
    { mistake: 'Retrying failed requests with no cap.', fix: 'Limit retries, wait longer between them, and stop when the cap is reached.' },
  ],
  quiz: [
    {
      question: 'A learner pastes a 200,000-character textbook chapter into the assistant. The app has no input limit. What is the most likely result?',
      options: [
        { text: 'It costs nothing, because the learner typed it themselves', explanation: 'Input is billed and processed like any other, whoever typed it.' },
        { text: 'A slow, costly request that can exceed the model\'s context window and fail, with no check to stop it', explanation: 'Without a limit, the request goes through, costs money, and can fail for size.' },
        { text: 'The chapter is cut to 2,000 characters and answered correctly', explanation: 'Nothing cuts it, unless your code does. Without a limit, the whole paste is sent.' },
        { text: 'The model refuses it automatically', explanation: 'A model may refuse some content, but it is not a size limit.' },
      ],
      answer: 1,
    },
    {
      question: 'Why does a per-learner rate limit help against a request flood?',
      options: [
        { text: 'It makes the model answer faster', explanation: 'Rate limits control how many requests are allowed, not how fast they are answered.' },
        { text: 'It removes the need for input limits', explanation: 'Input limits and rate limits protect against different problems.' },
        { text: 'It caps how much one account can use, so one flood cannot spend the shared budget', explanation: 'A cap per learner means one account cannot use up everyone\'s share of the daily budget.' },
        { text: 'It hides errors from users', explanation: 'Rate limits show a clear message. They do not hide anything.' },
      ],
      answer: 2,
    },
    {
      question: 'An agent loop calls the model 400 times overnight, and the bill is large the next morning. What would have prevented it?',
      options: [
        { text: 'A higher temperature', explanation: 'Temperature changes wording, not how many calls are made.' },
        { text: 'A longer system prompt', explanation: 'A longer prompt makes each call cost more, and it does not stop the loop.' },
        { text: 'Removing the logs', explanation: 'Logs do not make calls, so removing them changes nothing about the cost.' },
        { text: 'A step limit in code, plus a budget alert and a provider spending cap', explanation: 'The step limit stops the loop, and the alert and cap catch anything the code missed.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Check input size, rate and daily budget in code before every model call, cap loops and retries, and add alerts and a provider spending cap as the last layer.',
  resources: [
    { title: 'Handling Overload', provider: 'Google SRE Book', description: 'How services protect themselves from too much traffic, including limits and load shedding.', url: 'https://sre.google/sre-book/handling-overload/' },
    { title: 'OWASP Top 10 for Large Language Model Applications', provider: 'OWASP GenAI Security Project', description: 'Includes unbounded consumption, where a model is used in ways that drive up cost.', url: 'https://genai.owasp.org/llm-top-10/' },
  ],
  underTheHood: {
    heading: 'How token buckets allow short bursts',
    paragraphs: [
      "A common way to build a rate limit is the token bucket. Picture a bucket that holds a fixed number of tokens, which here means permission to send a request. Each request takes one token out, and the bucket refills slowly over time, up to its maximum size.",
      "This design allows short bursts. A learner who has been quiet can send a few requests at once, because the bucket is full. A steady flood runs the bucket empty and gets refused. The bucket size sets how large a burst is allowed, and the refill rate sets the long-run average.",
      "A simpler design counts requests in a fixed window, such as one minute. It is easy to build but lets a learner send a double burst across the boundary between two windows. Either design works for Study Tracker. The important part is that the check runs before the model is called and that its numbers are written down.",
    ],
  },
}

export default lesson
