import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { appWithDatabase, config, db } from './study-tracker'

const lesson: StructuredLesson = {
  goals: [
    'Create a table and insert, select, update and delete rows with SQL',
    'Filter, sort and group results',
    'Use parameterized queries from Python',
  ],
  bigIdea: "A database keeps data safe on disk and lets you ask questions of it quickly. SQL, short for Structured Query Language, is the language for those questions, such as \"total minutes per subject\". SQLite is a complete database stored in one file, built into Python, so Study Tracker can keep its sessions without installing anything.",
  whyItMatters: "Right now Study Tracker forgets every session when the server restarts, because they live in a Python list. Imagine a week of logged study vanishing after a laptop update. A database fixes that, and it also makes questions like \"how much did I study each subject in March?\" a single line of SQL instead of a page of loops.",
  goalSections: [
    {
      heading: 'Tables and the four basic commands',
      paragraphs: [
        "A database holds tables. A table is like a spreadsheet with fixed columns: Study Tracker's `sessions` table has `id`, `subject`, `minutes` and `studied_on`. Each row is one session. `CREATE TABLE` defines the columns and their types, such as `TEXT` and `INTEGER`. `NOT NULL` means the value is required.",
        "Four commands do almost everything. `INSERT` adds rows, `SELECT` reads them, `UPDATE` changes them and `DELETE` removes them. SQL keywords are usually written in capitals so they stand out from table and column names.",
        "`id INTEGER PRIMARY KEY AUTOINCREMENT` gives every row a unique number automatically, so you can point at exactly one row later. SQLite has no separate date type, so Study Tracker stores dates as text in the form `2026-03-02`, which also sorts correctly.",
      ],
      example: {
        language: 'python',
        code: code`
          import sqlite3

          conn = sqlite3.connect(":memory:")
          conn.execute("""
              CREATE TABLE sessions (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  subject TEXT NOT NULL,
                  minutes INTEGER NOT NULL,
                  studied_on TEXT NOT NULL
              )
          """)
          conn.execute("INSERT INTO sessions (subject, minutes, studied_on) VALUES ('algebra', 40, '2026-03-02')")
          conn.execute("INSERT INTO sessions (subject, minutes, studied_on) VALUES ('python', 25, '2026-03-02')")
          conn.execute("UPDATE sessions SET minutes = 45 WHERE id = 1")
          conn.execute("DELETE FROM sessions WHERE id = 2")
          print(conn.execute("SELECT id, subject, minutes FROM sessions").fetchall())
        `,
        output: "[(1, 'algebra', 45)]",
      },
    },
    {
      heading: 'Filtering, sorting and grouping',
      paragraphs: [
        "`WHERE` keeps only the rows that match a condition, such as `WHERE minutes >= 30`. `ORDER BY` sorts the results, with `DESC` for largest first.",
        "`GROUP BY` collects rows that share a value into one group, and a function such as `SUM`, `COUNT` or `AVG` summarizes each group. `SELECT subject, SUM(minutes) FROM sessions GROUP BY subject` gives one row per subject with its total.",
        "The database does this work for you, and it stays fast even with millions of rows. Fetching everything into Python and looping over it would get slower and slower.",
      ],
      example: {
        language: 'python',
        code: code`
          import sqlite3

          conn = sqlite3.connect(":memory:")
          conn.execute("CREATE TABLE sessions (subject TEXT, minutes INTEGER, studied_on TEXT)")
          conn.executemany(
              "INSERT INTO sessions VALUES (?, ?, ?)",
              [("algebra", 40, "2026-03-02"), ("python", 25, "2026-03-02"),
               ("algebra", 30, "2026-03-03"), ("python", 50, "2026-03-04")],
          )
          print(conn.execute("SELECT subject, minutes FROM sessions WHERE minutes >= 30 ORDER BY minutes DESC").fetchall())
          print(conn.execute("SELECT subject, SUM(minutes), COUNT(*) FROM sessions GROUP BY subject ORDER BY subject").fetchall())
        `,
        output: "[('python', 50), ('algebra', 40), ('algebra', 30)]\n[('algebra', 70, 2), ('python', 75, 2)]",
      },
    },
    {
      heading: 'Safe queries from Python',
      paragraphs: [
        "Never build SQL by pasting user input into a string, for example with an f-string. If someone types a value that contains SQL, the database runs it as part of your command. This attack is called SQL injection.",
        "Instead, write `?` where each value goes and pass the values separately as a tuple. The database treats them strictly as data, never as SQL. These are called parameterized queries.",
        "Writing commands changes nothing on disk until you call `conn.commit()`. And every connection you open should be closed with `conn.close()`, even when an error happens, which a `try` and `finally` block guarantees.",
      ],
      example: {
        language: 'python',
        code: code`
          import sqlite3

          conn = sqlite3.connect(":memory:")
          conn.execute("CREATE TABLE sessions (subject TEXT, minutes INTEGER)")
          conn.executemany("INSERT INTO sessions VALUES (?, ?)", [("algebra", 40), ("python", 25), ("algebra", 30)])

          subject = "x' OR '1'='1"
          unsafe = conn.execute(f"SELECT * FROM sessions WHERE subject = '{subject}'").fetchall()
          safe = conn.execute("SELECT * FROM sessions WHERE subject = ?", (subject,)).fetchall()
          print(len(unsafe), len(safe))
        `,
        output: '3 0',
      },
    },
  ],
  seeItInAction: {
    title: 'Saving sessions in study.db and totaling them',
    intro: "This script creates Study Tracker's real database file, `study.db`, adds three sessions and asks for the total minutes per subject. Save it as `explore_db.py` in your `study-tracker` folder and run it once.",
    example: {
      language: 'python',
      filename: 'explore_db.py',
      code: code`
        import sqlite3

        conn = sqlite3.connect("study.db")
        try:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    subject TEXT NOT NULL,
                    minutes INTEGER NOT NULL,
                    studied_on TEXT NOT NULL
                )
            """)
            new_sessions = [("algebra", 40, "2026-03-02"), ("python", 25, "2026-03-02"), ("algebra", 30, "2026-03-03")]
            conn.executemany("INSERT INTO sessions (subject, minutes, studied_on) VALUES (?, ?, ?)", new_sessions)
            conn.commit()
            rows = conn.execute("SELECT subject, SUM(minutes) FROM sessions GROUP BY subject ORDER BY subject").fetchall()
            print(rows)
        finally:
            conn.close()
      `,
      output: "[('algebra', 70), ('python', 25)]",
    },
    steps: [
      { code: 'conn = sqlite3.connect("study.db")', explanation: "Opens the database file, creating it if it does not exist yet. `study.db` is already in your `.gitignore`, because it holds your own data." },
      { code: 'CREATE TABLE IF NOT EXISTS sessions (...)', explanation: "Creates the table with Study Tracker's four columns. `IF NOT EXISTS` makes it safe to run again." },
      { code: 'conn.executemany("INSERT ... VALUES (?, ?, ?)", new_sessions)', explanation: "Inserts all three sessions with one parameterized query. Each tuple fills the three `?` marks in order." },
      { code: 'conn.commit()', explanation: "Saves the inserts to disk. Without it, closing the connection throws the new rows away." },
      { code: 'SELECT subject, SUM(minutes) FROM sessions GROUP BY subject ORDER BY subject', explanation: "Groups the rows by subject and adds up each group's minutes: algebra 40 plus 30 is 70, python 25." },
      { code: 'finally:\n    conn.close()', explanation: "Closes the connection whether the code succeeded or failed. Run the script a second time and the totals double, because the rows from the first run are still there. That is persistence." },
    ],
  },
  tryIt: {
    instructions: [
      'Create `db.py` below. It keeps all of Study Tracker\'s SQL in one place, reads the file path from `config.py`, and creates the table automatically.',
      'Replace `app.py` with the version below, which uses `db.py` instead of a list. It also adds `GET /totals`, done in SQL.',
      'Start the server, save a few sessions in `/docs`, stop the server, start it again and check that `GET /sessions` still returns them.',
      'Commit on a branch called `add-database` and open a pull request.',
    ],
    files: [
      { language: 'python', filename: 'db.py', code: db, files: { 'config.py': config } },
      { language: 'python', filename: 'app.py', code: appWithDatabase, files: { 'config.py': config, 'db.py': db } },
    ],
  },
  mistakes: [
    { mistake: 'Building SQL with f-strings or `+`.', fix: 'Always use `?` placeholders and pass values as a tuple, so input can never become SQL.' },
    { mistake: 'Forgetting `conn.commit()` after writing.', fix: 'Commit after every `INSERT`, `UPDATE` or `DELETE` you want to keep. Reads do not need it.' },
    { mistake: 'Running `UPDATE` or `DELETE` without `WHERE`.', fix: 'Without `WHERE`, the command changes every row in the table. Write the `WHERE` first, and test it with a `SELECT`.' },
    { mistake: 'Opening a connection and never closing it.', fix: 'Close every connection in a `finally` block, so it closes even when something fails.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        import sqlite3

        conn = sqlite3.connect(":memory:")
        conn.execute("CREATE TABLE sessions (subject TEXT, minutes INTEGER)")
        conn.executemany("INSERT INTO sessions VALUES (?, ?)", [("art", 20), ("art", 15), ("math", 30)])
        print(conn.execute("SELECT COUNT(*) FROM sessions WHERE minutes > 15").fetchone()[0])
      ` },
      options: [
        { text: '3', explanation: 'The 15-minute session does not pass `> 15`, so it is not counted.' },
        { text: '2', explanation: 'Only 20 and 30 are greater than 15, so two rows match.' },
        { text: '50', explanation: 'That would be `SUM(minutes)` of the matching rows. `COUNT(*)` counts rows.' },
        { text: '1', explanation: 'Both art sessions are separate rows. There is no `GROUP BY` here.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'You meant to delete one wrong session, but ran `DELETE FROM sessions` and pressed Enter. What happened?',
      options: [
        { text: 'Nothing, because SQL needs an `id` to delete', explanation: 'SQL does not require `WHERE`. Without it, the command applies to every row.' },
        { text: 'The newest session was deleted', explanation: 'SQL has no idea of "newest" unless you say so in `WHERE`.' },
        { text: 'SQLite asked you to confirm', explanation: 'Databases do not ask. They do exactly what the command says.' },
        { text: 'Every row in `sessions` was deleted', explanation: 'With no `WHERE`, `DELETE` removes all rows. Always write the `WHERE` part first.' },
      ],
      answer: 3,
    },
    {
      question: 'A function runs `INSERT INTO sessions ...` and then `conn.close()`. The next `SELECT` finds no new row. What is missing?',
      options: [
        { text: '`conn.commit()` before closing', explanation: 'Changes are only saved to the file when you commit. Closing without committing discards them.' },
        { text: 'A `GROUP BY` clause', explanation: '`GROUP BY` summarizes rows when reading. It has nothing to do with saving them.' },
        { text: 'A second `conn.close()`', explanation: 'Closing twice does not save anything. The commit is what writes to disk.' },
        { text: 'An `ORDER BY` on the `SELECT`', explanation: 'Sorting changes the order of results, not whether the row exists.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Store data in tables, ask questions with `SELECT`, `WHERE` and `GROUP BY`, and from Python always use `?` placeholders, commit your changes and close every connection.',
  resources: [
    { title: 'sqlite3: DB-API interface for SQLite', provider: 'Python.org', description: 'The official guide, including a tutorial and the placeholder rules.', url: 'https://docs.python.org/3/library/sqlite3.html' },
    { title: 'SQL tutorial', provider: 'SQLBolt', description: 'Free interactive lessons to practice SELECT, WHERE and GROUP BY in the browser.', url: 'https://sqlbolt.com/' },
  ],
  underTheHood: {
    heading: 'Transactions: all or nothing',
    paragraphs: [
      "Between your first change and `commit()`, SQLite holds your changes in an open transaction. Other connections cannot see them yet. When you commit, every change in the transaction is written at once. If the program crashes before the commit, or you call `conn.rollback()`, none of them are written.",
      "That all-or-nothing rule matters when several changes belong together. Moving 30 minutes from one subject to another takes an `UPDATE` on two rows. If the power fails between them, a transaction guarantees you never end up with only one of them saved.",
      "SQLite achieves this with a journal: before changing the database file, it records enough information to undo the change. After a crash, it uses the journal to restore the last committed state. That is why a single-file database can still be trusted with your data.",
    ],
  },
}

export default lesson
