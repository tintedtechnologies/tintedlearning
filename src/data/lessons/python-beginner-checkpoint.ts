import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Combine variables, lists, dictionaries, functions, conditions, loops, strings, and CSV files in one program',
    'Test the program\'s functions with known values before trusting its totals',
    'Explain how the program works, and what you would change next, in plain words',
  ],
  bigIdea: 'This checkpoint asks you to build a small command-line expense log. It stores entries, totals them by category, checks its own results, and reads and writes a CSV file. Every beginner lesson in this section appears in the program, so finishing it shows that the basics work together.',
  whyItMatters: 'A beginner who can write many small examples may still freeze when asked to build a whole program. This checkpoint makes the step from examples to a complete tool. The program is small enough to finish in an afternoon, and real enough that you can use it for your own money or your own projects.',
  goalSections: [
    {
      heading: 'Plan the program before you write it',
      paragraphs: [
        'Start with the questions the program must answer. How much did I spend in total? How much went on food? Can I add an entry, see the list, and save it for next time? Write these as a short list before any code.',
        'Choose the data shapes. Each expense is a dictionary with a date, a category, a description, and an amount. The whole log is a list of those dictionaries. A CSV file holds the same rows, so the program can save and reload them.',
        'Split the work into functions. One function adds an entry, one totals a category, and one saves and loads the CSV. A main part of the program asks the questions and prints the answers. Each function can then be tested alone.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          expenses = [
              {"date": "2026-11-01", "category": "food", "description": "lunch", "amount": 8.5},
              {"date": "2026-11-02", "category": "travel", "description": "bus", "amount": 2.75},
              {"date": "2026-11-03", "category": "food", "description": "groceries", "amount": 21.4},
          ]
          food = [e["amount"] for e in expenses if e["category"] == "food"]
          print("food entries:", len(food))
          print("food total:", round(sum(food), 2))
        `,
        output: 'food entries: 2\nfood total: 29.9',
      },
    },
    {
      heading: 'Build and test the functions',
      paragraphs: [
        'Write the add_expense function so that it takes the log, the category, the description, and the amount, and returns a new log with the entry added. Returning the new list rather than changing a global value makes the function easy to test.',
        'Write total_for_category so that it sums the amounts for one category and returns zero when there are none. Test it with an empty log, a log with one matching entry, and a log with entries in other categories. These three cases cover the situations that cause most bugs.',
        'Write the CSV functions with the csv module, following the pattern from the CSV lesson. Save the header first, then one row per expense. Load the rows back and convert the amount to a float. After saving, check that loading the file gives back the same total. Keep the file name in one constant at the top, so it is easy to change and easy to find.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          def add_expense(log, category, description, amount):
              return log + [{"category": category, "description": description, "amount": amount}]

          log = add_expense([], "food", "lunch", 8.5)
          log = add_expense(log, "travel", "bus", 2.75)
          print(len(log), log[-1]["category"])
        `,
        output: '2 travel',
      },
    },
    {
      heading: 'Use the program and explain it',
      paragraphs: [
        'Let the main part of the program run a few commands in a loop: add, total, and quit. Use input for the commands, and check that each amount converts to a number before adding it. A bad amount should produce a clear message and leave the log unchanged.',
        'When you finish, write a short explanation of the design. Name the data shapes, the functions, and the tests. Name one thing you would improve next, such as validating dates or adding a monthly summary. Keep the explanation short enough that another learner could follow it in five minutes.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          > add food 8.5 lunch
          Added: food, 8.50, lunch
          > total food
          Food total: 8.50
          > quit
          Saved 1 entry to expenses.csv
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Testing the total for a category',
    intro: 'The program below defines the total function and runs the three tests that matter most: an empty log, a matching entry, and entries in other categories. Run it. Every test should print pass. Then change the expected value in one test and predict the output.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        def total_for_category(expenses, category):
            return sum(e["amount"] for e in expenses if e["category"] == category)

        sample = [
            {"category": "food", "amount": 8.5},
            {"category": "travel", "amount": 2.75},
            {"category": "food", "amount": 21.4},
        ]
        tests = [
            (total_for_category([], "food"), 0),
            (round(total_for_category(sample, "food"), 2), 29.9),
            (total_for_category(sample, "books"), 0),
        ]
        for got, expected in tests:
            print("pass" if got == expected else "FAIL", got, expected)
      `,
      output: 'pass 0 0\npass 29.9 29.9\npass 0 0',
    },
    steps: [
      { code: 'sum(e["amount"] for e in expenses if e["category"] == category)', explanation: 'Adds the amounts for one category only. The generator keeps the loop short and readable.' },
      { code: 'tests = [...]', explanation: 'Each test is a call with a known answer. Together they cover an empty log, a match, and a category with no entries.' },
      { code: 'print("pass" if got == expected else "FAIL", got, expected)', explanation: 'Shows each result beside its expected value, so a failure is easy to spot and fix.' },
    ],
  },
  tryIt: {
    instructions: [
      'Add a fourth test to the seeItInAction example for a category that appears once with a decimal amount. Predict the result, then run it to check.',
      'Build the expense log using the plan above. Add at least five entries, save them to a CSV file, and load them back to check the total.',
      'Write a short explanation of your program, with its data shape, its functions, its tests, and one improvement you would make next.',
    ],
  },
  mistakes: [
    { mistake: 'Writing the whole program before testing any function.', fix: 'Write one function, test it with known values, and only then add the next.' },
    { mistake: 'Saving a total without checking the file reads back the same value.', fix: 'After saving, load the file and compare the total with the value in memory.' },
    { mistake: 'Accepting a bad amount without a message.', fix: 'Convert and check each amount, and report a clear message when it fails.' },
  ],
  quiz: [
    {
      question: 'What is the purpose of the empty-log test for total_for_category?',
      options: [
        { text: 'It checks that the function returns zero when there is nothing to add', explanation: 'Yes. An empty input is a common edge case that bugs often hide.' },
        { text: 'It checks that the file is saved', explanation: 'The empty-log test does not involve a file.' },
        { text: 'It makes the program run faster', explanation: 'Tests check correctness, not speed.' },
        { text: 'It checks the color of the output', explanation: 'Color is not part of this function.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the food total?',
      code: { language: 'python', runnable: true, code: code`
        expenses = [{"category": "food", "amount": 8.5}, {"category": "food", "amount": 21.4}]
        print(round(sum(e["amount"] for e in expenses if e["category"] == "food"), 2))
      ` },
      options: [
        { text: '29.9', explanation: 'Yes. Eight point five plus twenty-one point four is twenty-nine point nine.' },
        { text: '8.5', explanation: 'That is only the first entry. Both food entries are added.' },
        { text: '2', explanation: 'That is the number of entries, not the total of their amounts.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why does add_expense return a new log rather than changing a global variable?',
      options: [
        { text: 'So the function can be tested alone with known inputs and outputs', explanation: 'Yes. A function that only depends on its inputs is easy to test and to reason about.' },
        { text: 'So the log can never be saved', explanation: 'Returning a new log does not prevent saving it.' },
        { text: 'Because Python does not allow global variables', explanation: 'Python allows globals, but avoiding them keeps functions testable.' },
        { text: 'So the amount is stored as text', explanation: 'The return value does not change how amounts are stored.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A complete small program combines data shapes, functions, conditions, loops, and files, and it is trustworthy only when each function has tests and the saved data is checked after it is written.',
  resources: [
    { title: 'Python tutorial', provider: 'Python.org', description: 'The official tutorial to review any topic used in this checkpoint.', url: 'https://docs.python.org/3/tutorial/' },
    { title: 'Python beginner guide', provider: 'Python.org', description: 'Beginner paths, setup guidance, and community resources for continuing your practice.', url: 'https://wiki.python.org/moin/BeginnersGuide' },
  ],
}

export default lesson
