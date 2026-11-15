import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Consultative Selling and Discovery from this section, which covers qualifying and the next step. The scenario is the Riverside Community College pilot, with its requirements and budget already agreed in principle.',
  goals: [
    'Write a scope that states what is in, what is out and the assumptions behind the plan',
    'Turn each outcome into acceptance criteria that the customer can check',
    'Write a proposal that a busy sponsor can approve in one reading, with the scope attached',
  ],
  bigIdea: "A scope of work says what will be delivered, what will not, and what must be true for the plan to hold. Each deliverable needs acceptance criteria that the customer can check, so both sides agree on when the work is done. A proposal sends that scope to the decision-maker with one clear ask.",
  whyItMatters: "Most disputes on a project are about what was promised, not about how well the work was done. If the Riverside scope does not say whether the notes search covers every course, the college may expect coverage the team never planned. A short, precise scope prevents that argument before the first line of code is written.",
  goalSections: [
    {
      heading: 'Say what is in, what is out and what is assumed',
      paragraphs: [
        "The in list names each deliverable in plain words. The out list names what a reasonable reader might assume is included and is not. The out list matters as much as the in list, because most surprises come from things the customer expected and nobody wrote down. Read the out list aloud with the customer before you sign.",
        "Assumptions are the conditions the plan depends on, such as the college providing a test group of 200 students, or an approved security review by a set date. Write them out. If an assumption fails, the scope can change in a visible way, rather than the team quietly absorbing the cost. Review each assumption with its owner on a set date, because an assumption nobody owns is the one that fails first.",
      ],
      example: {
        language: 'text',
        code: code`
          In:        notes search for the 200 pilot students, in the three pilot courses
          Out:       other courses, mobile app, grading features, storage of real notes
                     before the security review
          Assumes:   the college provides the test group by 1 March
                     the security review is signed off by 15 March
        `,
      },
    },
    {
      heading: 'Write acceptance criteria the customer can check',
      paragraphs: [
        "An acceptance criterion is a test the customer can run to decide whether a deliverable is done. It names the action, the condition and the result. \"The search works well\" is not a criterion, because two people will disagree about what well means. \"A student enters a question and sees the cited note within 10 seconds\" is one.",
        "Write the criteria with the customer, not for them. When the IT manager and the dean agree on the test, the sign-off becomes routine. When a criterion is written only by the delivery team, the first review often turns into a debate.",
      ],
      example: {
        language: 'text',
        code: code`
          Deliverable:  notes search for the pilot
          Criterion 1:  a student asks 20 questions from the test set and gets a cited answer
                        or the "not found" reply for at least 18 of them
          Criterion 2:  no answer quotes a note that belongs to another student
          Sign-off:     IT manager runs the test set on 1 April
        `,
      },
    },
    {
      heading: 'Write the proposal around the scope',
      paragraphs: [
        "A proposal is a short document that asks for a decision. It states the problem in the customer's words, the recommended approach, the scope with its criteria, the cost, the timeline and one ask. The scope is attached or included, so the decision-maker is approving a specific thing, not a general intention.",
        "Keep the proposal to what the decision-maker needs. The technical design belongs in an appendix that the IT manager can read. The sponsor needs the outcome, the cost and the risk. Put the most important sentence first in each section, so a reader who stops early still has the decision.",
      ],
      example: {
        language: 'text',
        code: code`
          Proposal structure
            1. The problem, in the college's words
            2. The recommended pilot, in one paragraph
            3. Scope: in, out, assumptions (from the scope document)
            4. Acceptance criteria, for the IT manager to sign
            5. Cost and timeline
            6. The ask: approve the pilot by 1 March
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'The Riverside pilot scope, with acceptance criteria',
    intro: "The delivery team's scope document for the pilot is short enough for the dean to read and precise enough for the IT manager to test. The notes after it explain how each part keeps the work and the expectations aligned.",
    example: {
      language: 'text',
      code: code`
        Scope of work: Riverside study assistant pilot (version 2, 12 November)

        In scope
          Notes search and cited answers for 200 students in three pilot courses.
          A monthly cost report, and an alert at 80 percent of the monthly budget.

        Out of scope
          Other courses, a mobile app, grading features, and storing real student notes
          before the security review is signed off.

        Assumptions
          The college provides the 200-student test group by 1 March.
          The security review is signed off by 15 March. If not, the pilot starts with sample notes.

        Acceptance criteria
          1. Of 20 test questions, at least 18 get a cited answer or the "not found" reply.
          2. No answer quotes a note that belongs to another student. Tested each release.
          3. The cost report arrives on the first working day of each month.

        Change process
          Any change to scope is written, priced and approved by the dean before work starts.
      `,
    },
    steps: [
      { code: 'Out of scope', explanation: "The out list names the expensive things a reader might assume are included, such as the mobile app and real notes before review. Each exclusion prevents a later argument." },
      { code: 'If not, the pilot starts with sample notes.', explanation: "The assumption has a fallback. If the review slips, the scope changes in a visible way that the dean approved in advance." },
      { code: 'Of 20 test questions, at least 18 get a cited answer or the "not found" reply.', explanation: "A number and a test set. The IT manager can run the same 20 questions and say yes or no, which turns a sign-off into a routine check." },
      { code: 'Any change to scope is written, priced and approved by the dean before work starts.', explanation: "The change process closes the most common gap in projects. Work outside the scope is never silently added." },
    ],
  },
  tryIt: {
    instructions: [
      'Write a scope for a small project you know, with three lists: in scope, out of scope and assumptions. For each in-scope item, write one acceptance criterion a stranger could check.',
      'Review the scope with someone who will sign it off. Ask them to name one thing they assumed was included that is not in your out list, and add it.',
      'Write a one-page proposal that includes the scope, and end it with one specific ask and a date.',
    ],
  },
  mistakes: [
    { mistake: 'Leaving the out-of-scope list empty.', fix: 'Name the things a reasonable reader might expect, and state that they are excluded.' },
    { mistake: 'Writing acceptance criteria that depend on opinion, such as "works well".', fix: 'Write a test with an action, a condition and a result that two people would score the same way.' },
    { mistake: 'Letting extra work begin without a written change.', fix: 'Agree a change process in the scope, and require written approval before new work starts.' },
  ],
  quiz: [
    {
      question: 'The dean assumes the mobile app is included in the pilot, but the scope does not mention it. Where should the fix go?',
      options: [
        { text: 'Quietly build the mobile app, since the dean expects it', explanation: 'Building unscoped work hides the cost and the decision from the sponsor.' },
        { text: 'Add it to the out-of-scope list, then discuss the change with the dean in writing', explanation: 'Stating the exclusion and handling any change in writing keeps both sides aligned.' },
        { text: 'Say nothing and hope the dean forgets', explanation: 'Silence turns the gap into a later dispute about what was promised.' },
        { text: 'Remove the notes search from the scope instead', explanation: 'Removing the core deliverable to avoid a discussion does not solve the mismatch.' },
      ],
      answer: 1,
    },
    {
      question: 'Which acceptance criterion can the IT manager actually test?',
      options: [
        { text: 'The search works well for students.', explanation: 'Works well depends on opinion, so two people would score it differently.' },
        { text: 'The assistant is secure and private.', explanation: 'Secure and private are goals, not tests, and nobody can check them as written.' },
        { text: 'No answer quotes a note that belongs to another student, checked on each release.', explanation: 'It names a condition and a check, so the IT manager can run it and decide.' },
        { text: 'The team will do its best to deliver quality.', explanation: 'This is an intention, not a criterion, and it cannot be signed off.' },
      ],
      answer: 2,
    },
    {
      question: 'A proposal goes to the dean, who has ten minutes. What should it contain?',
      options: [
        { text: 'The full technical design, so the dean understands the system', explanation: 'The dean needs the outcome, cost and risk. The design belongs in an appendix for the IT manager.' },
        { text: 'A list of every meeting held since the project began', explanation: 'History does not help the dean decide, and it buries the ask.' },
        { text: 'A request for general support for the project', explanation: 'A general request gives the dean nothing specific to approve.' },
        { text: 'The problem, the pilot, the scope with its criteria, the cost, the timeline and one clear ask', explanation: 'These are the parts a sponsor needs to approve a specific thing in one reading.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'A scope names what is in, what is out and what must be true, gives each deliverable acceptance criteria the customer can check and a proposal asks the decision-maker to approve that specific scope.',
  resources: [
    { title: 'Service manual: planning a digital service', provider: 'UK Government Digital Service', description: 'Public-sector guidance on defining what a service will deliver and how success is checked.', url: 'https://www.gov.uk/service-manual' },
  ],
  underTheHood: {
    heading: 'Why exclusions protect everyone',
    paragraphs: [
      "Project managers talk about scope creep, the slow growth of work beyond the original plan. It rarely comes from one big request. It comes from many small ones that each seem reasonable, and that add up to a project that no longer matches the budget or the timetable.",
      "An explicit out-of-scope list is the cheapest defense. It makes each small request visible as a decision, rather than an assumption. When a request appears on the out list, the conversation becomes a choice: pay for it, change the plan or let it wait.",
      "Exclusions also protect the customer. A clear list tells them what they will not get, so they can plan other options for those needs. A surprise gap is far more damaging to the relationship than a clear no written at the start.",
    ],
  },
}

export default lesson
