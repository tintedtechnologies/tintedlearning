import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Split a sentence into tokens and say why some words become several pieces',
    'Estimate a token count from a word count, and spot text that needs more tokens',
    'Explain how tokens set the size limit and cost of a request',
  ],
  bigIdea: "A language model does not read letters or whole words. It reads tokens: common chunks of text, such as a short word, part of a longer word, a word with its leading space, or a single punctuation mark. Everything you send and everything the model writes back is counted in tokens, so tokens decide how much fits in one request and, on paid services, what it costs.",
  whyItMatters: "You paste a long report into an AI tool and get an error saying the text is too long, even though it is well under the length the tool advertises in words. Or a teammate builds an AI feature that costs far more than they planned. Both surprises come from counting in words while the model counts in tokens.",
  goalSections: [
    {
      heading: 'How text becomes tokens',
      paragraphs: [
        "Before a model can work with text, a program called a tokenizer cuts it into pieces from a fixed list, its vocabulary. The vocabulary is built before training by finding chunks that appear often in a huge amount of text. Depending on the model, it holds tens of thousands to a few hundred thousand pieces.",
        "Common words usually get a single token. Rarer words are built from smaller pieces. Spaces normally attach to the start of the next word, so \" studied\" with its space is one token. Each token is then swapped for its ID number, and those numbers are all the model ever sees.",
        "The examples in this lesson use the tokenizer behind this site's Tokens playground. Other models cut text differently, so their counts will be a little different, but the patterns are the same.",
      ],
      example: {
        language: 'text',
        code: code`
          Text:    I studied algebra for 40 minutes.
          Tokens:  [I] [ studied] [ algebra] [ for] [ ] [40] [ minutes] [.]
          IDs:     40  26413      80925      395    220 1723 5438       13
          Count:   6 words, 8 tokens
        `,
      },
    },
    {
      heading: 'Words and tokens are different counts',
      paragraphs: [
        "For ordinary English, a common rough guide is that 100 tokens is about 75 words. So to estimate tokens, multiply the word count by 4 and divide by 3. A 1,500-word article is roughly 2,000 tokens.",
        "That guide works for everyday English prose. Some text needs many more tokens per word: long or rare words, names, unusual capitals, numbers and dates, computer code, and many languages other than English, because the vocabulary was built mostly from English text.",
        "When the count really matters, such as checking a document fits before you send it, measure it with a tool for the model you use instead of estimating.",
      ],
      example: {
        language: 'text',
        code: code`
          Text                                    Tokens
          hello                                   1     [hello]
          HELLO                                   2     [HEL] [LO]
          unbelievably                            3     [un] [bel] [ievably]
          2026-03-02                              6     [202] [6] [-] [03] [-] [02]
          I studied algebra for 40 minutes.       8
          Estudié álgebra durante 40 minutos.    10     (the same sentence in Spanish)
        `,
      },
    },
    {
      heading: 'Why tokens set limits and cost',
      paragraphs: [
        "Every model has a limit on how many tokens it can handle in one go, called its context window. Your message, any earlier conversation and the reply all share that one limit. The lesson What is a Context Window? covers what happens when it fills up.",
        "Paid AI services, especially the ones developers call from code, usually charge per token, with one price for input tokens you send and another for output tokens the model writes. A long document sent with every request costs money every single time.",
        "Tokens also set speed. A model writes its reply one token at a time, so a 600-token answer takes noticeably longer than a 60-token one. Many tools let you set a maximum number of output tokens, which caps both the length and the cost of a reply.",
      ],
      example: {
        language: 'text',
        code: code`
          Study notes to send:      1,500 words  ->  about 2,000 input tokens
          Summary you ask for:        300 words  ->  about   400 output tokens
          One request in total:                      about 2,400 tokens

          Ask 50 times with the full notes:          about 120,000 tokens
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Counting the tokens in one study note',
    intro: "Here is a single Study Tracker note, cut into tokens by the same tokenizer. Each bracket is one token. The steps point out where the count goes up, and why.",
    example: {
      language: 'text',
      code: code`
        Note:    Studied algebra for 40 minutes on 2026-03-02. Factoring quadratics is getting easier!

        Tokens:  [Stud] [ied] [ algebra] [ for] [ ] [40] [ minutes] [ on] [ ]
                 [202] [6] [-] [03] [-] [02] [.] [ Fact] [oring] [ quadr]
                 [atics] [ is] [ getting] [ easier] [!]

        Count:   12 words, 24 tokens
      `,
    },
    steps: [
      { code: '[Stud] [ied]', explanation: "At the start of the note, \"Studied\" has a capital letter and no space in front, which is less common, so it takes two tokens. In the earlier example, \" studied\" in lowercase with a space was just one." },
      { code: '[ algebra] [ for] [ minutes] [ on]', explanation: "Everyday words cost one token each, with their space attached. Most ordinary English looks like this." },
      { code: '[ ] [40]', explanation: "The space before a number is often a token of its own, followed by the digits." },
      { code: '[202] [6] [-] [03] [-] [02]', explanation: "The date alone uses 6 tokens. Numbers are split into short groups of digits, and every dash is separate. Text full of dates, prices or IDs uses tokens quickly." },
      { code: '[ Fact] [oring] [ quadr] [atics]', explanation: "Less common words are built from pieces. The model still handles them well, because it learned what those pieces mean together." },
      { code: '12 words, 24 tokens', explanation: "Two tokens per word, far above the rough guide of 4 for every 3 words. A note full of dates and subject terms is not ordinary prose, which is why measuring beats guessing when the count matters." },
    ],
  },
  tryIt: {
    instructions: [
      'Open the Tokens playground and type `I studied algebra for 40 minutes.` Check that you see the same 8 tokens.',
      'Change it to all capital letters, then to a date-heavy line such as `2026-03-02 to 2026-03-09`. Write down how the count changes.',
      'Paste in one paragraph of your own study notes. Compare its token count with your estimate of words times 4 divided by 3.',
    ],
    playground: 'tokens',
    evidencePrompt: {
      label: 'What you measured',
      placeholder: 'For example: My 120-word note was 190 tokens, more than my estimate of 160, because it had lots of dates and chemistry terms.',
    },
  },
  mistakes: [
    { mistake: 'Assuming one word is one token.', fix: 'Estimate with words times 4 divided by 3 for plain English, and expect more for numbers, code and other languages.' },
    { mistake: 'Using one model\'s token count for a different model.', fix: 'Each model family has its own tokenizer. Measure with the counting tool for the model you actually use.' },
    { mistake: 'Forgetting that the reply counts too.', fix: 'Leave room for the answer inside the limit, and set a maximum output length when you need to control cost.' },
    { mistake: 'Sending a whole document when the question is about one part.', fix: 'Send only the section that matters. It costs fewer tokens and often gets a better answer.' },
  ],
  quiz: [
    {
      question: 'In the Tokens playground, `Hello` is 1 token but `HELLO` is 2. What is the best explanation?',
      options: [
        { text: 'Capital letters are not allowed, so the tokenizer splits them up', explanation: 'Capitals are allowed. They just appear less often in the text the vocabulary was built from.' },
        { text: 'Hello is common enough to have its own vocabulary entry, but the all-capitals form is rare and is built from pieces', explanation: 'The vocabulary favors chunks that appear often. Rarer spellings are assembled from smaller tokens.' },
        { text: 'The tokenizer counts one token for every 3 letters', explanation: 'Token length varies. "Hello" has 5 letters and is still a single token.' },
        { text: 'The model treats capitals as shouting and adds a warning token', explanation: 'Tokenizers only cut text into pieces. They add nothing about tone.' },
      ],
      answer: 1,
    },
    {
      question: 'Roughly how many tokens is a 600-word article in ordinary English?',
      options: [
        { text: 'About 450', explanation: 'That multiplies by 3 and divides by 4, the wrong way round. Tokens usually outnumber words.' },
        { text: 'Exactly 600', explanation: 'Many words take more than one token, and punctuation counts too.' },
        { text: 'About 3,000', explanation: 'That is closer to the number of letters. Most tokens are several letters long.' },
        { text: 'About 800', explanation: '600 x 4 / 3 = 800, using the rough guide that 100 tokens is about 75 words.' },
      ],
      answer: 3,
    },
    {
      question: 'Your app sends a 3,000-token document and asks for a 500-token summary, using a service that charges per token. What are you charged for?',
      options: [
        { text: 'Both the 3,000 input tokens and the 500 output tokens', explanation: 'Per-token services count what you send and what the model writes, usually at separate prices.' },
        { text: 'Only the 500 tokens in the summary', explanation: 'The document you send is counted too, and it is usually the larger part.' },
        { text: 'Only the 3,000 tokens in the document', explanation: 'The tokens the model writes back are counted as well.' },
        { text: 'Nothing, as long as the reply is short', explanation: 'A short reply lowers the output count, but the input is still charged.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Models read and write tokens, not words, so expect about 4 tokens for every 3 English words, more for numbers, code and other languages, and remember that tokens set both the limit and the bill.',
  resources: [
    { title: 'Tokenizers', provider: 'Hugging Face LLM Course', description: 'How text is split into tokens and turned into the numbers a model reads.', url: 'https://huggingface.co/learn/llm-course/chapter2/4' },
    { title: 'Byte-Pair Encoding tokenization', provider: 'Hugging Face LLM Course', description: 'A step-by-step walk through how a common tokenizer learns its vocabulary.', url: 'https://huggingface.co/learn/llm-course/chapter6/5' },
  ],
  underTheHood: {
    heading: 'How a tokenizer learns its vocabulary',
    paragraphs: [
      "Many tokenizers are built with a method called byte pair encoding. It starts with the smallest possible pieces, single characters, or more precisely the bytes that computers use to store them. Then it counts every pair of neighboring pieces across a huge amount of text.",
      "The most common pair is merged into a new token. If \"l\" followed by \"o\" is the most frequent pair, \"lo\" joins the vocabulary. The counting repeats with the new piece included, so \"lo\" plus \"w\" might become \"low\" next. The process stops when the vocabulary reaches its chosen size.",
      "This explains everything you saw in this lesson. Frequent words get merged all the way into single tokens, rare ones stay as several pieces, and text in languages that were rare in the training text gets fewer merges. Because the starting pieces are bytes, any text at all, including emoji and unfamiliar alphabets, can still be encoded, just with more tokens.",
    ],
  },
}

export default lesson
