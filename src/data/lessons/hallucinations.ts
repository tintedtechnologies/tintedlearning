import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain why a language model can produce a fluent answer that is false',
    'Spot the kinds of questions and answers most likely to contain invented details',
    'Make invented answers rarer, and catch the ones that slip through',
  ],
  bigIdea: "A hallucination is an AI answer that sounds right but is false or made up, such as a fake quote, a wrong date or a book that does not exist. It happens because a language model is built to produce likely-sounding text, and a likely-sounding answer is not always a true one. You cannot switch hallucinations off, but you can make them rarer and catch the ones that remain.",
  whyItMatters: "In 2023, two lawyers in New York filed a court document citing earlier court cases that a chatbot had supplied. Six of those cases did not exist. The chatbot had written them in exactly the format real citations use, with names, numbers and dates, and the lawyers did not look them up. The court fined them. A single search for each case would have caught it.",
  goalSections: [
    {
      heading: 'Why fluent answers can be false',
      paragraphs: [
        "A language model learned from billions of examples what answers look like: the shape of a quote, a citation, a statistic, a biography. When it has seen a fact many times, such as the boiling point of water, the likely-sounding answer and the true answer are the same thing.",
        "When it has seen a fact rarely, or never, it still produces an answer with the right shape. It fills the gaps with whatever fits the pattern: a plausible author, a believable year, a realistic number. There is no separate fact-checking step inside the model, and the wording sounds just as confident either way.",
        "This is why the problem is worst for rare details and best for common knowledge. The same model can explain gravity perfectly and then invent the title of a paper about it.",
      ],
      example: {
        language: 'text',
        code: code`
          Question: Who wrote the 1987 paper "Spaced Practice in Teenage Algebra Students"?
          (No such paper exists.)

          A reply of the kind models can give:
            "That paper was written by Dr. Helen Marsh and Robert Kline and
             published in the Journal of Mathematical Behavior."

          Every part sounds real. None of it is.
        `,
      },
    },
    {
      heading: 'Where invented details hide',
      paragraphs: [
        "Some requests are far riskier than others. The riskiest ask for exact details the model can only have seen rarely: quotes, citations, links, specific statistics, facts about people who are not famous, recent events after the model's training cutoff, and niche topics.",
        "Questions with a false premise are a trap too. Ask \"Why did Marie Curie win three Nobel Prizes?\" and some models will explain the third prize, which never happened, instead of pointing out that she won two.",
        "Another trap is a pasted link. Many chat tools cannot open web pages, but they will still write a summary based on the words in the address. Unless the tool shows it fetched the page, paste the text itself. The safest requests are the ones where you supply the material, such as rewording or summarizing text you pasted in.",
      ],
      example: {
        language: 'text',
        code: code`
          Lower risk                               Higher risk
          explain a well-known idea                exact quotes and who said them
          reword text you pasted in                citations, page numbers, links
          summarize notes you supplied             statistics and precise figures
          answer from a document you gave it       recent events and small-town news
          common facts seen many times             a question built on a false premise
        `,
      },
    },
    {
      heading: 'Making them rarer and catching them',
      paragraphs: [
        "Give the model the source. If you paste your notes and ask it to answer only from them, it has the real facts right in front of it instead of reconstructing them from memory. The lesson Retrieval-Augmented Generation shows how apps do this automatically.",
        "Give it permission not to know. Models tend to answer whatever is asked. An instruction such as \"If the notes do not say, reply: Not in my notes\" gives it an approved way out, and it will use it more often than you might expect.",
        "Ask for something checkable, such as the exact sentence it relied on, then check the high-risk parts yourself: search each citation, open each link, confirm each figure. Asking the same model \"are you sure?\" is not a check. It may apologize and change a correct answer, or repeat a wrong one.",
      ],
      example: {
        language: 'text',
        code: code`
          Using only my notes below, answer the question.
          If the notes do not contain the answer, reply exactly: Not in my notes.
          Quote the sentence from the notes that you used.

          Notes: ...
          Question: ...
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Catching a made-up source',
    intro: "A learner writing about study habits asks a chatbot for research to cite. The reply shown is the kind models often give. Two of the studies are real, and one is invented.",
    example: {
      language: 'text',
      code: code`
        Prompt: List 3 research studies showing that spaced practice helps memory.
                Give authors, year and title.

        A typical reply:
          1. Ebbinghaus (1885). Memory: A Contribution to Experimental Psychology.
          2. Cepeda, Pashler, Vul, Wixted and Rohrer (2006). Distributed practice
             in verbal recall tasks: A review and quantitative synthesis.
          3. Harlow and Vint (2014). Spacing effects in secondary school algebra.

        Searching each title in a library catalog or Google Scholar:
          1. found    2. found    3. no results
      `,
    },
    steps: [
      { code: 'Give authors, year and title.', explanation: "This request asks for exact citations, the highest-risk kind of detail. That does not mean you should not ask. It means every answer needs checking." },
      { code: '1. Ebbinghaus (1885).', explanation: "A classic of memory research, mentioned in countless books and websites. Facts seen that often are usually reproduced correctly." },
      { code: '2. Cepeda, Pashler, Vul, Wixted and Rohrer (2006).', explanation: "A real and widely cited review. Five authors in the right order is impressive, and exactly why the third entry is so easy to trust." },
      { code: '3. Harlow and Vint (2014).', explanation: "It looks the same as the others: authors, year, a sensible title on the right topic. The model produced what a third study would plausibly look like." },
      { code: '3. no results', explanation: "A real published study almost always turns up in a scholarly search. When nothing appears under that title or those authors, treat the source as nonexistent and do not cite it." },
      { code: '1. found    2. found', explanation: "Finding a study is not the end of it. Open it and check that it actually says what you are citing it for. Real sources can be described wrongly too." },
    ],
  },
  tryIt: {
    instructions: [
      'Ask a chatbot: "Why did Marie Curie win three Nobel Prizes?" Note whether it corrects the false premise. She won two.',
      'Ask it for 3 studies on a topic you are learning, with authors, year and title. Search for each one in Google Scholar or a library catalog.',
      'Paste a paragraph of your own notes and use the "Not in my notes" prompt from this lesson. Ask one question the notes answer and one they do not. Check both replies.',
    ],
    evidencePrompt: {
      label: 'What you found',
      placeholder: 'For example: It corrected the Curie question. Two of three studies were real. It replied "Not in my notes" for the question my notes did not cover.',
    },
  },
  mistakes: [
    { mistake: 'Asking "are you sure?" as your only check.', fix: 'The model cannot check itself against reality. Verify the risky parts with an independent source.' },
    { mistake: 'Trusting citations, quotes and links because they are formatted properly.', fix: 'Formatting is the easiest part for a model to get right. Search each source and open each link.' },
    { mistake: 'Pasting a link and assuming the model read the page.', fix: 'Paste the text itself, or use a tool that shows the content it fetched.' },
    { mistake: 'Building a false assumption into your question.', fix: 'Ask neutrally, such as "How many Nobel Prizes did Marie Curie win?", so the model is not nudged to explain something untrue.' },
  ],
  quiz: [
    {
      question: 'A chatbot gives you three references for your essay, each with authors, year and journal. What is the best way to check them?',
      options: [
        { text: 'Make sure they follow the citation style your teacher asked for', explanation: 'A made-up reference can be formatted perfectly. Style says nothing about whether it exists.' },
        { text: 'Ask the chatbot to confirm the references are real', explanation: 'The model cannot look outside itself to confirm anything, and it may simply say yes.' },
        { text: 'Check that each year is plausible for the topic', explanation: 'Invented references usually have plausible years, since they are built to look realistic.' },
        { text: 'Search each title in a scholarly search or library catalog and open what you find', explanation: 'An independent search shows whether each source exists and what it really says.' },
      ],
      answer: 3,
    },
    {
      question: 'Which request is most likely to produce a hallucination?',
      options: [
        { text: 'What is the capital of France?', explanation: 'This appears countless times in training text, so the likely answer is the true one.' },
        { text: 'Rewrite this paragraph in simpler words: ...', explanation: 'You supplied the material, so there is little to invent.' },
        { text: 'What exactly did the mayor of a small town say in a speech last month?', explanation: 'An exact quote, an obscure person and a recent event: three high-risk features at once.' },
        { text: 'Explain what photosynthesis is', explanation: 'A common topic explained in general terms is low risk.' },
      ],
      answer: 2,
    },
    {
      question: 'You want a model to answer only from your notes. Which instruction does most to prevent made-up answers?',
      options: [
        { text: '"If the notes do not contain the answer, reply: Not in my notes."', explanation: 'It gives the model an approved alternative to guessing, so it is less likely to fill gaps.' },
        { text: '"Be very accurate."', explanation: 'The model is not trying to be inaccurate. This adds no new information or way out.' },
        { text: '"Answer confidently and in detail."', explanation: 'This pushes it toward filling gaps, which is how inventions happen.' },
        { text: 'Setting the temperature to 0', explanation: 'That makes answers consistent, not correct. A made-up answer would just be repeated.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A hallucination is the model producing what a true answer would look like, so supply the source, allow "I don\'t know", and independently check every quote, citation, number and link that matters.',
  resources: [
    { title: 'What are AI hallucinations?', provider: 'IBM', description: 'A plain overview of causes, examples and ways to reduce them.', url: 'https://www.ibm.com/think/topics/ai-hallucinations' },
    { title: 'Why Language Models Hallucinate', provider: 'arXiv', description: 'A 2025 research paper arguing that training and testing reward guessing over admitting doubt.', url: 'https://arxiv.org/abs/2509.04664' },
    { title: 'Google Scholar', provider: 'Google', description: 'A free search engine for research papers, useful for checking whether a citation exists.', url: 'https://scholar.google.com/' },
  ],
  underTheHood: {
    heading: 'Why models guess instead of saying "I don\'t know"',
    paragraphs: [
      "Picture a multiple-choice exam that gives a point for each right answer and nothing for a blank. Guessing always beats leaving a question empty, because a guess might score and a blank never does. Researchers have pointed out that much of how language models are trained and tested works the same way: answers that are right get rewarded, and \"I don't know\" earns nothing.",
      "Pretraining adds to the habit. In the text models learn from, people mostly write when they have something to say. Confident statements vastly outnumber admissions of uncertainty, so a confident tone is simply the most likely way for an answer to sound.",
      "Inside the model, there often is a signal of doubt: the probabilities for the next token are spread across many options instead of piling onto one. But that signal never reaches the wording. Model makers now train models to decline more often when unsure, and they are improving, which is also why your instruction to say \"Not in my notes\" works.",
    ],
  },
}

export default lesson
