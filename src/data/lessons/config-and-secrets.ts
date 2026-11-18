import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { config, envExample } from './study-tracker'

const showConfig = code`
  import os

  database_path = os.environ.get("DATABASE_PATH", "study.db")
  log_level = os.environ.get("LOG_LEVEL", "INFO")
  print(database_path, log_level)
`

const lesson: StructuredLesson = {
  goals: [
    'Read settings from environment variables, with sensible defaults',
    'Use a `.env` file on your computer and keep it out of Git',
    'Respond correctly when a secret is accidentally committed',
  ],
  bigIdea: "Settings that change between computers, such as where the database lives or how much to log, should not be written into your code. Neither should secrets, such as passwords and API keys. Both belong in environment variables: named values your program reads when it starts, so the same code runs anywhere and secrets never enter Git.",
  whyItMatters: "A developer hard-codes an API key into Study Tracker to test a feature quickly, commits it and pushes to a public GitHub repository. Automated bots scan GitHub for keys around the clock, and within minutes someone is running up charges on that account. Keeping secrets out of code from the very first commit is the only reliable protection.",
  goalSections: [
    {
      heading: 'Settings from environment variables',
      paragraphs: [
        "An environment variable is a name and a value that the terminal hands to every program it starts. Python reads them with `os.environ.get(\"NAME\", default)`. The default is used when the variable is not set, so the app still works with no setup.",
        "To set one for a single command on macOS or Linux, write it in front: `LOG_LEVEL=DEBUG python show_config.py`. In PowerShell, run `$env:LOG_LEVEL = \"DEBUG\"` first, then the command.",
        "Environment variables are always text. Convert them yourself when you need a number, such as `int(os.environ.get(\"PORT\", \"8000\"))`.",
      ],
      example: {
        language: 'bash',
        runnable: true,
        files: { 'show_config.py': showConfig },
        code: code`
          cat show_config.py
          python show_config.py
          LOG_LEVEL=DEBUG python show_config.py
        `,
        output: `${showConfig}\nstudy.db INFO\nstudy.db DEBUG`,
      },
    },
    {
      heading: 'A .env file that stays out of Git',
      paragraphs: [
        "Typing variables before every command gets tedious, so most projects keep them in a file called `.env`, one `NAME=value` per line. The `python-dotenv` package reads that file when your app starts. Install it with `python -m pip install python-dotenv` and add it to `requirements.txt`.",
        "`.env` holds your real values, so it is listed in `.gitignore` and never committed. Instead, commit a file called `.env.example` with the same names and obviously fake values. A new teammate copies it to `.env` and fills in their own.",
        "Values already set in the terminal win over the file, which is useful later when Docker and cloud platforms provide settings their own way.",
      ],
      example: {
        language: 'bash',
        runnable: true,
        files: { '.env.example': envExample, 'config.py': config },
        code: code`
          cat .env.example
          cp .env.example .env
          python -c "import config; print(config.DATABASE_PATH, config.LOG_LEVEL)"
        `,
        output: `${envExample}\nstudy.db INFO`,
      },
    },
    {
      heading: 'When a secret is committed by mistake',
      paragraphs: [
        "Git keeps every commit forever. If you commit `.env` and then delete it in the next commit, the secret is still in the history, and anyone with a copy of the repository can read the old version with one command.",
        "So the fix is not deleting the file. Treat the secret as stolen: go to the service that issued it, revoke the old key and create a new one. This is called rotating the key. Then stop tracking the file and add it to `.gitignore`.",
        "Rewriting history to remove the file is possible, but copies may already exist on GitHub and on other people's computers. Rotating comes first, every time. GitHub also scans public repositories for known key formats and may alert you or the provider, but do not wait for that alert.",
      ],
      example: {
        language: 'bash',
        runnable: true,
        code: code`
          git init -b main --quiet
          echo "AI_API_KEY=your-key-here" > .env
          git add .env
          git commit -m "Add settings" --quiet
          git rm --cached .env --quiet
          echo ".env" > .gitignore
          git add .gitignore
          git commit -m "Stop tracking .env" --quiet
          git show HEAD~1:.env
        `,
        output: 'AI_API_KEY=your-key-here',
      },
    },
  ],
  seeItInAction: {
    title: 'Study Tracker\'s config.py',
    intro: "Every setting Study Tracker needs lives in one small file, `config.py`. Other files import it instead of reading the environment themselves. The next lessons use both settings.",
    example: { language: 'python', filename: 'config.py', code: config },
    steps: [
      { code: 'from dotenv import load_dotenv', explanation: "Imports the helper from the `python-dotenv` package. Note the import name, `dotenv`, differs from the package name you install." },
      { code: 'load_dotenv()', explanation: "Reads `.env` from the folder, if there is one, and adds its values to the environment. Variables that are already set are left alone." },
      { code: 'DATABASE_PATH = os.environ.get("DATABASE_PATH", "study.db")', explanation: "Where the database file lives. The default suits your own computer. Tests will point it at a temporary file and Docker at a folder that survives restarts." },
      { code: 'LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")', explanation: "How much the app should log, used in the Logging lesson. Names are written in capitals because they are constants: set once at start-up and never changed." },
      { code: '.env.example (committed) and .env (ignored)', explanation: "`.env.example` documents every setting with placeholder values, including `AI_API_KEY=your-key-here` for AI Engineering later. Your real `.env` sits next to it and never leaves your computer." },
    ],
  },
  tryIt: {
    instructions: [
      'Run `python -m pip install python-dotenv`, add `python-dotenv` to `requirements.txt`, and create `config.py` as shown.',
      'Create `.env.example` with the values from this lesson, commit it, then copy it to `.env`. Check that `git status` does not list `.env`.',
      'Search your code for any other hard-coded setting, such as a file name or a limit, and move it into `config.py` with a default.',
      'Run `python -c "import config; print(config.LOG_LEVEL)"`, then change `LOG_LEVEL` in `.env` to `DEBUG` and run it again.',
    ],
  },
  mistakes: [
    { mistake: 'Hard-coding an API key or password in the code "just for now".', fix: 'Put it in `.env` from the start and read it with `os.environ.get`. "Just for now" code gets committed.' },
    { mistake: 'Committing `.env`.', fix: 'Add `.env` to `.gitignore` before creating the file, and commit `.env.example` with placeholder values instead.' },
    { mistake: 'Deleting a committed secret in a new commit and thinking it is gone.', fix: 'The old commit still contains it. Revoke the key and create a new one, then stop tracking the file.' },
    { mistake: 'Printing settings at start-up, including secrets.', fix: 'Print or log only non-secret settings. If you must confirm a key loaded, show its last four characters at most.' },
  ],
  quiz: [
    {
      question: 'Using `show_config.py` from this lesson, what does this command print?',
      code: { language: 'bash', runnable: true, files: { 'show_config.py': showConfig }, code: 'LOG_LEVEL=WARNING python show_config.py' },
      options: [
        { text: 'study.db INFO', explanation: 'INFO is only the default. The variable set in front of the command takes its place.' },
        { text: 'study.db WARNING', explanation: '`LOG_LEVEL` is set for this command, so `os.environ.get` returns it. `DATABASE_PATH` is not set, so its default is used.' },
        { text: 'None WARNING', explanation: 'The default, `study.db`, is used when `DATABASE_PATH` is missing.' },
        { text: 'An error, because DATABASE_PATH is not set', explanation: '`.get` with a default never raises an error for a missing variable.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Yesterday you pushed `.env` containing a real API key. Today you deleted it, added it to `.gitignore` and pushed again. What should you do now?',
      options: [
        { text: 'Nothing, because the file is deleted', explanation: 'The file is gone from the latest commit, but yesterday\'s commit still contains the key.' },
        { text: 'Make the repository private', explanation: 'The key may already have been copied, and private repositories can become public later.' },
        { text: 'Revoke the key with the provider, create a new one and put the new one only in `.env`', explanation: 'Once a key has been pushed, assume someone has it. Rotating makes the leaked copy useless.' },
        { text: 'Add a commit message saying the key is no longer used', explanation: 'A message changes nothing. The key works until it is revoked.' },
      ],
      answer: 2,
    },
    {
      question: 'Which file should be committed to Git?',
      options: [
        { text: '`.env.example`, with placeholder values like `your-key-here`', explanation: 'It documents every setting the app needs without exposing any real value.' },
        { text: '`.env`, so teammates get the right settings', explanation: '`.env` holds real values, including secrets, so it must stay on your computer.' },
        { text: 'Both, so nothing is missing', explanation: 'Committing `.env` exposes your secrets to everyone with access to the repository.' },
        { text: 'Neither, so settings stay private', explanation: 'Without `.env.example`, new teammates have to guess which settings exist.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Read every setting and secret from the environment with a safe default, keep real values in an ignored `.env` next to a committed `.env.example`, and rotate any secret that reaches Git.',
  resources: [
    { title: 'The Twelve-Factor App: Config', provider: '12factor.net', description: 'The short, widely used argument for keeping configuration in the environment.', url: 'https://12factor.net/config' },
    { title: 'Removing sensitive data from a repository', provider: 'GitHub Docs', description: 'What to do after a secret is committed, starting with revoking it.', url: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository' },
  ],
  underTheHood: {
    heading: 'Where environment variables come from',
    paragraphs: [
      "Every running program has its own set of environment variables. When one program starts another, the new one receives a copy of its parent's set. That is how your terminal passes variables to Python, and why a variable you set in one terminal window does not exist in another.",
      "Writing `LOG_LEVEL=DEBUG python app.py` adds the variable to the copy given to that one command only. `export LOG_LEVEL=DEBUG` adds it to the terminal's own set, so every later command receives it until the window closes.",
      "Because the program only receives a copy, it cannot change its parent's variables. `load_dotenv()` therefore only affects your Python program. And because it skips names that are already set, values from the terminal, from Docker or from a cloud platform always win over the file, which keeps local defaults from overriding production settings.",
    ],
  },
}

export default lesson
