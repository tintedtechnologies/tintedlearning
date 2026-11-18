import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Recognize the signs that a project needs a design before more prompting',
    'Sketch the data format, the functions and the files on one page before you change code',
    'Give the assistant the design, then ask it to build one part at a time',
  ],
  bigIdea: 'Prompting works well until the project has several parts that depend on each other. When each fix breaks another part, the code needs a design. A short design, with the data format, the functions and the files, gives both you and the assistant one shared picture to build from.',
  whyItMatters: 'Your reading list started as one file. After twenty requests it has three versions of the book data, two menus and a save function that writes a different format each time. Each fix has made the next one harder. A one-page design, written before the next change, would have stopped the drift. A design written once takes less time than a week of patches to the same two functions. Writing the design is the cheapest step in the whole project.',
  goalSections: [
    {
      heading: 'Recognizing the signs',
      paragraphs: [
        'Stop prompting and design when the same bug returns after a fix, when a change in one place breaks an unrelated feature, or when you cannot say what a function is supposed to return. Those signs mean the parts no longer agree on how the data looks. Compare the two parts that disagree, and write down the shape each one expects. A short note like that is often enough to end the loop.',
        'Another sign is a request that keeps growing. If the goal file needs a new section every week, the project has outgrown its first shape. Pause and write down what it is now.',
        'The design is not a document for its own sake. It is the agreement that makes the next change predictable.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Warning signs for the reading list:
          - Fixing save_books breaks list_books
          - Two functions read the book's title from different keys
          - Nobody can say what add_book returns without reading it
        `,
      },
    },
    {
      heading: 'Sketching the data, functions and files',
      paragraphs: [
        'A short design answers three questions. What does one book look like? Which functions handle books, and what does each one receive and return? Which files store the data, and in what format? Write the answers in a `DESIGN.md` file, in plain sentences and short lists.',
        'Keep the design to one page. A design that needs ten pages is too detailed for the first version. The aim is to agree on the shape of the data, so each function can be written against it.',
        'Look at the data first. Most design problems start when two parts of the program store the same fact in different shapes. Update the design when the code changes. A design that describes an old version is worse than no design, because it misleads the next reader.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          # DESIGN.md
          Book: a dictionary with keys title (text), author (text), read (True or False)
          Storage: books.json, a list of Book dictionaries, saved after each change
          Functions:
            add_book(books, title, author) -> new list
            mark_read(books, title) -> new list
            list_books(books) -> prints one line per book
          Files: reading_list.py (all functions), test_reading_list.py (tests)
        `,
      },
    },
    {
      heading: 'Building from the design, one part at a time',
      paragraphs: [
        'Give the assistant the design file and the goal file, then ask for one function at a time, following the design exactly. If the assistant suggests a different shape for the data, decide whether the design should change. Update the design first, then the code, so they never disagree.',
        'Rebuild the messy part from the design instead of patching it. Keep the working parts, replace the broken ones, and run the tests after each replacement.',
        'Start the design with what the program must do, then add the parts that do it. A design that begins with files and folders often misses the behavior.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Request to the assistant:
          "Using DESIGN.md and GOAL.md, rewrite save_books and load_books only.
          Books are saved as a JSON list. Keep add_book and list_books unchanged.
          Show me the new save_books and load_books, and nothing else."
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Writing the data shape before the code',
    intro: 'This short Python file follows the design: a book is a dictionary with three keys, and the functions all use those same keys. Run it, then compare each line with the design sentences above it.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'design_check.py',
      code: code`
        def add_book(books, title, author):
            return books + [{"title": title, "author": author, "read": False}]

        def mark_read(books, title):
            return [dict(book, read=True) if book["title"] == title else book for book in books]

        books = add_book([], "Dune", "Frank Herbert")
        books = mark_read(books, "Dune")
        print(books[0]["read"])
      `,
      output: 'True',
    },
    steps: [
      { code: 'def add_book(books, title, author):', explanation: 'Matches the design: the function receives the list and returns a new list. Each function follows one written rule.' },
      { code: 'return books + [{"title": title, "author": author, "read": False}]', explanation: 'A book has the three keys from the design, with `read` set to False.' },
      { code: 'return [dict(book, read=True) if book["title"] == title else book for book in books]', explanation: 'Changes only the book with the matching title. Every other book passes through unchanged, which the design requires.' },
      { code: 'print(books[0]["read"])', explanation: 'Checks the result against the design. The output `True` shows the shared data shape works end to end.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a `DESIGN.md` for the reading list with the book shape, the storage format, the function names and the files. Keep it to one page.',
      'Check the design against the code: every function should use the same keys for a book. Fix any mismatch in the design or the code, and note which one you changed.',
      'Ask the assistant to build one function from the design, then run the tests.',
    ],
  },
  mistakes: [
    { mistake: 'Continuing to prompt when the same bug keeps returning.', fix: 'Stop, write the design, and rebuild the broken part from it.' },
    { mistake: 'Writing a design so detailed that it never gets used.', fix: 'Keep the design to one page with the data shape, the functions and the files.' },
    { mistake: 'Changing the code and forgetting the design, so they disagree.', fix: 'Update the design first when the plan changes, then the code.' },
  ],
  quiz: [
    {
      question: 'After each fix, a different feature breaks. What is the best next step?',
      options: [
        { text: 'Ask for another fix to the newest breakage', explanation: 'That pattern usually continues. The parts disagree, so the design needs attention.' },
        { text: 'Write a short design of the data, functions and files, then rebuild the broken part from it', explanation: 'Yes. A shared design gives every part one shape to follow.' },
        { text: 'Delete the project and start over without writing anything down', explanation: 'That loses working parts. A design helps you keep what works.' },
        { text: 'Turn off the tests so the features stop reporting errors', explanation: 'Turning off tests hides the problem. The tests are useful evidence.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        def mark_read(books, title):
            return [dict(book, read=True) if book["title"] == title else book for book in books]

        books = [{"title": "Dune", "read": False}, {"title": "Emma", "read": False}]
        books = mark_read(books, "Dune")
        print(books[1]["read"])
      ` },
      options: [
        { text: 'True', explanation: 'Only the book titled Dune changes. Emma is passed through unchanged.' },
        { text: 'False', explanation: 'Yes. Emma does not match the title, so its read value stays False.' },
        { text: 'Dune', explanation: 'That is a title. The code prints the read value of the second book.' },
        { text: 'An error', explanation: 'The code is valid, and it runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why should you update `DESIGN.md` before you change the code when the plan changes?',
      options: [
        { text: 'Python reads the design file to run the program', explanation: 'Python does not read the design file. It is a record for you and the assistant.' },
        { text: 'So the design and the code never disagree, which keeps the next request accurate', explanation: 'Yes. A design that matches the code gives the assistant a true picture of the project.' },
        { text: 'So the file is longer', explanation: 'Length is not the goal. Accuracy is what matters.' },
        { text: 'Because the assistant refuses to read code', explanation: 'The assistant reads code. The design helps it understand intent.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'When fixes keep breaking each other, write a one-page design of the data, functions and files, and rebuild from it one part at a time.',
  resources: [
    { title: 'Architecture decision records', provider: 'ADR GitHub organization', description: 'A lightweight way to record a design decision before building more.', url: 'https://adr.github.io/' },
    { title: 'Python tutorial: Dictionaries', provider: 'Python.org', description: 'How dictionaries store keyed data, which is the shape used for each book in this lesson.', url: 'https://docs.python.org/3/tutorial/datastructures.html#dictionaries' },
  ],
}

export default lesson
