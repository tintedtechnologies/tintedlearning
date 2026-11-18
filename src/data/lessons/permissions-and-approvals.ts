import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain what an assistant can do once it has permission: read files, edit them, and run commands',
    'Read an approval prompt before you allow it, and choose the narrowest approval that does the job',
    'Choose a permission level for each task, and know when to switch to read-only',
  ],
  bigIdea: 'An assistant with permission can read your files, change them, and run commands in your terminal. Each approval prompt is a decision about what it may do, so read the command or the tool name before you allow it. Choose the narrowest approval that does the job, and switch to read-only when you only want answers.',
  whyItMatters: 'You ask an assistant to clean up a build folder, and you click "Allow all" to stop the prompts. It runs a command that deletes more than the build folder, because the path it chose was wrong. The prompts were the only moment you could have checked. A prompt you read carefully takes seconds, and a deletion you did not read can take hours to recover from. Reading each approval and keeping the scope small would have stopped the deletion.',
  goalSections: [
    {
      heading: 'What an assistant can do with permission',
      paragraphs: [
        'An assistant in an editor or terminal does more than suggest text. It can read files it chooses, write changes to them, and run commands such as tests, package installs, and file moves. Each of these actions is a tool call, and a permission setting decides whether you must approve it.',
        'A command the assistant runs has the same power as a command you type. It can delete, overwrite, or send data over the network. That is why approvals matter, even for tasks that look harmless. Ask yourself what would happen if the command ran in the wrong folder.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Actions an assistant can take, from least to most risky:
          1. Read a file in the project
          2. Edit a file in the project
          3. Run a test command you approved
          4. Install a package, or run a script from the internet
          5. Delete files, or send data over the network
        `,
      },
    },
    {
      heading: 'Reading an approval before you allow it',
      paragraphs: [
        'An approval prompt names the tool or the command it wants to run. Read it in full. If the prompt asks to install an extension, run a script, or reach an address, check the name and the address against what you expected. A prompt you did not expect is a reason to skip it and ask the assistant why it needs that action.',
        'Choose the narrowest option. "Allow once" or "Allow in this session" covers one task. "Always allow" applies to every future request, so use it only for actions you would approve every time, such as running your own test command.',
      ],
      figures: [
        { src: '/lesson-images/vscode/chat-approve-tool.png', alt: 'An approval prompt asking to install the rust-analyzer extension, with an Allow button and a dropdown listing Allow in this Session, Allow in this Workspace, and Always Allow.', caption: 'Read the request first. The dropdown next to Allow lists how far the approval reaches: this session, this workspace, or always. Choose the narrowest one that works.', credit: { text: 'Visual Studio Code documentation, CC BY 3.0 US', url: 'https://code.visualstudio.com/docs/agents/run/approvals' } },
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Prompt:   Run command: python -m pytest
          Decision: Allow once (this matches a test you asked for)

          Prompt:   Run command: rm -rf build/ dist/ ~
          Decision: Deny. The path includes your home folder, which is not a build folder.
        `,
      },
    },
    {
      heading: 'Choosing a permission level and using read-only',
      paragraphs: [
        'Copilot offers Manual permissions, which is the default and asks before each action that is not auto-approved. Codex lets you set a sandbox and an approval policy, and it runs with network access off by default. Claude Code has permission modes that you can change while you work. Use the level that matches the task, and check the official docs for the exact names your tool uses.',
        'Switch to read-only when you want an explanation, a review, or a plan. A read-only session can read the project and answer questions, but it cannot change files or run commands. "Allow all" removes the prompts entirely, so reserve it for disposable folders, not your real projects. A prompt that appears every time is a signal that a rule should be written down, not a reason to switch approvals off.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Task                              Permission level
          Explain how the code works        Read-only
          Plan a change before editing      Read-only, then switch to manual approvals
          Fix a failing test                Manual approvals, approve the test command
          Clean up a throwaway scratch dir  Allow all, only in that scratch folder
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Reviewing a command before it runs',
    intro: 'Here is the prompt an assistant might show before it runs a cleanup. The command is written so that you can check the path first. Read the scope, decide, and then run only the safe version yourself.',
    example: {
      language: 'bash',
      runnable: false,
      code: code`
        # The assistant proposes this command:
        rm -rf build/ dist/ ~/Downloads

        # Check the scope before you allow it:
        #   build/ and dist/ are inside the project, which is expected.
        #   ~/Downloads is outside the project, so deny it.

        # The safer command you approve instead:
        rm -rf build/ dist/
      `,
    },
    steps: [
      { code: 'rm -rf build/ dist/ ~/Downloads', explanation: 'The proposed command. The `~/Downloads` part reaches outside the project, which the request never asked for.' },
      { code: '# build/ and dist/ are inside the project', explanation: 'These folders are the expected targets, so this part of the command matches the task.' },
      { code: '# ~/Downloads is outside the project, so deny it', explanation: 'Anything outside the project folder needs a clear reason, and this command gives none.' },
      { code: 'rm -rf build/ dist/', explanation: 'The narrower version you approve. It removes only the two folders the task names, and you can ask the assistant to rerun it.' },
    ],
  },
  tryIt: {
    instructions: [
      'Ask your assistant to run the reading-list tests, and read the approval prompt before you allow it. Note the exact command it names.',
      'Ask for an explanation of one function in read-only mode. Confirm that no file changed and no command ran.',
      'Find the permission setting in your tool, and write down its default level and what each level allows.',
    ],
  },
  mistakes: [
    { mistake: 'Choosing "Allow all" to stop the prompts.', fix: 'Keep manual approvals on for real projects. Allow all belongs only in a disposable folder.' },
    { mistake: 'Approving a command without reading its paths.', fix: 'Check every path. Stop at any path that leaves the project folder.' },
    { mistake: 'Using "Always allow" for a command you have only seen once.', fix: 'Approve once, watch it work, and widen the approval only after you have seen it behave.' },
  ],
  quiz: [
    {
      question: 'An approval prompt asks to run `pytest tests/`, which you asked for. What is the best choice?',
      options: [
        { text: 'Allow once, because the command matches the task you asked for', explanation: 'Yes. The command matches your request, and "allow once" limits the approval to this run.' },
        { text: 'Allow all for the rest of the project', explanation: 'That grants far more than this one test run needs.' },
        { text: 'Deny, because the assistant should never run tests', explanation: 'Running tests is a normal part of the work. Approve it when the command matches your request.' },
        { text: 'Edit the command to add sudo first', explanation: 'Adding elevated permissions makes the command riskier, not safer.' },
      ],
      answer: 0,
    },
    {
      question: 'The assistant proposes a cleanup command. Which part should make you stop and deny it?',
      options: [
        { text: 'A path that reaches outside the project, such as your home folder', explanation: 'Yes. Paths outside the project need a clear reason, and this one gives none.' },
        { text: 'The folder name build/', explanation: 'A build folder inside the project is the expected target of a cleanup.' },
        { text: 'The use of a command at all', explanation: 'Commands are normal. The scope of the command is the thing to check.' },
        { text: 'The fact that it is short', explanation: 'Short commands can be dangerous. Length is not the test; the paths are.' },
      ],
      answer: 0,
    },
    {
      question: 'When is read-only mode the right choice?',
      options: [
        { text: 'When you want an explanation or a review, and no file should change', explanation: 'Yes. Read-only lets the assistant read and answer without changing anything.' },
        { text: 'When you want the fastest possible changes to your files', explanation: 'Read-only blocks changes. Use manual approvals when you want edits.' },
        { text: 'When you want to install packages from the internet', explanation: 'Installing packages changes the environment, so read-only is the wrong mode.' },
        { text: 'Only when the project is disposable', explanation: 'Read-only is useful for any project, especially when you want answers and not changes.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'An approval is a decision about a specific command or path, so read it, keep the scope narrow, and use read-only when you only need answers.',
  resources: [
    { title: 'Manage approvals and permissions', provider: 'Visual Studio Code', description: 'Permission levels, tool approvals, and terminal auto-approval for Copilot agents in VS Code.', url: 'https://code.visualstudio.com/docs/agents/run/approvals' },
    { title: 'Agent approvals and security', provider: 'OpenAI', description: 'How Codex uses sandbox modes and approval policies, and how it handles network access.', url: 'https://learn.chatgpt.com/docs/agent-approvals-security' },
  ],
}

export default lesson
