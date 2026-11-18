import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Technical Communication and Executive Writing and Presentations from this section. The scenario is Riverside Community College, where the dean of students has asked for an AI study assistant. The dean has described the request as "a chatbot for students".',
  goals: [
    'Ask questions that uncover the problem behind a requested feature',
    'Listen for specific examples and separate them from opinions and wishes',
    'End a discovery call with a short summary the other person can confirm or correct',
  ],
  bigIdea: "A customer usually asks for a feature, but the problem sits behind it. Discovery means asking about recent, specific situations, so you learn what really happens rather than what people think should happen. Finish each conversation by summarizing what you heard and asking the customer to correct it.",
  whyItMatters: "The dean asked for a chatbot. If the team builds one, it may answer general questions well and still miss the real problem, which is that students lose time searching their own notes before exams. Discovery is how the team finds that problem before it spends months on the wrong thing.",
  goalSections: [
    {
      heading: 'Ask about the last time, not the future',
      paragraphs: [
        "People are poor at predicting what they will do, and good at describing what they did. Ask about the last time something happened: \"When did a student last struggle to find something they needed for an exam?\" The answer contains facts you can check, such as the day, the course and the time lost.",
        "Avoid questions that invite a yes or no, or that suggest the answer. \"Would a chatbot help?\" invites politeness. \"Walk me through how a student prepares for a test\" invites the real process, with its steps and its frustrations. When an answer is vague, ask for a smaller detail, such as \"Which folder did they open first?\" Small details reveal more than broad summaries do.",
      ],
      example: {
        language: 'text',
        code: code`
          Weak:    "Would a chatbot help students study?"
          Better:  "Tell me about the last time a student needed notes from last term.
                    What did they do, and how long did it take?"
          Better:  "What do students do the night before an exam, step by step?"
        `,
      },
    },
    {
      heading: 'Listen for evidence',
      paragraphs: [
        "Practice this separation in your notes after each call, not only during the call, so that the habit becomes automatic. Separate three kinds of statements. Opinions are what people think should happen. Wishes are what they would like. Evidence is what happened, with a time, a place or a number. Opinions and wishes are worth recording, but evidence is what should shape the plan.",
        "When someone gives an opinion, ask for the example behind it. \"Students are always lost in their notes\" becomes useful when you ask, \"What was the last time that happened, and what did they do next?\" Count the examples you collect. One story is a lead, and several similar stories from different people are the beginning of evidence.",
      ],
      example: {
        language: 'text',
        code: code`
          Statement from the dean:      "Students are always lost in their notes."   (opinion)
          Follow-up:                    "What happened the last time, and how long did it take?"
          Answer from the student rep:  "Last month a friend spent two hours on three folders."  (evidence)
        `,
      },
    },
    {
      heading: 'Summarize and check',
      paragraphs: [
        "Before you leave, summarize what you heard in two or three sentences, and ask the other person to correct it. Use their words where you can. The summary is a record you can both see, and it stops the conversation from ending with two different memories of what was agreed.",
        "A good summary includes what you do not know yet. \"We have not yet confirmed how many students would use it in the first month\" is more useful than a summary that sounds complete and is not. A summary also protects the relationship, because it shows the other person you listened and that you will not commit to anything they did not say.",
      ],
      example: {
        language: 'text',
        code: code`
          Summary for the dean:
          "The main problem is that students lose time searching several course folders before
           a test. We have one example from last month, about two hours. We still need to confirm
           how many students face this each term. Did I get that right?"
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A discovery call with the dean',
    intro: "The delivery team's first call with the dean starts from the chatbot request. The script below shows how the questions move from the feature to the problem. The notes after it explain why each question works.",
    example: {
      language: 'text',
      code: code`
        You:   "You asked for a chatbot for students. What would a student do with it?"
        Dean:  "Answer questions about the course, mostly."
        You:   "Think of the last student who came to you with a study problem. What was it?"
        Dean:  "A first-year who lost track of their notes. They had three folders and an exam Friday."
        You:   "What did they do, and how long did it take them?"
        Dean:  "They came to my office. It took most of an afternoon."
        You:   "So the bigger problem is finding the right note fast, not answering course questions?"
        Dean:  "Yes, that is the part that wastes their time."
        You:   "Here is what I heard: students lose hours searching their own notes before exams.
               We have one example and still need to confirm how common it is. Did I get that right?"
      `,
    },
    steps: [
      { code: 'You asked for a chatbot for students. What would a student do with it?', explanation: "The question asks about the use, not whether the dean likes the idea. The dean's answer reveals that the chatbot was a guess about a solution." },
      { code: 'Think of the last student who came to you with a study problem.', explanation: "This question asks for a specific, recent case. Specific cases produce evidence, and general answers produce opinions." },
      { code: 'So the bigger problem is finding the right note fast, not answering course questions?', explanation: "The team offers a reframed problem as a question, so the dean can correct it. Reframing is only useful when the customer confirms it." },
      { code: 'We have one example and still need to confirm how common it is.', explanation: "The summary states what is known and what is not. The dean now knows the next thing the team will check, which builds trust." },
    ],
  },
  tryIt: {
    instructions: [
      'Pick a product or service you use. Write three questions about the last time you needed it, and avoid any question that can be answered with yes or no.',
      'Interview someone for ten minutes, using only those questions and follow-ups. Write down each statement as an opinion, a wish or evidence.',
      'Write a two-sentence summary of what you heard, including one thing you still do not know, and ask the person to correct it.',
    ],
  },
  mistakes: [
    { mistake: 'Asking whether the customer would like the feature.', fix: 'Ask about the last time the problem happened, and what the person did next.' },
    { mistake: 'Treating an opinion as evidence.', fix: 'Ask for the example behind each opinion, with a time and a result.' },
    { mistake: 'Ending the call without a summary.', fix: 'Summarize in two or three sentences, and ask the other person to correct it.' },
  ],
  quiz: [
    {
      question: 'The dean says, "Students are always lost in their notes." What is the best next question?',
      options: [
        { text: 'Would a notes app solve this for you?', explanation: 'It suggests a solution before the problem is understood, and invites a polite yes.' },
        { text: 'What was the last time that happened, and what did the student do next?', explanation: 'It asks for a specific case with a result, which is the evidence the plan needs.' },
        { text: 'Do you agree that the students should use the chatbot?', explanation: 'It asks for agreement with the team\'s idea, not for facts about the problem.' },
        { text: 'Is the budget ready for a new product?', explanation: 'The budget question is important later, but it does not reveal the problem yet.' },
      ],
      answer: 1,
    },
    {
      question: 'A student representative tells you, "I think students want more practice questions." How should you record it?',
      options: [
        { text: 'As evidence that students want the feature', explanation: 'A wish is not the same as evidence. The student\'s statement is an opinion until an example supports it.' },
        { text: 'As a requirement that must be built first', explanation: 'A requirement built from an unexamined opinion may solve the wrong problem.' },
        { text: 'As something to ignore, since students never know what they want', explanation: 'Dismissing the student\'s view throws away a useful lead. The right step is to ask for the example.' },
        { text: 'As an opinion or wish, and ask for the last time a student needed practice questions and could not find them', explanation: 'Recording it as an opinion and asking for the example keeps the plan grounded in what happened.' },
      ],
      answer: 3,
    },
    {
      question: 'At the end of a discovery call, what should you do?',
      options: [
        { text: 'Leave quickly, so the dean has time for other meetings', explanation: 'Leaving without a summary leaves two different memories of what was agreed.' },
        { text: 'Send the project plan that was prepared before the call', explanation: 'A plan written before the call ignores what you just learned.' },
        { text: 'Summarize what you heard in two or three sentences, include what is still unknown, and ask the dean to correct it', explanation: 'The summary records the agreement and the open questions, and the correction shows the dean is in charge of the problem.' },
        { text: 'Say the team will take it from here and not discuss it again', explanation: 'Ending discussion removes the dean\'s chance to correct the problem before work starts.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'Ask about specific recent situations, separate opinions and wishes from evidence, and end every discovery call with a summary the other person can correct.',
  resources: [
    { title: 'Customer development', provider: 'Wikipedia', description: 'Learning from customers before building, through structured conversations.', url: 'https://en.wikipedia.org/wiki/Customer_development' },
    { title: 'The Mom Test', provider: 'Rob Fitzpatrick', description: 'A short guide to asking customers questions that reveal real problems instead of polite opinions.', url: 'https://www.momtestbook.com/' },
  ],
  underTheHood: {
    heading: 'Why people overstate future behavior',
    paragraphs: [
      "Researchers who study forecasting have found that people often predict their own future behavior too hopefully. A person who says they will study every day in the new term may be sincere, and still miss most days. Their memory of past behavior is usually more reliable than their plan for the future, because it is anchored in events that happened.",
      "This is why discovery focuses on the past. Asking about the last time something happened brings out details that are hard to invent, such as where the person was, who they asked and how long it took. Those details are the raw material of a good plan.",
      "The effect has a social side too. People want to be helpful, so they agree with ideas that come from someone they respect. A discovery question that is open and specific gives the customer room to disagree, and disagreement is often the most useful information you will get.",
    ],
  },
}

export default lesson
