import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain what refactoring means, and why it must not change behavior',
    'Refactor AI-generated code in small steps, with tests that pass before and after each step',
    'Recognize the warning signs that AI-generated code needs restructuring before more features are added',
  ],
  bigIdea: 'Refactoring changes the structure of code without changing what it does. AI assistants often produce working code that is repetitive, tangled, or hard to change. Cleaning it up is worth doing, but only with tests that prove the behavior stayed the same, and in small steps that can each be reverted.',
  whyItMatters: 'A vibe-coded expense tool works, but adding a new currency now requires editing four copies of the same formatting code. A quick "make it cleaner" prompt rewrites the whole file, and two totals start disagreeing by a few cents. Without tests and small steps, the cleanup breaks what worked. With them, the same cleanup takes an afternoon and nothing silently changes.',
  goalSections: [
    {
      heading: 'What refactoring is, and what it is not',
      paragraphs: [
        'Refactoring is changing how code is organized, named, and divided, while keeping its observable behavior the same. Renaming a function, moving repeated logic into one place, and splitting a long function into smaller ones are all refactoring. Adding a feature is not refactoring, even if it touches the same code.',
        'The rule is simple: the same inputs should give the same outputs, before and after. Refactoring that changes results is a bug with a clean structure. This is why the tests must exist before the cleanup begins, and why a prompt like "make it better" is risky on its own.',
        'AI-generated code benefits from refactoring for specific reasons. Assistants often repeat logic across functions, add defensive checks that never trigger, and leave names that describe how the code was written rather than what it does. These are good targets, because each one can be changed safely with tests in place.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          def total_before(items):
              total = 0
              for item in items:
                  total = total + item["price"] * item["quantity"]
              return total

          def total_after(items):
              return sum(item["price"] * item["quantity"] for item in items)

          sample = [{"price": 2.5, "quantity": 2}, {"price": 1.0, "quantity": 3}]
          print(total_before(sample) == total_after(sample))
          print(total_after(sample))
        `,
        output: 'True\n8.0',
      },
    },
    {
      heading: 'Small steps with tests in between',
      paragraphs: [
        'Before refactoring, write tests that describe the current behavior, including the edge cases: an empty list, a zero quantity, a missing field. A test that describes what the code does now is more useful than a test of what you hope it does.',
        'Make one change at a time. Rename one function, run the tests, and commit. Move one block of logic, run the tests, and commit again. A checkpoint after each step means that a failure points to one change, and reverting it loses only that step.',
        'Ask the assistant for one specific change, not a rewrite. "Move the currency formatting into one function and use it in the four places that call it" is a clear, reviewable change. "Clean up this file" invites a rewrite that is hard to check.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          steps = ["rename total_after to order_total", "run tests", "move formatting into one function", "run tests"]
          for number, step in enumerate(steps, start=1):
              print(number, step)
        `,
        output: '1 rename total_after to order_total\n2 run tests\n3 move formatting into one function\n4 run tests',
      },
    },
    {
      heading: 'Knowing when to stop',
      paragraphs: [
        'Refactor when a change is hard, not because the code looks old. If the next feature needs a copy of logic in a fifth place, that is the signal. Code that works and that nobody needs to change can stay as it is.',
        'Watch for refactors that grow. A cleanup that begins with one function and ends with a new architecture has changed plans. Stop, commit what works, and write down the bigger change as a separate task for a planned session.',
        'After refactoring, review the result as a teammate would. Read the new structure and check that it is easier to explain. A refactor that makes the code harder to follow has failed, even if the tests pass.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          work = {"needed by next feature": True, "fixes a real problem": True, "only looks old": False}
          refactor_now = [item for item, needed in work.items() if needed]
          print("refactor now:", refactor_now)
        `,
        output: 'refactor now: [\'needed by next feature\', \'fixes a real problem\']',
      },
    },
  ],
  seeItInAction: {
    title: 'Checking that a refactor kept the behavior',
    intro: 'The program above compares the old and new versions of a total on several inputs, including edge cases. Behavior that stays the same on every case is the evidence a refactor needs. Run it, then add an input with an empty list and predict whether the two versions still agree.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        def total_before(items):
            total = 0
            for item in items:
                total = total + item["price"] * item["quantity"]
            return total

        def total_after(items):
            return sum(item["price"] * item["quantity"] for item in items)

        cases = [
            [],
            [{"price": 2.5, "quantity": 2}],
            [{"price": 1.0, "quantity": 0}, {"price": 4.0, "quantity": 1}],
        ]
        results = [total_before(c) == total_after(c) for c in cases]
        print("all cases match:", all(results))
        print("matching cases:", sum(results), "of", len(cases))
      `,
      output: 'all cases match: True\nmatching cases: 3 of 3',
    },
    steps: [
      { code: 'cases = [[], ...]', explanation: 'The cases include an empty list and a zero quantity, the edge cases that refactors most often break.' },
      { code: 'results = [total_before(c) == total_after(c) for c in cases]', explanation: 'Compares the old and new behavior on each case, one at a time.' },
      { code: 'print("all cases match:", all(results))', explanation: 'A refactor is accepted only when every case matches, not when most of them do.' },
    ],
  },
  tryIt: {
    instructions: [
      'Pick a function from a vibe-coded project. Write three tests for its current behavior, including one edge case, before changing anything.',
      'Change total_after in the seItInAction example to sum the quantity first, and predict whether any case stops matching. Run it to check.',
      'Write one refactoring prompt that asks for a single, specific change, and explain why it is easier to review than "clean up this file".',
    ],
  },
  mistakes: [
    { mistake: 'Asking for a rewrite and calling it a refactor.', fix: 'Ask for one specific change, and keep the behavior the same.' },
    { mistake: 'Refactoring without tests that describe the current behavior.', fix: 'Write the tests first, including the edge cases, and run them after each step.' },
    { mistake: 'Letting a small cleanup grow into a redesign.', fix: 'Commit what works, and write the bigger change down as a separate planned task.' },
  ],
  quiz: [
    {
      question: 'What is the defining rule of refactoring?',
      options: [
        { text: 'Behavior stays the same while the structure changes', explanation: 'Yes. Same inputs should give the same outputs before and after.' },
        { text: 'The code gets new features', explanation: 'Adding features is not refactoring.' },
        { text: 'The code gets shorter no matter what', explanation: 'Length is not the rule. Behavior must stay the same.' },
        { text: 'The tests are deleted', explanation: 'Tests are what prove the behavior stayed the same.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        def total(items):
            return sum(i["price"] * i["quantity"] for i in items)
        print(total([{"price": 3, "quantity": 2}]))
      ` },
      options: [
        { text: '5', explanation: 'That would be price plus quantity, not the product.' },
        { text: '6', explanation: 'Yes. Three times two is six.' },
        { text: '3', explanation: 'That is the price alone.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why should refactoring happen in small steps?',
      options: [
        { text: 'So a failure points to one change, and reverting it loses only that step', explanation: 'Yes. Small steps keep problems easy to find and undo.' },
        { text: 'So the assistant has more chances to charge', explanation: 'Usage cost is not the reason for small steps.' },
        { text: 'So the code is never tested', explanation: 'Small steps are tested at each step. Skipping tests defeats the purpose.' },
        { text: 'So the file names stay the same', explanation: 'Names are often changed in refactoring. Small steps are about safety.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Refactor by keeping behavior the same, writing tests that describe the current behavior first, making one specific change at a time, and stopping when the next change becomes a redesign.',
  resources: [
    { title: 'Refactoring: Improving the Design of Existing Code', provider: 'Martin Fowler (book overview)', description: 'The standard reference on refactoring, with a catalog of small, safe changes.', url: 'https://martinfowler.com/books/refactoring.html' },
    { title: 'Python testing with pytest', provider: 'pytest', description: 'Writing tests that describe behavior, so refactors can be checked quickly.', url: 'https://docs.pytest.org/en/stable/' },
  ],
}

export default lesson
