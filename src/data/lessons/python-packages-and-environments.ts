import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Import and use a module from Python\'s standard library',
    'Create and turn on a virtual environment for one project',
    'Record your project\'s packages in `requirements.txt` and reinstall them',
  ],
  bigIdea: "You rarely write everything yourself: Python comes with ready-made modules, and thousands more packages can be installed from the internet. A virtual environment is a private folder of packages for one project, so projects cannot break each other. A `requirements.txt` file lists what a project needs, so anyone can set it up the same way.",
  whyItMatters: "You finish a project that uses version 1 of a charting package. Months later, a new project needs version 2, so you upgrade, and your old project stops working. Or you send code to a friend and it fails with `ModuleNotFoundError` because they do not have the packages you have. Environments and requirement files prevent both problems.",
  goalSections: [
    {
      heading: 'Modules and packages',
      paragraphs: [
        "A module is a Python file full of useful functions that you can load into your program with `import`. Python ships with a large set of modules, called the standard library: `math`, `random`, `statistics`, `datetime`, `json` and many more.",
        "Write `import statistics` and then use `statistics.mean(...)`. Or bring in just one name with `from statistics import mean`. Imports go at the top of a file.",
        "A package is a bundle of modules, often made by other people and not included with Python. Popular ones include `requests` for talking to websites and `pandas` for tables of data. You install packages with a tool called `pip`, from a public collection called PyPI, the Python Package Index.",
      ],
      example: {
        language: 'python',
        code: code`
          import statistics
          from datetime import date

          temps = [18, 21, 19, 24, 22]
          print(statistics.mean(temps))
          print(statistics.median(temps))
          print(date(2026, 1, 1).strftime("%A"))
        `,
        output: '20.8\n21\nThursday',
      },
    },
    {
      heading: 'Virtual environments',
      paragraphs: [
        "If you install every package for every project into one shared Python, sooner or later two projects will need different versions of the same package, and one of them will break.",
        "A virtual environment fixes this. It is a folder inside your project, usually called `.venv`, that holds its own copy of Python's package area. You create it once with `python3 -m venv .venv` and turn it on with an activate command. While it is on, your terminal prompt shows `(.venv)` and `pip` installs packages into that folder only.",
        "Turn it off with `deactivate`. Each project gets its own environment, so upgrading a package in one cannot break another.",
      ],
      example: {
        language: 'bash',
        code: code`
          cd my-project
          python3 -m venv .venv

          # Turn it on (Mac or Linux)
          source .venv/bin/activate
          # Turn it on (Windows PowerShell)
          .venv\Scripts\Activate.ps1

          python -m pip install requests
          deactivate
        `,
      },
    },
    {
      heading: 'Recording dependencies in requirements.txt',
      paragraphs: [
        "The packages a project needs are called its dependencies. Write them in a plain text file called `requirements.txt`, one per line, usually with an exact version number after `==`, so everyone installs the same versions.",
        "To create the file from what is installed in your environment, run `python -m pip freeze > requirements.txt`. To set up the project on a new computer, create and activate a fresh environment, then run `python -m pip install -r requirements.txt`.",
        "Share `requirements.txt` with your code, but never the `.venv` folder. It is large, and only works on the computer that made it. Add `.venv` to your `.gitignore` file so it stays out of version control.",
      ],
      example: {
        language: 'text',
        code: code`
          # requirements.txt
          requests==2.32.3
          pandas==2.2.3
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Setting up a project on a new computer',
    intro: "You have cloned a friend's project that contains `app.py` and `requirements.txt`. These are the exact commands you would type in a terminal, on a Mac or Linux, to get it running.",
    example: {
      language: 'bash',
      code: code`
        cd weather-app
        python3 -m venv .venv
        source .venv/bin/activate
        python -m pip install -r requirements.txt
        python -m pip list
        python app.py
      `,
    },
    steps: [
      { code: 'cd weather-app', explanation: "Moves the terminal into the project folder. Every command after this works inside it." },
      { code: 'python3 -m venv .venv', explanation: "`-m venv` runs Python's built-in environment tool and creates a fresh, empty environment in a folder called `.venv`." },
      { code: 'source .venv/bin/activate', explanation: "Turns the environment on for this terminal window. The prompt now starts with `(.venv)`. On Windows, run `.venv\\Scripts\\Activate.ps1` instead." },
      { code: 'python -m pip install -r requirements.txt', explanation: "`-r` tells pip to read the list from the file and install every package at the version written there, into this environment only." },
      { code: 'python -m pip list', explanation: "Shows what is now installed, so you can confirm the packages and versions match the file." },
      { code: 'python app.py', explanation: "Runs the program using the environment's Python and packages. If you open a new terminal later, activate the environment again first." },
    ],
  },
  tryIt: {
    instructions: [
      'The playground has no terminal, so try the standard library part there. Open it and run the code.',
      'Add `import random` and print `random.choice(temps)`. Run it a few times and notice the result changes.',
      'On your own computer, make a folder, create a virtual environment in it, activate it and run `python -m pip list` to see that it starts almost empty.',
    ],
    playground: 'python',
    starterCode: code`
      import statistics
      from datetime import date

      temps = [18, 21, 19, 24, 22]
      print(statistics.mean(temps))
      print(statistics.median(temps))
      print(date(2026, 1, 1).strftime("%A"))
    `,
  },
  mistakes: [
    { mistake: 'Installing a package, then getting `ModuleNotFoundError` when you run your code.', fix: 'The package went into a different Python. Activate the project environment, and use `python -m pip` so pip and Python always match.' },
    { mistake: 'Forgetting to activate the environment in a new terminal window.', fix: 'Activation only lasts for one terminal window. Look for `(.venv)` in the prompt before installing or running.' },
    { mistake: 'Naming your own file after a module, such as `statistics.py` or `random.py`.', fix: 'Python imports your file instead of the real module, and you get strange errors. Give your files different names.' },
  ],
  quiz: [
    {
      question: 'You run `pip install requests`, then `python app.py` fails with `ModuleNotFoundError: No module named \'requests\'`. What is the most likely cause?',
      options: [
        { text: 'requests is not a real package', explanation: 'requests is one of the most widely used Python packages.' },
        { text: 'pip installed it for a different Python than the one running app.py', explanation: 'This is the usual cause. Activate the project environment and use `python -m pip install` so both use the same Python.' },
        { text: 'The import line needs a version number', explanation: 'Imports never include versions. Versions belong in `requirements.txt`.' },
        { text: 'You need to restart your computer after installing', explanation: 'Installed packages are available immediately to the Python they were installed into.' },
      ],
      answer: 1,
    },
    {
      question: 'Which files should you share with a teammate so they can run your project?',
      options: [
        { text: 'Your code and the `.venv` folder', explanation: 'The `.venv` folder is large and tied to your computer. Your teammate should build their own from the requirements file.' },
        { text: 'Only your code, since they can work out the packages from the imports', explanation: 'Imports do not say which versions you used, and guessing leads to different behavior.' },
        { text: 'Your code and `requirements.txt`', explanation: 'With the list of packages and versions, your teammate can create a matching environment in one command.' },
        { text: 'A screenshot of `pip list`', explanation: 'A screenshot cannot be installed from. `requirements.txt` holds the same list in a form pip can read.' },
      ],
      answer: 2,
    },
    {
      question: 'Two projects on your laptop need different versions of the same package. What should you do?',
      options: [
        { text: 'Give each project its own virtual environment', explanation: 'Each environment holds its own packages, so each project can have the version it needs.' },
        { text: 'Install the newest version, since newer is always compatible', explanation: 'New versions often change or remove features, which is exactly how old projects break.' },
        { text: 'Install both versions into the same environment', explanation: 'One environment can only hold one version of a package at a time. The second install replaces the first.' },
        { text: 'Copy the package code into both projects by hand', explanation: 'This is hard to update and easy to get wrong. Environments solve the problem cleanly.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Import ready-made modules instead of rewriting them, give every project its own virtual environment, and list its packages in `requirements.txt`.',
  resources: [
    { title: 'Installing packages', provider: 'Python Packaging Authority', description: 'The official guide to pip, PyPI and virtual environments.', url: 'https://packaging.python.org/en/latest/tutorials/installing-packages/' },
    { title: 'venv', provider: 'Python.org', description: 'Reference for creating and activating virtual environments on every system.', url: 'https://docs.python.org/3/library/venv.html' },
  ],
  underTheHood: {
    heading: 'How Python finds a module when you import it',
    paragraphs: [
      "When you write `import requests`, Python searches a list of folders, in order, and uses the first match. You can see the list by printing `sys.path` after `import sys`.",
      "The first entry is the folder of the script you are running. That is why a file of yours called `random.py` hides the real `random` module. Next come Python's standard library folders, and then a folder called `site-packages`, where pip puts installed packages.",
      "A virtual environment works by changing which `site-packages` folder is on that list. When you activate it, the `python` command points to a small copy inside `.venv`, and that copy uses `.venv`'s own `site-packages`. Nothing is moved or deleted, so turning the environment off simply puts the old search list back.",
    ],
  },
}

export default lesson
