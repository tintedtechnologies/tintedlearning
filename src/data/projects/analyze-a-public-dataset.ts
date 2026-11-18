import type { ProjectPlan } from '../../types/project'
import { code } from '../lessons/helpers'

const plan: ProjectPlan = {
  id: 'analyze-a-public-dataset',
  whatYouBuild: "An honest data analysis of a public dataset you choose. You pick one question, clean the data with written rules, chart the answer and write a short report that says what the data shows, what it does not, and what you would check next.",
  diagram: code`
    Public dataset (a government, university or open-data site)
      -> one question, written before you look
      -> check the data: rows, duplicates, missing values
      -> clean with written rules, and log every dropped row
      -> summarize and chart the answer
      -> report: the answer, the evidence, the limits and the next check
  `,
  lessons: ['python-data-analysis', 'probability-and-statistics', 'data-collection-and-cleaning', 'reporting-results', 'reading-research-papers'],
  tools: ['Python 3.12 or newer, with a virtual environment', 'pandas and matplotlib, installed from requirements.txt (optional: the standard library is enough for the first steps)', 'A public dataset in CSV form, from a source that states its license', 'A text editor for the report'],
  time: 'about 6 hours',
  requirements: [
    'Uses a public dataset, with its source and license written in the README',
    'States one question and a prediction before looking at the data',
    'Checks and cleans the data with written rules, and logs every dropped row',
    'Charts the answer with labeled axes and a title',
    'Writes a report with the answer, the evidence and at least two limits',
  ],
  milestones: [
    {
      title: 'Choose a dataset and write one question',
      goal: 'Pick a public dataset with a clear license, write one question it can answer, and write your prediction before you open the data.',
      hints: [
        'Choose a dataset with at least a few hundred rows and a column that answers your question.',
        'Write down the source, its license and the date you downloaded it, in the README.',
      ],
      checkpoint: 'The README names the dataset, its license, one question and a written prediction.',
    },
    {
      title: 'Check the data before you trust it',
      goal: 'Count the rows, find the duplicates and the missing values, and list the values in each column you will use.',
      hints: [
        'Count before you clean. The counts tell you which rules you need.',
        'Use a Counter to find duplicate rows, and count the blank cells in each column.',
      ],
      code: {
        language: 'python',
        filename: 'check_data.py',
        code: code`
          import csv
          import io
          from collections import Counter

          DATA = """city,temp_c
          Oslo,4.1
          Lima,19.8
          Oslo,4.1
          Cairo,
          Lima,18.9
          """

          if __name__ == "__main__":
              rows = list(csv.DictReader(io.StringIO(DATA)))
              print("rows:", len(rows))
              print("duplicates:", sum(count - 1 for count in Counter(tuple(r.values()) for r in rows).values() if count > 1))
              print("missing temp:", sum(1 for r in rows if not r["temp_c"]))
        `,
        output: 'rows: 5\nduplicates: 1\nmissing temp: 1',
      },
      checkpoint: 'Your counts for rows, duplicates and missing values are written in the README, for the real dataset.',
    },
    {
      title: 'Clean with written rules and log every change',
      goal: 'Remove duplicates and rows with missing values using rules you wrote down, and keep a log of every row you dropped.',
      hints: [
        'Write each rule as a sentence before you code it, such as "drop a row when the temperature is blank".',
        'Keep the raw file unchanged, and write the cleaned data to a new file.',
      ],
      code: {
        language: 'python',
        filename: 'clean_data.py',
        code: code`
          import csv
          import io

          DATA = """city,temp_c
          Oslo,4.1
          Lima,19.8
          Oslo,4.1
          Cairo,
          Lima,18.9
          """

          def clean(rows):
              seen, kept, log = set(), [], []
              for row in rows:
                  key = tuple(row.values())
                  if key in seen:
                      log.append(f"duplicate dropped: {row['city']}")
                      continue
                  seen.add(key)
                  if not row["temp_c"]:
                      log.append(f"missing temp dropped: {row['city']}")
                      continue
                  kept.append({"city": row["city"], "temp_c": float(row["temp_c"])})
              return kept, log

          if __name__ == "__main__":
              kept, log = clean(list(csv.DictReader(io.StringIO(DATA))))
              for line in log:
                  print(line)
              print("kept:", len(kept))
        `,
        output: 'duplicate dropped: Oslo\nmissing temp dropped: Cairo\nkept: 3',
      },
      checkpoint: 'The log lists each dropped row with its reason, and the number kept matches your own count.',
    },
    {
      title: 'Answer the question with a summary and a chart',
      goal: 'Summarize the cleaned data for your question, and draw one chart with a title and labeled axes.',
      hints: [
        'Use the same measure you wrote in your prediction, such as an average, and compare groups with the same unit.',
        'Use the same axis scale for every group in the chart, so the chart does not exaggerate the difference.',
      ],
      checkpoint: 'The chart is saved as an image, has a title and labeled axes, and matches the summary numbers in the README.',
    },
    {
      title: 'Write an honest report',
      goal: 'Write a short report that gives the answer, the evidence, two limits and the next check you would run.',
      hints: [
        'State the answer in one sentence before any numbers. Say whether it matched your prediction.',
        'Limits to consider: the sample size, how the data was collected, and what the dataset does not measure.',
      ],
      checkpoint: 'The report opens with the answer, says whether your prediction held, names two limits and avoids the word "proves".',
    },
  ],
  finishedMeans: [
    'The README names the dataset, its source, its license and the question',
    'The cleaning rules are written down, and the log lists every dropped row',
    'The raw file is unchanged, and the analysis runs from a fresh clone',
    'The chart has a title, labeled axes and the same scale for every group',
    'The report says whether the prediction held, and what the data cannot show',
  ],
  readmeTemplate: code`
    # [Project name]

    [One sentence: the question and the answer you found.]

    ## Data
    [The dataset, its source, its license, the download date and the row count.]

    ## Prediction
    [What you expected to find, written before you looked at the data.]

    ## Cleaning rules
    [Each rule as a sentence, and how many rows each one dropped.]

    ## Result
    [The chart and the key numbers.]

    ## Limits and next check
    [At least two limits, and the next check you would run.]
  `,
  writeUpPrompts: [
    'The question: what you wanted to know, and why it mattered to you.',
    'One cleaning decision, such as dropping blank rows rather than guessing, and why.',
    'One result that surprised you, and what you checked before believing it.',
    'What the data could not show, and what you would collect next.',
  ],
  demoGuidance: 'Record the chart being produced, then point to the answer in the report. Keep it under 60 seconds. Free tools include the screen recorder built into macOS and Windows, OBS Studio, and ScreenToGif on Windows. Save it as demo.gif and link it from the README.',
  interviewGuidance: "Lead with the question and what you did to avoid fooling yourself. For example: 'I wrote my prediction first, logged every dropped row, and reported two limits, so the result can be checked.' Interviewers look for that care with data.",
  stretchGoals: [
    'Repeat the analysis on a second dataset, and compare the answers',
    'Test whether the difference is larger than chance, using a permutation test',
    'Publish the cleaning script and a test, so someone else can reproduce the numbers',
  ],
}

export default plan
