import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { aiStream, appStream, watchStream, assistant, configEmbed, db, extract, notesStore, planner, ragStream, schemas, testRagStream } from './study-tracker'

const streamFiles = { 'config.py': configEmbed, 'ai.py': aiStream, 'db.py': db, 'notes.py': notesStore, 'rag.py': ragStream, 'schemas.py': schemas, 'extract.py': extract, 'assistant.py': assistant, 'planner.py': planner, 'app.py': appStream }

const lesson: StructuredLesson = {
  assumes: 'Retrieval-Augmented Generation, with `POST /notes/ask` working, and AI Models and Model Selection for hosted and local models.',
  goals: [
    'Explain where the time goes in a model request: waiting for the first token, then writing the rest',
    'Stream a model\'s reply to the user as it is written',
    'Choose how to serve a model: a hosted API, your own server or batched jobs',
  ],
  bigIdea: "Inference means running a trained model to get an answer. A reply takes time in two parts: the wait before the first token, and the time to write each token after it. Streaming sends tokens to the user as they are written, so an answer starts appearing in about a second instead of after ten, and batching groups requests together to use the hardware well when nobody is waiting.",
  whyItMatters: "Study Tracker's assistant takes eight seconds to answer a question from your notes. Staring at a blank screen for eight seconds, learners click again or give up. With streaming, the first words appear within a second and the rest flows in as it is written. The total time is the same, but it feels completely different. Knowing where the time goes also tells you what to fix when it really is too slow.",
  goalSections: [
    {
      heading: 'Where the time goes',
      paragraphs: [
        "A request has two phases. First the model reads your whole input. This phase is called prefill, and it processes all the input tokens together, so it is fairly quick, but it grows with the length of the prompt. Add network time and any queue at the provider, and you get the time to first token.",
        "Then comes decoding: the model writes the reply one token at a time, and each token needs a full pass through the model. So the total time is roughly the time to first token plus the number of output tokens multiplied by the time per token.",
        "That tells you what to change. A long prompt delays the start. A long answer delays the end, so asking for shorter answers is the most direct speed-up. A smaller model, as in AI Models and Model Selection, makes every token faster. Running locally, your own hardware sets the pace.",
      ],
      example: {
        language: 'text',
        code: code`
          Time to first token:      0.8 seconds
          Writing speed:            40 tokens per second
          Answer length:            300 tokens

          Total: 0.8 + 300 / 40 = 8.3 seconds
          Without streaming: blank for 8.3 seconds, then everything at once
          With streaming:    first words at 0.8 seconds, the rest as written
        `,
      },
    },
    {
      heading: 'Streaming a reply',
      paragraphs: [
        "Add `\"stream\": true` to the request and the service sends the reply as a series of small events instead of one response. Each event is a line starting with `data: `, holding JSON with the next piece of text, called a delta. A final `data: [DONE]` line marks the end. This format is called server-sent events.",
        "In Python, `httpx.stream()` reads the lines as they arrive, and a generator, a function that uses `yield`, hands each piece on. FastAPI's `StreamingResponse` sends the pieces to the browser as they come.",
        "Streaming has trade-offs. You cannot check the whole answer before the user sees it, so do not stream anything you need to validate first, such as structured output or tool calls. A stream cannot simply be retried halfway, because the user has already seen the first part. And a failure can happen in the middle, so plan for that too.",
      ],
      example: {
        language: 'text',
        code: code`
          What arrives, line by line, with a short gap between each:
          data: {"choices": [{"index": 0, "delta": {"content": "Cells"}}]}
          data: {"choices": [{"index": 0, "delta": {"content": " get"}}]}
          data: {"choices": [{"index": 0, "delta": {"content": " energy"}}]}
          ...
          data: [DONE]
        `,
      },
    },
    {
      heading: 'Ways to serve a model',
      paragraphs: [
        "A hosted API is the simplest option: you send requests, pay per token and the provider handles hardware and scaling. Running an open-weight model yourself, on your own machine or a rented server with a graphics card, gives you control, privacy and a fixed cost, but you handle setup, updates and growth. Ollama suits one person or a small team. Dedicated serving engines such as vLLM are built for many users at once.",
        "Two measures matter. Latency is how long one user waits. Throughput is how many tokens the system produces per second across all users. Serving engines raise throughput by batching, which means working on many users' requests in the same pass through the model.",
        "Some work has nobody waiting for it, such as re-summarizing every note overnight. Many providers offer batch interfaces for jobs like this that return results within hours, usually at a lower price than live requests.",
      ],
      example: {
        language: 'text',
        code: code`
          Option                         Good for                          You manage
          Hosted API                     getting started, any scale        cost and keys
          Ollama on your own computer    one person, privacy, free use     your hardware
          Serving engine on a server     many users of an open model       servers, updates, scaling
          Batch job                      large work with no one waiting    collecting the results
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Streaming answers from Study Tracker\'s notes',
    intro: "This lesson adds `stream_model()` to `ai.py`, shown here, plus `stream_answer()` in `rag.py` and a `POST /notes/ask/stream` endpoint, both in Try it yourself. The timings at the end were measured with a test model that writes one word every 0.3 seconds.",
    example: { language: 'python', filename: 'ai.py', code: aiStream, runnable: false, files: streamFiles },
    steps: [
      { code: '"stream": True,', explanation: "This one field changes the response from a single JSON object into a series of events." },
      { code: 'with httpx.stream("POST", ...) as response:', explanation: "`httpx.stream` opens the connection and lets you read the body as it arrives, instead of waiting for all of it. The `with` block closes the connection afterward, even if something fails." },
      { code: 'if not line.startswith("data: ") or line == "data: [DONE]":\n    continue', explanation: "Server-sent events include blank separator lines, and the stream ends with a `[DONE]` marker. Only lines with data are read." },
      { code: 'choices = json.loads(line.removeprefix("data: ")).get("choices") or []', explanation: "Some services send a last event with token usage and an empty `choices` list. The code skips it instead of crashing." },
      { code: 'yield piece', explanation: "`stream_model()` is a generator. Each `yield` hands one piece to whoever is reading, while the connection stays open for the next one." },
      { code: 'except AIError as error:\n    yield "\\n\\nSorry, the answer was cut off. Please try again."', explanation: "From `stream_answer()` in `rag.py`. A failure halfway through cannot be hidden or retried, so the learner gets a clear note at the end of what they already have." },
      { code: '0.32s \'Cells\'\n0.63s \' get\'\n...\n3.34s \' [1].\'\n3.34s \'\\n\\nSources: [1] biology.md, [2] biology.md\'', explanation: "The measured result from `POST /notes/ask/stream`: the first word after a third of a second, the rest as written, then the sources." },
    ],
  },
  tryIt: {
    instructions: [
      'Replace `ai.py` with the version above, and add `stream_answer()` to `rag.py` and the new endpoint to `app.py`, using the files below.',
      'With the app running, run `python watch_stream.py` from a second terminal. It prints each piece the moment it arrives, on macOS, Linux and Windows alike.',
      'Time it: note when the first word appears and when the answer finishes. Then ask for "a one-sentence answer" and compare both times.',
      'Add `test_rag_stream.py` and run `python -m pytest`. One test breaks the stream halfway on purpose.',
    ],
    files: [
      { language: 'python', filename: 'rag.py', code: ragStream, runnable: false },
      { language: 'python', filename: 'app.py', code: appStream, runnable: false },
      { language: 'python', filename: 'watch_stream.py', code: watchStream, runnable: false },
      { language: 'python', filename: 'test_rag_stream.py', code: testRagStream, files: streamFiles, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Making users stare at a blank screen during long replies.', fix: 'Stream replies that people read, so the first words appear while the rest is still being written.' },
    { mistake: 'Streaming output that must be validated first.', fix: 'Collect structured output and tool calls in full, validate them, and only then use or show them.' },
    { mistake: 'Ignoring failures in the middle of a stream.', fix: 'Catch the error inside the generator and end with a clear message, because a half-shown answer cannot be retried silently.' },
    { mistake: 'Trying to speed things up without measuring where the time goes.', fix: 'Measure time to first token and total time separately. A slow start points to the prompt or the queue, a slow finish to the answer length or the model.' },
  ],
  quiz: [
    {
      question: 'A model takes 1 second to the first token and then writes 50 tokens per second. Roughly how long does a 200-token answer take in total?',
      options: [
        { text: 'About 4 seconds', explanation: 'That is only the writing time, 200 / 50. The first-token wait comes on top.' },
        { text: 'About 1 second', explanation: 'That is only the wait before the first token.' },
        { text: 'About 5 seconds', explanation: '1 second to the first token, plus 200 / 50 = 4 seconds of writing.' },
        { text: 'About 200 seconds', explanation: 'The model writes 50 tokens each second, not one.' },
      ],
      answer: 2,
    },
    {
      question: 'Study Tracker\'s session parser returns JSON that must pass validation before it is shown. Should it stream?',
      options: [
        { text: 'Yes, because streaming always feels faster', explanation: 'The user would see JSON that has not been checked yet, and might act on it.' },
        { text: 'Yes, and validate each piece as it arrives', explanation: 'A fragment of JSON cannot be validated. Only the whole reply can.' },
        { text: 'No, because streaming does not work with JSON mode', explanation: 'It can work technically. The problem is showing unchecked output.' },
        { text: 'No: collect the whole reply, validate it, then return it', explanation: 'Validation needs the complete output, so streaming brings no benefit here.' },
      ],
      answer: 3,
    },
    {
      question: 'You want short summaries of 5,000 notes by tomorrow morning, and nobody is waiting for any single one. What fits best?',
      options: [
        { text: 'A batch job, which trades speed for throughput and often a lower price', explanation: 'With no one waiting, latency does not matter, and batch interfaces are built for this.' },
        { text: '5,000 streamed requests', explanation: 'Streaming helps a person watching a reply. Nobody is watching here.' },
        { text: 'The largest model available, one request at a time', explanation: 'That makes the job slower and more expensive for no benefit.' },
        { text: 'Fine-tuning a model on the notes first', explanation: 'Fine-tuning does not summarize anything, and it would take far longer.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A reply\'s time is the wait for the first token plus one step per output token, so stream answers people read, never stream output you must validate, and batch work nobody is waiting for.',
  resources: [
    { title: 'Using server-sent events', provider: 'MDN', description: 'How the event stream format works, from the browser\'s side.', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events' },
    { title: 'Custom responses', provider: 'FastAPI', description: 'StreamingResponse and other response types, with examples.', url: 'https://fastapi.tiangolo.com/advanced/custom-response/' },
    { title: 'Streaming', provider: 'Ollama', description: 'How Ollama streams replies, and how to handle the pieces.', url: 'https://docs.ollama.com/api/streaming' },
    { title: 'vLLM', provider: 'vLLM', description: 'An open-source engine for serving open-weight models to many users, with batching.', url: 'https://docs.vllm.ai/' },
  ],
  underTheHood: {
    heading: 'Why batching is almost free',
    paragraphs: [
      "To write each token, a model must read all of its weights from memory. Take a model with 7 billion parameters stored in 16 bits: about 14 GB of weights, read once per token. If the graphics card can read memory at 500 GB per second, the best it can manage is about 500 / 14, roughly 35 tokens per second, however fast its arithmetic is. Writing tokens is limited by memory speed, not by calculation.",
      "Prefill is different. The model reads the weights once and applies them to every input token together, which keeps the arithmetic busy. That is why a long prompt adds less time than an equally long answer.",
      "Batching applies the same trick to many users. One read of the weights can produce the next token for 30 users at once, with little extra time, because the arithmetic had capacity to spare. Each user's speed barely changes while total throughput rises many times over. Serving engines keep adding and removing requests from the batch as they start and finish, which is called continuous batching, and it is a large part of how hosted services serve many people affordably.",
    ],
  },
}

export default lesson
