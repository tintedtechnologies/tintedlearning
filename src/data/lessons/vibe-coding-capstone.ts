import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Build a small tool end to end using the goal, design, steps, tests and checkpoints from this section',
    'Check the finished tool against a list of requirements and fix what fails',
    'Explain what the assistant wrote and what you checked, in a README another person can follow',
  ],
  bigIdea: 'A finished vibe-coded project is one you can explain. Every function has a test, every change has a checkpoint, and the README says what the tool does, how it was built and what you checked. The assistant wrote much of the code, but you own the result, so you must be able to explain and defend it.',
  whyItMatters: 'A portfolio piece built with an assistant is only worth showing if you can answer questions about it. An interviewer may ask why a function returns a new list, or how the tool handles a missing file. Working through the steps in this section gives you those answers, and the README records them. A reviewer who clones the project and runs it in five minutes will trust the rest of the work more than any claim in a cover letter.',
  goalSections: [
    {
      heading: 'Building the tool with the steps from this section',
      paragraphs: [
        'Start from the goal file and the design file, then build the reading list in small steps. Add books, list them, mark one as read and save to `books.json`. Commit a checkpoint after each step that works, and write a test for each function before you move on.',
        'When a step fails, read the traceback, reproduce the bug with a small input and give the assistant the exact error. Restore the checkpoint if a change breaks more than it fixes.',
        'The capstone is the place where the whole section comes together, so each earlier lesson is a tool you will use here.',
      ],
      example: {
        language: 'bash',
        runnable: true,
        code: code`
          mkdir -p reading-list-capstone
          cd reading-list-capstone
          printf '%s\n' "Reading list: add, list and mark books as read. Saves to books.json." > GOAL.md
          printf '%s\n' "Book: dict with title, author, read. Functions in reading_list.py." > DESIGN.md
          printf '%s\n' "CHANGES.md: one line per step, with whether the run passed." > CHANGES.md
          ls
        `,
      },
    },
    {
      heading: 'Checking the finished tool',
      paragraphs: [
        'Write a requirements checklist from the goal file. Each line should be a behavior you can test: adding a book, listing books, marking one as read, saving to a file and loading it again. Tick each line only after you have run it and seen the result.',
        'Test the empty case, a bad input and a restart. A restart test closes the program and opens it again, then checks that the books are still there. Many vibe-coded projects pass the first test and fail the restart test, because the save step was never run.',
        'Write the checklist before you run the tests, so you know what success looks like before you see the output.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Requirements (tick only after a run shows it):
          [ ] add_book adds a book with read set to False
          [ ] list_books prints one line per book
          [ ] mark_read changes only the matching book
          [ ] books survive a restart, because books.json is loaded
          [ ] an empty list prints a helpful message, not an error
        `,
      },
    },
    {
      heading: 'Explaining the result in a README',
      paragraphs: [
        'A README tells a reader what the tool does, how to run it, how the code is organized and what you checked. Say which parts the assistant wrote and which you changed or reviewed. Honesty about the process is part of the evidence, and it builds trust.',
        'End with what you would improve next, such as sorting by title, handling a corrupted file or adding a search. A short, honest list shows that you know where the tool stops.',
        'Choose a name for the tool that says what it does, and keep the folder name the same as the name in the README. Small consistency details make a project easy to review.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          # Reading List

          A command-line tool to add, list and mark books as read.
          Run: python reading_list.py

          ## How it was built
          Written with an AI assistant from GOAL.md and DESIGN.md, in small
          steps. Each step was run, tested and committed as a checkpoint.

          ## What I checked
          - Tests for each function, run with python -m pytest
          - A restart test, which confirms books.json is loaded

          ## Next steps
          - Sort books by title
          - Handle a corrupted books.json file
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Setting up the capstone project',
    intro: 'Every vibe-coded project in this section starts with the same files: the goal, the design and a change log. These commands make them in a new folder, so the rest of the work has a place to live. Each command makes one file, so you can see the project take shape.',
    example: {
      language: 'bash',
      runnable: true,
      code: code`
        mkdir -p reading-list-capstone
        cd reading-list-capstone
        printf '%s\n' "Reading list: add, list and mark books as read. Saves to books.json." > GOAL.md
        printf '%s\n' "Book: dict with title, author, read. Functions in reading_list.py." > DESIGN.md
        printf '%s\n' "CHANGES.md: one line per step, with whether the run passed." > CHANGES.md
        ls
      `,
    },
    steps: [
      { code: 'mkdir -p reading-list-capstone\ncd reading-list-capstone', explanation: 'Creates the project folder and moves into it, so every file below is created in the right place.' },
      { code: 'printf \'%s\\n\' "Reading list: ..." > GOAL.md', explanation: 'Writes the goal in one sentence. The assistant works from this file, and the requirements checklist comes from it.' },
      { code: 'printf \'%s\\n\' "Book: dict ..." > DESIGN.md', explanation: 'Records the book shape and the file that holds the functions. Keep it in step with the code.' },
      { code: 'ls', explanation: 'Lists the three files, so you can confirm the project is ready for the first small step.' },
    ],
  },
  tryIt: {
    instructions: [
      'Build the reading list from `GOAL.md` and `DESIGN.md`, in small steps, with one checkpoint commit per working step.',
      'Write `test_reading_list.py` with at least one test per function, and run `python -m pytest` until every test passes.',
      'Fill in the requirements checklist, then write the README with how it was built, what you checked and two next steps.',
    ],
  },
  mistakes: [
    { mistake: 'Calling the project finished without a restart test.', fix: 'Close the program, open it again and confirm the books are still there.' },
    { mistake: 'A README that hides the assistant’s part in the work.', fix: 'Say what the assistant wrote and what you checked, changed or reviewed.' },
    { mistake: 'Shipping code you cannot explain.', fix: 'Walk through each function in the README and answer what it receives and returns.' },
  ],
  quiz: [
    {
      question: 'Which check best shows that books are saved between runs?',
      options: [
        { text: 'Checking that the menu text is spelled correctly', explanation: 'Spelling does not test saving. A restart test does.' },
        { text: 'Adding a book, closing the program, opening it again and listing the books', explanation: 'Yes. The restart test checks that the data survives a new run.' },
        { text: 'Reading the code once', explanation: 'Reading helps, but a run is the only test of saving behavior.' },
        { text: 'Counting the lines of code', explanation: 'Line counts say nothing about saving.' },
      ],
      answer: 1,
    },
    {
      question: 'Your requirements checklist has one line not ticked. What should you do?',
      options: [
        { text: 'Tick it anyway, because the assistant probably got it right', explanation: 'Ticking without a run is the mistake the checklist prevents.' },
        { text: 'Remove the line so the list looks finished', explanation: 'Removing a requirement hides a gap. Fix the gap or say it is not done.' },
        { text: 'Run that behavior, find the cause, fix it and tick the line after a passing run', explanation: 'Yes. A line is ticked only after the behavior is seen working.' },
        { text: 'Leave it, because the README can explain it', explanation: 'A README cannot make a broken feature work.' },
      ],
      answer: 2,
    },
    {
      question: 'What makes a vibe-coded project worth showing in a portfolio?',
      options: [
        { text: 'It was built in one long prompt', explanation: 'Speed is not the evidence. Evidence is the tests, the checkpoints and the explanation.' },
        { text: 'You can explain what each part does, show the tests and describe the process honestly', explanation: 'Yes. The explanation and evidence are what a reviewer can check.' },
        { text: 'It has the most lines of code', explanation: 'Length is not evidence of quality.' },
        { text: 'The assistant wrote every line', explanation: 'Hiding your part is not a strength. You should own and explain the result.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'A finished vibe-coded project is a tool you can test, explain and defend, with an honest README that shows how it was built and checked.',
  resources: [
    { title: 'Make a README', provider: 'makeareadme.com', description: 'A guide to writing a README that explains a small project clearly.', url: 'https://www.makeareadme.com/' },
    { title: 'pytest documentation: How to use pytest', provider: 'pytest', description: 'The pytest guide for running tests across a project, which the capstone uses for its checks.', url: 'https://docs.pytest.org/en/stable/how-to/usage.html' },
  ],
}

export default lesson
