import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Databases and SQL, with Study Tracker saving sessions in `study.db`, and the first lessons of AI Engineering. Everything in this section runs only against your own local copy of Study Tracker.',
  goals: [
    'Explain why untrusted input is behind most injection attacks',
    'List the attack surface of an app by finding every place outside data can enter it',
    'Keep data separate from commands with parameterized queries and checks on the server',
  ],
  bigIdea: "Most attacks start with data that a program trusts too much. Injection happens when that data is treated as part of the program's instructions, such as a SQL command, instead of as plain data. Defending an app means knowing every entry point, checking input where it arrives and keeping data apart from commands.",
  whyItMatters: "Study Tracker's `POST /sessions` accepts a subject from anyone who can reach the server. If that subject were pasted into a SQL command, one crafted request could read or delete every learner's sessions. Most breaches of small apps come from simple mistakes like this one, not from clever attacks on encryption.",
  goalSections: [
    {
      heading: 'Untrusted input',
      paragraphs: [
        "Input is any data your app receives from outside its own code: form fields, query parameters, headers, uploaded files, JSON bodies and the replies from other services. Treat all of it as untrusted until your code has checked it. Untrusted does not mean malicious. It means you cannot yet say what it contains.",
        "The browser is not a security boundary. Anyone can send a request to your API directly, without the form, so a rule that exists only in the web page protects nothing. Study Tracker's rules, such as minutes from 1 to 600, belong in the server, where every request passes through them.",
        "Trust also flows the other way. The model's reply in the study assistant comes from your own provider, but it was shaped by the learner's message and by any notes it read. Treat it as untrusted text as well.",
      ],
      example: {
        language: 'text',
        code: code`
          Where data enters Study Tracker        What could arrive there
          POST /sessions body                    a subject with quotes, or minutes as text
          GET /totals                            any query string at all
          Assistant chat message                 instructions meant to change the assistant
          Notes files and their text             sentences written to mislead the model
          Environment variables                  a value copied from the wrong place
        `,
      },
    },
    {
      heading: 'Injection',
      paragraphs: [
        "Injection is what happens when data is read as code. The classic case is SQL. If Study Tracker builds a query by joining text into the command, a value containing a quote can close the text early and add new conditions of its own.",
        "The fix is a placeholder. A `?` in the SQL marks where a value goes, and the database driver sends the value separately. The database then treats it only as data, however many quotes it contains. The worked example later in this lesson runs both versions against a harmless table in memory.",
      ],
      example: {
        language: 'text',
        code: code`
          Joined text (unsafe)
            "SELECT ... WHERE subject = '" + search + "'"
            search = x' OR '1'='1      -> returns every row

          Placeholder (safe)
            "SELECT ... WHERE subject = ?"   with the value  x' OR '1'='1
                                           -> returns no rows, because no subject has that name
        `,
      },
    },
    {
      heading: 'The attack surface',
      paragraphs: [
        "The attack surface is the set of places where an outsider can send data into your system or affect what it does. Listing it is the first defensive habit. You cannot protect an entry point you have not noticed, and each one needs its own checks.",
        "Each entry point should get only the access it needs. The endpoint that reads totals has no reason to change data, and a database user for reading does not need permission to delete. Narrow doors make a mistake at one door less costly.",
        "Write the list down. For each entry point, note what data arrives, what checks it gets, and what it can change. This list becomes the starting point for the threat model in the Threat Modeling AI Systems lesson.",
      ],
      example: {
        language: 'text',
        code: code`
          Entry point          Checks it needs                        Can it change data?
          POST /sessions       subject length, minutes range, date    yes, adds one row
          GET /totals          none beyond the route itself           no
          Assistant chat      tool arguments validated, step limit   yes, through log_session
          Notes import         file type and size                     yes, adds note rows
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Injection through a search box',
    intro: "The script above builds the same search two ways. Run it on your own computer. The attack string is harmless here, because the table exists only in memory. The output shows why the placeholder version is safe.",
    example: {
      language: 'python',
      filename: 'injection_demo.py',
      code: code`
        import sqlite3

        conn = sqlite3.connect(":memory:")
        conn.execute("CREATE TABLE sessions (id INTEGER PRIMARY KEY, subject TEXT, minutes INTEGER)")
        conn.execute("INSERT INTO sessions (subject, minutes) VALUES ('algebra', 40), ('biology', 25)")

        attack = "x' OR '1'='1"

        unsafe = f"SELECT subject, minutes FROM sessions WHERE subject = '{attack}'"
        print("Unsafe rows:", conn.execute(unsafe).fetchall())

        safe = conn.execute("SELECT subject, minutes FROM sessions WHERE subject = ?", (attack,)).fetchall()
        print("Safe rows:", safe)
      `,
      output: "Unsafe rows: [('algebra', 40), ('biology', 25)]\nSafe rows: []",
    },
    steps: [
      { code: 'attack = "x\' OR \'1\'=\'1"', explanation: "A search term that is not a subject at all. Its quotes are designed to end the text early, which is what an attacker would try." },
      { code: "unsafe = f\"SELECT ... WHERE subject = '{attack}'\"", explanation: "The f-string pastes the term straight into the command. The database now sees `subject = 'x' OR '1'='1'`, and `'1'='1'` is true for every row." },
      { code: 'print("Unsafe rows:", conn.execute(unsafe).fetchall())', explanation: "Both rows come back, so one search term returned data the learner did not ask for." },
      { code: 'safe = conn.execute("... WHERE subject = ?", (attack,)).fetchall()', explanation: "The `?` takes the term as a separate value. The database looks for a subject spelled exactly like the whole attack string, finds none, and returns an empty list." },
    ],
  },
  tryIt: {
    instructions: [
      'Create `attack-surface.md` in your Study Tracker folder. List every entry point in the table format above, including the notes import if you have it. For each one, write the checks it needs.',
      'Run `injection_demo.py`, then change `attack` to a value of your own and predict the output before you run it again.',
      'Open `db.py` and find any query that joins a value into the SQL text. Rewrite it with `?` placeholders, then run `python -m pytest` to confirm nothing else broke.',
    ],
  },
  mistakes: [
    { mistake: 'Checking input only in the web page.', fix: 'Check every value on the server, because anyone can send a request without your form.' },
    { mistake: 'Building SQL with f-strings or string joins.', fix: 'Use `?` placeholders and pass the values as a tuple.' },
    { mistake: 'Showing full error messages and stack traces to users.', fix: 'Log the details on the server and return a short message, so attackers learn less about your system.' },
    { mistake: 'Treating a model\'s reply as safe because your own service produced it.', fix: 'Show the reply as plain text and never run it as code or use it to build a command, without checks.' },
  ],
  quiz: [
    {
      question: 'Study Tracker builds a search query as `WHERE subject = \'{text}\'`. A learner types `x\' OR \'1\'=\'1`. What happens?',
      options: [
        { text: 'Nothing, because databases ignore quote marks', explanation: 'Quote marks are what let this input change the command, so they are not ignored.' },
        { text: 'Only the first row is returned', explanation: 'The condition is true for every row, so every row matches.' },
        { text: 'Every row matches, because the quote closes the text and the rest becomes a condition that is always true', explanation: 'The `\'1\'=\'1\'` part is always true, so the search returns all rows.' },
        { text: 'The query always fails with a syntax error', explanation: 'This particular input is valid SQL, so it runs and returns data.' },
      ],
      answer: 2,
    },
    {
      question: 'The web form stops a learner from entering -5 minutes. A user sends `{"minutes": -5}` straight to `POST /sessions`. What should the server do?',
      options: [
        { text: 'Save it, because the form already checked the value', explanation: 'The form is not part of the server, and a request can skip it entirely.' },
        { text: 'Reject it, because the server must check every request itself', explanation: 'The server is the only place every request must pass through, so its checks are the ones that count.' },
        { text: 'Save it as 0 minutes, so nothing breaks', explanation: 'Quietly changing values hides the problem and stores wrong data.' },
        { text: 'Crash, so the user learns the value was wrong', explanation: 'A crash is an error the user cannot act on. Return a clear message and log the details.' },
      ],
      answer: 1,
    },
    {
      question: 'The study assistant shows the model\'s reply on the page. Which handling is correct?',
      options: [
        { text: 'Trust it, because your own service produced the reply', explanation: 'The reply can contain text shaped by the learner or by notes, so it is not trusted.' },
        { text: 'Trust it if the system prompt told the model to be safe', explanation: 'A prompt is a request, not a guarantee, so it cannot make the reply trusted.' },
        { text: 'Run it as code whenever it looks like a command', explanation: 'Running model output lets any text in the notes control your program.' },
        { text: 'Show it as plain text, and never use it to build a command without checks', explanation: 'Treating the reply as untrusted data keeps its content from acting as instructions.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'An attack surface is every place outside data enters your app, and each entry point needs its own checks on the server, with data kept separate from commands.',
  resources: [
    { title: 'OWASP Top 10', provider: 'OWASP Foundation', description: 'The most common categories of web application security risk, updated every few years.', url: 'https://owasp.org/www-project-top-ten/' },
    { title: 'SQL Injection Prevention Cheat Sheet', provider: 'OWASP Cheat Sheet Series', description: 'Short, practical guidance on parameterized queries and related defenses.', url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html' },
  ],
  underTheHood: {
    heading: 'Why placeholders stop injection',
    paragraphs: [
      "When your program runs a query, the database first reads the SQL text and builds a plan for it. Only after that does it fill in the values. A placeholder is a promise that the value will be filled in later and treated as a single piece of data, so its characters never become part of the command.",
      "With the f-string version, the database receives one finished string. It cannot tell which quotes you wrote and which came from a learner, so the attacker's quotes look just like yours. The parameterized version sends the command and the values separately, so the database knows exactly which part is data.",
      "This idea is older than the web. Any system that builds a command by joining text has the same weakness, including shell commands, LDAP filters and HTML pages. The rule that protects all of them is the same: keep data separate from instructions, and use each system's own mechanism for doing so.",
    ],
  },
}

export default lesson
