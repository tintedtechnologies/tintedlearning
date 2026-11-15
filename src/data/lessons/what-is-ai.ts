import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain what AI is in one plain sentence',
    'Spot AI in apps you use and say what each one predicts',
    'Tell AI that picks from known options apart from AI that creates new content',
  ],
  bigIdea: "Artificial intelligence, or AI, is software that learns patterns from examples and uses those patterns to make a guess about something new. A spam filter guesses whether an email is junk. A chatbot guesses which words should come next in its reply.",
  whyItMatters: "Imagine your bank app freezes a card payment you made on vacation and asks you to confirm it. No person looked at that payment. An AI system compared it with your usual spending, decided it looked unusual, and paused it. Once you know that AI is making an educated guess, not checking a fact, it makes sense that it sometimes gets things wrong, and that a quick human check is still useful.",
  goalSections: [
    {
      heading: 'What AI is, in one sentence',
      paragraphs: [
        "Most software follows rules that a person wrote by hand. A calculator adds 2 and 2 the same way every time, because a programmer decided exactly what should happen for every input.",
        "AI works differently. Instead of writing every rule, a person gives the software thousands of examples, and the software finds the patterns on its own. The learned patterns are stored in something called a model. When a new case arrives, the model makes its best guess about it. That guess is called a prediction.",
        "So here is the sentence to remember: AI is software that learns patterns from examples and uses them to make predictions about new cases.",
      ],
      example: {
        language: 'text',
        code: code`
          Ordinary software: a person writes the rule
            if the subject contains "free money": move to Junk

          AI: the software learns the pattern
            10,000 emails, each marked "spam" or "not spam" by people
            -> the model learns which patterns usually mean spam
            -> a new email arrives: 94% likely to be spam
        `,
      },
    },
    {
      heading: 'Spotting AI in everyday apps',
      paragraphs: [
        "You have probably used AI several times today without noticing. To spot it, ask two questions about an app: what goes in, and what does the app guess?",
        "Your phone keyboard takes in the words you have typed and guesses the next word. A map app takes in live traffic and guesses when you will arrive. A streaming service takes in what you have watched and guesses what you will enjoy next.",
        "A useful clue: if an app gives different people different answers, or gets better as it sees more data, a model is probably behind it. If it gives the same answer to everyone, every time, it is probably ordinary software.",
      ],
      example: {
        language: 'text',
        code: code`
          App         What goes in                What it predicts
          Keyboard    the words typed so far      the next word
          Maps        traffic and your route      your arrival time
          Email       the text of a message       spam or not spam
          Photos      the pixels in each picture  which faces belong to the same person
        `,
      },
    },
    {
      heading: 'AI that picks and AI that creates',
      paragraphs: [
        "AI is a big family, not one single program. A helpful way to sort it is by what kind of answer it gives.",
        "Some AI picks from options you could list in advance. It chooses a label, like spam or not spam, or it estimates a number, like the price of a house. This is often called predictive AI.",
        "Other AI creates something new, such as a paragraph, a picture or a piece of code. This is called generative AI, and chatbots belong here. Inside, it still makes predictions, one small piece of text or image at a time, but the finished result did not exist before.",
        "Both kinds make mistakes. Generative AI has one extra risk: it can write a fluent, confident answer that is simply wrong, so the polish of an answer tells you nothing about whether it is true.",
      ],
      example: {
        language: 'text',
        code: code`
          Picks from options:  "Is this product review positive or negative?"
                               -> negative

          Creates new content: "Write a polite reply to this review."
                               -> "Thank you for telling us. We're sorry the
                                   order arrived late..."
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'One email, followed through a spam filter',
    intro: "Here is what happens in the second between an email reaching your inbox and landing in Junk. Each line below is one step.",
    example: {
      language: 'text',
      code: code`
        1. Email arrives: "You WON a free cruise! Click now to claim."
        2. The model notices patterns: "WON", "free", "click now", unknown sender
        3. It compares them with patterns learned from millions of past emails
        4. Prediction: 97% likely to be spam
        5. App rule: anything above 90% goes to the Junk folder
        6. You open Junk and click "Not spam"
      `,
    },
    steps: [
      { code: '1. Email arrives', explanation: "This is the input, the new case the model has never seen before. It could be any email from anyone." },
      { code: '2. The model notices patterns', explanation: "The model does not read the email the way you do. It picks out clues it has learned to pay attention to, such as certain words, shouting in capitals and who sent it." },
      { code: '3. It compares them with past emails', explanation: "During training, the model saw millions of emails that people had already marked. That is where its sense of spam came from. Nobody wrote a list of spam words by hand." },
      { code: '4. Prediction: 97% likely to be spam', explanation: "The answer is a likelihood, not a certainty. A 97% guess still means about 3 in every 100 similar emails are real." },
      { code: '5. App rule: anything above 90% goes to Junk', explanation: "A person chose that 90% cut-off. The model only guesses. People decide what the app does with each guess." },
      { code: '6. You click "Not spam"', explanation: "Your correction becomes a new example. Many filters use corrections like this to learn and improve over time." },
    ],
  },
  tryIt: {
    instructions: [
      'Pick one app on your phone that you think uses AI.',
      'Write down what goes into it and what it predicts.',
      'Write one way you could tell whether its predictions are good, such as how often you accept its suggestion.',
    ],
    evidencePrompt: {
      label: 'Your example',
      placeholder: 'For example: My music app takes in my listening history, predicts which songs I will enjoy, and I can tell it works when I save the songs it suggests.',
    },
  },
  mistakes: [
    { mistake: 'Thinking AI understands things the way a person does.', fix: 'Remember that it matches patterns it learned from examples. Treat what it says as a guess and double-check anything important.' },
    { mistake: 'Calling every piece of software AI.', fix: 'Ask whether it learned from examples. A calculator, or a fixed rule like "block emails from this address", is ordinary software.' },
    { mistake: 'Trusting an answer because it sounds confident.', fix: 'Judge an answer by whether you can check it, not by how fluent it sounds. Generative AI can be wrong in perfect sentences.' },
  ],
  quiz: [
    {
      question: 'Which of these is most likely using AI?',
      options: [
        { text: 'A music app suggesting a song you may like', explanation: 'It learned from your listening and from millions of other listeners to guess what you will enjoy. Different people get different suggestions.' },
        { text: 'An alarm clock app that rings at 7:00 every weekday', explanation: 'This follows a fixed rule you set. It does not learn or guess anything.' },
        { text: 'A spreadsheet that adds up a column of numbers', explanation: 'Adding is an exact rule written by a programmer. Everyone gets the same total for the same numbers.' },
        { text: 'A website that shows today\'s date', explanation: 'The date comes from a clock, not from a pattern learned from examples.' },
      ],
      answer: 0,
    },
    {
      question: 'A photo app groups all the pictures of your sister together, even though nobody told it her name. What is it doing?',
      options: [
        { text: 'Following a rule a programmer wrote for her face', explanation: 'No programmer could write a rule by hand for every face on every phone. That is why AI is used here.' },
        { text: 'Looking her up in a database of everyone\'s faces', explanation: 'The app does not know who she is. It only notices that some faces look alike.' },
        { text: 'Using patterns learned from many faces to guess which photos show the same person', explanation: 'The model learned what makes faces similar from many examples, then groups photos it predicts show the same person.' },
        { text: 'Reading the file names of the photos', explanation: 'Phone photo names are usually numbers like IMG_2041. They say nothing about who is in the picture.' },
      ],
      answer: 2,
    },
    {
      question: 'Which task is an example of AI creating new content, rather than picking from known options?',
      options: [
        { text: 'Deciding whether a card payment looks like fraud', explanation: 'This picks between two known answers: fraud or not fraud.' },
        { text: 'Writing a short birthday poem for your friend', explanation: 'The poem did not exist before. Making new text like this is what generative AI does.' },
        { text: 'Estimating how long your bus ride will take', explanation: 'This predicts a single number. It is predictive AI, even though the number changes each day.' },
        { text: 'Sorting support emails into "billing" or "technical"', explanation: 'This chooses a label from a fixed list, so it is predictive AI.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'AI is software that learns from examples to make a best guess about new cases, so treat what it tells you as a prediction worth checking.',
  resources: [
    { title: 'Elements of AI', provider: 'University of Helsinki', description: 'A free beginner course on what AI is and what it can and cannot do.', url: 'https://www.elementsofai.com/' },
    { title: 'Introduction to machine learning', provider: 'Google for Developers', description: 'A short overview of how models learn from examples.', url: 'https://developers.google.com/machine-learning/intro-to-ml' },
  ],
  underTheHood: {
    heading: 'What a prediction looks like inside',
    paragraphs: [
      "Inside a spam filter, the model does not output the word spam. It outputs a number between 0 and 1, such as 0.97. You can read that as the model's confidence that the email is spam.",
      "The app then compares the number with a cut-off called a threshold. If the threshold is 0.9, anything above it goes to Junk. Choosing the threshold is a human decision, and it is a trade. Lower it to 0.5 and more spam gets caught, but more real emails get hidden too. Raise it to 0.99 and fewer real emails get hidden, but more spam slips into your inbox.",
      "No threshold is perfect, because the model's scores overlap: some real emails look spammy and some spam looks innocent. Picking a threshold means deciding which mistake is cheaper for the people using the app.",
    ],
  },
}

export default lesson
