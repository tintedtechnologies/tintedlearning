import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { app, config, db } from './study-tracker'

const lesson: StructuredLesson = {
  goals: [
    'Use Python\'s `logging` module instead of `print`',
    'Choose the right level for each message: DEBUG, INFO, WARNING or ERROR',
    'Write log messages that help you find a problem later',
  ],
  bigIdea: "A log is a running record of what your app did, written as it works. Python's built-in `logging` module labels every message with a level and a source, and lets you choose how much detail to show without touching the code. When something goes wrong at 2 a.m., the log is often the only witness.",
  whyItMatters: "A user says a session they saved last Tuesday never appeared in their totals. You cannot see their screen, and you cannot ask the server what happened, because it does not remember. If Study Tracker logged every saved and rejected session, you could search for Tuesday and see exactly what arrived and why it was turned away.",
  goalSections: [
    {
      heading: 'From print to logging',
      paragraphs: [
        "`print` writes plain text with no context, and you cannot turn it down without deleting lines. `logging` adds a level and the logger's name to every message, can add a timestamp, and lets one setting decide which messages appear.",
        "Set it up once, when the app starts, with `logging.basicConfig`: the lowest level to show and the layout of each line, called the format. Then get a named logger with `logging.getLogger(\"study_tracker\")` and call methods named after the levels, such as `logger.info(...)`.",
        "Messages below the chosen level are skipped. In this example the DEBUG line never appears, because the level is INFO.",
      ],
      example: {
        language: 'python',
        captureStderr: true,
        code: code`
          import logging

          logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
          logger = logging.getLogger("study_tracker")

          logger.info("Study Tracker started")
          logger.debug("This line is hidden at INFO level")
          logger.warning("Disk space is low")
        `,
        output: 'INFO study_tracker: Study Tracker started\nWARNING study_tracker: Disk space is low',
      },
    },
    {
      heading: 'Choosing a level',
      paragraphs: [
        "DEBUG is detail for developers while hunting a bug, such as the exact values going into a query. INFO records normal, expected events, such as \"saved session 4\". WARNING means something unexpected happened but the app coped, such as a rejected request. ERROR means something failed and needs attention, such as the database being unreachable.",
        "The level in `basicConfig` acts as a filter. On your computer you might use DEBUG to see everything. On a live server, INFO or WARNING keeps the log readable and cheaper to store. Study Tracker reads this from `LOG_LEVEL` in `config.py`, so you can change it without touching code.",
      ],
      example: {
        language: 'python',
        captureStderr: true,
        code: code`
          import logging

          logging.basicConfig(level=logging.WARNING, format="%(levelname)s: %(message)s")
          logger = logging.getLogger("study_tracker")

          logger.debug("Loaded 3 sessions from study.db")
          logger.info("Saved session 4")
          logger.warning("Rejected session with 900 minutes")
          logger.error("Could not open study.db")
        `,
        output: 'WARNING: Rejected session with 900 minutes\nERROR: Could not open study.db',
      },
    },
    {
      heading: 'Messages that help later',
      paragraphs: [
        "A good log line answers: what happened, to which thing, with which values? \"it worked\" answers none of those. \"Saved session 7: algebra, 40 minutes\" answers all three, and you can search for it.",
        "Pass values as extra arguments with `%s` placeholders, as in `logger.info(\"Saved session %s\", session_id)`. The logging module fills them in only if the message is actually shown, and the message stays easy to search.",
        "When you catch an error, include the error itself. Inside an `except` block, `logger.exception(...)` logs at ERROR level and adds the full traceback.",
      ],
      example: {
        language: 'python',
        captureStderr: true,
        code: code`
          import logging

          logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
          logger = logging.getLogger("study_tracker")

          session_id, minutes_text = 7, "forty"
          logger.info("it worked")
          try:
              int(minutes_text)
          except ValueError as error:
              logger.error("Could not read minutes for session %s: %s", session_id, error)
        `,
        output: "INFO: it worked\nERROR: Could not read minutes for session 7: invalid literal for int() with base 10: 'forty'",
      },
    },
  ],
  seeItInAction: {
    title: 'Study Tracker with logging',
    intro: "Here is `app.py` with logging added. It also gains one new rule: a session dated in the future is rejected. Saved sessions are logged at INFO and rejected ones at WARNING. Below the code, each step shows the real log lines it produces.",
    example: { language: 'python', filename: 'app.py', code: app, files: { 'config.py': config, 'db.py': db } },
    steps: [
      { code: 'logging.basicConfig(\n    level=config.LOG_LEVEL,\n    format="%(asctime)s %(levelname)s %(name)s: %(message)s",\n)', explanation: "Sets up logging once, when the app starts. The level comes from `LOG_LEVEL`, so `.env` or the environment decides how chatty the app is. `%(asctime)s` adds the date and time to every line." },
      { code: 'logger = logging.getLogger("study_tracker")', explanation: "A named logger. The name appears in every line, so Study Tracker's messages are easy to tell apart from Uvicorn's own." },
      { code: 'if new.studied_on > date.today():', explanation: "The new rule. `date.today()` is the current date on the server, so tomorrow's date is rejected." },
      { code: 'logger.warning("Rejected session dated in the future: %s", new.studied_on)\nraise HTTPException(status_code=400, ...)', explanation: "Logged at WARNING, because the app handled it correctly but someone may be confused. Then the client gets 400 Bad Request with a clear reason in the body." },
      { code: '2026-03-02 18:31:07,379 INFO study_tracker: Saved session 1: algebra, 40 minutes', explanation: "What a successful save looks like in the terminal running Uvicorn. Uvicorn also logs its own line for each request, with the path and status code." },
      { code: '2026-03-02 18:31:07,393 WARNING study_tracker: Rejected session dated in the future: 2030-01-01', explanation: "What a rejection looks like. Searching the log for `WARNING` now finds every turned-away session, with the date that caused it." },
    ],
  },
  tryIt: {
    instructions: [
      'Replace your `app.py` with the version above, start the server and save one valid session and one dated next year. Find both lines in the terminal.',
      'A teammate reports that totals sometimes list the same subject twice. Add `logger.debug("Saving subject %r", new.subject)` before the save. `%r` shows the exact value, including quotes and spaces.',
      'Set `LOG_LEVEL=DEBUG` in `.env`, restart, and save `Algebra` and then `algebra ` (with a trailing space). Read the debug lines to see why the totals split.',
      'Fix it by saving `new.subject.strip().lower()`, add a test for it, and set `LOG_LEVEL` back to `INFO`.',
    ],
  },
  mistakes: [
    { mistake: 'Logging secrets or personal data, such as API keys, passwords or a user\'s notes.', fix: 'Log IDs and counts instead of content. Logs are copied to many places and kept for a long time.' },
    { mistake: 'Logging everything at ERROR.', fix: 'Keep ERROR for real failures that need attention, so an alert on errors means something.' },
    { mistake: 'Writing messages like "it broke" or "here".', fix: 'Say what happened, to which item, with which values: "Rejected session dated in the future: 2030-01-01".' },
    { mistake: 'Leaving DEBUG on in production.', fix: 'Set `LOG_LEVEL=INFO` on the server. DEBUG logs are huge and more likely to include sensitive values.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: { language: 'python', captureStderr: true, code: code`
        import logging

        logging.basicConfig(level=logging.WARNING, format="%(levelname)s: %(message)s")
        log = logging.getLogger("study_tracker")
        log.info("Saved session 3")
        log.error("Database is locked")
        log.debug("Query took 4 ms")
      ` },
      options: [
        { text: 'All three messages', explanation: 'The level is WARNING, so INFO and DEBUG messages are filtered out.' },
        { text: 'INFO: Saved session 3', explanation: 'INFO is below WARNING, so this line is hidden.' },
        { text: 'Nothing, because no warning was logged', explanation: 'The level is the minimum shown. ERROR is above WARNING, so it appears.' },
        { text: 'ERROR: Database is locked', explanation: 'Only messages at WARNING or above are shown, and ERROR is above WARNING.' },
      ],
      answer: 3,
      answerIsOutput: true,
    },
    {
      question: 'A user sends a session with 900 minutes, which the app rejects as too long. Which level fits best?',
      options: [
        { text: 'ERROR, because the request failed', explanation: 'The app worked correctly by rejecting bad input. ERROR is for failures in the app itself.' },
        { text: 'WARNING, because the app handled it but it is worth noticing', explanation: 'Unexpected input that was handled correctly is exactly what WARNING is for.' },
        { text: 'DEBUG, because only developers care', explanation: 'DEBUG is usually off on a server, so this useful event would never be recorded.' },
        { text: 'Do not log it at all', explanation: 'Rejections are how you notice confused users or buggy clients. Recording them is useful.' },
      ],
      answer: 1,
    },
    {
      question: 'Which log line is most useful and safe?',
      options: [
        { text: '`Saved session 12: python, 45 minutes`', explanation: 'It says what happened, to which session, with the key values, and contains nothing secret.' },
        { text: '`done`', explanation: 'It does not say what was done or to what, so it cannot help you find a problem.' },
        { text: '`Saved session for key your-key-here`', explanation: 'Never log keys or passwords, even in part. Logs spread to many places.' },
        { text: '`ERROR: Saved session 12`', explanation: 'A successful save is not an error. Wrong levels make real errors harder to find.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Configure logging once, give every message the right level and the values needed to understand it later, and never log secrets or personal data.',
  resources: [
    { title: 'Logging HOWTO', provider: 'Python.org', description: 'The official tutorial, from basic setup to multiple loggers and handlers.', url: 'https://docs.python.org/3/howto/logging.html' },
    { title: 'Logging Cheat Sheet', provider: 'OWASP', description: 'What to log, and what never to log, from a security point of view.', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html' },
  ],
  underTheHood: {
    heading: 'Loggers, handlers and the hierarchy',
    paragraphs: [
      "Logging has three parts. A logger is what your code calls. A handler decides where messages go: the terminal, a file, or a service that collects logs. A formatter decides how each line looks. `basicConfig` is a shortcut that attaches one handler, writing to the terminal's error stream, with your format, to the root logger.",
      "Loggers form a tree by name. `study_tracker.db` is a child of `study_tracker`, which is a child of the root logger. A message travels up the tree to every handler above it, which is why one `basicConfig` call covers every logger in your app.",
      "This lets you tune parts separately. Setting `logging.getLogger(\"study_tracker.db\").setLevel(logging.DEBUG)` shows detailed database messages while everything else stays at INFO. Libraries such as Uvicorn use their own named loggers, which is why their lines look different from yours.",
    ],
  },
}

export default lesson
