import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain why a word\'s meaning depends on the words around it',
    'Work through how attention blends information from other tokens into one token',
    'Describe how a transformer stacks attention layers before predicting the next token',
  ],
  bigIdea: "A transformer is the neural network design behind modern language models. Its key part, called attention, lets every token look at the other tokens in the text and decide which ones matter for understanding it. Stacking many attention layers lets the model build meaning up step by step, from single words to whole ideas, before it predicts the next token.",
  whyItMatters: "Read \"She put the notes in her bag because it was full.\" You know \"it\" means the bag, not the notes, without even thinking. Older language software struggled with exactly this, especially when the clue was many words away. Attention is what lets a model link \"it\" to \"bag\", and it also explains why very long prompts are slow and costly. This lesson is optional depth: nothing later depends on it, but it explains a lot of what you will see models do.",
  goalSections: [
    {
      heading: 'Meaning depends on the neighbors',
      paragraphs: [
        "Inside a model, each token starts as a list of numbers that stands for it. The lesson Embeddings covers these lists properly. For now, the key fact is that a token always starts with the same numbers, wherever it appears.",
        "That is a problem, because many words change meaning with their surroundings. \"Bank\" is a riverside in one sentence and a place for money in another. \"It\" can point to almost anything. To understand a token, the model has to update its numbers using the tokens around it.",
        "Before transformers, language models read text one word at a time, left to right, carrying a running summary forward. Clues from far back tended to fade from that summary. Attention removes the problem: every token can look directly at every earlier token, however far away it is.",
      ],
      example: {
        language: 'text',
        code: code`
          I sat on the bank of the river.         bank -> riverside
          I paid the fee at the bank.             bank -> money
          The bank, which was steep and muddy,
            made me push my bike.                 bank -> riverside, from words 3 to 6 away
        `,
      },
    },
    {
      heading: 'How attention works',
      paragraphs: [
        "In plain words, attention works like a quick search. Each token sends out a question about what it needs. Every other token offers a label describing what it contains. The better a label matches the question, the higher that token's score.",
        "The scores are turned into percentages that add up to 100%. Then the token's new numbers are a blend of the other tokens' information, mixed in those proportions. If \"it\" gives the bag 70% of its attention, its new numbers become mostly bag-like.",
        "The questions and labels are not written by anyone. They come from weights learned in training, just like the neurons in A Gentle Introduction to Neural Networks. When a model is generating text, each token can only look at tokens before it, because later ones have not been written yet.",
      ],
      example: {
        language: 'text',
        code: code`
          Sentence: She put the notes in her bag because it was full.

          Where "it" puts its attention (illustrative):
            bag      62%   ########################
            notes    21%   ########
            full      8%   ###
            she       4%   #
            others    5%   ##
        `,
      },
    },
    {
      heading: 'Stacking attention into a transformer',
      paragraphs: [
        "A transformer is built from repeated blocks. Each block has two steps. First, attention lets the tokens share information. Then each token's numbers pass, one token at a time, through a small neural network of ordinary layers, which processes what was just gathered.",
        "Large models stack dozens of these blocks. Each block works on the output of the one before, so understanding builds up: earlier blocks tend to handle nearby links, such as which noun an adjective describes, and later blocks combine them into larger ideas. Each block also runs several attention calculations side by side, called heads, and each head can learn a different kind of link.",
        "Attention on its own has no sense of order, so a little position information is added to every token's starting numbers. At the very end, the numbers for the last token are turned into the next-token probabilities you met in What is a Large Language Model?",
      ],
      example: {
        language: 'text',
        code: code`
          tokens -> starting numbers + position
                 -> block 1:  attention, then a small network per token
                 -> block 2:  attention, then a small network per token
                 -> ... dozens more blocks ...
                 -> last token's numbers -> next-token probabilities
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Attention worked through in numbers',
    intro: "Here is one attention step for \"it\" in the bag sentence, shrunk to three tokens and two numbers per token so you can follow every value. Picture the first number as how container-like a token is, and the second as how paper-like it is. Real models use thousands of numbers with no such tidy meanings.",
    example: {
      language: 'text',
      code: code`
        Starting numbers:   bag = [0.9, 0.1]   notes = [0.1, 0.9]   full = [0.6, 0.2]

        Match scores for "it":   bag 2.0    notes 0.75    full 0.0
        As percentages:          bag 70%    notes 20%     full 10%

        New numbers for "it" = 0.7 x [0.9, 0.1] + 0.2 x [0.1, 0.9] + 0.1 x [0.6, 0.2]
                             = [0.63 + 0.02 + 0.06,  0.07 + 0.18 + 0.02]
                             = [0.71, 0.27]
      `,
    },
    steps: [
      { code: 'bag = [0.9, 0.1]   notes = [0.1, 0.9]', explanation: "The bag is very container-like and barely paper-like. The notes are the opposite. These are the values each token offers to be blended in." },
      { code: 'Match scores: bag 2.0  notes 0.75  full 0.0', explanation: "\"It\" compares its question with each token's label. A bag matches best, because \"it was full\" fits a container. The scoring rules came from training, not from a person." },
      { code: 'As percentages: 70%  20%  10%', explanation: "A step called softmax turns any set of scores into shares that add up to 100%, giving higher scores a much larger share. Here 2.0 becomes 70%, while 0.75 only gets 20%." },
      { code: '0.7 x [0.9, 0.1] + 0.2 x [0.1, 0.9] + 0.1 x [0.6, 0.2]', explanation: "Each token's numbers are multiplied by its share, then added together. This weighted blend is the whole of what attention does." },
      { code: '= [0.71, 0.27]', explanation: "\"It\" started out meaning nothing in particular. Now its numbers are strongly container-like, much closer to the bag than to the notes. The model has, in effect, worked out what \"it\" refers to." },
      { code: 'because it was torn', explanation: "Change one word and the scores change. Torn fits paper, so trained weights would score the notes higher, and \"it\" would end up note-like instead. The same machinery handles both sentences." },
    ],
  },
  tryIt: {
    instructions: [
      'For each sentence, write which word "it" should attend to most: "The phone did not fit in the pocket because it was too small." and "The phone did not fit in the pocket because it was too big."',
      'Redo the blend from See it in action with different percentages: bag 40%, notes 50%, full 10%. Work out the new numbers for "it".',
      'Compare your result with [0.71, 0.27]. Write one sentence about which word "it" now resembles, and what kind of sentence would produce those percentages.',
    ],
    evidencePrompt: {
      label: 'Your answers',
      placeholder: 'For example: too small -> pocket, too big -> phone. With 40/50/10 I got [..., ...], which is closer to the notes, like in "it was torn".',
    },
  },
  mistakes: [
    { mistake: 'Imagining attention as the model consciously focusing, like a person.', fix: 'Attention is a weighted average of numbers. The name describes the effect, not an experience.' },
    { mistake: 'Treating attention percentages as a full explanation of an answer.', fix: 'They show one head in one block. Dozens of blocks, many heads and the small networks all shape the result, so attention alone rarely tells the whole story.' },
    { mistake: 'Assuming the model reads your prompt word by word like you do.', fix: 'A transformer processes all prompt tokens at once, each looking back at earlier tokens. Only the reply is produced one token at a time.' },
    { mistake: 'Thinking prompt length barely matters because computers are fast.', fix: 'Every token is compared with every earlier token, so the work grows much faster than the length. Keep prompts to what the task needs.' },
  ],
  quiz: [
    {
      question: 'In "The trophy did not fit in the suitcase because it was too big", which word should "it" attend to most?',
      options: [
        { text: 'suitcase', explanation: 'If the suitcase were too big, it would not explain why the trophy failed to fit. The item that is too big is the trophy.' },
        { text: 'trophy', explanation: 'Something too big fails to fit inside something else, so "it" is the trophy.' },
        { text: 'big', explanation: '"Big" helps decide the answer, but it describes "it". It is not what "it" refers to.' },
        { text: 'fit', explanation: '"It" stands for a thing, and "fit" is an action.' },
      ],
      answer: 1,
    },
    {
      question: 'Attention for "it" is bag 70%, notes 20% and full 10%. The bag\'s numbers are [1, 0], the notes\' are [0, 1] and full\'s are [0, 0]. What are the new numbers for "it"?',
      options: [
        { text: '[1, 0], because the bag has the highest share', explanation: 'Attention blends every token in proportion. It does not simply copy the winner.' },
        { text: '[0.33, 0.33], the plain average', explanation: 'That ignores the percentages. Each token counts by its share.' },
        { text: '[1, 1], the sum of all three', explanation: 'The values are multiplied by their shares before adding, not added as they are.' },
        { text: '[0.7, 0.2]', explanation: '0.7 x [1, 0] + 0.2 x [0, 1] + 0.1 x [0, 0] = [0.7, 0.2].' },
      ],
      answer: 3,
    },
    {
      question: 'Why does a transformer add position information to each token\'s starting numbers?',
      options: [
        { text: 'Attention on its own ignores order, so "dog bites man" and "man bites dog" would look the same', explanation: 'Position information lets the model tell the same words in different orders apart.' },
        { text: 'So the provider can count tokens for billing', explanation: 'Counting tokens needs no position information inside the model.' },
        { text: 'So the model can skip the earliest tokens to save time', explanation: 'Position does not remove anything. Every token is still processed.' },
        { text: 'Because the model reads one word at a time and loses its place', explanation: 'Transformers process the prompt all at once, which is exactly why order must be added.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Attention lets each token blend in information from the tokens that matter to it, and a transformer stacks many rounds of this so a model can work out what text means before predicting what comes next.',
  resources: [
    { title: 'Attention in transformers, step-by-step', provider: '3Blue1Brown', description: 'A visual explanation of queries, keys, values and attention heads.', url: 'https://www.3blue1brown.com/lessons/attention' },
    { title: 'The Illustrated Transformer', provider: 'Jay Alammar', description: 'A well-known illustrated walk through every part of a transformer.', url: 'https://jalammar.github.io/illustrated-transformer/' },
    { title: 'Attention Is All You Need', provider: 'arXiv', description: 'The 2017 research paper that introduced the transformer. Technical, but short.', url: 'https://arxiv.org/abs/1706.03762' },
  ],
  underTheHood: {
    heading: 'Why long prompts cost more than you expect',
    paragraphs: [
      "In attention, every token is scored against every token before it. A prompt of 1,000 tokens needs about half a million comparisons in each head of each block: 1,000 x 1,000, halved because each pair is only scored once. Double the prompt to 2,000 tokens and it becomes about two million. Doubling the length quadruples the attention work.",
      "This is one reason context windows have limits, and why a request with a huge document is slower and costs more than a short one. Researchers have found many ways to make attention cheaper, and context windows have grown a lot over the years, but the basic pressure remains.",
      "Generating a reply has its own shortcut. When the model adds a new token, the earlier tokens have not changed, so their labels and values are saved instead of being recomputed. This saved data is called the KV cache, for key and value, the technical names for the labels and the blended information. Each new token then only needs to compare itself with the past.",
    ],
  },
}

export default lesson
