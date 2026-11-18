import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Read a traceback and find the line and the exception that caused the error',
    'Write a short bug report with the exact error, the input and the expected result',
    'Reproduce the bug with the smallest input that still fails, before you ask for a fix',
  ],
  bigIdea: 'An error message tells you where and what went wrong. Read the last line for the exception name and the line above it for the place in your code. A good bug report gives the assistant the same facts: the exact error, the input that caused it and what you expected instead.',
  whyItMatters: 'You paste "it does not work" into the assistant, and it rewrites three functions. The bug is still there, and now two other things are broken. The same problem explained with the traceback, the input and the expected result would have produced a one-line fix. The first request is the most important one, because a vague first message usually leads to several rounds of guessing.',
  goalSections: [
    {
      heading: 'Reading a traceback',
      paragraphs: [
        'A traceback lists the calls that led to the error, with the newest one at the bottom. The last line names the exception, such as `KeyError`, and gives a short reason. Start there. The line above it, with the file name and line number, shows where the error happened.',
        'The traceback names the place where Python noticed the problem, which is not always where the mistake was made. A missing key may be caused by data that was saved incorrectly earlier. Check the value that caused the error before you change the line that raised it.',
        'The error text is evidence. Copy it exactly, because a paraphrase can drop the one word that identifies the problem.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'key_error.py',
        raises: 'KeyError',
        code: code`
          book = {"title": "Dune"}
          print(book["author"])
        `,
      },
    },
    {
      heading: 'Writing a useful bug report',
      paragraphs: [
        'A useful report has three parts: the exact error text, the input that caused it, and the result you expected. Copy the error exactly, including the file name and line number. Describe the input as values, not as a story, so the assistant can reproduce the case.',
        'Add the code of the function that fails, and nothing else. Long pastes hide the relevant line. A focused report gets a focused fix.',
        'Before you change anything, print the value that the error names. A print line shows what the data really holds, which often explains the error in one step. A sentence about the data is more useful than a sentence about the code.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Error:    KeyError: 'author' in reading_list.py, line 12
          Input:    add_book({"title": "Dune"}) and then print_book(book)
          Expected: print_book prints "Dune by unknown author" when author is missing
          Code:     the print_book function only
        `,
      },
    },
    {
      heading: 'Reproducing the bug first',
      paragraphs: [
        'Reproduce means making the bug happen again on purpose, with the smallest input that still fails. Shrink the input until removing anything else makes the error disappear. A small reproduction is easy to explain and easy to test.',
        'Once you have a small reproduction, keep it as a test. When the fix works, the test keeps the bug from coming back, which connects this lesson to the testing lesson before it.',
        'Keep a note of each attempt and its result. If the assistant suggests three fixes, the note tells you which one changed the behavior and which did nothing. The fix you choose should match the cause, not only the symptom.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'reproduce.py',
        raises: 'KeyError',
        code: code`
          def print_book(book):
              print(book["title"] + " by " + book["author"])

          print_book({"title": "Dune"})
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Reading a KeyError from start to finish',
    intro: 'This program fails because the dictionary has no `author` key. Run it, read the error from the bottom up, then find the fix. The fix is to handle the missing key, not to guess a value. Watch what the traceback names before you look at the code.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'key_error.py',
      raises: 'KeyError',
      code: code`
        book = {"title": "Dune"}
        print(book["author"])
      `,
    },
    steps: [
      { code: 'book = {"title": "Dune"}', explanation: 'Creates a dictionary with one key, `title`. There is no `author` key anywhere in this data.' },
      { code: 'print(book["author"])', explanation: 'Asks for the value stored under `author`. The line is where Python notices the problem.' },
      { code: 'KeyError: \'author\'', explanation: 'The last line of the traceback names the exception and the missing key. Reading it tells you the problem is a missing key, not a broken print.' },
      { code: 'print(book.get("author", "unknown author"))', explanation: 'The fix: `get` returns a default when the key is missing. The data is still incomplete, but the program no longer crashes.' },
    ],
  },
  tryIt: {
    instructions: [
      'Run `key_error.py` and copy the last line of the traceback exactly.',
      'Write a three-part bug report for it: the error, the input and the expected result.',
      'Change the line to use `get` with the default `unknown author`, run it again and confirm it prints without an error.',
    ],
  },
  mistakes: [
    { mistake: 'Pasting "it does not work" and asking the assistant to fix everything.', fix: 'Paste the exact error, the input and the expected output, then ask for one fix.' },
    { mistake: 'Changing the line named in the traceback without checking the data that caused the error.', fix: 'Print the value that is used, to see what the data really contains.' },
    { mistake: 'Accepting a fix that hides the error, such as wrapping everything in a broad try block.', fix: 'Handle the specific case you expect, and let unexpected errors show up.' },
  ],
  quiz: [
    {
      question: 'A traceback ends with `KeyError: \'author\'` and points to line 12. Where do you look first?',
      options: [
        { text: 'The first line of the traceback, which is usually the least helpful', explanation: 'The first lines show the calls that led up to the error. The last line gives the exception.' },
        { text: 'Line 12, and the dictionary that is used there', explanation: 'Yes. The line shows where the error happened, and the dictionary is the data that lacks the key.' },
        { text: 'The Python installation', explanation: 'Python is almost always fine. The traceback points to your data and code.' },
        { text: 'The operating system settings', explanation: 'The error comes from a missing key in your program. System settings are not involved.' },
      ],
      answer: 1,
    },
    {
      question: 'Which bug report gives the assistant the most to work with?',
      options: [
        { text: '"Books are broken again."', explanation: 'It names no error, no input and no expected result.' },
        { text: '"KeyError: author at line 12, with the book {\'title\': \'Dune\'}, expected unknown author."', explanation: 'Yes. It gives the exact error, the input and the expected result.' },
        { text: '"Please make it better."', explanation: 'That gives no facts to reproduce or test.' },
        { text: '"Here are 400 lines. Find it."', explanation: 'A long paste hides the relevant part. Give the failing function and the input.' },
      ],
      answer: 1,
    },
    {
      question: 'What does `book.get("author", "unknown author")` return when `author` is missing?',
      options: [
        { text: 'An error', explanation: 'That is what `book["author"]` does. `get` returns the default instead.' },
        { text: 'The text "unknown author"', explanation: 'Yes. `get` returns the default when the key is not in the dictionary.' },
        { text: 'The title', explanation: 'The title is a different key. `get` only looks up the key it is given.' },
        { text: 'None, with no message', explanation: 'That is only the result when no default is given. This call gives a default.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Read the last line of a traceback, reproduce the bug with the smallest input, and give the assistant the exact error, the input and the expected result.',
  resources: [
    { title: 'Debugging in VS Code', provider: 'Visual Studio Code documentation', description: 'How to set breakpoints and inspect values while a program runs.', url: 'https://code.visualstudio.com/docs/editor/debugging' },
    { title: 'Python tutorial: Errors and exceptions', provider: 'Python.org', description: 'How Python reports errors, and how exceptions such as KeyError are raised.', url: 'https://docs.python.org/3/tutorial/errors.html' },
  ],
}

export default lesson
