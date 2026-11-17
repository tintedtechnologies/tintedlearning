import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain vibe coding as describing a goal in plain words and having an AI assistant write the code',
    'Name the kinds of work where vibe coding helps, and the kinds where it does not',
    'Start a small project with a written goal, so the AI has something to work toward',
  ],
  bigIdea: 'Vibe coding means you describe what you want in plain language, an AI assistant writes the code, and you run it to see what happens. It is quick for small tools and experiments, and it still needs you to check the result, because the assistant does not know whether its code is correct.',
  whyItMatters: 'A friend asks you to build a tool that tracks which books they have read. You could spend a weekend learning every step, or you could describe the tool and have a working version by the end of the afternoon. That version is only useful if you can tell whether it is correct, and whether it is safe to share. Knowing where the line is protects you before you start, not after something goes wrong.',
  goalSections: [
    {
      heading: 'Describing software in plain words',
      paragraphs: [
        'In vibe coding, you write a description of the behavior you want instead of the code itself. You might say: "A command-line tool that adds a book, lists my books, and marks one as read." The assistant turns that description into Python, and you test the result. The skill you practice is describing software clearly, which is also useful when you work with people.',
        'The description is the most important input. A vague request produces vague code. A clear request says what the program receives, what it prints and what should happen in an edge case, such as an empty list.',
      ],
      example: {
        language: 'bash',
        runnable: true,
        code: code`
          mkdir -p reading-list
          cd reading-list
          printf '%s\n' "A command-line tool that adds a book, lists my books, and marks one as read." > GOAL.md
          cat GOAL.md
        `,
      },
    },
    {
      heading: 'Where it helps and where it does not',
      paragraphs: [
        'Vibe coding works well for small tools, prototypes, scripts that run once and experiments where a mistake costs little. A reading list for one person, a script that renames photos or a quick chart are good fits. You can throw the result away if it fails.',
        'It works poorly where the cost of a mistake is high. Payment code, login systems, medical software and anything that stores other people’s personal data need careful design, review and testing by someone who understands the risks. An assistant can help with those, but it cannot take responsibility for them.',
        'Ask whether you could explain the result to a friend. If you could not, the tool is not ready to share, even if it runs.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Good fit:   a reading list for one person, saved in a local file
          Poor fit:   a sign-in system that stores other people's passwords
        `,
      },
    },
    {
      heading: 'Starting with a written goal',
      paragraphs: [
        'Before you ask for any code, write the goal down in a file such as `GOAL.md`. Keep it short: what the tool does, who uses it, and what is out of scope. Paste that file into the conversation each time you ask for a change. The assistant then works from the same goal every time, and you can check each change against it.',
        'A goal file also protects you from drift. When the project changes shape, you can see that the goal has changed and decide whether that is what you want. Without one, a project can grow features nobody asked for.',
        'The line between a good fit and a poor fit is about the cost of a mistake. A mistake in a reading list costs an afternoon, while a mistake in a payment system can cost real money and trust.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          # Reading List

          A command-line tool for one person.
          It stores books in books.json in this folder.
          Out of scope: accounts, sharing, and a website.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Starting the reading-list project',
    intro: 'This project is the example for the whole section. These commands create the folder and write the goal file, the first step before you ask an assistant for code. Run them in any empty location. The reading list is a good first project because a mistake costs little, and you can check every result yourself.',
    example: {
      language: 'bash',
      runnable: true,
      code: code`
        mkdir -p reading-list
        cd reading-list
        printf '%s\n' "A command-line tool that adds a book, lists my books, and marks one as read." > GOAL.md
        cat GOAL.md
      `,
    },
    steps: [
      { code: 'mkdir -p reading-list', explanation: 'Creates the project folder. The `-p` flag does not complain if the folder already exists.' },
      { code: 'cd reading-list', explanation: 'Moves into the folder, so the goal file is created inside the project.' },
      { code: "printf '%s\\n' \"A command-line tool ...\" > GOAL.md", explanation: 'Writes the goal sentence into `GOAL.md`. The `%s` format prints the text exactly, so quotes and punctuation are safe.' },
      { code: 'cat GOAL.md', explanation: 'Shows the file, so you can check the goal before you share it with an assistant.' },
    ],
  },
  tryIt: {
    instructions: [
      'Create a `reading-list` folder and a `GOAL.md` file with one or two sentences about what the tool should do.',
      'Add an "Out of scope" line that names two things the tool will not do.',
      'Read the file aloud. If a friend could not picture the tool from it, rewrite it until they could.',
    ],
  },
  mistakes: [
    { mistake: 'Asking for "a book app" with no details, and accepting whatever comes back.', fix: 'Describe the inputs, outputs and one edge case before you ask for code.' },
    { mistake: 'Trusting code because it runs once.', fix: 'Test the behavior you care about, including empty input and bad input, before you rely on it.' },
    { mistake: 'Using vibe coding for a system that handles passwords or personal data without review.', fix: 'Treat those as high-risk. Get a review from someone who knows security before anything is shared.' },
  ],
  quiz: [
    {
      question: 'You want an AI assistant to build a tool for your own reading list. Which request gives the clearest starting point?',
      options: [
        { text: '"Make me a book app."', explanation: 'It is too vague. The assistant has to guess the inputs, the outputs and the storage.' },
        { text: '"A command-line tool that adds a book, lists my books, and marks one as read, saving them in books.json."', explanation: 'Yes. It names the actions, the interface and the storage, so the result is easy to test.' },
        { text: '"Build something cool."', explanation: 'That gives no direction, so the result will be unpredictable.' },
        { text: '"Make it like every app ever."', explanation: 'That is not a goal. It describes no behavior the tool must have.' },
      ],
      answer: 1,
    },
    {
      question: 'Which project is the best fit for vibe coding, as the lesson describes it?',
      options: [
        { text: 'A payment system that handles card numbers for a shop', explanation: 'Payments carry high risk. They need careful design and review, not a quick prototype.' },
        { text: 'A script that renames photos in one folder, run once', explanation: 'Yes. A small script with a low cost of mistakes is a good fit, and you can rerun it or throw it away.' },
        { text: 'A login system that stores other people’s passwords', explanation: 'Stored passwords are a high-risk area that needs expert review.' },
        { text: 'A medical record system for a clinic', explanation: 'Medical data is sensitive. It needs review and testing by people who understand the risks.' },
      ],
      answer: 1,
    },
    {
      question: 'Why keep a `GOAL.md` file in the project?',
      options: [
        { text: 'Python needs it to run the program', explanation: 'Python does not read the goal file. It is for you and the assistant.' },
        { text: 'You can paste it into each request, so the assistant works from the same goal and you can check each change against it', explanation: 'Yes. A written goal keeps every change tied to what the tool should do.' },
        { text: 'It makes the code run faster', explanation: 'The goal file has no effect on speed.' },
        { text: 'It replaces tests', explanation: 'A goal describes behavior. Tests check that the behavior really happens.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Vibe coding turns a clear goal into code quickly, and it still needs your testing and judgment before you trust the result.',
  resources: [
    { title: 'Python tutorial: Using the interpreter and scripts', provider: 'Python.org', description: 'How to run a Python file from the command line, which you need for the reading-list project.', url: 'https://docs.python.org/3/tutorial/interpreter.html' },
  ],
}

export default lesson
