import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain technical debt as a trade-off that can be deliberate, and when it is harmful',
    'List and score debt items by the cost they add to future work and the risk they carry',
    'Plan a regular share of capacity for paying down the debt that matters most',
  ],
  bigIdea: 'Technical debt is the future cost of a shortcut taken today, and some of it is a sensible trade-off while the rest quietly slows every change. Managing it means naming each item, estimating what it costs, and paying down the parts that cost the most or carry the most risk, on a steady schedule.',
  whyItMatters: 'A team has shipped a product quickly for two years. Every new feature now takes three times as long, because the code paths are tangled and nobody fully understands them. The team blames the developers, but the cause is a set of unrecorded shortcuts. A short list of debt items, scored and planned, would have turned a vague frustration into a clear decision about where to spend the next month.',
  goalSections: [
    {
      heading: 'Deliberate debt and harmful debt',
      paragraphs: [
        'Debt is deliberate when the team chooses a shortcut knowing the cost, writes it down, and plans to repay it. A prototype with hard-coded settings is a reasonable choice when the goal is to learn whether an idea works. The debt is acceptable because the team expects to replace the prototype or to rebuild it properly if it succeeds.',
        'Debt becomes harmful when it is unknown, unwritten, or left to grow. A missing test in a payment path, a copied block of logic in five places, or a library that no longer receives security updates all add cost and risk without anyone deciding to accept them. The danger is not the shortcut itself, but the silence around it.',
        'Distinguish the two with one question: do we know what this costs, and have we decided to accept it? If the answer is yes, the debt is a trade-off. If no, it is a problem waiting to happen.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Deliberate:  hard-coded prize amounts in a prototype, written down, to be replaced after the pilot
          Harmful:     payment logic copied into five files, no tests, nobody knows which copy is correct
        `,
      },
    },
    {
      heading: 'Listing and scoring debt',
      paragraphs: [
        'Keep a visible list of debt items, each with a short description, the area of the code or system it affects, and the people who know it. A list that lives only in one engineer\'s head is a risk in itself, because that person may leave.',
        'Score each item on two simple scales: the cost it adds to future work, and the risk it carries if it fails. Multiply them to get a rough priority. Items with high cost and high risk come first. An item that is ugly but rarely touched can wait.',
        'Revisit the scores when things change. A library that was safe last year may now have a known weakness, and an area that was quiet may become the focus of the next feature. The list is a living tool, not a one-time audit.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          debt = [
              ("payment logic copied in five files", 5, 5),
              ("no tests for export", 3, 4),
              ("old date library", 2, 2),
          ]
          ranked = sorted(debt, key=lambda item: item[1] * item[2], reverse=True)
          for name, cost, risk in ranked:
              print(cost * risk, name)
        `,
        output: '25 payment logic copied in five files\n12 no tests for export\n4 old date library',
      },
    },
    {
      heading: 'Paying it down on a schedule',
      paragraphs: [
        'Set aside a steady share of each planning period for debt, such as one part in five. A steady share works better than an occasional big cleanup, because it keeps the code healthy while the product keeps changing, and it is easier to defend to people who want new features.',
        'Pay down debt in small, safe steps. Add a test before changing the code, then make one change at a time, as covered in the planning lesson. Each step should leave the system working, so the cleanup never becomes a risky project of its own.',
        'Explain the work in terms of outcomes. "Cutting the payment logic to one place means the next pricing change takes two days instead of two weeks" is a reason that a manager can weigh against a feature.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          capacity = 25
          share = 0.2
          debt_time = capacity * share
          print("debt time per period:", debt_time)
        `,
        output: 'debt time per period: 5.0',
      },
    },
  ],
  seeItInAction: {
    title: 'Planning a share of capacity for debt',
    intro: 'The program below reserves one fifth of a period\'s capacity for the highest-scoring debt items, and reports which items fit. It is a simple planning rule that makes the trade-off visible to everyone. Run it, then change the capacity to 20 and predict which items are planned.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        capacity = 10
        debt_budget = capacity // 5
        items = [("payment logic", 2), ("export tests", 3), ("date library", 2)]

        used = 0
        for name, size in items:
            if used + size <= debt_budget:
                used += size
                print("plan:", name)
            else:
                print("later:", name)
        print("debt budget used:", used, "of", debt_budget)
      `,
      output: 'plan: payment logic\nlater: export tests\nlater: date library\ndebt budget used: 2 of 2',
    },
    steps: [
      { code: 'debt_budget = capacity // 5', explanation: 'Reserves one fifth of the period for debt, so it has a fixed place in the plan.' },
      { code: 'if used + size <= debt_budget:', explanation: 'Adds items in priority order while they fit, the same rule used for other planned work.' },
      { code: 'print("debt budget used:", used, "of", debt_budget)', explanation: 'Shows how much of the reserved share was used, so the trade-off is visible.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write three debt items for a project you know. For each, write the cost it adds and the risk it carries, each on a scale of one to five.',
      'Change the capacity in the seeItInAction example to 25 and predict which items are planned. Run it to check.',
      'Write one sentence that explains a debt item to a non-technical manager in terms of outcome.',
    ],
  },
  mistakes: [
    { mistake: 'Treating all technical debt as equally bad.', fix: 'Score each item by its cost and risk, and pay down the highest scores first.' },
    { mistake: 'Keeping the debt list in one person\'s head.', fix: 'Write the list down where the whole team can see and change it.' },
    { mistake: 'Waiting for a big cleanup project that never comes.', fix: 'Reserve a steady share of each period and pay down debt in small, safe steps.' },
  ],
  quiz: [
    {
      question: 'What makes a debt item deliberate rather than harmful?',
      options: [
        { text: 'The team knows its cost, has written it down, and has decided to accept it', explanation: 'Yes. Deliberate debt is a known trade-off with a plan.' },
        { text: 'The code is ugly but rarely touched', explanation: 'Ugliness alone does not show whether the debt is deliberate.' },
        { text: 'It was written by a senior engineer', explanation: 'Seniority does not make a shortcut deliberate or safe.' },
        { text: 'It is in a language that is out of fashion', explanation: 'Fashion is not the test. Known cost and decision are.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print first?',
      code: { language: 'python', runnable: true, code: code`
        debt = [("a", 2, 3), ("b", 4, 2)]
        ranked = sorted(debt, key=lambda d: d[1] * d[2], reverse=True)
        print(ranked[0][0], ranked[0][1] * ranked[0][2])
      ` },
      options: [
        { text: 'a 6', explanation: 'Item a scores 2 times 3, which is 6. Item b scores 8, so b comes first.' },
        { text: 'b 8', explanation: 'Yes. Item b scores 4 times 2, which is 8, the highest score.' },
        { text: 'a 2', explanation: 'That is the cost of item a alone, not its score.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why is a steady share of capacity better than an occasional big cleanup?',
      options: [
        { text: 'It keeps the code healthy as the product keeps changing, and is easier to defend', explanation: 'Yes. Regular small payments prevent debt from piling up.' },
        { text: 'It removes the need for tests', explanation: 'Tests are still needed for every change.' },
        { text: 'It makes features cheaper to ship in a single day', explanation: 'The steady share does not guarantee speed in a single day.' },
        { text: 'It means debt never has to be discussed', explanation: 'The steady share makes the trade-off visible, so it is discussed.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Name technical debt, separate deliberate trade-offs from harmful silence, score items by cost and risk, and pay down the highest scores on a steady schedule in small, tested steps.',
  resources: [
    { title: 'Technical debt', provider: 'Martin Fowler', description: 'A widely cited explanation of technical debt as a metaphor for deliberate and reckless shortcuts.', url: 'https://martinfowler.com/bliki/TechnicalDebt.html' },
    { title: 'Managing technical debt', provider: 'Atlassian', description: 'Practical guidance on tracking, prioritizing, and paying down technical debt.', url: 'https://www.atlassian.com/agile/software-development/technical-debt' },
  ],
}

export default lesson
