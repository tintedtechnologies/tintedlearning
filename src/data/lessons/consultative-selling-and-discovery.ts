import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Customer Discovery and Conversations and Value Propositions and Business Cases from this section. The scenario is Riverside Community College. This lesson covers the sales conversation: qualifying fit and deciding when to say no. The discovery questions themselves are in the earlier lesson.',
  goals: [
    'Qualify a prospect by checking whether the problem, the decision and the timing fit what you can deliver',
    'Sell by helping: give the customer a clear next step even when the answer is not yet yes',
    'Say no to work that does not fit, in a way that keeps the relationship and protects the team',
  ],
  bigIdea: "Consultative selling means helping the customer decide well, which sometimes means deciding not to buy from you. Qualifying checks three things: the problem is real, the decision-maker is involved, and the timing and budget fit. A good seller states the fit clearly, and says no when the work would be wrong for the customer or for the team.",
  whyItMatters: "A consultant who sells every request takes on work that fails, and the failed project damages the reputation of the whole firm. A consultant who qualifies early and says no clearly earns trust that brings the right work later. Riverside's trust in the delivery team depends on the team being honest about what it should and should not take on.",
  goalSections: [
    {
      heading: 'Qualify before you propose',
      paragraphs: [
        "Qualifying means asking whether the opportunity is worth pursuing before you spend effort on a proposal. Three questions do most of the work. Is the problem real and recognized by the customer? Is the person who will decide part of the conversation? Is there a timetable and a budget that could realistically pay for the work?",
        "If one of the three answers is no, you are not yet ready to propose. Say so, and suggest what would need to change, such as a sponsor joining the next call or a budget decision being made. That is useful to the prospect even if they never buy. Write the three answers down before the call ends, so the next conversation starts from the same facts.",
      ],
      example: {
        language: 'text',
        code: code`
          Question                       Riverside's answer          Status
          Is the problem real?           yes, from the trial data    qualified
          Is the decision-maker involved?yes, the dean joined the call  qualified
          Is there a timetable and budget? budget not yet approved   not yet, ask again in March
        `,
      },
    },
    {
      heading: 'Sell by helping',
      paragraphs: [
        "A consultative seller helps the customer see their options, including options that do not involve buying from you. That can sound risky, but it builds trust quickly. The customer learns that your advice is not a sales pitch in disguise, and they return when they need a solution you can provide.",
        "Always leave the conversation with a clear next step, even if the next step is small. \"Would you send us the trial results by Friday so we can check the fit?\" keeps the work moving and gives both sides something concrete to do. A small step that both sides agree to is worth more than a large one that nobody owns.",
      ],
      example: {
        language: 'text',
        code: code`
          Weak close:    "Let us know what you think."
          Clear close:   "Would you send the trial results by Friday? If they show what we expect,
                          we will bring a scoped proposal to the next meeting."
        `,
      },
    },
    {
      heading: 'Say no without losing the relationship',
      paragraphs: [
        "Some work should be declined. It may fall outside your skills, depend on a decision you cannot influence, or ask you to skip a control that protects students. Declining is a professional act, and it is kinder to say no early than to accept work that will fail.",
        "Be specific about the reason and offer an alternative. \"We cannot store student notes before the security review is complete, because that review protects the students. We can run the pilot with sample notes until then.\" The no is clear, and the alternative keeps the door open. Practice the no with a colleague first, because a clear refusal is easier to say well once you have said it aloud.",
      ],
      example: {
        language: 'text',
        code: code`
          Request:    "Start storing real student notes next week, before the security review."
          Response:   "We cannot do that, because the review protects the students' data.
                       We can start the pilot with sample notes this week, and store real notes
                       once the review is signed off."
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A qualifying call with the dean',
    intro: "The delivery lead's call with the dean ends the sales conversation with a clear answer on fit and a clear next step. The script below shows the qualifying questions and the no that protects the students. The notes after it explain each choice.",
    example: {
      language: 'text',
      code: code`
        Lead:  "Before we propose anything, can I check three things? Is the problem clear to
                you, from the trial?"
        Dean:  "Yes, students lose time searching notes."
        Lead:  "Will the decision on the pilot come from you, or from the budget committee?"
        Dean:  "I decide the pilot. The committee approves the budget in March."
        Lead:  "Then we can prepare a scoped proposal for March, and a smaller pilot plan for now.
                One request: the IT manager must see the security plan before any student notes
                are stored. We will not start storing notes before that review."
        Dean:  "Understood. Send the plan."
      `,
    },
    steps: [
      { code: 'Before we propose anything, can I check three things?', explanation: "The lead states the purpose of the questions before asking them, so the dean knows the call is about fit and not a pitch." },
      { code: 'Will the decision on the pilot come from you, or from the budget committee?', explanation: "This confirms who decides. The answer shapes the proposal, because the committee needs a different case from the dean." },
      { code: 'We will not start storing notes before that review.', explanation: "The no is stated plainly and tied to a reason that protects the students. It is said before any work starts, which is why it costs the relationship nothing." },
      { code: 'Send the plan.', explanation: "The call ends with a concrete next step from the customer. A clear next step is the sign that the sales conversation worked." },
    ],
  },
  tryIt: {
    instructions: [
      'Write a qualifying checklist for a real or imagined opportunity, with the three questions and a space for each answer.',
      'Write a close for a sales conversation that includes a specific next step with a date, and a sentence that offers help even if the customer does not buy.',
      'Draft a short, clear no to a request that does not fit, with the reason and one alternative. Read it aloud and check that it does not sound like a rejection of the person.',
    ],
  },
  mistakes: [
    { mistake: 'Writing a proposal before confirming the decision-maker is involved.', fix: 'Qualify first, and do not spend proposal effort until the decision-maker and the timing are clear.' },
    { mistake: 'Ending a conversation with "let us know what you think".', fix: 'End with a specific next step, an owner and a date.' },
    { mistake: 'Accepting work that depends on a control you cannot keep.', fix: 'Say no early, give the reason and offer an alternative the team can deliver safely.' },
  ],
  quiz: [
    {
      question: 'The dean likes the pilot, but the budget is not approved until March. What is the best response?',
      options: [
        { text: 'Write a full proposal now and ask the dean to approve it before the budget decision', explanation: 'A proposal without a budget path wastes effort and may not match the decision that will be made.' },
        { text: 'Qualify the timing, agree a date for a scoped proposal aligned with the March decision, and offer a smaller plan for now', explanation: 'It respects the real timetable, keeps the work moving and gives the dean a clear next step.' },
        { text: 'Drop the opportunity, since the budget is not ready', explanation: 'Timing that is not yet ready is not the same as a no, and dropping the lead ends a good conversation too early.' },
        { text: 'Offer a discount to speed up the budget decision', explanation: 'A discount does not change who approves the budget or when they decide.' },
      ],
      answer: 1,
    },
    {
      question: 'The dean asks you to start storing real student notes next week, before the security review. What should you say?',
      options: [
        { text: 'Yes, to keep the dean happy and build goodwill', explanation: 'Storing notes before the review puts students at risk and breaks the agreed control.' },
        { text: 'No, and we will explain later', explanation: 'A no without a reason and an alternative gives the dean nothing to work with.' },
        { text: 'We cannot do that, because the review protects the students\' data. We can start the pilot with sample notes now, and store real notes once the review is signed off', explanation: 'It states the reason, protects the students and offers a useful alternative.' },
        { text: 'It depends on what the IT manager thinks of you', explanation: 'Personal relationships should not decide a safety control, and this answer leaves the dean uncertain.' },
      ],
      answer: 2,
    },
    {
      question: 'Which closing line gives the customer the clearest next step?',
      options: [
        { text: 'Let us know what you think when you have time.', explanation: 'There is no action, owner or date, so the conversation may simply stop.' },
        { text: 'We are excited to work with you someday.', explanation: 'The line is warm but names no next step, which leaves the customer with nothing to do.' },
        { text: 'Think it over and we will follow up.', explanation: 'The follow-up has no date or owner, so it depends on memory rather than a plan.' },
        { text: 'Would you send the trial results by Friday? If they show what we expect, we will bring a scoped proposal to the next meeting.', explanation: 'It names an action, a date and what happens next, so both sides can plan.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Qualify the problem, the decision-maker and the timing before proposing, end every conversation with a specific next step and say no clearly, with a reason and an alternative, when the work would be wrong for the customer or the team.',
  resources: [
    { title: 'Needs assessment', provider: 'Wikipedia', description: 'How to identify what a customer needs before proposing a solution.', url: 'https://en.wikipedia.org/wiki/Needs_assessment' },
    { title: 'Harvard Business Review', provider: 'Harvard Business Publishing', description: 'Articles on advising customers and selling by diagnosing their problem first. Search the site for consultative selling.', url: 'https://hbr.org/' },
  ],
  underTheHood: {
    heading: 'Why saying no builds trust',
    paragraphs: [
      "Buyers test advisers by watching what they do when the answer is not what the buyer wanted. An adviser who will say no for good reasons is more believable when they later say yes. The buyer learns that the recommendation was not automatic, so the agreement carries weight.",
      "Many professional-services clients say they value advisers who name the limits of their work, because that candor lowers the risk of hidden problems later. A declined project costs the adviser one deal, while an accepted project that fails can cost the relationship and the adviser's reputation.",
      "Qualifying is the practical way to be candid. It turns the question of whether to pursue a deal into a set of checks that can be discussed openly with the customer. The customer sees the reasoning, and the reasoning is what makes the no feel fair.",
    ],
  },
}

export default lesson
