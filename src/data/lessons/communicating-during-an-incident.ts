import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Name the roles that keep an incident organized: a lead, a communicator, and the people fixing the problem',
    'Write status updates that say what is known, what is not known, and what happens next',
    'Plan a short review after the incident that turns what happened into a change',
  ],
  bigIdea: 'During an incident, the technical fix matters, and so does the communication around it. Users, managers, and colleagues need to know what is happening, what they should do, and when the next update will come. A clear structure, short honest updates, and a review afterward turn a stressful outage into a controlled process and a lesson the team keeps.',
  whyItMatters: 'A school app goes down during exam registration. The engineers fix the problem in forty minutes, but the parents and the school office hear nothing for two hours. They call the front desk, send angry messages, and assume the worst. A single status update every thirty minutes, saying what was known and what was being done, would have prevented most of the anger and freed the engineers to work.',
  goalSections: [
    {
      heading: 'Roles that keep an incident organized',
      paragraphs: [
        'Every incident needs a lead, who decides what happens next and keeps the group focused. It also needs a communicator, who writes the updates for people outside the response, so that the engineers can keep fixing the problem. In a small team, one person may hold both roles, but the roles should still be named.',
        'The people fixing the problem should share what they learn in one place, such as a shared channel or a document. A timeline of what was tried, when, and what happened is the most valuable record the team will have when the review begins.',
        'Decide early who can make changes during the incident. Too many people changing things at once makes the failure harder to understand and can make it worse.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Lead:         Dana, decides the next step and keeps the group focused
          Communicator: Sam, writes updates for users and the school office
          Fixers:       Priya and Lee, make changes and log each one in the timeline
          Timeline:     09:04 errors reported, 09:12 database connection limit found, 09:20 limit raised
        `,
      },
    },
    {
      heading: 'Honest, regular updates',
      paragraphs: [
        'A good update has three parts: what is known, what is not known yet, and what happens next, with the time of the next update. "We know the registration page fails for some users. We do not yet know why. We will update at 10:00." is short, honest, and useful. A promise of a fix with no time is not.',
        'Keep updates regular even when nothing has changed. "Still working on it, next update at 10:30" tells people that the team is present, and it stops the flood of questions that come from silence.',
        'Avoid blame in updates. Describe what the system did and what the team is doing. Blaming a person or a vendor in public makes the next incident harder to handle, because people stop reporting problems early.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          updates = [
              ("09:15", "known: registration fails for some users; unknown: why; next: 09:45"),
              ("09:45", "known: connection limit reached; fix: limit raised; next: 10:00"),
          ]
          for time, text in updates:
              print(time, text)
          print("updates sent:", len(updates))
        `,
        output: '09:15 known: registration fails for some users; unknown: why; next: 09:45\n09:45 known: connection limit reached; fix: limit raised; next: 10:00\nupdates sent: 2',
      },
    },
    {
      heading: 'The review that follows',
      paragraphs: [
        'After the service is stable, hold a short review. Focus on what happened, why the team could not see it sooner, and what would make the next incident shorter. A review that looks for a person to blame will not find the real causes, because people hide what they fear.',
        'Turn the findings into changes with owners and dates. A missing alert, an unclear runbook, or a risky configuration should each lead to a specific action. Track those actions, because a review that leads to no change teaches the team that reviews are a formality.',
        'Share a short written summary with the people who were affected. It should say what happened, what was done, and what is being changed. Honesty here rebuilds trust faster than silence.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Timeline: 09:04 errors reported; 09:12 connection limit found; 09:20 limit raised
          Finding: the limit was set for the old server size and never updated
          Changes: alert at 80 percent connection use (owner: Priya, due Friday); runbook entry added (owner: Lee)
          Summary: sent to the school office with what happened, what was done, and what is changing
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking that every update has the three parts',
    intro: 'The program below checks a list of updates for the three parts of a good update: what is known, what is not known, and the time of the next update. Run it, then remove the next-update time from one message and predict which message is flagged.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        updates = [
            {"time": "09:15", "known": "registration fails", "unknown": "why", "next": "09:45"},
            {"time": "09:30", "known": "still investigating", "unknown": None, "next": "10:00"},
        ]
        for u in updates:
            missing = [part for part in ("known", "unknown", "next") if not u.get(part)]
            status = "complete" if not missing else "missing " + ", ".join(missing)
            print(u["time"], status)
      `,
      output: '09:15 complete\n09:30 missing unknown',
    },
    steps: [
      { code: 'missing = [part for part in ("known", "unknown", "next") if not u.get(part)]', explanation: 'Checks each of the three parts of a good update and lists any that are empty.' },
      { code: 'status = "complete" if not missing else ...', explanation: 'A complete update is one that tells people what is known, what is not, and when to expect the next update.' },
      { code: 'print(u["time"], status)', explanation: 'Shows the time with the result, so the writer can fix a weak update quickly.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a status update for a fictional outage using the three parts: known, unknown, and next update time.',
      'Change the second update in the seeItInAction example so that its unknown part is filled in, and predict the new status. Run it to check.',
      'Write the three questions you would answer in a review after an outage you have experienced or imagined.',
    ],
  },
  mistakes: [
    { mistake: 'Sending no updates until the fix is ready.', fix: 'Send regular updates, even when the update is that work continues, with the time of the next one.' },
    { mistake: 'Promising a fix time that the team cannot control.', fix: 'Say what is known and when the next update will come, rather than guessing a fix time.' },
    { mistake: 'Blaming a person or a vendor in public updates.', fix: 'Describe what the system did and what the team is doing, and review causes without blame.' },
  ],
  quiz: [
    {
      question: 'Which of these is the best incident update?',
      options: [
        { text: 'We know some users cannot register. We do not know why yet. Next update at 10:00.', explanation: 'Yes. It says what is known, what is not, and when the next update will come.' },
        { text: 'It will be fixed soon.', explanation: 'A vague promise gives no information and no time for the next update.' },
        { text: 'The vendor broke it again.', explanation: 'Blame in a public update makes the response harder and reduces honest reporting.' },
        { text: 'No comment at this time.', explanation: 'Silence increases questions and anger, and it leaves people guessing.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the second update?',
      code: { language: 'python', runnable: true, code: code`
        u = {"known": "slow", "unknown": None, "next": "10:00"}
        missing = [p for p in ("known", "unknown", "next") if not u.get(p)]
        print("complete" if not missing else "missing " + ", ".join(missing))
      ` },
      options: [
        { text: 'complete', explanation: 'The unknown part is empty, so the update is not complete.' },
        { text: 'missing unknown', explanation: 'Yes. The unknown part is empty.' },
        { text: 'missing known, unknown', explanation: 'The known part is filled in, so only unknown is missing.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What makes a review after an incident useful?',
      options: [
        { text: 'It finds the causes and turns them into changes with owners and dates', explanation: 'Yes. Findings only help when they lead to tracked action.' },
        { text: 'It names the person who made the mistake', explanation: 'Blame hides the real causes, because people stop reporting problems.' },
        { text: 'It is held only when the outage was long', explanation: 'Short incidents also reveal useful lessons.' },
        { text: 'It replaces the status updates', explanation: 'Reviews happen afterward. Updates happen during the incident.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'During an incident, name the roles, send short honest updates with the time of the next one, and hold a blame-free review that turns findings into tracked changes.',
  resources: [
    { title: 'Incident management guide', provider: 'Google SRE', description: 'Practical guidance on roles, communication, and blameless reviews during incidents.', url: 'https://sre.google/sre-book/managing-incidents/' },
    { title: 'Incident response recommendations', provider: 'NIST', description: 'NIST guidance on handling incidents, including communication and recovery.', url: 'https://csrc.nist.gov/pubs/sp/800/61/r3/final' },
  ],
}

export default lesson
