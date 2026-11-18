import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Work with fractions, decimals, and percentages, and convert between them',
    'Compare quantities with ratios and rates',
    'Convert between units, and check whether an answer is reasonable',
  ],
  bigIdea: 'Most everyday math is about parts of a whole, comparisons, and units. A fraction, a decimal, and a percentage can describe the same amount, and a ratio or a rate compares two quantities. Checking the units is often the fastest way to catch a mistake.',
  whyItMatters: 'A recipe serves four people and needs three cups of flour. A guest list grows to ten people. Scaling the recipe is a ratio problem, and a careless scaling gives a cake that does not rise. A sale price marked 30 percent off is a percentage problem, and confusing 30 percent with 3 percent costs real money. These skills are used every day, and they are worth doing carefully.',
  goalSections: [
    {
      heading: 'Fractions, decimals, and percentages',
      paragraphs: [
        'A fraction shows a part of a whole, written with a top number, the numerator, and a bottom number, the denominator. Three quarters means three parts out of four. A decimal writes the same amount in tenths, hundredths, and so on, so three quarters is 0.75.',
        'A percentage is a fraction out of one hundred. Thirty percent means thirty out of one hundred, or 0.30 as a decimal. To change a percentage to a decimal, divide by one hundred. To find a percentage of a number, multiply the number by the decimal.',
        'Being able to switch between the three forms makes many problems easier. A discount of one quarter is twenty-five percent off, and a price of forty dollars with that discount is forty times 0.75, which is thirty dollars.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          price = 40.00
          discount_percent = 25
          discount = price * discount_percent / 100
          sale_price = price - discount
          print("discount:", discount)
          print("sale price:", sale_price)
        `,
        output: 'discount: 10.0\nsale price: 30.0',
      },
    },
    {
      heading: 'Ratios and rates',
      paragraphs: [
        'A ratio compares two quantities of the same kind, such as three cups of flour to two cups of sugar. Ratios let you scale a recipe up or down by multiplying every part by the same number. A recipe for four that is scaled to ten multiplies every quantity by two and a half.',
        'A rate compares two different units, such as kilometers per hour or dollars per kilogram. Rates let you compare options fairly. A bag of rice at four dollars for two kilograms costs two dollars per kilogram, which can be compared with a larger bag at a different price.',
        'When scaling, keep the same ratio for every part. A common mistake is to scale the flour and forget the eggs, which changes the balance of the whole recipe.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          recipe_for_4 = {"flour": 3, "sugar": 2}
          factor = 10 / 4
          for item, amount in recipe_for_4.items():
              print(item, amount * factor)
        `,
        output: 'flour 7.5\nsugar 5.0',
      },
    },
    {
      heading: 'Units and reasonable answers',
      paragraphs: [
        'A number without a unit is incomplete. Five is not useful until you know whether it means five meters, five seconds, or five dollars. Write the unit with every number, and carry it through each step of a calculation, so you can see when the units do not match.',
        'Convert units by multiplying by a conversion factor that equals one. There are one hundred centimeters in a meter, so 250 centimeters is 250 divided by 100, which is 2.5 meters. Check the direction: the answer should have the unit you wanted.',
        'Estimate before you calculate. If a car travels sixty kilometers per hour for three hours, the answer should be about 180 kilometers. A result of 18 or 1800 is a sign that a unit or a decimal point went wrong.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          distance_km = 60 * 3
          distance_m = distance_km * 1000
          print("distance in km:", distance_km)
          print("distance in m:", distance_m)
          print("estimate check:", 60 * 3 == distance_km)
        `,
        output: 'distance in km: 180\ndistance in m: 180000\nestimate check: True',
      },
    },
  ],
  seeItInAction: {
    title: 'Comparing two options by unit price',
    intro: 'The program below compares two bags of rice by price per kilogram, which is a rate, and checks which is the better deal. Comparing total prices alone would mislead you, because the bags are different sizes. Run it, then change the large bag\'s price and predict which bag wins.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        bags = {"small": (2.0, 1.5), "large": (5.0, 4.0)}
        for name, (kilograms, price) in bags.items():
            print(name, "costs", round(price / kilograms, 2), "per kilogram")
        best = min(bags, key=lambda name: bags[name][1] / bags[name][0])
        print("better value:", best)
      `,
      output: 'small costs 0.75 per kilogram\nlarge costs 0.8 per kilogram\nbetter value: small',
    },
    steps: [
      { code: 'bags = {"small": (2.0, 1.5), ...}', explanation: 'Each bag is stored with its weight in kilograms and its price, so the units are written down.' },
      { code: 'print(name, "costs", round(price / kilograms, 2), "per kilogram")', explanation: 'Turns each price into a rate, the same unit for both bags, so they can be compared fairly.' },
      { code: 'best = min(bags, key=lambda name: bags[name][1] / bags[name][0])', explanation: 'Picks the bag with the lowest price per kilogram, which is the comparison that matters.' },
    ],
  },
  tryIt: {
    instructions: [
      'Scale a recipe for four people to serve ten, multiplying every quantity by the same number. Write the new amounts with their units.',
      'Change the large bag in the example to 4.5 dollars and predict which bag is the better value. Run it to check.',
      'Find a sale price in a shop you know, and calculate the discount in dollars from the percentage. Estimate first, then calculate.',
    ],
  },
  mistakes: [
    { mistake: 'Comparing total prices when the sizes are different.', fix: 'Divide each price by its amount to get a rate, and compare the rates.' },
    { mistake: 'Scaling some ingredients and forgetting others.', fix: 'Multiply every quantity by the same factor, and check that the ratio is still the same.' },
    { mistake: 'Dropping units during a calculation.', fix: 'Write the unit with every number, and check that the final unit is the one you wanted.' },
  ],
  quiz: [
    {
      question: 'What is 30 percent of 80?',
      options: [
        { text: '2.4', explanation: 'That is 3 percent of 80. Thirty percent is 30 out of 100.' },
        { text: '24', explanation: 'Yes. Thirty percent is 0.30, and 0.30 times 80 is 24.' },
        { text: '240', explanation: 'That is 300 percent of 80, which is too large.' },
        { text: '50', explanation: 'That is 62.5 percent of 80, which does not match thirty percent.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for the sale price?',
      code: { language: 'python', runnable: true, code: code`
        price = 20.0
        discount = price * 10 / 100
        print("sale price:", price - discount)
      ` },
      options: [
        { text: 'sale price: 2.0', explanation: 'That would be the discount, not the sale price.' },
        { text: 'sale price: 18.0', explanation: 'Yes. Ten percent of twenty is two, and twenty minus two is eighteen.' },
        { text: 'sale price: 10.0', explanation: 'That is half the price, which would be a fifty percent discount.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Which is the better comparison when two bags have different sizes?',
      options: [
        { text: 'The total price of each bag', explanation: 'Total price ignores the different amounts, so it can mislead.' },
        { text: 'The price per kilogram of each bag', explanation: 'Yes. A rate puts both bags in the same unit, so the comparison is fair.' },
        { text: 'The color of each bag', explanation: 'Color does not describe the value of the rice.' },
        { text: 'The date printed on each bag', explanation: 'The date does not show which bag is the better deal.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Move easily between fractions, decimals, and percentages, compare quantities with ratios and rates, and keep units on every number so you can check whether an answer is reasonable.',
  resources: [
    { title: 'Fractions, decimals, and percentages', provider: 'Khan Academy', description: 'Free lessons on converting between fractions, decimals, and percentages.', url: 'https://www.khanacademy.org/math/arithmetic' },
    { title: 'Ratios and rates', provider: 'Khan Academy', description: 'Free lessons on ratios, rates, and unit rates with worked examples.', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math' },
  ],
}

export default lesson
