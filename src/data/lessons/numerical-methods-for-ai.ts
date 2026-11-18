import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain why computers store most decimals approximately and compare them safely',
    'Spot a calculation that overflows or loses precision and rewrite it to be stable',
    'Decide when a repeated calculation has settled and can stop',
  ],
  bigIdea: "Computers store numbers with a fixed number of digits, so most decimals are rounded slightly, very large results can overflow, and tiny differences can vanish. Numerical methods are the techniques that get reliable answers anyway. A formula that is correct on paper can still fail on a computer if you calculate it the wrong way.",
  whyItMatters: "Halfway through a long calculation, a result suddenly becomes `nan`, meaning not a number, and hours of computing are wasted. Very often the cause is not a wrong formula but a stable one written unstably, such as raising e to the power of a large score. Knowing these traps lets you prevent them, and recognize them quickly when they happen.",
  goalSections: [
    {
      heading: 'Numbers are stored approximately',
      paragraphs: [
        "Python stores decimals as floating-point numbers, or floats, with about 16 significant digits. Most decimal fractions, like 0.1, cannot be written exactly in the binary the computer uses, so each one is stored as the nearest value it can manage.",
        "The tiny errors usually do not matter, but they break exact comparisons. `0.1 + 0.2 == 0.3` is `False`. Instead of checking equality, check whether two floats are close enough, with `math.isclose()`.",
        "Errors can also add up. Adding 0.1 ten times gives 0.9999999999999999, not 1. Over millions of operations, careless rounding can drift into a visible mistake.",
      ],
      example: {
        language: 'python',
        code: code`
          import math

          print(0.1 + 0.2)
          print(0.1 + 0.2 == 0.3)
          print(math.isclose(0.1 + 0.2, 0.3))

          total = 0.0
          for _ in range(10):
              total += 0.1
          print(total)
        `,
        output: '0.30000000000000004\nFalse\nTrue\n0.9999999999999999',
      },
    },
    {
      heading: 'Overflow and how to avoid it',
      paragraphs: [
        "A float can only hold numbers up to about 1.8 times 10 to the power 308. Go beyond that and the calculation overflows: Python raises an error, or other libraries return infinity, which then turns into `nan` as it spreads through later sums.",
        "The exponential function `exp(x)`, e raised to the power x, grows extremely fast. `math.exp(1000)` overflows. This matters because exponentials appear all the time in growth and decay formulas, and in softmax, which turns any list of numbers into shares that add up to 1.",
        "The fix is a rearrangement that gives exactly the same answer: subtract the largest score from every score before taking exponentials. Now the biggest exponent is 0, nothing overflows, and the probabilities come out the same.",
      ],
      example: {
        language: 'python',
        code: code`
          import math

          def softmax(scores):
              top = max(scores)
              exps = [math.exp(s - top) for s in scores]
              total = sum(exps)
              return [round(e / total, 3) for e in exps]

          print(softmax([1, 2, 3]))
          print(softmax([1001, 1002, 1003]))
        `,
        output: '[0.09, 0.245, 0.665]\n[0.09, 0.245, 0.665]',
      },
    },
    {
      heading: 'Knowing when to stop',
      paragraphs: [
        "Many numerical methods do not jump to an answer. They improve a guess over and over, which is called iterating. Gradient descent works this way, and so does the classic way computers find square roots.",
        "You need a rule for when to stop. The usual one is to stop when the guess changes by less than a small tolerance, such as 0.000001, between steps. Always add a maximum number of steps too, so a method that never settles cannot run forever.",
        "When the changes shrink toward zero, the method has converged. If they grow or bounce, it is diverging, and more steps will not help.",
      ],
      example: {
        language: 'python',
        code: code`
          target = 10
          guess = 1.0

          for step in range(1, 50):
              new = (guess + target / guess) / 2
              if abs(new - guess) < 1e-6:
                  break
              guess = new

          print(step, round(new, 6))
        `,
        output: '6 3.162278',
      },
    },
  ],
  seeItInAction: {
    title: 'The same formula, unstable and stable',
    intro: "Softmax is used whenever a formula must share 100 percent among several options, such as the shares of a survey. Here it is written straight from the textbook formula, and then the stable way, on scores large enough to break the first version.",
    example: {
      language: 'python',
      code: code`
        import math

        scores = [800, 805, 810]

        try:
            exps = [math.exp(s) for s in scores]
            print("naive:", [e / sum(exps) for e in exps])
        except OverflowError as error:
            print("naive failed:", error)

        top = max(scores)
        exps = [math.exp(s - top) for s in scores]
        probs = [e / sum(exps) for e in exps]
        print("stable:", [round(p, 5) for p in probs])
        print("adds to 1:", math.isclose(sum(probs), 1.0))
      `,
      output: 'naive failed: math range error\nstable: [5e-05, 0.00669, 0.99326]\nadds to 1: True',
    },
    steps: [
      { code: 'scores = [800, 805, 810]', explanation: "Raw scores of this size are realistic in large sums of measurements, especially when the numbers are not scaled first." },
      { code: 'exps = [math.exp(s) for s in scores]', explanation: "The textbook formula takes e to the power of each score. e to the 800 is far beyond the largest float." },
      { code: 'except OverflowError as error:', explanation: "Python refuses with `math range error`. Libraries such as NumPy would quietly return infinity instead, and the probabilities would become `nan` further on." },
      { code: 'exps = [math.exp(s - top) for s in scores]', explanation: "Subtracting the top score shifts every score by the same amount, to -10, -5 and 0. Shifting all scores equally does not change the final probabilities, but now every exponential is at most 1." },
      { code: 'print("adds to 1:", math.isclose(sum(probs), 1.0))', explanation: "Probabilities should add up to 1. Checking with `isclose` instead of `==` allows for the tiny rounding left in any float sum." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground.',
      'Change the scores to `[1, 2, 3]`. Predict whether the naive version works now, then run it.',
      'Change the scores to `[800, 800, 800]`. Predict the three stable probabilities before running.',
    ],
    playground: 'python',
    starterCode: code`
      import math

      scores = [800, 805, 810]

      try:
          exps = [math.exp(s) for s in scores]
          print("naive:", [e / sum(exps) for e in exps])
      except OverflowError as error:
          print("naive failed:", error)

      top = max(scores)
      exps = [math.exp(s - top) for s in scores]
      probs = [e / sum(exps) for e in exps]
      print("stable:", [round(p, 5) for p in probs])
      print("adds to 1:", math.isclose(sum(probs), 1.0))
    `,
  },
  mistakes: [
    { mistake: 'Comparing floats with `==`.', fix: 'Use `math.isclose(a, b)`, or check that `abs(a - b)` is below a small tolerance you choose.' },
    { mistake: 'Copying a formula straight from a textbook into code.', fix: 'Ask whether any step can overflow, divide by nearly zero or subtract two nearly equal numbers, and use the stable rearrangement.' },
    { mistake: 'Writing a loop that stops only when the answer is exactly right.', fix: 'Floats may never hit the exact value. Stop when the change is below a tolerance, and cap the number of steps.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        a = 0.1 * 3
        print(a == 0.3)
      ` },
      options: [
        { text: 'True', explanation: 'On paper 0.1 times 3 is 0.3, but the stored float is 0.30000000000000004.' },
        { text: 'False', explanation: 'The rounding error in 0.1 makes the result a tiny bit more than 0.3, so `==` fails.' },
        { text: '0.3', explanation: 'The `==` comparison produces `True` or `False`, not a number.' },
        { text: 'An error', explanation: 'Comparing floats is allowed. It just gives a surprising answer.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why does subtracting the largest score before softmax not change the resulting probabilities?',
      options: [
        { text: 'Because the largest score is always 0 anyway', explanation: 'Scores can be any size. The subtraction is what makes the largest one 0.' },
        { text: 'Because softmax ignores the scores and only counts them', explanation: 'Softmax depends strongly on the gaps between scores.' },
        { text: 'It does change them slightly, but the error is small enough to ignore', explanation: 'It is not an approximation. On paper, the answer is exactly the same.' },
        { text: 'Shifting every score by the same amount multiplies each exponential by the same factor, which cancels when you divide by the total', explanation: 'e to the (s minus c) equals e to the s times e to the minus c. The common factor appears on the top and bottom and cancels.' },
      ],
      answer: 3,
    },
    {
      question: 'An iterative method produces guesses 4.0, 3.2, 3.17, 3.1623, 3.16228. What should a stopping rule do?',
      options: [
        { text: 'Stop once the change between guesses falls below a chosen tolerance', explanation: 'The changes are shrinking fast, so the method is converging. Stop when they become smaller than the precision you need.' },
        { text: 'Keep going until two guesses are exactly equal', explanation: 'With floats that might never happen, so the loop could run forever.' },
        { text: 'Stop after the first guess, since it is close enough', explanation: '4.0 is still far from the answer. Checking the size of the change tells you when you are close.' },
        { text: 'Always run exactly 1,000 steps', explanation: 'That wastes work after convergence and gives no warning when the method diverges.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Floats are approximate and limited in size, so compare them with a tolerance, rearrange formulas that can overflow, and stop repeated calculations when the changes become small.',
  resources: [
    { title: 'Floating-point arithmetic: issues and limitations', provider: 'Python.org', description: 'The official explanation of why 0.1 + 0.2 is not 0.3.', url: 'https://docs.python.org/3/tutorial/floatingpoint.html' },
    { title: 'What every computer scientist should know about floating-point arithmetic', provider: 'Oracle', description: 'The classic in-depth article, for when you want the full story.', url: 'https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html' },
  ],
  underTheHood: {
    heading: 'Conditioning: when small input errors become big output errors',
    paragraphs: [
      "Some problems are sensitive by nature. A problem is ill-conditioned when a tiny change in the input causes a large change in the answer. No clever method can fix that, because the sensitivity belongs to the problem, not to the code.",
      "Subtracting nearly equal numbers is the everyday example. 1.0000001 minus 1.0000000 is 0.0000001, but if each number carries a rounding error around the 16th digit, that error is now a much bigger share of the tiny result. This is called catastrophic cancellation.",
      "In a data table, conditioning shows up when two columns are almost copies of each other, such as height in centimetres and height in inches. A fit cannot tell which column deserves the credit, and its coefficients can swing wildly from one sample to the next. Removing duplicate columns, or adding a small penalty for large coefficients, makes the problem better conditioned.",
    ],
  },
}

export default lesson
