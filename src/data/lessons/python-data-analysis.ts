import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Load a small CSV file and look at it before calculating anything',
    'Find and fix missing or inconsistent values',
    'Summarize data with counts, averages and groups',
  ],
  bigIdea: "Data analysis means turning a table of raw records into a few numbers that answer a question. The calculations are the easy part. Most of the work, and most of the mistakes, come from not looking closely at the data first and not cleaning it before you add it up.",
  whyItMatters: "A café owner asks which drink makes the most money. The sales file says \"Latte\", \"latte \" and \"LATTE\" in different rows, and some prices are blank. A quick total treats those as three different drinks and quietly skips the blanks, so the answer is wrong and nobody notices. Checking and cleaning first is what makes the final number trustworthy.",
  goalSections: [
    {
      heading: 'Loading and inspecting a CSV',
      paragraphs: [
        "A CSV file, short for comma-separated values, is a table saved as plain text. The first line holds the column names and each following line is one row, with values separated by commas. Spreadsheets can save in this format.",
        "Python's `csv` module reads it. `csv.DictReader` turns each row into a dictionary, so you can write `row[\"price\"]` instead of remembering column numbers. Every value comes in as text, even numbers.",
        "Also compare what you expected with what you see. A price column that contains `N/A` or `$3.50` will break `float()` later, and it is much easier to notice now than after a crash.",
        "Before calculating, inspect: how many rows are there, what are the columns, and what do a few rows actually look like? The example uses `io.StringIO`, which makes a piece of text behave like a file, so it runs anywhere. With a real file you would use `open(\"sales.csv\", encoding=\"utf-8\")` instead.",
      ],
      example: {
        language: 'python',
        code: code`
          import csv
          import io

          data = """drink,price
          Latte,3.50
          tea,2.00
          """

          rows = list(csv.DictReader(io.StringIO(data)))
          print(len(rows), "rows")
          print(list(rows[0].keys()))
          print(rows[0])
        `,
        output: "2 rows\n['drink', 'price']\n{'drink': 'Latte', 'price': '3.50'}",
      },
    },
    {
      heading: 'Handling missing and inconsistent values',
      paragraphs: [
        "Two problems show up in almost every real dataset. Missing values are blanks where something should be. Inconsistent values are the same thing written differently, such as extra spaces or different capital letters.",
        "Fix inconsistent text by standardizing it: `.strip()` removes spaces at both ends and `.lower()` makes it lower case. For missing values, decide on purpose: skip the row, or fill in a sensible value. Whatever you choose, count how many rows were affected, because that count is part of the result.",
        "Finally, convert text to numbers with `float()` so you can do math with them.",
      ],
      example: {
        language: 'python',
        code: code`
          raw = [" Latte", "latte ", "LATTE", "Tea"]
          clean = [name.strip().lower() for name in raw]
          print(clean)

          prices = ["3.50", "", "3.40"]
          valid = [float(p) for p in prices if p != ""]
          print(valid, "skipped:", len(prices) - len(valid))
        `,
        output: "['latte', 'latte', 'latte', 'tea']\n[3.5, 3.4] skipped: 1",
      },
    },
    {
      heading: 'Summarizing with counts, averages and groups',
      paragraphs: [
        "The square-bracket lines above are list comprehensions: a short way to build a new list from an old one, with an optional `if` to filter. `[x * 2 for x in nums]` doubles every number.",
        "Once values are clean, the basic summaries are simple. `len()` counts, `sum()` totals, and the total divided by the count gives the average. `min()` and `max()` find the extremes.",
        "To answer questions like \"total sales per drink\", group the rows: keep a dictionary where each key is a group and each value is a running total. This is the same running-total pattern from loops, with one total per key.",
      ],
      example: {
        language: 'python',
        code: code`
          sales = [("latte", 3.5), ("tea", 2.0), ("latte", 3.4)]

          totals = {}
          for drink, price in sales:
              totals[drink] = totals.get(drink, 0) + price

          print(totals)
          print(max(totals, key=totals.get))
        `,
        output: "{'latte': 6.9, 'tea': 2.0}\nlatte",
      },
    },
  ],
  seeItInAction: {
    title: 'Which drink earns the most?',
    intro: "This program takes a messy sales file, inspects it, cleans the names, skips blank prices, and totals sales per drink. It runs as written.",
    example: {
      language: 'python',
      code: code`
        import csv
        import io

        data = """drink,price
        Latte,3.50
        latte ,3.50
        Tea,2.00
        LATTE,
        Mocha,4.00
        tea,2.00
        """

        rows = list(csv.DictReader(io.StringIO(data)))
        print("Rows:", len(rows))

        totals = {}
        skipped = 0
        for row in rows:
            drink = row["drink"].strip().lower()
            if row["price"] == "":
                skipped += 1
                continue
            totals[drink] = totals.get(drink, 0) + float(row["price"])

        print("Skipped blank prices:", skipped)
        for drink, total in sorted(totals.items()):
            print(drink, round(total, 2))
      `,
      output: 'Rows: 6\nSkipped blank prices: 1\nlatte 7.0\nmocha 4.0\ntea 4.0',
    },
    steps: [
      { code: 'rows = list(csv.DictReader(io.StringIO(data)))', explanation: "Reads every row into a list of dictionaries, using the header line for the keys." },
      { code: 'print("Rows:", len(rows))', explanation: "The first check: 6 rows. If you expected 600, you would stop here and find out why." },
      { code: 'drink = row["drink"].strip().lower()', explanation: "Standardizes each name, so \"Latte\", \"latte \" and \"LATTE\" all become `latte`." },
      { code: 'if row["price"] == "":\n    skipped += 1\n    continue', explanation: "A blank price cannot be added. The row is counted as skipped, and `continue` jumps straight to the next row." },
      { code: 'totals[drink] = totals.get(drink, 0) + float(row["price"])', explanation: "Converts the price to a number and adds it to that drink's running total. `.get(drink, 0)` starts each new drink at zero." },
      { code: 'for drink, total in sorted(totals.items()):', explanation: "`.items()` gives each key and value as a pair, and `sorted()` puts them in alphabetical order. `round()` tidies any tiny float errors." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground and check the three totals.',
      'Add a row `mocha ,4.00` to the data. Predict the new mocha total, then run it.',
      'Change the program so blank prices count as 0 instead of being skipped. Does the answer to "which drink earns the most" change?',
    ],
    playground: 'python',
    starterCode: code`
      import csv
      import io

      data = """drink,price
      Latte,3.50
      latte ,3.50
      Tea,2.00
      LATTE,
      Mocha,4.00
      tea,2.00
      """

      rows = list(csv.DictReader(io.StringIO(data)))
      print("Rows:", len(rows))

      totals = {}
      skipped = 0
      for row in rows:
          drink = row["drink"].strip().lower()
          if row["price"] == "":
              skipped += 1
              continue
          totals[drink] = totals.get(drink, 0) + float(row["price"])

      print("Skipped blank prices:", skipped)
      for drink, total in sorted(totals.items()):
          print(drink, round(total, 2))
    `,
  },
  mistakes: [
    { mistake: 'Calculating before looking at the data.', fix: 'Print the row count, the column names and a few rows first. Most surprises show up in the first minute.' },
    { mistake: 'Silently dropping rows with missing values.', fix: 'Count what you skip and report it next to the result, so readers know what the number covers.' },
    { mistake: 'Adding up numbers that are still text.', fix: 'CSV values are always strings. `"3.50" + "2.00"` gives `"3.502.00"`. Convert with `float()` or `int()` first.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        cities = ["Paris", " paris", "PARIS ", "Rome"]
        clean = set(c.strip().lower() for c in cities)
        print(len(clean))
      ` },
      options: [
        { text: '4', explanation: 'That would be true without cleaning. After `.strip().lower()`, the three spellings of Paris become identical.' },
        { text: '3', explanation: '`.lower()` alone would leave " paris" and "paris " different, but `.strip()` removes those spaces too.' },
        { text: '2', explanation: 'After cleaning there are only two distinct names, paris and rome, and a set keeps one of each.' },
        { text: '1', explanation: 'Rome is a different city, so it stays separate from Paris.' },
      ],
      answer: 2,
      answerIsOutput: true,
    },
    {
      question: 'A survey file has 500 rows. 80 have a blank age. You skip those and report "average age: 34". What is missing from your report?',
      options: [
        { text: 'That the average is based on 420 of the 500 responses', explanation: 'Readers need to know 80 rows were left out. If the missing ages are mostly older or younger people, the average is skewed.' },
        { text: 'The ages of every respondent', explanation: 'A summary is meant to replace the full list. What it needs is a note about what was excluded.' },
        { text: 'Nothing, because blank rows do not count', explanation: 'Blank rows are real responses with missing information. Ignoring them without saying so can mislead.' },
        { text: 'The average should have treated blanks as 0', explanation: 'Treating unknown ages as 0 would drag the average down badly. Skipping them is fine, as long as you say so.' },
      ],
      answer: 0,
    },
    {
      question: 'What number is printed?',
      code: { language: 'python', code: code`
        totals = {}
        for team, points in [("red", 3), ("blue", 1), ("red", 2)]:
            totals[team] = totals.get(team, 0) + points
        print(totals["red"])
      ` },
      options: [
        { text: '2', explanation: 'That is only red\'s last score. Each red score is added to the running total.' },
        { text: '6', explanation: 'That is everyone\'s points added together. The dictionary keeps a separate total for each team.' },
        { text: '3', explanation: 'That is red\'s first score. The second red row adds 2 more.' },
        { text: '5', explanation: 'Red scores 3 and then 2. Each time, `.get` finds red\'s total so far and adds the new points.' },
      ],
      answer: 3,
      answerIsOutput: true,
    },
  ],
  takeaway: 'Look at your data first, clean names and blanks on purpose while counting what you changed, and only then calculate your summaries.',
  resources: [
    { title: 'csv module', provider: 'Python.org', description: 'Reference for reading and writing CSV files with the standard library.', url: 'https://docs.python.org/3/library/csv.html' },
    { title: 'pandas getting started', provider: 'pandas', description: 'The next step: tutorials for the most popular data analysis package.', url: 'https://pandas.pydata.org/docs/getting_started/intro_tutorials/' },
  ],
  underTheHood: {
    heading: 'The same analysis in pandas',
    paragraphs: [
      "Once your data has thousands of rows and many columns, most people use the pandas package. It stores a table in an object called a DataFrame and does the looping for you, much faster, because the heavy work happens in compiled code.",
      "The whole café analysis becomes a few lines. `df = pd.read_csv(\"sales.csv\")` loads it. `df.info()` shows columns, types and missing counts. `df[\"drink\"] = df[\"drink\"].str.strip().str.lower()` cleans every name at once. `df.groupby(\"drink\")[\"price\"].sum()` totals sales per drink.",
      "Pandas skips blanks in sums by default, which is convenient and dangerous for the same reason this lesson warned about: you must still check how many values were missing, with `df[\"price\"].isna().sum()`. The ideas are identical. Pandas just writes them more briefly.",
    ],
  },
}

export default lesson
