import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Tell generative AI apart from AI that only picks from fixed answers',
    'Name the main kinds of content generative AI can make',
    'Decide when a generated result is fine to use and when it needs checking',
  ],
  bigIdea: "Generative AI is artificial intelligence (AI) that makes new content, such as text, images, sound or code, in answer to a request written in plain language. It learned what that kind of content usually looks like from a huge number of examples, and it produces something that fits the pattern. The result is new, but it is a likely-looking answer, not a checked one.",
  whyItMatters: "You have a biology exam on Friday and 12 pages of notes. A chatbot can turn those notes into 20 practice questions in seconds, a job that would take you an hour. But if one of its answers swaps two terms, you could memorize the wrong fact the night before the exam. Knowing what generative AI does well, and where it slips, lets you keep the hour without keeping the wrong fact.",
  goalSections: [
    {
      heading: 'Creating instead of picking',
      paragraphs: [
        "In the lesson What is AI? you met two kinds of AI. Predictive AI picks from answers you could list in advance: spam or not spam, a price, a category. Generative AI makes an answer that did not exist before. Both learn from examples. The difference is the shape of what comes out.",
        "You usually talk to generative AI with a prompt: the instruction or question you type, such as \"Explain photosynthesis to a 12-year-old\". Ask the same thing twice and you may get two different wordings, because many good answers exist and the system produces one of them each time. A spam filter shown the same email twice gives the same label both times.",
        "A quick test: could you write every possible answer on a list before asking? If yes, the AI is picking. If no, it is generating.",
      ],
      example: {
        language: 'text',
        code: code`
          Request                                  Picks or creates?
          "Is this review positive or negative?"   picks: positive or negative
          "How long will this bus ride take?"      picks: one number
          "Summarize this review in one line."     creates: a new sentence
          "Draw a cartoon of a fox studying."      creates: a new image
        `,
      },
    },
    {
      heading: 'What generative AI can make',
      paragraphs: [
        "Text is the most common output: answers, summaries, emails, translations and study notes. A chat assistant is a text generator you talk to in turns.",
        "Image tools create pictures from a written description, and some edit an existing photo, for example by removing the background. Audio tools turn text into natural-sounding speech or create music. Video tools generate short clips from a description.",
        "Code is text with strict rules, so it deserves its own place. Code assistants suggest the next lines as you type, explain an error message or write a whole function. Code has one big advantage over an essay: you can run it and see whether it works.",
        "Many tools now accept more than one kind of input at once, such as a photo plus a question about it. That is called multimodal AI, and it has its own lesson later in this section.",
      ],
      example: {
        language: 'text',
        code: code`
          Output   A typical request                             Everyday use
          Text     "Summarize these notes in 5 bullet points"    study, email, translation
          Image    "A simple diagram of the water cycle"         slides, posters
          Audio    "Read this paragraph aloud"                   accessibility, podcasts
          Code     "Write a Python function that adds minutes"   programming help
          Video    "A 5-second clip of waves on a beach"         short ads, storyboards
        `,
      },
    },
    {
      heading: 'When a generated result needs checking',
      paragraphs: [
        "Generative AI aims for output that looks right. Most of the time that also means it is right, but not always. A made-up date, a quote nobody said or a book that does not exist can sit inside a perfectly confident sentence. The lesson AI Hallucinations explains why this happens.",
        "So match your checking to the stakes. If a mistake would be cheap and you can judge the result yourself, such as a birthday message or a first draft, use it freely and edit to taste. If a mistake would be costly or hard to spot, such as health, legal or money advice, facts you will repeat in an exam, or code that changes real data, check it against a trusted source, or run and test it, before you rely on it.",
        "Ask one more question before you paste anything in: is it private? Text you type into an online tool leaves your computer. The lesson Using AI Responsibly covers this in depth.",
      ],
      example: {
        language: 'text',
        code: code`
          Use it, then edit             Check it before relying on it
          a first draft of an email     a fact for your exam
          ideas for a project name      the dose of a medicine
          a friendlier rewording        code that deletes or changes data
          a joke for a birthday card    a summary of a contract you will sign
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Turning study notes into practice questions',
    intro: "Here is one real use from start to finish: a learner asks a free chatbot to turn a short note into quiz questions. The reply shown is a typical one. Yours will be worded differently, because the model creates a fresh answer every time.",
    example: {
      language: 'text',
      code: code`
        Prompt:
          Here are my notes: "Photosynthesis happens in the chloroplasts.
          Plants take in carbon dioxide and water and, using light, make
          glucose and release oxygen."
          Write 3 short quiz questions with answers, using only these notes.

        A typical reply:
          1. Where in the plant cell does photosynthesis happen?
             Answer: In the chloroplasts.
          2. Which two things does a plant take in for photosynthesis?
             Answer: Carbon dioxide and water.
          3. Which gas does the plant release?
             Answer: Carbon dioxide.

        Your check: answer 3 is wrong. The notes say oxygen.

        Follow-up prompt:
          Answer 3 does not match my notes, which say oxygen. Please fix it.
      `,
    },
    steps: [
      { code: 'Here are my notes: "..."', explanation: "The prompt hands over the material to work from. Pasting your own notes keeps the questions about what your class covered, instead of whatever the model happens to have seen elsewhere." },
      { code: 'using only these notes', explanation: "This tells the model where its answers should come from. It also makes mistakes easier to catch, because every answer can be compared with three short lines." },
      { code: 'A typical reply', explanation: "The questions never existed before. That is the generating part. They are clear, on topic and correctly formatted, which is exactly what generative AI is good at." },
      { code: 'Answer: Carbon dioxide.', explanation: "One answer is wrong, written in the same calm, confident style as the right ones. Nothing in the wording warns you. Slips like this are much rarer than correct answers, but they happen." },
      { code: 'Your check: answer 3 is wrong.', explanation: "Because the source is so short, checking takes ten seconds. Comparing each answer with your notes is the habit that makes generated study material safe to learn from." },
      { code: 'Follow-up prompt', explanation: "You can correct the model in the same chat, and say what the source actually says. It will usually fix the answer, but read the new version too rather than assuming it is right this time." },
    ],
  },
  tryIt: {
    instructions: [
      'Open any free AI chatbot. Do not paste in anything private.',
      'Copy one short paragraph from your own study notes, or from a public page about a topic you are learning.',
      'Ask for 3 quiz questions with answers, using only that paragraph.',
      'Check every answer against the paragraph. Then ask the same thing in a new chat and compare the two replies.',
    ],
    evidencePrompt: {
      label: 'What you found',
      placeholder: 'For example: All 3 answers matched my notes. The second chat asked different questions about the same facts.',
    },
  },
  mistakes: [
    { mistake: 'Treating a generated answer as if it were looked up.', fix: 'A chatbot creates a likely answer. Unless the tool shows you its sources, it is not reading from a checked reference. Verify any fact that matters.' },
    { mistake: 'Expecting the same reply every time.', fix: 'Generated content varies between runs. When you find a version you have checked and like, save it instead of asking again.' },
    { mistake: 'Using it for tasks that have one exact answer somewhere official.', fix: 'For a train time, a total in a spreadsheet or tomorrow\'s weather, the official source or ordinary software is faster and exact.' },
    { mistake: 'Pasting private information into an online tool.', fix: 'Remove names, account numbers and anything you would not post publicly, or use a tool your school or employer has approved.' },
  ],
  quiz: [
    {
      question: 'Which request asks AI to generate something, rather than pick from fixed answers?',
      options: [
        { text: 'Mark each email in my inbox as spam or not spam', explanation: 'There are only two possible answers, so this is picking.' },
        { text: 'Tell me whether this photo contains a cat', explanation: 'The answer is yes or no, a choice from a fixed list.' },
        { text: 'Write a two-line thank-you note to my teacher', explanation: 'The note did not exist before, and no list could hold every possible version. That is generating.' },
        { text: 'Sort my photos by the date they were taken', explanation: 'This uses the date stored with each photo. It is ordinary software, not AI at all.' },
      ],
      answer: 2,
    },
    {
      question: 'You ask a chatbot the same question in two new chats and get two differently worded answers. What does that most likely mean?',
      options: [
        { text: 'Nothing is wrong: it creates a fresh answer each time, and many wordings fit', explanation: 'Variation between runs is normal for generative AI. Judge each answer on whether it is correct, not on whether it matches the other.' },
        { text: 'One of the two chats is broken', explanation: 'Both chats worked as designed. Different wording is expected.' },
        { text: 'The second answer is more accurate because it is newer', explanation: 'Neither run has more information than the other. A later answer is not a corrected one.' },
        { text: 'The tool copied each answer from a different website', explanation: 'A plain chatbot writes new text from patterns it learned. It is not pasting from pages.' },
      ],
      answer: 0,
    },
    {
      question: 'A chatbot gives you a clear, confident list of a medicine\'s side effects for a family member. What should you do next?',
      options: [
        { text: 'Use it, because the answer is clear and confident', explanation: 'Generated text sounds confident whether or not it is correct, so confidence is no evidence.' },
        { text: 'Ask the chatbot whether it is sure', explanation: 'It may simply say yes. Asking the same tool is not an independent check.' },
        { text: 'Never use AI for anything health related again', explanation: 'The answer may well be helpful. The point is to check it, not to throw the tool away.' },
        { text: 'Check it against the medicine\'s leaflet or ask a pharmacist before relying on it', explanation: 'A mistake here could be costly, so it needs a trusted source that does not depend on the chatbot.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Generative AI creates new text, images, audio and code from a plain-language request, so use it freely for drafts and ideas, and check it whenever being wrong would matter.',
  resources: [
    { title: 'Introduction to Generative AI', provider: 'Google Skills', description: 'A short free course on what generative AI is and how it differs from other machine learning.', url: 'https://www.cloudskillsboost.google/course_templates/536' },
    { title: 'Introduction to generative AI and agents', provider: 'Microsoft Learn', description: 'A free beginner module on what generative AI can do, with everyday examples.', url: 'https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/' },
  ],
  underTheHood: {
    heading: 'Why a model may not know about last month',
    paragraphs: [
      "A generative model learns from a large collection of examples gathered up to a certain date. For a text model, that means an enormous amount of writing: books, websites, code and more. When training ends, what the model learned is frozen. The date its examples stop is called its training cutoff.",
      "Ask about something that happened after the cutoff and the model has no examples to draw on. It may say it does not know. It may also produce a plausible guess and present it as fact, because producing plausible text is exactly what it was trained to do.",
      "Many assistants work around this by searching the web or reading files you give them, then writing an answer from what they found. When a tool shows sources or links, it is usually doing this. When it shows none, assume the answer came from frozen training data, and check anything recent yourself.",
    ],
  },
}

export default lesson
