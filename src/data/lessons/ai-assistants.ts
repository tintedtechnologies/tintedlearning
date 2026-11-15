import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'List what an assistant adds on top of a bare model',
    'Explain how memory, files and tools work inside an assistant, and what each means for your data',
    'Choose the right kind of assistant for a job with a short checklist',
  ],
  bigIdea: "A model on its own only turns text into more text. An AI assistant is an app built around a model that adds extras: a system prompt, memory of past chats, the ability to read your files, and tools such as web search or running code. Knowing which extras an assistant has tells you what it can really do, and what it does with your data.",
  whyItMatters: "You ask an assistant what tomorrow's weather will be. One searches the web and gives you a forecast with a link to its source. Another confidently describes typical weather for the time of year, because it has no search tool and can only guess. Both look like the same chat box. Knowing what is behind the box tells you which answer to trust.",
  goalSections: [
    {
      heading: 'A model plus extras',
      paragraphs: [
        "A bare model takes text in and gives text out. Its knowledge stops at its training cutoff, it remembers nothing between requests, and it cannot open a web page or do anything in the world.",
        "An assistant wraps that model in an app. The app adds a system prompt, sends the conversation history, saves notes between chats, pulls text out of your files and runs tools on the model's behalf. Many also add voice, image generation and connections to email, calendars or cloud drives.",
        "Every extra works in one of two ways. Either the app adds more text to the context window, or the model asks the app to run a tool and the app sends back the result. The model itself never changes.",
      ],
      example: {
        language: 'text',
        code: code`
          You -> the app builds the input:
                 system prompt + memory notes + file excerpts + your message
              -> the model replies, or asks for a tool: "search: weather Boston tomorrow"
              -> the app runs the search and adds the results to the input
              -> the model writes its answer from those results
              -> you see the reply, with links to the sources
        `,
      },
    },
    {
      heading: 'How memory, files and tools work',
      paragraphs: [
        "Memory is saved notes. The app writes down short facts, such as \"studies on weekday evenings\", and adds relevant ones into future chats. The model has not learned anything about you, and you can usually view and delete these notes in the settings.",
        "Files are turned into text. For a long file, the app often searches it and inserts only the parts that seem relevant, a technique the lesson Retrieval-Augmented Generation explains. So an assistant may not have read every page you uploaded.",
        "Tools are run by the app, not the model. The model writes a request such as a search query, and the app carries it out. The lesson Tool Calling shows how. Each extra also means the assistant holds more of your information, so check what is saved, for how long, and whether your chats are used to train future models.",
      ],
      example: {
        language: 'text',
        code: code`
          Extra        What really happens                    Ask yourself
          Memory       saved notes added to new chats         Can I see and delete them?
          Files        text pulled out, often only parts used Did it read the whole file?
          Web search   the app searches and adds results      Does it show its sources?
          Running code the app runs code in a safe sandbox    Did it run code or just guess?
          Connectors   the app reads your email or calendar   What can it see and change?
        `,
      },
    },
    {
      heading: 'Choosing an assistant for a job',
      paragraphs: [
        "Product features change every few months, so instead of memorizing which product does what, ask what the job needs and check the assistant's current help pages for each item.",
        "Does the job need current information? Then you need search that shows sources. Your own documents? File support, and a way to check it read all of them. Calculations or data? An assistant that runs code instead of doing arithmetic in its head. Private information? A clear data policy, a tool your school or employer approved, or a local model.",
        "Will it take actions, such as sending email or editing a calendar? Then it must ask before acting, with access limited to what the job needs. Finally, as in AI Models and Model Selection, try it on a few real examples before you rely on it.",
      ],
      example: {
        language: 'text',
        code: code`
          Job                                   Needs
          "What changed in the bus timetable?"  search with sources
          "Quiz me on my uploaded notes"        file support that reads them all
          "Average my last 10 quiz scores"      code execution
          "Draft replies to my email"           email access, asks before sending
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Choosing an assistant for a study group',
    intro: "A study group of four wants an assistant for Biology 101, whose course book is a 120-page PDF, the common document file format. They run through the checklist, then test one candidate on three real questions. The results are typical of what groups find.",
    example: {
      language: 'text',
      code: code`
        Job: help a 4-person study group with Biology 101

        Checklist:
          current info?    no, the course material is fixed
          own documents?   yes, a 120-page course PDF          -> file support
          calculations?    yes, averaging quiz scores          -> code execution
          private data?    quiz scores and names               -> check the policy, use initials
          actions?         deadline reminders in a calendar    -> must ask before adding events

        Test on 3 real questions:
          "What does chapter 7 say about enzymes?"   answer with page numbers     pass
          "Average of 72, 85, 91 and 64?"            78, showing the code it ran  pass
          "What is on page 118?"                     a vague, general answer      fail

        Decision: use it, but upload the course one chapter at a time
      `,
    },
    steps: [
      { code: 'current info? no, the course material is fixed', explanation: "Not every job needs every extra. Ruling out web search here means the group can focus on file handling." },
      { code: 'private data? quiz scores and names', explanation: "Scores are personal. Using initials instead of names and checking the data policy costs nothing and limits what the assistant holds." },
      { code: 'actions? ... must ask before adding events', explanation: "An assistant that can edit a shared calendar can also make a mess of it. Requiring confirmation keeps a person in charge of every change." },
      { code: '"Average of 72, 85, 91 and 64?" ... 78, showing the code it ran', explanation: "72 + 85 + 91 + 64 = 312, and 312 divided by 4 is 78. Because the assistant ran code and showed it, the group can see how it got there instead of trusting mental arithmetic." },
      { code: '"What is on page 118?" ... fail', explanation: "A question about a detail near the end of the file exposes the problem: the assistant only used some parts of the long PDF. Without this test, the group would not have known." },
      { code: 'Decision: ... one chapter at a time', explanation: "The test changed how they use the tool, not whether. Smaller uploads mean each one is more likely to be read in full." },
    ],
  },
  tryIt: {
    instructions: [
      'Pick an AI assistant you use. Find out from its settings or help pages: does it have memory, and can you view and delete it? Can it search the web, read files or run code?',
      'Check its data settings: are your chats used to train future models, and can you turn that off?',
      'Test one feature yourself: ask a question that needs current information and see whether it shows sources, or upload a long document and ask about a detail near the end.',
    ],
    evidencePrompt: {
      label: 'What you found',
      placeholder: 'For example: It has memory, and I deleted two old notes. It searches the web and shows links. Training on my chats was on, and I turned it off.',
    },
  },
  mistakes: [
    { mistake: 'Assuming every assistant can search the web.', fix: 'Look for sources or a search indicator. Without them, assume the answer came from training data that may be out of date.' },
    { mistake: 'Thinking memory means the model has learned about you.', fix: 'Memory is saved notes added to new chats. Review and delete them in the settings like any other stored data.' },
    { mistake: 'Uploading a long document and assuming every page was read.', fix: 'Ask about a detail near the end. If it cannot answer, split the document into smaller parts.' },
    { mistake: 'Connecting email or a calendar without checking what the assistant can do there.', fix: 'Give it the least access the job needs, and make sure it asks before sending or changing anything.' },
  ],
  quiz: [
    {
      question: 'You ask two assistants for today\'s exchange rate. One gives a number with a link to a financial site. The other gives a number with no source. What is the most likely difference?',
      options: [
        { text: 'The second assistant uses a smaller model', explanation: 'Size does not give a model today\'s rates. Only a tool that fetches current data does.' },
        { text: 'The first used a search tool, and the second answered from training data that may be out of date', explanation: 'A linked source suggests a live search. With no source, the number likely came from the model\'s frozen training data.' },
        { text: 'Both searched, but the second chose not to show the link', explanation: 'Assistants with search usually show sources. Assume no source means no search.' },
        { text: 'There is no real difference, since exchange rates rarely change', explanation: 'Exchange rates change constantly, which is exactly why a current source matters.' },
      ],
      answer: 1,
    },
    {
      question: 'In a brand-new chat, an assistant asks "How did your algebra exam go?" How does it know about the exam?',
      options: [
        { text: 'The model was retrained on your chats overnight', explanation: 'Models are not retrained for one user. The weights did not change.' },
        { text: 'It guessed, because many users study algebra', explanation: 'Mentioning a specific exam is not a lucky guess. The information came from somewhere.' },
        { text: 'It can see every chat you have ever had', explanation: 'Old chats are not all sent along. That would quickly overflow the context window.' },
        { text: 'A memory feature saved a note earlier, and the app added it to this chat', explanation: 'Memory is stored notes that the app inserts into new conversations.' },
      ],
      answer: 3,
    },
    {
      question: 'You want an assistant to add your study deadlines to your calendar. What should you check first?',
      options: [
        { text: 'Whether it asks before adding events, and how much of your calendar it can access', explanation: 'An assistant that acts on your behalf needs limited access and a confirmation step.' },
        { text: 'Whether it uses the newest model available', explanation: 'A newer model does not make unchecked calendar changes safe.' },
        { text: 'Whether its replies are friendly', explanation: 'Tone does not matter if it can delete or change events without asking.' },
        { text: 'Whether it can generate images', explanation: 'Image generation has nothing to do with managing a calendar.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'An assistant is a model plus extras that add text to its context or run tools for it, so choose one by what the job needs and check what it stores and can do with your data.',
  resources: [
    { title: 'What are tools?', provider: 'Hugging Face Agents Course', description: 'How assistants and agents give a model abilities such as search and running code.', url: 'https://huggingface.co/learn/agents-course/unit1/tools' },
    { title: 'What is an agent?', provider: 'Hugging Face Agents Course', description: 'A free introduction to how apps combine a model, tools and memory.', url: 'https://huggingface.co/learn/agents-course/unit1/what-are-agents' },
  ],
  underTheHood: {
    heading: 'What happens when an assistant searches the web',
    paragraphs: [
      "When you ask about something recent, the model first decides a search would help. Instead of answering, it writes a short structured request, such as a search query, which the app recognizes as a tool call rather than a reply.",
      "The app sends the query to a search engine and fetches the top results, sometimes whole pages, sometimes just snippets. It adds that text to the context, marked as search results, and asks the model to continue. Now the model writes its answer with fresh text in front of it, and the app shows the links it used.",
      "Three consequences follow. The answer can only be as good as the query and the results it found. The model can still misread a source, or cite a page that does not quite say what it claims, so open the important links. And search results are text written by strangers, which could even contain instructions aimed at the model. The security lessons cover that risk, known as prompt injection.",
    ],
  },
}

export default lesson
