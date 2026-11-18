import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Draw a simple data-flow picture of an application, with its trust boundaries',
    'Use the STRIDE categories to list the threats for each part of the picture',
    'Rank threats by likelihood and impact, and choose the defenses to build first',
  ],
  bigIdea: 'Threat modeling asks four questions in order: what are we building, what can go wrong, what will we do about it, and did we do a good enough job. A picture of the data flows shows where trust changes, and the STRIDE categories give a checklist for what can go wrong at each step. The output is a short, ranked list of threats with owners.',
  whyItMatters: 'A team builds a photo-sharing app for a school. They spend three weeks on encryption for the storage layer, then discover that anyone can view a private album by changing a number in the web address. A ten-minute threat model would have shown the access check was the biggest risk, and it would have been built first. Threat modeling points effort at the risks that matter.',
  goalSections: [
    {
      heading: 'Draw what you are building',
      paragraphs: [
        'Start with a simple diagram. Draw the users, the app, the database, any outside services, and the arrows that carry data between them. Label each arrow with what travels along it, such as login details, photos, or payment information. A diagram nobody can read will not catch threats, so keep it plain.',
        'Draw the trust boundaries as dashed lines. A trust boundary is wherever the level of trust changes: the internet and your server, a public web page and an admin page, your app and a third-party service. Most threats happen where data crosses one of these lines.',
        'Name the assets, meaning the things worth protecting: user accounts, personal data, the ability to publish content, and the company\'s reputation. Knowing the assets tells you which threats are serious.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          [Student browser] --login, photos--> | trust boundary | [Web app] --queries--> [Database]
                                                                      |
                                                                  [Image storage]
          Assets: student accounts, private photos, the school's reputation
        `,
      },
    },
    {
      heading: 'Walk through STRIDE',
      paragraphs: [
        'STRIDE is a checklist of six threat types. Spoofing is pretending to be someone else. Tampering is changing data without permission. Repudiation is denying an action with no record to prove it. Information disclosure is exposing data to people who should not see it. Denial of service is making a service unavailable. Elevation of privilege is gaining more access than you were given.',
        'For each arrow and each part of the diagram, ask which STRIDE types apply. A login form can be spoofed, a photo upload can be tampered with, an admin action without a log can be repudiated, and a private album URL can disclose data. The question is not whether a threat exists, but whether it is plausible and how bad it would be.',
        'Write each threat as a sentence with an attacker, a method, and an effect. "A student changes the album number in the address to view a private album, exposing photos of other students" is specific enough to act on. "Security problem" is not.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Spoofing: someone logs in as another student.
          Tampering: a photo is changed after upload.
          Repudiation: an admin deletes an album and no log shows who did it.
          Information disclosure: a private album is readable by changing its number.
          Denial of service: a flood of uploads fills the storage.
          Elevation of privilege: a student gains the teacher role by editing a form field.
        `,
      },
    },
    {
      heading: 'Rank threats and choose defenses',
      paragraphs: [
        'Score each threat for likelihood and impact on a simple scale, such as one to five. Multiply the two to get a rough priority. A likely threat with severe impact comes first, even if a rare threat sounds more dramatic.',
        'For the top threats, choose a defense and name who will build it. Prefer simple, strong controls, such as an ownership check on every request, over complex ones that are hard to get right. Record the threats you have accepted, with the reason, so the decision is visible later.',
        'Revisit the model when the design changes. A new feature, a new outside service, or a new kind of user adds new data flows and new threats, and a model that is never updated becomes a record of an app that no longer exists.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          threats = [
              ("view private album by changing the address", 5, 5),
              ("guessed passwords on accounts", 4, 4),
              ("tampered photo file size", 2, 2),
          ]
          ranked = sorted(threats, key=lambda t: t[1] * t[2], reverse=True)
          for name, likelihood, impact in ranked:
              print(likelihood * impact, name)
        `,
        output: '25 view private album by changing the address\n16 guessed passwords on accounts\n4 tampered photo file size',
      },
    },
  ],
  seeItInAction: {
    title: 'Ranking threats for the first build',
    intro: 'The program above ranks three threats by likelihood times impact and shows the order to build defenses in. Run it, then change the likelihood of the tampering threat to five and predict whether its position changes.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        threats = {
            "private album exposed by address change": (5, 5),
            "guessed passwords": (4, 4),
            "photo file tampered": (2, 2),
        }
        ranking = sorted(threats.items(), key=lambda item: item[1][0] * item[1][1], reverse=True)
        for name, (likelihood, impact) in ranking:
            print(likelihood * impact, name)
      `,
      output: '25 private album exposed by address change\n16 guessed passwords\n4 photo file tampered',
    },
    steps: [
      { code: 'threats = {...}', explanation: 'Each threat with its likelihood and impact, each on a one-to-five scale.' },
      { code: 'key=lambda item: item[1][0] * item[1][1]', explanation: 'The priority is likelihood times impact, so a likely and severe threat rises to the top.' },
      { code: 'print(likelihood * impact, name)', explanation: 'Shows the score next to each threat, so the team can see why the order is what it is.' },
    ],
  },
  tryIt: {
    instructions: [
      'Draw the data flows for an app you use, with at least one trust boundary. Label what crosses each arrow.',
      'Write one threat for each of three STRIDE categories for that app, in the form attacker, method, and effect.',
      'Change the photo tampering threat in the seItInAction example to likelihood 5 and impact 5, and predict the new order. Run it to check.',
    ],
  },
  mistakes: [
    { mistake: 'Starting with tools and controls before drawing the system.', fix: 'Draw the data flows and trust boundaries first, then list threats.' },
    { mistake: 'Writing vague threats such as security problem.', fix: 'Name the attacker, the method, and the effect in every threat.' },
    { mistake: 'Ranking threats by how dramatic they sound.', fix: 'Score likelihood and impact separately, then rank by their product.' },
  ],
  quiz: [
    {
      question: 'In STRIDE, what does "information disclosure" mean?',
      options: [
        { text: 'Data is exposed to people who should not see it', explanation: 'Yes. Disclosure is about private data becoming visible to the wrong people.' },
        { text: 'A service becomes unavailable', explanation: 'That is denial of service, a different category.' },
        { text: 'A user gains more access than allowed', explanation: 'That is elevation of privilege.' },
        { text: 'Data is changed without permission', explanation: 'That is tampering.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print first?',
      code: { language: 'python', runnable: true, code: code`
        threats = [("a", 2, 3), ("b", 4, 1)]
        ranked = sorted(threats, key=lambda t: t[1] * t[2], reverse=True)
        print(ranked[0][0], ranked[0][1] * ranked[0][2])
      ` },
      options: [
        { text: 'a 6', explanation: 'Yes. Threat a scores 2 times 3, which is 6, and threat b scores 4.' },
        { text: 'b 4', explanation: 'Threat b scores 4, which is lower than threat a.' },
        { text: 'a 2', explanation: 'That is the likelihood alone, not the priority.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why should a threat model be revisited?',
      options: [
        { text: 'Because new features and services add new data flows and new threats', explanation: 'Yes. A model that is not updated describes an app that no longer exists.' },
        { text: 'Because the diagram must be redrawn every day', explanation: 'Updates follow design changes, not a daily schedule.' },
        { text: 'Because threats expire after one year', explanation: 'Threats do not expire on a fixed date. The design changes are what matter.' },
        { text: 'Because the model cannot be stored', explanation: 'Models can be stored and updated.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Draw the data flows and trust boundaries, walk each part through STRIDE, score threats by likelihood and impact, and build the defenses for the top of the list first.',
  resources: [
    { title: 'Threat Modeling Manifesto and resources', provider: 'OWASP', description: 'An overview of threat modeling methods, including STRIDE, with practical guidance.', url: 'https://owasp.org/www-community/Threat_Modeling' },
    { title: 'Threat modeling', provider: 'Microsoft', description: 'Microsoft guidance on the STRIDE model, with worked examples.', url: 'https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool' },
  ],
}

export default lesson
