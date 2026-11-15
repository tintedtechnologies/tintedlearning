import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'System Design and Architecture Patterns, and the Foundations lesson on identity and access, which introduced least privilege.',
  goals: [
    'Connect sign-in to an organization\'s existing accounts with single sign-on',
    'Take data from existing systems with the least access, and be clear about who owns each copy',
    'Plan the reviews and approvals an organization needs before go-live',
  ],
  bigIdea: "Enterprise integration means fitting a new system into an organization that already has accounts, data and rules. Instead of building your own logins, you trust the organization's identity system. Instead of copying data freely, you take only what you need through approved interfaces, and instead of just launching, you pass the reviews that let the organization trust you with its people's data.",
  whyItMatters: "The university will not let 20,000 students create new passwords for Study Tracker. It will not email you a spreadsheet of who is in which class. And it will not switch anything on until its security and data protection teams approve. Teams who discover this a week before launch miss the term. Teams who plan for it from the first week make integration a predictable part of the project.",
  goalSections: [
    {
      heading: 'Single sign-on',
      paragraphs: [
        "With single sign-on, or SSO, students sign in with the university account they already have, including its multi-factor authentication. Study Tracker never sees or stores a password. Modern apps usually use OpenID Connect, or OIDC, a sign-in standard built on OAuth 2.0. Older enterprise systems often use SAML, an earlier standard.",
        "The flow: Study Tracker sends the student to the university's identity provider. The student signs in there. The identity provider sends them back with a signed token holding claims, facts such as a user ID, an email and group memberships. Study Tracker checks the signature and the token's details, then starts its own session.",
        "Groups tell you a role, such as student or teacher, but authorization stays in your code: a teacher sees totals only for classes they actually teach. When someone leaves the university, their account is disabled centrally, so they can no longer sign in, and a deprovisioning process should also remove or archive their data in Study Tracker.",
      ],
      example: {
        language: 'text',
        code: code`
          Claims inside a verified sign-in token (example values):
          {
            "iss":    "https://login.example-university.edu",   who issued it
            "aud":    "study-tracker",                           who it is for
            "sub":    "a81f-77c2",                               stable user ID
            "email":  "student@example-university.edu",
            "groups": ["students", "bio-101-2026fa"],
            "exp":    1794700800                                 when it expires
          }
        `,
      },
    },
    {
      heading: 'Data from existing systems',
      paragraphs: [
        "Class lists live in the university's student information system, which is the system of record: the official source of that data. Ask for access through its official interface, using a service account that can only read, and only the fields you need, such as course codes and enrolled student IDs. Grades and home addresses stay out, because data you never receive can never leak.",
        "Study Tracker keeps a copy, refreshed on a schedule or when the source sends a change notification. It never edits that copy, records when it was last synced, and deletes entries when the source does. When the copy and the source disagree, the source wins.",
        "Put all translation in one adapter module, a pattern also called an anti-corruption layer. It turns the source's names and formats into Study Tracker's, so when the source system changes, one file changes with it.",
      ],
      example: {
        language: 'python',
        code: code`
          sis_record = {
              "PERSON_ID": "00041729",
              "CRS_CODE": "BIO-101",
              "TERM": "2026FA",
              "GRADE": "B+",
              "HOME_ADDRESS": "12 Example Street",
          }


          def to_enrollment(record):
              """Translate one row into Study Tracker's names, keeping only what it needs."""
              return {"student_id": record["PERSON_ID"], "course": record["CRS_CODE"].lower(), "term": record["TERM"]}


          print(to_enrollment(sis_record))
        `,
        output: "{'student_id': '00041729', 'course': 'bio-101', 'term': '2026FA'}",
      },
    },
    {
      heading: 'Reviews and approvals',
      paragraphs: [
        "Organizations protect their people with reviews. Expect a security review of your architecture and practices, a data protection review, often called a privacy impact assessment, an accessibility review, a legal check of your suppliers' terms and a change management process that schedules the launch and asks for a rollback plan.",
        "AI features raise extra questions. Are students' notes sent to an outside model provider? Does that provider store them, or train on them? Where is the data processed? Can teachers see students' notes? Is a person involved before AI output affects anyone? Have clear, documented answers ready.",
        "Start the reviews early, because they run on the organization's schedule, not yours. Most ask for the same few documents, so prepare them once: a data flow diagram, a list of personal data with the purpose of each item, how long each is kept, the outside services involved and who to contact in an incident.",
      ],
      example: {
        language: 'text',
        code: code`
          Prepare once, reuse in every review
          [ ] Data flow diagram: browser, API, database, storage, AI provider
          [ ] Personal data list: each field, why it is needed, how long it is kept
          [ ] Outside services: AI provider, cloud host, what each receives
          [ ] AI answers: training on data? where processed? human review?
          [ ] Access model: who can see what, enforced where
          [ ] Incident contacts and the rollback plan
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Connecting Study Tracker to the university',
    intro: "Here is a realistic integration plan for the launch, in the order the work has to start. Notice how much of it is waiting on other teams, which is why it starts in the first week.",
    example: {
      language: 'text',
      code: code`
        Week 1   Request an OIDC app registration from the identity team
                 Submit the privacy impact assessment with the data list
        Week 2   Request a read-only service account for the class list interface:
                 course codes and student IDs only
        Week 3   Build sign-in: verify token signature, issuer, audience and expiry
                 Build the enrollment adapter and a nightly sync
        Week 5   Security review: architecture, access model, AI data handling
        Week 6   Answer review questions; confirm the AI provider's terms do not
                 allow training on student data
        Week 8   Accessibility review; change request with the rollback plan
        Week 10  Approved launch window: the first week of term
      `,
    },
    steps: [
      { code: 'Week 1 Request an OIDC app registration', explanation: "The identity team registers Study Tracker and gives it a client ID, the value that will appear as the token's audience. Nothing about sign-in can be tested until this exists." },
      { code: 'Submit the privacy impact assessment', explanation: "The longest review starts first. The data list from System Design does most of the work." },
      { code: 'course codes and student IDs only', explanation: "Asking for the minimum makes the request easier to approve and the system safer to run. Least privilege applies to data as well as permissions." },
      { code: 'verify token signature, issuer, audience and expiry', explanation: "Each check stops a different attack: a forged token, a token from another identity provider, a token meant for another app and an old stolen token. Under the hood explains the signature." },
      { code: 'confirm the AI provider\'s terms do not allow training on student data', explanation: "An AI-specific question that reviewers increasingly ask. The answer comes from the provider's contract and settings, so check them before the review, not during it." },
      { code: 'Week 10 Approved launch window', explanation: "Change management sets the date. Launching outside the approved window, even when the software is ready, breaks the trust the reviews built." },
    ],
  },
  tryIt: {
    instructions: [
      'Write the personal data list for the university Study Tracker: every field, why it is needed and how long it should be kept.',
      'Extend the adapter example so it also skips any record whose term is not the current one, and test it with two records.',
      'Draft short, honest answers to the five AI questions in Reviews and approvals, for the model provider you use.',
      'Turn the integration plan above into your own timeline, and mark every step that depends on another team.',
    ],
    evidencePrompt: {
      label: 'Your integration plan',
      placeholder: 'For example: Personal data: student ID (to link sessions, kept while enrolled), notes (for the assistant, deleted 30 days after leaving)... Steps depending on other teams: 1, 2, 5, 6, 8.',
    },
  },
  mistakes: [
    { mistake: 'Building your own logins inside an organization that already has them.', fix: 'Use the organization\'s identity provider through single sign-on, and never store passwords.' },
    { mistake: 'Treating group membership from sign-in as full permission.', fix: 'Use groups for roles, but check in code what each user may see, such as only the classes a teacher teaches.' },
    { mistake: 'Requesting all the data "in case it is useful".', fix: 'Request only the fields a feature needs, read-only, and record why each is needed.' },
    { mistake: 'Starting reviews when the software is finished.', fix: 'Start them in the first weeks with prepared documents, because they run on the organization\'s schedule.' },
  ],
  quiz: [
    {
      question: 'After single sign-on, Study Tracker receives a verified token saying the user is in the "teachers" group. What must the code still check before showing a class\'s totals?',
      options: [
        { text: 'Nothing more, because the token proves they are a teacher', explanation: 'Being a teacher does not mean they teach this particular class.' },
        { text: 'That this teacher actually teaches the class they are asking about', explanation: 'Authentication says who someone is. Authorization, checked in code, decides what they may see.' },
        { text: 'Their password, as a second check', explanation: 'With single sign-on, Study Tracker never receives passwords.' },
        { text: 'That the token contains the word teacher', explanation: 'That is the same check again, and it still does not cover which classes they teach.' },
      ],
      answer: 1,
    },
    {
      question: 'Study Tracker needs to know which students are in which classes. Which access is best?',
      options: [
        { text: 'A weekly spreadsheet emailed by the registrar\'s office', explanation: 'Email attachments spread personal data and go out of date silently.' },
        { text: 'Full administrator access to the student information system', explanation: 'Far more access than needed, including grades and addresses, and the power to change records.' },
        { text: 'A copy of the student information system\'s whole database', explanation: 'It copies everything, which is the opposite of least privilege.' },
        { text: 'A read-only service account for the official interface, limited to course codes and student IDs', explanation: 'Minimal, read-only access through an approved interface is the safest choice and the easiest to approve.' },
      ],
      answer: 3,
    },
    {
      question: 'Which question is a data protection review most likely to ask about the notes assistant?',
      options: [
        { text: 'Are students\' notes sent to an outside model provider, and does it store or train on them?', explanation: 'Where personal data goes, and what others may do with it, is the heart of a data protection review.' },
        { text: 'Which programming language is the assistant written in?', explanation: 'Language choice rarely matters for data protection.' },
        { text: 'How many lines of code does the assistant have?', explanation: 'Code size says nothing about how personal data is handled.' },
        { text: 'Which color scheme does the assistant use?', explanation: 'Colors may matter to accessibility, but not to data protection.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Integrate by trusting the organization\'s sign-in, taking only the data you need read-only from its system of record, and starting its reviews early with clear answers about where personal data, including AI inputs, goes.',
  resources: [
    { title: 'How OpenID Connect works', provider: 'OpenID Foundation', description: 'The sign-in standard used by most modern single sign-on.', url: 'https://openid.net/developers/how-connect-works/' },
    { title: 'Introduction to JSON Web Tokens', provider: 'jwt.io', description: 'How signed tokens are built and verified.', url: 'https://jwt.io/introduction' },
    { title: 'Anti-corruption layer pattern', provider: 'Microsoft Learn', description: 'Keeping another system\'s formats out of your own code.', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer' },
    { title: 'SCIM', provider: 'scim.cloud', description: 'The standard many organizations use to add and remove user accounts automatically.', url: 'https://scim.cloud/' },
  ],
  underTheHood: {
    heading: 'What makes a sign-in token trustworthy',
    paragraphs: [
      "The token from an OIDC sign-in is usually a JSON Web Token, or JWT: three parts joined by dots. A header saying how it was signed, a payload holding the claims, and a signature. Anyone can read the first two parts, so a token is not secret storage, but nobody can change them without breaking the signature.",
      "The identity provider signs each token with a private key that never leaves it. It publishes the matching public key at a well-known address, so Study Tracker can verify signatures without sharing any secret. If even one character of the claims changes, verification fails.",
      "A valid signature is necessary but not enough. The app must also check the issuer, so tokens from other identity providers are rejected, the audience, so a token meant for another app cannot be replayed here, and the expiry, so an old stolen token stops working. Good libraries do all of these checks together. And because a token works like a temporary key, it must never appear in logs.",
    ],
  },
}

export default lesson
