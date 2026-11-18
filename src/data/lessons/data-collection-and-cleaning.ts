import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { messyCsv } from './research-data'

const lesson: StructuredLesson = {
  assumes: 'Research Questions from this section, which fixed the groups and the outcome we will collect. Python files and loops from the Python section. All learners in this section are made up.',
  goals: [
    'Plan a data collection that gets consent and collects only what the question needs',
    'Find duplicates, missing values, typos and inconsistent labels in a messy file',
    'Record every cleaning decision so the result can be checked and repeated',
  ],
  bigIdea: "Data almost never arrives clean. Forms add stray spaces, people type words for numbers, and the same row can be submitted twice. Good research collects only what the question needs, with consent, and then cleans the data with written rules, so anyone can repeat the steps from the original file.",
  whyItMatters: "A study of quiz scores is only as good as its data. If a duplicate row counts twice, one learner's result gets extra weight. If a blank score is quietly treated as zero, the average falls for no real reason. Undocumented cleaning can change the answer, and nobody can tell which change caused it.",
  goalSections: [
    {
      heading: 'Collect with a plan and consent',
      paragraphs: [
        "A collection plan says who is in the study, what is measured, when, and how the data is stored. It also says what is not collected. Our study needs a group label, a learner code and a quiz score. It does not need a name, an address or a birthday, so those are never asked for.",
        "Learners must agree to take part before any data is recorded, and they must know they can stop. Use a code such as L01 instead of a name in every file. The code links the score to the group without revealing who the learner is, which protects them if the file is shared. Write the collection plan before the first learner joins, and share it with the people who will check the results, so the plan can be compared with what was actually done.",
      ],
      example: {
        language: 'text',
        code: code`
          Collected               Why
          learner code (L01)      links the rows together without a name
          group (daily, weekly)   the comparison we are testing
          quiz_score (0 to 100)   the outcome we defined in advance
          consent date            shows the learner agreed before the data existed
          not collected: name, address, birthday, school
        `,
      },
    },
    {
      heading: 'Find the problems in messy data',
      paragraphs: [
        "Four problems show up in almost every real file. Duplicates are the same record twice. Missing values are blank cells. Inconsistent labels are the same group written as \"Weekly\", \"weekly\" and \"weekly \" with a trailing space. Impossible or unreadable values are scores typed as words or numbers outside the 0 to 100 range.",
        "Look at the file before writing any code. Count the rows, list the distinct values in each column and check the first and last lines. Most surprises show up in a short list of values, and those counts tell you what the rules must handle.",
      ],
      example: {
        language: 'text',
        code: code`
          Row in the messy file          Problem
          L03,daily,82 (twice)           duplicate
          L02,Weekly ,71                 inconsistent label with a trailing space
          L05,daily,                     missing score
          L10,weekly,seventy-two         a number written as words
        `,
      },
    },
    {
      heading: 'Record every cleaning step',
      paragraphs: [
        "Keep the raw file exactly as it arrived, and never edit it by hand. Write the cleaning as code that reads the raw file and writes a new one. Each rule then has a definition you can check, and the whole process can run again next month, on new data, with the same result.",
        "Keep a log of each decision as well. For every row you drop or change, record the learner code, the rule and the reason. A log lets someone reviewing your results ask whether a particular choice changed the answer, and check it.",
      ],
      example: {
        language: 'text',
        code: code`
          cleaning log, 2026-11-14
          rule 1  strip spaces and lowercase the group label        applied to 2 rows
          rule 2  keep the first copy of a learner code             dropped 1 duplicate (L03)
          rule 3  a score that is not a whole number is dropped     dropped 2 rows (L05, L10)
          raw file untouched, cleaned file written separately
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Cleaning the messy file with written rules',
    intro: "The script below reads the messy file and applies three rules. It keeps the first copy of each learner, trims and lowercases the group label, and drops any score that is not a whole number. Every dropped row is printed with its reason, so the log writes itself. The file is read, never changed.",
    example: {
      language: 'python',
      filename: 'clean.py',
      files: { 'messy.csv': messyCsv },
      code: code`
        import csv

        def clean(path):
            seen = set()
            kept, report = [], []
            with open(path, newline="") as file:
                for row in csv.DictReader(file):
                    learner = row["learner_id"].strip()
                    group = row["group"].strip().lower()
                    score_text = row["quiz_score"].strip()
                    if learner in seen:
                        report.append(f"{learner}: duplicate, dropped")
                        continue
                    seen.add(learner)
                    if not score_text.isdigit():
                        report.append(f"{learner}: score '{score_text}' is not a number, dropped")
                        continue
                    kept.append({"learner_id": learner, "group": group, "quiz_score": int(score_text)})
            return kept, report

        rows, report = clean("messy.csv")
        for line in report:
            print(line)
        print(len(rows), "rows kept")
      `,
      output: "L03: duplicate, dropped\nL05: score '' is not a number, dropped\nL10: score 'seventy-two' is not a number, dropped\n10 rows kept",
    },
    steps: [
      { code: 'with open(path, newline="") as file:', explanation: "Opens the file for reading only. The raw data is never written to, so the script can run again on the same input." },
      { code: 'group = row["group"].strip().lower()', explanation: "Removes the trailing space and lowercases the label, so \"Weekly \" and \"weekly\" become one group." },
      { code: 'if learner in seen:', explanation: "Keeps the first copy of each learner. The second L03 row is recorded as a duplicate and skipped." },
      { code: 'if not score_text.isdigit():', explanation: "Drops blanks and words. The script does not guess that \"seventy-two\" means 72, because a guess would hide a decision. The log says exactly what was dropped and why." },
    ],
  },
  tryIt: {
    instructions: [
      'Copy `clean.py` and run it on the messy file. Check that the report matches the cleaning log above, and that the raw file is unchanged afterwards.',
      'Decide what to do with "seventy-two". Either add a rule that converts it to 72, or keep it dropped. Write the decision and the reason in `cleaning_log.md`, and explain how it could change the averages.',
      'Add the cleaning log output to your project. Then run the script on a file with a new problem of your own invention, and add a rule that handles it.',
    ],
  },
  mistakes: [
    { mistake: 'Editing the raw file by hand to fix a few values.', fix: 'Write each fix as a rule in code that reads the raw file, so the fix can be repeated and checked.' },
    { mistake: 'Dropping rows without saying so.', fix: 'Record every dropped or changed row with its learner code, the rule and the reason.' },
    { mistake: 'Treating a blank score as zero.', fix: 'Treat a missing value as missing, and decide on purpose whether to drop it or handle it another way.' },
    { mistake: 'Collecting names or birthdays that the question does not need.', fix: 'Collect only what the question needs, and use codes in place of names.' },
  ],
  quiz: [
    {
      question: 'Learner L03 appears twice with identical values. What should the cleaning step do?',
      options: [
        { text: 'Keep both, since more rows make a better study', explanation: 'A duplicate counts one learner twice, which gives that result extra weight.' },
        { text: 'Keep the first copy, and record that the second was dropped as a duplicate', explanation: 'One row per learner, with the decision logged, keeps the count honest.' },
        { text: 'Average the two rows', explanation: 'Averaging copies of the same record does not add information, and it hides the duplicate.' },
        { text: 'Delete the whole daily group', explanation: 'One duplicate does not call for removing a group, and that would bias the comparison.' },
      ],
      answer: 1,
    },
    {
      question: 'A score cell says "seventy-two". What is the best handling?',
      options: [
        { text: 'Change it to 0', explanation: 'Zero is a real score. Changing a missing or unreadable value to zero makes the average wrong.' },
        { text: 'Convert it to 72 silently', explanation: 'A silent conversion hides a decision. It can be right, but it must be written in the log.' },
        { text: 'Treat it as missing, and record the decision and its reason', explanation: 'A recorded decision can be checked, and the reason shows why the choice was made.' },
        { text: 'Keep the text and let the statistics code decide', explanation: 'Statistics code cannot average words, so the problem would appear later and in a confusing way.' },
      ],
      answer: 2,
    },
    {
      question: 'Why keep the raw file untouched?',
      options: [
        { text: 'It saves disk space', explanation: 'Space is not the reason. The raw file is the record of what was collected.' },
        { text: 'Because the law requires raw files to be printed', explanation: 'Printing is not what the practice is for, and no such rule is implied here.' },
        { text: 'So the spreadsheet opens faster', explanation: 'Speed has nothing to do with it. The reason is to keep the original for checking.' },
        { text: 'So the cleaning can be re-run and checked, and mistakes can be traced back to the source', explanation: 'With the original kept, anyone can repeat the cleaning and find where a value came from.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Collect only the data your question needs with consent, keep the raw file unchanged and clean it with written rules that log every dropped or changed row.',
  underTheHood: {
    heading: 'Why missing values can bias a result',
    paragraphs: [
      "Missing values are not always random. A learner who skips the quiz may be the one who found the material hardest or who had less time. If you drop every row with a blank score, the group that is left may be a more successful group than the one you started with. The average then describes the learners who finished, not the group you set out to study.",
      "Statisticians call a missing value missing at random when the gap has nothing to do with the outcome, and missing not at random when it does. The first kind is easier to handle. The second needs more care, such as reporting how many learners were lost from each group and comparing those learners with the rest.",
      "The honest first step is always to count the missing values by group. If one group loses many more learners than the other, the comparison itself is at risk, and the report must say so.",
    ],
  },
  resources: [
    { title: 'Data cleansing', provider: 'Wikipedia', description: 'Finding and fixing errors, duplicates, and gaps in a dataset.', url: 'https://en.wikipedia.org/wiki/Data_cleansing' },
    { title: 'Data collection', provider: 'Wikipedia', description: 'The methods for gathering data and the bias each one can introduce.', url: 'https://en.wikipedia.org/wiki/Data_collection' },
  ],
}

export default lesson
