import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Turn a real situation into variables, a formula and a list of assumptions',
    'Fit the formula\'s numbers to data and use it to make a prediction',
    'Test a model on new observations and notice when its assumptions break',
  ],
  bigIdea: "A mathematical model is a simplified description of a real situation, written as variables and a formula. Every model leaves things out on purpose, and the choices about what to leave out are its assumptions. A model is useful when its predictions hold up on data it was not built from, and only inside the range where its assumptions are true.",
  whyItMatters: "A café notices that it sells more iced drinks on hot days and wants to know how much milk and ice to order. A simple model, iced drinks as a straight-line function of temperature, could plan the week in seconds. But if nobody writes down that the model assumes an ordinary weekday, it will badly under-order for a hot public holiday when a festival is in town. Modeling well means knowing exactly what your formula is ignoring.",
  goalSections: [
    {
      heading: 'Variables, a formula and assumptions',
      paragraphs: [
        "Start with the question the model must answer, then pick the variables. The output is what you want to predict, here iced drinks sold. The inputs are what you believe drives it, here the day's high temperature.",
        "Next choose the simplest formula that could plausibly work. Sales probably rise steadily with temperature, so try a straight line: `drinks = a * temp + b`. The letters `a` and `b` are parameters: numbers you will work out from data.",
        "Finally, write the assumptions down: the link is a straight line, nothing else matters much (no events, no holidays), and the pattern stays the same over time. Each assumption is a place the model could fail.",
      ],
      example: {
        language: 'text',
        code: code`
          Question:     how many iced drinks will we sell tomorrow?
          Output:       drinks sold in a day
          Input:        forecast high temperature in Celsius
          Formula:      drinks = a * temp + b
          Assumptions:  - sales rise in a straight line with temperature
                        - ordinary weekdays only, no events or holidays
                        - prices and opening hours stay the same
        `,
      },
    },
    {
      heading: 'Fitting the numbers from data',
      paragraphs: [
        "To find `a` and `b`, use past days where you know both the temperature and the sales. The usual method, least squares, picks the line that makes the squared gaps between the line and the real points as small as possible.",
        "For a straight line there is an exact recipe. The slope is how much temperature and sales move together, divided by how much temperature varies on its own. The intercept then makes the line pass through the point of average temperature and average sales.",
        "Once fitted, the parameters have plain meanings. A slope of 6 would mean each extra degree brings about 6 more iced drinks.",
      ],
      example: {
        language: 'python',
        code: code`
          temps = [15, 18, 21, 24, 27]
          drinks = [40, 58, 75, 95, 112]

          mean_t = sum(temps) / len(temps)
          mean_d = sum(drinks) / len(drinks)
          together = sum((t - mean_t) * (d - mean_d) for t, d in zip(temps, drinks))
          spread = sum((t - mean_t) ** 2 for t in temps)

          a = together / spread
          b = mean_d - a * mean_t
          print(round(a, 2), round(b, 2))
        `,
        output: '6.03 -50.7',
      },
    },
    {
      heading: 'Testing the model and its limits',
      paragraphs: [
        "A model that fits the days it was built from proves little. Test it on days it has not seen, and look at the residuals: the real value minus the prediction. Residuals that are small and fall on both sides of zero are a good sign.",
        "Look for patterns in the residuals too. If the model is always too low on the hottest days, the straight-line assumption is breaking down there, perhaps because sales level off when the café runs out of seats.",
        "Also respect the range. This model was fitted on 15 to 27 degrees. At 2 degrees it predicts a negative number of drinks, which is impossible. Outside the data, the formula is only a guess.",
      ],
      example: {
        language: 'python',
        code: code`
          a, b = 6.03, -50.7

          def predict(temp):
              return a * temp + b

          print(round(predict(20)))
          print(round(predict(2)))
        `,
        output: '70\n-39',
      },
    },
  ],
  seeItInAction: {
    title: 'Checking the café model on new days',
    intro: "The model was fitted on five past weekdays. Here it is tested on four new days, including one with a local festival, to see where it holds and where it breaks.",
    example: {
      language: 'python',
      code: code`
        a, b = 6.03, -50.7

        new_days = [
            ("Mon", 19, 62),
            ("Tue", 23, 88),
            ("Wed", 26, 104),
            ("Sat festival", 25, 190),
        ]

        for name, temp, actual in new_days:
            predicted = a * temp + b
            residual = actual - predicted
            flag = "  <- check assumptions" if abs(residual) > 20 else ""
            print(name, round(predicted), actual, round(residual), flag)
      `,
      output: 'Mon 64 62 -2 \nTue 88 88 0 \nWed 106 104 -2 \nSat festival 100 190 90   <- check assumptions',
    },
    steps: [
      { code: 'a, b = 6.03, -50.7', explanation: "The parameters fitted in the previous section: about 6 more drinks per degree." },
      { code: '("Mon", 19, 62),', explanation: "Each new day records its name, temperature and the real number of drinks sold. None of these days were used for fitting." },
      { code: 'residual = actual - predicted', explanation: "The residual is the real result minus the prediction. Positive means the model guessed too low." },
      { code: 'flag = ... if abs(residual) > 20 else ""', explanation: "`abs()` removes the minus sign. Any miss bigger than 20 drinks gets flagged for a closer look." },
      { code: 'Mon, Tue, Wed: residuals of -2, 0 and -2', explanation: "On ordinary weekdays the model is within 2 drinks of the real sales. It works where its assumptions hold." },
      { code: 'Sat festival: residual 90', explanation: "The festival broke the assumption that nothing but temperature matters. The fix is not to tweak `a` or `b`, but to add an input, such as an event flag, or to treat event days separately." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground.',
      'Add a new day `("Thu", 35, 140)`, a heatwave outside the fitted range. Predict whether it gets flagged, then run it.',
      'Change the flag limit from 20 to 5. Which days are flagged now, and would you change the model because of them?',
    ],
    playground: 'python',
    starterCode: code`
      a, b = 6.03, -50.7

      new_days = [
          ("Mon", 19, 62),
          ("Tue", 23, 88),
          ("Wed", 26, 104),
          ("Sat festival", 25, 190),
      ]

      for name, temp, actual in new_days:
          predicted = a * temp + b
          residual = actual - predicted
          flag = "  <- check assumptions" if abs(residual) > 20 else ""
          print(name, round(predicted), actual, round(residual), flag)
    `,
  },
  mistakes: [
    { mistake: 'Keeping the assumptions in your head instead of writing them down.', fix: 'List every assumption next to the formula, so you and others know when the model should not be trusted.' },
    { mistake: 'Testing the model only on the data used to fit it.', fix: 'Hold back some observations, or wait for new ones, and check the residuals on those.' },
    { mistake: 'Using the model far outside the range of the data.', fix: 'Note the range the parameters came from, and treat predictions beyond it as rough guesses at best.' },
  ],
  quiz: [
    {
      question: 'A model predicts 80 visitors and 95 actually come. What is the residual?',
      options: [
        { text: '-15', explanation: 'The residual is actual minus predicted, so it is positive when the model guessed too low.' },
        { text: '15', explanation: '95 minus 80 is 15. The positive sign tells you the model underestimated.' },
        { text: '175', explanation: 'That adds the two numbers. A residual measures the gap between them.' },
        { text: '0.84', explanation: 'That is the prediction divided by the actual value, a ratio rather than a residual.' },
      ],
      answer: 1,
    },
    {
      question: 'A model of electricity use against outside temperature was fitted on data from 5 to 25 degrees. What is the safest view of its prediction for -10 degrees?',
      options: [
        { text: 'It is as reliable as any other prediction', explanation: 'The formula was never checked at such cold temperatures, where heating may behave differently.' },
        { text: 'It must be wrong and should be ignored', explanation: 'It could be roughly right. It just has no evidence behind it at that temperature.' },
        { text: 'It is a guess outside the fitted range, so check it against real cold-day data before relying on it', explanation: 'Predictions outside the data range rest entirely on the assumption that the pattern continues.' },
        { text: 'It will be accurate as long as the slope is positive', explanation: 'The sign of the slope says nothing about whether the straight-line pattern continues.' },
      ],
      answer: 2,
    },
    {
      question: 'A delivery-time model has small residuals on most days but is always 25 minutes too low on days with heavy rain. What should you do?',
      options: [
        { text: 'Raise the intercept so every prediction is 25 minutes longer', explanation: 'That would make the model worse on all the dry days, where it is currently accurate.' },
        { text: 'Remove rainy days from the test data', explanation: 'That hides the failure instead of fixing it. Rainy days still happen in real life.' },
        { text: 'Nothing, since the model is accurate on average', explanation: 'A pattern in the residuals is a signal. Customers on rainy days would get wrong promises every time.' },
        { text: 'Treat it as a broken assumption and add rain as an input to the model', explanation: 'A residual pattern tied to one condition means the model is missing that factor. Adding it addresses the cause.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Write the model as variables, a formula and explicit assumptions, fit it to data, and trust it only where tests on new observations show its assumptions still hold.',
  resources: [
    { title: 'Fitting a line to data', provider: 'Khan Academy', description: 'Free lessons on scatter plots, lines of best fit and residuals.', url: 'https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data' },
    { title: 'Linear regression', provider: 'Google for Developers', description: 'How the same straight-line model is fitted and checked in statistics.', url: 'https://developers.google.com/machine-learning/crash-course/linear-regression' },
  ],
  underTheHood: {
    heading: 'Why least squares picks the line it does',
    paragraphs: [
      "There are endless lines you could draw through a scatter of points. Least squares chooses the one with the smallest total of squared residuals. Squaring makes every gap positive, and it punishes one large miss more than several small ones.",
      "The slope formula used above comes from calculus. Write the sum of squared residuals as a function of `a` and `b`, set both of its slopes to zero to find the bottom of that bowl-shaped function, and solve. The answer is the covariance of the two variables (how they move together) divided by the variance of the input (how much it moves on its own).",
      "Gradient descent, from the optimization lesson, would find the same line by walking downhill. The exact formula is faster here, but it only exists for simple models. For very complicated models, walking downhill is often the only practical option.",
    ],
  },
}

export default lesson
