import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Technical Communication and Executive Writing and Presentations from this section. The scenario is Riverside Community College: the dean of students, the IT manager, a student representative and the two-person delivery team, with Study Tracker\'s assistant as the solution.',
  goals: [
    'Build a demo around one task that matters to the audience, in the order a real student would use it',
    'Tell the story of the problem, the change and the result in a few minutes',
    'Recover well when a demo breaks, by stating what happened and showing a prepared recording',
  ],
  bigIdea: "A demo proves that a solution solves a problem, so it should follow the problem the audience cares about, not the feature list. Tell the story in three beats: the problem, the change and the result. Prepare for failure, because a demo that breaks in front of the people who decide is survivable when you were ready for it.",
  whyItMatters: "The student representative has heard promises about study tools that did not help anyone. If the demo tours every feature, the student sees a product, not a fix for the problem they described. If the demo breaks with no plan, the dean may conclude the project is not ready, even when the fix is small.",
  goalSections: [
    {
      heading: 'Demo the problem, not the features',
      paragraphs: [
        "Choose one task the audience already cares about. For Riverside, a student who has notes from three courses and an exam on Friday wants to find the points they keep forgetting. That is the story. The demo shows the assistant answering that question from the student's own notes, not a list of everything the system can do.",
        "Run the task in the order a real student would. Log in, ask the question, read the answer and check the source note. Each step is one the student will repeat, and the audience can see that the solution fits into their day. Ask the student representative to name the task before the demo starts, so you can check that the demo is about their problem and not yours.",
      ],
      example: {
        language: 'text',
        code: code`
          Demo script for the student representative
            1. Open the study page as a student with three course folders.
            2. Ask: "What do I keep forgetting about cell energy?"
            3. Read the answer, then open the cited note.
            4. Ask a question the notes do not answer, and see the honest reply.
        `,
      },
    },
    {
      heading: 'Tell the story in three beats',
      paragraphs: [
        "Every demo has a problem, a change and a result. The problem is what the audience already feels, in their words. The change is what the solution does differently. The result is the outcome they can measure, such as a student finding the answer in under a minute instead of an hour.",
        "State the three beats before the demo and again after it. The beginning tells the audience what to watch for, and the ending tells them what they saw. Between the two, the demo does the work of proof.",
      ],
      example: {
        language: 'text',
        code: code`
          Problem:  students spend an hour searching three folders before a test
          Change:   the assistant searches only the student's own notes and cites them
          Result:   in the pilot, a question took under a minute in the trial sessions
        `,
      },
    },
    {
      heading: 'Plan for the demo that breaks',
      paragraphs: [
        "Every live demo can fail, because networks drop and services restart. Prepare three things before the meeting: a recorded run of the same task, a screenshot of the answer and a plain sentence to explain a failure. Then a broken demo becomes a short pause rather than the story of the meeting. Test the recording the day before, on the device you will use, because a recording that will not play is no backup at all.",
        "When it breaks, say what happened in one sentence, show the recording, and say what you will check next. Do not guess at the cause in front of the room. A quick, calm answer with a recording tells the dean the team is in control.",
      ],
      example: {
        language: 'text',
        code: code`
          Said aloud:  "The live connection dropped. Here is the recording from this morning."
          Then:        play the recording, pointing at the answer and the cited note.
          Afterwards:  "We are checking the connection now, and I will send you the result by Monday."
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A demo for the dean and the student representative',
    intro: "The delivery team prepares this script for the Riverside demo. The student representative is in the room, so the demo starts with their problem. The notes after the script explain why each part works, including what happens when the connection drops.",
    example: {
      language: 'text',
      code: code`
        Opening (30 seconds):
        "Leila told us students lose an hour searching three course folders before a test.
        This demo shows one question, answered from one student's own notes."

        Demo (3 minutes):
        Ask: "What do I keep forgetting about cell energy?"
        The answer names two points and cites the note that says each one.
        Ask a question the notes do not cover: the assistant says it cannot find that
        in the notes, and does not guess.

        If the connection drops (30 seconds):
        "The live connection dropped. Here is the recording from this morning." Play it.

        Closing (1 minute):
        "The result we measured in the trial: a question answered in under a minute.
        Our decision is the pilot approval from the dean, and the risks are on the page."
      `,
    },
    steps: [
      { code: 'Leila told us students lose an hour searching three course folders', explanation: "The demo opens with a student's problem, in their words, so the student representative sees their own situation first." },
      { code: 'Ask a question the notes do not cover: the assistant says it cannot find that', explanation: "Showing an honest refusal builds more trust than a perfect answer, because the audience sees that the assistant does not invent answers." },
      { code: 'The live connection dropped. Here is the recording from this morning.', explanation: "The failure is named in one sentence, and the recording takes its place. The room sees a team that planned for the problem." },
      { code: 'Our decision is the pilot approval from the dean', explanation: "The closing returns to the decision, so the demo ends where the story began: with the choice the dean has to make." },
    ],
  },
  tryIt: {
    instructions: [
      'Plan a five-minute demo of a solution you know, for an audience you have in mind. Write the problem, the change and the result in one sentence each, and choose the single task you will show.',
      'Record a backup run of the demo, and write the one-sentence explanation you would give if the live version failed.',
      'Review your plan with a checklist: does the demo start with the audience\'s problem, does it show one task in order, does it include an honest limit, and does it have a backup and a sentence for failure?',
    ],
  },
  mistakes: [
    { mistake: 'Touring every feature instead of solving one problem.', fix: 'Choose one task that the audience already cares about, and show it from start to finish.' },
    { mistake: 'Demoing only the happy path.', fix: 'Include one honest limit, such as a question the system should refuse, so the audience sees how it behaves.' },
    { mistake: 'Guessing at the cause of a failure in front of the room.', fix: 'Say what happened in one sentence, show the recording and promise a follow-up with a date.' },
  ],
  quiz: [
    {
      question: 'Five minutes before the Riverside demo, the connection to the assistant fails. What is the best next step?',
      options: [
        { text: 'Keep trying the connection until it works, and say nothing about it', explanation: 'Silence and repeated attempts waste the room\'s time and leave the dean guessing.' },
        { text: 'Cancel the demo and send an email later', explanation: 'Canceling without a backup sends a message that the team is not ready.' },
        { text: 'Say what happened in one sentence, play the recording made this morning, and promise the result by Monday', explanation: 'A calm, prepared response shows control, and the recording keeps the demo\'s value.' },
        { text: 'Explain the cause of the failure in detail while the audience waits', explanation: 'A detailed guess under pressure may be wrong, and the audience came to see the solution, not the diagnosis.' },
      ],
      answer: 2,
    },
    {
      question: 'The student representative is in the room. Which demo opening fits them best?',
      options: [
        { text: 'Here is the problem you described: an hour spent searching course folders before a test. This demo answers one question from your own notes.', explanation: 'The opening uses the student\'s own problem, so the rest of the demo has a reason to matter to them.' },
        { text: 'Our architecture uses a managed database with automatic failover.', explanation: 'The student is not deciding about architecture, and the opening loses their attention.' },
        { text: 'Here are the twelve features of the platform, starting with the login page.', explanation: 'A tour of features does not show the student how their problem changes.' },
        { text: 'The model we chose is the most advanced one available this year.', explanation: 'A claim about the model is a feature detail, and it does not answer the student\'s problem.' },
      ],
      answer: 0,
    },
    {
      question: 'A demo answers a question the notes do not cover. The assistant replies that it cannot find the answer in the notes. How should the presenter handle it?',
      options: [
        { text: 'Hide the reply and show a different question that works', explanation: 'Hiding the refusal makes the demo look more capable than it is, and the audience may notice.' },
        { text: 'Point out the refusal as a feature, since the assistant does not invent answers from outside the notes', explanation: 'An honest refusal builds trust, and it shows the limit the audience needs to understand.' },
        { text: 'Apologize for the assistant and skip ahead', explanation: 'An apology frames correct behavior as a failure, which undersells the solution.' },
        { text: 'Ask the model to answer it anyway, so the demo looks complete', explanation: 'Forcing an answer from outside the notes would show the assistant guessing, which is what the audience should not see.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Build the demo around one task the audience already cares about, tell its problem, change and result, and prepare a recording and a sentence so a failure becomes a short pause.',
  resources: [
    { title: 'Handling Overload', provider: 'Google SRE Book', description: 'How services stay usable when demand or failures exceed what they can handle, and why planned responses matter.', url: 'https://sre.google/sre-book/handling-overload/' },
  ],
  underTheHood: {
    heading: 'Why a planned failure builds trust',
    paragraphs: [
      "Audiences judge a demo partly on how the presenter handles the unexpected. A presenter who stays calm, names what went wrong and offers a clear next step signals competence, even when the product is not yet perfect. Many people trust a team more after a well-handled failure than after a flawless run they suspect was rehearsed too well.",
      "This is why the recording matters. It separates the claim that the solution works from the moment when the network was unreliable. The audience can see the working version, and the presenter does not need to argue about a live problem they cannot yet diagnose.",
      "The same logic applies to honest limits. A demo that shows the assistant refusing a question it cannot answer tells the audience where the solution stops. That boundary is information they need to make a decision, and it protects the team from promises the product cannot keep.",
    ],
  },
}

export default lesson
