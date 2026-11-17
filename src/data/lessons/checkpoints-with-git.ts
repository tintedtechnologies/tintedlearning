import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Save a working version as a commit before you ask the assistant for a change',
    'Use `git status` and `git diff` to see exactly what the assistant changed',
    'Undo a change that failed by restoring the last commit',
  ],
  bigIdea: 'A commit is a saved checkpoint of working code, made before each change from an assistant. If a change breaks something, `git diff` shows what changed and `git restore` returns the file to the checkpoint. This turns a risky change into one you can undo in seconds.',
  whyItMatters: 'You ask the assistant for a feature. It rewrites six functions, and the program no longer starts. You do not remember which lines were working before. With a checkpoint, the working version is one command away, and you can compare the two versions line by line. Those extra minutes are cheap compared with rebuilding a working program from memory.',
  goalSections: [
    {
      heading: 'Committing before each change',
      paragraphs: [
        'Commit once the program works, with a message that says what works, such as "Checkpoint: add and list books work." Do this before every request to the assistant. The checkpoint is the version you return to if the next change goes wrong.',
        'Small, frequent commits are easier to undo than one large commit at the end of the day. A commit made after each working step matches the small steps from the earlier lesson.',
        'A checkpoint does not have to be perfect. It only has to run and do one useful thing, because the next checkpoint will build on it.',
      ],
      example: {
        language: 'bash',
        runnable: true,
        code: code`
          mkdir -p checkpoint-demo
          cd checkpoint-demo
          git init -b main --quiet
          echo 'print("reading list v1")' > reading_list.py
          git add reading_list.py
          git commit -m "Checkpoint: first working version" --quiet
          git log --format=%s
        `,
      },
    },
    {
      heading: 'Reading what the assistant changed',
      paragraphs: [
        '`git status` lists the files that changed since the last commit. `git diff` shows the exact lines added and removed. Read the diff before you run the code. It is the quickest way to see whether the assistant touched something you did not ask it to change.',
        'A diff with lines you did not expect is a warning. Ask the assistant why it changed those lines, or restore the checkpoint and ask again with a clearer request.',
        'Read the status before you commit, so you know exactly which files will be saved. Committing an unrelated file, such as a log or a local settings file, is a common way to lose track of what a checkpoint contains. A commit message is also a note to yourself, so write it as a sentence about the working state.',
      ],
      example: {
        language: 'bash',
        runnable: true,
        code: code`
          git init -b main --quiet
          echo 'print("reading list v1")' > reading_list.py
          git add reading_list.py
          git commit -m "Checkpoint: first working version" --quiet
          echo 'print("reading list v2")' > reading_list.py
          git status --short
          git diff
        `,
      },
    },
    {
      heading: 'Restoring a failed change',
      paragraphs: [
        '`git restore reading_list.py` puts the file back to the last commit. Every change since that commit is discarded, so only restore when you are sure you do not need those changes. If you want to keep the change for later, save it on a branch first.',
        'Restoring is safer than editing by hand. Hand edits can miss a line, and the restored file matches the checkpoint exactly.',
        'If you are unsure whether a change is good, create a branch first. The branch keeps the experiment separate, and `main` keeps the checkpoint you trust. Restoring is also the fastest way to compare. Restore, run, then compare the output of the old and new versions, so you can decide which one to keep. Give each checkpoint a message that names the working behavior, so you can find it in the log later.',
      ],
      example: {
        language: 'bash',
        runnable: true,
        code: code`
          git init -b main --quiet
          echo 'print("reading list v1")' > reading_list.py
          git add reading_list.py
          git commit -m "Checkpoint: first working version" --quiet
          echo 'print("broken change")' > reading_list.py
          git restore reading_list.py
          cat reading_list.py
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checkpoint, change, diff, restore',
    intro: 'This sequence saves a working file, makes a change the way an assistant might, reads the diff and then restores the checkpoint. Run it in an empty folder, and watch the file contents at the end. The output of each command tells you what changed, so read it as you go.',
    example: {
      language: 'bash',
      runnable: true,
      code: code`
        mkdir -p checkpoint-demo
        cd checkpoint-demo
        git init -b main --quiet
        echo 'print("reading list v1")' > reading_list.py
        git add reading_list.py
        git commit -m "Checkpoint: first working version" --quiet
        echo 'print("broken change")' > reading_list.py
        git status --short
        git restore reading_list.py
        cat reading_list.py
      `,
    },
    steps: [
      { code: 'git add reading_list.py\ngit commit -m "Checkpoint: first working version"', explanation: 'Saves the working file as a checkpoint. The message says what works, so you can recognize it later.' },
      { code: 'echo \'print("broken change")\' > reading_list.py', explanation: 'Simulates a change from an assistant that broke the program. The file on disk now differs from the checkpoint.' },
      { code: 'git status --short', explanation: 'Shows that `reading_list.py` changed. Check this before you run anything.' },
      { code: 'git restore reading_list.py\ncat reading_list.py', explanation: 'Puts the file back to the checkpoint. The last command prints the working version, `reading list v1`.' },
    ],
  },
  tryIt: {
    instructions: [
      'Create a `reading-list` repository, write a working `reading_list.py`, and commit it with a checkpoint message.',
      'Ask an assistant for one change, then run `git status` and `git diff`. Write down one line you did not expect, if there is one.',
      'Restore the file with `git restore` and run the program to confirm it works again.',
    ],
  },
  mistakes: [
    { mistake: 'Making a request with no checkpoint, then not knowing what the working version looked like.', fix: 'Commit each working step before you ask for the next change.' },
    { mistake: 'Running the code without reading `git diff` first.', fix: 'Read the diff, then run. The diff shows changes you did not ask for.' },
    { mistake: 'Restoring a file without saving a change you still want.', fix: 'Copy the change to a branch with `git switch -c` before you restore.' },
  ],
  quiz: [
    {
      question: 'You committed a working version. The assistant then changed `reading_list.py`. Which command shows the exact lines that changed?',
      options: [
        { text: '`git diff`', explanation: 'Yes. It shows the lines added and removed since the last commit.' },
        { text: '`git init`', explanation: 'That starts a repository. It does not show changes.' },
        { text: '`git push`', explanation: 'Push uploads commits to a remote. It does not show the changed lines.' },
        { text: '`git commit`', explanation: 'That saves the change as a new checkpoint. It does not show what changed first.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this command sequence print at the end?',
      code: { language: 'bash', runnable: true, code: code`
        git init -b main --quiet
        echo 'print("v1")' > app.py
        git add app.py
        git commit -m "Checkpoint" --quiet
        echo 'print("v2")' > app.py
        git restore app.py
        cat app.py
      ` },
      options: [
        { text: 'print("v2")', explanation: 'The restore removed the v2 change, so v2 is not in the file.' },
        { text: 'print("v1")', explanation: 'Yes. The restore puts the file back to the checkpoint, which contains v1.' },
        { text: 'An error', explanation: 'The commands are valid, so the file is printed without an error.' },
        { text: 'Nothing', explanation: 'The cat command prints the file contents, which is the checkpoint text.' },
      ],
      answer: 1,
    },
    {
      question: 'Why commit a checkpoint before each request to the assistant?',
      options: [
        { text: 'Git needs a commit before the assistant can read files', explanation: 'The assistant does not depend on commits to read files.' },
        { text: 'If the change breaks the program, you can restore the working version', explanation: 'Yes. A checkpoint is the known working state you return to.' },
        { text: 'Commits make the assistant write shorter code', explanation: 'The commit does not change the length of the code.' },
        { text: 'It uploads the code to GitHub automatically', explanation: 'A commit saves locally. Uploading needs a separate push command.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Commit working code before every change, read `git diff` before you run, and restore the checkpoint when a change breaks things.',
  resources: [
    { title: 'Pro Git, chapter 2: Git Basics', provider: 'Git SCM', description: 'The free official book. Chapter 2 covers saving changes, reading status and restoring files.', url: 'https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository' },
  ],
}

export default lesson
