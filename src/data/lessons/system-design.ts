import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'the AI Engineering building lessons, with a working Study Tracker, and some experience shipping a project. This is the first of eight architecture lessons that grow Study Tracker from one laptop to a whole university.',
  goals: [
    'Turn a vague goal into functional requirements and measurable quality requirements',
    'Split a system into components with clear responsibilities and boundaries',
    'Test a design with quick estimates of load, concurrency and storage',
  ],
  bigIdea: "System design means deciding what parts a system needs, what each part is responsible for and how the parts talk to each other, before writing much code. It starts from requirements: what the system must do, and how well it must do it, in numbers. Good boundaries let each part change, grow and fail without dragging the others down.",
  whyItMatters: "A university asks to roll out Study Tracker to 20,000 students next term. Today it is one Python process and one SQLite file, with no accounts. Deploying it as it is would fail on day one: no logins, one shared database for everyone, the notes index rebuilt in a single process, and AI calls tying up web requests. A few days of design now decide whether the next six months are spent building or firefighting.",
  goalSections: [
    {
      heading: 'Requirements you can test',
      paragraphs: [
        "Functional requirements say what the system does: students sign in, log sessions, ask questions about their own notes and get a weekly plan, and teachers see class totals without seeing individual notes.",
        "Quality requirements, often called non-functional requirements, say how well it must do those things, and they must be numbers you can check. \"Fast\" becomes \"95% of page loads finish within 500 ms\". \"Reliable\" becomes \"available 99.5% of the time during term\". Add scale, privacy rules, where data may be stored and a monthly budget.",
        "Write down constraints and assumptions too: a team of two, the existing Python code, sign-in through the university's existing accounts. Assumptions are where designs go wrong, so naming them lets someone challenge them early.",
      ],
      example: {
        language: 'text',
        code: code`
          Functional:  sign in with university accounts; log and view sessions;
                       ask questions about own notes; weekly plan with approval;
                       teachers see class totals only
          Quality:     20,000 students, up to 2,000 active at once in exam weeks
                       p95 page load under 500 ms; first AI words within 2 s
                       99.5% availability during term
                       each student's notes visible only to that student
          Constraints: team of 2, Python, data stored in the university's region
          Assumption:  30% of students active on a typical day   <- check this
        `,
      },
    },
    {
      heading: 'Components and boundaries',
      paragraphs: [
        "Find components by asking which jobs differ in what they store, how they grow and how they fail. For Study Tracker: a web API that handles requests and keeps nothing between them, a database for accounts and sessions, file storage for notes, a background worker that indexes notes so web requests never wait for it, and an AI gateway, today's `ai.py` grown up, which owns provider keys, limits and cost tracking.",
        "A boundary means a component owns its data, and everyone else goes through its interface. The worker never edits the sessions table directly. The API never calls a model provider except through the gateway. Clear ownership makes each part easier to change and to reason about.",
        "Then trace the important flows through the components, such as asking a question or uploading a note, to check nothing is missing. Start with as few deployable pieces as the requirements allow. Boundaries can live inside one codebase, as modules, long before they need to be separate services. The lesson Architecture Patterns returns to this.",
      ],
      example: {
        language: 'text',
        code: code`
          Browser / phone
              |
          Web API (stateless) ---- sign-in ---> university accounts
              |        |       \
              |        |        AI gateway ---> model provider
              |        |              ^
          Database   Note storage     |
          (sessions,  (files)    Index worker (background)
           accounts,      \________/
           note vectors)
        `,
      },
    },
    {
      heading: 'Estimates that test the design',
      paragraphs: [
        "Before choosing technology, do rough arithmetic. These are called back-of-the-envelope estimates. They will be off, but usually by less than ten times, and that is enough to show which parts are easy and which are hard.",
        "For Study Tracker, the web traffic turns out to be modest: under two questions a second at the busiest hour. The hard part is the AI. Each answer takes several seconds, so about 13 answers are in progress at once, and 48 million tokens a day makes cost a first-class requirement.",
        "Storage holds a surprise too. Four million note paragraphs sounds like it needs an indexed vector database. But every search is filtered to one student's own notes, around 200 paragraphs, so the exact search from Vector Databases is still fast. The privacy requirement makes search cheap.",
      ],
      example: {
        language: 'python',
        code: code`
          students = 20_000
          active = students * 0.30
          questions_per_day = active * 5
          peak_per_second = questions_per_day * 0.20 / 3600
          answer_seconds = 8

          print("questions per day:", int(questions_per_day))
          print("peak questions per second:", round(peak_per_second, 2))
          print("answers in progress at peak:", round(peak_per_second * answer_seconds))
          print("tokens per day:", int(questions_per_day * 1600))
        `,
        output: 'questions per day: 30000\npeak questions per second: 1.67\nanswers in progress at peak: 13\ntokens per day: 48000000',
      },
    },
  ],
  seeItInAction: {
    title: 'Designing Study Tracker for a university',
    intro: "Here is the design process from this lesson, applied in order to the university request. Each step feeds the next, and the risks at the end are what the following architecture lessons address.",
    example: {
      language: 'text',
      code: code`
        1. Requirements    functional list, quality numbers, constraints, assumptions
        2. Estimates       1.7 questions/s at peak, 13 answers in progress, 48M tokens/day,
                           4M note paragraphs but only ~200 per search
        3. Components      web API, database, note storage, index worker, AI gateway,
                           university sign-in
        4. Flow check      "ask a question": API checks sign-in -> gateway embeds question
                           -> database search filtered by student -> gateway streams answer
        5. Top risks       AI cost and provider limits at exam time   -> Cost Optimization
                           model provider outage during exams         -> Reliability
                           index worker falls behind after uploads    -> Distributed Systems
                           traffic grows past one server              -> Scalability
      `,
    },
    steps: [
      { code: '1. Requirements', explanation: "Every later choice is judged against these. If a design meets them, it is good enough, even if a fancier one exists." },
      { code: '2. Estimates', explanation: "Ten minutes of arithmetic showed that web traffic is easy and AI is the challenge. That changes where the design effort goes." },
      { code: '3. Components', explanation: "Each component has one job and owns its data. The AI gateway becomes the single place that knows about providers, keys, limits and spending." },
      { code: '4. Flow check', explanation: "Walking one request through every component catches gaps, such as remembering that the search must be filtered by student before anything reaches the model." },
      { code: 'web API ... database search filtered by student', explanation: "The privacy rule appears inside the flow, enforced in code, exactly as Vector Databases recommended. Designs should show where each rule is enforced." },
      { code: '5. Top risks', explanation: "A design is not finished until its biggest risks are named. Each one becomes a topic for the next lessons, and later a recorded decision in an architecture decision record." },
    ],
  },
  tryIt: {
    instructions: [
      'Pick a variation: Study Tracker for a 2,000-student high school, or a small company\'s training team. Write its functional requirements, five quality requirements with numbers, its constraints and two assumptions.',
      'Copy the estimate code above into a file and change the numbers for your variation. Write down which requirement looks hardest to meet.',
      'Sketch the components and boundaries, on paper or as a text diagram, and trace two flows through them.',
      'List your top three risks, and for each, the component it affects.',
    ],
    evidencePrompt: {
      label: 'Your design summary',
      placeholder: 'For example: 2,000 students, peak 0.2 questions/s, 2 answers in progress. Hardest: keeping notes private per class. Risks: ...',
    },
  },
  mistakes: [
    { mistake: 'Starting with technologies instead of requirements.', fix: 'Write the requirements and estimates first. Then choose the simplest technology that meets them.' },
    { mistake: 'Quality requirements without numbers.', fix: 'Turn "fast", "reliable" and "scalable" into numbers you can measure, such as p95 times and availability percentages.' },
    { mistake: 'Splitting the system into many services before it needs them.', fix: 'Draw boundaries as modules in one codebase first, and split only when a part must grow or fail separately.' },
    { mistake: 'Leaving data ownership unclear.', fix: 'Give each piece of data one owning component, and make everyone else use that component\'s interface.' },
  ],
  quiz: [
    {
      question: 'Which of these is a measurable quality requirement?',
      options: [
        { text: 'The app should be fast', explanation: 'There is no way to tell whether "fast" has been met. It needs a number.' },
        { text: 'The app should be scalable', explanation: 'Scalable to what? A requirement needs a load and a target.' },
        { text: '95% of page loads finish within 500 ms during exam weeks', explanation: 'It names a measure, a threshold and the conditions, so it can be tested.' },
        { text: 'The app should use PostgreSQL', explanation: 'That is a design decision or constraint, not a statement of how well the system must work.' },
      ],
      answer: 2,
    },
    {
      question: 'Questions arrive at 2 per second, and each answer takes 6 seconds. About how many answers are in progress at once?',
      options: [
        { text: '12', explanation: 'Arrival rate times time in the system: 2 x 6 = 12. Under the hood explains why.' },
        { text: '3', explanation: 'That divides the time by the rate. Longer answers mean more in progress, not fewer.' },
        { text: '8', explanation: 'That adds the numbers, which has no meaning here.' },
        { text: '2', explanation: 'That would only be true if each answer took one second.' },
      ],
      answer: 0,
    },
    {
      question: 'Study Tracker will hold 4 million note paragraphs. Why can it still use simple exact search?',
      options: [
        { text: 'Computers are fast enough to compare 4 million vectors instantly', explanation: 'In Python, that would take many seconds per question.' },
        { text: 'Embeddings get smaller as more are stored', explanation: 'Each vector stays the same size, whatever the total.' },
        { text: 'Students rarely ask questions', explanation: 'The estimate assumes 30,000 questions a day, which is not rare.' },
        { text: 'Each search is filtered to one student\'s own notes, about 200 paragraphs', explanation: 'The privacy filter means each search only compares a few hundred vectors.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Design from measurable requirements, give each component one job and its own data, and test the design with quick estimates that show where the real difficulty lies.',
  resources: [
    { title: 'System Design Primer', provider: 'GitHub', description: 'A large, free collection of system design concepts and worked examples.', url: 'https://github.com/donnemartin/system-design-primer' },
    { title: 'Azure Well-Architected Framework', provider: 'Microsoft Learn', description: 'A vendor guide to reliability, security, cost, operations and performance, useful on any cloud.', url: 'https://learn.microsoft.com/en-us/azure/well-architected/' },
    { title: 'Little\'s law', provider: 'Wikipedia', description: 'The formula behind the concurrency estimate in this lesson.', url: 'https://en.wikipedia.org/wiki/Little%27s_law' },
  ],
  underTheHood: {
    heading: 'Little\'s law',
    paragraphs: [
      "The estimate of 13 answers in progress came from a simple, general rule called Little's law. In any stable system, the average number of items inside equals the rate at which they arrive multiplied by the average time each one spends there. Questions arriving at 1.67 per second, each taking 8 seconds, means about 13 in progress at any moment.",
      "It works for almost anything: requests in a web server, model calls through a gateway, people in a coffee shop queue. It needs no assumptions about how the arrivals are spread out, only that the system is not steadily falling behind.",
      "It is useful in design because concurrency is what limits you. A model provider allows only so many requests at once on your account. A database allows only so many connections. If Little's law says you need 13 at once and your limit is 10, you know before launch that answers will queue at exam time, and you can plan capacity, add caching or shorten answers to bring the time per request down.",
    ],
  },
}

export default lesson
