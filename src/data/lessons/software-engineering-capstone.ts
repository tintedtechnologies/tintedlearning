import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { app, config, db, dockerfile, dockerignore, envExample, gitignore, requirements, testApp, workflow } from './study-tracker'

const readme = code`
  # Study Tracker

  A small API that records study sessions and reports total minutes per subject.
  Built with FastAPI, SQLite, pytest and Docker.

  ## Run it on your computer
      python3 -m venv .venv
      source .venv/bin/activate        # Windows: .venv\Scripts\Activate.ps1
      python -m pip install -r requirements.txt
      cp .env.example .env
      python -m uvicorn app:app --reload
  Then open http://127.0.0.1:8000/docs

  ## Run the tests
      python -m pytest

  ## Run with Docker
      docker build -t study-tracker .
      docker run --rm -p 8000:8000 -v study-data:/data -e DATABASE_PATH=/data/study.db study-tracker

  ## Example requests
      curl -X POST http://127.0.0.1:8000/sessions -H "Content-Type: application/json" -d '{"subject": "algebra", "minutes": 40, "studied_on": "2026-03-02"}'
      curl http://127.0.0.1:8000/totals

  ## Settings
  See .env.example. DATABASE_PATH sets where data is saved, LOG_LEVEL sets how much is logged.

  ## What I would improve next
  - Edit and delete endpoints for sessions
  - Weekly totals, not just all-time totals
`

