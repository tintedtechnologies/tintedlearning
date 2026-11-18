import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Write an if statement that chooses between two or more paths',
    'Repeat an action for every item in a list with a for loop',
    'Keep a running total that updates each time a loop runs',
  ],
  bigIdea: "Programs do not have to run every line every time. An `if` statement lets the program choose which lines to run based on a condition, and a `for` loop runs the same lines once for each item in a collection. Together they let a short program handle a hundred cases as easily as one.",
  whyItMatters: "A teacher has 120 quiz scores and needs to mark each one as pass or fail, then report the class average. By hand that is an afternoon of careful work. With one loop that visits each score, one `if` that decides pass or fail, and one running total, Python does it in a fraction of a second, and does it the same way for every student.",
  goalSections: [
    {
      heading: 'Choosing a path with if, elif and else',
      paragraphs: [
        "An `if` statement checks a condition, something that is either `True` or `False`. If it is true, Python runs the indented lines underneath. If not, it skips them.",
        "Add `else:` for what should happen otherwise. When there are more than two paths, use `elif`, short for else if. Python checks each condition from top to bottom and runs only the first one that is true, then skips the rest.",
        "The indentation matters. The lines that belong to a branch must be pushed in, usually by four spaces. That is how Python knows where each branch starts and stops. Every `if`, `elif` and `else` line ends with a colon.",
      ],
      example: {
        language: 'python',
        code: code`
          score = 72

          if score >= 90:
              print("Grade A")
          elif score >= 70:
              print("Grade B")
          else:
              print("Keep practising")
        `,
        output: 'Grade B',
      },
    },
    {
      heading: 'Repeating work with a for loop',
      visual: { kind: 'loop', values: ['"Dune"', '"Emma"', '"Frankenstein"'], caption: 'A for loop visits each item in order. The loop variable takes one value per step, and the body runs once for each item.' },
      paragraphs: [
        "A list holds several values in order, written in square brackets: `[\"Ana\", \"Ben\", \"Chen\"]`. A `for` loop takes each item from the list in turn, gives it a temporary name, and runs the indented lines once for that item.",
        "In `for name in names:`, the word `name` is a variable you choose. On the first pass it holds the first item, on the second pass the second item, and so on until the list runs out.",
        "To repeat something a set number of times, loop over `range()`. `range(3)` produces 0, 1 and 2: three numbers, starting from zero.",
        "Python also has a `while` loop, which keeps repeating as long as a condition stays true, as in `while balance < 100:`. Use `for` when you have a collection or a known count, and `while` when you only know when to stop. If nothing inside a `while` loop ever makes its condition false, it runs forever.",
      ],
      example: {
        language: 'python',
        code: code`
          names = ["Ana", "Ben", "Chen"]

          for name in names:
              print("Hello,", name)

          for number in range(3):
              print("Round", number)
        `,
        output: 'Hello, Ana\nHello, Ben\nHello, Chen\nRound 0\nRound 1\nRound 2',
      },
    },
    {
      heading: 'Keeping a running total',
      paragraphs: [
        "Loops get powerful when they remember something between passes. Create a variable before the loop, then update it inside the loop. Because the variable lives outside the loop, it keeps its value from one pass to the next.",
        "The pattern is always the same: start the total at zero, add to it inside the loop, and use it after the loop ends. The shortcut `total += x` means exactly the same as `total = total + x`.",
        "You can combine this with `if` to count only some items, such as how many scores passed.",
      ],
      example: {
        language: 'python',
        code: code`
          prices = [3, 10, 4]
          total = 0

          for price in prices:
              total += price
              print("Added", price, "running total", total)

          print("Final:", total)
        `,
        output: 'Added 3 running total 3\nAdded 10 running total 13\nAdded 4 running total 17\nFinal: 17',
      },
    },
  ],
  seeItInAction: {
    title: 'Marking a short list of quiz scores',
    intro: "This program marks each score as pass or fail, counts the passes, and prints the class average. It combines a loop, a decision and two running totals.",
    example: {
      language: 'python',
      code: code`
        scores = [82, 45, 67, 91, 58]
        passed = 0
        total = 0

        for score in scores:
            total += score
            if score >= 60:
                passed += 1
                print(score, "pass")
            else:
                print(score, "fail")

        print("Passed:", passed, "of", len(scores))
        print("Average:", total / len(scores))
      `,
      output: '82 pass\n45 fail\n67 pass\n91 pass\n58 fail\nPassed: 3 of 5\nAverage: 68.6',
    },
    steps: [
      { code: 'scores = [82, 45, 67, 91, 58]', explanation: "The data: five scores in a list." },
      { code: 'passed = 0\ntotal = 0', explanation: "Two counters, both created before the loop so they keep their values across every pass." },
      { code: 'for score in scores:', explanation: "The loop runs five times. Each time, `score` holds the next number from the list." },
      { code: 'total += score', explanation: "Every score is added to the total, whether it passed or not. This line is inside the loop but outside the `if`." },
      { code: 'if score >= 60:\n    passed += 1', explanation: "Only scores of 60 or more reach this line, so `passed` counts the passes. 82, 67 and 91 make it 3." },
      { code: 'print("Average:", total / len(scores))', explanation: "After the loop, `total` is 343. `len(scores)` counts the items in the list, 5. 343 divided by 5 is 68.6." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground and check that the output matches the lesson.',
      'Change the pass mark from 60 to 50. Predict how many students pass now, then run it.',
      'Add 100 to the end of the list. Predict the new average before you run it.',
    ],
    playground: 'python',
    starterCode: code`
      scores = [82, 45, 67, 91, 58]
      passed = 0
      total = 0

      for score in scores:
          total += score
          if score >= 60:
              passed += 1
              print(score, "pass")
          else:
              print(score, "fail")

      print("Passed:", passed, "of", len(scores))
      print("Average:", total / len(scores))
    `,
  },
  mistakes: [
    { mistake: 'Forgetting the colon at the end of an `if`, `else` or `for` line.', fix: 'Python stops with a `SyntaxError`. Every line that starts a block ends with `:`.' },
    { mistake: 'Creating the counter inside the loop.', fix: 'If `total = 0` is inside the loop, it resets on every pass. Create it on the line before the `for`.' },
    { mistake: 'Putting the conditions of an `elif` chain in the wrong order.', fix: 'Python runs the first true branch only. Check the strictest condition first, such as `>= 90` before `>= 70`.' },
    { mistake: 'Mixing up how far lines are indented.', fix: 'Use four spaces for each level and let your editor insert them. A line that is not indented is outside the loop or branch.' },
  ],
  quiz: [
    {
      question: 'If `score = 45`, what does this code print?',
      code: { language: 'python', code: code`
        score = 45
        if score >= 50:
            print("Pass")
        elif score >= 40:
            print("Close")
        else:
            print("Retry")
      ` },
      options: [
        { text: 'Pass', explanation: '45 is not 50 or more, so the first branch is skipped.' },
        { text: 'Close', explanation: '45 fails the first check but passes `score >= 40`, so that branch runs and the rest are skipped.' },
        { text: 'Retry', explanation: '`else` only runs when every condition above it is false, and `score >= 40` is true.' },
        { text: 'Close and Retry', explanation: 'An `if` chain runs at most one branch. Once one matches, Python skips the rest.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        total = 0
        for n in [2, 4, 6]:
            total = total + n
        print(total)
      ` },
      options: [
        { text: '6', explanation: '6 is only the last item. The loop adds every item to the total.' },
        { text: '0', explanation: 'The total starts at 0 but changes on each pass of the loop.' },
        { text: '12', explanation: '0 + 2 = 2, then 2 + 4 = 6, then 6 + 6 = 12.' },
        { text: '2, 6 and 12 on separate lines', explanation: 'The `print` is not indented, so it runs once, after the loop has finished.' },
      ],
      answer: 2,
      answerIsOutput: true,
    },
    {
      question: 'This code is meant to count the even numbers, but it prints 1. Why?',
      code: { language: 'python', code: code`
        for n in [2, 3, 4, 6]:
            count = 0
            if n % 2 == 0:
                count += 1
        print(count)
      ` },
      options: [
        { text: '`n % 2 == 0` does not test for even numbers', explanation: '`%` gives the remainder, and an even number has remainder 0 when divided by 2. That part is correct.' },
        { text: 'The loop stops after the first item', explanation: 'A `for` loop visits every item unless you tell it to stop.' },
        { text: '`count += 1` should be `count = 1`', explanation: 'That would set the count to 1 instead of increasing it, which is the opposite of what you want.' },
        { text: '`count = 0` is inside the loop, so it resets on every pass', explanation: 'By the last pass, count was reset to 0 and then raised to 1 for the 6. Move `count = 0` above the `for` line.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Use `if` to choose which lines run, `for` to repeat lines for each item, and a variable created before the loop to remember a result across passes.',
  resources: [
    { title: 'More control flow tools', provider: 'Python.org', description: 'The official tutorial on if, for and range.', url: 'https://docs.python.org/3/tutorial/controlflow.html' },
    { title: 'Automate the Boring Stuff, chapter 2', provider: 'Al Sweigart', description: 'A beginner chapter on conditions and loops with many examples.', url: 'https://automatetheboringstuff.com/3e/chapter2.html' },
  ],
  underTheHood: {
    heading: 'What counts as true',
    paragraphs: [
      "An `if` does not need a comparison. You can write `if name:` or `if items:`, and Python decides whether the value counts as true. This is called truthiness.",
      "The rule is simple. Empty or zero values count as false: `0`, `0.0`, the empty string `\"\"`, an empty list `[]`, and the special value `None`. Almost everything else counts as true, including the string `\"False\"` and the list `[0]`, because they are not empty.",
      "This is handy, because `if items:` reads as \"if there are any items\". But it can surprise you: if a score of 0 is a real result, `if score:` will treat it like a missing score. When zero is meaningful, write the comparison out, such as `if score is not None:`.",
    ],
  },
}

export default lesson
