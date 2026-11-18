import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe what leadership means when you do not have a formal role',
    'Build trust through small, reliable actions that others can see',
    'Choose one useful step to lead a group forward this month',
  ],
  bigIdea: 'Leadership is the work of helping a group make progress, and it does not require a title or authority. People lead by being reliable, making the next step clear, and helping others do their best work. Trust grows from repeated small actions, and it is the main currency of influence.',
  whyItMatters: 'A team of six students builds a class project. Nobody is the leader, and the work drifts: two people duplicate a task, one waits for instructions, and the deadline gets close. A classmate who writes a short plan, assigns the next step, and checks in each day changes the outcome. That person was never appointed, and the project still needed them.',
  goalSections: [
    {
      heading: 'Leadership without authority',
      paragraphs: [
        'Formal authority lets a manager assign work and approve decisions. Most people do not have that power, but everyone can influence what happens next. Influence comes from clarity, consistency, and care, and it can be exercised from any seat in a team.',
        'Start by noticing what the group needs. Is the goal unclear, are roles uncertain, is a decision stuck, or is someone stretched too thin? Naming the gap out loud is often the first act of leadership. A simple sentence, such as "Before we start, can we agree what done looks like?", changes the direction of a meeting.',
        'Leading without a title also means accepting that you may be wrong. Offer ideas as proposals that others can test, and invite correction. People trust a leader who changes course openly more than one who never admits a mistake.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Gap noticed:    two people are building the same login page
          Clear step:     "Let's split the work: Sam does login, Priya does the database."
          Follow-up:      "Sam, I'll check your branch tomorrow at noon so we can merge early."
          Result:         the duplicate work stops, and the next step is visible to all.
        `,
      },
    },
    {
      heading: 'Trust is built in small steps',
      paragraphs: [
        'Trust comes from keeping small promises. If you say you will review a draft by Thursday, review it by Thursday. If you do not have time, say so early, so others can plan around you. Reliability is visible, and it makes people willing to rely on you for bigger things.',
        'Share credit and take responsibility. When the work succeeds, name the people who helped. When it fails, own your part before explaining the causes. Both habits show others that the group is safe to work in, and they encourage people to speak up earlier when something is wrong.',
        'Listen before deciding. Ask what someone sees before offering your view. People who feel heard are more likely to support a decision, even when it is not the one they wanted.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          promises = [("review the draft", "Thursday", True), ("book the room", "Friday", True), ("send the notes", "Monday", False)]
          kept = sum(1 for _, _, done in promises if done)
          print("kept", kept, "of", len(promises), "promises")
          print("trust signal:", "strong" if kept == len(promises) else "rebuild with a smaller promise")
        `,
        output: 'kept 2 of 3 promises\ntrust signal: rebuild with a smaller promise',
      },
    },
    {
      heading: 'Choosing one step this month',
      paragraphs: [
        'Leadership grows with practice. Pick one small step you can take this month, such as running a short planning call, writing down the decisions a group has made, or thanking a teammate in front of others. A single habit repeated well is more useful than a long list of intentions.',
        'Ask for feedback once you have tried the step. A trusted colleague can tell you whether the step helped, and what to adjust. Feedback turns an experiment into a skill.',
        'Keep your own limits in view. Leading does not mean carrying every task. Name what you can do, what you cannot, and who else can help, so the group stays healthy and you do not burn out.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          steps = ["short planning call", "write decisions down", "thank a teammate"]
          chosen = steps[0]
          print("this month:", chosen)
          print("options left for later:", len(steps) - 1)
        `,
        output: 'this month: short planning call\noptions left for later: 2',
      },
    },
  ],
  seeItInAction: {
    title: 'Turning a stuck group into a next step',
    intro: 'The program below keeps a short list of open questions for a group and picks the one that blocks the most work. A leader without a title can use the same idea in a chat or a meeting. Run it, then mark one question as resolved and predict which question is picked next.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        open_questions = [
            ("What does done look like?", 4),
            ("Who owns the database?", 2),
            ("When is the demo?", 1),
        ]
        blocker = max(open_questions, key=lambda item: item[1])
        print("ask next:", blocker[0])
        print("blocks", blocker[1], "tasks")
      `,
      output: 'ask next: What does done look like?\nblocks 4 tasks',
    },
    steps: [
      { code: 'open_questions = [(question, tasks_blocked), ...]', explanation: 'Each open question is paired with the number of tasks it blocks, so the group sees the cost of waiting.' },
      { code: 'blocker = max(open_questions, key=lambda item: item[1])', explanation: 'Finds the question with the largest effect. Working on it first unlocks the most progress.' },
      { code: 'print("ask next:", blocker[0])', explanation: 'Turns the finding into one clear question to bring to the group.' },
    ],
  },
  tryIt: {
    instructions: [
      'Think of a group you belong to. Write down one unclear decision or gap, and the one-sentence question that would move it forward.',
      'Change the blocker example so that the demo question blocks four tasks. Predict the new question, then run it to check.',
      'Choose one promise you can keep this week for a group. Write it down, and keep it.',
    ],
  },
  mistakes: [
    { mistake: 'Waiting for permission to lead.', fix: 'Name the gap and propose one next step. Influence starts with a clear suggestion.' },
    { mistake: 'Making promises you cannot keep.', fix: 'Promise less, say early when you cannot deliver, and keep the promises you make.' },
    { mistake: 'Taking all the work to look helpful.', fix: 'Share tasks, name what you cannot take on, and let others grow into responsibility.' },
  ],
  quiz: [
    {
      question: 'What is the most reliable way to build trust in a group without a title?',
      options: [
        { text: 'Keeping small promises consistently', explanation: 'Yes. Repeated, visible reliability is what people rely on.' },
        { text: 'Announcing that you are in charge', explanation: 'An announcement does not earn trust, and it can make people less willing to speak up.' },
        { text: 'Avoiding every decision', explanation: 'Avoiding decisions leaves the group stuck and reduces trust.' },
        { text: 'Doing every task yourself', explanation: 'Doing everything burns you out and prevents others from growing.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the number of kept promises?',
      code: { language: 'python', runnable: true, code: code`
        promises = [("a", True), ("b", False), ("c", True)]
        print(sum(1 for _, done in promises if done))
      ` },
      options: [
        { text: '1', explanation: 'Two promises are marked done, so the count is 2.' },
        { text: '2', explanation: 'Yes. Promises a and c are kept.' },
        { text: '3', explanation: 'Promise b was not kept, so the count is not 3.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why should a leader name a gap out loud before offering a solution?',
      options: [
        { text: 'Because a shared understanding of the problem makes the next step easier to agree on', explanation: 'Yes. Agreement on the gap makes the proposal more likely to be accepted.' },
        { text: 'Because naming gaps is required in every meeting', explanation: 'It is a useful habit, not a rule.' },
        { text: 'Because solutions are never useful', explanation: 'Solutions are useful. Naming the gap helps them land.' },
        { text: 'Because it avoids all disagreement', explanation: 'Disagreement can still happen. Naming the gap makes it easier to resolve.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Leadership without a title means naming the gap, proposing one clear next step, keeping small promises, and sharing credit, which builds the trust that makes others willing to follow.',
  resources: [
    { title: 'The Leadership Challenge', provider: 'Wikipedia', description: 'A widely read overview of leadership practices that do not depend on a formal role.', url: 'https://en.wikipedia.org/wiki/The_Leadership_Challenge' },
    { title: 'Psychological safety', provider: 'Google re:Work', description: 'Research and guidance on team trust and speaking up, with practical examples.', url: 'https://rework.withgoogle.com/guides/understanding-team-effectiveness/steps/foster-psychological-safety/' },
  ],
}

export default lesson