const lesson: StructuredLesson = {
  goals: [
    'Combine every lesson in this section into one working app',
    'Write a README that lets a stranger run your app',
    'Present the finished project as a portfolio piece',
  ],
  bigIdea: "The capstone turns ten lessons into one finished project: Study Tracker, tested, logged, containerized and documented, in a clean GitHub repository. Finished means someone who has never seen it can clone it, follow the README and have it running in minutes. That is also exactly what makes it worth showing to an employer.",
  whyItMatters: "A hiring manager opens two portfolio links. The first is a folder of half-working scripts with no instructions. The second has a one-line description, a README with copy-and-paste setup, passing tests shown by a green CI badge, and a short list of what the author would improve next. The second person gets the interview, because they have shown they can finish something.",
  goalSections: [
    {
      heading: 'The finished app, file by file',
      paragraphs: [
        "Every file in Study Tracker came from one lesson, and each has one job. Together they make a small but complete service: an API, a database, settings, tests, CI, logging and a container.",
        "Check the repository against this list. Anything else, such as `study.db`, `.env` or `.venv`, should be ignored by Git and missing from GitHub.",
        "AI Engineering and Cloud Engineering both start from this exact repository, so take the time to get it clean now.",
      ],
      example: {
        language: 'text',
        code: code`
          study-tracker/
            app.py                      endpoints, validation, logging   (Build an API, Logging)
            config.py                   settings from the environment    (Configuration and Secrets)
            db.py                       all SQL, using SQLite             (Databases and SQL)
            test_app.py                 endpoint tests                    (Testing a Whole App)
            requirements.txt            packages to install               (Build an API onward)
            .env.example                setting names, placeholder values (Configuration and Secrets)
            .gitignore, .dockerignore   what Git and Docker must skip     (Git, Docker)
            Dockerfile                  how to build the image            (Docker)
            .github/workflows/tests.yml run tests on every push           (Testing a Whole App)
            README.md                   how a stranger runs it            (this lesson)
        `,
      },
    },
    {
      heading: 'A README a stranger can follow',
      paragraphs: [
        "The README, short for read me, is the front page of your repository. GitHub shows it below the file list. Write it for someone who has never seen your project and has ten minutes.",
        "Answer, in order: what it does in one or two sentences, how to run it, how to run the tests, how to use it with an example request, which settings exist, and what you would improve next. Commands must be copy-and-paste ready, with the Windows difference noted where there is one.",
        "Then prove it: clone your repository into a new folder and follow your own README word for word. Every place you get stuck is a line to fix.",
      ],
      example: { language: 'text', filename: 'README.md', code: readme },
    },
    {
      heading: 'Presenting it as a portfolio piece',
      paragraphs: [
        "On GitHub, add a one-line description and topics such as `fastapi`, `sqlite` and `docker` in the repository's About box, and pin the repository to your profile. A CI badge in the README shows at a glance that the tests pass.",
        "Be ready to talk about it for two minutes: what it does, one decision you made and why, one bug you found and how, and what you would do next. Honest trade-offs impress more than claiming it is perfect.",
        "Your commit history is part of the presentation. Small commits with clear messages, merged through pull requests, show how you work. If you later apply for jobs, link the repository directly from your resume, next to a one-line summary of what you built.",
      ],
      example: {
        language: 'text',
        code: code`
          Two-minute talk outline
          1. What:      "Study Tracker is an API that records study sessions
                         and totals minutes per subject."
          2. Decision:  "I read every setting from the environment, so the same
                         Docker image runs on my laptop and in the cloud."
          3. Bug:       "Logs showed 'Algebra' and 'algebra ' saved separately.
                         I now clean subjects before saving, with a test."
          4. Next:      "Weekly totals, and edit and delete endpoints."
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'The fresh-clone check',
    intro: "This is the final test of a finished project. Clone your own repository into a new folder, as a stranger would, and follow the README exactly. Replace `YOUR-USERNAME` with your GitHub username. Run each command in order.",
    example: {
      language: 'bash',
      code: code`
        git clone https://github.com/YOUR-USERNAME/study-tracker.git study-tracker-check
        cd study-tracker-check
        python3 -m venv .venv
        source .venv/bin/activate
        python -m pip install -r requirements.txt
        python -m pytest
        cp .env.example .env
        git status --short
        docker build -t study-tracker .
        docker run --rm -p 8000:8000 study-tracker
      `,
    },
    steps: [
      { code: 'git clone ... study-tracker-check', explanation: "Downloads a brand-new copy from GitHub into a different folder. Nothing from your working folder, such as `.env` or `.venv`, comes along." },
      { code: 'python3 -m venv .venv\nsource .venv/bin/activate', explanation: "A clean environment with no packages at all. On Windows, activate with `.venv\\Scripts\\Activate.ps1`." },
      { code: 'python -m pip install -r requirements.txt', explanation: "If a package is missing from `requirements.txt`, this is where you find out, usually as a `ModuleNotFoundError` in the next step." },
      { code: 'python -m pytest', explanation: "The tests must pass on a clean install, just as they do in CI. Three or more passing tests is the goal." },
      { code: 'cp .env.example .env\ngit status --short', explanation: "Creates local settings from the example. `git status --short` should print nothing: `.env` is ignored, and there is nothing else uncommitted." },
      { code: 'docker build -t study-tracker .\ndocker run --rm -p 8000:8000 study-tracker', explanation: "Builds and runs the image from the clean copy. Open `http://127.0.0.1:8000/docs` and save a session. If all of this worked, your project is finished." },
    ],
  },
  tryIt: {
    instructions: [
      'Work through the build below, using the files from earlier lessons. The full final versions are listed in the guide.',
      'Do the fresh-clone check above and fix every step where you got stuck.',
      'Tick every item in the checklist at the end of the guide before you call it finished.',
    ],
    project: {
      goal: 'Ship a finished Study Tracker on GitHub: clean commits, configuration, SQLite, tests passing in CI, logging, a Dockerfile and a README that a stranger can follow.',
      prerequisites: ['All ten earlier Software Engineering lessons.', 'Python 3.12 or newer, Git, a GitHub account and Docker Desktop.'],
      setup: ['Start from your `study-tracker` repository, or create a new one with `git init -b main`.', 'Create and activate `.venv`, then run `python -m pip install -r requirements.txt`.'],
      files: [
        { path: 'app.py', purpose: 'Endpoints, validation with Pydantic, logging.' },
        { path: 'config.py', purpose: 'DATABASE_PATH and LOG_LEVEL from the environment.' },
        { path: 'db.py', purpose: 'Every SQL query, with parameterized queries and closed connections.' },
        { path: 'test_app.py', purpose: 'Endpoint tests against a temporary database.' },
        { path: '.github/workflows/tests.yml', purpose: 'Runs the tests on every push and pull request.' },
        { path: 'requirements.txt', purpose: 'fastapi, uvicorn, python-dotenv, pytest and httpx.' },
        { path: '.env.example', purpose: 'Every setting with a placeholder value.' },
        { path: '.gitignore and .dockerignore', purpose: 'Keep .venv, .env, study.db and caches out of Git and the image.' },
        { path: 'Dockerfile', purpose: 'Builds the image from python:3.12-slim.' },
        { path: 'README.md', purpose: 'What it does, setup, tests, Docker, example requests, settings, next steps.' },
      ],
      dependencies: ['python -m pip install fastapi uvicorn python-dotenv pytest httpx'],
      steps: [
        { title: 'Start clean', instructions: ['Make sure `.gitignore` contains `.venv/`, `.env`, `study.db` and `__pycache__/`.', 'Run `git status` and confirm none of those files are listed.'], code: gitignore, checkpoint: '`git status` lists only files you mean to commit.' },
        { title: 'The core app', instructions: ['Create `config.py`, `db.py` and `app.py` as below, on a branch.', 'Run the server and save, list and total sessions in `/docs`.'], code: `# config.py\n${config}\n\n# db.py\n${db}\n\n# app.py\n${app}`, checkpoint: 'Sessions survive a server restart, and `/totals` adds them up per subject.' },
        { title: 'Tests and CI', instructions: ['Add `test_app.py` and `.github/workflows/tests.yml`.', 'Push and open a pull request. Merge only when the check is green.'], code: `# test_app.py\n${testApp}\n\n# .github/workflows/tests.yml\n${workflow}`, commands: ['python -m pytest'], checkpoint: 'Tests pass locally and the pull request shows a green check.' },
        { title: 'Settings and requirements', instructions: ['Add `.env.example` and copy it to `.env`.', 'Make sure `requirements.txt` lists every package the app and tests import.'], code: `# .env.example\n${envExample}\n\n# requirements.txt\n${requirements}`, checkpoint: '`.env` is ignored, and `.env.example` contains only placeholders.' },
        { title: 'Docker', instructions: ['Add the `Dockerfile` and `.dockerignore`.', 'Build the image and run it with a volume for the database.'], code: `# Dockerfile\n${dockerfile}\n\n# .dockerignore\n${dockerignore}`, commands: ['docker build -t study-tracker .', 'docker run --rm -p 8000:8000 -v study-data:/data -e DATABASE_PATH=/data/study.db study-tracker'], checkpoint: 'The app answers at http://127.0.0.1:8000/docs from inside the container, and saved sessions survive a restart.' },
        { title: 'README and fresh-clone check', instructions: ['Write `README.md` using the outline in this lesson.', 'Clone the repository into a new folder and follow the README exactly. Fix anything that fails.'], code: readme, checkpoint: 'A clean clone installs, passes its tests and runs in Docker by following the README alone.' },
      ],
      verification: [
        '`git status` is clean, and `.venv`, `.env` and `study.db` are not on GitHub.',
        'Tests pass on your computer and in GitHub Actions.',
        '`docker run` works and the app is reachable in the browser.',
        'No secrets anywhere in the repository or its history. `.env.example` has placeholders only.',
        'The README setup works on a fresh clone, and lists example requests and what you would improve next.',
      ],
      nextSteps: [
        'AI Engineering adds a study assistant to this repository.',
        'Cloud Engineering deploys this same Docker image to Azure, AWS or Google Cloud.',
      ],
    },
  },
  mistakes: [
    { mistake: 'Writing README steps from memory without testing them.', fix: 'Follow your README on a fresh clone. Every step that fails there fails for every visitor.' },
    { mistake: 'Finishing with one giant commit called "final version".', fix: 'Keep committing small, clearly named changes through pull requests. The history is part of what reviewers read.' },
    { mistake: 'Leaving `.env` or `study.db` in the repository.', fix: 'Check GitHub\'s file list. If a secret was ever pushed, rotate it, as in the Configuration and Secrets lesson.' },
    { mistake: 'Leaving the CI check red because "it works locally".', fix: 'A red check is what a stranger would see. Read the log and fix it before calling the project finished.' },
  ],
  quiz: [
    {
      question: 'On a fresh clone, `python -m pytest` fails with `ModuleNotFoundError: No module named \'dotenv\'`, but it works in your usual folder. What is wrong?',
      options: [
        { text: 'The fresh clone is missing `.env`', explanation: 'A missing `.env` file is fine, because `config.py` has defaults. The error is about a missing package.' },
        { text: 'pytest does not work on clones', explanation: 'pytest works anywhere its dependencies are installed.' },
        { text: '`python-dotenv` is missing from `requirements.txt`, so the clean install skipped it', explanation: 'Your usual environment has it installed by hand. The fresh-clone check exposes exactly this gap.' },
        { text: 'The import should be `import python-dotenv`', explanation: 'The package is installed as `python-dotenv` but imported as `dotenv`. The import is correct.' },
      ],
      answer: 2,
    },
    {
      question: 'Which belongs in Study Tracker\'s README?',
      options: [
        { text: 'Copy-and-paste setup commands, how to run the tests and an example request', explanation: 'These let a stranger run and try the project without guessing.' },
        { text: 'Your real `.env` values, so setup is quicker', explanation: 'Real values are secrets. The README should point to `.env.example`.' },
        { text: 'The full contents of `app.py`', explanation: 'The code is already in the repository. The README explains how to run and use it.' },
        { text: 'Nothing, since good code explains itself', explanation: 'Code explains how it works, not how to install it, run it or what it is for.' },
      ],
      answer: 0,
    },
    {
      question: 'During the fresh-clone check, `git status --short` prints `?? .env` after you copy `.env.example` to `.env`. What does that mean?',
      options: [
        { text: 'Everything is fine, because `??` means ignored', explanation: '`??` means untracked: Git sees the file and would add it with `git add .`. Ignored files are not listed at all.' },
        { text: 'The copy failed', explanation: 'The file exists, which is why Git lists it.' },
        { text: '`.env` was already committed', explanation: 'A committed file that changed would show as ` M .env`, not `??`.' },
        { text: '`.env` is not in `.gitignore`, so it could be committed by accident', explanation: 'Add `.env` to `.gitignore`, then check again. The status should print nothing.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'A project is finished when a stranger can clone it, follow the README, see the tests pass and run it in Docker, with no secrets anywhere in the repository.',
  resources: [
    { title: 'About READMEs', provider: 'GitHub Docs', description: 'What GitHub shows from your README and how to write a good one.', url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes' },
    { title: 'Adding a workflow status badge', provider: 'GitHub Docs', description: 'Show your passing tests at the top of your README.', url: 'https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/monitoring-workflows/adding-a-workflow-status-badge' },
  ],
  underTheHood: {
    heading: 'Pinning versions for repeatable installs',
    paragraphs: [
      "Study Tracker's `requirements.txt` lists package names only, so every install fetches the newest versions. That is convenient while learning, but a new release of a package could change behavior, and your tests might fail one day without any change to your code.",
      "Pinning fixes this. Inside your working environment, run `python -m pip freeze > requirements.txt`. The file now lists every installed package with its exact version, written `name==version`, including packages your packages depend on. Every fresh install, CI run and Docker build then gets exactly what you tested.",
      "The trade-off is that pinned versions do not receive bug and security fixes until you update them. Teams handle this by updating on purpose, every few weeks, then running the tests before committing the new pins. Tools such as GitHub's Dependabot can open those update pull requests for you.",
    ],
  },
}

export default lesson
