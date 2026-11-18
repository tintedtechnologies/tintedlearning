import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Write a project instructions file that tells the assistant your conventions, test command, and limits',
    'Save the file where your assistant reads it, and check which files each tool looks for',
    'Test the rules in a new chat with a small task, and confirm the assistant followed them',
  ],
  bigIdea: 'An assistant starts every session without knowing your project, unless a file tells it. A short instructions file, saved in the project, holds the rules you would otherwise repeat in every request. Test the rules with a small task, because a file that the assistant ignores is no help.',
  whyItMatters: 'Each morning you type the same reminder: use pytest, keep the menu separate from the data, do not add libraries without asking. Some days you forget, and the assistant adds a web framework to a command-line tool. A rules file means the reminder is written once, and it is shared with anyone who opens the project. Writing the file once takes less time than repeating the same reminder every day.',
  goalSections: [
    {
      heading: 'Writing the rules a project needs',
      paragraphs: [
        'Write rules that answer the questions the assistant keeps getting wrong. Good rules name the stack, the test command, where code goes, and what the assistant must not do. For the reading list, that might be the Python version, the test command, and a rule that the menu code never writes to the data file directly.',
        'Keep the file short, about one page. Long files are hard to read and easy to ignore. Put rules in plain sentences, and avoid rules that cannot be checked, such as "write beautiful code." Good rules are specific enough that a reviewer could say yes or no to each one.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          # Reading List: project rules

          * This is a command-line tool written in Python 3.12 or newer.
          * Keep the menu in reading_list.py. Keep file reading and writing in storage.py.
          * Add or update a test in tests/ for every behavior change.
          * Run "python -m pytest" before you say a task is finished.
          * Do not add a new library without asking first.
          * Never put a real key, password, or personal data in any file.
        `,
      },
    },
    {
      heading: 'Saving the file where your tool reads it',
      paragraphs: [
        'Different tools look for different file names. AGENTS.md is a format several tools read. GitHub Copilot reads .github/copilot-instructions.md, and Claude Code reads CLAUDE.md. If you use more than one tool, keep the rules in one file and link to it, rather than copying them, so the copies never drift apart.',
        'Put the file in the root of the project, next to your README. Commit it to Git, so the rules travel with the project. Check the official docs for your tool to confirm the exact file name, because tools change how they read these files. Write the file in plain Markdown, so you can read it, review it, and change it in your editor.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          reading-list/
          ├── AGENTS.md                      read by several tools
          ├── .github/
          │   └── copilot-instructions.md    read by GitHub Copilot
          ├── CLAUDE.md                      read by Claude Code
          ├── GOAL.md
          ├── reading_list.py
          └── tests/
        `,
      },
    },
    {
      heading: 'Testing that the rules are followed',
      paragraphs: [
        'Saving the file does not prove the assistant reads it. Start a new chat, so earlier messages cannot supply the rules, then ask for a small change that the rules affect. Do not repeat the rules in your request, because the test is whether the file works on its own.',
        'Check the result against the rules. Did the new function go in the menu file? Did the assistant add a test? Did it run pytest? If a rule was ignored, make the rule more specific, then test again. Rules you cannot check are rules you cannot trust. Keep a short note of each rule that failed, because a pattern of failures shows which rule needs rewriting.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Test prompt (new chat, no rules repeated):
          "Add a command that lists unread books."

          Check:
          [ ] The new function is in reading_list.py, not storage.py
          [ ] A test was added in tests/
          [ ] pytest was run and the result was reported
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A rule that is tested in a new chat',
    intro: 'This example shows one rule and the test that proves it. The rule says the menu does not write to the data file. The check looks for a file write in the menu code. Run the check, then read it line by line.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'check_rules.py',
      code: code`
        menu_code = '''
        def show_books(books):
            for book in books:
                print(book["title"])
        '''

        forbidden = ["open(", "json.dump"]
        problems = [word for word in forbidden if word in menu_code]
        print("Rule ok" if not problems else f"Rule broken: {problems}")
      `,
      output: 'Rule ok',
    },
    steps: [
      { code: "menu_code = '''...'''", explanation: 'Holds the text of the menu code, copied from the file the rule is about. In a real project you would read the file from disk.' },
      { code: 'forbidden = ["open(", "json.dump"]', explanation: 'Lists the calls the rule forbids: opening a file, and writing JSON to a file.' },
      { code: 'problems = [word for word in forbidden if word in menu_code]', explanation: 'Finds which forbidden calls appear in the menu code. An empty list means the rule holds.' },
      { code: 'print("Rule ok" if not problems else ...)', explanation: 'Reports the result in one line, so a broken rule is easy to spot in the terminal.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write an AGENTS.md file in the reading-list folder with at least four rules, including the test command.',
      'Start a new chat in your assistant and ask for one small change, such as "add a command that marks a book as read." Do not repeat the rules.',
      'Check the result against your rules. If a rule was ignored, rewrite that rule to be more specific, then test again.',
    ],
  },
  mistakes: [
    { mistake: 'Writing rules that the assistant cannot check, such as "write clean code."', fix: 'Write rules you can see in the result, such as "add a test for each behavior change."' },
    { mistake: 'Testing the rules in the same chat where you wrote them.', fix: 'Start a new chat, so the test does not depend on messages you already sent.' },
    { mistake: 'Putting a real key or password in the rules file.', fix: 'Keep secrets out of every instructions file. Rules are shared, and they often end up in Git history.' },
  ],
  quiz: [
    {
      question: 'You saved your rules in a file, then asked the assistant for a change in the same chat. The change ignores the rules. What is the most likely cause?',
      options: [
        { text: 'The rules file is in a folder the tool does not read, or the test was not in a new chat', explanation: 'Yes. Check the file name for your tool, then test again in a new chat.' },
        { text: 'Assistants never read rules files', explanation: 'Many tools do read them. The file name and the test setup are the things to check.' },
        { text: 'The assistant needs the rules repeated in every request', explanation: 'Repeating rules works, but the goal is a file that works on its own.' },
        { text: 'Python does not allow comments in rules files', explanation: 'Rules files are Markdown for the assistant, not Python code.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this check print when the menu code contains no forbidden calls?',
      code: { language: 'python', runnable: true, code: code`
        menu_code = "print(book['title'])"
        forbidden = ["open(", "json.dump"]
        problems = [word for word in forbidden if word in menu_code]
        print("Rule ok" if not problems else f"Rule broken: {problems}")
      ` },
      options: [
        { text: 'Rule ok', explanation: 'Yes. No forbidden call appears in the text, so the list is empty and the rule holds.' },
        { text: 'Rule broken: []', explanation: 'The message only shows the list when the rule is broken, so an empty list prints "Rule ok."' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
        { text: 'Nothing', explanation: 'The print line runs, so one line appears.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why commit the rules file to Git?',
      options: [
        { text: 'So the rules travel with the project and everyone who opens it gets the same guidance', explanation: 'Yes. A committed file is shared, reviewed, and versioned like the rest of the project.' },
        { text: 'So the assistant can run the rules as Python code', explanation: 'The assistant reads the rules as guidance. It does not run them as code.' },
        { text: 'So the rules can contain real passwords safely', explanation: 'Never store secrets in a committed file. They can stay in the history forever.' },
        { text: 'Because Git is required before any assistant can be installed', explanation: 'Git is not required to install an assistant.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Write the rules once in a short file the project keeps, then prove they work by testing a small change in a new chat.',
  resources: [
    { title: 'Custom instructions in VS Code', provider: 'Visual Studio Code', description: 'How to create project instructions files, scope them with applyTo, and test their effect.', url: 'https://code.visualstudio.com/docs/agent-customization/custom-instructions' },
    { title: 'AGENTS.md', provider: 'Open format', description: 'A plain Markdown file that several coding agents read for project guidance.', url: 'https://agents.md/' },
  ],
}

export default lesson
