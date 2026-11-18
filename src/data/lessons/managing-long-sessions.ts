import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain why a long AI session can become less reliable, in plain terms',
    'Start a fresh session with a short, accurate summary instead of continuing a tangled one',
    'Keep a project brief that lets any session, human or AI, pick up the work correctly',
  ],
  bigIdea: 'An AI assistant works with what is in its current conversation, and that space is limited. A very long session fills with old attempts, abandoned ideas, and corrected mistakes, so the assistant may follow an outdated decision. Managing long sessions means keeping a short, accurate project brief, starting fresh when the conversation gets tangled, and handing over only what the next step needs.',
  whyItMatters: 'A builder has spent four hours with an assistant on a tool. Early in the session, they decided to store data in a text file, then changed their mind to a database. The assistant now sometimes writes code for the text file, mixing both approaches. The builder blames the assistant, but the real cause is a crowded conversation with two contradictory decisions in it. A clean summary and a fresh session would have ended the confusion.',
  goalSections: [
    {
      heading: 'Why long sessions get unreliable',
      paragraphs: [
        'An assistant reads the conversation so far as the context for its next answer. The more text there is, the more old material competes for attention. Early decisions that were later changed can still appear as if they were current, and the assistant may follow the older one.',
        'Long sessions also collect dead ends. A failed approach, a discarded design, and a long error log all stay in the conversation, even after they are no longer useful. The assistant may repeat a mistake it already tried, because the correction is buried far back.',
        'Signs of an overloaded session include contradictory code, forgotten decisions, and answers that ignore a rule given earlier. When you see these, the fix is usually not another prompt in the same conversation. It is a clean start.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Hour 1:  "Store expenses in a text file."
          Hour 2:  "Actually, use a database."
          Hour 3:  assistant writes a file-based save for one feature and a database save for another
          Fix:     start a new session with the decision stated once: "Expenses are stored in SQLite."
        `,
      },
    },
    {
      heading: 'Starting fresh with a short summary',
      paragraphs: [
        'When a session is tangled, write a summary of the project as it is now, not as it was discussed. Include the goal, the decisions that stand, the files that exist, and the next step. Leave out the dead ends, unless one of them explains a decision that must not be repeated.',
        'Keep the summary short enough to read in a minute. A summary of two pages is harder to trust than one of ten lines, because the important facts get lost. If the summary is hard to write, that is a sign the project itself needs clearer decisions.',
        'Paste the summary into a new session, along with the one file that the next step needs. Ask for the next step only. The assistant then works from a clean, accurate picture, and the old confusion stays behind.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          summary = {
              "goal": "track household expenses",
              "decision": "store expenses in SQLite",
              "files": ["expenses.py", "tests/test_expenses.py"],
              "next step": "add a monthly total function",
          }
          print(len(summary["files"]), "files")
          print("next:", summary["next step"])
        `,
        output: '2 files\nnext: add a monthly total function',
      },
    },
    {
      heading: 'A project brief that lasts',
      paragraphs: [
        'Keep the project brief in the repository, as a plain text or Markdown file. It should describe the purpose, the rules the assistant must follow, the decisions made and why, and the current status. Update it when a decision changes, so the brief is always the single source of truth.',
        'Let every new session start by reading the brief. This is the same habit as a new teammate reading the onboarding notes. It also makes the work easier to hand over to a person, who can read the same file.',
        'Remove what is no longer true. A brief that keeps old decisions alongside new ones recreates the confusion of a long session. Edit the brief rather than adding to it.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          brief = {"goal": "track expenses", "decision": "SQLite", "status": "add monthly total"}
          stale = [key for key, value in brief.items() if not value]
          print("stale or empty entries:", stale if stale else "none")
        `,
        output: 'stale or empty entries: none',
      },
    },
  ],
  seeItInAction: {
    title: 'Checking that the brief matches the code',
    intro: 'The program above compares the decisions in a project brief with the storage used by the code, and reports any mismatch. A brief that disagrees with the code is the most common cause of confused sessions. Run it, then change the code to SQLite and predict the result.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        brief_storage = "text file"
        code_storage = "text file"

        if brief_storage == code_storage:
            print("brief and code agree:", brief_storage)
        else:
            print("mismatch: brief says", brief_storage, "but code uses", code_storage)
      `,
      output: 'brief and code agree: text file',
    },
    steps: [
      { code: 'brief_storage = "text file"', explanation: 'The decision as it is written in the project brief.' },
      { code: 'code_storage = "text file"', explanation: 'The storage that the code actually uses, found by reading the code.' },
      { code: 'print("mismatch: ...")', explanation: 'Reports the disagreement, so the brief or the code is fixed before the next session starts.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a project brief for a tool you are building, with the goal, the decisions that stand, the files, and the next step. Keep it under one page.',
      'Change code_storage in the seItInAction example to "SQLite" and predict the output. Run it to check.',
      'Start a new session with your brief and one file, and ask for only the next step. Note whether the answer followed the brief.',
    ],
  },
  mistakes: [
    { mistake: 'Continuing a tangled session with more prompts.', fix: 'Start a fresh session with a short, accurate summary.' },
    { mistake: 'Keeping old decisions beside new ones in the brief.', fix: 'Edit the brief so that it describes only what is true now.' },
    { mistake: 'Pasting the whole history into a new session.', fix: 'Paste the summary and the one file needed for the next step.' },
  ],
  quiz: [
    {
      question: 'Why can a long AI session become unreliable?',
      options: [
        { text: 'Old and contradictory decisions and dead ends stay in the conversation and compete for attention', explanation: 'Yes. A crowded conversation can make outdated decisions look current.' },
        { text: 'The assistant gets tired', explanation: 'Assistants do not get tired. The problem is what the conversation contains.' },
        { text: 'Long sessions are faster', explanation: 'Length does not make sessions faster or more reliable.' },
        { text: 'Sessions delete old code automatically', explanation: 'Old material stays in the conversation, which is the problem.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        summary = {"files": ["a.py", "b.py", "c.py"]}
        print(len(summary["files"]))
      ` },
      options: [
        { text: '2', explanation: 'There are three files in the list.' },
        { text: '3', explanation: 'Yes. The list holds three file names.' },
        { text: 'files', explanation: 'The program prints the count, not the key.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What should a project brief contain?',
      options: [
        { text: 'The current goal, the decisions that stand, the files, and the next step', explanation: 'Yes. Those are what any session needs to continue correctly.' },
        { text: 'Every message from every past session', explanation: 'A full history recreates the confusion the brief is meant to prevent.' },
        { text: 'Only the author\'s favorite prompts', explanation: 'Prompts are not the project state.' },
        { text: 'Passwords and tokens for quick access', explanation: 'Secrets must never be stored in a brief.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Long sessions collect outdated decisions and dead ends, so keep a short project brief in the repository, start fresh with an accurate summary when a session tangles, and ask for only the next step.',
  resources: [
    { title: 'Prompting best practices', provider: 'Anthropic', description: 'Guidance on giving assistants clear context, instructions, and examples.', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
    { title: 'Context windows', provider: 'Anthropic', description: 'An explanation of how context works in a model and why long conversations can become crowded.', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows' },
  ],
}

export default lesson
