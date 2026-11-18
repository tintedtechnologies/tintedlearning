import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Separate a program into parts that each have one clear job',
    'Explain why a part should depend on the smallest possible set of other parts',
    'Shape a function so that it can be tested without the real database or the real file',
  ],
  bigIdea: 'Good software design keeps each part responsible for one job, and it keeps the connections between parts small and explicit. When the parsing, the storing, and the printing live in separate functions, a change to one of them rarely breaks the others. Passing in the things a function depends on, rather than reaching out for them, makes the code easier to test.',
  whyItMatters: 'Study Tracker starts as one function that reads a line from a file, adds the minutes to a total in the database, and prints the report. A new requirement asks for the same report as a CSV file. Every part of the function has to be copied and edited, and a bug fixed in one copy stays in the other. Splitting the job first turns the new requirement into one new function.',
  goalSections: [
    {
      heading: 'One job per part',
      paragraphs: [
        'A part of a program has one job when you can describe it in one short sentence without the word "and". "Parses a study session line" is one job. "Parses a line, saves it, and prints the total" is three jobs that have been joined together, and the joins are where bugs and copies appear.',
        'Name each part after its job. A function called parse_session tells the reader what to expect, and a function called process tells them nothing. Clear names make it possible to find the right part quickly when a change is needed.',
        'Split the work when a part grows hard to test or hard to explain. A long function is often several small jobs that have not been separated yet, and each one can be given its own name and its own test.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          def parse_session(line):
              subject, minutes = line.split(",")
              return subject.strip(), int(minutes)

          def total_minutes(sessions):
              return sum(minutes for _, minutes in sessions)

          def format_report(total):
              return f"Total study time: {total} minutes"

          sessions = [parse_session(line) for line in ["math, 30", "science, 45"]]
          print(format_report(total_minutes(sessions)))
        `,
        output: 'Total study time: 75 minutes',
      },
    },
    {
      heading: 'Keeping connections small',
      paragraphs: [
        'A dependency is something a part needs in order to work. A function that opens the database itself depends on the database being there, with the right name and the right permissions. A function that receives the list of sessions depends only on the data it was given.',
        'Pass dependencies in as parameters when you can. The same function then works with the real database in the application and with a plain list in a test. The rule is simple: if a function needs something from outside itself, make that need visible in its signature.',
        'Avoid reaching across the program for hidden state. A global variable that several functions change makes it impossible to know what a function will do without reading the whole program. Keep the data moving through parameters and return values, so each call explains itself.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          class ListStore:
              def __init__(self):
                  self.rows = []

              def save(self, session):
                  self.rows.append(session)

          def record_session(store, subject, minutes):
              store.save((subject, minutes))

          store = ListStore()
          record_session(store, "math", 30)
          print(store.rows)
        `,
        output: '[(\'math\', 30)]',
      },
    },
    {
      heading: 'Testing a part without its neighbors',
      paragraphs: [
        'A part that depends only on its inputs can be tested with known inputs and known outputs. Write a test for total_minutes with an empty list, one session, and several sessions. Each test runs in a moment and needs no database, network, or file.',
        'When a test is hard to write, the design is usually the problem. If you need to start a server and create a file just to check a total, the total calculation is tangled with the input and output. Separate the calculation, and the test becomes obvious.',
        'Good design does not mean adding layers for their own sake. Three small functions for a program of forty lines can be more than it needs. Split when a part is hard to test, hard to name, or changed for two different reasons.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          def total_minutes(sessions):
              return sum(minutes for _, minutes in sessions)

          tests = [([], 0), ([("math", 30)], 30), ([("math", 30), ("art", 15)], 45)]
          for sessions, expected in tests:
              result = total_minutes(sessions)
              print("pass" if result == expected else "FAIL", result, expected)
        `,
        output: 'pass 0 0\npass 30 30\npass 45 45',
      },
    },
  ],
  seeItInAction: {
    title: 'Adding a new report without copying code',
    intro: 'The program above splits Study Tracker into a parser, a total, and a formatter. The new CSV report reuses the parser and the total, and only the formatter is new. Run it, then change the report to include the number of sessions and predict which function changes.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        def parse_session(line):
            subject, minutes = line.split(",")
            return subject.strip(), int(minutes)

        def total_minutes(sessions):
            return sum(minutes for _, minutes in sessions)

        def format_csv(sessions):
            rows = ["subject,minutes"] + [f"{subject},{minutes}" for subject, minutes in sessions]
            rows.append(f"total,{total_minutes(sessions)}")
            return "\n".join(rows)

        sessions = [parse_session(line) for line in ["math, 30", "science, 45"]]
        print(format_csv(sessions))
      `,
      output: 'subject,minutes\nmath,30\nscience,45\ntotal,75',
    },
    steps: [
      { code: 'sessions = [parse_session(line) for line in [...]]', explanation: 'The parser is reused exactly as before. Nothing about reading the input changed.' },
      { code: 'def format_csv(sessions):', explanation: 'The only new part. It receives the sessions and returns text, with no database or file inside it.' },
      { code: 'rows.append(f"total,{total_minutes(sessions)}")', explanation: 'Reuses the total function, so the CSV total and the printed total cannot disagree.' },
    ],
  },
  tryIt: {
    instructions: [
      'Take a function from a program you wrote and write its job in one sentence. If the sentence needs "and", split the function.',
      'Add a test for total_minutes with an empty list in the seeItInAction example. Predict the result, then run the program with that test added.',
      'Change format_csv so that it sorts the sessions by subject. Decide whether the parser or the total needs to change, and explain why not.',
    ],
  },
  mistakes: [
    { mistake: 'Mixing reading, calculating, and printing in one function.', fix: 'Give each job its own function, and name it after the job.' },
    { mistake: 'Reaching for a global database or file inside every function.', fix: 'Pass the data or the store in as a parameter, so the function can be tested alone.' },
    { mistake: 'Adding layers and interfaces before the program needs them.', fix: 'Split only when a part is hard to test, hard to name, or changes for two reasons.' },
  ],
  quiz: [
    {
      question: 'Which function name best describes a single job?',
      options: [
        { text: 'process_everything', explanation: 'That name hides several jobs behind a vague word.' },
        { text: 'parse_session', explanation: 'Yes. The name says exactly what the function does, and nothing else.' },
        { text: 'do_it', explanation: 'That name does not say what the function does.' },
        { text: 'handle', explanation: 'A vague verb does not show the job.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        def total_minutes(sessions):
            return sum(minutes for _, minutes in sessions)
        print(total_minutes([("math", 20), ("art", 10)]))
      ` },
      options: [
        { text: '30', explanation: 'Yes. Twenty plus ten is thirty.' },
        { text: '20', explanation: 'That is only the first session, not the total.' },
        { text: '2', explanation: 'That is the number of sessions, not the minutes.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why pass the list of sessions into a function instead of reading it from the database inside?',
      options: [
        { text: 'So the function can be tested with a plain list and no database', explanation: 'Yes. A dependency passed in makes the function easy to test and to reuse.' },
        { text: 'So the function runs faster', explanation: 'Passing data is about clarity and testing, not speed.' },
        { text: 'Because Python forbids reading databases in functions', explanation: 'Python allows it. The reason to pass data is design.' },
        { text: 'So the database never needs a backup', explanation: 'Backups are a separate concern.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Give each part of Study Tracker one job, pass in what it needs, and keep the connections between parts visible, so that new requirements add a part instead of a copy.',
  resources: [
    { title: 'Clean Code: functions', provider: 'Robert C. Martin (book overview)', description: 'Guidance on small functions, single responsibility, and naming, with examples.', url: 'https://en.wikipedia.org/wiki/Clean_Code' },
    { title: 'Dependency injection in Python', provider: 'Real Python', description: 'A practical tutorial on passing dependencies into code so it can be tested.', url: 'https://realpython.com/python-dependency-injection/' },
  ],
}

export default lesson
