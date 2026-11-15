import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { aiChat, appParse, configAi, extract, schemas, testExtract } from './study-tracker'

const extractFiles = { 'config.py': configAi, 'ai.py': aiChat, 'schemas.py': schemas, 'extract.py': extract }

const lesson: StructuredLesson = {
  assumes: 'What is an AI API?, with `ai.py` working against Ollama or a hosted model, and Build Your Own API for Pydantic models.',
  goals: [
    'Ask a model for a JSON reply with fixed keys and read it in Python',
    'Validate the model\'s JSON with a Pydantic model before your code uses it',
    'Handle replies that are wrong or not JSON at all, without crashing or saving bad data',
  ],
  bigIdea: "Structured output means asking a model to reply in a fixed, machine-readable shape, usually JSON, instead of free text. Your code can then use the answer directly, for example as a new study session. But the model's JSON is still a prediction, so you check it with the same validation rules you use for any other input before trusting it.",
  whyItMatters: "Study Tracker's form asks for a subject, minutes and a date. Typing a quick note is easier: \"did an hour and a half of biology yesterday\". A model can read that note, but a friendly reply such as \"Great job on biology!\" is useless to your database. You need `{\"subject\": \"biology\", \"minutes\": 90, \"studied_on\": \"2026-03-05\"}`, and you need to be sure that 90 really is a whole number between 1 and 600 before it goes anywhere near `study.db`.",
  goalSections: [
    {
      heading: 'Asking for JSON',
      paragraphs: [
        "Start with the prompt. Say \"Reply with only a JSON object\", list the exact keys, and describe each value's type and format, such as a date in YYYY-MM-DD form. Include any facts the model cannot know. To turn \"yesterday\" into a date, it needs today's date.",
        "Many services also offer a JSON mode. With `response_format={\"type\": \"json_object\"}` in the request, a compatible service only produces text that is valid JSON. Some providers go further and enforce an exact list of keys and types, usually called structured outputs. Neither one guarantees the values are correct.",
        "Use `temperature=0` for extraction, since there is one right answer and you want the same result every time. Then `json.loads` turns the reply text into a Python dictionary.",
      ],
      example: {
        language: 'python',
        code: code`
          import json

          reply = '{"subject": "biology", "minutes": 90, "studied_on": "2026-03-05"}'
          data = json.loads(reply)
          print(data["subject"], data["minutes"] + 15)
        `,
        output: 'biology 105',
      },
    },
    {
      heading: 'Validating with Pydantic',
      paragraphs: [
        "Study Tracker already has rules for a valid session: the `SessionIn` model from Build Your Own API. This lesson moves it into its own file, `schemas.py`, so the API and the new extraction code share exactly the same rules.",
        "`SessionIn.model_validate_json(reply)` parses the JSON and checks it in one step. A missing key, a word where a number should be, minutes outside 1 to 600 or an impossible date all raise a `ValidationError`, which says how many problems it found and where.",
        "Pydantic also converts values to the right Python types, so the date string becomes a real `date` object you can compare and do arithmetic with.",
      ],
      example: {
        language: 'python',
        code: code`
          from datetime import date

          from pydantic import BaseModel, Field, ValidationError


          class SessionIn(BaseModel):
              subject: str = Field(min_length=1, max_length=50)
              minutes: int = Field(gt=0, le=600)
              studied_on: date


          good = SessionIn.model_validate_json('{"subject": "biology", "minutes": 90, "studied_on": "2026-03-05"}')
          print(good.studied_on.year, good.minutes)

          try:
              SessionIn.model_validate_json('{"subject": "biology", "minutes": "ninety", "studied_on": "2026-03-05"}')
          except ValidationError as error:
              print(error.error_count(), "problem:", error.errors()[0]["loc"])
        `,
        output: "2026 90\n1 problem: ('minutes',)",
      },
    },
    {
      heading: 'When the reply is wrong',
      paragraphs: [
        "Model replies go wrong in a few ways. The reply might be chatty text instead of JSON, miss a key, use the wrong type or put a value out of range. Validation catches all of those, and your code turns them into one clear `AIError` instead of a crash.",
        "The hardest case is a value that is valid but wrong: 60 minutes for \"an hour and a half\". No rule can catch it, because 60 is a perfectly good number of minutes. Only a person who knows what they meant can.",
        "So Study Tracker never saves what the model extracted directly. The new endpoint, `POST /sessions/parse`, returns a draft. The learner checks it, fixes anything wrong and saves it through the normal `POST /sessions`. A model's output should not trigger an action on its own.",
      ],
      example: {
        language: 'text',
        code: code`
          Model reply                                        Caught by
          Sure! You studied biology for 90 minutes.          not JSON: validation
          {"subject": "biology", "minutes": 90}              missing studied_on: validation
          {"subject": "biology", "minutes": 900, ...}        out of range: validation
          {"subject": "biology", "minutes": 60, ...}         valid but wrong: the learner, reviewing the draft
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Study Tracker\'s extract.py',
    intro: "This new file turns a note into a validated `SessionIn`. It needs the updated `ai.py` and the new `schemas.py` and `app.py` from Try it yourself. The responses at the end came from the running app with a model connected, and show a typical result.",
    example: { language: 'python', filename: 'extract.py', code: extract, runnable: false, files: extractFiles },
    steps: [
      { code: 'Reply with only a JSON object with exactly these keys:', explanation: "The prompt names every key and describes each value, including the date format. The model copies this shape." },
      { code: 'Today\'s date is {today}.', explanation: "The model has no clock. Without this line, \"yesterday\" could become any date at all." },
      { code: 'reply = ask_model(prompt, response_format={"type": "json_object"}, temperature=0)', explanation: "The updated `ask_model()` passes extra options straight into the request. JSON mode keeps the reply to valid JSON, and temperature 0 keeps it consistent." },
      { code: 'return SessionIn.model_validate_json(reply)', explanation: "Parsing and validation in one line, using the same rules as the API. If this line returns, the session has a subject, sensible minutes and a real date." },
      { code: 'raise AIError(...) from error', explanation: "Any validation failure becomes the same `AIError` the API already handles. `from error` keeps the original details for debugging." },
      { code: 'POST /sessions/parse {"text": "I studied algebra for 40 minutes"}\n200 {"subject":"algebra","minutes":40,"studied_on":"2026-11-14"}', explanation: "A typical success: a draft with today's date filled in. Nothing has been saved yet. `GET /sessions` still returns an empty list." },
      { code: 'POST /sessions/parse {"text": "algebra all day"}\n422 {"detail":"Could not read a session from that note"}', explanation: "Here the model guessed 900 minutes, which fails validation. The learner gets a clear message, the log records a warning, and the database is untouched." },
    ],
  },
  tryIt: {
    instructions: [
      'Replace `ai.py` with the version below. It splits the request into `chat()`, which later lessons need, and lets `ask_model()` pass options such as `response_format`.',
      'Add `schemas.py` and `extract.py`, and replace `app.py` with the version below, which imports the models from `schemas.py` and adds `POST /sessions/parse`.',
      'Run the app and try three notes in `/docs`, including one with "yesterday". Check each draft, then save one through `POST /sessions`.',
      'Add `test_extract.py` and run `python -m pytest`. These tests replace the model with a fake reply, so they run without a model. Then add a fourth test for a reply that is missing `studied_on`.',
    ],
    files: [
      { language: 'python', filename: 'ai.py', code: aiChat, runnable: false },
      { language: 'python', filename: 'schemas.py', code: schemas, runnable: false },
      { language: 'python', filename: 'app.py', code: appParse, runnable: false },
      { language: 'python', filename: 'test_extract.py', code: testExtract, files: extractFiles, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Trusting the JSON because it parsed.', fix: 'Valid JSON can still hold 900 minutes or a missing date. Validate every reply with your Pydantic model.' },
    { mistake: 'Saving what the model extracted without anyone checking.', fix: 'Return a draft and let the learner confirm it, because a valid but wrong value passes every rule.' },
    { mistake: 'Leaving facts the model cannot know out of the prompt.', fix: 'Put today\'s date, and anything else the answer depends on, into the prompt.' },
    { mistake: 'Testing extraction code only against a live model.', fix: 'Replace `ask_model` with a fake reply in tests, so they are fast, free and give the same result every time.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: {
        language: 'python',
        code: code`
          from pydantic import BaseModel, Field


          class SessionIn(BaseModel):
              subject: str
              minutes: int = Field(gt=0, le=600)


          session = SessionIn.model_validate_json('{"subject": "python", "minutes": "45"}')
          print(session.minutes + 15)
        `,
      },
      options: [
        { text: '4515', explanation: 'That would be joining two strings. Pydantic has already turned "45" into the number 45.' },
        { text: '60', explanation: 'Pydantic converts the string "45" into the whole number 45, which passes the range check, so 45 + 15 is 60.' },
        { text: 'A ValidationError, because "45" is a string', explanation: 'By default Pydantic converts a string that holds a whole number. It would reject "forty-five".' },
        { text: 'A TypeError from adding a string and a number', explanation: 'After validation, `minutes` is an int, so the addition works.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'For "an hour and a half of biology yesterday", the model returns `{"subject": "biology", "minutes": 60, "studied_on": "2026-03-05"}`. Validation passes. What catches the mistake?',
      options: [
        { text: 'Pydantic, because 60 is the wrong number', explanation: '60 is a valid number of minutes. Pydantic checks rules, not meaning.' },
        { text: 'JSON mode', explanation: 'JSON mode only guarantees valid JSON syntax.' },
        { text: 'The learner, reviewing the draft before saving it', explanation: 'Only the person who wrote the note knows it meant 90. That is why the endpoint returns a draft.' },
        { text: 'Setting temperature to 0', explanation: 'That makes the same mistake happen consistently. It does not fix it.' },
      ],
      answer: 2,
    },
    {
      question: 'Why does Study Tracker\'s extraction prompt include today\'s date?',
      options: [
        { text: 'Pydantic needs it to validate the date', explanation: 'Pydantic only checks that the value is a valid date. It never reads the prompt.' },
        { text: 'JSON mode only works when the prompt contains a date', explanation: 'JSON mode works with any prompt.' },
        { text: 'So the log shows when the request was made', explanation: 'Logging adds its own timestamps.' },
        { text: 'The model has no clock, so it needs the date to turn "yesterday" into a real date', explanation: 'Relative words only become real dates if the model knows the starting point.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Ask for JSON with exact keys, validate every reply with the same Pydantic model your API uses, and return a draft for a person to confirm, because a valid value can still be the wrong one.',
  resources: [
    { title: 'JSON', provider: 'Pydantic', description: 'Parsing and validating JSON with model_validate_json, including how values are converted.', url: 'https://docs.pydantic.dev/latest/concepts/json/' },
    { title: 'Structured outputs', provider: 'Ollama', description: 'How Ollama constrains replies to a JSON schema, with Python examples.', url: 'https://ollama.com/blog/structured-outputs' },
    { title: 'Getting started with JSON Schema', provider: 'JSON Schema', description: 'The standard format many providers use to describe the exact shape of a reply.', url: 'https://json-schema.org/learn/getting-started-step-by-step' },
  ],
  underTheHood: {
    heading: 'How JSON mode is enforced',
    paragraphs: [
      "JSON mode does not ask the model nicely. It changes how tokens are picked. At every step, the service checks which tokens could legally come next in valid JSON and blocks all the others before the pick happens. After `{\"minutes\": `, for example, a schema that says minutes is an integer only allows digits, so a word like ninety cannot appear. This is called constrained decoding.",
      "Among the allowed tokens, the model still picks the most likely ones. That is why the syntax is guaranteed and the meaning is not: 60 and 90 are both allowed digits, and if 60 is more likely, 60 is what you get.",
      "There is a subtle trap here. If a note truly does not say how long you studied, forcing a number out of the model makes it invent one, because \"I can't tell\" is not allowed. When a value might be unknown, let your schema allow it, for example by permitting `null`, and have your code ask the learner instead.",
    ],
  },
}

export default lesson
