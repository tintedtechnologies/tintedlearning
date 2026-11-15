import type { ProjectPlan } from '../../types/project'
import { code } from '../lessons/helpers'

const plan: ProjectPlan = {
  id: 'automate-a-real-task',
  whatYouBuild: "A small Python script that does a real chore for you: it tidies a messy folder by file type, adds up your spending from a CSV file, and renames photos by date. It runs from the command line with a clear message when something goes wrong.",
  diagram: code`
    Your messy folder                     Your spending CSV
      -> tidy.py sorts files into            -> summary.py adds up each category
         folders by file type                   food: 21.25, transport: 3.20
      -> photos.py renames by date         Run from the terminal with one command
      -> errors print a clear message, not a crash
  `,
  lessons: ['python-basics', 'python-functions', 'python-files-and-errors', 'git-github'],
  tools: ['Python 3.12 or newer, installed from python.org or your system', 'A terminal', 'A folder of real files you are happy to sort, plus a copy for testing', 'A free GitHub account, to publish the script'],
  time: 'about 3 hours',
  requirements: [
    'Sorts files in a folder by type, and never deletes a file',
    'Adds up spending from a CSV file, by category, and prints the totals',
    'Renames photos by date, and skips files it does not recognize',
    'Runs from the command line, and prints a clear message on a missing file or a bad row',
    'Lives in a Git repository with a README, and no personal file paths in the code',
  ],
  milestones: [
    {
      title: 'Pick the task and set up the project',
      goal: 'Choose one chore that happens every week, create a project folder and a Git repository, and make a copy of the files you will test on.',
      hints: [
        'Write the task in one sentence, such as "sort my downloads folder by file type". A task you can state in one sentence is small enough to finish.',
        'Work on a copy of the folder, so a mistake cannot delete your real files.',
      ],
      checkpoint: 'The project folder has a Git repository, a README with your task in one sentence, and a copy of the test files.',
    },
    {
      title: 'Sort files into folders by type',
      goal: 'Move each file into a folder named after its extension, so a messy folder becomes an organized one.',
      hints: [
        'Use pathlib to list the files, and the suffix to name the folder. Files with no extension go into an "other" folder.',
        'Move files with rename, which never deletes anything.',
      ],
      code: {
        language: 'python',
        filename: 'tidy.py',
        code: code`
          from pathlib import Path
          import tempfile

          def tidy(folder):
              moved = []
              for path in sorted(Path(folder).iterdir()):
                  if path.is_file():
                      kind = path.suffix.lower().lstrip(".") or "other"
                      target = Path(folder) / kind
                      target.mkdir(exist_ok=True)
                      path.rename(target / path.name)
                      moved.append(f"{path.name} -> {kind}/")
              return moved

          if __name__ == "__main__":
              with tempfile.TemporaryDirectory() as folder:
                  for name in ["notes.txt", "photo.jpg", "budget.csv", "README"]:
                      Path(folder, name).write_text("sample")
                  for line in tidy(folder):
                      print(line)
        `,
        output: 'README -> other/\nbudget.csv -> csv/\nnotes.txt -> txt/\nphoto.jpg -> jpg/',
      },
      checkpoint: 'Running tidy.py on the test copy leaves each file in a folder named after its type, and no file is lost.',
    },
    {
      title: 'Add up spending from a CSV file',
      goal: 'Read a CSV file of expenses and print the total for each category.',
      hints: [
        'The csv module reads each row as a dictionary when you use DictReader.',
        'Convert the amount to a number before you add it, and format the totals to two decimal places.',
      ],
      code: {
        language: 'python',
        filename: 'summary.py',
        code: code`
          import csv
          import io
          from collections import defaultdict

          DATA = """date,category,amount
          2026-11-01,food,12.50
          2026-11-02,transport,3.20
          2026-11-02,food,8.75
          """

          if __name__ == "__main__":
              totals = defaultdict(float)
              for row in csv.DictReader(io.StringIO(DATA)):
                  totals[row["category"]] += float(row["amount"])
              for category, total in sorted(totals.items()):
                  print(f"{category}: {total:.2f}")
        `,
        output: 'food: 21.25\ntransport: 3.20',
      },
      checkpoint: 'The summary prints one total per category, and the totals match a calculator on the same rows.',
    },
    {
      title: 'Rename photos by date',
      goal: 'Rename each photo to its date and a number, and leave any file it does not recognize alone.',
      hints: [
        'Read the date from the file itself, such as its modification time, and build the new name from it.',
        'Check the suffix before renaming, and print a line for every file you skip.',
      ],
      checkpoint: 'Each photo in the test copy has a date-based name, and a text file in the same folder is left unchanged.',
    },
    {
      title: 'Make it a command with clear errors, then publish it',
      goal: 'Run each task from one command with arguments, print a clear message for a missing file or a bad row, and publish the project.',
      hints: [
        'Use argparse for the command, and catch the expected errors, so a mistake shows a message rather than a traceback.',
        'Commit each working step with a clear message, and check that the repository has no personal paths or file contents.',
      ],
      checkpoint: 'python summary.py missing.csv prints a short message, and the repository is pushed to GitHub with a README.',
    },
  ],
  finishedMeans: [
    'Each task runs from one command, on a copy of the test files',
    'No task deletes a file, and the original folder is unchanged after a test run',
    'A missing file or a bad CSV row prints a clear message',
    'The repository has a README that says what the script does and how to run it',
    'The code has no personal file paths and no real personal data',
  ],
  readmeTemplate: code`
    # [Project name]

    [One sentence: the chore this script does for you.]

    ## Run it
    [The command for each task, with an example.]

    ## What it does and does not change
    [Which files move or change, and which are never touched.]

    ## Errors
    [What the script prints for a missing file or a bad row.]
  `,
  writeUpPrompts: [
    'The chore: what you did by hand before, and how often you did it.',
    'One decision you made, such as moving files rather than deleting them, and why.',
    'One thing that went wrong on the first run, and how you fixed it.',
    'What you would automate next.',
  ],
  demoGuidance: 'Record the terminal: show the messy test folder, run the command, then show the organized folder. Keep it under 60 seconds. Free tools include the screen recorder built into macOS and Windows, and OBS Studio. Save it as demo.gif and link it from the README.',
  interviewGuidance: "Describe the real chore and the safety choice. For example: 'I used rename instead of delete, and I tested on a copy, because a script that touches files needs to be safe to run twice.' Then name the error you handled.",
  stretchGoals: [
    'Schedule the tidy script to run each week, and log what it moved',
    'Read the CSV from your bank export, and handle its column names',
    'Add a test that checks the totals on a small fixed CSV',
  ],
}

export default plan
