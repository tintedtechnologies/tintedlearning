import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'No coding is needed. The running scenario is Riverside Community College, which wants an AI study assistant for its students. The cast is the dean of students (the sponsor), the IT manager, a student representative and a two-person delivery team.',
  goals: [
    'Explain one technical decision starting from the decision the listener must make',
    'Choose the one fact each audience needs now, and leave the rest for later',
    'Check that a listener understood by asking them to repeat the decision back to you',
  ],
  bigIdea: "Good technical communication starts with the decision the listener has to make, not with the technology. The same choice needs a different explanation for each audience, such as a dean, an IT manager and an engineer. Confirm understanding by asking each listener to repeat the decision in their own words.",
  whyItMatters: "The dean of students will approve or stop the Riverside project on what they understand in a ten-minute meeting. If your explanation opens with containers and database engines, the dean hears a cost they cannot judge and a risk they cannot weigh. A sound plan can still fail because nobody understood it well enough to approve it.",
  goalSections: [
    {
      heading: 'Start with the decision',
      paragraphs: [
        "Write the decision as one sentence before you explain anything. Say what is being chosen, by whom and by when. \"We store student study notes in a database that the college owns, starting next month\" is a decision. \"We are using a managed PostgreSQL service\" is a description of how it will be done, which matters later.",
        "Lead with the decision because every listener is waiting to learn what they are being asked to accept. The technology is supporting detail. Put it after the decision, and only as far as the listener needs to judge it.",
      ],
      example: {
        language: 'text',
        code: code`
          Decision, one sentence:
            "Student study notes will be stored in a database the college owns,
             and the study assistant will read them through a controlled connection."

          Technology, afterwards and only if asked:
            "A managed PostgreSQL database, with automatic backups and private networking."
        `,
      },
    },
    {
      heading: 'One fact per audience',
      paragraphs: [
        "Each listener needs one fact that changes their judgment. The dean needs to know how students' data is protected and what it costs. The IT manager needs access control, backups and who can change the setup. The engineer needs the design, the tests and the failure modes. Give each listener those facts, and hold the rest back.",
        "Holding facts back is not hiding them. Offer the rest when asked, and put it in a written note. A one-page note that follows the meeting lets the listener read the detail at their own pace, and gives them something to forward to their team. A meeting with one clear fact per listener does more than a meeting where everybody receives everything and remembers nothing. Before each meeting, ask yourself which one fact would change this listener's answer. If you cannot name it, you are not ready to explain yet.",
      ],
      example: {
        language: 'text',
        code: code`
          Audience          The one fact that changes their judgment
          Dean              Student notes stay in a college-owned account, and the cost is fixed each month
          IT manager        Only two named staff can change access, and access is reviewed monthly
          Engineer          The connection is tested on every change, and a failed backup stops the release
        `,
      },
    },
    {
      heading: 'Check that it landed',
      paragraphs: [
        "Understanding is not the same as nodding. After you explain, ask the listener to say the decision back in their own words. This is called teach-back. If they repeat the plan with a detail you did not say, or leave out the part that matters most, you have found the gap while there is still time to fix it.",
        "Ask an open question rather than \"Does that make sense?\" A person who wants to be polite will say yes. \"What would you tell your team the plan is?\" gives you something you can check.",
      ],
      example: {
        language: 'text',
        code: code`
          You:    "Before we go on, what would you tell the board the plan is?"
          Dean:   "The college keeps the student notes in its own database, and the assistant
                   can only read them when a student asks a question."
          You:    "Yes. What would make you stop the project?"
          Dean:   "If the notes ever left the college account."
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'The same decision, three explanations',
    intro: "The decision is the same in each version: student notes are stored in a college-owned database. Each explanation gives the listener the fact they need to judge it, and leaves the rest for later. The notes after each version explain why it works.",
    example: {
      language: 'text',
      code: code`
        To the dean (two minutes):
        "The college will own the database that holds student notes. The assistant can read
        a note only when that student asks a question. The cost is fixed each month, and you
        will see it on the monthly report."

        To the IT manager (five minutes):
        "The database sits in a private network, reachable only from the assistant's service.
        Two named staff can change access. Backups run every night and are tested each quarter.
        Access is reviewed each month, and you get the report."

        To an engineer (ten minutes):
        "A managed PostgreSQL instance with private networking, a service identity for the
        assistant and migrations in version control. The integration tests fail if a query
        runs without the learner's ID."
      `,
    },
    steps: [
      { code: 'To the dean (two minutes):', explanation: "The dean is deciding whether the project is worth the money and the risk. The explanation names the owner of the data, the limit on access and the cost, and nothing else." },
      { code: 'To the IT manager (five minutes):', explanation: "The IT manager cares about who can change what and whether it can be recovered. Access and backups are the facts they can check, so they are named with a schedule." },
      { code: 'To an engineer (ten minutes):', explanation: "The engineer needs the design and the tests. These are the facts they can review, and they are the only place the technology names appear." },
      { code: 'The cost is fixed each month', explanation: "The dean hears a number that stays put, which is exactly what a budget holder needs to hear before saying yes." },
    ],
  },
  tryIt: {
    instructions: [
      'Pick one decision from your own work or studies, and write it as one sentence that says what is being chosen, by whom and by when.',
      'Write three short explanations of that decision: one for a non-technical manager, one for a colleague who will check the work, and one for a customer. Give each one only the fact that changes that listener\'s judgment.',
      'Review your three explanations with a checklist: does each start with the decision, does each hold back the extra detail, and does each end with a question that asks the listener to repeat the plan?',
    ],
  },
  mistakes: [
    { mistake: 'Leading with the technology instead of the decision.', fix: 'Write the decision as one sentence first, and add the technology only when the listener asks or needs it to judge the plan.' },
    { mistake: 'Giving every fact to every audience.', fix: 'Choose the one fact each listener needs to judge the decision, and keep the rest for a written note.' },
    { mistake: 'Treating a nod as understanding.', fix: 'Ask the listener to say the decision back in their own words, and fix any gap before the meeting ends.' },
  ],
  quiz: [
    {
      question: 'The IT manager asks why the study notes are kept in a managed database, not on the college\'s own servers. Which opening answers the question best?',
      options: [
        { text: 'We chose it because it is the newest technology on the market.', explanation: 'Novelty is not a reason the IT manager can check, and it leads with the technology rather than the decision.' },
        { text: 'We need a managed database because no one on the team runs servers, and it gives backups and access records you can audit. Here is the cost, and here is who holds the keys.', explanation: 'It states the reason, the facts the IT manager can check and the control they care about.' },
        { text: 'Trust us, the engineers have built this before.', explanation: 'Trust is not an argument the IT manager can review, so it does not answer the question.' },
        { text: 'It is a standard architecture with microservices and containers.', explanation: 'Architecture terms do not explain why the choice is safe or affordable for the college.' },
      ],
      answer: 1,
    },
    {
      question: 'The dean asks, "So is it safe for students?" Which answer fits best?',
      options: [
        { text: 'Yes, it is completely secure.', explanation: 'No system is completely secure, and claiming it is makes the dean less likely to trust the rest of the plan.' },
        { text: 'The vendor says it is safe, so you do not need to worry.', explanation: 'Repeating a vendor\'s claim gives the dean nothing to check, and it shifts the responsibility away from the college.' },
        { text: 'Student notes stay in one college-owned account, only the study assistant can read them, and the IT manager reviews who has access every month.', explanation: 'It names the facts the dean can act on: where the data lives, who can read it and how the access is reviewed.' },
        { text: 'Safety depends on the encryption algorithm used.', explanation: 'The algorithm is a detail the dean cannot use. The useful answer is about who can see the notes.' },
      ],
      answer: 2,
    },
    {
      question: 'After your explanation, an engineer on your team repeats the plan back with a detail that would add three weeks. What should you do?',
      options: [
        { text: 'Tell the engineer that the dean has already approved the plan', explanation: 'Approval does not settle whether the schedule is right, and it stops the check you need.' },
        { text: 'Explain the plan again, more loudly', explanation: 'Repeating the same explanation will not reveal the gap. The engineer has shown you the gap, so use it.' },
        { text: 'Let the dean discover the delay later', explanation: 'Hiding a known delay from the sponsor damages trust far more than the delay itself.' },
        { text: 'Ask the engineer which part they think adds the three weeks, then check the estimate with the team before the dean hears the plan', explanation: 'Checking the estimate first corrects the plan while it is still easy to change, and it shows the team you listen.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Start with the decision your listener must make, give each listener the one fact that changes their judgment and confirm understanding by asking them to repeat the plan back.',
  resources: [
    { title: 'Plain Language', provider: 'U.S. General Services Administration', description: 'Guidance and examples for writing so that readers can find, understand and use information.', url: 'https://www.plainlanguage.gov/' },
  ],
  underTheHood: {
    heading: 'Why experts struggle to explain',
    paragraphs: [
      "Economists call this the curse of knowledge. Once you know something, it becomes hard to imagine not knowing it. Your explanation skips the steps that feel obvious to you, and the listener is left with terms they cannot connect to a decision.",
      "Researchers who studied this effect asked people to tap out a well-known song on a table while listeners guessed the tune. The tappers predicted that listeners would name about half of the songs, and listeners named only a handful. The tappers heard the melody in their heads, and the listeners heard only knocks.",
      "The fix is structural rather than a matter of effort. Start from what the listener must decide, test the explanation on someone who does not share your background, and ask for the teach-back. Each step replaces a guess about what the listener knows with evidence.",
    ],
  },
}

export default lesson
