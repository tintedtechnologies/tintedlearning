import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Build a confusion matrix from predictions and true labels',
    'Calculate accuracy, precision, and recall, and say what each one means in plain words',
    'Choose the measure that matches the cost of each kind of mistake',
  ],
  bigIdea: 'A classifier can be wrong in two different ways: it can flag something that is not the target, or miss something that is. A confusion matrix counts all four outcomes, and accuracy, precision, and recall each summarize them differently. The right measure depends on which mistake costs more.',
  whyItMatters: 'A hospital tests a screening model for a rare condition. The model is correct 98 percent of the time, and it misses half the patients who have the condition, because most patients do not have it and a model that always says "no" would also be 95 percent correct. Accuracy alone hides the failure. Recall would have shown it at once, and that number is what the hospital needs to see before deciding.',
  goalSections: [
    {
      heading: 'The confusion matrix',
      paragraphs: [
        'Compare each prediction with the true label, and sort every case into one of four boxes. A true positive is a real case the model flagged. A false positive is a healthy case the model flagged by mistake. A false negative is a real case the model missed. A true negative is a healthy case the model correctly left alone.',
        'Count the four boxes from a test set that the model did not see during training. Testing on the training data makes the model look better than it is, because it has seen those answers before.',
        'The matrix is the honest starting point. Every other measure is a ratio of its numbers, so if you report only one number, the reader cannot see which mistake the model makes.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          true_labels = [1, 1, 0, 0, 1, 0, 0, 0]
          predicted   = [1, 0, 0, 1, 1, 0, 0, 0]

          tp = sum(1 for t, p in zip(true_labels, predicted) if t == 1 and p == 1)
          fp = sum(1 for t, p in zip(true_labels, predicted) if t == 0 and p == 1)
          fn = sum(1 for t, p in zip(true_labels, predicted) if t == 1 and p == 0)
          tn = sum(1 for t, p in zip(true_labels, predicted) if t == 0 and p == 0)
          print("true positives:", tp, "false positives:", fp)
          print("false negatives:", fn, "true negatives:", tn)
        `,
        output: 'true positives: 2 false positives: 1\nfalse negatives: 1 true negatives: 4',
      },
    },
    {
      heading: 'Accuracy, precision, and recall',
      paragraphs: [
        'Accuracy is the share of all predictions that were right: true positives and true negatives divided by the total. It is easy to understand and misleading when one outcome is rare, because a model that always predicts the common outcome can score high.',
        'Precision is the share of flagged cases that were real: true positives divided by all flags. High precision means that when the model raises an alarm, the alarm is usually correct. It matters when false alarms are expensive, such as sending a person for a costly check.',
        'Recall is the share of real cases that were found: true positives divided by all real cases. High recall means few real cases are missed. It matters when missing a case is serious, such as a dangerous fault or a serious illness.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          tp, fp, fn, tn = 2, 1, 1, 4
          accuracy = (tp + tn) / (tp + fp + fn + tn)
          precision = tp / (tp + fp)
          recall = tp / (tp + fn)
          print("accuracy:", round(accuracy, 2))
          print("precision:", round(precision, 2))
          print("recall:", round(recall, 2))
        `,
        output: 'accuracy: 0.75\nprecision: 0.67\nrecall: 0.67',
      },
    },
    {
      heading: 'Choosing the measure that fits the cost',
      paragraphs: [
        'Start by naming the two mistakes and their costs. For a spam filter, a false positive hides a real email, which is costly, so precision matters. For a safety check, a false negative lets a fault through, which is costly, so recall matters more.',
        'Report the numbers together, and state the trade-off. Changing the threshold for a flag usually raises one measure and lowers the other. Pick the threshold with the people who bear the costs, and write down why.',
        'When the outcomes are rare, look past accuracy and always show precision and recall. Ask what happens to the real cases the model misses, because those are the cases the system exists for.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Spam filter: a false positive hides a real email, so precision matters most.
          Safety check: a false negative lets a fault through, so recall matters most.
          Threshold: raising it usually improves precision and lowers recall. Choose it with the people who bear each cost, and write the reason down.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Why accuracy can mislead',
    intro: 'The program below compares a model that always says "no" with a model that finds half the real cases, on a test set where only one case in ten is real. The always-no model has the higher accuracy but no recall. Run it, then change the number of real cases and predict which model looks better.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        truth = [1] * 10 + [0] * 90
        always_no = [0] * 100
        finds_half = [1] * 5 + [0] * 5 + [0] * 90

        def report(name, predicted):
            correct = sum(1 for t, p in zip(truth, predicted) if t == p)
            found = sum(1 for t, p in zip(truth, predicted) if t == 1 and p == 1)
            print(name, "accuracy", correct / len(truth), "recall", found / sum(truth))

        report("always no", always_no)
        report("finds half", finds_half)
      `,
      output: 'always no accuracy 0.9 recall 0.0\nfinds half accuracy 0.95 recall 0.5',
    },
    steps: [
      { code: 'truth = [1] * 10 + [0] * 90', explanation: 'Only one case in ten is real, which is how rare conditions look in practice.' },
      { code: 'correct = sum(1 for t, p in zip(truth, predicted) if t == p)', explanation: 'Accuracy counts every correct answer, including the easy negatives.' },
      { code: 'found / sum(truth)', explanation: 'Recall counts only the real cases, which is where the always-no model fails completely.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the number of real cases in the seItInAction example from 10 to 30 and predict whether the always-no model still has higher accuracy. Run it to check.',
      'Write a confusion matrix for a spam filter that caught 80 of 100 spam emails and wrongly hid 5 of 200 real emails. Calculate its precision and recall.',
      'Write one sentence that says which mistake costs more in a system you use, and which measure you would watch.',
    ],
  },
  mistakes: [
    { mistake: 'Reporting only accuracy on imbalanced data.', fix: 'Show the confusion matrix, precision, and recall alongside accuracy.' },
    { mistake: 'Measuring on the data the model was trained on.', fix: 'Use a separate test set that the model did not see during training.' },
    { mistake: 'Choosing a threshold without naming the cost of each mistake.', fix: 'Write down the cost of a false alarm and of a missed case before picking the threshold.' },
  ],
  quiz: [
    {
      question: 'What does recall measure?',
      options: [
        { text: 'The share of all predictions that were right', explanation: 'That is accuracy.' },
        { text: 'The share of real cases the model found', explanation: 'Yes. Recall is the true positives divided by all real cases.' },
        { text: 'The share of flagged cases that were real', explanation: 'That is precision.' },
        { text: 'The share of healthy cases left alone', explanation: 'That is specificity, a different measure.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for precision?',
      code: { language: 'python', runnable: true, code: code`
        tp, fp = 3, 1
        print(round(tp / (tp + fp), 2))
      ` },
      options: [
        { text: '0.75', explanation: 'Yes. Three true positives out of four flags is 0.75.' },
        { text: '0.25', explanation: 'That is the share of flags that were wrong.' },
        { text: '3', explanation: 'That is the count of true positives, not the precision.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why can a model with high accuracy still be useless for a rare condition?',
      options: [
        { text: 'It can be right on the common outcome and miss every real case', explanation: 'Yes. When most cases are negative, a model that always says no scores high accuracy.' },
        { text: 'Accuracy is always calculated wrongly', explanation: 'The calculation is correct. The problem is what it hides.' },
        { text: 'Rare conditions cannot be detected by any model', explanation: 'Models can detect rare conditions when measured and tuned properly.' },
        { text: 'High accuracy means the test set was too small', explanation: 'Accuracy says nothing about size. It hides the missed cases.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A confusion matrix counts the four outcomes, accuracy hides failures on rare cases, precision and recall show each kind of mistake, and the right threshold depends on which mistake costs more.',
  resources: [
    { title: 'Classification: Accuracy, Precision, Recall', provider: 'Google', description: 'A free course module explaining the confusion matrix and these metrics with examples.', url: 'https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall' },
    { title: 'Metrics and scoring', provider: 'scikit-learn', description: 'Reference for classification metrics, the confusion matrix, and threshold choices.', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
  ],
}

export default lesson
