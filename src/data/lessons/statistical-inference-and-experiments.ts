import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { experimentCsv } from './research-data'

const lesson: StructuredLesson = {
  assumes: 'Experiment Design and Data Collection and Cleaning from this section, and Probability and Statistics for AI from the Math section. The data is the clean, 16-learner experiment file, and every learner is a placeholder code.',
  goals: [
    'Explain what a p-value and a confidence interval say in plain words, and what they do not say',
    'Test whether a gap between two groups could have come from chance, using a permutation test',
    'Tell a statistically clear result apart from an important one, using the size of the gap',
  ],
  bigIdea: "Statistical inference asks whether a difference could have appeared by chance alone. A p-value is the chance of a gap at least as large as the one observed if the schedule made no real difference. A confidence interval gives a range of plausible sizes for the real difference, which says more than a yes or no.",
  whyItMatters: "Two groups always differ a little, even when nothing real separates them. A report that says \"daily learners scored higher\" without any measure of chance invites people to act on noise. A report that says \"the gap is clear, but the plausible sizes are small\" lets teachers decide what matters for their learners.",
  goalSections: [
    {
      heading: 'Could the gap be chance?',
      paragraphs: [
        "Start by assuming the schedule makes no difference at all. Then the 16 scores are just 16 numbers, and which group a learner was in is only a label. If that is true, shuffling the labels should produce gaps as large as the real one about as often as luck allows.",
        "A permutation test does exactly this. It shuffles the group labels thousands of times, measures the gap each time, and counts how many shuffled gaps are at least as large as the real one. If almost none are, the real gap is unlikely to be chance, under this assumption.",
      ],
      example: {
        language: 'text',
        code: code`
          1. Observed gap: daily mean minus weekly mean.
          2. Shuffle the 16 group labels and compute the gap again.
          3. Repeat step 2 many times, here 10,000.
          4. Count the shuffled gaps at least as large as the observed one.
          5. Divide by 10,000. That fraction is the p-value estimate, and with so few matches it is close to zero.
        `,
      },
    },
    {
      heading: 'A range, not just a verdict',
      paragraphs: [
        "A confidence interval comes from repeating the study in software. The bootstrap draws learners with replacement from each group, computes the gap, and repeats the draw many times. The middle 95 out of 100 gaps form the interval.",
        "Read the interval carefully. It does not say there is a 95 percent chance the true gap lies inside it. It says the method used to build the interval captures the true gap in about 95 of 100 repeated studies. The practical reading is simpler: the gap is probably somewhere in this range. The bootstrap draws are a practical tool, and the interval is only as good as the sample it is drawn from.",
      ],
      example: {
        language: 'text',
        code: code`
          Gap in quiz points, daily minus weekly
            estimate                 10.6 points
            95% interval (bootstrap) 7.2 to 14.5 points
          Every plausible size in that range is at least 7 points,
          so a gap of a single point would not fit the data well.
        `,
      },
    },
    {
      heading: 'Clear is not the same as important',
      paragraphs: [
        "A result can be statistically clear and still small in practice. With enough learners, a half-point gap can produce a tiny p-value, because the test has the power to see it. The p-value tells you the gap is probably not zero. It does not tell you the gap matters.",
        "Judge importance against a number that matters to people. Is a 10-point gap on a 100-point quiz worth changing a schedule for? That is a question for teachers and learners, and it needs the interval, not only the p-value.",
        "Report the gap, the interval and the sample size together, so a reader can judge each part for themselves. A p-value without a sample size can make a tiny result look large.",
      ],
      example: {
        language: 'text',
        code: code`
          Study                 Gap          p-value        Matters?
          16 learners           10.6 points  below 0.001    likely, if the range holds
          5,000 learners        0.5 points   below 0.001    probably not, too small to notice
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A permutation test and a bootstrap interval',
    intro: "The script below computes the gap, runs the shuffling test and builds a 95 percent interval by resampling. A fixed seed makes the results repeatable. The file is the clean experiment data from the previous lesson, and the output is what the script prints.",
    example: {
      language: 'python',
      filename: 'stats.py',
      files: { 'experiment.csv': experimentCsv },
      code: code`
        import csv
        import random
        from statistics import mean

        def load(path):
            with open(path, newline="") as file:
                return [{"group": r["group"], "score": int(r["quiz_score"])} for r in csv.DictReader(file)]

        rows = load("experiment.csv")
        daily = [r["score"] for r in rows if r["group"] == "daily"]
        weekly = [r["score"] for r in rows if r["group"] == "weekly"]
        observed = mean(daily) - mean(weekly)
        print("observed difference:", round(observed, 2))

        rng = random.Random(1)
        scores = daily + weekly
        count = 0
        trials = 10000
        for _ in range(trials):
            rng.shuffle(scores)
            diff = mean(scores[:len(daily)]) - mean(scores[len(daily):])
            if abs(diff) >= abs(observed):
                count += 1
        print("shuffles at least as extreme:", count, "of", trials)

        boot = []
        for _ in range(2000):
            d = [rng.choice(daily) for _ in daily]
            w = [rng.choice(weekly) for _ in weekly]
            boot.append(mean(d) - mean(w))
        boot.sort()
        low, high = boot[int(0.025 * len(boot))], boot[int(0.975 * len(boot))]
        print("95% interval:", round(low, 1), "to", round(high, 1))
      `,
      output: "observed difference: 10.62\nshuffles at least as extreme: 1 of 10000\n95% interval: 7.2 to 14.5",
    },
    steps: [
      { code: 'observed = mean(daily) - mean(weekly)', explanation: "The real gap, measured once. Everything after this asks whether a gap this size is ordinary under chance." },
      { code: 'rng.shuffle(scores)', explanation: "Breaks the link between each score and its group, which is what would be true if the schedule made no difference." },
      { code: 'if abs(diff) >= abs(observed):', explanation: "Counts the shuffled gaps as large as the real one, in either direction. One of 10,000 means chance almost never produces a gap like this, so the p-value is about 0.0001." },
      { code: 'print("95% interval:", round(low, 1), "to", round(high, 1))', explanation: "The middle 95 percent of resampled gaps. A narrow interval far from zero means the data estimates the gap fairly precisely." },
    ],
  },
  tryIt: {
    instructions: [
      'Run `stats.py` on the clean file, then run it again with a different seed in place of 1. Check whether the interval changes much, and write down what the change tells you about the stability of the estimate.',
      'Write the 10 rows that survived cleaning to a file with the same columns, and run the script on it. Note how much wider the interval becomes as the number of learners falls from 16 to 10.',
      'Write one sentence that states the result with its interval and one limitation, such as the small sample or the four-week time frame. Keep it with your research notes.',
    ],
  },
  mistakes: [
    { mistake: 'Calling a result "proven" because the p-value is small.', fix: 'Describe the evidence and its size, and name the limits of the study.' },
    { mistake: 'Reading a p-value as the chance the result is false.', fix: 'Read it as the chance of a gap this large if there were no real difference.' },
    { mistake: 'Running many comparisons and reporting only the one that was significant.', fix: 'Decide the comparison in advance, and report the others too, with their results.' },
    { mistake: 'Reporting only a yes or no and leaving out the interval.', fix: 'Report the size of the gap with its interval, so readers can judge whether it matters.' },
  ],
  quiz: [
    {
      question: 'In plain words, what does a p-value of 0.01 mean?',
      options: [
        { text: 'There is a 99 percent chance the schedule works', explanation: 'A p-value does not give the chance that a claim is true, so this reading is wrong.' },
        { text: 'If the schedule made no difference, a gap this large would appear about 1 time in 100 by chance', explanation: 'That is the definition: the chance of a gap at least this large, assuming no real difference.' },
        { text: 'The result is 1 percent wrong', explanation: 'A p-value is not an error rate for the result.' },
        { text: 'The groups differ by 1 percent', explanation: 'The p-value is about chance, not the size of the difference.' },
      ],
      answer: 1,
    },
    {
      question: 'A 95 percent interval for the gap is 7 to 14 points. What is the most accurate reading?',
      options: [
        { text: 'There is a 95 percent chance the true gap is between 7 and 14', explanation: 'That is a common misreading. The interval comes from the method, not from a probability about this one range.' },
        { text: 'Every learner will gain between 7 and 14 points', explanation: 'An interval describes the average gap between groups, not each learner.' },
        { text: 'The method that built this interval would capture the true gap in about 95 of 100 repeated studies', explanation: 'That is the correct reading of a confidence interval for a method repeated over many studies.' },
        { text: 'The average score is 95', explanation: 'The interval is about the gap between groups, not an average score.' },
      ],
      answer: 2,
    },
    {
      question: 'A study of 5,000 learners finds a 0.5-point gap with a tiny p-value. What is the right conclusion?',
      options: [
        { text: 'The schedule is important, because the p-value is tiny', explanation: 'A tiny p-value shows the gap is probably not zero. It does not show the gap matters.' },
        { text: 'The study proves the weekly group is better', explanation: 'The study shows a small gap in one direction. It does not prove anything about the better group.' },
        { text: 'Half a point cannot be measured', explanation: 'It can be measured. The question is whether it is large enough to matter.' },
        { text: 'The gap is real but may be too small to matter, so judge it by whether half a point changes anything learners care about', explanation: 'Clear and important are different. Importance depends on the size of the gap and what it changes.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'A p-value shows how unlikely a gap is under chance, a confidence interval shows the plausible size of the gap, and only the size of the gap tells you whether it matters.',
  underTheHood: {
    heading: 'Why resampling works without a formula',
    paragraphs: [
      "Classic statistics often uses formulas that assume the data follows a known shape, such as the bell curve. Resampling methods avoid that assumption. The permutation test and the bootstrap let the data stand in for the unknown distribution, by repeating the study's logic many times.",
      "The bootstrap works because each sample of learners is a stand-in for the wider population. Drawing with replacement from the observed scores imitates collecting new studies. Repeating the draw many times reveals how much the gap would move from study to study, and that spread becomes the interval.",
      "Both methods depend on the data being a fair picture. If the sample is biased, resampling reproduces the bias with confidence. That is why the earlier lessons on collection and assignment come first. Good statistics cannot rescue a study that was never fair.",
    ],
  },
}

export default lesson
