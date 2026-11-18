import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Turn an everyday question into a number question with clear units and assumptions',
    'Check a result with an estimate, a unit check, and a second method',
    'Explain the answer and its limits in plain words to someone who did not do the calculation',
  ],
  bigIdea: 'Most real questions with numbers can be answered by the same steps: state the question, list the quantities and their units, make a rough estimate, calculate, and check the result two ways. This checkpoint brings together the math in this section, from fractions and rates to exponents, charts, and counting, in one realistic question.',
  whyItMatters: 'A family wonders whether to buy a bigger car that uses more fuel but has a lower price, or keep the old one. The question mixes prices, rates, time, and a comparison over several years. Someone who can set it up clearly, estimate the answer, and check the units can make the decision with confidence. Someone who cannot is left guessing or trusting a salesperson.',
  goalSections: [
    {
      heading: 'State the question and the units',
      paragraphs: [
        'Start by writing the question in one sentence that names the quantity you want. "Which car costs less over five years?" is better than "Which car is good?" because it defines what the answer must measure. The sentence also tells you what to compare.',
        'List every quantity you need, with its unit. Purchase price is in dollars. Fuel use is in liters per hundred kilometers. Distance per year is in kilometers. Fuel price is in dollars per liter. Writing the units first prevents the most common mistake in everyday math, which is mixing units in one step.',
        'State your assumptions. The distance per year, the fuel price, and the years of ownership are all assumptions. Write them down, so that anyone reviewing the answer can change one and see the new result.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Question: which car costs less over five years?
          Quantities: purchase price (dollars), fuel use (liters per 100 km), distance (km per year), fuel price (dollars per liter), years (5)
          Assumptions: 10,000 km per year, 2.00 dollars per liter, no resale value
        `,
      },
    },
    {
      heading: 'Estimate, calculate, and check',
      paragraphs: [
        'Estimate before you calculate. If a car uses ten liters per hundred kilometers and you drive ten thousand kilometers a year, that is about one thousand liters a year. At about two dollars per liter, the fuel is roughly two thousand dollars a year. An estimate like this tells you whether a detailed answer is in the right range.',
        'Calculate the total cost for each option over the same period. Use the same years and the same distance for both cars, so the comparison is fair. Add the purchase price to the fuel cost for each year multiplied by the number of years.',
        'Check the result in a second way. Divide the total by the years to get a cost per year, then multiply back. Check that the units at each step are the units you wanted, and that the answer is close to your estimate. A large gap is a warning to look again.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          years = 5
          km_per_year = 10000
          fuel_price = 2.0

          options = {
              "old car": {"price": 6000, "liters_per_100km": 9.0},
              "new car": {"price": 18000, "liters_per_100km": 6.0},
          }
          for name, car in options.items():
              liters_per_year = km_per_year / 100 * car["liters_per_100km"]
              fuel_per_year = liters_per_year * fuel_price
              total = car["price"] + fuel_per_year * years
              print(name, "total over", years, "years:", round(total))
        `,
        output: 'old car total over 5 years: 15000\nnew car total over 5 years: 24000',
      },
    },
    {
      heading: 'Explain the answer honestly',
      paragraphs: [
        'Write the answer as a sentence with the number, the period, and the assumptions. "Over five years, the old car costs about fifteen thousand dollars and the new car about twenty-four thousand, assuming ten thousand kilometers a year and two dollars a liter." A reader can see what the answer depends on.',
        'Name what the answer does not include. Maintenance, resale value, insurance, and interest on a loan can change the result. If one of these might be large, say so and estimate it, rather than leaving it out silently.',
        'Test the sensitivity. Change the fuel price or the distance by a reasonable amount and see whether the decision changes. If a small change flips the answer, the decision is close, and the honest conclusion is that the choice depends on that assumption.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Over five years, the old car costs about 15,000 dollars and the new car about 24,000 dollars.
          This assumes 10,000 km per year and fuel at 2.00 dollars per liter.
          Not included: insurance, maintenance, resale value, and loan interest.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Testing how sensitive the answer is',
    intro: 'The program below repeats the car comparison for three fuel prices and reports which car is cheaper each time. If the winner changes with the fuel price, the decision depends on that assumption. Run it, then change the new car price and predict whether the winner changes.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        years, km_per_year = 5, 10000
        old = {"price": 6000, "liters_per_100km": 9.0}
        new = {"price": 18000, "liters_per_100km": 6.0}

        def total(car, fuel_price):
            liters = km_per_year / 100 * car["liters_per_100km"]
            return car["price"] + liters * fuel_price * years

        for fuel_price in [1.5, 2.0, 2.5]:
            winner = "old car" if total(old, fuel_price) < total(new, fuel_price) else "new car"
            print("fuel", fuel_price, "-> cheaper:", winner)
      `,
      output: 'fuel 1.5 -> cheaper: old car\nfuel 2.0 -> cheaper: old car\nfuel 2.5 -> cheaper: old car',
    },
    steps: [
      { code: 'def total(car, fuel_price):', explanation: 'One function computes the full cost, so both cars are compared with the same rule.' },
      { code: 'liters = km_per_year / 100 * car["liters_per_100km"]', explanation: 'Converts the fuel rate into liters per year, which is a unit check built into the calculation.' },
      { code: 'for fuel_price in [1.5, 2.0, 2.5]:', explanation: 'Tests the answer across a range, so the decision is not based on one assumed price.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a question of your own from daily life that needs a comparison over time, such as two phone plans or two ways to travel. List the quantities with their units.',
      'Change the distance per year in the example to 20000 and predict whether the old car stays cheaper. Run the program to check.',
      'Write a one-paragraph answer for your question, with the number, the period, the assumptions, and one thing the answer does not include.',
    ],
  },
  mistakes: [
    { mistake: 'Calculating before stating the question and the units.', fix: 'Write the question and each quantity with its unit before any arithmetic.' },
    { mistake: 'Comparing options over different periods or distances.', fix: 'Use the same period, distance, and assumptions for every option.' },
    { mistake: 'Reporting a number without its assumptions or its limits.', fix: 'Write the answer with its assumptions and name what is left out.' },
  ],
  quiz: [
    {
      question: 'What should be written before any calculation in this checkpoint?',
      options: [
        { text: 'The final answer', explanation: 'The answer comes at the end. Writing it first skips the steps that check it.' },
        { text: 'The question, the quantities, and their units', explanation: 'Yes. Defining the question and units first prevents the most common everyday mistakes.' },
        { text: 'The brand names of the products', explanation: 'Brands do not define the quantities needed to answer the question.' },
        { text: 'A chart with no labels', explanation: 'A chart without labels cannot be checked, so it does not help at the start.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for the old car when fuel is 2.0?',
      code: { language: 'python', runnable: true, code: code`
        years, km = 5, 10000
        liters = km / 100 * 9.0
        total = 6000 + liters * 2.0 * years
        print("old car:", round(total))
      ` },
      options: [
        { text: 'old car: 15000', explanation: 'Yes. Nine hundred liters a year at two dollars is 1800 a year, which over five years adds 9000 to 6000.' },
        { text: 'old car: 6000', explanation: 'The purchase price is only part of the total. Fuel adds to it each year.' },
        { text: 'old car: 9000', explanation: 'That is only the fuel cost, and the purchase price is missing.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why test the answer with a different fuel price?',
      options: [
        { text: 'To see whether the decision changes when an assumption changes', explanation: 'Yes. If a small change flips the winner, the decision depends on that assumption.' },
        { text: 'To make the answer look more certain', explanation: 'Testing sensitivity does the opposite. It shows how certain the answer really is.' },
        { text: 'To avoid writing down the assumptions', explanation: 'Assumptions should always be written down, and the test relies on them.' },
        { text: 'Because fuel prices never change', explanation: 'Fuel prices do change, which is why the test matters.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'State the question and its units, estimate before calculating, compare options over the same period, check the result two ways, and explain the answer with its assumptions and limits.',
  resources: [
    { title: 'Algebra basics', provider: 'Khan Academy', description: 'Free lessons on the variables, equations and rates behind everyday calculations.', url: 'https://www.khanacademy.org/math/algebra-basics' },
    { title: 'Arithmetic', provider: 'Khan Academy', description: 'Free practice with whole numbers, decimals, fractions and percentages.', url: 'https://www.khanacademy.org/math/arithmetic-home' },
  ],
}

export default lesson
