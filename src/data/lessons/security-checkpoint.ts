import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Review a small web application against the security topics in this section',
    'Record each finding with its evidence, its risk, and its fix',
    'Write a short security report that a developer and a non-technical owner can both act on',
  ],
  bigIdea: 'A security review is a structured walk through the application, asking the same questions about each part: who can reach it, what data it handles, how it checks identity and permission, and how it fails. Each finding needs evidence, a risk in plain words, and a fix with an owner. This checkpoint combines the lessons on passwords, encryption, web coding, phishing, threat modeling, and monitoring.',
  whyItMatters: 'Most security problems that reach users were visible in the code, the settings, or the process before release, and nobody checked them in one place. A consistent review catches the easy problems first, and it leaves a record that shows what was checked. Teams that review this way fix more before launch, and they explain the risk to owners without jargon.',
  goalSections: [
    {
      heading: 'Walk through the application',
      paragraphs: [
        'Start from the threat model. Redraw the data flows and trust boundaries for the application, and list its assets. This tells you where to look hardest, such as the login, the admin pages, and any place where user text reaches the database or a page.',
        'Go through each area with the same questions. Can someone reach this without logging in? Does the server check permission for every request? Is user text escaped and kept out of commands? Are passwords hashed and second factors offered? Are secrets kept out of the code? Are the important events logged, without the secrets?',
        'Test rather than read only. Try a request you should be refused, such as opening another user\'s record, and record the result. A test that a control works is stronger evidence than a comment that says it does.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Login: can a page be reached without signing in? Are passwords hashed and second factors offered?
          Data: is personal data encrypted in transit and at rest, and are secrets kept out of the code?
          Input: is user text kept out of commands and escaped where it is shown?
          Access: does the server check ownership on every request? Test one refused action with a second account.
        `,
      },
    },
    {
      heading: 'Record findings clearly',
      paragraphs: [
        'Each finding gets four parts: what you found, the evidence that shows it, the risk in plain words, and the fix with an owner. "Changing the record number opens another user\'s notes, so any student can read any note" is a finding a non-expert can understand and a developer can fix.',
        'Rank findings by likelihood and impact, using the same method as the threat modeling lesson. Put the two or three most serious findings first, and mark the rest as improvements. A report of forty equal items is hard to act on.',
        'Separate what you tested from what you only read. Say which findings you confirmed by testing, and which you believe from the code but have not yet tested, so the reader knows how much weight each one carries.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          findings = [
              {"title": "note read by changing its number", "severity": 5, "confirmed": True},
              {"title": "passwords stored with a fast hash", "severity": 4, "confirmed": False},
              {"title": "no security logging for exports", "severity": 3, "confirmed": True},
          ]
          ranked = sorted(findings, key=lambda f: f["severity"], reverse=True)
          for f in ranked:
              status = "confirmed" if f["confirmed"] else "from code review, to test"
              print(f["severity"], f["title"], "-", status)
        `,
        output: '5 note read by changing its number - confirmed\n4 passwords stored with a fast hash - from code review, to test\n3 no security logging for exports - confirmed',
      },
    },
    {
      heading: 'Write the report and plan the fixes',
      paragraphs: [
        'Open the report with a summary of three sentences: what was reviewed, the most serious risk, and what must happen before launch. Then list the findings in rank order, and keep each one short enough to read in a minute.',
        'Plan the fixes in order. The first fix should remove the most serious risk with the least effort. Assign each fix an owner and a date, and schedule a retest, so the report leads to a verified change rather than a list that nobody revisits.',
        'Be honest about limits. State what the review did not cover, such as the hosting setup or third-party services, and recommend a review for those separately. A report that names its limits is more trusted than one that claims to cover everything.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Summary: three sentences on what was reviewed, the most serious risk, and what must change before launch.
          Findings: ranked, each with evidence, a plain-language risk, and a fix with an owner and a date.
          Limits: hosting and third-party services were not reviewed, and a separate review is recommended for them.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Deciding what must be fixed before launch',
    intro: 'The program above lists the findings in a review and decides which ones block launch. A finding blocks launch when it is severe and confirmed by testing. Run it, then mark the unconfirmed password finding as confirmed and predict whether it blocks launch.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        findings = [
            ("note read by changing its number", 5, True),
            ("passwords stored with a fast hash", 4, False),
            ("no logging for exports", 3, True),
        ]
        blocking = [title for title, severity, confirmed in findings if severity >= 4 and confirmed]
        print("must fix before launch:", blocking)
        print("total findings:", len(findings))
      `,
      output: "must fix before launch: ['note read by changing its number']\ntotal findings: 3",
    },
    steps: [
      { code: 'if severity >= 4 and confirmed', explanation: 'A finding blocks launch only when it is serious and confirmed. An untested finding still needs attention, but it is a different kind of decision.' },
      { code: 'blocking = [...]', explanation: 'Collects the blocking findings in the order they were recorded, so the list is easy to act on.' },
      { code: 'print("total findings:", len(findings))', explanation: 'Reports the full count, so the blocking list is not mistaken for the whole review.' },
    ],
  },
  tryIt: {
    instructions: [
      'Choose a small web application you have built or can test, and list its five most important assets and its trust boundaries.',
      'Test one protected action with a different user account. Write the finding, the evidence, the risk in plain words, and the fix.',
      'Write a three-sentence summary of a security review for an owner who is not technical, and name one limit of your review.',
    ],
  },
  mistakes: [
    { mistake: 'Reporting findings from reading the code without testing them.', fix: 'Test what you can, and label every finding as confirmed or still to test.' },
    { mistake: 'Listing many equal findings with no ranking.', fix: 'Rank by likelihood and impact, and put the most serious first.' },
    { mistake: 'Claiming the review covered everything.', fix: 'State the limits, such as hosting or third-party services, and recommend those separately.' },
  ],
  quiz: [
    {
      question: 'Why is a confirmed finding stronger evidence than one read only from the code?',
      options: [
        { text: 'Because a test shows the control really fails or works, not just that it looks wrong', explanation: 'Yes. A test shows actual behavior, which is stronger evidence.' },
        { text: 'Because confirmed findings are always more severe', explanation: 'Severity and confirmation are separate. A confirmed finding can be minor.' },
        { text: 'Because reading code is not allowed', explanation: 'Reading code is useful. Testing adds evidence that it behaves as read.' },
        { text: 'Because the owner requires it', explanation: 'The reason is the strength of evidence, not a rule.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print as the blocking finding?',
      code: { language: 'python', runnable: true, code: code`
        findings = [("a", 5, False), ("b", 4, True), ("c", 2, True)]
        blocking = [t for t, s, c in findings if s >= 4 and c]
        print(blocking)
      ` },
      options: [
        { text: "['a']", explanation: 'Finding a is severe but not confirmed, so it does not block under this rule.' },
        { text: "['b']", explanation: 'Yes. Finding b is severe and confirmed.' },
        { text: "['c']", explanation: 'Finding c is confirmed but not severe enough.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why should a security report state what it did not cover?',
      options: [
        { text: 'So the reader knows where the remaining risk is and can arrange a separate review', explanation: 'Yes. Naming limits lets the owner plan for the parts not checked.' },
        { text: 'So the report is shorter', explanation: 'Length is not the reason. The limits matter for the decisions.' },
        { text: 'So the developers can skip those areas', explanation: 'Stating limits should lead to review of those areas, not avoidance.' },
        { text: 'So the report can be published without review', explanation: 'Limits are for the readers of the report, not a publication rule.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A security review walks each area with the same questions, tests rather than only reads, records each finding with evidence and a plain-language risk, ranks the results, and states its limits.',
  resources: [
    { title: 'OWASP Application Security Verification Standard', provider: 'OWASP', description: 'A checklist of security requirements for web applications, useful for structured reviews.', url: 'https://owasp.org/www-project-application-security-verification-standard/' },
    { title: 'Web Security Testing Guide', provider: 'OWASP', description: 'Methods for testing web applications, with steps for each category of risk.', url: 'https://owasp.org/www-project-web-security-testing-guide/' },
  ],
}

export default lesson
