import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'List the steps of a data project, from collecting data to sharing a result',
    'Compare a model against a simple baseline on data kept aside for testing',
    'Make a project repeatable so someone else gets the same result',
  ],
  bigIdea: "Building something with AI is mostly careful programming and data work: collect data, clean it, set some aside for testing, try a simple approach, try a better one, and compare honestly. Writing these steps as code, rather than doing them by hand, means anyone can run them again and get the same answer.",
  whyItMatters: "A student builds a model that predicts exam results with 95% accuracy and presents it proudly. Their teacher asks two questions: \"How well does just guessing the most common grade do?\" and \"Can I rerun it?\" The answers turn out to be \"94%\" and \"not really, I changed some things in a spreadsheet by hand\". A clear workflow would have caught both problems before the presentation.",
  goalSections: [
    {
      heading: 'The steps of a data project',
      paragraphs: [
        "Almost every data or AI project follows the same path. Collect the data. Inspect it: how many rows, what columns, what looks odd? Clean it: fix or remove broken values. Split it: keep a test set aside that nothing else touches. Build: try a baseline first, then a model. Evaluate both on the test set. Share the result, with its limits.",
        "Each step is a small program or function, and its output becomes the next step's input. When a result looks wrong, you can rerun and inspect each step to find where things went off course.",
        "Real projects loop back. Evaluation often reveals a data problem, and you return to cleaning. That is normal, and it is much easier when every step is code.",
      ],
      example: {
        language: 'text',
        code: code`
          collect -> inspect -> clean -> split -> baseline -> model -> evaluate -> share
                                  ^                                     |
                                  +------ found a data problem ---------+
        `,
      },
    },
    {
      heading: 'Always compare against a baseline',
      paragraphs: [
        "A baseline is the simplest reasonable way to make a prediction, such as always guessing the most common answer, or the average. A model is only useful if it clearly beats the baseline on data it has not seen.",
        "Split the data first. Use the training part to build both the baseline and the model, then score both on the test part. If you peek at the test set while building, its score stops being an honest estimate.",
        "Sometimes the baseline wins, or nearly wins. That is a valuable result: it saves building and maintaining a model that adds nothing.",
      ],
      example: {
        language: 'python',
        code: code`
          train_labels = ["pass", "pass", "fail", "pass"]
          test_labels = ["pass", "fail", "pass"]

          most_common = max(set(train_labels), key=train_labels.count)
          correct = sum(label == most_common for label in test_labels)
          print(most_common, correct, "of", len(test_labels))
        `,
        output: 'pass 2 of 3',
      },
    },
    {
      heading: 'Making the work repeatable',
      paragraphs: [
        "A result is reproducible when someone else can rerun your work and get the same numbers. That needs four things written down: the code, in version control such as Git; the exact package versions, in `requirements.txt`; the exact data, with a version or date; and any random choices, such as shuffling, fixed with a seed so they come out the same every run.",
        "Do every change to the data in code, never by hand in a spreadsheet. A hand edit leaves no trace, so nobody can repeat it or check it.",
        "Keep a short log of each experiment: what you changed, and the scores that came out. Two weeks later, you will not remember which version was best.",
      ],
      example: {
        language: 'text',
        code: code`
          experiments.md
          date        change                         baseline   model
          2026-03-02  first version                  67%        71%
          2026-03-04  removed duplicate rows         66%        78%
          2026-03-05  added study-hours feature      66%        83%
          code: git commit 9b2e41c   data: grades_2026-03-01.csv
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A complete mini workflow in one script',
    intro: "This script predicts whether a student passes from the hours they studied. It cleans the data, splits it, scores a baseline and a simple learned rule on the test set, and prints both. It runs as written, and gives the same answer every time.",
    example: {
      language: 'python',
      code: code`
        rows = [(1, "fail"), (2, "fail"), (3, "fail"), (4, "pass"), (5, "pass"),
                (6, "pass"), (None, "pass"), (2, "fail"), (7, "pass"), (3, "pass"),
                (8, "pass"), (1, "fail"), (5, "pass"), (2, "fail")]

        clean = [(hours, result) for hours, result in rows if hours is not None]
        train, test = clean[:9], clean[9:]

        labels = [result for _, result in train]
        baseline = max(set(labels), key=labels.count)

        def accuracy(rule):
            return sum(rule(hours) == result for hours, result in test) / len(test)

        best = max(range(1, 9), key=lambda t: sum(
            ("pass" if h >= t else "fail") == r for h, r in train))

        print("rows kept:", len(clean), "of", len(rows))
        print("baseline:", accuracy(lambda h: baseline))
        print("threshold:", best, "model:", accuracy(lambda h: "pass" if h >= best else "fail"))
      `,
      output: 'rows kept: 13 of 14\nbaseline: 0.5\nthreshold: 3 model: 1.0',
    },
    steps: [
      { code: 'rows = [(1, "fail"), ...]', explanation: "The collected data: hours studied and the result. One row has `None` for hours, a missing value." },
      { code: 'clean = [... if hours is not None]', explanation: "The cleaning step, done in code, so anyone rerunning the script gets exactly the same cleaned data." },
      { code: 'train, test = clean[:9], clean[9:]', explanation: "The split. The first 9 rows build things, the last 4 are only used for scoring. A fixed split keeps the result repeatable." },
      { code: 'baseline = max(set(labels), key=labels.count)', explanation: "The baseline always predicts the most common result in the training data, which is pass." },
      { code: 'best = max(range(1, 9), key=...)', explanation: "A very simple model: try every pass mark from 1 to 8 hours and keep the one that is right most often on the training data. Pass marks of 3 and 4 hours tie, and `max` keeps the first, so it picks 3." },
      { code: 'baseline: 0.5 ... model: 1.0', explanation: "On the 4 unseen test rows, the baseline gets half right and the learned rule gets all of them. With only four test rows, even a perfect score is a hint worth exploring, not proof." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the script in the playground.',
      'Change the split to `clean[:7], clean[7:]`. Predict whether the model still beats the baseline, then run it.',
      'Add five more rows of your own invention and rerun. Does the chosen threshold change?',
    ],
    playground: 'python',
    starterCode: code`
      rows = [(1, "fail"), (2, "fail"), (3, "fail"), (4, "pass"), (5, "pass"),
              (6, "pass"), (None, "pass"), (2, "fail"), (7, "pass"), (3, "pass"),
              (8, "pass"), (1, "fail"), (5, "pass"), (2, "fail")]

      clean = [(hours, result) for hours, result in rows if hours is not None]
      train, test = clean[:9], clean[9:]

      labels = [result for _, result in train]
      baseline = max(set(labels), key=labels.count)

      def accuracy(rule):
          return sum(rule(hours) == result for hours, result in test) / len(test)

      best = max(range(1, 9), key=lambda t: sum(
          ("pass" if h >= t else "fail") == r for h, r in train))

      print("rows kept:", len(clean), "of", len(rows))
      print("baseline:", accuracy(lambda h: baseline))
      print("threshold:", best, "model:", accuracy(lambda h: "pass" if h >= best else "fail"))
    `,
  },
  mistakes: [
    { mistake: 'Reporting a model\'s score without a baseline next to it.', fix: 'Always score the simplest approach on the same test data, and report both numbers.' },
    { mistake: 'Editing data by hand in a spreadsheet.', fix: 'Make every change in code, so it is recorded, repeatable and can be reviewed.' },
    { mistake: 'Using the test data while building the model.', fix: 'Split first, build only on the training part, and score on the test part once at the end.' },
  ],
  quiz: [
    {
      question: 'A model predicting whether flights are on time scores 82%. 80% of flights are on time anyway. What does this tell you?',
      options: [
        { text: 'The model is excellent, since 82% is high', explanation: 'Always guessing "on time" scores 80%, so the model adds only 2 points.' },
        { text: 'The model barely beats a baseline that always guesses "on time"', explanation: 'Comparing with the simplest guess shows how little the model really adds.' },
        { text: 'The model is broken', explanation: 'It does work slightly better than guessing. It just adds far less than 82% suggests.' },
        { text: 'You need more decimal places to judge', explanation: 'Precision of the number is not the issue. The missing comparison is.' },
      ],
      answer: 1,
    },
    {
      question: 'Which of these makes a result hardest for someone else to reproduce?',
      options: [
        { text: 'Pinning package versions in requirements.txt', explanation: 'This helps reproduction: everyone installs the same versions.' },
        { text: 'Setting a random seed before shuffling', explanation: 'This helps: the shuffle comes out the same every run.' },
        { text: 'Fixing some values by hand in a spreadsheet before running the code', explanation: 'Hand edits leave no record, so nobody else can repeat exactly what was changed.' },
        { text: 'Keeping the code in Git', explanation: 'This helps: anyone can get the exact version of the code that produced the result.' },
      ],
      answer: 2,
    },
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        labels = ["no", "yes", "no", "no"]
        guess = max(set(labels), key=labels.count)
        print(guess, labels.count(guess) / len(labels))
      ` },
      options: [
        { text: 'no 0.75', explanation: '"no" appears 3 times out of 4, so it is the most common, and 3 divided by 4 is 0.75.' },
        { text: 'yes 0.25', explanation: '`max` with `key=labels.count` picks the label that appears most often, which is "no".' },
        { text: 'no 3', explanation: 'The count is divided by the length of the list, giving a fraction.' },
        { text: '3 0.75', explanation: '`max` returns the label itself, not its count.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
  ],
  takeaway: 'Treat a data project as a series of coded steps, always compare against a simple baseline on held-out data, and record code, packages, data and random seeds so anyone can repeat your result.',
  resources: [
    { title: 'Rules of machine learning', provider: 'Google for Developers', description: 'Practical advice from engineers, starting with simple baselines and solid pipelines.', url: 'https://developers.google.com/machine-learning/guides/rules-of-ml' },
    { title: 'The Turing Way: reproducibility', provider: 'The Alan Turing Institute', description: 'A friendly handbook on making data work repeatable.', url: 'https://book.the-turing-way.org/reproducible-research/reproducible-research' },
  ],
  underTheHood: {
    heading: 'Data leakage in a workflow',
    paragraphs: [
      "Leakage happens when information from the test set sneaks into building the model, making scores look better than they will be in real use. It often hides in the cleaning step.",
      "Say you fill missing values with the average of a column. If you calculate that average over all the data before splitting, the test rows have influenced the training data. The effect is small, but it makes the test less honest. The fix is to calculate anything learned from data, such as averages, scales and word lists, from the training part only, then apply it to the test part.",
      "Duplicates cause leakage too. If the same customer appears in both training and test data, the model can effectively memorize them. Removing duplicates, or splitting by customer instead of by row, closes that gap.",
    ],
  },
}

export default lesson
