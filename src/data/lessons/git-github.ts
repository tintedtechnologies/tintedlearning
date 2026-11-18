import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Save your work as commits with clear messages',
    'Use a branch to try a change without risking working code',
    'Push to GitHub and open a pull request',
  ],
  bigIdea: "Git keeps a history of your project as a series of saved snapshots, so you can always see what changed and go back. Branches let you try a change on the side while the main version stays safe. GitHub stores that history online, where other people can review your changes before they become part of the project.",
  whyItMatters: "You spend an evening improving Study Tracker, something breaks, and you cannot remember what the working version looked like. Without Git, you start guessing and undoing by hand. With Git, one command shows exactly which lines changed since your last snapshot, and another takes you back. On a team, the same history shows who changed what and why.",
  goalSections: [
    {
      heading: 'Saving snapshots with commits',
      paragraphs: [
        "A repository, or repo, is a project folder that Git is tracking. `git init` turns the current folder into one. Git then notices every change but saves nothing until you say so.",
        "Saving takes two steps. `git add` picks which changed files go into the next snapshot, called staging. `git commit -m \"message\"` saves the staged files as a snapshot, called a commit. `git status` shows what has changed and what is staged at any moment.",
        "A `.gitignore` file lists things Git should never track. For Study Tracker that is `.venv/` (large and rebuilt from `requirements.txt`), `.env` (secrets), `study.db` (your personal data) and `__pycache__/` (files Python generates). Write a message that says what the commit does, such as \"Add totals endpoint\", not \"update\".",
      ],
      example: {
        language: 'bash',
        runnable: true,
        code: code`
          git init -b main --quiet
          printf '.venv/\n.env\nstudy.db\n__pycache__/\n' > .gitignore
          echo 'print("Study Tracker is running")' > app.py
          git status --short
          git add .gitignore app.py
          git commit -m "Add app.py and .gitignore" --quiet
          git log --format=%s
        `,
        output: '?? .gitignore\n?? app.py\nAdd app.py and .gitignore',
      },
    },
    {
      heading: 'Trying changes safely on a branch',
      paragraphs: [
        "A branch is a separate line of commits. The main line is usually called `main`. `git switch -c add-welcome` creates a new branch and moves you onto it. Commits you make now go on that branch only.",
        "`git switch main` jumps back, and your files change on disk to match that branch. Nothing on `main` was touched, so if the experiment fails you simply delete the branch. If it works, you merge it into `main`.",
        "Make one branch per change, named after what it does, and keep `main` working at all times.",
      ],
      example: {
        language: 'bash',
        runnable: true,
        code: code`
          git init -b main --quiet
          echo 'print("Study Tracker is running")' > app.py
          git add app.py
          git commit -m "Add app.py" --quiet
          git switch -c add-welcome --quiet
          echo 'print("Welcome back!")' >> app.py
          git commit -am "Print a welcome message" --quiet
          git switch main --quiet
          cat app.py
        `,
        output: 'print("Study Tracker is running")',
      },
    },
    {
      heading: 'Pushing to GitHub and opening a pull request',
      paragraphs: [
        "GitHub is a website that hosts Git repositories. Create a free account, then create an empty repository named `study-tracker` (without a README, so the histories do not clash). Connect your folder to it with `git remote add origin` and the address GitHub shows you, then upload your commits with `git push`.",
        "GitHub does not accept your account password in the terminal. The simplest safe setup is the GitHub CLI: install it, run `gh auth login` and sign in through your browser. Never paste a password or token into a command, because commands are saved in your terminal history.",
        "After pushing a branch, GitHub offers a button to open a pull request: a page that shows your branch's changes and asks to merge them into `main`. Others can comment line by line. When it looks right, select Merge pull request.",
      ],
      example: {
        language: 'text',
        code: code`
          main:         A --------------- M
                         \             /
          add-welcome:    B ---- C ----
                          (pull request: review B and C, then merge)

          A = "Add app.py and .gitignore"   B, C = commits on the branch
          M = the merge, made on GitHub when the pull request is approved
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Putting Study Tracker on GitHub',
    intro: "These commands take the `study-tracker` folder from the last lesson onto GitHub and open a first pull request. Replace `YOUR-USERNAME` with your GitHub username. Everything before `git remote` works offline.",
    example: {
      language: 'bash',
      code: code`
        cd study-tracker
        git init -b main
        printf '.venv/\n.env\nstudy.db\n__pycache__/\n' > .gitignore
        git add .gitignore app.py
        git commit -m "Add app.py and .gitignore"
        git remote add origin https://github.com/YOUR-USERNAME/study-tracker.git
        git push -u origin main
        git switch -c add-welcome
        echo 'print("Welcome back!")' >> app.py
        git commit -am "Print a welcome message"
        git push -u origin add-welcome
      `,
    },
    steps: [
      { code: 'git init -b main', explanation: "Turns the folder into a repository whose first branch is called `main`." },
      { code: "printf '.venv/\\n.env\\nstudy.db\\n__pycache__/\\n' > .gitignore", explanation: "Writes the four ignore rules into `.gitignore`, one per line (`\\n` means new line). From now on `git status` will not even mention those files." },
      { code: 'git add .gitignore app.py\ngit commit -m "Add app.py and .gitignore"', explanation: "Stages exactly the two files you mean to save and makes the first commit. Naming files is safer than `git add .`, which adds everything." },
      { code: 'git remote add origin https://github.com/YOUR-USERNAME/study-tracker.git', explanation: "Gives the GitHub repository the short name `origin`, so you do not have to type the address again." },
      { code: 'git push -u origin main', explanation: "Uploads `main`. `-u` remembers the link, so later you can type just `git push`." },
      { code: 'git switch -c add-welcome ... git push -u origin add-welcome', explanation: "Makes a change on a new branch, commits it with `-am` (stage every tracked file that changed, then commit), and pushes the branch. GitHub then shows a Compare & pull request button." },
    ],
  },
  tryIt: {
    instructions: [
      'Put your `study-tracker` folder on GitHub using the commands above, with the four-line `.gitignore`.',
      'Add a `README.md` with one sentence about Study Tracker, on a new branch called `add-readme`.',
      'Push the branch, open a pull request on GitHub, read the changes it shows, and merge it.',
      'Back in the terminal, run `git switch main` and `git pull` so your computer has the merged version.',
    ],
  },
  mistakes: [
    { mistake: 'Committing `.venv` or `.env`.', fix: 'Create `.gitignore` before the first commit, and check `git status` before every `git add`.' },
    { mistake: 'Writing vague commit messages such as "update" or "fix".', fix: 'Say what the commit does: "Add totals endpoint", "Reject negative minutes".' },
    { mistake: 'Working directly on `main`.', fix: 'Start every change with `git switch -c branch-name`, so `main` always works.' },
    { mistake: 'Pasting a token or password into a terminal command.', fix: 'Sign in with `gh auth login` and the browser. Commands are stored in your shell history, where secrets can leak.' },
  ],
  quiz: [
    {
      question: 'You run `git status` and see `modified: app.py`. What do you run to include it in your next commit?',
      options: [
        { text: '`git commit -m "Update app"`', explanation: 'Commit saves only what is staged, and nothing is staged yet. Git would report that there is nothing to commit.' },
        { text: '`git push`', explanation: 'Push uploads commits that already exist. This change has not been committed yet.' },
        { text: '`git init`', explanation: 'That starts a new repository. You already have one.' },
        { text: '`git add app.py`', explanation: 'Staging the file puts the change into the next commit. Then run `git commit -m "..."`.' },
      ],
      answer: 3,
    },
    {
      question: 'Your `.gitignore` contains `.env` and is committed. You create a `.env` file and run `git status --short`. What do you see?',
      code: { language: 'bash', runnable: true, code: code`
        git init -b main --quiet
        echo '.env' > .gitignore
        git add .gitignore
        git commit -m "Ignore .env" --quiet
        echo 'LOG_LEVEL=INFO' > .env
        git status --short
      ` },
      options: [
        { text: '`?? .env`', explanation: 'That is how an untracked file appears. Ignored files are not listed at all.' },
        { text: '`A .env`', explanation: '`A` means staged. Nothing was added.' },
        { text: 'Nothing at all', explanation: 'Git skips files matched by `.gitignore`, so a clean status is exactly what you want here.' },
        { text: 'An error saying `.env` is ignored', explanation: 'Status does not complain. An error only appears if you try to `git add` an ignored file.' },
      ],
      answer: 2,
    },
    {
      question: 'Study Tracker works on `main`. You want to try reorganizing `app.py`, but it might not work out. What should you do first?',
      options: [
        { text: 'Copy the folder to `study-tracker-backup`', explanation: 'That works, but it creates a second project that Git does not connect to the first. A branch does the same job inside one history.' },
        { text: 'Create a branch with `git switch -c reorganize-app`', explanation: 'Your experiment gets its own line of commits. If it fails, switch back to `main`, which never changed.' },
        { text: 'Commit the changes to `main` and undo them later if needed', explanation: 'That leaves `main` broken while you experiment, and undoing is harder than never breaking it.' },
        { text: 'Delete the repository and start again', explanation: 'You would lose your history. Branches exist to make experiments safe.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Commit small changes with clear messages, make every change on its own branch, and merge it into `main` through a pull request on GitHub.',
  resources: [
    { title: 'Pro Git, chapters 2 and 3', provider: 'Git SCM', description: 'The free official book. Chapters 2 and 3 cover commits and branches in depth.', url: 'https://git-scm.com/book/en/v2' },
    { title: 'About pull requests', provider: 'GitHub Docs', description: 'How pull requests, reviews and merges work on GitHub.', url: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests' },
  ],
  underTheHood: {
    heading: 'What a commit and a branch really are',
    paragraphs: [
      "Each commit stores a full snapshot of every tracked file, plus the author, the date, the message and a pointer to the commit before it, called its parent. Git names each commit by a hash: a long code calculated from all of that content, such as `ec90c1f...`. Change anything and the hash changes, which is how Git notices tampering or corruption.",
      "Unchanged files are not copied again. Git stores each version of a file once and reuses it, so snapshots are cheap.",
      "A branch is just a small file holding one commit hash. Committing moves the branch forward to the new commit. `HEAD` is a pointer to the branch you are on. That is why creating a branch is instant, and why merging creates a commit with two parents, joining the two lines of history back together.",
    ],
  },
}

export default lesson
