import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Install Visual Studio Code and open your project as a folder, not as a loose file',
    'Find the Explorer, the editor, the terminal, and the Command Palette',
    'Decide whether to trust a folder, and know what trust allows',
  ],
  bigIdea: 'Visual Studio Code, usually called VS Code, is the place where you will read the code, run it, and review what an assistant changes. An AI assistant only sees the folder you open, so open the whole project, then use the panels around the editor to check its work.',
  whyItMatters: 'You ask an assistant to fix a bug, but you open only one file in VS Code. The assistant cannot see the test file, the configuration, or the other module that the bug depends on. It guesses, and its fix breaks something you cannot see. Opening the whole folder gives the assistant the full picture, and it lets you check that picture yourself.',
  goalSections: [
    {
      heading: 'Installing VS Code and opening a folder',
      paragraphs: [
        'Download VS Code from the official site, code.visualstudio.com, and install it for your system. On macOS, drag it to Applications. On Windows, the installer adds it to the Start menu. Open VS Code once to confirm it starts.',
        'Open the whole project with File, then Open Folder, and choose the `reading-list` folder. The folder name appears in the title bar. The Explorer panel on the left lists every file inside it, and that list is what an assistant can see by default.',
        'A common mistake is to use File, then Open File, and pick one Python file. The editor works, but the rest of the project is hidden from the assistant and from the search tools.',
      ],
      figures: [
        { src: '/lesson-images/vscode/activity-bar-and-side-bar.png', alt: 'The VS Code Activity Bar on the left, with the Run and Debug view open in the Primary Side Bar.', caption: 'The Activity Bar on the far left switches between panels. The Explorer is the top icon, and Run and Debug is the one with the play symbol.', credit: { text: 'Visual Studio Code documentation, CC BY 3.0 US', url: 'https://code.visualstudio.com/docs/editing/getting-started/editor-tutorial' } },
      ],
      example: {
        language: 'bash',
        runnable: false,
        code: code`
          # Create the project folder in a terminal, then open it in VS Code
          mkdir -p reading-list
          cd reading-list
          code .
        `,
      },
    },
    {
      heading: 'Finding the panels you will use',
      paragraphs: [
        'The Activity Bar on the far left has icons for the Explorer, Search, Source Control, Run and Debug, and Extensions. The Primary Side Bar next to it shows the panel you pick. The editor fills the center, and the panel at the bottom holds the terminal and the Problems list.',
        'Open the Command Palette with Cmd+Shift+P on macOS or Ctrl+Shift+P on Windows and Linux. Every command in VS Code is listed there, and you can type a few letters of its name to find it. This is faster than hunting through menus.',
        'Toggle the integrated terminal with Ctrl+` (the backtick key). The terminal opens in the project folder, so commands you type there run inside the project. You will use it for running tests and for checking what the assistant ran.',
      ],
      figures: [
        { src: '/lesson-images/vscode/integrated-terminal.png', alt: 'The VS Code integrated terminal open at the bottom of the window, running a command inside the project.', caption: 'The integrated terminal runs in your project folder. Use it to run tests and to see the commands an assistant runs on your behalf.', credit: { text: 'Visual Studio Code documentation, CC BY 3.0 US', url: 'https://code.visualstudio.com/docs/terminal/basics' } },
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Shortcut           What it does
          Cmd+Shift+P        Open the Command Palette (Ctrl+Shift+P on Windows and Linux)
          Ctrl+\`            Show or hide the integrated terminal
          Cmd+B              Show or hide the Primary Side Bar
        `,
      },
    },
    {
      heading: 'Deciding whether to trust a folder',
      paragraphs: [
        'The first time you open a folder, VS Code asks whether you trust the authors of its files. Trust matters because some folders run code automatically, such as tasks, extensions, and settings that a project can define. A folder you downloaded from the internet should not be trusted until you have read it.',
        'Choose "Yes, I trust the authors" only for folders you wrote or have checked. Choose "No" to browse in Restricted Mode, which blocks automatic code from running. You can change your decision later through the Restricted Mode indicator in the status bar.',
      ],
      figures: [
        { src: '/lesson-images/vscode/workspace-trust.png', alt: 'The Workspace Trust dialog asking whether the user trusts the authors of the files in the folder, with Yes and No buttons.', caption: 'When you open an unfamiliar folder, VS Code asks about trust. Choose "Yes" only for folders you wrote or have reviewed.', credit: { text: 'Visual Studio Code documentation, CC BY 3.0 US', url: 'https://code.visualstudio.com/docs/editing/getting-started/editor-tutorial' } },
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Do you trust the authors of the files in this folder?
          [ Yes, I trust the authors ]     [ No, I don't trust the authors ]
          Restricted Mode is shown in the bottom-left status bar when trust is off.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Setting up the reading-list project in VS Code',
    intro: 'These steps set up the project you will use for the rest of this section. Run the commands in a terminal, then open the folder in VS Code and check each panel. The last step confirms that the assistant will see the whole project.',
    example: {
      language: 'bash',
      runnable: false,
      code: code`
        mkdir -p reading-list
        cd reading-list
        printf '%s\n' "A command-line tool that adds books and marks them as read." > GOAL.md
        code .
      `,
    },
    steps: [
      { code: 'mkdir -p reading-list\ncd reading-list', explanation: 'Makes the project folder and moves into it, so VS Code opens the right folder when you run `code .`.' },
      { code: 'printf \'%s\\n\' "A command-line tool ..." > GOAL.md', explanation: 'Writes the goal file. It appears in the Explorer, so the assistant can read it as part of the project.' },
      { code: 'code .', explanation: 'Opens the current folder in VS Code. The `code` command is installed with VS Code, and you can also run "Shell Command: Install code command in PATH" from the Command Palette if it is missing.' },
      { code: 'Ctrl+` (or Cmd+` on macOS)', explanation: 'Opens the terminal in the project folder. Run the tests from here later, so you can see the same results the assistant sees.' },
    ],
  },
  tryIt: {
    instructions: [
      'Install VS Code, create the `reading-list` folder, and open it with File, then Open Folder.',
      'Open the Command Palette and search for "Toggle Terminal." Run `ls` in the terminal and confirm that GOAL.md is listed.',
      'Use the Explorer to create an empty file called `books.json`. Confirm that it appears in the tree and in the terminal listing.',
    ],
  },
  mistakes: [
    { mistake: 'Opening a single file instead of the project folder.', fix: 'Use File, then Open Folder, so the assistant and the search tools can see every file.' },
    { mistake: 'Trusting a folder you downloaded without reading it.', fix: 'Stay in Restricted Mode until you have read the files, then decide.' },
    { mistake: 'Running commands in the wrong terminal folder.', fix: 'Check the prompt path, or run `pwd`, before you run a command that deletes or moves files.' },
  ],
  quiz: [
    {
      question: 'You want an assistant to fix a bug that spans three files. Which way of opening the project gives it the most useful view?',
      options: [
        { text: 'Open the bug file alone with File, then Open File', explanation: 'The other two files are hidden, so the assistant cannot see how they connect to the bug.' },
        { text: 'Open the whole project folder with File, then Open Folder', explanation: 'Yes. The assistant and the search tools can then read every file in the project.' },
        { text: 'Paste the code into an empty window', explanation: 'Pasting gives the assistant only the code you copied, without the file structure or the tests.' },
        { text: 'Open the terminal, but leave the folder closed', explanation: 'The terminal does not show the editor files. The folder must be open for the Explorer to show them.' },
      ],
      answer: 1,
    },
    {
      question: 'You open a project you downloaded from a website. VS Code asks whether to trust its authors. What is the safest first choice?',
      options: [
        { text: 'Yes, I trust the authors, so the setup works immediately', explanation: 'Trusting before you read the files lets automatic code run. Read the folder first.' },
        { text: 'No, browse in Restricted Mode, then read the files before trusting', explanation: 'Yes. Restricted Mode blocks automatic code, so you can review the project first.' },
        { text: 'Delete the folder, because the question means it is malicious', explanation: 'The question is a safety check, not a verdict. Restricted Mode lets you review it first.' },
        { text: 'Choose whichever button is highlighted', explanation: 'The highlighted button is not a safety judgment. Make the choice based on whether you have checked the folder.' },
      ],
      answer: 1,
    },
    {
      question: 'Which shortcut opens the Command Palette on macOS?',
      options: [
        { text: 'Cmd+Shift+P', explanation: 'Yes. It lists every VS Code command, and you can type part of a name to find one.' },
        { text: 'Cmd+P', explanation: 'Cmd+P opens quick file search, not the full list of commands.' },
        { text: 'Ctrl+` ', explanation: 'That toggles the integrated terminal.' },
        { text: 'Cmd+Shift+F', explanation: 'That opens search across files, not the command list.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Open the whole project folder in VS Code, use the Command Palette and terminal to check the work, and trust only folders you have reviewed.',
  resources: [
    { title: 'Visual Studio Code: Getting started with the editor', provider: 'Visual Studio Code', description: 'The official tutorial for the editor layout, opening folders, and the basic commands.', url: 'https://code.visualstudio.com/docs/editing/getting-started/editor-tutorial' },
    { title: 'Visual Studio Code: Workspace Trust', provider: 'Visual Studio Code', description: 'What trust allows, and how Restricted Mode protects you before you review a folder.', url: 'https://code.visualstudio.com/docs/editor/workspace-trust' },
  ],
}

export default lesson
