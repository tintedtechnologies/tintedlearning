import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Customer Discovery and Conversations from this section, which explains how to listen for evidence. The scenario is Riverside Community College, with its dean of students (the sponsor), IT manager, student representative and two-person delivery team.',
  goals: [
    'Map each stakeholder by how much they care, how much they can decide and how much they can block',
    'Turn discovery notes into requirements that someone else could check',
    'Name the conflicts between stakeholders early, so they are discussed rather than discovered',
  ],
  bigIdea: "A stakeholder is anyone who is affected by a project or can change its outcome. Map them by interest, authority and power to block, because the people who care most are not always the people who decide. Requirements come from those conversations, and each one must be specific enough for someone else to check.",
  whyItMatters: "Riverside's dean sponsors the project, but the IT manager can stop it on security grounds, and the students will decide whether it is used at all. A plan that pleases only the sponsor can be blocked in week six by a review nobody consulted. A short map at the start shows who must be heard before the plan is final.",
  goalSections: [
    {
      heading: 'Map who cares, who decides and who can block',
      paragraphs: [
        "Draw each stakeholder on a simple grid. One axis is how much they care about the outcome, and the other is how much authority or influence they have over it. A person who cares a lot but decides little needs regular updates. A person who decides a lot but cares little needs a short, clear case at the right moment.",
        "Add a third question: who can block the project without deciding it? The IT manager may not sponsor the work, but a security objection can stop it. Find those people early, because a blocker found late costs far more time than one found in the first conversation.",
      ],
      example: {
        language: 'text',
        code: code`
          Stakeholder           Cares about        Decides or influences       Can block?
          Dean of students      student success     approves the budget and pilot  yes, by withholding approval
          IT manager            security and cost   approves access and hosting    yes, on security grounds
          Student representative students' time     shapes adoption               indirectly, by low use
          Delivery team (two)   a workable plan     builds and runs it            no, but can delay
        `,
      },
    },
    {
      heading: 'Turn conversations into requirements',
      paragraphs: [
        "A requirement says what the system must do, for whom and how you will know. \"The assistant should be helpful\" fails that test, because nobody can check it. \"A student can ask a question and see the note that answers it within 10 seconds\" passes, because a tester can time it and say yes or no.",
        "Write each requirement with its source, the person who asked for it. A requirement with a source can be discussed with that person. A requirement without one is a guess that someone will later deny. Write the source in the same line as the requirement, so no one has to search for it in a second document.",
      ],
      example: {
        language: 'text',
        code: code`
          Vague:       "The assistant should keep student data safe."
          Checkable:   "Student notes are readable only by the student who wrote them
                        and by named IT staff, verified each month."
          Source:      IT manager, security review on 4 November
        `,
      },
    },
    {
      heading: 'Name the conflicts early',
      paragraphs: [
        "Stakeholders often want different things. The dean wants a pilot before the start of term, while the IT manager wants a full security review first. Both goals are reasonable, and the conflict is real. If you name it in the first month, you can plan the review in parallel and set a date both sides accept.",
        "Write the conflict down in neutral words, with each side's reason. Keep the list of open conflicts on the project page, so the whole team sees which ones are still unresolved. Then bring the two people together to agree on the trade-off. A conflict left unnamed does not disappear. It returns later as a late change, a delay or a surprise objection in a meeting.",
      ],
      example: {
        language: 'text',
        code: code`
          Conflict:  pilot start date vs full security review
          Dean:      pilot before term starts, for the students who need it most
          IT:        review must finish before any student data is stored
          Agreed:    review and pilot setup run in parallel; no student data before review sign-off
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'The Riverside requirements, from the discovery notes',
    intro: "The delivery team turns its discovery notes into a short requirements list for the Riverside pilot. Each requirement has a source and a way to check it. The notes after the list explain why each part is there.",
    example: {
      language: 'text',
      code: code`
        Requirements for the Riverside pilot (draft for review)

        R1  A student can ask a question about their own notes and receive an answer
            with the note cited, within 10 seconds for 95 percent of questions.
            Source: student representative, trial session, 28 October.
        R2  The assistant gives no answer from notes that belong to another student.
            Verified by an automated test each release.
            Source: IT manager, security review, 4 November.
        R3  Total model costs stay within the monthly budget, with an alert at 80 percent.
            Source: dean of students, budget approval, 15 October.
        R4  No student data is stored before the security review is signed off.
            Source: IT manager and dean, agreed conflict resolution, 11 November.
      `,
    },
    steps: [
      { code: 'R1  A student can ask a question about their own notes', explanation: "The requirement names who uses it, what they do and how fast it must respond. A tester can time the response and say whether it passed." },
      { code: 'R2  The assistant gives no answer from notes that belong to another student.', explanation: "This is the requirement the IT manager cares about. Naming a test makes it checkable, so the security concern is built into the release." },
      { code: 'Source: dean of students, budget approval, 15 October.', explanation: "Each requirement names where it came from. When someone asks why a requirement exists, the answer is in the document." },
      { code: 'R4  No student data is stored before the security review is signed off.', explanation: "This requirement resolves the conflict from the previous section. It is written as a rule the whole team can follow, not as a compromise that someone has to remember." },
    ],
  },
  tryIt: {
    instructions: [
      'Draw the grid for a project you know. List at least five stakeholders, and place each one by how much they care, how much they decide and whether they can block.',
      'Choose three vague statements from your notes or the Riverside example, and rewrite each one as a checkable requirement with a source.',
      'Find one conflict between two stakeholders. Write it neutrally, with each side\'s reason, and draft one agreement that both could accept.',
    ],
  },
  mistakes: [
    { mistake: 'Mapping only the sponsor and the people who will use the system.', fix: 'Include the people who can block the project, such as security, finance and compliance staff.' },
    { mistake: 'Writing requirements that cannot be checked, such as "helpful" or "easy to use".', fix: 'Write each one so a tester can say yes or no, with a number or a test.' },
    { mistake: 'Leaving a conflict unnamed until it becomes a late objection.', fix: 'Write the conflict down early, with each side\'s reason, and plan the trade-off with both people.' },
  ],
  quiz: [
    {
      question: 'The IT manager has not been involved, but the security review can stop the pilot. How should you classify them on the map?',
      options: [
        { text: 'Low priority, since they do not sponsor the project', explanation: 'Sponsorship is not the only source of power. A review that can stop the pilot makes them high priority.' },
        { text: 'A blocker to consult early, since their review can stop the work even without sponsoring it', explanation: 'Finding blockers early costs far less than finding them when the plan is nearly done.' },
        { text: 'A user who needs training only', explanation: 'The IT manager decides on access and hosting, so training is not their main role.' },
        { text: 'Someone to inform once the plan is final', explanation: 'Informing them at the end gives them the power to stop the work without having shaped it.' },
      ],
      answer: 1,
    },
    {
      question: 'Which requirement can a tester check directly?',
      options: [
        { text: 'The assistant should be helpful to students.', explanation: 'Helpful has no test, so a tester cannot say whether it passed.' },
        { text: 'The assistant should be fast and easy to use.', explanation: 'Fast and easy are judgments that different people will answer differently.' },
        { text: 'A student can ask a question and see the cited note within 10 seconds for 95 percent of questions.', explanation: 'It gives a time and a share of cases, so a tester can measure and decide.' },
        { text: 'The team should keep the project on track.', explanation: 'This describes a management goal, not a behavior the system can be tested for.' },
      ],
      answer: 2,
    },
    {
      question: 'The dean wants the pilot before term, and the IT manager wants a full review first. What is the best way to handle this?',
      options: [
        { text: 'Choose the dean\'s date, since the dean is the sponsor', explanation: 'Choosing a side ignores a real risk, and the IT manager can still stop the work.' },
        { text: 'Delay the pilot until the review is complete, without discussing it with the dean', explanation: 'Delaying without the dean leaves the conflict unresolved and damages trust in the plan.' },
        { text: 'Ask the student representative to decide', explanation: 'The students are affected but do not hold the decision, so this passes the conflict to the wrong person.' },
        { text: 'Name the conflict in writing, with each reason, and agree on a plan where the review and the setup run in parallel', explanation: 'Naming the conflict and agreeing on a trade-off lets both goals be met, with a clear rule for student data.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Map every stakeholder by care, authority and power to block, turn what they say into checkable requirements with sources and name conflicts early enough to plan around them.',
  resources: [
    { title: 'Stakeholder analysis', provider: 'Wikipedia', description: 'Identifying the people affected by a decision and how much influence each has.', url: 'https://en.wikipedia.org/wiki/Stakeholder_analysis' },
    { title: 'Requirements engineering', provider: 'Wikipedia', description: 'How needs are elicited, written, and checked before building.', url: 'https://en.wikipedia.org/wiki/Requirements_engineering' },
    { title: 'Stakeholder analysis', provider: 'UK Government Digital Service', description: 'Public-sector guidance on identifying and engaging the people who shape a digital service.', url: 'https://www.gov.uk/service-manual' },
  ],
  underTheHood: {
    heading: 'Why requirements need a source',
    paragraphs: [
      "A requirement without a source is hard to change, because nobody can say why it exists. When a team later wants to drop it, the people who asked for it may be unreachable, and the team is left guessing whether it matters. A source turns the requirement into a conversation rather than a rule that no one owns.",
      "Requirement writing has a long tradition of separating needs from solutions. A need says what must be achieved, such as students finding their notes quickly. A solution says how, such as a search index. Keeping the two apart lets the team choose better solutions later without reopening the agreement about the need.",
      "Sources also help in disagreements. When two stakeholders ask for things that cannot both be true, the source shows whose concern each requirement answers. That makes the trade-off visible, and it gives both people a fair way to see their own reasons on the page.",
    ],
  },
}

export default lesson
