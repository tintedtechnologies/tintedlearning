import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Use a letter to stand for a number that is unknown or can change',
    'Read and write a function as a rule that turns an input into an output',
    'Chain two functions together and work out the final result',
  ],
  bigIdea: "Algebra uses letters to stand for numbers, so you can write a rule once and use it for any value. A function is one of those rules: it takes an input and gives back exactly one output. Many real calculations, from pricing rules to spreadsheets, are long chains of small functions, one feeding the next.",
  whyItMatters: "A taxi app shows you a fare before you book. Behind that number is a function: a base fee plus a price per kilometer, with the distance as the input. When the app adds a late-night surcharge, it applies a second function to the result of the first. If you can read rules like these, you can see what any pricing tool or spreadsheet formula is really doing with its inputs.",
  goalSections: [
    {
      heading: 'Letters that stand for numbers',
      paragraphs: [
        "A variable in math is a letter that stands for a number. In `cost = 3 + 2 * k`, the letter `k` is the number of kilometers. It can be 1, 5 or 12.7. The rule stays the same whatever `k` is.",
        "Replacing the letter with a real number and working out the answer is called substituting. With `k = 5`, the cost is `3 + 2 * 5`, which is 13. Multiplication happens before addition, just as on a calculator.",
        "Algebra also runs backwards. If a trip cost 13, you can work out the distance: take away 3 to get 10, then divide by 2 to get 5 kilometers. Undoing each step in reverse order is called solving for the variable.",
      ],
      example: {
        language: 'python',
        code: code`
          k = 5
          cost = 3 + 2 * k
          print(cost)

          paid = 13
          distance = (paid - 3) / 2
          print(distance)
        `,
        output: '13\n5.0',
      },
    },
    {
      heading: 'Functions: one input in, one output out',
      paragraphs: [
        "In math a function is written `f(x) = 2x + 1`. Read it as: the function f takes an input called x, multiplies it by 2 and adds 1. So `f(3)` is 7 and `f(0)` is 1. The `2x` means 2 times x.",
        "A function of the form `f(x) = ax + b` is called linear, because its graph is a straight line. The number `a`, the slope, says how much the output rises when the input goes up by 1. The number `b`, the intercept, is the output when the input is 0.",
        "Estimating a value from a measurement is often exactly this. A rule that estimates house price from size might be `price = 3000 * size + 50000`. Finding good values for the slope and the intercept from past sales is called fitting the line.",
      ],
      example: {
        language: 'python',
        code: code`
          def f(x):
              return 2 * x + 1

          for x in [0, 1, 2, 3]:
              print(x, f(x))
        `,
        output: '0 1\n1 3\n2 5\n3 7',
      },
    },
    {
      heading: 'Chaining functions together',
      paragraphs: [
        "You can feed the output of one function into another. This is called composition, and it is written `g(f(x))`: first apply f, then apply g to the result. Order matters, so always work from the inside out.",
        "With `f(x) = x + 2` and `g(x) = 3x`, `g(f(4))` is `g(6)`, which is 18. But `f(g(4))` is `f(12)`, which is 14. Same two functions, different order, different answer.",
        "Calculators and computer programs are built this way too. Each step is a function, and the result passes from step to step. Many simple functions chained together can describe very complicated patterns.",
      ],
      example: {
        language: 'python',
        code: code`
          def f(x):
              return x + 2

          def g(x):
              return 3 * x

          print(g(f(4)))
          print(f(g(4)))
        `,
        output: '18\n14',
      },
    },
  ],
  seeItInAction: {
    title: 'Pricing a taxi ride with two chained functions',
    intro: "The fare is a linear function of distance. At night, a second function adds a 25% surcharge on top. The program works out a few fares and solves for distance from a price.",
    example: {
      language: 'python',
      code: code`
        def fare(km):
            return 3 + 2 * km

        def night(price):
            return price * 1.25

        print(fare(10))
        print(night(fare(10)))
        print(night(fare(0)))

        budget = 20
        print((budget - 3) / 2)
      `,
      output: '23\n28.75\n3.75\n8.5',
    },
    steps: [
      { code: 'def fare(km):\n    return 3 + 2 * km', explanation: "A linear function. The intercept is 3, the fee you pay before moving. The slope is 2, the price of each kilometer." },
      { code: 'def night(price):\n    return price * 1.25', explanation: "Multiplying by 1.25 adds 25%. This function does not know about distance at all. It only changes a price." },
      { code: 'print(fare(10))', explanation: "Substituting 10 for `km`: 3 + 2 times 10 = 23." },
      { code: 'print(night(fare(10)))', explanation: "Composition, worked from the inside out. First `fare(10)` gives 23, then `night(23)` gives 28.75." },
      { code: 'print(night(fare(0)))', explanation: "With zero kilometers, only the intercept is left: 3, plus 25% for night, gives 3.75." },
      { code: 'print((budget - 3) / 2)', explanation: "Solving backwards: with 20 to spend in the day, take away the 3 fee and divide by the 2 per km. You can travel 8.5 km." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground.',
      'Change the price per km from 2 to 2.5. Predict `fare(10)` and the night fare before running it.',
      'Write a function `tip(price)` that adds 10%, and print `tip(night(fare(10)))`. Then swap the order to `night(tip(fare(10)))`. Does the order change the answer here? Why?',
    ],
    playground: 'python',
    starterCode: code`
      def fare(km):
          return 3 + 2 * km

      def night(price):
          return price * 1.25

      print(fare(10))
      print(night(fare(10)))
      print(night(fare(0)))

      budget = 20
      print((budget - 3) / 2)
    `,
  },
  mistakes: [
    { mistake: 'Reading `2x + 1` as 2 times (x + 1).', fix: 'Multiplication comes first, so `2x + 1` with x = 3 is 6 + 1 = 7, not 8. Use brackets when you mean to add first.' },
    { mistake: 'Working out `g(f(x))` from the outside in.', fix: 'Always start with the innermost function and work outwards.' },
    { mistake: 'Assuming a straight-line rule holds far outside the data it came from.', fix: 'A rule fitted on 1 to 20 km trips may be wrong for a 300 km trip. Check the range it was built on.' },
  ],
  quiz: [
    {
      question: 'If `f(x) = 4x - 3`, what is `f(5)`?',
      options: [
        { text: '17', explanation: '4 times 5 is 20, and 20 minus 3 is 17.' },
        { text: '8', explanation: 'That treats 4x as 4 + x. In algebra, 4x means 4 times x.' },
        { text: '5', explanation: 'That is the input. The function changes it into a different output.' },
        { text: '23', explanation: 'That adds 3 instead of taking it away.' },
      ],
      answer: 0,
    },
    {
      question: 'With `f(x) = x * 2` and `g(x) = x + 10`, what is `f(g(1))`?',
      code: { language: 'python', code: code`
        def f(x):
            return x * 2

        def g(x):
            return x + 10

        print(f(g(1)))
      ` },
      options: [
        { text: '12', explanation: 'That applies f first. In `f(g(1))`, g is on the inside, so it goes first.' },
        { text: '22', explanation: 'g(1) is 11, then f(11) is 22.' },
        { text: '13', explanation: 'That adds everything up instead of applying one function to the other\'s output.' },
        { text: '20', explanation: 'That would be f(10). The input to f is g(1), which is 11.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'A rent estimate uses `rent = 15 * size + 400`, with size in square meters. What does the 15 mean?',
      options: [
        { text: 'The rent for a flat of size zero', explanation: 'That is the intercept, 400: the output when the input is 0.' },
        { text: 'The average size of a flat', explanation: 'The formula does not contain any average. 15 multiplies the size.' },
        { text: 'The highest rent the formula can give', explanation: 'A linear function has no maximum. Bigger flats always get higher predictions.' },
        { text: 'How much the predicted rent rises for each extra square meter', explanation: '15 is the slope: each additional square meter adds 15 to the prediction.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'A function is a rule from input to output, a linear one is set by its slope and intercept, and long calculations are chains of such rules.',
  resources: [
    { title: 'Algebra 1', provider: 'Khan Academy', description: 'Free lessons and practice on variables, equations and functions.', url: 'https://www.khanacademy.org/math/algebra' },
    { title: 'Desmos graphing calculator', provider: 'Desmos', description: 'Type a function like y = 2x + 1 and watch its graph change as you edit it.', url: 'https://www.desmos.com/calculator' },
  ],
  underTheHood: {
    heading: 'Why some functions bend and others stay straight',
    paragraphs: [
      "Chain two linear functions and you just get another linear function. For example, applying `2x + 1` and then `3x` gives `6x + 3`, still a straight line. Chain a thousand straight lines and the result is still one straight line, which cannot describe a curve.",
      "Mathematicians get around this with functions that bend, such as `max(0, x)`, which sends negative inputs to 0 and passes positive ones through unchanged. A fee that starts only after a threshold is passed is a real example. Its graph has a bend at 0.",
      "That one bend changes everything. Combine many lines with bends and you can build up almost any shape, like drawing a curve out of many short straight pieces. This is why simple parts can describe something as complicated as the outline of a coastline.",
    ],
  },
}

export default lesson
