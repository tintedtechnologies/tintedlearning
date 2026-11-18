import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Protect the most powerful account in a cloud subscription, and keep daily work in a limited account',
    'Replace long-lived access keys with roles or short-lived credentials, and keep secrets out of code',
    'Set up alerts, logs, and regular reviews that catch unused or risky access early',
  ],
  bigIdea: 'A cloud account is a set of permissions, and attackers look first for the most powerful ones and for credentials that never expire. Protecting the root or owner account with strong multi-factor login, using limited roles for daily work, replacing permanent keys with short-lived credentials, and reviewing access on a schedule removes most of the easy routes into a cloud environment.',
  whyItMatters: 'A student stores an access key for their cloud account in a public repository to share a demo. A bot finds the key within minutes and starts a cryptocurrency mining job on the account. The bill reaches thousands of dollars before the student notices. A key that was never committed, a budget alert, and a role with less power would have turned the incident into a minor warning.',
  goalSections: [
    {
      heading: 'Protect the powerful account',
      paragraphs: [
        'Every cloud subscription starts with an owner or root account that can do anything, including changing billing and removing other users. Turn on strong multi-factor login for it, store the recovery method safely, and do not use it for daily work.',
        'Create a separate, limited account or role for daily tasks. It should have only the permissions needed for the work at hand. When a limited account is compromised, the damage is bounded by what it can do.',
        'Review who has the powerful roles, and remove any that are no longer needed. A role that was granted for one migration and never removed is a common source of risk.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Owner account:   MFA on, recovery codes stored in a password manager, used only for billing and setup
          Daily account:   a role with access to the study tracker project only
          Review:          every quarter, remove any role not used in the last 90 days
        `,
      },
    },
    {
      heading: 'Replace permanent keys with short-lived credentials',
      paragraphs: [
        'Long-lived access keys are a common cause of cloud breaches in small projects, and they are easy to overlook. They do not expire, they are often copied into files and chats, and they keep working after the person who created them has left.',
        'Prefer roles that issue temporary credentials. A workload, such as a container or a function, can assume a role and receive credentials that expire within hours. A developer can sign in through single sign-on and receive short-lived credentials for their session.',
        'Never put a key in code, a configuration file in a repository, or a chat message. If a key is ever exposed, revoke it at once, create a new one, and check the logs for use during the exposure window.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          keys = [
              {"name": "demo-key", "age_days": 400, "in_repo": True},
              {"name": "deploy-role", "age_days": 0, "in_repo": False},
          ]
          for key in keys:
              problems = []
              if key["in_repo"]:
                  problems.append("found in repository")
              if key["age_days"] > 90:
                  problems.append("older than 90 days")
              print(key["name"], "->", ", ".join(problems) if problems else "ok")
        `,
        output: 'demo-key -> found in repository, older than 90 days\ndeploy-role -> ok',
      },
    },
    {
      heading: 'Alerts, logs, and regular review',
      paragraphs: [
        'Set a budget and an alert for every project, as covered in the cost lesson. A sudden spike in spending is often the first sign that someone else is using the account.',
        'Turn on the account activity log, such as CloudTrail on AWS, the activity log on Azure, or Cloud Audit Logs on Google Cloud. Logs are useless if no one reads them, so set an alert for the actions that matter most, such as creating new keys or changing permissions.',
        'Review the account on a schedule. Check the list of users and roles, the age of every key, the recent log events for unusual actions, and the alerts that fired. Record the review, so the habit continues when the project changes hands.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          actions = [("created access key", "alert"), ("listed buckets", "log only"), ("changed a role", "alert")]
          alerts = [action for action, response in actions if response == "alert"]
          print("alerts set for:", alerts)
          print("quarterly review items: users, roles, key age, log events, fired alerts")
        `,
        output: 'alerts set for: [\'created access key\', \'changed a role\']\nquarterly review items: users, roles, key age, log events, fired alerts',
      },
    },
  ],
  seeItInAction: {
    title: 'Finding the risky keys before an attacker does',
    intro: 'The program above checks a list of credentials for the two most common risks: a key in a repository, and a key older than ninety days. Run it, then change the demo key to be stored outside the repository and predict whether it still needs attention.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        credentials = [
            ("demo-key", 400, True),
            ("ci-role", 12, False),
            ("old-script-key", 200, False),
        ]
        MAX_AGE_DAYS = 90
        needs_action = [name for name, age, in_repo in credentials if in_repo or age > MAX_AGE_DAYS]
        print("act now:", needs_action)
        print("checked:", len(credentials))
      `,
      output: "act now: ['demo-key', 'old-script-key']\nchecked: 3",
    },
    steps: [
      { code: 'MAX_AGE_DAYS = 90', explanation: 'The age limit is written in one place, so the team can see and agree on it.' },
      { code: 'if in_repo or age > MAX_AGE_DAYS', explanation: 'Flags a credential if it is in a repository or has lived too long, since either makes it an easy target.' },
      { code: 'print("act now:", needs_action)', explanation: 'Lists the credentials to rotate or remove first, so the response is specific.' },
    ],
  },
  tryIt: {
    instructions: [
      'Check your own cloud account for the owner or root account and confirm that multi-factor login is on for it.',
      'Change the demo key in the seeItInAction example to in_repo False and predict whether it is still flagged. Run it to check.',
      'Write a quarterly review checklist with five items for a cloud project you manage or plan to build.',
    ],
  },
  mistakes: [
    { mistake: 'Using the owner account for daily work.', fix: 'Keep the owner account for billing and setup, and use a limited role day to day.' },
    { mistake: 'Storing a permanent key in a repository or a shared file.', fix: 'Use roles that issue short-lived credentials, and revoke any key that was exposed.' },
    { mistake: 'Turning on logs and never reading them.', fix: 'Alert on the risky actions, and record a regular review of the logs and access.' },
  ],
  quiz: [
    {
      question: 'Why keep daily work out of the owner account?',
      options: [
        { text: 'So a compromise of daily work does not give the attacker full control of billing and the account', explanation: 'Yes. Limited roles bound the damage when credentials are exposed.' },
        { text: 'Because the owner account is slower', explanation: 'Speed is not the issue.' },
        { text: 'Because the owner account cannot create resources', explanation: 'It can, which is exactly why it must be protected.' },
        { text: 'Because owner accounts cannot have multi-factor login', explanation: 'Owner accounts should have strong multi-factor login.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for a key that is older than 90 days but not in a repository?',
      code: { language: 'python', runnable: true, code: code`
        age_days, in_repo = 120, False
        print("act" if in_repo or age_days > 90 else "ok")
      ` },
      options: [
        { text: 'ok', explanation: 'The key is older than 90 days, so the check flags it.' },
        { text: 'act', explanation: 'Yes. Age alone is enough to flag it for rotation.' },
        { text: 'in_repo', explanation: 'The program prints the decision, not the variable.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What should you do first if an access key is found in a public repository?',
      options: [
        { text: 'Revoke the key, create a new one, and check the logs for use during the exposure', explanation: 'Yes. Revocation stops misuse, and the logs show what happened.' },
        { text: 'Leave it, because the repository is private', explanation: 'A key in a repository should be treated as exposed, even if the repository seems private.' },
        { text: 'Delete the logs to remove the evidence', explanation: 'Deleting logs destroys the evidence you need.' },
        { text: 'Wait a month to see whether anything happens', explanation: 'Waiting lets misuse continue.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Protect the owner account with strong login and use it only for setup, give daily work limited roles, replace permanent keys with short-lived credentials, and review access and logs on a schedule.',
  resources: [
    { title: 'Security best practices in IAM', provider: 'AWS', description: 'AWS guidance on protecting the root user, using roles, and rotating credentials.', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html' },
    { title: 'Best practices for managing service account keys', provider: 'Google Cloud', description: 'Guidance on avoiding long-lived keys and using short-lived credentials on Google Cloud.', url: 'https://docs.cloud.google.com/iam/docs/best-practices-service-accounts' },
  ],
}

export default lesson
