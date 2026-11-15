import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Compare large and small models on quality, speed and cost',
    'Choose between a hosted model and one you run yourself, and between open and closed models',
    'Pick a model for a task by testing it on real examples',
  ],
  bigIdea: "There is no single best AI model. Models differ in size, in where they run and in whether you can download them, and each choice trades quality against speed, cost and privacy. Choosing well means matching the model to the job, then testing it on real examples of that job.",
  whyItMatters: "Later in this section, Study Tracker gains an assistant that turns \"I studied algebra for 40 minutes\" into a saved session. The largest model available would do this well, but it could cost many times more and reply more slowly than a small model that also gets it right. And a small model that gets one date in ten wrong would quietly fill your database with bad records. Choosing on purpose saves money and protects your data.",
  goalSections: [
    {
      heading: 'Large and small models',
      paragraphs: [
        "A model's size is its number of parameters, the weights you met in A Gentle Introduction to Neural Networks. Larger models generally know more, follow complicated instructions better and handle multi-step problems better. They are also slower, cost more per token and need powerful hardware.",
        "Smaller models are fast and cheap, and the smallest can run on a laptop or phone. They do well on narrow, clearly defined jobs such as sorting text into categories, pulling details out of a sentence or a short rewrite. They struggle more with long reasoning and know fewer facts.",
        "Providers usually offer a family of models in a few tiers, from large and capable to small and fast. Model names change often, but the tiers stay. Some models also offer a reasoning mode, where they spend extra tokens working through a problem before answering. It helps on hard problems and adds time and cost.",
      ],
      example: {
        language: 'text',
        code: code`
          Task                                              Usually enough
          Label a review as positive or negative            small
          Pull subject, minutes and date out of a sentence  small or medium
          Summarize a long chapter accurately               medium
          Plan a week of study around many constraints      large
          Explain why a tricky proof works                  large, possibly with reasoning
        `,
      },
    },
    {
      heading: 'Hosted or local, open or closed',
      paragraphs: [
        "A hosted model runs on a provider's computers. Your code sends a request over the internet with a secret key and gets a reply. There is nothing to install and you can use very large models, but you usually pay per token after any free allowance, and your text leaves your computer, so read the provider's data policy.",
        "A local model runs on your own machine through a tool such as Ollama. Once downloaded it is free to run, works offline and keeps your data at home. Your hardware sets the limit: a typical laptop runs small models comfortably and struggles with large ones.",
        "Open-weight models publish their weights, so anyone can download and run them, subject to their license. Closed models are only available through their maker's service. Many of the most capable models are closed, but open models have become strong, and they are what you run locally. Study Tracker's AI code will work with either kind, through one helper you can switch.",
      ],
      example: {
        language: 'text',
        code: code`
                        Hosted                       Local
          Setup         an account and a secret key  install a tool, download a model
          Cost          per token, often a free tier free after download
          Model size    up to the very largest       limited by your computer
          Your data     sent to the provider         stays on your machine
          Offline       no                           yes
        `,
      },
    },
    {
      heading: 'Choosing with a small test',
      paragraphs: [
        "Start by writing down what the task needs: how accurate it must be, how fast, roughly how many requests a day, and whether the data is private. Those answers rule out options before you try anything.",
        "Then collect 10 to 20 real examples with the answer you expect for each. This is a test set, and the lesson Evaluating AI Responses goes further with it. Run the cheapest suitable model on every example and count the correct answers. If it falls short, try the next tier up. Stop at the smallest model that meets your bar.",
        "Keep the test set. Providers update and retire models regularly, and when that happens you can rerun the same examples on a replacement in minutes, instead of hoping it behaves the same.",
      ],
      example: {
        language: 'text',
        code: code`
          Task: turn a sentence into a Study Tracker session
          Needs: correct minutes and date every time, fast, low cost,
                 sessions are not sensitive
          Plan:  test a small local model, then a medium hosted one,
                 pick the smallest that gets all test examples right
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Choosing a model for Study Tracker\'s session parser',
    intro: "Here is the test from the last section, run on two models. The results are illustrative of what learners typically see. Your own models and numbers will differ, which is exactly why you run the test yourself.",
    example: {
      language: 'text',
      code: code`
        Test sentence                                   Expected                Small local  Medium hosted
        1. I studied algebra for 40 minutes today       algebra, 40, today      correct      correct
        2. Did an hour and a half of biology yesterday  biology, 90, yesterday  60 minutes   correct
        3. python 25 min                                python, 25, today       correct      correct
        4. Revised chemistry from 7 to 7:45 pm          chemistry, 45, today    correct      correct
        5. Spent 2 hours on history last Monday         history, 120, last Mon  correct      correct

        Score                                                                   4 of 5       5 of 5

        Decision: medium hosted for now, then retest with 15 more sentences
      `,
    },
    steps: [
      { code: 'Expected', explanation: "Every example has its correct answer written down before any model sees it. Without that column, you would just be judging whether replies look reasonable." },
      { code: '3. python 25 min', explanation: "Real users type short, messy notes. Including them tests the job you actually have, not an idealized version of it." },
      { code: '2. ... 60 minutes', explanation: "The small model turned \"an hour and a half\" into 60. That is a believable slip, and it would silently save the wrong number." },
      { code: 'Score: 4 of 5 vs 5 of 5', explanation: "The bar was every example correct, so the small model fails it, even though 80% sounds good. The bar comes from the task, not from the model." },
      { code: 'Medium hosted: 5 of 5', explanation: "The medium model passes. There is no need to test the largest tier, which would cost more for no gain on this job." },
      { code: 'Decision: medium hosted for now', explanation: "Five sentences is a small test, so the choice is provisional until more tricky examples pass too. If you would rather keep the free local option, you could also let the app ask the user to confirm the minutes before saving, which catches the slip." },
    ],
  },
  tryIt: {
    instructions: [
      'Write 5 study sentences of your own with the expected subject, minutes and date for each, including at least one tricky one like "an hour and a half".',
      'Many chat apps let you choose between a faster model and a more capable one. Paste the same instruction and sentences into both: "For each sentence, give subject, minutes and date."',
      'Score each model against your expected answers. Write which you would choose for Study Tracker and why. Optional: install Ollama, run any small model from its library and add it to the comparison.',
    ],
    evidencePrompt: {
      label: 'Your comparison',
      placeholder: 'For example: The fast model scored 4 of 5 and missed "half an hour". The capable model scored 5 of 5. I would pick ... because ...',
    },
  },
  mistakes: [
    { mistake: 'Always picking the biggest model available.', fix: 'Start with the smallest model that might work and move up only when your test shows it falls short.' },
    { mistake: 'Choosing from a ranking table or someone else\'s opinion.', fix: 'Rankings measure general skills. Test the candidates on your own examples, because your task is what matters.' },
    { mistake: 'Sending private data to a hosted model without checking its policy.', fix: 'Read how the provider stores and uses your data, or use a local model for sensitive text.' },
    { mistake: 'Writing a model\'s name in many places in your code.', fix: 'Keep it in one setting, so switching models when one is retired is a one-line change followed by rerunning your test set.' },
  ],
  quiz: [
    {
      question: 'You need to sort 50,000 emails a day into 4 categories. On your test set, a small model and a large model both get 98% right. Which should you choose?',
      options: [
        { text: 'The large model, because larger models are always better', explanation: 'Your own test shows no gain on this task, so the extra cost buys nothing.' },
        { text: 'The small model, because it matches the quality at lower cost and higher speed', explanation: 'At equal quality, the cheaper and faster model wins, and at 50,000 emails a day the savings add up.' },
        { text: 'The large model, because cost does not matter for only 4 categories', explanation: 'Cost depends on volume and tokens, not the number of categories.' },
        { text: 'Run both on every email and average the answers', explanation: 'That doubles the cost, and you cannot average two category labels.' },
      ],
      answer: 1,
    },
    {
      question: 'A clinic wants AI to summarize patient notes, and the notes must never leave its own computers. Which option fits?',
      options: [
        { text: 'The most capable hosted model', explanation: 'A hosted model runs on the provider\'s computers, so the notes would leave the clinic.' },
        { text: 'A closed model through its maker\'s chat app', explanation: 'Closed models are only available through the maker\'s service, which means sending the data out.' },
        { text: 'Any hosted model with a free tier', explanation: 'Free or paid, the text is still sent to the provider.' },
        { text: 'An open-weight model running on the clinic\'s own computers', explanation: 'Open weights can be downloaded and run locally, so the notes never leave.' },
      ],
      answer: 3,
    },
    {
      question: 'Your provider announces that the model your app uses will be retired next month. What makes switching easiest?',
      options: [
        { text: 'Having the model name in one setting and a test set you can rerun on the replacement', explanation: 'You change one line, rerun the examples, and know whether the new model meets your bar.' },
        { text: 'Choosing the replacement with the most similar name', explanation: 'A similar name does not mean similar behavior on your task.' },
        { text: 'Switching to the largest replacement so nothing gets worse', explanation: 'It may cost far more and could still behave differently. Only a test tells you.' },
        { text: 'Keeping the old model running by never updating the app', explanation: 'A retired hosted model stops responding, whatever your app does.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Pick the smallest model, hosted or local, that passes a test on real examples of your task, and keep that test so you can switch models with confidence.',
  resources: [
    { title: 'Ollama', provider: 'Ollama', description: 'A free tool for downloading and running open-weight models on your own computer.', url: 'https://ollama.com/' },
    { title: 'Models', provider: 'Hugging Face', description: 'A searchable catalog of open-weight models with their sizes and licenses.', url: 'https://huggingface.co/models' },
    { title: 'Quantization overview', provider: 'Hugging Face', description: 'How models are shrunk to use less memory, and what it costs in quality.', url: 'https://huggingface.co/docs/transformers/main/en/quantization/overview' },
  ],
  underTheHood: {
    heading: 'Why size decides where a model can run',
    paragraphs: [
      "To run a model, every weight must sit in memory. Each weight is a number, and a common format stores it in 16 bits, which is 2 bytes. So a model with 7 billion parameters needs about 7 billion x 2 bytes, roughly 14 GB, just to hold its weights. Many laptops have 8 or 16 GB of memory in total, shared with everything else.",
      "The usual trick is quantization: storing each weight with fewer bits, such as 4 bits, half a byte. The same 7-billion-parameter model then needs about 3.5 GB. Some precision is lost, and quality drops slightly, but often less than you would expect. That is why local tools usually offer quantized versions of each model.",
      "The weights are not the only cost. The model also needs working memory for the context, and it grows with the length of the conversation. A model that loads fine can still run out of memory on a long document, which is worth remembering when you choose a model for your machine.",
    ],
  },
}

export default lesson
