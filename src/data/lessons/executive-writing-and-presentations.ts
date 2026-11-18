import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Technical Communication from this section, which explains how to start from the decision. The scenario is Riverside Community College, with its dean of students, IT manager, student representative and two-person delivery team.',
  goals: [
    'Write an update that gives the answer and the decision needed in the first two lines',
    'Fit a status update on one page, with three facts, one risk and one next step',
    'Present a decision in a short meeting, with one slide for each thing the audience must decide',
  ],
  bigIdea: "Busy decision makers read the first lines and decide whether to keep reading. An executive update gives the answer, the decision needed and the one ask at the top, then supports them with a few facts. A presentation follows the same order, with one slide for each decision.",
  whyItMatters: "The dean of students receives many updates each week and has time for one page on the Riverside project. If the page opens with three paragraphs of background and asks for a decision in the last line, it may be skimmed, misread or postponed. The project then waits on a page nobody finished.",
  goalSections: [
    {
      heading: 'The answer and the ask come first',
      paragraphs: [
        "Start with the answer in one or two sentences: where the project stands and what you need from the reader. Use the phrase bottom line up front, or simply put the conclusion first. Write the opening last, after the body, so that it states what the body actually shows. A reader who stops after the opening should still know what happened and what to do.",
        "Make the ask specific. \"Please review the project\" gives the dean nothing to do. \"Please approve the pilot with 200 students by Friday\" tells them the decision, the size and the deadline. One update should carry one ask, because two asks split the reader's attention and usually produce no decision at all.",
      ],
      example: {
        language: 'text',
        code: code`
          Weak opening:
            "Over the past three weeks we have met with students, reviewed the requirements
             and compared three vendors before settling on a plan."

          Strong opening:
            "The Riverside study assistant is ready for a 200-student pilot. I need your approval
             by Friday to start the pilot on the first of next month."
        `,
      },
    },
    {
      heading: 'One page, three facts, one risk',
      paragraphs: [
        "A one-page update has a fixed shape: the decision needed, three facts that support it, one risk with what you are doing about it, and the next step with its date. Each part answers a question the dean will ask, in roughly the order they will ask it.",
        "Choose the three facts with care. Pick the facts that change the decision, such as the cost to date, the pilot size and the student feedback so far. Leave out the history of every meeting. The history can go in an appendix that the dean may never open. Many decision makers read updates on a phone between meetings, so keep the page short enough to read without scrolling far.",
      ],
      example: {
        language: 'text',
        code: code`
          Decision needed:  approve a 200-student pilot starting on the 1st
          Facts:            cost so far is within the approved budget
                            the notes feature passed the privacy review
                            12 students in testing rated the answers useful
          Risk:             the model provider may change prices; we will review costs monthly
          Next step:        pilot kickoff meeting on Monday, 9 a.m.
        `,
      },
    },
    {
      heading: 'A presentation is the update, spoken',
      paragraphs: [
        "A presentation to a decision maker should make the same case as the page, with one slide for each decision. Put the decision on the slide's title, so the room knows what is being asked before the slide is explained. Keep the rest of the slide to the one picture or number that supports it.",
        "Plan the time as well. Ten minutes is usually enough for three slides and questions. Leave at least half the time for questions, because the questions show you what the decision makers are actually worried about. Practice the opening sentence aloud until you can say it in under ten seconds, since it sets the tone for the whole meeting.",
      ],
      example: {
        language: 'text',
        code: code`
          Slide 1  Title: "Decision: approve the 200-student pilot"
          Slide 2  Title: "The pilot costs what we planned" + one table of spending to date
          Slide 3  Title: "Risk: prices may change, and we review them monthly"
          Last     "What would you need to see to approve this by Friday?"
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A one-page update for the dean',
    intro: "This is the kind of update the delivery team sends the dean every two weeks. It opens with the decision, gives three facts, one risk and one next step. The notes after it explain why each part is there.",
    example: {
      language: 'text',
      code: code`
        Subject: Riverside study assistant, decision needed by Friday

        Dean,

        The study assistant is ready for a 200-student pilot. I need your approval by Friday
        to start the pilot on the 1st of next month.

        Three facts behind the request:
        - Spending to date is within the budget you approved in October.
        - The notes feature passed the privacy review with no open issues.
        - Twelve students in testing rated the answers useful, and two reported a wrong answer.

        One risk: the model provider can change its prices. We will check costs every month
        and tell you before any change affects the budget.

        Next step: pilot kickoff with the IT manager on Monday at 9 a.m.

        Sam, for the delivery team
      `,
    },
    steps: [
      { code: 'The study assistant is ready for a 200-student pilot. I need your approval by Friday', explanation: "The answer and the ask are in the first two sentences, with the size and the deadline. A dean who reads nothing else knows what is needed." },
      { code: 'Spending to date is within the budget you approved in October.', explanation: "The first fact answers the dean's first question about money, using the budget they already approved, so no new numbers need explaining." },
      { code: 'Twelve students in testing rated the answers useful, and two reported a wrong answer.', explanation: "The good and the bad are both shown. Reporting the wrong answers builds trust that the update is not hiding anything." },
      { code: 'One risk: the model provider can change its prices.', explanation: "One risk, with what the team will do about it. A risk with no response is a worry, and a risk with a response is a managed decision." },
    ],
  },
  tryIt: {
    instructions: [
      'Write a one-page update to a real decision maker, or to the dean in the Riverside story, about a piece of work that is in progress. Open with the answer and the single ask, then add three facts, one risk and one next step with a date.',
      'Turn the update into three slides, with a decision in each slide title. Time yourself speaking it. It should take about ten minutes, with the rest left for questions.',
      'Review the update against a checklist: is the ask in the first two sentences, is the ask specific, does every fact change the decision, and does the risk have a response?',
    ],
  },
  mistakes: [
    { mistake: 'Opening with background and putting the ask in the last line.', fix: 'Put the answer and the ask in the first two sentences.' },
    { mistake: 'Asking for several decisions in one update.', fix: 'Send one ask per update, and send a second update for the next decision.' },
    { mistake: 'Writing "please review" instead of a specific request.', fix: 'Name the decision, its size and its deadline.' },
  ],
  quiz: [
    {
      question: 'The dean has ten minutes to read your update. Which opening gives them what they need first?',
      options: [
        { text: 'Over the past three weeks, we have met with students and compared three vendors before settling on a plan.', explanation: 'It describes the work, but the dean still does not know what is being asked.' },
        { text: 'Please review the attached project.', explanation: 'A review request gives the dean nothing to decide, and they must open the attachment to learn what is wanted.' },
        { text: 'The pilot is ready. I need your approval by Friday to start it with 200 students next month.', explanation: 'It states the answer, the decision, the size and the deadline in two sentences.' },
        { text: 'Many factors affect a project like this, and the team has considered them carefully.', explanation: 'It sounds careful but says nothing the dean can act on.' },
      ],
      answer: 2,
    },
    {
      question: 'Your update contains three requests: approve the pilot, change the budget and hire a tester. What should you do?',
      options: [
        { text: 'Keep all three in one update so the dean sees the full picture', explanation: 'Three asks split the reader\'s attention and often produce no decision at all.' },
        { text: 'Send one update with the pilot approval, then separate updates for the budget and the hire', explanation: 'One ask per update keeps each decision clear and makes a yes or no easy to give.' },
        { text: 'Put the budget and the hire in the appendix and ask for them later', explanation: 'Hiding a request in an appendix means it may never be decided, which delays the project.' },
        { text: 'Ask the IT manager to make all three decisions for the dean', explanation: 'The dean is the sponsor and owns these decisions, so passing them on is not the right route.' },
      ],
      answer: 1,
    },
    {
      question: 'In a ten-minute presentation, how should you spend the time?',
      options: [
        { text: 'Read every slide word for word, then stop', explanation: 'Reading slides wastes the room\'s time, and it leaves no room for the questions that matter.' },
        { text: 'Speak for the whole time, so the decision makers hear every detail', explanation: 'A long monologue hides what the decision makers are worried about.' },
        { text: 'Show twenty slides of background, then ask for the decision in the last minute', explanation: 'Asking in the last minute gives the room no time to decide, and the background hides the ask.' },
        { text: 'Use three slides with the decision in each title, and leave at least half the time for questions', explanation: 'Three decision slides cover the case, and the questions reveal what the room needs before it decides.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Give the answer and the single ask in the first two sentences, support them with three facts and one risk on one page, and present each decision on its own slide with time left for questions.',
  resources: [
    { title: 'Executive summary', provider: 'Wikipedia', description: 'What a short summary for decision-makers should contain.', url: 'https://en.wikipedia.org/wiki/Executive_summary' },
    { title: 'Plain Language', provider: 'U.S. General Services Administration', description: 'Guidance on writing clear, direct documents that busy readers can use.', url: 'https://www.plainlanguage.gov/' },
  ],
  underTheHood: {
    heading: 'Why the answer goes first',
    paragraphs: [
      "Newspapers have long used an inverted pyramid. The most important facts go in the opening paragraph, and the details follow in order of importance, so an editor can cut from the bottom without losing the story. Executive writing borrows the same idea, because a reader who is interrupted halfway should still have the decision.",
      "Readers scan. Eye-tracking research on web pages has found that many readers scan the opening lines before they decide whether to keep reading, which is why the first sentence carries so much weight. An update that buries its ask forces every reader to hunt for it, and most will stop hunting.",
      "The structure also helps the writer. Deciding the single ask first forces a choice about what the update is for. Most unclear updates are unclear because the writer has not decided what they want the reader to do.",
    ],
  },
}

export default lesson
