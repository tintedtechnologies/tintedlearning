import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const sessionsData = code`
  sessions = [
      {"subject": "Algebra", "minutes": 40},
      {"subject": "python ", "minutes": 95},
      {"subject": "algebra", "minutes": 30},
      {"subject": "Python", "minutes": -10},
  ]
`

const messy = code`
  def f(d):
      x = {}
      t = 0
      for s in d:
          if s["minutes"] > 0:
              if s["subject"].strip().lower() in x:
                  x[s["subject"].strip().lower()] += s["minutes"]
              else:
                  x[s["subject"].strip().lower()] = s["minutes"]
              t += s["minutes"]
      x2 = sorted(x.items(), key=lambda i: i[1], reverse=True)
      r = "Study report\n"
      for k, v in x2:
          h = v // 60
          m = v % 60
          r += k + ": " + str(h) + "h " + str(m) + "m\n"
      r += "Total: " + str(t // 60) + "h " + str(t % 60) + "m"
      return r
`

const clean = code`
  def total_minutes_by_subject(sessions):
      totals = {}
      for session in sessions:
          if session["minutes"] <= 0:
              continue
          subject = session["subject"].strip().lower()
          totals[subject] = totals.get(subject, 0) + session["minutes"]
      return totals


  def format_duration(minutes):
      hours, mins = divmod(minutes, 60)
      return f"{hours}h {mins}m"


  def build_report(sessions):
      totals = total_minutes_by_subject(sessions)
      lines = ["Study report"]
      for subject, minutes in sorted(totals.items(), key=lambda item: item[1], reverse=True):
          lines.append(f"{subject}: {format_duration(minutes)}")
      lines.append(f"Total: {format_duration(sum(totals.values()))}")
      return "\n".join(lines)
`

const report = 'Study report\npython: 1h 35m\nalgebra: 1h 10m\nTotal: 2h 45m'

