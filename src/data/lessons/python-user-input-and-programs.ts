import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain how a program receives input, and why input is always text until you convert it',
    'Use if, elif, and else to choose between several responses',
    'Structure a small program with functions so that it can be tested and changed safely',
  ],
  bigIdea: 'A useful program listens, decides, and responds. Input arrives as text, so the program converts it to the type it needs, checks it, chooses a response with conditions, and prints the result. Putting that flow inside functions turns a one-off script into a small tool you can test and change.',
  whyItMatters: 'A library wants a program that tells a visitor how many books they may borrow, based on their age and whether they have an overdue book. The rules are simple, but a program that accepts "twelve" as a number crashes, and a program with tangled conditions gives the wrong answer for some visitors. Clear input handling and well-named functions make the rules easy to check against the library policy.',
  goalSections: [
    {
      heading: 'Input is text until you convert it',
      paragraphs: [
        'The input function pauses the program and waits for someone to type. Whatever they type comes back as a string, even if it looks like a number. The age "12" is text, and it cannot be added to or compared with a number until it is converted.',
        'Convert with int for whole numbers or float for decimals. Conversion can fail: int("twelve") raises an error, because the text is not a number. A careful program checks the input before converting it, or uses a loop that asks again until the answer is valid.',
        'Because a program can be tested without a person typing, it is better to write the logic in a function that takes the values as parameters. The input call then sits at the edge of the program, and the function can be tested directly.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          def parse_age(text):
              cleaned = text.strip()
              if cleaned.isdigit():
                  return int(cleaned)
              return None

          print(parse_age(" 12 "))
          print(parse_age("twelve"))
        `,
        output: '12\nNone',
      },
    },
    {
      heading: 'Choosing with if, elif, and else',
      paragraphs: [
        'An if statement runs its block only when its condition is True. An elif adds another check, tried only when the earlier ones were False. An else catches everything left over. Order matters, because the first True branch wins and the others are skipped.',
        'Write conditions that describe the rule in plain language. "Under thirteen may borrow three books" is clearer as a condition on age than a tangle of comparisons. When the rule has several parts, give each part a name, such as overdue or age_ok, and combine them.',
        'Check the edge cases. The rule for a child of exactly thirteen, or a person with no overdue book, must be correct too. Most mistakes in conditions happen at the boundaries, not in the middle of the range.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          def books_allowed(age, has_overdue):
              if has_overdue:
                  return 0
              elif age < 13:
                  return 3
              else:
                  return 5

          print(books_allowed(10, False))
          print(books_allowed(30, True))
          print(books_allowed(13, False))
        `,
        output: '3\n0\n5',
      },
    },
    {
      heading: 'Putting the program together',
      paragraphs: [
        'A small program has three parts: get the input, decide what it means, and show the result. Keep each part separate. The input part converts and checks, the decision part is a function with no input call, and the output part prints a clear sentence.',
        'Name the functions by what they do, such as parse_age and books_allowed. A reader should know what a function does from its name, and should be able to test it with a few values without running the whole program.',
        'Write a few test cases for the functions before you trust them. A test is a call with a known input and the output you expect. If a rule changes later, the tests show what else changed.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          parse_age(text): turns the typed text into a number, or None
          books_allowed(age, has_overdue): applies the borrowing rule
          main(): asks for the age and the overdue status, calls the two functions, and prints the answer
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A library borrowing rule with tests',
    intro: 'The program below combines a parser, a decision function, and three tests. The tests check the boundary at age thirteen and the overdue rule. Run it, then change the limit for overdue visitors and predict which test fails.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        def parse_age(text):
            cleaned = text.strip()
            return int(cleaned) if cleaned.isdigit() else None

        def books_allowed(age, has_overdue):
            if has_overdue:
                return 0
            elif age < 13:
                return 3
            return 5

        tests = [
            (books_allowed(12, False), 3),
            (books_allowed(13, False), 5),
            (books_allowed(30, True), 0),
        ]
        for got, expected in tests:
            print("pass" if got == expected else "FAIL", got, expected)
        print("parsed:", parse_age(" 7 "))
      `,
      output: 'pass 3 3\npass 5 5\npass 0 0\nparsed: 7',
    },
    steps: [
      { code: 'def parse_age(text):', explanation: 'Turns text from a person into a number, or None when the text is not a valid number.' },
      { code: 'if has_overdue: return 0', explanation: 'The overdue rule comes first, so it overrides the age rule for every visitor.' },
      { code: 'tests = [...]', explanation: 'Each test pairs a call with the expected answer, so a change in the rules is caught immediately.' },
    ],
  },
  tryIt: {
    instructions: [
      'Add a test to the seeItInAction example for an age of 13 with an overdue book, and predict the result. Run it to check.',
      'Write a function that takes a number of minutes and returns "short" below 30, "medium" up to 90, and "long" above that. Test three values.',
      'Write a program that asks for a number with input, converts it with int, and prints whether it is even or odd. Handle the case where the text is not a number.',
    ],
  },
  mistakes: [
    { mistake: 'Doing arithmetic on input without converting it.', fix: 'Convert with int or float first, and check the conversion can succeed.' },
    { mistake: 'Putting an elif after an else, or in an order that hides a rule.', fix: 'Order the checks from the most specific to the most general, and test the boundaries.' },
    { mistake: 'Writing the whole program as one block with no tests.', fix: 'Split the logic into functions, and test each one with known values.' },
  ],
  quiz: [
    {
      question: 'What type does input return?',
      options: [
        { text: 'A string, even when the text looks like a number', explanation: 'Yes. Input is always text until the program converts it.' },
        { text: 'An integer', explanation: 'Input returns text. Conversion to an integer is a separate step.' },
        { text: 'A list of words', explanation: 'Input returns the whole line as one string.' },
        { text: 'A boolean', explanation: 'Input returns the text typed, not True or False.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for an age of 13 with no overdue book?',
      code: { language: 'python', runnable: true, code: code`
        def books_allowed(age, has_overdue):
            if has_overdue:
                return 0
            elif age < 13:
                return 3
            else:
                return 5
        print(books_allowed(13, False))
      ` },
      options: [
        { text: '3', explanation: 'That is for ages below thirteen. The age is exactly thirteen.' },
        { text: '5', explanation: 'Yes. Thirteen is not less than thirteen, so the else branch runs.' },
        { text: '0', explanation: 'Zero is only for visitors with an overdue book.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why keep the logic in functions that do not call input?',
      options: [
        { text: 'So the rules can be tested with known values without someone typing', explanation: 'Yes. Functions that take parameters can be tested directly.' },
        { text: 'So the program runs faster', explanation: 'Structure is about clarity and testing, not speed.' },
        { text: 'Because input cannot be used in Python', explanation: 'Input works. The point is to keep the rules separate from the question.' },
        { text: 'So the program never shows output', explanation: 'Output is still needed. Separating logic makes it easier to check.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Input is text until you convert and check it, conditions choose the response in order, and functions with tests keep a small program correct when its rules change.',
  resources: [
    { title: 'More control flow tools', provider: 'Python.org', description: 'The official tutorial on if, elif, else, and other control flow tools.', url: 'https://docs.python.org/3/tutorial/controlflow.html' },
    { title: 'Input and output', provider: 'Python.org', description: 'The official tutorial on reading input and formatting output.', url: 'https://docs.python.org/3/tutorial/inputoutput.html' },
  ],
}

export default lesson
