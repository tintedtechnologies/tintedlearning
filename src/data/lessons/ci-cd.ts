import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain how continuous integration tests every change automatically',
    'Explain how continuous delivery releases the same tested build the same way every time',
    'Plan how to undo a bad release and keep settings separate from code',
  ],
  bigIdea: "CI/CD means letting a robot check and release your code instead of doing it by hand. Continuous integration (CI) runs the tests on every change. Continuous delivery (CD) packages the version that passed and releases it through the same steps every time, so releasing becomes routine instead of risky.",
  whyItMatters: "A team releases by hand on Friday evenings: someone copies files to the server, runs a few commands from memory, and hopes. One week they forget a step, the site breaks, and nobody can remember exactly what changed. With CI/CD, every release runs the same tested steps, records what went out, and can be rolled back in minutes.",
  goalSections: [
    {
      heading: 'Continuous integration: test every change',
      paragraphs: [
        "Developers save their changes in a shared Git repository, usually on a site like GitHub. With continuous integration, every time someone pushes a change or opens a pull request (a request to merge their change), a service automatically downloads the code, installs it and runs the tests.",
        "The result appears next to the change as a green tick or a red cross. Teams usually block merging until the checks pass, so broken code cannot reach the main branch.",
        "Integrating small changes often, several times a day, keeps problems small. Merging two weeks of work at once creates conflicts that take days to untangle. A fast pipeline helps too: if CI takes an hour, people stop waiting for it, so aim for checks that finish within ten minutes.",
      ],
      example: {
        language: 'text',
        code: code`
          developer pushes a change
            -> CI starts a fresh machine
            -> installs dependencies
            -> runs linting (style checks) and tests
            -> green tick: ready to merge
               red cross: fix first, the main branch stays safe
        `,
      },
    },
    {
      heading: 'Continuous delivery: one build, released the same way',
      paragraphs: [
        "After CI passes on the main branch, the pipeline builds a release package, called an artifact, such as a container image. It is labeled with the exact version of the code it came from.",
        "That same artifact moves through environments: first a staging environment, a copy of production for final checks, then production, the live system real users see. Never rebuild for production. Rebuilding could pick up different library versions and release something nobody tested.",
        "With continuous delivery, the final step to production is one button press by a person. With continuous deployment, it happens automatically when every check passes. Either way, the steps are the same every time, so a release on Friday is no riskier than one on Tuesday.",
      ],
      example: {
        language: 'text',
        code: code`
          main branch passes CI
            -> build image: shop-app:4f9c2a1  (named after the code version)
            -> deploy shop-app:4f9c2a1 to staging, run smoke tests
            -> approve
            -> deploy the same shop-app:4f9c2a1 to production
        `,
      },
    },
    {
      heading: 'Rollbacks and settings',
      paragraphs: [
        "Some bad releases will slip through. Plan for that by keeping previous artifacts, so a rollback means redeploying the last good version, which takes minutes and needs no new code.",
        "Keep settings that differ between environments, such as database addresses, out of the artifact. Pass them in as environment variables when the app starts. Secrets come from a secret manager. Then one artifact works in staging and production with different settings.",
        "After each release, watch error rates and response times for a few minutes. Many pipelines roll back automatically if errors jump.",
      ],
      example: {
        language: 'text',
        code: code`
          09:00  deploy shop-app:4f9c2a1     errors 0.1%
          09:04  error rate jumps to 6%
          09:05  roll back to shop-app:8e1b7d0 (the previous good version)
          09:07  errors back to 0.1%; investigate 4f9c2a1 calmly
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A real CI workflow file, line by line',
    intro: "GitHub Actions reads workflow files from the `.github/workflows/` folder of a repository. This one runs a Python project's tests on every push and pull request. It is written in YAML, a format of indented key and value lines.",
    example: {
      language: 'text',
      code: code`
        name: tests
        on: [push, pull_request]
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
              - uses: actions/setup-python@v5
                with:
                  python-version: "3.12"
              - run: python -m pip install -r requirements.txt
              - run: python -m pytest
      `,
    },
    steps: [
      { code: 'on: [push, pull_request]', explanation: "The triggers. Every push and every pull request starts this workflow, so no change escapes testing." },
      { code: 'runs-on: ubuntu-latest', explanation: "GitHub starts a fresh Linux machine for each run. Nothing left over from earlier runs can hide a problem." },
      { code: '- uses: actions/checkout@v4', explanation: "A ready-made step that downloads your repository's code onto that machine. `@v4` pins the version of the step." },
      { code: '- uses: actions/setup-python@v5\n  with:\n    python-version: "3.12"', explanation: "Installs the exact Python version your project uses, so tests run the same way every time." },
      { code: '- run: python -m pip install -r requirements.txt', explanation: "Installs the project's pinned dependencies, exactly as a new teammate would." },
      { code: '- run: python -m pytest', explanation: "Runs the tests. If any fail, the command fails, the run shows a red cross, and the pull request can be blocked from merging." },
    ],
  },
  mistakes: [
    { mistake: 'Rebuilding the app separately for production.', fix: 'Build one artifact, test it, and promote that exact artifact through every environment.' },
    { mistake: 'Writing database addresses or passwords into the code or the image.', fix: 'Pass settings in as environment variables and fetch secrets from a secret manager at start-up.' },
    { mistake: 'Releasing without a tested way to go back.', fix: 'Keep previous artifacts and practice a rollback before you need one in a hurry.' },
  ],
  quiz: [
    {
      question: 'A pull request shows a red cross from CI. What does that most likely mean?',
      options: [
        { text: 'The change has already been released to users', explanation: 'CI runs before merging. A red cross is a warning before anything is released.' },
        { text: 'GitHub is having an outage', explanation: 'Possible, but rare. The usual cause is a failing check in your own code.' },
        { text: 'The change has been approved', explanation: 'Approval is a separate review step. The cross is about automated checks.' },
        { text: 'At least one automated check, such as a test, failed for this change', explanation: 'CI ran the checks on the change and something did not pass, so it should be fixed before merging.' },
      ],
      answer: 3,
    },
    {
      question: 'Version 4f9c2a1 passed all checks in staging. What should be deployed to production?',
      options: [
        { text: 'The exact same 4f9c2a1 artifact that was tested', explanation: 'Promoting the identical artifact means production runs exactly what was tested.' },
        { text: 'A fresh build of the main branch', explanation: 'A new build might include later changes or different library versions that were never tested.' },
        { text: 'The code copied by hand from a developer\'s laptop', explanation: 'That skips every check and leaves no record of what was released.' },
        { text: 'Nothing, staging is enough', explanation: 'Staging exists to check releases before they reach production, not to replace it.' },
      ],
      answer: 0,
    },
    {
      question: 'Right after a release, errors jump from 0.1% to 6%. What is the best first move?',
      options: [
        { text: 'Write a fix and push it straight to production', explanation: 'A rushed fix may fail too. Restore service first, then fix calmly.' },
        { text: 'Wait an hour to see whether errors settle', explanation: 'Users suffer the whole time. A known good version is available right now.' },
        { text: 'Roll back to the previous good artifact, then investigate', explanation: 'Redeploying the last good version restores service in minutes, without any new code.' },
        { text: 'Turn off the error monitoring', explanation: 'That hides the problem from you, not from your users.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'Let CI test every change automatically, build one artifact and promote it unchanged through staging to production, and keep settings outside the artifact so you can roll back in minutes.',
  resources: [
    { title: 'Understanding GitHub Actions', provider: 'GitHub', description: 'The official introduction to workflows, jobs and steps.', url: 'https://docs.github.com/en/actions/about-github-actions/understanding-github-actions' },
    { title: 'Building and testing Python', provider: 'GitHub', description: 'A ready-made workflow guide for Python projects.', url: 'https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-python' },
  ],
  underTheHood: {
    heading: 'Releasing safely to a few users first',
    paragraphs: [
      "Even with good tests, some problems only appear with real users and real traffic. Two release patterns limit the damage.",
      "A blue-green deployment runs two identical production environments. Blue serves users while green receives the new version. After checks pass on green, the load balancer switches all traffic to green in one step. If anything goes wrong, it switches straight back to blue.",
      "A canary release sends the new version to a small share of users first, say 5%, named after the canaries miners once carried to detect gas. The pipeline compares the canary's error rate and speed with the old version. If they look healthy, the share grows to 25%, then 100%. If not, the canary is removed, and only a few users ever saw the problem.",
    ],
  },
}

export default lesson
