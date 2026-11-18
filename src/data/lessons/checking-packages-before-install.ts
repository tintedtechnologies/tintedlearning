import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain why an assistant may suggest a package that does not exist, or one with a lookalike name',
    'Check a package on its official registry before you install it: the name, the publisher, the source, and the history',
    'Keep a project\'s dependencies in a file you review, and install only from that list',
  ],
  bigIdea: 'A package is code you run on your computer, written by someone else. An assistant can suggest a name that does not exist, or a near-copy of a real name that an attacker published. Check each package on its official registry, confirm the source, and install only from a dependency file that you have reviewed.',
  whyItMatters: 'The assistant suggests installing a library for a date-parsing task. You run the install command, and it works, because someone published that exact name last week. The package is a copy with a hidden script that runs on install. The name looked right, and nothing in the terminal warned you. A two-minute check on the registry page would have caught it before the install ran. A check on the registry page would have shown a new publisher and no source code link.',
  goalSections: [
    {
      heading: 'Why assistants suggest the wrong packages',
      paragraphs: [
        'An assistant learns from a large amount of text, and it can remember a package name that is slightly wrong. It may suggest a name that was never published, or one that was published by someone who expected this mistake. Attackers register these names on purpose, so a missing package is sometimes filled by a harmful one.',
        'This risk is why you should not trust a name just because the assistant wrote it. The name is a claim. Check it before you run the install command, the same way you would check a link someone sent you. The name is a claim, and the registry page is the evidence.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Assistant suggests:   requests-dateparse
          Real library you want: python-dateutil

          The first name may not exist, or may be a new package from an unknown
          publisher. Look it up on the official registry before you install it.
        `,
      },
    },
    {
      heading: 'Checking a package on its registry',
      paragraphs: [
        'For Python packages, the official registry is PyPI, at pypi.org. For JavaScript packages, it is the npm registry, at npmjs.com. Search for the exact name and open its page. Check the publisher, the release history, the linked source repository, and whether the project has a clear description of what it does.',
        'A high download count is useful but not proof of safety. A brand-new package with a name close to a famous one is a warning sign, especially if its repository link is missing or points somewhere unexpected. When in doubt, ask the assistant to explain why it chose that name, then check the answer against the registry. Treat the explanation as a claim to verify, not as proof.',
      ],
      example: {
        language: 'bash',
        runnable: false,
        code: code`
          # Open the package's registry page before you install it (macOS; elsewhere, paste the address into a browser)
          open https://pypi.org/project/python-dateutil/

          # Show the registry page details for an npm package
          npm view some-package name version repository.url maintainers
        `,
      },
    },
    {
      heading: 'Installing only from a reviewed list',
      paragraphs: [
        'Keep the names your project uses in a dependency file, such as requirements.txt for Python or package.json for JavaScript. Review that file in your diff, as you would review any change. Install from the file, not from a name you copied from a chat, so the list is the one you approved. Review the file in your pull request, and the whole team sees the same list.',
        'Create a virtual environment for each project, so a package you install for one project does not change another. Pin versions when you can, so a later release does not change behavior without you noticing.',
      ],
      example: {
        language: 'bash',
        runnable: false,
        code: code`
          python3 -m venv .venv
          source .venv/bin/activate          # on Windows PowerShell: .venv\Scripts\Activate.ps1
          python -m pip install -r requirements.txt
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Comparing suggested names with an approved list',
    intro: 'This check compares the names an assistant suggests with the names you have already reviewed. Any name that is not on the approved list needs a registry check before you install it. Run the check and read the one name it flags.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'check_packages.py',
      code: code`
        approved = {"pytest", "requests", "fastapi"}
        suggested = ["pytest", "reqeusts", "fastapi"]
        for name in suggested:
            if name not in approved:
                print("Check on the registry before installing:", name)
      `,
      output: 'Check on the registry before installing: reqeusts',
    },
    steps: [
      { code: 'approved = {"pytest", "requests", "fastapi"}', explanation: 'A set of the names you have reviewed and approved for this project.' },
      { code: 'suggested = ["pytest", "reqeusts", "fastapi"]', explanation: 'The names an assistant suggested. One of them is misspelled, which is an easy mistake to miss.' },
      { code: 'if name not in approved:', explanation: 'Checks each suggested name against the approved set. Anything missing from the set needs a look.' },
      { code: 'print("Check on the registry before installing:", name)', explanation: 'Flags the name for a registry check. The check is a person looking at the registry page, not an automatic approval.' },
    ],
  },
  tryIt: {
    instructions: [
      'Ask your assistant to suggest one library for the reading-list project. Look up the exact name on the official registry and note the publisher and source link.',
      'Write a requirements.txt with the names you approved. Create a virtual environment and install from the file.',
      'Run the approved-list check with the names your assistant suggested. Investigate each flagged name before you install it.',
    ],
  },
  mistakes: [
    { mistake: 'Installing a name because the assistant wrote it and the install command worked.', fix: 'Check the name on the registry first. A working install does not prove the package is the one you meant.' },
    { mistake: 'Installing into the global Python or Node environment.', fix: 'Use a virtual environment for each project, so one package cannot change another project.' },
    { mistake: 'Installing packages without writing them in a dependency file.', fix: 'Put every approved name in requirements.txt or package.json, and install from that file.' },
  ],
  quiz: [
    {
      question: 'An assistant suggests a package name you have never seen. What should you do first?',
      options: [
        { text: 'Look up the exact name on the official registry and check its publisher and source link', explanation: 'Yes. The registry page tells you who published it and where the code lives.' },
        { text: 'Install it, because the assistant chose it', explanation: 'The assistant can suggest names that are missing or harmful. Check before you install.' },
        { text: 'Install it globally, so it is available everywhere', explanation: 'Global installs spread the risk to every project. Use a project virtual environment.' },
        { text: 'Copy the install command from a random blog post', explanation: 'Use the registry page for the name, not a copied command from an unknown source.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this check print?',
      code: { language: 'python', runnable: true, code: code`
        approved = {"pytest", "requests"}
        suggested = ["pytest", "reqeusts"]
        for name in suggested:
            if name not in approved:
                print("Check:", name)
      ` },
      options: [
        { text: 'Check: reqeusts', explanation: 'Yes. The misspelled name is not in the approved set, so it is flagged.' },
        { text: 'Check: pytest', explanation: 'pytest is in the approved set, so it is not flagged.' },
        { text: 'Nothing', explanation: 'Nothing is printed only when every name is approved, and this name is not.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why use a virtual environment for each project?',
      options: [
        { text: 'So a package installed for one project does not change another project', explanation: 'Yes. Each project has its own packages, so one change cannot spread to every project on the computer.' },
        { text: 'So the package registry can verify the packages', explanation: 'Verification is not the job of a virtual environment. It isolates the packages on your computer.' },
        { text: 'So the assistant can see the packages faster', explanation: 'Speed is not the reason. Isolation keeps projects from interfering with each other.' },
        { text: 'So you never have to write a dependency file', explanation: 'A virtual environment does not replace the dependency file. Keep both.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Check every suggested package on its official registry, install only from a dependency file you have reviewed, and keep each project in its own environment.',
  resources: [
    { title: 'Python Packaging User Guide: Installing packages', provider: 'Python Packaging Authority', description: 'How to install packages with pip, use virtual environments, and pin requirements.', url: 'https://packaging.python.org/en/latest/tutorials/installing-packages/' },
    { title: 'npm: Packages and modules', provider: 'npm', description: 'How npm packages are published, named, and inspected before installation.', url: 'https://docs.npmjs.com/packages-and-modules' },
  ],
}

export default lesson
