import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Write a chance as a number between 0 and 1 and calculate simple probabilities',
    'Summarize a list of numbers with the mean, the median and the spread',
    'Check whether a model\'s confidence matches how often it is right',
  ],
  bigIdea: "Probability puts a number on how likely something is, from 0 (impossible) to 1 (certain). Statistics describes what a pile of data looks like, such as its typical value and how spread out it is. AI models use both: they learn from data, and they answer with probabilities rather than certainties.",
  whyItMatters: "A weather app says there is a 70% chance of rain, it stays dry, and people say the forecast was wrong. It was not, necessarily. A good 70% forecast should be dry on about 3 out of every 10 such days. Reading AI predictions sensibly, and checking whether they deserve trust, depends on understanding exactly this kind of number.",
  goalSections: [
    {
      heading: 'Chance as a number',
      paragraphs: [
        "When every outcome is equally likely, the probability of an event is the number of ways it can happen divided by the number of possible outcomes. A fair die has 6 faces, so the chance of rolling a 6 is 1 out of 6, about 0.167, or 16.7%.",
        "Two rules cover a lot. The chance that something does not happen is 1 minus the chance that it does. And for two independent events, ones that do not affect each other, the chance that both happen is the two probabilities multiplied together. That is why two sixes in a row is rare: 1/6 times 1/6 is 1/36.",
      ],
      example: {
        language: 'python',
        code: code`
          p_six = 1 / 6

          print(round(p_six, 3))
          print(round(1 - p_six, 3))
          print(round(p_six * p_six, 3))
        `,
        output: '0.167\n0.833\n0.028',
      },
    },
    {
      heading: 'Mean, median and spread',
      paragraphs: [
        "The mean, or average, is the total divided by the count. The median is the middle value once the numbers are sorted, or the halfway point between the two middle values if the count is even.",
        "They tell different stories when there are extreme values, called outliers. One very large salary drags the mean up a lot, but barely moves the median. When data is lopsided, like incomes or house prices, the median is usually the fairer typical value.",
        "The spread says how far values tend to sit from the mean. The usual measure is the standard deviation: small means values cluster tightly, large means they vary a lot. Two classes can share an average score of 70 and still look very different.",
      ],
      example: {
        language: 'python',
        code: code`
          import statistics

          salaries = [30, 32, 35, 38, 40, 250]  # in thousands
          print(round(statistics.mean(salaries), 1))
          print(statistics.median(salaries))

          class_a = [68, 70, 72]
          class_b = [40, 70, 100]
          print(statistics.pstdev(class_a) < statistics.pstdev(class_b))
        `,
        output: '70.8\n36.5\nTrue',
      },
    },
    {
      heading: 'Confidence is not certainty',
      paragraphs: [
        "Many models answer with a probability, such as \"80% likely to be spam\". An 80% prediction is meant to be wrong about 1 time in 5. A single wrong answer does not prove the model is bad, and a single right one does not prove it is good.",
        "To judge it, collect many predictions made at the same confidence and count how often they came true. If the model says 80% and those predictions come true about 80% of the time, the model is calibrated: its numbers mean what they say. If they come true only 50% of the time, the model is overconfident, and you should not trust its percentages at face value.",
      ],
      example: {
        language: 'python',
        code: code`
          # 10 emails the model called "80% likely spam", and whether each really was
          really_spam = [True, True, False, True, True, True, False, True, True, True]

          rate = sum(really_spam) / len(really_spam)
          print(rate)
        `,
        output: '0.8',
      },
    },
  ],
  seeItInAction: {
    title: 'Is the weather app\'s "70% chance of rain" honest?',
    intro: "Here are 20 days on which an app forecast a 70% chance of rain, with whether it actually rained. The program checks how often it rained and how surprising the dry days are.",
    example: {
      language: 'python',
      code: code`
        rained = [1, 1, 0, 1, 1, 1, 0, 1, 1, 0,
                  1, 1, 1, 0, 1, 1, 0, 1, 1, 1]

        days = len(rained)
        wet = sum(rained)
        print("Days:", days)
        print("Rained on:", wet)
        print("Rain rate:", wet / days)

        expected_dry = days * (1 - 0.7)
        print("Dry days expected:", round(expected_dry), "seen:", days - wet)
      `,
      output: 'Days: 20\nRained on: 15\nRain rate: 0.75\nDry days expected: 6 seen: 5',
    },
    steps: [
      { code: 'rained = [1, 1, 0, ...]', explanation: "Each day is recorded as 1 for rain and 0 for dry. Using numbers means `sum()` counts the rainy days for us." },
      { code: 'wet = sum(rained)', explanation: "Adding up the 1s gives 15 rainy days out of 20." },
      { code: 'print("Rain rate:", wet / days)', explanation: "It rained on 75% of the days the app said 70%. That is close, so the forecast looks reasonably calibrated." },
      { code: 'expected_dry = days * (1 - 0.7)', explanation: "If the forecast is honest, about 30% of these days should be dry. 30% of 20 is 6 days." },
      { code: 'print("Dry days expected:", ..., "seen:", days - wet)', explanation: "5 dry days against 6 expected is well within normal chance. The dry days are not failures. They are what a 70% forecast predicts. With only 20 days, a difference of one day tells you very little either way." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground.',
      'Change four of the 1s to 0s. Predict the new rain rate before running it. Would you still call the forecast honest?',
      'Add `import statistics` at the top and print the median of `[3, 4, 4, 5, 40]`. Compare it with the mean.',
    ],
    playground: 'python',
    starterCode: code`
      rained = [1, 1, 0, 1, 1, 1, 0, 1, 1, 0,
                1, 1, 1, 0, 1, 1, 0, 1, 1, 1]

      days = len(rained)
      wet = sum(rained)
      print("Days:", days)
      print("Rained on:", wet)
      print("Rain rate:", wet / days)

      expected_dry = days * (1 - 0.7)
      print("Dry days expected:", round(expected_dry), "seen:", days - wet)
    `,
  },
  mistakes: [
    { mistake: 'Judging a probability from a single outcome.', fix: 'One dry day after a 70% forecast proves nothing. Gather many predictions at the same confidence and count.' },
    { mistake: 'Using the mean for data with big outliers.', fix: 'Report the median too, or instead, whenever a few extreme values could drag the average.' },
    { mistake: 'Multiplying probabilities of events that affect each other.', fix: 'Multiplying only works when events are independent. Rain today and rain tomorrow are linked, so 0.5 times 0.5 would be wrong.' },
  ],
  quiz: [
    {
      question: 'A bag holds 3 red marbles and 7 blue ones. You pick one without looking. What is the probability it is red?',
      options: [
        { text: '3/7', explanation: 'That compares red with blue. Probability compares red with all 10 marbles.' },
        { text: '0.3', explanation: '3 red ways out of 10 possible marbles is 3/10, which is 0.3.' },
        { text: '0.7', explanation: 'That is the chance of picking blue, which is 1 minus the chance of red.' },
        { text: '3', explanation: 'A probability is always between 0 and 1. Three is the count of red marbles.' },
      ],
      answer: 1,
    },
    {
      question: 'Five friends earn 30, 35, 40, 45 and 300 thousand a year. Which number best describes a typical friend\'s income?',
      options: [
        { text: 'The mean, 90 thousand', explanation: 'The one large income pulls the mean far above what four of the five friends earn.' },
        { text: 'The highest, 300 thousand', explanation: 'The maximum describes one person, not a typical one.' },
        { text: 'The median, 40 thousand', explanation: 'The middle value ignores how extreme the outlier is, so it reflects most of the group.' },
        { text: 'The spread, because income varies', explanation: 'Spread tells you how varied incomes are, not what a typical income is.' },
      ],
      answer: 2,
    },
    {
      question: 'A model labels 200 photos "90% likely a cat". 120 of them really are cats. What does this tell you?',
      options: [
        { text: 'The model is overconfident: its 90% predictions are right only 60% of the time', explanation: '120 out of 200 is 60%. Calibrated 90% predictions should be right about 180 times.' },
        { text: 'The model is working, since most of them were cats', explanation: 'Being right more often than not is not enough. The model claimed 90%, so 60% means its numbers are not trustworthy.' },
        { text: 'The model is underconfident, since it said only 90%', explanation: 'Underconfident would mean being right more often than claimed, such as 98% of the time.' },
        { text: 'Nothing, because a probability cannot be checked', explanation: 'A single prediction cannot be checked, but many predictions at the same confidence can be.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A probability is a number from 0 to 1 that only proves itself over many cases, and a good summary of data gives a typical value and its spread, not just an average.',
  resources: [
    { title: 'Statistics and probability', provider: 'Khan Academy', description: 'Free videos and practice on probability, averages and spread.', url: 'https://www.khanacademy.org/math/statistics-probability' },
    { title: 'Seeing Theory', provider: 'Brown University', description: 'Interactive, visual introduction to probability and statistics.', url: 'https://seeing-theory.brown.edu/' },
  ],
  underTheHood: {
    heading: 'Conditional probability and Bayes\' rule',
    paragraphs: [
      "Often you want a probability given that you already know something, written P(A given B). The classic example: a disease affects 1 in 100 people, and a test catches 90% of cases but also wrongly flags 9% of healthy people. You test positive. How likely is it that you are sick?",
      "Picture 1,000 people. 10 are sick, and 9 of them test positive. Of the 990 healthy people, 9% test positive too, about 89. So of 98 positive tests, only 9 are real: about 9%, not 90%.",
      "This calculation is Bayes' rule, and it explains why rare events produce many false alarms. It is also built into many AI systems. A spam filter, for example, combines how common spam is overall with how strongly each word points to spam.",
    ],
  },
}

export default lesson
