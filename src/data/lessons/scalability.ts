import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'System Design, with Study Tracker\'s university requirements and estimates, and AI Observability and Operations for measuring.',
  goals: [
    'Choose between scaling up and scaling out for each part of a system',
    'Make a web service stateless so several copies can share the load',
    'Use caches and queues to absorb load the system cannot serve directly',
  ],
  bigIdea: "Scalability is a system's ability to handle more work by adding resources, without being redesigned. You can scale up, with a bigger machine, or scale out, with more machines sharing the work, and scaling out only works when no single copy holds state the others need. Caches and queues then smooth the load, so expensive work is done less often and sudden bursts do not overwhelm anything.",
  whyItMatters: "Exam week: 2,000 students open Study Tracker on the same evening. The current version is one server process with a SQLite file on its own disk. Add a second server and each has its own database, so students see different sessions depending on which server answers. Meanwhile 300 students upload notes at once, and every upload waits while it is indexed. Scalability is the set of design moves that make \"add another server\" actually work.",
  goalSections: [
    {
      heading: 'Scaling up or out',
      paragraphs: [
        "Scaling up, also called vertical scaling, means a bigger machine: more processor cores and memory. It needs no code changes, but it has a ceiling, the one machine is a single point of failure, and resizing it often means downtime.",
        "Scaling out, or horizontal scaling, means more copies of a component, with a load balancer spreading requests between them. There is no hard ceiling, and losing one copy is not fatal. But it only works if any copy can handle any request.",
        "In practice, stateless web services are scaled out, and databases are usually scaled up first, because spreading one database across machines is much harder. Before scaling anything, find the real bottleneck in your measurements. Adding web servers does nothing if the database, or the model provider's rate limit, is what is full.",
      ],
      example: {
        language: 'text',
        code: code`
                           Scale up                 Scale out
          How              bigger machine           more copies + load balancer
          Code changes     none                     must be stateless
          Ceiling          largest machine          very high
          One failure      takes everything down    others keep serving
          Usually for      databases, at first      web APIs, workers
        `,
      },
    },
    {
      heading: 'Stateless services',
      paragraphs: [
        "A service is stateless when nothing a later request needs is kept only in one copy's memory or on its own disk. Then a load balancer can send each request to any copy, and copies can be added or removed freely.",
        "Making a service stateless means moving its state somewhere shared. Data moves to a database server that every copy connects to. Uploaded files move to object storage, a cloud service for files. Anything cached in memory moves to a shared cache, and settings come from environment variables, the same for every copy.",
        "Audit Study Tracker and you find three pieces of local state: the SQLite file, the `notes` folder and the embedding cache inside `study.db`. The Cloud Engineering section moves them to a managed PostgreSQL database and object storage, which is exactly what makes scaling out possible.",
      ],
      example: {
        language: 'text',
        code: code`
          Study Tracker today              Problem with 3 copies         Move it to
          study.db on the server's disk     3 separate databases          managed PostgreSQL
          notes/ folder on disk             notes saved to one copy only  object storage
          embedding cache in study.db       3 separate caches             the shared database
          request ID context variable       none: lives for one request   keep as it is
          settings from .env                none if the same everywhere   environment variables
        `,
      },
    },
    {
      heading: 'Caches and queues',
      paragraphs: [
        "A cache keeps the result of expensive work so it can be reused. A student's totals could be cached for 60 seconds, so refreshing the page does not repeat the database query. Every cache trades freshness for load, so decide how stale each value may be, and measure the hit rate: how often the cache actually has the answer.",
        "A queue holds work for later. When a note is uploaded, the API saves the file, adds an \"index this note\" job to a queue and replies at once. Background workers take jobs from the queue at their own pace. A burst of 300 uploads becomes a backlog that drains over a few minutes instead of 300 slow requests, and adding workers drains it faster.",
        "Queues also protect limited resources, such as a model provider's rate limit, because the number of workers sets the number of calls in progress. Watch the queue's length and the age of its oldest job. A queue that only ever grows means the workers cannot keep up.",
      ],
      example: {
        language: 'python',
        code: code`
          uploads_per_minute = [300, 50, 20, 10, 0, 0, 0]
          indexed_per_minute = 60

          waiting = 0
          for minute, uploads in enumerate(uploads_per_minute, start=1):
              waiting += uploads
              waiting -= min(waiting, indexed_per_minute)
              print(f"minute {minute}: {waiting} notes waiting")
        `,
        output: 'minute 1: 240 notes waiting\nminute 2: 230 notes waiting\nminute 3: 190 notes waiting\nminute 4: 140 notes waiting\nminute 5: 80 notes waiting\nminute 6: 20 notes waiting\nminute 7: 0 notes waiting',
      },
    },
  ],
  seeItInAction: {
    title: 'Study Tracker on exam night',
    intro: "Here is the order in which a team would scale Study Tracker for exam week, starting from measurements. The figures are illustrative, but each step and its reason is how real scaling work proceeds.",
    example: {
      language: 'text',
      code: code`
        Measure:  p95 page load 4.2 s; the single server's processor at 95%;
                  uploads take 20 s each while their notes are indexed
        Step 1    Move state out: PostgreSQL, object storage for notes
        Step 2    Run 3 copies of the web API behind a load balancer
        Step 3    Uploads add an "index" job to a queue; 2 workers index notes
        Step 4    Cache each student's totals for 60 seconds
        Step 5    Scale the database up one size, which is now the busiest part
        Measure:  p95 page load 380 ms; uploads return in 0.3 s;
                  queue drains within 6 minutes after the evening peak
      `,
    },
    steps: [
      { code: 'Measure: p95 page load 4.2 s; ... processor at 95%', explanation: "The logs and metrics from AI Observability and Operations show where the time goes. Here the web server's processor is full, and uploads are slow because indexing happens inside the request." },
      { code: 'Step 1 Move state out', explanation: "Nothing else works until this is done. With shared storage, any copy can serve any student." },
      { code: 'Step 2 Run 3 copies of the web API', explanation: "Now the load is spread out, and if one copy crashes, the other two keep serving while it restarts." },
      { code: 'Step 3 Uploads add an "index" job to a queue', explanation: "Uploads become fast because the slow part moves out of the request. Two workers also cap the number of embedding calls in progress, which keeps within the provider's limits." },
      { code: 'Step 4 Cache each student\'s totals for 60 seconds', explanation: "Totals change only when a session is logged, so a minute of staleness is acceptable and saves many identical queries. Logging a session could also clear that student's cached totals." },
      { code: 'Step 5 Scale the database up one size', explanation: "After the web tier was scaled out, the bottleneck moved to the database. Scaling always moves the bottleneck, which is why you measure again after each step." },
    ],
  },
  tryIt: {
    instructions: [
      'Audit your own Study Tracker for state. List every file, folder and in-memory value a second copy of the app would not see.',
      'Run the queue example above with 4 workers\' worth of capacity, `indexed_per_minute = 240`, and then with 30. Note how long each takes to drain.',
      'For each of these, decide whether to cache it and for how long, with a reason: totals, the list of sessions, an answer from the notes assistant, a note\'s embedding.',
      'Write down the three numbers you would watch during exam week, and the value of each that would make you add capacity.',
    ],
    evidencePrompt: {
      label: 'Your scaling plan',
      placeholder: 'For example: State found: study.db, notes/, the embedding cache. With 240 per minute the queue is empty after 2 minutes. With 30, 170 notes are still waiting after 7. I would cache totals for 60 s but not notes answers, because...',
    },
  },
  mistakes: [
    { mistake: 'Adding servers while state still lives on one server.', fix: 'Move data, files and caches to shared services first, then scale out.' },
    { mistake: 'Scaling before finding the bottleneck.', fix: 'Measure first. More web servers do not help if the database or the model provider is the limit.' },
    { mistake: 'Caching without deciding how stale data may be.', fix: 'Set a lifetime for each cached value based on how often it really changes, and clear it when the underlying data changes.' },
    { mistake: 'Letting a queue grow without limit.', fix: 'Monitor its length and the age of the oldest job, add workers when it grows, and slow down or reject new work if it cannot catch up.' },
  ],
  quiz: [
    {
      question: 'You run two copies of the current Study Tracker behind a load balancer, each with its own SQLite file. What happens?',
      options: [
        { text: 'The load is shared and everything works normally', explanation: 'Each copy has different data, so the app is no longer consistent.' },
        { text: 'Students see different sessions depending on which copy answers their request', explanation: 'The database is local state. Each copy saves to and reads from its own file.' },
        { text: 'The two SQLite files keep themselves in sync automatically', explanation: 'SQLite files do not synchronize with each other.' },
        { text: 'The load balancer refuses to start', explanation: 'It starts fine. The problem only shows when students use the app.' },
      ],
      answer: 1,
    },
    {
      question: '300 notes are uploaded in one minute, and one worker indexes 60 notes a minute. If no more arrive, about how long until all 300 are indexed?',
      options: [
        { text: '1 minute', explanation: 'One worker only handles 60 in that minute.' },
        { text: '60 minutes', explanation: 'That would be one note per minute, not 60.' },
        { text: '300 minutes', explanation: 'That treats the rate as one note per minute.' },
        { text: '5 minutes', explanation: '300 notes at 60 per minute takes 5 minutes, and adding a second worker would halve it.' },
      ],
      answer: 3,
    },
    {
      question: 'Which part of Study Tracker is usually scaled up, with a bigger machine, before trying to scale it out?',
      options: [
        { text: 'The database', explanation: 'Spreading one database across machines is hard, so a bigger machine is the usual first step.' },
        { text: 'The web API', explanation: 'Once stateless, the web API is the easiest part to scale out.' },
        { text: 'The index workers', explanation: 'Workers taking jobs from a queue scale out easily: just run more of them.' },
        { text: 'The load balancer', explanation: 'Cloud load balancers are managed services that scale themselves.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Measure first, move state into shared services so web copies can scale out, scale the database up, and use caches and queues so bursts and repeated work do not reach the expensive parts.',
  resources: [
    { title: 'Processes', provider: 'The Twelve-Factor App', description: 'Why services should be stateless, and where state should live instead.', url: 'https://12factor.net/processes' },
    { title: 'Avoiding insurmountable queue backlogs', provider: 'Amazon Builders\' Library', description: 'How real systems keep queues from growing out of control.', url: 'https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/' },
    { title: 'Redis documentation', provider: 'Redis', description: 'A widely used shared cache and queue, with guides for both.', url: 'https://redis.io/docs/latest/develop/' },
    { title: 'Amdahl\'s law', provider: 'Wikipedia', description: 'The formula behind the limits of scaling out.', url: 'https://en.wikipedia.org/wiki/Amdahl%27s_law' },
  ],
  underTheHood: {
    heading: 'Why scaling out has limits',
    paragraphs: [
      "Doubling the web servers rarely doubles what the system can handle, because some work runs through parts that are not doubled. Amdahl's law puts a number on it. If a fraction of the work cannot be spread out, that fraction sets a ceiling on the speed-up, however many copies you add.",
      "Say 10% of the work goes through something shared and unscalable, such as one database. With 2 copies the best speed-up is about 1.82 times, not 2. With 10 copies it is about 5.26 times. With 100 copies it is about 9.17 times, and no number of copies can ever pass 10, because the shared 10% is still done one piece at a time.",
      "That is why scaling work focuses on the shared parts: moving reads to caches, spreading database reads across copies of the database called read replicas, and moving slow work into queues. Each change shrinks the part that cannot be spread out, which raises the ceiling for everything else.",
    ],
  },
}

export default lesson
