import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Add up what goes into one request and check it fits the context window',
    'Predict which parts of a long conversation an app drops first',
    'Keep important details in view, knowing the model cannot tell what it has lost',
  ],
  bigIdea: "A context window is the most text, counted in tokens, that a model can work with in one request, including the reply it writes. Everything the model knows about your conversation has to fit inside that window, every single time. When a conversation outgrows it, the app leaves older parts out, and the model has no idea they ever existed.",
  whyItMatters: "You spend an afternoon planning a study schedule with a chatbot. Near the start you mentioned that you work on Tuesdays. Two hours later it puts a long session on a Tuesday. It is not ignoring you. That early message no longer fits in what the app sends, so as far as the model can tell, you never said it.",
  goalSections: [
    {
      heading: 'What goes into the window',
      paragraphs: [
        "A model keeps no memory between requests, as you saw in What is a Large Language Model? So every time you send a message, the app builds a fresh package: its own instructions, called the system prompt, the whole conversation so far, any files or search results, and your new message. The reply must also fit in whatever space is left.",
        "That is why the window fills up as a chat grows. Message 50 carries the weight of the 49 before it.",
        "Window sizes vary a lot between models and have grown over the years, from a few thousand tokens in early chat models to hundreds of thousands in many newer ones. The model's own documentation gives the current figure. Whatever the size, the same adding-up applies.",
      ],
      example: {
        language: 'text',
        code: code`
          One request to a model with an 8,000-token window:

          System prompt                  300 tokens
          Conversation so far          5,200 tokens
          Pasted study notes           1,800 tokens
          Your new message                60 tokens
          -----------------------------------------
          Used                         7,360 tokens
          Left for the reply             640 tokens
        `,
      },
    },
    {
      heading: 'What gets dropped when it overflows',
      paragraphs: [
        "When everything no longer fits, something has to go. Apps handle this in different ways. Many keep the system prompt and the newest messages, and drop the oldest ones. Some replace old messages with a short summary. Some refuse with a \"too long\" error, or quietly use only the first part of a pasted document.",
        "Each app picks its own approach, and most do it without telling you. The safe assumption is that in a long chat, the earliest messages are the first to disappear.",
        "Fitting is not the whole story either. Research on long inputs has found that models use details near the start and end more reliably than details buried in the middle. A fact can be inside the window and still be overlooked.",
      ],
      example: {
        language: 'text',
        code: code`
          Window full. A common approach, oldest first:

          [kept]     System prompt
          [dropped]  Message 1: I work on Tuesdays, so no sessions then.
          [dropped]  Message 2: ...
          [kept]     Messages 3 to 40
          [kept]     Your new message: Plan next week's sessions.
        `,
      },
    },
    {
      heading: 'The model cannot see what it forgot',
      paragraphs: [
        "Dropped text does not fade or leave a gap. It is simply absent from the input. The model cannot say \"I forgot that part\", because from its point of view there is nothing missing. It answers from what it can see: it may say you never told it, or it may confidently guess.",
        "So the fix is up to you. Restate key facts when they matter. When a chat gets long, start a new one that opens with a short summary of what matters. Send only the relevant section of a document, not the whole thing.",
        "Some assistants offer a memory feature that saves facts about you between chats. It works by adding those saved notes back into the window, so they still take up room. The lesson AI Assistants covers this.",
      ],
      example: {
        language: 'text',
        code: code`
          First message in a fresh chat:

          Context: I'm planning study sessions for algebra and biology.
          I work on Tuesdays, so no sessions then. At most 90 minutes a day.
          So far: Monday algebra 60 min, Wednesday biology 45 min.
          Task: plan Thursday to Sunday.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A conversation outgrowing a tiny window',
    intro: "This is the conversation in the Context windows playground, with its real token counts and the window set to 40 tokens, small enough to watch it overflow. The app keeps the system prompt, then fits as many of the newest messages as it can.",
    example: {
      language: 'text',
      code: code`
        Role        Message                                                       Tokens  Sent?
        System      You are a helpful tutor.                                           6  kept
        User        My name is Jordan. Explain machine learning in simple terms.      12  dropped
        Assistant   Machine learning helps software find patterns from examples.       9  kept
        User        Give me a real-world example.                                      7  kept
        Assistant   A music app can learn listening patterns to recommend a song.     12  kept
        User        What was my name?                                                  5  kept

        All six messages: 51 tokens. Sent: 39 of 40.
        A typical reply: "I don't think you've told me your name. What should I call you?"
      `,
    },
    steps: [
      { code: 'System  You are a helpful tutor.  6  kept', explanation: "The app always keeps its own instructions, so it reserves those 6 tokens first. That leaves 34 for the conversation." },
      { code: 'User  What was my name?  5  kept', explanation: "The app works backwards from the newest message. The question costs 5, leaving 29." },
      { code: 'Assistant ... 12, User ... 7, Assistant ... 9', explanation: "The next three messages back cost 12, 7 and 9 tokens. After them, only 1 token of room is left." },
      { code: 'User  My name is Jordan. ...  12  dropped', explanation: "The oldest message needs 12 tokens and only 1 remains, so it is left out. It is the one message that held the name." },
      { code: 'All six messages: 51 tokens. Sent: 39 of 40.', explanation: "On screen you still see all six messages, so the chat looks complete to you. The model only receives five of them." },
      { code: 'A typical reply: "I don\'t think you\'ve told me your name."', explanation: "The model is not lying or being careless. In the text it received, no name appears, so this is a reasonable answer. Another run might invent a name instead, which is worse, because it sounds certain." },
    ],
  },
  tryIt: {
    instructions: [
      'Open the Context windows playground. Move the slider to 55 tokens and check that all six messages are kept.',
      'Lower it to 50, then 40. Note the point where "My name is Jordan" is dropped, and add the message "What was my name?" to see what the model can and cannot see.',
      'Write a two-line summary you could paste into a new chat so the name and the topic survive. Count its tokens in the Tokens playground.',
    ],
    playground: 'context',
    evidencePrompt: {
      label: 'What you found',
      placeholder: 'For example: The name was dropped below 51 tokens. My summary "I am Jordan, learning machine learning basics" was 9 tokens.',
    },
  },
  mistakes: [
    { mistake: 'Assuming the model remembers everything said earlier in a long chat.', fix: 'Restate facts that matter, or start a new chat with a short summary of the key details.' },
    { mistake: 'Pasting several whole documents just in case.', fix: 'Extra text pushes your conversation out of the window and costs tokens. Send only the sections the question needs.' },
    { mistake: 'Taking "you never told me" as proof that you never did.', fix: 'The model only knows what was sent this time. If you did say it earlier, the message has probably been dropped.' },
    { mistake: 'Leaving no room for the reply.', fix: 'The answer shares the window. If the input nearly fills it, the reply may be cut short or the request rejected.' },
  ],
  quiz: [
    {
      question: 'A model has an 8,000-token window. Your app sends 300 tokens of instructions, a 6,500-token conversation and a 1,000-token document. What happens?',
      options: [
        { text: 'It fits easily, with room to spare', explanation: 'The input uses 7,800 tokens, which leaves only 200 for the reply.' },
        { text: 'The model reads the first 8,000 words and ignores the rest', explanation: 'Windows are measured in tokens, not words, and the reply needs space too.' },
        { text: 'The reply can only be about 200 tokens, so it may be cut short unless the app trims something', explanation: '300 + 6,500 + 1,000 = 7,800, and the reply shares the same 8,000-token limit.' },
        { text: 'The model automatically compresses the conversation to make room', explanation: 'Models do not do this by themselves. If anything is trimmed or summarized, the app does it.' },
      ],
      answer: 2,
    },
    {
      question: 'Late in a long chat you ask "What was my name?", but the early message with your name has been dropped. What is the most likely reply?',
      options: [
        { text: '"Sorry, that message was dropped from my context window."', explanation: 'The model cannot see that anything was dropped, so it cannot report it.' },
        { text: 'Your correct name, because the app still shows it on screen', explanation: 'What you see on screen is not what the model receives.' },
        { text: 'An error message from the app', explanation: 'Apps usually trim messages quietly rather than showing an error.' },
        { text: 'It says you have not told it, or it guesses a name', explanation: 'With the name missing from its input, the model answers from what it can see, and it may even invent one.' },
      ],
      answer: 3,
    },
    {
      question: 'You want to continue a long study-planning chat in a new conversation. What is the best first message?',
      options: [
        { text: 'A short summary of the key facts and limits, followed by the next task', explanation: 'This puts exactly what matters into the fresh window, near the start where it is used most reliably.' },
        { text: '"Continue where we left off."', explanation: 'A new chat has none of the old conversation, so there is nothing to continue from.' },
        { text: 'The entire old conversation pasted in', explanation: 'It may not fit, it costs many tokens, and key details can get lost in the middle.' },
        { text: '"Remember everything I have ever told you."', explanation: 'This adds no facts to the window, so the model still has nothing to remember.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Everything a model knows about your conversation must fit in its context window every time, so keep what matters short, recent and restated, because the model cannot tell you what was left out.',
  resources: [
    { title: 'Lost in the Middle', provider: 'arXiv', description: 'The 2023 study showing models use the start and end of long inputs more reliably than the middle.', url: 'https://arxiv.org/abs/2307.03172' },
    { title: 'Context windows', provider: 'Claude Docs', description: 'One provider\'s guide to how conversation turns and replies share the window.', url: 'https://docs.claude.com/en/docs/build-with-claude/context-windows' },
    { title: 'Long context', provider: 'Google AI for Developers', description: 'Another provider\'s guide to working with very long inputs.', url: 'https://ai.google.dev/gemini-api/docs/long-context' },
  ],
  underTheHood: {
    heading: 'Why details in the middle get overlooked',
    paragraphs: [
      "In the 2023 study Lost in the Middle, researchers hid one useful fact at different positions in long inputs and asked questions about it. Models answered best when the fact was near the start or the end, and noticeably worse when it sat in the middle.",
      "Two reasons help explain it. Much of the text models learn from puts important material at the edges: titles and introductions first, the most recent and relevant words last. And when a token's attention is shared across many thousands of other tokens, each one in a long middle stretch gets only a small share.",
      "Newer models have improved on this, but the pattern is a good guide to how you arrange a long prompt. Put your key instructions at the start, place any long documents after them, and finish with the actual question, so the most important parts sit where the model uses them best.",
    ],
  },
}

export default lesson
