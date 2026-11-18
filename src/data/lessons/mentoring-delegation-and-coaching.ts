import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Negotiation and Conflict Resolution and Feedback, Conflict, and Influence from this section. The scenario is the Riverside delivery team: the learner leads two people, one of whom is a junior engineer who has built small features but not yet owned a whole piece of work.',
  goals: [
    'Delegate a piece of work with a clear outcome, the authority to decide and a check-in schedule',
    'Coach by asking questions that help the person find the answer, instead of fixing the work yourself',
    'Plan a growth path for a junior engineer, with a small next step they can own and finish',
  ],
  bigIdea: "Delegation hands over an outcome, not a list of steps. Give the person the result you need, the decisions they may make alone and the points where you will check in. Coaching then means asking questions that help them reason, so they grow, and fixing the work yourself only when the stakes require it.",
  whyItMatters: "The Riverside team has one senior engineer and one junior engineer. If the senior engineer does every hard piece of work, the junior engineer stays junior, and the team has no slack when the senior is ill or on leave. Delegation that is clear and coaching that is patient turn a two-person team into two capable people.",
  goalSections: [
    {
      heading: 'Delegate the outcome, not the steps',
      paragraphs: [
        "A good delegation names the result, the constraints, the decisions the person can make alone and the dates when you will check in. \"Please build the notes import\" is too vague. \"Please make the notes import work for the three pilot courses, with the test file passing by Friday, and decide the file format yourself\" is clear.",
        "Give authority along with the task. If the person must ask permission for every choice, you have delegated the typing and kept the thinking. Say which decisions are theirs, and which ones must come back to you. Write the list of decisions on the first page of the delegation, so both of you can see it.",
      ],
      example: {
        language: 'text',
        code: code`
          Delegation to the junior engineer (Priya, notes import)
            Outcome:    notes for the three pilot courses import without errors
            Test:       the test file of 500 sample notes imports, with no duplicates
            Decisions:  file format and error messages are yours to choose
            Ask first:  any change to the database schema
            Check-ins:  Tuesday and Thursday, 15 minutes each
        `,
      },
    },
    {
      heading: 'Coach with questions, not answers',
      paragraphs: [
        "When the work comes back with a problem, the easy move is to fix it yourself. That solves the problem today and teaches nothing. Coaching asks a question first: \"What did you expect to happen? What did you see instead? What would you try next?\" The answer tells you what the person understands, and the next question builds on it.",
        "Use the questions to find the gap, then offer a hint only when the person is stuck. Stop coaching when they have found the way, and let them finish. Then say what they did well, specifically, so they know which habit to keep. Notice when you want to step in, and ask yourself whether the risk is real or only the discomfort of watching someone struggle.",
      ],
      example: {
        language: 'text',
        code: code`
          Priya:  "The import fails on about one row in fifty."
          You:    "What do the failing rows have in common?"
          Priya:  "They have a blank course name."
          You:    "What would your code do with a blank name today?"
          Priya:  "It crashes. I did not expect that."
          You:    "What could you check before the insert, so one bad row does not stop the rest?"
        `,
      },
    },
    {
      heading: 'Plan a growth step, not a leap',
      paragraphs: [
        "Growth comes from work that is a little beyond the person's current skill, with support to reach it. A junior engineer who has built features can take on a whole piece of work, such as the import, with check-ins. A junior engineer who has never run a release should not be given the release on their first week of ownership.",
        "Write the growth path with the person, and review it every few weeks. Name the next skill, the next piece of work and what success will look like. A growth plan agreed in writing is more likely to happen than one kept in your head. Review it using the person's own view of progress first, before you give yours.",
      ],
      example: {
        language: 'text',
        code: code`
          Growth plan, Priya (reviewed every four weeks)
            Now:      owns one import feature end to end, with check-ins
            Next:     runs the pilot's test session, with you watching
            Later:    leads a small piece of the release, with a review before it ships
            Measure:  she can explain each decision in the weekly update without help
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A check-in that coaches instead of fixing',
    intro: "The learner checks in with the junior engineer on the notes import. The check-in asks questions rather than fixing the code, and it ends with a clear next step the engineer owns. The notes after the script explain the choices.",
    example: {
      language: 'text',
      code: code`
        You:     "How is the import going against the Thursday goal?"
        Priya:   "It works for most rows, but about one in fifty fails."
        You:     "What do the failing rows have in common?"
        Priya:   "They have a blank course name, and the code crashes on them."
        You:     "What do you want the import to do with a blank name?"
        Priya:   "Skip it and log a warning, I think, so the rest still load."
        You:     "That sounds right to me. You decide the details. What will you check first?"
        Priya:   "The test file, with three blank names added. I will tell you on Tuesday."
        You:     "Good. Tell me what you did well this week, too, before we finish."
      `,
    },
    steps: [
      { code: 'What do the failing rows have in common?', explanation: "The question leads the engineer to the cause. They find the pattern themselves, which builds the habit of looking for it next time." },
      { code: 'What do you want the import to do with a blank name?', explanation: "The decision belongs to the engineer, as the delegation said. The question makes them choose the behavior, rather than receiving it." },
      { code: 'You decide the details. What will you check first?', explanation: "The engineer leaves with a next step they own. The check-in ends with a commitment and a date, not a list of instructions." },
      { code: 'Tell me what you did well this week, too', explanation: "Specific praise tells the engineer which habit to keep. Coaching includes naming what is working, not only what needs to change." },
    ],
  },
  tryIt: {
    instructions: [
      'Write a delegation for a piece of work you could hand to someone else. Include the outcome, the test, the decisions they may make alone, what they must ask first and the check-in dates.',
      'Write three coaching questions you would ask when someone brings you a problem, and the one thing you would avoid doing before you ask them.',
      'Write a four-week growth plan for someone you lead or teach, with the next skill, the next piece of work and a measure of success.',
    ],
  },
  mistakes: [
    { mistake: 'Delegating the steps but keeping every decision.', fix: 'Name the decisions the person can make alone, and let them make them.' },
    { mistake: 'Fixing the problem yourself because it is faster.', fix: 'Ask questions that help them find the cause, and offer a hint only when they are stuck.' },
    { mistake: 'Giving a junior person a leap instead of a step.', fix: 'Choose work a little beyond their current skill, with check-ins, and review the growth plan every few weeks.' },
  ],
  quiz: [
    {
      question: 'Priya\'s import fails on some rows. What is the strongest coaching question?',
      options: [
        { text: 'Let me fix it for you so we can move on.', explanation: 'Fixing it teaches nothing, and the next failure will need you again.' },
        { text: 'What do the failing rows have in common?', explanation: 'It helps Priya find the pattern, which is the skill she needs to debug her own work.' },
        { text: 'Did you test it before you sent it?', explanation: 'It may feel like a check, but it puts her on the defensive and does not help her find the cause.' },
        { text: 'Why is the code so messy?', explanation: 'It criticizes the work without helping her reason about the failure.' },
      ],
      answer: 1,
    },
    {
      question: 'Which delegation gives Priya the clearest responsibility?',
      options: [
        { text: 'Please help with the notes import when you have time.', explanation: 'There is no outcome, deadline or decision right, so the work may drift.' },
        { text: 'Do the notes import exactly the way I wrote it in the plan.', explanation: 'It removes all decisions, so she learns to type the plan and not to reason about it.' },
        { text: 'Please make the notes import pass the 500-note test file by Friday, and decide the error messages yourself.', explanation: 'It names the outcome, the test, the date and the decision she owns.' },
        { text: 'Tell me when the notes import is finished.', explanation: 'It names no test or quality bar, so finished could mean very different things.' },
      ],
      answer: 2,
    },
    {
      question: 'Which growth step fits a junior engineer who has built small features but never run a release?',
      options: [
        { text: 'Run the whole release next week, alone', explanation: 'It is a leap, with no support, and it risks the release and her confidence.' },
        { text: 'Keep building small features, since that is all she has done', explanation: 'Without a step beyond the current work, growth stops.' },
        { text: 'Lead the client meeting on her own', explanation: 'Leading a client meeting with no preparation is a leap that exposes her and the client.' },
        { text: 'Take ownership of one import feature end to end, with check-ins and a clear measure of success', explanation: 'It is a step beyond her current work, with support and a way to see progress.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Delegate an outcome with its decisions and check-ins, coach with questions that help people find the answer and grow junior people through steps a little beyond their current work.',
  resources: [
    { title: 'Mentorship', provider: 'Wikipedia', description: 'What mentoring is, and how it develops the person being mentored.', url: 'https://en.wikipedia.org/wiki/Mentorship' },
    { title: 'Delegation', provider: 'Wikipedia', description: 'How to hand over work and the responsibility that comes with it.', url: 'https://en.wikipedia.org/wiki/Delegation' },
    { title: 'The Coaching Habit', provider: 'Michael Bungay Stanier', description: 'A practical guide to asking coaching questions that help people think for themselves.', url: 'https://boxofcrayons.com/' },
  ],
  underTheHood: {
    heading: 'Why a little difficulty helps learning',
    paragraphs: [
      "Learning researchers have found that people learn well when a task is challenging but achievable with support. The idea is often described as a zone where the work is just beyond the person's current ability. Too easy, and nothing is learned. Too hard, and the person stops trying or learns the wrong lesson.",
      "Delegation sets that zone. A piece of work that stretches a junior person, with check-ins that catch problems early, keeps the challenge within reach. The check-ins matter because they let the person recover from a mistake before it grows, which is part of how confidence is built.",
      "Coaching questions do the same work at a smaller scale. A question that the person can nearly answer makes them reason one step further than they could alone. Over many check-ins, that habit of reasoning becomes theirs, and the need for your answers falls.",
    ],
  },
}

export default lesson
