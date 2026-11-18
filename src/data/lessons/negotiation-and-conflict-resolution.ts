import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Feedback, Conflict, and Influence and Decision-Making and Organizational Systems from this section. The scenario is the Riverside pilot: the dean wants the pilot to start before term, and the IT manager wants a full security review first. This lesson covers the disagreement between people. Money and contracts are covered in the procurement lesson.',
  goals: [
    'Separate a person\'s position, such as "delay the launch", from the interest behind it, such as protecting students',
    'Find options that meet both sides\' interests, instead of splitting the difference between two positions',
    'Agree on a written resolution that names the trade-off, an owner and a review date',
  ],
  bigIdea: "Most disagreements are between positions, the demands people state, rather than between interests, the reasons behind them. Find the interests first, because two people who want opposite dates often share the same underlying need. Options that serve both interests are usually better than a compromise, and the agreement should be written down with an owner and a date.",
  whyItMatters: "The dean and the IT manager are both right about what they care about. If the team picks one side, the other will quietly slow the project down, and the pilot may never start. If the team understands both interests, it can plan a route that protects students and starts the pilot on time, and it can show both leaders that their concern shaped the result.",
  goalSections: [
    {
      heading: 'Separate positions from interests',
      paragraphs: [
        "A position is what someone asks for: \"delay the launch until the review is done\" or \"launch before term\". An interest is the reason underneath: the students' data must be protected, or students need help before the exams. Positions clash often. Interests can be compatible, and that is where the solution is.",
        "Ask \"why does that matter to you?\" until you reach an interest you can both recognize. The answer is usually more specific than the position, and it is easier to meet.",
      ],
      example: {
        language: 'text',
        code: code`
          Position (IT manager):   "Delay the launch until the full review is done."
          Interest:                "Student data must never be exposed, and I cannot check
                                    that yet."
          Position (dean):         "Launch before term, so students can use it."
          Interest:                "Students who fall behind in the first month rarely catch up."
        `,
      },
    },
    {
      heading: 'Invent options that meet both interests',
      paragraphs: [
        "Once the interests are visible, ask for options that serve both. Brainstorm without judging, then test each option against both interests. A useful option might start the pilot with sample notes, so the first weeks help students while no real data is stored until the review is signed.",
        "Be wary of a simple split, such as launching in the middle of the two dates. A split is also tempting because it looks fair, but fairness on the surface is not the same as meeting both needs. A split usually satisfies neither interest, and it leaves both people feeling they lost. Look for a design where each side gets what it needs. Ask each side what would make the option fail for them, and fix that first.",
      ],
      example: {
        language: 'text',
        code: code`
          Options tested against both interests
            1. Launch on the 1st with sample notes; real notes after the review
               dean: students start on time        IT: no real data before review  -> both met
            2. Launch in mid-February for everyone
               dean: late start                     IT: review has more time         -> neither fully met
            3. Launch for all, with real notes, after the review
               dean: late start                     IT: fully met                    -> dean not met
        `,
      },
    },
    {
      heading: 'Write the agreement with an owner and a date',
      paragraphs: [
        "A resolution that is only spoken is easy to forget. Write it down in short form: what was agreed, the trade-off that each side accepted, the owner of each step and the date of the next review. Both people should read it and confirm it, before it is shared more widely.",
        "Name the trade-off plainly. The dean accepts sample notes for three weeks, and the IT manager accepts a shared review schedule. Naming the cost to each side makes the agreement fair, and it prevents the first delay from becoming a new argument. Agree in advance how the agreement will be reviewed, so a later change is a planned review rather than a reopened fight.",
      ],
      example: {
        language: 'text',
        code: code`
          Agreement, 12 November (confirmed by the dean and the IT manager)
          Launch:       the pilot opens on 1 March with sample notes
          Real notes:   stored only after the security review is signed off (owner: IT manager)
          Trade-off:    the dean accepts sample notes for the first three weeks;
                        the IT manager accepts a joint review check every Thursday
          Next review:  26 November, owner: delivery lead
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A conversation that moves from positions to interests',
    intro: "The delivery lead meets the dean and the IT manager together. The conversation moves from the two positions to the two interests, and then to an option that serves both. The notes after the script explain each step.",
    example: {
      language: 'text',
      code: code`
        Lead:      "You each asked for something different. Let us start with why. Dean, why does
                    the 1 March date matter to you?"
        Dean:      "Students who fall behind in the first month rarely catch up."
        Lead:      "IT manager, why does the review have to be complete before real notes are stored?"
        IT:        "Because student notes are private, and I cannot check the access controls yet."
        Lead:      "So you both want students helped early, and nobody's private notes exposed.
                    What if the first weeks use sample notes, and real notes start after the review?"
        IT:        "That works, if we check access together every Thursday."
        Dean:      "Fine, as long as the pilot still opens on the 1st."
        Lead:      "I will write that down and send it to you both today."
      `,
    },
    steps: [
      { code: 'Dean, why does the 1 March date matter to you?', explanation: "The lead asks about the reason behind the date, not the date itself. That shifts the conversation from a clash of demands to a shared problem." },
      { code: 'IT manager, why does the review have to be complete before real notes are stored?', explanation: "The same question for the other side. The answer reveals the interest, which is the private data, rather than a wish to delay." },
      { code: 'What if the first weeks use sample notes, and real notes start after the review?', explanation: "The option is offered as a question, and it serves both interests. Neither side has to give up its concern to accept it." },
      { code: 'I will write that down and send it to you both today.', explanation: "The agreement is written the same day, while both people remember what they accepted. The written version is what keeps the resolution from fading." },
    ],
  },
  tryIt: {
    instructions: [
      'Pick a disagreement you have had recently. Write each person\'s position in one line, then ask "why does that matter?" until you reach an interest each person would recognize.',
      'Invent three options that might serve both interests. Test each one against both, and mark which interest each option fails to meet.',
      'Write a short agreement for the best option, with what was agreed, the trade-off for each side, an owner and a review date. Ask both people to confirm it.',
    ],
  },
  mistakes: [
    { mistake: 'Arguing about the position and never asking for the interest.', fix: 'Ask why each position matters until you reach a reason both people recognize.' },
    { mistake: 'Splitting the difference between two dates.', fix: 'Look for an option that serves both interests, and test each option against both.' },
    { mistake: 'Ending a resolution without a written record, an owner and a date.', fix: 'Write the agreement in short form and confirm it with both people before it is shared.' },
  ],
  quiz: [
    {
      question: 'The IT manager wants a delay, and the dean wants the launch on time. What should the lead do first?',
      options: [
        { text: 'Pick the date halfway between the two positions', explanation: 'A split usually meets neither interest, and it leaves both people feeling they lost.' },
        { text: 'Ask each person why the date matters, until the interest behind each position is clear', explanation: 'Interests are where agreement can be found, so the lead needs them before inventing options.' },
        { text: 'Ask the budget committee to decide', explanation: 'The committee has no stake in the interests, and this moves the dispute away from the people who must agree.' },
        { text: 'Go with the dean, since the dean is the sponsor', explanation: 'Sponsorship matters, but overruling the IT manager ignores a real interest in protecting student data.' },
      ],
      answer: 1,
    },
    {
      question: 'Which option serves both interests in the Riverside case?',
      options: [
        { text: 'Launch in mid-February for everyone', explanation: 'A late start meets the IT manager\'s review timing but misses the dean\'s early-term need.' },
        { text: 'Launch for everyone with real notes, after the review', explanation: 'It fully meets the review interest, but the late start fails the dean\'s interest in early help.' },
        { text: 'Launch now with real notes and review later', explanation: 'It breaks the IT manager\'s interest in protecting student data before the review.' },
        { text: 'Launch on 1 March with sample notes, and store real notes only after the review', explanation: 'Students start on time, and no real data is stored before the review is complete.' },
      ],
      answer: 3,
    },
    {
      question: 'After agreeing a resolution in the meeting, what should the lead do next?',
      options: [
        { text: 'Trust that everyone will remember it', explanation: 'Memory fades, and a spoken agreement is easy to reinterpret later.' },
        { text: 'Send it only to the dean, as the sponsor', explanation: 'The IT manager agreed to the terms and needs the record as much as the dean does.' },
        { text: 'Write it down with the trade-offs, an owner and a review date, and ask both people to confirm it', explanation: 'A written and confirmed agreement holds up when the details are questioned later.' },
        { text: 'Wait until the first problem and then write it down', explanation: 'Writing after a problem means the record is shaped by the argument rather than the agreement.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'Find the interest behind each position, invent options that serve both interests and write the agreement down with its trade-offs, an owner and a review date.',
  resources: [
    { title: 'Negotiation', provider: 'Wikipedia', description: 'Interests, options, and agreements in negotiation.', url: 'https://en.wikipedia.org/wiki/Negotiation' },
    { title: 'Getting to Yes', provider: 'Harvard Program on Negotiation', description: 'Guidance from the Harvard Program on Negotiation on separating people from problems and focusing on interests.', url: 'https://www.pon.harvard.edu/' },
  ],
  underTheHood: {
    heading: 'Why a good option beats a compromise',
    paragraphs: [
      "Negotiation researchers describe two ways to reach agreement. Distributive bargaining divides a fixed amount, so one side gains exactly what the other loses. Integrative bargaining looks for value that can be created, because the two sides care about different things. A conflict between a launch date and a security review can often be turned from the first kind into the second.",
      "A compromise splits the difference between positions, and it often gives each side less than it needs. An integrative option changes the shape of the problem. Starting with sample notes meets the dean's need for early help and the IT manager's need for protected data, without asking either person to give up something they actually care about.",
      "Finding such options usually takes more time at the start, when the interests are being explored. That time is repaid later, because an agreement built on interests is less likely to be reopened, and the two people involved are more likely to work together on the next problem.",
    ],
  },
}

export default lesson
