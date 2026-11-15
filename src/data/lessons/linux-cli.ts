import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Move around folders with `pwd`, `ls` and `cd`',
    'Create, copy, move and delete files and folders',
    'Run a program and read its output and exit code',
  ],
  bigIdea: "The command line is a text window, called a terminal, where you type instructions to your computer instead of clicking. Every developer tool you will meet in this section, from Git to Docker, is driven from it. A dozen commands cover almost everything you need day to day.",
  whyItMatters: "You follow a tutorial that says \"run `python app.py` in your project folder\". You type it and get `No such file or directory`, even though you can see `app.py` in your file browser. The terminal was simply looking in a different folder. Knowing where the terminal is, and how to move it, turns a confusing dead end into a two-second fix.",
  goalSections: [
    {
      heading: 'Finding your way around folders',
      paragraphs: [
        "On a Mac, open the Terminal app. On Linux, open your terminal. On Windows, use PowerShell, or WSL (Windows Subsystem for Linux), which gives you a real Linux terminal. The commands in this lesson work the same in all of them unless a note says otherwise.",
        "The terminal is always inside one folder, called the working directory. `pwd`, short for print working directory, shows which one. `ls` lists what is inside it. `cd` followed by a folder name, short for change directory, moves you into that folder.",
        "Two shortcuts matter most. `cd ..` moves up one level, to the folder that contains this one. `cd ~` jumps to your home folder. A path that starts with `/`, such as `/home/sam/study-tracker`, is a full address from the very top of the computer.",
      ],
      example: {
        language: 'bash',
        runnable: true,
        code: code`
          mkdir -p projects/notes
          cd projects
          ls
          cd notes
          cd ..
          ls
        `,
        output: 'notes\nnotes',
      },
    },
    {
      heading: 'Creating, copying, moving and deleting',
      paragraphs: [
        "`mkdir name` makes a folder. `touch name` creates an empty file (in PowerShell, use `New-Item name`). `cp from to` copies a file, and `mv from to` moves or renames it.",
        "`rm file` deletes a file and `rm -r folder` deletes a folder and everything inside it (in PowerShell, `Remove-Item -Recurse folder`). There is no trash can: deleted means gone. Run `pwd` and `ls` first, so you know exactly what you are about to remove.",
        "Names with spaces need quotes. `mkdir my notes` makes two folders, `my` and `notes`. `mkdir \"my notes\"` makes one. Most developers avoid spaces in file and folder names altogether and use dashes instead.",
      ],
      example: {
        language: 'bash',
        runnable: true,
        code: code`
          mkdir drafts
          touch drafts/plan.txt
          cp drafts/plan.txt drafts/plan-copy.txt
          mv drafts/plan-copy.txt backup.txt
          ls drafts
          rm backup.txt
          rm -r drafts
          ls
        `,
        output: 'plan.txt',
      },
    },
    {
      heading: 'Running a program and reading its result',
      paragraphs: [
        "To run a Python file, type `python3 app.py` (on Windows, `python app.py`). Whatever the program prints appears right below. Error messages appear there too, so always read the last few lines after a command.",
        "Every program also ends with a number called its exit code. 0 means success. Anything else means something went wrong. You rarely see it, but tools such as Git hooks and automated tests rely on it. Show the last command's exit code with `echo $?` (in PowerShell, `$LASTEXITCODE`).",
        "Python exits with 2 when it cannot find the file you asked it to run, and with 1 when your code raises an error it does not handle.",
      ],
      example: {
        language: 'bash',
        runnable: true,
        code: code`
          echo 'print("Study Tracker is running")' > app.py
          python3 app.py
          echo "exit code: $?"
          python3 missing.py || echo "exit code: $?"
        `,
        output: 'Study Tracker is running\nexit code: 0\nexit code: 2',
      },
    },
  ],
  seeItInAction: {
    title: 'Creating the Study Tracker folder',
    intro: "Study Tracker is the app you will build across this whole section. Here is its very first step: a folder with one file in it. Type these commands one at a time, in order.",
    example: {
      language: 'bash',
      runnable: true,
      code: code`
        mkdir study-tracker
        cd study-tracker
        echo 'print("Study Tracker is running")' > app.py
        ls
        python3 app.py
      `,
      output: 'app.py\nStudy Tracker is running',
    },
    steps: [
      { code: 'mkdir study-tracker', explanation: "Makes the project folder. The dash instead of a space keeps every later command simple." },
      { code: 'cd study-tracker', explanation: "Moves the terminal into the new folder. From now on, every command works inside it. Run `pwd` if you ever lose track." },
      { code: 'echo \'print("Study Tracker is running")\' > app.py', explanation: "`echo` prints text, and `>` sends that text into a file instead of the screen, creating `app.py`. The single quotes keep the double quotes inside the Python code intact. You could also create the file in your editor." },
      { code: 'ls', explanation: "Lists the folder, showing `app.py`. Checking is a good habit before running anything." },
      { code: 'python3 app.py', explanation: "Runs the file. Python reads `app.py`, runs its one line and prints the message. The exit code is 0, because nothing went wrong." },
    ],
  },
  tryIt: {
    instructions: [
      'Create the `study-tracker` folder and `app.py` as shown above, and run it.',
      'Inside `study-tracker`, create a virtual environment: `python3 -m venv .venv` (on Windows, `python -m venv .venv`).',
      'Turn it on: `source .venv/bin/activate` on macOS or Linux, or `.venv\\Scripts\\Activate.ps1` in PowerShell. Your prompt should now start with `(.venv)`.',
      'Run `ls -a` (in PowerShell, `ls -Force`) and find the hidden `.venv` folder. Then run `python app.py` again: inside the environment, plain `python` works everywhere.',
    ],
  },
  mistakes: [
    { mistake: 'Running a command in the wrong folder.', fix: 'Run `pwd` and `ls` before running or deleting anything, and `cd` into the project folder first.' },
    { mistake: 'Deleting with `rm -r` without checking the path.', fix: 'Read the path twice and run `ls` on it first. There is no undo on the command line.' },
    { mistake: 'Using spaces in file and folder names without quotes.', fix: 'Use dashes, like `study-tracker`, or wrap the name in quotes every time you type it.' },
    { mistake: 'Forgetting to activate the virtual environment in a new terminal window.', fix: 'Look for `(.venv)` at the start of the prompt. If it is missing, run the activate command again.' },
  ],
  quiz: [
    {
      question: 'You are in `/home/sam/study-tracker`. You run `cd ..` and then `pwd`. What is printed?',
      options: [
        { text: '`/home/sam/study-tracker`', explanation: '`cd ..` moved you, so the working directory has changed.' },
        { text: '`/home`', explanation: '`..` goes up only one level, not two.' },
        { text: '`/home/sam`', explanation: '`..` means the folder that contains the current one, so you move up from `study-tracker` to `sam`.' },
        { text: '`..`', explanation: '`pwd` prints the full path of where you are, not the last thing you typed.' },
      ],
      answer: 2,
    },
    {
      question: 'What does this print?',
      code: { language: 'bash', runnable: true, code: code`
        mkdir my notes
        ls
      ` },
      options: [
        { text: '`my notes`, one folder', explanation: 'Without quotes, the space separates two names, so `mkdir` receives two folder names.' },
        { text: '`my` and `notes`, two folders', explanation: 'The space splits the input into two names, and `mkdir` makes a folder for each one.' },
        { text: 'An error, because folder names cannot have spaces', explanation: 'Folders can have spaces, but you must put quotes around the name to make one.' },
        { text: 'Nothing, because the command needs `-p`', explanation: '`-p` creates missing parent folders. It is not needed here.' },
      ],
      answer: 1,
    },
    {
      question: 'You run `python3 app.py` and see `can\'t open file \'/home/sam/app.py\': [Errno 2] No such file or directory`. Your file is in `/home/sam/study-tracker`. What should you do?',
      options: [
        { text: 'Run `cd study-tracker`, then run the command again', explanation: 'The error shows Python looked in `/home/sam`. Move into the folder that holds `app.py`.' },
        { text: 'Reinstall Python', explanation: 'Python is working fine. It reported a missing file, not a missing Python.' },
        { text: 'Rename the file to `App.py`', explanation: 'The name is not the problem. Python is looking in the wrong folder.' },
        { text: 'Run the command with `sudo`', explanation: '`sudo` gives administrator rights. It does not change which folder Python looks in.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Check where you are with `pwd` and `ls`, move with `cd`, and read the output and exit code of every command you run.',
  resources: [
    { title: 'The Linux command line for beginners', provider: 'Ubuntu', description: 'A short, hands-on tutorial covering the same commands, with practice.', url: 'https://ubuntu.com/tutorials/command-line-for-beginners' },
    { title: 'The Missing Semester: the shell', provider: 'MIT', description: 'A deeper lecture on how the shell works, with exercises.', url: 'https://missing.csail.mit.edu/2020/course-shell/' },
  ],
  underTheHood: {
    heading: 'How the terminal finds a program',
    paragraphs: [
      "The terminal window runs a program called a shell, such as bash, zsh or PowerShell. When you type `python3 app.py`, the shell splits the line on spaces into a command, `python3`, and its arguments, `app.py`. That splitting is why spaces in names need quotes.",
      "To find `python3`, the shell searches a list of folders stored in an environment variable called `PATH`, in order, and runs the first match. See the list with `echo $PATH`. Activating a virtual environment works by putting `.venv/bin` at the front of `PATH`, so its `python` is found first.",
      "The shell then starts the program as a new process and connects it to two output streams: standard output for normal results and standard error for problems. Both show in your window. When the process ends, its exit code is stored, which is exactly what `echo $?` shows.",
    ],
  },
}

export default lesson
