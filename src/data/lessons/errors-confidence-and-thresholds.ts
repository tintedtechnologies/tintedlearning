import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Read a model score as a confidence level, not as a guarantee',
    'Apply a threshold to turn scores into yes or no decisions',
    'Count false positives and false negatives, and explain what each one costs',
  ],
  bigIdea: 'Many models output a score between 0 and 1, not a final answer. A threshold turns that score into a decision, and moving the threshold trades one kind of mistake for another. Choose the threshold from the cost of each mistake, not from habit.',
  whyItMatters: 'A spam filter scores each message, and the team sets the threshold at 0.5 without discussion. Important invoices start landing in the spam folder, and customers stop paying on time. A short review of the two kinds of mistake would have shown that the cost of hiding real invoices was higher than the cost of letting a little spam through. The team also needed a second look at the threshold after the first complaint, not only at launch.',
  goalSections: [
    {
      heading: 'Scores are confidence, not certainty',
      paragraphs: [
        'A score of 0.91 means the model is more confident than a score of 0.62. It does not mean there is a 91 percent chance of being right, unless the model was calibrated on data to make that true. Treat the score as an ordering, and check how often each score range is actually correct.',
        'Scores also depend on the data the model saw. A model that was never shown a type of example will give confident scores on it anyway. Confidence tells you how the model ranks examples, not how well it knows the world. A model can be sure and still be wrong about a case it has never seen.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Message A: score 0.91   The model ranks it as the most likely spam
          Message B: score 0.62   The model is less sure, but still leans spam
          Message C: score 0.30   The model leans not spam
        `,
      },
    },
    {
      heading: 'Choosing a threshold',
      paragraphs: [
        'A threshold is the score at which the model says yes. Scores at or above the threshold become yes, and everything below becomes no. A higher threshold makes the model say yes less often, which usually reduces false alarms and increases missed cases. A lower threshold does the opposite.',
        'Choose the threshold from the costs. If a false alarm blocks a real customer, a high threshold may be better. If a missed case causes serious harm, a lower threshold may be better. Write the cost of each mistake in one sentence before you pick a number. A team that cannot name the cost of a mistake is not ready to choose a threshold.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'threshold.py',
        code: code`
          scores = [0.91, 0.62, 0.48, 0.30]
          threshold = 0.5
          predicted = [s >= threshold for s in scores]
          print(predicted)
        `,
        output: '[True, True, False, False]',
      },
    },
    {
      heading: 'Counting false positives and false negatives',
      paragraphs: [
        'A false positive is a no-case the model called yes. A false negative is a yes-case the model called no. Count both, because a single accuracy number hides which mistake is happening. Two models with the same accuracy can make very different mistakes. When the classes are uneven, a model that always says no can have high accuracy and still miss every important case.',
        'Compare the counts at several thresholds, not only the one you started with. A table with the threshold, the false positives, and the false negatives shows the trade-off in one place, and it makes the decision easier to explain to people who depend on it. Keep the table with the model, so each new version is compared against the same thresholds.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'mistakes.py',
        code: code`
          scores = [0.91, 0.62, 0.48, 0.30]
          actual = [True, False, True, False]
          predicted = [s >= 0.5 for s in scores]
          false_positives = sum(p and not a for p, a in zip(predicted, actual))
          false_negatives = sum(a and not p for p, a in zip(predicted, actual))
          print("false positives:", false_positives, "false negatives:", false_negatives)
        `,
        output: 'false positives: 1 false negatives: 1',
      },
    },
  ],
  seeItInAction: {
    title: 'Two mistakes at one threshold',
    intro: 'This program applies a threshold of 0.5 to four scores, then counts the two kinds of mistake against the true answers. One message is a false positive, and one is a false negative. Run it, then decide which mistake would hurt more in a spam filter.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'mistakes.py',
      code: code`
        scores = [0.91, 0.62, 0.48, 0.30]
        actual = [True, False, True, False]
        threshold = 0.5
        predicted = [s >= threshold for s in scores]
        false_positives = sum(p and not a for p, a in zip(predicted, actual))
        false_negatives = sum(a and not p for p, a in zip(predicted, actual))
        print(predicted)
        print("false positives:", false_positives, "false negatives:", false_negatives)
      `,
      output: '[True, True, False, False]\nfalse positives: 1 false negatives: 1',
    },
    steps: [
      { code: 'predicted = [s >= threshold for s in scores]', explanation: 'Turns each score into a yes or no. A score at or above 0.5 becomes True.' },
      { code: 'p and not a', explanation: 'True only when the model said yes and the true answer is no. That is a false positive.' },
      { code: 'a and not p', explanation: 'True only when the true answer is yes and the model said no. That is a false negative.' },
      { code: 'print("false positives:", ...)', explanation: 'Shows both counts. Changing the threshold changes these numbers, so compare them at several values.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the threshold to 0.7 and predict the new output before you run the program. Then run it and compare.',
      'Try thresholds of 0.3, 0.5, and 0.7, and write down the false positives and false negatives for each.',
      'Write one sentence that names the cost of a false positive and the cost of a false negative in your own domain.',
    ],
  },
  mistakes: [
    { mistake: 'Treating a score of 0.9 as a 90 percent chance of being correct.', fix: 'Check how often each score range is actually correct on data the model did not learn from. A calibration plot, which groups scores into bins and compares them to the real outcomes, shows this in one picture.' },
    { mistake: 'Choosing the threshold out of habit, such as always 0.5.', fix: 'Write the cost of each mistake first, then choose the threshold that matches those costs.' },
    { mistake: 'Reporting only accuracy when the two mistakes have different costs.', fix: 'Report false positives and false negatives separately, at more than one threshold.' },
  ],
  quiz: [
    {
      question: 'A score of 0.8 is above a threshold of 0.5. What does the model decide?',
      options: [
        { text: 'Yes', explanation: 'Yes. Scores at or above the threshold become yes.' },
        { text: 'No', explanation: 'No. The score is above the threshold, so the decision is yes.' },
        { text: 'It cannot decide', explanation: 'The threshold always turns a score into a yes or no.' },
        { text: 'It decides 0.8 percent', explanation: 'The score is not a percentage of the decision. The threshold makes the choice.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        scores = [0.9, 0.2]
        predicted = [s >= 0.5 for s in scores]
        print(predicted)
      ` },
      options: [
        { text: '[True, False]', explanation: 'Yes. The first score is at or above 0.5 and the second is below it.' },
        { text: '[0.9, 0.2]', explanation: 'The comprehension turns each score into True or False.' },
        { text: '[False, True]', explanation: 'The order is reversed. The first score is the high one.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'A false negative happens when the model says no, but the true answer is yes. Which change makes false negatives more likely?',
      options: [
        { text: 'Raising the threshold', explanation: 'Yes. A higher threshold makes the model say yes less often, so more true cases are missed.' },
        { text: 'Lowering the threshold', explanation: 'A lower threshold says yes more often, which usually reduces false negatives.' },
        { text: 'Adding more features', explanation: 'Features can change accuracy, but the threshold direction is the direct cause here.' },
        { text: 'Renaming the label', explanation: 'A label name does not change which mistakes the model makes.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A score is a ranking of confidence, and the threshold you choose decides which mistakes the model makes, so set it from the cost of each mistake.',
  resources: [
    { title: 'Classification: Thresholding', provider: 'Google for Developers', description: 'How thresholds turn a classifier score into a decision, and how the threshold changes the errors.', url: 'https://developers.google.com/machine-learning/crash-course/classification/thresholding' },
  ],
}

export default lesson
