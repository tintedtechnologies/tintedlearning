import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'System Design and Distributed Systems, and the AI features built into Study Tracker earlier in this section.',
  goals: [
    'Compare a modular monolith with separate services, and choose one for a given team and stage',
    'Decide when parts should talk through direct requests and when through events',
    'Recognize the patterns already inside Study Tracker and the problems each one fits',
  ],
  bigIdea: "Architecture patterns are proven shapes for organizing a system, each with known strengths and costs. The biggest choice is whether to ship one application with clear internal modules or several separately deployed services. Within either, parts can talk through direct requests, where the caller waits for an answer, or through events, where one part announces what happened and others react.",
  whyItMatters: "A teammate reads that large companies use microservices and proposes splitting Study Tracker into eight services for the university launch. With two developers, that means eight deployments, eight sets of logs, network calls where function calls used to be and every problem from Distributed Systems, in exchange for benefits that mostly matter to large organizations. Knowing what each pattern costs, and what it is for, can save months.",
  goalSections: [
    {
      heading: 'Modular monolith or services',
      paragraphs: [
        "A monolith is one application, deployed as a single unit. A modular monolith is one with firm internal boundaries: each module owns its data and is used only through its functions. Study Tracker already looks like this, with `ai.py`, `notes.py`, `planner.py` and the rest. It is simple to deploy, test and change, and one database transaction can cover several modules.",
        "Microservices split the system into separately deployed services, each with its own database, talking over the network. They let separate teams release on their own schedules, and let each service scale and fail on its own. The price is everything in Distributed Systems: partial failures, data spread across services, more to deploy and monitor, and harder debugging.",
        "Services work best when they follow team boundaries, so each team owns a few. Extract a module into its own service only when it has a clearly different need, such as scaling separately, running in the background or being shared by several applications.",
      ],
      example: {
        language: 'text',
        code: code`
                                 Modular monolith           Microservices
          Deploy                 one unit                   each service separately
          Calls between parts    function calls             network requests
          Transactions           one database, easy         across services, hard
          Scaling                the whole app together     each service on its own
          Failure                one part can crash all     contained, if designed well
          Fits                   small teams, early stages  several teams, clear domains
        `,
      },
    },
    {
      heading: 'Requests or events',
      paragraphs: [
        "With a direct request, the caller asks and waits, as when the API checks a login or reads totals. Use it when the caller needs the answer before it can continue.",
        "With an event, a part announces a fact in the past tense, such as `SessionLogged` or `NoteUploaded`, and moves on. Any number of other parts can subscribe and react in their own time. The publisher does not know who is listening, so adding a feature such as study streaks means adding a subscriber, without touching the code that logs sessions. Events also absorb bursts, as queues did in Scalability.",
        "The costs: subscribers act later, so their data is eventually consistent, and a chain of reactions is harder to follow, which is why request IDs from AI Observability and Operations should travel with each event. Across machines, events go through a message broker, and every subscriber must handle duplicates and late arrivals, as in Distributed Systems.",
      ],
      example: {
        language: 'python',
        code: code`
          subscribers = {}


          def subscribe(event_type, handler):
              subscribers.setdefault(event_type, []).append(handler)


          def publish(event_type, data):
              for handler in subscribers.get(event_type, []):
                  handler(data)


          subscribe("SessionLogged", lambda event: print("totals cache cleared for", event["student"]))
          subscribe("SessionLogged", lambda event: print("streak updated for", event["student"]))
          publish("SessionLogged", {"student": "s123", "minutes": 40})
        `,
        output: 'totals cache cleared for s123\nstreak updated for s123',
      },
    },
    {
      heading: 'Patterns inside Study Tracker',
      paragraphs: [
        "You have already built several named patterns. `ai.py` is a gateway: one component in front of an outside service that handles keys, retries, logging and switching providers. It fits whenever several features depend on the same external service.",
        "The notes assistant is a pipeline, a fixed sequence of steps: embed, search, build the prompt, answer. The planner is an agent with approval, a loop whose next step depends on what it found, followed by a person's decision. Indexing is a queue with workers, and cached totals are cache-aside, where code checks the cache first and fills it on a miss.",
        "Each pattern solves one kind of problem and adds parts to build and run. Choose one because a requirement or risk calls for it, never because it is popular. Plenty of features need none at all.",
      ],
      example: {
        language: 'text',
        code: code`
          Pattern              In Study Tracker          Fits when
          Gateway              ai.py                     several features use one outside service
          Pipeline (workflow)  rag.py                    the steps are known in advance
          Agent with approval  planner.py                the next step depends on results,
                                                         and actions have consequences
          Queue + workers      note indexing             slow work should not block requests
          Cache-aside          totals cache              the same reads repeat often
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Should Study Tracker split into services?',
    intro: "Here is how the team decides on the architecture for the university launch, starting from the requirements in System Design rather than from a favorite pattern.",
    example: {
      language: 'text',
      code: code`
        Team: 2 developers. Launch: 3 months. Requirements: System Design lesson.

        Module        Different need?                        Decision
        web API       none                                   stays in the monolith
        notes, rag    none                                   stays in the monolith
        planner       none                                   stays in the monolith
        indexing      slow, bursty, runs in the background   separate worker process,
                                                             same codebase and database
        ai gateway    might serve a second app one day       stays a module, for now

        Events: NoteUploaded (outbox -> queue -> index worker)
        Revisit when: a second app needs the AI gateway, or the team grows past one group
      `,
    },
    steps: [
      { code: 'Team: 2 developers. Launch: 3 months.', explanation: "Team size and deadline are architecture inputs. A design two people cannot operate is a bad design for them, however elegant." },
      { code: 'Different need?', explanation: "The question for each module is whether it must deploy, scale or fail separately. If not, a module boundary inside one application gives most of the benefit at a fraction of the cost." },
      { code: 'separate worker process, same codebase and database', explanation: "Indexing runs separately because its load is bursty and slow, but it shares the code and the database. That avoids most distributed data problems." },
      { code: 'stays a module, for now', explanation: "Clean module boundaries make a later extraction straightforward, so deferring the decision costs little." },
      { code: 'Events: NoteUploaded', explanation: "One event where a burst and a slow reaction make sense. Everything else stays as simple function calls." },
      { code: 'Revisit when:', explanation: "Each decision names what would change it. That is the core of an architecture decision record, the subject of the last lesson in this section." },
    ],
  },
  tryIt: {
    instructions: [
      'Draw your Study Tracker\'s modules and the calls between them. For each module, write whether it has a need that would justify a separate service.',
      'Pick one action, such as logging a session, and list three reactions other parts might want. Decide which should be events and which direct calls, with a reason.',
      'Extend the event example above with a third subscriber, then publish an event type nobody subscribes to and predict what happens.',
    ],
    evidencePrompt: {
      label: 'Your architecture',
      placeholder: 'For example: Only indexing needs a separate process. SessionLogged events: clear the totals cache, update streaks, refresh the teacher dashboard. Publishing an unknown event prints nothing because...',
    },
  },
  mistakes: [
    { mistake: 'Starting with microservices because large companies use them.', fix: 'Start with a modular monolith and extract a service only for a clear, specific need.' },
    { mistake: 'A monolith with no internal boundaries.', fix: 'Give each module its own data and interface, so it can be changed or extracted later.' },
    { mistake: 'Using events where the caller needs an answer now.', fix: 'Use a direct request when the next step depends on the result, and events for reactions that can happen later.' },
    { mistake: 'Adopting a pattern for its own sake.', fix: 'Name the requirement or risk each pattern addresses. If you cannot, leave it out.' },
  ],
  quiz: [
    {
      question: 'Two developers must launch one product in three months. Which architecture fits best?',
      options: [
        { text: 'Eight microservices, one per feature', explanation: 'Two people would spend their time running services instead of building the product.' },
        { text: 'One application with no internal structure, for speed', explanation: 'Without boundaries, every change gets harder and nothing can be extracted later.' },
        { text: 'A modular monolith, with a separate worker process for slow background jobs', explanation: 'Simple to run, with clear boundaries and separation only where a real need exists.' },
        { text: 'A separate service per database table', explanation: 'That splits along storage, not responsibilities, and multiplies the network calls.' },
      ],
      answer: 2,
    },
    {
      question: 'When a session is logged, three things should follow: clear the totals cache, update a streak and refresh the teacher dashboard. Logging must stay fast and should not need changing when features are added. What fits?',
      options: [
        { text: 'Publish a `SessionLogged` event, and let each feature subscribe', explanation: 'The logging code announces the fact once, and features react independently and can be added freely.' },
        { text: 'Call all three functions directly inside the logging endpoint', explanation: 'Logging would wait for all three and need editing for every new feature.' },
        { text: 'Have each feature check the database every second for new sessions', explanation: 'Constant polling wastes resources and still reacts late.' },
        { text: 'Ask learners to refresh each page themselves', explanation: 'That pushes the system\'s job onto users.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this code print?',
      code: {
        language: 'python',
        code: code`
          subscribers = {}


          def subscribe(event_type, handler):
              subscribers.setdefault(event_type, []).append(handler)


          def publish(event_type, data):
              for handler in subscribers.get(event_type, []):
                  handler(data)


          subscribe("NoteUploaded", lambda event: print("index", event["note"]))
          publish("SessionLogged", {"note": "bio"})
          publish("NoteUploaded", {"note": "bio"})
        `,
      },
      options: [
        { text: 'index bio printed twice', explanation: 'Only one handler exists, and it only receives `NoteUploaded`.' },
        { text: 'Nothing', explanation: 'The `NoteUploaded` event does have a subscriber, so one line is printed.' },
        { text: 'A KeyError, because nobody subscribed to SessionLogged', explanation: '`subscribers.get` returns an empty list for unknown events, so publishing one does nothing.' },
        { text: 'index bio', explanation: '`SessionLogged` has no subscribers, so nothing happens. `NoteUploaded` has one, which prints once.' },
      ],
      answer: 3,
      answerIsOutput: true,
    },
  ],
  takeaway: 'Start with a modular monolith, split out services only for clear needs, use events for reactions that can happen later, and adopt each pattern only because a requirement or risk calls for it.',
  resources: [
    { title: 'MonolithFirst', provider: 'Martin Fowler', description: 'Why most successful service-based systems started as monoliths.', url: 'https://martinfowler.com/bliki/MonolithFirst.html' },
    { title: 'Microservices', provider: 'Martin Fowler', description: 'The defining article on microservices, their benefits and costs.', url: 'https://martinfowler.com/articles/microservices.html' },
    { title: 'What do you mean by "Event-Driven"?', provider: 'Martin Fowler', description: 'Four different patterns that all get called event-driven.', url: 'https://martinfowler.com/articles/201701-event-driven.html' },
    { title: 'Conway\'s Law', provider: 'Martin Fowler', description: 'How team structure shapes system structure.', url: 'https://martinfowler.com/bliki/ConwaysLaw.html' },
  ],
  underTheHood: {
    heading: 'Conway\'s law',
    paragraphs: [
      "In 1967 Melvin Conway observed that organizations design systems that mirror their own communication structure. Three teams building a compiler tend to produce a three-part compiler. Decades of experience have confirmed it: the boundaries in a system tend to form where people stop talking to each other daily.",
      "This explains when microservices work. When separate teams own separate services, each team can change, test and release on its own schedule, and the network boundary matches a real boundary between people. When two developers own eight services, the boundaries match nothing. Every change crosses several services, and the coordination costs remain with none of the independence gained.",
      "Some organizations use the law on purpose, shaping teams around the architecture they want, which is sometimes called the inverse Conway maneuver. For a small team, the lesson is simpler: one team usually means one deployable application, with clean internal modules ready to split when the organization, and not just the code, grows.",
    ],
  },
}

export default lesson
