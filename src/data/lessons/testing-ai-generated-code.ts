import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Write checks for normal input, empty input and bad input',
    'Turn a check into a small test file that runs with one command',
    'Decide which behavior to test first, so the checks protect what matters most',
  ],
  bigIdea: 'A test runs your code with a known input and checks the output against the answer you expect. Good tests cover normal input, the empty case and a bad input. Written before or right after generated code, they tell you whether the code does what you asked, even after later changes.',
  whyItMatters: 'The assistant changes the function that marks a book as read. Everything still looks fine in the menu, but the list command now shows the wrong count. A test that checks the count after marking a book would have failed at once, before you noticed the bad output. Tests are the cheapest way to find a broken count before a user does.',
  goalSections: [
    {
      heading: 'Checking normal, empty and bad input',
      paragraphs: [
        'A normal input checks the main job. Adding one book to an empty list should give a list with one book. An empty input checks the edge case. Counting books in an empty list should give zero, not an error. A bad input checks the defensive code, such as an empty title that the tool should refuse.',
        'Write all three kinds for each important function. Most generated bugs appear in the empty and bad cases, because the assistant wrote the code for the normal case first.',
        'Test the behavior you care about, not the exact code. A good test still passes after you rewrite the function, as long as the behavior stays the same.',
        'Run the tests after every change, not only before you share the project.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'checks.py',
        code: code`
          def count_unread(books):
              return sum(1 for book in books if not book["read"])

          assert count_unread([]) == 0
          assert count_unread([{"title": "Dune", "read": False}]) == 1
          assert count_unread([{"title": "Emma", "read": True}]) == 0
          print("All checks passed")
        `,
        output: 'All checks passed',
      },
    },
    {
      heading: 'Putting checks in a test file',
      paragraphs: [
        'Move the checks into a file whose name starts with `test_`, such as `test_reading_list.py`. Each check becomes a function whose name says what it tests, such as `test_empty_list_has_no_unread_books`. The pytest tool finds these files and runs each test function for you.',
        'Install pytest once in your environment, then run `python -m pytest` from the project folder. A passing run prints a summary. A failing run shows the expected value, the actual value and the line that failed, which tells you what to fix.',
        'A test that is hard to write is often a sign that the function does too much. Splitting the function usually makes the test easier to write and read.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          # test_reading_list.py
          from reading_list import count_unread

          def test_empty_list_has_no_unread_books():
              assert count_unread([]) == 0

          def test_one_unread_book_counts_as_one():
              assert count_unread([{"title": "Dune", "read": False}]) == 1
        `,
      },
    },
    {
      heading: 'Choosing what to test first',
      paragraphs: [
        'You cannot test everything, so start with the behavior that would hurt most if it broke. For the reading list, that is saving and loading the file, because losing data is worse than a wrong count. Test that behavior before the menu text.',
        'Add a test every time you fix a bug. The test records the mistake, so the same bug cannot quietly return after a later change. Over time, the tests become a record of what the tool promises to do.',
        'Keep each test independent. A test that depends on the result of another test fails for the wrong reason and hides the real bug. Keep the test names and the failure messages readable, so a red run tells you what to fix at a glance.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Priority order for the reading list:
          1. Saving and loading books.json without losing a title
          2. Marking a book read changes only that book
          3. Counting unread books, including the empty list
          4. Menu wording
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Three checks for a counting function',
    intro: 'This function counts the unread books. The three asserts cover the empty list, one unread book and one read book. Run the file. If every assert passes, the program prints the final line. Each assert line is a rule. If any rule is false, the program stops at that line.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'checks.py',
      code: code`
        def count_unread(books):
            return sum(1 for book in books if not book["read"])

        assert count_unread([]) == 0
        assert count_unread([{"title": "Dune", "read": False}]) == 1
        assert count_unread([{"title": "Emma", "read": True}]) == 0
        print("All checks passed")
      `,
      output: 'All checks passed',
    },
    steps: [
      { code: 'def count_unread(books):', explanation: 'The function takes the list of book dictionaries and returns a number.' },
      { code: 'return sum(1 for book in books if not book["read"])', explanation: 'Adds 1 for each book whose `read` value is `False`. An empty list gives a sum of 0.' },
      { code: 'assert count_unread([]) == 0', explanation: 'The empty case. If the function raised an error or returned something else, the program would stop here.' },
      { code: 'assert count_unread([{"title": "Emma", "read": True}]) == 0', explanation: 'A read book should not count as unread. This check covers the other side of the condition.' },
    ],
  },
  tryIt: {
    instructions: [
      'Create `reading_list.py` with the `count_unread` function, and `test_reading_list.py` with the three checks as test functions.',
      'Run `python -m pytest` and confirm that three tests pass.',
      'Break the function on purpose by changing `not book["read"]` to `book["read"]`. Run the tests again and read the failure, then change the code back.',
    ],
  },
  mistakes: [
    { mistake: 'Testing only the normal case.', fix: 'Add the empty list and one bad input for every function that matters.' },
    { mistake: 'Writing a test that always passes, such as one that checks a value against itself.', fix: 'Make each test compare the output of the code with an answer you worked out by hand.' },
    { mistake: 'Changing the test to match a wrong output.', fix: 'When a test fails, decide which side is wrong, then fix the code unless the expected answer was wrong.' },
  ],
  quiz: [
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        def count_unread(books):
            return sum(1 for book in books if not book["read"])

        assert count_unread([]) == 0
        print("passed")
      ` },
      options: [
        { text: 'passed', explanation: 'Yes. The empty list gives 0, so the assert passes and the print line runs.' },
        { text: 'An AssertionError', explanation: 'That happens only when the check is false. Here the function returns 0, which is the expected answer.' },
        { text: '2', explanation: 'The program prints only the word passed. It does not print the count.' },
        { text: 'Nothing', explanation: 'The print line runs after the assert passes, so the word appears.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Which test name best describes the behavior it checks?',
      options: [
        { text: '`test_1`', explanation: 'The name says nothing about the behavior, so a failing run is hard to read.' },
        { text: '`test_empty_list_has_no_unread_books`', explanation: 'Yes. The name tells you the case and the expected result.' },
        { text: '`test_it_works`', explanation: 'That does not name a case, so it is too vague to help.' },
        { text: '`test_main`', explanation: 'It does not say which behavior is checked.' },
      ],
      answer: 1,
    },
    {
      question: 'A test fails and you are sure the expected answer is correct. What should you do?',
      options: [
        { text: 'Change the expected answer to match the output', explanation: 'That hides the bug. Only change the expected answer when you find that it was wrong.' },
        { text: 'Delete the test', explanation: 'The failing test is evidence of a bug. Deleting it hides the problem.' },
        { text: 'Fix the function so it returns the expected answer', explanation: 'Yes. When the expected answer is right, the code is wrong, so fix the code.' },
        { text: 'Ignore it, because tests are optional', explanation: 'A failing test that you ignore is a bug you have decided to keep.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'Test normal, empty and bad input with checks that compare against answers you worked out, and fix the code when a trusted test fails.',
  resources: [
    { title: 'pytest documentation', provider: 'pytest', description: 'Writing and running tests that check the behavior of generated code.', url: 'https://docs.pytest.org/en/stable/' },
    { title: 'pytest documentation: Get started', provider: 'pytest', description: 'How to write a test file, run pytest and read a failure report.', url: 'https://docs.pytest.org/en/stable/getting-started.html' },
  ],
}

export default lesson
