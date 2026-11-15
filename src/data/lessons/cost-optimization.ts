import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Scalability, and Cost, Latency, and Performance, which covered the AI-specific costs this lesson builds on.',
  goals: [
    'Break a system\'s cost into parts and express it as a cost per user',
    'Match capacity to real demand by right-sizing and scaling with the load',
    'Build cost into the design with budgets, data retention rules and cost-aware choices',
  ],
  bigIdea: "Cost optimization means designing a system so that each unit of value, such as one active student for a month, costs as little as possible while still meeting the requirements. Running costs come from what you run, store and move, and from the time people spend operating it. The cheapest decisions are made during design, long before the first bill arrives.",
  whyItMatters: "The university pays Study Tracker a fixed fee per student. If running the system costs more per student than that fee, every new student loses money, and growth makes it worse. Most of the cost is set by early choices: servers sized for exam week running all year, notes kept forever, detailed logs never deleted. Designing for cost turns those into deliberate decisions instead of surprises on an invoice.",
  goalSections: [
    {
      heading: 'Where the money goes, per user',
      paragraphs: [
        "Group costs into a few parts: compute, meaning servers and workers; the managed database; storage for files, backups and logs; network data transfer, especially data leaving the provider or crossing regions; AI model usage, from Cost, Latency, and Performance; and people's time spent running it all, often the largest cost of all.",
        "Then divide the monthly total by monthly active users to get a unit cost. A healthy system's unit cost stays flat or falls as it grows. A rising unit cost is an early warning that something grows faster than the number of users.",
        "To know what each part costs, label every cloud resource with the component it belongs to. These labels are called tags, and the Cloud Engineering section uses them. The example uses made-up monthly figures, because real prices vary and change.",
      ],
      example: {
        language: 'python',
        code: code`
          monthly = {"web servers": 310, "workers": 120, "database": 420,
                     "storage": 60, "logs": 90, "AI model usage": 1440}
          active_students = 6000

          total = sum(monthly.values())
          print("total:", total)
          print("per active student:", round(total / active_students, 2))
          for part, cost in sorted(monthly.items(), key=lambda item: -item[1])[:3]:
              print(f"{part}: {cost / total:.0%}")
        `,
        output: 'total: 2440\nper active student: 0.41\nAI model usage: 59%\ndatabase: 17%\nweb servers: 13%',
      },
    },
    {
      heading: 'Capacity that follows demand',
      paragraphs: [
        "Right-sizing means choosing resources that match measured use. A server that averages 10% processor use is mostly paying for idle capacity, so a smaller size often does the same job. Measure first, then resize, then measure again.",
        "Autoscaling adds copies when load rises and removes them when it falls, which only works for stateless services, as in Scalability. Background workers and serverless functions can scale to zero when there is nothing to do, such as the index workers at three in the morning. Test environments can be switched off outside working hours.",
        "For the steady base of usage that runs all year, providers offer lower rates in exchange for committing to a year or more. Commit to the steady base and pay normal rates only for the peaks. The details differ by provider, so check their documentation rather than any rule of thumb.",
      ],
      example: {
        language: 'text',
        code: code`
          Web servers through the year          Fixed size        Autoscaled
          Exam weeks (peak)                     10 servers        10 servers
          Ordinary weeks                        10 servers        2 servers
          Server-weeks paid for in a year       520               120
        `,
      },
    },
    {
      heading: 'Designing for cost',
      paragraphs: [
        "Set a budget with alerts on day one, so overspending is noticed in days, not at the end of the month. The Cloud Engineering section does this before creating anything.",
        "Give every kind of data a lifecycle. Detailed logs are needed for a few weeks, after which summarized numbers are enough. A student's notes should be deleted some time after they leave, which helps privacy as much as cost. Old backups should expire, and rarely read files can move to a cheaper, slower storage tier.",
        "Make cost one of the criteria for every design choice. A managed database costs more per month than running your own, but usually far less once your team's time is counted. Keep data in one region near its users to avoid transfer charges. Cache to cut database and AI load. And write the estimated cost of each option into the decision record.",
      ],
      example: {
        language: 'text',
        code: code`
          Data                     Keep                               Then
          Detailed request logs    30 days                            keep only summary metrics
          Student notes            while enrolled + 30 days           delete
          Database backups         35 days                            expire automatically
          Note files not opened    90 days in standard storage        move to a cheaper tier
          Embedding cache          while the embedding model is used  clear after switching
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Cutting Study Tracker\'s unit cost',
    intro: "Here is a cost review of the university Study Tracker, using the made-up monthly figures from the first example. The figures are illustrative. The method, measuring per part and fixing the biggest parts first, is what carries over.",
    example: {
      language: 'text',
      code: code`
        Part              Before   Change                                          After
        AI model usage    1440     smaller model for extraction, embedding cache    820
        database           420     fixed two slow queries, cached totals, smaller   300
        web servers        310     autoscaling: 2 servers most weeks, 10 at peak    170
        workers            120     scale to zero overnight                           60
        logs                90     30-day detail, then summary metrics               35
        storage             60     no change yet                                     60
        Total             2440                                                     1445
        Per active student 0.41                                                    0.24
      `,
    },
    steps: [
      { code: 'AI model usage 1440', explanation: "The largest part gets attention first. The fixes come from Cost, Latency, and Performance, with the test set rerun to confirm answers did not get worse." },
      { code: 'fixed two slow queries, cached totals, smaller', explanation: "Query fixes and caching lowered the database's load, which made a smaller size possible. Right-sizing comes after reducing the work, not before." },
      { code: 'autoscaling: 2 servers most weeks, 10 at peak', explanation: "Exam weeks still get full capacity, so the speed requirement is still met. Under the hood shows why this saves so much." },
      { code: 'scale to zero overnight', explanation: "Workers only run when there is work in the queue. No student notices, because the queue absorbs the delay." },
      { code: 'storage 60 no change yet', explanation: "Not every part is worth optimizing now. At 4% of the total, storage can wait until it grows." },
      { code: 'Per active student 0.41 ... 0.24', explanation: "The number that matters: the unit cost fell by about 40%, with the requirements still met. Tracking it monthly shows whether growth keeps it healthy." },
    ],
  },
  tryIt: {
    instructions: [
      'List every part of your Study Tracker design that will cost money when deployed, and which category each belongs to.',
      'Copy the cost example above, put in your own estimates and number of users, and find your top three parts.',
      'Write a retention rule for every kind of data your Study Tracker stores, with a reason for each.',
      'For your largest part, write two ways to reduce it and how you would check that the requirements are still met.',
    ],
    evidencePrompt: {
      label: 'Your cost plan',
      placeholder: 'For example: Top parts: AI 55%, database 20%, web 12%. AI: route extraction to a small model, then rerun the test set...',
    },
  },
  mistakes: [
    { mistake: 'Looking at the total bill but never the cost per user.', fix: 'Track the unit cost every month. A rising unit cost shows a problem long before the total looks alarming.' },
    { mistake: 'Sizing for the peak and running that size all year.', fix: 'Autoscale stateless services, scale workers to zero when idle, and commit only to the steady base.' },
    { mistake: 'Keeping all data forever by default.', fix: 'Give each kind of data a retention rule that serves its purpose, then delete or summarize it automatically.' },
    { mistake: 'Cutting costs without checking the requirements.', fix: 'After every change, confirm the performance targets, the reliability objective and the AI test set still pass.' },
  ],
  quiz: [
    {
      question: 'Monthly cost rose from 2,000 to 3,000 while active students rose from 5,000 to 10,000. What happened to the cost per active student?',
      options: [
        { text: 'It rose, because the total went up', explanation: 'The number of students grew faster than the cost, so each student costs less.' },
        { text: 'It stayed the same', explanation: '2,000 / 5,000 is 0.40, while 3,000 / 10,000 is 0.30.' },
        { text: 'It fell from 0.40 to 0.30', explanation: 'Cost per student dropped by a quarter, which is a healthy sign as the system grows.' },
        { text: 'It cannot be worked out from these numbers', explanation: 'Total cost divided by active students is all you need.' },
      ],
      answer: 2,
    },
    {
      question: 'The web servers average 8% processor use across the year, sized for exam week. What is the best first step?',
      options: [
        { text: 'Autoscale them, so the number of servers follows the load', explanation: 'Capacity matches demand: full strength in exam weeks, a fraction the rest of the year.' },
        { text: 'Buy a year-long commitment for all 10 servers', explanation: 'That locks in paying for capacity that sits idle most of the year.' },
        { text: 'Remove servers until processor use reaches 90% at peak', explanation: 'With no headroom, exam week would be slow or fail.' },
        { text: 'Do nothing, because servers are the cheapest part', explanation: 'At 8% average use, most of their cost is wasted, whatever their share of the bill.' },
      ],
      answer: 0,
    },
    {
      question: 'Which retention rule best balances cost, privacy and usefulness for detailed request logs?',
      options: [
        { text: 'Keep everything forever, in case it is needed', explanation: 'Costs and privacy risk grow without limit, while old detail is almost never read.' },
        { text: 'Delete logs every night', explanation: 'You lose the evidence needed to investigate problems reported days later.' },
        { text: 'Keep everything forever in the cheapest storage tier', explanation: 'Cheaper, but the privacy risk and the growing cost remain.' },
        { text: 'Keep detailed logs for 30 days, then only summary metrics', explanation: 'Recent detail serves debugging, summaries serve trends, and old personal data does not pile up.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Know the cost per user and which parts drive it, let capacity follow demand, give every kind of data a retention rule and treat cost as a design requirement from the first day.',
  resources: [
    { title: 'Cost optimization pillar', provider: 'AWS Well-Architected', description: 'Principles and practices for designing cost-efficient cloud systems.', url: 'https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html' },
    { title: 'Cost optimization', provider: 'Azure Well-Architected Framework', description: 'Microsoft\'s guidance on the same topic, with design checklists.', url: 'https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/' },
    { title: 'Cost optimization', provider: 'Google Cloud Architecture Framework', description: 'Google Cloud\'s principles for cost-aware design.', url: 'https://cloud.google.com/architecture/framework/cost-optimization' },
    { title: 'What is FinOps?', provider: 'FinOps Foundation', description: 'The practice of making cloud cost a shared responsibility between engineering and finance.', url: 'https://www.finops.org/introduction/what-is-finops/' },
  ],
  underTheHood: {
    heading: 'Why idle capacity is the biggest hidden cost',
    paragraphs: [
      "Most systems carry far more load at their peak than on an average day. Study Tracker needs 10 servers during the two exam weeks and only 2 for the other 50 weeks of the year.",
      "Run 10 servers all year and you pay for 10 x 52 = 520 server-weeks. Scale with the load and you pay for 10 x 2 + 2 x 50 = 120 server-weeks. That is about 77% less, for exactly the same experience during exams. The difference was capacity that existed only to sit idle.",
      "In practice you cannot follow the load perfectly. New servers take time to start, so you keep some spare capacity, called headroom, and set a minimum number of copies for reliability. Commitments can still make sense for the 2 servers that run all year. But the principle holds widely: the gap between average and peak load is where most avoidable cost hides, and designs that can grow and shrink with demand capture most of it.",
    ],
  },
}

export default lesson
