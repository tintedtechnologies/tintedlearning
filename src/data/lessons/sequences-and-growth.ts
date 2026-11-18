import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe an arithmetic sequence and a geometric sequence, and find the next term of each',
    'Add up a finite arithmetic series with a formula, and check it by adding',
    'Compare linear growth with exponential growth using a table and a formula',
  ],
  bigIdea: 'A sequence is an ordered list of numbers, and each term follows from the one before it by a rule. Adding a constant gives an arithmetic sequence, which grows in a straight line. Multiplying by a constant gives a geometric sequence, which grows faster and faster.',
  whyItMatters: 'Two job offers both start at 40,000. The first gives 2,000 more each year, and the second gives 5 percent more than the year before. After ten years the first is at 58,000, and the second is near 65,000, and the gap keeps widening. The rule behind each offer decides the outcome, and a short calculation shows it before the decision is made. Recognizing which rule a situation follows is often the hardest step, and the rule decides the rest of the work.',
  goalSections: [
    {
      heading: 'Arithmetic and geometric sequences',
      paragraphs: [
        'In an arithmetic sequence, each term is the previous term plus a fixed difference. The sequence 3, 7, 11, 15 adds 4 each time. In a geometric sequence, each term is the previous term times a fixed ratio. The sequence 3, 6, 12, 24 doubles each time.',
        'To find a later term without listing all the earlier ones, use the rule. An arithmetic term is the first term plus the number of steps times the difference. A geometric term is the first term times the ratio raised to the number of steps. Check the rule against the first two terms before you use it for a distant term, because a wrong difference or ratio will spoil every later answer.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'sequences.py',
        code: code`
          first = 3
          difference = 4
          ratio = 2
          print(first + 5 * difference)
          print(first * ratio ** 5)
        `,
        output: '23\n96',
      },
    },
    {
      heading: 'Adding up a series',
      paragraphs: [
        'A series is the sum of the terms of a sequence. For the arithmetic series 1 through 100, pairing the first and last terms gives 101 each time, and there are 50 pairs. The total is 5050. The general formula is the number of terms times the average of the first and last term. The same pairing idea works for any arithmetic series, so the formula is a shortcut, not a new fact.',
        'Check a formula on a small case before you rely on it. Adding 1 through 10 gives 55, and the formula agrees, so the check is cheap and worth doing. Adding 1 through 4 by hand gives 10, and the formula gives 4 times 5 divided by 2, which is also 10.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'series.py',
        code: code`
          n = 100
          print(n * (n + 1) // 2)
        `,
        output: '5050',
      },
    },
    {
      heading: 'Linear and exponential growth',
      paragraphs: [
        'Linear growth adds the same amount each period, so a graph is a straight line. Exponential growth multiplies by the same factor each period, so the graph curves upward. Early on the two can look similar, but the exponential one always wins eventually. Doubling a small amount for a few years looks harmless, and doubling it for many years becomes very large.',
        'A table of the first few periods, plus the formula, shows where the curves separate. When someone quotes a rate, ask whether it is a fixed amount or a fixed percentage, because the two lead to very different results over long periods. Write the rate as a number in the formula before you compare, so the comparison uses the same units.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'growth.py',
        code: code`
          balance = 100.0
          for year in range(3):
              balance = balance * 1.1
              print(year + 1, round(balance, 2))
        `,
        output: '1 110.0\n2 121.0\n3 133.1',
      },
    },
  ],
  seeItInAction: {
    title: 'Comparing two raises over three years',
    intro: 'This program compares a fixed raise with a percentage raise, starting from the same salary. The percentage raise compounds, so it pulls ahead over time. Run it, and find the first year where the percentage raise is ahead.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'raises.py',
      code: code`
        fixed = 40000
        percent = 40000.0
        for year in range(1, 4):
            fixed = fixed + 2000
            percent = percent * 1.05
            print(year, fixed, round(percent, 2))
      `,
      output: '1 42000 42000.0\n2 44000 44100.0\n3 46000 46305.0',
    },
    steps: [
      { code: 'fixed = fixed + 2000', explanation: 'An arithmetic sequence. The salary adds the same amount each year.' },
      { code: 'percent = percent * 1.05', explanation: 'A geometric sequence. Each year multiplies the previous salary by the same ratio.' },
      { code: 'print(year, fixed, round(percent, 2))', explanation: 'Shows both salaries side by side. In year 2 the percentage raise pulls ahead, and the gap grows each year after that.' },
      { code: 'range(1, 4)', explanation: 'Runs three years, starting at year 1, so the printed rows match the years.' },
    ],
  },
  tryIt: {
    instructions: [
      'Run the raises program for 10 years instead of 3, and find the first year the percentage raise is ahead by more than 10,000.',
      'Write the first five terms of the sequence that starts at 5 and multiplies by 3 each time, then give a formula for the tenth term.',
      'Add the numbers from 1 to 50 with the formula, then check your answer with a short loop.',
    ],
  },
  mistakes: [
    { mistake: 'Treating a percentage change as a fixed amount.', fix: 'Multiply by the factor each period, and check the first two terms by hand.' },
    { mistake: 'Off-by-one errors when counting terms.', fix: 'Count the steps from the first term. Ten steps after the start is the eleventh term.' },
    { mistake: 'Assuming exponential growth looks dramatic at once.', fix: 'Compare the tables early and late. The curves can look similar at first, and separate later.' },
  ],
  quiz: [
    {
      question: 'What is the next term of the sequence 2, 5, 8, 11?',
      options: [
        { text: '14', explanation: 'Yes. The sequence adds 3 each time, so 11 plus 3 is 14.' },
        { text: '22', explanation: 'That doubles 11. The sequence adds 3 each time, not multiplies.' },
        { text: '13', explanation: 'That adds 2, which is the first term, not the difference.' },
        { text: '16', explanation: 'That adds 5, which is not the difference between the terms.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        n = 10
        print(n * (n + 1) // 2)
      ` },
      options: [
        { text: '55', explanation: 'Yes. The sum of 1 through 10 is 55, and the formula gives 10 times 11 divided by 2.' },
        { text: '100', explanation: 'That is 10 squared. The series sum is different.' },
        { text: '45', explanation: 'That is the sum of 1 through 9. The formula uses n, which is 10 here.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'A savings balance grows by 10 percent each year. Which kind of sequence describes it?',
      options: [
        { text: 'Geometric, because each term multiplies the previous term by the same factor', explanation: 'Yes. A fixed percentage increase multiplies each term by the same factor.' },
        { text: 'Arithmetic, because the balance increases each year', explanation: 'An increase alone does not make a sequence arithmetic. The increase must be a fixed amount.' },
        { text: 'Neither, because percentages cannot form a sequence', explanation: 'Percentages form sequences all the time through their factor.' },
        { text: 'Arithmetic, because the growth is steady', explanation: 'Steady growth in percent is not the same as adding a fixed amount.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Arithmetic sequences add a fixed amount and grow in a straight line, while geometric sequences multiply by a fixed factor and eventually outgrow any straight line.',
  resources: [
    { title: 'Sequences', provider: 'Khan Academy', description: 'Practice arithmetic and geometric sequences, with series and growth problems.', url: 'https://www.khanacademy.org/math/algebra2' },
  ],
}

export default lesson
