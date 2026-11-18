import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Calculate a loss that measures how wrong a formula is across many examples',
    'Run gradient descent steps that lower the loss',
    'Choose a learning rate and spot when it is too large or too small',
  ],
  bigIdea: "Many problems ask for the best choice under a rule: the cheapest plan, the shortest route, or the closest fit to measurements. A cost function gives one number for how far a plan is from the goal. Gradient descent improves the plan one small step at a time, and the size of each step decides whether the search is slow, smooth or out of control.",
  whyItMatters: "A delivery company wants the shortest total distance for its vans, and a factory wants the least material for a box that holds a fixed volume. Each problem has a cost that can be written as one number and a set of settings that can be adjusted. When the steps are too large, the answer swings back and forth. When they are too small, the search takes forever. You can see every one of those behaviors in a dozen lines of Python.",
  goalSections: [
    {
      heading: 'A cost function: one number for how far off a plan is',
      paragraphs: [
        "A loss function turns a formula's mistakes over many examples into a single number. Lower is better, and 0 means every prediction is perfect.",
        "A common choice for predicting numbers is mean squared error. For each example, take the gap between prediction and truth, square it, then average the squares. Squaring keeps every error positive and makes one big miss count more than several small ones.",
        "The loss is what the fit tries to shrink. Choosing it is a real decision: if big misses are especially costly, squared error suits you. If every unit of error costs the same, the average of plain gaps, called mean absolute error, may fit better.",
      ],
      example: {
        language: 'python',
        code: code`
          truth = [3, 5, 7]
          predicted = [2, 5, 10]

          errors = [(p - t) ** 2 for p, t in zip(predicted, truth)]
          print(errors)
          print(sum(errors) / len(errors))
        `,
        output: '[1, 0, 9]\n3.3333333333333335',
      },
    },
    {
      heading: 'Gradient descent, one step at a time',
      paragraphs: [
        "Gradient descent repeats three steps. Work out the gradient of the loss, which says for each setting which way is uphill. Move every setting a small step the opposite way. Measure the loss again.",
        "The update rule is the same for every setting: new value equals old value minus learning rate times gradient. Each pass through the data is called a pass.",
        "For a formula `y = w * x` with squared error, the gradient with respect to `w` can be written exactly: the average of 2 times the error times `x`. You will see that formula in the code below.",
      ],
      example: {
        language: 'python',
        code: code`
          xs = [1, 2, 3]
          ys = [2, 4, 6]  # the true rule is y = 2x
          w = 0.0

          for step in range(3):
              grad = sum(2 * (w * x - y) * x for x, y in zip(xs, ys)) / len(xs)
              w = w - 0.1 * grad
              print(step, round(w, 3))
        `,
        output: '0 1.867\n1 1.991\n2 1.999',
      },
    },
    {
      heading: 'Choosing the learning rate',
      paragraphs: [
        "The learning rate sets the step size. Too small, and the search crawls: after hundreds of steps, the formula has barely improved. Too large, and each step overshoots the bottom of the valley, landing higher up the other side. The loss bounces around or grows until the numbers explode.",
        "A good learning rate makes the loss drop quickly at first and then level off. In practice people try a few values, often 0.1, 0.01 and 0.001, and watch the loss curve.",
        "In the example, a rate of 0.01 is still far from the true answer of 2 after five steps, 0.1 gets there, and 0.35 overshoots by more on every step until the value runs away to 121.67.",
        "If the loss suddenly shoots up or becomes `nan`, meaning not a number, the learning rate is the first thing to check.",
      ],
      example: {
        language: 'python',
        code: code`
          def train(rate, steps=5):
              w = 0.0
              for _ in range(steps):
                  grad = sum(2 * (w * x - 2 * x) * x for x in [1, 2, 3]) / 3
                  w = w - rate * grad
              return round(w, 2)

          print(train(0.01))
          print(train(0.1))
          print(train(0.35))
        `,
        output: '0.77\n2.0\n121.67',
      },
    },
  ],
  seeItInAction: {
    title: 'Fitting a formula to price deliveries',
    intro: "Past deliveries show distance in km and cost in dollars. The formula is `cost = w * km + b`, and gradient descent learns `w` and `b`. The program prints the loss as it falls.",
    example: {
      language: 'python',
      code: code`
        km = [1, 2, 4, 5]
        cost = [5, 7, 11, 13]  # the hidden rule is 2 * km + 3

        w, b = 0.0, 0.0
        rate = 0.05

        for epoch in range(301):
            preds = [w * x + b for x in km]
            errors = [p - y for p, y in zip(preds, cost)]
            loss = sum(e * e for e in errors) / len(km)
            grad_w = sum(2 * e * x for e, x in zip(errors, km)) / len(km)
            grad_b = sum(2 * e for e in errors) / len(km)
            w -= rate * grad_w
            b -= rate * grad_b
            if epoch % 100 == 0:
                print(epoch, round(loss, 4))

        print("w =", round(w, 2), "b =", round(b, 2))
      `,
      output: '0 91.0\n100 0.019\n200 0.0003\n300 0.0\nw = 2.0 b = 3.0',
    },
    steps: [
      { code: 'w, b = 0.0, 0.0', explanation: "The formula starts knowing nothing. Every prediction is 0." },
      { code: 'loss = sum(e * e for e in errors) / len(km)', explanation: "Mean squared error over all four deliveries. At the start the errors are large, so the loss is 91." },
      { code: 'grad_w = ...\ngrad_b = ...', explanation: "The exact gradients for this formula. `w` gets extra weight from `x`, because longer trips are more affected by the per-km price." },
      { code: 'w -= rate * grad_w\nb -= rate * grad_b', explanation: "The update rule, applied to both settings. `-=` subtracts from the current value." },
      { code: 'if epoch % 100 == 0:', explanation: "`%` gives the remainder, so this prints only on epochs 0, 100, 200 and 300. The loss falls fast, then slowly, which is the healthy pattern." },
      { code: 'w = 2.0 b = 3.0', explanation: "The formula has recovered the hidden rule, $2 per km plus a $3 fee, purely from four examples." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground and watch the loss fall.',
      'Change `rate` to 0.001. Predict whether the loss at epoch 300 will be higher or lower than before, then run it.',
      'Change `rate` to 0.1. What happens to the loss? Why?',
    ],
    playground: 'python',
    starterCode: code`
      km = [1, 2, 4, 5]
      cost = [5, 7, 11, 13]  # the hidden rule is 2 * km + 3

      w, b = 0.0, 0.0
      rate = 0.05

      for epoch in range(301):
          preds = [w * x + b for x in km]
          errors = [p - y for p, y in zip(preds, cost)]
          loss = sum(e * e for e in errors) / len(km)
          grad_w = sum(2 * e * x for e, x in zip(errors, km)) / len(km)
          grad_b = sum(2 * e for e in errors) / len(km)
          w -= rate * grad_w
          b -= rate * grad_b
          if epoch % 100 == 0:
              print(epoch, round(loss, 4))

      print("w =", round(w, 2), "b =", round(b, 2))
    `,
  },
  mistakes: [
    { mistake: 'Raising the learning rate to speed up fitting without watching the loss.', fix: 'Past a certain size, larger steps overshoot and the loss grows. Increase gradually and print the loss.' },
    { mistake: 'Judging the fit by the loss on the data it was fitted to alone.', fix: 'A falling loss on the data can mean the formula has memorized the data. Also check the loss on points the fit did not use.' },
    { mistake: 'Treating the loss value as the same thing as the goal.', fix: 'The loss is a stand-in for what you care about. Check real outcomes, like the share of deliveries priced within $1.' },
  ],
  quiz: [
    {
      question: 'A formula predicts `[4, 6]` when the truth is `[5, 9]`. What is the mean squared error?',
      options: [
        { text: '2', explanation: 'That averages the plain gaps, 1 and 3. Mean squared error squares them first.' },
        { text: '10', explanation: 'That is the total of the squared errors. You still need to divide by the number of examples.' },
        { text: '5', explanation: 'The gaps are 1 and 3. Squared, they are 1 and 9, and their average is 5.' },
        { text: '16', explanation: 'That squares the total gap of 4. Square each gap separately, then average.' },
      ],
      answer: 2,
    },
    {
      question: 'During fitting, the loss goes 12, 30, 95, 410. What is the most likely problem?',
      options: [
        { text: 'The learning rate is too large, so each step overshoots', explanation: 'A loss that grows faster and faster is the classic sign of steps that are too big.' },
        { text: 'The learning rate is too small', explanation: 'A tiny learning rate makes the loss fall very slowly, but it does not make it climb.' },
        { text: 'The formula needs more passes to settle down', explanation: 'More passes would make an exploding loss even larger.' },
        { text: 'The loss function is calculated wrongly', explanation: 'Possible, but a steadily climbing loss points first to the step size.' },
      ],
      answer: 0,
    },
    {
      question: 'A setting `w` is 1.5, its gradient is 4, and the learning rate is 0.1. What is `w` after one update?',
      code: { language: 'python', code: code`
        w = 1.5
        grad = 4
        rate = 0.1
        w = w - rate * grad
        print(round(w, 2))
      ` },
      options: [
        { text: '1.9', explanation: 'That adds the step. Gradient descent subtracts it, moving downhill.' },
        { text: '-2.5', explanation: 'That subtracts the whole gradient. The learning rate shrinks the step to 0.1 times 4.' },
        { text: '1.4', explanation: 'That uses only the learning rate. The step is learning rate times gradient.' },
        { text: '1.1', explanation: '1.5 minus 0.1 times 4 is 1.5 minus 0.4, which is 1.1.' },
      ],
      answer: 3,
      answerIsOutput: true,
    },
  ],
  takeaway: 'Fitting means measuring the loss, stepping every setting against its gradient, and repeating, with a learning rate large enough to make progress but small enough not to overshoot.',
  resources: [
    { title: 'Linear regression: gradient descent', provider: 'Google for Developers', description: 'Interactive lessons on loss, gradient descent and learning rates.', url: 'https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent' },
    { title: 'Gradient descent, step by step', provider: '3Blue1Brown', description: 'A visual video on what gradient descent does to a curve.', url: 'https://www.3blue1brown.com/lessons/gradient-descent' },
  ],
  underTheHood: {
    heading: 'Using random samples to save work',
    paragraphs: [
      "The example works out the gradient using every example on every step. With four deliveries that is fine. With 10 million examples, each step would take minutes.",
      "Instead, real calculations use a random sample of the data, often 32 to 1,024 points, to estimate the gradient. The estimate is noisy, because each batch is slightly different, but it is thousands of times cheaper. Taking many quick, rough steps beats taking a few slow, precise ones. This is called stochastic gradient descent, stochastic meaning random.",
      "The noise even helps a little, by jostling the search out of shallow dips in the loss. Refinements of the method keep a running average of recent gradients and adapt the step size for each setting separately. That makes fitting less sensitive to the exact learning rate you choose.",
    ],
  },
}

export default lesson
