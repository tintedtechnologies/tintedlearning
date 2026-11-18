import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Write a clear AI problem statement with a goal, a user, and a measure of success',
    'Check a proposed AI project against the risks covered in this section',
    'Decide whether the project should go ahead, be simplified, or wait for better data',
  ],
  bigIdea: 'A good AI project starts with a problem written in plain words, not a model or a tool. Before any code is written, the problem needs a user, a decision the answer will support, a type of problem, a source of data, a way to measure success, and a plan for the mistakes the system will make. This checkpoint asks you to write that brief for a real idea.',
  whyItMatters: 'Many AI projects fail before the first model is trained. The team chose a fashionable tool, could not say who would use it, and had no way to tell whether it worked. A short, honest brief catches these problems on paper, when changing course costs an hour rather than a year. This is also the skill employers look for first.',
  goalSections: [
    {
      heading: 'Write the problem in one sentence',
      paragraphs: [
        'Start with the person and their problem. "A support team spends two hours each morning sorting customer emails by topic" is a problem. "We need a language model" is a solution looking for a problem. Write the problem before you name any technology.',
        'Then name the decision the answer will support. A sorted inbox helps the team choose who replies first. If you cannot say what decision changes because of the AI output, the project is not yet ready.',
        'Finally, name the type of problem from the first lesson in this section. Sorting into fixed topics is classification. Estimating how many emails will arrive is regression. Finding groups of similar complaints nobody has labeled is clustering.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Weak:    We need a language model for customer emails.
          Better:  A support team spends two hours each morning sorting customer emails by topic.
        `,
      },
    },
    {
      heading: 'Define success and the data you need',
      paragraphs: [
        'Success needs a number a person can check. "The sorting is accurate on at least 90 of every 100 test emails, checked by a team member" is measurable. "Customers are happier" is not, at least not yet. A measure also tells you when to stop.',
        'Name the data and where it comes from. Past emails with their correct topics are the most direct source. Check that the data is allowed to be used for this purpose, and remove personal details that the project does not need, as covered in the privacy lesson.',
        'Write down what is missing. If only a few topics have examples, the system will be weak on the rest. Missing data is a finding, and it is better to report it in the brief than to discover it after the launch.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          brief = {
              "user": True,
              "decision": True,
              "problem_type": True,
              "success_measure": True,
              "data_source": True,
              "mistake_plan": False,
          }
          missing = [item for item, present in brief.items() if not present]
          if missing:
              print("Not ready. Missing:", ", ".join(missing))
          else:
              print("Ready to pilot")
        `,
        output: 'Not ready. Missing: mistake_plan',
      },
    },
    {
      heading: 'Plan for mistakes and decide',
      paragraphs: [
        'Every AI system will make mistakes. Write down the most harmful mistake the system could make, and who would bear the cost. A misfiled email is a small problem. A missed urgent medical message is a serious one. The plan for the serious case decides how much human review is needed.',
        'Check the risks from the sections on privacy, bias, and reliability. Could the system treat some customers worse than others? Is any personal data about children or health included? Can a person review and correct a decision?',
        'End the brief with a clear recommendation: go ahead, go ahead with a smaller pilot, or wait. A pilot is a good choice when the measure is clear, the data is ready, and the harmful mistakes have a review step. Waiting is the right choice when the data does not exist yet.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Worst realistic mistake: an urgent email is filed under "general" and waits a day.
          Who pays: the customer who needed a fast reply.
          Review step: every email marked urgent by a rule is checked by a person before filing.
          Recommendation: pilot, because the mistake has a review step.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking a project brief before the pilot',
    intro: 'The program above checks whether a brief is complete. In your own work, you would also read the risks and the data source, which a checklist cannot judge for you. Run it, then mark the mistake plan as complete and predict the new output.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        brief = {
            "user": True,
            "decision": True,
            "problem_type": True,
            "success_measure": True,
            "data_source": True,
            "mistake_plan": True,
        }
        missing = [item for item, present in brief.items() if not present]
        print("missing items:", len(missing))
        print("decision:", "pilot" if not missing else "revise the brief")
      `,
      output: 'missing items: 0\ndecision: pilot',
    },
    steps: [
      { code: 'brief = {...}', explanation: 'Each item from the brief is written as a yes or no, so nothing is assumed to be done.' },
      { code: 'missing = [item for item, present in brief.items() if not present]', explanation: 'Collects the items that are not yet written. These are the gaps to fill before any build starts.' },
      { code: 'print("decision:", "pilot" if not missing else "revise the brief")', explanation: 'A brief with gaps goes back for revision. A complete brief can move to a small pilot.' },
    ],
  },
  tryIt: {
    instructions: [
      'Choose a problem from your work or a community you belong to. Write the problem in one sentence, without naming a technology.',
      'Write the success measure as a number, with the sample size and who checks the result.',
      'Fill in the brief for your problem, and give it a recommendation: pilot, smaller pilot, or wait. Explain the recommendation in three sentences.',
    ],
  },
  mistakes: [
    { mistake: 'Starting with the tool and looking for a problem afterward.', fix: 'Write the problem and the user first. Name the tool only after the brief is complete.' },
    { mistake: 'Measuring success with a word like "better" or "happier".', fix: 'Write a number, a sample size, and the person who checks it.' },
    { mistake: 'Skipping the plan for harmful mistakes.', fix: 'Name the worst realistic mistake and the review step that catches it before the work starts.' },
  ],
  quiz: [
    {
      question: 'Which statement is the best starting point for an AI project brief?',
      options: [
        { text: 'We will use the newest language model', explanation: 'That names a tool, not a problem. Start with the problem and the user.' },
        { text: 'A support team spends two hours each morning sorting emails by topic', explanation: 'Yes. It names a person, a problem, and a cost, without choosing a technology.' },
        { text: 'AI will make the company more modern', explanation: 'This is a goal without a measurable problem or a decision the answer supports.' },
        { text: 'We should build something exciting for the next conference', explanation: 'A conference is not a user problem, so it does not define what success looks like.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print when the mistake plan is missing?',
      code: { language: 'python', runnable: true, code: code`
        brief = {"user": True, "mistake_plan": False}
        missing = [item for item, present in brief.items() if not present]
        print("missing:", missing)
      ` },
      options: [
        { text: "missing: ['user']", explanation: 'The user is present, so it is not in the missing list.' },
        { text: "missing: ['mistake_plan']", explanation: 'Yes. The only item marked False is the mistake plan.' },
        { text: 'missing: []', explanation: 'The mistake plan is False, so it is in the missing list.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'When is a small pilot a better recommendation than a full launch?',
      options: [
        { text: 'When the measure is clear, the data is ready, and harmful mistakes have a review step', explanation: 'Yes. A pilot lets the team learn safely while the risks are still limited.' },
        { text: 'When nobody has thought about the problem', explanation: 'A pilot needs a clear problem and measure. Unclear problems should be defined first.' },
        { text: 'When the system will never make a mistake', explanation: 'Every system makes mistakes. A pilot is about limiting the cost of those mistakes.' },
        { text: 'When the team wants to avoid measuring results', explanation: 'A pilot needs measurement. Skipping it defeats the purpose.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A good AI brief names the problem, the user, the decision, the type of problem, the data, a number for success, and the worst likely mistake, and it ends with a clear recommendation.',
  resources: [
    { title: 'Machine Learning Crash Course: Framing', provider: 'Google', description: 'A free course module on turning a real problem into a machine learning question.', url: 'https://developers.google.com/machine-learning/crash-course/framing/ml-terminology' },
    { title: 'AI Risk Management Framework', provider: 'NIST', description: 'A framework for planning how an AI system will be measured, managed, and reviewed.', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
  ],
}

export default lesson
