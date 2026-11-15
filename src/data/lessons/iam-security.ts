import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Tell the difference between proving who you are and being allowed to do something',
    'Give each person and program only the access it needs, using roles',
    'Keep passwords and keys out of code and use short-lived credentials instead',
  ],
  bigIdea: "In the cloud, every action is checked against two questions: who is asking, and are they allowed to do this? The system that answers them is called IAM, short for identity and access management. Giving everyone and everything the smallest set of permissions it needs keeps one mistake or one stolen password from becoming a disaster.",
  whyItMatters: "A developer pastes a cloud access key into some code and pushes it to a public GitHub page. Within minutes, automated bots find it. Because the key had full admin rights, attackers launch hundreds of servers to mine cryptocurrency, and the company receives a five-figure bill. If the key had only been allowed to read one storage folder, the damage would have been tiny.",
  goalSections: [
    {
      heading: 'Who you are and what you may do',
      paragraphs: [
        "Authentication answers \"who are you?\" You prove your identity with something you know, like a password, plus ideally something you have, like a code from a phone app. Using two such steps is called multi-factor authentication, or MFA.",
        "Authorization answers \"what are you allowed to do?\" Being logged in does not mean you can do everything. A receptionist's badge opens the front door but not the server room.",
        "Identities are not only people. Programs need identities too, so the cloud knows which app is asking. These are often called service accounts or workload identities. Like people, each program should have its own identity, never a borrowed human login.",
      ],
      example: {
        language: 'text',
        code: code`
          Step            Question                 Example
          Authentication  Who are you?             Sam logs in with password + phone code
          Authorization   Are you allowed?         Can Sam delete the orders database?
                                                   -> No: Sam's role can only read it
        `,
      },
    },
    {
      heading: 'Least privilege with roles',
      paragraphs: [
        "A permission is one allowed action on one thing, such as \"read files in the invoices folder\". A policy is a list of permissions written down as a document. A role is a named bundle of permissions, like \"invoice reader\", that you give to people or programs.",
        "The principle of least privilege says each identity should get only the permissions it needs to do its job, and nothing more. Then a stolen password or a buggy program can only do limited harm.",
        "Assign roles to groups, like \"support team\", rather than to individuals. When someone changes jobs, you move them between groups, and their access follows automatically.",
      ],
      example: {
        language: 'text',
        code: code`
          {
            "role": "invoice-reader",
            "allow": ["storage.read"],
            "on": "invoices-bucket/*"
          }

          Given to: the billing app, and the finance group
          Not allowed: deleting files, reading any other folder
        `,
      },
    },
    {
      heading: 'Secrets and short-lived credentials',
      paragraphs: [
        "A secret is anything that grants access: passwords, API keys, database connection strings. Secrets must never be written in code or committed to version control, because code gets copied, shared and published.",
        "Store secrets in a secret manager, a cloud service that keeps them encrypted and hands them only to identities that are allowed to read them. Your app asks for the secret when it starts.",
        "Better still, avoid long-lived keys altogether. Most clouds let an app running on their platform receive temporary credentials automatically, valid for an hour or so and renewed without anyone handling them. A leaked temporary credential soon stops working.",
      ],
      example: {
        language: 'text',
        code: code`
          Risky                                   Safer
          -----                                   -----
          key written in config.py                key stored in a secret manager
          key never expires                       temporary credential, lasts 1 hour
          one admin key shared by the team        each person and app has its own identity
          same key for test and production        separate identities for each
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Setting up access for a small online shop',
    intro: "A shop has three people and one app. Here is how a cloud engineer would set up their access, following least privilege.",
    example: {
      language: 'text',
      code: code`
        1. Everyone logs in with MFA turned on
        2. Owner:    admin role, used only for account changes
        3. Support:  "orders-reader" role, can view orders, cannot delete
        4. Developer: full access to the test project, read-only in production
        5. Web app:  its own identity, can read and write the orders table only
        6. Database password lives in the secret manager
        7. Access is reviewed every three months
      `,
    },
    steps: [
      { code: '1. Everyone logs in with MFA turned on', explanation: "Authentication first. A stolen password alone is no longer enough to get in." },
      { code: '2. Owner: admin role, used only for account changes', explanation: "Somebody needs full control, but even the owner uses a less powerful login for daily work, so a slip cannot delete everything." },
      { code: '3. Support: "orders-reader" role', explanation: "Support staff need to look up orders, not change the system. Least privilege in one line." },
      { code: '4. Developer: full access to test, read-only in production', explanation: "Developers experiment freely where it is safe, and cannot accidentally break the live shop." },
      { code: '5. Web app: its own identity', explanation: "The app gets exactly the permissions it needs. If it is ever hacked, the attacker cannot touch billing or delete backups." },
      { code: '6. Database password lives in the secret manager', explanation: "The password is never in the code. Only the web app's identity is allowed to fetch it." },
      { code: '7. Access is reviewed every three months', explanation: "People change roles and leave. Regular reviews remove permissions nobody needs any more." },
    ],
  },
  mistakes: [
    { mistake: 'Giving everyone admin rights because it is quicker.', fix: 'Start from no access and add only what each job needs. Fixing a missing permission takes minutes. A breach takes months.' },
    { mistake: 'Putting access keys in code or in a shared document.', fix: 'Use a secret manager, or temporary credentials provided by the platform.' },
    { mistake: 'Sharing one login between several people.', fix: 'Give each person their own identity, so actions can be traced and one person can be removed without changing everyone\'s password.' },
  ],
  quiz: [
    {
      question: 'Priya logs in successfully with her password and phone code, but gets "access denied" when she tries to delete a database. What happened?',
      options: [
        { text: 'Authentication failed', explanation: 'She logged in, so the system knows who she is. Authentication worked.' },
        { text: 'Her phone code expired', explanation: 'The code was only needed to log in, and that already succeeded.' },
        { text: 'Authorization denied the action: her role does not include deleting databases', explanation: 'She proved who she is, but her permissions do not allow that action.' },
        { text: 'The database is broken', explanation: 'An access denied message is about permissions, not about the database working.' },
      ],
      answer: 2,
    },
    {
      question: 'An app only needs to read images from one storage folder. Which permission follows least privilege?',
      options: [
        { text: 'Read access to that one folder', explanation: 'Exactly what the job needs and nothing more, so a compromise of the app exposes very little.' },
        { text: 'Read and write access to all storage', explanation: 'Writing and other folders are not needed, so they only add risk.' },
        { text: 'Full admin rights, to avoid permission errors', explanation: 'If the app is ever hacked, the attacker gets control of the whole account.' },
        { text: 'The same role as the account owner', explanation: 'The owner\'s role is far broader than reading one folder.' },
      ],
      answer: 0,
    },
    {
      question: 'A teammate wants to put the database password at the top of the code so the app can connect. What should you suggest?',
      options: [
        { text: 'Fine, as long as the repository is private', explanation: 'Private code still gets copied, shared and sometimes made public by mistake.' },
        { text: 'Write it backwards so people cannot read it', explanation: 'Anyone can reverse it. Disguising a secret is not the same as protecting it.' },
        { text: 'Put it in a comment instead', explanation: 'Comments are part of the code, so the secret is just as exposed.' },
        { text: 'Store it in a secret manager and let the app\'s identity fetch it at start-up', explanation: 'The password never appears in code, and only the app is allowed to read it.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Check who is asking with strong logins, allow each person and program only what its job needs, and keep secrets in a secret manager, never in code.',
  resources: [
    { title: 'Security best practices in IAM', provider: 'AWS', description: 'A practical checklist that applies to any cloud.', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html' },
    { title: 'IAM overview', provider: 'Google Cloud', description: 'A plain introduction to identities, roles and policies.', url: 'https://cloud.google.com/iam/docs/overview' },
  ],
  underTheHood: {
    heading: 'How the cloud decides allow or deny',
    paragraphs: [
      "Every request to a cloud service carries proof of the caller's identity, usually a signed token. The service checks the signature, then gathers every policy that applies: those attached to the identity, its groups and roles, and sometimes the resource itself.",
      "The rules follow a strict order. By default, everything is denied. An allow in any applicable policy can grant the action. But an explicit deny anywhere wins over every allow. That lets administrators set guardrails, such as \"nobody may delete backups\", that no one can accidentally override.",
      "Each decision is also written to an audit log: who asked, for what, when, and whether it was allowed. When something goes wrong, that log is how you find out exactly which identity did what.",
    ],
  },
}

export default lesson
