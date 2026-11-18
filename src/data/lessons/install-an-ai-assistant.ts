import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Choose one AI coding assistant and check what its plan costs before you install it',
    'Install GitHub Copilot in VS Code, or install Claude Code or Codex in a terminal, and sign in',
    'Confirm that the installation works, using the version and health commands each tool provides',
  ],
  bigIdea: 'You can vibe code with a tool built into VS Code, such as GitHub Copilot, or with a command-line tool such as Claude Code or the OpenAI Codex CLI. Each one needs an account, and some need a paid plan, so check the cost and the sign-in first. Then install the tool, sign in, and confirm it runs before you start a project.',
  whyItMatters: 'You read about an assistant, install a command-line tool, and type its name in a terminal. Nothing happens, because the command is not on your path, or you have no plan that includes it. An hour is lost before you write a line of code. Checking the plan and running the version command first saves that hour.',
  goalSections: [
    {
      heading: 'Choosing a tool and checking the plan',
      paragraphs: [
        'GitHub Copilot runs inside VS Code, so it fits this section well. It has a free plan with a limited monthly allowance. Claude Code and the OpenAI Codex CLI run in a terminal, and they need an account with a paid plan or a developer account. Plans, limits, and prices change, so read the current terms on the official page before you buy anything.',
        'Pick one tool for this section. Learning one assistant well is more useful than installing three. The lessons do not depend on which tool you choose, because the habits are the same: give context, review changes, and test the result.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Tool            Where it runs           What you need to sign in
          GitHub Copilot  Inside VS Code          A GitHub account (a free plan exists)
          Claude Code     A terminal             A paid Claude plan or a developer account
          Codex CLI       A terminal             A ChatGPT plan, or an OpenAI API key
        `,
      },
    },
    {
      heading: 'Installing GitHub Copilot in VS Code',
      paragraphs: [
        'Open the Extensions view from the Activity Bar, or press Cmd+Shift+X on macOS or Ctrl+Shift+X on Windows and Linux. Search for "GitHub Copilot" and install the extension published by GitHub. Also install "GitHub Copilot Chat," which adds the chat view where you will give instructions.',
        'Sign in from the Copilot menu in the status bar, or run "GitHub Copilot: Sign in" from the Command Palette. Your browser opens so you can approve the sign-in. If you do not have a paid plan, check on the official page whether your account qualifies for the free plan. Before you send work code to any assistant, read the data handling notes and your organization\'s policy.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          1. Open the Extensions view (Cmd+Shift+X or Ctrl+Shift+X).
          2. Search "GitHub Copilot", then install it (publisher: GitHub).
          3. Search "GitHub Copilot Chat", then install it.
          4. Click the Copilot icon in the status bar, then choose Sign in.
          5. Open the Chat view and type a question to confirm it answers.
        `,
      },
    },
    {
      heading: 'Installing Claude Code or the Codex CLI in a terminal',
      paragraphs: [
        'Claude Code installs with a native installer. On macOS and Linux, run the install command from the official setup page in a terminal. On Windows, run the PowerShell command from the same page. Homebrew users can install the cask with a single command. After installing, open a new terminal window, then run the version command. A version number means the install worked.',
        'Open a terminal in the project folder, then run `claude` or `codex`. The tool asks you to sign in, usually by opening a browser window. Approve the sign-in there, and do not paste a password or key into the terminal. If the tool reports a problem, run its health command, such as `claude doctor`, which reads your installation and settings without making any changes.',
        'Keep credentials out of the project. An API key belongs in your user environment, or in a secret manager, and never in a file you commit or share. The next lessons explain how to limit what an assistant can do once it is signed in.',
        'The Codex CLI installs the same way, with an installer, npm, or Homebrew. The first time you run `codex` in a project folder, choose Sign in with ChatGPT or another method the tool lists. Copy install commands from the official pages only. Never run a command that you found in a comment or a chat message without checking the domain first.',
      ],
      example: {
        language: 'bash',
        runnable: false,
        code: code`
          # Claude Code, macOS or Linux (copy the command from the official setup page)
          curl -fsSL https://claude.ai/install.sh | bash

          # Claude Code, Homebrew
          brew install --cask claude-code

          # Codex CLI, npm
          npm install -g @openai/codex

          # Verify, in a new terminal window
          claude --version
          claude doctor
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Installing and testing Claude Code on a Mac',
    intro: 'This example installs Claude Code with Homebrew, checks the version, and then starts a first session in the reading-list folder. Read each command before you run it, and check the output matches what the lesson describes.',
    example: {
      language: 'bash',
      runnable: false,
      code: code`
        brew install --cask claude-code
        claude --version
        cd reading-list
        claude
      `,
    },
    steps: [
      { code: 'brew install --cask claude-code', explanation: 'Installs the Claude Code application with Homebrew. The cask name is listed on the official setup page, so check it there first.' },
      { code: 'claude --version', explanation: 'Prints the installed version. If you see "command not found," open a new terminal window so the path updates, then try again.' },
      { code: 'cd reading-list', explanation: 'Moves into the project folder. The assistant works in the folder where you start it, so start it in the right place.' },
      { code: 'claude', explanation: 'Starts a session in the project. The first run asks you to sign in with a browser window. Approve only the sign-in you started.' },
    ],
  },
  tryIt: {
    instructions: [
      'Pick one tool and check its plan on the official page. Write down the cost and the account you need.',
      'Install the tool and run its version command. For Copilot, confirm the status bar shows the Copilot icon and that a chat question gets an answer.',
      'Open the reading-list folder with the tool and ask it what files the project contains. Compare its answer with the Explorer.',
    ],
  },
  mistakes: [
    { mistake: 'Installing Claude Code or the Codex CLI and assuming a free account includes it.', fix: 'Check the plan on the official page first. Claude Code requires a paid plan or a developer account.' },
    { mistake: 'Running an install command copied from a random page or a chat message.', fix: 'Copy the command from the official setup page, and check the domain before you run it.' },
    { mistake: 'Pasting an API key into the terminal or into a chat to sign in.', fix: 'Use the browser sign-in. Store any key in your environment or a secret manager, never in the project.' },
  ],
  quiz: [
    {
      question: 'You want an assistant that works inside VS Code with little setup. Which option fits best?',
      options: [
        { text: 'Install the GitHub Copilot extension from the Extensions view and sign in', explanation: 'Yes. Copilot runs inside VS Code, and the status bar shows its sign-in state.' },
        { text: 'Install Claude Code only, then expect it to appear in VS Code', explanation: 'Claude Code runs in a terminal. It does not appear in VS Code by itself.' },
        { text: 'Paste your password into the Copilot setting to skip sign-in', explanation: 'Sign in through the browser prompt. Never type a password into a setting.' },
        { text: 'Use any command you find in a chat message', explanation: 'Install commands should come from the official setup page, after you check the domain.' },
      ],
      answer: 0,
    },
    {
      question: 'Claude Code is installed. Which command confirms that the installation works?',
      options: [
        { text: 'claude --version', explanation: 'Yes. A working install prints a version number.' },
        { text: 'claude --delete', explanation: 'That is not a version check, and deleting is not a safe way to test an install.' },
        { text: 'npm run claude', explanation: 'Claude Code is not an npm script in your project, so this does not test the install.' },
        { text: 'git claude', explanation: 'Git does not run Claude Code. The version command is the direct check.' },
      ],
      answer: 0,
    },
    {
      question: 'What is the safest way to sign in to an assistant from the terminal?',
      options: [
        { text: 'Approve the browser sign-in that the tool opens', explanation: 'Yes. The browser handles the sign-in, and you never type your password into the terminal.' },
        { text: 'Paste your password after the sign-in command', explanation: 'A password in the terminal can end up in shell history. Use the browser sign-in.' },
        { text: 'Email your key to the support address', explanation: 'Never send keys by email. Store them in your environment or a secret manager.' },
        { text: 'Commit the key to the project so every teammate can sign in', explanation: 'Committed keys are visible to everyone with access, and they are hard to remove from history.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Check the plan, install one tool from its official page, sign in through the browser, and confirm the install with the tool\'s own version command.',
  resources: [
    { title: 'Claude Code: Set up Claude Code', provider: 'Anthropic', description: 'The official install steps, system requirements, and troubleshooting for Claude Code.', url: 'https://code.claude.com/docs/en/setup' },
    { title: 'Codex CLI', provider: 'OpenAI', description: 'The official install options, sign-in methods, and first-task guide for the Codex CLI.', url: 'https://developers.openai.com/codex/cli' },
    { title: 'Install GitHub Copilot in VS Code', provider: 'GitHub', description: 'How to find, install, and sign in to Copilot in Visual Studio Code.', url: 'https://code.visualstudio.com/docs/copilot/setup' },
  ],
}

export default lesson
