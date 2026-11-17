import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Break a feature into steps that each produce one visible result',
    'Run the program after every step, and keep the step only when it works',
    'Use a short note in the project to record what each step changed',
  ],
  bigIdea: 'Work in small steps: one change, one run, one check. Each step should produce a result you can see, such as a printed list or a passing example. When a step fails, you know the problem is in the last change, which keeps the search short.',
  whyItMatters: 'You ask for a full reading list with search, sorting, saving and a menu in one request. The result is 200 lines that fail in four places. Fixing them means reading all 200 lines again. Five small steps with a run after each would have shown each failure as soon as it appeared. A small step also tells you what the next step should be, which keeps the plan clear.',
  goalSections: [
    {
      heading: 'Splitting a feature into visible steps',
      paragraphs: [
        'Start with the smallest piece that shows something. For the reading list, the first step might be adding one book and printing it. The second step adds a second book and prints both. Each step ends with output you can point to.',
        'A good step is small enough to read in a minute. If you cannot explain the change in one sentence, the step is too big. Split it again before you ask for the code.',
        'A step that fails on its first run is cheap to fix. A step that fails after five changes is expensive, because the cause could be any of them.',
        'Write the step list before you start. A short list such as add, list, mark read, and save gives you a map, and each item becomes a checkpoint in your log.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Step 1: add_book adds one book, and the program prints the list.
          Step 2: list_books prints each title on its own line.
          Step 3: mark_read changes the read field of one book.
          Step 4: the menu asks the user to choose an action.
        `,
      },
    },
    {
      heading: 'Running after every step',
      paragraphs: [
        'Run the program after each step, before you ask for the next one. A run takes seconds, and it catches problems while the last change is still fresh. Keep the run command in your notes, such as `python reading_list.py`, so it is always one command away.',
        'If the run fails, fix that failure before you add anything. Adding the next feature on top of a broken step makes the cause harder to see, because two changes now interact.',
        'Choose a step that you could explain in a sentence to someone who has never seen the project. That test keeps the step small enough to check.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'step_one.py',
        code: code`
          def add_book(books, title):
              books.append({"title": title, "read": False})
              return books

          books = []
          add_book(books, "Dune")
          for book in books:
              print(book["title"])
        `,
        output: 'Dune',
      },
    },
    {
      heading: 'Keeping a log of what changed',
      paragraphs: [
        'Write a short line for each step in a file such as `CHANGES.md`. Record what the step added and whether the run passed. The log helps you return to the project after a break, and it helps you explain the project to someone else later.',
        'A log also shows you which step to undo if something goes wrong. You can match a failed run to the last line in the log, then check that change first.',
        'Keep the first version boring. A plain list printed one title per line is enough to prove that the data moves through the program correctly.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          # CHANGES.md
          - Step 1: add_book adds one book and prints it. Run passed.
          - Step 2: list_books prints each title. Run passed.
          - Step 3: mark_read changes read to True. Run failed: read was not updated.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'The first step, run and checked',
    intro: 'This is the first small step for the reading list. It adds one book and prints the titles. Run it, and check the printed output before you ask for step two. Each change in this project is small enough that you can read the whole file in a minute.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'step_one.py',
      code: code`
        def add_book(books, title):
            books.append({"title": title, "read": False})
            return books

        books = []
        add_book(books, "Dune")
        for book in books:
            print(book["title"])
      `,
      output: 'Dune',
    },
    steps: [
      { code: 'def add_book(books, title):', explanation: 'The function receives the list and the title. It does one job: add a book to the list.' },
      { code: 'books.append({"title": title, "read": False})', explanation: 'Adds a dictionary for the new book, with `read` set to `False` as the goal describes.' },
      { code: 'books = []\nadd_book(books, "Dune")', explanation: 'Starts with an empty list and adds one book to it. The function changes the list in place.' },
      { code: 'for book in books:\n    print(book["title"])', explanation: 'Prints each title on its own line. The output `Dune` is the visible result that proves this step works.' },
    ],
  },
  tryIt: {
    instructions: [
      'Create `reading_list.py` and paste the first step above. Run it with `python reading_list.py` and confirm it prints Dune.',
      'Add a second call to `add_book` for another title, then run again. Confirm that both titles print.',
      'Write one line in `CHANGES.md` that says what you did and whether the run passed.',
    ],
  },
  mistakes: [
    { mistake: 'Asking for a full feature before any step has run.', fix: 'Start with the smallest step that prints something, and run it first.' },
    { mistake: 'Adding the next feature while a run is still failing.', fix: 'Fix the failure first. Two changes that interact are hard to untangle.' },
    { mistake: 'Relying on memory for what changed, then not knowing which change caused a bug.', fix: 'Write one line per step in a change log.' },
  ],
  quiz: [
    {
      question: 'Your program ran fine after step 2. You then added step 3, and it now prints an error. Where should you look first?',
      options: [
        { text: 'In the code from step 3, the most recent change', explanation: 'Yes. The error appeared after that change, so it is the first place to look.' },
        { text: 'In Python itself', explanation: 'Python is almost always fine. Start with the change that broke the run.' },
        { text: 'In the whole program, line by line from the top', explanation: 'That takes longer. The small step tells you where to start.' },
        { text: 'Nowhere, because errors fix themselves', explanation: 'Errors do not fix themselves. You have to find and change the cause.' },
      ],
      answer: 0,
    },
    {
      question: 'The code below adds two books to the same list, then prints the length of the list. What does it print?',
      code: { language: 'python', runnable: true, code: code`
        def add_book(books, title):
            books.append({"title": title, "read": False})
            return books

        books = []
        add_book(books, "Dune")
        add_book(books, "Emma")
        print(len(books))
      ` },
      options: [
        { text: '1', explanation: 'Two calls add two books, so the length is not 1.' },
        { text: '2', explanation: 'Yes. Both calls add to the same list, which then holds two dictionaries.' },
        { text: '0', explanation: 'The calls do add books, so the list is not empty.' },
        { text: 'Dune', explanation: 'That is a title. The code prints the length of the list, which is a number.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why keep a `CHANGES.md` log?',
      options: [
        { text: 'Python reads the log to run the program', explanation: 'Python does not read it. The log is for you and for anyone who reviews the project.' },
        { text: 'It shows which change to check first when a run fails', explanation: 'Yes. Matching a failure to the last logged change narrows the search.' },
        { text: 'It replaces the need to run the program', explanation: 'Running the program is still the only way to see whether it works.' },
        { text: 'It makes the assistant write better code', explanation: 'The log does not change the assistant. It helps you track your own steps.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Make each change small, run the program after each one, and keep a short log so a failure points to one cause.',
  resources: [
    { title: 'Python tutorial: Lists', provider: 'Python.org', description: 'How lists work in Python, including append and iterating through items.', url: 'https://docs.python.org/3/tutorial/datastructures.html' },
  ],
}

export default lesson
