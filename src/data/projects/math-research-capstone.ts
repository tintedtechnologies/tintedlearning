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
      title: 'Write the function and check its derivative',
      goal: 'Write f(x) and its derivative, and check the derivative numerically at a few points.',
      hints: [
        'The minimum is at x = 3, where the value is 0. Use a tiny step h to estimate the slope numerically.',
        'If the exact and numerical slopes agree, the derivative is right.',
      ],
      checkpoint: 'The exact and numerical derivatives agree at x = 0, 3 and 5, to three decimal places.',
    },
    {
      title: 'Write gradient descent',
      goal: 'Start at a point, step against the derivative, and record each position, with the learning rate as a parameter.',
      hints: [
        'Each step moves x by minus the learning rate times the derivative.',
        'Return every position, not only the last one, so the chart can use them.',
      ],
      code: {
        language: 'python',
        filename: 'descent.py',
        code: code`
          def f(x):
              return (x - 3) ** 2

          def df(x):
              return 2 * (x - 3)

          def gradient_descent(start, learning_rate, steps):
              x = start
              positions = [x]
              for _ in range(steps):
                  x = x - learning_rate * df(x)
                  positions.append(x)
              return positions

          path = gradient_descent(0.0, 0.1, 3)
          print([round(p, 3) for p in path])
        `,
        output: '[0.0, 0.6, 1.08, 1.464]',
      },
      checkpoint: 'With learning rate 0.1, the positions move toward 3, and each step is smaller than the one before.',
    },
    {
      title: 'Run several learning rates',
      goal: 'Run gradient descent with at least five learning rates, from the same start, and record each final value.',
      hints: [
        'Choose rates that cover a range, from very small to too large, and keep the number of steps the same for all.',
        'Record whether each run settled near 3, moved away or bounced.',
      ],
      checkpoint: 'Your table covers at least five rates, and you can say which ones settled, which bounced and which diverged.',
    },
    {
      title: 'Make a chart of the first steps',
      goal: 'Plot the first steps for each learning rate, so the difference between them is visible at a glance.',
      hints: [
        'Use the same axes for every line, and label the axes and each line.',
        'Plot the position against the step number, with one line per learning rate.',
      ],
      checkpoint: 'The chart is saved as an image, and you can point to a small rate that creeps, a middle rate that converges and a large rate that bounces or diverges.',
    },
    {
      title: 'Write the report',
      goal: 'State the answer to the question, the evidence from the table and the chart, and at least two limits of the study.',
      hints: [
        'Answer in one sentence first, then give the evidence.',
        'Name the limits plainly, such as one function, one starting point and a fixed number of steps.',
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
  writeUpPrompts: [
    'The problem: what question about training you set out to answer, and why it matters.',
    'One decision you made, such as which learning rates to test, and why.',
    'One result that surprised you, and what you checked before believing it.',
    'What you would test next, and what would change your answer.',
  ],
  demoGuidance: 'Record the chart being produced, then point to the rates that settled and the rate that bounced. Keep it under 60 seconds. Free tools include the screen recorder built into macOS and Windows, OBS Studio, and ScreenToGif on Windows. Save it as demo.gif and link it from the README.',
  interviewGuidance: "Describe the question and the limits before the result. For example: 'I tested five learning rates on one function from one start, so I can only claim what this setup shows.' Interviewers look for that care with evidence more than for a dramatic result.",
  stretchGoals: [
    'Repeat the study on a second function, such as one with two minimums, and compare',
    'Add noise to the derivative, and see how the learning rate affects the result',
    'Use a statistical measure to compare runs from several random starting points',
  ],
}

export default plan
