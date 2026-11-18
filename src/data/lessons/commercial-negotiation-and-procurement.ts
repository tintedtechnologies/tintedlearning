import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Scope of Work and Proposals from this section, which explains the in and out lists and the acceptance criteria. The scenario is Riverside Community College, which buys through its procurement office. This lesson covers money and contracts only. Conflicts between people are covered in a later lesson.',
  goals: [
    'Choose a pricing approach that matches how the work is defined and how risk is shared',
    'Trade one term for another, instead of giving a discount that lowers the value of the work',
    'Work with a procurement team, which checks the process as well as the price',
  ],
  bigIdea: "A commercial negotiation agrees the money and the contract terms for a defined piece of work. Trade one term for another, such as a shorter timeline for a smaller scope, rather than cutting the price. Procurement teams check the process as much as the price, so every commercial move must be fair, recorded and easy to explain.",
  whyItMatters: "Riverside's procurement office must show that the college got a fair deal, and the dean must show the budget was well spent. A discount that the team gives to win the pilot may look like a good result, and then it becomes a reason to cut support later. A trade that both sides can explain keeps the value and the trust.",
  goalSections: [
    {
      heading: 'Choose a pricing approach that fits the work',
      paragraphs: [
        "A fixed price suits work with a clear scope and clear acceptance criteria. The customer knows the total, and the supplier carries the risk of overrun. Time and materials suits work that is uncertain, where the customer pays for effort and sees progress. A per-student fee suits a service that grows with use, but it needs a cap so one large intake cannot surprise the budget.",
        "Choose the approach from the risk, not from habit. If the scope is still uncertain, a fixed price invites a fight over every change. If the scope is clear, time and materials invites questions about hours. Say the reason for the choice in the proposal, so the procurement office can check it.",
      ],
      example: {
        language: 'text',
        code: code`
          Work                          Best-fit approach        Why
          pilot with a clear scope      fixed price               scope and criteria are written
          discovery and research        time and materials       the answers are not known yet
          service fee for the year      per-student, with a cap  use grows, the cap limits surprises
        `,
      },
    },
    {
      heading: 'Trade terms instead of discounting',
      paragraphs: [
        "A discount lowers the price without changing anything else, so the value of the work falls with it. The buyer may get less support, a thinner scope or a weaker guarantee, and nobody has said so. A trade names what each side gives and gets, so both sides know what they are agreeing to.",
        "A useful trade has three parts: what you give, what you ask for in return and why the exchange is fair. If the college wants a lower fee, it might accept a smaller scope for the first term or a payment schedule tied to the pilot results. Each move has a visible cost on the other side.",
      ],
      example: {
        language: 'text',
        code: code`
          Buyer:    "Can you reduce the fee by a fifth?"
          Trade:    "We can reduce the fee if the pilot covers two courses instead of three,
                     or if the first payment waits until the pilot results are in.
                     The support hours would then match the smaller scope."
        `,
      },
    },
    {
      heading: 'Work with procurement, not around it',
      paragraphs: [
        "A procurement team is the college's office for buying services. It checks that the process is fair, that the budget covers the cost and that the contract protects the college. Its questions can feel slow, but they are the route to approval. A sponsor who bypasses procurement may win a quick yes and then lose the contract at the audit stage.",
        "Ask early what forms, checks and approvals the college needs. Keep a written record of every commercial change, with the date and the reason. Procurement teams often publish their process, and reading it at the start saves weeks of rework.",
      ],
      example: {
        language: 'text',
        code: code`
          Question to ask procurement early:
            1. Which approvals does a pilot of this size need, and in what order?
            2. Must we run a formal tender, or is a direct award allowed under the threshold?
            3. Which terms are fixed by college policy, such as data protection?
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A negotiation that trades instead of discounting',
    intro: "The dean asks for a lower fee, and the delivery lead responds with a trade. The script shows the question, the trade and the written record that procurement receives. The notes explain why the trade keeps both sides committed.",
    example: {
      language: 'text',
      code: code`
        Dean:   "The pilot is more than we planned. Can the fee come down?"
        Lead:   "We can lower it, if we change one thing. The pilot covers two courses instead of three,
                 and the first payment waits until the mid-term results are in. The support hours
                 match the smaller scope, so the value stays clear."
        Dean:   "What happens to the third course?"
        Lead:   "It moves to a second phase, with its own fee and its own scope document."

        Record sent to procurement the same day:
          Change: pilot reduced from three courses to two; fee reduced accordingly.
          Payment: first installment moved to mid-term results.
          Reason: budget alignment requested by the dean.
          Approved by: dean of students, 14 November.
      `,
    },
    steps: [
      { code: 'We can lower it, if we change one thing.', explanation: "The lead does not refuse or discount. They name the one thing that changes, so the dean can see the exchange." },
      { code: 'The support hours match the smaller scope, so the value stays clear.', explanation: "The lead shows that the value is still there, because the support was matched to the reduced work rather than cut silently." },
      { code: 'It moves to a second phase, with its own fee and its own scope document.', explanation: "The third course is not lost. It is moved to a separate piece of work with its own terms, which keeps the first contract clean." },
      { code: 'Record sent to procurement the same day:', explanation: "Every commercial change is written with its reason and approver. The procurement office can audit it, and the team can explain it later." },
    ],
  },
  tryIt: {
    instructions: [
      'Write the trade you would offer if a customer asked you for a lower price on a project you know. Name what you give, what you ask for in return and why the exchange is fair.',
      'Choose a pricing approach for that project and write one sentence on why it fits the risk.',
      'List three questions you would ask a procurement team before sending a proposal, and the order you would ask them in.',
    ],
  },
  mistakes: [
    { mistake: 'Offering a discount without changing the scope or the terms.', fix: 'Trade one term for another, and say what each side gives and gets.' },
    { mistake: 'Bypassing procurement to win a quick approval.', fix: 'Ask procurement early which approvals and checks are needed, and follow them.' },
    { mistake: 'Choosing a pricing approach out of habit.', fix: 'Match the approach to how well the scope is defined and who carries the risk.' },
  ],
  quiz: [
    {
      question: 'The dean asks for a lower fee. Which response keeps the most value on both sides?',
      options: [
        { text: 'Cut the fee and say nothing else changed', explanation: 'A silent cut leaves the scope and support unchanged, so the work is under-priced and the college will expect too much.' },
        { text: 'Trade a smaller scope or a later payment for the lower fee, and record the change with its reason', explanation: 'Each side gives something visible, and the record protects both parties at audit.' },
        { text: 'Refuse to change anything, since the price is final', explanation: 'A flat refusal ends the negotiation, and the team loses the chance to shape the work.' },
        { text: 'Ask the student representative to decide on the fee', explanation: 'The student representative does not hold the commercial decision, so this sends the question to the wrong person.' },
      ],
      answer: 1,
    },
    {
      question: 'The procurement office asks for a formal tender, but the sponsor wants to start next week by a direct award. What should the team do?',
      options: [
        { text: 'Start next week, since the sponsor is senior', explanation: 'Seniority does not replace the college\'s process, and a bypassed process can cancel the contract later.' },
        { text: 'Ask procurement early whether a direct award is allowed under the threshold, and plan the timeline around the answer', explanation: 'Checking early shows which route is allowed and lets the timeline reflect it.' },
        { text: 'Split the pilot into smaller contracts so each one avoids review', explanation: 'Splitting work to avoid review is a control failure, and procurement would see it.' },
        { text: 'Ignore the request, since procurement slows everything down', explanation: 'Ignoring a formal request puts the approval itself at risk.' },
      ],
      answer: 1,
    },
    {
      question: 'Which pricing approach best fits a pilot whose scope and acceptance criteria are already written?',
      options: [
        { text: 'Time and materials, so the college pays for every hour', explanation: 'Time and materials suits uncertain work, and this scope is already clear.' },
        { text: 'Open-ended, to allow for any change', explanation: 'Open-ended pricing hides the cost and invites scope creep.' },
        { text: 'A discount on the list price, with no defined scope', explanation: 'A discount without a defined scope gives neither side a clear basis for the price.' },
        { text: 'A fixed price, because the scope and the criteria are defined and the college knows the total', explanation: 'A fixed price matches clear work and gives the buyer a known total.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Match the pricing approach to how well the scope is defined, trade terms instead of discounting and work with procurement early so every commercial change is fair, recorded and easy to explain.',
  resources: [
    { title: 'Procurement', provider: 'Wikipedia', description: 'How organizations buy goods and services, and the terms they negotiate.', url: 'https://en.wikipedia.org/wiki/Procurement' },
    { title: 'Negotiation', provider: 'Wikipedia', description: 'The principles of reaching agreement between parties with different interests.', url: 'https://en.wikipedia.org/wiki/Negotiation' },
    { title: 'The Service Manual', provider: 'UK Government Digital Service', description: 'Public-sector guidance on procuring and managing digital services, including how buyers and suppliers agree terms.', url: 'https://www.gov.uk/service-manual' },
  ],
  underTheHood: {
    heading: 'Why trades hold better than discounts',
    paragraphs: [
      "Negotiation researchers distinguish between positions and interests. A position is the demand, such as a lower fee. An interest is the reason behind it, such as staying within a budget line. A discount answers the position and ignores the interest. A trade can answer the interest, because it changes something the buyer values more than the price.",
      "Trades also create a shared record. When the scope and the payment move together, both sides can see what was agreed. A discount, by contrast, often hides the change inside a revised total, and the cost of the missing work shows up later as a dispute.",
      "Procurement teams add structure to this process on purpose. Their rules protect the buyer from favoritism and the supplier from a sudden change of mind. Working within those rules is not a constraint on good negotiation, because a deal that survives an audit is worth far more than a fast one that does not.",
    ],
  },
}

export default lesson
