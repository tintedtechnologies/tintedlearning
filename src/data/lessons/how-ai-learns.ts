import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe how a model learns by guessing, checking and adjusting',
    'Tell the difference between training a model and using it',
    'Predict how poor or one-sided examples change what a model learns',
  ],
  bigIdea: "A model learns by making a guess, checking how wrong it was against a known answer, and nudging itself to be a little less wrong next time. It repeats this over thousands of examples until its guesses are good. After that, it is frozen and used to make guesses on new cases.",
  whyItMatters: "Suppose a hospital buys a tool that flags skin spots that may need a doctor's attention. If almost every photo it learned from showed light skin, it will be worse at spotting problems on dark skin, even though nobody programmed it to be. Knowing how a model learns lets you ask the question that would have caught this early: what examples did it learn from?",
  goalSections: [
    {
      heading: 'Guess, check, adjust',
      paragraphs: [
        "Learning starts with examples where the right answer is already known. Each example has an input, such as a photo, and an answer, such as cat or dog. The known answer is called a label.",
        "At first the model's guesses are close to random. For each example, it guesses, compares its guess with the label, and measures how far off it was. That gap is called the error. The model then adjusts its internal settings slightly so that, next time, the error on that kind of example will be smaller.",
        "One adjustment barely changes anything. Thousands of small adjustments, over thousands of examples, add up to a model that guesses well. This whole process is called training.",
      ],
      example: {
        language: 'text',
        code: code`
          Example:  a 5 km delivery took 20 minutes   (the label)
          Guess:    model says 10 minutes
          Error:    20 - 10 = 10 minutes too low
          Adjust:   raise the estimate a little for each km
          Next time a 5 km delivery appears, the guess will be closer to 20
        `,
      },
    },
    {
      heading: 'Training first, then using',
      paragraphs: [
        "Training and using a model are two separate stages. Training happens once, or every so often, usually on powerful computers, with a large pile of labeled examples. Using the model happens every time someone needs an answer, often millions of times a day. Using a trained model is called inference.",
        "During inference the model is not learning. When you ask a delivery app for an arrival time, your trip does not change the model on the spot. The app simply runs your trip through the settings it learned earlier.",
        "This explains a common surprise: a model can be out of date. If it was trained last year, it knows nothing about the new road that opened last month until someone trains it again with newer examples.",
      ],
      example: {
        language: 'text',
        code: code`
          Training  (done in advance)          Inference  (every request)
          ---------------------------          --------------------------
          50,000 past deliveries with times    one new order: 3 km, rainy
          guess, check, adjust, repeat         run it through the model
          result: a trained model              result: "about 14 minutes"
          slow, happens now and then           fast, happens all day
        `,
      },
    },
    {
      heading: 'Examples shape everything it learns',
      paragraphs: [
        "A model can only learn patterns that appear in its examples. If the examples are wrong, missing or lopsided, the model learns that too, faithfully and without complaint.",
        "Three problems come up again and again. Wrong labels teach wrong answers: if some spam is marked as safe, the filter learns to let that kind through. Missing situations leave gaps: a delivery model trained only on sunny days has no idea what rain does. One-sided examples create bias: a model trained mostly on one group of people works best for that group.",
        "So when a model behaves strangely, a good first question is not \"what is wrong with the model?\" but \"what was in its examples?\"",
      ],
      example: {
        language: 'text',
        code: code`
          Training photos of cats:   9,500 indoor photos, 500 outdoor photos
          Training photos of dogs:   1,000 indoor photos, 9,000 outdoor photos

          What the model may really learn: "grass in the picture means dog"
          Result: a cat sitting on a lawn gets labeled "dog"
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A model learning delivery times, one example at a time',
    intro: "This model has one setting: minutes per kilometer. It starts with a poor guess of 2 minutes per km and learns from three past deliveries. Each round, it moves its setting halfway toward what that example suggests.",
    example: {
      language: 'text',
      code: code`
        Start:     setting = 2 minutes per km

        Example 1: 5 km took 20 min  -> suggests 4 per km
                   guess 5 x 2 = 10, error 10 too low
                   move halfway: setting = 3
        Example 2: 2 km took 8 min   -> suggests 4 per km
                   guess 2 x 3 = 6, error 2 too low
                   move halfway: setting = 3.5
        Example 3: 10 km took 40 min -> suggests 4 per km
                   guess 10 x 3.5 = 35, error 5 too low
                   move halfway: setting = 3.75

        New order: 6 km  -> prediction 6 x 3.75 = 22.5 minutes
      `,
    },
    steps: [
      { code: 'Start: setting = 2 minutes per km', explanation: "Before training, the setting is a rough starting value. Real models start with random settings, often millions of them." },
      { code: 'guess 5 x 2 = 10, error 10 too low', explanation: "The model guesses using its current setting, then compares the guess with the real time. It was 10 minutes too low." },
      { code: 'move halfway: setting = 3', explanation: "The model nudges its setting in the direction that reduces the error. Moving only part of the way stops one unusual example from throwing everything off." },
      { code: 'setting = 3.5, then 3.75', explanation: "Each new example pulls the setting closer to the true pattern of 4 minutes per km. The errors in minutes are 10, then 2, then 5, but the 5 comes from a longer trip, so the setting still moves closer to 4 each round." },
      { code: 'New order: 6 km -> 22.5 minutes', explanation: "Training is over and inference begins. The model uses its learned setting on a trip it has never seen. With more examples, it would get even closer to 24 minutes." },
    ],
  },
  mistakes: [
    { mistake: 'Believing a model keeps learning from every conversation or request.', fix: 'Assume a model is frozen after training unless its makers say otherwise. It only changes when it is trained again.' },
    { mistake: 'Blaming the model and ignoring the examples it learned from.', fix: 'When results look odd, ask what situations and groups were in the training examples, and which were missing.' },
    { mistake: 'Thinking more examples always fix a problem.', fix: 'More of the same lopsided examples repeat the same bias. Add the kinds of cases the model is getting wrong.' },
  ],
  quiz: [
    {
      question: 'A model guesses a 3 km delivery will take 9 minutes. It actually took 12. What happens next during training?',
      options: [
        { text: 'The model nudges its settings so its next guess for trips like this is a little higher', explanation: 'It was too low by 3 minutes, so it adjusts slightly in the direction that shrinks that error.' },
        { text: 'The model replaces its settings so this trip would be guessed exactly', explanation: 'Jumping all the way to fit one example would let a single unusual trip ruin what it learned from all the others.' },
        { text: 'Nothing, because a 3 minute error is small enough to ignore', explanation: 'Small errors are exactly what training learns from. Many small corrections add up.' },
        { text: 'A programmer edits the rule for 3 km trips by hand', explanation: 'In machine learning nobody writes the rule by hand. The model adjusts itself from the error.' },
      ],
      answer: 0,
    },
    {
      question: 'A travel chatbot was trained in January. In June you ask about a train line that opened in April. Why might it not know about it?',
      options: [
        { text: 'It learns from your question, but needs a few more people to ask first', explanation: 'During inference the model is not learning, so more questions do not teach it anything.' },
        { text: 'It only knows patterns from its training examples, which were collected before April', explanation: 'A trained model is fixed. New facts only reach it when it is trained again, or when the app looks up fresh information for it.' },
        { text: 'Chatbots are not allowed to talk about transport', explanation: 'There is no such rule. The issue is the date of the examples it learned from.' },
        { text: 'The question was too short for it to understand', explanation: 'Short questions are fine. The model simply never saw anything about the new line.' },
      ],
      answer: 1,
    },
    {
      question: 'A voice assistant was trained mostly on recordings of adults. What is the most likely result?',
      options: [
        { text: 'It works equally well for everyone, since speech is speech', explanation: 'Voices differ a lot. Patterns it never saw are patterns it never learned.' },
        { text: 'It refuses to answer anyone under 18', explanation: 'It has no idea how old the speaker is. It just hears audio it may not recognize well.' },
        { text: 'It works better for children, since their speech is simpler', explanation: 'Simpler sentences do not help if the sound of the voice is unlike anything in training.' },
        { text: 'It makes more mistakes understanding children', explanation: 'Children\'s voices were rare in its examples, so it learned their patterns poorly.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'A model learns by repeatedly guessing, measuring its error on labeled examples and adjusting, so what it can do depends entirely on the examples it was trained on.',
  resources: [
    { title: 'Introduction to machine learning', provider: 'Google for Developers', description: 'How models learn from labeled examples, explained for newcomers.', url: 'https://developers.google.com/machine-learning/intro-to-ml' },
    { title: 'Machine learning crash course', provider: 'Google for Developers', description: 'A longer free course with exercises on training and loss.', url: 'https://developers.google.com/machine-learning/crash-course' },
  ],
  underTheHood: {
    heading: 'Learning the pattern versus memorizing the examples',
    paragraphs: [
      "The goal of training is not to get the training examples right. It is to do well on new cases. Doing well on new cases is called generalization.",
      "A model with a lot of settings can cheat. Instead of learning that deliveries take about 4 minutes per km, it can memorize every past trip exactly, including the odd one where the driver got stuck behind a parade. It then scores perfectly on the examples it has seen and badly on new ones. This is called overfitting.",
      "To catch it, people hide some labeled examples from the model during training and test on those afterwards. If the model is great on the training examples but much worse on the hidden ones, it memorized instead of learning. The fixes include more varied examples, a simpler model, or stopping training earlier.",
    ],
  },
}

export default lesson
