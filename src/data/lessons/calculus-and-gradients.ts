import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe a derivative as how fast an output changes when you nudge the input',
    'Estimate a derivative by nudging the input a tiny amount',
    'Use a gradient to tell which way, and how strongly, each input pushes the output',
  ],
  bigIdea: "A derivative measures how much an output changes when you nudge an input a tiny bit: it is the slope at a single point. When a function has many inputs, the gradient is the list of slopes, one per input. Training an AI model means using the gradient to decide which way to adjust each of its settings.",
  whyItMatters: "A model has millions of settings and a score for how wrong it is. Nobody can try every combination. The gradient answers a precise question for every setting at once: if I nudge this up a little, does the error go up or down, and by how much? That answer is what lets a model improve step by step instead of by blind guessing.",
  goalSections: [
    {
      heading: 'A derivative is a slope at one point',
      paragraphs: [
        "For a straight line, the slope is the same everywhere: `y = 3x` always rises 3 for each step of 1 in `x`. For a curve, the steepness changes as you move along it. The derivative gives the steepness at one exact point.",
        "Take `f(x) = x * x`. Near `x = 1` the curve is fairly flat, and near `x = 5` it is much steeper. Its derivative is `2x`, so the slope is 2 at `x = 1` and 10 at `x = 5`.",
        "The sign matters as much as the size. A positive derivative means the output rises as the input rises. A negative one means it falls. A derivative of 0 means the curve is flat right there, which is what you find at the bottom of a valley.",
      ],
      example: {
        language: 'python',
        code: code`
          def f(x):
              return x * x

          def slope(x):
              return 2 * x

          for x in [-2, 0, 1, 5]:
              print(x, f(x), slope(x))
        `,
        output: '-2 4 -4\n0 0 0\n1 1 2\n5 25 10',
      },
    },
    {
      heading: 'Estimating a derivative with a small nudge',
      paragraphs: [
        "You do not need calculus rules to find a slope. Nudge the input by a tiny amount, call it `h`, and see how much the output moves. The slope is roughly the change in output divided by the change in input: `(f(x + h) - f(x)) / h`.",
        "The smaller the nudge, the closer the estimate gets to the true derivative. With `h = 0.001` at `x = 3`, the estimate for `x * x` is 6.001, very close to the exact answer of 6.",
        "This trick is called a finite difference. It is slow for large models, but it is a great way to check that a derivative worked out another way is correct.",
      ],
      example: {
        language: 'python',
        code: code`
          def f(x):
              return x * x

          x = 3
          for h in [1, 0.1, 0.001]:
              estimate = (f(x + h) - f(x)) / h
              print(h, round(estimate, 4))
        `,
        output: '1 7.0\n0.1 6.1\n0.001 6.001',
      },
    },
    {
      heading: 'Gradients: one slope per input',
      paragraphs: [
        "Most real functions have several inputs. A partial derivative is the slope with respect to one input while the others are held still. The gradient is the list of all of them.",
        "For `f(a, b) = a * a + 3 * b`, nudging `a` gives a slope of `2a`, and nudging `b` gives a slope of 3. At `a = 2, b = 1`, the gradient is `[4, 3]`: increasing `a` raises the output by about 4 per unit, increasing `b` by about 3.",
        "The gradient points in the direction where the output climbs fastest. Step the opposite way, and the output falls fastest. That is the whole idea behind training.",
      ],
      example: {
        language: 'python',
        code: code`
          def f(a, b):
              return a * a + 3 * b

          h = 0.0001
          a, b = 2, 1
          grad_a = (f(a + h, b) - f(a, b)) / h
          grad_b = (f(a, b + h) - f(a, b)) / h
          print(round(grad_a, 2), round(grad_b, 2))
        `,
        output: '4.0 3.0',
      },
    },
  ],
  seeItInAction: {
    title: 'Which setting should a model change?',
    intro: "A tiny model predicts `w * x + b`. For one example, with `x = 2` and a true answer of 10, its error is the squared gap between prediction and truth. The program works out the gradient of the error and uses it to decide which way to move each setting.",
    example: {
      language: 'python',
      code: code`
        def error(w, b):
            prediction = w * 2 + b
            return (prediction - 10) ** 2

        w, b = 1, 1
        h = 0.0001
        print("error now:", error(w, b))

        grad_w = (error(w + h, b) - error(w, b)) / h
        grad_b = (error(w, b + h) - error(w, b)) / h
        print("gradient:", round(grad_w, 1), round(grad_b, 1))

        w, b = w - 0.05 * grad_w, b - 0.05 * grad_b
        print("error after one step:", round(error(w, b), 2))
      `,
      output: 'error now: 49\ngradient: -28.0 -14.0\nerror after one step: 12.25',
    },
    steps: [
      { code: 'return (prediction - 10) ** 2', explanation: "The error is the gap squared. `**` means to the power of. Squaring makes every error positive and punishes big misses more." },
      { code: 'print("error now:", error(w, b))', explanation: "With both settings at 1, the prediction is 3 against a truth of 10. The gap of 7, squared, is 49." },
      { code: 'grad_w = (error(w + h, b) - error(w, b)) / h', explanation: "Nudge `w` alone and watch the error. The slope is about -28: raising `w` would lower the error quickly." },
      { code: 'grad_b = ...', explanation: "Nudge `b` alone. Its slope is about -14, so raising `b` also helps, but half as strongly, because `b` is not multiplied by `x`." },
      { code: 'w, b = w - 0.05 * grad_w, b - 0.05 * grad_b', explanation: "Step each setting against its slope. A negative gradient means increase it, and the bigger slope gets the bigger change." },
      { code: 'error after one step: 12.25', explanation: "One step guided by the gradient cut the error from 49 to 12.25, a quarter of where it started. Repeating this is how training works." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground.',
      'Change the starting values to `w, b = 6, 1`, so the prediction is too high. Predict the signs of the two gradients before running it.',
      'Change the step size 0.05 to 0.2. Does the error after one step improve at all? The next lesson explains what went wrong.',
    ],
    playground: 'python',
    starterCode: code`
      def error(w, b):
          prediction = w * 2 + b
          return (prediction - 10) ** 2

      w, b = 1, 1
      h = 0.0001
      print("error now:", error(w, b))

      grad_w = (error(w + h, b) - error(w, b)) / h
      grad_b = (error(w, b + h) - error(w, b)) / h
      print("gradient:", round(grad_w, 1), round(grad_b, 1))

      w, b = w - 0.05 * grad_w, b - 0.05 * grad_b
      print("error after one step:", round(error(w, b), 2))
    `,
  },
  mistakes: [
    { mistake: 'Stepping in the same direction as the gradient when you want a smaller error.', fix: 'The gradient points uphill. To reduce error, subtract it: new value = old value minus step size times gradient.' },
    { mistake: 'Thinking a derivative of 0 always means the best possible value.', fix: 'It means flat. That could be the bottom of a valley, but also a hilltop or a flat shelf. Check the error itself.' },
    { mistake: 'Using a nudge that is too large when estimating a slope.', fix: 'Big nudges blur the slope across a wide stretch of the curve. Use something small, like 0.0001.' },
  ],
  quiz: [
    {
      question: 'The derivative of a function at `x = 4` is -3. What happens to the output if you increase `x` slightly?',
      options: [
        { text: 'It falls, by about 3 times the size of the nudge', explanation: 'A negative slope means the output goes down as the input goes up.' },
        { text: 'It rises, by about 3 times the size of the nudge', explanation: 'That would be a derivative of +3. The minus sign means the opposite direction.' },
        { text: 'It becomes -3', explanation: 'The derivative is a rate of change, not the value of the output.' },
        { text: 'It stays the same', explanation: 'That would be a derivative of 0.' },
      ],
      answer: 0,
    },
    {
      question: 'Using a nudge of `h = 1`, what is the estimated slope of `f(x) = x * x` at `x = 2`?',
      code: { language: 'python', code: code`
        def f(x):
            return x * x

        print((f(2 + 1) - f(2)) / 1)
      ` },
      options: [
        { text: '4.0', explanation: '4 is the exact derivative, 2 times 2. A nudge as large as 1 gives a rougher estimate.' },
        { text: '5.0', explanation: 'f(3) is 9 and f(2) is 4, so the estimate is (9 - 4) / 1 = 5. A smaller nudge would get closer to 4.' },
        { text: '9.0', explanation: 'That is f(3) alone. The estimate needs the difference f(3) - f(2).' },
        { text: '1.0', explanation: 'That is the size of the nudge, not the change in output it caused.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'A model\'s error has gradient `[8, -0.5]` for its two settings. To reduce the error, what should you do?',
      options: [
        { text: 'Increase the first setting and decrease the second', explanation: 'That steps with the gradient, which increases the error.' },
        { text: 'Change only the second setting, because it is negative', explanation: 'A negative gradient is still useful information. Both settings should move.' },
        { text: 'Decrease the first setting a lot and increase the second a little', explanation: 'Step against each slope: the first is large and positive, so decrease it more. The second is small and negative, so increase it slightly.' },
        { text: 'Leave both alone, because they point in opposite directions', explanation: 'Each slope is about its own setting. Opposite signs just mean they move in opposite directions.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'A derivative is the slope at a point, a gradient is a slope for every input, and stepping against the gradient is how a model reduces its error.',
  resources: [
    { title: 'Derivatives introduction', provider: 'Khan Academy', description: 'Free lessons on slopes, derivatives and rates of change.', url: 'https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules' },
    { title: 'Essence of calculus', provider: '3Blue1Brown', description: 'A visual video series that builds derivatives from intuition.', url: 'https://www.3blue1brown.com/topics/calculus' },
  ],
  underTheHood: {
    heading: 'The chain rule and backpropagation',
    paragraphs: [
      "Nudging each setting separately would be far too slow for a model with a billion settings. Instead, frameworks like PyTorch use the chain rule: when functions are chained, the slope of the whole chain is the slopes of the links multiplied together.",
      "If `y = g(f(x))`, and f triples its input while g doubles its input, then y changes 3 times 2, which is 6 times as fast as x. In the example above, the error is a square of a gap, and the gap depends on `w` times 2. The chain rule gives 2 times the gap times 2, which is -28 at the start, matching the nudge estimate.",
      "Backpropagation applies this rule backwards through every layer of a network. It computes the whole gradient in roughly the time of one forward pass, which is what makes training huge models possible.",
    ],
  },
}

export default lesson
