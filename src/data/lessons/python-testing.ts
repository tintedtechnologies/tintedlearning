import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Write a test that checks one behavior of a function with `assert`',
    'Run a whole file of tests with pytest and read what failed',
    'Choose test cases that cover normal inputs, edge cases and errors',
  ],
  bigIdea: "A test is a small piece of code that runs your code with a known input and checks that the output is what you expect. Once written, tests can be run again in seconds after every change. They turn \"I think it still works\" into \"I checked, and it still works\".",
  whyItMatters: "You change a shipping-cost function to add a new discount, try one order by hand, and it looks right. A week later a customer complains that orders of exactly $50 are charged shipping when they should be free. Your change broke a case you never re-checked. A set of tests, run after every change, would have caught it before any customer saw it.",
  goalSections: [
    {
      heading: 'Writing a test with assert',
      paragraphs: [
        "`assert` checks that something is true. If it is, nothing happens. If it is false, Python stops with an `AssertionError`. A test is a function whose name starts with `test_` and which uses `assert` to compare the actual result with the expected one.",
        "Each test should check one behavior, and its name should say which, such as `test_free_shipping_at_fifty`. When it fails, the name alone tells you what broke.",
        "Work out the expected value by hand or from the requirements, never by copying whatever the function currently returns. Otherwise the test just repeats the bug.",
      ],
      example: {
        language: 'python',
        code: code`
          def add_tax(price, rate):
              return round(price * (1 + rate), 2)

          def test_add_tax_basic():
              assert add_tax(100, 0.2) == 120

          def test_add_tax_rounds_to_cents():
              assert add_tax(9.99, 0.08) == 10.79

          test_add_tax_basic()
          test_add_tax_rounds_to_cents()
          print("both tests passed")
        `,
        output: 'both tests passed',
      },
    },
    {
      heading: 'Running tests with pytest',
      paragraphs: [
        "Calling every test by hand gets tedious. pytest is a popular package that finds and runs them for you. Put tests in files named `test_something.py`, and run `python -m pytest` in your project folder. It finds every function starting with `test_`, runs each one, and reports the results.",
        "A passing test shows as a dot. A failing one shows as an F, followed by a report with the test name, the line that failed and the actual values on both sides of the comparison. Read the report from the bottom, as you would a traceback.",
        "pytest is installed with `python -m pip install pytest` inside your virtual environment. It cannot run in the browser playground, so the playground exercise calls the tests directly instead.",
      ],
      example: {
        language: 'text',
        code: code`
          $ python -m pytest
          ..F                                                     [100%]
          ___________________ test_free_shipping_at_fifty ___________________
              def test_free_shipping_at_fifty():
          >       assert shipping_cost(50) == 0
          E       assert 4.99 == 0
          E        +  where 4.99 = shipping_cost(50)
          test_shop.py:9: AssertionError
          1 failed, 2 passed in 0.03s
        `,
      },
    },
    {
      heading: 'Choosing what to test',
      paragraphs: [
        "Testing only the obvious case catches the fewest bugs. Aim for three kinds of case. Normal cases are typical inputs. Edge cases sit right on a boundary: exactly $50, zero items, an empty list, the first and last day of a month. Error cases are inputs that should be rejected, such as a negative price.",
        "Bugs gather at boundaries, because that is where `<` and `<=` get mixed up. If a rule changes at 50, test 49.99, 50 and 50.01.",
        "For errors, the test should check that the function refuses bad input loudly. In pytest you write `with pytest.raises(ValueError):` around the call. Without pytest, a `try` and `except` does the same job.",
      ],
      example: {
        language: 'text',
        code: code`
          Rule: free shipping from $50, otherwise $4.99. Negative totals are invalid.

          Kind     Input     Expected
          normal   20.00     4.99
          normal   80.00     0
          edge     49.99     4.99
          edge     50.00     0
          error    -5.00     raises ValueError
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Testing a shipping rule and finding a boundary bug',
    intro: "This function has a bug on the boundary. The tests run in a small loop that prints PASS or FAIL for each one, so the code works in the playground without pytest.",
    example: {
      language: 'python',
      code: code`
        def shipping_cost(total):
            if total < 0:
                raise ValueError("total cannot be negative")
            if total > 50:
                return 0
            return 4.99

        def test_normal_order():
            assert shipping_cost(20) == 4.99

        def test_free_at_fifty():
            assert shipping_cost(50) == 0

        def test_rejects_negative():
            try:
                shipping_cost(-5)
            except ValueError:
                return
            assert False, "expected ValueError"

        for test in [test_normal_order, test_free_at_fifty, test_rejects_negative]:
            try:
                test()
                print("PASS", test.__name__)
            except AssertionError:
                print("FAIL", test.__name__)
      `,
      output: 'PASS test_normal_order\nFAIL test_free_at_fifty\nPASS test_rejects_negative',
    },
    steps: [
      { code: 'if total > 50:\n    return 0', explanation: "The bug: the rule says free from $50, so this should be `>=`. A $50 order wrongly pays shipping." },
      { code: 'def test_free_at_fifty():\n    assert shipping_cost(50) == 0', explanation: "An edge-case test, sitting exactly on the boundary. Its expected value of 0 comes from the rule, not from the code." },
      { code: 'try:\n    shipping_cost(-5)\nexcept ValueError:\n    return', explanation: "An error-case test. If `ValueError` is raised, the test returns early and passes." },
      { code: 'assert False, "expected ValueError"', explanation: "This line is only reached if no error was raised, and then the test fails with a clear message." },
      { code: 'for test in [...]:', explanation: "Functions can be stored in a list and called later. This loop is a tiny version of what pytest does for you." },
      { code: 'FAIL test_free_at_fifty', explanation: "The test caught the boundary bug. Change `>` to `>=`, run again, and all three pass." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground and see the failing test.',
      'Fix the bug by changing `>` to `>=`, and run again until all three pass.',
      'Add a test `test_just_under_fifty` that checks `shipping_cost(49.99) == 4.99`. Add it to the list and run.',
    ],
    playground: 'python',
    starterCode: code`
      def shipping_cost(total):
          if total < 0:
              raise ValueError("total cannot be negative")
          if total > 50:
              return 0
          return 4.99

      def test_normal_order():
          assert shipping_cost(20) == 4.99

      def test_free_at_fifty():
          assert shipping_cost(50) == 0

      def test_rejects_negative():
          try:
              shipping_cost(-5)
          except ValueError:
              return
          assert False, "expected ValueError"

      for test in [test_normal_order, test_free_at_fifty, test_rejects_negative]:
          try:
              test()
              print("PASS", test.__name__)
          except AssertionError:
              print("FAIL", test.__name__)
    `,
  },
  mistakes: [
    { mistake: 'Copying the function\'s current output into the test as the expected value.', fix: 'Work out the expected value from the requirement, by hand. Otherwise the test locks the bug in.' },
    { mistake: 'Testing only typical inputs.', fix: 'Add a test on each side of every boundary, plus at least one input that should be rejected.' },
    { mistake: 'Writing one huge test that checks many things.', fix: 'Write one test per behavior, with a descriptive name, so a failure points straight at the problem.' },
  ],
  quiz: [
    {
      question: 'A discount applies to orders of 10 items or more. Which set of test inputs is most likely to catch a boundary bug?',
      options: [
        { text: '1, 5 and 100 items', explanation: 'None of these is near 10, so a mix-up between `>` and `>=` would go unnoticed.' },
        { text: '9, 10 and 11 items', explanation: 'Testing just below, exactly on and just above the boundary is where `<` versus `<=` mistakes show up.' },
        { text: '10 items only', explanation: 'One case on the boundary helps, but you also need the sides to confirm the rule switches at the right place.' },
        { text: '1,000 random orders', explanation: 'Random inputs rarely land exactly on 10, and a failure would be hard to explain.' },
      ],
      answer: 1,
    },
    {
      question: 'What happens when this code runs?',
      code: { language: 'python', code: code`
        def double(n):
            return n + n

        def test_double():
            assert double(3) == 6
            assert double(0) == 0
            assert double(-2) == -4

        test_double()
        print("ok")
      ` },
      options: [
        { text: 'It prints ok', explanation: 'All three asserts are true: 6, 0 and -4. Nothing fails, so the print runs.' },
        { text: 'It raises AssertionError on the negative case', explanation: '-2 + -2 is -4, which matches the expected value.' },
        { text: 'It prints nothing, because tests do not print', explanation: 'The test passes silently, then the separate `print("ok")` line runs.' },
        { text: 'It raises AssertionError on the zero case', explanation: '0 + 0 is 0, so that check passes too.' },
      ],
      answer: 0,
    },
    {
      question: 'pytest reports `E  assert 4.99 == 0` with `where 4.99 = shipping_cost(50)`. What does this tell you?',
      options: [
        { text: 'pytest itself is broken', explanation: 'pytest is reporting a real difference between what you expected and what the function returned.' },
        { text: 'The test expected 4.99 but got 0', explanation: 'It is the other way round. The left side is the actual value, 4.99, and the right side is what the test expected, 0.' },
        { text: 'The test file has a syntax error', explanation: 'A syntax error would stop before any test runs. This is a normal assertion failure.' },
        { text: '`shipping_cost(50)` returned 4.99, but the test expected 0', explanation: 'The report shows the actual value on the left and the expected value on the right, and where the actual value came from.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Write one small test per behavior with an expected value taken from the requirement, include the boundaries and the bad inputs, and rerun them after every change.',
  resources: [
    { title: 'Get started with pytest', provider: 'pytest', description: 'Install pytest, write your first test and read its output.', url: 'https://docs.pytest.org/en/stable/getting-started.html' },
    { title: 'unittest', provider: 'Python.org', description: 'The testing tool built into Python, if you cannot install packages.', url: 'https://docs.python.org/3/library/unittest.html' },
  ],
  underTheHood: {
    heading: 'Fixtures and test isolation',
    paragraphs: [
      "Good tests are independent: each one passes or fails on its own, in any order. If test B only passes because test A left a file behind, a change to A will mysteriously break B.",
      "pytest helps with fixtures. A fixture is a function marked with `@pytest.fixture` that prepares something a test needs, such as a sample shopping cart or an empty temporary folder. A test asks for it simply by naming it as a parameter, and pytest builds a fresh one for every test.",
      "pytest also ships built-in fixtures. `tmp_path` gives each test its own empty folder that is cleaned up afterwards, so tests that write files never interfere with each other or with your real data. `monkeypatch` temporarily replaces things like environment variables or a function that calls the internet, and puts them back when the test ends.",
    ],
  },
}

export default lesson
