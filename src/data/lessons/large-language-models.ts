import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe how a language model writes a reply one predicted token at a time',
    'Tell training a model apart from using it',
    'Predict how raising or lowering temperature changes a reply',
  ],
  bigIdea: "A large language model, or LLM, is a very large neural network trained to do one job: given some text, predict which token comes next. It writes a reply by predicting a token, adding it to the text and predicting again, over and over. Answering questions, summarizing and writing code are all built on that single repeated step.",
  whyItMatters: "A friend asks a chatbot for a quote from a famous scientist for their essay. It produces a perfect-sounding quote, with a name and a year. Nobody ever said it. Once you know the model is choosing likely next tokens rather than fetching recorded facts, this stops being a mystery, and you know which kinds of answers to check.",
  goalSections: [
    {
      heading: 'Predicting the next token',
      paragraphs: [
        "Give an LLM some text and it produces a probability for every token in its vocabulary: how likely each one is to come next. One token is picked and added to the end. Then the model looks at the longer text and does it all again.",
        "This loop, called generation, repeats until the model picks a special end token or reaches a length limit. Because each token is chosen after the ones before it, the model cannot go back and revise an earlier word. It can only keep going.",
        "\"Large\" refers to size: billions of weights, trained on an enormous amount of text. That scale is what lets plain next-token prediction produce answers that look like understanding. The probabilities below are made up for illustration, but real ones look like this.",
      ],
      example: {
        language: 'text',
        code: code`
          Text so far:  I studied algebra for 40

          Next-token probabilities:
            [ minutes]   82%
            [ min]        6%
            [ hours]      4%
            [ more]       3%
            ...thousands of others share the last 5%

          Picked: [ minutes]  ->  I studied algebra for 40 minutes
        `,
      },
    },
    {
      heading: 'Training a model and using it',
      paragraphs: [
        "Training happens once, before you ever see the model. Its makers run the guessing game billions of times over a huge collection of text, nudging the weights after every wrong guess, as in A Gentle Introduction to Neural Networks. It takes thousands of specialized chips running for weeks or months.",
        "That first stage, called pretraining, produces a model that continues any text it is given. Ask it a question and it might just add more questions. A second stage trains it on example conversations and on feedback from people who rate its answers. That is what turns a text continuer into an assistant that replies helpfully.",
        "Using a model is called inference. The weights are frozen, so chatting does not change them. The model remembers earlier messages in the same conversation only because the app sends them back in with every new message. Whether your chats are saved and used to train future versions depends on the provider's settings, which is worth checking.",
      ],
      example: {
        language: 'text',
        code: code`
                          Training                      Using (inference)
          Who does it     the model's makers            you, through an app
          How often       once, plus occasional updates every message
          Weights         change after every guess      stay exactly the same
          Cost            enormous                      small per request
        `,
      },
    },
    {
      heading: 'Temperature: how adventurous each pick is',
      paragraphs: [
        "Temperature is a setting that reshapes the probabilities before a token is picked. Near 0, the most likely token wins almost every time, so replies are focused and nearly identical between runs. At 1, picks follow the model's own probabilities. Above 1, unlikely tokens get a bigger share, so replies become more varied and more likely to wander.",
        "Temperature changes variety, not knowledge. Turning it down makes a model consistent, not correct: if the most likely continuation is wrong, a low temperature gives you that wrong answer every time.",
        "Chat apps usually choose the temperature for you. Developers set it when calling a model from code: low for tasks with one right answer, such as pulling a date out of an email, and higher for brainstorming. These numbers match the Temperature playground.",
      ],
      example: {
        language: 'text',
        code: code`
          Text so far: The sky is ___

                       blue  clear  gray  beautiful  bright
          Temp 0.5      95%    3%    1%      1%        0%
          Temp 1.0      70%   12%    8%      6%        4%
          Temp 2.0      44%   18%   15%     13%       10%
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Watching a reply being written',
    intro: "Here a model answers a short request, one token at a time. The probabilities are illustrative, and a real model weighs thousands of options at each step, but the loop is exactly this.",
    example: {
      language: 'text',
      code: code`
        Prompt: Suggest a name for our study group. Reply with the name only.

        Step 1   options: [The] 41%   [Study] 22%   [Brain] 14%   [Quiz] 9%    -> picks [The]
        Step 2   options: [ Study] 38%   [ Brain] 20%   [ Late] 8%           -> picks [ Study]
        Step 3   options: [ Squad] 35%   [ Buddies] 30%   [ Club] 12%        -> picks [ Squad]
        Step 4   options: [end] 90%   [!] 6%                                 -> picks [end]

        Reply: The Study Squad

        Same prompt, higher temperature:
        Step 1   picks [Quiz] (9%)  ...  Reply: Quiz Wizards
      `,
    },
    steps: [
      { code: 'Prompt: Suggest a name for our study group.', explanation: "The prompt is the starting text. Everything the model writes is a continuation of it, so the request shapes every probability that follows." },
      { code: 'Step 1 ... picks [The]', explanation: "The model scores every possible first token. \"The\" is most likely here, and at a normal temperature it is the most common pick, though not a certain one." },
      { code: 'Step 2 ... picks [ Study]', explanation: "Now the text ends in \"The\", so the options are different. Each step only depends on the prompt plus what has already been written." },
      { code: 'Step 3 ... picks [ Squad]', explanation: "\" Squad\" and \" Buddies\" are close, so different runs often split between them. Neither is more correct. Both fit the request." },
      { code: 'Step 4 ... picks [end]', explanation: "The model predicts that the reply is finished. The end token is how a model stops, rather than running until it hits the length limit." },
      { code: 'Step 1 picks [Quiz] (9%)', explanation: "With a higher temperature, a 9% option gets picked more often. One different early token sends the whole reply somewhere else, which is why a single prompt can produce very different answers." },
    ],
  },
  tryIt: {
    instructions: [
      'Open the Temperature playground. Set temperature to 0 and press "Pick 5 times". Write down the five words.',
      'Repeat at 1.0 and at 2.0. Note how the bars change and how many different words you get.',
      'In any chatbot, ask "Suggest a name for my study group" in three new chats. Then ask "What is 15 x 4?" in three new chats. Write down which question gave varied answers and which did not, and why that fits what you learned.',
    ],
    playground: 'temperature',
    evidencePrompt: {
      label: 'What you saw',
      placeholder: 'For example: At 0 I got blue five times. At 2 I got four different words. The study group names varied, but 15 x 4 was 60 every time because one answer is far more likely than any other.',
    },
  },
  mistakes: [
    { mistake: 'Thinking the model looks answers up in a database.', fix: 'A plain LLM writes the most likely continuation from its weights. Unless a tool shows its sources, check facts, quotes and numbers yourself.' },
    { mistake: 'Believing your chat teaches the model as you go.', fix: 'Corrections only last inside that conversation, because earlier messages are sent back in. The weights do not change while you chat.' },
    { mistake: 'Setting temperature to 0 to make answers correct.', fix: 'Low temperature makes answers consistent, not true. Check accuracy separately.' },
    { mistake: 'Using a high temperature for tasks with one right answer.', fix: 'Keep temperature low when you need exact, repeatable output, and save higher values for ideas and drafts.' },
  ],
  quiz: [
    {
      question: 'After "I studied algebra for 40", a model\'s top options are " minutes" 82%, " min" 6% and " hours" 4%. At temperature 0, what does it pick?',
      options: [
        { text: 'Any of the three, in proportion to its probability', explanation: 'That describes temperature 1. At 0, the top option wins.' },
        { text: '" hours", because temperature 0 favors rare tokens', explanation: 'It is the other way round. Low temperature favors the most likely token.' },
        { text: '" minutes", every time', explanation: 'At temperature 0 the most likely token is chosen on every run.' },
        { text: 'Nothing, because no option reaches 100%', explanation: 'The model always picks a token. Temperature only changes how it chooses.' },
      ],
      answer: 2,
    },
    {
      question: 'You spend an hour correcting an assistant\'s mistakes. A week later, in a new chat, it makes the same mistake. Why?',
      options: [
        { text: 'It is ignoring you on purpose', explanation: 'A model has no intentions. It computes the same probabilities from the same weights.' },
        { text: 'Its temperature was too low to remember', explanation: 'Temperature only affects how each token is picked. It has nothing to do with memory.' },
        { text: 'The provider deleted the model since then', explanation: 'The same model is running. It simply never changed.' },
        { text: 'Using a model does not change its weights, and the new chat does not include your earlier corrections', explanation: 'Corrections live in one conversation\'s text. Training is a separate process that chatting does not trigger.' },
      ],
      answer: 3,
    },
    {
      question: 'A model at temperature 0 gives the same wrong date every time you ask. What does that show?',
      options: [
        { text: 'Temperature 0 is broken on this model', explanation: 'It is working as designed: it always picks the most likely token.' },
        { text: 'The wrong date is the model\'s most likely continuation, and low temperature only makes it consistent', explanation: 'Consistency and correctness are different things. The fix is checking, or giving the model the right source.' },
        { text: 'Raising the temperature will make the date correct', explanation: 'It would only make the answer vary. The correct date might never appear.' },
        { text: 'The model is still being trained while you use it', explanation: 'Weights are frozen during use, which is why the answer is the same each time.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'An LLM writes by predicting one likely token at a time from frozen weights, and temperature only decides how adventurous each pick is, never whether the answer is true.',
  resources: [
    { title: 'Large Language Models explained briefly', provider: '3Blue1Brown', description: 'An eight-minute visual explanation of next-token prediction and training.', url: 'https://www.3blue1brown.com/lessons/mini-llm' },
    { title: 'Introduction to large language models', provider: 'Google for Developers', description: 'A short reading on what language models are and how they are trained.', url: 'https://developers.google.com/machine-learning/resources/intro-llms' },
    { title: 'LLM Course', provider: 'Hugging Face', description: 'A free course on how language models work and how to use them in code.', url: 'https://huggingface.co/learn/llm-course/chapter1/1' },
  ],
  underTheHood: {
    heading: 'The arithmetic of temperature',
    paragraphs: [
      "The Temperature playground uses the same formula as real models. Take each token's probability, raise it to the power of 1 divided by the temperature, then rescale all the results so they add up to 100% again.",
      "At temperature 0.5, the power is 2, so every probability is squared. Blue goes from 0.7 to 0.49 and clear from 0.12 to 0.0144. Before, blue was about 6 times as likely as clear. After squaring, it is about 34 times as likely, and after rescaling blue holds 95%. Squaring punishes small numbers far more than large ones.",
      "At temperature 2, the power is one half, so every probability is square-rooted. Blue becomes about 0.84 and clear about 0.35, now only 2.4 times apart. Small numbers grow relative to big ones, and the bars even out. At temperature 0 the power would be infinite, so in practice models simply pick the top token.",
    ],
  },
}

export default lesson
