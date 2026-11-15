import type { ProjectPlan } from '../../types/project'
import { code } from '../lessons/helpers'

const plan: ProjectPlan = {
  id: 'math-research-capstone',
  whatYouBuild: "A small investigation into one question about how training works: how does the learning rate change the way gradient descent behaves on a simple function? You will write the code, run it at several settings, make a table and a chart, and write a short report that states what the evidence shows and what it does not.",
  diagram: code`
    Question: how does the learning rate change gradient descent?
      -> function f(x) = (x - 3)^2, with its minimum at x = 3
      -> derivative f'(x) = 2(x - 3), which says which way to step
      -> run gradient descent with several learning rates, from the same start
      -> record each run: final x, final f(x), and whether it settled
      -> table and chart -> report: the answer, the evidence and the limits
  `,
  lessons: ['calculus-and-gradients', 'optimization-and-training', 'probability-and-statistics', 'reporting-results', 'reading-research-papers'],
  tools: ['Python 3.12 or newer, with a virtual environment', 'Optional: matplotlib, for the chart', 'A text editor for the report'],
  time: 'about 5 hours',
  requirements: [
    'A question written as something a run can answer',
    'Gradient descent written from scratch, with no optimization library',
    'At least five learning rates, run from the same starting point',
    'A table of the results, and a chart of the first steps for each learning rate',
    'A report with the answer, the evidence and at least two limits',
  ],
  milestones: [
    {
      title: 'Write the function and its derivative',
      goal: 'Write f(x) and its derivative as code, and check the derivative numerically at a few points.',
      hints: [
        'The function is (x - 3) squared. Its minimum is at x = 3, where the value is 0.',
        'The derivative is 2 times (x - 3). A numerical check uses a tiny step h and compares (f(x + h) - f(x)) / h.',
        'If the two numbers are close, the derivative is right.',
      ],
      code: {
        language: 'python',
        filename: 'function.py',
        code: code`
          def f(x):
              return (x - 3) ** 2

          def df(x):
              return 2 * (x - 3)

          if __name__ == "__main__":
              h = 1e-6
              for x in [0.0, 3.0, 5.0]:
                  numeric = (f(x + h) - f(x)) / h
                  print(x, round(df(x), 3), round(numeric, 3))
        `,
        output: '0.0 -6.0 -6.0\n3.0 0.0 0.0\n5.0 4.0 4.0',
      },
      checkpoint: 'The exact and numerical derivatives agree at each point, to three decimal places.',
    },
    {
      title: 'Write gradient descent',
      goal: 'Start at a point, step against the derivative, and record each position, with the learning rate as a parameter.',
      hints: [
        'Each step moves x by minus the learning rate times the derivative.',
        'Use the same starting point and number of steps for every learning rate, so the runs can be compared.',
        'Return the list of positions, not only the last one, so the chart can use them.',
      ],
      code: {
        language: 'python',
        filename: 'descent.py',
        code: code`
          from function import f, df

          def gradient_descent(start, learning_rate, steps):
              x = start
              positions = [x]
              for _ in range(steps):
                  x = x - learning_rate * df(x)
                  positions.append(x)
              return positions

          if __name__ == "__main__":
              path = gradient_descent(0.0, 0.1, 3)
              print([round(p, 3) for p in path])
        `,
        output: '[0.0, 0.6, 1.08, 1.464]',
      },
      checkpoint: 'With learning rate 0.1, the positions move toward 3, and each step is smaller than the last.',
    },
    {
      title: 'Run several learning rates',
      goal: 'Run gradient descent with at least five learning rates, from the same start, and record the final value of each run.',
      hints: [
        'Choose learning rates that cover a range, such as very small, small, medium, large and too large.',
        'Keep the number of steps the same for all runs. A run that stops early is not a fair comparison.',
        'Record whether each run settled near 3, moved away or oscillated.',
      ],
      code: {
        language: 'python',
        filename: 'experiment.py',
        code: code`
          from function import f
          from descent import gradient_descent

          RATES = [0.01, 0.1, 0.5, 1.0, 1.1]
          print("rate   final x   final f(x)")
          for rate in RATES:
              path = gradient_descent(0.0, rate, 20)
              print(f"{rate:<6} {path[-1]:>8.3f} {f(path[-1]):>12.3f}")
        `,
        output: 'rate   final x   final f(x)\n0.01      0.997        4.011\n0.1       2.965        0.001\n0.5       3.000        0.000\n1.0       0.000        9.000\n1.1    -112.013    13227.944',
      },
      checkpoint: 'The table shows 0.01 still far from 3 after 20 steps, 0.1 and 0.5 settling near 3, 1.0 bouncing between 0 and 6, and 1.1 moving away.',
    },
    {
      title: 'Make a chart of the first steps',
      goal: 'Plot the first steps for each learning rate, so the difference between them is visible at a glance.',
      hints: [
        'Plot the position against the step number, with one line per learning rate.',
        'Label the axes and the lines. A chart without labels cannot be read by someone else.',
        'Use the same axes for every line, so the scale does not change the story.',
      ],
      checkpoint: 'The chart is saved as an image, and it shows the small rate creeping, the middle rates converging and the large rate moving away.',
    },
    {
      title: 'Write the report',
      goal: 'State the answer to the question, the evidence from the table and the chart, and at least two limits of the study.',
      hints: [
        'Answer in one sentence first, such as: a learning rate between 0.1 and 0.5 settles quickly on this function.',
        'Give the limits plainly: one function, one starting point, and a fixed number of steps.',
        'Say what you would test next, such as a second function or a noisy version of the derivative.',
      ],
      checkpoint: 'The report opens with the answer, cites the table, names two limits and avoids the word "proven".',
    },
  ],
  finishedMeans: [
    'The code runs from a fresh clone, and the table is produced by the script rather than typed by hand',
    'Every run uses the same start and the same number of steps',
    'The chart is labeled, and its axes are the same for every line',
    'The report answers the question in its first sentence, and names at least two limits',
    'The report says what the evidence does not show',
  ],
  readmeTemplate: code`
    # [Project name]: how the learning rate changes gradient descent

    [One sentence: the question and the answer you found.]

    ## Run it
    [The command that produces the table and the chart.]

    ## Method
    [The function, the start, the number of steps and the learning rates.]

    ## Results
    [The table, and the chart.]

    ## Limits
    [At least two limits, stated plainly.]

    ## Next question
    [What you would test next, and why.]
  `,
  portfolioText: "Describe this as a small, reproducible investigation into how a training setting changes the result. Explain how you chose the learning rates, what the table showed and what the study could not show. Research employers look for an honest account of the evidence, not a dramatic result.",
  stretchGoals: [
    'Repeat the study on a second function, such as one with two minimums, and compare',
    'Add noise to the derivative, and see how the learning rate affects the result',
    'Use a statistical measure to compare runs from several random starting points',
  ],
}

export default plan
