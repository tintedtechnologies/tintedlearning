import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Install a Python 3 interpreter on macOS, Windows, or Linux, and confirm the version',
    'Install the Python extension in VS Code and select the interpreter it should use',
    'Create a hello.py file, run it from VS Code, and read the output',
  ],
  bigIdea: 'VS Code is the editor, the Python extension adds Python support to it, and the Python interpreter runs your code. You install the interpreter separately from VS Code, then point VS Code at it. Once all three work together, a single Run button runs your script.',
  whyItMatters: 'You install VS Code and click Run on a Python file, and nothing happens. The message in the output says Python was not found. The interpreter was never installed, or it is not on your path, so VS Code cannot start it. A short check of the version number tells you which of the three pieces is missing.',
  goalSections: [
    {
      heading: 'Installing Python on your system',
      paragraphs: [
        'On Windows, download Python from python.org and run the installer. On the first screen, tick "Add python.exe to PATH" before you click Install. The Microsoft Store also provides supported Python versions if you do not have administrator access.',
        'On macOS, the Python that comes with the system is not meant for your own work. Install Python with Homebrew by running `brew install python3` in Terminal, or use the installer from python.org. On Linux, Python 3 usually comes built in. Install pip and the venv module with your package manager so you can create virtual environments.',
        'Run a version command in a terminal to confirm the install. On macOS and Linux, use `python3 --version`. On Windows, use `py --version`, and `py -0` lists every version installed on the machine, with an asterisk on the default. You need Python 3.12 or newer for the lessons in this section.',
        'If the command reports "command not found," the install did not add Python to your path. On Windows, run the installer again and choose Modify, then tick the PATH option. On macOS, check that Homebrew finished without errors.',
        'Restart VS Code and any open terminal after installing. A terminal opened before the install does not know the new program, so it will still report that Python is missing.',
      ],
      figures: [],
      example: {
        language: 'bash',
        runnable: false,
        code: code`
          # macOS, with Homebrew installed
          brew install python3

          # Debian or Ubuntu Linux
          sudo apt update
          sudo apt install python3 python3-pip python3-venv

          # Fedora Linux
          sudo dnf install python3 python3-pip
        `,
      },
    },
    {
      heading: 'Installing the Python extension and choosing an interpreter',
      paragraphs: [
        'Open the Extensions view with Cmd+Shift+X on macOS or Ctrl+Shift+X on Windows and Linux. Search for "Python" and install the extension published by Microsoft. It adds code completion, running, and debugging. The Python Debugger extension installs with it automatically.',
        'Open the Command Palette and run "Python: Select Interpreter." VS Code lists every Python it can find. Choose the one whose version you just checked. The name in the status bar then shows that interpreter, so you always know which Python runs your code.',
      ],
      figures: [
        { src: '/lesson-images/python/interpreter-venv.png', alt: 'The Select Interpreter list in VS Code, showing several Python installations with one marked Recommended.', caption: 'Python: Select Interpreter lists the Python installations VS Code can find. Choose the version you checked in the terminal.', credit: { text: 'Visual Studio Code documentation, CC BY 3.0 US', url: 'https://code.visualstudio.com/docs/python/python-tutorial' } },
        { src: '/lesson-images/python/python-debugger-extension.png', alt: 'The VS Code Extensions view showing the Python Debugger extension installed.', caption: 'The Python extension installs the Python Debugger with it. You will use the debugger later in this section.', credit: { text: 'Visual Studio Code documentation, CC BY 3.0 US', url: 'https://code.visualstudio.com/docs/python/python-tutorial' } },
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Extensions view:    search "Python", install the one published by Microsoft
          Command Palette:    Python: Select Interpreter
          Status bar:         shows the interpreter you chose, for example Python 3.12
        `,
      },
    },
    {
      heading: 'Creating and running hello.py',
      paragraphs: [
        'Make a folder called `python-first`, open it in VS Code with File, then Open Folder, and create a new file named `hello.py`. The `.py` ending tells VS Code to treat the file as a Python program, so the extension starts working on it.',
        'Click the Run Python File button at the top right of the editor, or press the play button in the editor toolbar. VS Code opens a terminal, runs the file with your chosen interpreter, and prints the output in that terminal. You can also run the file yourself with `python3 hello.py` on macOS and Linux, or `python hello.py` on Windows.',
      ],
      figures: [
        { src: '/lesson-images/python/hello-py-file-created.png', alt: 'The VS Code editor with a file named hello.py open, containing two lines of Python code.', caption: 'Save the file as hello.py. The .py ending tells VS Code that this is a Python program.', credit: { text: 'Visual Studio Code documentation, CC BY 3.0 US', url: 'https://code.visualstudio.com/docs/python/python-tutorial' } },
        { src: '/lesson-images/python/run-python-file-in-terminal-button.png', alt: 'The VS Code editor toolbar with the Run Python File play button outlined in red.', caption: 'Click the play button in the top right of the editor to run the file. The output appears in the terminal below.', credit: { text: 'Visual Studio Code documentation, CC BY 3.0 US', url: 'https://code.visualstudio.com/docs/python/python-tutorial' } },
        { src: '/lesson-images/python/output-in-terminal.png', alt: 'The VS Code terminal showing the printed message from hello.py.', caption: 'The terminal shows the output. If you see the message you printed, the whole setup works.', credit: { text: 'Visual Studio Code documentation, CC BY 3.0 US', url: 'https://code.visualstudio.com/docs/python/python-tutorial' } },
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'hello.py',
        code: code`
          msg = "Hello from VS Code!"
          print(msg)
        `,
        output: 'Hello from VS Code!',
      },
    },
  ],
  seeItInAction: {
    title: 'The whole setup, checked in order',
    intro: 'These steps confirm each part of the setup in order: the interpreter, the terminal, and then VS Code. Run each one and check that it prints what the lesson describes. If one step fails, fix that step before you move on.',
    example: {
      language: 'bash',
      runnable: false,
      code: code`
        # 1. The interpreter works
        python3 --version          # macOS or Linux; use "py --version" on Windows

        # 2. A script runs from the terminal
        mkdir -p python-first && cd python-first
        printf 'msg = "Hello from VS Code!"\nprint(msg)\n' > hello.py
        python3 hello.py           # on Windows: python hello.py

        # 3. Then open the folder in VS Code and press Run Python File
        code .
      `,
    },
    steps: [
      { code: 'python3 --version', explanation: 'Confirms the interpreter is installed and on your path. If this fails, the other steps cannot work.' },
      { code: 'printf \'msg = "Hello from VS Code!"\\nprint(msg)\\n\' > hello.py', explanation: 'Writes a two-line Python program. Running it in the terminal tests the interpreter without VS Code involved.' },
      { code: 'python3 hello.py', explanation: 'Runs the file directly. If it prints the message, Python works. If VS Code then fails, the problem is in the editor setup, not in Python.' },
      { code: 'code .', explanation: 'Opens the folder in VS Code. Select the interpreter, then press Run Python File to confirm the editor uses the same Python.' },
    ],
  },
  tryIt: {
    instructions: [
      'Install Python 3.12 or newer for your system, then close and reopen your terminal and run the version command.',
      'Install the Python extension in VS Code, then run "Python: Select Interpreter" and choose the version you checked.',
      'Create hello.py, change the message to your name, and run it with the play button. Then run it with the terminal command and confirm both give the same output.',
    ],
  },
  mistakes: [
    { mistake: 'Running the version command in a terminal opened before the install.', fix: 'Close the terminal, open a new one, and run the command again.' },
    { mistake: 'Using the system Python on macOS for your projects.', fix: 'Install Python with Homebrew or the python.org installer, then select that interpreter in VS Code.' },
    { mistake: 'Skipping the PATH option on Windows, then seeing "python is not recognized."', fix: 'Run the installer again, choose Modify, and tick the option that adds Python to PATH. The py launcher also works without it.' },
  ],
  quiz: [
    {
      question: 'You installed Python, but VS Code still reports that Python is missing. What should you check first?',
      options: [
        { text: 'Whether you selected the interpreter with Python: Select Interpreter', explanation: 'Yes, check the interpreter first. VS Code needs to know which Python to use, and the terminal check tells you whether it is installed.' },
        { text: 'Whether you have a Microsoft account', explanation: 'A Microsoft account is not needed to run Python.' },
        { text: 'Whether the file is on your Desktop', explanation: 'The file location does not decide whether Python is installed.' },
        { text: 'Whether you deleted the .py ending', explanation: 'The ending tells VS Code the file is Python. Deleting it would stop the extension from working on it, but it would not cause a missing-Python message.' },
      ],
      answer: 0,
    },
    {
      question: 'Which command checks the Python version on macOS?',
      options: [
        { text: 'python3 --version', explanation: 'Yes. It prints the version of the Python 3 interpreter on your path.' },
        { text: 'py -0', explanation: 'That is a Windows launcher command, and it lists versions rather than checking one.' },
        { text: 'pip install python', explanation: 'That tries to install a package named python, which is not how you check the interpreter.' },
        { text: 'code --version', explanation: 'That reports the VS Code version, not Python.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        msg = "Hello from VS Code!"
        print(msg)
      ` },
      options: [
        { text: 'Hello from VS Code!', explanation: 'Yes. The program stores the text in msg and prints it.' },
        { text: 'msg', explanation: 'The print line prints the value of msg, not the name.' },
        { text: '"Hello from VS Code!"', explanation: 'The quotes are part of the code, not the output. The output is the text without quotes.' },
        { text: 'An error', explanation: 'The program is valid and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
  ],
  takeaway: 'Install Python 3.12 or newer, confirm it in a terminal, then select it in VS Code so that the Run button uses the same interpreter.',
  resources: [
    { title: 'Python in Visual Studio Code: Install a Python interpreter', provider: 'Visual Studio Code', description: 'The official tutorial covering interpreter installs on Windows, macOS, and Linux, with the Python extension.', url: 'https://code.visualstudio.com/docs/python/python-tutorial' },
    { title: 'Python downloads', provider: 'Python.org', description: 'The official Python installers for Windows and macOS, and the release notes for each version.', url: 'https://www.python.org/downloads/' },
  ],
}

export default lesson
