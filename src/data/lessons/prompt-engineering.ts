import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Write a structured prompt with a role, a task, context and an output format',
    'Show a model what you want by including a few worked examples',
    'Ask for step-by-step working on problems that need it, and test a prompt on several inputs',
  ],
  bigIdea: "Prompt engineering means writing instructions for a model carefully enough that they work reliably, not just once. A strong prompt has a clear structure: who the model should act as, the task, the context and the shape of the output. Two more techniques do much of the heavy lifting: showing a few examples of what you want, and asking the model to work through a problem step by step.",
  whyItMatters: "In a chat, you can rescue a weak reply with a follow-up. In an app, nobody is there to do that. Study Tracker's assistant will send the same prompt thousands of times with different data each time, and every reply goes straight to a user. The prompt has to get it right on its own, for every input, including the odd ones you did not think of.",
  goalSections: [
    {
      heading: 'Role, task, context and output',
      paragraphs: [
        "The role sets the perspective and level, such as \"an encouraging study coach for adult beginners\". It shapes tone and vocabulary. It does not give the model knowledge it lacks. The task is one clear instruction that starts with a verb.",
        "The context holds the background and any material to work on. Keep material clearly separate from instructions, for example between labeled markers such as <notes> and </notes>, then refer to it by name. Otherwise a sentence inside your notes can be mistaken for an instruction.",
        "The output part describes exactly what should come back: length, format, what to include, and what to do when information is missing. Say what to do rather than only what not to do. \"Under 50 words\" works better than \"don't be long\".",
      ],
      example: {
        language: 'text',
        code: code`
          Role: You are a patient tutor for adults returning to math.

          Task: Explain the topic in the notes below.

          Context: The learner's class notes are between <notes> tags.
          <notes>
          To add fractions, make the denominators the same first.
          </notes>

          Output: Under 120 words. One worked example with small numbers.
          If the notes are unclear, say what is missing instead of guessing.
        `,
      },
    },
    {
      heading: 'Showing examples',
      paragraphs: [
        "Models copy patterns very strongly, so a few examples often teach more than a paragraph of rules. Including examples of input and the output you want is called few-shot prompting. With no examples it is zero-shot.",
        "Examples fix format, length and tone at once. In the prompt below, three examples are enough for the model to continue the pattern for a new note, including turning \"an hour\" into 60.",
        "Make examples varied. If every example is about algebra, the model may start labeling everything algebra. Include different subjects, different wordings and at least one tricky case.",
      ],
      example: {
        language: 'text',
        code: code`
          Turn each study note into: subject | minutes

          Note: studied algebra 40 min
          Result: algebra | 40

          Note: an hour of biology flashcards
          Result: biology | 60

          Note: half an hour on python loops
          Result: python | 30

          Note: did 90 minutes of history reading
          Result:
        `,
      },
    },
    {
      heading: 'Step by step',
      paragraphs: [
        "For problems with several steps, such as word problems, schedules or logic puzzles, asking the model to work through the steps before giving its answer often makes the answer more accurate. This is called chain-of-thought prompting. Each written step becomes context the model can use for the next.",
        "When an app needs to read the answer, ask for it in a fixed place, such as a last line starting with \"Final answer:\". Many newer models also have a reasoning mode that does this working automatically.",
        "For larger jobs, split the work into separate prompts, called prompt chaining: one prompt makes an outline, the next writes each part. Skip step-by-step working for simple requests, where it only adds tokens, time and cost.",
      ],
      example: {
        language: 'text',
        code: code`
          Maya studies 25 minutes each weekday and 40 minutes each weekend day.
          How many minutes does she study in two weeks?
          Work it out step by step, then give the last line as "Final answer:".

          A typical reply:
            Weekdays: 5 x 25 = 125 minutes
            Weekend: 2 x 40 = 80 minutes
            One week: 125 + 80 = 205 minutes
            Two weeks: 2 x 205 = 410 minutes
            Final answer: 410
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Building and testing Study Tracker\'s weekly summary prompt',
    intro: "Study Tracker will send this prompt every week with each learner's totals. Here it is with all four parts, followed by a test on three different weeks. The replies are typical ones.",
    example: {
      language: 'text',
      code: code`
        Role: You are an encouraging study coach for adult beginners.

        Task: Write a short summary of the learner's study week.

        Context: This week's totals in minutes are between <totals> tags.
        <totals>
        algebra: 120
        biology: 45
        </totals>

        Output: 2 sentences, under 50 words. Name the subject with the most
        minutes. Use only the numbers given. If there are no sessions,
        suggest one 15-minute session instead of giving praise.

        Test                    Typical reply                                     OK?
        algebra 120, bio 45     "165 minutes this week, led by 120 of algebra..."  yes
        python 30               "30 minutes of Python is a real start..."          yes
        no sessions (1st try)   "Amazing effort this week, keep it up!"            no
        no sessions (fixed)     "A quiet week. How about one 15-minute session?"   yes
      `,
    },
    steps: [
      { code: 'Role: You are an encouraging study coach for adult beginners.', explanation: "Sets a warm tone and simple vocabulary. The learner is an adult, so the coach should not sound like it is talking to a child." },
      { code: '<totals> ... </totals>', explanation: "The data sits between markers, and the context line says what it is. Study Tracker fills in these lines from the database each week, so the rest of the prompt never changes." },
      { code: 'Use only the numbers given.', explanation: "Without this, a model may round, estimate or invent a figure such as a daily average. The summary must match what the app stored." },
      { code: 'no sessions (1st try): "Amazing effort this week, keep it up!"', explanation: "The first version of the prompt had no rule for an empty week, and the model praised a week with no study at all. Testing an edge case found the problem before a user did." },
      { code: 'If there are no sessions, suggest one 15-minute session', explanation: "One added rule fixed it. Notice it says what to do, not just \"don't praise\", so the model has something to write instead." },
      { code: 'no sessions (fixed) ... yes', explanation: "After changing a prompt, rerun every test, not just the one that failed. A fix for one case can quietly change the others." },
    ],
  },
  tryIt: {
    instructions: [
      'Open the Prompt builder and fill in the four parts for Study Tracker\'s weekly summary, using your own wording.',
      'Copy the assembled prompt into a chatbot and test it with three weeks of totals: a normal week, a week with one subject, and a week with no sessions.',
      'Fix anything that fails, then rerun all three tests. Finally, add one example of a perfect summary to the prompt and note whether the replies change.',
    ],
    playground: 'prompt-builder',
    evidencePrompt: {
      label: 'Your prompt and tests',
      placeholder: 'For example: My first version ignored the 50-word limit for the busy week. I moved the limit to the start of the output part and all three tests passed.',
    },
  },
  mistakes: [
    { mistake: 'Mixing instructions and material together.', fix: 'Put material between clear markers such as <notes> tags, and tell the model what is inside them.' },
    { mistake: 'Giving examples that are all alike.', fix: 'Vary subjects, wording and length, and include a tricky case, so the model copies the pattern rather than the content.' },
    { mistake: 'Testing a prompt on one input and calling it done.', fix: 'Test 3 to 5 varied inputs, including an empty or unusual one, and rerun them all after every change.' },
    { mistake: 'Saying only what not to do.', fix: 'Give a positive instruction, such as "under 50 words", so the model knows what to write instead.' },
  ],
  quiz: [
    {
      question: 'Your few-shot prompt has three examples, all about algebra. Given a note about chemistry, the model labels it algebra. What is the best fix?',
      options: [
        { text: 'Add two more algebra examples', explanation: 'More of the same makes the model even more likely to copy algebra.' },
        { text: 'Replace them with examples from different subjects', explanation: 'Varied examples teach the pattern, subject then minutes, instead of the content.' },
        { text: 'Remove all the examples', explanation: 'That loses the format the examples were teaching. Varying them keeps the benefit.' },
        { text: 'Raise the temperature', explanation: 'That adds randomness, not a better understanding of what you want.' },
      ],
      answer: 1,
    },
    {
      question: 'Your prompt includes pasted notes, and one line in the notes says "Ignore the word limit". The model follows it. What prevents this best?',
      options: [
        { text: 'Write the real instructions in capital letters', explanation: 'Capitals do not tell the model which text is material and which is instruction.' },
        { text: 'Put the notes first with no label', explanation: 'Unlabeled material is exactly what gets mixed up with instructions.' },
        { text: 'Repeat the word limit three times', explanation: 'It may help a little, but the model still cannot tell your notes from your instructions.' },
        { text: 'Put the notes between markers such as <notes> tags and say they are material to work on', explanation: 'Clear boundaries tell the model that text inside the markers is content, not instructions.' },
      ],
      answer: 3,
    },
    {
      question: 'A prompt says: "Sam studies 20 minutes each weekday and 45 minutes each weekend day. How many minutes in one week? Work it out step by step, then write Final answer:". What should the final answer be?',
      options: [
        { text: '190', explanation: '5 x 20 = 100 for weekdays, plus 2 x 45 = 90 for the weekend, gives 190.' },
        { text: '145', explanation: 'That counts only one weekend day: 100 + 45.' },
        { text: '65', explanation: 'That adds one weekday and one weekend day: 20 + 45.' },
        { text: '315', explanation: 'That uses 45 minutes for all 7 days.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A reliable prompt states the role, task, context and output clearly, shows varied examples, asks for steps when the problem needs them, and is tested on several inputs before anyone depends on it.',
  resources: [
    { title: 'Prompt design strategies', provider: 'Google AI for Developers', description: 'One provider\'s guide to instructions, examples and output formats.', url: 'https://ai.google.dev/gemini-api/docs/prompting-strategies' },
    { title: 'Prompt engineering overview', provider: 'Claude Docs', description: 'Another provider\'s guide, including examples, tags and step-by-step thinking.', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview' },
    { title: 'Chain-of-Thought Prompting', provider: 'arXiv', description: 'The 2022 research paper showing that asking for steps improves multi-step answers.', url: 'https://arxiv.org/abs/2201.11903' },
  ],
  underTheHood: {
    heading: 'Why writing the steps first helps',
    paragraphs: [
      "A model does a fixed amount of computation for each token it writes. If you ask for the answer to a multi-step problem as the very first token, all of the working has to happen inside that one fixed amount of computation, and there is not always enough room.",
      "When the model writes the steps first, each step is a new set of tokens, and each token gets its own full pass through the network. The partial results, such as \"one week: 205 minutes\", are now in the context, where attention can read them for the next step. It is the difference between doing long multiplication in your head and doing it on paper.",
      "Order matters too. A model cannot revise what it has already written, so if it states the answer first and explains afterward, the explanation can only justify the guess. That is why the prompt asks for the steps first and the final answer last. Models with a reasoning mode are trained to work this way by themselves.",
    ],
  },
}

export default lesson
