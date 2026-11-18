import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { experimentCsv } from './research-data'

const lesson: StructuredLesson = {
  assumes: 'Statistical Inference and Experiments from this section, including the difference between a p-value and an interval. The report in this lesson uses the clean experiment file, and every learner is a placeholder.',
  goals: [
    'Write a result as an answer, a likely range and the limits of the study, in plain words',
    'Draw a bar chart whose scale shows the true size of the difference',
    'Produce the whole report from one script, so anyone can reproduce it from the same file',
  ],
  bigIdea: "A research report answers the question first, then states how sure the evidence is and names its limits. Charts must show the real scale of the numbers, and the report should come from a script that anyone can run again on the same file.",
  whyItMatters: "People who act on a study often read only the summary. If that summary says \"daily study works\" beside a chart whose axis starts at 68, a 10-point gap looks enormous and the uncertainty disappears. A report that gives the answer, the range and the limits lets a teacher decide what to do.",
  goalSections: [
    {
      heading: 'Answer first, then the uncertainty',
      paragraphs: [
        "Open with one sentence that answers the question in the same words the study used. Follow it with the size of the difference, the range it probably falls in, the number of learners and the time frame. A reader who stops after the first two sentences should still know what was found and how firm it is.",
        "Read the sentence aloud before you publish it, and ask whether a stranger would hear more certainty than you intended. Avoid words that claim more than the study can show. \"Proven\", \"works\" and \"guarantees\" are too strong for one small study. \"Scored higher on average\" and \"the evidence points toward\" say what happened and no more.",
      ],
      example: {
        language: 'text',
        code: code`
          Answer:    daily learners scored about 10.6 points higher on average
          Range:     a likely range of about 7 to 14 points
          Sample:    16 learners, 8 in each group, four weeks
          Limits:    quiz at the end only, no follow-up test, one subject
        `,
      },
    },
    {
      heading: 'Charts that do not mislead',
      paragraphs: [
        "A bar's length is read against its starting line. If the vertical axis starts at 68 instead of 0, the daily bar looks several times taller than the weekly one, even though the scores differ by about 15 percent. Bars should start at zero. If you want to show a small gap clearly, use dots with a range, not stretched bars.",
        "Label the units and the scale on every chart, and show the uncertainty. A chart without a unit, a scale or a range invites the reader to fill in the missing pieces with their own assumptions. A dot for each group's average, with a line for its range, tells the reader how far apart the groups are and how much they might overlap.",
      ],
      example: {
        language: 'text',
        code: code`
          Chart choice                     What the reader sees
          bars starting at 68              a gap that looks several times the real one
          bars starting at 0               the true size of both averages, side by side
          dots with ranges                 the gap and its uncertainty, with a clear scale
        `,
      },
    },
    {
      heading: 'Make the report reproducible',
      paragraphs: [
        "A report written by hand has many places for a number to drift. Write one script that reads the cleaned data, computes every number in the report and prints the text. Anyone with the same file can run it and get the same output, and a reviewer can check each number against the code.",
        "Keep the data, the script and the report in one folder, with the raw data unchanged. Store the folder in version control, so each change to the report has a date, an author and a reason. Record the date and the version of the file, so a later report can say exactly which data it describes.",
      ],
      example: {
        language: 'text',
        code: code`
          study-report/
            raw/experiment_2026-11-14.csv   the file as collected, never edited
            clean.py                        applies the written cleaning rules
            report.py                       computes every number and prints the summary
            report.md                       the output of report.py, copied in
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A report that prints its own numbers',
    intro: "The script below reads the experiment file and prints the report's key sentences, a range, a text bar chart and the limits. Every number comes from the data, so nobody has to copy one by hand. The approximate range uses the standard error, a common method for groups of this size.",
    example: {
      language: 'python',
      filename: 'report.py',
      files: { 'experiment.csv': experimentCsv },
      code: code`
        import csv
        from statistics import mean, stdev
        from math import sqrt

        with open("experiment.csv", newline="") as file:
            rows = list(csv.DictReader(file))

        daily = [int(r["quiz_score"]) for r in rows if r["group"] == "daily"]
        weekly = [int(r["quiz_score"]) for r in rows if r["group"] == "weekly"]

        gap = mean(daily) - mean(weekly)
        se = sqrt(stdev(daily) ** 2 / len(daily) + stdev(weekly) ** 2 / len(weekly))
        low, high = gap - 1.96 * se, gap + 1.96 * se

        print("Question: do daily 15-minute sessions beat one weekly 105-minute session?")
        print(f"Answer: daily learners scored {gap:.1f} points higher on average.")
        print(f"Likely range: {low:.1f} to {high:.1f} points (approximate 95%).")
        print(f"Learners: {len(daily)} daily, {len(weekly)} weekly.")
        print()
        for name, scores in [("daily", daily), ("weekly", weekly)]:
            bar = "#" * round(mean(scores) / 2)
            print(f"{name:7} {mean(scores):5.1f} {bar}")
        print()
        print("Limits: four weeks only; quiz at the end; no follow-up test.")
      `,
      output: "Question: do daily 15-minute sessions beat one weekly 105-minute session?\nAnswer: daily learners scored 10.6 points higher on average.\nLikely range: 6.8 to 14.4 points (approximate 95%).\nLearners: 8 daily, 8 weekly.\n\ndaily    80.5 ########################################\nweekly   69.9 ###################################\n\nLimits: four weeks only; quiz at the end; no follow-up test.",
    },
    steps: [
      { code: 'print(f"Answer: daily learners scored {gap:.1f} points higher on average.")', explanation: "The answer is computed from the data and rounded to one decimal place, so it cannot drift from the numbers below it." },
      { code: 'se = sqrt(stdev(daily) ** 2 / len(daily) + stdev(weekly) ** 2 / len(weekly))', explanation: "The standard error measures how much each average would move from study to study. It combines the spread within each group with the group sizes." },
      { code: 'bar = "#" * round(mean(scores) / 2)', explanation: "A text chart with one symbol for every two points. It starts at zero, so the bars show the real size of each average." },
      { code: 'print("Limits: four weeks only; quiz at the end; no follow-up test.")', explanation: "The limits are printed in the same report as the answer, so a reader cannot see one without the other." },
    ],
  },
  tryIt: {
    instructions: [
      'Copy `report.py` into a folder with `experiment.csv`, run it, and save the output as `report.md`. Check that every number in the file matches the printed output.',
      'Write a summary of 100 to 150 words using the answer, the range and the limits. Do not use the words "proven" or "works", and state what a follow-up study would need to test.',
      'Find one more limit that the report does not mention, add it to the printed limits, and rerun the script. Keep the change in version control with a short message that explains it.',
    ],
  },
  mistakes: [
    { mistake: 'Reporting the answer without its range.', fix: 'Print the range beside the answer, and keep the two together in every summary.' },
    { mistake: 'Starting a bar chart at a value other than zero.', fix: 'Start bars at zero, or use dots with ranges when the difference is small.' },
    { mistake: 'Calling one small study "proven".', fix: 'Describe what the evidence shows, its size and its limits, and name what a follow-up would test.' },
    { mistake: 'Copying numbers into the report by hand.', fix: 'Generate every number with the script, so a reviewer can check each one against the code.' },
  ],
  quiz: [
    {
      question: 'Which sentence is the best answer to put at the top of the report?',
      options: [
        { text: 'Daily study is proven to work.', explanation: 'One small study cannot prove this, and "proven" overstates what the data shows.' },
        { text: 'Daily learners scored about 10.6 points higher than weekly learners on a 100-point quiz, with a likely range of about 7 to 14 points, in a study of 16 learners over four weeks.', explanation: 'It gives the answer, the range and the sample in one sentence, which is what a reader needs first.' },
        { text: 'See the attached data for details.', explanation: 'A reader should not have to open the data to learn the answer.' },
        { text: 'Study habits are complicated.', explanation: 'This does not answer the question, so it gives the reader nothing to act on.' },
      ],
      answer: 1,
    },
    {
      question: 'A bar chart of the two averages has its vertical axis starting at 68, not 0. What is the problem?',
      options: [
        { text: 'The bars are too tall to fit on the page', explanation: 'Fitting the page is a layout issue, not a problem with what the chart shows.' },
        { text: 'Axis numbers should never be shown', explanation: 'Axis numbers help the reader, so removing them is not the fix.' },
        { text: 'Nothing, since the data is the same', explanation: 'The data is the same, but the picture is not. Bars are read against their starting line.' },
        { text: 'It makes a 10-point gap look far larger than it is, because bar length is read against the starting line', explanation: 'With the axis cut off, the difference looks several times larger than the real gap.' },
      ],
      answer: 3,
    },
    {
      question: 'Why produce the report from a script rather than copying the numbers by hand?',
      options: [
        { text: 'Scripts look more professional', explanation: 'Looks do not matter for accuracy. The reason is that the numbers can be checked and repeated.' },
        { text: 'Scripts are faster to type', explanation: 'Typing speed is not the reason. The point is that the numbers come straight from the data.' },
        { text: 'So anyone can rerun it on the same file and get the same numbers, and mistakes are visible in the code', explanation: 'A script can be rerun and reviewed, so every number can be traced to the data.' },
        { text: 'Hand copying is illegal', explanation: 'It is not illegal. The problem is that hand-copied numbers are hard to check and easy to get wrong.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'Report the answer with its likely range and limits, draw charts that start at zero, and produce every number from one script that anyone can run again on the same file.',
  resources: [
    { title: 'Reproducibility', provider: 'Wikipedia', description: 'Why results must be reported in enough detail for others to repeat them.', url: 'https://en.wikipedia.org/wiki/Reproducibility' },
    { title: 'EQUATOR Network reporting guidelines', provider: 'EQUATOR Network', description: 'A library of reporting guidelines that show what a good research report should include.', url: 'https://www.equator-network.org/' },
  ],
  underTheHood: {
    heading: 'Why a small sample needs a wider range',
    paragraphs: [
      "The 1.96 in the script comes from the bell curve, which describes many averages well when the sample is large. With only eight learners per group, the averages are less stable, and a method called the t distribution gives a slightly wider range than 1.96 does. The script uses 1.96 anyway, so its range is probably a little optimistic. The bootstrap range from the previous lesson is a different method, and it lands in roughly the same place. Neither is exact at this size.",
      "The honest move is to report the range from the method you chose, name the method and note that small samples make every range less reliable. A reader can then see that the result is a sketch of the effect, not a precise measurement.",
      "When a study grows, the approximations agree more closely, because the averages settle down. That is one reason larger studies are more trustworthy, and why a small study should describe its range as likely rather than certain.",
    ],
  },
}

export default lesson
