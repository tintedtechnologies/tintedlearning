import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Turn a written requirement into example inputs, outputs and failures before coding',
    'Organize a small project into a package, tests and a README',
    'Back up your design choices with evidence: passing tests, a check you ran and written decisions',
  ],
  bigIdea: "A capstone brings everything together: you take a written requirement and deliver a small, working, tested Python project that someone else could pick up. The skill being practiced is not clever code. It is turning a vague request into exact behavior, building it in clear pieces, and leaving evidence that it works.",
  whyItMatters: "Employers and clients rarely ask \"can you write a loop?\" They ask \"can you take this request and deliver something I can trust?\" A finished repository with a clear specification, tests that pass, and a README that explains decisions answers that question better than any certificate, and it is something you can show in an interview.",
  goalSections: [
    {
      heading: 'From requirement to concrete cases',
      paragraphs: [
        "Requirements arrive in plain language: \"Split shared expenses fairly between friends.\" Before writing code, turn them into concrete cases: example inputs, the exact output expected, and inputs that must be rejected.",
        "Writing cases surfaces the questions the requirement left open. What if $10 is split three ways? Who gets the extra cent? What if someone not in the group paid? Decide each one, write the decision down, and the cases become your first tests.",
        "Store money as whole cents, not floats, so splitting never produces values like 3.3333333. Floats would also bring back the rounding surprises from the very first Python lesson.",
      ],
      example: {
        language: 'text',
        code: code`
          Requirement: split shared expenses fairly. Show what each person
          is owed (positive) or owes (negative).

          Case                                       Expected
          A pays 1000c, people A and B               A +500, B -500
          A pays 1000c, people A, B and C            A +666, B -333, C -333
            (1000 / 3 leaves 1 cent; decision: the first name
             alphabetically owes the extra cent)
          Payer Z is not in the group                reject: unknown payer
          Amount is 0 or negative                    reject: must be positive
          Rule for every case: balances add up to 0
        `,
      },
    },
    {
      heading: 'A project layout others can follow',
      paragraphs: [
        "Use the layout from the earlier lessons. Put the code in a package inside `src/`, keep tests in `tests/`, list dependencies in `pyproject.toml` or `requirements.txt`, and explain everything in `README.md`.",
        "Inside the package, keep the core rules separate from input and output. The splitting logic should not read files or print anything. A thin command-line layer handles that. Then the core can be tested directly and reused later, behind a website or an API.",
        "A good README answers four questions: what does this do, how do I install it, how do I run it and its tests, and what decisions and limits should I know about.",
      ],
      example: {
        language: 'text',
        code: code`
          expense-splitter/
            README.md            what, install, run, test, decisions, limits
            pyproject.toml       name, version, dependencies
            src/splitter/
              __init__.py
              core.py            Expense dataclass, balances(), validation
              cli.py             reads a CSV, calls core, prints results
            tests/
              test_core.py       every case from the specification
        `,
      },
    },
    {
      heading: 'Evidence that it works',
      paragraphs: [
        "Claims need proof. Every case from your specification should be a test, and the whole suite should pass from a clean install with one command, such as `python -m pytest`.",
        "Go beyond examples by checking a property that must always hold. For the splitter, the balances must always add up to zero. Testing that rule on many random inputs catches mistakes no single example would.",
        "Finally, write down decisions in the README: what you chose, what you rejected and why. \"Amounts are integers in cents to avoid float rounding\" tells a reviewer you thought about it, and tells future you why the code looks the way it does.",
      ],
      example: {
        language: 'text',
        code: code`
          ## Decisions
          - Amounts are integer cents. Floats caused 0.01 rounding drift
            in early tests.
          - Leftover cents go to people in alphabetical order, so results
            are the same every run.
          - The core never prints or reads files; cli.py does that.

          ## Limits
          - Single currency only.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'The core of the expense splitter, with its tests',
    intro: "This is the heart of the project in one file: the record type, the rules, validation and three tests taken from the specification. In the real project these would live in `core.py` and `test_core.py`.",
    example: {
      language: 'python',
      code: code`
        from dataclasses import dataclass

        @dataclass(frozen=True)
        class Expense:
            payer: str
            cents: int

        def balances(people: list[str], expenses: list[Expense]) -> dict[str, int]:
            if not people:
                raise ValueError("need at least one person")
            for e in expenses:
                if e.payer not in people:
                    raise ValueError(f"unknown payer: {e.payer}")
                if e.cents <= 0:
                    raise ValueError("amounts must be positive")
            total = sum(e.cents for e in expenses)
            share, extra = divmod(total, len(people))
            ordered = sorted(people)
            owes = {p: share + (1 if i < extra else 0) for i, p in enumerate(ordered)}
            paid = {p: 0 for p in ordered}
            for e in expenses:
                paid[e.payer] += e.cents
            return {p: paid[p] - owes[p] for p in ordered}

        def test_even_split():
            assert balances(["A", "B"], [Expense("A", 1000)]) == {"A": 500, "B": -500}

        def test_always_sums_to_zero():
            result = balances(["A", "B", "C"], [Expense("A", 1000), Expense("B", 7)])
            assert sum(result.values()) == 0

        def test_rejects_unknown_payer():
            try:
                balances(["A"], [Expense("Z", 100)])
            except ValueError:
                return
            assert False, "expected ValueError"

        for test in [test_even_split, test_always_sums_to_zero, test_rejects_unknown_payer]:
            test()
        print("3 tests passed")
        print(balances(["Cy", "Ana", "Ben"], [Expense("Ana", 3000), Expense("Ben", 1000)]))
      `,
      output: "3 tests passed\n{'Ana': 1666, 'Ben': -333, 'Cy': -1333}",
    },
    steps: [
      { code: '@dataclass(frozen=True)\nclass Expense:', explanation: "A fixed record type. Using whole cents follows the decision written in the specification." },
      { code: 'for e in expenses:\n    if e.payer not in people: ...', explanation: "Validation first, before any math, so bad input is rejected with a clear message instead of producing a wrong answer." },
      { code: 'share, extra = divmod(total, len(people))', explanation: "`divmod` returns the whole-number result and the remainder together. 4000 cents among 3 people is 1333 each, with 1 cent left over." },
      { code: 'owes = {p: share + (1 if i < extra else 0) ...}', explanation: "The leftover cents go to the first names alphabetically, exactly as decided. Ana owes 1334 and the others 1333." },
      { code: 'def test_always_sums_to_zero():', explanation: "A property test: whatever the inputs, money is neither created nor lost. It would catch a wrong remainder rule immediately." },
      { code: "{'Ana': 1666, 'Ben': -333, 'Cy': -1333}", explanation: "Ana paid 3000 and owes 1334, so she is owed 1666. Ben paid 1000 and owes 1333. Cy paid nothing. The three add up to 0." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the core in the playground and confirm all three tests pass.',
      'Add a test for the 1000 cents among A, B and C case from the specification. Predict the result, then run it.',
      'Then build the full project using the guide below, on your own computer.',
    ],
    playground: 'python',
    starterCode: code`
      from dataclasses import dataclass

      @dataclass(frozen=True)
      class Expense:
          payer: str
          cents: int

      def balances(people: list[str], expenses: list[Expense]) -> dict[str, int]:
          if not people:
              raise ValueError("need at least one person")
          for e in expenses:
              if e.payer not in people:
                  raise ValueError(f"unknown payer: {e.payer}")
              if e.cents <= 0:
                  raise ValueError("amounts must be positive")
          total = sum(e.cents for e in expenses)
          share, extra = divmod(total, len(people))
          ordered = sorted(people)
          owes = {p: share + (1 if i < extra else 0) for i, p in enumerate(ordered)}
          paid = {p: 0 for p in ordered}
          for e in expenses:
              paid[e.payer] += e.cents
          return {p: paid[p] - owes[p] for p in ordered}

      def test_even_split():
          assert balances(["A", "B"], [Expense("A", 1000)]) == {"A": 500, "B": -500}

      def test_always_sums_to_zero():
          result = balances(["A", "B", "C"], [Expense("A", 1000), Expense("B", 7)])
          assert sum(result.values()) == 0

      def test_rejects_unknown_payer():
          try:
              balances(["A"], [Expense("Z", 100)])
          except ValueError:
              return
          assert False, "expected ValueError"

      for test in [test_even_split, test_always_sums_to_zero, test_rejects_unknown_payer]:
          test()
      print("3 tests passed")
      print(balances(["Cy", "Ana", "Ben"], [Expense("Ana", 3000), Expense("Ben", 1000)]))
    `,
  },
  mistakes: [
    { mistake: 'Starting to code before the open questions in the requirement are answered.', fix: 'Write the cases first, including the awkward ones, and record each decision you make.' },
    { mistake: 'Mixing printing and file reading into the core logic.', fix: 'Keep the rules in a module that only takes values and returns values, and put input and output in a thin separate layer.' },
    { mistake: 'Finishing with code but no README.', fix: 'Write how to install, run and test the project, plus your decisions and limits. Reviewers read that before they read the code.' },
  ],
  quiz: [
    {
      question: 'The requirement says "split costs fairly", and $10 must be split among 3 people. What should you do first?',
      options: [
        { text: 'Use floats and let Python round', explanation: 'Rounding each share to cents gives 3.33 three times, which loses a cent. The leftover still needs a rule.' },
        { text: 'Decide who pays the leftover cent, write the decision down and add it as a test case', explanation: 'The requirement left this open. Making the decision explicit and testing it is what the specification step is for.' },
        { text: 'Ignore it, since one cent does not matter', explanation: 'Across thousands of splits, lost cents add up, and balances that do not sum to zero break trust.' },
        { text: 'Ask the user to enter amounts divisible by 3', explanation: 'That pushes the problem onto users instead of solving it in the program.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        share, extra = divmod(1000, 3)
        print(share, extra)
      ` },
      options: [
        { text: '333.33 0', explanation: '`divmod` works with whole numbers: it gives the whole-number result and the remainder.' },
        { text: '333 0', explanation: '3 times 333 is 999, so 1 is left over.' },
        { text: '3 1000', explanation: 'That reverses the inputs. `divmod(a, b)` divides a by b.' },
        { text: '333 1', explanation: '1000 divided by 3 is 333 with 1 left over, and `divmod` returns both.' },
      ],
      answer: 3,
      answerIsOutput: true,
    },
    {
      question: 'Which evidence best shows a reviewer that your expense splitter works?',
      options: [
        { text: 'A test suite covering every specification case, a sum-to-zero check, and a README with setup and decisions', explanation: 'A reviewer can run the tests and read why the code works as it does.' },
        { text: 'A screenshot of the program printing one correct result', explanation: 'One example cannot show that the edge cases and failures are handled.' },
        { text: 'A very long single file with many comments', explanation: 'Comments describe intentions. Tests show behavior.' },
        { text: 'A note saying the code was checked by hand', explanation: 'A reviewer cannot repeat a manual check. Automated tests can be run by anyone.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Turn the requirement into concrete cases and recorded decisions first, keep the core rules separate and tested, and leave a README that lets someone else trust and run your work.',
  resources: [
    { title: 'Packaging Python projects', provider: 'Python Packaging Authority', description: 'The official tutorial on the src layout and pyproject.toml.', url: 'https://packaging.python.org/en/latest/tutorials/packaging-projects/' },
    { title: 'Make a README', provider: 'makeareadme.com', description: 'A short guide and template for writing a useful README.', url: 'https://www.makeareadme.com/' },
  ],
  underTheHood: {
    heading: 'Property-based testing',
    paragraphs: [
      "Example tests check the cases you thought of. Property-based tests check rules that must hold for every input, and let the computer invent the inputs.",
      "The Hypothesis library does this for Python. You describe the kind of input, such as a list of 1 to 10 names and a list of expenses with positive amounts paid by those names, and write the property, such as \"the balances add up to zero\". Hypothesis then generates hundreds of random cases, including nasty ones like a single person or huge amounts.",
      "When a case fails, Hypothesis shrinks it: it keeps simplifying the failing input until it finds the smallest example that still breaks. Instead of a confusing 40-expense failure, you see something like two people and one expense of 1 cent, which usually points straight at the bug. Properties such as \"nothing is lost\", \"order does not matter\" and \"undo gives back the original\" are good places to start.",
    ],
  },
}

export default lesson
