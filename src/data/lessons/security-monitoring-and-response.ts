import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Decide which security events to log, and what each log entry must contain',
    'Write a simple detection rule for repeated failed logins, and explain its false alarms',
    'Walk through the stages of an incident response: contain, investigate, recover, and learn',
  ],
  bigIdea: 'No preventive control is perfect, so a secure system also notices when something goes wrong. Good logs record who did what, when, and from where, detection rules turn patterns in those logs into alerts, and an incident plan says what to do in the first hour. Logging and response turn a silent breach into a bounded problem.',
  whyItMatters: 'A school discovers that a teacher account was used to download student records at three in the morning. Nobody knew for six weeks, because the application logged only errors. If it had logged successful logins and data exports, and alerted on unusual activity, the team would have seen the access the same night and limited the damage.',
  goalSections: [
    {
      heading: 'What to log',
      paragraphs: [
        'Log security events, not every click. Record the time in UTC so events from different systems line up. Useful events include logins, failed logins, password and permission changes, access to sensitive records, data exports, and administrative actions. Each entry should say when it happened, which account acted, what they did, which record was affected, and where the request came from.',
        'Never log secrets. Passwords, session tokens, and full card numbers must stay out of logs, because logs are copied and read widely. Log that a token was used, not the token itself.',
        'Protect the logs. An attacker who can edit the logs can hide their work, so send them to a separate system that the application cannot overwrite, and restrict who can read them. Keep them long enough to investigate a slow attack, and delete them when the retention period ends.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          2026-11-16T03:12:44Z  event=login_failed  account=teacher-17  ip=198.51.100.23  reason=bad_password
          2026-11-16T03:13:01Z  event=login_ok      account=teacher-17  ip=198.51.100.23
          2026-11-16T03:13:40Z  event=export        account=teacher-17  records=412  ip=198.51.100.23
        `,
      },
    },
    {
      heading: 'Detecting unusual patterns',
      paragraphs: [
        'A detection rule looks for a pattern in the logs and raises an alert when it appears. A common rule counts failed logins for each account in a short window. Many failures followed by a success, especially from an unusual address, is a strong signal of a guessing attack that worked.',
        'Every rule produces false alarms. A user who forgot a password may fail five times in a row. Set the threshold from real data, combine signals where you can, such as failures followed by an export, and review the alerts regularly to tune them.',
        'Make the alert useful. It should name the account, the address, the count, and the time window, and say what to check first. An alert that only says "suspicious activity" will be ignored.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          from collections import Counter

          events = [
              ("teacher-17", "login_failed"), ("teacher-17", "login_failed"),
              ("teacher-17", "login_failed"), ("teacher-17", "login_failed"),
              ("teacher-17", "login_failed"), ("teacher-17", "login_ok"),
              ("student-3", "login_failed"),
          ]
          failures = Counter(account for account, event in events if event == "login_failed")
          for account, count in failures.items():
              if count >= 5:
                  print("ALERT:", account, count, "failed logins")
        `,
        output: 'ALERT: teacher-17 5 failed logins',
      },
    },
    {
      heading: 'Responding to an incident',
      paragraphs: [
        'Contain first. Disable the affected account, revoke its tokens, and block the attacking address if that is safe to do. Containment stops the harm while you investigate, and it is worth doing even before you understand the whole picture.',
        'Investigate next. Find out what the account accessed, when the first suspicious event happened, and whether the attacker changed anything. Keep a written timeline, because the record is needed for the fix and for any notice to affected people.',
        'Recover and learn. Restore clean access, reset the credentials that were exposed, and fix the weakness that allowed it. Then review what went well and what was slow, and turn the lessons into a changed rule or process. A response that ends without a changed system will repeat.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          1. Contain: disable the account, revoke its tokens, and block the attacking address if it is safe.
          2. Investigate: write a timeline of the first suspicious event, what was accessed, and what changed.
          3. Recover: restore clean access, reset exposed credentials, and fix the weakness.
          4. Learn: review what was slow, and change a rule or a process so it does not repeat.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Turning raw events into an alert',
    intro: 'The program above counts failed logins per account and raises an alert at five. Run it, then change the threshold to three and predict whether the student account is flagged.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        from collections import Counter

        events = [("teacher-17", "login_failed")] * 5 + [("student-3", "login_failed")] * 2
        THRESHOLD = 5

        failures = Counter(account for account, event in events if event == "login_failed")
        alerts = [(account, count) for account, count in failures.items() if count >= THRESHOLD]
        print("accounts checked:", len(failures))
        print("alerts:", alerts)
      `,
      output: "accounts checked: 2\nalerts: [('teacher-17', 5)]",
    },
    steps: [
      { code: 'failures = Counter(...)', explanation: 'Counts failed logins per account, so each account is judged on its own history.' },
      { code: 'THRESHOLD = 5', explanation: 'The threshold is named and set from real data, so it is easy to review and tune.' },
      { code: 'alerts = [...]', explanation: 'Keeps only the accounts over the threshold, with the count that caused the alert.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write the list of events you would log for a login system, with the fields each entry needs.',
      'Change THRESHOLD in the seeItInAction example to 3 and predict the alerts. Run it to check.',
      'Write the first three actions of your incident response for a leaked API key, in the right order.',
    ],
  },
  mistakes: [
    { mistake: 'Logging only errors, so successful misuse leaves no trace.', fix: 'Log security events such as logins, exports, and permission changes, with account, time, and address.' },
    { mistake: 'Logging secrets such as tokens or passwords.', fix: 'Log that a secret was used, never its value.' },
    { mistake: 'Investigating before containing the harm.', fix: 'Contain first by disabling the account and revoking tokens, then investigate with a written timeline.' },
  ],
  quiz: [
    {
      question: 'Which event is most important to log for a teacher account?',
      options: [
        { text: 'A successful login followed by a large data export', explanation: 'Yes. Access and export events show misuse that error logs would miss.' },
        { text: 'The background color chosen in settings', explanation: 'That is not a security event.' },
        { text: 'Every mouse click', explanation: 'Logging every click creates noise and cost without much security value.' },
        { text: 'The full password typed', explanation: 'Passwords must never be logged.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for an account with four failed logins?',
      code: { language: 'python', runnable: true, code: code`
        from collections import Counter
        events = [("a", "login_failed")] * 4
        failures = Counter(acct for acct, ev in events if ev == "login_failed")
        for acct, n in failures.items():
            if n >= 5:
                print("ALERT", acct)
        print("done")
      ` },
      options: [
        { text: 'ALERT a', explanation: 'Four failures is below the threshold of five, so no alert is raised.' },
        { text: 'done', explanation: 'Yes. No account reaches five failures, so only done is printed.' },
        { text: 'a 4', explanation: 'The program prints the alert line only when the threshold is reached.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What is the first step of incident response?',
      options: [
        { text: 'Contain the harm, such as disabling the account and revoking its tokens', explanation: 'Yes. Stopping the harm comes before the investigation.' },
        { text: 'Publish the details on social media', explanation: 'Publishing before containment can alert the attacker and harm the people affected.' },
        { text: 'Delete all the logs', explanation: 'Deleting logs removes the evidence the investigation needs.' },
        { text: 'Wait a month to see what happens', explanation: 'Waiting lets the harm continue.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Log security events with who, what, when, and where, never secrets, turn patterns into tuned alerts, and respond by containing first, investigating with a timeline, and changing the system afterward.',
  resources: [
    { title: 'Computer Security Incident Handling Guide', provider: 'NIST', description: 'NIST SP 800-61, the standard guide to preparing for and responding to security incidents.', url: 'https://csrc.nist.gov/pubs/sp/800/61/r3/final' },
    { title: 'Logging Cheat Sheet', provider: 'OWASP', description: 'Practical guidance on what to log for security, and what to keep out of logs.', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html' },
  ],
}

export default lesson
