import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Prevent SQL injection by using parameterized queries',
    'Prevent cross-site scripting by escaping untrusted output',
    'Check authorization on every request, not only on the page that shows a button',
  ],
  bigIdea: 'Most web vulnerabilities come from one mistake: text from a user is treated as code or as a trusted instruction. SQL injection, cross-site scripting, and broken access control each have a standard defense. Keep user data separate from commands, escape it for where it is shown, and check on the server whether this user may do this action.',
  whyItMatters: 'A small online shop builds its product search by joining the user\'s text straight into a database command. A customer types a specially crafted search, and the database returns every customer\'s email address. The fix is a single line, a parameterized query, and the team that learns it early never ships the bug.',
  goalSections: [
    {
      heading: 'SQL injection and parameterized queries',
      paragraphs: [
        'SQL injection happens when user input becomes part of the database command itself. If the program joins a search term into the text of a query, a term that contains a quote and extra commands can change what the database does. The database cannot tell your intended query from the injected one.',
        'A parameterized query sends the command and the values separately. The placeholder marks where a value goes, and the database treats the value as data, never as part of the command. Every mainstream database library supports this, and it should be used for every value that comes from outside the program.',
        'Parameters cannot replace table names or column names, which must come from a fixed list in your code. If a user chooses a sort column, check it against an allowed list before it goes into the query.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import sqlite3

          db = sqlite3.connect(":memory:")
          db.execute("CREATE TABLE users (email TEXT)")
          db.execute("INSERT INTO users VALUES ('ada@example.com')")

          search = "x' OR '1'='1"
          unsafe = "SELECT email FROM users WHERE email = '" + search + "'"
          print("unsafe query returns:", db.execute(unsafe).fetchall())

          safe = db.execute("SELECT email FROM users WHERE email = ?", (search,)).fetchall()
          print("parameterized query returns:", safe)
        `,
        output: "unsafe query returns: [('ada@example.com',)]\nparameterized query returns: []",
      },
    },
    {
      heading: 'Cross-site scripting and escaping output',
      paragraphs: [
        'Cross-site scripting happens when a page shows user text as if it were HTML. A comment that contains a script tag can run in every visitor\'s browser, and it can read their session or change what they see. The text was meant to be shown, and instead it was executed.',
        'Escape user text for the place it is shown. In HTML, that means converting characters such as angle brackets and quotes into their safe forms, so the browser displays them as text. Modern frameworks escape by default, so do not turn that off, and be careful with any feature that inserts raw HTML.',
        'Set a Content Security Policy where you can. It tells the browser which scripts are allowed to run, so an injected script from another place is blocked even when escaping was missed somewhere.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import html

          comment = '<script>alert("hi")</script>'
          print(html.escape(comment))
        `,
        output: '&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;',
      },
    },
    {
      heading: 'Checking access on every request',
      paragraphs: [
        'Broken access control means a user can do something they should not be allowed to do. A common example is a page that shows an edit button only to the owner, while the server accepts an edit request from anyone who knows the record number. Hiding a button is not a security control.',
        'Check permission on the server, for every request, against the data being changed. Ask whether this user owns this record or has a role that allows the action, and deny by default when the answer is unclear.',
        'Test it directly. Log in as one user and try to read or change another user\'s record by changing the ID in the request. If the server allows it, the check is missing.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Request: user 42 sends an edit for note 17.
          Server check: is note 17 owned by user 42, or does user 42 have the editor role for it?
          If yes: save. If no or unclear: refuse with "forbidden", and log the attempt.
          Test: log in as a second user, change the note number in the address, and confirm the refusal.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Refusing an action the user does not own',
    intro: 'The program below checks ownership on the server before it changes a record, and it escapes the text it stores for display. Run it, then have a different user try to edit the first record and predict the result.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        import html

        notes = {1: {"owner": "ada", "text": "<b>draft</b>"}}

        def edit_note(user, note_id, new_text):
            note = notes.get(note_id)
            if note is None:
                return "not found"
            if note["owner"] != user:
                return "forbidden"
            note["text"] = html.escape(new_text)
            return "saved"

        print(edit_note("ada", 1, "<i>final</i>"))
        print(edit_note("grace", 1, "hacked"))
        print(notes[1]["text"])
      `,
      output: 'saved\nforbidden\n&lt;i&gt;final&lt;/i&gt;',
    },
    steps: [
      { code: 'if note["owner"] != user:', explanation: 'The server checks ownership before any change. A hidden button would not stop this request.' },
      { code: 'return "forbidden"', explanation: 'The request is refused, and the stored note is not touched.' },
      { code: 'note["text"] = html.escape(new_text)', explanation: 'The new text is escaped before it is stored, so it displays as text wherever it appears.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the query in the SQL example so that it uses a parameter for a second value, and predict the result. Run it to check.',
      'Find a form on a site you control, or a practice site, and try to enter a script tag. Write down whether it is displayed as text or run.',
      'Write the owner check for an action that deletes a file, in three lines, and state what it returns for a user who is not the owner.',
    ],
  },
  mistakes: [
    { mistake: 'Building a query by joining user input into the command text.', fix: 'Use parameterized queries for every value that comes from outside the program.' },
    { mistake: 'Relying on a hidden button to stop an action.', fix: 'Check permission on the server for every request, and deny when unsure.' },
    { mistake: 'Turning off automatic escaping to display rich text quickly.', fix: 'Use a vetted sanitizer for rich text, and keep the default escaping everywhere else.' },
  ],
  quiz: [
    {
      question: 'What does a parameterized query protect against?',
      options: [
        { text: 'SQL injection, by keeping values separate from the command', explanation: 'Yes. The database treats parameter values as data, never as part of the command.' },
        { text: 'Slow pages', explanation: 'Parameterized queries are about safety. Speed is not their purpose.' },
        { text: 'Lost passwords', explanation: 'Password recovery is a different problem, handled by authentication design.' },
        { text: 'Broken images', explanation: 'Images are not related to query parameters.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the escaped text?',
      code: { language: 'python', runnable: true, code: code`
        import html
        print(html.escape("<b>"))
      ` },
      options: [
        { text: '<b>', explanation: 'That is the raw text. Escaping changes the angle brackets.' },
        { text: '&lt;b&gt;', explanation: 'Yes. The browser will show these characters as text, not as a bold tag.' },
        { text: 'b', explanation: 'The brackets are replaced, not removed.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why is hiding an edit button not enough to stop unauthorized edits?',
      options: [
        { text: 'Because anyone can send an edit request directly to the server, so the server must check', explanation: 'Yes. The server is the only place a check can be trusted.' },
        { text: 'Because buttons cannot be hidden in browsers', explanation: 'Hiding is possible. It just does not stop a direct request.' },
        { text: 'Because edits never need permission', explanation: 'Edits often need permission. The problem is where the check happens.' },
        { text: 'Because the database refuses all edits', explanation: 'The database does not know who the user is. The application must check.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Use parameterized queries, escape output for where it is shown, and check ownership and permission on the server for every request, because the browser cannot be trusted to enforce any of them.',
  resources: [
    { title: 'OWASP Top 10', provider: 'OWASP', description: 'The most common web application risks, including injection and broken access control.', url: 'https://owasp.org/www-project-top-ten/' },
    { title: 'SQL Injection Prevention Cheat Sheet', provider: 'OWASP', description: 'Practical guidance on parameterized queries and safe database access.', url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html' },
  ],
}

export default lesson
