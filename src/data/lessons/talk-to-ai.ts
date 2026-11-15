import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Turn a vague request into a specific one that says what you want, how much and for whom',
    'Give an AI the context it needs instead of leaving it to guess',
    'Improve a reply with follow-up messages, then check it before you use it',
  ],
  bigIdea: "An AI chatbot only knows what is in your conversation, plus general patterns from its training. A vague request gets a generic answer, because the model has to fill every gap with the most typical guess. Saying exactly what you want, giving the background and then steering with follow-ups turns an average first reply into one you can actually use.",
  whyItMatters: "Type \"help me study\" and you get a list of tips you have read a hundred times. Type \"I have a biology test on Friday on cell respiration, I can study 30 minutes a day, and I keep mixing up glycolysis and the Krebs cycle. Make me a 4-day plan.\" and you get a plan for your week. Same tool, same minute of typing, a completely different result.",
  goalSections: [
    {
      heading: 'Say exactly what you want',
      paragraphs: [
        "A useful request answers four questions. What should it do: explain, list, compare, rewrite, plan? About what, exactly? For whom, or at what level? And in what shape: how long, bullet points or paragraphs, a table, a single sentence?",
        "You rarely need all four, but each one you skip is a gap the model fills with the most common choice. That is why answers to vague requests all sound the same: they are the average of every similar request.",
        "Start with a clear verb. \"Explain\", \"list\", \"shorten\" and \"quiz me on\" each produce a very different reply from the same topic.",
      ],
      example: {
        language: 'text',
        code: code`
          Vague:     Tell me about fractions.
          Specific:  Explain how to add fractions with different denominators
                     to an adult who is rusty at math. Use one worked example
                     and keep it under 150 words.

          Vague:     Make this email better.
          Specific:  Rewrite this email to my landlord so it is polite but
                     firm, and short enough to read on a phone.
        `,
      },
    },
    {
      heading: 'Give it the context',
      paragraphs: [
        "The model cannot see your syllabus, your calendar, your draft or what you have already tried. Anything that would change a good answer needs to be in the message: your situation, your limits, what you already know and what went wrong.",
        "Paste the real material instead of describing it. The actual exam question, the exact error message or your own draft gives the model far more to work with than \"I have a question about my essay\".",
        "Context is not the same as everything. Leave out private details that would not change the answer, such as full names, addresses and account numbers.",
      ],
      example: {
        language: 'text',
        code: code`
          Context:    I'm learning Python on my own, about 3 weeks in.
                      I understand lists but loops still confuse me.
          Material:   Here is my code and the full error message: ...
          Request:    Explain what the error means and how to fix it.
                      Don't just give me the fixed code. I want to understand it.
        `,
      },
    },
    {
      heading: 'Follow up, then check',
      paragraphs: [
        "Treat the first reply as a draft. Short follow-ups steer it: \"shorter\", \"use an example from cooking\", \"explain step 2 more simply\", \"give me three different versions\". Corrections work too: \"You assumed I have a car, but I take the bus.\"",
        "If you are not sure what to include, ask the model to ask you: \"Before you answer, ask me any questions you need.\" If a chat has gone badly wrong, starting a new one with a better first message often beats piling on corrections, because the confused early replies stay in the context.",
        "Then check before you use the result. Does it answer what you actually asked? Are the facts, names and numbers ones you can confirm, as AI Hallucinations showed? Does it fit your real situation?",
      ],
      example: {
        language: 'text',
        code: code`
          Useful follow-ups
            Make it half as long.
            Explain that again for someone who has never seen algebra.
            You used the wrong date. The test is Friday, not Thursday.
            Give me 3 versions with different tones.
            Before you redo it, ask me what is missing.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'From "help me study" to a plan you can use',
    intro: "Here is one learner's conversation, shortened. The replies are typical ones, summarized. Watch how each message adds something the model could not have guessed.",
    example: {
      language: 'text',
      code: code`
        1. You:  help me study
           AI:   General tips: make a schedule, take breaks, test yourself...

        2. You:  (new chat) I have a biology test on Friday on cell respiration.
                 I can study 30 minutes a day, Monday to Thursday. I keep mixing
                 up glycolysis and the Krebs cycle. Make me a 4-day plan.
           AI:   A 4-day plan, one topic per day, ending with a practice test.

        3. You:  I learn best by testing myself. Add 3 quiz questions to each day.
           AI:   The same plan with 3 questions per day.

        4. You:  Day 2's answer says the Krebs cycle happens in the cytoplasm.
                 My textbook says the mitochondria. Please fix it.
           AI:   Corrected: the Krebs cycle takes place in the mitochondria.
      `,
    },
    steps: [
      { code: '1. help me study', explanation: "Nothing about the subject, deadline, time or difficulty, so the model gives the most typical answer to the most typical request. It is not wrong, just useless for this learner." },
      { code: '2. (new chat) I have a biology test on Friday...', explanation: "A fresh start with the four questions answered: plan, about cell respiration, for 30 minutes a day, as a 4-day plan. The specific confusion between two topics is the most valuable detail." },
      { code: 'A 4-day plan, one topic per day', explanation: "Now the reply is about this learner's week. Notice that nothing about the model changed, only the message." },
      { code: '3. I learn best by testing myself.', explanation: "A follow-up adds a preference the learner forgot at first. One short line improves the whole plan instead of starting over." },
      { code: '4. Day 2\'s answer says... the cytoplasm.', explanation: "The learner checked the quiz answers against their textbook and caught a slip. Saying what the source says, rather than just \"that is wrong\", gives the model what it needs to fix it." },
      { code: 'Corrected: ... in the mitochondria.', explanation: "The fixed plan is now specific, personal and checked. Four short messages, about two minutes of typing, produced something worth following." },
    ],
  },
  tryIt: {
    instructions: [
      'Pick a real task from your week: studying, an email, a plan or a piece of code.',
      'In one chat, send the vague one-line version. In a new chat, send a specific version that says what, about what, for whom and in what shape, with your context and any real material pasted in.',
      'Send two follow-ups to improve the better reply, then check its facts or details against something you trust. Compare where you ended up with the first reply.',
    ],
    evidencePrompt: {
      label: 'Before and after',
      placeholder: 'For example: The vague request got general email tips. The specific one, with my draft pasted in, got a usable email. My follow-ups made it shorter and fixed the date it got wrong.',
    },
  },
  mistakes: [
    { mistake: 'Sending a one-line request and blaming the tool for a generic answer.', fix: 'Say what you want, about what, for whom and in what shape. Each detail you add removes a guess.' },
    { mistake: 'Describing your material instead of pasting it.', fix: 'Paste the actual question, error message or draft, minus any private details.' },
    { mistake: 'Correcting the same tangled chat again and again.', fix: 'Start a new chat with a better first message that includes everything you have learned so far.' },
    { mistake: 'Using the first reply without reading it closely.', fix: 'Check that it answers your real question, and confirm any facts, names or numbers before relying on them.' },
  ],
  quiz: [
    {
      question: 'Which request is most likely to get a useful answer?',
      options: [
        { text: '"Help me with my resume."', explanation: 'It gives no role, no resume and no idea what kind of help, so the reply will be general advice.' },
        { text: '"Make my resume amazing!!!"', explanation: 'Enthusiasm is not information. The model still has to guess everything.' },
        { text: '"Here is my resume. Rewrite the summary for a junior data analyst job in 3 sentences, highlighting my Python and spreadsheet projects."', explanation: 'It includes the material, the task, the goal, the length and what to emphasize.' },
        { text: '"What do employers want in a resume?"', explanation: 'A fair question, but it asks for general advice, not help with your resume.' },
      ],
      answer: 2,
    },
    {
      question: 'A chatbot explains recursion with math examples, and you find them confusing. What is the best next message?',
      options: [
        { text: '"Explain it again with a real-world example, like folders inside folders, in under 150 words."', explanation: 'It says what to change and gives a concrete direction and length.' },
        { text: '"That\'s wrong."', explanation: 'The explanation may be right, just unhelpful for you. The model cannot tell what to change.' },
        { text: '"Try again."', explanation: 'With no new information, you will likely get a similar explanation.' },
        { text: 'Ask the same question again in a new chat', explanation: 'Without saying what did not work, you are likely to get math examples again.' },
      ],
      answer: 0,
    },
    {
      question: 'You ask for help with a Python error and write "my code crashes on line 12". The reply is a generic list of possible causes. What would improve it most?',
      options: [
        { text: 'Asking it to try harder', explanation: 'The problem is missing information, not effort.' },
        { text: 'Raising the temperature for a more creative answer', explanation: 'Variety will not help the model see your actual error.' },
        { text: 'Asking the same question in a different chatbot', explanation: 'Any model given the same vague description has to guess the same way.' },
        { text: 'Pasting the full error message and the code around line 12', explanation: 'The real error and code let the model explain your problem instead of every possible problem.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Tell the AI what you want, about what, for whom and in what shape, give it your real context and material, steer it with follow-ups and check the result before you rely on it.',
  resources: [
    { title: 'Effective prompts for AI: the essentials', provider: 'MIT Sloan Teaching and Learning Technologies', description: 'A short guide to giving context and refining responses.', url: 'https://mitsloanedtech.mit.edu/ai/basics/effective-prompts/' },
    { title: 'Introduction to prompting', provider: 'Learn Prompting', description: 'A free beginner course on writing clearer requests to AI tools.', url: 'https://learnprompting.org/docs/basics/introduction' },
  ],
  underTheHood: {
    heading: 'Why a few extra words change the whole answer',
    paragraphs: [
      "A language model chooses each token based on all the text before it, including your entire message. Every detail you add changes the probabilities for every token the model writes afterward.",
      "Add \"for a 12-year-old\" and simple, everyday words become more likely all the way through the reply, not just in the first sentence. Add \"I keep mixing up glycolysis and the Krebs cycle\" and replies that compare those two become far more likely than general study advice.",
      "The flip side explains generic answers. When your message is short and vague, many kinds of reply fit it, and the most likely continuation is the one that suits the most people: the average answer. A model is not being lazy when it gives you standard tips. Given what it was told, standard tips really are the most probable reply. Specific details are how you move the most probable reply toward the one you need.",
    ],
  },
}

export default lesson
