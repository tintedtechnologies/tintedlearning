import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Read the axes, scales, and labels of a chart before drawing any conclusion',
    'Tell a trend from noise, and a correlation from a cause',
    'Spot charts that mislead through a cut axis, a missing baseline, or a cherry-picked period',
  ],
  bigIdea: 'A chart is an argument made with shapes, and it can be read correctly or incorrectly. Before drawing a conclusion, read the axes, the scale, the units, and the time period. Then ask whether the pattern is a real trend, whether two things moving together show a cause, and whether the chart shows the whole story or a convenient part of it.',
  whyItMatters: 'A news article shows a bar chart of sales that appears to rise sharply. The vertical axis starts at ninety-eight percent, so a small change looks enormous. The real increase is one percent. A reader who skips the axis believes a headline that the data does not support. Reading charts carefully protects you from being misled and helps you make better decisions with the same numbers.',
  goalSections: [
    {
      heading: 'Read the frame before the picture',
      paragraphs: [
        'Start with the labels. What does each axis measure, and in what units? Is the horizontal axis time, a category, or an amount? A chart with no units or no label should not be used for a decision until the missing information is found.',
        'Check the scale. Does the vertical axis start at zero? If it does not, small differences look large. Some charts use a logarithmic scale, where each step is a multiplication, so the shape looks very different from a linear scale. Note the scale before you judge the size of a change.',
        'Check the time period and the source. A chart that ends on a peak can make a trend look stronger than it is, and a chart from a single source may be selected to support one point. Ask what the chart leaves out.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          sales = {"March": 980, "April": 990}
          first, second = sales["March"], sales["April"]
          change = (second - first) / first * 100
          print("real change:", round(change, 1), "%")
          print("bar height on a cut axis starting at 980:", second - 980, "vs", first - 980)
        `,
        output: 'real change: 1.0 %\nbar height on a cut axis starting at 980: 10 vs 0',
      },
    },
    {
      heading: 'Trend, noise, and correlation',
      paragraphs: [
        'A trend is a pattern that persists over time. Single points can jump up or down by chance, so look for a direction that continues across several points. A rise on one day is noise until the next several days confirm it.',
        'Correlation means two things move together. Ice cream sales and drowning rates both rise in summer, and they are correlated. Neither causes the other. The hidden common cause is hot weather. A correlation is a reason to ask a question, not an answer to it.',
        'To claim a cause, you need a stronger test, such as a controlled comparison where only one thing changes. Charts can show that two things are related, but a chart alone rarely proves what causes what.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import statistics

          weekly = [102, 98, 110, 121, 118, 130]
          first_half = statistics.mean(weekly[:3])
          second_half = statistics.mean(weekly[3:])
          print("first half average:", round(first_half, 1))
          print("second half average:", round(second_half, 1))
        `,
        output: 'first half average: 103.3\nsecond half average: 123',
      },
    },
    {
      heading: 'Common ways charts mislead',
      paragraphs: [
        'A cut axis makes small changes look large, as in the opening example. A missing baseline or a percentage that hides the size of the group can also distort the picture. Always check how big the change is compared with the total.',
        'Cherry-picked time periods show a trend only for the years that support it. Compare the same chart across a longer time, and ask what happens if you start or end one period earlier or later.',
        'A chart can also hide the spread of the data. An average can look steady while individual values swing widely. Where possible, look for the range or the individual points, not only the average.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          values = {"2024": 980, "2025": 990}
          print("bar height from zero:", values["2024"], "and", values["2025"])
          print("bar height from 980:", values["2024"] - 980, "and", values["2025"] - 980)
        `,
        output: 'bar height from zero: 980 and 990\nbar height from 980: 0 and 10',
      },
    },
  ],
  seeItInAction: {
    title: 'Checking a claimed increase',
    intro: 'The program below checks whether a claimed increase is real by calculating the change and the size of the axis that was shown. A large claim on a small change is a warning sign. Run it, then change the second value to 1100 and predict the new result.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        before, after = 980, 990
        axis_start = 980

        percent_change = (after - before) / before * 100
        visual_change = (after - axis_start) / (before - axis_start + 1)
        print("percent change:", round(percent_change, 2))
        print("visual change on the cut axis:", round(visual_change, 1), "times larger")
      `,
      output: 'percent change: 1.02\nvisual change on the cut axis: 10.0 times larger',
    },
    steps: [
      { code: 'percent_change = (after - before) / before * 100', explanation: 'The honest size of the change, relative to the starting value.' },
      { code: 'visual_change = (after - axis_start) / (before - axis_start + 1)', explanation: 'Shows how the cut axis inflates the picture. The "plus one" avoids dividing by zero on the first value.' },
      { code: 'print("visual change on the cut axis:", ...)', explanation: 'Compares the visual exaggeration with the real change, so the reader sees the gap.' },
    ],
  },
  tryIt: {
    instructions: [
      'Find a chart in a news article or report. Write down the axis labels, the units, whether the axis starts at zero, and the time period.',
      'Change the second value in the example to 1100 and predict the percent change. Run it to check.',
      'Write one question you would ask before believing a chart that shows a rise, and one question you would ask about a correlation it shows.',
    ],
  },
  mistakes: [
    { mistake: 'Reading a chart without checking the axis labels and scale.', fix: 'Read the axes, units, and scale first, and only then the shape.' },
    { mistake: 'Treating correlation as proof of cause.', fix: 'Ask about a hidden common cause and look for a controlled comparison before claiming a cause.' },
    { mistake: 'Judging a trend from one or two points.', fix: 'Look for a direction that persists across several points and time periods.' },
  ],
  quiz: [
    {
      question: 'A bar chart shows a rise from 980 to 990, but the axis starts at 980. What is the first thing to notice?',
      options: [
        { text: 'The rise looks large because the axis is cut, but the real change is about one percent', explanation: 'Yes. A cut axis exaggerates small changes, so the percentage change is the honest measure.' },
        { text: 'The chart is wrong and should be thrown away', explanation: 'The chart can be read correctly once the axis is understood.' },
        { text: 'The rise is ten times larger than it looks', explanation: 'The real change is about one percent, which is smaller than the visual suggests.' },
        { text: 'The axis labels are not important', explanation: 'The labels and scale are the most important part of reading a chart.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the percent change from 200 to 210?',
      code: { language: 'python', runnable: true, code: code`
        before, after = 200, 210
        print("percent change:", round((after - before) / before * 100, 1))
      ` },
      options: [
        { text: 'percent change: 10.0', explanation: 'The change is 10, but a percent change divides that by the starting value, so this is not the percentage.' },
        { text: 'percent change: 5.0', explanation: 'Yes. The change is 10 out of 200, which is 5 percent.' },
        { text: 'percent change: 210.0', explanation: 'The program calculates the change, not the new value.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Ice cream sales and drowning rates rise together in summer. What is the best conclusion?',
      options: [
        { text: 'Ice cream causes drowning', explanation: 'The two may share a common cause, such as hot weather, so this claim is not supported.' },
        { text: 'They are correlated, and a common cause such as hot weather should be considered', explanation: 'Yes. Correlation suggests a question, and a shared cause is a likely explanation.' },
        { text: 'Drowning causes people to buy ice cream', explanation: 'The direction of cause is not shown by this correlation, and the claim is not supported.' },
        { text: 'The data must be wrong', explanation: 'Correlated data can be correct. The mistake would be to read it as cause.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Read a chart by its labels, scale, units, and period first, then separate a real trend from noise and a correlation from a cause, and watch for cut axes and cherry-picked periods.',
  resources: [
    { title: 'How to read a graph', provider: 'Khan Academy', description: 'Free lessons on reading and interpreting graphs and data displays.', url: 'https://www.khanacademy.org/math/statistics-probability' },
    { title: 'How to lie with statistics', provider: 'Darrell Huff (book overview)', description: 'A classic guide to the ways charts and statistics mislead, with examples.', url: 'https://en.wikipedia.org/wiki/How_to_Lie_with_Statistics' },
  ],
}

export default lesson
