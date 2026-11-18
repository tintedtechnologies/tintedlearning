import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Name the features and the label in a dataset',
    'Turn raw records into a feature table and a list of labels',
    'Explain why the label must match the question the model answers',
  ],
  bigIdea: 'A learning system does not see a student or a loan application. It sees numbers, and you choose which numbers describe each example. The inputs are the features, and the answer the model should learn to predict is the label.',
  whyItMatters: 'A team builds a model to predict which customers will cancel. They use the customer name as a feature and whether the customer "was flagged by support" as the label. The model scores well, then fails in production, because the label was only known after the cancellation happened. Choosing features and labels carefully is where most of this work goes wrong. Spending an extra hour on this step saves weeks of retraining.',
  goalSections: [
    {
      heading: 'Features are the inputs',
      paragraphs: [
        'A feature is one measurable property of an example. Each row in a dataset is one example, and each column holds one feature. For a study predictor, hours studied and hours of sleep are features. They describe the student before the result is known. Each feature should describe one thing, so a reader can say what it measures.',
        'Good features are available at the time you need the prediction. If a feature depends on the answer, the model cheats in training and fails later. Ask whether you could know the feature before the outcome happens. A quick test is to imagine making the prediction on the day before the outcome, and listing only the columns you could fill in that day.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'features.py',
        code: code`
          records = [
              {"hours_studied": 2, "sleep_hours": 6, "passed": False},
              {"hours_studied": 5, "sleep_hours": 8, "passed": True},
              {"hours_studied": 7, "sleep_hours": 7, "passed": True},
          ]
          features = [[r["hours_studied"], r["sleep_hours"]] for r in records]
          print(features)
        `,
        output: '[[2, 6], [5, 8], [7, 7]]',
      },
    },
    {
      heading: 'The label is the answer to predict',
      paragraphs: [
        'The label is the value the model learns to predict. In the study example, the label is whether the student passed. During training, the model sees both the features and the label, and it adjusts itself until its predictions match the labels on examples it has not seen.',
        'The label must answer the question you actually care about. If you want to predict whether a student will pass, a label that records a grade typed in later, after the course has ended, measures something different. Write down the question in one sentence, and check that the label answers it. A label that answers a slightly different question can make a model look accurate while it is useless for the decision you need.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'labels.py',
        code: code`
          records = [
              {"hours_studied": 2, "sleep_hours": 6, "passed": False},
              {"hours_studied": 5, "sleep_hours": 8, "passed": True},
              {"hours_studied": 7, "sleep_hours": 7, "passed": True},
          ]
          labels = [r["passed"] for r in records]
          print(labels)
        `,
        output: '[False, True, True]',
      },
    },
    {
      heading: 'Turning records into a table',
      paragraphs: [
        'Real data often starts as messy records. Before training, separate the features from the label, and check that every row has the same features in the same order. A missing value in one row can shift every column that follows it when you combine the data. Most of the effort goes into choosing these two things well.',
        'Keep the table and the label list side by side, so a row and its label always match. Most mistakes in this step are mismatches between rows and labels, so check the lengths of both lists before you train anything. If the lengths differ, stop and find the record that is missing or duplicated, rather than trimming the list to make the numbers match.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'table.py',
        code: code`
          features = [[2, 6], [5, 8], [7, 7]]
          labels = [False, True, True]
          print(len(features) == len(labels))
        `,
        output: 'True',
      },
    },
  ],
  seeItInAction: {
    title: 'Building a feature table and a label list',
    intro: 'This program turns three student records into a feature table and a label list, then checks that the two lists line up. Run it, and check that both printed lines describe the same three students.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'features_and_labels.py',
      code: code`
        records = [
            {"hours_studied": 2, "sleep_hours": 6, "passed": False},
            {"hours_studied": 5, "sleep_hours": 8, "passed": True},
            {"hours_studied": 7, "sleep_hours": 7, "passed": True},
        ]
        features = [[r["hours_studied"], r["sleep_hours"]] for r in records]
        labels = [r["passed"] for r in records]
        print(features)
        print(labels)
        print(len(features) == len(labels))
      `,
      output: '[[2, 6], [5, 8], [7, 7]]\n[False, True, True]\nTrue',
    },
    steps: [
      { code: 'records = [...]', explanation: 'Three examples. Each one is a student with the measurements and the outcome already recorded.' },
      { code: 'features = [[r["hours_studied"], r["sleep_hours"]] for r in records]', explanation: 'Keeps only the inputs, in a fixed order. Each inner list is one row of the feature table.' },
      { code: 'labels = [r["passed"] for r in records]', explanation: 'Keeps only the answer to predict. The first label belongs to the first feature row.' },
      { code: 'print(len(features) == len(labels))', explanation: 'Checks that the two lists line up. If this prints False, a row and its label no longer match.' },
    ],
  },
  tryIt: {
    instructions: [
      'Add a third feature, such as "practice_questions," to each record, and update the feature list. Check the output still has three rows.',
      'Write one sentence that names the question your model answers. Then check that the label answers that question.',
      'Add a record with a missing sleep value, and decide how you would handle it before you build the table.',
    ],
  },
  mistakes: [
    { mistake: 'Using a feature that is only known after the outcome.', fix: 'Ask whether the feature is known before the prediction is needed. Remove any feature that is not.' },
    { mistake: 'Building the feature list and the label list in different orders.', fix: 'Build both from the same loop over the same records, and check that their lengths match.' },
    { mistake: 'Treating an identifier, such as a customer number, as a feature.', fix: 'Remove identifiers. They describe nothing about the example and let a model memorize rows.' },
  ],
  quiz: [
    {
      question: 'A model predicts whether a loan will be repaid. Which choice is a feature?',
      options: [
        { text: 'The applicant\'s income at the time of application', explanation: 'Yes. It describes the applicant before the outcome is known.' },
        { text: 'Whether the loan was repaid', explanation: 'That is the label, the answer the model learns to predict.' },
        { text: 'The date the loan was closed', explanation: 'The closing date comes after the outcome, so it would leak the answer.' },
        { text: 'The applicant\'s internal record number', explanation: 'An identifier describes nothing about the example, so it is not a useful feature.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        records = [{"x": 1, "y": True}, {"x": 2, "y": False}]
        labels = [r["y"] for r in records]
        print(labels)
      ` },
      options: [
        { text: '[True, False]', explanation: 'Yes. The list holds the y value from each record, in order.' },
        { text: '[1, 2]', explanation: 'That is the feature x. The label is y.' },
        { text: '[{"y": True}, {"y": False}]', explanation: 'The comprehension keeps only the y value, not the whole dictionary.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why must the label list and the feature table keep the same row order?',
      options: [
        { text: 'So each row lines up with its correct answer during training', explanation: 'Yes. If the order changes, the model learns from the wrong answers.' },
        { text: 'Because the model cannot read more than three rows', explanation: 'A model does not have that limit. The order matters for matching rows to answers.' },
        { text: 'So the labels become features', explanation: 'Labels stay labels. Their order only needs to match the rows.' },
        { text: 'Because Python requires sorted lists', explanation: 'Python does not require sorting here. The row-to-label match is what matters.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Features describe each example before the outcome is known, and the label is the answer the model must learn to predict.',
  resources: [
    { title: 'Machine Learning Crash Course: Framing', provider: 'Google for Developers', description: 'A practical introduction to features, labels, and how to frame a prediction problem.', url: 'https://developers.google.com/machine-learning/crash-course/framing/ml-terminology' },
  ],
}

export default lesson
