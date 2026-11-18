import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Write a README that explains what a tool does, how to run it, and how it was built',
    'Record the decisions that shaped the tool, and the reasons, so they can be questioned later',
    'State honestly what was tested, what was checked by hand, and what is still unknown',
  ],
  bigIdea: 'A tool built with an AI assistant is only as understandable as its documentation. A good README explains the purpose, setup, and usage, a decision log records why the important choices were made, and a test and limits section says what was verified. Together they let anyone understand the tool without the original conversation.',
  whyItMatters: 'A student builds a useful tool in a weekend with an assistant, and it works. Three months later, they want to add a feature, but they cannot remember why the data is stored the way it is, how to run the tests, or which parts were checked. The tool is still there, but its builder has become a stranger to it. An hour of documentation at the end would have saved days of rework.',
  goalSections: [
    {
      heading: 'A README a stranger can follow',
      paragraphs: [
        'Start with what the tool does, in two or three sentences, and who it is for. A reader should know within a minute whether the tool is what they need. Then give the setup steps in order, with the exact commands, so a new person can run it without guessing.',
        'Show one example of use, with the input and the output. A concrete example teaches more than a list of options, and it becomes a quick test that the tool still works after a change.',
        'Keep the README in the repository, next to the code. A README that lives in a separate document drifts out of date, because nobody sees it when they change the code.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          # Expense Tracker
          Records household expenses and prints a monthly total.
          Setup:   python -m venv .venv, then pip install -r requirements.txt
          Run:     python expenses.py add 12.50 "lunch"
          Example: python expenses.py total  ->  Total this month: 12.50
        `,
      },
    },
    {
      heading: 'A decision log',
      paragraphs: [
        'Record each important decision as a short entry: the date, the decision, the reason, and what was rejected. "Stored in SQLite, because the tool needs queries by month and a text file would make that slow to write and hard to check" tells a future reader why the choice was made.',
        'Include the decisions the assistant made for you, not only the ones you made. A decision that appeared in generated code, such as a library or a file layout, is still a decision, and someone may need to question it later.',
        'Mark decisions that are reversible and those that are not. A choice of colors is easy to change, while a choice of how user data is stored is expensive to change. Readers need to know which decisions deserve caution.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          decisions = [
              {"topic": "storage", "choice": "SQLite", "reversible": False},
              {"topic": "colors", "choice": "blue theme", "reversible": True},
          ]
          hard_to_change = [d["topic"] for d in decisions if not d["reversible"]]
          print("review carefully before changing:", hard_to_change)
        `,
        output: "review carefully before changing: ['storage']",
      },
    },
    {
      heading: 'What was tested, and what was not',
      paragraphs: [
        'List the tests that exist and how to run them. A test section that says "run pytest, 14 tests pass" is useful. A section that says "fully tested" is not, because it hides what the tests actually cover.',
        'Name what was checked by hand, such as a visual check of the layout on a phone, or a manual run with real data. Hand checks are valuable, but they are not repeatable unless you write them down.',
        'Include a limits section. State what the tool does not handle, what it has not been tested against, and what you would check before relying on it for something important. An honest limits section makes the tool more trustworthy, not less.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Tested: 14 unit tests, run with pytest, all passing on Python 3.12
          Checked by hand: the monthly total on a real month of receipts
          Not tested: more than 10,000 rows, and the layout on a phone
          Limits: one user only; amounts are stored as decimals with no currency conversion
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking a README for the sections a reader needs',
    intro: 'The program above checks a README outline for the sections that a stranger needs: purpose, setup, example, tests, and limits. A missing section is a gap a future reader will feel. Run it, then add the limits section and predict the new result.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        readme_sections = {"purpose", "setup", "example", "tests"}
        required = ["purpose", "setup", "example", "tests", "limits"]

        missing = [section for section in required if section not in readme_sections]
        print("missing sections:", missing if missing else "none")
      `,
      output: "missing sections: ['limits']",
    },
    steps: [
      { code: 'readme_sections = {...}', explanation: 'The sections that the README currently has, as a set for quick checking.' },
      { code: 'required = [...]', explanation: 'The sections a stranger needs. The list is written once, so the rule is clear.' },
      { code: 'missing = [section for section in required if section not in readme_sections]', explanation: 'Finds the sections the README lacks, so they can be added before the tool is shared.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a README for a tool you have built, with the purpose, setup, one example, and how to run the tests.',
      'Add a limits section to your README, with two things the tool does not handle yet.',
      'Change the readme_sections set in the seeItInAction example to include "limits", and predict the result. Run it to check.',
    ],
  },
  mistakes: [
    { mistake: 'Writing "fully tested" with no list of what the tests cover.', fix: 'Name the tests, how to run them, and what they check.' },
    { mistake: 'Leaving out the decisions the assistant made.', fix: 'Log every important decision, including the ones that appeared in generated code.' },
    { mistake: 'Keeping the README outside the repository.', fix: 'Keep it next to the code, and update it in the same change.' },
  ],
  quiz: [
    {
      question: 'Why record the decisions that shaped a tool?',
      options: [
        { text: 'So the reasons can be questioned and understood later, without the original conversation', explanation: 'Yes. Decision records preserve the reasons behind choices.' },
        { text: 'So the assistant can be billed for them', explanation: 'Billing is not the purpose of a decision log.' },
        { text: 'So the code runs faster', explanation: 'A decision log documents reasons. It does not change speed.' },
        { text: 'So nobody needs to read the code', explanation: 'The code still matters. The log explains it.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        decisions = [("db", False), ("theme", True)]
        print([t for t, reversible in decisions if not reversible])
      ` },
      options: [
        { text: "['theme']", explanation: 'The theme is reversible, so it is not in the list.' },
        { text: "['db']", explanation: 'Yes. The database decision is not reversible, so it is listed.' },
        { text: '[]', explanation: 'One decision is not reversible, so the list is not empty.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why include a limits section in a README?',
      options: [
        { text: 'It states honestly what the tool does not handle, which helps a reader decide whether to rely on it', explanation: 'Yes. Honest limits make the tool more trustworthy for the people who use it.' },
        { text: 'It makes the tool look more complete', explanation: 'A limits section is about honesty, not appearance.' },
        { text: 'It replaces the tests', explanation: 'Tests are still needed. The limits section explains what the tests do not cover.' },
        { text: 'It is required by every programming language', explanation: 'No language requires it. It is good practice.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Document a tool with a README a stranger can follow, a decision log that marks which choices are hard to reverse, and an honest account of what was tested, checked by hand, and left unknown.',
  resources: [
    { title: 'Make a README', provider: 'makeareadme.com', description: 'A guide to writing a README that explains the purpose, setup, and usage of a project.', url: 'https://www.makeareadme.com/' },
    { title: 'Architecture decision records', provider: 'ADR GitHub organization', description: 'A lightweight format for recording the decisions that shape a project, and why.', url: 'https://adr.github.io/' },
  ],
}

export default lesson
