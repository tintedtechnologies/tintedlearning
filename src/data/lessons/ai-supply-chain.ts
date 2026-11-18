import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Configuration and Secrets from Software Engineering, Packages and Environments, and the earlier lessons in this section. The audit runs on your own copy of Study Tracker.',
  goals: [
    'List every part your AI app depends on: packages, models, datasets, plugins and prompt templates',
    'Pin exact versions and verify downloaded files against a checksum from a trusted source',
    'Scan dependencies for known problems, and update them on a schedule rather than never',
  ],
  bigIdea: "Your AI app runs code and data that other people wrote: packages, models, datasets, plugins and even prompt templates copied from elsewhere. Each one is part of your supply chain, and an attacker or an accident in any link can reach your app. Known versions, verified files and regular scans keep those links honest.",
  whyItMatters: "Study Tracker installs a web framework, an HTTP client, a database driver and a model file. If the requirements file says only the package name, the next install may fetch a different version than the one you tested. If a model file is swapped for a modified copy on the way to you, the app runs whatever it contains, with your credentials.",
  goalSections: [
    {
      heading: 'Know everything you depend on',
      paragraphs: [
        "A dependency is any outside thing your app relies on. Your requirements file lists the packages you asked for, and each of those packages brings its own dependencies. Most of the code that runs in your app was written by someone else, and it is worth knowing how much.",
        "AI apps add more kinds of dependency. A model file comes from a model hub or a provider. A dataset comes from a website. A plugin or a prompt template comes from a forum post or a gist. Treat each one like a package: know where it came from, who published it and when you last checked it.",
      ],
      example: {
        language: 'text',
        code: code`
          Dependency            Where it came from            Checked by
          fastapi, httpx        Python package index          pinned version, scan
          sentence embedding    model hub, a named publisher   checksum, license
          notes sample dataset  a classroom shared file        reviewed for personal data
          prompt template       a forum post                   read in full before use
        `,
      },
    },
    {
      heading: 'Pin and verify',
      paragraphs: [
        "Pinning means naming the exact version you tested, such as an equals sign and a full version number, instead of a range or the bare name. A lock file records the whole tree, including the packages your packages need. Without pins, two installs a week apart can differ, and the difference may be a bug or a backdoor.",
        "A checksum is a fingerprint of a file. The publisher gives you the expected value, and your computer computes the value of the file you downloaded. If they differ, the file is not the one the publisher published, however it was delivered. Check the checksum before you use a model or dataset, every time you fetch it.",
      ],
      example: {
        language: 'text',
        code: code`
          Weak                          Better
          fastapi                       fastapi==<the version you tested>
          httpx>=0.27                   httpx==<the version you tested>
          model downloaded by name      model downloaded, then checked against the published checksum
        `,
      },
    },
    {
      heading: 'Scan and update on a schedule',
      paragraphs: [
        "A scanner compares your pinned versions with databases of published security problems. Run one before every release, and on a schedule in between, because new problems are reported about versions that were safe when you installed them. A scan that finds nothing today says nothing about next month.",
        "Keep a short record of each update, with the date, the old version, the new version and the reason. That record answers the question of what changed when something breaks. Pins are not a reason to freeze forever. Update on a schedule, read the release notes, run the tests and update the pin in the same change. A pin that is never updated becomes a known problem that you chose to keep.",
      ],
      example: {
        language: 'text',
        code: code`
          Task                              When
          scan pinned dependencies          before every release, and monthly
          read release notes for updates    when a scan reports a problem
          update one dependency at a time   with the tests run in the same change
          review a new model or dataset     before it is used, never by default
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Auditing Study Tracker\'s dependencies',
    intro: "The script below does two checks that need no network: it finds requirements that are not pinned, and it compares a downloaded model file with the copy you trust. The version numbers in the example are placeholders. Use the versions you tested in your own project.",
    example: {
      language: 'python',
      filename: 'audit_supply_chain.py',
      code: code`
        import hashlib

        REQUIREMENTS = """
        fastapi==1.2.3
        httpx>=1.0
        uvicorn
        """

        def unpinned(text):
            return [line for line in text.strip().splitlines() if "==" not in line]

        print("Not pinned:", unpinned(REQUIREMENTS))

        trusted = b"example model weights"
        downloaded = b"example model weights, tampered"
        expected = hashlib.sha256(trusted).hexdigest()
        print("Downloaded copy matches:", hashlib.sha256(downloaded).hexdigest() == expected)
      `,
      output: "Not pinned: ['httpx>=1.0', 'uvicorn']\nDownloaded copy matches: False",
    },
    steps: [
      { code: 'return [line for line in text.strip().splitlines() if "==" not in line]', explanation: "Every line without an exact pin is listed. Here, httpx has a minimum version and uvicorn has no version at all, so each install could fetch something new." },
      { code: 'expected = hashlib.sha256(trusted).hexdigest()', explanation: "The fingerprint of the trusted copy. In a real project the publisher gives you this value, and you store it in your repository." },
      { code: 'hashlib.sha256(downloaded).hexdigest() == expected', explanation: "The fingerprint of the file you downloaded. One changed byte gives a completely different value." },
      { code: 'print("Downloaded copy matches:", ... )', explanation: "False means the file is not the one that was published. Delete it and download it again from the source, and report the mismatch if it persists." },
    ],
  },
  tryIt: {
    instructions: [
      'Open `requirements.txt` in your Study Tracker folder and pin every package to the exact version you tested. Keep a lock file in the repository, and check that `python -m pytest` still passes after the change.',
      'Install `pip-audit` in a separate environment, and run it against your Study Tracker requirements. Write down each problem it reports, and decide whether to update, accept or remove the package.',
      'Add `test_supply_chain.py`. It should read `requirements.txt` and fail if any line lacks `==`, and it should check the stored checksum of your model file if you use one.',
    ],
  },
  mistakes: [
    { mistake: 'Installing unpinned packages in a project that will later be deployed.', fix: 'Pin exact versions and keep a lock file in the repository.' },
    { mistake: 'Using a model or dataset without checking its source or checksum.', fix: 'Record the publisher and the published checksum, and verify the file before every use.' },
    { mistake: 'Pasting a prompt template or code from a forum into the app without reading it.', fix: 'Read the whole snippet, remove anything you do not understand, and test it on its own first.' },
    { mistake: 'Pinning versions and never updating them.', fix: 'Scan on a schedule, and update one dependency at a time with the tests in the same change.' },
  ],
  quiz: [
    {
      question: 'Your requirements file says `uvicorn` with no version. Tomorrow a new release breaks the app. What is the root cause?',
      options: [
        { text: 'The new release is always wrong', explanation: 'New releases are often fine. The problem is that your file let the version change without a test.' },
        { text: 'The file does not pin the version, so each install can fetch a newer one', explanation: 'Without a pin, the install chooses the newest version it allows, which may not be the one you tested.' },
        { text: 'Uvicorn is not allowed in Python projects', explanation: 'Uvicorn is a normal package. The issue is the missing version, not the package.' },
        { text: 'The model deleted the lock file', explanation: 'The lock file is not related to this failure. The missing pin is the cause.' },
      ],
      answer: 1,
    },
    {
      question: 'You download a model file, and its checksum differs from the one the publisher lists. What should you do?',
      options: [
        { text: 'Use it, since a small difference does not matter', explanation: 'Any difference means the file is not the one that was published, and a small change can be a serious one.' },
        { text: 'Edit the published checksum so it matches your file', explanation: 'Changing the expected value hides the problem. It does not make the file trustworthy.' },
        { text: 'Do not use it. A mismatch means it is not the file the publisher published', explanation: 'Delete the file, download it again from the source, and report the mismatch if it continues.' },
        { text: 'Use it only in production, where the tests are stricter', explanation: 'Production is the place where a bad file does the most harm.' },
      ],
      answer: 2,
    },
    {
      question: 'A library asks for a permission that your app does not need. What should your dependency review do?',
      options: [
        { text: 'Accept it, since libraries are trusted', explanation: 'Trust should be earned by review, and an unexplained permission is exactly what review is for.' },
        { text: 'Ignore it, since the library is popular', explanation: 'Popularity does not show that a permission is needed for your app.' },
        { text: 'Add the permission to your app so the install works', explanation: 'Granting a permission to get past an error widens the attack surface for no reason.' },
        { text: 'Question why it needs the permission, and remove the dependency if the reason is unclear', explanation: 'An unexplained permission is a reason to replace or remove the dependency.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Know every package, model and dataset your AI app uses, pin exact versions, verify downloaded files against published checksums and scan and update on a schedule.',
  resources: [
    { title: 'pip-audit', provider: 'Python Packaging Authority', description: 'A tool that checks Python dependencies against known vulnerability databases.', url: 'https://pypi.org/project/pip-audit/' },
    { title: 'OWASP Top 10 for Large Language Model Applications', provider: 'OWASP GenAI Security Project', description: 'Covers supply chain vulnerabilities in models, datasets and plugins.', url: 'https://genai.owasp.org/llm-top-10/' },
  ],
  underTheHood: {
    heading: 'Why a hash catches tampering',
    paragraphs: [
      "A cryptographic hash function takes any input and produces a fixed-length fingerprint. The SHA-256 function used in the example produces the same output for the same bytes every time, and it is designed so that finding two different inputs with the same output is practically impossible. Changing one byte changes the whole fingerprint.",
      "That property makes the fingerprint useful for checking files. The publisher computes it once and shares it through a channel you trust, such as the project's own page or a signed release. You compute it again on your copy. If the two match, the file is the same one, and if they differ, something changed on the way.",
      "A checksum only helps if the expected value comes from a source you trust. If an attacker can change both the file and the checksum on the same unsafe page, the check passes and proves nothing. This is why signatures, which bind a publisher's identity to the file, are stronger than a bare checksum when they are offered.",
    ],
  },
}

export default lesson
