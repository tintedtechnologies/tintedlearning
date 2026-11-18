import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain what an exponent means and use the rules for multiplying powers',
    'Explain what a logarithm asks, and convert between the two forms',
    'Use exponents and logarithms to describe growth, decay, and scales that span many orders of magnitude',
  ],
  bigIdea: 'An exponent says how many times to multiply a number by itself, so two to the power of ten is two multiplied by itself ten times. A logarithm answers the reverse question: what exponent gives this number? Exponents describe growth that compounds, and logarithms let us read numbers that span huge ranges, such as earthquake magnitudes and sound levels.',
  whyItMatters: 'A bank offers five percent interest compounded yearly. A savings balance of one thousand dollars does not grow in a straight line. It grows by a fixed factor each year, so after thirty years the balance is far larger than a simple sum would suggest. Understanding exponents shows why starting early matters, and logarithms explain how scales such as decibels compress huge differences into readable numbers.',
  goalSections: [
    {
      heading: 'Exponents: repeated multiplication',
      paragraphs: [
        'An exponent is a small number written above and to the right of a base. In two cubed, the base is two and the exponent is three, so the value is two times two times two, which is eight. The exponent counts how many copies of the base are multiplied together.',
        'Exponents follow simple rules. When you multiply two powers with the same base, you add the exponents: two cubed times two squared is two to the fifth. A power of zero is one, and a negative exponent means a reciprocal, so two to the minus one is one half.',
        'Growth that multiplies by the same factor each period is exponential growth. Doubling every year, a quantity grows from one to two to four to eight. Halving each period is exponential decay, which describes cooling, medicine leaving the body, and the drop in a battery that is wearing out.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          balance = 1000.0
          for year in range(1, 4):
              balance = balance * 1.05
              print("year", year, round(balance, 2))
        `,
        output: 'year 1 1050.0\nyear 2 1102.5\nyear 3 1157.62',
      },
    },
    {
      heading: 'Logarithms: asking for the exponent',
      paragraphs: [
        'A logarithm answers the question: what power must the base be raised to in order to get this number? The logarithm base ten of one hundred is two, because ten squared is one hundred. The logarithm base two of eight is three, because two cubed is eight.',
        'Logarithms undo exponents. If you raise a base to a power and then take the logarithm with the same base, you get the original exponent back. This is why logarithms are useful for solving for a time in exponential growth.',
        'Logarithms compress a large range into a small one. The numbers one, ten, one hundred, and one thousand have logarithms zero, one, two, and three. That is why the decibel scale for sound and the magnitude scale for earthquakes use logarithms: each step up represents a much larger real change.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import math

          print(math.log10(100))
          print(math.log2(8))
          print(round(math.log(2.7182818284, math.e), 3))
        `,
        output: '2.0\n3.0\n1.0',
      },
    },
    {
      heading: 'Finding how long growth takes',
      paragraphs: [
        'Logarithms answer questions about time in exponential growth. How many years does it take for an amount to double at a fixed rate? You can estimate it by testing the exponent until the amount reaches the target, and a logarithm gives the exact answer.',
        'The rule of seventy is a quick estimate for doubling time: divide seventy by the growth rate in percent. At seven percent growth, the amount doubles in about ten years. The rule is an approximation, but it gives a fast sense of scale before you calculate.',
        'When you see a graph with a logarithmic scale, read each step as a multiplication, not an addition. The distance from one to ten looks the same as the distance from ten to one hundred, because each jump is a factor of ten.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import math

          rate = 0.05
          years = math.log(2) / math.log(1 + rate)
          print(round(years, 1))
        `,
        output: '14.2',
      },
    },
  ],
  seeItInAction: {
    title: 'Watching compound growth and doubling',
    intro: 'The program below applies a yearly growth rate to a balance and counts how many years it takes to double. Compare the count with the rule of seventy. Run it, then change the rate to ten percent and predict the new doubling time.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        balance = 1000.0
        rate = 0.07
        years = 0
        while balance < 2000.0:
            balance = balance * (1 + rate)
            years += 1
        print("years to double:", years)
        print("rule of seventy estimate:", round(70 / 7))
      `,
      output: 'years to double: 11\nrule of seventy estimate: 10',
    },
    steps: [
      { code: 'balance = balance * (1 + rate)', explanation: 'Each year the balance is multiplied by the same factor, which is exponential growth.' },
      { code: 'while balance < 2000.0:', explanation: 'Keeps going until the balance has doubled, so the number of years is counted directly.' },
      { code: 'print("rule of seventy estimate:", round(70 / 7))', explanation: 'Compares the count with a quick estimate. The exact answer and the estimate are close, which is why the rule is useful.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the rate in the example to 0.10 and predict the number of years to double. Run the program to check.',
      'Write 2 to the power of 5, and check your answer by multiplying out the factors.',
      'Use the rule of seventy to estimate how long a savings balance takes to double at four percent. Then check with the program.',
    ],
  },
  mistakes: [
    { mistake: 'Multiplying the base by the exponent instead of repeating the multiplication.', fix: 'Two cubed means two times two times two, which is eight, not six.' },
    { mistake: 'Treating exponential growth as a straight line.', fix: 'Growth by a fixed factor speeds up over time, so early and late years look very different.' },
    { mistake: 'Reading a logarithmic scale as if each step were the same amount.', fix: 'Each step on a log scale is a multiplication, so a small step can mean a very large change.' },
  ],
  quiz: [
    {
      question: 'What is 2 to the power of 4?',
      options: [
        { text: '8', explanation: 'That is 2 to the power of 3. Two to the fourth is two times two times two times two.' },
        { text: '16', explanation: 'Yes. Two multiplied by itself four times is sixteen.' },
        { text: '6', explanation: 'Exponents are repeated multiplication, not multiplication by the exponent.' },
        { text: '4', explanation: 'That is two squared, not two to the fourth.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for the logarithm base ten of 1000?',
      code: { language: 'python', runnable: true, code: code`
        import math
        print(math.log10(1000))
      ` },
      options: [
        { text: '2.0', explanation: 'Ten squared is one hundred, not one thousand.' },
        { text: '3.0', explanation: 'Yes. Ten cubed is one thousand, so the logarithm base ten is three.' },
        { text: '1000.0', explanation: 'The logarithm is the exponent, not the number itself.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why do the decibel and earthquake scales use logarithms?',
      options: [
        { text: 'They compress huge differences into a range people can read', explanation: 'Yes. Logarithms turn large multiplicative differences into smaller, readable steps.' },
        { text: 'They make the measurements more accurate than the instruments', explanation: 'Logarithms change how values are displayed, not how accurate the instrument is.' },
        { text: 'They remove the need for units', explanation: 'The scales still have units and meaning. The logarithm changes how they are read.' },
        { text: 'They only work for whole numbers', explanation: 'Logarithms work for any positive number.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Exponents describe repeated multiplication and compound growth, logarithms ask which exponent gives a number, and together they explain growth, decay, doubling time, and scales that span many orders of magnitude.',
  resources: [
    { title: 'Exponents and logarithms', provider: 'Khan Academy', description: 'Free lessons on exponent rules, logarithms, and exponential growth.', url: 'https://www.khanacademy.org/math/algebra2' },
    { title: 'Logarithm', provider: 'Wikipedia', description: 'An overview of logarithms, their rules, and their use in science and measurement.', url: 'https://en.wikipedia.org/wiki/Logarithm' },
  ],
}

export default lesson
