import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { aiObserved, appObserved, assistant, configEmbed, db, extract, notesStore, observability, planner, ragStream, schemas, testObservability } from './study-tracker'

const observedFiles = { 'config.py': configEmbed, 'ai.py': aiObserved, 'db.py': db, 'notes.py': notesStore, 'rag.py': ragStream, 'schemas.py': schemas, 'extract.py': extract, 'assistant.py': assistant, 'planner.py': planner, 'observability.py': observability, 'app.py': appObserved }

const lesson: StructuredLesson = {
  assumes: 'the Software Engineering lesson Logging, and Inference and Deployment, with `ai.py`, `rag.py` and `app.py` from that lesson.',
  goals: [
    'Log every model call with its timing, tokens and outcome, without logging private content',
    'Follow one request through search, the model and tools using a shared request ID',
    'Spot when quality, speed or cost gets worse, using a few key numbers and a regular test run',
  ],
  bigIdea: "Observability means being able to tell what your running app is doing, and why, from the records it leaves behind. For an AI feature, that means recording every model call's timing, token counts and outcome, tagging all the records from one request with the same ID, and watching a few numbers over time. AI features fail quietly, so these records are often the only way to notice that something got worse.",
  whyItMatters: "A learner reports that the notes assistant \"got slow and keeps saying it can't find things\" since Tuesday. Is the model service slow? Did someone change the prompt? Did the notes index break? Without records, you can only guess. With them, you search the logs for Tuesday, see that every search now returns nothing above the minimum score, and find that an embedding model was switched without re-indexing. Twenty minutes instead of two days.",
  goalSections: [
    {
      heading: 'Logging model calls safely',
      paragraphs: [
        "Every model call should leave one log line with what you need to debug and to track cost: which call, which model, the status, how many milliseconds it took, and the input and output token counts from the response's `usage` field.",
        "Do not log the prompts or the replies. They contain learners' notes, questions and anything else people type, and logs are copied to many places and kept for a long time, as the Logging lesson warned. Log sizes, scores, counts and IDs instead. If you ever need real content to debug, collect a small sample deliberately, remove personal details and delete it when you are done.",
        "Log failures too, with the status and the time taken. A rising number of 429 or 503 responses is often the first sign of trouble at the provider.",
      ],
      example: {
        language: 'text',
        code: code`
          Useful and safe                        Never in logs
          call=chat/completions                  the prompt text
          model=small-model                      the model's reply
          status=200  ms=2140                    the learner's notes or questions
          input_tokens=412  output_tokens=96     API keys, from any header
          not found: no note above 0.35          names or email addresses
        `,
      },
    },
    {
      heading: 'Tracing one request',
      paragraphs: [
        "A single question to the notes assistant causes several steps: an embedding call, a search, a chat call and the response. When the logs from many learners are mixed together, you need a way to pick out the lines that belong to one request.",
        "The answer is a request ID: a short random code created when a request arrives and attached to every log line written while handling it. Study Tracker stores it in a context variable, Python's way of keeping a value for the current task, and a logging filter adds it to each line. The ID also goes back to the client in an `X-Request-ID` header, so a learner reporting a problem can quote it.",
        "Following one request through every step like this is called tracing. Larger systems use a standard called OpenTelemetry to send traces to tools that draw each step as a timeline.",
      ],
      example: {
        language: 'text',
        code: code`
          One question, every line tagged [acefdd03]:
          INFO study_tracker.ai  [acefdd03] call=embeddings model=nomic status=200 ms=17 input_tokens=None output_tokens=None
          INFO study_tracker.ai  [acefdd03] call=chat/completions model=small-model status=200 ms=4 input_tokens=30 output_tokens=12
          INFO study_tracker.rag [acefdd03] Answered from 2 note paragraph(s)
          INFO study_tracker     [acefdd03] POST /notes/ask -> 200 in 23 ms
        `,
      },
    },
    {
      heading: 'Spotting when things get worse',
      paragraphs: [
        "A few numbers, checked daily or on a simple dashboard, catch most regressions, meaning things that used to work and now work worse. Watch the error rate, the slow end of response times, the tokens per request, which drive cost, and the share of RAG answers that say \"not found\". A sudden jump in that last one usually means the search broke, not that learners started asking harder questions.",
        "For response times, look at percentiles rather than the average. The 95th percentile, or p95, is the time that 95% of requests beat. It shows the slow experiences that an average hides.",
        "Numbers show that something changed, but not whether answers got worse. For that, rerun your test set from Evaluating AI Responses after every prompt or model change, and on a regular schedule, because hosted models can change behind the same name.",
      ],
      example: {
        language: 'python',
        code: code`
          import statistics

          durations_ms = [820, 790, 910, 870, 4200, 840, 880, 905, 860, 830,
                          850, 4600, 815, 890, 870, 845, 900, 860, 5100, 880]
          print("average:", round(statistics.mean(durations_ms)))
          print("median:", statistics.median(durations_ms))
          print("p95:", round(statistics.quantiles(durations_ms, n=20)[18]))
        `,
        output: 'average: 1426\nmedian: 870.0\np95: 5075',
      },
    },
  ],
  seeItInAction: {
    title: 'Adding a request ID to Study Tracker',
    intro: "This lesson adds a small `observability.py`, shown here, a timing line to `post_json()` in `ai.py`, and a middleware function in `app.py` that runs around every request. The trace in Tracing one request came from this code with a test model, which is why its times are so short and the embedding call reports no token counts. A real model's calls take hundreds or thousands of milliseconds.",
    example: { language: 'python', filename: 'observability.py', code: observability, runnable: false, files: observedFiles },
    steps: [
      { code: 'request_id = contextvars.ContextVar("request_id", default="-")', explanation: "A context variable holds a separate value for each request being handled, even when several run at the same time. Outside a request, such as in a script, it shows `-`." },
      { code: 'record.request_id = request_id.get()', explanation: "The filter runs for every log line and adds the current ID, so `%(request_id)s` in the format has something to print." },
      { code: 'token = observability.request_id.set(uuid.uuid4().hex[:8])', explanation: "From the middleware in `app.py`. Each request gets 8 random hexadecimal characters, short enough to read and quote, and unique enough for one app's logs." },
      { code: 'logger.info("%s %s -> %s in %s ms", ...)', explanation: "One line per request with the method, path, status and total time, the numbers a dashboard needs." },
      { code: 'response.headers["X-Request-ID"] = observability.request_id.get()', explanation: "The client gets the ID too. When a learner says \"request acefdd03 was wrong\", you can find every line for it in seconds." },
      { code: '# Log what happened, never what was said: no prompts, no replies.', explanation: "From `post_json()` in `ai.py`. The line records the call, the model, the time and the token counts. The test file checks that prompt text never appears in it." },
    ],
  },
  tryIt: {
    instructions: [
      'Add `observability.py` and replace `ai.py` and `app.py` with the versions below. Restart the app and ask the notes assistant two questions.',
      'In the terminal, pick one request ID and find every line that belongs to it. Write down where the time went.',
      'Add `test_observability.py` and run `python -m pytest`. One test proves that a prompt marked SECRET never reaches the logs.',
      'Write a short script that reads your log file, pulls out every `ms=` value for `chat/completions` and prints the median and p95, using the code above.',
    ],
    files: [
      { language: 'python', filename: 'ai.py', code: aiObserved, runnable: false },
      { language: 'python', filename: 'app.py', code: appObserved, runnable: false },
      { language: 'python', filename: 'test_observability.py', code: testObservability, files: observedFiles, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Logging full prompts and replies.', fix: 'Log calls, models, times, token counts, scores and IDs. Content holds personal data and lives in logs for a long time.' },
    { mistake: 'Log lines with no way to tell which request they belong to.', fix: 'Attach a request ID to every line, and return it to the client so problem reports can include it.' },
    { mistake: 'Watching only the average response time.', fix: 'Track the median and p95. The slow tail is what frustrated users experience.' },
    { mistake: 'Changing a prompt or model without rerunning the test set.', fix: 'Rerun it after every change, and on a schedule, because hosted models can change behind the same name.' },
  ],
  quiz: [
    {
      question: 'Which log line is most useful and safe for a model call?',
      options: [
        { text: '`Asked: "How do I stop failing algebra?" Reply: "Try spacing your practice..."`', explanation: 'It records a learner\'s private question and the reply. Log what happened, not what was said.' },
        { text: '`model call done`', explanation: 'It gives no model, time, tokens or status, so it cannot help you debug or track cost.' },
        { text: '`call=chat/completions model=small-model status=200 ms=2140 input_tokens=412 output_tokens=96`', explanation: 'It has everything needed for speed, cost and errors, and no personal content.' },
        { text: '`Authorization: Bearer your-key-here`', explanation: 'Never log keys or headers that contain them.' },
      ],
      answer: 2,
    },
    {
      question: 'Since an update, the share of notes answers saying "not found" jumped from 5% to 60%. What is the most likely cause?',
      options: [
        { text: 'The search is broken, for example the embedding model changed without re-indexing', explanation: 'A sudden, large jump points to the search step, which is where RAG answers usually fail.' },
        { text: 'Learners suddenly started asking harder questions', explanation: 'Behavior rarely changes that much overnight. A software change is far more likely.' },
        { text: 'The model became more honest', explanation: '"Not found" is decided mostly by the minimum score in code, before the model is called.' },
        { text: 'The logs are wrong', explanation: 'Possible, but check the search first. That is what the number is pointing at.' },
      ],
      answer: 0,
    },
    {
      question: 'Response times for 20 requests are mostly about 850 ms, but three took over 4,000 ms. Which number shows those slow requests best?',
      options: [
        { text: 'The median', explanation: 'The median is about 870 ms. It ignores the slow tail completely.' },
        { text: 'The fastest time', explanation: 'The fastest request says nothing about the slow ones.' },
        { text: 'The average', explanation: 'The average blends the slow requests into one middling number that matches nobody\'s experience.' },
        { text: 'The 95th percentile', explanation: 'p95 shows how slow the slowest 5% of requests are, which is where the problem is.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Log every model call\'s timing, tokens and outcome but never its content, tag every line with a request ID, and watch a few numbers and a regular test run so you notice when things get worse.',
  resources: [
    { title: 'What is OpenTelemetry?', provider: 'OpenTelemetry', description: 'The open standard for traces, metrics and logs across many services.', url: 'https://opentelemetry.io/docs/what-is-opentelemetry/' },
    { title: 'Monitoring distributed systems', provider: 'Google SRE Book', description: 'The four signals worth watching: latency, traffic, errors and saturation.', url: 'https://sre.google/sre-book/monitoring-distributed-systems/' },
    { title: 'contextvars', provider: 'Python.org', description: 'The standard library module behind Study Tracker\'s request ID.', url: 'https://docs.python.org/3/library/contextvars.html' },
    { title: 'Logging Cheat Sheet', provider: 'OWASP', description: 'What to log and what never to log, from a security point of view.', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html' },
  ],
  underTheHood: {
    heading: 'Why one slow call matters more than it looks',
    paragraphs: [
      "Suppose each model call has a 5% chance of being slow. One call per page means 1 learner in 20 waits. But pages often make several calls: an embedding, a chat call, perhaps a tool round or two.",
      "With 5 calls, the page is slow if any one of them is slow. The chance that all 5 are fast is 0.95 multiplied by itself 5 times, about 0.77. So about 23% of page loads include at least one slow call, nearly 1 in 4 learners, even though each call looks fine on its own.",
      "This is why serious teams watch p95 and even p99, not averages, and why the slow tail of each step matters. It is also why the trace from one request is so useful: it shows which step was slow this time, so you fix the right one. Reducing the number of calls per request, or running independent ones at the same time, shrinks the problem directly.",
    ],
  },
}

export default lesson
