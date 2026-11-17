import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Write a request that names the inputs, the outputs and the rules of a function',
    'Add examples with exact expected results, so you can test the answer',
    'Ask for one change at a time, and say what must stay the same',
  ],
  bigIdea: 'The assistant can only build what you describe, so a good request states what goes in, what comes out and what must not change. Examples with exact expected results turn a vague wish into something you can test. Asking for one change at a time keeps the result easy to check.',
  whyItMatters: 'You ask an assistant to "add a way to mark books as read." It changes the function that adds books, renames a field and breaks the list command. The request was reasonable, but it did not say what must stay the same. A precise request would have named the field, the function and the existing behavior to keep.',
  goalSections: [
    {
      heading: 'Naming inputs, outputs and rules',
      paragraphs: [
        'A request works best when it reads like a short specification. Name the function, its inputs, what it returns or prints, and any rules. For the reading list, you might ask for a function `add_book(books, title, author)` that returns a new list with the book added, with `read` set to `False`.',
        'Naming the types helps too. Say that the title and author are text, and that the list holds dictionaries. The assistant then avoids guessing, and you can read the result against your own description.',
        'Write the types in plain words, such as text for a title, and say what a missing value should look like. A missing author, for example, might be an empty string or a clear message.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Write a Python function add_book(books, title, author).
          - books is a list of dictionaries with the keys title, author and read.
          - It returns the list with one new dictionary added.
          - The new book has read set to False.
          - Do not change the function list_books.
        `,
      },
    },
    {
      heading: 'Adding examples with exact results',
      paragraphs: [
        'An example shows one input and its exact output. "Adding Dune by Frank Herbert to an empty list gives one book, with read set to False" is an example you can check. A vague phrase such as "it should work" is not.',
        'Write the examples as code when you can. A check such as `assert` stops the program if the result is wrong. When the assistant changes the code later, the check tells you right away whether the behavior still holds.',
        'Examples are most useful when they include an edge case, such as an empty list. The edge case often reveals the gap that a general description hid. Write one example for each rule in the request, not only the happy path. Keep each example short, so a failure points to one behavior.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'examples.py',
        code: code`
          def add_book(books, title, author):
              return books + [{"title": title, "author": author, "read": False}]

          books = add_book([], "Dune", "Frank Herbert")
          print(books)
          assert len(books) == 1
          assert books[0]["read"] is False
        `,
        output: "[{'title': 'Dune', 'author': 'Frank Herbert', 'read': False}]",
      },
    },
    {
      heading: 'Asking for one change at a time',
      paragraphs: [
        'A request with five changes gives you five things to check at once. If one breaks, you cannot tell which change caused it. Ask for one change, run the program, then ask for the next. Each step stays small enough to read.',
        'Say what must stay the same. "Keep the function names and the output format of list_books" stops the assistant from rewriting parts you already tested. This is the most useful sentence in many requests.',
        'Ask for the change, then check it, then ask for the next. Each cycle is short, and it keeps the project under your control.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Step 1: Add the function add_book with the examples above.
          Step 2: Run the examples. Paste the output here if one fails.
          Step 3 (after step 2 passes): Add the function mark_read(books, title).
          Keep add_book exactly as it is.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'An example that checks the request',
    intro: 'Here is a request turned into code, with an example that checks it. The function returns a new list, and the asserts confirm the book was added with `read` set to `False`. Run the file to see the printed list and check that no assert fails. Read the assert lines first, because they state the rule in plain code.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'examples.py',
      code: code`
        def add_book(books, title, author):
            return books + [{"title": title, "author": author, "read": False}]

        books = add_book([], "Dune", "Frank Herbert")
        print(books)
        assert len(books) == 1
        assert books[0]["read"] is False
      `,
      output: "[{'title': 'Dune', 'author': 'Frank Herbert', 'read': False}]",
    },
    steps: [
      { code: 'def add_book(books, title, author):', explanation: 'The name and inputs come straight from the request, so the code matches the description.' },
      { code: 'return books + [{"title": title, "author": author, "read": False}]', explanation: 'Builds a new list with the old books and one new dictionary. The `read` value is `False`, as the request asked.' },
      { code: 'books = add_book([], "Dune", "Frank Herbert")', explanation: 'Calls the function with an empty list, which matches the example in the request.' },
      { code: 'assert books[0]["read"] is False', explanation: 'Stops the program with an error if the new book is not marked unread. The check turns a sentence in the request into a rule the computer enforces.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write your own request for a `list_books(books)` function that prints each title on its own line.',
      'Add one example that gives the exact output for two books, then ask an assistant for the code.',
      'Run the example. If it fails, paste the error and the request back, and ask for a fix to that one problem only.',
    ],
  },
  mistakes: [
    { mistake: 'Asking for many changes in one request.', fix: 'Ask for one change, check it, then ask for the next.' },
    { mistake: 'Describing a result with words such as "works well" or "looks nice".', fix: 'Describe the exact output, such as the text printed or the dictionary returned.' },
    { mistake: 'Not saying what must stay the same, so unrelated code gets rewritten.', fix: 'Add a line such as "Keep list_books exactly as it is."' },
  ],
  quiz: [
    {
      question: 'Which request is easiest to check?',
      options: [
        { text: '"Make the book list nicer."', explanation: 'Nicer has no test. Nobody can say whether the result meets the request.' },
        { text: '"add_book(books, title, author) returns a new list with one more dictionary, and read is False."', explanation: 'Yes. It names the function, the inputs, the output and the rule, so you can test each part.' },
        { text: '"Make it fast and secure and simple."', explanation: 'Those words describe qualities without a test. They do not say what the function should return.' },
        { text: '"Do whatever you think is best."', explanation: 'That gives the assistant no rules, so the result cannot be checked.' },
      ],
      answer: 1,
    },
    {
      question: 'You run the example below. What happens?',
      options: [
        { text: 'It prints passed and finishes with no error', explanation: 'Yes. The book is added and marked unread, so both asserts pass and the last line runs.' },
        { text: 'It prints nothing', explanation: 'The `print` line runs, so the word passed appears.' },
        { text: 'It stops with an error about the read field', explanation: 'The read field is `False`, so the assert passes. The error would only appear if the value were wrong.' },
        { text: 'It adds two books', explanation: 'The function is called once with an empty list, so one book is added.' },
      ],
      answer: 0,
      code: { language: 'python', runnable: true, code: code`
        def add_book(books, title, author):
            return books + [{"title": title, "author": author, "read": False}]

        books = add_book([], "Dune", "Frank Herbert")
        assert len(books) == 1
        assert books[0]["read"] is False
        print("passed")
      ` },
    },
    {
      question: 'Why ask for one change at a time?',
      options: [
        { text: 'The assistant cannot write more than one function at a time', explanation: 'It can write many functions. The issue is checking the result.' },
        { text: 'If something breaks, you know which change caused it', explanation: 'Yes. Small steps make a failure easy to trace to one change.' },
        { text: 'Python runs more slowly with big requests', explanation: 'Speed is not the reason. The reason is that small changes are easier to check.' },
        { text: 'It is required by Python', explanation: 'Python has no such rule. This is a habit that makes your work safer.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Describe inputs, outputs and rules, add examples with exact results, and ask for one change at a time while saying what must stay the same.',
  resources: [
    { title: 'Python documentation: assert statement', provider: 'Python.org', description: 'The official reference for assert, which checks a condition and stops the program if it is false.', url: 'https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement' },
  ],
}

export default lesson
