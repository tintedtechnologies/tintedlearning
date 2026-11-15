import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { aiObserved, configEmbed, db, embedCache, notesCached, testEmbedCache, testNotesCached } from './study-tracker'

const cacheFiles = { 'config.py': configEmbed, 'ai.py': aiObserved, 'db.py': db, 'embed_cache.py': embedCache }

const lesson: StructuredLesson = {
  assumes: 'AI Observability and Operations, with token counts in your logs, and Vector Databases for `index_notes.py`.',
  goals: [
    'Estimate what an AI feature costs from its token counts and request volume',
    'Cut cost and waiting time by sending fewer tokens, making fewer calls and choosing smaller models',
    'Cache results so the same work is never paid for twice',
  ],
  bigIdea: "The cost and delay of an AI feature come from a few things you can measure: how many tokens go in and come out, how large the model is, and how many calls each request makes, including retries. Reduce any of them and both the bill and the wait shrink. Caching, which means saving a result so identical work is never repeated, is often the biggest single saving.",
  whyItMatters: "Study Tracker's `index_notes.py` re-embeds every paragraph each time it runs, even when only 10 of 3,000 paragraphs changed. On a hosted embedding service, that means paying again for work already done, every time you edit a note. A cache keyed on each paragraph's exact text makes re-indexing cost only the paragraphs you actually changed, and makes it faster too.",
  goalSections: [
    {
      heading: 'Where the cost comes from',
      paragraphs: [
        "For a hosted model, the cost of one request is roughly the input tokens times the input price, plus the output tokens times the output price. Prices differ by model and provider and change over time, so take them from your provider's pricing page. Multiply by requests per day, and the token counts you now log become a monthly estimate.",
        "Input often costs more than you expect. In a RAG request, the system prompt and the retrieved notes are sent every time, and in a chat, the whole conversation is resent with each new message. An agent resends its growing message list on every step, and each retry pays again.",
        "Local models send no bill, but tokens still cost time, electricity and hardware. The same savings make them faster.",
      ],
      example: {
        language: 'python',
        code: code`
          # Made-up example prices, in dollars per million tokens. Use your provider's real ones.
          INPUT_PRICE = 0.50
          OUTPUT_PRICE = 2.00


          def monthly_cost(input_tokens, output_tokens, requests_per_day, days=30):
              per_request = input_tokens / 1_000_000 * INPUT_PRICE + output_tokens / 1_000_000 * OUTPUT_PRICE
              return per_request * requests_per_day * days


          print(round(monthly_cost(1200, 150, 2000), 2))
          print(round(monthly_cost(400, 150, 2000), 2))
        `,
        output: '54.0\n30.0',
      },
    },
    {
      heading: 'Fewer tokens, fewer calls, smaller models',
      paragraphs: [
        "In the example, cutting the input from 1,200 to 400 tokens nearly halves the bill without touching the answer. Send the top 3 passages instead of 10, shorten a long system prompt, and summarize or drop old turns of a conversation. On the output side, ask for short answers and set a maximum number of output tokens.",
        "Use the smallest model that passes your test set, as in AI Models and Model Selection. Different features can use different models: a small one for extracting sessions, a larger one for planning a week. Sending each request to a suitable model is called routing.",
        "Make fewer calls. Combine steps where one call can do the work, keep agent loops short, and run calls that do not depend on each other at the same time, which cuts waiting even when it does not cut cost. After every change, rerun your test set: a saving that breaks answers is not a saving.",
      ],
      example: {
        language: 'text',
        code: code`
          Change                                         Saves on
          Send top 3 passages instead of top 10          input tokens, time to first token
          Ask for "at most 3 sentences"                  output tokens, total time
          Small model for extraction                     price per token, time per token
          One call instead of two in a row               a whole call, its wait and its retries
          Cache repeated embeddings                      the call entirely
        `,
      },
    },
    {
      heading: 'Caching',
      paragraphs: [
        "A cache saves a result under a key, and the next identical request reads the saved result instead of calling the model. Embeddings are ideal for this: the same model given the same text always returns the same vector.",
        "The key must include everything that affects the result. For an embedding, that is the model's name and the exact text. Study Tracker hashes the two together with SHA-256, which turns any text into a fixed-length fingerprint. Edit a note and its fingerprint changes, so the old entry is simply never matched again. Switch models and every key changes, so nothing stale is reused.",
        "Be careful caching generated answers. If the notes behind an answer change, a cached answer can go stale, so include a version of the inputs in the key or expire entries. Many providers also offer prompt caching, which charges less when the start of a prompt, such as a long system prompt, repeats exactly. Check your provider's documentation.",
      ],
      example: {
        language: 'text',
        code: code`
          key = sha256("nomic" + "\n" + "Plants use light.")  ->  "3f9a...c21e"

          First run:   key not found -> call the model, save the vector
          Next run:    key found     -> read the saved vector, no call
          Text edited: new key       -> call the model for this paragraph only
          New model:   new key       -> call the model, old vectors never reused
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Study Tracker\'s embedding cache',
    intro: "This new file, `embed_cache.py`, wraps `embed()`. Then `notes.py` calls `cached_embed()` instead of `embed()` in both `index_notes()` and `search()`. The log lines at the end came from running `index_notes.py` three times with a test model.",
    example: { language: 'python', filename: 'embed_cache.py', code: embedCache, runnable: false, files: cacheFiles },
    steps: [
      { code: 'key TEXT PRIMARY KEY,', explanation: "The cache is one more table in `study.db`. The primary key makes each lookup by key fast." },
      { code: 'hashlib.sha256(f"{config.AI_EMBED_MODEL}\\n{text}".encode("utf-8")).hexdigest()', explanation: "The model name and the text, joined and hashed. Two paragraphs with identical text share one entry, which is fine, because their vectors would be identical anyway." },
      { code: 'missing = list(dict.fromkeys(text for text, key in zip(texts, keys) if key not in found))', explanation: "Only texts without a saved vector are sent. `dict.fromkeys` removes duplicates while keeping the order." },
      { code: 'for text, vector in zip(missing, embed(missing)):', explanation: "One request embeds all the missing texts together, then each new vector is saved for next time." },
      { code: 'return [found[key] for key in keys]', explanation: "The caller gets a vector for every text, in the original order, and cannot tell which came from the cache. Nothing else in Study Tracker needs to change." },
      { code: 'INFO study_tracker.cache: Embeddings: 0 from cache, 4 new\nINFO study_tracker.cache: Embeddings: 4 from cache, 0 new\nINFO study_tracker.cache: Embeddings: 3 from cache, 1 new', explanation: "Three real runs: the first index embeds everything, the second sends nothing, and after one paragraph was edited, only that paragraph went to the model." },
    ],
  },
  tryIt: {
    instructions: [
      'From your logs, take the average input and output tokens for `POST /notes/ask`. Using your provider\'s current prices, or the made-up ones above, estimate the monthly cost at 50 and at 5,000 questions a day.',
      'Add `embed_cache.py`, replace `notes.py` with the version below and run `python index_notes.py` twice. Check the cache lines in the output.',
      'Edit one paragraph in your notes and index again. Confirm that exactly one embedding is new.',
      'Replace `test_notes_store.py` with the version below, add `test_embed_cache.py`, and run `python -m pytest`.',
    ],
    files: [
      { language: 'python', filename: 'notes.py', code: notesCached, runnable: false },
      { language: 'python', filename: 'test_notes_store.py', code: testNotesCached, files: { ...cacheFiles, 'notes.py': notesCached }, runWith: 'pytest' },
      { language: 'python', filename: 'test_embed_cache.py', code: testEmbedCache, files: cacheFiles, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Ignoring cost until the first bill arrives.', fix: 'Log token counts from the start and turn them into a monthly estimate before launch, then set a spending limit with your provider.' },
    { mistake: 'Sending everything just in case.', fix: 'Send only the passages and history the request needs. Input tokens are usually the largest part of the bill.' },
    { mistake: 'A cache key that leaves out something that changes the result.', fix: 'Include the model name and every input in the key, so a changed input can never return an old result.' },
    { mistake: 'Cutting cost without rerunning the test set.', fix: 'Every saving, a smaller model, fewer passages or a shorter prompt, must still pass your tests.' },
  ],
  quiz: [
    {
      question: 'Using the example prices, which change most reduces the cost of a RAG request with 1,200 input tokens and 150 output tokens?',
      options: [
        { text: 'Asking for 100 output tokens instead of 150', explanation: 'That saves 50 output tokens, which is less than the input saving here.' },
        { text: 'Sending 3 note passages instead of 10, so the input drops to 400 tokens', explanation: 'At these prices, cutting 800 input tokens saves more than any output change, nearly halving the cost.' },
        { text: 'Setting the temperature to 0', explanation: 'Temperature changes how tokens are picked, not how many are sent or paid for.' },
        { text: 'Retrying failed requests more times', explanation: 'Every retry is paid for again.' },
      ],
      answer: 1,
    },
    {
      question: 'You switch `AI_EMBED_MODEL` to a new model and run `index_notes.py`. With this lesson\'s cache, what happens?',
      options: [
        { text: 'Every paragraph comes from the cache, so nothing is sent', explanation: 'The model name is part of the key, so old entries never match.' },
        { text: 'The cache must be deleted by hand first', explanation: 'Old entries cannot match new keys, so they are simply never used.' },
        { text: 'Only edited paragraphs are embedded', explanation: 'Every key changed, because the model name changed.' },
        { text: 'Every paragraph is embedded again with the new model, because every key changed', explanation: 'Including the model name in the key is exactly what prevents mixing vectors from two models.' },
      ],
      answer: 3,
    },
    {
      question: 'Why is caching generated answers riskier than caching embeddings?',
      options: [
        { text: 'An answer depends on things that change, such as the notes, so a saved answer can go stale', explanation: 'Unless the key covers every input, or entries expire, the cache can return an answer the notes no longer support.' },
        { text: 'Generated answers are too large to store', explanation: 'Text is small. Size is not the problem.' },
        { text: 'Caching answers is not allowed by providers', explanation: 'You can store your own app\'s results. The risk is staleness.' },
        { text: 'Embeddings change every time you request them', explanation: 'The same model and text give the same embedding, which is what makes them safe to cache.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Measure tokens and calls, cut what each request sends, use the smallest model that passes your tests, and cache anything identical, with keys that include every input, so you never pay twice for the same work.',
  resources: [
    { title: 'hashlib', provider: 'Python.org', description: 'The standard library module for SHA-256 and other hashes.', url: 'https://docs.python.org/3/library/hashlib.html' },
    { title: 'Prompt caching', provider: 'Claude Docs', description: 'One provider\'s guide to discounted repeated prompt prefixes.', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-caching' },
    { title: 'Context caching', provider: 'Google AI for Developers', description: 'Another provider\'s approach to reusing long, repeated input.', url: 'https://ai.google.dev/gemini-api/docs/caching' },
  ],
  underTheHood: {
    heading: 'Why hashes make good cache keys',
    paragraphs: [
      "A hash function such as SHA-256 turns any input, a word or a whole book, into a fixed-length string of 64 hexadecimal characters. The same input always gives the same hash, and changing a single character anywhere, even a comma, gives a completely different one.",
      "That makes a hash a fingerprint. Instead of storing and comparing whole paragraphs, the cache compares short fingerprints, which is fast and keeps the table small. Two different texts producing the same SHA-256 hash is so unlikely that, in practice, you can treat it as impossible.",
      "Hashes also solve the hardest problem in caching, knowing when an entry is out of date, without any extra work. You never have to delete an outdated entry, because a changed input produces a new key that the old entry cannot match. The old entries just sit unused, so a long-running app might occasionally clear entries nobody has read for months, but correctness never depends on it.",
    ],
  },
}

export default lesson
