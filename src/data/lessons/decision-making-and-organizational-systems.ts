import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Prioritization and Tradeoffs from this section, and the earlier lessons on stakeholders and procurement. The scenario is the Riverside pilot, where the college\'s structure decides who approves what and when.',
  goals: [
    'Map who decides what, separately from who is consulted or informed',
    'Write each important decision down with its options, its reason, its owner and its date',
    'Use the college\'s own structure, such as committees and calendars, to plan when a decision can realistically be made',
  ],
  bigIdea: "Every project depends on decision rights: who may decide each question, who must be consulted first and when the decision can happen. Map those rights before you plan, and write each important decision down with its options, reason, owner and date. Organizations follow their calendars and committees, so the plan must fit them.",
  whyItMatters: "Riverside's delivery team waited three weeks for an approval that the dean believed they had already given. Nobody had written down who could approve the pilot, and the budget committee meets only once a quarter. A decision map and a written record would have shown the real timeline on the first day.",
  goalSections: [
    {
      heading: 'Map decision rights',
      paragraphs: [
        "A decision right says who can make a choice. A person who is consulted gives input before the choice. A person who is informed hears about it afterwards. These are different roles, and mixing them up is the most common source of delays and surprises. The IT manager may be consulted on hosting, but only the dean can approve the pilot.",
        "Write the map for each major decision: the decider, the people consulted, the people informed and the forum where it is made. Check the map with the people on it, because a decision right that only exists on paper will not hold under pressure. Revisit the map whenever someone new joins the project, because decision rights follow the people who hold them.",
      ],
      example: {
        language: 'text',
        code: code`
          Decision                    Decides               Consulted            Informed
          approve the pilot           dean of students      IT manager           student rep, team
          approve hosting and access  IT manager            delivery team       dean
          approve the budget          budget committee      dean                 team
          change the scope            dean, in writing      team, IT manager     everyone on the project
        `,
      },
    },
    {
      heading: 'Write decisions down',
      paragraphs: [
        "A decision record is a short document that states the decision, the options considered, the reason for the choice, the owner and the date. It stops the team from relitigating the same question every month, and it lets a new person understand why things are the way they are. Store the records in one shared folder, so anyone on the team can find the last decision on a topic.",
        "Write the record when the decision is made, not weeks later. Name the date of the decision, not only the date of the record, so the timeline is clear. A record made on the day, while the reasons are fresh, is far more accurate than one reconstructed from memory when someone asks.",
      ],
      example: {
        language: 'text',
        code: code`
          Decision record 7, 12 November
          Decision:  the pilot starts with sample notes until the security review is signed off
          Options:   wait for the review, or start with sample notes
          Reason:    the dean wanted students to start, and the IT manager wanted real data protected
          Owner:     dean of students
          Consulted: IT manager, delivery team
        `,
      },
    },
    {
      heading: 'Plan around the college\'s calendar',
      paragraphs: [
        "Organizations decide on their own schedules. A budget committee that meets once a quarter cannot approve something on a Tuesday, and a procurement office may need weeks for a formal check. Find the calendar at the start, and fit the plan to it. A decision that arrives after the meeting is not late in the project. It is late in the college\'s year.",
        "Ask who can make a decision out of cycle, and how. Some colleges allow urgent approvals with a senior sign-off, and others do not. Knowing the route early can save the whole timeline. Ask for the committee's paper deadline as well, because papers often have to be submitted weeks before the meeting itself.",
      ],
      example: {
        language: 'text',
        code: code`
          Next budget committee:     March (quarterly; the next one is in June)
          Urgent route:              the dean can approve spending under the monthly limit
          Procurement check:         allow three weeks for the formal review of the contract
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A decision map for the Riverside pilot',
    intro: "The delivery team writes the decision map and the first decision record in the same meeting. The map shows who decides, and the record shows what was decided and why. The notes after the example explain why both belong in the project folder.",
    example: {
      language: 'text',
      code: code`
        Decision map, Riverside pilot (agreed 12 November)

        Approve the pilot start date          dean of students (decides)
                                              IT manager (consulted: security review)
                                              student representative (informed)
        Approve the budget beyond the pilot   budget committee (decides, March meeting)
                                              dean (consulted)

        Decision record 7 (12 November)
          Decided: the pilot starts with sample notes until the security review is signed off.
          Options: wait for the review, or start with sample notes.
          Reason:  the dean wanted students to start, and real data needs protection first.
          Owner:   dean of students.
      `,
    },
    steps: [
      { code: 'Approve the pilot start date          dean of students (decides)', explanation: "The map names one decider. Two people can be consulted, but only one holds the decision, so an approval cannot be argued about later." },
      { code: 'Approve the budget beyond the pilot   budget committee (decides, March meeting)', explanation: "The calendar is written into the map, so the team knows the budget decision cannot happen before March." },
      { code: 'Decided: the pilot starts with sample notes until the security review is signed off.', explanation: "The decision is stated in one sentence, with the options and the reason. A reader in six months can see what was decided and why." },
      { code: 'Owner:   dean of students.', explanation: "The owner is named, so anyone who wants to revisit the decision knows who to ask." },
    ],
  },
  tryIt: {
    instructions: [
      'Map the decision rights for a project you know, with the decider, the consulted and the informed people for each major decision. Check the map with one of the people on it.',
      'Write a decision record for the most recent decision you made at work or in a study group, with the options, the reason, the owner and the date.',
      'Find the calendar for the forum that approves your project. Mark the next decision date on your plan, and write what you will do if the decision misses that date.',
    ],
  },
  mistakes: [
    { mistake: 'Treating a consulted person as the decider.', fix: 'Name one decider for each decision, and list consulted people separately.' },
    { mistake: 'Writing decisions down weeks later, from memory.', fix: 'Write the record on the day, while the options and reasons are still clear.' },
    { mistake: 'Planning as though every decision can be made on any day.', fix: 'Find the committee calendars and procurement steps first, and build them into the plan.' },
  ],
  quiz: [
    {
      question: 'The IT manager says, "I am happy with the pilot." The dean believes the pilot is approved. Who can approve the pilot start?',
      options: [
        { text: 'The IT manager, since they gave a positive view', explanation: 'The IT manager is consulted on security, but a positive view is not the approval the map names.' },
        { text: 'The dean of students, as the decider named in the decision map', explanation: 'The map names one decider, so the approval must come from that role and be recorded.' },
        { text: 'The student representative, since students will use it', explanation: 'The students are informed, and they do not hold the approval.' },
        { text: 'Whoever speaks last in the meeting', explanation: 'Decision rights come from the map, not from who speaks last.' },
      ],
      answer: 1,
    },
    {
      question: 'Three weeks after a decision, the team argues about why students start with sample notes. What would have prevented this?',
      options: [
        { text: 'A longer meeting on the day', explanation: 'A longer meeting does not preserve the reasons, which is what the argument needs.' },
        { text: 'Keeping the decision secret', explanation: 'Secrecy makes disagreements harder to settle and damages trust.' },
        { text: 'A decision record written on the day, with the options, the reason and the owner', explanation: 'A record preserves the decision and its reason, so the argument can be settled by reading it.' },
        { text: 'Asking the dean to remember the reason', explanation: 'Memory is unreliable after three weeks, and it depends on one person.' },
      ],
      answer: 2,
    },
    {
      question: 'The budget committee meets once a quarter, and the next meeting is in March. What is the best plan?',
      options: [
        { text: 'Ask the committee to approve the budget on a Tuesday next week', explanation: 'The committee decides at its meetings, so an ad hoc request ignores how the organization works.' },
        { text: 'Start spending now and ask for approval later', explanation: 'Spending before approval breaks the rules and risks the whole project.' },
        { text: 'Skip the budget, since the pilot is small', explanation: 'Even a small project needs its budget route, and skipping it creates a later problem.' },
        { text: 'Plan the pilot to start under the dean\'s approval, and bring the budget case to the March meeting', explanation: 'It fits the college\'s calendar and uses the route the dean can approve.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Map who decides each choice, separately from who is consulted or informed, record every important decision with its options, reason and owner on the day, and plan around the organization\'s own calendar.',
  resources: [
    { title: 'Architecture Decision Records', provider: 'ADR GitHub organization', description: 'A lightweight format for recording decisions, their context and their consequences.', url: 'https://adr.github.io/' },
  ],
  underTheHood: {
    heading: 'Why decisions need a visible owner',
    paragraphs: [
      "Organizational researchers have long noted that decisions often happen in the wrong place. A choice may be discussed in a hallway, decided in a meeting nobody attended and then reversed in a third forum. Each reversal costs time, and the people who were not in the first conversation feel excluded.",
      "A named owner and a written record reduce those costs. The owner is the person accountable for the outcome, and the record shows what was agreed. When the owner changes or the record is challenged, the team can see what was decided and under which conditions.",
      "Calendars are part of the system too. A committee that meets quarterly creates a fixed rhythm that every project must fit. Planning with that rhythm, rather than against it, turns a frustrating constraint into a dependable schedule.",
    ],
  },
}

export default lesson