const lesson: StructuredLesson = {
  goals: [
    'Choose clear names for variables and functions',
    'Split a long function into small functions that each do one job',
    'Review a pull request and leave comments that help',
  ],
  bigIdea: "Code is read far more often than it is written: by teammates, by reviewers, and by you in six months. Readable code uses names that explain themselves and small functions that each do one job. It does exactly the same thing as messy code, but it is much easier to check, change and fix.",
  whyItMatters: "A bug report says Study Tracker's weekly report shows algebra twice. You open the function and find variables called `d`, `x`, `x2` and `t`, and one block of 20 lines doing everything. Finding the problem takes an hour of decoding before you can even start fixing. In well-named, well-split code, you would go straight to the one small function that groups subjects.",
  goalSections: [
    {
      heading: 'Names that explain themselves',
      paragraphs: [
        "A good name says what something is or does, so the reader does not have to work it out. Variables are nouns that describe their content: `sessions`, `total_minutes`, `subject`. Functions start with a verb that describes their action: `build_report`, `format_duration`.",
        "Avoid single letters (except a short loop counter), vague words like `data`, `info` or `temp`, and abbreviations only you understand. If a name needs a comment to explain it, choose a better name instead.",
        "Python's style guide, called PEP 8, says to write function and variable names in lower case with underscores, known as snake case. Following it makes your code look familiar to every other Python developer.",
      ],
      example: {
        language: 'python',
        code: code`
          # Before: what are d, x and t?
          def f(d, x):
              return sum(t["minutes"] for t in d if t["subject"] == x)

          # After: the names explain themselves
          def minutes_for_subject(sessions, subject):
              return sum(session["minutes"] for session in sessions if session["subject"] == subject)

          sessions = [{"subject": "algebra", "minutes": 40}, {"subject": "python", "minutes": 25}]
          print(f(sessions, "algebra"), minutes_for_subject(sessions, "algebra"))
        `,
        output: '40 40',
      },
    },
    {
      heading: 'One function, one job',
      paragraphs: [
        "A function that does several things at once is hard to read and hard to test. Here is a real-looking example: it cleans subject names, skips bad entries, adds up minutes, sorts subjects, converts minutes to hours and builds text, all in one block.",
        "To split it, list the jobs it does in plain words, then give each job its own function with a name that matches. If you can only describe a function with the word \"and\", it is doing more than one job.",
        "The messy version works. That is what makes it dangerous: nobody wants to touch it, so it gets messier every time someone does.",
      ],
      example: {
        language: 'python',
        code: `${messy}\n\n\n${sessionsData}\nprint(f(sessions))`,
        output: report,
      },
    },
    {
      heading: 'Reviewing a pull request',
      paragraphs: [
        "A code review is when someone reads a pull request before it is merged. The goal is better code and shared understanding, not finding someone to blame.",
        "Useful comments are specific, explain why, and suggest a next step. \"This is confusing\" helps nobody. \"Could this be called `format_duration`? I had to read the body to see it turns minutes into hours\" can be acted on in a minute. Mark small preferences as optional, so the author knows what really matters.",
        "Check the important things first: does it work, does it handle bad input, are there tests, and are the names clear? Spacing and quote style are best left to an automatic formatter.",
      ],
      example: {
        language: 'text',
        code: code`
          Review checklist for Study Tracker pull requests
          [ ] Does it do what the description says? Did I run it?
          [ ] What happens with bad input (empty, negative, missing)?
          [ ] Can I tell what each name means without reading the body?
          [ ] Does each function do one job?
          [ ] Do comments explain why, not repeat what the code says?

          Helpful comment:
            "Negative minutes are skipped silently here. Should we reject
             them with an error instead, so the user knows? (Not blocking.)"
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'The report function, rewritten as three small functions',
    intro: "Here is the messy report from above, rewritten. It prints exactly the same report, but every job now has its own clearly named function. Each step below explains one change.",
    example: {
      language: 'python',
      code: `${clean}\n\n\n${sessionsData}\nprint(build_report(sessions))`,
      output: report,
    },
    steps: [
      { code: 'def total_minutes_by_subject(sessions):', explanation: "The grouping job gets its own function. `f` and `d` become names that say what goes in and what comes out." },
      { code: 'if session["minutes"] <= 0:\n    continue', explanation: "Instead of wrapping everything in `if s[\"minutes\"] > 0:`, bad entries are skipped up front with `continue`. The main logic is no longer buried two levels deep." },
      { code: 'subject = session["subject"].strip().lower()', explanation: "The cleaning was written out three times in the old version. Now it happens once and gets a name." },
      { code: 'totals[subject] = totals.get(subject, 0) + session["minutes"]', explanation: "`.get(subject, 0)` replaces the whole `if ... in x: ... else:` block from before." },
      { code: 'def format_duration(minutes):', explanation: "Turning minutes into hours was written twice. Now it is one tiny function, easy to test on its own: `format_duration(125)` should give `2h 5m`." },
      { code: 'def build_report(sessions):', explanation: "The top function reads like a summary of the steps. It no longer keeps its own running total `t`, because the total can be worked out from `totals`." },
    ],
  },
  tryIt: {
    instructions: [
      'In your `study-tracker` repository, create a branch: `git switch -c add-report`.',
      'Add a file `report.py` containing the messy `f` function and the sample `sessions`, run it with `python report.py`, and commit it.',
      'Rewrite it into the three functions from this lesson. Run it again and check the output is exactly the same.',
      'Commit, push and open a pull request. Review your own pull request with the checklist above, and leave at least one comment on a line you could still improve.',
    ],
  },
  mistakes: [
    { mistake: 'Writing clever one-liners nobody can read.', fix: 'If a line takes more than a few seconds to understand, split it into named steps. Short is not the same as clear.' },
    { mistake: 'Writing comments that repeat the code, like `# add 1 to count`.', fix: 'Let names say what the code does. Use comments for why, such as `# skip negative minutes: old app versions saved them by mistake`.' },
    { mistake: 'Renaming everything in one huge pull request.', fix: 'Clean up one function per pull request, so reviewers can check that the behavior did not change.' },
    { mistake: 'Taking review comments personally.', fix: 'Comments are about the code, not about you. Reply to each one, ask questions when unsure, and say thank you for a catch.' },
  ],
  quiz: [
    {
      question: 'Which is the best name for a function that returns the total minutes studied for each subject?',
      options: [
        { text: '`process`', explanation: 'Too vague: almost every function processes something.' },
        { text: '`total_minutes_by_subject`', explanation: 'It says exactly what comes back, using snake case as PEP 8 recommends.' },
        { text: '`tmbs`', explanation: 'An abbreviation that only its author can decode.' },
        { text: '`TotalMinutesBySubject`', explanation: 'The words are right, but Python uses this capitalized style for class names, not functions.' },
      ],
      answer: 1,
    },
    {
      question: 'Using the `format_duration` function from this lesson, what does `print(format_duration(125))` print?',
      code: { language: 'python', code: code`
        def format_duration(minutes):
            hours, mins = divmod(minutes, 60)
            return f"{hours}h {mins}m"

        print(format_duration(125))
      ` },
      options: [
        { text: '2h 5m', explanation: '`divmod(125, 60)` gives 2 whole hours with 5 minutes left over.' },
        { text: '2.08h', explanation: 'The function never divides with `/`, so no decimal appears.' },
        { text: '125m', explanation: 'The function converts minutes into hours and minutes.' },
        { text: '2h 05m', explanation: 'The f-string puts in the number as it is, without padding it to two digits.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'You are reviewing a pull request and find a function called `calc` that is hard to follow. Which comment helps most?',
      options: [
        { text: '"This is messy."', explanation: 'True, perhaps, but the author learns nothing about what to change.' },
        { text: '"I would have written this completely differently."', explanation: 'This sounds like a preference and gives no concrete suggestion.' },
        { text: 'Approve it without comment to avoid upsetting the author', explanation: 'Silence lets confusing code into `main`, where it costs everyone time later.' },
        { text: '"Could this be called `total_minutes_by_subject`? I had to read every line to see what it returns."', explanation: 'Specific, explains why, and suggests a fix the author can make in a minute.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Give everything a name that explains it, give every function one job, and review code with specific, kind comments that explain why.',
  resources: [
    { title: 'PEP 8: Style Guide for Python Code', provider: 'Python.org', description: 'The official naming and layout conventions most Python projects follow.', url: 'https://peps.python.org/pep-0008/' },
    { title: 'How to do a code review', provider: 'Google Engineering Practices', description: 'A short, practical guide to what to look for and how to write comments.', url: 'https://google.github.io/eng-practices/review/reviewer/' },
  ],
  underTheHood: {
    heading: 'Letting tools handle style',
    paragraphs: [
      "Arguments about spaces, line length and quote marks waste review time. Most Python teams hand them to tools. A formatter rewrites your code into one consistent layout automatically. A linter reads your code and points out likely problems, such as a variable that is never used or an import that is missing.",
      "Ruff is a popular tool that does both. Run `ruff format .` to tidy every file, and `ruff check .` to list problems with the file and line of each. Many teams run these in their editor every time a file is saved, and again in continuous integration on every pull request.",
      "Once tools own the style, human reviewers can spend their attention on what tools cannot judge: whether the names make sense, whether the design fits the problem, and whether bad input is handled.",
    ],
  },
}

export default lesson
