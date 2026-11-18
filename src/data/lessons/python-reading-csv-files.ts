import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain what a CSV file is and why spreadsheets and databases export it',
    'Read CSV rows into a list of dictionaries with the csv module',
    'Write rows back out to a CSV file, and check the result',
  ],
  bigIdea: 'A CSV file stores a table as plain text: each line is a row, and commas separate the columns. Python\'s csv module reads each row into a list of values, and a DictReader gives each row named fields, so the program can ask for "price" rather than column number three. Writing a CSV works the same way in reverse.',
  whyItMatters: 'A shop exports last month\'s sales from its till as a CSV file. The owner wants the total for each product. Doing it by hand in a spreadsheet works once, but the next export has to be checked again. A short Python program reads any export with the same columns, produces the same totals, and can be run again whenever the data changes.',
  goalSections: [
    {
      heading: 'What a CSV file looks like',
      paragraphs: [
        'CSV stands for comma-separated values. The first line usually holds the column names, such as product, quantity, and price. Each following line is one record, with its values in the same order as the header. Spreadsheets, databases, and many websites export data in this format.',
        'CSV is simple, and that simplicity has limits. A value that contains a comma must be wrapped in quotes, and a program must handle that. Numbers come in as text, so they must be converted before arithmetic. These two facts cause most CSV bugs, and the csv module handles the first one for you.',
        'Open a CSV file with a with statement, which closes the file for you even if an error happens. Use newline="" when opening, as the csv module asks, so line endings are handled correctly on every system.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          product,quantity,price
          apple,3,0.50
          "bread, wholemeal",1,2.25
          milk,2,1.20
        `,
      },
      visual: { kind: 'list', values: ['"product,quantity,price"', '"apple,3,0.50"', '"milk,2,1.20"'], caption: 'Each row is one record in order. The header names the columns, so a program can refer to a value by its name rather than its position.' },
    },
    {
      heading: 'Reading rows into dictionaries',
      paragraphs: [
        'The csv.DictReader reads each row as a dictionary, using the header line for the keys. This makes the code easier to read, because row["price"] says what it means. It also keeps working if the columns are moved around in a future export.',
        'Every value is text, so convert before calculating. Use float for prices and int for counts. If a value is empty or badly formatted, the conversion fails, so a careful program checks the value first or handles the error on that row.',
        'The example below uses io.StringIO, which lets a program read text as if it were a file. This is useful for testing, because the test data sits in the program and no file needs to exist on disk.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import csv
          import io

          data = io.StringIO(
              "product,quantity,price\n"
              "apple,3,0.50\n"
              "milk,2,1.20\n"
          )
          rows = list(csv.DictReader(data))
          for row in rows:
              total = int(row["quantity"]) * float(row["price"])
              print(row["product"], round(total, 2))
        `,
        output: 'apple 1.5\nmilk 2.4',
      },
    },
    {
      heading: 'Writing a CSV file',
      paragraphs: [
        'To write a CSV file, use csv.writer or csv.DictWriter. Give the writer the header once, then write each row. The module adds the quotes that a value containing a comma needs, so you do not have to add them yourself.',
        'After writing, read the file back and check it. A check that the number of rows matches, and that a total you know by heart appears correctly, catches most mistakes. Checking the output is part of the program, not an optional extra.',
        'Be careful when writing over an existing file. Opening a file in write mode erases its old contents. If the data matters, write to a new file first, check it, and only then replace the old one.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import csv
          import io

          output = io.StringIO()
          writer = csv.writer(output, lineterminator="\n")
          writer.writerow(["product", "note"])
          writer.writerow(["bread, wholemeal", "contains a comma"])
          print(output.getvalue())
        `,
        output: 'product,note\n"bread, wholemeal",contains a comma\n',
      },
    },
  ],
  seeItInAction: {
    title: 'Totaling a sales export',
    intro: 'The program below reads a small sales export, calculates the total for each product, and prints the grand total. It uses the same logic you would use on a real file. Run it, then add a row for jam and predict how the grand total changes.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        import csv
        import io

        export = io.StringIO(
            "product,quantity,price\n"
            "apple,3,0.50\n"
            "bread,1,2.25\n"
            "apple,2,0.50\n"
        )
        totals = {}
        for row in csv.DictReader(export):
            amount = int(row["quantity"]) * float(row["price"])
            totals[row["product"]] = totals.get(row["product"], 0) + amount

        for product in sorted(totals):
            print(product, round(totals[product], 2))
        print("grand total", round(sum(totals.values()), 2))
      `,
      output: 'apple 2.5\nbread 2.25\ngrand total 4.75',
    },
    steps: [
      { code: 'for row in csv.DictReader(export):', explanation: 'Reads each row as a dictionary, so the column names are used in the code.' },
      { code: 'amount = int(row["quantity"]) * float(row["price"])', explanation: 'Converts the text to numbers before multiplying. Without this step, the program would fail or give the wrong result.' },
      { code: 'totals[row["product"]] = totals.get(row["product"], 0) + amount', explanation: 'Adds each row to its product total, starting from zero the first time a product appears.' },
    ],
  },
  tryIt: {
    instructions: [
      'Add a row for jam with a quantity of 1 and a price of 3.00 to the seeItInAction example. Predict the new grand total, then run the program to check.',
      'Write a CSV with a header and three rows about your own things, such as books or expenses. Read it back and print the number of rows.',
      'Find a CSV export from a tool you use, such as a bank or a spreadsheet. Write down the column names and one question you could answer with a program.',
    ],
  },
  mistakes: [
    { mistake: 'Doing arithmetic on CSV values without converting them.', fix: 'Convert with int or float before calculating, and handle a value that cannot be converted.' },
    { mistake: 'Splitting each line on commas by hand.', fix: 'Use the csv module, which handles quoted values that contain commas.' },
    { mistake: 'Opening an important file in write mode without a backup.', fix: 'Write to a new file, check it, and then replace the old one.' },
  ],
  quiz: [
    {
      question: 'Why must values read from a CSV file be converted before arithmetic?',
      options: [
        { text: 'Because every value read from a CSV file is text', explanation: 'Yes. The csv module returns strings, so they must be converted before calculation.' },
        { text: 'Because CSV files cannot contain numbers', explanation: 'CSV files often contain numbers. They are just read as text.' },
        { text: 'Because the csv module only reads letters', explanation: 'The csv module reads all characters, including digits.' },
        { text: 'Because numbers must be stored in a separate file', explanation: 'Numbers are normally stored in the same file as text.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the total of the apple row?',
      code: { language: 'python', runnable: true, code: code`
        import csv
        import io
        data = io.StringIO("product,quantity,price\napple,3,0.50\n")
        for row in csv.DictReader(data):
            print(row["product"], int(row["quantity"]) * float(row["price"]))
      ` },
      options: [
        { text: 'apple 1.5', explanation: 'Yes. Three apples at fifty cents each is 1.5.' },
        { text: 'apple 3.5', explanation: 'That would be the quantity plus the price, not the product of them.' },
        { text: 'apple 0.5', explanation: 'That is the price of one apple, not the total for three.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why does the csv module add quotes around a value such as "bread, wholemeal"?',
      options: [
        { text: 'So the comma inside the value is not mistaken for a column separator', explanation: 'Yes. The quotes keep the value together when the file is read back.' },
        { text: 'So the value is stored in bold', explanation: 'Quotes are about separating columns, not formatting.' },
        { text: 'So the file is smaller', explanation: 'The quotes add characters, so the file is not made smaller by them.' },
        { text: 'So the value can be used as a number', explanation: 'The quotes do not convert the value to a number.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A CSV file is a table of text rows, the csv module reads and writes it safely, and every number must be converted before it is calculated and checked after it is written.',
  resources: [
    { title: 'csv: CSV File Reading and Writing', provider: 'Python.org', description: 'The official reference for reading and writing CSV files in Python.', url: 'https://docs.python.org/3/library/csv.html' },
    { title: 'Working with CSV files in Python', provider: 'Real Python', description: 'A practical tutorial on reading, writing, and cleaning CSV data.', url: 'https://realpython.com/python-csv/' },
  ],
}

export default lesson
