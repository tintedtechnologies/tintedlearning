import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain how a training sample can be unfair even when the model code is correct',
    'Compare outcome rates across groups in a dataset before training a model',
    'Name three common sources of bias and one check for each',
  ],
  bigIdea: 'A model learns the patterns in its training data, including unfair ones. If one group is underrepresented or its past outcomes were unfair, the model can repeat that unfairness with confidence. Checking the data before training is the cheapest place to catch the problem.',
  whyItMatters: 'A bank builds a model from ten years of approvals. The past decisions were slower for one neighborhood, so the training data shows fewer approvals there. The model learns that pattern and approves fewer applicants from that neighborhood, even when the applicants are as qualified as anyone else. Nothing in the code is wrong, and the data reflects a real history.',
  goalSections: [
    {
      heading: 'How bias enters the data',
      paragraphs: [
        'Bias often comes from the data before any code runs. A group may be missing from the sample, a measurement may work better for some people than others, or the labels may record past decisions that were themselves unfair. A model trained on these labels learns the decisions, not the truth. Measuring the model well does not fix bad labels, so start with the labels.',
        'Bias is not always intentional. A survey sent only by email reaches people who check email, and a camera trained mostly on one set of faces may fail on others. The effect is the same: the model performs unevenly, and the people it fails are the ones the sample left out. Ask who is missing from the data before you ask how accurate the model is.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Three common sources of bias:
          1. Missing groups: some people are rarely in the sample at all.
          2. Measurement gaps: a sensor or survey works better for some people.
          3. Biased labels: the answers record past decisions that were unfair.
        `,
      },
    },
    {
      heading: 'Comparing outcomes across groups',
      paragraphs: [
        'Before training, compare the outcome rate for each group in the data. If one group is approved far less often, that gap is a warning sign, not a proof of unfairness. It may reflect real differences, or it may reflect the past decisions the labels recorded. Either way, you need to know it before you train.',
        'Count how many examples each group contributes as well. A group with only a few examples cannot support reliable predictions, even if its rate looks fine. Report both numbers, the rate and the count, so a reader can judge the comparison. A rate based on three examples can change completely with one more example, so treat small counts with caution.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'group_rates.py',
        code: code`
          sample = [
              {"group": "A", "approved": True},
              {"group": "A", "approved": True},
              {"group": "A", "approved": False},
              {"group": "B", "approved": True},
              {"group": "B", "approved": False},
              {"group": "B", "approved": False},
          ]
          for group in ["A", "B"]:
              rows = [r for r in sample if r["group"] == group]
              rate = sum(r["approved"] for r in rows) / len(rows)
              print(group, "approval rate:", round(rate, 2), "examples:", len(rows))
        `,
        output: 'A approval rate: 0.67 examples: 3\nB approval rate: 0.33 examples: 3',
      },
    },
    {
      heading: 'Checking before you trust a model',
      paragraphs: [
        'Test the model on each group separately, not only on the overall score. An accuracy of ninety percent overall can hide an accuracy of sixty percent for one group. Store the results per group, and review them with someone who knows the domain before the model is used for decisions about people. That review should happen before launch, not after the first complaint.',
        'When the data cannot be fixed, say so in the documentation. Name the groups that are underrepresented, the outcomes that may be biased, and the decisions the model should not make alone. A limit written down is more useful than a score that hides it. Documentation of limits should be part of the release, not an afterthought, so the people who use the model know where it should not be trusted.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Check                          Question it answers
          Outcome rate per group         Do groups receive outcomes at different rates?
          Examples per group             Is each group large enough to measure?
          Accuracy per group             Does the model work equally well for each group?
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Comparing approval rates before training',
    intro: 'This program counts the approval rate and the number of examples for each group in a small sample. The two groups have the same number of examples, but their approval rates differ. Run it, and decide whether the gap needs a closer look before a model learns from it.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'group_rates.py',
      code: code`
        sample = [
            {"group": "A", "approved": True},
            {"group": "A", "approved": True},
            {"group": "A", "approved": False},
            {"group": "B", "approved": True},
            {"group": "B", "approved": False},
            {"group": "B", "approved": False},
        ]
        for group in ["A", "B"]:
            rows = [r for r in sample if r["group"] == group]
            rate = sum(r["approved"] for r in rows) / len(rows)
            print(group, "approval rate:", round(rate, 2), "examples:", len(rows))
      `,
      output: 'A approval rate: 0.67 examples: 3\nB approval rate: 0.33 examples: 3',
    },
    steps: [
      { code: 'for group in ["A", "B"]:', explanation: 'Visits each group in turn, so the same check runs for both.' },
      { code: 'rows = [r for r in sample if r["group"] == group]', explanation: 'Keeps only the examples that belong to this group.' },
      { code: 'rate = sum(r["approved"] for r in rows) / len(rows)', explanation: 'Counts approvals, since True counts as 1, and divides by the number of examples.' },
      { code: 'print(group, "approval rate:", round(rate, 2), "examples:", len(rows))', explanation: 'Reports both the rate and the count. The gap between 0.67 and 0.33 is the warning sign to investigate.' },
    ],
  },
  tryIt: {
    instructions: [
      'Add three more examples for group B with approved set to True, then run the program again. Predict the new rate before you run it.',
      'Change the group names to something that describes your own data, and write one sentence about why the gap might exist.',
      'Write a short note that lists the groups and counts that a model should not decide on alone.',
    ],
  },
  mistakes: [
    { mistake: 'Checking only the overall accuracy of a model.', fix: 'Measure the result for each group separately, and store each number.' },
    { mistake: 'Treating a rate gap as proof that the model is unfair.', fix: 'Treat a gap as a reason to investigate the data, the labels, and the context before you decide anything.' },
    { mistake: 'Ignoring small groups because their numbers are noisy.', fix: 'Report the count next to each rate, and say when a group is too small to judge.' },
  ],
  quiz: [
    {
      question: 'A dataset has many examples from one group and few from another. What is the most useful first check?',
      options: [
        { text: 'Compare the number of examples in each group', explanation: 'Yes. Counts show whether each group is large enough to learn from or measure.' },
        { text: 'Remove the smaller group from the data', explanation: 'Removing the group hides the problem. It does not fix it.' },
        { text: 'Train the model and check only the overall score', explanation: 'The overall score can hide a poor result for the smaller group.' },
        { text: 'Assume the groups are the same because the code is correct', explanation: 'Code correctness does not guarantee fair data.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this check print for group A?',
      code: { language: 'python', runnable: true, code: code`
        rows = [{"approved": True}, {"approved": True}, {"approved": False}, {"approved": False}]
        rate = sum(r["approved"] for r in rows) / len(rows)
        print("A rate:", rate)
      ` },
      options: [
        { text: 'A rate: 0.5', explanation: 'Yes. Two of the four rows are approved, so the rate is 2 divided by 4.' },
        { text: 'A rate: 2', explanation: 'That is the count of approvals, not the rate. The rate divides by the number of rows.' },
        { text: 'A rate: 0.25', explanation: 'That would be one approval out of four rows. There are two approvals here.' },
        { text: 'An error', explanation: 'True counts as 1 in a sum, so the code runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why is an overall accuracy score not enough to judge fairness?',
      options: [
        { text: 'It can hide poor results for one group', explanation: 'Yes. A high average can mask a much lower score for a smaller group.' },
        { text: 'It is always computed incorrectly', explanation: 'The score can be computed correctly. The issue is what it hides.' },
        { text: 'It only applies to images', explanation: 'Accuracy applies to many kinds of prediction, including approvals.' },
        { text: 'It requires the groups to be removed first', explanation: 'Removing groups is the wrong fix. The per-group score is the check.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Check the data for missing groups, measurement gaps, and biased labels, then measure results for each group before a model is trusted.',
  resources: [
    { title: 'Fairness: types of bias', provider: 'Google', description: 'The common kinds of bias that enter machine learning data, with examples.', url: 'https://developers.google.com/machine-learning/crash-course/fairness/types-of-bias' },
    { title: 'Machine Learning Crash Course: Fairness', provider: 'Google for Developers', description: 'An overview of how bias enters a dataset and how to check for it.', url: 'https://developers.google.com/machine-learning/crash-course/fairness/video-lecture' },
  ],
}

export default lesson
