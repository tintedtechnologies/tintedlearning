import type { GuidedProject } from '../types/curriculum'

/**
 * Step-by-step builds shown under "Try it yourself" for lessons whose build is not written inside the lesson file.
 * A lesson that defines tryIt.project uses that instead.
 */
export const lessonProjects: Record<string, GuidedProject> = {
  "python-developer-capstone": {
    "goal": "Build and publish a small Python service or CLI with a clear specification, package structure, tests, and evidence of one measured improvement.",
    "prerequisites": [
      "Complete the Python fundamentals, testing, algorithms, object-oriented design, iterators, and typing lessons.",
      "Use Git and a virtual environment.",
      "Choose a problem with local data or a mock external dependency."
    ],
    "setup": [
      "Create a repository with a src/ package, tests/, README.md, and pyproject.toml.",
      "Write a one-page specification with inputs, outputs, invariants, and failure cases.",
      "Create a virtual environment and install the project in editable mode."
    ],
    "files": [
      {
        "path": "src/app/",
        "purpose": "Domain logic, use cases, and adapters separated by responsibility."
      },
      {
        "path": "tests/",
        "purpose": "Unit and integration tests that record expected behavior."
      },
      {
        "path": "README.md",
        "purpose": "Setup, architecture, tradeoffs, limitations, and verification commands."
      }
    ],
    "dependencies": [
      "python -m pip install pytest",
      "python -m pip install -e ."
    ],
    "steps": [
      {
        "title": "Define the contract",
        "instructions": [
          "Write three normal cases and three failure cases.",
          "Choose a representation for the domain data.",
          "Record one constraint such as maximum input size or response time."
        ],
        "checkpoint": "A reader can tell what the program accepts, returns, and rejects before seeing the implementation."
      },
      {
        "title": "Implement the core",
        "instructions": [
          "Keep the core use case independent from files, HTTP, or database details.",
          "Use type hints on public functions.",
          "Raise specific errors for invalid input."
        ],
        "checkpoint": "The core behavior runs with an in-memory dependency and has no network requirement."
      },
      {
        "title": "Add evidence",
        "instructions": [
          "Write unit tests for invariants and edge cases.",
          "Add one integration test for the chosen adapter.",
          "Run the suite from a clean environment."
        ],
        "commands": [
          "python -m pytest"
        ],
        "checkpoint": "The test suite passes and includes at least one test for a failure path."
      },
      {
        "title": "Measure and review",
        "instructions": [
          "Measure a meaningful property before and after one change.",
          "Inspect a failure or awkward boundary and improve the design.",
          "Document the tradeoff and remaining limitation."
        ],
        "checkpoint": "README.md explains what changed, what evidence supports it, and what you would do next."
      }
    ],
    "verification": [
      "A clean checkout can install and run the project.",
      "Tests pass without relying on undeclared local files or secrets.",
      "The README includes architecture, tradeoffs, limitations, and verification commands.",
      "The repository contains one documented improvement based on evidence."
    ],
    "nextSteps": [
      "Publish the repository and request a code review.",
      "Add a small HTTP interface or persistent adapter.",
      "Reuse the project as the foundation for an AI-powered feature only after the non-AI behavior is reliable."
    ]
  },
  "planning-under-uncertainty": {
    "goal": "Create and run a two-week plan for a small technical initiative using customer evidence, risk-first milestones, decision points, and a written stakeholder update.",
    "prerequisites": [
      "Complete customer discovery and technical communication.",
      "Choose a real or simulated project with an ambiguous outcome.",
      "Have access to a teammate, user, or reviewer who can challenge your assumptions."
    ],
    "setup": [
      "Create a project brief with the desired outcome and known constraints.",
      "Create a risk register with at least five assumptions.",
      "Create a milestone table with evidence, owner, dependency, and decision for each step."
    ],
    "files": [
      {
        "path": "brief.md",
        "purpose": "Outcome, users, constraints, non-goals, and open questions."
      },
      {
        "path": "plan.md",
        "purpose": "Risk-first milestones, owners, evidence, and decision points."
      },
      {
        "path": "updates.md",
        "purpose": "Short stakeholder updates that record progress, uncertainty, and changes."
      }
    ],
    "dependencies": [
      "No software dependency is required."
    ],
    "steps": [
      {
        "title": "Frame the initiative",
        "instructions": [
          "Write the outcome in terms of user or business value.",
          "List non-goals and constraints.",
          "Separate facts, assumptions, and open questions."
        ],
        "checkpoint": "A reviewer can explain what success means without seeing a task list."
      },
      {
        "title": "Retire the riskiest assumption",
        "instructions": [
          "Rank assumptions by impact and uncertainty.",
          "Choose the smallest experiment or conversation that could challenge the top assumption.",
          "Define what evidence would change the plan."
        ],
        "checkpoint": "The first milestone tests a meaningful risk rather than starting with easy implementation work."
      },
      {
        "title": "Run the first milestone",
        "instructions": [
          "Collect the promised evidence.",
          "Record what happened, what surprised you, and what remains unknown.",
          "Update owners, dates, and dependencies based on evidence."
        ],
        "checkpoint": "The plan shows an explicit change or a reason to keep the original direction."
      },
      {
        "title": "Communicate the decision",
        "instructions": [
          "Write a one-page update with outcome, evidence, risk, decision, and next step.",
          "Send it to someone who was not in the work and ask what they think happens next.",
          "Revise for clarity based on their questions."
        ],
        "checkpoint": "The reader can identify the decision needed, the confidence level, and who owns the next action."
      }
    ],
    "verification": [
      "The plan includes at least one stopped, narrowed, or revised assumption.",
      "Every milestone produces evidence or a decision.",
      "The stakeholder update distinguishes facts, interpretations, and unknowns.",
      "The final plan records what changed and why."
    ],
    "nextSteps": [
      "Run the plan with a real collaborator.",
      "Turn the final decision into an ADR or project README.",
      "Practice estimating the next phase using the uncertainty you retired."
    ]
  },
  "professional-leadership-practicum": {
    "goal": "Lead a bounded initiative and publish a professional leadership portfolio showing discovery, stakeholder analysis, communication, planning, negotiation, outcomes, and reflection.",
    "prerequisites": [
      "Complete the customer discovery, communication, planning, feedback, negotiation, mentoring, and organizational systems lessons.",
      "Choose a real or simulated initiative that does not expose private or confidential information.",
      "Identify at least one reviewer or stakeholder who can challenge your assumptions."
    ],
    "setup": [
      "Create a repository or folder with brief.md, stakeholders.md, decision.md, plan.md, updates.md, and reflection.md.",
      "Write a clear outcome, non-goals, constraints, and decision owner.",
      "Schedule at least one discovery conversation or use a documented case study if a real conversation is not possible."
    ],
    "files": [
      {
        "path": "brief.md",
        "purpose": "Problem, outcome, users, evidence, constraints, and open questions."
      },
      {
        "path": "decision.md",
        "purpose": "Options, tradeoffs, recommendation, risks, and decision rights."
      },
      {
        "path": "plan.md",
        "purpose": "Milestones, owners, dependencies, learning checkpoints, and revisit triggers."
      },
      {
        "path": "reflection.md",
        "purpose": "Feedback, changed assumptions, impact, conflict, and next practice."
      }
    ],
    "dependencies": [
      "No software dependency is required."
    ],
    "steps": [
      {
        "title": "Discover and frame",
        "instructions": [
          "Conduct or analyze at least three stakeholder perspectives.",
          "Record direct evidence separately from interpretation.",
          "Write the problem, outcome, constraints, and non-goals."
        ],
        "checkpoint": "A reviewer can explain who is affected, what matters, and what remains unknown."
      },
      {
        "title": "Make and communicate a decision",
        "instructions": [
          "Map options and tradeoffs.",
          "Write a decision memo for a mixed audience.",
          "Ask a reviewer to challenge the recommendation and record the response."
        ],
        "checkpoint": "The decision record names the owner, risks, alternatives, and review trigger."
      },
      {
        "title": "Plan and negotiate",
        "instructions": [
          "Create milestones that produce evidence.",
          "Negotiate scope, timing, quality, and ownership explicitly.",
          "Send at least two concise stakeholder updates."
        ],
        "checkpoint": "The plan shows what changed after feedback and why."
      },
      {
        "title": "Reflect and present",
        "instructions": [
          "Collect outcome evidence and feedback.",
          "Write what you would repeat, stop, or change.",
          "Present the initiative in ten minutes with time for questions."
        ],
        "checkpoint": "Your portfolio demonstrates judgment and learning rather than only a polished final story."
      }
    ],
    "verification": [
      "The portfolio includes evidence from multiple perspectives.",
      "The decision memo and plan make tradeoffs and ownership explicit.",
      "At least one assumption or plan element changed because of feedback.",
      "The reflection names impact, limitations, and a concrete next practice."
    ],
    "nextSteps": [
      "Ask a senior practitioner to review the portfolio.",
      "Repeat the practicum with a larger stakeholder group.",
      "Turn one recurring organizational issue into a systems-improvement proposal."
    ]
  },
  "git-github": {
    "goal": "Create a small Python project, put it under Git, publish it to GitHub, and make a reviewable change through a branch and pull request. The result is a portfolio-ready repository with a README, ignored local files, and a clean history.",
    "prerequisites": [
      "A GitHub account.",
      "Git installed and available as git --version.",
      "Python 3.12 or newer.",
      "A terminal and a text editor or VS Code."
    ],
    "setup": [
      "Open a terminal.",
      "Create a new folder named git-practice and enter it.",
      "Create a virtual environment for the example project.",
      "Create the files listed below.",
      "Do not commit .venv, __pycache__, or local environment files."
    ],
    "files": [
      {
        "path": "README.md",
        "purpose": "Explain the project, setup, usage, and what you learned."
      },
      {
        "path": "hello.py",
        "purpose": "A small executable Python program."
      },
      {
        "path": "test_hello.py",
        "purpose": "A repeatable test for the program behavior."
      },
      {
        "path": ".gitignore",
        "purpose": "Keep local environments, caches, and secrets out of Git."
      }
    ],
    "platformNotes": [
      "macOS/Linux: activate the environment with source .venv/bin/activate.",
      "Windows PowerShell: activate with .venv\\Scripts\\Activate.ps1.",
      "If PowerShell blocks activation, run the project without activation using .venv\\Scripts\\python.exe, or follow Microsoft execution-policy guidance.",
      "GitHub now commonly uses browser authentication or a credential manager; do not paste a password into a Git prompt or commit a token."
    ],
    "dependencies": [
      "python -m pip install pytest"
    ],
    "steps": [
      {
        "title": "Create the project",
        "instructions": [
          "Run these commands from the directory where you keep projects.",
          "The final command prints the installed Git and Python versions so you can diagnose setup issues early."
        ],
        "commands": [
          "mkdir git-practice",
          "cd git-practice",
          "python -m venv .venv",
          "source .venv/bin/activate",
          "python --version",
          "git --version"
        ],
        "code": "def greeting(name):\n    return f\"Hello, {name}!\"\n\n\nif __name__ == \"__main__\":\n    print(greeting(\"engineer\"))",
        "checkpoint": "Create hello.py with the code above, then run python hello.py. It should print Hello, engineer!."
      },
      {
        "title": "Add a test and ignore local files",
        "instructions": [
          "Create test_hello.py with the test below.",
          "Create .gitignore with the listed patterns.",
          "Run the test before creating your first commit."
        ],
        "commands": [
          "python -m pip install pytest",
          "pytest -q"
        ],
        "code": "from hello import greeting\n\n\ndef test_greeting():\n    assert greeting(\"Ada\") == \"Hello, Ada!\"\n\n# .gitignore\n.venv/\n__pycache__/\n*.pyc\n.env\n.pytest_cache/",
        "checkpoint": "pytest should report one passing test. Run git status and confirm .venv is not listed as a file to commit."
      },
      {
        "title": "Create a useful README",
        "instructions": [
          "Create README.md.",
          "Document what the project does, how to set it up, how to run it, and how to run tests.",
          "A repository is not finished when the code works only on your machine."
        ],
        "commands": [
          "git status"
        ],
        "code": "# Git practice\n\nA tiny Python project for learning a reviewable Git workflow.\n\n## Setup\n\n```bash\npython -m venv .venv\nsource .venv/bin/activate\npython -m pip install pytest\n```\n\n## Run\n\n```bash\npython hello.py\npytest -q\n```",
        "checkpoint": "Read README.md as if you were a new contributor. It should contain enough information to reproduce the result."
      },
      {
        "title": "Make the first commit",
        "instructions": [
          "Initialize the repository.",
          "Inspect the staged file list before committing.",
          "Use a commit message that describes the behavior or change, not the file count."
        ],
        "commands": [
          "git init",
          "git add README.md hello.py test_hello.py .gitignore",
          "git diff --cached",
          "git commit -m \"Add tested greeting example\"",
          "git status"
        ],
        "checkpoint": "git status should say the working tree is clean. git log --oneline -1 should show your commit."
      },
      {
        "title": "Create a branch and review a change",
        "instructions": [
          "Create a branch for a meaningful change.",
          "Update the greeting to include a period or a new supported name, update the test, and run pytest.",
          "Commit and inspect the branch history before publishing."
        ],
        "commands": [
          "git switch -c improve-greeting",
          "pytest -q",
          "git add hello.py test_hello.py",
          "git commit -m \"Improve greeting behavior\"",
          "git log --oneline --decorate --graph --all"
        ],
        "checkpoint": "The branch should contain one focused commit and all tests should pass."
      },
      {
        "title": "Publish to GitHub",
        "instructions": [
          "Create an empty repository on GitHub named git-practice. Do not add a second README or .gitignore there.",
          "Copy the HTTPS repository URL from GitHub and replace REPOSITORY_URL below.",
          "Push the branch, open a pull request, describe the change and test result, then merge it after review."
        ],
        "commands": [
          "git remote add origin REPOSITORY_URL",
          "git remote -v",
          "git push -u origin main",
          "git push -u origin improve-greeting"
        ],
        "checkpoint": "GitHub should show the repository, README, main branch, and a pull request from improve-greeting. Keep the repository public only if it contains no secrets or private data."
      }
    ],
    "verification": [
      "git status reports a clean working tree.",
      "pytest -q passes from a fresh activated environment.",
      "git log shows focused commits with descriptive messages.",
      "GitHub shows a README, .gitignore, main branch, and reviewed pull request.",
      "The repository contains no API keys, passwords, .env files, virtual environments, or private data."
    ],
    "nextSteps": [
      "Add a GitHub Actions workflow that runs pytest on every pull request.",
      "Practice resolving a merge conflict in a disposable branch.",
      "Add an architecture decision record to the repository and link it from README.md."
    ]
  }
}
